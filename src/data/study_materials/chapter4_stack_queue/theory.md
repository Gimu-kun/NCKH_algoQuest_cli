# 📖 Chương 4: Stack & Queue (Ngăn Xếp & Hàng Đợi)

> **Mục tiêu học tập**: Hiểu và áp dụng hai cấu trúc dữ liệu tuyến tính quan trọng

---

## 🎯 Tổng Quan

**Stack** và **Queue** là hai cấu trúc dữ liệu **tuyến tính** với nguyên tắc truy cập khác nhau:

| Cấu trúc  |          Nguyên tắc        |        Ví dụ thực tế           |
|-----------|----------------------------|--------------------------------|
| **Stack** | LIFO (Last In, First Out)  | Chồng đĩa, Undo/Redo           |
| **Queue** | FIFO (First In, First Out) | Hàng đợi mua vé, Printer queue |

---

## 📚 PHẦN A: STACK (Ngăn Xếp)

### Nguyên tắc LIFO (Last In, First Out)

**Ý tưởng**: Phần tử **vào sau** sẽ **ra trước** - giống chồng đĩa!

```
┌─────────────────────────────────────────────────────────┐
│                        STACK                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│      PUSH (thêm vào)          POP (lấy ra)              │
│           ↓                        ↑                    │
│       ┌───────┐                ┌───────┐                │
│       │   5   │ ← TOP          │  (5)  │ ← Lấy 5 ra     │
│       ├───────┤                ├───────┤                │
│       │   3   │                │   3   │ ← TOP mới      │
│       ├───────┤                ├───────┤                │
│       │   8   │                │   8   │                │
│       ├───────┤                ├───────┤                │
│       │   1   │                │   1   │                │
│       └───────┘                └───────┘                │
│                                                         │
│   "LIFO = Last In, First Out"                           │
│   Phần tử 5 vào SAU nhưng ra TRƯỚC!                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Các thao tác cơ bản - O(1)

|      Thao tác      |              Mô tả           | Time Complexity |
|--------------------|------------------------------|-----------------|
| **push(x)**        | Thêm x vào đỉnh stack        |       O(1)      |
| **pop()**          | Xóa và trả về phần tử đỉnh   |       O(1)      |
| **top() / peek()** | Xem phần tử đỉnh (không xóa) |       O(1)      |
| **isEmpty()**      | Kiểm tra stack rỗng          |       O(1)      |
| **size()**         | Số phần tử trong stack       |       O(1)      |

### Cài đặt Stack

#### 1. Dùng Array

```cpp
/**
 * Stack cài đặt bằng Array
 * 
 * ƯU ĐIỂM:
 * - Đơn giản, cache-friendly
 * - Truy cập nhanh
 * 
 * NHƯỢC ĐIỂM:
 * - Kích thước cố định (cần resize nếu đầy)
 * - Lãng phí bộ nhớ nếu không dùng hết
 */
class ArrayStack {
    int arr[MAX_SIZE];
    int topIndex = -1;  // -1 = stack rỗng
    
    void push(int x) {
        if (topIndex >= MAX_SIZE - 1) {
            // Stack overflow!
            return;
        }
        arr[++topIndex] = x;  // Tăng top, thêm phần tử
    }
    
    int pop() {
        if (topIndex < 0) {
            // Stack underflow!
            return -1;
        }
        return arr[topIndex--];  // Trả về và giảm top
    }
    
    int top() {
        if (topIndex < 0) return -1;
        return arr[topIndex];
    }
    
    bool isEmpty() {
        return topIndex < 0;
    }
};
```

#### 2. Dùng Linked List

```cpp
/**
 * Stack cài đặt bằng Linked List
 * 
 * ƯU ĐIỂM:
 * - Kích thước động, không giới hạn
 * - Push/Pop luôn O(1)
 * 
 * NHƯỢC ĐIỂM:
 * - Tốn thêm bộ nhớ cho pointer
 * - Cache-unfriendly
 */
class LinkedStack {
    Node* topNode = NULL;
    
    void push(int x) {
        Node* newNode = new Node(x);
        newNode->next = topNode;  // Trỏ đến top cũ
        topNode = newNode;        // Cập nhật top
    }
    
    int pop() {
        if (topNode == NULL) return -1;
        int value = topNode->data;
        Node* temp = topNode;
        topNode = topNode->next;
        delete temp;
        return value;
    }
};
```

### Ứng dụng của Stack

#### 1. Kiểm tra ngoặc hợp lệ (Balanced Parentheses)

```cpp
/**
 * Kiểm tra chuỗi ngoặc có hợp lệ không
 * 
 * VÍ DỤ:
 * - "(())" → ✅ Hợp lệ
 * - "([{}])" → ✅ Hợp lệ
 * - "(()" → ❌ Không hợp lệ (thiếu đóng)
 * - "([)]" → ❌ Không hợp lệ (sai thứ tự)
 * 
 * THUẬT TOÁN:
 * 1. Duyệt từng ký tự
 * 2. Gặp ngoặc mở → push vào stack
 * 3. Gặp ngoặc đóng → pop và kiểm tra match
 * 4. Cuối cùng stack phải rỗng
 */
