/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DOUBLY LINKED LIST - DANH SÁCH LIÊN KẾT ĐÔI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Doubly Linked List (DLL) là danh sách liên kết trong đó mỗi node có 
 * 2 CON TRỎ: một trỏ đến node TRƯỚC (prev) và một trỏ đến node SAU (next).
 * 
 * CẤU TRÚC NODE:
 * 
 *     ┌─────────┬─────────┬─────────┐
 *     │  prev   │  data   │  next   │
 *     └────↑────┴─────────┴────↓────┘
 *          │                    │
 *     ← Previous Node      Next Node →
 * 
 * SO SÁNH VỚI SINGLY LINKED LIST:
 * 
 * ┌────────────────────────────────────────────────────────┐
 * │       Tiêu chí      |   Singly LL  |     Doubly LL     |
 * ├────────────────────────────────────────────────────────┤
 * │ Pointers/node       | 1 (next)     | 2 (prev + next)   |
 * │ Memory/node         | Less         | More (+1 pointer) |
 * │ Traverse direction  | Forward only | Both directions   |
 * │ Delete node(có ptr) | O(n)*        | O(1)              |
 * │ Delete tail         | O(n)         | O(1)              |
 * │ Implementation      | Simpler      | More complex      |
 * └────────────────────────────────────────────────────────┘
 * * Cần tìm previous node
 * 
 * ƯU ĐIỂM:
 * ✅ Duyệt 2 chiều (forward & backward)
 * ✅ Xóa node O(1) nếu có pointer đến node đó
 * ✅ Xóa tail O(1) với tail pointer
 * ✅ Thích hợp cho Browser History, Undo/Redo
 * ✅ Chèn trước/sau node đã biết: O(1)
 * 
 * NHƯỢC ĐIỂM:
 * ❌ Tốn thêm bộ nhớ cho prev pointer
 * ❌ Insert/Delete phức tạp hơn (update cả prev và next)
 * ❌ Dễ bug hơn Singly LL
 * 
 * ỨNG DỤNG:
 * - Browser history (back/forward navigation)
 * - Undo/Redo trong text editors
 * - LRU Cache (kết hợp với HashMap)
 * - Music/Video playlist với prev/next
 * - Navigation menus
 * 
 * @module DoublyLinkedList
 * @category AlgoDemos/LinkedList
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho Doubly Linked List Node
 */
export interface DoublyNode<T> {
    data: T;
    prev: DoublyNode<T> | null;
    next: DoublyNode<T> | null;
}

/**
 * Interface cho visualization step
 */
export interface DLLStep {
    action: 'insert' | 'delete' | 'traverse' | 'search';
    position?: 'head' | 'tail' | 'middle' | number;
    value: number;
    list: number[];
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLY LINKED LIST CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Doubly Linked List implementation
 */
export class DoublyLinkedList<T> {
    private head: DoublyNode<T> | null = null;
    private tail: DoublyNode<T> | null = null;
    private size: number = 0;

    // ---------------------------------------------------------------------
    // HELPER METHODS
    // ---------------------------------------------------------------------

    /**
     * Tạo node mới
     */
    private createNode(data: T): DoublyNode<T> {
        return {
            data,
            prev: null,
            next: null
        };
    }

    /**
     * Lấy số phần tử
     */
    getSize(): number {
        return this.size;
    }

    /**
     * Kiểm tra rỗng
     */
    isEmpty(): boolean {
        return this.size === 0;
    }

    // ---------------------------------------------------------------------
    // INSERT OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Chèn vào đầu danh sách - O(1)
     * 
     * FLOW:
     * 1. Tạo node mới
     * 2. newNode.next = head (trỏ đến head cũ)
     * 3. Nếu head tồn tại: head.prev = newNode
     * 4. head = newNode
     * 5. Nếu list rỗng: tail = newNode
     * 
     * MINH HỌA:
     * TRƯỚC: NULL ← [A] ⇄ [B] ⇄ [C] → NULL
     *              ↑head
     * 
     * Chèn X vào đầu:
     * SAU:   NULL ← [X] ⇄ [A] ⇄ [B] ⇄ [C] → NULL
     *              ↑head
     */
    insertAtHead(data: T): void {
        const newNode = this.createNode(data);

        if (this.isEmpty()) {
            // List rỗng: head = tail = newNode
            this.head = newNode;
            this.tail = newNode;
        } else {
            // Kết nối với head cũ
            newNode.next = this.head;
            this.head!.prev = newNode;
            this.head = newNode;
        }

        this.size++;
    }

