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

    /**
     * Phương thức: search (Tìm kiếm)
     * Time Complexity: O(n)
     */
    search(value: T): ListNode<T> | null {
        let current = this.head;
        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null; // Không tìm thấy
    }

    /**
     * Phương thức: reverse (Đảo ngược)
     * Time Complexity: O(n), Space Complexity: O(1)
     * Sử dụng 3 con trỏ: prev, current, next
     */
    reverse(): void {
        let prev: ListNode<T> | null = null;
        let current = this.head;

        while (current) {
            const next = current.next; // Lưu node sau
            current.next = prev;       // Đảo chiều mũi tên
            prev = current;            // Tiến lên
            current = next;            // Tiến lên
        }

        this.head = prev; // Cập nhật Head mới
    }

    /**
     * Phương thức: insertAt (Chèn tại vị trí k)
     * Time Complexity: O(n)
     */
    insertAt(index: number, value: T): void {
        if (index < 0 || index > this.size) return; // Index không hợp lệ

        if (index === 0) {
            this.prepend(value);
            return;
        }

        if (index === this.size) {
            this.append(value);
            return;
        }

        const newNode = new ListNode(value);
        let current = this.head;
        let prev: ListNode<T> | null = null;
        let i = 0;

        // Tìm vị trí index
        while (i < index && current) {
            prev = current;
            current = current.next;
            i++;
        }

        // Chèn vào giữa prev và current
        if (prev) {
            prev.next = newNode;
            newNode.next = current;
            this.size++;
        }
    }


    /**
     * Lấy giá trị tại index
     */
    get(index: number): T | null {
        if (index < 0 || index >= this.size) return null;

        let current = this.head;
        for (let i = 0; i < index; i++) {
            if (current) current = current.next;
        }

        return current ? current.value : null;
    }
}

// =============================================================================
// VISUALIZATION UTILS (Moved from LinkedListAnimationUtils.ts)
// =============================================================================

export interface ListNodeData {
    val: number;
    next: number | null; // Index of next node, null for tail
}

export interface LinkedListStep {
    type: 'traverse' | 'insert' | 'delete' | 'found' | 'update' | 'complete';
    nodeIndex: number;
    nodes: ListNodeData[];
    description: string;
    highlight?: number[];
}

/**
 * Generate traversal animation steps
 */
export function generateTraversalSteps(values: number[]): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    const nodes: ListNodeData[] = values.map((val, i) => ({
        val,
        next: i < values.length - 1 ? i + 1 : null
    }));

    for (let i = 0; i < nodes.length; i++) {
        steps.push({
            type: 'traverse',
            nodeIndex: i,
            nodes: [...nodes],
            description: `Duyệt node ${i}: giá trị = ${nodes[i].val}`,
            highlight: [i]
        });
    }

    steps.push({
        type: 'complete',
        nodeIndex: -1,
        nodes: [...nodes],
        description: `Hoàn thành duyệt ${nodes.length} nodes`
    });

    return steps;
}

/**
 * Generate insert at head animation steps
 */
export function generateInsertAtHeadSteps(values: number[], newVal: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    const nodes: ListNodeData[] = values.map((val, i) => ({
        val,
        next: i < values.length - 1 ? i + 1 : null
    }));

    // Step 1: Show current list
    steps.push({
        type: 'traverse',
        nodeIndex: 0,
        nodes: [...nodes],
        description: `List hiện tại có ${nodes.length} nodes`
    });

    // Step 2: Create new node
    const newNode: ListNodeData = { val: newVal, next: 0 };
    // New node at conceptual index -1 initially? No, let's just describe it.
    // In strict array view, we can prepend it.

    // For visualization consistency, let's prepend immediately but mark it NEW
    const newNodes = [newNode, ...nodes.map((n, i) => ({
        ...n,
        next: i < nodes.length - 1 ? i + 2 : null
    }))];
    // Initially pointers might not be set for new node?
    // Let's assume ideal "step by step".

    steps.push({
        type: 'insert',
        nodeIndex: 0,
        nodes: newNodes, // Inserted at 0
        description: `Tạo node mới với giá trị ${newVal}`,
        highlight: [0]
    });

    // Step 3: Update head
    steps.push({
        type: 'update',
        nodeIndex: 0,
        nodes: newNodes,
        description: `newNode.next = head; head = newNode`,
        highlight: [0, 1]
    });

    steps.push({
        type: 'complete',
        nodeIndex: 0,
        nodes: newNodes,
        description: `Chèn ${newVal} vào đầu thành công!`
    });

    return steps;
}

/**
 * Generate insert at tail animation steps
 */
