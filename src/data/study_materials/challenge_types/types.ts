export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeScoring {
    basePoints: number;
    wrongPenalty: number;
    firstTryBonus?: number;
    utilityWeight?: number;
    gamma?: number;
}

export interface ChallengeBase {
    id: string;
    difficulty: ChallengeDifficulty;
    prompt: string;
    algorithmKey: string;
    tags?: string[];
    scoring: ChallengeScoring;
}

export interface EasyChoice {
    id: string;
    label: string;
    displayKey: 'A' | 'B' | 'C';
}

export interface EasyChallenge extends ChallengeBase {
    difficulty: 'easy';
    mode: 'identify-from-visual';
    visualization: {
        demoKey: string;
        snapshotRef: string;
        sampleArray?: number[];
        target?: number;
    };
    choices: EasyChoice[];
    correctChoiceId: string;
}

export interface MediumStep {
    step: number;
    action: string;
    payload: Record<string, unknown>;
    stateAfter: Record<string, unknown>;
}

export interface MediumChallenge extends ChallengeBase {
    difficulty: 'medium';
    mode: 'perform-by-steps';
    algorithmLabel: string;
    initialState: Record<string, unknown>;
    expectedSteps: MediumStep[];
    rollbackPolicy: {
        type: 'keep-n-minus-1';
        keepCompletedSteps: true;
        maxMistakes?: number;
    };
}

export interface HardFunctionOption {
    id: string;
    functionCode: string;
    actualAlgorithm: string;
    displayedAlgorithmLabel?: string;
}

export interface HardChallenge extends ChallengeBase {
    difficulty: 'hard';
    mode: 'complete-missing-function';
    hardVariant: 'function-only-4' | 'mixed-labels-4';
    codeTemplate: string;
    missingFunctionName: string;
    visualizationTarget: {
        demoKey: string;
        expectedBehavior: string;
        sampleArray?: number[];
        target?: number;
    };
    validationCases: {
        description: string;
        args: unknown[];
        expected: unknown;
    }[];
    options: HardFunctionOption[];
    correctOptionId: string;
    labelRules?: {
        truthfulLabeledOptionIds: string[];
        misleadingLabeledOptionIds: string[];
        swappedLabelPair: [string, string];
    };
}

export type AlgorithmChallenge = EasyChallenge | MediumChallenge | HardChallenge;

export interface AlgorithmChallengeSet {
    version: string;
    chapter: number;
    topic: string;
    knowledgeGraph?: Record<string, string[]>;
    challenges: AlgorithmChallenge[];
}

export const isEasyChallenge = (challenge: AlgorithmChallenge): challenge is EasyChallenge =>
    challenge.difficulty === 'easy';

export const isMediumChallenge = (challenge: AlgorithmChallenge): challenge is MediumChallenge =>
    challenge.difficulty === 'medium';

export const isHardChallenge = (challenge: AlgorithmChallenge): challenge is HardChallenge =>
    challenge.difficulty === 'hard';
