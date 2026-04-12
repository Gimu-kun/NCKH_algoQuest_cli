import { describe, expect, it } from 'vitest';
import {
  calculateCorrectness,
  computeActivityUtility,
  evaluateUnlockState,
  hasPrerequisiteCycle,
  type KnowledgeActivity,
} from '../knowledgeBaseService';
import {
  calculateDynamicDifficulty,
  identifyPhase,
  runChallengeEscalation,
  selectChallengeActivities,
} from '../challengeOrchestrationService';
import {
  calculateActivityScore,
  evaluateMultiplayerUtility,
  scoreAndReward,
} from '../scoringAndRewardService';

describe('research mapping - knowledge base', () => {
  it('computes utility and correctness ratio from Bloom/phase weights', () => {
    const total: KnowledgeActivity[] = [
      { id: 'a1', chapter: 'C1', conceptId: 'k1', bloom: 'R', phase: 'P1', kind: 'Q' },
      { id: 'a2', chapter: 'C1', conceptId: 'k2', bloom: 'AP', phase: 'P3', kind: 'Q' },
    ];
    const correct = [total[1]];

    expect(computeActivityUtility(total[0])).toBe(1);
    expect(computeActivityUtility(total[1])).toBe(9);
    expect(calculateCorrectness(correct, total)).toBe(0.9);
  });

  it('evaluates unlock list and deficiency with prerequisite threshold', () => {
    const concepts = ['k1', 'k2', 'k3'];
    const prerequisites = {
      k1: [],
      k2: ['k1'],
      k3: ['k2'],
    };
    const correctnessMap = {
      k1: 0.8,
      k2: 0.4,
      k3: 0.1,
    };

    const result = evaluateUnlockState(concepts, prerequisites, correctnessMap, 0.5);
    expect(result.unlockedList).toContain('k1');
    expect(result.unlockedList).toContain('k2');
    expect(result.unlockedList).not.toContain('k3');
    expect(result.deficiencyList).toContain('k2');
    expect(result.isGoalAchieved).toBe(false);
  });

  it('detects cycles in prerequisite graph', () => {
    expect(hasPrerequisiteCycle({ a: ['b'], b: ['c'], c: ['a'] })).toBe(true);
    expect(hasPrerequisiteCycle({ a: ['b'], b: [], c: ['b'] })).toBe(false);
  });
});

describe('research mapping - challenge orchestration', () => {
  it('maps stage to phase and computes dynamic activity difficulty', () => {
    expect(identifyPhase(5)).toBe('P1');
    expect(identifyPhase(37)).toBe('P2');
    expect(identifyPhase(75)).toBe('P4');
    expect(calculateDynamicDifficulty(3, 10)).toBe(0.7);
  });

  it('selects activities by phase and runs escalation flow', () => {
    const candidates = [
      { id: 'q1', chapter: 1, bloom: 'R' as const, kind: 'Q' as const },
      { id: 'q2', chapter: 1, bloom: 'U' as const, kind: 'Q' as const },
      { id: 'q3', chapter: 1, bloom: 'R' as const, kind: 'Q' as const },
      { id: 'q4', chapter: 1, bloom: 'U' as const, kind: 'Q' as const },
      { id: 'v1', chapter: 1, bloom: 'AP' as const, kind: 'V' as const, diffScore: 0.35 },
    ];

    const selectedQ = selectChallengeActivities({
      stage: 1,
      actType: 'Q',
      chapter: 1,
      candidates,
      usedIds: [],
    });
    expect(selectedQ.length).toBeGreaterThan(0);

    const result = runChallengeEscalation({
      context: { lifeMax: 3, totalStages: 3 },
      getActType: (stage) => (stage === 2 ? 'V' : 'Q'),
      selectActs: (stage, actType, usedIds) =>
        selectChallengeActivities({ stage, actType, chapter: 1, candidates, usedIds }),
      executeActs: (_stage, acts) => ({ correctness: acts.length > 0 ? 1 : 0 }),
    });

    expect(result.isAlive).toBe(true);
    expect(result.finalStage).toBe(4);
    expect(result.usedActivityIds.length).toBeGreaterThan(0);
  });
});

describe('research mapping - scoring and rewarding', () => {
  it('calculates score from utility formula and multiplayer utility', () => {
    expect(calculateActivityScore(12, 0.75, 2)).toBe(18);
    expect(evaluateMultiplayerUtility({ score: 200, correctness: 0.8, durationSec: 60, lambda: 0.5 })).toBe(130);
  });

  it('applies mode-specific scoring with mission reward bonus', () => {
    const result = scoreAndReward({
      mode: 'multiplay',
      activityUtility: 100,
      correctness: 1,
      gamma: 0.1,
      isWin: true,
      bonusElo: 5,
      missions: [
        {
          id: 'm1',
          completed: false,
          rewardPoints: 20,
          checker: (ctx) => Boolean(ctx.isWin),
        },
      ],
    });

    expect(result.eloDelta).toBe(15);
    expect(result.scoreDelta).toBe(20);
    expect(result.completedMissionIds).toEqual(['m1']);
  });
});
