/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 5: DEMOS - BINARY SEARCH TREE (BST)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Export các demo và thông tin chi tiết về cấu trúc dữ liệu BST.
 * Bao gồm Search, Insert, Delete, và các kiểu Traversal.
 * 
 * KIẾN THỨC CHÍNH:
 * - Tính chất BST: Left < Root < Right
 * - Các thao tác: Search, Insert, Delete (3 cases)
 * - Traversals: Inorder, Preorder, Postorder, Level-order
 * - Vấn đề Skewed Tree và giải pháp
 * 
 * @module Chapter5Demos
 * @category StudyMaterials/Demos
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DemoReference, ChapterInfo, Concept } from '../types';
import { ChapterNumber } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// THÔNG TIN CHƯƠNG 5
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về Chương 5: Binary Search Tree
 */
export const CHAPTER_5_INFO: ChapterInfo = {
    chapterNumber: ChapterNumber.BST,
    title: 'Cây Nhị Phân Tìm Kiếm (BST)',
    titleEn: 'Binary Search Tree',
    description: 'Học cấu trúc cây BST với tính chất "Left < Root < Right" và các thao tác cơ bản.',
    topics: [
        'Tính chất BST: Left < Root < Right',
        'Search - Tìm kiếm trong BST',
        'Insert - Chèn node mới',
        'Delete - Xóa node (3 trường hợp)',
        'Traversals: Inorder, Preorder, Postorder, Level-order',
        'Vấn đề Skewed Tree và Balanced BST'
    ],
    demos: [
        {
            name: 'Binary Tree Fundamentals',
            path: 'algo_demos/Chapter_5_BST/BinaryTree.ts',
            description: 'Các khái niệm cơ bản về Binary Tree, traversals, tree types'
        },
        {
            name: 'Binary Search Tree',
            path: 'algo_demos/Chapter_5_BST/BinarySearchTree.ts',
            description: 'Demo các thao tác BST với visualization'
        },
        {
            name: 'AVL Tree',
            path: 'algo_demos/Chapter_5_BST/AVLTree.ts',
            description: 'Self-balancing BST với rotations (LL, RR, LR, RL)'
        }
    ],
    prerequisites: [ChapterNumber.LINKED_LIST, ChapterNumber.STACK_QUEUE]
};

// ═══════════════════════════════════════════════════════════════════════════
// CÁC KHÁI NIỆM CHÍNH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Các khái niệm về Tree
 */
