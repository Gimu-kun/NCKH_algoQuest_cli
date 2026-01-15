# 📋 Cheatsheet: Binary Search Tree (BST)

> **Mẹo**: Tra cứu nhanh tính chất và thao tác BST!

---

## 🎯 TÍNH CHẤT CỐT LÕI

```
┌─────────────────────────────────────────────────────────────────────┐
│                     BST PROPERTY                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ★ LEFT < ROOT < RIGHT ★                         │
│                                                                     │
│                         [8]                                         │
│                        /   \                                        │
│     Tất cả < 8 →    [3]   [10]    ← Tất cả > 8                      │
│                    /  \      \                                      │
│                  [1]  [6]    [14]                                   │
│                                                                     │
│   ★ INORDER TRAVERSAL = SORTED ORDER ★                             │
│   → 1, 3, 6, 8, 10, 14 (tăng dần!)                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ ĐỘ PHỨC TẠP

| Thao tác | Average (Balanced) | Worst (Skewed) |
|----------|:------------------:|:--------------:|
| **Search** | O(log n) ✅ | O(n) ❌ |
| **Insert** | O(log n) ✅ | O(n) ❌ |
| **Delete** | O(log n) ✅ | O(n) ❌ |
| **Min/Max** | O(log n) | O(n) |
| **Traversal** | O(n) | O(n) |
| **Space** | O(n) | O(n) |

### Tại sao Worst = O(n)?

```
Chèn: 1, 2, 3, 4, 5 theo thứ tự

    1                
     \               Biến thành
      2              Linked List!
       \             
        3            → O(n) mỗi thao tác
         \
          4
           \
            5
```

---

## 🔍 SEARCH PATTERN

```cpp
// Key < node → đi TRÁI
// Key > node → đi PHẢI
// Key == node → TÌM THẤY!

Node* search(Node* root, int key) {
    if (root == NULL || root->data == key)
        return root;
    if (key < root->data)
        return search(root->left, key);
    return search(root->right, key);
}
```

---

## ➕ INSERT PATTERN

```cpp
// Luôn chèn ở vị trí NULL (là leaf)

Node* insert(Node* root, int key) {
    if (root == NULL) return new Node(key);
    
    if (key < root->data)
        root->left = insert(root->left, key);
    else if (key > root->data)
        root->right = insert(root->right, key);
    
    return root;
}
```

---

## ➖ DELETE - 3 CASES

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DELETE CASES                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CASE 1: LEAF (không con)            CASE 2: MỘT CON                │
│  ────────────────────────            ────────────────               │
│       P                P                  P            P            │
│       |                |                  |            |            │
│      [X]  →  delete   NULL              [X]    →     [C]            │
│                                         /                           │
│                                       [C]                           │
│                                                                     │
│  CASE 3: HAI CON (phức tạp!)                                        │
│  ─────────────────────────                                          │
│  1. Tìm Inorder Successor (min của cây phải)                        │
│  2. Copy giá trị successor vào vị trí node cần xóa                  │
│  3. Xóa successor (case 1 hoặc 2)                                   │
│                                                                     │
│       [X]        [S]      ← Successor thay X                        │
│      /   \      /   \                                               │
│    [L]   [R]  [L]   [R']  ← R' = R sau khi xóa S                    │
│         /                                                           │
│       [S] ← Inorder Successor = min(right) = leftmost of R          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🌲 TRAVERSALS

| Traversal | Order | Output | Dùng khi |
|-----------|-------|--------|----------|
| **Inorder** | L → Root → R | **SORTED!** | In thứ tự |
| **Preorder** | Root → L → R | Copy sequence | Clone cây |
| **Postorder** | L → R → Root | Delete sequence | Xóa cây |
| **Level-order** | Từng level | BFS order | BFS |

```cpp
// INORDER - Quan trọng nhất cho BST!
void inorder(Node* r) {
    if (!r) return;
    inorder(r->left);      // L
    print(r->data);        // Root
    inorder(r->right);     // R
}

