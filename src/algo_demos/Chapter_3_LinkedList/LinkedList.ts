/**
 * FILE: LinkedList.ts
 * MỤC TIÊU: Minh họa cấu trúc dữ liệu Danh sách liên kết đơn (Singly Linked List).
 */

// Định nghĩa Node (Nút)
// Mỗi Node chứa Data (Dữ liệu) và Next Pointer (Con trỏ trỏ tới nút tiếp theo)
class ListNode<T> {
    value: T;
    next: ListNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

/**
 * Class LinkedList
 * Quản lý danh sách các Node.
 * Operations (Thao tác): Append, Prepend, Delete, Search, Print.
 * 
 * Complexity:
 *  - Access (Truy cập): O(n) - Phải duyệt từ đầu (Head).
 *  - Search (Tìm kiếm): O(n).
 *  - Insertion/Deletion (Chèn/Xóa) tại đầu: O(1).
 *  - Insertion/Deletion (Chèn/Xóa) tại cuối: O(n) (nếu không lưu Tail pointer), O(1) (nếu có Tail pointer).
 */
export class LinkedList<T> {
    head: ListNode<T> | null; // Nút đầu tiên (Head Node)
    size: number;

    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Is Empty check
    isEmpty(): boolean {
        return this.size === 0;
    }

    // APPEND: Thêm vào cuối danh sách
    append(value: T): void {
        const newNode = new ListNode(value);

        // Case 1: List rỗng -> Head chính là New Node
        if (!this.head) {
            this.head = newNode;
        } else {
            // Case 2: Duyệt (Traverse) đến nút cuối cùng
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            // Link nút cuối cùng tới New Node
            current.next = newNode;
        }
        this.size++;
    }

    // PREPEND: Thêm vào đầu danh sách
    prepend(value: T): void {
        const newNode = new ListNode(value);

        // Trỏ Next của New Node tới Head hiện tại
        newNode.next = this.head;
        // Cập nhật Head mới
        this.head = newNode;
        this.size++;
    }

    // DELETE: Xóa phần tử đầu tiên có giá trị value
    delete(value: T): void {
        if (!this.head) return;

        // Case 1: Xóa Head
        if (this.head.value === value) {
            this.head = this.head.next; // Head dịch chuyển sang nút kế tiếp
            this.size--;
            return;
        }

        // Case 2: Xóa ở giữa hoặc cuối
        // Cần duy trì con trỏ 'previous' để nối lại danh sách sau khi xóa
        let current = this.head;
        while (current.next) {
            if (current.next.value === value) {
                // Skip the next node
                current.next = current.next.next;
                this.size--;
                return;
            }
            current = current.next;
        }
    }

    // PRINT: In danh sách ra console để kiểm tra
    print(): void {
        if (!this.head) {
            console.log("Empty List");
            return;
        }

        let result = "";
        let current: ListNode<T> | null = this.head;
        while (current) {
            result += `${current.value} -> `;
            current = current.next;
        }
        result += "null";
        console.log(result);
    }
}

// Example (Ví dụ)
/*
const list = new LinkedList<number>();
list.append(10);
list.append(20);
list.prepend(5);
list.print(); // 5 -> 10 -> 20 -> null
list.delete(10);
list.print(); // 5 -> 20 -> null
*/
