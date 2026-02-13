/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TYPES CHO STUDY MATERIALS - DSA LEARNING PATH
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa các TypeScript types và interfaces cho hệ thống học tập DSA.
 * Đảm bảo type safety và code documentation rõ ràng.
 * 
 * KIẾN TRÚC:
 * - ChapterInfo: Thông tin cơ bản của một chương
 * - DemoReference: Tham chiếu đến file demo thuật toán
 * - ComplexityInfo: Thông tin về độ phức tạp thuật toán
 * - AlgorithmComparison: So sánh giữa các thuật toán
 * 
 * @module StudyMaterialTypes
 * @category Data/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS - ĐỊNH NGHĨA CÁC GIÁ TRỊ HẰNG SỐ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Enum định nghĩa các mức độ phức tạp thời gian (Time Complexity)
 * Sắp xếp từ tốt nhất → xấu nhất
 */
export enum TimeComplexity {
    /** O(1) - Hằng số: Không phụ thuộc kích thước input */
    CONSTANT = 'O(1)',

    /** O(log n) - Logarithmic: Chia đôi mỗi bước (Binary Search) */
    LOGARITHMIC = 'O(log n)',

    /** O(n) - Tuyến tính: Tỷ lệ thuận với input size */
    LINEAR = 'O(n)',

    /** O(n log n) - Linearithmic: Tốt nhất cho comparison sort */
    LINEARITHMIC = 'O(n log n)',

    /** O(n²) - Bình phương: 2 vòng lặp lồng nhau */
    QUADRATIC = 'O(n²)',

    /** O(n³) - Bậc 3: 3 vòng lặp lồng nhau */
    CUBIC = 'O(n³)',

    /** O(2^n) - Mũ: Tăng gấp đôi mỗi bước (Fibonacci naive) */
    EXPONENTIAL = 'O(2^n)',

    /** O(n!) - Giai thừa: Permutation, Brute force TSP */
    FACTORIAL = 'O(n!)'
}

/**
 * Enum định nghĩa các loại thuật toán sắp xếp
 */
export enum SortingCategory {
    /** Thuật toán đơn giản O(n²) - dễ hiểu, chạy chậm */
    SIMPLE = 'simple',

    /** Thuật toán hiệu quả O(n log n) - phức tạp hơn, nhanh hơn */
    EFFICIENT = 'efficient',

    /** Thuật toán không so sánh O(n+k) - dùng counting/radix */
    NON_COMPARISON = 'non_comparison'
}

/**
 * Enum định nghĩa các chương học
 */