bool isValidParentheses(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    return st.empty();
}
```

#### 2. Chuyển đổi cơ số (Convert Base)

```cpp
/**
 * Chuyển số thập phân sang nhị phân
 * 
 * IDEA:
 * - Chia số cho 2, lấy dư push vào Stack
 * - Pop ra sẽ được kết quả ngược lại (đúng thứ tự)
 */
string decimalToBinary(int n) {
    if (n == 0) return "0";
    stack<int> st;
    string binary = "";
    
    while (n > 0) {
        st.push(n % 2);
        n /= 2;
    }
    
    while (!st.empty()) {
        binary += to_string(st.top());
        st.pop();
    }
    return binary;
}
```

#### 3. Chuyển Infix sang Postfix

```cpp
/**
 * Chuyển biểu thức Infix → Postfix
 * 
 * VÍ DỤ:
 * - Infix:   A + B * C
 * - Postfix: A B C * +
 * 
 * TẠI SAO CẦN POSTFIX?
 * - Không cần ngoặc
 * - Dễ tính toán bằng stack
 * - Máy tính xử lý dễ hơn
 */
```

#### 3. Đánh giá biểu thức Postfix (Postfix Evaluation)

```cpp
/**
 * Tính giá trị biểu thức Postfix
 * 
 * VÍ DỤ: "2 3 * 5 +" = 2*3 + 5 = 11
 * 
 * THUẬT TOÁN:
 * 1. Gặp số → push vào stack
 * 2. Gặp toán tử → pop 2 số, tính, push kết quả
 */
int evaluatePostfix(string expr) {
    stack<int> st;
    for (char c : expr) {
        if (isdigit(c)) {
            st.push(c - '0');
        } else if (c == '+' || c == '-' || c == '*' || c == '/') {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (c == '+') st.push(a + b);
            else if (c == '-') st.push(a - b);
            else if (c == '*') st.push(a * b);
            else if (c == '/') st.push(a / b);
        }
    }
    return st.top();
}
```

#### 4. Các ứng dụng khác

|            Ứng dụng          |            Mô tả            |
|------------------------------|-----------------------------|
| **Undo/Redo**                | Lưu các action, undo = pop  |
| **Browser Back**             | Lưu các trang đã truy cập   |
| **Function Call Stack**      | Lưu stack frame khi gọi hàm |
| **DFS (Depth First Search)** | Duyệt đồ thị theo chiều sâu |
| **Backtracking**             | Quay lui thử các lựa chọn   |

---

## 📚 PHẦN B: QUEUE (Hàng Đợi)

### Nguyên tắc FIFO (First In, First Out)

┌─────────────────────────────────────────────────────────┐
│                        QUEUE                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ENQUEUE (thêm vào)                   DEQUEUE (lấy ra) │
│        ↓                                     ↑          │
│   ┌───┬───┬───┬───┬───┐                                 │
│   │ 5 │ 3 │ 8 │ 1 │ 2 │                                 │
│   └───┴───┴───┴───┴───┘                                 │
│     ↑                 ↑                                 │
│   REAR              FRONT                               │
│   (cuối)            (đầu)                               │
│                                                         │
│   "FIFO = First In, First Out"                          │
│   Phần tử 2 vào TRƯỚC nên ra TRƯỚC!                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Các thao tác cơ bản - O(1)

|      Thao tác        |           Mô tả             | Time Complexity |
|----------------------|-----------------------------|-----------------|
| **enqueue(x)**       | Thêm x vào cuối queue       |      O(1)       |
| **dequeue()**        | Xóa và trả về phần tử đầu   |      O(1)       |
| **front() / peek()** | Xem phần tử đầu (không xóa) |      O(1)       |
| **isEmpty()**        | Kiểm tra queue rỗng         |      O(1)       |
| **size()**           | Số phần tử trong queue      |      O(1)       |

### Cài đặt Queue

#### 1. Dùng Array (Linear Queue)

```cpp
/**
 * Queue cài đặt bằng Array
 * 
 * VẤN ĐỀ:
 * - Sau nhiều dequeue, front dịch chuyển
 * - Không gian phía trước bị lãng phí
 * - Cần Circular Queue để giải quyết!
 */
class LinearQueue {
    int arr[MAX_SIZE];
    int front = 0, rear = -1;
    
    void enqueue(int x) {
        if (rear >= MAX_SIZE - 1) return; // Full
        arr[++rear] = x;
    }
    
    int dequeue() {
        if (front > rear) return -1; // Empty
        return arr[front++];
    }
};
```

#### 2. Circular Queue (Vòng)

```cpp
/**
 * Circular Queue - Giải quyết vấn đề lãng phí không gian
 * 
 * Ý TƯỞNG:
 * - rear quay vòng về đầu khi hết chỗ
 * - Sử dụng modulo để tính index
 * 
 * CÔNG THỨC:
 * - next(index) = (index + 1) % MAX_SIZE
 */
