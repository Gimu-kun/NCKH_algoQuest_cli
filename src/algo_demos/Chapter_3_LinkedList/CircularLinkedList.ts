/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CIRCULAR LINKED LIST - DANH SÁCH LIÊN KẾT VÒNG
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Circular Linked List (CLL) là danh sách liên kết trong đó node CUỐI CÙNG
 * trỏ về node ĐẦU TIÊN, tạo thành một vòng khép kín.
 * 
 * CÁC LOẠI:
 * 1. Circular Singly Linked List: Mỗi node có 1 pointer (next)
 * 2. Circular Doubly Linked List: Mỗi node có 2 pointers (prev, next)
 * 
 * MINH HỌA:
 * 
 * Circular Singly:
 *     ┌────────────────────────────┐
 *     ▼                            │
 *   [A|●] → [B|●] → [C|●] → [D|●]──┘
 *     ↑
 *   HEAD
 * 
 * Circular Doubly:
 *     ┌─────────────────────────────────────┐
 *     │                                     │
 *     ▼                                     │
 *   ⇄[A|●]⇄ ⇄[B|●]⇄ ⇄[C|●]⇄ ⇄[D|●] ⇄───┘
 *     ↑
 *   HEAD (head.prev = tail, tail.next = head)
 * 
 * SO SÁNH VỚI LINEAR LINKED LIST:
 * 
 * ┌────────────────────────────────────────────────────────┐
 * │      Tiêu chí         |   Linear LL  |   Circular LL   |
 * ├────────────────────────────────────────────────────────┤
 * │ Last node             | next = NULL  | next = HEAD     |
 * │ End detection         | next == NULL | next == HEAD    |
 * │ Traversal             | Start → End  | Continuous loop |
 * │ Access from any node  | Need HEAD    | Can reach all   |
 * │ Memory                | Same         | Same            |
 * └────────────────────────────────────────────────────────┘
 * 
 * ƯU ĐIỂM:
 * ✅ Duyệt vòng tròn liên tục (không có điểm kết thúc)
 * ✅ Từ bất kỳ node nào đều có thể đến mọi node khác
 * ✅ Tốt cho round-robin, circular buffer
 * ✅ Không cần kiểm tra NULL (trừ list rỗng)
 * 
 * NHƯỢC ĐIỂM:
 * ❌ Dễ infinite loop nếu code sai
 * ❌ Phức tạp hơn linear LL
 * ❌ Cần cẩn thận với điều kiện dừng
 * 
 * ỨNG DỤNG:
 * - Round-robin CPU scheduling
 * - Carousel/slideshow (infinite loop)
 * - Multi-player games (turn-based, quay vòng)
 * - Circular buffer (audio/video streaming)
 * - Josephus problem
 * - Music playlist repeat mode
 * 
 * @module CircularLinkedList
 * @category AlgoDemos/LinkedList
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho Circular Singly Node
 */
export interface CircularNode<T> {
    data: T;
    next: CircularNode<T>;  // Không null! Luôn trỏ đến node khác hoặc chính nó
}

// ═══════════════════════════════════════════════════════════════════════════
// CIRCULAR SINGLY LINKED LIST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Circular Singly Linked List
 * 
 * IMPLEMENTATION NOTE:
 * - Lưu TAIL thay vì HEAD
 * - Vì: tail.next = head → có thể access cả head và tail trong O(1)
 */
export class CircularSinglyLinkedList<T> {
    private tail: CircularNode<T> | null = null;
    private size: number = 0;

    // ---------------------------------------------------------------------
    // GETTER METHODS
    // ---------------------------------------------------------------------

