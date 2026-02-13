/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * LEARNING MODULES DATA - PAGE-BASED STRUCTURE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc dữ liệu cho các learning modules theo cơ chế page-based.
 * Mỗi module chứa nhiều pages với các loại content khác nhau.
 * 
 * KIẾN TRÚC MODULE:
 * - Module Level: Chapter > Module > Pages
 * - Page Types: Theory → Demo → Quiz → Practice → Summary
 * - Progress Tracking: Real-time với completion status
 * - Prerequisites: Dependency management giữa các pages/modules
 * 
 * FLOW HỌC TẬP:
 * 1. Chapter Hub: Chọn module để học
 * 2. Module Overview: Xem tổng quan và bắt đầu
 * 3. Page-by-Page Learning: Tuần tự qua từng page
 * 4. Progress Tracking: Theo dõi tiến độ real-time
 * 5. Chapter Completion: Unlock chapter tiếp theo
 * 
 * @module LearningModules
 * @category Data/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { ChapterNumber } from './study_materials/types';
import type {
  LearningModule,
  PageType
} from '../store/learningProgressStore';

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 1: ALGORITHM COMPLEXITY MODULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module 1.1: Big O Notation Fundamentals
 * Mục tiêu: Hiểu khái niệm Big O và cách phân loại độ phức tạp
 */
export const BIG_O_MODULE: LearningModule = {
  id: 'ch1-big-o-basics',
  chapter: ChapterNumber.COMPLEXITY,
  title: 'Big O Notation Cơ Bản',
  description: 'Hiểu khái niệm độ phức tạp thuật toán và cách phân loại Big O',
  totalEstimatedTime: 25, // minutes
  difficulty: 'easy',
  pages: [
    {
      id: 'ch1-p1-theory-intro',
      type: 'theory' as PageType,
      title: 'Giới Thiệu Big O Notation',
      estimatedTime: 8,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-big-o-basics',
      // No prerequisites - page đầu tiên
    },
    {
      id: 'ch1-p2-theory-common',
      type: 'theory' as PageType,
      title: 'Các Loại Độ Phức Tạp Thông Dụng',
      estimatedTime: 10,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-big-o-basics',
      prerequisites: ['ch1-p1-theory-intro'],
    },
    {
      id: 'ch1-p3-demo-visual',
      type: 'demo' as PageType,
      title: 'Minh Họa Độ Phức Tạp',
      estimatedTime: 5,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-big-o-basics',
      prerequisites: ['ch1-p2-theory-common'],
    },
    {
      id: 'ch1-p4-quiz-basics',
      type: 'quiz' as PageType,
      title: 'Kiểm Tra Big O Cơ Bản',
      estimatedTime: 5,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-big-o-basics',
      prerequisites: ['ch1-p3-demo-visual'],
    },
    {
      id: 'ch1-p5-summary',
      type: 'summary' as PageType,
      title: 'Tóm Tắt & Kết Luận',
      estimatedTime: 3,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-big-o-basics',
      prerequisites: ['ch1-p4-quiz-basics'],
    }
  ]
};

/**
 * Module 1.2: Time & Space Complexity Analysis
 * Mục tiêu: Phân tích chi tiết time và space complexity
 */
