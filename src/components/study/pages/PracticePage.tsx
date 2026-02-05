/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PRACTICE PAGE - TRANG THỰC HÀNH CODING
 * (INTERACTIVE CODE EDITOR & JUDGE SYSTEM)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - Đưa kiến thức vào thực tế: "Learning by Doing".
 * - Cung cấp môi trường IDE ngay trên trình duyệt để luyện tập thuật toán.
 * - Cho phép người học chạy code, debug, và nhận phản hồi tức thì từ Test Runner.
 * 
 * 🏗️ KIẾN TRÚC CLIENT-SIDE JUDGE:
 * 1. **Code Execution Engine**:
 *    - Sử dụng `new Function()` để thực thi code Javascript/Typescript an toàn trong sandbox cơ bản.
 *    - So khớp output của user function với `expectedOutput` từ Test Cases.
 * 2. **Exercise Data Structure**:
 *    - Mỗi bài tập (`Exercise`) bao gồm: ID, mô tả, function signature, test cases, hint và solution mẫu.
 *    - Data được tổ chức tập trung trong `ALL_EXERCISES` map.
 * 3. **UI/UX Components**:
 *    - **Monaco Editor**: Trải nghiệm code chuyên nghiệp (VS Code-like).
 *    - **Test Result Panel**: Hiển thị trạng thái Pass/Fail visual.
 *    - **Hint System**: Lộ gợi ý từng bước để tránh spoil solution ngay lập tức.
 * 
 * ⚠️ LƯU Ý BẢO MẬT:
 * - Hiện tại code chạy client-side, chỉ dùng cho mục đích học tập.
 * - Không thực thi code độc hại (infinite loop, XSS) trong production environment thực tế.
 * 
 * @component PracticePage
 * @category Components/StudyMaterials/Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useLearningProgressStore } from '../../../store/learningProgressStore';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

interface PracticePageProps {
  moduleId: string;
  pageId: string;
  title: string;
  onComplete?: (code: string, passed: boolean) => void;
}

