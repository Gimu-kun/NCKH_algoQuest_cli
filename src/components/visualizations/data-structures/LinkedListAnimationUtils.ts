/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * LINKED LIST ANIMATION UTILS - Tiện ích cho animations Linked List
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export interface ListNodeData {
    val: number;
    next: number | null; // Index of next node, null for tail
}

export interface LinkedListStep {
    type: 'traverse' | 'insert' | 'delete' | 'found' | 'update' | 'complete';
    nodeIndex: number;
    nodes: ListNodeData[];
    description: string;
    highlight?: number[];
}

/**
 * Generate traversal animation steps
 */
export function generateTraversalSteps(values: number[]): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    const nodes: ListNodeData[] = values.map((val, i) => ({
        val,
        next: i < values.length - 1 ? i + 1 : null
    }));

    for (let i = 0; i < nodes.length; i++) {
        steps.push({
            type: 'traverse',
            nodeIndex: i,
            nodes: [...nodes],
            description: `Duyệt node ${i}: giá trị = ${nodes[i].val}`,
            highlight: [i]
        });
    }

    steps.push({
        type: 'complete',
        nodeIndex: -1,
        nodes: [...nodes],
        description: `Hoàn thành duyệt ${nodes.length} nodes`
    });

    return steps;
}

/**
 * Generate insert at head animation steps
 */
export function generateInsertAtHeadSteps(values: number[], newVal: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    const nodes: ListNodeData[] = values.map((val, i) => ({
        val,
        next: i < values.length - 1 ? i + 1 : null
    }));

    // Step 1: Show current list
    steps.push({
        type: 'traverse',
        nodeIndex: 0,
        nodes: [...nodes],
        description: `List hiện tại có ${nodes.length} nodes`
    });

    // Step 2: Create new node
    const newNode: ListNodeData = { val: newVal, next: 0 };

    steps.push({
        type: 'insert',
        nodeIndex: -1,
        nodes: [...nodes],
        description: `Tạo node mới với giá trị ${newVal}`,
        highlight: []
    });

    // Step 3: Update pointers
    const newNodes = [newNode, ...nodes.map((n, i) => ({
        ...n,
        next: i < nodes.length - 1 ? i + 2 : null
    }))];
    newNodes[0].next = 1;

    steps.push({
        type: 'update',
        nodeIndex: 0,
        nodes: newNodes,
        description: `newNode.next = head; head = newNode`,
        highlight: [0, 1]
    });

    steps.push({
        type: 'complete',
        nodeIndex: 0,
        nodes: newNodes,
        description: `Chèn ${newVal} vào đầu thành công!`
    });

    return steps;
}

/**
 * Generate insert at tail animation steps
 */
export function generateInsertAtTailSteps(values: number[], newVal: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    const nodes: ListNodeData[] = values.map((val, i) => ({
        val,
        next: i < values.length - 1 ? i + 1 : null
    }));

    // Traverse to find tail
    for (let i = 0; i < nodes.length; i++) {
        steps.push({
            type: 'traverse',
            nodeIndex: i,
            nodes: [...nodes],
            description: i < nodes.length - 1
                ? `Duyệt node ${i}, tiếp tục...`
                : `Tìm thấy tail ở node ${i}`,
            highlight: [i]
        });
    }

    // Create new node
    steps.push({
        type: 'insert',
        nodeIndex: nodes.length,
        nodes: [...nodes],
        description: `Tạo node mới với giá trị ${newVal}`
    });

    // Update tail.next
    const newNodes = [...nodes];
    if (newNodes.length > 0) {
        newNodes[newNodes.length - 1].next = newNodes.length;
    }
    newNodes.push({ val: newVal, next: null });

    steps.push({
        type: 'update',
        nodeIndex: nodes.length - 1,
        nodes: newNodes,
        description: `tail.next = newNode`,
        highlight: [nodes.length - 1, nodes.length]
    });

    steps.push({
        type: 'complete',
        nodeIndex: nodes.length,
        nodes: newNodes,
        description: `Chèn ${newVal} vào cuối thành công!`
    });

    return steps;
}

/**
 * Generate reverse linked list animation steps
 */
export function generateReverseSteps(values: number[]): LinkedListStep[] {
    const steps: LinkedListStep[] = [];

    // Represent as indices pointing to next
    let prev: number | null = null;
    let current = 0;
    const pointers = values.map((_, i) => i < values.length - 1 ? i + 1 : null);

    steps.push({
        type: 'traverse',
        nodeIndex: 0,
        nodes: values.map((val, i) => ({ val, next: pointers[i] })),
        description: 'Bắt đầu reverse: prev = null, current = head'
    });

    while (current !== null && current < values.length) {
        const next = pointers[current];

        steps.push({
            type: 'traverse',
            nodeIndex: current,
            nodes: values.map((val, i) => ({ val, next: pointers[i] })),
            description: `current = ${values[current]}, next = ${next !== null ? values[next] : 'null'}`,
            highlight: [current]
        });

        // Reverse pointer
        pointers[current] = prev;

        steps.push({
            type: 'update',
            nodeIndex: current,
            nodes: values.map((val, i) => ({ val, next: pointers[i] })),
            description: `Đảo pointer: ${values[current]}.next = ${prev !== null ? values[prev] : 'null'}`,
            highlight: prev !== null ? [prev, current] : [current]
        });

        prev = current;
        current = next as number;
    }

    steps.push({
        type: 'complete',
        nodeIndex: prev!,
        nodes: values.map((val, i) => ({ val, next: pointers[i] })),
        description: `Reverse hoàn thành! Head mới = ${values[prev!]}`
    });

    return steps;
}

export default {
    generateTraversalSteps,
    generateInsertAtHeadSteps,
    generateInsertAtTailSteps,
    generateReverseSteps
};