class CircularQueue {
    int arr[MAX_SIZE];
    int front = 0, rear = -1, count = 0;
    
    void enqueue(int x) {
        if (count == MAX_SIZE) return; // Full
        rear = (rear + 1) % MAX_SIZE;  // Quay vòng
        arr[rear] = x;
        count++;
    }
    
    int dequeue() {
        if (count == 0) return -1; // Empty
        int value = arr[front];
        front = (front + 1) % MAX_SIZE; // Quay vòng
        count--;
        return value;
    }
};
```

#### 3. Dùng Linked List

```cpp
/**
 * Queue cài đặt bằng Linked List
 * 
 * ĐẶC ĐIỂM:
 * - Dùng 2 pointer: front và rear
 * - Enqueue: thêm vào rear
 * - Dequeue: lấy từ front
 */
class LinkedQueue {
    Node* front = NULL;
    Node* rear = NULL;
    
    void enqueue(int x) {
        Node* newNode = new Node(x);
        if (rear == NULL) {
            front = rear = newNode;
        } else {
            rear->next = newNode;
            rear = newNode;
        }
    }
    
    int dequeue() {
        if (front == NULL) return -1;
        int value = front->data;
        Node* temp = front;
        front = front->next;
        if (front == NULL) rear = NULL; // Queue rỗng
        delete temp;
        return value;
    }
};
```

### Các biến thể Queue

#### 1. Priority Queue (Hàng đợi ưu tiên)

```cpp
/**
 * Priority Queue
 * 
 * ĐẶC ĐIỂM:
 * - Phần tử có độ ưu tiên cao nhất ra trước
 * - Không theo FIFO thuần túy
 * 
 * CÀI ĐẶT:
 * - Dùng Heap: enqueue O(log n), dequeue O(log n)
 * - Dùng Array/LL: enqueue O(1), dequeue O(n)
 * 
 * ỨNG DỤNG:
 * - Dijkstra's algorithm
 * - Huffman coding
 * - Task scheduling by priority
 */
```

#### 2. Deque (Double-ended Queue)

```cpp
/**
 * Deque - Hàng đợi hai đầu
 * 
 * ĐẶC ĐIỂM:
 * - Thêm/xóa được ở CẢ HAI ĐẦU
 * - Kết hợp Stack + Queue
 * 
 * THAO TÁC:
 * - push_front(), push_back()
 * - pop_front(), pop_back()
 * 
 * ỨNG DỤNG:
 * - Sliding window problems
 * - Palindrome checking
 */
```

### Ứng dụng của Queue

#### 1. Hệ thống bán vé (Ticketing System)
- **First-Come, First-Served (FCFS)**: Người đến trước mua vé trước.
- Ứng dụng thực tế: Xếp hàng mua trà sữa, vé xem phim.

#### 2. Pipeline / Buffer
- **IO Buffer**: Dữ liệu từ bàn phím chờ CPU xử lý.
- **Pipeline**: Dữ liệu output của process này là input của process kia (Unix/Linux pipes).

#### 3. Các ứng dụng khác

|             Ứng dụng           |             Mô tả            |
|--------------------------------|------------------------------|
| **BFS (Breadth First Search)** | Duyệt đồ thị theo chiều rộng |
| **Level-order Traversal**      | Duyệt cây theo level         |
| **CPU Scheduling**             | Round-robin, FCFS            |
| **Printer Queue**              | In theo thứ tự gửi           |
| **Message Queue**              | Communication giữa processes |
| **Buffering**                  | IO buffer, keyboard buffer   |

---

## 🆚 SO SÁNH STACK vs QUEUE

|      Tiêu chí      |   Stack (LIFO)    |       Queue (FIFO)       |
|--------------------|-------------------|--------------------------|
| **Nguyên tắc**     | Last In First Out | First In First Out       |
| **Thao tác chính** | push, pop, top    | enqueue, dequeue, front  |
| **Điểm truy cập**  | Chỉ ở TOP         | FRONT (ra) và REAR (vào) |
| **Traversal**      | DFS               | BFS                      |
| **Ví dụ**          | Undo, Call stack  | Hàng đợi, Scheduling     |

---

## 🎮 Demos Tương Tác

| Demo | Mô tả |
|------|-------|
| [Stack.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_4_Stack_Queue/Stack.ts) | Minh họa Stack operations |
| [Queue.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_4_Stack_Queue/Queue.ts) | Minh họa Queue operations |

---

## ✅ Checklist Kiến Thức

- [ ] Phân biệt LIFO (Stack) và FIFO (Queue)
- [ ] Các thao tác: push, pop, enqueue, dequeue
- [ ] Cài đặt Stack/Queue bằng Array và Linked List
- [ ] Hiểu Circular Queue
- [ ] Biết Priority Queue và Deque
- [ ] Ứng dụng: Balanced parentheses, Postfix evaluation
- [ ] Biết khi nào dùng Stack (DFS) vs Queue (BFS)
