/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 1: EXERCISES - ALGORITHM COMPLEXITY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * BÀI TẬP THỰC HÀNH:
 * Phân tích độ phức tạp thuật toán, xác định Big O từ code.
 * 
 * @module Chapter1Exercises
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Exercise {
    id: string;
    title: string;
    titleVi: string;
    difficulty: Difficulty;
    description: string;
    codeSnippet?: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    hints?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// BÀI TẬP PHÂN TÍCH ĐỘ PHỨC TẠP
// ═══════════════════════════════════════════════════════════════════════════

export const COMPLEXITY_EXERCISES: Exercise[] = [
    {
        id: 'ch1-ex1',
        title: 'Simple Loop',
        titleVi: 'Vòng lặp đơn giản',
        difficulty: 'easy',
        description: 'Xác định độ phức tạp thời gian của đoạn code sau:',
        codeSnippet: `
function sumArray(arr: number[]): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 'O(n)',
        explanation: 'Vòng for chạy n lần (n = arr.length). Mỗi iteration thực hiện O(1) operations. Tổng: O(n).',
        hints: ['Đếm số lần vòng for chạy', 'n là kích thước input (arr.length)']
    },
    {
        id: 'ch1-ex2',
        title: 'Nested Loops',
        titleVi: 'Vòng lặp lồng nhau',
        difficulty: 'easy',
        description: 'Xác định độ phức tạp thời gian:',
        codeSnippet: `
function printPairs(arr: number[]): void {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            console.log(arr[i], arr[j]);
        }
    }
}`,
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
        correctAnswer: 'O(n²)',
        explanation: 'Vòng ngoài chạy n lần. Với mỗi lần, vòng trong chạy n lần. Tổng: n × n = O(n²).',
        hints: ['Nhân số lần chạy của vòng ngoài và vòng trong']
    },
    {
        id: 'ch1-ex3',
        title: 'Binary Search Pattern',
        titleVi: 'Pattern chia đôi',
        difficulty: 'medium',
        description: 'Xác định độ phức tạp:',
        codeSnippet: `
function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 'O(log n)',
        explanation: 'Mỗi iteration, phạm vi tìm kiếm giảm một nửa. Số iterations = log₂(n).',
        hints: ['Phạm vi giảm bao nhiêu mỗi bước?', 'Công thức: n → n/2 → n/4 → ... → 1']
    },
    {
        id: 'ch1-ex4',
        title: 'Two Loops Sequential',
        titleVi: 'Hai vòng lặp tuần tự',
        difficulty: 'medium',
        description: 'Xác định độ phức tạp:',
        codeSnippet: `
function process(arr: number[]): void {
    // Vòng 1
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
    // Vòng 2
    for (let j = 0; j < arr.length; j++) {
        console.log(arr[j] * 2);
    }
}`,
        options: ['O(n)', 'O(2n)', 'O(n²)', 'O(n + n)'],
        correctAnswer: 'O(n)',
        explanation: 'O(n) + O(n) = O(2n) = O(n). Trong Big O, bỏ hằng số.',
        hints: ['Hai vòng TUẦN TỰ = cộng', 'Hai vòng LỒNG NHAU = nhân']
    },
    {
        id: 'ch1-ex5',
        title: 'Logarithmic Loop',
        titleVi: 'Vòng lặp logarithm',
        difficulty: 'medium',
        description: 'Xác định độ phức tạp:',
        codeSnippet: `
function logLoop(n: number): void {
    let i = n;
    while (i > 1) {
        console.log(i);
        i = Math.floor(i / 2);
    }
}`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(√n)'],
        correctAnswer: 'O(log n)',
        explanation: 'i giảm một nửa mỗi bước: n → n/2 → n/4 → ... → 1. Số bước = log₂(n).',
        hints: ['Khi i chia 2 → O(log n)']
    },
    {
        id: 'ch1-ex6',
        title: 'Merge Sort Complexity',
        titleVi: 'Độ phức tạp Merge Sort',
        difficulty: 'hard',
        description: 'Merge Sort chia mảng làm 2, sort từng nửa, rồi merge. Độ phức tạp là?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 'O(n log n)',
        explanation: 'Có log n levels (chia đôi). Mỗi level, merge tốn O(n). Tổng: O(n log n).',
        hints: ['Recurrence: T(n) = 2T(n/2) + O(n)', 'Master Theorem: a=2, b=2, f(n)=n']
    },
    {
        id: 'ch1-ex7',
        title: 'Space Complexity',
        titleVi: 'Độ phức tạp không gian',
        difficulty: 'medium',
        description: 'Xác định SPACE complexity:',
        codeSnippet: `
function createMatrix(n: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            matrix[i][j] = i * j;
        }
    }
    return matrix;
}`,
        options: ['O(1)', 'O(n)', 'O(n²)', 'O(n log n)'],
        correctAnswer: 'O(n²)',
        explanation: 'Tạo matrix n×n, cần n² ô nhớ → O(n²) space.',
        hints: ['Đếm số phần tử trong matrix', 'n hàng × n cột = ?']
    },
    {
        id: 'ch1-ex8',
        title: 'Recursive Fibonacci',
        titleVi: 'Fibonacci đệ quy',
        difficulty: 'hard',
        description: 'Độ phức tạp của Fibonacci đệ quy naive:',
        codeSnippet: `
function fib(n: number): number {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
        options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(n log n)'],
        correctAnswer: 'O(2ⁿ)',
        explanation: 'Mỗi call sinh 2 calls. Cây đệ quy có height n. Số nodes ≈ 2ⁿ.',
        hints: ['Vẽ cây đệ quy', 'Mỗi level số nodes tăng gấp đôi']
    },
    {
        id: 'ch1-ex9',
        title: 'Compare Complexities',
        titleVi: 'So sánh độ phức tạp',
        difficulty: 'easy',
        description: 'Sắp xếp theo thứ tự TỐT NHẤT → XẤU NHẤT:',
        options: [
            'O(1) < O(log n) < O(n) < O(n log n) < O(n²)',
            'O(log n) < O(1) < O(n) < O(n²) < O(n log n)',
            'O(n) < O(log n) < O(1) < O(n log n) < O(n²)',
            'O(1) < O(n) < O(log n) < O(n²) < O(n log n)'
        ],
        correctAnswer: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²)',
        explanation: 'Thứ tự chuẩn: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)',
        hints: ['O(1) là nhanh nhất', 'Thử với n = 1000']
    },
    {
        id: 'ch1-ex10',
        title: 'Amortized Complexity',
        titleVi: 'Độ phức tạp khấu hao',
        difficulty: 'hard',
        description: 'Dynamic array (ArrayList) double size khi đầy. Push n phần tử có amortized complexity là?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 'O(1)',
        explanation: 'Resize xảy ra hiếm (1, 2, 4, 8...). Tổng cost: n + n/2 + n/4 + ... ≈ 2n. Amortized: 2n/n = O(1) per push.',
        hints: ['Resize phải copy tất cả elements', 'Nhưng resize xảy ra ít thường xuyên']
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Kiểm tra đáp án
 */
export function checkAnswer(exerciseId: string, userAnswer: string): boolean {
    const exercise = COMPLEXITY_EXERCISES.find(e => e.id === exerciseId);
    return exercise?.correctAnswer === userAnswer;
}

/**
 * Lấy exercises theo difficulty
 */
export function getExercisesByDifficulty(difficulty: Difficulty): Exercise[] {
    return COMPLEXITY_EXERCISES.filter(e => e.difficulty === difficulty);
}

/**
 * Tính điểm
 */
export function calculateScore(answers: Record<string, string>): { correct: number; total: number; percentage: number } {
    let correct = 0;
    const total = COMPLEXITY_EXERCISES.length;

    for (const [id, answer] of Object.entries(answers)) {
        if (checkAnswer(id, answer)) correct++;
    }

    return {
        correct,
        total,
        percentage: Math.round((correct / total) * 100)
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
    exercises: COMPLEXITY_EXERCISES,
    checkAnswer,
    getExercisesByDifficulty,
    calculateScore
};
