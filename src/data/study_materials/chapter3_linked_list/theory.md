# 📖 Chương 3: Linked List (Danh Sách Liên Kết)

> **Mục tiêu học tập**: Hiểu cấu trúc và thao tác trên các loại Linked List

---

## 🎯 Tổng Quan

**Linked List** là cấu trúc dữ liệu **tuyến tính** (linear), trong đó các phần tử (node) **không liên tục trong bộ nhớ**, mà được kết nối thông qua **con trỏ** (pointer).

### So sánh với Array

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ARRAY vs LINKED LIST                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ARRAY (Mảng):                                                      │
│  ┌───┬───┬───┬───┬───┐                                              │
│  │ 5 │ 3 │ 8 │ 1 │ 2 │  ← Các phần tử LIÊN TỤC trong bộ nhớ         │
│  └───┴───┴───┴───┴───┘                                              │
│  0x100 0x104 0x108 0x10C 0x110                                      │
│                                                                     │
│  LINKED LIST:                                                       │
│  ┌───┬───┐    ┌───┬───┐    ┌───┬───┐    ┌───┬───┐                   │
│  │ 5 │ ●─┼───►│ 3 │ ●─┼───►│ 8 │ ●─┼───►│ 1 │ / │                   │
│  └───┴───┘    └───┴───┘    └───┴───┘    └───┴───┘                   │
│  0x200        0x350        0x128        0x500                       │
│  ↑                                                                  │
│  HEAD         ← Các node RẢI RÁC, kết nối bằng pointer              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📚 PHẦN 0: POINTER & DATA REPRESENTATION (Con trỏ & Bộ nhớ)

_Kiến thức nền tảng quan trọng cho Linked List_

### 1. Con trỏ (Pointer)
- **Địa chỉ (&)**: Mỗi biến đều có một địa chỉ trong bộ nhớ (VD: `0x7ffee`).
- **Con trỏ (*)**: Là biến lưu trữ **địa chỉ** của biến khác.

```cpp
int a = 10;
int* p = &a;  // p lưu địa chỉ của a
*p = 20;      // Thay đổi giá trị tại địa chỉ mà p trỏ tới -> a = 20
```

### 2. Heap vs Stack Memory
- **Stack**: Bộ nhớ tĩnh, cấp phát tự động khi khai báo biến. Tốc độ nhanh nhưng kích thước cố định.
- **Heap**: Bộ nhớ động, cấp phát thủ công (`malloc/new`). Kích thước linh hoạt nhưng quản lý phức tạp.

### 3. Cấp phát động
- **C**: `malloc()` (cấp phát), `free()` (giải phóng).
- **C++**: `new` (cấp phát), `delete` (giải phóng).

```cpp
Node* node = new Node(); // Cấp phát trên Heap
delete node;             // Giải phóng tránh Memory Leak
```

---

## 📚 Cấu Trúc Node

### Node cơ bản (Singly Linked List)

```cpp
/**
 * Cấu trúc Node cho Singly Linked List
 * 
 * THÀNH PHẦN:
 * - data: Dữ liệu lưu trữ (có thể là bất kỳ kiểu nào)
 * - next: Con trỏ đến node tiếp theo
 */
struct Node {
    int data;       // Dữ liệu
    Node* next;     // Con trỏ đến node kế tiếp
};
```

### Node cho Doubly Linked List

```cpp
/**
 * Cấu trúc Node cho Doubly Linked List
 * 
 * KHÁC BIỆT:
 * - Có thêm con trỏ prev để quay lại node trước
 * - Cho phép duyệt 2 chiều
 */
struct DNode {
    int data;       // Dữ liệu
    DNode* prev;    // Con trỏ đến node TRƯỚC
    DNode* next;    // Con trỏ đến node SAU
};
```

---

## 🔹 SINGLY LINKED LIST (Danh sách liên kết đơn)

### Đặc điểm:
- Mỗi node chứa **data** và **1 con trỏ next**
- Chỉ duyệt được **1 chiều** (từ head đến tail)
- Phần tử cuối có `next = NULL`

### Minh họa:

```
HEAD → [10|●] → [20|●] → [30|●] → [40|/] ← TAIL
                                     ↑
                                  next = NULL
```

### Các thao tác chính:

#### 1. Chèn vào đầu (Insert at Head) - O(1)

```cpp
/**
 * Thêm node mới vào đầu danh sách
 * 
 * FLOW:
 * 1. Tạo node mới
 * 2. new_node->next = head (trỏ đến head cũ)
 * 3. head = new_node (cập nhật head)
 * 
 * ĐỘ PHỨC TẠP: O(1) - Chỉ cần thao tác với head
 */
void insertAtHead(Node*& head, int value) {
    Node* newNode = new Node();   // O(1)
    newNode->data = value;         // O(1)
    newNode->next = head;          // O(1) - Trỏ đến head cũ
    head = newNode;                // O(1) - Cập nhật head
}
```

