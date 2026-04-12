export interface QuizOption {
    id: string;
    name: string;
}

export interface QuizConfig {
    correct_id: string;
    options: QuizOption[];
}

export interface BinarySearchDataType {
    algorithm: string;
    array: number[];
    target: number;
    description: string;
    complexity: {
        time: string;
        space: string;
    };
    quiz?: QuizConfig;
}