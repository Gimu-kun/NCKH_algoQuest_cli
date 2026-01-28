/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UNIT TESTS - CHAPTER 2: SORTING & SEARCHING
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Tests for sorting and searching algorithms.
 * 
 * Run: npm test -- --grep "Chapter 2"
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { describe, it, expect } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════
// SORTING ALGORITHMS
// ═══════════════════════════════════════════════════════════════════════════

// Bubble Sort
function bubbleSort(arr: number[]): number[] {
    const result = [...arr];
    for (let i = 0; i < result.length - 1; i++) {
        for (let j = 0; j < result.length - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
            }
        }
    }
    return result;
}

// Selection Sort
function selectionSort(arr: number[]): number[] {
    const result = [...arr];
    for (let i = 0; i < result.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < result.length; j++) {
            if (result[j] < result[minIdx]) minIdx = j;
        }
        [result[i], result[minIdx]] = [result[minIdx], result[i]];
    }
    return result;
}

// Insertion Sort
function insertionSort(arr: number[]): number[] {
    const result = [...arr];
    for (let i = 1; i < result.length; i++) {
        const key = result[i];
        let j = i - 1;
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j];
            j--;
        }
        result[j + 1] = key;
    }
    return result;
}

// Merge Sort
function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    while (i < left.length) result.push(left[i++]);
    while (j < right.length) result.push(right[j++]);
    return result;
}

// Quick Sort
function quickSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = arr.slice(0, -1).filter(x => x <= pivot);
    const right = arr.slice(0, -1).filter(x => x > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}

// Binary Search
function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Linear Search
function linearSearch(arr: number[], target: number): number {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Chapter 2: Sorting Algorithms', () => {
    const testCases = [
        { input: [64, 34, 25, 12, 22, 11, 90], expected: [11, 12, 22, 25, 34, 64, 90] },
        { input: [5, 2, 8, 1, 9], expected: [1, 2, 5, 8, 9] },
        { input: [1], expected: [1] },
        { input: [], expected: [] },
        { input: [3, 3, 3], expected: [3, 3, 3] },
        { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] }, // Reverse sorted
        { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] }  // Already sorted
    ];

    describe('Bubble Sort', () => {
        testCases.forEach(({ input, expected }, i) => {
            it(`Test case ${i + 1}: sorts correctly`, () => {
                expect(bubbleSort(input)).toEqual(expected);
            });
        });
    });

    describe('Selection Sort', () => {
        testCases.forEach(({ input, expected }, i) => {
            it(`Test case ${i + 1}: sorts correctly`, () => {
                expect(selectionSort(input)).toEqual(expected);
            });
        });
    });

    describe('Insertion Sort', () => {
        testCases.forEach(({ input, expected }, i) => {
            it(`Test case ${i + 1}: sorts correctly`, () => {
                expect(insertionSort(input)).toEqual(expected);
            });
        });
    });

    describe('Merge Sort', () => {
        testCases.forEach(({ input, expected }, i) => {
            it(`Test case ${i + 1}: sorts correctly`, () => {
                expect(mergeSort(input)).toEqual(expected);
            });
        });
    });

    describe('Quick Sort', () => {
        testCases.forEach(({ input, expected }, i) => {
            it(`Test case ${i + 1}: sorts correctly`, () => {
                expect(quickSort(input)).toEqual(expected);
            });
        });
    });
});

describe('Chapter 2: Searching Algorithms', () => {
    describe('Binary Search', () => {
        const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        it('finds element at the beginning', () => {
            expect(binarySearch(sortedArray, 1)).toBe(0);
        });

        it('finds element at the end', () => {
            expect(binarySearch(sortedArray, 10)).toBe(9);
        });

        it('finds element in the middle', () => {
            expect(binarySearch(sortedArray, 5)).toBe(4);
        });

        it('returns -1 for non-existent element', () => {
            expect(binarySearch(sortedArray, 11)).toBe(-1);
        });

        it('handles empty array', () => {
            expect(binarySearch([], 5)).toBe(-1);
        });

        it('handles single element array (found)', () => {
            expect(binarySearch([5], 5)).toBe(0);
        });

        it('handles single element array (not found)', () => {
            expect(binarySearch([5], 3)).toBe(-1);
        });
    });

    describe('Linear Search', () => {
        it('finds element in unsorted array', () => {
            expect(linearSearch([4, 2, 7, 1, 3], 7)).toBe(2);
        });

        it('returns first occurrence', () => {
            expect(linearSearch([1, 2, 3, 2, 1], 2)).toBe(1);
        });

        it('returns -1 for non-existent element', () => {
            expect(linearSearch([1, 2, 3], 5)).toBe(-1);
        });
    });
});
