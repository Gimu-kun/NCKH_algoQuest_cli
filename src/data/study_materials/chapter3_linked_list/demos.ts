/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 3: DEMOS - LINKED LIST
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Export các demo và thông tin chi tiết về cấu trúc dữ liệu Linked List.
 * Bao gồm Singly, Doubly, và Circular Linked List.
 * 
 * KIẾN THỨC CHÍNH:
 * - Cấu trúc Node với con trỏ (pointer)
 * - Các thao tác: Insert, Delete, Search, Reverse
 * - So sánh Array vs Linked List
 * - Ứng dụng thực tế của Linked List
 * 
 * @module Chapter3Demos
 * @category StudyMaterials/Demos
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DemoReference, ChapterInfo, Concept } from '../types';
import { ChapterNumber } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// THÔNG TIN CHƯƠNG 3
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về Chương 3: Linked List
 */
export const CHAPTER_3_INFO: ChapterInfo = {
    chapterNumber: ChapterNumber.LINKED_LIST,
    title: 'Danh Sách Liên Kết (Linked List)',
    titleEn: 'Linked List Data Structure',
    description: 'Học cấu trúc dữ liệu Linked List - cách lưu trữ dữ liệu không liên tục với con trỏ.',
    topics: [
        'Cấu trúc Node và con trỏ',
        'Singly Linked List - Danh sách liên kết đơn',
        'Doubly Linked List - Danh sách liên kết đôi',
        'Circular Linked List - Danh sách liên kết vòng',
        'Các thao tác: Insert, Delete, Search, Reverse',
        'So sánh Array vs Linked List'
    ],
    demos: [
        {
            name: 'Singly Linked List',
            path: 'algo_demos/Chapter_3_LinkedList/LinkedList.ts',
            description: 'Demo các thao tác trên Singly Linked List với visualization'
        },
        {
            name: 'Doubly Linked List',
            path: 'algo_demos/Chapter_3_LinkedList/DoublyLinkedList.ts',
            description: 'Danh sách liên kết đôi - duyệt 2 chiều, delete O(1)'
        },
        {
            name: 'Circular Linked List',
            path: 'algo_demos/Chapter_3_LinkedList/CircularLinkedList.ts',
            description: 'Danh sách liên kết vòng - round-robin, Josephus problem'
        }
    ],
    prerequisites: [ChapterNumber.COMPLEXITY] // Cần hiểu Big O
};

// ═══════════════════════════════════════════════════════════════════════════
// CÁC KHÁI NIỆM CHÍNH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Các khái niệm cơ bản trong Linked List
 */
