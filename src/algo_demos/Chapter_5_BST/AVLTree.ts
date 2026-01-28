/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AVL TREE - CÂY NHỊ PHÂN TÌM KIẾM TỰ CÂN BẰNG
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * AVL Tree là Binary Search Tree (BST) với tính chất TỰ CÂN BẰNG.
 * Đặt theo tên các nhà phát minh: Adelson-Velsky và Landis (1962).
 * 
 * TÍNH CHẤT:
 * 1. Tuân theo tính chất BST: Left < Root < Right
 * 2. Balance Factor (BF) = height(left) - height(right)
 * 3. |BF| ≤ 1 với MỌI node trong cây
 * 
 * TẠI SAO CẦN AVL?
 * - BST thông thường có thể bị "nghiêng" (skewed) → O(n) worst case
 * - AVL đảm bảo cây luôn cân bằng → O(log n) MỌI trường hợp
 * 
 * ĐỘ PHỨC TẠP:
 * | Thao tác | BST thường | AVL Tree |
 * |----------|------------|----------|
 * | Search   | O(n) worst | O(log n) |
 * | Insert   | O(n) worst | O(log n) |
 * | Delete   | O(n) worst | O(log n) |
 * 
 * CÁC LOẠI ROTATION (Xoay cây):
 * 1. LL (Left-Left): Single Right Rotation
 * 2. RR (Right-Right): Single Left Rotation
 * 3. LR (Left-Right): Left then Right Rotation
 * 4. RL (Right-Left): Right then Left Rotation
 * 
 * SO SÁNH VỚI CÁC BALANCED BST KHÁC:
 * |    Cây    |     Balance     |   Rotation   |       Ứng dụng        |
 * |-----------|-----------------|--------------|-----------------------|
 * | AVL       | Strict (|BF|≤1) | Nhiều hơn    | Database indexes      |
 * | Red-Black | Relaxed         | Ít hơn       | C++ STL, Java TreeMap |
 * | Splay     | Amortized       | Access-based | Cache                 |
 * 
 * ƯU ĐIỂM:
 * ✅ Đảm bảo O(log n) mọi trường hợp
 * ✅ Cây luôn cân bằng nghiêm ngặt
 * ✅ Search nhanh (vì height thấp nhất)
 * 
 * NHƯỢC ĐIỂM:
 * ❌ Insert/Delete chậm hơn Red-Black (nhiều rotation)
 * ❌ Phức tạp hơn BST thường
 * ❌ Cần lưu height cho mỗi node
 * 
 * @module AVLTree
 * @category AlgoDemos/Trees
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACE & TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho AVL Node
 * 
 * KHÁC VỚI BST NODE:
 * - Thêm trường `height` để tính Balance Factor
 * - height = 1 cho leaf node
 * - height = 0 cho null
 */
interface AVLNode {
    value: number;
    left: AVLNode | null;
    right: AVLNode | null;
    height: number;  // Chiều cao của node (leaf = 1, null = 0)
}

/**
 * Interface cho visualization step
 */
export interface AVLStep {
    action: 'insert' | 'delete' | 'search' | 'rotate' | 'balance';
    rotationType?: 'LL' | 'RR' | 'LR' | 'RL';
    node: number;
    tree: AVLNode | null;
    balanceFactor?: number;
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - Các hàm hỗ trợ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lấy chiều cao của node
 * 
 * @param node - Node cần lấy height
 * @returns Height của node (0 nếu null)
 * 
 * QUY ƯỚC:
 * - null node có height = 0
 * - leaf node có height = 1
 * - internal node có height = max(left, right) + 1
 */
function getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
}

/**
 * Tính Balance Factor của node
 * 
 * CÔNG THỨC:
 * BF = height(left subtree) - height(right subtree)
 * 
 * Ý NGHĨA:
 * - BF > 0: Cây nghiêng TRÁI (left-heavy)
 * - BF < 0: Cây nghiêng PHẢI (right-heavy)
 * - BF = 0: Cây cân bằng hoàn hảo
 * 
 * Y CẦU AVL:
 * - |BF| ≤ 1 với MỌI node
 * - Nếu |BF| > 1 → cần ROTATION để cân bằng
 */
