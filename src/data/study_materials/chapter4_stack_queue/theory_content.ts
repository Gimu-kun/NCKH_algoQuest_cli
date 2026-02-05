import type { TheoryContent } from '../types';

export const CHAPTER_4_THEORY: TheoryContent = {
    introduction: `
# Chương 4: Stack & Queue

Hai cấu trúc dữ liệu tuyến tính cơ bản dựa trên nguyên tắc **Thứ tự truy cập**:

## Stack (Ngăn xếp)
- **Nguyên tắc**: LIFO (Last In First Out) - Vào sau ra trước.
- **Ví dụ**: Chồng đĩa, Nút Undo, Call Stack.

## Queue (Hàng đợi)
- **Nguyên tắc**: FIFO (First In First Out) - Vào trước ra trước.
- **Ví dụ**: Hàng đợi mua vé, Printer queue.
  `,
    keyConcepts: [
        {
            title: 'LIFO (Stack)',
            content: 'Phần tử mới nhất được lấy ra đầu tiên. Thao tác chính: Push/Pop.',
            importance: 'critical'
        },
        {
            title: 'FIFO (Queue)',
            content: 'Phần tử cũ nhất được lấy ra đầu tiên. Thao tác chính: Enqueue/Dequeue.',
            importance: 'critical'
        },
        {
            title: 'Circular Queue',
            content: 'Dùng array vòng tròn để tận dụng bộ nhớ khi implement Queue bằng mảng.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'Stack Implementation',
            description: 'Cài đặt Stack đơn giản bằng mảng',
            code: `class Stack {
    private items: number[] = [];
    
    push(element: number) {
        this.items.push(element);
    }
    
    pop(): number | undefined {
        return this.items.pop();
    }
    
    peek(): number | undefined {
        return this.items[this.items.length - 1];
    }
}`,
            language: 'typescript',
            explanation: 'Các thao tác đều là O(1) nhờ phương thức của Array.'
        },
        {
            title: 'Valid Parentheses (Stack Application)',
            description: 'Kiểm tra ngoặc hợp lệ dùng Stack',
            code: `function isValid(s: string): boolean {
    const stack = [];
    const map = { '(': ')', '{': '}', '[': ']' };
    
    for (const char of s) {
        if (map[char]) {
            stack.push(char); // Open bracket
        } else {
            const last = stack.pop();
            if (char !== map[last]) return false;
        }
    }
    return stack.length === 0;
}`,
            language: 'typescript',
            explanation: 'Gặp ngoặc mở push vào, ngoặc đóng pop ra so sánh.'
        }
    ],
    summary: 'Stack và Queue là nền tảng cho nhiều thuật toán phức tạp hơn (DFS, BFS). Stack dùng cho đệ quy/quay lui, Queue dùng cho xử lý theo thứ tự/bộ đệm.',
    readingTime: 10
};
