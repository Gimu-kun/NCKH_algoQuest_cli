/**
 * =============================================================================
 * FILE: types.ts
 * =============================================================================
 * Shared types for visualization components and algorithm demos.
 */

export type SortingAlgorithmType =
    | 'bubble'
    | 'selection'
    | 'insertion'
    | 'merge'
    | 'quick'
    | 'heap'
    | 'shell'
    | 'shaker'
    | 'interchange'
    | 'binaryInsertion'
    | 'counting'
    | 'radix';

/**
 * SortingStep - Đại diện cho một bước trong quá trình sắp xếp.
 *
 * Mỗi step chứa đầy đủ thông tin để render UI:
 * - Array state tại thời điểm đó.
 * - Indices nào đang được thao tác.
 * - Mô tả bằng text cho user hiểu.
 */
export interface SortingStep {
    /**
     * array: Trạng thái mảng tại step này.
     * Là copy, không phải reference, để có thể review lại các steps trước.
     */
    array: number[];

    /**
     * comparing: Indices đang được so sánh.
     * Thường là 2 elements.
     */
    comparing: number[];

    /**
     * swapping: Indices đang được hoán đổi.
     * Có thể rỗng nếu step này không có swap.
     */
    swapping: number[];

    /**
     * sorted: Indices đã ở đúng vị trí cuối cùng.
     * Accumulated qua các steps.
     */
    sorted: number[];

    /**
     * pivot: Index của pivot element (chỉ dùng trong Quick Sort).
     * Optional.
     */
    pivot?: number;

    /**
     * description: Mô tả bước này bằng text.
     * Hiển thị cho user để giải thích đang làm gì.
     */
    description: string;

    /**
     * codeSnippet: Đoạn code minh họa cho bước này.
     * Hiển thị pseudo-code hoặc code thực tế để user hiểu thuật toán.
     * Optional - không phải step nào cũng cần code.
     */
    codeSnippet?: string;
}

// =============================================================================
// SEARCHING TYPES
// =============================================================================

/**
 * LinearSearchStep - Đại diện cho một bước trong Linear Search.
 */
export interface LinearSearchStep {
    array: number[];
    currentIndex: number;
    target: number;
    checkedIndices: number[];
    foundIndex: number;
    description: string;
    isComplete: boolean;
    comparisonCount: number;
    codeSnippet?: string;
}

/**
 * BinarySearchStep - Đại diện cho một bước trong Binary Search.
 */
export interface BinarySearchStep {
    array: number[];
    left: number;
    right: number;
    mid: number;
    target: number;
    foundIndex: number;
    eliminated: number[];
    description: string;
    isComplete: boolean;
    codeSnippet?: string;
}
