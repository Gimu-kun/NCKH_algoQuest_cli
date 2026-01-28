# 📖 Chương 5: Binary Search Tree (Cây Nhị Phân Tìm Kiếm)

> **Mục tiêu học tập**: Hiểu cấu trúc BST và các thao tác Insert, Delete, Search, Traversal

---

## 🎯 Tổng Quan

**Binary Search Tree (BST)** là cây nhị phân đặc biệt với tính chất:

```
         ┌─────────────────────────────────────────┐
         │           TÍNH CHẤT BST                 │
         ├─────────────────────────────────────────┤
         │                                         │
         │    LEFT < ROOT < RIGHT                  │
         │                                         │
         │    Mọi node trong cây trái < ROOT       │
         │    Mọi node trong cây phải > ROOT       │
         │                                         │
         └─────────────────────────────────────────┘
```

### Ví dụ BST hợp lệ:

```
              8
            /   \
           3     10
          / \      \
         1   6      14
            / \    /
           4   7  13

✅ Hợp lệ vì:
- Tất cả node bên trái 8 (3,1,6,4,7) < 8
- Tất cả node bên phải 8 (10,14,13) > 8
- Tính chất áp dụng đệ quy cho mọi subtree
```

---

## 📚 Cấu Trúc Node

```cpp
/**
 * Cấu trúc Node cho Binary Search Tree
 * 
 * @property data - Giá trị lưu trữ (key)
 * @property left - Con trỏ đến con trái
 * @property right - Con trỏ đến con phải
 */
struct BSTNode {
    int data;
    BSTNode* left;
    BSTNode* right;
};
```

---

## 🔍 CÁC THAO TÁC CHÍNH

### 1. Search (Tìm kiếm) - O(h)

```cpp
/**
 * Tìm node có giá trị key trong BST
 * 
 * THUẬT TOÁN (sử dụng tính chất BST):
 * 1. So sánh key với node hiện tại
 * 2. Nếu key < current → đi sang TRÁI
 * 3. Nếu key > current → đi sang PHẢI
 * 4. Nếu key == current → TÌM THẤY!
 * 5. Nếu current == NULL → KHÔNG TÌM THẤY
 * 
 * ĐỘ PHỨC TẠP:
 * - Best/Average: O(log n) - cây cân bằng
 * - Worst: O(n) - cây nghiêng (skewed)
 * 
 * SO SÁNH VỚI LINEAR SEARCH:
 * - Array: O(n) linear search
 * - Sorted Array: O(log n) binary search
 * - BST: O(log n) average - tương đương binary search!
 */
BSTNode* search(BSTNode* root, int key) {
    // Base case: root NULL hoặc tìm thấy
    if (root == NULL || root->data == key) {
        return root;
    }
    
    // Key nhỏ hơn → tìm bên trái
    if (key < root->data) {
        return search(root->left, key);
    }
    
    // Key lớn hơn → tìm bên phải
    return search(root->right, key);
}
```

**Minh họa tìm kiếm key = 6:**
```
        8         ← So sánh: 6 < 8 → đi TRÁI
       / \
      3   10      ← So sánh: 6 > 3 → đi PHẢI
     / \
    1   6         ← So sánh: 6 == 6 → TÌM THẤY! ✅
       / \
      4   7
```

---

### 2. Insert (Chèn) - O(h)

```cpp
/**
 * Chèn node mới vào BST
 * 
 * THUẬT TOÁN:
 * 1. Tìm vị trí phù hợp (giống search)
 * 2. Khi đến vị trí NULL → chèn node mới
 * 
 * ĐẶC ĐIỂM:
 * - Node mới LUÔN là leaf (lá)
 * - Giữ nguyên tính chất BST
 * 
 * ĐỘ PHỨC TẠP: O(h) = O(log n) average
 */
BSTNode* insert(BSTNode* root, int key) {
    // Base case: tìm được vị trí trống
    if (root == NULL) {
        BSTNode* newNode = new BSTNode();
        newNode->data = key;
        newNode->left = newNode->right = NULL;
        return newNode;
    }
    
    // Đệ quy tìm vị trí
    if (key < root->data) {
        root->left = insert(root->left, key);
    } else if (key > root->data) {
        root->right = insert(root->right, key);
    }
    // Nếu key == root->data → duplicate, không chèn
    
    return root;
}
```

**Minh họa chèn key = 5:**
```
TRƯỚC:        8              FLOW: 5 < 8 → trái
             / \                   5 > 3 → phải
            3   10                 5 < 6 → trái
           / \                     NULL → chèn!
          1   6
             / \
            4   7

SAU:          8
             / \
            3   10
           / \
          1   6
             / \
           [5]  7    ← Node mới được chèn!
           /
          4
```

