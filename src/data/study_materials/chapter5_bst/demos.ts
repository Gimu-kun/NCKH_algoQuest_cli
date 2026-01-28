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
        description: 'Khi chèn dữ liệu theo thứ tự tăng/giảm, BST biến thành Danh sách liên kết',
        example: 'Chèn: 1, 2, 3, 4, 5 → cây nghiêng phải (Right-skewed)',
        impact: 'Tất cả thao tác trở thành O(n) thay vì O(log n)'
    },
    visualization: `
Chèn: 1, 2, 3, 4, 5 theo thứ tự

Cây BST cân bằng:         Cây BST lệch (Skewed):
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
            name: 'Cây AVL',
            nameEn: 'AVL Tree',
            description: 'Cây BST tự cân bằng với hệ số cân bằng (balance factor) ≤ 1',
            technique: 'Xoay cây (Rotation): LL, RR, LR, RL',
            guarantee: 'Chiều cao ≤ 1.44 log n'
        },
        {
            name: 'Cây Đỏ-Đen',
            nameEn: 'Red-Black Tree',
            description: 'Cây tự cân bằng với quy tắc tô màu',
            technique: 'Đổi màu (Recoloring) + Xoay (Rotation)',
            guarantee: 'Chiều cao ≤ 2 log n',
            note: 'Được dùng trong C++ STL map/set, Java TreeMap'
        },
        {
            name: 'Chèn ngẫu nhiên',
            nameEn: 'Randomized Insertion',
            description: 'Xáo trộn dữ liệu trước khi chèn vào cây',
            technique: 'Chèn theo thứ tự ngẫu nhiên',
            guarantee: 'Kỳ vọng O(log n)'
        }
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// CÂY AVL - CHI TIẾT CÁC PHÉP XOAY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CÂY AVL VÀ CÁC PHÉP XOAY
 * 
 * Cây AVL (Adelson-Velsky và Landis) là cây BST tự cân bằng:
 * - Balance Factor (BF) = Height(Left) - Height(Right)
 * - Mọi node phải có |BF| ≤ 1
 * - Khi |BF| > 1 → thực hiện phép xoay để cân bằng lại
 */
export const AVL_ROTATIONS = {
    name: 'Các phép xoay trong cây AVL',
    nameEn: 'AVL Tree Rotations',

    balanceFactor: {
        formula: 'BF = Chiều cao cây con trái - Chiều cao cây con phải',
        balanced: '|BF| ≤ 1 → Cây cân bằng',
        unbalanced: '|BF| > 1 → Cần xoay để cân bằng'
    },

    rotations: [
        {
            name: 'LL Rotation (Xoay phải)',
            nameEn: 'Left-Left / Right Rotation',
            when: 'Node lệch trái (BF > 1) VÀ con trái cũng lệch trái (BF ≥ 0)',
            visualization: `
TRƯỚC khi xoay:           SAU khi xoay phải:
       z (BF=2)                 y
      /                        / \\
     y (BF≥0)      →          x   z
    /
   x

// Xoay phải quanh z: y lên làm gốc, z thành con phải của y
`,
            code: `
function rotateRight(z: AVLNode): AVLNode {
    const y = z.left!;
    const T2 = y.right;
    
    // Thực hiện xoay
    y.right = z;
    z.left = T2;
    
    // Cập nhật chiều cao
    z.height = 1 + Math.max(height(z.left), height(z.right));
    y.height = 1 + Math.max(height(y.left), height(y.right));
    
    return y; // y là gốc mới
}
`
        },
        {
            name: 'RR Rotation (Xoay trái)',
            nameEn: 'Right-Right / Left Rotation',
            when: 'Node lệch phải (BF < -1) VÀ con phải cũng lệch phải (BF ≤ 0)',
            visualization: `
TRƯỚC khi xoay:           SAU khi xoay trái:
   z (BF=-2)                    y
    \\                          / \\
     y (BF≤0)       →         z   x
      \\
       x

// Xoay trái quanh z: y lên làm gốc, z thành con trái của y
`,
            code: `
function rotateLeft(z: AVLNode): AVLNode {
    const y = z.right!;
    const T2 = y.left;
    
    // Thực hiện xoay
    y.left = z;
    z.right = T2;
    
    // Cập nhật chiều cao
    z.height = 1 + Math.max(height(z.left), height(z.right));
    y.height = 1 + Math.max(height(y.left), height(y.right));
    
    return y; // y là gốc mới
}
`
        },
        {
            name: 'LR Rotation (Xoay trái-phải)',
            nameEn: 'Left-Right Rotation',
            when: 'Node lệch trái (BF > 1) VÀ con trái lệch phải (BF < 0)',
            visualization: `
TRƯỚC:           SAU xoay trái y:      SAU xoay phải z:
    z                  z                     x
   /                  /                     / \\
  y        →         x           →         y   z
   \\                /
    x              y

// Bước 1: Xoay trái quanh y
// Bước 2: Xoay phải quanh z
`,
            steps: ['Xoay trái (Left Rotate) quanh con trái', 'Xoay phải (Right Rotate) quanh node gốc']
        },
        {
            name: 'RL Rotation (Xoay phải-trái)',
            nameEn: 'Right-Left Rotation',
            when: 'Node lệch phải (BF < -1) VÀ con phải lệch trái (BF > 0)',
            visualization: `
TRƯỚC:           SAU xoay phải y:      SAU xoay trái z:
  z                  z                       x
   \\                  \\                     / \\
    y       →          x         →         z   y
   /                    \\
  x                      y

// Bước 1: Xoay phải (Right Rotate) quanh con phải
// Bước 2: Xoay trái (Left Rotate) quanh node gốc
`,
            steps: ['Xoay phải (Right Rotate) quanh con phải', 'Xoay trái (Left Rotate) quanh node gốc']
        }
    ],

    summary: `
