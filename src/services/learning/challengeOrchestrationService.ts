import type { BloomBand, PhaseCode } from './knowledgeBaseService';

export type ChallengeActType = 'Q' | 'V' | 'D';

export interface ChallengeActivityCandidate {
  id: string;
  chapter: number;
  bloom: BloomBand;
  kind: ChallengeActType;
  diffScore?: number;
}

interface PhaseConfig {
  stageFrom: number;
  stageTo: number;
  diffMin: number;
  diffMax: number;
  bloomDistribution: Partial<Record<BloomBand, number>>;
}

const PHASE_CONFIG: Record<PhaseCode, PhaseConfig> = {
  P1: { stageFrom: 1, stageTo: 20, diffMin: 0.0, diffMax: 0.2, bloomDistribution: { R: 0.7, U: 0.3 } },
  P2: { stageFrom: 21, stageTo: 40, diffMin: 0.2, diffMax: 0.4, bloomDistribution: { R: 0.4, U: 0.4, AP: 0.2 } },
  P3: { stageFrom: 41, stageTo: 60, diffMin: 0.4, diffMax: 0.6, bloomDistribution: { U: 0.5, AP: 0.5 } },
  P4: { stageFrom: 61, stageTo: 80, diffMin: 0.6, diffMax: 0.8, bloomDistribution: { AP: 0.6, AN: 0.4 } },
  P5: { stageFrom: 81, stageTo: 90, diffMin: 0.8, diffMax: 0.9, bloomDistribution: { AP: 0.4, AN: 0.6 } },
  P6: { stageFrom: 91, stageTo: 100, diffMin: 0.9, diffMax: 1.0, bloomDistribution: { AP: 0.2, AN: 0.8 } },
};

export function identifyPhase(stage: number): PhaseCode {
  const found = (Object.keys(PHASE_CONFIG) as PhaseCode[]).find((phase) => {
    const cfg = PHASE_CONFIG[phase];
    return stage >= cfg.stageFrom && stage <= cfg.stageTo;
  });
  return found ?? 'P6';
}

export function calculateDynamicDifficulty(successCount: number, playCount: number): number {
  if (playCount <= 0) return 0.5;
  return Number((1 - successCount / playCount).toFixed(4));
}

export function selectChallengeActivities(params: {
  stage: number;
  actType: ChallengeActType;
  chapter: number;
  candidates: ChallengeActivityCandidate[];
  usedIds: string[];
}): ChallengeActivityCandidate[] {
  const phase = identifyPhase(params.stage);
  const config = PHASE_CONFIG[phase];
  const usedSet = new Set(params.usedIds);

  const scoped = params.candidates.filter((c) => c.chapter === params.chapter && c.kind === params.actType && !usedSet.has(c.id));

  if (params.actType === 'Q') {
    const targetBloom = Object.keys(config.bloomDistribution) as BloomBand[];
    const selected: ChallengeActivityCandidate[] = [];
    for (const bloom of targetBloom) {
      const candidate = scoped.find((item) => item.bloom === bloom);
      if (candidate) selected.push(candidate);
    }
    return selected.length > 0 ? selected : scoped.slice(0, 1);
  }

  const practical = scoped.filter((c) => {
    const diff = c.diffScore ?? 0.5;
    return diff >= config.diffMin && diff <= config.diffMax;
  });

  if (practical.length > 0) return [practical[0]];
  return scoped.length > 0 ? [scoped[0]] : [];
}

export interface EscalationContext {
  lifeMax: number;
  totalStages?: number;
}

export interface StageExecutionResult {
  correctness: number;
}

export interface EscalationResult {
  finalStage: number;
  isAlive: boolean;
  usedActivityIds: string[];
}

export function runChallengeEscalation(params: {
  context: EscalationContext;
  getActType: (stage: number) => ChallengeActType;
  selectActs: (stage: number, actType: ChallengeActType, usedIds: string[]) => ChallengeActivityCandidate[];
  executeActs: (stage: number, acts: ChallengeActivityCandidate[]) => StageExecutionResult;
}): EscalationResult {
  const totalStages = params.context.totalStages ?? 100;
  let life = params.context.lifeMax;
  let stage = 1;
  const used: string[] = [];

  while (stage <= totalStages && life > 0) {
    const actType = params.getActType(stage);
    const acts = params.selectActs(stage, actType, used);
    acts.forEach((a) => used.push(a.id));

    const result = params.executeActs(stage, acts);
    if (result.correctness < 0.5) {
      life -= 1;
      continue;
    }

    stage += 1;
  }

  return {
    finalStage: stage,
    isAlive: life > 0,
    usedActivityIds: used,
  };
}