    /**
     * Chèn vào cuối danh sách - O(1)
     * 
     * ĐẶC BIỆT: 
     * - DLL với tail pointer: O(1)
     * - SLL không có tail: O(n)
     * 
     * MINH HỌA:
     * TRƯỚC: NULL ← [A] ⇄ [B] ⇄ [C] → NULL
     *                              ↑tail
     * 
     * Chèn X vào cuối:
     * SAU:   NULL ← [A] ⇄ [B] ⇄ [C] ⇄ [X] → NULL
     *                                  ↑tail
     */
    insertAtTail(data: T): void {
        const newNode = this.createNode(data);

        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail!.next = newNode;
            this.tail = newNode;
        }

        this.size++;
    }

    /**
     * Chèn vào vị trí index - O(n)
     * 
     * FLOW:
     * 1. Nếu index = 0: insertAtHead
     * 2. Nếu index = size: insertAtTail
     * 3. Tìm node tại vị trí index-1 (previous)
     * 4. Cập nhật 4 links: prev←newNode→next, prev→newNode←next
     */
    insertAt(index: number, data: T): void {
        if (index < 0 || index > this.size) {
            throw new Error('Index out of bounds');
        }

        if (index === 0) {
            this.insertAtHead(data);
            return;
        }

        if (index === this.size) {
            this.insertAtTail(data);
            return;
        }

        // Tìm node tại vị trí index
        const current = this.getNodeAt(index);
        const prev = current!.prev;

        const newNode = this.createNode(data);

        // Cập nhật links
        newNode.prev = prev;
        newNode.next = current;
        prev!.next = newNode;
        current!.prev = newNode;

        this.size++;
    }

    // ---------------------------------------------------------------------
    // DELETE OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Xóa node đầu - O(1)
     */
    deleteAtHead(): T | null {
        if (this.isEmpty()) return null;

        const data = this.head!.data;

        if (this.size === 1) {
            // Chỉ có 1 node
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head!.next;
            this.head!.prev = null;
        }

        this.size--;
        return data;
    }

    /**
     * Xóa node cuối - O(1)
     * 
     * ⭐ ĐÂY LÀ ƯU ĐIỂM LỚN CỦA DLL!
     * - SLL: O(n) vì phải tìm node trước tail
     * - DLL: O(1) vì có prev pointer
     */
    deleteAtTail(): T | null {
        if (this.isEmpty()) return null;

        const data = this.tail!.data;

        if (this.size === 1) {
            this.head = null;
            this.tail = null;
        } else {
            // Có prev pointer nên O(1)!
            this.tail = this.tail!.prev;
            this.tail!.next = null;
        }

        this.size--;
        return data;
    }

    /**
     * Xóa node tại vị trí - O(n)
     */
    deleteAt(index: number): T | null {
        if (index < 0 || index >= this.size) return null;

        if (index === 0) return this.deleteAtHead();
        if (index === this.size - 1) return this.deleteAtTail();

        const current = this.getNodeAt(index)!;
        const prev = current.prev!;
        const next = current.next!;

        // Bỏ qua node hiện tại
        prev.next = next;
        next.prev = prev;

        this.size--;
        return current.data;
    }

    /**
     * Xóa node cụ thể (đã có pointer) - O(1)
     * 
     * ⭐ ƯU ĐIỂM LỚN CỦA DLL!
     * Nếu đã có reference đến node cần xóa, không cần duyệt list
     */
    deleteNode(node: DoublyNode<T>): T {
        if (node === this.head) {
            return this.deleteAtHead()!;
        }

        if (node === this.tail) {
            return this.deleteAtTail()!;
        }

        // Node ở giữa: O(1) vì có cả prev và next
        node.prev!.next = node.next;
        node.next!.prev = node.prev;

        this.size--;
        return node.data;
    }

    // ---------------------------------------------------------------------
    // SEARCH & TRAVERSAL
    // ---------------------------------------------------------------------

    /**
     * Lấy node tại vị trí
     * 
     * TỐI ƯU: Chọn hướng duyệt gần hơn
     * - index < size/2 → duyệt từ head
     * - index >= size/2 → duyệt từ tail
     */
    private getNodeAt(index: number): DoublyNode<T> | null {
        if (index < 0 || index >= this.size) return null;

        let current: DoublyNode<T>;

        if (index < this.size / 2) {
            // Duyệt từ head
            current = this.head!;
            for (let i = 0; i < index; i++) {
                current = current.next!;
            }
        } else {
            // Duyệt từ tail (tối ưu!)
            current = this.tail!;
            for (let i = this.size - 1; i > index; i--) {
                current = current.prev!;
            }
        }

        return current;
    }

