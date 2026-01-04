/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÔ HÌNH DỮ LIỆU CÂU HỎI (Question Data Model)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc cho Ngân Hàng Câu Hỏi (Question Bank) và các loại câu hỏi khác nhau.
 * Hỗ trợ phân loại theo Thang Bloom (Bloom's Taxonomy) để đánh giá năng lực người học.
 * 
 * BLOOM LEVEL SYSTEM:
 * - REMEMBER (R): Nhớ lại kiến thức (10 điểm).
 * - UNDERSTAND (U): Hiểu và giải thích (20 điểm).
 * - APPLY (AP): Áp dụng vào thực tế (30 điểm).
 * - ANALYZE (AN): Phân tích, so sánh, đánh giá (50 điểm).
 * 
 * LOẠI CÂU HỎI (QUESTION TYPES):
 * 1. MULTIPLE_CHOICE (MCQ): Trắc nghiệm 4 chọn 1.
 * 2. FILL_BLANK: Điền vào chỗ trống (cú pháp code).
 * 3. MATCHING: Nối cột A với cột B (khái niệm).
 * 4. PROGRAMMING: Viết code thực tế (Coding Consle).
 * 5. ESSAY: Tự luận (Future).
 * 
 * @module QuestionModel
 * @category Data Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// Các Cấp Độ Bloom (Độ khó trí tuệ)
export enum BloomLevel {
    REMEMBER = 'R',      // Nhớ - Nhớ lại sự kiện/cú pháp
    UNDERSTAND = 'U',    // Hiểu - Giải thích khái niệm/cơ chế
    APPLY = 'AP',        // Áp dụng - Giải quyết vấn đề bằng kiến thức
    ANALYZE = 'AN'       // Phân tích - Debug, tối ưu, so sánh thuật toán
}

// Enum Loại Câu Hỏi
export enum QuestionType {
    MULTIPLE_CHOICE = 'MCQ',   // Trắc nghiệm khách quan
    FILL_BLANK = 'FILL',       // Điền khuyết (Cú pháp)
    MATCHING = 'MATCH',        // Ghép đôi (Khái niệm)
    PROGRAMMING = 'CODE',      // Lập trình thực hành
    ESSAY = 'ESSAY'            // Tự luận (UGC)
}

// Interface Cơ Bản (Base Interface) cho mọi câu hỏi
export interface BaseQuestion {
    id: string;                // ID duy nhất (vd: 'ch1_q01')
    chapter: number;           // Chương 1-6
    type: QuestionType;        // Loại câu hỏi
    bloomLevel: BloomLevel;    // Độ khó Bloom
    points: number;            // Điểm số/Sát thương gây ra
    topic: string;             // Chủ đề (vd: "Binary Search", "Stack")
}

// 1. Cấu trúc Câu Hỏi Trắc Nghiệm
export interface MultipleChoiceQuestion extends BaseQuestion {
    type: QuestionType.MULTIPLE_CHOICE;
    question: string;          // Nội dung câu hỏi
    options: string[];         // Mảng 4 phương án
    correctAnswer: number;     // Index đáp án đúng (0-3)
    explanation?: string;      // Giải thích chi tiết (Dùng cho Hint)
}

// 2. Cấu trúc Câu Hỏi Điền Khuyết
export interface FillBlankQuestion extends BaseQuestion {
    type: QuestionType.FILL_BLANK;
    question: string;
    blanks: {
        text: string;          // Văn bản hiển thị trước chỗ trống
        answer: string;        // Đáp án đúng cần điền
        caseSensitive?: boolean; // Có phân biệt hoa thường không?
    }[];
    explanation?: string;
}

// 3. Cấu trúc Câu Hỏi Ghép Đôi
export interface MatchingQuestion extends BaseQuestion {
    type: QuestionType.MATCHING;
    question: string;
    leftColumn: { id: string; text: string }[];  // Cột trái (Khái niệm)
    rightColumn: { id: string; text: string }[]; // Cột phải (Định nghĩa)
    correctMatches: { leftId: string; rightId: string }[]; // Cặp đúng
    explanation?: string;
}

// 4. Cấu trúc Bài Tập Lập Trình (Coding Challenge)
export interface ProgrammingQuestion extends BaseQuestion {
    type: QuestionType.PROGRAMMING;
    question: string;
    functionName: string;      // Tên hàm cần implement (e.g., "bubbleSort")
    starterCode: string;       // Template code ban đầu
    testCases: {               // Bộ test case kiểm tra
        input: string;
        expectedOutput: string;
        description: string;
    }[];
    syntaxRules?: string[];    // Rules check cú pháp (Phase 1)
    memoryRules?: string[];    // Rules check bộ nhớ (Phase 2)
    hints?: string[];          // Danh sách gợi ý tuần tự
}

// 5. Câu Hỏi Tự Luận (Dành cho nội dung do người dùng tạo - UGC)
export interface EssayQuestion extends BaseQuestion {
    type: QuestionType.ESSAY;
    question: string;
    rubric?: string[];           // Tiêu chí chấm điểm
    expectedKeywords?: string[]; // Từ khóa AI cần tìm
    maxWords?: number;           // Giới hạn từ
}

// Union Type tổng hợp tất cả loại câu hỏi
export type Question =
    | MultipleChoiceQuestion
    | FillBlankQuestion
    | MatchingQuestion
    | ProgrammingQuestion
    | EssayQuestion;

// Cấu trúc Ngân Hàng Câu Hỏi theo Chương
export interface QuestionBank {
    chapter: number;
    title: string;
    description: string;
    questions: Question[];       // Danh sách câu hỏi
}

// Cấu trúc Theo Dõi Câu Trả Lời của Người chơi (Analytics)
export interface PlayerAnswer {
    questionId: string;
    playerAnswer: any;           // Dữ liệu trả lời (index, string, code...)
    isCorrect: boolean;          // Đúng/Sai
    timestamp: Date;             // Thời gian trả lời
    attempts: number;            // Số lần thử
    hintsUsed: number;           // Số gợi ý đã dùng
}

// Hệ thống Bản Thiết Kế (Blueprint System - Rewards)
export enum BlueprintType {
    ACTIVE_SPELL = 'SPELL',      // Kỹ năng chủ động (Coding)
    PASSIVE_RUNE = 'RUNE'        // Kỹ năng bị động (Runes)
}

export interface Blueprint {
    id: string;
    type: BlueprintType;
    name: string;
    description: string;
    questionId: string;          // ID câu hỏi lập trình để mở khóa
    rewardType: 'ALTAR' | 'RUNE_STONE'; // Hình thức nhận thưởng
    chapter: number;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}
