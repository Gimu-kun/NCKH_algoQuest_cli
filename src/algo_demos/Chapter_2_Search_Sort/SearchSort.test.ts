import { describe, it, expect } from 'vitest';
import { binarySearch } from './BinarySearch';
import { linearSearch } from './LinearSearch';
import { bubbleSort } from './BubbleSort';
import { quickSort } from './QuickSort';
import { mergeSort } from './MergeSort';
import { selectionSort } from './SelectionSort';
import { insertionSort } from './InsertionSort';

describe('Chapter 2: Search & Sort Algorithms', () => {

    // --- SEARCH ---
    describe('Binary Search', () => {
        const sortedArr = [1, 3, 5, 7, 9, 11, 13, 15];
        it('should find element in sorted array', () => {
            expect(binarySearch(sortedArr, 7)).toBe(3);
            expect(binarySearch(sortedArr, 1)).toBe(0);
            expect(binarySearch(sortedArr, 15)).toBe(7);
        });
        it('should return -1 if not found', () => {
            expect(binarySearch(sortedArr, 10)).toBe(-1);
        });
    });

    describe('Linear Search', () => {
        const arr = [10, 50, 30, 70, 80, 20];
        it('should find element in unsorted array', () => {
            expect(linearSearch(arr, 30)).toBe(2);
        });
        it('should return -1 if not found', () => {
            expect(linearSearch(arr, 99)).toBe(-1);
        });
    });

    // --- SORTING ---
    const unsortedArg = () => [64, 34, 25, 12, 22, 11, 90];
    const sortedRes = [11, 12, 22, 25, 34, 64, 90];

    describe('Bubble Sort', () => {
        it('should sort array correctly', () => {
            expect(bubbleSort(unsortedArg())).toEqual(sortedRes);
        });
    });

    describe('Quick Sort', () => {
        it('should sort array correctly', () => {
            expect(quickSort(unsortedArg())).toEqual(sortedRes);
        });
    });

    describe('Merge Sort', () => {
        it('should sort array correctly', () => {
            expect(mergeSort(unsortedArg())).toEqual(sortedRes);
        });
    });

    describe('Selection Sort', () => {
        it('should sort array correctly', () => {
            expect(selectionSort(unsortedArg())).toEqual(sortedRes);
        });
    });

    describe('Insertion Sort', () => {
        it('should sort array correctly', () => {
            expect(insertionSort(unsortedArg())).toEqual(sortedRes);
        });
    });
});
