/**
 * FILE: BinarySearchTree.ts
 * MỤC TIÊU: Minh họa Cây nhị phân tìm kiếm (BST).
 */

// Định nghĩa Node của cây
class TreeNode<T> {
    value: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

/**
 * Class BinarySearchTree
 * 
 * Properties (Quy tắc BST):
 *  - Giá trị của tất cả Node con bên TRÁI < Giá trị Node cha.
 *  - Giá trị của tất cả Node con bên PHẢI >= Giá trị Node cha.
 * 
 * Complexity:
 *  - Search/Insert/Delete: 
 *    - Average: O(log n) (nếu cây cân bằng - balanced).
 *    - Worst: O(n) (nếu cây bị lệch hẳn về 1 phía - skewed, giống Linked List).
 */
export class BinarySearchTree<T> {
    root: TreeNode<T> | null;

    constructor() {
        this.root = null;
    }

    // INSERT: Thêm nút mới
    insert(value: T): void {
        const newNode = new TreeNode(value);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        this.insertNode(this.root, newNode);
    }

    // Helper (Recursive) để tìm vị trí chèn thích hợp
    private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
        if (newNode.value < node.value) {
            // Đi sang trái (Go Left)
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            // Đi sang phải (Go Right)
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    // SEARCH: Tìm kiếm giá trị
    search(value: T): boolean {
        return this.searchNode(this.root, value);
    }

    // Helper (Recursive) cho tìm kiếm
    private searchNode(node: TreeNode<T> | null, value: T): boolean {
        // Base case: Nếu node null -> Không tìm thấy
        if (!node) return false;

        // Base case: Tìm thấy
        if (value === node.value) return true;

        // Recursive step
        if (value < node.value) {
            return this.searchNode(node.left, value); // Tìm bên trái
        } else {
            return this.searchNode(node.right, value); // Tìm bên phải
        }
    }

    // TRAVERSAL (Duyệt cây)
    // 1. In-Order Traversal (Trung thứ tự): Left -> Root -> Right
    // Kết quả sẽ là danh sách đã sắp xếp tăng dần.
    inOrderTraversal(node: TreeNode<T> | null = this.root, result: T[] = []): T[] {
        if (node) {
            this.inOrderTraversal(node.left, result);
            result.push(node.value); // Visit Root
            this.inOrderTraversal(node.right, result);
        }
        return result;
    }

    // 2. Pre-Order Traversal (Tiền thứ tự): Root -> Left -> Right
    // Dùng để copy cây.
    preOrderTraversal(node: TreeNode<T> | null = this.root, result: T[] = []): T[] {
        if (node) {
            result.push(node.value); // Visit Root
            this.preOrderTraversal(node.left, result);
            this.preOrderTraversal(node.right, result);
        }
        return result;
    }

    // 3. Post-Order Traversal (Hậu thứ tự): Left -> Right -> Root
    // Dùng để xóa cây (xóa con trước khi xóa cha).
    postOrderTraversal(node: TreeNode<T> | null = this.root, result: T[] = []): T[] {
        if (node) {
            this.postOrderTraversal(node.left, result);
            this.postOrderTraversal(node.right, result);
            result.push(node.value); // Visit Root
        }
        return result;
    }
}
