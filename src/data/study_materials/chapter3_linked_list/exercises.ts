/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 3: EXERCISES - LINKED LIST
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * BÀI TẬP THỰC HÀNH:
 * Các bài tập classic về Linked List.
 * 
 * @module Chapter3Exercises
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { Difficulty } from '../chapter1_complexity/exercises';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ListNode {
    val: number;
    next: ListNode | null;
}

export interface LinkedListChallenge {
    id: string;
    title: string;
    titleVi: string;
    difficulty: Difficulty;
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    starterCode: string;
    hints: string[];
    solution: string;
    complexity: { time: string; space: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// CODING CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════

export const LINKED_LIST_CHALLENGES: LinkedListChallenge[] = [
    {
        id: 'ch3-ll1',
        title: 'Reverse Linked List',
        titleVi: 'Đảo ngược Linked List',
        difficulty: 'easy',
        description: 'Đảo ngược một singly linked list.',
        examples: [
            { input: '1 → 2 → 3 → 4 → 5', output: '5 → 4 → 3 → 2 → 1' },
            { input: '1 → 2', output: '2 → 1' },
            { input: '(empty)', output: '(empty)' }
        ],
        starterCode: `
function reverseList(head: ListNode | null): ListNode | null {
    // TODO: Đảo ngược linked list
    // Kĩ thuật: Three pointers (prev, current, next)
    return head;
}`,
        hints: [
            'Dùng 3 pointers: prev, current, next',
            'prev ban đầu = null',
            'Mỗi bước: lưu next, đảo hướng, di chuyển'
        ],
        solution: `
function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
        complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
        id: 'ch3-ll2',
        title: 'Detect Cycle',
        titleVi: 'Phát hiện vòng lặp',
        difficulty: 'medium',
        description: 'Kiểm tra linked list có cycle (vòng lặp) không.',
        examples: [
            { input: '3 → 2 → 0 → -4 → (trỏ về 2)', output: 'true', explanation: 'Node -4 trỏ về node 2' },
            { input: '1 → 2 → null', output: 'false' }
        ],
        starterCode: `
function hasCycle(head: ListNode | null): boolean {
    // TODO: Phát hiện cycle
    // Kĩ thuật: Floyd's Cycle Detection (Tortoise and Hare)
    return false;
}`,
        hints: [
            'Floyd\'s Algorithm: 2 pointers',
            'slow đi 1 bước, fast đi 2 bước',
            'Nếu có cycle, chúng sẽ gặp nhau'
        ],
        solution: `
function hasCycle(head: ListNode | null): boolean {
    if (!head || !head.next) return false;
    
    let slow: ListNode | null = head;
    let fast: ListNode | null = head;
    
    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    
    return false;
}`,
        complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
        id: 'ch3-ll3',
        title: 'Find Middle Node',
        titleVi: 'Tìm node giữa',
        difficulty: 'easy',
        description: 'Tìm node ở giữa linked list. Nếu có 2 node giữa, trả về node thứ 2.',
        examples: [
            { input: '1 → 2 → 3 → 4 → 5', output: '3' },
            { input: '1 → 2 → 3 → 4 → 5 → 6', output: '4', explanation: 'Có 2 middle: 3 và 4, trả về 4' }
        ],
        starterCode: `
function middleNode(head: ListNode | null): ListNode | null {
    // TODO: Tìm node giữa
    // Kĩ thuật: Two pointers (slow and fast)
    return head;
}`,
        hints: [
            'slow đi 1 bước, fast đi 2 bước',
            'Khi fast đến cuối, slow ở giữa'
        ],
        solution: `
function middleNode(head: ListNode | null): ListNode | null {
    let slow = head;
    let fast = head;
    
    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
    }
    
    return slow;
}`,
        complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
        id: 'ch3-ll4',
        title: 'Merge Two Sorted Lists',
        titleVi: 'Trộn 2 list đã sắp xếp',
        difficulty: 'easy',
        description: 'Trộn 2 sorted linked lists thành 1 sorted list.',
        examples: [
            { input: 'l1: 1→2→4, l2: 1→3→4', output: '1→1→2→3→4→4' },
            { input: 'l1: (), l2: 0', output: '0' }
        ],
        starterCode: `
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // TODO: Merge hai sorted lists
    return null;
}`,
        hints: [
            'Tạo dummy node làm đầu result',
            'So sánh và nối node nhỏ hơn',
            'Nối phần còn lại khi 1 list hết'
        ],
        solution: `
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy: ListNode = { val: 0, next: null };
    let current = dummy;
    
    while (l1 !== null && l2 !== null) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 !== null ? l1 : l2;
    return dummy.next;
}`,
        complexity: { time: 'O(n + m)', space: 'O(1)' }
    },
    {
        id: 'ch3-ll5',
        title: 'Remove Nth Node From End',
        titleVi: 'Xóa node thứ N từ cuối',
        difficulty: 'medium',
        description: 'Xóa node thứ n tính từ cuối list.',
        examples: [
            { input: '1→2→3→4→5, n=2', output: '1→2→3→5', explanation: 'Xóa 4 (thứ 2 từ cuối)' },
            { input: '1, n=1', output: '(empty)' }
        ],
        starterCode: `
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    // TODO: Xóa node thứ n từ cuối
    return head;
}`,
        hints: [
            'Two pointers cách nhau n nodes',
            'Khi fast đến cuối, slow ở node trước node cần xóa',
            'Dùng dummy node để xử lý edge case'
        ],
        solution: `
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    const dummy: ListNode = { val: 0, next: head };
    let slow: ListNode | null = dummy;
    let fast: ListNode | null = dummy;
    
    // Fast đi trước n+1 bước
    for (let i = 0; i <= n; i++) {
        fast = fast!.next;
    }
    
    // Di chuyển cả 2 đến khi fast = null
    while (fast !== null) {
        slow = slow!.next;
        fast = fast.next;
    }
    
    // Xóa node
    slow!.next = slow!.next!.next;
    
    return dummy.next;
}`,
        complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
        id: 'ch3-ll6',
        title: 'Palindrome Linked List',
        titleVi: 'Kiểm tra Palindrome',
        difficulty: 'medium',
        description: 'Kiểm tra linked list có phải palindrome không.',
        examples: [
            { input: '1→2→2→1', output: 'true' },
            { input: '1→2', output: 'false' }
        ],
        starterCode: `
function isPalindrome(head: ListNode | null): boolean {
    // TODO: Kiểm tra palindrome
    return false;
}`,
        hints: [
            'Tìm middle node',
            'Reverse nửa sau',
            'So sánh nửa đầu với nửa sau đã reverse'
        ],
        solution: `
function isPalindrome(head: ListNode | null): boolean {
    if (!head || !head.next) return true;
    
    // Tìm middle
    let slow = head, fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next!;
        fast = fast.next.next;
    }
    
    // Reverse nửa sau
    let prev: ListNode | null = null;
    let curr: ListNode | null = slow.next;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    // So sánh
    let p1: ListNode | null = head;
    let p2: ListNode | null = prev;
    while (p2) {
        if (p1!.val !== p2.val) return false;
        p1 = p1!.next;
        p2 = p2.next;
    }
    
    return true;
}`,
        complexity: { time: 'O(n)', space: 'O(1)' }
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════════════════

export function createListFromArray(arr: number[]): ListNode | null {
    if (arr.length === 0) return null;
    const head: ListNode = { val: arr[0], next: null };
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = { val: arr[i], next: null };
        current = current.next;
    }
    return head;
}

export function listToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
    challenges: LINKED_LIST_CHALLENGES,
    createListFromArray,
    listToArray
};
