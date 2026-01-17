/**
 * =============================================================================
 * FILE: algo_registry.ts
 * =============================================================================
 * CENTRAL REGISTRY FOR ALGORITHMS & DEMOS
 * Shared between AlgoLab and StudyMaterialsPage
 * =============================================================================
 */

// =============================================================================
// IMPORTS: All Algorithm Implementations
// =============================================================================

// Chapter 1: Overview
import * as ComplexityAnalysis from '../algo_demos/Chapter_1_Overview/ComplexityAnalysis';

// Chapter 2: Search & Sort
import { binarySearch } from '../algo_demos/Chapter_2_Search_Sort/BinarySearch';
import { linearSearch } from '../algo_demos/Chapter_2_Search_Sort/LinearSearch';
import { bubbleSort } from '../algo_demos/Chapter_2_Search_Sort/BubbleSort';
import { selectionSort } from '../algo_demos/Chapter_2_Search_Sort/SelectionSort';
import { insertionSort } from '../algo_demos/Chapter_2_Search_Sort/InsertionSort';
import { mergeSort } from '../algo_demos/Chapter_2_Search_Sort/MergeSort';
import { quickSort } from '../algo_demos/Chapter_2_Search_Sort/QuickSort';
import { heapSort } from '../algo_demos/Chapter_2_Search_Sort/HeapSort';
import { shellSort } from '../algo_demos/Chapter_2_Search_Sort/ShellSort';
import { shakerSort } from '../algo_demos/Chapter_2_Search_Sort/ShakerSort';
import { interchangeSort } from '../algo_demos/Chapter_2_Search_Sort/InterchangeSort';
import { binaryInsertionSort } from '../algo_demos/Chapter_2_Search_Sort/BinaryInsertionSort';
import { countingSort } from '../algo_demos/Chapter_2_Search_Sort/CountingSort';
import { radixSort } from '../algo_demos/Chapter_2_Search_Sort/RadixSort';

// Chapter 3: Linked List
import { LinkedList } from '../algo_demos/Chapter_3_LinkedList/LinkedList';
import { DoublyLinkedList } from '../algo_demos/Chapter_3_LinkedList/DoublyLinkedList';
import { CircularSinglyLinkedList } from '../algo_demos/Chapter_3_LinkedList/CircularLinkedList';

// Chapter 4: Stack & Queue
import { Stack } from '../algo_demos/Chapter_4_Stack_Queue/Stack';
import { Queue } from '../algo_demos/Chapter_4_Stack_Queue/Queue';
import { Deque } from '../algo_demos/Chapter_4_Stack_Queue/Deque';
import { PriorityQueue, MaxHeap, MinHeap } from '../algo_demos/Chapter_4_Stack_Queue/PriorityQueue';

// Chapter 5: BST & Trees
import { BinaryTree, buildTreeFromArray } from '../algo_demos/Chapter_5_BST/BinaryTree';
import { BinarySearchTree } from '../algo_demos/Chapter_5_BST/BinarySearchTree';
import { AVLTree } from '../algo_demos/Chapter_5_BST/AVLTree';

// =============================================================================
// TYPES
// =============================================================================

export type VisualizationType =
    | 'sorting'
    | 'binarySearch'
    | 'linearSearch'
    | 'stack'
    | 'queue'
    | 'linkedList'
    | 'bst'
    | 'graph'
    | 'dp'
    | 'complexity';

export type SortingAlgorithmType = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 'shell' | 'shaker' | 'interchange' | 'binaryInsertion' | 'counting' | 'radix';
export type GraphAlgorithmType = 'bfs' | 'dfs';
export type DPAlgorithmType = 'fibonacci' | 'knapsack';

export interface AlgoMetadata {
    id: string;
    name: string;
    description: string;
    icon: string;
    inputType: 'array' | 'array_target' | 'active_node' | 'number' | 'interactive' | 'none';
    defaultArray?: number[];
    defaultTarget?: number;
    visualization: VisualizationType;
    sortingType?: SortingAlgorithmType;
    graphType?: GraphAlgorithmType;
    dpType?: DPAlgorithmType;
    timeComplexity: string;
    spaceComplexity: string;
    execute?: (arr: number[], target?: number) => any;
}

