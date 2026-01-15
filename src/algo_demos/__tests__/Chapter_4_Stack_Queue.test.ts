/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UNIT TESTS - CHAPTER 4: STACK & QUEUE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Tests for Stack and Queue operations.
 * 
 * Run: npm test -- --grep "Chapter 4"
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { describe, it, expect, beforeEach } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════
// STACK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEUE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class Queue<T> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    front(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function isValidParentheses(s: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

    for (const c of s) {
        if (c === '(' || c === '[' || c === '{') {
            stack.push(c);
        } else {
            if (stack.pop() !== pairs[c]) return false;
        }
    }

    return stack.length === 0;
}

function evalPostfix(tokens: string[]): number {
    const stack: number[] = [];
    const operators = new Set(['+', '-', '*', '/']);

    for (const token of tokens) {
        if (operators.has(token)) {
            const b = stack.pop()!;
            const a = stack.pop()!;
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(Math.trunc(a / b)); break;
            }
        } else {
            stack.push(parseInt(token));
        }
    }

    return stack[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Chapter 4: Stack', () => {
    let stack: Stack<number>;

    beforeEach(() => {
        stack = new Stack<number>();
    });

    describe('push and pop', () => {
        it('follows LIFO order', () => {
            stack.push(1);
            stack.push(2);
            stack.push(3);
            expect(stack.pop()).toBe(3);
            expect(stack.pop()).toBe(2);
            expect(stack.pop()).toBe(1);
        });

        it('returns undefined for empty stack', () => {
            expect(stack.pop()).toBeUndefined();
        });
    });

    describe('peek', () => {
        it('returns top without removing', () => {
            stack.push(1);
            stack.push(2);
            expect(stack.peek()).toBe(2);
            expect(stack.size()).toBe(2);
        });

        it('returns undefined for empty stack', () => {
            expect(stack.peek()).toBeUndefined();
        });
    });

    describe('isEmpty and size', () => {
        it('isEmpty returns true for empty stack', () => {
            expect(stack.isEmpty()).toBe(true);
        });

        it('isEmpty returns false for non-empty stack', () => {
            stack.push(1);
            expect(stack.isEmpty()).toBe(false);
        });

        it('size returns correct count', () => {
            expect(stack.size()).toBe(0);
            stack.push(1);
            stack.push(2);
            expect(stack.size()).toBe(2);
        });
    });
});

describe('Chapter 4: Queue', () => {
    let queue: Queue<number>;

    beforeEach(() => {
        queue = new Queue<number>();
    });

    describe('enqueue and dequeue', () => {
        it('follows FIFO order', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            expect(queue.dequeue()).toBe(1);
            expect(queue.dequeue()).toBe(2);
            expect(queue.dequeue()).toBe(3);
        });

        it('returns undefined for empty queue', () => {
            expect(queue.dequeue()).toBeUndefined();
        });
    });

    describe('front', () => {
        it('returns front without removing', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            expect(queue.front()).toBe(1);
            expect(queue.size()).toBe(2);
        });
    });
});

describe('Chapter 4: Stack Applications', () => {
    describe('Valid Parentheses', () => {
        it('returns true for valid parentheses', () => {
            expect(isValidParentheses('()')).toBe(true);
            expect(isValidParentheses('()[]{}')).toBe(true);
            expect(isValidParentheses('{[]}')).toBe(true);
        });

        it('returns false for invalid parentheses', () => {
            expect(isValidParentheses('(]')).toBe(false);
            expect(isValidParentheses('([)]')).toBe(false);
            expect(isValidParentheses('(((')).toBe(false);
        });

        it('returns true for empty string', () => {
            expect(isValidParentheses('')).toBe(true);
        });
    });

    describe('Postfix Evaluation', () => {
        it('evaluates simple expression', () => {
            expect(evalPostfix(['2', '1', '+', '3', '*'])).toBe(9); // (2+1)*3
        });

        it('evaluates complex expression', () => {
            expect(evalPostfix(['4', '13', '5', '/', '+'])).toBe(6); // 4+(13/5)
        });

        it('handles single number', () => {
            expect(evalPostfix(['42'])).toBe(42);
        });
    });
});