// PREORDER
void preorder(Node* r) {
    if (!r) return;
    print(r->data);        // Root
    preorder(r->left);     // L
    preorder(r->right);    // R
}

// POSTORDER
void postorder(Node* r) {
    if (!r) return;
    postorder(r->left);    // L
    postorder(r->right);   // R
    print(r->data);        // Root
}
```

---

## 🔧 HELPER OPERATIONS

### Find Min/Max

```cpp
// MIN = node trái nhất
Node* findMin(Node* r) {
    while (r->left) r = r->left;
    return r;
}

// MAX = node phải nhất
Node* findMax(Node* r) {
    while (r->right) r = r->right;
    return r;
}
```

### Find Height

```cpp
int height(Node* r) {
    if (!r) return -1; // hoặc 0 tùy convention
    return 1 + max(height(r->left), height(r->right));
}
```

### Count Nodes

```cpp
int count(Node* r) {
    if (!r) return 0;
    return 1 + count(r->left) + count(r->right);
}
```

---

## 💡 KHI NÀO DÙNG BST?

```
✅ DÙNG BST:
   • Cần search/insert/delete O(log n)
   • Cần dữ liệu sorted (inorder)
   • Range queries
   • Dynamic data (thay đổi thường xuyên)

❌ KHÔNG DÙNG BST:
   • Chỉ cần search O(1) → Hash Table
   • Dữ liệu tĩnh → Sorted Array + Binary Search
   • Memory constraint → may cache-unfriendly
```

---

## 🆚 SO SÁNH

| Cấu trúc | Search | Insert | Delete | Sorted |
|----------|:------:|:------:|:------:|:------:|
| **Sorted Array** | O(log n) | O(n) 😞 | O(n) 😞 | ✅ |
| **Linked List** | O(n) | O(1)* | O(1)* | ❌ |
| **BST** | O(log n) | O(log n) | O(log n) | ✅ |
| **Hash Table** | O(1)** | O(1)** | O(1)** | ❌ |

*với pointer sẵn
**average case

---

## ⚠️ EDGE CASES

```cpp
// 1. Cây rỗng
if (root == NULL) { /* handle */ }

// 2. Một node
if (root->left == NULL && root->right == NULL) { /* leaf */ }

// 3. Skewed tree → dùng balanced BST
// AVL Tree, Red-Black Tree

// 4. Duplicate keys
// Option A: Không cho phép
// Option B: Đếm số lần xuất hiện
// Option C: Cho vào left hoặc right
```

---

## 🎯 BALANCED BST

| Loại | Balance Factor | Rotation |
|------|---------------|----------|
| **AVL Tree** | \|h(L) - h(R)\| ≤ 1 | LL, RR, LR, RL |
| **Red-Black Tree** | Black height | Color + Rotation |
| **Splay Tree** | Không đảm bảo | Splay to root |

```
AVL Rotations:
─────────────

LL (Left-Left):     RR (Right-Right):
    z                     z
   /                       \
  y      → Right(z)         y     → Left(z)
 /                           \
x                             x

LR (Left-Right):    RL (Right-Left):
    z                     z
   /                       \
  y      → Left(y)          y    → Right(y)
   \     → Right(z)        /     → Left(z)
    x                     x
```

---

## 📚 GHI NHỚ

1. **"Left < Root < Right"** - Tính chất cốt lõi

2. **"Inorder = Sorted"** - BST inorder cho dãy tăng

3. **"Worst = Linked List"** - Cây nghiêng = O(n)

4. **"Delete 2 con = Successor"** - Tìm min(right)

5. **"Traversal:
   - In = LNR (sorted)
   - Pre = NLR (copy)
   - Post = LRN (delete)"**

---

## 🎮 DEMO

- [BST Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_5_BST/BinarySearchTree.ts)
