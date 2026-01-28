/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TREE ANIMATION UTILS - Tiện ích cho animations BST
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export interface TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

export interface TraversalStep {
    type: 'visit' | 'process' | 'backtrack' | 'complete';
    nodeVal: number;
    path: number[];
    result: number[];
    description: string;
}

/**
 * Generate Inorder Traversal steps (Left → Root → Right)
 */
export function generateInorderSteps(root: TreeNode | null): TraversalStep[] {
    const steps: TraversalStep[] = [];
    const result: number[] = [];
    const path: number[] = [];

    function traverse(node: TreeNode | null): void {
        if (node === null) return;

        // Visit left
        path.push(node.val);
        steps.push({
            type: 'visit',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Đến node ${node.val}, đi vào cây trái`
        });

        traverse(node.left);

        // Process current
        result.push(node.val);
        steps.push({
            type: 'process',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Xử lý node ${node.val}`
        });

        // Visit right
        steps.push({
            type: 'visit',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Đi vào cây phải của ${node.val}`
        });

        traverse(node.right);

        // Backtrack
        path.pop();
        steps.push({
            type: 'backtrack',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Quay về từ ${node.val}`
        });
    }

    traverse(root);

    steps.push({
        type: 'complete',
        nodeVal: 0,
        path: [],
        result: [...result],
        description: `Hoàn thành! Kết quả: [${result.join(', ')}]`
    });

    return steps;
}

/**
 * Generate Preorder Traversal steps (Root → Left → Right)
 */
export function generatePreorderSteps(root: TreeNode | null): TraversalStep[] {
    const steps: TraversalStep[] = [];
    const result: number[] = [];
    const path: number[] = [];

    function traverse(node: TreeNode | null): void {
        if (node === null) return;

        path.push(node.val);

        // Process first (Preorder)
        result.push(node.val);
        steps.push({
            type: 'process',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Xử lý node ${node.val} (trước khi đi xuống)`
        });

        // Visit left
        steps.push({
            type: 'visit',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Đi vào cây trái của ${node.val}`
        });
        traverse(node.left);

        // Visit right
        steps.push({
            type: 'visit',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Đi vào cây phải của ${node.val}`
        });
        traverse(node.right);

        // Backtrack
        path.pop();
    }

    traverse(root);

    steps.push({
        type: 'complete',
        nodeVal: 0,
        path: [],
        result: [...result],
        description: `Hoàn thành! Kết quả: [${result.join(', ')}]`
    });

    return steps;
}

/**
 * Generate Postorder Traversal steps (Left → Right → Root)
 */
export function generatePostorderSteps(root: TreeNode | null): TraversalStep[] {
    const steps: TraversalStep[] = [];
    const result: number[] = [];
    const path: number[] = [];

    function traverse(node: TreeNode | null): void {
        if (node === null) return;

        path.push(node.val);

        // Visit left first
        steps.push({
            type: 'visit',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Đến ${node.val}, đi vào cây trái`
        });
        traverse(node.left);

        // Visit right
        steps.push({
            type: 'visit',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Đi vào cây phải của ${node.val}`
        });
        traverse(node.right);

        // Process last (Postorder)
        result.push(node.val);
        steps.push({
            type: 'process',
            nodeVal: node.val,
            path: [...path],
            result: [...result],
            description: `Xử lý node ${node.val} (sau khi duyệt con)`
        });

        path.pop();
    }

    traverse(root);

    steps.push({
        type: 'complete',
        nodeVal: 0,
        path: [],
        result: [...result],
        description: `Hoàn thành! Kết quả: [${result.join(', ')}]`
    });

    return steps;
}

/**
 * Generate Level-order (BFS) Traversal steps
 */
export function generateLevelOrderSteps(root: TreeNode | null): TraversalStep[] {
    const steps: TraversalStep[] = [];
    const result: number[] = [];

    if (root === null) {
        steps.push({
            type: 'complete',
            nodeVal: 0,
            path: [],
            result: [],
            description: 'Cây rỗng'
        });
        return steps;
    }

    const queue: TreeNode[] = [root];
    let level = 0;

    while (queue.length > 0) {
        const levelSize = queue.length;

        steps.push({
            type: 'visit',
            nodeVal: 0,
            path: queue.map(n => n.val),
            result: [...result],
            description: `Level ${level}: ${levelSize} nodes`
        });

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            result.push(node.val);

            steps.push({
                type: 'process',
                nodeVal: node.val,
                path: queue.map(n => n.val),
                result: [...result],
                description: `Dequeue và xử lý ${node.val}`
            });

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        level++;
    }

    steps.push({
        type: 'complete',
        nodeVal: 0,
        path: [],
        result: [...result],
        description: `Hoàn thành! Kết quả: [${result.join(', ')}]`
    });

    return steps;
}

// Helper: Build tree from array
export function buildTreeFromArray(arr: (number | null)[]): TreeNode | null {
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

export default {
    generateInorderSteps,
    generatePreorderSteps,
    generatePostorderSteps,
    generateLevelOrderSteps,
    buildTreeFromArray
};