function getBalanceFactor(node: AVLNode | null): number {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

/**
 * Cập nhật height của node sau khi thay đổi subtree
 */
function updateHeight(node: AVLNode): void {
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

/**
 * Tạo node mới
 */
function createNode(value: number): AVLNode {
    return {
        value,
        left: null,
        right: null,
        height: 1  // Node mới là leaf, height = 1
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// ROTATION OPERATIONS - Các phép xoay cây
// ═══════════════════════════════════════════════════════════════════════════

/**
 * RIGHT ROTATION (Xoay phải) - Dùng cho trường hợp LL
 * 
 * KHI NÀO CẦN:
 * - Balance Factor = +2 (left-heavy)
 * - VÀ BF của left child ≥ 0
 * 
 * MINH HỌA:
 * 
 *       y                               x
 *      / \     Right Rotation          / \
 *     x   C    ─────────────►         A   y
 *    / \       (rotate around y)         / \
 *   A   B                               B   C
 * 
 * FLOW:
 * 1. x = y.left
 * 2. y.left = x.right (B trở thành con trái của y)
 * 3. x.right = y (y trở thành con phải của x)
 * 4. Cập nhật height của y trước, rồi x
 * 5. Return x làm root mới
 */
function rightRotate(y: AVLNode): AVLNode {
    const x = y.left!;      // x là con trái của y
    const B = x.right;      // B là con phải của x (có thể null)

    // Thực hiện rotation
    x.right = y;            // y trở thành con phải của x
    y.left = B;             // B trở thành con trái của y

    // Cập nhật height (y trước vì y giờ là con của x)
    updateHeight(y);
    updateHeight(x);

    return x;  // x là root mới
}

/**
 * LEFT ROTATION (Xoay trái) - Dùng cho trường hợp RR
 * 
 * KHI NÀO CẦN:
 * - Balance Factor = -2 (right-heavy)
 * - VÀ BF của right child ≤ 0
 * 
 * MINH HỌA:
 * 
 *     x                                 y
 *    / \      Left Rotation            / \
 *   A   y     ─────────────►          x   C
 *      / \    (rotate around x)      / \
 *     B   C                         A   B
 * 
 * FLOW:
 * 1. y = x.right
 * 2. x.right = y.left (B trở thành con phải của x)
 * 3. y.left = x (x trở thành con trái của y)
 * 4. Cập nhật height của x trước, rồi y
 * 5. Return y làm root mới
 */
function leftRotate(x: AVLNode): AVLNode {
    const y = x.right!;     // y là con phải của x
    const B = y.left;       // B là con trái của y (có thể null)

    // Thực hiện rotation
    y.left = x;             // x trở thành con trái của y
    x.right = B;            // B trở thành con phải của x

    // Cập nhật height (x trước vì x giờ là con của y)
    updateHeight(x);
    updateHeight(y);

    return y;  // y là root mới
}

// ═══════════════════════════════════════════════════════════════════════════
// INSERT OPERATION - Thêm node vào AVL Tree
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thêm node vào AVL Tree với tự cân bằng
 * 
 * THUẬT TOÁN:
 * 1. Insert như BST thông thường (đệ quy tìm vị trí)
 * 2. Cập nhật height của các node trên đường đi
 * 3. Kiểm tra Balance Factor
 * 4. Nếu |BF| > 1 → thực hiện rotation phù hợp
 * 
 * 4 TRƯỜNG HỢP CẦN ROTATION:
 * 
 * ┌────────────────────────────────────────────────────────────────────┐
 * │ Case │ BF(node) │ BF(child) │ Rotation │ Mô tả                     │
 * ├────────────────────────────────────────────────────────────────────┤
 * │ LL   │    +2    │    ≥ 0    │ Right    │ Insert ở left-left        │
 * │ LR   │    +2    │    < 0    │ L then R │ Insert ở left-right       │
 * │ RR   │    -2    │    ≤ 0    │ Left     │ Insert ở right-right      │
 * │ RL   │    -2    │    > 0    │ R then L │ Insert ở right-left       │
 * └────────────────────────────────────────────────────────────────────┘
 * 
 * @param node - Root của subtree
 * @param value - Giá trị cần insert
 * @returns Root mới của subtree (có thể thay đổi sau rotation)
 */
function insert(node: AVLNode | null, value: number): AVLNode {
    // BƯỚC 1: Insert như BST thông thường
    if (node === null) {
        return createNode(value);
    }

    if (value < node.value) {
        node.left = insert(node.left, value);
    } else if (value > node.value) {
        node.right = insert(node.right, value);
    } else {
        // Duplicate không được phép trong BST
        return node;
    }

    // BƯỚC 2: Cập nhật height của node hiện tại
    updateHeight(node);

    // BƯỚC 3: Tính Balance Factor
    const balance = getBalanceFactor(node);

    // BƯỚC 4: Kiểm tra và thực hiện rotation nếu cần

    // Case LL: Left-Left (cây nghiêng trái-trái)
    // Insert vào cây con trái của cây con trái
    if (balance > 1 && value < node.left!.value) {
        return rightRotate(node);
    }

    // Case RR: Right-Right (cây nghiêng phải-phải)
    // Insert vào cây con phải của cây con phải
    if (balance < -1 && value > node.right!.value) {
        return leftRotate(node);
    }

    // Case LR: Left-Right (cây nghiêng trái-phải)
    // Insert vào cây con phải của cây con trái
    if (balance > 1 && value > node.left!.value) {
        node.left = leftRotate(node.left!);  // Xoay trái con trái
        return rightRotate(node);             // Rồi xoay phải node
    }

    // Case RL: Right-Left (cây nghiêng phải-trái)
    // Insert vào cây con trái của cây con phải
    if (balance < -1 && value < node.right!.value) {
        node.right = rightRotate(node.right!);  // Xoay phải con phải
        return leftRotate(node);                 // Rồi xoay trái node
    }

    // Cây vẫn cân bằng, return node không đổi
    return node;
}

// ═══════════════════════════════════════════════════════════════════════════
// DELETE OPERATION - Xóa node khỏi AVL Tree
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tìm node có giá trị nhỏ nhất trong subtree
 * Dùng để tìm Inorder Successor khi delete node có 2 con
 */
function findMin(node: AVLNode): AVLNode {
    let current = node;
    while (current.left !== null) {
        current = current.left;
    }
    return current;
}

/**
 * Xóa node khỏi AVL Tree với tự cân bằng
 * 
 * THUẬT TOÁN:
 * 1. Delete như BST (3 cases: leaf, 1 con, 2 con)
 * 2. Cập nhật height
 * 3. Kiểm tra và rotation nếu cần
 * 
 * @param node - Root của subtree
 * @param value - Giá trị cần xóa
 * @returns Root mới của subtree
 */
function deleteNode(node: AVLNode | null, value: number): AVLNode | null {
    // BƯỚC 1: Delete như BST thông thường
    if (node === null) {
        return null;
    }

    if (value < node.value) {
        node.left = deleteNode(node.left, value);
    } else if (value > node.value) {
        node.right = deleteNode(node.right, value);
    } else {
        // Tìm thấy node cần xóa

        // Case 1 & 2: Không có con hoặc 1 con
        if (node.left === null) {
            return node.right;
        } else if (node.right === null) {
            return node.left;
        }

        // Case 3: Có 2 con
        // Tìm Inorder Successor (min của right subtree)
        const successor = findMin(node.right);
        node.value = successor.value;
        node.right = deleteNode(node.right, successor.value);
    }

    // BƯỚC 2: Cập nhật height
    updateHeight(node);

    // BƯỚC 3: Balance
    const balance = getBalanceFactor(node);

    // Case LL
    if (balance > 1 && getBalanceFactor(node.left) >= 0) {
        return rightRotate(node);
    }

    // Case LR
    if (balance > 1 && getBalanceFactor(node.left) < 0) {
        node.left = leftRotate(node.left!);
        return rightRotate(node);
    }

    // Case RR
    if (balance < -1 && getBalanceFactor(node.right) <= 0) {
        return leftRotate(node);
    }

    // Case RL
    if (balance < -1 && getBalanceFactor(node.right) > 0) {
        node.right = rightRotate(node.right!);
        return leftRotate(node);
    }

    return node;
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH & TRAVERSAL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tìm kiếm giá trị trong AVL Tree
 * (Giống hệt BST search vì AVL là BST)
 */
function search(node: AVLNode | null, value: number): boolean {
    if (node === null) return false;
    if (value === node.value) return true;
    if (value < node.value) return search(node.left, value);
    return search(node.right, value);
}

/**
 * Inorder traversal - cho ra dãy tăng dần
 */
function inorderTraversal(node: AVLNode | null): number[] {
    if (node === null) return [];
    return [
        ...inorderTraversal(node.left),
        node.value,
        ...inorderTraversal(node.right)
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// AVL TREE CLASS - Wrapper class cho dễ sử dụng
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AVL Tree class với các method chính
 * 
 * USAGE:
 * const avl = new AVLTree();
 * avl.insert(10);
 * avl.insert(20);
 * avl.insert(5);
 * console.log(avl.inorder()); // [5, 10, 20]
 */
export class AVLTree {
    private root: AVLNode | null = null;

    /**
     * Insert giá trị mới
     */
    insert(value: number): void {
        this.root = insert(this.root, value);
    }

    /**
     * Delete giá trị
     */
    delete(value: number): void {
        this.root = deleteNode(this.root, value);
    }

    /**
     * Tìm kiếm giá trị
     */
    search(value: number): boolean {
        return search(this.root, value);
    }

    /**
     * Inorder traversal
     */
    inorder(): number[] {
        return inorderTraversal(this.root);
    }

    /**
     * Lấy height của cây
     */
    getTreeHeight(): number {
        return getHeight(this.root);
    }

    /**
     * Kiểm tra cây có cân bằng không
     */
    isBalanced(): boolean {
        return Math.abs(getBalanceFactor(this.root)) <= 1;
    }

    /**
     * Lấy root (cho visualization)
     */
    getRoot(): AVLNode | null {
        return this.root;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION - Minh họa AVL Tree operations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo AVL Tree với visualization steps
 */
export function demonstrateAVLTree(): AVLStep[] {
    const steps: AVLStep[] = [];
    const avl = new AVLTree();

    // Insert các giá trị để trigger rotation
    const values = [30, 20, 10, 25, 40, 50];

    for (const value of values) {
        avl.insert(value);
        steps.push({
            action: 'insert',
            node: value,
            tree: avl.getRoot(),
            balanceFactor: getBalanceFactor(avl.getRoot()),
            message: `Insert ${value}: Tree height = ${avl.getTreeHeight()}, Balanced = ${avl.isBalanced()}`
        });
    }

    return steps;
}

export default AVLTree;
