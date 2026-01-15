/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 4: EXERCISES - STACK & QUEUE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * BÀI TẬP THỰC HÀNH:
 * Các bài tập về ứng dụng Stack và Queue.
 * 
 * @module Chapter4Exercises
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { Difficulty } from '../chapter1_complexity/exercises';

export interface StackQueueChallenge {
    id: string;
    title: string;
    titleVi: string;
    difficulty: Difficulty;
    category: 'stack' | 'queue' | 'both';
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    starterCode: string;
    hints: string[];
    solution: string;
    complexity: { time: string; space: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// STACK CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════

export const STACK_QUEUE_CHALLENGES: StackQueueChallenge[] = [
    {
        id: 'ch4-sq1',
        title: 'Valid Parentheses',
        titleVi: 'Ngoặc hợp lệ',
        difficulty: 'easy',
        category: 'stack',
        description: 'Kiểm tra chuỗi ngoặc có hợp lệ không: (), [], {}',
        examples: [
            { input: '"()"', output: 'true' },
            { input: '"()[]{}"', output: 'true' },
            { input: '"(]"', output: 'false' },
            { input: '"([)]"', output: 'false' }
        ],
        starterCode: `
function isValid(s: string): boolean {
    // TODO: Kiểm tra ngoặc hợp lệ
    // Hint: Dùng Stack
    return false;
}`,
        hints: [
            'Push ngoặc mở vào stack',
            'Khi gặp ngoặc đóng, pop và kiểm tra match',
            'Cuối cùng stack phải rỗng'
        ],
        solution: `
function isValid(s: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = {
        ')': '(',
        ']': '[',
        '}': '{'
    };
    
    for (const c of s) {
        if (c === '(' || c === '[' || c === '{') {
            stack.push(c);
        } else {
            if (stack.pop() !== pairs[c]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`,
        complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
        id: 'ch4-sq2',
        title: 'Min Stack',
        titleVi: 'Stack với getMin O(1)',
        difficulty: 'medium',
        category: 'stack',
        description: 'Implement stack hỗ trợ getMin() trong O(1).',
        examples: [
            {
                input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
                output: '-3, -2'
            }
        ],
        starterCode: `
class MinStack {
    // TODO: Implement MinStack
    
    push(val: number): void { }
    pop(): void { }
    top(): number { return 0; }
    getMin(): number { return 0; }
}`,
        hints: [
            'Dùng 2 stacks: 1 cho data, 1 cho min values',
            'Hoặc: mỗi element lưu cả value và minSoFar'
        ],
        solution: `
class MinStack {
    private stack: number[] = [];
    private minStack: number[] = [];
    
    push(val: number): void {
        this.stack.push(val);
        const currentMin = this.minStack.length === 0 
            ? val 
            : Math.min(val, this.minStack[this.minStack.length - 1]);
        this.minStack.push(currentMin);
    }
    
    pop(): void {
        this.stack.pop();
        this.minStack.pop();
    }
    
    top(): number {
        return this.stack[this.stack.length - 1];
    }
    
    getMin(): number {
        return this.minStack[this.minStack.length - 1];
    }
}`,
        complexity: { time: 'O(1) all operations', space: 'O(n)' }
    },
    {
        id: 'ch4-sq3',
        title: 'Evaluate Postfix Expression',
        titleVi: 'Tính biểu thức Postfix',
        difficulty: 'medium',
        category: 'stack',
        description: 'Tính giá trị biểu thức Postfix (RPN).',
        examples: [
            { input: '["2","1","+","3","*"]', output: '9', explanation: '((2+1)*3) = 9' },
            { input: '["4","13","5","/","+"]', output: '6', explanation: '(4+(13/5)) = 6' }
        ],
        starterCode: `
function evalRPN(tokens: string[]): number {
    // TODO: Evaluate Reverse Polish Notation
    return 0;
}`,
        hints: [
            'Push số vào stack',
            'Khi gặp operator: pop 2 số, tính, push kết quả',
            'Cuối cùng stack còn 1 phần tử = kết quả'
        ],
        solution: `
function evalRPN(tokens: string[]): number {
    const stack: number[] = [];
    const operators = new Set(['+', '-', '*', '/']);
    
    for (const token of tokens) {
        if (operators.has(token)) {
            const b = stack.pop()!;
            const a = stack.pop()!;
            let result: number;
            
            switch (token) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = Math.trunc(a / b); break;
                default: result = 0;
            }
            
            stack.push(result);
        } else {
            stack.push(parseInt(token));
        }
    }
    
    return stack[0];
}`,
        complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
        id: 'ch4-sq4',
        title: 'Implement Queue using Stacks',
        titleVi: 'Cài đặt Queue bằng Stack',
        difficulty: 'easy',
        category: 'both',
        description: 'Implement Queue chỉ dùng 2 Stacks.',
        examples: [
            { input: 'push(1), push(2), peek(), pop(), empty()', output: '1, 1, false' }
        ],
        starterCode: `
class MyQueue {
    // TODO: Implement Queue using 2 Stacks
    
    push(x: number): void { }
    pop(): number { return 0; }
    peek(): number { return 0; }
    empty(): boolean { return true; }
}`,
        hints: [
            'Dùng 2 stacks: inStack và outStack',
            'Push vào inStack',
            'Pop từ outStack (chuyển từ inStack nếu rỗng)'
        ],
        solution: `
class MyQueue {
    private inStack: number[] = [];
    private outStack: number[] = [];
    
    push(x: number): void {
        this.inStack.push(x);
    }
    
    pop(): number {
        this.move();
        return this.outStack.pop()!;
    }
    
    peek(): number {
        this.move();
        return this.outStack[this.outStack.length - 1];
    }
    
    empty(): boolean {
        return this.inStack.length === 0 && this.outStack.length === 0;
    }
    
    private move(): void {
        if (this.outStack.length === 0) {
            while (this.inStack.length > 0) {
                this.outStack.push(this.inStack.pop()!);
            }
        }
    }
}`,
        complexity: { time: 'O(1) amortized', space: 'O(n)' }
    },
    {
        id: 'ch4-sq5',
        title: 'Sliding Window Maximum',
        titleVi: 'Max trong cửa sổ trượt',
        difficulty: 'hard',
        category: 'queue',
        description: 'Tìm max trong mỗi cửa sổ kích thước k.',
        examples: [
            {
                input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
                output: '[3,3,5,5,6,7]',
                explanation: 'Window [1,3,-1]→3, [3,-1,-3]→3, ...'
            }
        ],
        starterCode: `
function maxSlidingWindow(nums: number[], k: number): number[] {
    // TODO: Sliding Window Maximum
    // Hint: Dùng Deque (Double-ended Queue)
    return [];
}`,
        hints: [
            'Dùng Deque lưu INDEX (không phải giá trị)',
            'Giữ deque giảm dần theo giá trị',
            'Front của deque là max của window hiện tại'
        ],
        solution: `
function maxSlidingWindow(nums: number[], k: number): number[] {
    const result: number[] = [];
    const deque: number[] = []; // Lưu index
    
    for (let i = 0; i < nums.length; i++) {
        // Xóa index ngoài window
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // Xóa các index có giá trị nhỏ hơn nums[i]
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Khi window đủ kích thước
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}`,
        complexity: { time: 'O(n)', space: 'O(k)' }
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
    challenges: STACK_QUEUE_CHALLENGES,
    stackChallenges: STACK_QUEUE_CHALLENGES.filter(c => c.category === 'stack'),
    queueChallenges: STACK_QUEUE_CHALLENGES.filter(c => c.category === 'queue')
};
