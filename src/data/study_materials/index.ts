/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DSA STUDY MATERIALS - MAIN INDEX
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Export tất cả tài liệu học DSA từ 5 chương.
 * Cung cấp interface thống nhất để truy cập các materials.
 * 
 * CẤU TRÚC 5 CHƯƠNG:
 * - Chapter 1: Algorithm Complexity (Big O, Time/Space Analysis)
 * - Chapter 2: Sorting & Searching (Bubble, Merge, Quick, Binary Search)
 * - Chapter 3: Linked Lists (Singly, Doubly, Circular, Operations)
 * - Chapter 4: Stack & Queue (LIFO, FIFO, Applications)
 * - Chapter 5: Binary Search Tree (BST - Insert, Delete, Search, Traversals)
 * 
 * MỖI CHƯƠNG BAO GỒM:
 * - theory.md: Lý thuyết chi tiết với giải thích tiếng Việt
 * - cheatsheet.md: Bảng tóm tắt nhanh
 * - demos.ts: Code examples và liên kết đến algo_demos
 * 
 * LEARNING PATH:
 * 
 *     ┌─────────────────────────────────────────────────────────┐
 *     │                   DSA LEARNING PATH                     │
 *     └─────────────────────────────────────────────────────────┘
 *                              │
 *                   ┌──────────┴──────────┐
 *                   │   Chapter 1         │
 *                   │   Complexity        │
 *                   │   (Big O)           │
 *                   └──────────┬──────────┘
 *                              │
 *              ┌───────────────┴───────────────┐
 *              │                               │
 *    ┌─────────┴─────────┐           ┌─────────┴─────────┐
 *    │   Chapter 2       │           │   Chapter 3       │
 *    │   Sorting &       │           │   Linked Lists    │
 *    │   Searching       │           │                   │
 *    └─────────┬─────────┘           └─────────┬─────────┘
 *              │                               │
 *              └───────────────┬───────────────┘
 *                              │
 *                   ┌──────────┴──────────┐
 *                   │   Chapter 4         │
 *                   │   Stack & Queue     │
 *                   └──────────┬──────────┘
 *                              │
 *                   ┌──────────┴──────────┐
 *                   │   Chapter 5         │
 *                   │   BST               │
 *                   └─────────────────────┘
 * 
 * @module StudyMaterials
 * @category Data/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS - Nhập các module từ từng chương
// ═══════════════════════════════════════════════════════════════════════════

// Types và Enums
export * from './types';

// Chapter 1: Algorithm Complexity
import Chapter1 from './chapter1_complexity/demos';
export { Chapter1 };
export { CHAPTER_1_INFO, CHAPTER_1_DEMOS, COMPLEXITY_LEVELS, CODE_EXAMPLES } from './chapter1_complexity/demos';

// Chapter 2: Sorting & Searching  
import Chapter2 from './chapter2_sorting_searching/demos';
export { Chapter2 };
export {
    CHAPTER_2_INFO,
    CHAPTER_2_DEMOS,
    ALL_SORTING_ALGORITHMS,
    ALL_SEARCHING_ALGORITHMS,
    LINEAR_SEARCH_INFO,
    BINARY_SEARCH_INFO,
    BUBBLE_SORT_INFO,
    SELECTION_SORT_INFO,
    INSERTION_SORT_INFO,
    BINARY_INSERTION_SORT_INFO,
    MERGE_SORT_INFO,
    QUICK_SORT_INFO,
    HEAP_SORT_INFO,
    SHELL_SORT_INFO,
    SHAKER_SORT_INFO,
    INTERCHANGE_SORT_INFO,
    COUNTING_SORT_INFO,
    RADIX_SORT_INFO
} from './chapter2_sorting_searching/demos';

// Chapter 3: Linked Lists
import Chapter3 from './chapter3_linked_list/demos';
export { Chapter3 };
export {
    CHAPTER_3_INFO,
    CHAPTER_3_DEMOS,
    LINKED_LIST_CONCEPTS,
    SINGLY_LINKED_LIST,
    DOUBLY_LINKED_LIST,
    CIRCULAR_LINKED_LIST,
    ARRAY_VS_LINKED_LIST
} from './chapter3_linked_list/demos';