BẢNG TÓM TẮT CHỌN PHÉP XOAY:

| Balance Factor node | Balance Factor con | Phép xoay |
|---------------------|-------------------|-----------|
| > 1 (lệch trái)     | ≥ 0               | LL (Xoay phải) |
| > 1 (lệch trái)     | < 0               | LR (Xoay trái-phải) |
| < -1 (lệch phải)    | ≤ 0               | RR (Xoay trái) |
| < -1 (lệch phải)    | > 0               | RL (Xoay phải-trái) |
`
};

// ═══════════════════════════════════════════════════════════════════════════
// PHẦN TỬ THẾ MẠNG (INORDER SUCCESSOR/PREDECESSOR)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PHẦN TỬ THẾ MẠNG KHI XÓA NODE CÓ 2 CON
 */
export const INORDER_SUCCESSOR_PREDECESSOR = {
    name: 'Phần tử thế mạng',
    nameEn: 'Inorder Successor / Predecessor',
    description: 'Khi xóa node có 2 con trong BST, cần tìm node thay thế để giữ tính chất BST',

    inorderSuccessor: {
        name: 'Phần tử kế tiếp theo thứ tự trung (Inorder Successor)',
        definition: 'Node NHỎ NHẤT trong cây con bên PHẢI',
        findMethod: 'Đi sang phải 1 lần, rồi đi trái đến hết',
        code: `
function findInorderSuccessor(node: BSTNode): BSTNode {
    let current = node.right!;  // Đi sang phải 1 lần
    while (current.left) {      // Đi trái đến hết
        current = current.left;
    }
    return current;             // Node cực trái = nhỏ nhất
}
`
    },

    inorderPredecessor: {
        name: 'Phần tử liền trước theo thứ tự trung (Inorder Predecessor)',
        definition: 'Node LỚN NHẤT trong cây con bên TRÁI',
        findMethod: 'Đi sang trái 1 lần, rồi đi phải đến hết',
        code: `
function findInorderPredecessor(node: BSTNode): BSTNode {
    let current = node.left!;   // Đi sang trái 1 lần
    while (current.right) {     // Đi phải đến hết
        current = current.right;
    }
    return current;             // Node cực phải = lớn nhất
}
`
    },

    deleteWithTwoChildren: `
/**
 * XÓA NODE CÓ 2 CON TRONG BST
 * 
 * Quy trình:
 * 1. Tìm phần tử thế mạng (Successor hoặc Predecessor)
 * 2. Sao chép giá trị của thế mạng vào node cần xóa
 * 3. Xóa node thế mạng (node này chỉ có tối đa 1 con)
 */
function deleteNode(root: BSTNode | null, key: number): BSTNode | null {
    if (root === null) return null;
    
    if (key < root.data) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.data) {
        root.right = deleteNode(root.right, key);
    } else {
        // Tìm thấy node cần xóa
        
        // Trường hợp 1 & 2: Node có 0 hoặc 1 con
        if (root.left === null) return root.right;
        if (root.right === null) return root.left;
        
        // Trường hợp 3: Node có 2 con
        // Tìm Inorder Successor (nhỏ nhất bên phải)
        const successor = findInorderSuccessor(root);
        root.data = successor.data;  // Sao chép giá trị
        root.right = deleteNode(root.right, successor.data); // Xóa successor
    }
    return root;
}
`
};

// ═══════════════════════════════════════════════════════════════════════════
// GIỚI THIỆU B-TREE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GIỚI THIỆU B-TREE
 * 
 * B-Tree là cây đa nhánh tự cân bằng, được sử dụng rộng rãi trong
 * các hệ thống lưu trữ và cơ sở dữ liệu.
 */
export const BTREE_INTRODUCTION = {
    name: 'B-Tree',
    nameVi: 'Cây B',
    description: 'Cây tìm kiếm đa nhánh tự cân bằng, tối ưu cho đọc/ghi đĩa',

    characteristics: [
        'Mỗi node có thể chứa NHIỀU khóa (keys)',
        'Mỗi node có thể có NHIỀU con (không chỉ 2 như BST)',
        'Tất cả lá đều ở cùng một mức (perfectly balanced)',
        'Tối ưu cho việc đọc/ghi từ đĩa (tối thiểu hóa I/O)'
    ],

    params: {
        order: 'Bậc m của B-Tree: Mỗi node có tối đa m con',
        keys: 'Mỗi node (trừ gốc) có ít nhất ⌈m/2⌉ - 1 khóa',
        children: 'Số con = Số khóa + 1'
    },

    comparison: `
So sánh với BST:

| Tiêu chí | BST | B-Tree |
|----------|-----|--------|
| Số con mỗi node | Tối đa 2 | Tối đa m |
| Khóa mỗi node | 1 | 1 đến m-1 |
| Cân bằng | Có thể lệch | Luôn cân bằng hoàn hảo |
| Ứng dụng | Bộ nhớ RAM | Lưu trữ đĩa, Database |
`,

    applications: [
        'Hệ thống file (NTFS, ext4)',
        'Cơ sở dữ liệu (MySQL, PostgreSQL, MongoDB)',
        'Index trong các hệ quản trị CSDL',
        'Các hệ thống lưu trữ phân tán'
    ],

    note: 'B-Tree nằm ngoài phạm vi cơ bản của DSA, nhưng là kiến thức quan trọng cho Backend/Database.'
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
    skewedProblem: SKEWED_TREE_PROBLEM,
    avlRotations: AVL_ROTATIONS,
    inorderSuccessorPredecessor: INORDER_SUCCESSOR_PREDECESSOR,
    btreeIntro: BTREE_INTRODUCTION
};
