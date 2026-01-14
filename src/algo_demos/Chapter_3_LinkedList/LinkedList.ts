/**
 * =============================================================================
 * FILE: LinkedList.ts (Danh Sách Liên Kết Đơn)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Cài đặt cấu trúc dữ liệu Singly Linked List (Danh sách liên kết đơn).
 *    - Quản lý tập hợp các phần tử (Nodes) được nối với nhau qua con trỏ (References/Pointers).
 *
 * 2. CẤU TRÚC (STRUCTURE):
 *    - **Node (Nút)**: Đơn vị cơ bản, bao gồm:
 *         + `value`: Dữ liệu lưu trữ.
 *         + `next`: Tham chiếu đến Node tiếp theo trong danh sách (hoặc null nếu là cuối).
 *    - **Head (Đầu)**: Tham chiếu đến Node đầu tiên.
 *
 * 3. KỸ THUẬT & THUẬT TOÁN (ALGORITHM & TECHNIQUE):
 *    - **Pointer Manipulation (Thao tác con trỏ)**: Thay đổi `next` để nối hoặc ngắt các node.
 *    - **Traversal (Duyệt)**: Đi từ Head đến Tail vòng lặp `while(current.next)` để tìm kiếm hoặc đến cuối danh sách.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Access (Truy cập)**: O(n) - Không thể truy cập ngẫu nhiên qua index, phải duyệt từ đầu.
 *    - **Search (Tìm kiếm)**: O(n).
 *    - **Insertion/Deletion (Thêm/Xóa)**:
 *         + Tại đầu (Beginning): O(1) - Rất nhanh.
 *         + Tại cuối (End): O(n) (nếu không có biến `tail`), O(1) (nếu có biến `tail`).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *         + Dynamic Size (Kích thước động): Dễ dàng thêm/bớt mà không cần cấp phát lại bộ nhớ lớn như Array.
 *         + Efficient Insertion/Deletion: Nhanh hơn Array khi thêm/xóa ở đầu hoặc giữa (khi đã có tham chiếu).
 *    - **Nhược điểm**:
 *         + Slow Access: Không hỗ trợ Random Access (O(1)) như Array; muốn lấy phần tử thứ k phải duyệt k bước.
 *         + Memory Overhead: Tốn thêm bộ nhớ để lưu con trỏ `next`.
 *
 * 6. SO SÁNH (VS OTHER DATA STRUCTURES):
 *    - So với **Array (Mảng)**: Linked List linh hoạt hơn về bộ nhớ nhưng chậm hơn về truy cập. Array cache-friendly hơn.
 *
 * =============================================================================
 */

// Định nghĩa Class Node (Nút)
// Generic <T> giúp Node có thể chứa bất kỳ kiểu dữ liệu nào (number, string, object...)
class ListNode<T> {
    value: T;                 // Dữ liệu của nút
    next: ListNode<T> | null; // Con trỏ trỏ tới nút tiếp theo (hoặc null)

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

// Class LinkedList (Danh sách liên kết)
// Quản lý Head và các thao tác trên danh sách
export class LinkedList<T> {
    head: ListNode<T> | null; // Con trỏ Head (quản lý điểm bắt đầu)
    size: number;             // Theo dõi số lượng phần tử hiện có

    // Constructor: Khởi tạo danh sách rỗng
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Kiểm tra danh sách có rỗng hay không
    isEmpty(): boolean {
        return this.size === 0;
    }

    /**
     * Phương thức: append (Thêm vào cuối)
     * Flow:
     * 1. Tạo node mới.
     * 2. Nếu list rỗng -> Head = node mới.
     * 3. Nếu không rỗng -> Duyệt (Traverse) đến node cuối cùng.
     * 4. Gán next của node cuối = node mới.
     * Time Complexity: O(n) (Do phải duyệt từ đầu đến cuối)
     */
    append(value: T): void {
        const newNode = new ListNode(value);

        // Case 1: Danh sách đang rỗng
        if (!this.head) {
            this.head = newNode;
        } else {
            // Case 2: Danh sách có phần tử -> Cần tìm nút cuối (Tail)
            let current = this.head;
            while (current.next) {
                current = current.next; // Di chuyển con trỏ sang nút kế tiếp
            }
            // Đã đến nút cuối (current.next === null) -> Nối nút mới vào đây
            current.next = newNode;
        }
        this.size++;
    }

    /**
     * Phương thức: prepend (Thêm vào đầu)
     * Flow:
     * 1. Tạo node mới.
     * 2. Gán next của node mới = Head hiện tại.
     * 3. Cập nhật Head = node mới.
     * Time Complexity: O(1) (Cực nhanh)
     */
    prepend(value: T): void {
        const newNode = new ListNode(value);

        // Nối node mới vào trước Head cũ
        newNode.next = this.head;
        // Cập nhật Head trỏ vào node mới
        this.head = newNode;
        this.size++;
    }

    /**
     * Phương thức: delete (Xóa phần tử đầu tiên tìm thấy)
     * Flow:
     * 1. Nếu list rỗng -> Return.
     * 2. Nếu Head là giá trị cần xóa -> Cập nhật Head = Head.next.
     * 3. Nếu không -> Duyệt tìm node có next.value == value.
     * 4. Bỏ qua node đó (current.next = current.next.next).
     */
    delete(value: T): void {
        if (!this.head) return;

        // Case 1: Xóa ngay tại Head
        if (this.head.value === value) {
            console.log(`Deleting Head value: ${value}`);
            this.head = this.head.next; // Head nhảy cóc qua nút bị xóa
            this.size--;
            return;
        }

        // Case 2: Xóa ở thân hoặc đuôi danh sách
        // Cần tìm node "đứng trước" node cần xóa
        let current = this.head;
        while (current.next) {
            if (current.next.value === value) {
                console.log(`Deleting Node value: ${value}`);
                // Kỹ thuật: Unlink node (Ngắt liên kết)
                // Nối node hiện tại (current) với node sau node bị xóa (next.next)
                current.next = current.next.next;
                this.size--;
                return;
            }
            current = current.next;
        }
    }

    // PRINT: In danh sách ra console để visualization
    print(): void {
        if (!this.head) {
            console.log("Empty List");
            return;
        }

        let result = "";
        let current: ListNode<T> | null = this.head;

        // Duyệt qua toàn bộ danh sách
        while (current) {
            result += `${current.value} -> `;
            current = current.next;
        }
        result += "null";
        console.log(result);
    }
}
