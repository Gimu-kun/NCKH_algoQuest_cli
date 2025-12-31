/**
 * Các Loại Câu Hỏi và Mô Hình Dữ  Liệu cho Pháp Sư Thuật Toán
 * Hỗ trợ ngân hàng 1830+ câu hỏi với phân cấp tháp Bloom
 */

// Các Cấp Độ Tháp (Độ) Bloom
export enum BloomLevel {
    REMEMBER = 'R',      // Nhớ - Nhớ lại sự kiện
    UNDERSTAND = 'U',    // Hiểu - Giải thích khái niệm
    APPLY = 'AP',        // Áp dụng - Sử dụng trong tình huống mới
    ANALYZE = 'AN'       // Phân tích - Phân tích và kiểm tra
}

// Các Loại Câu Hỏi
export enum QuestionType {
    MULTIPLE_CHOICE = 'MCQ',
    FILL_BLANK = 'FILL',
    MATCHING = 'MATCH',
    PROGRAMMING = 'CODE',
    ESSAY = 'ESSAY'
}

// Giao Diện Câu Hỏi Cơ Bản
export interface BaseQuestion {
    id: string;
    chapter: number;           // 1-6
    type: QuestionType;
    bloomLevel: BloomLevel;
    points: number;            // R=10, U=20, AP=30, AN=50
    topic: string;             // e.g., "Binary Search", "Stack", etc.
}

// Câu Hỏi Trắc Nghiệm
export interface MultipleChoiceQuestion extends BaseQuestion {
    type: QuestionType.MULTIPLE_CHOICE;
    question: string;
    options: string[];         // 4 options
    correctAnswer: number;     // Index 0-3
    explanation?: string;      // Cho gợi ý của Sparky
}

// Câu Hỏi Điền Khuết
export interface FillBlankQuestion extends BaseQuestion {
    type: QuestionType.FILL_BLANK;
    question: string;
    blanks: {
        text: string;          // Văn bản trước chỗ trống
        answer: string;        // Đáp án đúng
        caseSensitive?: boolean;
    }[];
    explanation?: string;
}

// Câu Hỏi Ghép Đôi
export interface MatchingQuestion extends BaseQuestion {
    type: QuestionType.MATCHING;
    question: string;
    leftColumn: { id: string; text: string }[];
    rightColumn: { id: string; text: string }[];
    correctMatches: { leftId: string; rightId: string }[];
    explanation?: string;
}

// Bài Tập Lập Trình
export interface ProgrammingQuestion extends BaseQuestion {
    type: QuestionType.PROGRAMMING;
    question: string;
    functionName: string;      // e.g., "bubbleSort", "reverseList"
    starterCode: string;       // Code mẫu ban đầu
    testCases: {
        input: string;
        expectedOutput: string;
        description: string;
    }[];
    syntaxRules?: string[];    // Cho kiểm tra giai đoạn 1 (mô phỏng cppcheck)
    memoryRules?: string[];    // Cho kiểm tra giai đoạn 2 (mô phỏng valgrind)
    hints?: string[];          // Gợi ý tuần tự từ Sparky
}

// Essay Question (for UGC)
export interface EssayQuestion extends BaseQuestion {
    type: QuestionType.ESSAY;
    question: string;
    rubric?: string[];         // Grading criteria
    expectedKeywords?: string[]; // For ML-assisted grading
    maxWords?: number;
}

// Union type for all questions
export type Question =
    | MultipleChoiceQuestion
    | FillBlankQuestion
    | MatchingQuestion
    | ProgrammingQuestion
    | EssayQuestion;

// Question Bank structure by chapter
export interface QuestionBank {
    chapter: number;
    title: string;
    description: string;
    questions: Question[];
}

// Player answer tracking
export interface PlayerAnswer {
    questionId: string;
    playerAnswer: any;         // Type depends on question type
    isCorrect: boolean;
    timestamp: Date;
    attempts: number;
    hintsUsed: number;
}

// Blueprint system (rewards from dungeons)
export enum BlueprintType {
    ACTIVE_SPELL = 'SPELL',    // Programming exercises
    PASSIVE_RUNE = 'RUNE'      // MCQ, Fill, Match
}

export interface Blueprint {
    id: string;
    type: BlueprintType;
    name: string;
    description: string;
    questionId: string;        // Link to question that must be completed
    rewardType: 'ALTAR' | 'RUNE_STONE';
    chapter: number;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}
