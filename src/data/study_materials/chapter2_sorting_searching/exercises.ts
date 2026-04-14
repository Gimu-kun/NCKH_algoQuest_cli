/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 2: EXERCISES - SORTING & SEARCHING
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * BÀI TẬP THỰC HÀNH:
 * Implement và phân tích các thuật toán sorting/searching.
 * 
 * @module Chapter2Exercises
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { Difficulty, Exercise } from '../chapter1_complexity/exercises';

// ═══════════════════════════════════════════════════════════════════════════
// CODING CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════

export interface CodingChallenge {
    id: string;
    title: string;
    titleVi: string;
    difficulty: Difficulty;
    description: string;
    starterCode: string;
    testCases: { input: any; expected: any }[];
    hints?: string[];
    solution: string;
}

export const SORTING_CHALLENGES: CodingChallenge[] = [
    {
        id: 'ch2-sort1',
        title: 'Implement Bubble Sort',
        titleVi: 'Cài đặt Bubble Sort',
        difficulty: 'easy',
        description: 'Implement hàm bubbleSort sắp xếp mảng tăng dần.',
        starterCode: `
function bubbleSort(arr: number[]): number[] {
    // TODO: Implement bubble sort
    // Hint: So sánh cặp liền kề, swap nếu sai thứ tự
    return arr;
}`,
        testCases: [
            { input: [64, 34, 25, 12, 22, 11, 90], expected: [11, 12, 22, 25, 34, 64, 90] },
            { input: [5, 1, 4, 2, 8], expected: [1, 2, 4, 5, 8] },
            { input: [1], expected: [1] },
            { input: [], expected: [] }
        ],
        hints: [
            'Dùng 2 vòng for lồng nhau',
            'Vòng ngoài: i từ 0 đến n-2',
            'Vòng trong: j từ 0 đến n-i-2',
            'Swap khi arr[j] > arr[j+1]'
        ],
        solution: `
function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`
    },
    {
        id: 'ch2-sort2',
        title: 'Implement Binary Search',
        titleVi: 'Cài đặt Binary Search',
        difficulty: 'easy',
        description: 'Implement binary search trả về index của target, -1 nếu không tìm thấy.',
        starterCode: `
function binarySearch(arr: number[], target: number): number {
    // TODO: Implement binary search
    // Hint: Chia đôi phạm vi tìm kiếm mỗi bước
    return -1;
}`,
        testCases: [
            { input: [[1, 2, 3, 4, 5], 3], expected: 2 },
            { input: [[1, 2, 3, 4, 5], 1], expected: 0 },
            { input: [[1, 2, 3, 4, 5], 5], expected: 4 },
            { input: [[1, 2, 3, 4, 5], 6], expected: -1 }
        ],
        hints: [
            'Dùng left và right pointers',
            'mid = Math.floor((left + right) / 2)',
            'So sánh arr[mid] với target'
        ],
        solution: `
function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
    },
    {
        id: 'ch2-sort3',
        title: 'Kth Largest Element',
        titleVi: 'Phần tử lớn thứ K',
        difficulty: 'medium',
        description: 'Tìm phần tử lớn thứ k trong mảng (k bắt đầu từ 1).',
        starterCode: `
function findKthLargest(arr: number[], k: number): number {
    // TODO: Tìm phần tử lớn thứ k
    // Có thể dùng sorting hoặc QuickSelect
    return 0;
}`,
        testCases: [
            { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
            { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
            { input: [[1], 1], expected: 1 }
        ],
        hints: [
            'Cách đơn giản: Sort giảm dần, lấy index k-1',
            'Cách tối ưu: QuickSelect O(n) average'
        ],
        solution: `
function findKthLargest(arr: number[], k: number): number {
    arr.sort((a, b) => b - a);
    return arr[k - 1];
}`
    },
    {
        id: 'ch2-sort4',
        title: 'Merge Two Sorted Arrays',
        titleVi: 'Trộn hai mảng đã sắp xếp',
        difficulty: 'medium',
        description: 'Trộn 2 mảng đã sorted thành 1 mảng sorted.',
        starterCode: `
function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
    // TODO: Merge hai mảng đã sorted
    // Hint: Two pointers technique
    return [];
}`,
        testCases: [
            { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
            { input: [[1, 2, 3], [4, 5, 6]], expected: [1, 2, 3, 4, 5, 6] },
            { input: [[], [1, 2]], expected: [1, 2] }
        ],
        hints: [
            'Dùng 2 pointers, mỗi pointer cho 1 array',
            'So sánh và push phần tử nhỏ hơn vào result',
            'Xử lý phần còn lại khi 1 array hết'
        ],
        solution: `
function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result.push(arr1[i++]);
        } else {
            result.push(arr2[j++]);
        }
    }
    
    while (i < arr1.length) result.push(arr1[i++]);
    while (j < arr2.length) result.push(arr2[j++]);
    
    return result;
}`
    },
    {
        id: 'ch2-sort5',
        title: 'Count Inversions',
        titleVi: 'Đếm số nghịch thế',
        difficulty: 'hard',
        description: 'Đếm số cặp (i, j) với i < j và arr[i] > arr[j].',
        starterCode: `