interface TestCase {
  input: unknown;        // Input cho hàm (có thể là array, string, number...)
  expectedOutput: unknown; // Output kỳ vọng
  description: string;   // Mô tả test case (VD: "Trường hợp mảng rỗng")
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  functionSignature: string; // Tên hàm và kiểu tham số
  testCases: TestCase[];
  hints: string[];           // Danh sách gợi ý theo thứ tự
  starterCode: string;       // Code mẫu ban đầu
  solution: string;          // Lời giải tham khảo
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE PRACTICE EXERCISES (KHO BÀI TẬP TỪ CÁC CHƯƠNG)
// ═══════════════════════════════════════════════════════════════════════════

const ALL_EXERCISES: Record<string, Exercise> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1: COMPLEXITY ANALYSIS EXERCISES
  // ═══════════════════════════════════════════════════════════════════════════
  'ch1-p9-practice-analysis': {
    id: 'big-o-analysis-1',
    title: 'Phân tích độ phức tạp',
    description: 'Hãy viết function để phân tích độ phức tạp của các đoạn code và trả về Big O notation.',
    functionSignature: 'function analyzeComplexity(code: string): string',
    testCases: [
      {
        input: 'for(let i=0; i<n; i++) { console.log(i); }',
        expectedOutput: 'O(n)',
        description: 'Single loop → O(n)'
      },
      {
        input: 'for(let i=0; i<n; i++) { for(let j=0; j<n; j++) { console.log(i,j); } }',
        expectedOutput: 'O(n²)',
        description: 'Nested loops → O(n²)'
      }
    ],
    hints: [
      'Đếm số lần lặp trong code',
      'Nested loops nhân complexity lại với nhau',
      'Constant operations là O(1)'
    ],
    starterCode: `function analyzeComplexity(code: string): string {
  // TODO: Implement your solution here
  // Return the Big O notation as a string
  
}`,
    solution: `function analyzeComplexity(code: string): string {
  const loopCount = (code.match(/for|while/g) || []).length;
  if (loopCount === 0) return 'O(1)';
  if (loopCount === 1) return 'O(n)';
  if (loopCount === 2) return 'O(n²)';
  return 'O(n^' + loopCount + ')';
}`
  },
  'ch1-practice-analysis': {
    id: 'big-o-analysis-2',
    title: 'Xác định Big O',
    description: 'Viết function xác định Big O từ số vòng lặp.',
    functionSignature: 'function getBigO(loopCount: number): string',
    testCases: [
      { input: 0, expectedOutput: 'O(1)', description: 'Không có loop' },
      { input: 1, expectedOutput: 'O(n)', description: '1 loop' },
      { input: 2, expectedOutput: 'O(n²)', description: '2 nested loops' }
    ],
    hints: ['Map từ số loop sang Big O notation'],
    starterCode: `function getBigO(loopCount: number): string {
  // TODO: Return Big O notation based on loop count
  
}`,
    solution: `function getBigO(loopCount: number): string {
  if (loopCount === 0) return 'O(1)';
  if (loopCount === 1) return 'O(n)';
  return 'O(n^' + loopCount + ')';
}`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2: SORTING & SEARCHING EXERCISES
  // ═══════════════════════════════════════════════════════════════════════════
  'ch2-p3-practice-bubble-code': {
    id: 'bubble-sort-implementation',
    title: 'Implement Bubble Sort',
    description: 'Implement bubble sort algorithm từ đầu.',
    functionSignature: 'function bubbleSort(arr: number[]): number[]',
    testCases: [
      { input: [64, 34, 25, 12, 22, 11, 90], expectedOutput: [11, 12, 22, 25, 34, 64, 90], description: 'Random array' },
      { input: [5, 2, 8, 1, 9], expectedOutput: [1, 2, 5, 8, 9], description: 'Small array' },
      { input: [1], expectedOutput: [1], description: 'Single element' }
    ],
    hints: ['Dùng 2 vòng lặp lồng nhau', 'So sánh phần tử liền kề và swap nếu cần', 'Lặp cho đến khi không còn swap nào'],
    starterCode: `function bubbleSort(arr: number[]): number[] {
  // TODO: Implement bubble sort here
  
}`,
    solution: `function bubbleSort(arr: number[]): number[] {
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
  'ch2-practice-bubble': {
    id: 'bubble-sort-2',
    title: 'Bubble Sort với Early Exit',
    description: 'Implement bubble sort với optimization: dừng sớm nếu mảng đã sorted.',
    functionSignature: 'function bubbleSortOptimized(arr: number[]): number[]',
    testCases: [
      { input: [1, 2, 3, 4, 5], expectedOutput: [1, 2, 3, 4, 5], description: 'Already sorted' },
      { input: [5, 4, 3, 2, 1], expectedOutput: [1, 2, 3, 4, 5], description: 'Reverse sorted' }
    ],
    hints: ['Thêm flag swapped', 'Nếu không có swap nào thì break'],
    starterCode: `function bubbleSortOptimized(arr: number[]): number[] {
  // TODO: Implement optimized bubble sort
  
}`,
    solution: `function bubbleSortOptimized(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`
  },
  'ch2-practice-binary': {
    id: 'binary-search-impl',
    title: 'Implement Binary Search',
    description: 'Implement binary search trả về index của target.',
    functionSignature: 'function binarySearch(arr: number[], target: number): number',
    testCases: [
      { input: [[1, 2, 3, 4, 5], 3], expectedOutput: 2, description: 'Found in middle' },
      { input: [[1, 2, 3, 4, 5], 1], expectedOutput: 0, description: 'Found at start' },
      { input: [[1, 2, 3, 4, 5], 6], expectedOutput: -1, description: 'Not found' }
    ],
    hints: ['Dùng left và right pointers', 'mid = Math.floor((left + right) / 2)', 'So sánh arr[mid] với target'],
    starterCode: `function binarySearch(arr: number[], target: number): number {
  // TODO: Implement binary search
  
}`,
    solution: `function binarySearch(arr: number[], target: number): number {
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
  'ch2-practice-quick': {
    id: 'quick-sort-impl',
    title: 'Quick Sort Partition',
    description: 'Implement partition function cho Quick Sort.',
    functionSignature: 'function partition(arr: number[], low: number, high: number): number',
    testCases: [
      { input: [[10, 80, 30, 90, 40, 50, 70], 0, 6], expectedOutput: 4, description: 'Partition with pivot at end' }
    ],
    hints: ['Chọn pivot là phần tử cuối', 'Dùng i để track vị trí đặt phần tử nhỏ hơn pivot'],
    starterCode: `function partition(arr: number[], low: number, high: number): number {
  // TODO: Implement partition for quick sort
  
}`,
    solution: `function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3: LINKED LIST EXERCISES
  // ═══════════════════════════════════════════════════════════════════════════
  'ch3-practice-reverse': {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    description: 'Đảo ngược một singly linked list.',
    functionSignature: 'function reverseList(head: ListNode | null): ListNode | null',
    testCases: [
      { input: [1, 2, 3, 4, 5], expectedOutput: [5, 4, 3, 2, 1], description: 'Reverse list' },
      { input: [1, 2], expectedOutput: [2, 1], description: 'Two elements' }
    ],
    hints: ['Dùng 3 pointers: prev, current, next', 'prev ban đầu = null', 'Mỗi bước: lưu next, đảo hướng, di chuyển'],
    starterCode: `function reverseList(head: ListNode | null): ListNode | null {
  // TODO: Reverse linked list
  
}`,
    solution: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`
  },
  'ch3-practice-cycle': {
    id: 'detect-cycle',
    title: 'Detect Cycle',
    description: 'Kiểm tra linked list có cycle không.',
    functionSignature: 'function hasCycle(head: ListNode | null): boolean',
    testCases: [
      { input: 'cycle exists', expectedOutput: true, description: 'Has cycle' },
      { input: 'no cycle', expectedOutput: false, description: 'No cycle' }
    ],
    hints: ['Floyd\'s Algorithm: 2 pointers', 'slow đi 1 bước, fast đi 2 bước', 'Nếu có cycle, chúng sẽ gặp nhau'],
    starterCode: `function hasCycle(head: ListNode | null): boolean {
  // TODO: Detect cycle using Floyd's algorithm
  
}`,
    solution: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`
  },
  'ch3-practice-middle': {
    id: 'find-middle',
    title: 'Find Middle Node',
    description: 'Tìm node ở giữa linked list.',
    functionSignature: 'function middleNode(head: ListNode | null): ListNode | null',
    testCases: [
      { input: [1, 2, 3, 4, 5], expectedOutput: 3, description: 'Odd number of nodes' },
      { input: [1, 2, 3, 4, 5, 6], expectedOutput: 4, description: 'Even number of nodes' }
    ],
    hints: ['slow đi 1 bước, fast đi 2 bước', 'Khi fast đến cuối, slow ở giữa'],
    starterCode: `function middleNode(head: ListNode | null): ListNode | null {
  // TODO: Find middle node
  
}`,
    solution: `function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4: STACK & QUEUE EXERCISES
  // ═══════════════════════════════════════════════════════════════════════════
  'ch4-practice-parentheses': {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: 'Kiểm tra chuỗi ngoặc có hợp lệ không.',
    functionSignature: 'function isValid(s: string): boolean',
    testCases: [
      { input: '()', expectedOutput: true, description: 'Simple valid' },
      { input: '()[]{}', expectedOutput: true, description: 'Multiple valid' },
      { input: '(]', expectedOutput: false, description: 'Invalid' }
    ],
    hints: ['Push ngoặc mở vào stack', 'Khi gặp ngoặc đóng, pop và kiểm tra match', 'Cuối cùng stack phải rỗng'],
    starterCode: `function isValid(s: string): boolean {
  // TODO: Check valid parentheses using stack
  
}`,
    solution: `function isValid(s: string): boolean {
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
}`
  },
  'ch4-practice-postfix': {
    id: 'eval-postfix',
    title: 'Evaluate Postfix',
    description: 'Tính giá trị biểu thức Postfix.',
    functionSignature: 'function evalRPN(tokens: string[]): number',
    testCases: [
      { input: ['2', '1', '+', '3', '*'], expectedOutput: 9, description: '((2+1)*3) = 9' },
      { input: ['4', '13', '5', '/', '+'], expectedOutput: 6, description: '(4+(13/5)) = 6' }
    ],
    hints: ['Push số vào stack', 'Khi gặp operator: pop 2 số, tính, push kết quả'],
    starterCode: `function evalRPN(tokens: string[]): number {
  // TODO: Evaluate Reverse Polish Notation
  
}`,
    solution: `function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  const ops = new Set(['+', '-', '*', '/']);
  for (const t of tokens) {
    if (ops.has(t)) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (t === '+') stack.push(a + b);
      else if (t === '-') stack.push(a - b);
      else if (t === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else {
      stack.push(parseInt(t));
    }
  }
  return stack[0];
}`
  },
  'ch4-practice-queue-stack': {
    id: 'queue-using-stacks',
    title: 'Queue using Stacks',
    description: 'Implement Queue chỉ dùng 2 Stacks.',
    functionSignature: 'class MyQueue { push, pop, peek, empty }',
    testCases: [
      { input: 'push(1), push(2), peek(), pop(), empty()', expectedOutput: '1, 1, false', description: 'Basic operations' }
    ],
    hints: ['Dùng 2 stacks: input và output', 'Move từ input sang output khi cần'],
    starterCode: `class MyQueue {
  // TODO: Implement Queue using 2 Stacks
  
  push(x: number): void { }
  pop(): number { return 0; }
  peek(): number { return 0; }
  empty(): boolean { return true; }
}`,
    solution: `class MyQueue {
  private inStack: number[] = [];
  private outStack: number[] = [];
  
  push(x: number): void { this.inStack.push(x); }
  
  pop(): number {
    this.moveIfNeeded();
    return this.outStack.pop()!;
  }
  
  peek(): number {
    this.moveIfNeeded();
    return this.outStack[this.outStack.length - 1];
  }
  
  empty(): boolean { return this.inStack.length === 0 && this.outStack.length === 0; }
  
  private moveIfNeeded(): void {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
  }
}`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5: BST EXERCISES
  // ═══════════════════════════════════════════════════════════════════════════
  'ch5-practice-inorder': {
    id: 'inorder-traversal',
    title: 'Inorder Traversal',
    description: 'Implement inorder traversal (Left → Root → Right).',
    functionSignature: 'function inorderTraversal(root: TreeNode | null): number[]',
    testCases: [
      { input: [1, null, 2, 3], expectedOutput: [1, 3, 2], description: 'Simple tree' }
    ],
    hints: ['Đệ quy: left, push root, right', 'Hoặc dùng Stack cho iterative'],
    starterCode: `function inorderTraversal(root: TreeNode | null): number[] {
  // TODO: Inorder traversal
  
}`,
    solution: `function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function traverse(node: TreeNode | null): void {
    if (node === null) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}`
  },
  'ch5-practice-maxdepth': {
    id: 'max-depth',
    title: 'Maximum Depth',
    description: 'Tìm độ sâu tối đa của binary tree.',
    functionSignature: 'function maxDepth(root: TreeNode | null): number',
    testCases: [
      { input: [3, 9, 20, null, null, 15, 7], expectedOutput: 3, description: 'Depth 3' }
    ],
    hints: ['depth = 1 + max(depth(left), depth(right))', 'Base case: null → 0'],
    starterCode: `function maxDepth(root: TreeNode | null): number {
  // TODO: Find max depth
  
}`,
    solution: `function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`
  },
  'ch5-practice-validate': {
    id: 'validate-bst',
    title: 'Validate BST',
    description: 'Kiểm tra binary tree có phải BST không.',
    functionSignature: 'function isValidBST(root: TreeNode | null): boolean',
    testCases: [
      { input: [2, 1, 3], expectedOutput: true, description: 'Valid BST' },
      { input: [5, 1, 4, null, null, 3, 6], expectedOutput: false, description: 'Invalid BST' }
    ],
    hints: ['Mỗi node phải trong range (min, max)', 'Hoặc: Inorder của BST phải tăng dần'],
    starterCode: `function isValidBST(root: TreeNode | null): boolean {
  // TODO: Validate BST
  
}`,
    solution: `function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number, max: number): boolean {
    if (node === null) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, -Infinity, Infinity);
}`
  },
  'ch5-practice-lca': {
    id: 'lowest-common-ancestor',
    title: 'Lowest Common Ancestor',
    description: 'Tìm LCA của 2 nodes trong BST.',
    functionSignature: 'function lowestCommonAncestor(root, p, q): TreeNode | null',
    testCases: [
      { input: 'root=[6,2,8,0,4,7,9], p=2, q=8', expectedOutput: 6, description: 'LCA is root' }
    ],
    hints: ['Dùng tính chất BST', 'Nếu cả 2 < root → đi trái', 'Nếu cả 2 > root → đi phải'],
    starterCode: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  // TODO: Find LCA in BST
  
}`,
    solution: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (root === null) return null;
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }
  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }
  return root;
}`
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (COMPONENT CHÍNH)
// ═══════════════════════════════════════════════════════════════════════════

export const PracticePage: React.FC<PracticePageProps> = ({
  moduleId,
  pageId,
  title,
  onComplete
}) => {
  // Global Access
  const { updateTimeSpent } = useLearningProgressStore();

  // Local State
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<{
    input: unknown;
    expectedOutput: unknown;
    description: string;
    actualOutput: unknown;
    passed: boolean; // Trạng thái test pass
    error: string | null; // Lỗi runtime nếu có
  }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Get current exercise config
  const exercise = ALL_EXERCISES[pageId] || {
    id: 'default',
    title: 'Bài tập thực hành',
    description: 'Hãy viết code cho bài tập này.',
    functionSignature: 'function solution(input: any): any',
    testCases: [],
    hints: ['Hãy suy nghĩ về bài toán'],
    starterCode: 'function solution(input: any): any {\n  // TODO: Implement your solution\n}',
    solution: ''
  };

  /**
   * INIT EFFECT
   * Load starter code khi đổi bài tập.
   */
  useEffect(() => {
    setCode(exercise.starterCode);
  }, [exercise.starterCode]);

  /**
   * TIME TRACKING
   */
  useEffect(() => {
    const timer = setInterval(() => {
      updateTimeSpent(moduleId, pageId, 0.5);
    }, 30000);

    return () => clearInterval(timer);
  }, [moduleId, pageId, updateTimeSpent]);

  /**
   * TEST RUNNER ENGINE
   * Cơ chế chạy code của user an toàn.
   */
  const runTests = async () => {
    setIsRunning(true);

    try {
      // 1. Tạo function object từ string code của user
      // Security warning: 'new Function' chạy code trong context hiện tại. 
      // Trong môi trường production thực tế, nên dùng Worker hoặc Server-side sandbox.
      const func = new Function('return ' + code)();

      // 2. Chạy từng test case
      const results = exercise.testCases.map(testCase => {
        try {
          const result = func(testCase.input);
          // So sánh sâu JSON stringify (đơn giản, hiệu quả cho learning data structures)
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);

          return {
            ...testCase,
            actualOutput: result,
            passed,
            error: null
          };
        } catch (error) {
          // Bắt lỗi Runtime (ví dụ: Stack Overflow, Undefined variable)
          return {
            ...testCase,
            actualOutput: null,
            passed: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      setTestResults(results);

      // 3. Kiểm tra pass toàn bộ
      const allPassed = results.every(r => r.passed);
      if (allPassed && exercise.testCases.length > 0) {
        setIsCompleted(true);
      }
    } catch (error) {
      // Lỗi cú pháp code user (Syntax Error)
      setTestResults([]);
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * HINT SYSTEM
   * Hiển thị gợi ý tuần tự.
   */
  const showNextHint = () => {
    if (currentHintIndex < exercise.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const passedCount = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="min-h-[600px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {/* 1. HEADER & META INFO */}
      <div className="relative bg-gradient-to-r from-emerald-900/80 via-teal-900/60 to-cyan-900/80 border-b border-gray-700/50 p-6 overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <motion.div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <i className="fi fi-rr-code text-2xl text-white"></i>
            </motion.div>

            {/* Title & Descr */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
              <p className="text-emerald-200/80 text-sm max-w-md">{exercise.description}</p>
            </div>
          </div>

          {/* Stats Badge */}
          <AnimatePresence>
            {testResults.length > 0 && (
              <motion.div
                className="text-right bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="text-xs text-emerald-200/80 mb-1">Kết quả test</div>
                <div className={`text-2xl font-bold ${passedCount === totalTests ? 'text-green-400' :
                    passedCount > 0 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                  {passedCount}/{totalTests}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* 2. LEFT COLUMN: CODE EDITOR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <i className="fi fi-rr-code text-white text-sm"></i>
              </motion.div>
              Code Editor
            </h3>

            {/* Buttons Toolbar */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fi fi-rr-lightbulb"></i>
                Gợi ý
              </motion.button>

              <motion.button
                onClick={runTests}
                disabled={isRunning}
                className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-500/20 disabled:shadow-none flex items-center gap-2"
                whileHover={!isRunning ? { scale: 1.05 } : {}}
                whileTap={!isRunning ? { scale: 0.95 } : {}}
              >
                {isRunning ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    Đang chạy...
                  </>
                ) : (
                  <>
                    <i className="fi fi-rr-play"></i>
                    Chạy Tests
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Hint Card */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-yellow-300 font-semibold flex items-center gap-2">
                    <i className="fi fi-rr-lightbulb"></i>
                    Gợi ý {currentHintIndex + 1}/{exercise.hints.length}
                  </h4>

                  {currentHintIndex < exercise.hints.length - 1 && (
                    <button
                      onClick={showNextHint}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                    >
                      Tiếp theo →
                    </button>
                  )}
                </div>

                <p className="text-yellow-200 text-sm">{exercise.hints[currentHintIndex]}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Monaco Instance */}
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <Editor
              height="400px"
              defaultLanguage="typescript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>

          {/* Helper: Func Config */}
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="text-xs text-gray-400 mb-1">Function signature:</div>
            <code className="text-green-400 text-sm font-mono">{exercise.functionSignature}</code>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: TEST RESULTS */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <i className="fi fi-rr-list-check text-white text-sm"></i>
            </motion.div>
            Test Cases
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {exercise.testCases.map((testCase, index) => {
              const result = testResults.find(r => r.description === testCase.description);
              // States: 'pending' (chưa chạy), 'passed', 'failed'

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className={`
                    p-4 rounded-xl border transition-all duration-200 shadow-lg
                    ${!result
                      ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600' // Pending
                      : result.passed
                        ? 'bg-emerald-900/20 border-emerald-500/30' // Pass
                        : 'bg-red-900/20 border-red-500/30' // Fail
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {testCase.description}
                        {result && (result.passed
                          ? <i className="fi fi-rr-check-circle text-emerald-400"></i>
                          : <i className="fi fi-rr-cross-circle text-red-400"></i>
                        )}
                      </div>

                      {result?.error && (
                        <div className="text-xs text-red-400 font-mono bg-red-950/30 px-2 py-1 rounded border border-red-900/50">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input/Output Comparison Details */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                    <div className="bg-gray-900/50 p-2 rounded border border-gray-700/50">
                      <div className="text-gray-500 mb-1">Input:</div>
                      <div className="text-blue-300 truncate">
                        {JSON.stringify(testCase.input)}
                      </div>
                    </div>
                    <div className="bg-gray-900/50 p-2 rounded border border-gray-700/50">
                      <div className="text-gray-500 mb-1">Expected:</div>
                      <div className="text-purple-300 truncate">
                        {JSON.stringify(testCase.expectedOutput)}
                      </div>
                    </div>
                  </div>

                  {/* Actual Result Output (Fail Case) */}
                  {result && !result.passed && !result.error && (
                    <div className="mt-2 text-xs font-mono bg-red-950/20 p-2 rounded border border-red-900/30">
                      <div className="text-red-400 mb-1">Actual:</div>
                      <div className="text-white">
                        {JSON.stringify(result.actualOutput)}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. FOOTER COMPLETE ACTION */}
      {isCompleted && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-emerald-900/30 border-t border-emerald-500/30 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-emerald-400 font-medium">
              <i className="fi fi-rr-party-horn"></i>
              Chúc mừng! Bạn đã hoàn thành bài tập.
            </span>
            <button
              onClick={() => onComplete && onComplete(code, true)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              Tiếp tục
              <i className="fi fi-rr-arrow-right"></i>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PracticePage;