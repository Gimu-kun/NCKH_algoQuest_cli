/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 4: DEMOS - STACK & QUEUE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Export các demo và thông tin chi tiết về cấu trúc dữ liệu Stack và Queue.
 * Bao gồm các biến thể: Circular Queue, Priority Queue, Deque.
 * 
 * KIẾN THỨC CHÍNH:
 * - Stack: LIFO (Last In First Out)
 * - Queue: FIFO (First In First Out)
 * - Ứng dụng: BFS, DFS, Expression evaluation
 * 
 * @module Chapter4Demos
 * @category StudyMaterials/Demos
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DemoReference, ChapterInfo, Concept } from '../types';
import { ChapterNumber } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// THÔNG TIN CHƯƠNG 4
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về Chương 4: Stack & Queue
 */
export const CHAPTER_4_INFO: ChapterInfo = {
    chapterNumber: ChapterNumber.STACK_QUEUE,
    title: 'Ngăn Xếp & Hàng Đợi (Stack & Queue)',
    titleEn: 'Stack & Queue Data Structures',
    description: 'Học hai cấu trúc dữ liệu tuyến tính quan trọng với nguyên tắc LIFO và FIFO.',
    topics: [
        'Stack - Ngăn xếp (LIFO)',
        'Queue - Hàng đợi (FIFO)',
        'Circular Queue - Hàng đợi vòng',
        'Priority Queue - Hàng đợi ưu tiên',
        'Deque - Hàng đợi hai đầu',
        'Ứng dụng: BFS, DFS, Expression evaluation'
    ],
    demos: [
        {
            name: 'Stack Operations',
            path: 'algo_demos/Chapter_4_Stack_Queue/Stack.ts',
            description: 'Demo các thao tác Stack: push, pop, peek với visualization'
        },
        {
            name: 'Queue Operations',
            path: 'algo_demos/Chapter_4_Stack_Queue/Queue.ts',
            description: 'Demo các thao tác Queue: enqueue, dequeue, front với visualization'
        },
        {
            name: 'Priority Queue',
            path: 'algo_demos/Chapter_4_Stack_Queue/PriorityQueue.ts',
            description: 'Hàng đợi ưu tiên với Max/Min Heap - O(log n) enqueue/dequeue'
        },
        {
            name: 'Deque',
            path: 'algo_demos/Chapter_4_Stack_Queue/Deque.ts',
            description: 'Hàng đợi hai đầu - Sliding Window Maximum problem'
        }
    ],
    prerequisites: [ChapterNumber.COMPLEXITY, ChapterNumber.LINKED_LIST]
};

// ═══════════════════════════════════════════════════════════════════════════
// CÁC KHÁI NIỆM CHÍNH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Khái niệm LIFO - Nguyên tắc của Stack
 * 
 * LIFO = Last In, First Out
 * Phần tử VÀO SAU sẽ RA TRƯỚC
 * 
 * VÍ DỤ THỰC TẾ:
 * - Chồng đĩa: Đĩa đặt lên sau cùng được lấy ra đầu tiên
 * - Undo/Redo: Thao tác gần nhất được undo trước
 * - Browser Back: Trang truy cập gần nhất được back đầu tiên
 */
export const LIFO_CONCEPT: Concept = {
    name: 'LIFO',
    nameVi: 'Vào Sau Ra Trước',
    definition: 'Last In First Out - Phần tử được thêm vào sau cùng sẽ được lấy ra đầu tiên.',
    examples: [
        'Chồng đĩa: đĩa trên cùng được lấy trước',
        'Undo: thao tác gần nhất được undo trước',
        'Call Stack: hàm được gọi sau cùng return trước'
    ],
    notes: [
        'Stack chỉ có 1 điểm truy cập: TOP',
        'Không thể truy cập phần tử ở giữa'
    ]
};

