# 📋 Cheatsheet: Linked List

> **Mẹo**: Tra cứu nhanh các thao tác và độ phức tạp!

---

## 🔗 CẤU TRÚC NODE

```cpp
// SINGLY LINKED LIST
struct Node {
    int data;
    Node* next;
};

// DOUBLY LINKED LIST
struct DNode {
    int data;
    DNode* prev;
    DNode* next;
};
```

---

## ⏱️ ĐỘ PHỨC TẠP

### Singly Linked List

| Thao tác | Time | Điều kiện |
|----------|------|-----------|
| **Insert at head** | O(1) ✅ | - |
| **Insert at tail** | O(n) | Không có tail ptr |
| **Insert at tail** | O(1) ✅ | Có tail ptr |
| **Insert after node** | O(1) | Có node ptr |
| **Delete head** | O(1) ✅ | - |
| **Delete tail** | O(n) | Phải tìm node trước tail |
| **Delete by value** | O(n) | Phải tìm node |
| **Search** | O(n) | Duyệt tuần tự |
| **Access by index** | O(n) | Không random access |
| **Reverse** | O(n) | - |

### Doubly Linked List

| Thao tác | Time | Lợi ích |
|----------|------|---------|
| **Insert at head** | O(1) ✅ | - |
| **Insert at tail** | O(1) ✅ | Có tail ptr |
| **Delete head** | O(1) ✅ | - |
| **Delete tail** | O(1) ✅ | Có prev ptr |
| **Delete node (có ptr)** | O(1) ✅ | Biết prev qua ptr |

---

## 🎯 CÁC PATTERN QUAN TRỌNG

### 1. Khởi tạo Node mới
```cpp
Node* newNode = new Node();
newNode->data = value;
newNode->next = NULL;
```

### 2. Duyệt Linked List
```cpp
Node* current = head;
while (current != NULL) {
    // Xử lý current->data
    current = current->next;
}
```

### 3. Insert at Head
```cpp
newNode->next = head;
head = newNode;
```

### 4. Insert after Node
```cpp
newNode->next = node->next;
node->next = newNode;
```

### 5. Delete Node (biết prev)
```cpp
prev->next = current->next;
delete current;
```

### 6. Reverse (3 pointers)
```cpp
prev = NULL, curr = head;
while (curr) {
    next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
}
head = prev;
```

---

## 🆚 SO SÁNH NHANH

### Array vs Linked List

```
┌────────────────────────────────────────────────────────────┐
│                    ARRAY vs LINKED LIST                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ACCESS BY INDEX:  Array = O(1) ✅  |  LL = O(n) ❌       │
│  INSERT AT HEAD:   Array = O(n) ❌  |  LL = O(1) ✅       │
│  INSERT AT TAIL:   Array = O(1)*    |  LL = O(n)/O(1)**    │
│  DELETE AT HEAD:   Array = O(n) ❌  |  LL = O(1) ✅       │
│  MEMORY:           Contiguous       |  Scattered + overhead│
│                                                            │
│  * Dynamic array (amortized)                               │
│  ** O(1) nếu có tail pointer                               │
└────────────────────────────────────────────────────────────┘
```

### Singly vs Doubly

| Feature | Singly | Doubly |
|---------|--------|--------|
| Memory/node | Less | More (+1 ptr) |
| Traverse backward | ❌ | ✅ |
| Delete tail | O(n) | O(1) |
| Delete node (có ptr) | O(n) | O(1) |

---

## 📝 LINKED LIST TYPES

### 1. Singly Linked List
```
HEAD → [A|●] → [B|●] → [C|●] → NULL
```

### 2. Doubly Linked List
```
NULL ← [A|●] ⇄ [B|●] ⇄ [C|●] → NULL
```

### 3. Circular Singly
```
    ┌───────────────────┐
    ▼                   │
[A|●] → [B|●] → [C|●] ──┘
```

### 4. Circular Doubly
```
    ┌───────────────────────┐
    ▼                       │
⇄ [A|●] ⇄ [B|●] ⇄ [C|●] ⇄ ─┘
```

---

## ⚠️ EDGE CASES

### Phải check:
1. **Empty list**: `head == NULL`
2. **Single node**: `head->next == NULL`
3. **Delete head**: Cập nhật head pointer
4. **Tail operations**: Check tail pointer nếu có

### Common bugs:
```cpp
// ❌ SAI: Mất node tiếp theo
current->next = newNode;
// (Đã ghi đè next, mất phần còn lại của list!)

// ✅ ĐÚNG: Lưu next trước
newNode->next = current->next;
current->next = newNode;
```

---

## 💡 KHI NÀO DÙNG?

┌──────────────────────────────────────┐
│           LINKED LIST?               │
├──────────────────────────────────────┤
│                                      │
│  ✅ YES:                             │
│  • Insert/Delete đầu/giữa thường xuyên│
│  • Kích thước không biết trước       │
│  • Implement Stack/Queue             │
│  • LRU Cache, Undo/Redo              │
│                                      │
│  ❌ NO:                              │
│  • Cần random access                 │
│  • Cần Binary Search                 │
│  • Memory constraint                 │
│  • Cache locality quan trọng         │
│                                      │
└──────────────────────────────────────┘
```

---

## 🔧 ỨNG DỤNG THỰC TẾ

| Ứng dụng | Loại LL | Lý do |
|----------|---------|-------|
| **Stack** | Singly | Insert/Delete ở head O(1) |
| **Queue** | Singly + tail | Enqueue tail, Dequeue head |
| **Browser history** | Doubly | Back/Forward navigation |
| **Undo/Redo** | Doubly | 2-way traversal |
| **Music playlist** | Circular | Loop playback |
| **Round-robin** | Circular | Cycle through items |
| **LRU Cache** | Doubly + HashMap | O(1) access + update |

---

## 🎮 DEMO

- [LinkedList Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_3_LinkedList/LinkedList.ts)

---

## 📚 GHI NHỚ

1. **"Head = O(1)"**: Insert/Delete ở head luôn O(1)

2. **"Tail cần pointer"**: Muốn O(1) ở tail, phải lưu tail pointer

3. **"Doubly = flexible"**: Có prev → xóa node O(1)

4. **"No random access"**: Linked List không access theo index nhanh được

5. **"Memory overhead"**: Mỗi node tốn thêm 1-2 pointers