**Minh họa:**
```
TRƯỚC: HEAD → [10|●] → [20|●] → [30|/]

Chèn 5 vào đầu:
1. Tạo [5|●]
2. [5|●] → [10|●] → [20|●] → [30|/]
3. HEAD = [5|●]

SAU: HEAD → [5|●] → [10|●] → [20|●] → [30|/]
```

#### 2. Chèn vào cuối (Insert at Tail) - O(n)

```cpp
/**
 * Thêm node mới vào cuối danh sách
 * 
 * FLOW:
 * 1. Tạo node mới với next = NULL
 * 2. Duyệt đến node cuối (node có next = NULL)
 * 3. Cập nhật tail->next = new_node
 * 
 * ĐỘ PHỨC TẠP: O(n) - Phải duyệt đến cuối
 * 
 * TỐI ƯU: Lưu trữ tail pointer → O(1)
 */
void insertAtTail(Node*& head, int value) {
    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = NULL;
    
    if (head == NULL) {
        head = newNode;
        return;
    }
    
    Node* current = head;
    while (current->next != NULL) {  // O(n)
        current = current->next;
    }
    current->next = newNode;         // O(1)
}
```

#### 3. Chèn sau node Q (Insert After Q) - O(1)

```cpp
/**
 * Chèn node mới vào SAU node Q
 * 
 * FLOW:
 * 1. newNode->next = Q->next (nối đuôi)
 * 2. Q->next = newNode (nối đầu)
 * 
 * ĐỘ PHỨC TẠP: O(1) - Nếu đã có pointer đến Q
 */
void insertAfter(Node* Q, int value) {
    if (Q == NULL) return;
    
    Node* newNode = new Node();
    newNode->data = value;
    
    newNode->next = Q->next;  // 1.
    Q->next = newNode;        // 2.
}
```

#### 4. Xóa node (Delete) - O(n)

```cpp
/**
 * Xóa node chứa giá trị value
 * 
 * FLOW:
 * 1. Tìm node cần xóa và node TRƯỚC nó
 * 2. prev->next = current->next (bỏ qua node cần xóa)
 * 3. delete current (giải phóng bộ nhớ)
 * 
 * ĐỘ PHỨC TẠP: O(n) - Phải tìm node
 * 
 * TRƯỜNG HỢP ĐẶC BIỆT:
 * - Xóa head → cập nhật head = head->next
 * - Node không tồn tại → không làm gì
 */
void deleteNode(Node*& head, int value) {
    if (head == NULL) return;
    
    // Trường hợp đặc biệt: xóa head
    if (head->data == value) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return;
    }
    
    Node* current = head;
    while (current->next != NULL && current->next->data != value) {
        current = current->next;  // O(n)
    }
    
    if (current->next != NULL) {
        Node* temp = current->next;
        current->next = current->next->next;
        delete temp;
    }
}
```

#### 5. Xóa sau node Q (Delete After Q) - O(1)

```cpp
/**
 * Xóa node nằm SAU node Q
 * 
 * FLOW:
 * 1. temp = Q->next
 * 2. Q->next = temp->next
 * 3. delete temp
 */
void deleteAfter(Node* Q) {
    if (Q == NULL || Q->next == NULL) return;
    
    Node* temp = Q->next;
    Q->next = temp->next;
    delete temp;
}
```

#### 6. Tìm kiếm (Search) - O(n)

```cpp
/**
 * Tìm node chứa giá trị value
 * 
 * ĐỘ PHỨC TẠP: O(n) - Worst case duyệt hết
 * 
 * SO SÁNH VỚI ARRAY:
 * - Array: Binary Search O(log n) nếu sorted
 * - Linked List: Luôn O(n) vì không random access
 */
Node* search(Node* head, int value) {
    Node* current = head;
    while (current != NULL) {
        if (current->data == value) {
            return current;  // Tìm thấy
        }
        current = current->next;
    }
    return NULL;  // Không tìm thấy
}
```

#### 7. Đảo ngược (Reverse) - O(n)

```cpp
/**
 * Đảo ngược Linked List
 * 
 * KĨ THUẬT: 3 pointers
 * - prev: node phía trước
 * - current: node hiện tại
 * - next: node phía sau (lưu tạm)
 * 
 * FLOW:
 * 1. Lưu next = current->next
 * 2. Đảo hướng: current->next = prev
 * 3. Di chuyển: prev = current, current = next
 * 4. Lặp lại cho đến khi hết list
 * 
 * ĐỘ PHỨC TẠP: O(n) time, O(1) space
 */
Node* reverse(Node* head) {
    Node* prev = NULL;
    Node* current = head;
    Node* next = NULL;
    
    while (current != NULL) {
        next = current->next;    // Lưu next
        current->next = prev;    // Đảo hướng
        prev = current;          // Di chuyển prev
        current = next;          // Di chuyển current
    }
    
    return prev;  // prev là head mới
}
```

