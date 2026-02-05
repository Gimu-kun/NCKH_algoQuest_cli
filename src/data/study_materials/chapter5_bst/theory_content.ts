import type { TheoryContent } from '../types';

export const CH5_P1_FUNDAMENTALS: TheoryContent = {
    introduction: `
# Khái Niệm Cây Nhị Phân (Binary Tree)

Cây nhị phân là một cấu trúc dữ liệu phân cấp, trong đó mỗi nút (node) có tối đa **hai con**, được gọi là con trái (left child) và con phải (right child).

## Các Thuật Ngữ Cơ Bản
- **Root**: Nút gốc của cây.
- **Leaf**: Nút lá (không có con).
- **Internal Node**: Node có ít nhất 1 con.
- **Height**: Số cạnh từ nút đến lá xa nhất.
- **Depth**: Số cạnh từ gốc đến nút đó.

## Các Loại Cây Nhị Phân Quan Trọng
1. **Full Binary Tree**: Mỗi nút có 0 hoặc 2 con (không có node 1 con).
2. **Complete Binary Tree**: Các level đầy đủ, trừ level cuối được lấp từ trái sang phải. Đây là cấu trúc dùng cho **Heap**.
3. **Perfect Binary Tree**: Mọi nút trung gian có 2 con và tất cả lá ở cùng level.
4. **Balanced Tree**: Chênh lệch chiều cao giữa cây con trái và phải không quá 1. Đảm bảo hiệu năng O(log n).
    `,
    keyConcepts: [
        {
            title: 'Duyệt theo chiều sâu (DFS)',
            content: 'Inorder (LNR), Preorder (NLR), Postorder (LRN).',
            importance: 'critical'
        },
        {
            title: 'Duyệt theo chiều rộng (BFS)',
            content: 'Level-order traversal: Duyệt theo từng level từ trên xuống dưới, trái sang phải.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'Level-order Traversal (BFS)',
            description: 'Duyệt cây theo từng cấp độ dùng Queue',
            code: `levelOrder(): T[] {
    if (this.root === null) return [];

    const result: T[] = [];
    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
        const node = queue.shift()!;
        result.push(node.data);

        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }

    return result;
}`,
            language: 'typescript',
            explanation: 'Sử dụng Queue để lưu trữ các node ở level tiếp theo cần được xử lý.'
        }
    ],
    summary: 'Cây nhị phân là nền tảng cho nhiều cấu trúc dữ liệu phức tạp hơn như BST, AVL, Heap, v.v. Việc hiểu các kiểu duyệt cây là rất quan trọng để thao tác với dữ liệu phân cấp.',
    readingTime: 12
};

export const CHAPTER_5_THEORY: TheoryContent = {
    introduction: `
# Binary Search Tree (BST)

**Binary Search Tree** là cấu trúc cây nhị phân đặc biệt giúp tìm kiếm, thêm, và xóa phần tử nhanh chóng.

## Tính chất BST
Tại mọi node:
- Các node bên **Trái** < Root
- Các node bên **Phải** > Root
- Không có giá trị trùng lặp (thường là vậy)
  `,
    keyConcepts: [
        {
            title: 'BST Property',
            content: 'Left < Root < Right. Tính chất này giúp Search/Insert đạt O(log n).',
            importance: 'critical'
        },
        {
            title: 'Traversals',
            content: 'Inorder (cho danh sách sort), Preorder (copy cây), Postorder (xóa cây).',
            importance: 'important'
        },
        {
            title: 'Skewed Tree',
            content: 'Nếu insert sorted data (1,2,3,4...), BST thành Linked List O(n). Cần AVL/Red-Black Tree để cân bằng.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'Searching in BST',
            description: 'Tìm kiếm đệ quy',
            code: `function search(root: Node | null, key: number): Node | null {
    if (root === null || root.data === key) 
        return root;
        
    if (key < root.data)
        return search(root.left, key);
        
    return search(root.right, key);
}`,
            language: 'typescript',
            explanation: 'Mỗi bước loại bỏ được một nửa không gian tìm kiếm (giống Binary Search).'
        },
        {
            title: 'Inorder Traversal',
            description: 'Duyệt trung thứ tự - Left -> Root -> Right',
            code: `function inorder(root: Node | null) {
    if (root !== null) {
        inorder(root.left);
        console.log(root.data); // Visit
        inorder(root.right);
    }
}`,
            language: 'typescript',
            explanation: 'Kết quả của Inorder trên BST luôn là dãy tăng dần.'
        }
    ],
    summary: 'BST kết hợp ưu điểm của Array (tìm kiếm nhanh) và Linked List (chèn/xóa linh hoạt). Tuy nhiên cần lưu ý trường hợp cây bị lệch (unbalanced).',
    readingTime: 15
};
