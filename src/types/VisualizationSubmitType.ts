export interface VisualBudgetSubmitRequestDto {
    userId: string;
    questId: string;
    visualizationId: string;
    selectedOptionId: string;
    actualSteps: number;
}