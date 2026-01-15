/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * BINARY TREE - CÂY NHỊ PHÂN (KHÁI NIỆM TỔNG QUÁT)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Binary Tree là cấu trúc cây trong đó mỗi node có TỐI ĐA 2 CON:
 * - Left child (con trái)
 * - Right child (con phải)
 * 
 * CẤU TRÚC NODE:
 * 
 *         ┌─────────┐
 *         │   data  │
 *         ├────┬────┤
 *         │left│right│
 *         └──↓─┴──↓──┘
 *            ↓    ↓
 *          [L]   [R]
 * 
 * CÁC THUẬT NGỮ QUAN TRỌNG:
 * 
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ Thuật ngữ | Định nghĩa |
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Root | Node gốc, không có parent |
 * │ Leaf | Node lá, không có children |
 * │ Internal Node | Node có ít nhất 1 child |
 * │ Parent | Node cha |
 * │ Child | Node con |
 * │ Sibling | Các node cùng parent |
 * │ Ancestor | Tổ tiên (parent, grandparent, ...) |
 * │ Descendant | Con cháu (children, grandchildren, ...) |
 * │ Height | Số cạnh từ node đến leaf xa nhất |
 * │ Depth | Số cạnh từ root đến node |
 * │ Level | Depth + 1 (hoặc bằng Depth, tùy convention) |
 * │ Subtree | Cây con với node làm root |
 * └──────────────────────────────────────────────────────────────────────────┘
 * 
 * CÁC LOẠI BINARY TREE:
 * 
 * 1. FULL BINARY TREE (Đầy đủ)
 *    - Mọi node có 0 hoặc 2 children (không có node 1 con)
 * 
 *           1
 *          / \
 *         2   3
 *        / \
 *       4   5
 * 
 * 2. COMPLETE BINARY TREE (Hoàn chỉnh)
 *    - Tất cả levels được lấp đầy, trừ level cuối
 *    - Level cuối được lấp từ TRÁI sang PHẢI
 *    - ⭐ Dùng cho HEAP
 * 
 *           1
 *          / \
 *         2   3
 *        / \  /
 *       4  5 6
 * 
 * 3. PERFECT BINARY TREE (Hoàn hảo)
 *    - Full + Complete
 *    - Tất cả internal nodes có 2 children
 *    - Tất cả leaves ở cùng level
 *    - Số nodes = 2^h+1 - 1 (h = height)
 * 
 *           1
 *          / \
 *         2   3
 *        / \ / \
 *       4  5 6  7
 * 
 * 4. BALANCED BINARY TREE (Cân bằng)
 *    - Height(left) - Height(right) ≤ 1 với mọi node
 *    - ⭐ Đảm bảo operations O(log n)
 * 
 * 5. DEGENERATE/SKEWED TREE (Suy biến)
 *    - Mỗi parent chỉ có 1 child
 *    - Thực chất là Linked List
 *    - ❌ Worst case cho BST
 * 
 *     1                1
 *      \              /
 *       2            2
 *        \          /
 *         3        3
 * 
 * CÁC KIỂU TRAVERSAL:
 * 
 * DFS (Depth-First Search):
 * 1. Inorder (LNR): Left → Node → Right
 * 2. Preorder (NLR): Node → Left → Right
 * 3. Postorder (LRN): Left → Right → Node
 * 
 * BFS (Breadth-First Search):
 * 4. Level-order: Theo từng level
 * 
 * @module BinaryTree
 * @category AlgoDemos/Trees
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho Binary Tree Node
 */
export interface TreeNode<T> {
    data: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;
}

/**
 * Interface cho traversal result với visualization
 */
export interface TraversalResult<T> {
    order: T[];
    steps: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// BINARY TREE CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Binary Tree class (General - không phải BST)
 */
export class BinaryTree<T> {
    root: TreeNode<T> | null = null;

    // ---------------------------------------------------------------------
    // HELPER METHODS
    // ---------------------------------------------------------------------

    /**
     * Tạo node mới
     */
    createNode(data: T): TreeNode<T> {
        return {
            data,
            left: null,
            right: null
        };
    }

    /**
     * Kiểm tra cây rỗng
     */
    isEmpty(): boolean {
        return this.root === null;
    }

    // ---------------------------------------------------------------------
    // TRAVERSAL METHODS - DFS
    // ---------------------------------------------------------------------

    /**
     * INORDER TRAVERSAL (LNR)
     * Left → Node → Right
     * 
     * ĐẶC ĐIỂM:
     * - Duyệt cây trái trước
     * - Xử lý node hiện tại
     * - Duyệt cây phải sau
     * 
     * ỨNG DỤNG:
     * - BST: Cho ra dãy SORTED
     * - Expression tree: Cho ra Infix expression
     */
    inorder(node: TreeNode<T> | null = this.root): T[] {
        if (node === null) return [];

        return [
            ...this.inorder(node.left),   // L
            node.data,                     // N
            ...this.inorder(node.right)   // R
        ];
    }

