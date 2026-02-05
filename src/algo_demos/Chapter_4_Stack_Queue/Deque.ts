/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DEQUE - HÀNG ĐỢI HAI ĐẦU (DOUBLE-ENDED QUEUE)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Deque (Double-Ended Queue) là cấu trúc dữ liệu cho phép THÊM/XÓA 
 * ở CẢ HAI ĐẦU (front và rear) với độ phức tạp O(1).
 * 
 * TÍNH CHẤT:
 * - Kết hợp Stack + Queue
 * - Có thể hoạt động như Stack (LIFO)
 * - Có thể hoạt động như Queue (FIFO)
 * 
 * CÁC OPERATIONS:
 * 
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                                                                          │
 * │   ← addFront / removeFront      addRear / removeRear →                   │
 * │                                                                          │
 * │        ↓        ↑                           ↓        ↑                   │
 * │   ┌─────────────────────────────────────────────────────┐                │
 * │   │       │       │       │       │       │       │     │                │
 * │   │   A   │   B   │   C   │   D   │   E   │   F   │     │                │
 * │   │       │       │       │       │       │       │     │                │
 * │   └─────────────────────────────────────────────────────┘                │
 * │     FRONT                                         REAR                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 * 
 * SO SÁNH VỚI STACK VÀ QUEUE:
 * 
 * ┌──────────────────────────────────────────────────────────┐
 * │ Cấu trúc |      Thêm      |       Xóa       | Nguyên tắc |
 * ├──────────────────────────────────────────────────────────┤
 * │ Stack    | Một đầu (top)  | Một đầu (top)   | LIFO       |
 * │ Queue    | Một đầu (rear) | Một đầu (front) | FIFO       |
 * │ Deque    | Cả hai đầu     | Cả hai đầu      | Flexible   |
 * └──────────────────────────────────────────────────────────┘
 * 
 * CÀI ĐẶT:
 * 1. Circular Array: O(1) các operations, fixed size
 * 2. Doubly Linked List: O(1) các operations, dynamic size
 * 
 * ỨNG DỤNG:
 * - Sliding Window Maximum/Minimum problem
 * - Palindrome checking
 * - Undo/Redo với giới hạn history
 * - Work-stealing algorithms (parallel computing)
 * - Browser history với forward/backward
 * - LRU Cache implementation
 * 
 * ĐỘ PHỨC TẠP:
 * |  Operation  | Time |  Description  |
 * |-------------|------|---------------|
 * | addFront    | O(1) | Thêm vào đầu  |
 * | addRear     | O(1) | Thêm vào cuối |
 * | removeFront | O(1) | Xóa từ đầu    |
 * | removeRear  | O(1) | Xóa từ cuối   |
 * | peekFront   | O(1) | Xem đầu       |
 * | peekRear    | O(1) | Xem cuối      |
 * 
 * ƯU ĐIỂM:
 * ✅ Linh hoạt: có thể dùng như Stack hoặc Queue
 * ✅ O(1) cho tất cả operations
 * ✅ Hữu ích cho Sliding Window problems
 * 
 * NHƯỢC ĐIỂM:
 * ❌ Phức tạp hơn Stack/Queue đơn giản
 * ❌ Cần nhiều pointers (với Linked List)
 * ❌ Random access vẫn O(n)
 * 
 * @module Deque
 * @category AlgoDemos/StackQueue
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho Deque Node (dùng cho Linked List implementation)
 */
interface DequeNode<T> {
    data: T;
    prev: DequeNode<T> | null;
    next: DequeNode<T> | null;
}

/**
 * Interface cho visualization step
 */
