/**
 * =============================================================================
 * FILE: Stack.ts (Ngăn Xếp)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Cài đặt cấu trúc dữ liệu Stack (Ngăn xếp).
 *    - Quản lý dữ liệu theo cơ chế LIFO (Last In, First Out).
 *
 * 2. KỸ THUẬT & THUẬT TOÁN (ALGORITHM & TECHNIQUE):
 *    - **LIFO (Last In, First Out - Vào sau ra trước)**: Phần tử được thêm vào cuối cùng sẽ là phần tử đầu tiên được lấy ra.
 *    - **Array-based Implementation**: Sử dụng mảng để lưu trữ, tận dụng phương thức `push` và `pop` có sẵn của JavaScript.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - **Push (Thêm)**: Chèn phần tử vào đỉnh (TOP) của stack.
 *    - **Pop (Lấy)**: Lấy phần tử ở đỉnh ra khỏi stack và trả về giá trị đó.
 *    - **Peek/Top (Xem)**: Xem giá trị ở đỉnh mà không lấy nó ra.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**:
 *      + Push: O(1) - Thêm vào cuối mảng.
 *      + Pop: O(1) - Lấy từ cuối mảng.
 *      + Peek: O(1) - Truy cập index cuối.
 *      + Search: O(n) - Phải duyệt qua các phần tử.
 *    - **Space Complexity**: O(n) - Tỉ lệ thuận với số phần tử lưu trữ.
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Đơn giản, dễ cài đặt.
 *      + Tốc độ truy xuất phần tử gần nhất (Top) cực nhanh.
 *    - **Nhược điểm**:
 *      + Không thể truy cập ngẫu nhiên (Random Access) các phần tử ở giữa.
 *
 * 6. ỨNG DỤNG THỰC TẾ (REAL WORLD USE CASES):
 *    - Chức năng Undo/Redo trong các phần mềm soạn thảo.
 *    - Quản lý lời gọi hàm (Call Stack) trong trình biên dịch/thông dịch.
 *    - Kiểm tra tính hợp lệ của ngoặc: `(( ))`.
 *    - Duyệt đồ thị theo chiều sâu (DFS).
 *
 * =============================================================================
 */

export class Stack<T> {
    private items: T[]; // Mảng lưu trữ các phần tử của Stack

    constructor() {
        this.items = [];
    }

    /**
     * Phương thức: push (Thêm)
     * Thêm một phần tử vào đỉnh của ngăn xếp.
     * @param element Phần tử cần thêm
     */
    push(element: T): void {
        this.items.push(element);
        console.log(`Push (Thêm vào Stack): ${element}`);
    }

    /**
     * Phương thức: pop (Lấy ra)
     * Lấy và xóa phần tử ở đỉnh ngăn xếp (phần tử mới nhất).
     * @returns Phần tử vừa lấy ra hoặc undefined nếu stack rỗng.
     */
    pop(): T | undefined {
        if (this.isEmpty()) return undefined;

        const popped = this.items.pop(); // Phương thức pop của Array cũng tuân theo LIFO
        console.log(`Pop (Lấy khỏi Stack): ${popped}`);
        return popped;
    }

    /**
     * Phương thức: peek (Xem đỉnh)
     * Xem phần tử đang ở đỉnh stack mà không xóa nó.
     * @returns Phần tử đỉnh hoặc undefined.
     */
    peek(): T | undefined {
        // Phần tử đỉnh là phần tử ở chỉ số cuối cùng (length - 1)
        return this.items[this.items.length - 1];
    }

    /**
     * Kiểm tra stack có rỗng không.
     */
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    /**
     * In trạng thái hiện tại của stack (Helper for Debugging)
     */
    print(): void {
        console.log("Stack State (Trạng thái Stack):", this.items);
    }
}