function countInversions(arr: number[]): number {
    // TODO: Đếm số nghịch thế
    // Hint: Có thể dùng Merge Sort modified
    return 0;
}`,
        testCases: [
            { input: [2, 4, 1, 3, 5], expected: 3 },
            { input: [1, 2, 3, 4, 5], expected: 0 },
            { input: [5, 4, 3, 2, 1], expected: 10 }
        ],
        hints: [
            'Brute force: O(n²)',
            'Optimal: Modified Merge Sort O(n log n)',
            'Count inversions during merge step'
        ],
        solution: `
function countInversions(arr: number[]): number {
    let count = 0;
    // Brute force approach
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) count++;
        }
    }
    return count;
}`
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ EXERCISES
// ═══════════════════════════════════════════════════════════════════════════

export const SORTING_QUIZ: Exercise[] = [
    {
        id: 'ch2-quiz1',
        title: 'Stable Sort',
        titleVi: 'Sắp xếp ổn định',
        difficulty: 'medium',
        description: 'Thuật toán nào sau đây KHÔNG stable?',
        options: ['Merge Sort', 'Insertion Sort', 'Quick Sort', 'Bubble Sort'],
        correctAnswer: 'Quick Sort',
        explanation: 'Quick Sort không stable vì partition có thể đảo thứ tự các phần tử bằng nhau.'
    },
    {
        id: 'ch2-quiz2',
        title: 'Best for Nearly Sorted',
        titleVi: 'Tốt nhất cho mảng gần sorted',
        difficulty: 'medium',
        description: 'Thuật toán nào TỐT NHẤT cho mảng gần như đã sắp xếp?',
        options: ['Quick Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
        correctAnswer: 'Insertion Sort',
        explanation: 'Insertion Sort có O(n) best case. Với mảng gần sorted, ít phải shift.'
    },
    {
        id: 'ch2-quiz3',
        title: 'In-place Sorting',
        titleVi: 'Sắp xếp tại chỗ',
        difficulty: 'easy',
        description: 'Thuật toán nào KHÔNG in-place (cần O(n) bộ nhớ phụ)?',
        options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
        correctAnswer: 'Merge Sort',
        explanation: 'Merge Sort cần O(n) space cho mảng tạm khi merge.'
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function runTestCases(challenge: CodingChallenge, userFunction: Function): { passed: number; failed: number; results: any[] } {
    const results: any[] = [];
    let passed = 0, failed = 0;

    for (const testCase of challenge.testCases) {
        try {
            const input = Array.isArray(testCase.input) ? testCase.input : [testCase.input];
            const result = userFunction(...input);
            const isPass = JSON.stringify(result) === JSON.stringify(testCase.expected);

            if (isPass) passed++;
            else failed++;

            results.push({
                input: testCase.input,
                expected: testCase.expected,
                actual: result,
                passed: isPass
            });
        } catch (error) {
            failed++;
            results.push({
                input: testCase.input,
                expected: testCase.expected,
                error: String(error),
                passed: false
            });
        }
    }

    return { passed, failed, results };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
    codingChallenges: SORTING_CHALLENGES,
    quiz: SORTING_QUIZ,
    runTestCases
};
