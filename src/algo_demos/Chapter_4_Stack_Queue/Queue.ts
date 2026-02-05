/**
 * =============================================================================
 * FILE: Queue.ts (Hàng Đợi)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Cài đặt cấu trúc dữ liệu Queue (Hàng đợi).
 *    - Quản lý dữ liệu theo cơ chế FIFO (First In, First Out).
 *
 * 2. KỸ THUẬT & THUẬT TOÁN (ALGORITHM & TECHNIQUE):
 *    - **FIFO (First In, First Out - Vào trước ra trước)**: Phần tử đến sớm nhất sẽ được xử lý đầu tiên (như xếp hàng mua vé).
 *    - **Array-based Implementation**: Sử dụng mảng để lưu trữ.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - **Enqueue (Thêm)**: Thêm phần tử vào cuối hàng đợi (Rear/Back).
 *    - **Dequeue (Lấy)**: Lấy phần tử ở đầu hàng đợi (Front) ra.
 *    - **Front/Peek (Xem)**: Xem phần tử đang chờ ở đầu hàng.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**:
 *      + Enqueue: O(1) - Push vào cuối.
 *      + Dequeue: O(n) (với Shift trên Array Javascript vì phải dời chỉ số của toàn bộ phần tử sau), O(1) (nếu dùng Linked List hoặc Circular Buffer).
 *      + Front: O(1).
 *    - **Space Complexity**: O(n).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Mô hình hóa tốt các luồng công việc thực tế (máy in, request web).
 *    - **Nhược điểm**:
 *      + Dequeue trên mảng thường tốn kém (O(n)) nếu không tối ưu.
 *
 * 6. ỨNG DỤNG THỰC TẾ (REAL WORLD USE CASES):
 *    - Quản lý hàng đợi in ấn (Printer Spooling).
 *    - Breadth-First Search (BFS) trong đồ thị.
 *    - Message Queue trong hệ thống phân tán (RabbitMQ, Kafka).
 *    - Event Loop của JavaScript (Task Queue).
 *
 * =============================================================================
 */

export class Queue<T> {
    private items: T[]; // Mảng lưu trữ

    constructor() {
        this.items = [];
    }

    /**
     * Phương thức: enqueue (Thêm vào hàng)
     * Thêm một phần tử vào cuối hàng đợi.
     * @param element Phần tử cần thêm
     */
    enqueue(element: T): void {
        this.items.push(element);
        console.log(`Enqueue (Vào hàng): ${element}`);
    }

    /**
     * Phương thức: dequeue (Rời hàng)
     * Lấy và xóa phần tử ở đầu hàng đợi.
     * Lưu ý: Sử dụng shift() của Array sẽ tốn O(n). Để tối ưu O(1) cần dùng cấu trúc khác.
     * @returns Phần tử đầu hàng hoặc undefined.
     */
    dequeue(): T | undefined {
        if (this.isEmpty()) return undefined;

        const item = this.items.shift(); // Lấy phần tử đầu tiên và dời các phần tử còn lại
        console.log(`Dequeue (Ra hàng): ${item}`);
        return item;
    }

    /**
     * Phương thức: front (Xem đầu hàng)
     * Xem phần tử đang ở vị trí đầu tiên.
     */
    front(): T | undefined {
        return this.items[0];
    }

    /**
     * Kiểm tra hàng đợi rỗng.
     */
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    /**
     * In trạng thái hàng đợi.
     */
    print(): void {
        console.log("Queue State (Trạng thái Queue):", this.items);
    }
}

// =============================================================================
// VISUALIZATION UTILS
// =============================================================================

export interface QueueStep {
    type: 'enqueue' | 'dequeue' | 'front' | 'error' | 'complete';
    index?: number;
    value?: number;
    description: string;
    queueState: number[]; // Snapshot of queue values
}

export function generateEnqueueSteps(currentQueue: number[], newValue: number): QueueStep[] {
    const steps: QueueStep[] = [];

    // Step 1: Prepare
    steps.push({
        type: 'enqueue',
        value: newValue,
        description: `Chuẩn bị Enqueue ${newValue} vào cuối hàng đợi...`,
        queueState: [...currentQueue]
    });

    // Step 2: Enqueue
    const newQueue = [...currentQueue, newValue];
    steps.push({
        type: 'enqueue',
        index: newQueue.length - 1,
        value: newValue,
        description: `Enqueue(${newValue}): Thêm vào Rear (vị trí cuối)`,
        queueState: newQueue
    });

    // Step 3: Complete
    steps.push({
        type: 'complete',
        index: newQueue.length - 1,
        description: `Hoàn tất Enqueue. Queue size: ${newQueue.length}`,
        queueState: newQueue
    });

    return steps;
}

export function generateDequeueSteps(currentQueue: number[]): QueueStep[] {
    const steps: QueueStep[] = [];

    if (currentQueue.length === 0) {
        steps.push({
            type: 'error',
            description: 'Queue Underflow! Không thể Dequeue từ hàng đợi rỗng.',
            queueState: []
        });
        return steps;
    }

    const frontValue = currentQueue[0];

    // Step 1: Identify Front
    steps.push({
        type: 'dequeue',
        index: 0,
        value: frontValue,
        description: `Xác định Front: ${frontValue} tại index 0`,
        queueState: [...currentQueue]
    });

    // Step 2: Remove (Shift)
    // Visualization: Elements shift left?
    // We just show the state after removal
    const newQueue = currentQueue.slice(1);
    steps.push({
        type: 'dequeue',
        index: 0,
        value: frontValue,
        description: `Dequeue(): Lấy ${frontValue} ra khỏi đầu hàng đợi`,
        queueState: newQueue
    });

    // Step 3: Complete
    steps.push({
        type: 'complete',
        description: `Hoàn tất Dequeue. Các phần tử còn lại dời lên đầu.`,
        queueState: newQueue
    });

    return steps;
}
