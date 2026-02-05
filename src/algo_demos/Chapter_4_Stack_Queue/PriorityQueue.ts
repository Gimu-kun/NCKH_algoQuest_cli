/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PRIORITY QUEUE - HÀNG ĐỢI ƯU TIÊN
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Priority Queue là cấu trúc dữ liệu trong đó mỗi phần tử có một ĐỘ ƯU TIÊN.
 * Phần tử có độ ưu tiên CAO NHẤT được lấy ra TRƯỚC (không theo FIFO).
 * 
 * KHÁC VỚI QUEUE THÔNG THƯỜNG:
 * 
 * ┌────────────────────────────────────────────────────────┐
 * │ Queue thông thường (FIFO) | Priority Queue             |
 * ├────────────────────────────────────────────────────────┤
 * │ Ai vào trước → ra trước   | Ai ưu tiên cao → ra trước  |
 * │ enqueue = O(1)            | enqueue = O(log n)*        |
 * │ dequeue = O(1)            | dequeue = O(log n)*        |
 * └────────────────────────────────────────────────────────┘
 * * Với Heap implementation
 * 
 * CÁC LOẠI PRIORITY QUEUE:
 * 1. Max Priority Queue: Phần tử LỚN NHẤT ra trước
 * 2. Min Priority Queue: Phần tử NHỎ NHẤT ra trước
 * 
 * CÀI ĐẶT PRIORITY QUEUE:
 * 
 * ┌───────────────────────────────────────────────────────────┐
 * │  Implementation |     Insert     |  Extract/Peek  | Space |
 * ├───────────────────────────────────────────────────────────┤
 * │ Unsorted Array  | O(1)           | O(n)           | O(n)  |
 * │ Sorted Array    | O(n)           | O(1)           | O(n)  |
 * │ Linked List     | O(1) hoặc O(n) | O(n) hoặc O(1) | O(n)  |
 * │ Binary Heap     | O(log n)       | O(log n)       | O(n)  |
 * │ Fibonacci Heap  | O(1) amortized | O(log n)       | O(n)  |
 * └───────────────────────────────────────────────────────────┘
 * 
 * BINARY HEAP - CÀI ĐẶT PHỔ BIẾN NHẤT:
 * 
 * Heap là Complete Binary Tree thỏa mãn:
 * - Max Heap: Parent ≥ Children
 * - Min Heap: Parent ≤ Children
 * 
 * Lưu trữ bằng Array:
 * - Parent(i) = (i-1)/2
 * - LeftChild(i) = 2i + 1
 * - RightChild(i) = 2i + 2
 * 
 * ỨNG DỤNG:
 * - Dijkstra's shortest path algorithm
 * - Prim's minimum spanning tree
 * - Huffman coding
 * - A* pathfinding
 * - Task scheduling với priority
 * - Merge K sorted lists
 * - Find Kth largest/smallest element
 * 
 * ƯU ĐIỂM:
 * ✅ Extract max/min trong O(log n)
 * ✅ Insert trong O(log n)
 * ✅ Peek trong O(1)
 * ✅ Cài đặt đơn giản với array (Binary Heap)
 * 
 * NHƯỢC ĐIỂM:
 * ❌ Không hỗ trợ search O(1)
 * ❌ Không giữ thứ tự insertion
 * ❌ Decrease-key phức tạp với Binary Heap
 * 
 * @module PriorityQueue
 * @category AlgoDemos/StackQueue
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho phần tử có priority
 */
export interface PriorityItem<T> {
    value: T;
    priority: number;
}

/**
 * Interface cho visualization step
 */
export interface PQStep {
    action: 'insert' | 'extract' | 'heapify' | 'swap';
    value?: number;
    heap: number[];
    message: string;
    highlights?: number[]; // Indices involved in the action
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUALIZATION GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

export function generateMaxHeapInsertSteps(currentHeap: number[], newValue: number): PQStep[] {
    const steps: PQStep[] = [];
    const heap = [...currentHeap];

    // Step 1: Add to end
    heap.push(newValue);
    let index = heap.length - 1;

    steps.push({
        action: 'insert',
        value: newValue,
        heap: [...heap],
        message: `Thêm [${newValue}] vào cuối Heap (Vị trí ${index}).`,
        highlights: [index]
    });

    // Step 2: Heapify Up
    while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);

        steps.push({
            action: 'heapify',
            value: newValue,
            heap: [...heap],
            message: `So sánh [${heap[index]}] với Parent [${heap[parentIndex]}].`,
            highlights: [index, parentIndex]
        });

