export type ChapterCode = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
export type BloomBand = 'R' | 'U' | 'AP' | 'AN';
export type PhaseCode = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
export type ActivityKind = 'Q' | 'V' | 'D';

export interface KnowledgeActivity {
  id: string;
  chapter: ChapterCode;
  conceptId: string;
  bloom: BloomBand;
  phase: PhaseCode;
  kind: ActivityKind;
}

export interface KnowledgeBaseModel {
  chapters: ChapterCode[];
  conceptsByChapter: Record<ChapterCode, string[]>;
  bloomBands: BloomBand[];
  phases: PhaseCode[];
  activities: KnowledgeActivity[];
  outcomes: Record<ChapterCode, string[]>;
  prerequisites: Record<string, string[]>;
}

const BLOOM_WEIGHT: Record<BloomBand, number> = {
  R: 1,
  U: 2,
  AP: 3,
  AN: 4,
};

const PHASE_WEIGHT: Record<PhaseCode, number> = {
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
  P5: 5,
  P6: 6,
};

export function computeActivityUtility(activity: Pick<KnowledgeActivity, 'bloom' | 'phase'>): number {
  return BLOOM_WEIGHT[activity.bloom] * PHASE_WEIGHT[activity.phase];
}

export function calculateCorrectness(correctActivities: KnowledgeActivity[], totalActivities: KnowledgeActivity[]): number {
  if (totalActivities.length === 0) return 0;
  const totalUtility = totalActivities.reduce((sum, act) => sum + computeActivityUtility(act), 0);
  if (totalUtility === 0) return 0;
  const correctUtility = correctActivities.reduce((sum, act) => sum + computeActivityUtility(act), 0);
  return Number((correctUtility / totalUtility).toFixed(4));
}

export function hasPrerequisiteCycle(prerequisites: Record<string, string[]>): boolean {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const dfs = (node: string): boolean => {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;

    visiting.add(node);
    for (const pre of prerequisites[node] ?? []) {
      if (dfs(pre)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  };

  return Object.keys(prerequisites).some((node) => dfs(node));
}

export interface UnlockEvaluationResult {
  unlockedList: string[];
  isGoalAchieved: boolean;
  deficiencyList: string[];
}

export function evaluateUnlockState(
  concepts: string[],
  prerequisites: Record<string, string[]>,
  correctnessMap: Record<string, number>,
  threshold = 0.5,
): UnlockEvaluationResult {
  const unlockedList: string[] = [];
  const deficiency = new Set<string>();

  for (const concept of concepts) {
    const preList = prerequisites[concept] ?? [];
    if (preList.length === 0) {
      unlockedList.push(concept);
      continue;
    }

    const allPrerequisitesMet = preList.every((pre) => (correctnessMap[pre] ?? 0) >= threshold);
    if (allPrerequisitesMet) {
      unlockedList.push(concept);
    } else {
      preList.forEach((pre) => {
        if ((correctnessMap[pre] ?? 0) < threshold) deficiency.add(pre);
      });
    }
  }

  const isGoalAchieved = concepts.every((concept) => (correctnessMap[concept] ?? 0) >= threshold);
  return {
    unlockedList,
    isGoalAchieved,
    deficiencyList: [...deficiency],
  };
}
