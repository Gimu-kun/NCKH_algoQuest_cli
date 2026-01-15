/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UNIT TESTS - CHAPTER 3: LINKED LIST
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Tests for Linked List operations.
 * 
 * Run: npm test -- --grep "Chapter 3"
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { describe, it, expect, beforeEach } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════
// LINKED LIST IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

interface ListNode<T> {
    data: T;
    next: ListNode<T> | null;
}

class LinkedList<T> {
    head: ListNode<T> | null = null;

    insertAtHead(data: T): void {
        this.head = { data, next: this.head };
    }

    insertAtTail(data: T): void {
        const newNode: ListNode<T> = { data, next: null };
        if (!this.head) {
            this.head = newNode;
            return;
        }
        let current = this.head;
        while (current.next) current = current.next;
        current.next = newNode;
    }

    delete(data: T): boolean {
        if (!this.head) return false;
        if (this.head.data === data) {
            this.head = this.head.next;
            return true;
        }
        let current = this.head;
        while (current.next && current.next.data !== data) {
            current = current.next;
        }
        if (current.next) {
            current.next = current.next.next;
            return true;
        }
        return false;
    }

    search(data: T): ListNode<T> | null {
        let current = this.head;
        while (current) {
            if (current.data === data) return current;
            current = current.next;
        }
        return null;
    }

    reverse(): void {
        let prev: ListNode<T> | null = null;
        let current = this.head;
        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.head = prev;
    }

    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }

    size(): number {
        let count = 0;
        let current = this.head;
        while (current) {
            count++;
            current = current.next;
        }
        return count;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Chapter 3: Linked List', () => {
    let list: LinkedList<number>;

    beforeEach(() => {
        list = new LinkedList<number>();
    });

    describe('insertAtHead', () => {
        it('inserts into empty list', () => {
            list.insertAtHead(1);
            expect(list.toArray()).toEqual([1]);
        });

        it('inserts at head of non-empty list', () => {
            list.insertAtHead(1);
            list.insertAtHead(2);
            list.insertAtHead(3);
            expect(list.toArray()).toEqual([3, 2, 1]);
        });
    });

    describe('insertAtTail', () => {
        it('inserts into empty list', () => {
            list.insertAtTail(1);
            expect(list.toArray()).toEqual([1]);
        });

        it('inserts at tail of non-empty list', () => {
            list.insertAtTail(1);
            list.insertAtTail(2);
            list.insertAtTail(3);
            expect(list.toArray()).toEqual([1, 2, 3]);
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            list.insertAtTail(1);
            list.insertAtTail(2);
            list.insertAtTail(3);
        });

        it('deletes head', () => {
            expect(list.delete(1)).toBe(true);
            expect(list.toArray()).toEqual([2, 3]);
        });

        it('deletes middle element', () => {
            expect(list.delete(2)).toBe(true);
            expect(list.toArray()).toEqual([1, 3]);
        });

        it('deletes tail', () => {
            expect(list.delete(3)).toBe(true);
            expect(list.toArray()).toEqual([1, 2]);
        });

        it('returns false for non-existent element', () => {
            expect(list.delete(99)).toBe(false);
            expect(list.toArray()).toEqual([1, 2, 3]);
        });

        it('returns false for empty list', () => {
            const emptyList = new LinkedList<number>();
            expect(emptyList.delete(1)).toBe(false);
        });
    });

    describe('search', () => {
        beforeEach(() => {
            list.insertAtTail(1);
            list.insertAtTail(2);
            list.insertAtTail(3);
        });

        it('finds existing element', () => {
            expect(list.search(2)?.data).toBe(2);
        });

        it('returns null for non-existent element', () => {
            expect(list.search(99)).toBeNull();
        });

        it('returns null for empty list', () => {
            const emptyList = new LinkedList<number>();
            expect(emptyList.search(1)).toBeNull();
        });
    });

    describe('reverse', () => {
        it('reverses list', () => {
            list.insertAtTail(1);
            list.insertAtTail(2);
            list.insertAtTail(3);
            list.reverse();
            expect(list.toArray()).toEqual([3, 2, 1]);
        });

        it('handles single element', () => {
            list.insertAtTail(1);
            list.reverse();
            expect(list.toArray()).toEqual([1]);
        });

        it('handles empty list', () => {
            list.reverse();
            expect(list.toArray()).toEqual([]);
        });
    });

    describe('size', () => {
        it('returns 0 for empty list', () => {
            expect(list.size()).toBe(0);
        });

        it('returns correct size', () => {
            list.insertAtTail(1);
            list.insertAtTail(2);
            list.insertAtTail(3);
            expect(list.size()).toBe(3);
        });
    });
});
