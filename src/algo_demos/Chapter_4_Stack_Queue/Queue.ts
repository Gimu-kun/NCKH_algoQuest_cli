/**
 * Tên cấu trúc: Queue (Hàng đợi)
 *
 * Mục tiêu: Quản lý dữ liệu theo cơ chế FIFO.
 *
 * Kỹ thuật (Technique): FIFO (First In, First Out) - Vào trước ra trước.
 *
 * Độ phức tạp (Complexity):
 *  - Enqueue: O(1).
 *  - Dequeue: O(n) (với mảng JavaScript vì phải shift index), O(1) với Linked List.
 *
 * Ứng dụng: Xử lý tác vụ in ấn, Hàng đợi xử lý sự kiện (Event Loop), Duyệt BFS.
 * 
 * Steps Flow:
 * - Enqueue: Thêm vào cuối mảng (Rear).
 * - Dequeue: Lấy ra từ đầu mảng (Front).
 */

export class Queue<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    // ENQUEUE: Thêm vào cuối hàng đợi
    enqueue(element: T): void {
        this.items.push(element);
        console.log(`Enqueue: ${element}`);
    }

    // DEQUEUE: Lấy phần tử đầu hàng đợi
    dequeue(): T | undefined {
        if (this.isEmpty()) return undefined;
        const item = this.items.shift();
        console.log(`Dequeue: ${item}`);
        return item;
    }

    // FRONT: Xem phần tử đầu
    front(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    print(): void {
        console.log("Queue State:", this.items);
    }
}