    getSize(): number {
        return this.size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    /**
     * Lấy head (tail.next)
     */
    getHead(): CircularNode<T> | null {
        return this.tail ? this.tail.next : null;
    }

    /**
     * Lấy tail
     */
    getTail(): CircularNode<T> | null {
        return this.tail;
    }

    // ---------------------------------------------------------------------
    // INSERT OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Chèn vào đầu - O(1)
     * 
     * FLOW:
     * 1. Tạo node mới
     * 2. newNode.next = head (tail.next)
     * 3. tail.next = newNode (newNode trở thành head mới)
     * 
     * TẠI SAO O(1)?
     * Vì lưu tail, nên head = tail.next luôn accessible
     */
    insertAtHead(data: T): void {
        const newNode: CircularNode<T> = { data, next: null! };

        if (this.isEmpty()) {
            // List rỗng: node trỏ về chính nó
            newNode.next = newNode;
            this.tail = newNode;
        } else {
            // newNode trở thành head mới
            newNode.next = this.tail!.next;  // Trỏ đến head cũ
            this.tail!.next = newNode;        // Tail trỏ đến head mới
        }

        this.size++;
    }

    /**
     * Chèn vào cuối - O(1)
     * 
     * FLOW:
     * 1. insertAtHead(data)
     * 2. Di chuyển tail đến node mới
     * 
     * Vì node mới ở head, chỉ cần move tail pointer
     */
    insertAtTail(data: T): void {
        this.insertAtHead(data);
        // Di chuyển tail đến node vừa thêm
        this.tail = this.tail!.next;
    }

    /**
     * Chèn sau node cụ thể - O(n)
     */
    insertAfter(afterData: T, data: T): boolean {
        if (this.isEmpty()) return false;

        const newNode: CircularNode<T> = { data, next: null! };
        let current = this.tail!.next;  // Start from head

        do {
            if (current.data === afterData) {
                newNode.next = current.next;
                current.next = newNode;

                // Nếu insert sau tail, cập nhật tail
                if (current === this.tail) {
                    this.tail = newNode;
                }

                this.size++;
                return true;
            }
            current = current.next;
        } while (current !== this.tail!.next);  // Quay về head = dừng

        return false;  // Không tìm thấy afterData
    }

    // ---------------------------------------------------------------------
    // DELETE OPERATIONS
    // ---------------------------------------------------------------------

    /**
     * Xóa head - O(1)
     */
    deleteAtHead(): T | null {
        if (this.isEmpty()) return null;

        const head = this.tail!.next;
        const data = head.data;

        if (this.size === 1) {
            // Chỉ có 1 node
            this.tail = null;
        } else {
            // Bỏ qua head
            this.tail!.next = head.next;
        }

        this.size--;
        return data;
    }

    /**
     * Xóa tail - O(n)
     * 
     * NOTE: Với Circular Singly LL, phải tìm node trước tail
     * Với Circular Doubly LL, sẽ là O(1)
     */
    deleteAtTail(): T | null {
        if (this.isEmpty()) return null;

        const data = this.tail!.data;

        if (this.size === 1) {
            this.tail = null;
        } else {
            // Tìm node trước tail
            let current = this.tail!.next;  // head
            while (current.next !== this.tail) {
                current = current.next;
            }

            // current là node trước tail
            current.next = this.tail!.next;  // Trỏ về head
            this.tail = current;
        }

        this.size--;
        return data;
    }

    /**
     * Xóa node có giá trị cụ thể - O(n)
     */
    delete(data: T): boolean {
        if (this.isEmpty()) return false;

        const head = this.tail!.next;

        // Trường hợp đặc biệt: xóa head
        if (head.data === data) {
            this.deleteAtHead();
            return true;
        }

        // Tìm node trước node cần xóa
        let current = head;
        while (current.next !== head && current.next.data !== data) {
            current = current.next;
        }

        if (current.next.data === data) {
            // Nếu xóa tail
            if (current.next === this.tail) {
                this.tail = current;
            }

            current.next = current.next.next;
            this.size--;
            return true;
        }

        return false;
    }

    // ---------------------------------------------------------------------
    // TRAVERSAL & SEARCH
    // ---------------------------------------------------------------------

    /**
     * Duyệt và trả về mảng
     */
    traverse(): T[] {
        if (this.isEmpty()) return [];

        const result: T[] = [];
        let current = this.tail!.next;  // head

        do {
            result.push(current.data);
            current = current.next;
        } while (current !== this.tail!.next);

        return result;
    }

    /**
     * Tìm kiếm
     */
    search(data: T): boolean {
        if (this.isEmpty()) return false;

        let current = this.tail!.next;

        do {
            if (current.data === data) return true;
            current = current.next;
        } while (current !== this.tail!.next);

        return false;
    }

    /**
     * Duyệt N vòng (demo circular behavior)
     */
    traverseRounds(rounds: number): T[] {
        if (this.isEmpty()) return [];

        const result: T[] = [];
        let current = this.tail!.next;
        const totalElements = rounds * this.size;

        for (let i = 0; i < totalElements; i++) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    /**
     * In ra dạng string
     */
    toString(): string {
        if (this.isEmpty()) return '(empty)';

        const arr = this.traverse();
        return `→ [${arr.join('] → [')}] →↺`;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// JOSEPHUS PROBLEM - Ứng dụng kinh điển của Circular LL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Josephus Problem
 * 
 * BÀI TOÁN:
 * N người đứng thành vòng tròn. Bắt đầu từ người thứ 1, đếm K người
 * và loại người thứ K. Tiếp tục cho đến khi còn 1 người. Tìm vị trí sống sót.
 * 
 * VÍ DỤ: N=7, K=3
 * 1 2 3 4 5 6 7 → loại 3 → 1 2 4 5 6 7
 * → loại 6 → 1 2 4 5 7
 * → loại 2 → 1 4 5 7
 * → loại 7 → 1 4 5
 * → loại 5 → 1 4
 * → loại 1 → 4 (người sống sót!)
 * 
 * @param n - Số người
 * @param k - Bước đếm
 * @returns Vị trí người sống sót (1-indexed)
 */
export function josephusProblem(n: number, k: number): number {
    // Tạo circular list với n người
    const cll = new CircularSinglyLinkedList<number>();
    for (let i = 1; i <= n; i++) {
        cll.insertAtTail(i);
    }

    console.log(`\nJosephus Problem: n=${n}, k=${k}`);
    console.log(`Ban đầu: ${cll.toString()}`);

    let current = cll.getTail()!;  // Bắt đầu từ tail (để current.next = head)

    while (cll.getSize() > 1) {
        // Đếm k bước
        for (let i = 0; i < k; i++) {
            current = current.next;
        }

        // Loại người tại current
        const eliminated = current.data;
        console.log(`Loại: ${eliminated}`);

        // Di chuyển đến node trước để chuẩn bị xóa
        let prev = current;
        while (prev.next !== current) {
            prev = prev.next;
        }

        // Xóa current
        prev.next = current.next;

        // Cập nhật tail nếu cần
        if (current === cll.getTail()) {
            // Không thể access private, dùng delete method
            cll.delete(eliminated);
            current = prev;
        } else {
            cll.delete(eliminated);
            current = prev;
        }
    }

    const survivor = cll.traverse()[0];
    console.log(`Người sống sót: ${survivor}`);

    return survivor;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Circular Linked List
 */
export function demonstrateCircularLinkedList(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('       CIRCULAR LINKED LIST DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const cll = new CircularSinglyLinkedList<number>();

    // Insert operations
    console.log('--- Insert Operations ---\n');

    cll.insertAtHead(10);
    console.log(`insertAtHead(10): ${cll.toString()}`);

    cll.insertAtTail(30);
    console.log(`insertAtTail(30): ${cll.toString()}`);

    cll.insertAtHead(5);
    console.log(`insertAtHead(5): ${cll.toString()}`);

    cll.insertAtTail(40);
    console.log(`insertAtTail(40): ${cll.toString()}`);

    cll.insertAfter(10, 20);
    console.log(`insertAfter(10, 20): ${cll.toString()}`);

    // Demonstrate circular nature
    console.log('\n--- Circular Behavior ---\n');
    console.log(`Traverse 1 round: [${cll.traverse().join(', ')}]`);
    console.log(`Traverse 3 rounds: [${cll.traverseRounds(3).join(', ')}]`);

    // Search
    console.log('\n--- Search ---\n');
    console.log(`search(20): ${cll.search(20)}`);
    console.log(`search(100): ${cll.search(100)}`);

    // Delete operations
    console.log('\n--- Delete Operations ---\n');

    console.log(`deleteAtHead(): ${cll.deleteAtHead()}, List: ${cll.toString()}`);
    console.log(`deleteAtTail(): ${cll.deleteAtTail()}, List: ${cll.toString()}`);
    console.log(`delete(20): ${cll.delete(20)}, List: ${cll.toString()}`);

    // Josephus Problem
    console.log('\n\n--- Josephus Problem (Ứng dụng kinh điển) ---');
    josephusProblem(7, 3);

    // Use cases
    console.log('\n\n--- Ứng dụng Circular Linked List ---\n');
    console.log('1. Round-robin Scheduler: Processes take turns in a cycle');
    console.log('2. Token Ring Network: Token passes around the ring');
    console.log('3. Carousel/Slideshow: Images loop infinitely');
    console.log('4. Music Playlist (Repeat All): Songs loop continuously');
    console.log('5. Game Character Selection: Players cycle through options');
}

/**
 * Export default
 */
export default {
    CircularSinglyLinkedList,
    josephusProblem,
    demonstrateCircularLinkedList
};