export const LINKED_LIST_CONCEPTS: Concept[] = [
    {
        name: 'Node',
        nameVi: 'Nút / Phần tử',
        definition: 'Đơn vị cơ bản của Linked List, chứa data và pointer đến node tiếp theo.',
        examples: [
            'struct Node { int data; Node* next; }',
            'Mỗi node là một object độc lập trong bộ nhớ'
        ],
        notes: [
            'Trong Singly LL: 1 pointer (next)',
            'Trong Doubly LL: 2 pointers (prev, next)'
        ]
    },
    {
        name: 'Head',
        nameVi: 'Đầu danh sách',
        definition: 'Pointer trỏ đến node đầu tiên của Linked List. Là điểm bắt đầu duyệt.',
        examples: [
            'Node* head = firstNode;',
            'Nếu head == NULL → danh sách rỗng'
        ]
    },
    {
        name: 'Tail',
        nameVi: 'Cuối danh sách',
        definition: 'Node cuối cùng của Linked List. Trong Singly LL, tail->next = NULL.',
        examples: [
            'Tail pointer giúp insert cuối O(1)',
            'Không có tail pointer → phải duyệt O(n)'
        ],
        notes: [
            'Trong Circular LL: tail->next = head'
        ]
    },
    {
        name: 'Pointer/Reference',
        nameVi: 'Con trỏ / Tham chiếu',
        definition: 'Địa chỉ bộ nhớ trỏ đến node khác, kết nối các node với nhau.',
        examples: [
            'Node* next = &nextNode;',
            'current->next truy cập node tiếp theo'
        ]
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// CÁC LOẠI LINKED LIST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin về Singly Linked List
 * 
 * ĐẶC ĐIỂM:
 * - Mỗi node có 1 con trỏ next
 * - Chỉ duyệt được 1 chiều (từ head đến tail)
 * - Đơn giản, tốn ít bộ nhớ
 * 
 * CẤU TRÚC NODE:
 * ┌──────────┬──────────┐
 * │   data   │   next   │ → next node
 * └──────────┴──────────┘
 */
export const SINGLY_LINKED_LIST = {
    name: 'Singly Linked List',
    nameVi: 'Danh sách liên kết đơn',
    structure: `
/**
 * Cấu trúc Node cho Singly Linked List
 * 
 * @property data - Dữ liệu lưu trữ (có thể là bất kỳ kiểu nào)
 * @property next - Con trỏ đến node tiếp theo (NULL nếu là node cuối)
 */
interface SinglyNode<T> {
    data: T;
    next: SinglyNode<T> | null;
}
`,
    operations: {
        /**
         * INSERT AT HEAD - Chèn vào đầu
         * 
         * ĐỘ PHỨC TẠP: O(1)
         * 
         * FLOW:
         * 1. Tạo node mới
         * 2. newNode.next = head (trỏ đến head hiện tại)
         * 3. head = newNode (cập nhật head)
         * 
         * TẠI SAO O(1)?
         * → Không cần duyệt list, chỉ thao tác với head
         */
        insertAtHead: {
            name: 'Insert at Head',
            complexity: 'O(1)',
            code: `
function insertAtHead<T>(head: Node<T> | null, value: T): Node<T> {
    const newNode: Node<T> = { data: value, next: head };
    return newNode; // Trả về head mới
}
`
        },

        /**
         * INSERT AT TAIL - Chèn vào cuối
         * 
         * ĐỘ PHỨC TẠP: O(n) nếu không có tail pointer
         *              O(1) nếu có tail pointer
         * 
         * FLOW (không có tail ptr):
         * 1. Tạo node mới với next = null
         * 2. Duyệt đến node cuối (node.next === null)
         * 3. lastNode.next = newNode
         */
        insertAtTail: {
            name: 'Insert at Tail',
            complexity: 'O(n) / O(1)*',
            note: '* O(1) nếu có tail pointer',
            code: `
function insertAtTail<T>(head: Node<T> | null, value: T): Node<T> {
    const newNode: Node<T> = { data: value, next: null };
    
    // Trường hợp list rỗng
    if (head === null) return newNode;
    
    // Duyệt đến node cuối - O(n)
    let current = head;
    while (current.next !== null) {
        current = current.next;
    }
    
    current.next = newNode;
    return head;
}
`
        },

        /**
         * DELETE NODE - Xóa node
         * 
         * ĐỘ PHỨC TẠP: O(n)
         * 
         * FLOW:
         * 1. Tìm node cần xóa và node TRƯỚC nó
         * 2. prev.next = current.next (bỏ qua node cần xóa)
         * 3. Giải phóng bộ nhớ (trong ngôn ngữ low-level)
         * 
         * EDGE CASES:
         * - Xóa head: head = head.next
         * - Node không tồn tại: không làm gì
         */
        delete: {
            name: 'Delete Node',
            complexity: 'O(n)',
            code: `
function deleteNode<T>(head: Node<T> | null, value: T): Node<T> | null {
    if (head === null) return null;
    
    // Xóa head
    if (head.data === value) {
        return head.next;
    }
    
    // Tìm node cần xóa
    let current = head;
    while (current.next !== null && current.next.data !== value) {
        current = current.next;
    }
    
    // Xóa nếu tìm thấy
    if (current.next !== null) {
        current.next = current.next.next;
    }
    
    return head;
}
`
        },

        /**
         * SEARCH - Tìm kiếm
         * 
         * ĐỘ PHỨC TẠP: O(n)
         * 
         * SO SÁNH VỚI ARRAY:
         * - Array sorted: Binary Search O(log n)
         * - Linked List: Luôn O(n) vì không random access
         */
        search: {
            name: 'Search',
            complexity: 'O(n)',
            code: `
function search<T>(head: Node<T> | null, value: T): Node<T> | null {
    let current = head;
    while (current !== null) {
        if (current.data === value) {
            return current; // Tìm thấy
        }
        current = current.next;
    }
    return null; // Không tìm thấy
}
`
        },

        /**
         * REVERSE - Đảo ngược
         * 
         * ĐỘ PHỨC TẠP: O(n) time, O(1) space
         * 
         * KĨ THUẬT: Three Pointers
         * - prev: node phía trước (ban đầu null)
         * - current: node hiện tại
         * - next: node phía sau (lưu tạm)
         * 
         * FLOW mỗi bước:
         * 1. Lưu next = current.next
         * 2. Đảo hướng: current.next = prev
         * 3. Di chuyển: prev = current
         * 4. Di chuyển: current = next
         */
        reverse: {
            name: 'Reverse',
            complexity: 'O(n) time, O(1) space',
            code: `
function reverse<T>(head: Node<T> | null): Node<T> | null {
    let prev: Node<T> | null = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;  // 1. Lưu next
        current.next = prev;        // 2. Đảo hướng
        prev = current;             // 3. Di chuyển prev
        current = next;             // 4. Di chuyển current
    }
    
    return prev; // prev là head mới
}
`
        }
    },
    advantages: [
        'Đơn giản, dễ cài đặt',
        'Insert/Delete ở head O(1)',
        'Tốn ít bộ nhớ hơn Doubly LL',
        'Kích thước động, không cần biết trước'
    ],
    disadvantages: [
        'Chỉ duyệt 1 chiều',
        'Delete cuối cần O(n) tìm node trước',
        'Không random access như Array',
        'Tốn thêm bộ nhớ cho pointer'
    ]
};

/**
 * Thông tin về Doubly Linked List
 * 
 * ĐẶC ĐIỂM:
 * - Mỗi node có 2 con trỏ: prev và next
 * - Duyệt được 2 chiều
 * - Tốn thêm bộ nhớ cho prev pointer
 * 
 * CẤU TRÚC NODE:
 *         ┌──────────┬──────────┬──────────┐
 * prev ← │   prev   │   data   │   next   │ → next
 *         └──────────┴──────────┴──────────┘
 */
export const DOUBLY_LINKED_LIST = {
    name: 'Doubly Linked List',
    nameVi: 'Danh sách liên kết đôi',
    structure: `
/**
 * Cấu trúc Node cho Doubly Linked List
 * 
 * @property data - Dữ liệu
 * @property prev - Con trỏ đến node TRƯỚC
 * @property next - Con trỏ đến node SAU
 */
interface DoublyNode<T> {
    data: T;
    prev: DoublyNode<T> | null;
    next: DoublyNode<T> | null;
}
`,
    advantages: [
        'Duyệt 2 chiều (forward và backward)',
        'Delete node O(1) nếu có pointer đến node đó',
        'Delete cuối O(1) với tail pointer',
        'Thích hợp cho browser history, undo/redo'
    ],
    disadvantages: [
        'Tốn thêm bộ nhớ cho prev pointer',
        'Insert/Delete phức tạp hơn (cập nhật cả prev và next)',
        'Dễ bug hơn Singly LL'
    ],
    useCases: [
        'Browser history (back/forward)',
        'Undo/Redo functionality',
        'LRU Cache (với HashMap)',
        'Music playlist với prev/next',
        'Text editor cursor movement'
    ]
};

/**
 * Thông tin về Circular Linked List
 * 
 * ĐẶC ĐIỂM:
 * - Node cuối trỏ về node đầu (không có NULL)
 * - Có thể duyệt vòng tròn liên tục
 */
export const CIRCULAR_LINKED_LIST = {
    name: 'Circular Linked List',
    nameVi: 'Danh sách liên kết vòng',
    types: [
        {
            name: 'Circular Singly',
            description: 'Mỗi node có 1 pointer, node cuối trỏ về head',
            visualization: `
    ┌────────────────────────────┐
    ▼                            │
[A|●] → [B|●] → [C|●] → [D|●] ──┘
`
        },
        {
            name: 'Circular Doubly',
            description: 'Mỗi node có 2 pointers, head.prev = tail, tail.next = head',
            visualization: `
    ┌────────────────────────────────────┐
    ▼                                    │
⇄ [A|●] ⇄ [B|●] ⇄ [C|●] ⇄ [D|●] ⇄ ────┘
`
        }
    ],
    advantages: [
        'Duyệt vòng tròn liên tục',
        'Không cần kiểm tra NULL',
        'Thích hợp cho round-robin, circular buffer'
    ],
    useCases: [
        'Round-robin CPU scheduling',
        'Carousel/slideshow infinite loop',
        'Multiplayer games (turn-based)',
        'Circular buffer (audio/video streaming)',
        'Josephus problem'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// SO SÁNH ARRAY VS LINKED LIST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bảng so sánh chi tiết Array vs Linked List
 * 
 * ĐIỂM QUAN TRỌNG:
 * - Array: Random access O(1), nhưng insert/delete giữa O(n)
 * - Linked List: Insert/delete O(1)*, nhưng access O(n)
 * 
 * * O(1) nếu đã có pointer đến vị trí
 */
export const ARRAY_VS_LINKED_LIST = [
    {
        operation: 'Access by index',
        array: { complexity: 'O(1)', note: 'Random access' },
        linkedList: { complexity: 'O(n)', note: 'Phải duyệt từ đầu' }
    },
    {
        operation: 'Search (unsorted)',
        array: { complexity: 'O(n)', note: 'Linear search' },
        linkedList: { complexity: 'O(n)', note: 'Linear search' }
    },
    {
        operation: 'Search (sorted)',
        array: { complexity: 'O(log n)', note: 'Binary search' },
        linkedList: { complexity: 'O(n)', note: 'Không thể binary search!' }
    },
    {
        operation: 'Insert at beginning',
        array: { complexity: 'O(n)', note: 'Shift tất cả phần tử' },
        linkedList: { complexity: 'O(1)', note: 'Chỉ thay đổi head' }
    },
    {
        operation: 'Insert at end',
        array: { complexity: 'O(1)*', note: '* Amortized với dynamic array' },
        linkedList: { complexity: 'O(1)**', note: '** Cần tail pointer' }
    },
    {
        operation: 'Insert at middle',
        array: { complexity: 'O(n)', note: 'Shift các phần tử sau' },
        linkedList: { complexity: 'O(1)***', note: '*** Nếu có pointer đến vị trí' }
    },
    {
        operation: 'Delete at beginning',
        array: { complexity: 'O(n)', note: 'Shift tất cả phần tử' },
        linkedList: { complexity: 'O(1)', note: 'Chỉ thay đổi head' }
    },
    {
        operation: 'Delete at end',
        array: { complexity: 'O(1)', note: 'Chỉ giảm size' },
        linkedList: { complexity: 'O(n)/O(1)', note: 'O(1) với Doubly + tail' }
    },
    {
        operation: 'Memory',
        array: { complexity: 'Contiguous', note: 'Cache-friendly' },
        linkedList: { complexity: 'Scattered', note: 'Cache-unfriendly + overhead' }
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const CHAPTER_3_DEMOS: DemoReference[] = CHAPTER_3_INFO.demos;

export default {
    info: CHAPTER_3_INFO,
    demos: CHAPTER_3_DEMOS,
    concepts: LINKED_LIST_CONCEPTS,
    singlyLinkedList: SINGLY_LINKED_LIST,
    doublyLinkedList: DOUBLY_LINKED_LIST,
    circularLinkedList: CIRCULAR_LINKED_LIST,
    comparison: ARRAY_VS_LINKED_LIST
};