    /**
     * Tìm kiếm giá trị
     */
    search(data: T): number {
        let current = this.head;
        let index = 0;

        while (current !== null) {
            if (current.data === data) {
                return index;
            }
            current = current.next;
            index++;
        }

        return -1;  // Không tìm thấy
    }

    /**
     * Lấy giá trị tại vị trí
     */
    get(index: number): T | null {
        const node = this.getNodeAt(index);
        return node ? node.data : null;
    }

    /**
     * Duyệt forward (từ head đến tail)
     */
    traverseForward(): T[] {
        const result: T[] = [];
        let current = this.head;

        while (current !== null) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    /**
     * Duyệt backward (từ tail đến head)
     */
    traverseBackward(): T[] {
        const result: T[] = [];
        let current = this.tail;

        while (current !== null) {
            result.push(current.data);
            current = current.prev;
        }

        return result;
    }

    // ---------------------------------------------------------------------
    // UTILITY METHODS
    // ---------------------------------------------------------------------

    /**
     * Đảo ngược list - O(n)
     */
    reverse(): void {
        let current = this.head;
        let temp: DoublyNode<T> | null = null;

        while (current !== null) {
            // Swap prev và next
            temp = current.prev;
            current.prev = current.next;
            current.next = temp;

            // Di chuyển đến node tiếp theo (giờ là prev)
            current = current.prev;
        }

        // Swap head và tail
        temp = this.head;
        this.head = this.tail;
        this.tail = temp;
    }

    /**
     * Chuyển thành mảng
     */
    toArray(): T[] {
        return this.traverseForward();
    }

    /**
     * In ra dạng string
     */
    toString(): string {
        return `NULL ← [${this.toArray().join('] ⇄ [')}] → NULL`;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Doubly Linked List
 */
export function demonstrateDoublyLinkedList(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('         DOUBLY LINKED LIST DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const dll = new DoublyLinkedList<number>();

    // Insert operations
    console.log('--- Insert Operations ---\n');

    dll.insertAtHead(10);
    console.log(`insertAtHead(10): ${dll.toString()}`);

    dll.insertAtTail(30);
    console.log(`insertAtTail(30): ${dll.toString()}`);

    dll.insertAt(1, 20);
    console.log(`insertAt(1, 20): ${dll.toString()}`);

    dll.insertAtHead(5);
    console.log(`insertAtHead(5): ${dll.toString()}`);

    dll.insertAtTail(40);
    console.log(`insertAtTail(40): ${dll.toString()}`);

    // Traversal
    console.log('\n--- Traversal ---\n');
    console.log('Forward:', dll.traverseForward());
    console.log('Backward:', dll.traverseBackward());

    // Search
    console.log('\n--- Search ---\n');
    console.log(`search(20):`, dll.search(20));
    console.log(`search(100):`, dll.search(100));

    // Delete operations
    console.log('\n--- Delete Operations ---\n');

    console.log(`deleteAtHead(): ${dll.deleteAtHead()}, List: ${dll.toString()}`);
    console.log(`deleteAtTail(): ${dll.deleteAtTail()}, List: ${dll.toString()}`);
    console.log(`deleteAt(1): ${dll.deleteAt(1)}, List: ${dll.toString()}`);

    // Reverse
    console.log('\n--- Reverse ---\n');
    dll.insertAtTail(50);
    dll.insertAtTail(60);
    console.log(`Before reverse: ${dll.toString()}`);
    dll.reverse();
    console.log(`After reverse:  ${dll.toString()}`);

    // Complexity comparison
    console.log('\n\n--- So sánh với Singly Linked List ---\n');
    console.log('| Operation | Singly LL | Doubly LL |');
    console.log('|-----------|-----------|-----------|');
    console.log('| Insert at head | O(1) | O(1) |');
    console.log('| Insert at tail | O(n)* | O(1) |');
    console.log('| Delete at head | O(1) | O(1) |');
    console.log('| Delete at tail | O(n) | O(1) ✅ |');
    console.log('| Delete node (có ptr) | O(n) | O(1) ✅ |');
    console.log('| Traverse backward | O(n²) | O(n) ✅ |');
    console.log('\n* O(1) nếu có tail pointer');
}

/**
 * Export default
 */
export default {
    DoublyLinkedList,
    demonstrateDoublyLinkedList
};
