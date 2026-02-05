/**
 * =============================================================================
 * FILE: index.ts
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Barrel Export file cho thư mục visualizations.
 * - Tập trung tất cả exports vào 1 file để dễ import.
 *
 * CÁCH SỬ DỤNG (Usage):
 * ```typescript
 * // Thay vì:
 * import SortingVisualizer from '../visualizations/sorting/SortingVisualizer';
 * import BinarySearchVisualizer from '../visualizations/searching/BinarySearchVisualizer';
 *
 * // Có thể dùng:
 * import { SortingVisualizer, BinarySearchVisualizer } from '../visualizations';
 * ```
 *
 * ƯU ĐIỂM CỦA BARREL EXPORT:
 * 1. Clean imports: Gọn gàng hơn, ít đường dẫn hơn.
 * 2. Encapsulation: Ẩn cấu trúc thư mục nội bộ.
 * 3. Dễ refactor: Đổi cấu trúc thư mục không cần sửa nhiều imports.
 * 4. Single source: Tập trung quản lý public API.
 *
 * =============================================================================
 */

// =============================================================================
// SHARED COMPONENTS - Components dùng chung
// =============================================================================

export { default as AnimationControls } from './shared/AnimationControls';
export type { default as AnimationControlsType } from './shared/AnimationControls';

// =============================================================================
// SORTING VISUALIZERS - Trực quan hóa các thuật toán sắp xếp
// =============================================================================

/**
 * SortingVisualizer:
 * - Hỗ trợ: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort.
 * - Step-by-step visualization với controls (play/pause/speed).
 * - Hiển thị: comparing, swapping, sorted states.
 */
export { default as SortingVisualizer } from './sorting/SortingVisualizer';
export type { SortingVisualizerProps } from './sorting/SortingVisualizer';
export type {
    SortingStep,
    SortingAlgorithmType,
} from './types';

/**
 * ArrayBar:
 * - Component hiển thị 1 phần tử mảng dưới dạng thanh dọc.
 * - Dùng trong SortingVisualizer và có thể tái sử dụng.
 */
export { default as ArrayBar } from './sorting/ArrayBar';
export type { ArrayBarState } from './sorting/ArrayBar';

// =============================================================================
// SEARCHING VISUALIZERS - Trực quan hóa các thuật toán tìm kiếm
// =============================================================================

/**
 * BinarySearchVisualizer:
 * - Visualization cho Binary Search trên sorted array.
 * - Hiển thị: left/mid/right pointers, eliminated sections.
 * - O(log n) time complexity demonstration.
 */
export { default as BinarySearchVisualizer } from './searching/BinarySearchVisualizer';
export type { BinarySearchVisualizerProps } from './searching/BinarySearchVisualizer';

/**
 * LinearSearchVisualizer:
 * - Visualization cho Linear Search (sequential search).
 * - Hiển thị: current pointer, checked elements.
 * - O(n) time complexity demonstration.
 * - So sánh với Binary Search.
 */
export { default as LinearSearchVisualizer } from './searching/LinearSearchVisualizer';
export type { LinearSearchVisualizerProps } from './searching/LinearSearchVisualizer';

// =============================================================================
// DATA STRUCTURE VISUALIZERS - Trực quan hóa các cấu trúc dữ liệu
// =============================================================================

/**
 * StackVisualizer:
 * - Interactive Stack với Push/Pop/Peek operations.
 * - LIFO (Last In, First Out) demonstration.
 * - Vertical layout giống stack thực tế.
 */
export { default as StackVisualizer } from './data-structures/StackVisualizer';
export type { StackVisualizerProps } from './data-structures/StackVisualizer';

/**
 * QueueVisualizer:
 * - Interactive Queue với Enqueue/Dequeue/Front operations.
 * - FIFO (First In, First Out) demonstration.
 * - Horizontal layout với FRONT và REAR pointers.
 */
export { default as QueueVisualizer } from './data-structures/QueueVisualizer';
export type { QueueVisualizerProps } from './data-structures/QueueVisualizer';

/**
 * LinkedListVisualizer:
 * - Interactive Singly Linked List.
 * - Operations: Prepend, Append, Delete, Traverse.
 * - Hiển thị nodes với pointers (arrows).
 */
export { default as LinkedListVisualizer } from './data-structures/LinkedListVisualizer';
export type { LinkedListVisualizerProps } from './data-structures/LinkedListVisualizer';

/**
 * BSTVisualizer:
 * - Interactive Binary Search Tree.
 * - Operations: Insert, Search, Traversals (In/Pre/Post-Order).
 * - Tree layout với nodes và edges.
 */
export { default as BSTVisualizer } from './data-structures/BSTVisualizer';
export type { BSTVisualizerProps } from './data-structures/BSTVisualizer';
