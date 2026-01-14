/**
 * =============================================================================
 * FILE: BinarySearchTree.ts (Cây Nhị Phân Tìm Kiếm)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Cài đặt cấu trúc dữ liệu Binary Search Tree (BST).
 *    - Minh họa cách tổ chức dữ liệu phân cấp (hierarchical) để tối ưu việc tìm kiếm.
 *
 * 2. CẤU TRÚC & QUY TẮC (STRUCTURE & RULES):
 *    - **Tree Node**: Mỗi node có tối đa 2 con (Left child & Right child).
 *    - **BST Property (Tính chất BST)**:
 *         + Giá trị của tất cả Node con bên TRÁI < Giá trị Node cha.
 *         + Giá trị của tất cả Node con bên PHẢI >= Giá trị Node cha.
 *
 * 3. KỸ THUẬT & THUẬT TOÁN (ALGORITHM & TECHNIQUE):
 *    - **Recursion (Đệ quy)**: Hầu hết các thao tác (Insert, Search, Traversal) đều dùng đệ quy vì tính chất fractal của cây.
 *    - **Tree Traversal (Duyệt cây)**: BFS (Breadth-First Search) hoặc DFS (Depth-First Search: In-order, Pre-order, Post-order).
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity** (Search/Insert/Delete):
 *         + Average Case: O(log n) - Khi cây cân bằng (Balanced).
 *         + Worst Case: O(n) - Khi cây bị lệch hẳn (Skewed/Degenerate), trở thành Linked List.
 *    - **Space Complexity**: O(n) để lưu trữ nodes.
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *         + Tìm kiếm, thêm, xóa nhanh hơn Array (O(log n) vs O(n)) trong trường hợp trung bình.
 *         + Dữ liệu luôn được duy trì thứ tự (Sorted).
 *    - **Nhược điểm**:
 *         + Hiệu năng phụ thuộc vào độ cân bằng của cây. Cần các thuật toán phức tạp hơn (AVL Tree, Red-Black Tree) để tự cân bằng.
 *         + Phức tạp hơn để cài đặt so với Array/Linked List.
 *
 * 6. ỨNG DỤNG THỰC TẾ (REAL WORLD USE CASES):
 *    - Cơ sở dữ liệu (Indexing).
 *    - Hệ thống file (File Systems).
 *    - Auto-complete (Tự động hoàn thành từ).
 *
 * =============================================================================
 */

// Định nghĩa Node của cây
class TreeNode<T> {
    value: T;                 // Giá trị của node
    left: TreeNode<T> | null; // Con trỏ tới con bên trái (nhỏ hơn)
    right: TreeNode<T> | null;// Con trỏ tới con bên phải (lớn hơn/bằng)

    constructor(value: T) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Class BinarySearchTree
export class BinarySearchTree<T> {
    root: TreeNode<T> | null; // Nút gốc của cây

    constructor() {
        this.root = null;
    }

    /**
     * Phương thức: insert (Thêm mới)
     * Thêm một giá trị vào cây mà vẫn bảo toàn tính chất BST.
     */
    insert(value: T): void {
        const newNode = new TreeNode(value);

        if (!this.root) {
            this.root = newNode; // Nếu cây rỗng, node mới là Root
            return;
        }

        this.insertNode(this.root, newNode);
    }

    // Helper (Recursive) để tìm vị trí chèn thích hợp
    private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
        // So sánh giá trị để quyết định đi Trái hay Phải
        if (newNode.value < node.value) {
            // Đi sang trái (Go Left)
            if (!node.left) {
                node.left = newNode; // Tìm thấy chỗ trống -> Chèn vào
            } else {
                this.insertNode(node.left, newNode); // Đệ quy tiếp tục tìm bên trái
            }
        } else {
            // Đi sang phải (Go Right)
            if (!node.right) {
                node.right = newNode; // Tìm thấy chỗ trống -> Chèn vào
            } else {
                this.insertNode(node.right, newNode); // Đệ quy tiếp tục tìm bên phải
            }
        }
    }

    /**
     * Phương thức: search (Tìm kiếm)
     * Kiểm tra xem giá trị có tồn tại trong cây không.
     * @returns true nếu tìm thấy, false nếu không.
     */
    search(value: T): boolean {
        return this.searchNode(this.root, value);
    }

    // Helper (Recursive) cho tìm kiếm
    private searchNode(node: TreeNode<T> | null, value: T): boolean {
        // Base case 1: Nếu node null -> Đã đi đến lá mà không thấy -> False
        if (!node) return false;

        // Base case 2: Tìm thấy giá trị -> True
        if (value === node.value) return true;

        // Recursive step: Chọn nhánh để đi tiếp (Divide & Conquer)
        if (value < node.value) {
            return this.searchNode(node.left, value); // Giá trị cần tìm nhỏ hơn -> Tìm bên trái
        } else {
            return this.searchNode(node.right, value); // Giá trị cần tìm lớn hơn -> Tìm bên phải
        }
    }

    // --- TRAVERSAL (DUYỆT CÂY) ---

    /**
     * 1. In-Order Traversal (Trung thứ tự)
     * Flow: Left -> Root -> Right
     * Ý nghĩa: Duyệt cây theo thứ tự tăng dần (Sorted Order).
     */
    inOrderTraversal(node: TreeNode<T> | null = this.root, result: T[] = []): T[] {
        if (node) {
            this.inOrderTraversal(node.left, result);  // Thăm con trái
            result.push(node.value);                   // Thăm gốc
            this.inOrderTraversal(node.right, result); // Thăm con phải
        }
        return result;
    }

    /**
     * 2. Pre-Order Traversal (Tiền thứ tự)
     * Flow: Root -> Left -> Right
     * Ý nghĩa: Dùng để sao chép cây (Copy Tree) hoặc lưu cấu trúc cây (Serialization).
     */
    preOrderTraversal(node: TreeNode<T> | null = this.root, result: T[] = []): T[] {
        if (node) {
            result.push(node.value);                    // Thăm gốc trước
            this.preOrderTraversal(node.left, result);  // Thăm con trái
            this.preOrderTraversal(node.right, result); // Thăm con phải
        }
        return result;
    }

    /**
     * 3. Post-Order Traversal (Hậu thứ tự)
     * Flow: Left -> Right -> Root
     * Ý nghĩa: Dùng để xóa cây (Delete Tree) vì phải xóa con trước khi xóa cha.
     */
    postOrderTraversal(node: TreeNode<T> | null = this.root, result: T[] = []): T[] {
        if (node) {
            this.postOrderTraversal(node.left, result);  // Thăm con trái
            this.postOrderTraversal(node.right, result); // Thăm con phải
            result.push(node.value);                     // Thăm gốc sau cùng
        }
        return result;
    }
}