export function generateInsertAtTailSteps(values: number[], newVal: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    const nodes: ListNodeData[] = values.map((val, i) => ({
        val,
        next: i < values.length - 1 ? i + 1 : null
    }));

    // Traverse to find tail
    for (let i = 0; i < nodes.length; i++) {
        steps.push({
            type: 'traverse',
            nodeIndex: i,
            nodes: [...nodes],
            description: i < nodes.length - 1
                ? `Duyệt node ${i}, tiếp tục...`
                : `Tìm thấy tail ở node ${i}`,
            highlight: [i]
        });
    }

    // Create new node
    const newNodes = [...nodes];
    const newNodeIndex = newNodes.length;

    // Step: Create node
    // We add it to the array, but it's not linked yet
    newNodes.push({ val: newVal, next: null });

    steps.push({
        type: 'insert',
        nodeIndex: newNodeIndex,
        nodes: newNodes,
        description: `Tạo node mới với giá trị ${newVal}`,
        highlight: [newNodeIndex]
    });

    // Update tail.next
    if (newNodes.length > 1) { // If there was a previous node
        const tailIndex = newNodeIndex - 1;
        newNodes[tailIndex].next = newNodeIndex;

        steps.push({
            type: 'update',
            nodeIndex: tailIndex,
            nodes: [...newNodes],
            description: `tail.next = newNode (link node ${tailIndex} -> node ${newNodeIndex})`,
            highlight: [tailIndex, newNodeIndex]
        });
    }

    steps.push({
        type: 'complete',
        nodeIndex: newNodeIndex,
        nodes: newNodes,
        description: `Chèn ${newVal} vào cuối thành công!`
    });

    return steps;
}

/**
 * Generate delete by value animation steps
 */
export function generateDeleteSteps(values: number[], targetVal: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    const nodes: ListNodeData[] = values.map((val, i) => ({
        val,
        next: i < values.length - 1 ? i + 1 : null
    }));

    let foundIndex = -1;

    // Traverse to find
    for (let i = 0; i < nodes.length; i++) {
        steps.push({
            type: 'traverse',
            nodeIndex: i,
            nodes: [...nodes],
            description: `Kiểm tra node ${i}: ${nodes[i].val} ${nodes[i].val === targetVal ? '==' : '!='} ${targetVal}?`,
            highlight: [i]
        });

        if (nodes[i].val === targetVal) {
            foundIndex = i;
            steps.push({
                type: 'found',
                nodeIndex: i,
                nodes: [...nodes],
                description: `Tìm thấy node cần xóa tại index ${i}`,
                highlight: [i]
            });
            break;
        }
    }

    if (foundIndex === -1) {
        steps.push({
            type: 'complete',
            nodeIndex: -1,
            nodes: [...nodes],
            description: `Không tìm thấy giá trị ${targetVal} trong danh sách!`,
            highlight: []
        });
        return steps;
    }

    // Delete
    // Logic: Remove from array. 
    // BUT for visualization: 
    // If head (index 0): essentially shift data?
    // If middle: relink prev -> next

    // For simplicity in this array-based view, we just show the final state after deletion
    const finalNodes = nodes.filter((_, idx) => idx !== foundIndex).map((n, i, arr) => ({
        val: n.val,
        next: i < arr.length - 1 ? i + 1 : null
    }));

    steps.push({
        type: 'delete',
        nodeIndex: foundIndex,
        nodes: finalNodes,
        description: `Đã xóa node tại index ${foundIndex}. Cập nhật liên kết.`,
        highlight: []
    });

    steps.push({
        type: 'complete',
        nodeIndex: -1,
        nodes: finalNodes,
        description: `Xóa thành công!`,
        highlight: []
    });

    return steps;
}

/**
 * Generate reverse linked list animation steps
 */
export function generateReverseSteps(values: number[]): LinkedListStep[] {
    const steps: LinkedListStep[] = [];

    // Represent as indices pointing to next
    let prev: number | null = null;
    let current = 0;
    // Initial pointers as if strictly linear
    const pointers = values.map((_, i) => i < values.length - 1 ? i + 1 : null);

    steps.push({
        type: 'traverse',
        nodeIndex: 0,
        nodes: values.map((val, i) => ({ val, next: pointers[i] })),
        description: 'Bắt đầu reverse: prev = null, current = head'
    });

    while (current !== null && current < values.length) {
        const next = pointers[current];

        steps.push({
            type: 'traverse',
            nodeIndex: current,
            nodes: values.map((val, i) => ({ val, next: pointers[i] })),
            description: `current = ${values[current]}, next = ${next !== null ? values[next] : 'null'}`,
            highlight: [current]
        });

        // Reverse pointer
        pointers[current] = prev;

        steps.push({
            type: 'update',
            nodeIndex: current,
            nodes: values.map((val, i) => ({ val, next: pointers[i] })),
            description: `Đảo pointer: ${values[current]}.next = ${prev !== null ? values[prev] : 'null'}`,
            highlight: prev !== null ? [prev, current] : [current]
        });

        prev = current;
        current = next as number;
    }

    steps.push({
        type: 'complete',
        nodeIndex: prev!,
        nodes: values.map((val, i) => ({ val, next: pointers[i] })),
        description: `Reverse hoàn thành! Head mới = ${values[prev!]}`
    });

    return steps;
}