        if (heap[index] > heap[parentIndex]) {
            // Swap
            [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];

            steps.push({
                action: 'swap',
                value: newValue,
                heap: [...heap],
                message: `Swap [${heap[index]}] và [${heap[parentIndex]}] vì ${heap[parentIndex]} > ${heap[index]} (Child > Parent).`,
                highlights: [index, parentIndex]
            });

            index = parentIndex;
        } else {
            steps.push({
                action: 'heapify',
                value: newValue,
                heap: [...heap],
                message: `Thỏa mãn tính chất Max Heap (Child <= Parent). Dừng.`,
                highlights: [index, parentIndex]
            });
            break;
        }
    }

    return steps;
}

export function generateMaxHeapExtractSteps(currentHeap: number[]): PQStep[] {
    const steps: PQStep[] = [];

    if (currentHeap.length === 0) {
        steps.push({
            action: 'extract',
            heap: [],
            message: 'Heap rỗng! Không thể extract.',
        });
        return steps;
    }

    const heap = [...currentHeap];
    const max = heap[0];

    // Step 1: Remove Root
    const last = heap.pop()!;

    if (heap.length === 0) {
        steps.push({
            action: 'extract',
            value: max,
            heap: [],
            message: `Lấy Max [${max}] ra khỏi Root. Heap rỗng.`,
            highlights: []
        });
        return steps;
    }

    // Move last to root
    heap[0] = last;
    let index = 0;

    steps.push({
        action: 'extract',
        value: max,
        heap: [...heap],
        message: `Lấy Max [${max}]. Đưa phần tử cuối [${last}] lên Root.`,
        highlights: [0]
    });

    // Step 2: Heapify Down
    const length = heap.length;
    while (true) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let largest = index;

        if (left < length && heap[left] > heap[largest]) {
            largest = left;
        }

        if (right < length && heap[right] > heap[largest]) {
            largest = right;
        }

        if (largest !== index) {
            steps.push({
                action: 'heapify',
                heap: [...heap],
                message: `So sánh Root [${heap[index]}] với con lớn nhất [${heap[largest]}].`,
                highlights: [index, largest]
            });

            // Swap
            [heap[index], heap[largest]] = [heap[largest], heap[index]];

            steps.push({
                action: 'swap',
                heap: [...heap],
                message: `Swap [${heap[largest]}] và [${heap[index]}].`,
                highlights: [index, largest]
            });

            index = largest;
        } else {
            steps.push({
                action: 'heapify',
                heap: [...heap],
                message: `Vị trí hợp lệ (Root >= Children). Hoàn tất.`,
                highlights: [index]
            });
            break;
        }
    }

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAX HEAP - MIN HEAP IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Binary Heap (Max Heap) - Phần tử lớn nhất ở root
 * 
 * TÍNH CHẤT:
 * - Complete Binary Tree
 * - Parent ≥ Children (với mọi node)
 * - Lưu trong array liên tục
 * 
 * ARRAY REPRESENTATION:
 *           10              Index:   0
 *          /  \                     / \
 *         8    9                   1   2
 *        / \  / \                 / \ / \
 *       4  5 6   7               3 4 5  6
 * 
 * Array: [10, 8, 9, 4, 5, 6, 7]
 */
export class MaxHeap {
    private heap: number[] = [];

    // ---------------------------------------------------------------------
    // HELPER METHODS - Index calculations
    // ---------------------------------------------------------------------

    /**
     * Lấy index của parent
     * Formula: (i - 1) / 2
     */
    private parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    /**
     * Lấy index của left child
     * Formula: 2i + 1
     */
    private leftChild(i: number): number {
        return 2 * i + 1;
    }

    /**
     * Lấy index của right child
     * Formula: 2i + 2
     */
    private rightChild(i: number): number {
        return 2 * i + 2;
    }

    /**
     * Swap 2 phần tử
     */
    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    /**
     * Kiểm tra index có hợp lệ
     */
    private hasParent(i: number): boolean {
        return i > 0;
    }

    private hasLeftChild(i: number): boolean {
        return this.leftChild(i) < this.heap.length;
    }

    private hasRightChild(i: number): boolean {
        return this.rightChild(i) < this.heap.length;
    }

