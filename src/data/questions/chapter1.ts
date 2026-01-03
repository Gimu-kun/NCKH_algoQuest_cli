/**
 * Sample Question Bank - Chapter 1: Algorithm Overview
 * This is a subset of the 1830+ question bank
 */

import { QuestionType, BloomLevel } from '../models/Question';
import type { QuestionBank } from '../models/Question';


export const CHAPTER_1_QUESTIONS: QuestionBank = {
    chapter: 1,
    title: 'Algorithm Overview & Complexity',
    description: 'Introduction to algorithmic thinking and Big O notation',
    questions: [
        // REMEMBER level - Multiple Choice
        {
            id: 'ch1_mcq_r_001',
            type: QuestionType.MULTIPLE_CHOICE,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Big O Notation',
            question: 'What does O(n) complexity mean?',
            options: [
                'Constant time',
                'Linear time - time grows proportionally with input size',
                'Logarithmic time',
                'Quadratic time'
            ],
            correctAnswer: 1,
            explanation: 'O(n) means linear time complexity. If input size doubles, execution time doubles.'
        },

        {
            id: 'ch1_mcq_r_002',
            type: QuestionType.MULTIPLE_CHOICE,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Algorithm Definition',
            question: 'What is an algorithm?',
            options: [
                'A programming language',
                'A step-by-step procedure to solve a problem',
                'A type of data structure',
                'A computer program'
            ],
            correctAnswer: 1,
            explanation: 'An algorithm is a well-defined sequence of steps to solve a problem.'
        },

        // UNDERSTAND level - Fill in the Blank
        {
            id: 'ch1_fill_u_001',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 20,
            topic: 'Time Complexity',
            question: 'Complete the statement: In Big O notation, we focus on the ___ term and ignore ___.',
            blanks: [
                { text: 'In Big O notation, we focus on the ', answer: 'dominant', caseSensitive: false },
                { text: ' term and ignore ', answer: 'constants', caseSensitive: false }
            ],
            explanation: 'We focus on the dominant (fastest-growing) term and ignore constant factors.'
        },

        // UNDERSTAND level - Matching
        {
            id: 'ch1_match_u_001',
            type: QuestionType.MATCHING,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 20,
            topic: 'Complexity Classes',
            question: 'Match each complexity class with its description:',
            leftColumn: [
                { id: 'l1', text: 'O(1)' },
                { id: 'l2', text: 'O(log n)' },
                { id: 'l3', text: 'O(n)' },
                { id: 'l4', text: 'O(n²)' }
            ],
            rightColumn: [
                { id: 'r1', text: 'Constant time' },
                { id: 'r2', text: 'Linear time' },
                { id: 'r3', text: 'Logarithmic time' },
                { id: 'r4', text: 'Quadratic time' }
            ],
            correctMatches: [
                { leftId: 'l1', rightId: 'r1' },
                { leftId: 'l2', rightId: 'r3' },
                { leftId: 'l3', rightId: 'r2' },
                { leftId: 'l4', rightId: 'r4' }
            ]
        },

        // ANALYZE level - Fill in the Blank (Code Analysis)
        {
            id: 'ch1_fill_an_001',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 50,
            topic: 'Complexity Analysis',
            question: `Analyze this code:
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        sum += arr[i][j];
    }
}
The time complexity is ___.`,
            blanks: [
                { text: 'The time complexity is ', answer: 'O(n²)', caseSensitive: false }
            ],
            explanation: 'Nested loops both running n times result in O(n²) quadratic complexity.'
        },

        // APPLY level - Programming Exercise
        {
            id: 'prog_ch1_isIncreasing',
            type: QuestionType.PROGRAMMING,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 30,
            topic: 'Array Analysis',
            question: 'Write a function that checks if an array is sorted in increasing order.',
            functionName: 'isIncreasing',
            starterCode: `bool isIncreasing(int arr[], int size) {
    // Your code here
    return false;
}`,
            testCases: [
                {
                    input: 'arr = [1, 2, 3, 4, 5], size = 5',
                    expectedOutput: 'true',
                    description: 'Sorted array'
                },
                {
                    input: 'arr = [5, 4, 3, 2, 1], size = 5',
                    expectedOutput: 'false',
                    description: 'Reverse sorted array'
                },
                {
                    input: 'arr = [1], size = 1',
                    expectedOutput: 'true',
                    description: 'Single element'
                },
                {
                    input: 'arr = [1, 3, 2, 4], size = 4',
                    expectedOutput: 'false',
                    description: 'Unsorted array'
                }
            ],
            syntaxRules: [
                'Must use a loop',
                'Must compare adjacent elements',
                'Must return bool'
            ],
            memoryRules: [
                'No dynamic allocation needed'
            ],
            hints: [
                'Loop through the array from index 0 to size-2',
                'Compare each element with the next one',
                'If any element is greater than the next, return false',
                'If the loop completes, return true'
            ]
        }
    ]
};

export default CHAPTER_1_QUESTIONS;