export enum ChapterNumber {
    COMPLEXITY = 1,
    SORTING_SEARCHING = 2,
    LINKED_LIST = 3,
    STACK_QUEUE = 4,
    BST = 5,
    GRAPH_GRID = 6
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES - ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface mô tả thông tin độ phức tạp của thuật toán
 * 
 * @property timeComplexity - Độ phức tạp thời gian cho 3 trường hợp
 * @property spaceComplexity - Độ phức tạp không gian (bộ nhớ phụ)
 */
export interface ComplexityInfo {
    /** Độ phức tạp thời gian */
    timeComplexity: {
        /** Trường hợp tốt nhất (Best Case) */
        best: TimeComplexity | string;
        /** Trường hợp trung bình (Average Case) */
        average: TimeComplexity | string;
        /** Trường hợp xấu nhất (Worst Case) */
        worst: TimeComplexity | string;
    };
    /** Độ phức tạp không gian - bộ nhớ phụ cần dùng */
    spaceComplexity: TimeComplexity | string;
}

/**
 * Interface mô tả tham chiếu đến file demo
 * 
 * @example
 * const bubbleSortDemo: DemoReference = {
 *     name: 'Bubble Sort',
 *     path: 'algo_demos/Chapter_2_Search_Sort/BubbleSort.ts',
 *     description: 'Minh họa thuật toán Bubble Sort với animation'
 * };
 */
export interface DemoReference {
    /** Tên thuật toán/cấu trúc dữ liệu */
    name: string;
    /** Đường dẫn tương đối đến file demo */
    path: string;
    /** Mô tả ngắn về demo */
    description: string;
}

/**
 * Interface so sánh giữa các thuật toán
 * Dùng để học sinh hiểu khi nào nên dùng thuật toán nào
 */
export interface AlgorithmComparison {
    /** Tên thuật toán */
    name: string;
    /** Độ phức tạp */
    complexity: ComplexityInfo;
    /** Thuật toán có ổn định không? (Stable) */
    isStable: boolean;
    /** Thuật toán có in-place không? (Không dùng bộ nhớ phụ đáng kể) */
    isInPlace: boolean;
    /** Ưu điểm chính */
    advantages: string[];
    /** Nhược điểm chính */
    disadvantages: string[];
    /** Khi nào nên sử dụng */
    bestUseCases: string[];
}

/**
 * Interface mô tả một bước trong thuật toán (Algorithm Step)
 * Dùng cho visualization và giải thích từng bước
 */
export interface AlgorithmStep {
    /** Số thứ tự bước */
    stepNumber: number;
    /** Mô tả bước thực hiện */
    description: string;
    /** Code tương ứng (pseudo-code hoặc real code) */
    codeSnippet?: string;
    /** Trạng thái dữ liệu sau bước này */
    dataState?: any;
}

/**
 * Interface mô tả thông tin một chương học
 */
export interface ChapterInfo {
    /** Số chương */
    chapterNumber: ChapterNumber;
    /** Tiêu đề chương (tiếng Việt) */
    title: string;
    /** Tiêu đề chương (tiếng Anh) */
    titleEn: string;
    /** Mô tả ngắn */
    description: string;
    /** Các chủ đề chính trong chương */
    topics: string[];
    /** Tham chiếu đến các demo */
    demos: DemoReference[];
    /** Điều kiện tiên quyết (prerequisite) */
    prerequisites: ChapterNumber[];
}

/**
 * Interface cho một concept/khái niệm trong chương
 */
export interface Concept {
    /** Tên khái niệm (tiếng Anh) */
    name: string;
    /** Tên tiếng Việt */
    nameVi: string;
    /** Định nghĩa */
    definition: string;
    /** Ví dụ minh họa */
    examples: string[];
    /** Ghi chú quan trọng */
    notes?: string[];
}

/**
 * Interface cho code example với giải thích chi tiết
 */
export interface CodeExample {
    /** Tiêu đề ví dụ */
    title: string;
    /** Ngôn ngữ lập trình */
    language: 'typescript' | 'javascript' | 'cpp' | 'python';
    /** Mã nguồn */
    code: string;
    /** Giải thích từng dòng/block */
    lineExplanations: {
        /** Dòng bắt đầu */
        startLine: number;
        /** Dòng kết thúc */
        endLine: number;
        /** Giải thích */
        explanation: string;
    }[];
    /** Độ phức tạp của đoạn code */
    complexity: ComplexityInfo;
    /** Output mẫu */
    sampleOutput?: string;
}

/**
 * Interface cho nội dung lý thuyết của một page
 */
export interface TheoryContent {
    introduction: string;
    keyConcepts: Array<{
        title: string;
        content: string;
        importance: 'basic' | 'important' | 'critical';
    }>;
    examples: Array<{
        title: string;
        description: string;
        code?: string;
        language?: string;
        explanation?: string;
    }>;
    summary: string;
    readingTime: number; // estimated minutes
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY TYPES - TYPES HỖ TRỢ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Type cho danh sách tất cả các chương
 */
export type AllChapters = Record<ChapterNumber, ChapterInfo>;

/**
 * Type cho progress tracking của người học
 */
export interface LearningProgress {
    /** Chương hiện tại */
    currentChapter: ChapterNumber;
    /** Các chương đã hoàn thành */
    completedChapters: ChapterNumber[];
    /** Điểm quiz từng chương */
    quizScores: Partial<Record<ChapterNumber, number>>;
    /** Thời gian học (phút) */
    studyTimeMinutes: number;
}

export default {
    TimeComplexity,
    SortingCategory,
    ChapterNumber
};
