/**
 * =============================================================================
 * FILE: algo_registry.ts
 * =============================================================================
 * CENTRAL REGISTRY FOR ALGORITHMS & DEMOS
 * Shared between AlgoLab and StudyMaterialsPage
 * =============================================================================
 */

// Import Algorithms
import { binarySearch } from '../algo_demos/Chapter_2_Search_Sort/BinarySearch';
import { bubbleSort } from '../algo_demos/Chapter_2_Search_Sort/BubbleSort';

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
    icon: string; // Flaticon class
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
// REGISTRY
// =============================================================================

export const ALGO_REGISTRY: Chapter[] = [
    {
        id: 'section_a',
        title: 'A. TỔNG QUAN & NỀN TẢNG',
        icon: 'fi fi-rr-foundation',
        algos: [
            {
                id: 'algo_overview',
                name: '1. Tổng quan Thuật toán',
                description: 'Định nghĩa, Big-O, và Phân loại',
                icon: 'fi fi-rr-info',
                inputType: 'none',
                visualization: 'complexity',
                timeComplexity: 'N/A',
                spaceComplexity: 'N/A',
            },
            {
                id: 'pointer',
                name: '2. Pointer (Con trỏ)',
                description: 'Cơ chế quản lý bộ nhớ',
                icon: 'fi fi-rr-vector-alt',
                inputType: 'none',
                visualization: 'complexity',
                timeComplexity: 'N/A',
                spaceComplexity: 'N/A',
            },
            {
                id: 'ds_overview',
                name: '3. Tổng quan Cấu trúc dữ liệu',
                description: 'Data Structure & ADT',
                icon: 'fi fi-rr-structure',
                inputType: 'none',
                visualization: 'complexity',
                timeComplexity: 'N/A',
                spaceComplexity: 'N/A',
            },
        ],
    },
    {
        id: 'section_b',
        title: 'B. CẤU TRÚC DỮ LIỆU TUYẾN TÍNH',
        icon: 'fi fi-rr-list',
        algos: [
            {
                id: 'arrays_strings',
                name: '4. Mảng & Chuỗi',
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
                name: '5. Linked List',
                description: 'Danh sách liên kết',
                icon: 'fi fi-rr-link-alt',
                inputType: 'array',
                defaultArray: [10, 20, 30, 40],
                visualization: 'linkedList',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'stack',
                name: '6. Stack',
                description: 'LIFO - Vào sau ra trước',
                icon: 'fi fi-rr-layers',
                inputType: 'array',
                defaultArray: [10, 20, 30],
                visualization: 'stack',
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'queue',
                name: '7. Queue',
                description: 'FIFO - Vào trước ra trước',
                icon: 'fi fi-rr-arrow-alt-right',
                inputType: 'array',
                defaultArray: [10, 20, 30],
                visualization: 'queue',
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(n)',
            },
        ],
    },
    {
        id: 'section_c',
        title: 'C. CẤU TRÚC DỮ LIỆU PHI TUYẾN TÍNH',
        icon: 'fi fi-rr-chart-tree',
        algos: [
            {
                id: 'tree_binaryTree',
                name: '8. Tree & Binary Tree',
                description: 'Cấu trúc cây phân cấp',
                icon: 'fi fi-rr-network',
                inputType: 'array',
                defaultArray: [1, 2, 3, 4, 5, 6, 7],
                visualization: 'bst', // Using BST viz for generic tree demo for now
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'bst',
                name: '9. Binary Search Tree (BST)',
                description: 'Cây nhị phân tìm kiếm',
                icon: 'fi fi-rr-folder-tree',
                inputType: 'array',
                defaultArray: [50, 30, 70, 20, 40, 60, 80],
                visualization: 'bst',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'avlTree',
                name: '10. AVL Tree',
                description: 'Cây cân bằng (Balanced)',
                icon: 'fi fi-rr-balance-scale-right',
                inputType: 'array',
                defaultArray: [30, 20, 40, 10, 25, 35, 50],
                visualization: 'bst',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(n)',
            },
        ],
    },
    {
        id: 'section_d',
        title: 'D. TÌM KIẾM & SẮP XẾP',
        icon: 'fi fi-rr-search-alt',
        algos: [
            {
                id: 'searching',
                name: '11. Searching',
                description: 'Linear & Binary Search',
                icon: 'fi fi-rr-search',
                inputType: 'array_target',
                defaultArray: [10, 20, 30, 40, 50, 60, 70, 80],
                defaultTarget: 30,
                visualization: 'binarySearch',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(1)',
                execute: (arr, target) => binarySearch(arr, target!),
            },
            {
                id: 'sorting',
                name: '12. Sorting',
                description: 'Các thuật toán sắp xếp',
                icon: 'fi fi-rr-sort-amount-down',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'bubble',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(1)',
                execute: (arr) => bubbleSort([...arr]),
            },
        ],
    },
];