---

### 3. Delete (Xóa) - O(h)

**Xóa node là thao tác phức tạp nhất với 3 trường hợp:**

#### Case 1: Node là leaf (không có con)
→ Đơn giản xóa node

```
TRƯỚC:    8         XÓA 4:    8
         / \                 / \
        3   10              3   10
       / \                 / \
      1   6               1   6
         /                   /
        4                   X (xóa)
```

#### Case 2: Node có 1 con
→ Thay thế node bằng con của nó

```
TRƯỚC:    8         XÓA 10:   8
         / \                 / \
        3   10              3   14   ← 14 thế chỗ 10
       / \    \            / \
      1   6    14         1   6
```

#### Case 3: Node có 2 con ⚠️ PHỨC TẠP!
→ Tìm **Inorder Successor** (hoặc Predecessor) để thay thế

**Inorder Successor** = Node nhỏ nhất trong cây phải
                       = Node trái nhất của cây phải

```cpp
/**
 * Xóa node khỏi BST
 * 
 * 3 TRƯỜNG HỢP:
 * 1. Leaf: Xóa trực tiếp
 * 2. 1 con: Thay bằng con
 * 3. 2 con: Thay bằng Inorder Successor, xóa successor
 */
BSTNode* deleteNode(BSTNode* root, int key) {
    if (root == NULL) return NULL;
    
    // Tìm node cần xóa
    if (key < root->data) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->data) {
        root->right = deleteNode(root->right, key);
    } else {
        // Tìm thấy node cần xóa!
        
        // Case 1 & 2: Không có con trái
        if (root->left == NULL) {
            BSTNode* temp = root->right;
            delete root;
            return temp;
        }
        
        // Case 2: Không có con phải
        if (root->right == NULL) {
            BSTNode* temp = root->left;
            delete root;
            return temp;
        }
        
        // Case 3: Có 2 con
        // Tìm Inorder Successor (min của cây phải)
        BSTNode* successor = findMin(root->right);
        root->data = successor->data;  // Copy data
        root->right = deleteNode(root->right, successor->data); // Xóa successor
    }
    
    return root;
}

BSTNode* findMin(BSTNode* node) {
    while (node->left != NULL) {
        node = node->left;
    }
    return node;
}
```

**Minh họa xóa node có 2 con (key = 3):**
```
TRƯỚC:    8            1. Tìm Inorder Successor của 3
         / \              = min(right subtree of 3)
        3   10            = min(subtree rooted at 6)
       / \                = 4
      1   6
         / \           2. Copy 4 vào vị trí 3
        4   7
                       3. Xóa node 4 (case 1: leaf)
SAU:      8
         / \
        4   10    ← 4 thay thế 3
       / \
      1   6
           \
            7     ← 4 đã bị xóa khỏi đây
```

---

## 🌲 TREE TRAVERSALS (Duyệt Cây)

### 4 kiểu duyệt cây:

```
              8
            /   \
           3     10
          / \      \
         1   6     14
```

|       Kiểu      |        Thứ tự       |       Kết quả      |    Ứng dụng    |
|-----------------|---------------------|--------------------|----------------|
| **Inorder**     | Left → Root → Right | 1, 3, 6, 8, 10, 14 | Output sorted! |
| **Preorder**    | Root → Left → Right | 8, 3, 1, 6, 10, 14 | Copy cây       |
| **Postorder**   | Left → Right → Root | 1, 6, 3, 14, 10, 8 | Delete cây     |
| **Level-order** | Theo level          | 8, 3, 10, 1, 6, 14 | BFS            |

### Code các kiểu duyệt:

```cpp
/**
 * INORDER TRAVERSAL - Left, Root, Right
 * 
 * ĐẶC ĐIỂM QUAN TRỌNG:
 * ★ Inorder của BST cho ra dãy TĂNG DẦN!
 * 
 * Ứng dụng: In BST theo thứ tự sorted
 */
void inorder(BSTNode* root) {
    if (root == NULL) return;
    inorder(root->left);     // Duyệt trái
    cout << root->data << " "; // Xử lý root
    inorder(root->right);    // Duyệt phải
}

/**
 * PREORDER TRAVERSAL - Root, Left, Right
 * 
 * Ứng dụng: Sao chép cây, lưu cây vào file
 */
void preorder(BSTNode* root) {
    if (root == NULL) return;
    cout << root->data << " "; // Xử lý root TRƯỚC
    preorder(root->left);
    preorder(root->right);
}

/**
 * POSTORDER TRAVERSAL - Left, Right, Root
 * 
 * Ứng dụng: Xóa cây (xóa con trước rồi mới xóa root)
 */
void postorder(BSTNode* root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->data << " "; // Xử lý root SAU
}

/**
 * LEVEL-ORDER TRAVERSAL - Theo level (BFS)
 * 
 * Sử dụng Queue
 */
void levelOrder(BSTNode* root) {
    if (root == NULL) return;
    queue<BSTNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        BSTNode* node = q.front(); q.pop();
        cout << node->data << " ";
        
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}
```