    // ---------------------------------------------------------------------
    // CORE OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Insert - Thêm phần tử vào heap
     * 
     * THUẬT TOÁN:
     * 1. Thêm phần tử vào cuối array
     * 2. HEAPIFY UP: So sánh với parent, swap nếu lớn hơn
     * 3. Lặp lại cho đến khi đúng vị trí hoặc là root
     * 
     * ĐỘ PHỨC TẠP: O(log n) - chiều cao của heap
     */
    insert(value: number): void {
        // Thêm vào cuối
        this.heap.push(value);

        // Heapify up
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * Heapify Up (Bubble Up / Sift Up)
     * 
     * Di chuyển phần tử LÊN cho đến khi thỏa mãn heap property
     */
    private heapifyUp(index: number): void {
        // Trong khi còn parent và node hiện tại > parent
        while (this.hasParent(index) &&
            this.heap[index] > this.heap[this.parent(index)]) {
            const parentIndex = this.parent(index);
            this.swap(index, parentIndex);
            index = parentIndex;  // Tiếp tục với vị trí mới
        }
    }

    /**
     * Extract Max - Lấy và xóa phần tử lớn nhất
     * 
     * THUẬT TOÁN:
     * 1. Lưu root (max value)
     * 2. Di chuyển phần tử cuối lên root
     * 3. HEAPIFY DOWN: So sánh với children, swap với child lớn hơn
     * 4. Lặp lại cho đến khi đúng vị trí hoặc là leaf
     * 
     * ĐỘ PHỨC TẠP: O(log n)
     */
    extractMax(): number | null {
        if (this.isEmpty()) return null;

        if (this.heap.length === 1) {
            return this.heap.pop()!;
        }

        const max = this.heap[0];

        // Di chuyển phần tử cuối lên root
        this.heap[0] = this.heap.pop()!;

        // Heapify down
        this.heapifyDown(0);

        return max;
    }

    /**
     * Heapify Down (Bubble Down / Sift Down)
     * 
     * Di chuyển phần tử XUỐNG cho đến khi thỏa mãn heap property
     */
    private heapifyDown(index: number): void {
        while (this.hasLeftChild(index)) {
            // Tìm child lớn hơn
            let largerChildIndex = this.leftChild(index);

            if (this.hasRightChild(index) &&
                this.heap[this.rightChild(index)] > this.heap[largerChildIndex]) {
                largerChildIndex = this.rightChild(index);
            }

            // Nếu node hiện tại >= child lớn nhất, dừng
            if (this.heap[index] >= this.heap[largerChildIndex]) {
                break;
            }

            // Swap và tiếp tục
            this.swap(index, largerChildIndex);
            index = largerChildIndex;
        }
    }

    /**
     * Peek - Xem phần tử lớn nhất (không xóa)
     * O(1)
     */
    peek(): number | null {
        return this.isEmpty() ? null : this.heap[0];
    }

    /**
     * Kiểm tra rỗng
     */
    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    /**
     * Lấy size
     */
    size(): number {
        return this.heap.length;
    }

    /**
     * Lấy array (cho visualization)
     */
    toArray(): number[] {
        return [...this.heap];
    }
}

/**
 * Min Heap - Phần tử nhỏ nhất ở root
 * 
 * Chỉ khác Max Heap ở điều kiện so sánh (< thay vì >)
 */
export class MinHeap {
    private heap: number[] = [];

    private parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private leftChild(i: number): number {
        return 2 * i + 1;
    }

