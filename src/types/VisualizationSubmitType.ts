export enum StageType {
    BBSORT_1 = 'BBSORT_1',
    BBSORT_2 = 'BBSORT_2',
    SELECSORT_1 = 'SELECSORT_1',
    SELECSORT_2 = 'SELECSORT_2',
    BSEARCH_1 = 'BSEARCH_1',
    BSEARCH_2 = 'BSEARCH_2'
}

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

export interface VisulizationType{
    id: string;
    visualizationType: StageType;
    data: string;
    templateCode: string;
    passCount: number;
    failCount: number;
}