---

## ⚠️ VẤN ĐỀ CÂY NGHIÊNG (Skewed Tree)

### Worst case của BST:

```
Nếu insert theo thứ tự: 1, 2, 3, 4, 5

            1
             \
              2
               \
                3
                 \
                  4
                   \
                    5

→ BST biến thành Linked List!
→ Tất cả operations trở thành O(n)
```

### Giải pháp: Các biến thể nâng cao

#### 1. AVL Tree (Self-balanced BST)
**Đặc điểm**:
- Là cây BST tự cân bằng đầu tiên.
- **Balance Factor**: Tại mọi node, `|height(left) - height(right)| ≤ 1`.
- Balance Factor chỉ nhận giá trị: `{-1, 0, +1}`.

**Cân bằng lại (Rotation)**:
Khi cây mất cân bằng (Insert/Delete), thực hiện xoay:
- **LL Case**: Xoay phải đơn.
- **RR Case**: Xoay trái đơn.
- **LR Case**: Xoay trái con trái, rồi xoay phải node hiện tại.
- **RL Case**: Xoay phải con phải, rồi xoay trái node hiện tại.

**Độ phức tạp**: Luôn đảm bảo chiều cao `h = O(log n)`.

#### 2. B-Tree
**Đặc điểm**:
- Cây tìm kiếm đa phân (m-ary search tree), không phải nhị phân.
- Một node có thể chứa **nhiều key** và có **nhiều hơn 2 con**.
- Tất cả các node lá (leaf) đều ở **cùng một độ sâu**.

**Ứng dụng**:
- Tối ưu cho hệ thống lưu trữ đĩa (Disk Storage).
- Database Indexing (MySQL, PostgreSQL).
- File Systems (NTFS, HFS+).

---

## 📊 ĐỘ PHỨC TẠP

|  Thao tác | Average (Balanced) | Worst (Skewed) |
|-----------|--------------------|----------------|
| Search    | O(log n)           |     O(n)       |
| Insert    | O(log n)           |     O(n)       |
| Delete    | O(log n)           |     O(n)       |
| Traversal | O(n)               |     O(n)       |
| Space     | O(n)               |     O(n)       |

---

## 💡 ƯU VÀ NHƯỢC ĐIỂM

### ✅ Ưu điểm:
- Search, Insert, Delete đều O(log n) average
- Inorder traversal cho dãy sorted
- Kích thước động
- Thuận tiện cho range queries

### ❌ Nhược điểm:
- Có thể trở thành O(n) nếu không cân bằng
- Phức tạp hơn Array/Linked List
- Cần thêm bộ nhớ cho pointers
- Không cache-friendly

### 🆚 So sánh với cấu trúc khác:

|      Cấu trúc      |  Search  |  Insert  |  Delete  | Sorted order |
|--------------------|----------|----------|----------|--------------|
| **Array (sorted)** | O(log n) | O(n)     | O(n)     |     ✅       |
| **Linked List**    | O(n)     | O(1)*    | O(1)*    |     ❌       |
| **BST (balanced)** | O(log n) | O(log n) | O(log n) | ✅ (inorder) |
| **Hash Table**     | O(1)**   | O(1)**   | O(1)**   |     ❌       |

*Nếu có pointer
**Average case

---

## 🎮 Demo Tương Tác

| Demo | Mô tả |
|------|-------|
| [BinarySearchTree.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_5_BST/BinarySearchTree.ts) | Minh họa BST operations |

---

## ✅ Checklist Kiến Thức

- [ ] Hiểu tính chất BST: Left < Root < Right
- [ ] Cài đặt Search trong BST
- [ ] Cài đặt Insert vào BST
- [ ] Hiểu 3 cases của Delete
- [ ] Nắm 4 kiểu Traversal và ứng dụng
- [ ] Biết vấn đề Skewed Tree
- [ ] So sánh được BST với Array, Linked List
