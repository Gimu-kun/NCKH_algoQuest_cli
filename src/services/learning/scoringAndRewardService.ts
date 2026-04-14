import type { MatchSummary } from '../../types/multiplayerType';

export type PlayMode = 'single' | 'challenge' | 'multiplay';

export interface MissionState {
  id: string;
  completed: boolean;
  rewardPoints: number;
  checker: (context: RewardContext) => boolean;
}

export interface RewardContext {
  correctness: number;
  activityUtility: number;
  isWin?: boolean;
}

export interface ScoreRewardResult {
  mode: PlayMode;
  scoreDelta: number;
  eloDelta: number;
  missionRewards: number;
  completedMissionIds: string[];
}

export function calculateActivityScore(activityUtility: number, correctness: number, gamma: number): number {
  return Math.round(activityUtility * correctness * gamma);
}

export function evaluateMultiplayerUtility(params: {
  score: number;
  correctness: number;
  durationSec: number;
  lambda: number;
}): number {
  return Number((params.score * params.correctness - params.lambda * params.durationSec).toFixed(2));
}

export function scoreAndReward(params: {
  mode: PlayMode;
  activityUtility: number;
  correctness: number;
  gamma: number;
  isWin?: boolean;
  bonusElo?: number;
  missions?: MissionState[];
}): ScoreRewardResult {
  let scoreDelta = 0;
  let eloDelta = 0;

  if (params.mode === 'single') {
    if (params.correctness >= 0.5) {
      scoreDelta = calculateActivityScore(params.activityUtility, params.correctness, params.gamma);
    }
  } else if (params.mode === 'challenge') {
    scoreDelta = calculateActivityScore(params.activityUtility, params.correctness, params.gamma);
  } else {
    const baseElo = Math.round(params.activityUtility * params.gamma);
    eloDelta = params.isWin ? baseElo + (params.bonusElo ?? 0) : -baseElo;
  }

  const completedMissionIds: string[] = [];
  let missionRewards = 0;

  for (const mission of params.missions ?? []) {
    if (mission.completed) continue;
    if (mission.checker({ correctness: params.correctness, activityUtility: params.activityUtility, isWin: params.isWin })) {
      completedMissionIds.push(mission.id);
      missionRewards += mission.rewardPoints;
    }
  }

  scoreDelta += missionRewards;

  return {
    mode: params.mode,
    scoreDelta,
    eloDelta,
    missionRewards,
    completedMissionIds,
  };
}

export function toMultiplayerMatchSummary(input: {
  roomCode: string;
  mode: MatchSummary['mode'];
  resultText: string;
  utility: number;
  scoreReward: ScoreRewardResult;
}): MatchSummary {
  return {
    roomCode: input.roomCode,
    mode: input.mode,
    resultText: input.resultText,
    xpGained: Math.max(0, input.scoreReward.scoreDelta),
    deltaMMR: input.scoreReward.eloDelta,
    deltaElo: input.scoreReward.eloDelta,
    reward: input.scoreReward.completedMissionIds[0] ?? null,
  };
}
