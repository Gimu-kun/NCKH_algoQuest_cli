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
            name: 'Kiểm tra ngoặc hợp lệ (Balanced Parentheses)',
            nameVi: 'Kiểm tra cặp ngoặc',
            description: 'Kiểm tra các cặp ngoặc (), [], {} có hợp lệ không',
            algorithm: 'Đẩy (Push) ngoặc mở vào Stack, Lấy (Pop) khi gặp ngoặc đóng và kiểm tra khớp',
            code: `
/**
 * Kiểm tra ngoặc hợp lệ
 * 
 * VÍ DỤ:
 * - "(())" → true (hợp lệ)
 * - "([)]" → false (không hợp lệ)
 */
function isValid(s: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    
    for (const c of s) {
        if (c === '(' || c === '[' || c === '{') {
            stack.push(c);  // Đẩy ngoặc mở vào Stack
        } else {
            if (stack.pop() !== pairs[c]) return false;  // Pop và kiểm tra khớp
        }
    }
    return stack.length === 0;  // Stack phải rỗng nếu tất cả ngoặc khớp
}
`
        },
        {
            name: 'Đổi cơ số (Base Conversion)',
            nameVi: 'Chuyển đổi thập phân sang nhị phân/bát phân/thập lục phân',
            description: 'Sử dụng Stack để đổi số thập phân sang các hệ cơ số khác',
            algorithm: 'Chia liên tục cho cơ số, Push dư vào Stack, Pop ra để lấy kết quả ngược',
            code: `
/**
 * Đổi số thập phân sang nhị phân bằng Stack
 * 
 * VÍ DỤ: 13 (thập phân) → 1101 (nhị phân)
 * 
 * QUY TRÌNH:
 * 13 ÷ 2 = 6 dư 1 → Push(1)
 * 6 ÷ 2 = 3 dư 0  → Push(0)
 * 3 ÷ 2 = 1 dư 1  → Push(1)
 * 1 ÷ 2 = 0 dư 1  → Push(1)
 * Pop ngược: 1-1-0-1 → "1101"
 */
function decimalToBinary(n: number): string {
    const stack: number[] = [];
    
    while (n > 0) {
        stack.push(n % 2);  // Push phần dư
        n = Math.floor(n / 2);
    }
    
    let result = '';
    while (stack.length > 0) {
        result += stack.pop();  // Pop ngược lại
    }
    return result || '0';
}
`
        },
        {
            name: 'Ký pháp nghịch đảo Ba Lan (Infix → Postfix)',
            nameVi: 'Chuyển đổi biểu thức Trung tố sang Hậu tố',
            description: 'Chuyển biểu thức dạng a+b sang ab+ để tính toán dễ dàng hơn',
            algorithm: `
1. Duyệt từng ký tự trong biểu thức Infix
2. Nếu là toán hạng (số/biến): Đưa thẳng vào Output
3. Nếu là ngoặc mở '(': Push vào Stack
4. Nếu là ngoặc đóng ')': Pop liên tục đến khi gặp '(' rồi bỏ '('
5. Nếu là toán tử (+,-,*,/):
   - Pop các toán tử có độ ưu tiên >= toán tử hiện tại
   - Push toán tử hiện tại vào Stack
6. Cuối cùng: Pop hết Stack vào Output`,
            code: `
/**
 * Chuyển Infix sang Postfix
 * 
 * VÍ DỤ: "A+B*C" → "ABC*+"
 * VÍ DỤ: "(A+B)*C" → "AB+C*"
 */
function infixToPostfix(infix: string): string {
    const priority: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const stack: string[] = [];
    let output = '';
    
    for (const ch of infix) {
        if (isAlphaNumeric(ch)) {
            output += ch;  // Toán hạng → Output
        } else if (ch === '(') {
            stack.push(ch);
        } else if (ch === ')') {
            while (stack.length > 0 && stack[stack.length-1] !== '(') {
                output += stack.pop();
            }
            stack.pop();  // Bỏ '('
        } else {
            // Toán tử
            while (stack.length > 0 && 
                   priority[stack[stack.length-1]] >= priority[ch]) {
                output += stack.pop();
            }
            stack.push(ch);
        }
    }
    
    while (stack.length > 0) {
        output += stack.pop();
    }
    return output;
}
`
        },
        {
            name: 'Tính giá trị biểu thức Hậu tố (Postfix Evaluation)',
            nameVi: 'Tính toán biểu thức dạng Postfix',
            description: 'Tính giá trị biểu thức đã chuyển sang dạng Hậu tố',
            algorithm: 'Đẩy số vào Stack, khi gặp toán tử thì Pop 2 số, tính toán và Push kết quả',
            code: `
/**
 * Tính giá trị Postfix: "3 4 + 2 *" = (3+4)*2 = 14
 */
function evalPostfix(expr: string[]): number {
    const stack: number[] = [];
    for (const token of expr) {
        if (isNumber(token)) {
            stack.push(parseInt(token));  // Push số
        } else {
            const b = stack.pop()!;  // Lấy toán hạng phải
            const a = stack.pop()!;  // Lấy toán hạng trái
            stack.push(operate(a, b, token));  // Push kết quả
        }
    }
    return stack.pop()!;  // Kết quả cuối cùng
}
`
        },
        {
            name: 'Khử đệ quy (Eliminating Recursion)',
            nameVi: 'Chuyển đổi thuật toán đệ quy sang vòng lặp',
            description: 'Dùng Stack để mô phỏng Call Stack của đệ quy',
            examples: ['Tháp Hà Nội', 'Tính giai thừa', 'Duyệt cây']
        },
        {
            name: 'DFS (Depth-First Search)',
            nameVi: 'Duyệt đồ thị theo chiều sâu',
            description: 'Duyệt đồ thị bằng cách đi sâu nhất có thể trước khi quay lui',
            algorithm: 'Push đỉnh xuất phát, Pop để thăm, Push các đỉnh kề chưa thăm'
        },
        {
            name: 'Undo/Redo',
            nameVi: 'Hoàn tác / Làm lại',
            description: 'Chức năng hoàn tác và làm lại trong các ứng dụng',
            algorithm: 'Dùng 2 Stack: Undo Stack và Redo Stack'
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
            name: 'Duyệt cây theo mức (Level Order Traversal)',
            nameVi: 'Duyệt cây theo từng tầng',
            description: 'Duyệt cây nhị phân theo từng level từ trên xuống',
            algorithm: 'Enqueue gốc cây, mỗi bước dequeue node và enqueue các con của nó'
        },
        {
            name: 'Lập lịch CPU (CPU Scheduling)',
            nameVi: 'Điều phối tiến trình',
            description: 'Round-robin, First Come First Served (FCFS)',
            algorithm: 'Queue các tiến trình, dequeue để thực thi, enqueue lại nếu chưa hoàn thành'
        },
        {
            name: 'Bộ đệm (Buffer)',
            nameVi: 'Bộ nhớ đệm',
            description: 'IO buffer, keyboard buffer, network buffer',
            algorithm: 'Producer enqueue dữ liệu, Consumer dequeue để xử lý'
        },
        {
            name: 'Kiểm tra chuỗi Palindrome',
            nameVi: 'Kiểm tra chuỗi đối xứng',
            description: 'Kiểm tra xem một chuỗi đọc xuôi ngược giống nhau không',
            algorithm: 'Dùng Queue và Stack: Enqueue VÀ Push từng ký tự, Dequeue và Pop so sánh'
        },
        {
            name: 'Demerging (Tách và gộp dữ liệu)',
            nameVi: 'Tổ chức lại dữ liệu giữ thứ tự',
            description: 'Tách một danh sách thành nhiều danh sách con theo tiêu chí, vẫn giữ nguyên thứ tự ban đầu',
            example: `
/**
 * DEMERGING - Ứng dụng Queue để tách và gộp danh sách
 * 
 * BÀI TOÁN: Có file dữ liệu nhân sự, cần tách thành 2 file:
 * - File Nam: Chứa các nhân viên Nam
 * - File Nữ: Chứa các nhân viên Nữ
 * Yêu cầu: Giữ nguyên thứ tự thời gian nhập liệu ban đầu
 * 
 * GIẢI PHÁP:
 * - Dùng 2 Queue: QueueNam và QueueNu
 * - Duyệt file gốc: Nếu là Nam → Enqueue(QueueNam), ngược lại Enqueue(QueueNu)
 * - FIFO đảm bảo giữ nguyên thứ tự thời gian!
 */
interface Employee { name: string; gender: 'M' | 'F'; joinDate: Date; }

function demergeByGender(employees: Employee[]): { males: Queue<Employee>, females: Queue<Employee> } {
    const males = new Queue<Employee>();
    const females = new Queue<Employee>();
    
    for (const emp of employees) {
        if (emp.gender === 'M') {
            males.enqueue(emp);  // Giữ nguyên thứ tự
        } else {
            females.enqueue(emp);  // Giữ nguyên thứ tự
        }
    }
    
    return { males, females };
}
`,
            benefit: 'Queue đảm bảo FIFO nên thứ tự thời gian (chronological order) được giữ nguyên'
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