export const TREE_CONCEPTS: Concept[] = [
    {
        name: 'Root',
        nameVi: 'Gốc',
        definition: 'Node đầu tiên/cao nhất của cây. Không có parent.',
        examples: [
            'Làm điểm bắt đầu cho mọi thao tác',
            'Nếu root = NULL → cây rỗng'
        ]
    },
    {
        name: 'Leaf',
        nameVi: 'Lá',
        definition: 'Node không có con nào (left = right = NULL).',
        examples: [
            'Khi delete leaf → xóa trực tiếp',
            'Insert mới luôn là leaf'
        ]
    },
    {
        name: 'Height',
        nameVi: 'Chiều cao',
        definition: 'Số cạnh từ node đến leaf xa nhất. Height của cây = height của root.',
        examples: [
            'Tree có 1 node: height = 0',
            'Balanced tree: height ≈ log₂(n)'
        ]
    },
    {
        name: 'Depth',
        nameVi: 'Độ sâu',
        definition: 'Số cạnh từ root đến node đó.',
        examples: [
            'Root có depth = 0',
            'Con của root có depth = 1'
        ]
    },
    {
        name: 'Subtree',
        nameVi: 'Cây con',
        definition: 'Một node cùng tất cả descendants của nó tạo thành cây con.',
        examples: [
            'Left subtree: cây con bên trái của node',
            'Right subtree: cây con bên phải của node'
        ]
    },
    {
        name: 'BST Property',
        nameVi: 'Tính chất BST',
        definition: 'Với mọi node: tất cả giá trị trong cây trái < node < tất cả giá trị trong cây phải.',
        examples: [
            'LEFT < ROOT < RIGHT',
            'Áp dụng đệ quy cho mọi subtree'
        ],
        notes: [
            'Inorder traversal của BST = dãy tăng dần',
            'Giúp search O(log n) thay vì O(n)'
        ]
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// CÁC THAO TÁC BST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về các thao tác BST
 */
export const BST_OPERATIONS = {
    /**
     * SEARCH - Tìm kiếm trong BST
     * 
     * THUẬT TOÁN:
     * 1. So sánh key với node hiện tại
     * 2. Nếu key < current → tìm cây trái
     * 3. Nếu key > current → tìm cây phải
     * 4. Nếu key == current → tìm thấy!
     * 
     * ĐỘ PHỨC TẠP: O(h) với h là chiều cao cây
     * - Balanced tree: O(log n)
     * - Skewed tree: O(n)
     * 
     * SO SÁNH:
     * - Array unsorted: O(n) linear search
     * - Array sorted: O(log n) binary search
     * - BST: O(log n) average ← tương đương binary search!
     */
    search: {
        name: 'Search',
        nameVi: 'Tìm kiếm',
        complexity: {
            timeComplexity: {
                best: 'O(1)',         // Tìm thấy ở root
                average: 'O(log n)',  // Cây cân bằng
                worst: 'O(n)'         // Cây nghiêng
            },
            spaceComplexity: 'O(h)'    // Stack đệ quy
        },
        code: `
/**
 * Tìm kiếm node có giá trị key
 * 
 * @param root - Gốc cây (hoặc subtree)
 * @param key - Giá trị cần tìm
 * @returns Node tìm thấy hoặc null
 * 
 * FLOW:
 * 1. root == null → không tìm thấy
 * 2. key == root.data → tìm thấy!
 * 3. key < root.data → tìm cây trái
 * 4. key > root.data → tìm cây phải
 */
function search(root: BSTNode | null, key: number): BSTNode | null {
    // Base case
    if (root === null || root.data === key) {
        return root;
    }
    
    // Sử dụng tính chất BST để chia đôi phạm vi tìm kiếm
    if (key < root.data) {
        return search(root.left, key);  // Tìm bên trái
    }
    return search(root.right, key);     // Tìm bên phải
}
`
    },

    /**
     * INSERT - Chèn node mới vào BST
     * 
     * ĐẶC ĐIỂM:
     * - Node mới LUÔN được chèn ở vị trí leaf
     * - Giữ nguyên tính chất BST
     * 
     * THUẬT TOÁN:
     * 1. Tìm vị trí chèn (giống search)
     * 2. Khi đến NULL → tạo và chèn node mới
     */
    insert: {
        name: 'Insert',
        nameVi: 'Chèn',
        complexity: {
            timeComplexity: {
                best: 'O(1)',         // Chèn vào cây rỗng
                average: 'O(log n)',  // Cây cân bằng
                worst: 'O(n)'         // Cây nghiêng
            },
            spaceComplexity: 'O(h)'
        },
        code: `
/**
 * Chèn node mới với giá trị key
 * 
 * @param root - Gốc cây
 * @param key - Giá trị cần chèn
 * @returns Root mới (có thể thay đổi nếu cây rỗng)
 * 
 * LƯU Ý:
 * - Node mới luôn là leaf
 * - Nếu key đã tồn tại → không chèn (hoặc update count)
 */
function insert(root: BSTNode | null, key: number): BSTNode {
    // Base case: Tìm thấy vị trí trống
    if (root === null) {
        return { data: key, left: null, right: null };
    }
    
    // Đệ quy tìm vị trí phù hợp
    if (key < root.data) {
        root.left = insert(root.left, key);
    } else if (key > root.data) {
        root.right = insert(root.right, key);
    }
    // Nếu key == root.data → không làm gì (duplicate)
    
    return root;
}
`
    },

    /**
     * DELETE - Xóa node khỏi BST
     * 
     * ĐÂY LÀ THAO TÁC PHỨC TẠP NHẤT!
     * 
     * 3 TRƯỜNG HỢP:
     * 1. Node là leaf → xóa trực tiếp
     * 2. Node có 1 con → thay bằng con
     * 3. Node có 2 con → thay bằng Inorder Successor
     * 
     * INORDER SUCCESSOR:
     * - Node nhỏ nhất trong cây phải
     * - = Node trái nhất của cây phải
     * - Luôn có tối đa 1 con (con phải)
     */
    delete: {
        name: 'Delete',
        nameVi: 'Xóa',
        complexity: {
            timeComplexity: {
                best: 'O(1)',
                average: 'O(log n)',
                worst: 'O(n)'
            },
            spaceComplexity: 'O(h)'
        },
        cases: [
            {
                case: 1,
                name: 'Leaf Node (không con)',
                description: 'Xóa trực tiếp, parent.child = null',
                visualization: `
    Parent           Parent
       |       →        |
     [X] leaf         null
`
            },
            {
                case: 2,
                name: 'Một con',
                description: 'Thay node bằng con của nó',
                visualization: `
    Parent           Parent
       |       →        |
     [X]              [Child]
      |
   [Child]
`
            },
            {
                case: 3,
                name: 'Hai con',
                description: 'Thay bằng Inorder Successor (min của cây phải)',
                steps: [
                    '1. Tìm Inorder Successor = min(right subtree)',
                    '2. Copy giá trị successor vào node cần xóa',
                    '3. Xóa successor (sẽ là case 1 hoặc 2)'
                ],
                visualization: `
        [X]              [S]
       /   \\    →      /   \\
     [L]   [R]        [L]   [R']
          /
        [S] ← Successor
`
            }
        ],
        code: `
/**
 * Xóa node có giá trị key
 * 
 * @param root - Gốc cây
 * @param key - Giá trị cần xóa
 * @returns Root mới (có thể thay đổi)
 */
function deleteNode(root: BSTNode | null, key: number): BSTNode | null {
    if (root === null) return null;
    
    // Tìm node cần xóa
    if (key < root.data) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.data) {
        root.right = deleteNode(root.right, key);
    } else {
        // Tìm thấy node cần xóa!
        
        // Case 1 & 2: Không có con trái
        if (root.left === null) {
            return root.right;
        }
        
        // Case 2: Không có con phải
        if (root.right === null) {
            return root.left;
        }
        
        // Case 3: Có 2 con
        // Tìm Inorder Successor (min của cây phải)
        const successor = findMin(root.right);
        root.data = successor.data;  // Copy giá trị
        root.right = deleteNode(root.right, successor.data); // Xóa successor
    }
    
    return root;
}

function findMin(node: BSTNode): BSTNode {
    while (node.left !== null) {
        node = node.left;
    }
    return node;
}
`
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// TREE TRAVERSALS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Các kiểu duyệt cây
 */
export const TREE_TRAVERSALS = {
    /**
     * INORDER: Left → Root → Right
     * 
     * ĐẶC ĐIỂM QUAN TRỌNG:
     * ★ Inorder của BST = DÃY TĂNG DẦN ★
     * 
     * Ứng dụng: In BST theo thứ tự sorted
     */
    inorder: {
        name: 'Inorder',
        nameVi: 'Duyệt giữa',
        order: 'Left → Root → Right',
        mnemonic: 'L-N-R (Left-Node-Right)',
        bstProperty: 'Cho ra dãy TĂNG DẦN',
        code: `
function inorder(root: BSTNode | null): void {
    if (root === null) return;
    inorder(root.left);         // L - Duyệt trái
    console.log(root.data);     // N - Xử lý node
    inorder(root.right);        // R - Duyệt phải
}
`,
        applications: [
            'In BST theo thứ tự sorted',
            'Kiểm tra BST hợp lệ',
            'Tìm kth smallest/largest element'
        ]
    },

    /**
     * PREORDER: Root → Left → Right
     * 
     * Ứng dụng: Sao chép cây, lưu cây vào file
     */
    preorder: {
        name: 'Preorder',
        nameVi: 'Duyệt trước',
        order: 'Root → Left → Right',
        mnemonic: 'N-L-R (Node-Left-Right)',
        code: `
function preorder(root: BSTNode | null): void {
    if (root === null) return;
    console.log(root.data);     // N - Xử lý node TRƯỚC
    preorder(root.left);        // L
    preorder(root.right);       // R
}
`,
        applications: [
            'Copy/clone cây',
            'Lưu cây vào file (có thể reconstruct)',
            'Prefix expression'
        ]
    },

    /**
     * POSTORDER: Left → Right → Root
     * 
     * Ứng dụng: Xóa cây (xóa con trước rồi mới xóa root)
     */
    postorder: {
        name: 'Postorder',
        nameVi: 'Duyệt sau',
        order: 'Left → Right → Root',
        mnemonic: 'L-R-N (Left-Right-Node)',
        code: `
function postorder(root: BSTNode | null): void {
    if (root === null) return;
    postorder(root.left);       // L
    postorder(root.right);      // R
    console.log(root.data);     // N - Xử lý node SAU
}
`,
        applications: [
            'Xóa cây (free memory)',
            'Tính expression tree',
            'Tính height/size của cây'
        ]
    },

    /**
     * LEVEL-ORDER: Duyệt theo level (BFS)
     * 
     * Sử dụng Queue
     */
    levelOrder: {
        name: 'Level-order',
        nameVi: 'Duyệt theo mức',
        order: 'Từng level từ trên xuống',
        uses: 'Queue (FIFO)',
        code: `
function levelOrder(root: BSTNode | null): void {
    if (root === null) return;
    
    const queue: BSTNode[] = [root];
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        console.log(node.data);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
}
`,
        applications: [
            'BFS trên cây',
            'Tìm node ở level cụ thể',
            'In cây theo từng level'
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// VẤN ĐỀ SKEWED TREE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Vấn đề Skewed Tree và giải pháp
 */
export const SKEWED_TREE_PROBLEM = {
    problem: {
        description: 'Khi chèn dữ liệu theo thứ tự tăng/giảm, BST biến thành Linked List',
        example: 'Insert: 1, 2, 3, 4, 5 → cây nghiêng phải',
        impact: 'Tất cả operations trở thành O(n) thay vì O(log n)'
    },
    visualization: `
Chèn: 1, 2, 3, 4, 5 theo thứ tự

Balanced BST:           Skewed BST:
       3                    1
      / \\                    \\
     2   4                    2
    /     \\                    \\
   1       5                    3
                                 \\
                                  4
                                   \\
                                    5

O(log n)                O(n) ← Vấn đề!
`,
    solutions: [
        {
            name: 'AVL Tree',
            description: 'Self-balancing BST với balance factor ≤ 1',
            technique: 'Xoay cây (LL, RR, LR, RL rotation)',
            guarantee: 'Height ≤ 1.44 log n'
        },
        {
            name: 'Red-Black Tree',
            description: 'Self-balancing với coloring rules',
            technique: 'Recoloring + Rotation',
            guarantee: 'Height ≤ 2 log n',
            note: 'Dùng trong C++ STL map/set'
        },
        {
            name: 'Randomized Insertion',
            description: 'Shuffle data trước khi insert',
            technique: 'Random order insertion',
            guarantee: 'Expected O(log n)'
        }
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const CHAPTER_5_DEMOS: DemoReference[] = CHAPTER_5_INFO.demos;

export default {
    info: CHAPTER_5_INFO,
    demos: CHAPTER_5_DEMOS,
    concepts: TREE_CONCEPTS,
    operations: BST_OPERATIONS,
    traversals: TREE_TRAVERSALS,
    skewedProblem: SKEWED_TREE_PROBLEM
};
