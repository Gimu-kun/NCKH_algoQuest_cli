/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 5: EXERCISES - BINARY SEARCH TREE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * BÀI TẬP THỰC HÀNH:
 * Các bài tập về Binary Tree và BST.
 * 
 * @module Chapter5Exercises
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { Difficulty } from '../chapter1_complexity/exercises';

interface TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

export interface BSTChallenge {
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

export const BST_CHALLENGES: BSTChallenge[] = [
    {
        id: 'ch5-bst1',
        title: 'Inorder Traversal',
        titleVi: 'Duyệt Inorder',
        difficulty: 'easy',
        description: 'Implement inorder traversal (Left → Root → Right).',
        examples: [
            { input: '[1,null,2,3]', output: '[1,3,2]' },
            { input: '[]', output: '[]' }
        ],
        starterCode: `
function inorderTraversal(root: TreeNode | null): number[] {
    // TODO: Inorder traversal
    return [];
}`,
        hints: [
            'Đệ quy: left, push root, right',
            'Hoặc dùng Stack cho iterative'
        ],
        solution: `
function inorderTraversal(root: TreeNode | null): number[] {
    const result: number[] = [];
    
    function traverse(node: TreeNode | null): void {
        if (node === null) return;
        traverse(node.left);
        result.push(node.val);
        traverse(node.right);
    }
    
    traverse(root);
    return result;
}`,
        complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
        id: 'ch5-bst2',
        title: 'Maximum Depth',
        titleVi: 'Độ sâu tối đa',
        difficulty: 'easy',
        description: 'Tìm độ sâu tối đa (chiều cao) của binary tree.',
        examples: [
            { input: '[3,9,20,null,null,15,7]', output: '3' },
            { input: '[1,null,2]', output: '2' }
        ],
        starterCode: `
function maxDepth(root: TreeNode | null): number {
    // TODO: Tìm độ sâu tối đa
    return 0;
}`,
        hints: [
            'depth = 1 + max(depth(left), depth(right))',
            'Base case: null → 0'
        ],
        solution: `
function maxDepth(root: TreeNode | null): number {
    if (root === null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
        id: 'ch5-bst3',
        title: 'Validate BST',
        titleVi: 'Kiểm tra BST hợp lệ',
        difficulty: 'medium',
        description: 'Kiểm tra binary tree có phải BST không.',
        examples: [
            { input: '[2,1,3]', output: 'true' },
            { input: '[5,1,4,null,null,3,6]', output: 'false', explanation: 'Node 4 < 5 nhưng ở bên phải' }
        ],
        starterCode: `
function isValidBST(root: TreeNode | null): boolean {
    // TODO: Kiểm tra BST hợp lệ
    return false;
}`,
        hints: [
            'Mỗi node phải trong range (min, max)',
            'Hoặc: Inorder của BST phải tăng dần'
        ],
        solution: `
function isValidBST(root: TreeNode | null): boolean {
    function validate(node: TreeNode | null, min: number, max: number): boolean {
        if (node === null) return true;
        if (node.val <= min || node.val >= max) return false;
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}`,
        complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
        id: 'ch5-bst4',
        title: 'Lowest Common Ancestor',
        titleVi: 'Tổ tiên chung gần nhất',
        difficulty: 'medium',
        description: 'Tìm LCA của 2 nodes trong BST.',
        examples: [
            { input: 'root=[6,2,8,0,4,7,9], p=2, q=8', output: '6' },
            { input: 'root=[6,2,8,0,4,7,9], p=2, q=4', output: '2' }
        ],
        starterCode: `
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
    // TODO: Tìm LCA trong BST
    return null;
}`,
        hints: [
            'Dùng tính chất BST',
            'Nếu cả 2 < root → đi trái',
            'Nếu cả 2 > root → đi phải',
            'Nếu không → root là LCA'
        ],
        solution: `
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
    if (root === null) return null;
    
    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q);
    }
    if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestor(root.right, p, q);
    }
    
    return root;
}`,
        complexity: { time: 'O(h)', space: 'O(h)' }
    },
    {
        id: 'ch5-bst5',
        title: 'Kth Smallest Element',
        titleVi: 'Phần tử nhỏ thứ K',
        difficulty: 'medium',
        description: 'Tìm phần tử nhỏ thứ k trong BST.',
        examples: [
            { input: 'root=[3,1,4,null,2], k=1', output: '1' },
            { input: 'root=[5,3,6,2,4,null,null,1], k=3', output: '3' }
        ],
        starterCode: `
function kthSmallest(root: TreeNode | null, k: number): number {
    // TODO: Tìm phần tử nhỏ thứ k
    return 0;
}`,
        hints: [
            'Inorder của BST = dãy tăng dần',
            'Duyệt inorder và đếm'
        ],
        solution: `
function kthSmallest(root: TreeNode | null, k: number): number {
    let count = 0;
    let result = 0;
    
    function inorder(node: TreeNode | null): void {
        if (node === null || count >= k) return;
        
        inorder(node.left);
        
        count++;
        if (count === k) {
            result = node.val;
            return;
        }
        
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}`,
        complexity: { time: 'O(H + k)', space: 'O(H)' }
    },
    {
        id: 'ch5-bst6',
        title: 'Level Order Traversal',
        titleVi: 'Duyệt theo level',
        difficulty: 'medium',
        description: 'Duyệt cây theo từng level (BFS).',
        examples: [
            { input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }
        ],
        starterCode: `
function levelOrder(root: TreeNode | null): number[][] {
    // TODO: Level order traversal
    return [];
}`,
        hints: [
            'Dùng Queue',
            'Xử lý từng level một'
        ],
        solution: `
function levelOrder(root: TreeNode | null): number[][] {
    if (root === null) return [];
    
    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel: number[] = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}`,
        complexity: { time: 'O(n)', space: 'O(n)' }
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function createTreeFromArray(arr: (number | null)[]): TreeNode | null {
    if (arr.length === 0 || arr[0] === null) return null;

    const root: TreeNode = { val: arr[0], left: null, right: null };
    const queue: TreeNode[] = [root];
    let i = 1;

    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift()!;

        if (i < arr.length && arr[i] !== null) {
            node.left = { val: arr[i]!, left: null, right: null };
            queue.push(node.left);
        }
        i++;

        if (i < arr.length && arr[i] !== null) {
            node.right = { val: arr[i]!, left: null, right: null };
            queue.push(node.right);
        }
        i++;
    }

    return root;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
    challenges: BST_CHALLENGES,
    createTreeFromArray
};