**Minh họa:**
```
TRƯỚC: [1|●] → [2|●] → [3|●] → [4|/]

Step 1: NULL ← [1|/]  [2|●] → [3|●] → [4|/]
Step 2: NULL ← [1|/] ← [2|/]  [3|●] → [4|/]
Step 3: NULL ← [1|/] ← [2|/] ← [3|/]  [4|/]
Step 4: NULL ← [1|/] ← [2|/] ← [3|/] ← [4|/]

SAU: [4|●] → [3|●] → [2|●] → [1|/]
```

---

## 🔷 DOUBLY LINKED LIST (Danh sách liên kết đôi)

### Đặc điểm:
- Mỗi node có **2 con trỏ**: `prev` và `next`
- Duyệt được **2 chiều**
- Tốn thêm bộ nhớ cho con trỏ `prev`

### Minh họa:

```
NULL ← [10|●] ⇄ [20|●] ⇄ [30|●] ⇄ [40|●] → NULL
        ↑                           ↑
       HEAD                        TAIL
```

### Ưu điểm so với Singly:
- Xóa node cuối: O(1) thay vì O(n) (có prev pointer)
- Duyệt ngược dễ dàng
- Insertion ở vị trí biết trước: O(1)

### Nhược điểm:
- Tốn thêm O(n) bộ nhớ cho prev pointers
- Thao tác phức tạp hơn (phải cập nhật cả prev và next)

---

## 🔶 CIRCULAR LINKED LIST (Danh sách liên kết vòng)

### Đặc điểm:
- Node cuối **trỏ về node đầu** (không có NULL)
- Có thể duyệt vòng tròn liên tục

### Minh họa:

```
Circular Singly:
    ┌────────────────────────────┐
    ▼                            │
 [10|●] → [20|●] → [30|●] → [40|●]
    ↑
   HEAD

Circular Doubly:
    ┌───────────────────────────────────┐
    ▼                                   │
 ⇄ [10|●] ⇄ [20|●] ⇄ [30|●] ⇄ [40|●] ⇄─┘
```

### Ứng dụng:
- Round-robin scheduling
- Carousel/slideshow
- Multiplayer games (turn-based)
- Buffer vòng (circular buffer)

---

## 🆚 BẢNG SO SÁNH

### Array vs Linked List

|      Thao tác        | Array | Singly LL | Doubly LL |
|----------------------|-------|-----------|-----------|
| **Access by index**  | O(1) ✅ | O(n) | O(n) |
| **Search**           | O(n) / O(log n)* | O(n) | O(n) |
| **Insert at head**   | O(n) | O(1) ✅ | O(1) ✅ |
| **Insert at tail**   | O(1)** | O(n) | O(1)*** |
| **Insert at middle** | O(n) | O(n) | O(1)**** |
| **Delete at head**   | O(n) | O(1) ✅ | O(1) ✅ |
| **Delete at tail**   | O(1)** | O(n) | O(1) ✅ |
| **Memory**           | Liên tục | Rải rác | Rải rác |
| **Extra space**      | Không | +pointer | +2 pointers |

*Binary Search nếu sorted
**Nếu có tail pointer
***Nếu có tail pointer
****Nếu có pointer đến node trước

### Singly vs Doubly vs Circular

| Tiêu chí | Singly | Doubly | Circular |
|----------|--------|--------|----------|
| **Memory/node** | 1 pointer | 2 pointers | 1-2 pointers |
| **Duyệt ngược** | Không | Có ✅ | Có thể |
| **Xóa node (có pointer)** | O(n) | O(1) ✅ | O(1) |
| **Complexity** | Đơn giản | Phức tạp | Phức tạp |
| **Use case** | Stack, Queue | Browser history | Round-robin |

---

## 💡 KHI NÀO DÙNG LINKED LIST?

### ✅ NÊN dùng khi:
- Insert/Delete thường xuyên ở đầu/giữa
- Không biết trước kích thước
- Không cần random access
- Implement Stack/Queue

### ❌ KHÔNG nên dùng khi:
- Cần access nhanh theo index
- Cần Binary Search
- Memory là constraint (overhead của pointers)
- Cache locality quan trọng

---

## 🎮 Demo Tương Tác

| Demo | Mô tả |
|------|-------|
| [LinkedList.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_3_LinkedList/LinkedList.ts) | Minh họa các thao tác Linked List |

---

## ✅ Checklist Kiến Thức

- [ ] Hiểu cấu trúc Node và con trỏ
- [ ] Phân biệt Singly, Doubly, Circular
- [ ] Thao tác Insert ở head, tail, middle
- [ ] Thao tác Delete và Search
- [ ] Thuật toán Reverse Linked List
- [ ] So sánh được Array vs Linked List
- [ ] Biết khi nào dùng Linked List