export const TIME_SPACE_MODULE: LearningModule = {
  id: 'ch1-time-space-analysis',
  chapter: ChapterNumber.COMPLEXITY,
  title: 'Phân Tích Time & Space Complexity',
  description: 'Phân tích chi tiết thời gian và bộ nhớ của thuật toán',
  totalEstimatedTime: 35,
  difficulty: 'medium',
  prerequisites: ['ch1-big-o-basics'], // Cần hoàn thành module trước
  pages: [
    {
      id: 'ch1-p6-theory-time',
      type: 'theory' as PageType,
      title: 'Time Complexity Chi Tiết',
      estimatedTime: 10,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-time-space-analysis',
    },
    {
      id: 'ch1-p7-theory-space',
      type: 'theory' as PageType,
      title: 'Space Complexity và Bộ Nhớ Phụ',
      estimatedTime: 10,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-time-space-analysis',
      prerequisites: ['ch1-p6-theory-time'],
    },
    {
      id: 'ch1-p8-demo-comparison',
      type: 'demo' as PageType,
      title: 'So Sánh Time vs Space',
      estimatedTime: 5,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-time-space-analysis',
      prerequisites: ['ch1-p7-theory-space'],
    },
    {
      id: 'ch1-p9-practice-analysis',
      type: 'practice' as PageType,
      title: 'Thực Hành Phân Tích',
      estimatedTime: 10,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-time-space-analysis',
      prerequisites: ['ch1-p8-demo-comparison'],
    },
    {
      id: 'ch1-p10-quiz-advanced',
      type: 'quiz' as PageType,
      title: 'Kiểm Tra Nâng Cao',
      estimatedTime: 8,
      chapter: ChapterNumber.COMPLEXITY,
      moduleId: 'ch1-time-space-analysis',
      prerequisites: ['ch1-p9-practice-analysis'],
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 2: SORTING & SEARCHING MODULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module 2.1: Basic Sorting Algorithms
 * Mục tiêu: Hiểu và implement các sorting algorithms cơ bản
 */
export const BASIC_SORTING_MODULE: LearningModule = {
  id: 'ch2-basic-sorting',
  chapter: ChapterNumber.SORTING_SEARCHING,
  title: 'Sorting Algorithms Cơ Bản',
  description: 'Bubble Sort, Selection Sort, Insertion Sort và phân tích hiệu suất',
  totalEstimatedTime: 45,
  difficulty: 'easy',
  pages: [
    {
      id: 'ch2-p1-theory-bubble',
      type: 'theory' as PageType,
      title: 'Bubble Sort Algorithm',
      estimatedTime: 12,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-basic-sorting',
    },
    {
      id: 'ch2-p2-demo-bubble',
      type: 'demo' as PageType,
      title: 'Bubble Sort Visualization',
      estimatedTime: 8,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-basic-sorting',
      prerequisites: ['ch2-p1-theory-bubble'],
    },
    {
      id: 'ch2-p3-practice-bubble',
      type: 'practice' as PageType,
      title: 'Implement Bubble Sort',
      estimatedTime: 15,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-basic-sorting',
      prerequisites: ['ch2-p2-demo-bubble'],
    },
    {
      id: 'ch2-p4-quiz-basic-sorting',
      type: 'quiz' as PageType,
      title: 'Basic Sorting Quiz',
      estimatedTime: 10,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-basic-sorting',
      prerequisites: ['ch2-p3-practice-bubble'],
    },
    {
      id: 'ch2-p5-game-sorting',
      type: 'game' as PageType,
      title: 'Game: Đua Sắp Xếp',
      estimatedTime: 10,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-basic-sorting',
      gameType: 'SORTING',
      prerequisites: ['ch2-p4-quiz-basic-sorting']
    }
  ]
};

/**
 * Module 2.2: Advanced Sorting Algorithms
 * Mục tiêu: Hiểu Quick Sort, Merge Sort và phân tích hiệu suất
 */
export const ADVANCED_SORTING_MODULE: LearningModule = {
  id: 'ch2-advanced-sorting',
  chapter: ChapterNumber.SORTING_SEARCHING,
  title: 'Advanced Sorting Algorithms',
  description: 'Quick Sort, Merge Sort và Divide & Conquer strategy',
  totalEstimatedTime: 50,
  difficulty: 'medium',
  prerequisites: ['ch2-basic-sorting'],
  pages: [
    {
      id: 'ch2-p5-theory-divide-conquer',
      type: 'theory' as PageType,
      title: 'Divide & Conquer Strategy',
      estimatedTime: 10,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-advanced-sorting',
    },
    {
      id: 'ch2-p6-theory-quick',
      type: 'theory' as PageType,
      title: 'Quick Sort Algorithm',
      estimatedTime: 15,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-advanced-sorting',
      prerequisites: ['ch2-p5-theory-divide-conquer'],
    },
    {
      id: 'ch2-p7-demo-quick',
      type: 'demo' as PageType,
      title: 'Quick Sort Visualization',
      estimatedTime: 10,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-advanced-sorting',
      prerequisites: ['ch2-p6-theory-quick'],
    },
    {
      id: 'ch2-p8-practice-quick',
      type: 'practice' as PageType,
      title: 'Implement Quick Sort',
      estimatedTime: 15,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-advanced-sorting',
      prerequisites: ['ch2-p7-demo-quick'],
    },
    {
      id: 'ch2-p15-game-merge-sort',
      type: 'game' as PageType,
      title: 'Game: Hợp Nhất Sức Mạnh',
      estimatedTime: 12,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-advanced-sorting',
      gameType: 'MERGE_SORT',
      prerequisites: ['ch2-p8-practice-quick']
    },
    {
      id: 'ch2-game-quick-sort',
      type: 'game' as PageType,
      title: 'Game: Quick Partition',
      estimatedTime: 10,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-advanced-sorting',
      gameType: 'QUICK_SORT',
      prerequisites: ['ch2-p15-game-merge-sort']
    }
  ]
};

/**
 * Module 2.3: Binary Search & Variants
 * Mục tiêu: Master binary search và các biến thể
 */
export const BINARY_SEARCH_MODULE: LearningModule = {
  id: 'ch2-binary-search',
  chapter: ChapterNumber.SORTING_SEARCHING,
  title: 'Binary Search & Applications',
  description: 'Binary search, lower/upper bound, và applications',
  totalEstimatedTime: 40,
  difficulty: 'medium',
  pages: [
    {
      id: 'ch2-p14-game-linear',
      type: 'game' as PageType,
      title: 'Game: Tìm Kiếm Theo Hàng',
      estimatedTime: 8,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-binary-search',
      gameType: 'LINEAR_SEARCH',
    },
    {
      id: 'ch2-p9-theory-binary',
      type: 'theory' as PageType,
      title: 'Binary Search Fundamentals',
      estimatedTime: 12,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-binary-search',
      prerequisites: ['ch2-p14-game-linear']
    },
    {
      id: 'ch2-p10-demo-binary',
      type: 'demo' as PageType,
      title: 'Binary Search Visualization',
      estimatedTime: 8,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-binary-search',
      prerequisites: ['ch2-p9-theory-binary'],
    },
    {
      id: 'ch2-p11-practice-binary',
      type: 'practice' as PageType,
      title: 'Binary Search Problems',
      estimatedTime: 15,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-binary-search',
      prerequisites: ['ch2-p10-demo-binary'],
    },
    {
      id: 'ch2-p12-quiz-searching',
      type: 'quiz' as PageType,
      title: 'Searching Algorithms Quiz',
      estimatedTime: 5,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-binary-search',
      prerequisites: ['ch2-p11-practice-binary'],
    },
    {
      id: 'ch2-p13-game-binary',
      type: 'game' as PageType,
      title: 'Game: Đoán Số Bí Mật',
      estimatedTime: 10,
      chapter: ChapterNumber.SORTING_SEARCHING,
      moduleId: 'ch2-binary-search',
      gameType: 'BINARY_SEARCH',
      prerequisites: ['ch2-p12-quiz-searching']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 3: LINKED LIST MODULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module 3.1: Linked List Fundamentals
 * Mục tiêu: Hiểu cấu trúc linked list cơ bản
 */
export const LINKED_LIST_BASIC_MODULE: LearningModule = {
  id: 'ch3-linked-list-basics',
  chapter: ChapterNumber.LINKED_LIST,
  title: 'Linked List Cơ Bản',
  description: 'Singly linked list, operations cơ bản và implementation',
  totalEstimatedTime: 35,
  difficulty: 'easy',
  pages: [
    {
      id: 'ch3-p1-theory-structure',
      type: 'theory' as PageType,
      title: 'Linked List Structure',
      estimatedTime: 10,
      chapter: ChapterNumber.LINKED_LIST,
      moduleId: 'ch3-linked-list-basics',
    },
    {
      id: 'ch3-p2-demo-operations',
      type: 'demo' as PageType,
      title: 'Basic Operations Visualization',
      estimatedTime: 8,
      chapter: ChapterNumber.LINKED_LIST,
      moduleId: 'ch3-linked-list-basics',
      prerequisites: ['ch3-p1-theory-structure'],
    },
    {
      id: 'ch3-p3-practice-implementation',
      type: 'practice' as PageType,
      title: 'Implement Linked List',
      estimatedTime: 12,
      chapter: ChapterNumber.LINKED_LIST,
      moduleId: 'ch3-linked-list-basics',
      prerequisites: ['ch3-p2-demo-operations'],
    },
    {
      id: 'ch3-p4-quiz-basics',
      type: 'quiz' as PageType,
      title: 'Linked List Basics Quiz',
      estimatedTime: 5,
      chapter: ChapterNumber.LINKED_LIST,
      moduleId: 'ch3-linked-list-basics',
      prerequisites: ['ch3-p3-practice-implementation'],
    },
    {
      id: 'ch3-p5-game-linked-list',
      type: 'game' as PageType,
      title: 'Game: Xây Dựng Kết Nối',
      estimatedTime: 12,
      chapter: ChapterNumber.LINKED_LIST,
      moduleId: 'ch3-linked-list-basics',
      gameType: 'LINKED_LIST',
      prerequisites: ['ch3-p4-quiz-basics']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 4: STACK & QUEUE MODULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module 4.1: Stack & Queue Fundamentals
 */
export const STACK_QUEUE_MODULE: LearningModule = {
  id: 'ch4-stack-queue-basics',
  chapter: ChapterNumber.STACK_QUEUE,
  title: 'Stack & Queue Cơ Bản',
  description: 'Hiểu về LIFO, FIFO và các ứng dụng thực tế',
  totalEstimatedTime: 30,
  difficulty: 'easy',
  pages: [
    {
      id: 'ch4-theory-overview',
      type: 'theory' as PageType,
      title: 'Nguyên Lý Stack & Queue',
      estimatedTime: 10,
      chapter: ChapterNumber.STACK_QUEUE,
      moduleId: 'ch4-stack-queue-basics',
    },
    {
      id: 'ch4-p2-demo-stack',
      type: 'demo' as PageType,
      title: 'Minh Họa Stack (LIFO)',
      estimatedTime: 8,
      chapter: ChapterNumber.STACK_QUEUE,
      moduleId: 'ch4-stack-queue-basics',
      prerequisites: ['ch4-theory-overview'],
    },
    {
      id: 'ch4-p3-demo-queue',
      type: 'demo' as PageType,
      title: 'Minh Họa Queue (FIFO)',
      estimatedTime: 8,
      chapter: ChapterNumber.STACK_QUEUE,
      moduleId: 'ch4-stack-queue-basics',
      prerequisites: ['ch4-theory-overview', 'ch4-p2-demo-stack'],
    },
    {
      id: 'ch4-game-pancake-stack',
      type: 'game' as PageType,
      title: 'Game: Memory Warehouse',
      estimatedTime: 10,
      chapter: ChapterNumber.STACK_QUEUE,
      moduleId: 'ch4-stack-queue-basics',
      gameType: 'STACK',
      prerequisites: ['ch4-p2-demo-stack']
    },
    {
      id: 'ch4-game-ticketing-queue',
      type: 'game' as PageType,
      title: 'Game: Phục Vụ Hành Khách',
      estimatedTime: 10,
      chapter: ChapterNumber.STACK_QUEUE,
      moduleId: 'ch4-stack-queue-basics',
      gameType: 'QUEUE',
      prerequisites: ['ch4-p3-demo-queue']
    },
    {
      id: 'ch4-p4-summary',
      type: 'summary' as PageType,
      title: 'Tóm Tắt Chương 4',
      estimatedTime: 4,
      chapter: ChapterNumber.STACK_QUEUE,
      moduleId: 'ch4-stack-queue-basics',
      prerequisites: ['ch4-p3-demo-queue'],
    },
    {
      id: 'ch4-p5-game-hanoi',
      type: 'game' as PageType,
      title: 'Game: Tháp Hà Nội',
      estimatedTime: 15,
      chapter: ChapterNumber.STACK_QUEUE,
      moduleId: 'ch4-stack-queue-basics',
      gameType: 'HANOI',
      prerequisites: ['ch4-p4-summary']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 5: BINARY SEARCH TREE MODULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module 5.1: Binary Tree Fundamentals
 */
export const BINARY_TREE_FUNDAMENTALS_MODULE: LearningModule = {
  id: 'ch5-binary-tree-basics',
  chapter: ChapterNumber.BST,
  title: 'Cây Nhị Phân Cơ Bản',
  description: 'Các khái niệm về cây, các loại cây nhị phân và cách duyệt cây',
  totalEstimatedTime: 35,
  difficulty: 'medium',
  pages: [
    {
      id: 'ch5-p1-theory-fundamentals',
      type: 'theory' as PageType,
      title: 'Khái Niệm Cây Nhị Phân',
      estimatedTime: 12,
      chapter: ChapterNumber.BST,
      moduleId: 'ch5-binary-tree-basics',
    },
    {
      id: 'ch5-p2-demo-traversal',
      type: 'demo' as PageType,
      title: 'Minh Họa Duyệt Cây',
      estimatedTime: 10,
      chapter: ChapterNumber.BST,
      moduleId: 'ch5-binary-tree-basics',
      prerequisites: ['ch5-p1-theory-fundamentals'],
    }
  ]
};

/**
 * Module 5.2: Binary Search Tree (BST)
 */
export const BST_MODULE: LearningModule = {
  id: 'ch5-bst-advanced',
  chapter: ChapterNumber.BST,
  title: 'Binary Search Tree',
  description: 'Tính chất BST, thao tác tìm kiếm, chèn và xóa',
  totalEstimatedTime: 40,
  difficulty: 'medium',
  prerequisites: ['ch5-binary-tree-basics'],
  pages: [
    {
      id: 'ch5-theory-overview',
      type: 'theory' as PageType,
      title: 'Tính Chất & Thao Tác BST',
      estimatedTime: 15,
      chapter: ChapterNumber.BST,
      moduleId: 'ch5-bst-advanced',
    },
    {
      id: 'ch5-p4-demo-bst',
      type: 'demo' as PageType,
      title: 'Minh Họa BST',
      estimatedTime: 12,
      chapter: ChapterNumber.BST,
      moduleId: 'ch5-bst-advanced',
      prerequisites: ['ch5-theory-overview'],
    },
    {
      id: 'ch5-p5-summary',
      type: 'summary' as PageType,
      title: 'Tóm Tắt Chương 5',
      estimatedTime: 5,
      chapter: ChapterNumber.BST,
      moduleId: 'ch5-bst-advanced',
      prerequisites: ['ch5-p4-demo-bst'],
    },
    {
      id: 'ch5-p6-game-bst-search',
      type: 'game' as PageType,
      title: 'Game: Truy Tìm Kho Báu Trên Cây',
      estimatedTime: 10,
      chapter: ChapterNumber.BST,
      moduleId: 'ch5-bst-advanced',
      gameType: 'BST_SEARCH',
      prerequisites: ['ch5-p5-summary']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// NEW MODULES: ADVANCED ALGORITHMS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module 2.4: More Sorting Algorithms
 */
export const MORE_SORTING_MODULE: LearningModule = {
  id: 'ch2-more-sorting',
  chapter: ChapterNumber.SORTING_SEARCHING,
  title: 'Các Thuật Toán Sắp Xếp Khác',
  description: 'Interchange Sort, Shaker Sort, Shell Sort',
  totalEstimatedTime: 40,
  difficulty: 'medium',
  prerequisites: ['ch2-basic-sorting'],
  pages: [
    { id: 'ch2-theory-interchange', type: 'theory' as PageType, title: 'Interchange Sort', estimatedTime: 10, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-more-sorting' },
    { id: 'ch2-theory-shaker', type: 'theory' as PageType, title: 'Shaker Sort', estimatedTime: 10, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-more-sorting', prerequisites: ['ch2-theory-interchange'] },
    { id: 'ch2-demo-shaker', type: 'demo' as PageType, title: 'Minh Họa Shaker Sort', estimatedTime: 8, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-more-sorting', prerequisites: ['ch2-theory-shaker'] },
    { id: 'ch2-theory-shell', type: 'theory' as PageType, title: 'Shell Sort (Diminishing Increment)', estimatedTime: 15, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-more-sorting', prerequisites: ['ch2-demo-shaker'] },
    { id: 'ch2-demo-shell', type: 'demo' as PageType, title: 'Minh Họa Shell Sort', estimatedTime: 10, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-more-sorting', prerequisites: ['ch2-theory-shell'] }
  ]
};

/**
 * Module 2.5: Efficient Sorting Algorithms
 */
export const EFFICIENT_SORTING_MODULE: LearningModule = {
  id: 'ch2-efficient-sorting',
  chapter: ChapterNumber.SORTING_SEARCHING,
  title: 'Sắp Xếp Hiệu Quả Cao',
  description: 'Heap Sort, Radix Sort, Counting Sort',
  totalEstimatedTime: 50,
  difficulty: 'hard',
  prerequisites: ['ch2-advanced-sorting'],
  pages: [
    { id: 'ch2-theory-heap', type: 'theory' as PageType, title: 'Heap Sort Logic', estimatedTime: 15, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-efficient-sorting' },
    { id: 'ch2-game-heap', type: 'game' as PageType, title: 'Game: Max-Heap Master', estimatedTime: 12, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-efficient-sorting', gameType: 'HEAP_SORT', prerequisites: ['ch2-theory-heap'] },
    { id: 'ch2-theory-counting', type: 'theory' as PageType, title: 'Counting Sort (Non-comparison)', estimatedTime: 15, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-efficient-sorting', prerequisites: ['ch2-game-heap'] },
    { id: 'ch2-game-counting', type: 'game' as PageType, title: 'Game: Đếm Số Thần Tốc', estimatedTime: 10, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-efficient-sorting', gameType: 'COUNTING_SORT', prerequisites: ['ch2-theory-counting'] },
    { id: 'ch2-theory-radix', type: 'theory' as PageType, title: 'Radix Sort (LSD)', estimatedTime: 20, chapter: ChapterNumber.SORTING_SEARCHING, moduleId: 'ch2-efficient-sorting', prerequisites: ['ch2-game-counting'] }
  ]
};

/**
 * Module 3.2: Advanced Linked Lists
 */
export const ADVANCED_LINKED_LIST_MODULE: LearningModule = {
  id: 'ch3-advanced-linked-list',
  chapter: ChapterNumber.LINKED_LIST,
  title: 'Linked List Nâng Cao',
  description: 'Doubly Linked List, Circular Linked List',
  totalEstimatedTime: 30,
  difficulty: 'medium',
  prerequisites: ['ch3-linked-list-basics'],
  pages: [
    { id: 'ch3-theory-doubly', type: 'theory' as PageType, title: 'Doubly Linked List Properties', estimatedTime: 15, chapter: ChapterNumber.LINKED_LIST, moduleId: 'ch3-advanced-linked-list' },
    { id: 'ch3-game-playlist', type: 'game' as PageType, title: 'Game: Máy Phát Nhạc DLL', estimatedTime: 10, chapter: ChapterNumber.LINKED_LIST, moduleId: 'ch3-advanced-linked-list', gameType: 'DOUBLY_LINKED_LIST', prerequisites: ['ch3-theory-doubly'] },
    { id: 'ch3-theory-circular', type: 'theory' as PageType, title: 'Circular Linked List', estimatedTime: 10, chapter: ChapterNumber.LINKED_LIST, moduleId: 'ch3-advanced-linked-list', prerequisites: ['ch3-game-playlist'] },
    { id: 'ch3-game-circular', type: 'game' as PageType, title: 'Game: Vòng Quay May Mắn', estimatedTime: 10, chapter: ChapterNumber.LINKED_LIST, moduleId: 'ch3-advanced-linked-list', gameType: 'CIRCULAR_LINKED_LIST', prerequisites: ['ch3-theory-circular'] }
  ]
};

/**
 * Module 4.2: Advanced Queues
 */
export const ADVANCED_QUEUE_MODULE: LearningModule = {
  id: 'ch4-advanced-queues',
  chapter: ChapterNumber.STACK_QUEUE,
  title: 'Hàng Đợi Ưu Tiên & Deque',
  description: 'Priority Queue, Deque và ứng dụng trong tìm đường',
  totalEstimatedTime: 40,
  difficulty: 'hard',
  prerequisites: ['ch4-stack-queue-basics'],
  pages: [
    { id: 'ch4-theory-dq', type: 'theory' as PageType, title: 'Deque (Double-ended Queue)', estimatedTime: 10, chapter: ChapterNumber.STACK_QUEUE, moduleId: 'ch4-advanced-queues' },
    { id: 'ch4-game-dq', type: 'game' as PageType, title: 'Game: Vận Chuyển Linh Hoạt (Deque)', estimatedTime: 12, chapter: ChapterNumber.STACK_QUEUE, moduleId: 'ch4-advanced-queues', gameType: 'DEQUE', prerequisites: ['ch4-theory-dq'] },
    { id: 'ch4-demo-dq', type: 'demo' as PageType, title: 'Minh Họa Deque', estimatedTime: 8, chapter: ChapterNumber.STACK_QUEUE, moduleId: 'ch4-advanced-queues', prerequisites: ['ch4-game-dq'] },
    { id: 'ch4-theory-pq', type: 'theory' as PageType, title: 'Priority Queue', estimatedTime: 15, chapter: ChapterNumber.STACK_QUEUE, moduleId: 'ch4-advanced-queues', prerequisites: ['ch4-demo-dq'] },
    { id: 'ch4-game-pq', type: 'game' as PageType, title: 'Game: Phòng Cấp Cứu', estimatedTime: 12, chapter: ChapterNumber.STACK_QUEUE, moduleId: 'ch4-advanced-queues', gameType: 'PRIORITY_QUEUE', prerequisites: ['ch4-theory-pq'] },
    { id: 'ch4-game-pathfinding', type: 'game' as PageType, title: 'Game: Tìm Đường (Dijkstra)', estimatedTime: 15, chapter: ChapterNumber.STACK_QUEUE, moduleId: 'ch4-advanced-queues', gameType: 'PATHFINDING', prerequisites: ['ch4-game-pq'] }
  ]
};

/**
 * Module 5.3: Balanced Trees
 */
export const AVL_TREE_MODULE: LearningModule = {
  id: 'ch5-avl-tree',
  chapter: ChapterNumber.BST,
  title: 'Cây Cân Bằng (AVL)',
  description: 'Cấu trúc cây AVL và các thao tác xoay cây',
  totalEstimatedTime: 45,
  difficulty: 'hard',
  prerequisites: ['ch5-bst-advanced'],
  pages: [
    { id: 'ch5-theory-avl', type: 'theory' as PageType, title: 'Cây Cân Bằng (AVL)', estimatedTime: 15, chapter: ChapterNumber.BST, moduleId: 'ch5-avl-tree' },
    { id: 'ch5-demo-avl', type: 'demo' as PageType, title: 'Minh Họa Tự Cân Bằng', estimatedTime: 10, chapter: ChapterNumber.BST, moduleId: 'ch5-avl-tree', prerequisites: ['ch5-theory-avl'] },
    { id: 'ch5-game-avl-rotate', type: 'game' as PageType, title: 'Game: Xoay Cây Cân Bằng', estimatedTime: 12, chapter: ChapterNumber.BST, moduleId: 'ch5-avl-tree', gameType: 'AVL_TREE', prerequisites: ['ch5-demo-avl'] }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 6: GRAPH & GRID ALGORITHMS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module 6.1: Grid-based Pathfinding
 */
export const GRIDS_MODULE: LearningModule = {
  id: 'ch6-grid-basics',
  chapter: ChapterNumber.GRAPH_GRID,
  title: 'Thuật Toán Trên Lưới (Grid)',
  description: 'Maze, Flood Fill và Đếm Đảo',
  totalEstimatedTime: 45,
  difficulty: 'medium',
  pages: [
    { id: 'ch6-theory-grid', type: 'theory' as PageType, title: 'Cấu Trúc Lưới (Grid)', estimatedTime: 10, chapter: ChapterNumber.GRAPH_GRID, moduleId: 'ch6-grid-basics' },
    { id: 'ch6-game-maze', type: 'game' as PageType, title: 'Game: Thoát Khỏi Mê Cung', estimatedTime: 15, chapter: ChapterNumber.GRAPH_GRID, moduleId: 'ch6-grid-basics', gameType: 'MAZE', prerequisites: ['ch6-theory-grid'] },
    { id: 'ch6-game-flood', type: 'game' as PageType, title: 'Game: Loang Màu (Flood Fill)', estimatedTime: 12, chapter: ChapterNumber.GRAPH_GRID, moduleId: 'ch6-grid-basics', gameType: 'FLOOD_FILL', prerequisites: ['ch6-game-maze'] },
    { id: 'ch6-game-island', type: 'game' as PageType, title: 'Game: Đếm Đảo Đào Vàng', estimatedTime: 12, chapter: ChapterNumber.GRAPH_GRID, moduleId: 'ch6-grid-basics', gameType: 'ISLAND', prerequisites: ['ch6-game-flood'] }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// ALL MODULES AGGREGATE
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_LEARNING_MODULES: LearningModule[] = [
  BIG_O_MODULE,
  TIME_SPACE_MODULE,
  BASIC_SORTING_MODULE,
  MORE_SORTING_MODULE,
  ADVANCED_SORTING_MODULE,
  EFFICIENT_SORTING_MODULE,
  BINARY_SEARCH_MODULE,
  LINKED_LIST_BASIC_MODULE,
  ADVANCED_LINKED_LIST_MODULE,
  STACK_QUEUE_MODULE,
  ADVANCED_QUEUE_MODULE,
  BINARY_TREE_FUNDAMENTALS_MODULE,
  BST_MODULE,
  AVL_TREE_MODULE,
  GRIDS_MODULE
];

// ═══════════════════════════════════════════════════════════════════════════
// DATA ACCESS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lấy tất cả modules trong một chapter
 */
export function getModulesByChapter(chapter: ChapterNumber): LearningModule[] {
  return ALL_LEARNING_MODULES.filter(module => module.chapter === chapter);
}

/**
 * Lấy module theo ID
 */
export function getModuleById(moduleId: string): LearningModule | undefined {
  return ALL_LEARNING_MODULES.find(module => module.id === moduleId);
}

/**
 * Lấy module tiếp theo trong learning path
 */
export function getNextModule(currentModuleId: string): LearningModule | null {
  const currentIndex = ALL_LEARNING_MODULES.findIndex(m => m.id === currentModuleId);
  if (currentIndex === -1 || currentIndex === ALL_LEARNING_MODULES.length - 1) {
    return null;
  }

  return ALL_LEARNING_MODULES[currentIndex + 1];
}

/**
 * Lấy tất cả modules (cho development/testing)
 */
export function getAllModules(): LearningModule[] {
  return ALL_LEARNING_MODULES;
}