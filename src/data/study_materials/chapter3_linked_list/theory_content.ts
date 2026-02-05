import type { TheoryContent } from '../types';

export const CH3_P1_STRUCTURE: TheoryContent = {
    introduction: `
# Chương 3: Linked List (Danh Sách Liên Kết)

**Linked List** là cấu trúc dữ liệu **tuyến tính**, trong đó các phần tử (node) được kết nối bằng **con trỏ** (pointer) và nằm rải rác trong bộ nhớ.

## So sánh với Array
- **Array**: Các phần tử nằm liên tiếp. Truy cập O(1). Chèn/Xóa O(n).
- **Linked List**: Các phần tử rải rác. Truy cập O(n). Chèn/Xóa O(1) nếu có pointer.
  `,
    keyConcepts: [
        {
            title: 'Node Structure',
            content: 'Gồm Data (dữ liệu) và Next (con trỏ trỏ đến node tiếp theo).',
            importance: 'critical'
        },
        {
            title: 'Singly vs Doubly',
            content: 'Singly chỉ đi 1 chiều. Doubly có thêm Prev pointer để đi 2 chiều.',
            importance: 'important'
        },
        {
            title: 'Memory Allocation',
            content: 'Node được cấp phát động trên Heap (malloc/new).',
            importance: 'basic'
        }
    ],
    examples: [
        {
            title: 'Insert at Head - O(1)',
            description: 'Thêm node mới vào đầu danh sách',
            code: `function insertAtHead(head: Node, value: number): Node {
    const newNode = new Node(value);
    newNode.next = head;
    return newNode; // New head
}`,
            language: 'typescript',
            explanation: 'Chỉ cần cập nhật pointer, không cần dời dữ liệu như Array.'
        },
        {
            title: 'Traversal - O(n)',
            description: 'Duyệt qua danh sách',
            code: `function traverse(head: Node) {
    let current = head;
    while (current !== null) {
        console.log(current.data);
        current = current.next;
    }
}`,
            language: 'typescript',
            explanation: 'Phải đi tuần tự từ Head đến Tail.'
        },
        {
            title: 'Reverse Linked List',
            description: 'Đảo ngược danh sách dùng 3 pointers',
            code: `function reverse(head: Node): Node {
    let prev = null;
    let current = head;
    while (current !== null) {
        let next = current.next; // Save next
        current.next = prev;     // Reverse
        prev = current;          // Move prev
        current = next;          // Move current
    }
    return prev; // New head
}`,
            language: 'typescript',
            explanation: 'Kỹ thuật kinh điển: Đảo chiều pointer từng node một.'
        }
    ],
    summary: 'Sử dụng Linked List khi cần chèn/xóa thường xuyên và không biết trước kích thước. Tránh dùng khi cần truy cập ngẫu nhiên (random access) tốc độ cao.',
    readingTime: 12
};
