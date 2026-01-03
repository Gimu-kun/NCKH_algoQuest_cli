/**
 * Sample Question Bank - Chapter 2: Search & Sort
 * Expanding question variety
 */

import { QuestionType, BloomLevel } from '../models/Question';
import type { QuestionBank } from '../models/Question';

export const CHAPTER_2_QUESTIONS: QuestionBank = {
    chapter: 2,
    title: 'Search & Sort Algorithms',
    description: 'Linear search, binary search, and sorting algorithms',
    questions: [
        // MCQ - Remember
        {
            id: 'ch2_mcq_r_001',
            type: QuestionType.MULTIPLE_CHOICE,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Binary Search',
            question: 'Binary Search requires the array to be:',
            options: [
                'Sorted in ascending or descending order',
                'Unsorted',
                'Full of unique elements',
                'Of even length'
            ],
            correctAnswer: 0,
            explanation: 'Binary Search only works on sorted arrays because it relies on comparison to eliminate half the search space.'
        },

        {
            id: 'ch2_mcq_r_002',
            type: QuestionType.MULTIPLE_CHOICE,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Bubble Sort',
            question: 'What does Bubble Sort do in each pass?',
            options: [
                'Finds the minimum element',
                'Swaps adjacent elements if they are in wrong order',
                'Divides array into two halves',
                'Selects a pivot element'
            ],
            correctAnswer: 1,
            explanation: 'Bubble Sort compares adjacent elements and swaps them if needed, "bubbling" larger elements to the end.'
        },

        // Fill in Blank - Understand
        {
            id: 'ch2_fill_u_001',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 20,
            topic: 'Time Complexity',
            question: 'Binary Search has a time complexity of ___ while Linear Search has ___.',
            blanks: [
                { text: 'Binary Search has a time complexity of ', answer: 'O(log n)', caseSensitive: false },
                { text: ' while Linear Search has ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Binary Search eliminates half the elements each step (logarithmic), while Linear Search checks each element (linear).'
        },

        {
            id: 'ch2_fill_u_002',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 20,
            topic: 'Sorting',
            question: 'The best case time complexity of Bubble Sort is ___ when the array is already sorted.',
            blanks: [
                { text: 'The best case time complexity of Bubble Sort is ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'When already sorted, Bubble Sort only needs one pass to verify, taking O(n) time.'
        },

        // Matching - Understand
        {
            id: 'ch2_match_u_001',
            type: QuestionType.MATCHING,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 20,
            topic: 'Algorithm Comparison',
            question: 'Match each algorithm with its time complexity:',
            leftColumn: [
                { id: 'l1', text: 'Linear Search' },
                { id: 'l2', text: 'Binary Search' },
                { id: 'l3', text: 'Bubble Sort' },
                { id: 'l4', text: 'Quick Sort (average)' }
            ],
            rightColumn: [
                { id: 'r1', text: 'O(n)' },
                { id: 'r2', text: 'O(log n)' },
                { id: 'r3', text: 'O(n²)' },
                { id: 'r4', text: 'O(n log n)' }
            ],
            correctMatches: [
                { leftId: 'l1', rightId: 'r1' },
                { leftId: 'l2', rightId: 'r2' },
                { leftId: 'l3', rightId: 'r3' },
                { leftId: 'l4', rightId: 'r4' }
            ]
        },

        // Programming - Apply
        {
            id: 'prog_ch2_bubbleSort',
            type: QuestionType.PROGRAMMING,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 30,
            topic: 'Sorting',
            question: 'Implement Bubble Sort to sort an array in ascending order.',
            functionName: 'bubbleSort',
            starterCode: `void bubbleSort(int arr[], int size) {
    // Your code here
}`,
            testCases: [
                {
                    input: 'arr = [5, 2, 8, 1, 9], size = 5',
                    expectedOutput: '[1, 2, 5, 8, 9]',
                    description: 'Unsorted array'
                },
                {
                    input: 'arr = [1, 2, 3, 4], size = 4',
                    expectedOutput: '[1, 2, 3, 4]',
                    description: 'Already sorted'
                },
                {
                    input: 'arr = [3], size = 1',
                    expectedOutput: '[3]',
                    description: 'Single element'
                }
            ],
            hints: [
                'Use nested loops: outer loop for passes, inner for comparisons',
                'Compare arr[j] with arr[j+1]',
                'Swap if arr[j] > arr[j+1]',
                'Optimize: reduce inner loop by i each pass'
            ]
        },

        {
            id: 'prog_ch2_binarySearch',
            type: QuestionType.PROGRAMMING,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 30,
            topic: 'Searching',
            question: 'Implement Binary Search to find a target value. Return index or -1.',
            functionName: 'binarySearch',
            starterCode: `int binarySearch(int arr[], int size, int target) {
    // Your code here
    return -1;
}`,
            testCases: [
                {
                    input: 'arr = [1, 3, 5, 7, 9], size = 5, target = 7',
                    expectedOutput: '3',
                    description: 'Target exists in middle'
                },
                {
                    input: 'arr = [1, 3, 5, 7, 9], size = 5, target = 1',
                    expectedOutput: '0',
                    description: 'Target at beginning'
                },
                {
                    input: 'arr = [1, 3, 5, 7, 9], size = 5, target = 4',
                    expectedOutput: '-1',
                    description: 'Target not found'
                }
            ],
            hints: [
                'Use two pointers: left = 0, right = size - 1',
                'Calculate mid = (left + right) / 2',
                'If arr[mid] == target, return mid',
                'If arr[mid] < target, search right half',
                'If arr[mid] > target, search left half'
            ]
        }
    ]
};

export default CHAPTER_2_QUESTIONS;