    private rightChild(i: number): number {
        return 2 * i + 2;
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    private hasParent(i: number): boolean {
        return i > 0;
    }

    private hasLeftChild(i: number): boolean {
        return this.leftChild(i) < this.heap.length;
    }

    private hasRightChild(i: number): boolean {
        return this.rightChild(i) < this.heap.length;
    }

    insert(value: number): void {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }

    private heapifyUp(index: number): void {
        // Khác Max Heap: dùng < thay vì >
        while (this.hasParent(index) &&
            this.heap[index] < this.heap[this.parent(index)]) {
            const parentIndex = this.parent(index);
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    extractMin(): number | null {
        if (this.isEmpty()) return null;

        if (this.heap.length === 1) {
            return this.heap.pop()!;
        }

        const min = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown(0);

        return min;
    }

    private heapifyDown(index: number): void {
        while (this.hasLeftChild(index)) {
            // Tìm child NHỎ hơn (khác Max Heap)
            let smallerChildIndex = this.leftChild(index);

            if (this.hasRightChild(index) &&
                this.heap[this.rightChild(index)] < this.heap[smallerChildIndex]) {
                smallerChildIndex = this.rightChild(index);
            }

            // Dùng <= thay vì >=
            if (this.heap[index] <= this.heap[smallerChildIndex]) {
                break;
            }

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    peek(): number | null {
        return this.isEmpty() ? null : this.heap[0];
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    size(): number {
        return this.heap.length;
    }

    toArray(): number[] {
        return [...this.heap];
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIORITY QUEUE CLASS (Generic)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generic Priority Queue với custom priority
 */
export class PriorityQueue<T> {
    private items: PriorityItem<T>[] = [];
    private isMaxPriority: boolean;

    /**
     * @param isMaxPriority - true = max priority first, false = min priority first
     */
    constructor(isMaxPriority: boolean = true) {
        this.isMaxPriority = isMaxPriority;
    }

    private compare(a: number, b: number): boolean {
        return this.isMaxPriority ? a > b : a < b;
    }

    private parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private leftChild(i: number): number {
        return 2 * i + 1;
    }

    private rightChild(i: number): number {
        return 2 * i + 2;
    }

    private swap(i: number, j: number): void {
        [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
    }

    /**
     * Enqueue với priority
     * O(log n)
     */
    enqueue(value: T, priority: number): void {
        this.items.push({ value, priority });
        this.heapifyUp(this.items.length - 1);
    }

    private heapifyUp(index: number): void {
        while (index > 0) {
            const parentIndex = this.parent(index);
            if (this.compare(this.items[index].priority, this.items[parentIndex].priority)) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    /**
     * Dequeue - Lấy phần tử có priority cao nhất/thấp nhất
     * O(log n)
     */
    dequeue(): T | null {
        if (this.isEmpty()) return null;

        if (this.items.length === 1) {
            return this.items.pop()!.value;
        }

        const top = this.items[0].value;
        this.items[0] = this.items.pop()!;
        this.heapifyDown(0);

        return top;
    }

    private heapifyDown(index: number): void {
        const n = this.items.length;

        while (this.leftChild(index) < n) {
            let targetChild = this.leftChild(index);
            const right = this.rightChild(index);

            if (right < n &&
                this.compare(this.items[right].priority, this.items[targetChild].priority)) {
                targetChild = right;
            }

            if (this.compare(this.items[targetChild].priority, this.items[index].priority)) {
                this.swap(index, targetChild);
                index = targetChild;
            } else {
                break;
            }
        }
    }

    peek(): T | null {
        return this.isEmpty() ? null : this.items[0].value;
    }

    peekPriority(): number | null {
        return this.isEmpty() ? null : this.items[0].priority;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Priority Queue
 */
export function demonstratePriorityQueue(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('         PRIORITY QUEUE DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    // Max Heap demo
    console.log('--- Max Heap (Max Priority Queue) ---\n');

    const maxHeap = new MaxHeap();
    const values = [5, 3, 8, 1, 2, 9, 4, 7, 6];

    console.log('Inserting:', values);
    for (const v of values) {
        maxHeap.insert(v);
        console.log(`insert(${v}): heap = [${maxHeap.toArray().join(', ')}]`);
    }

    console.log('\nExtracting all (should be descending):');
    while (!maxHeap.isEmpty()) {
        console.log(`extractMax(): ${maxHeap.extractMax()}`);
    }

    // Min Heap demo
    console.log('\n--- Min Heap (Min Priority Queue) ---\n');

    const minHeap = new MinHeap();

    console.log('Inserting:', values);
    for (const v of values) {
        minHeap.insert(v);
    }
    console.log('Heap:', minHeap.toArray());

    console.log('\nExtracting all (should be ascending):');
    while (!minHeap.isEmpty()) {
        console.log(`extractMin(): ${minHeap.extractMin()}`);
    }

    // Task Scheduling demo
    console.log('\n\n--- Ứng dụng: Task Scheduling ---\n');

    const taskQueue = new PriorityQueue<string>(true);  // Max priority

    const tasks = [
        { name: 'Low priority task', priority: 1 },
        { name: 'Critical bug fix', priority: 10 },
        { name: 'Feature request', priority: 5 },
        { name: 'Documentation', priority: 2 },
        { name: 'Security patch', priority: 9 }
    ];

    console.log('Adding tasks:');
    for (const task of tasks) {
        console.log(`  ${task.name} (priority: ${task.priority})`);
        taskQueue.enqueue(task.name, task.priority);
    }

    console.log('\nProcessing tasks by priority:');
    while (!taskQueue.isEmpty()) {
        console.log(`  → ${taskQueue.dequeue()}`);
    }

    // Complexity comparison
    console.log('\n\n--- So sánh implementations ---\n');
    console.log('| Implementation | Insert | Extract | Peek |');
    console.log('|----------------|--------|---------|------|');
    console.log('| Unsorted Array | O(1) | O(n) | O(n) |');
    console.log('| Sorted Array | O(n) | O(1) | O(1) |');
    console.log('| Binary Heap ⭐ | O(log n) | O(log n) | O(1) |');
}

/**
 * Export default
 */
export default {
    MaxHeap,
    MinHeap,
    PriorityQueue,
    demonstratePriorityQueue
};