    /**
     * Inorder với chi tiết các bước (cho visualization)
     */
    inorderWithSteps(node: TreeNode<T> | null = this.root, steps: string[] = []): TraversalResult<T> {
        const order: T[] = [];

        const traverse = (n: TreeNode<T> | null): void => {
            if (n === null) return;

            steps.push(`Đi vào cây trái của ${n.data}`);
            traverse(n.left);

            steps.push(`Xử lý node ${n.data}`);
            order.push(n.data);

            steps.push(`Đi vào cây phải của ${n.data}`);
            traverse(n.right);
        };

        traverse(node);
        return { order, steps };
    }

    /**
     * PREORDER TRAVERSAL (NLR)
     * Node → Left → Right
     * 
     * ĐẶC ĐIỂM:
     * - Xử lý node TRƯỚC khi duyệt children
     * - Root luôn là phần tử đầu tiên
     * 
     * ỨNG DỤNG:
     * - Clone/Copy cây
     * - Serialize cây
     * - Expression tree: Cho ra Prefix expression
     */
    preorder(node: TreeNode<T> | null = this.root): T[] {
        if (node === null) return [];

        return [
            node.data,                     // N
            ...this.preorder(node.left),   // L
            ...this.preorder(node.right)   // R
        ];
    }

    /**
     * POSTORDER TRAVERSAL (LRN)
     * Left → Right → Node
     * 
     * ĐẶC ĐIỂM:
     * - Xử lý node SAU khi duyệt children
     * - Root luôn là phần tử cuối cùng
     * 
     * ỨNG DỤNG:
     * - Delete cây (xóa children trước parent)
     * - Tính toán trên cây (kích thước, height)
     * - Expression tree: Cho ra Postfix expression
     */
    postorder(node: TreeNode<T> | null = this.root): T[] {
        if (node === null) return [];

        return [
            ...this.postorder(node.left),   // L
            ...this.postorder(node.right),  // R
            node.data                        // N
        ];
    }

    // ---------------------------------------------------------------------
    // TRAVERSAL METHODS - BFS
    // ---------------------------------------------------------------------

    /**
     * LEVEL-ORDER TRAVERSAL (BFS)
     * Duyệt theo từng level
     * 
     * THUẬT TOÁN:
     * 1. Dùng Queue
     * 2. Enqueue root
     * 3. Dequeue, xử lý, enqueue children
     * 4. Lặp lại cho đến khi queue rỗng
     */
    levelOrder(): T[] {
        if (this.root === null) return [];

        const result: T[] = [];
        const queue: TreeNode<T>[] = [this.root];

        while (queue.length > 0) {
            const node = queue.shift()!;
            result.push(node.data);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        return result;
    }

    /**
     * Level-order với phân tách từng level
     */
    levelOrderByLevel(): T[][] {
        if (this.root === null) return [];

        const result: T[][] = [];
        const queue: TreeNode<T>[] = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel: T[] = [];

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift()!;
                currentLevel.push(node.data);

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }

            result.push(currentLevel);
        }

        return result;
    }

    // ---------------------------------------------------------------------
    // TREE PROPERTIES
    // ---------------------------------------------------------------------

    /**
     * Tính height của cây
     * Height = số cạnh từ root đến leaf xa nhất
     */
    height(node: TreeNode<T> | null = this.root): number {
        if (node === null) return -1;  // Convention: empty tree has height -1

        return 1 + Math.max(
            this.height(node.left),
            this.height(node.right)
        );
    }

    /**
     * Đếm số nodes
     */
    countNodes(node: TreeNode<T> | null = this.root): number {
        if (node === null) return 0;

        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }

    /**
     * Đếm số leaves
     */
    countLeaves(node: TreeNode<T> | null = this.root): number {
        if (node === null) return 0;
        if (node.left === null && node.right === null) return 1;

        return this.countLeaves(node.left) + this.countLeaves(node.right);
    }

    /**
     * Kiểm tra có phải Full Binary Tree
     */
    isFullBinaryTree(node: TreeNode<T> | null = this.root): boolean {
        if (node === null) return true;

        // Leaf node
        if (node.left === null && node.right === null) return true;

        // Chỉ có 1 child
        if (node.left === null || node.right === null) return false;

        // Có 2 children → kiểm tra đệ quy
        return this.isFullBinaryTree(node.left) && this.isFullBinaryTree(node.right);
    }

    /**
     * Kiểm tra có phải Complete Binary Tree
     */
    isCompleteBinaryTree(): boolean {
        if (this.root === null) return true;

        const queue: (TreeNode<T> | null)[] = [this.root];
        let foundNull = false;

        while (queue.length > 0) {
            const node = queue.shift();

            if (node === null) {
                foundNull = true;
            } else {
                // Nếu đã gặp null mà lại gặp non-null node → không complete
                if (foundNull) return false;

                queue.push(node.left);
                queue.push(node.right);
            }
        }

        return true;
    }