export interface Chapter {
    id: string;
    title: string;
    icon: string;
    algos: AlgoMetadata[];
}

// =============================================================================
// REGISTRY - Full Algorithm List
// =============================================================================

export const ALGO_REGISTRY: Chapter[] = [
    // =========================================================================
    // SECTION A: TỔNG QUAN & NỀN TẢNG
    // =========================================================================
    {
        id: 'section_a',
        title: 'A. TỔNG QUAN & NỀN TẢNG',
        icon: 'fi fi-rr-foundation',
        algos: [
            {
                id: 'algo_overview',
                name: ' Tổng quan Thuật toán',
                description: 'Định nghĩa, Big-O, và Phân loại',
                icon: 'fi fi-rr-info',
                inputType: 'none',
                visualization: 'complexity',
                timeComplexity: 'N/A',
                spaceComplexity: 'N/A',
            },
            {
                id: 'pointer',
                name: ' Pointer (Con trỏ)',
                description: 'Cơ chế quản lý bộ nhớ',
                icon: 'fi fi-rr-vector-alt',
                inputType: 'none',
                visualization: 'complexity',
                timeComplexity: 'N/A',
                spaceComplexity: 'N/A',
            },
            {
                id: 'ds_overview',
                name: ' Tổng quan Cấu trúc dữ liệu',
                description: 'Data Structure & ADT',
                icon: 'fi fi-rr-structure',
                inputType: 'none',
                visualization: 'complexity',
                timeComplexity: 'N/A',
                spaceComplexity: 'N/A',
            },
        ],
    },

    // =========================================================================
    // SECTION B: CẤU TRÚC DỮ LIỆU TUYẾN TÍNH
    // =========================================================================
    {
        id: 'section_b',
        title: 'B. CẤU TRÚC DỮ LIỆU TUYẾN TÍNH',
        icon: 'fi fi-rr-list',
        algos: [
            {
                id: 'arrays_strings',
                name: ' Mảng & Chuỗi',
                description: 'Cấu trúc dữ liệu cơ bản nhất',
                icon: 'fi fi-rr-brackets-square',
                inputType: 'array',
                defaultArray: [10, 20, 30, 40, 50],
                visualization: 'linearSearch',
                timeComplexity: 'O(1) / O(n)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'linkedList',
                name: ' Linked List (Đơn)',
                description: 'Danh sách liên kết đơn',
                icon: 'fi fi-rr-link-alt',
                inputType: 'array',
                defaultArray: [10, 20, 30, 40],
                visualization: 'linkedList',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const list = new LinkedList<number>(); arr.forEach(v => list.append(v)); return list; },
            },
            {
                id: 'doublyLinkedList',
                name: ' Doubly Linked List',
                description: 'Danh sách liên kết đôi',
                icon: 'fi fi-rr-exchange',
                inputType: 'array',
                defaultArray: [10, 20, 30, 40],
                visualization: 'linkedList',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const list = new DoublyLinkedList<number>(); arr.forEach(v => list.insertAtTail(v)); return list; },
            },
            {
                id: 'circularLinkedList',
                name: ' Circular Linked List',
                description: 'Danh sách liên kết vòng',
                icon: 'fi fi-rr-rotate-right',
                inputType: 'array',
                defaultArray: [10, 20, 30, 40],
                visualization: 'linkedList',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const list = new CircularSinglyLinkedList<number>(); arr.forEach(v => list.insertAtTail(v)); return list; },
            },
            {
                id: 'stack',
                name: ' Stack',
                description: 'LIFO - Vào sau ra trước',
                icon: 'fi fi-rr-layers',
                inputType: 'array',
                defaultArray: [10, 20, 30],
                visualization: 'stack',
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const s = new Stack<number>(); arr.forEach(v => s.push(v)); return s; },
            },
            {
                id: 'queue',
                name: ' Queue',
                description: 'FIFO - Vào trước ra trước',
                icon: 'fi fi-rr-arrow-alt-right',
                inputType: 'array',
                defaultArray: [10, 20, 30],
                visualization: 'queue',
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const q = new Queue<number>(); arr.forEach(v => q.enqueue(v)); return q; },
            },
            {
                id: 'deque',
                name: ' Deque (Double-Ended Queue)',
                description: 'Hàng đợi hai đầu',
                icon: 'fi fi-rr-arrows-h',
                inputType: 'array',
                defaultArray: [10, 20, 30],
                visualization: 'queue',
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const d = new Deque<number>(); arr.forEach(v => d.addRear(v)); return d; },
            },
            {
                id: 'priorityQueue',
                name: ' Priority Queue',
                description: 'Hàng đợi ưu tiên',
                icon: 'fi fi-rr-sort-amount-up',
                inputType: 'array',
                defaultArray: [30, 10, 50, 20, 40],
                visualization: 'queue',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const pq = new MaxHeap(); arr.forEach(v => pq.insert(v)); return pq; },
            },
        ],
    },

    // =========================================================================
    // SECTION C: CẤU TRÚC DỮ LIỆU PHI TUYẾN TÍNH
    // =========================================================================
    {
        id: 'section_c',
        title: 'C. CẤU TRÚC DỮ LIỆU PHI TUYẾN TÍNH',
        icon: 'fi fi-rr-chart-tree',
        algos: [
            {
                id: 'binaryTree',
                name: ' Binary Tree',
                description: 'Cây nhị phân cơ bản',
                icon: 'fi fi-rr-network',
                inputType: 'array',
                defaultArray: [1, 2, 3, 4, 5, 6, 7],
                visualization: 'bst',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => buildTreeFromArray(arr),
            },
            {
                id: 'bst',
                name: ' Binary Search Tree (BST)',
                description: 'Cây nhị phân tìm kiếm',
                icon: 'fi fi-rr-folder-tree',
                inputType: 'array',
                defaultArray: [50, 30, 70, 20, 40, 60, 80],
                visualization: 'bst',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const bst = new BinarySearchTree<number>(); arr.forEach(v => bst.insert(v)); return bst; },
            },
            {
                id: 'avlTree',
                name: ' AVL Tree',
                description: 'Cây cân bằng tự động',
                icon: 'fi fi-rr-balance-scale-right',
                inputType: 'array',
                defaultArray: [30, 20, 40, 10, 25, 35, 50],
                visualization: 'bst',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => { const avl = new AVLTree(); arr.forEach(v => avl.insert(v)); return avl; },
            },
        ],
    },

    // =========================================================================
    // SECTION D: TÌM KIẾM
    // =========================================================================
    {
        id: 'section_d',
        title: 'D. TÌM KIẾM',
        icon: 'fi fi-rr-search-alt',
        algos: [
            {
                id: 'linearSearch',
                name: ' Linear Search',
                description: 'Tìm kiếm tuần tự',
                icon: 'fi fi-rr-search',
                inputType: 'array_target',
                defaultArray: [10, 20, 30, 40, 50, 60, 70, 80],
                defaultTarget: 30,
                visualization: 'linearSearch',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                execute: (arr, target) => linearSearch(arr, target!),
            },
            {
                id: 'binarySearch',
                name: ' Binary Search',
                description: 'Tìm kiếm nhị phân (mảng đã sắp xếp)',
                icon: 'fi fi-rr-zoom-in',
                inputType: 'array_target',
                defaultArray: [10, 20, 30, 40, 50, 60, 70, 80],
                defaultTarget: 50,
                visualization: 'binarySearch',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(1)',
                execute: (arr, target) => binarySearch(arr, target!),
            },
        ],
    },

    // =========================================================================
    // SECTION E: SẮP XẾP
    // =========================================================================
    {
        id: 'section_e',
        title: 'E. SẮP XẾP (SORTING)',
        icon: 'fi fi-rr-sort',
        algos: [
            {
                id: 'bubbleSort',
                name: ' Bubble Sort',
                description: 'Sắp xếp nổi bọt',
                icon: 'fi fi-rr-circle',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'bubble',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => bubbleSort([...arr]),
            },
            {
                id: 'selectionSort',
                name: ' Selection Sort',
                description: 'Sắp xếp chọn',
                icon: 'fi fi-rr-cursor',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'selection',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => selectionSort([...arr]),
            },
            {
                id: 'insertionSort',
                name: ' Insertion Sort',
                description: 'Sắp xếp chèn',
                icon: 'fi fi-rr-arrow-down',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'insertion',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => insertionSort([...arr]),
            },
            {
                id: 'interchangeSort',
                name: ' Interchange Sort',
                description: 'Sắp xếp đổi chỗ trực tiếp',
                icon: 'fi fi-rr-exchange-alt',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'interchange',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => interchangeSort([...arr]),
            },
            {
                id: 'shakerSort',
                name: ' Shaker Sort (Cocktail)',
                description: 'Sắp xếp lắc (Bubble 2 chiều)',
                icon: 'fi fi-rr-glass-cheers',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'shaker',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => shakerSort([...arr]),
            },
            {
                id: 'shellSort',
                name: ' Shell Sort',
                description: 'Cải tiến của Insertion Sort',
                icon: 'fi fi-rr-filter',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'shell',
                timeComplexity: 'O(n log² n)',
                spaceComplexity: 'O(1)',
                execute: (arr) => shellSort([...arr]),
            },
            {
                id: 'binaryInsertionSort',
                name: ' Binary Insertion Sort',
                description: 'Insertion Sort với Binary Search',
                icon: 'fi fi-rr-sitemap',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'binaryInsertion',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => binaryInsertionSort([...arr]),
            },
            {
                id: 'mergeSort',
                name: ' Merge Sort',
                description: 'Sắp xếp trộn (Divide & Conquer)',
                icon: 'fi fi-rr-clone',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'merge',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => mergeSort([...arr]),
            },
            {
                id: 'quickSort',
                name: ' Quick Sort',
                description: 'Sắp xếp nhanh (Divide & Conquer)',
                icon: 'fi fi-rr-bolt',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'quick',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(log n)',
                execute: (arr) => quickSort([...arr]),
            },
            {
                id: 'heapSort',
                name: ' Heap Sort',
                description: 'Sắp xếp vun đống',
                icon: 'fi fi-rr-chart-pyramid',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'heap',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(1)',
                execute: (arr) => heapSort([...arr]),
            },
            {
                id: 'countingSort',
                name: ' Counting Sort',
                description: 'Sắp xếp đếm (Non-comparison)',
                icon: 'fi fi-rr-tally',
                inputType: 'array',
                defaultArray: [4, 2, 2, 8, 3, 3, 1],
                visualization: 'sorting',
                sortingType: 'counting',
                timeComplexity: 'O(n + k)',
                spaceComplexity: 'O(k)',
                execute: (arr) => countingSort([...arr]),
            },
            {
                id: 'radixSort',
                name: ' Radix Sort',
                description: 'Sắp xếp theo cơ số',
                icon: 'fi fi-rr-calculator',
                inputType: 'array',
                defaultArray: [170, 45, 75, 90, 802, 24, 2, 66],
                visualization: 'sorting',
                sortingType: 'radix',
                timeComplexity: 'O(nk)',
                spaceComplexity: 'O(n + k)',
                execute: (arr) => radixSort([...arr]),
            },
        ],
    },
];

// =============================================================================
// EXPORT: Re-export all algorithm classes for direct use
// =============================================================================
export {
    // Data Structures
    LinkedList,
    DoublyLinkedList,
    CircularSinglyLinkedList,
    Stack,
    Queue,
    Deque,
    PriorityQueue,
    MaxHeap,
    MinHeap,
    BinaryTree,
    buildTreeFromArray,
    BinarySearchTree,
    AVLTree,
    // Algorithms
    linearSearch,
    binarySearch,
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort,
    heapSort,
    shellSort,
    shakerSort,
    interchangeSort,
    binaryInsertionSort,
    countingSort,
    radixSort,
    ComplexityAnalysis,
};