/**
 * Khái niệm FIFO - Nguyên tắc của Queue
 * 
 * FIFO = First In, First Out
 * Phần tử VÀO TRƯỚC sẽ RA TRƯỚC
 * 
 * VÍ DỤ THỰC TẾ:
 * - Hàng đợi mua vé: Ai xếp hàng trước được phục vụ trước
 * - Printer Queue: File in trước được in trước
 * - BFS: Node được discover trước được visit trước
 */
export const FIFO_CONCEPT: Concept = {
    name: 'FIFO',
    nameVi: 'Vào Trước Ra Trước',
    definition: 'First In First Out - Phần tử được thêm vào đầu tiên sẽ được lấy ra đầu tiên.',
    examples: [
        'Hàng đợi mua vé: ai đến trước mua trước',
        'Printer queue: file gửi trước in trước',
        'BFS: node gần nhất được visit trước'
    ],
    notes: [
        'Queue có 2 điểm truy cập: FRONT và REAR',
        'Enqueue ở REAR, Dequeue ở FRONT'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// STACK - CHI TIẾT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về Stack
 */
export const STACK_INFO = {
    name: 'Stack',
    nameVi: 'Ngăn Xếp',
    principle: 'LIFO (Last In First Out)',

    /**
     * Các thao tác của Stack
     * TẤT CẢ đều O(1)!
     */
    operations: [
        {
            name: 'push(x)',
            description: 'Thêm phần tử x vào đỉnh stack',
            complexity: 'O(1)',
            code: `
/**
 * PUSH - Thêm phần tử vào stack
 * 
 * FLOW:
 * 1. Kiểm tra stack đầy chưa (chỉ với Array implementation)
 * 2. Tăng top index
 * 3. Gán giá trị vào vị trí top
 */
function push(value: T): void {
    if (this.isFull()) throw new Error('Stack Overflow');
    this.top++;
    this.data[this.top] = value;
}
`
        },
        {
            name: 'pop()',
            description: 'Xóa và trả về phần tử đỉnh',
            complexity: 'O(1)',
            code: `
/**
 * POP - Lấy phần tử từ stack
 * 
 * FLOW:
 * 1. Kiểm tra stack rỗng không
 * 2. Lưu giá trị ở top
 * 3. Giảm top index
 * 4. Trả về giá trị
 * 
 * LƯU Ý: Pop sẽ XÓA phần tử, không chỉ xem!
 */
function pop(): T {
    if (this.isEmpty()) throw new Error('Stack Underflow');
    const value = this.data[this.top];
    this.top--;
    return value;
}
`
        },
        {
            name: 'top() / peek()',
            description: 'Xem phần tử đỉnh (không xóa)',
            complexity: 'O(1)',
            code: `
/**
 * TOP/PEEK - Xem phần tử đỉnh
 * 
 * KHÁC VỚI POP:
 * - peek() chỉ XEM, không xóa
 * - pop() XÓA và trả về
 */
function peek(): T {
    if (this.isEmpty()) throw new Error('Stack Empty');
    return this.data[this.top]; // Chỉ đọc, không thay đổi top
}
`
        },
        {
            name: 'isEmpty()',
            description: 'Kiểm tra stack rỗng',
            complexity: 'O(1)',
            code: `function isEmpty(): boolean { return this.top < 0; }`
        }
    ],

    /**
     * Cài đặt Stack
     */
    implementations: {
        array: {
            name: 'Array-based Stack',
            advantages: [
                'Đơn giản, dễ cài đặt',
                'Cache-friendly (memory liên tục)',
                'Không overhead pointer'
            ],
            disadvantages: [
                'Kích thước cố định hoặc cần resize',
                'Có thể lãng phí bộ nhớ',
                'Stack Overflow nếu đầy'
            ]
        },
        linkedList: {
            name: 'Linked List-based Stack',
            advantages: [
                'Kích thước động, không giới hạn',
                'Không bao giờ Overflow (trừ khi hết RAM)',
                'Sử dụng bộ nhớ hiệu quả'
            ],
            disadvantages: [
                'Tốn thêm bộ nhớ cho pointer',
                'Cache-unfriendly',
                'Allocation overhead mỗi push'
            ]
        }
    },

    /**
     * Ứng dụng của Stack
     */
    applications: [
        {
            name: 'Balanced Parentheses',
            description: 'Kiểm tra ngoặc hợp lệ: (), [], {}',
            algorithm: 'Push ngoặc mở, Pop khi gặp ngoặc đóng, check match',
            code: `
/**
 * Kiểm tra ngoặc hợp lệ
 * 
 * VÍ DỤ:
 * - "(())" → true
 * - "([)]" → false
 */
function isValid(s: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    
    for (const c of s) {
        if (c === '(' || c === '[' || c === '{') {
            stack.push(c);
        } else {
            if (stack.pop() !== pairs[c]) return false;
        }
    }
    return stack.length === 0;
}
`
        },
        {
            name: 'Postfix Evaluation',
            description: 'Tính giá trị biểu thức Postfix',
            algorithm: 'Push số, Pop 2 số khi gặp operator, tính và push kết quả',
            code: `
/**
 * Evaluate Postfix: "3 4 + 2 *" = (3+4)*2 = 14
 */
function evalPostfix(expr: string[]): number {
    const stack: number[] = [];
    for (const token of expr) {
        if (isNumber(token)) {
            stack.push(parseInt(token));
        } else {
            const b = stack.pop()!;
            const a = stack.pop()!;
            stack.push(operate(a, b, token));
        }
    }
    return stack.pop()!;
}
`
        },
        {
            name: 'DFS (Depth-First Search)',
            description: 'Duyệt đồ thị theo chiều sâu',
            algorithm: 'Push start, Pop để visit, Push neighbors chưa thăm'
        },
        {
            name: 'Undo/Redo',
            description: 'Chức năng hoàn tác/làm lại',
            algorithm: '2 stacks: undo stack và redo stack'
        },
        {
            name: 'Function Call Stack',
            description: 'Lưu stack frame khi gọi hàm',
            algorithm: 'Push frame khi gọi, Pop frame khi return'
        }
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// QUEUE - CHI TIẾT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về Queue
 */
export const QUEUE_INFO = {
    name: 'Queue',
    nameVi: 'Hàng Đợi',
    principle: 'FIFO (First In First Out)',

    /**
     * Các thao tác của Queue
     */
    operations: [
        {
            name: 'enqueue(x)',
            description: 'Thêm phần tử x vào cuối queue',
            complexity: 'O(1)',
            code: `
/**
 * ENQUEUE - Thêm phần tử vào queue
 * 
 * FLOW:
 * 1. Kiểm tra queue đầy chưa
 * 2. Di chuyển rear pointer (với circular: rear = (rear+1) % MAX)
 * 3. Thêm phần tử ở vị trí rear
 * 4. Tăng count
 */
function enqueue(value: T): void {
    if (this.isFull()) throw new Error('Queue Full');
    this.rear = (this.rear + 1) % this.maxSize; // Circular
    this.data[this.rear] = value;
    this.count++;
}
`
        },
        {
            name: 'dequeue()',
            description: 'Xóa và trả về phần tử đầu',
            complexity: 'O(1)',
            code: `
/**
 * DEQUEUE - Lấy phần tử từ queue
 * 
 * FLOW:
 * 1. Kiểm tra queue rỗng không
 * 2. Lưu giá trị ở front
 * 3. Di chuyển front pointer (với circular)
 * 4. Giảm count
 * 5. Trả về giá trị
 */
function dequeue(): T {
    if (this.isEmpty()) throw new Error('Queue Empty');
    const value = this.data[this.front];
    this.front = (this.front + 1) % this.maxSize; // Circular
    this.count--;
    return value;
}
`
        },
        {
            name: 'front() / peek()',
            description: 'Xem phần tử đầu (không xóa)',
            complexity: 'O(1)'
        },
        {
            name: 'isEmpty()',
            description: 'Kiểm tra queue rỗng',
            complexity: 'O(1)'
        }
    ],

    /**
     * Các biến thể Queue
     */
    variants: [
        {
            name: 'Circular Queue',
            nameVi: 'Hàng đợi vòng',
            description: 'Rear quay vòng về đầu khi hết chỗ',
            advantage: 'Tái sử dụng không gian đã dequeue',
            formula: 'next = (current + 1) % MAX_SIZE'
        },
        {
            name: 'Priority Queue',
            nameVi: 'Hàng đợi ưu tiên',
            description: 'Phần tử có priority cao nhất ra trước (không theo FIFO)',
            implementation: 'Thường dùng Heap: enqueue O(log n), dequeue O(log n)',
            applications: ['Dijkstra algorithm', 'Huffman coding', 'Task scheduling']
        },
        {
            name: 'Deque',
            nameVi: 'Hàng đợi hai đầu',
            description: 'Double-Ended Queue - Thêm/xóa được ở cả hai đầu',
            operations: ['push_front()', 'push_back()', 'pop_front()', 'pop_back()'],
            applications: ['Sliding window problems', 'Palindrome checking']
        }
    ],

    /**
     * Ứng dụng của Queue
     */
    applications: [
        {
            name: 'BFS (Breadth-First Search)',
            description: 'Duyệt đồ thị theo chiều rộng',
            algorithm: 'Enqueue start, Dequeue để visit, Enqueue neighbors chưa thăm',
            code: `
/**
 * BFS Graph Traversal
 * 
 * ĐẶC ĐIỂM:
 * - Duyệt theo level (tất cả neighbor trước khi đi sâu)
 * - Tìm đường ngắn nhất (unweighted graph)
 */
function bfs(graph: Graph, start: number): void {
    const visited = new Set<number>();
    const queue: number[] = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const node = queue.shift()!; // Dequeue
        console.log('Visit:', node);
        
        for (const neighbor of graph.neighbors(node)) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor); // Enqueue
            }
        }
    }
}
`
        },
        {
            name: 'Level Order Traversal',
            description: 'Duyệt cây theo từng level',
            algorithm: 'Enqueue root, mỗi bước dequeue node và enqueue children'
        },
        {
            name: 'CPU Scheduling',
            description: 'Round-robin, First Come First Served',
            algorithm: 'Queue các process, dequeue để chạy, enqueue lại nếu chưa xong'
        },
        {
            name: 'Buffer',
            description: 'IO buffer, keyboard buffer',
            algorithm: 'Producer enqueue, Consumer dequeue'
        }
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// SO SÁNH STACK VS QUEUE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bảng so sánh Stack và Queue
 */
export const STACK_VS_QUEUE = [
    {
        criteria: 'Nguyên tắc',
        stack: 'LIFO - Last In First Out',
        queue: 'FIFO - First In First Out'
    },
    {
        criteria: 'Điểm truy cập',
        stack: 'Chỉ ở TOP (1 điểm)',
        queue: 'FRONT (ra) và REAR (vào)'
    },
    {
        criteria: 'Thao tác chính',
        stack: 'push, pop, top',
        queue: 'enqueue, dequeue, front'
    },
    {
        criteria: 'Traversal Graph',
        stack: 'DFS (Depth-First)',
        queue: 'BFS (Breadth-First)'
    },
    {
        criteria: 'Ví dụ thực tế',
        stack: 'Undo, Call stack, Back button',
        queue: 'Hàng đợi, Printer, Scheduling'
    },
    {
        criteria: 'Memory pattern',
        stack: 'Grow/shrink ở 1 đầu',
        queue: 'Grow ở rear, shrink ở front'
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const CHAPTER_4_DEMOS: DemoReference[] = CHAPTER_4_INFO.demos;

export default {
    info: CHAPTER_4_INFO,
    demos: CHAPTER_4_DEMOS,
    stack: STACK_INFO,
    queue: QUEUE_INFO,
    comparison: STACK_VS_QUEUE,
    concepts: [LIFO_CONCEPT, FIFO_CONCEPT]
};