export interface DequeStep {
    action: 'addFront' | 'addRear' | 'removeFront' | 'removeRear';
    value?: number;
    dequeState: number[];
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUALIZATION GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

export function generateAddFrontSteps(currentDeque: number[], newValue: number): DequeStep[] {
    const steps: DequeStep[] = [];

    // Step 1: Create/Prep
    steps.push({
        action: 'addFront',
        value: newValue,
        dequeState: [...currentDeque],
        message: `Chuẩn bị thêm [${newValue}] vào đầu (FRONT).`
    });

    // Step 2: Add
    const newDeque = [newValue, ...currentDeque];
    steps.push({
        action: 'addFront',
        value: newValue,
        dequeState: newDeque,
        message: `Thêm [${newValue}] vào FRONT. Cập nhật pointers.`
    });

    return steps;
}

export function generateAddRearSteps(currentDeque: number[], newValue: number): DequeStep[] {
    const steps: DequeStep[] = [];

    // Step 1: Create/Prep
    steps.push({
        action: 'addRear',
        value: newValue,
        dequeState: [...currentDeque],
        message: `Chuẩn bị thêm [${newValue}] vào cuối (REAR).`
    });

    // Step 2: Add
    const newDeque = [...currentDeque, newValue];
    steps.push({
        action: 'addRear',
        value: newValue,
        dequeState: newDeque,
        message: `Thêm [${newValue}] vào REAR. Cập nhật pointers.`
    });

    return steps;
}

export function generateRemoveFrontSteps(currentDeque: number[]): DequeStep[] {
    const steps: DequeStep[] = [];

    if (currentDeque.length === 0) {
        steps.push({
            action: 'removeFront',
            dequeState: [],
            message: 'Deque rỗng! Không thể xóa.'
        });
        return steps;
    }

    const removedValue = currentDeque[0];

    // Step 1: Identify
    steps.push({
        action: 'removeFront',
        value: removedValue,
        dequeState: [...currentDeque],
        message: `Xác định FRONT: [${removedValue}].`
    });

    // Step 2: Remove
    const newDeque = currentDeque.slice(1);
    steps.push({
        action: 'removeFront',
        value: removedValue,
        dequeState: newDeque,
        message: `Xóa [${removedValue}] khỏi FRONT.`
    });

    return steps;
}

export function generateRemoveRearSteps(currentDeque: number[]): DequeStep[] {
    const steps: DequeStep[] = [];

    if (currentDeque.length === 0) {
        steps.push({
            action: 'removeRear',
            dequeState: [],
            message: 'Deque rỗng! Không thể xóa.'
        });
        return steps;
    }

    const removedValue = currentDeque[currentDeque.length - 1];

    // Step 1: Identify
    steps.push({
        action: 'removeRear',
        value: removedValue,
        dequeState: [...currentDeque],
        message: `Xác định REAR: [${removedValue}].`
    });

    // Step 2: Remove
    const newDeque = currentDeque.slice(0, -1);
    steps.push({
        action: 'removeRear',
        value: removedValue,
        dequeState: newDeque,
        message: `Xóa [${removedValue}] khỏi REAR.`
    });

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEQUE - DOUBLY LINKED LIST IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Deque cài đặt bằng Doubly Linked List
 * 
 * ĐẶC ĐIỂM:
 * - Kích thước động
 * - O(1) cho tất cả operations
 * - Không cần resize
 */
export class Deque<T> {
    private front: DequeNode<T> | null = null;
    private rear: DequeNode<T> | null = null;
    private count: number = 0;

    // ---------------------------------------------------------------------
    // HELPER METHODS
    // ---------------------------------------------------------------------

    /**
     * Tạo node mới
     */
    private createNode(data: T): DequeNode<T> {
        return {
            data,
            prev: null,
            next: null
        };
    }

    /**
     * Lấy số phần tử
     */
    size(): number {
        return this.count;
    }

    /**
     * Kiểm tra rỗng
     */
    isEmpty(): boolean {
        return this.count === 0;
    }

    // ---------------------------------------------------------------------
    // ADD OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Thêm vào đầu (front) - O(1)
     * 
     * MINH HỌA:
     * TRƯỚC: [B] ⇄ [C] ⇄ [D]
     *         ↑front       ↑rear
     * 
     * addFront(A):
     * SAU:   [A] ⇄ [B] ⇄ [C] ⇄ [D]
     *         ↑front            ↑rear
     */
    addFront(data: T): void {
        const newNode = this.createNode(data);

        if (this.isEmpty()) {
            // Deque rỗng
            this.front = newNode;
            this.rear = newNode;
        } else {
            // Thêm vào trước front
            newNode.next = this.front;
            this.front!.prev = newNode;
            this.front = newNode;
        }

        this.count++;
    }

    /**
     * Thêm vào cuối (rear) - O(1)
     * 
     * MINH HỌA:
     * TRƯỚC: [A] ⇄ [B] ⇄ [C]
     *         ↑front       ↑rear
     * 
     * addRear(D):
     * SAU:   [A] ⇄ [B] ⇄ [C] ⇄ [D]
     *         ↑front            ↑rear
     */
    addRear(data: T): void {
        const newNode = this.createNode(data);

        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            newNode.prev = this.rear;
            this.rear!.next = newNode;
            this.rear = newNode;
        }

        this.count++;
    }

    // ---------------------------------------------------------------------
    // REMOVE OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Xóa và trả về phần tử đầu - O(1)
     * 
     * === HOẠT ĐỘNG NHƯ QUEUE.dequeue() ===
     */
    removeFront(): T | null {
        if (this.isEmpty()) return null;

        const data = this.front!.data;

        if (this.count === 1) {
            // Chỉ có 1 phần tử
            this.front = null;
            this.rear = null;
        } else {
            this.front = this.front!.next;
            this.front!.prev = null;
        }

        this.count--;
        return data;
    }

    /**
     * Xóa và trả về phần tử cuối - O(1)
     * 
     * === HOẠT ĐỘNG NHƯ STACK.pop() (nếu thêm ở rear) ===
     */
    removeRear(): T | null {
        if (this.isEmpty()) return null;

        const data = this.rear!.data;

        if (this.count === 1) {
            this.front = null;
            this.rear = null;
        } else {
            this.rear = this.rear!.prev;
            this.rear!.next = null;
        }

        this.count--;
        return data;
    }

    // ---------------------------------------------------------------------
    // PEEK OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Xem phần tử đầu (không xóa) - O(1)
     */
    peekFront(): T | null {
        return this.isEmpty() ? null : this.front!.data;
    }

    /**
     * Xem phần tử cuối (không xóa) - O(1)
     */
    peekRear(): T | null {
        return this.isEmpty() ? null : this.rear!.data;
    }

    // ---------------------------------------------------------------------
    // UTILITY METHODS
    // ---------------------------------------------------------------------

    /**
     * Chuyển thành array
     */
    toArray(): T[] {
        const result: T[] = [];
        let current = this.front;

        while (current !== null) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    /**
     * Xóa tất cả
     */
    clear(): void {
        this.front = null;
        this.rear = null;
        this.count = 0;
    }

    /**
     * In ra dạng string
     */
    toString(): string {
        if (this.isEmpty()) return '← (empty) →';
        return `← [${this.toArray().join('] ⇄ [')}] →`;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEQUE AS STACK/QUEUE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sử dụng Deque như Stack (LIFO)
 * 
 * push = addRear
 * pop = removeRear
 * top = peekRear
 */
export class DequeAsStack<T> {
    private deque = new Deque<T>();

    push(data: T): void {
        this.deque.addRear(data);
    }

    pop(): T | null {
        return this.deque.removeRear();
    }

    top(): T | null {
        return this.deque.peekRear();
    }

    isEmpty(): boolean {
        return this.deque.isEmpty();
    }

    size(): number {
        return this.deque.size();
    }
}

/**
 * Sử dụng Deque như Queue (FIFO)
 * 
 * enqueue = addRear
 * dequeue = removeFront
 * front = peekFront
 */
export class DequeAsQueue<T> {
    private deque = new Deque<T>();

    enqueue(data: T): void {
        this.deque.addRear(data);
    }

    dequeue(): T | null {
        return this.deque.removeFront();
    }

    front(): T | null {
        return this.deque.peekFront();
    }

    isEmpty(): boolean {
        return this.deque.isEmpty();
    }

    size(): number {
        return this.deque.size();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDING WINDOW MAXIMUM - Ứng dụng kinh điển của Deque
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sliding Window Maximum Problem
 * 
 * BÀI TOÁN:
 * Cho mảng arr và kích thước cửa sổ k.
 * Tìm giá trị MAX trong mỗi cửa sổ trượt.
 * 
 * VÍ DỤ:
 * arr = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
 * 
 * Window positions:                Max:
 * [1  3  -1] -3  5  3  6  7        3
 *  1 [3  -1  -3] 5  3  6  7        3
 *  1  3 [-1  -3  5] 3  6  7        5
 *  1  3  -1 [-3  5  3] 6  7        5
 *  1  3  -1  -3 [5  3  6] 7        6
 *  1  3  -1  -3  5 [3  6  7]       7
 * 
 * Output: [3, 3, 5, 5, 6, 7]
 * 
 * THUẬT TOÁN:
 * Dùng Deque lưu INDEX (không phải giá trị)
 * - Deque giữ các index theo thứ tự GIẢM DẦN của giá trị
 * - Front của deque luôn là index của MAX trong window hiện tại
 * 
 * ĐỘ PHỨC TẠP: O(n) - mỗi phần tử vào/ra deque tối đa 1 lần
 */
export function slidingWindowMaximum(arr: number[], k: number): number[] {
    if (arr.length === 0 || k === 0) return [];
    if (k === 1) return [...arr];
    if (k >= arr.length) return [Math.max(...arr)];

    const result: number[] = [];
    const deque: number[] = [];  // Lưu index

    for (let i = 0; i < arr.length; i++) {
        // 1. Xóa các index ngoài window (quá k phần tử)
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();  // removeFront
        }

        // 2. Xóa các index có giá trị NHỎ HƠN arr[i] từ rear
        //    Vì chúng không thể là max nếu arr[i] còn trong window
        while (deque.length > 0 && arr[deque[deque.length - 1]] < arr[i]) {
            deque.pop();  // removeRear
        }

        // 3. Thêm index hiện tại vào rear
        deque.push(i);  // addRear

        // 4. Khi window đủ k phần tử, front của deque là max
        if (i >= k - 1) {
            result.push(arr[deque[0]]);
        }
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Deque
 */
export function demonstrateDeque(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('              DEQUE DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const deque = new Deque<number>();

    // Basic operations
    console.log('--- Basic Operations ---\n');

    deque.addRear(10);
    console.log(`addRear(10): ${deque.toString()}`);

    deque.addRear(20);
    console.log(`addRear(20): ${deque.toString()}`);

    deque.addFront(5);
    console.log(`addFront(5): ${deque.toString()}`);

    deque.addRear(30);
    console.log(`addRear(30): ${deque.toString()}`);

    deque.addFront(1);
    console.log(`addFront(1): ${deque.toString()}`);

    console.log(`\npeekFront(): ${deque.peekFront()}`);
    console.log(`peekRear(): ${deque.peekRear()}`);
    console.log(`size(): ${deque.size()}`);

    console.log(`\nremoveFront(): ${deque.removeFront()}, Deque: ${deque.toString()}`);
    console.log(`removeRear(): ${deque.removeRear()}, Deque: ${deque.toString()}`);

    // Using as Stack
    console.log('\n\n--- Deque as Stack (LIFO) ---\n');

    const stack = new DequeAsStack<string>();
    stack.push('A');
    stack.push('B');
    stack.push('C');
    console.log(`Pushed: A, B, C`);
    console.log(`Pop: ${stack.pop()}, ${stack.pop()}, ${stack.pop()}`);

    // Using as Queue
    console.log('\n--- Deque as Queue (FIFO) ---\n');

    const queue = new DequeAsQueue<string>();
    queue.enqueue('X');
    queue.enqueue('Y');
    queue.enqueue('Z');
    console.log(`Enqueued: X, Y, Z`);
    console.log(`Dequeue: ${queue.dequeue()}, ${queue.dequeue()}, ${queue.dequeue()}`);

    // Sliding Window Maximum
    console.log('\n\n--- Sliding Window Maximum (Classic Deque Problem) ---\n');

    const arr = [1, 3, -1, -3, 5, 3, 6, 7];
    const k = 3;

    console.log(`Array: [${arr.join(', ')}]`);
    console.log(`Window size k = ${k}`);

    const maxes = slidingWindowMaximum(arr, k);
    console.log(`\nMax in each window:`);

    for (let i = 0; i <= arr.length - k; i++) {
        const window = arr.slice(i, i + k);
        console.log(`  [${window.join(', ')}] → Max = ${maxes[i]}`);
    }

    console.log(`\nResult: [${maxes.join(', ')}]`);

    // Complexity
    console.log('\n\n--- Complexity Summary ---\n');
    console.log('| Operation | Time | Space |');
    console.log('|-----------|------|-------|');
    console.log('| addFront | O(1) | O(1) |');
    console.log('| addRear | O(1) | O(1) |');
    console.log('| removeFront | O(1) | O(1) |');
    console.log('| removeRear | O(1) | O(1) |');
    console.log('| peekFront/Rear | O(1) | O(1) |');
}

/**
 * Export default
 */
export default {
    Deque,
    DequeAsStack,
    DequeAsQueue,
    slidingWindowMaximum,
    demonstrateDeque
};