    /**
     * Kiểm tra có phải Perfect Binary Tree
     */
    isPerfectBinaryTree(node: TreeNode<T> | null = this.root, depth: number = 0, level: number = -1): { isPerfect: boolean; level: number } {
        if (node === null) {
            if (level === -1) level = depth;
            return { isPerfect: depth === level, level };
        }

        const leftResult = this.isPerfectBinaryTree(node.left, depth + 1, level);
        if (!leftResult.isPerfect) return leftResult;

        const rightResult = this.isPerfectBinaryTree(node.right, depth + 1, leftResult.level);
        return rightResult;
    }

    /**
     * Kiểm tra cây cân bằng
     */
    isBalanced(node: TreeNode<T> | null = this.root): boolean {
        if (node === null) return true;

        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);

        if (Math.abs(leftHeight - rightHeight) > 1) return false;

        return this.isBalanced(node.left) && this.isBalanced(node.right);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD TREE FROM ARRAY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Xây dựng Complete Binary Tree từ array
 * 
 * Array representation:
 * - Parent(i) = (i-1)/2
 * - Left(i) = 2i + 1
 * - Right(i) = 2i + 2
 */
export function buildTreeFromArray<T>(arr: (T | null)[]): BinaryTree<T> {
    const tree = new BinaryTree<T>();
    if (arr.length === 0 || arr[0] === null) return tree;

    const buildNode = (index: number): TreeNode<T> | null => {
        if (index >= arr.length || arr[index] === null) return null;

        const node: TreeNode<T> = {
            data: arr[index]!,
            left: buildNode(2 * index + 1),
            right: buildNode(2 * index + 2)
        };

        return node;
    };

    tree.root = buildNode(0);
    return tree;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Binary Tree
 */
export function demonstrateBinaryTree(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('           BINARY TREE DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    // Build sample tree
    //        1
    //       / \
    //      2   3
    //     / \ / \
    //    4  5 6  7

    const tree = buildTreeFromArray([1, 2, 3, 4, 5, 6, 7]);

    console.log('Sample Tree:');
    console.log('       1');
    console.log('      / \\');
    console.log('     2   3');
    console.log('    / \\ / \\');
    console.log('   4  5 6  7\n');

    // Traversals
    console.log('--- Traversals ---\n');

    console.log(`Inorder (LNR):   [${tree.inorder().join(', ')}]`);
    console.log('  → Left, Node, Right');
    console.log('  → Dùng BST: cho ra dãy sorted\n');

    console.log(`Preorder (NLR):  [${tree.preorder().join(', ')}]`);
    console.log('  → Node, Left, Right');
    console.log('  → Root luôn đầu tiên, dùng cho clone/serialize\n');

    console.log(`Postorder (LRN): [${tree.postorder().join(', ')}]`);
    console.log('  → Left, Right, Node');
    console.log('  → Root luôn cuối, dùng cho delete tree\n');

    console.log(`Level-order:     [${tree.levelOrder().join(', ')}]`);
    console.log('  → BFS, theo từng level\n');

    console.log('Level-order by level:');
    tree.levelOrderByLevel().forEach((level, i) => {
        console.log(`  Level ${i}: [${level.join(', ')}]`);
    });

    // Properties
    console.log('\n--- Tree Properties ---\n');

    console.log(`Height: ${tree.height()}`);
    console.log(`Total nodes: ${tree.countNodes()}`);
    console.log(`Leaf nodes: ${tree.countLeaves()}`);
    console.log(`Is Full Binary Tree: ${tree.isFullBinaryTree()}`);
    console.log(`Is Complete Binary Tree: ${tree.isCompleteBinaryTree()}`);
    console.log(`Is Perfect Binary Tree: ${tree.isPerfectBinaryTree().isPerfect}`);
    console.log(`Is Balanced: ${tree.isBalanced()}`);

    // Types comparison
    console.log('\n\n--- Các loại Binary Tree ---\n');

    console.log('FULL (mỗi node có 0 hoặc 2 con):');
    console.log('       1         ✓ Node 1 có 2 con');
    console.log('      / \\        ✓ Node 2 có 2 con');
    console.log('     2   3       ✗ Node 3 là leaf');
    console.log('    / \\');
    console.log('   4   5\n');

    console.log('COMPLETE (levels đầy, level cuối từ trái):');
    console.log('       1');
    console.log('      / \\');
    console.log('     2   3');
    console.log('    / \\  /');
    console.log('   4  5 6       ✓ Level cuối từ trái qua\n');

    console.log('PERFECT (Full + Complete, tất cả leaves cùng level):');
    console.log('       1');
    console.log('      / \\');
    console.log('     2   3');
    console.log('    / \\ / \\');
    console.log('   4  5 6  7    ✓ 2^3 - 1 = 7 nodes\n');

    console.log('SKEWED (suy biến = Linked List):');
    console.log('   1');
    console.log('    \\');
    console.log('     2');
    console.log('      \\');
    console.log('       3        ❌ Operations trở thành O(n)\n');
}

/**
 * Export default
 */
export default {
    BinaryTree,
    buildTreeFromArray,
    demonstrateBinaryTree
};
