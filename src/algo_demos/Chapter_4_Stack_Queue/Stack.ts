/**
 * Tên cấu trúc: Stack (Ngăn xếp)
 *
 * Mục tiêu: Quản lý dữ liệu theo cơ chế LIFO.
 *
 * Kỹ thuật (Technique): LIFO (Last In, First Out) - Vào sau ra trước.
 *
 * Độ phức tạp (Complexity):
 *  - Push/Pop/Peek: O(1).
 *  - Search: O(n).
 *
 * Ứng dụng: Undo/Redo, Quản lý bộ nhớ Call Stack, Duyệt DFS, Kiểm tra ngoặc hợp lệ.
 * 
 * Steps Flow:
 * - Push: Thêm vào cuối mảng (Top).
 * - Pop: Lấy ra từ cuối mảng.
 */

export class Stack<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    // PUSH: Thêm phần tử vào đỉnh Stack
    push(element: T): void {
        this.items.push(element);
        console.log(`Push: ${element}`);
    }

    // POP: Lấy phần tử đỉnh ra khỏi Stack
    pop(): T | undefined {
        if (this.isEmpty()) return undefined;
        const popped = this.items.pop();
        console.log(`Pop: ${popped}`);
        return popped;
    }

    // PEEK: Xem phần tử đỉnh
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    print(): void {
        console.log("Stack State:", this.items);
    }
}
