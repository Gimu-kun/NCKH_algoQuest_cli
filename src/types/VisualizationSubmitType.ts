export interface VisualBudgetSubmitRequestDto {
    userId: string;
    questId: string;
    visualizationId: string;
    selectedOptionId: string;
    actualSteps: number;
}


export interface TestCaseResult {
    name: string;
    status: 'PASSED' | 'FAILED';
    message?: string;
    durationMs: number;
    cpuCycles?: number;
    input?: string;
    expected?: string;
}