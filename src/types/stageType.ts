export enum StageType {
    Q = 'Q',
    D = 'D',
    V = 'V'
}

export enum StageDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
}

export interface stageStateType{
    stageNum: number,
    phraseNum: number,
    stageType: StageType,
    difficulty: StageDifficulty
}

export interface challengeSessionStateType{
    currentStage: number,
    sessionId:number,
    progressId: number,
    remainLife: number,
    userId: string,
    isNew: boolean
}