// Chapter 4: Stack & Queue
import Chapter4 from './chapter4_stack_queue/demos';
export { Chapter4 };
export {
    CHAPTER_4_INFO,
    CHAPTER_4_DEMOS,
    LIFO_CONCEPT,
    FIFO_CONCEPT,
    STACK_INFO,
    QUEUE_INFO,
    STACK_VS_QUEUE
} from './chapter4_stack_queue/demos';

// Chapter 5: Binary Search Tree
import Chapter5 from './chapter5_bst/demos';
export { Chapter5 };
export {
    CHAPTER_5_INFO,
    CHAPTER_5_DEMOS,
    TREE_CONCEPTS,
    BST_OPERATIONS,
    TREE_TRAVERSALS,
    SKEWED_TREE_PROBLEM
} from './chapter5_bst/demos';

// ═══════════════════════════════════════════════════════════════════════════
// AGGREGATED EXPORTS - Tổng hợp tất cả chapters
// ═══════════════════════════════════════════════════════════════════════════

import { ChapterNumber } from './types';
import type { ChapterInfo } from './types';

/**
 * Tất cả thông tin các chương
 * 
 * Dùng để:
 * - Hiển thị navigation menu
 * - Tạo learning path UI
 * - Track progress người học
 */
export const ALL_CHAPTERS: Record<ChapterNumber, typeof Chapter1 | typeof Chapter2 | typeof Chapter3 | typeof Chapter4 | typeof Chapter5> = {
    [ChapterNumber.COMPLEXITY]: Chapter1,
    [ChapterNumber.SORTING_SEARCHING]: Chapter2,
    [ChapterNumber.LINKED_LIST]: Chapter3,
    [ChapterNumber.STACK_QUEUE]: Chapter4,
    [ChapterNumber.BST]: Chapter5
};

/**
 * Thông tin cơ bản các chương
 */
export const CHAPTER_INFOS: ChapterInfo[] = [
    Chapter1.info,
    Chapter2.info,
    Chapter3.info,
    Chapter4.info,
    Chapter5.info
];

/**
 * Learning Path - Thứ tự học đề xuất
 * Mỗi chương có prerequisites (điều kiện tiên quyết)
 */
export const LEARNING_PATH = [
    {
        order: 1,
        chapter: ChapterNumber.COMPLEXITY,
        title: 'Algorithm Complexity',
        description: 'Nền tảng: Hiểu Big O trước khi học các thuật toán',
        estimatedTime: '2-3 giờ'
    },
    {
        order: 2,
        chapter: ChapterNumber.SORTING_SEARCHING,
        title: 'Sorting & Searching',
        description: 'Các thuật toán cơ bản nhất trong CS',
        estimatedTime: '4-5 giờ'
    },
    {
        order: 3,
        chapter: ChapterNumber.LINKED_LIST,
        title: 'Linked Lists',
        description: 'Cấu trúc dữ liệu động với con trỏ',
        estimatedTime: '3-4 giờ'
    },
    {
        order: 4,
        chapter: ChapterNumber.STACK_QUEUE,
        title: 'Stack & Queue',
        description: 'LIFO và FIFO - nền tảng cho nhiều thuật toán',
        estimatedTime: '2-3 giờ'
    },
    {
        order: 5,
        chapter: ChapterNumber.BST,
        title: 'Binary Search Tree',
        description: 'Cây nhị phân tìm kiếm - cấu trúc phi tuyến tính',
        estimatedTime: '4-5 giờ'
    }
];

/**
 * Tổng số giờ học ước tính
 */
export const TOTAL_ESTIMATED_HOURS = '15-20 giờ';

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
    // Tất cả chapters
    Chapter1,
    Chapter2,
    Chapter3,
    Chapter4,
    Chapter5,

    // Aggregated data
    allChapters: ALL_CHAPTERS,
    chapterInfos: CHAPTER_INFOS,
    learningPath: LEARNING_PATH,
    totalEstimatedHours: TOTAL_ESTIMATED_HOURS
};
