import type { Question } from "./questType";
import type { StageType } from "./stageType";
import type { VisulizationType } from "./VisualizationSubmitType";

export interface challengeStageType {
    progressId: number;
    questions: Question[];
    remainLife: number;
    type: StageType;
    visualization: VisulizationType;
}