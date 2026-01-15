# 📋 Cheatsheet: Stack & Queue

> **Mẹo**: Tra cứu nhanh LIFO vs FIFO!

---

## 🎯 SO SÁNH NHANH

```
┌─────────────────────────────────────────────────────────────────────┐
│                     STACK vs QUEUE                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   STACK (LIFO)                      QUEUE (FIFO)                    │
│   ════════════                      ════════════                    │
│                                                                     │
│       ↓ push                        enqueue ↓                       │
│   ┌───────┐                              ┌───┬───┬───┬───┐          │
│   │  TOP  │ ← pop                        │ 1 │ 2 │ 3 │ 4 │          │
│   ├───────┤                              └───┴───┴───┴───┘          │
│   │       │                               ↑               ↑         │
│   ├───────┤                             FRONT          REAR         │
│   │       │                           (dequeue)      (enqueue)      │
│   └───────┘                                                         │
│                                                                     │
│   Last In First Out              First In First Out                 │
│   "Chồng đĩa"                    "Hàng đợi mua vé"                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ ĐỘ PHỨC TẠP

### Stack Operations

| Thao tác | Time | Space |
|----------|------|-------|
| `push(x)` | O(1) | O(1) |
| `pop()` | O(1) | O(1) |
| `top()` / `peek()` | O(1) | O(1) |
| `isEmpty()` | O(1) | O(1) |
| `size()` | O(1) | O(1) |

### Queue Operations

| Thao tác | Time | Space |
|----------|------|-------|
| `enqueue(x)` | O(1) | O(1) |
| `dequeue()` | O(1) | O(1) |
| `front()` / `peek()` | O(1) | O(1) |
| `isEmpty()` | O(1) | O(1) |
| `size()` | O(1) | O(1) |

---

## 📝 CÀI ĐẶT NHANH

### Stack với Array
```cpp
int stack[MAX], top = -1;

void push(int x) { stack[++top] = x; }
int pop() { return stack[top--]; }
int peek() { return stack[top]; }
bool isEmpty() { return top < 0; }
```

### Stack với Linked List
```cpp
void push(int x) {
    newNode->next = topNode;
    topNode = newNode;
}
int pop() { 
    int val = topNode->data;
    topNode = topNode->next;
    return val;
}
```

### Queue với Array (Circular)
```cpp
int queue[MAX], front = 0, rear = -1, count = 0;

void enqueue(int x) {
    rear = (rear + 1) % MAX;
    queue[rear] = x;
    count++;
}
int dequeue() {
    int val = queue[front];
    front = (front + 1) % MAX;
    count--;
    return val;
}
```

---

## 🎯 PATTERN NHẬN DIỆN

### Khi nào dùng STACK?
```
┌────────────────────────────────────┐
│          USE STACK WHEN:           │
├────────────────────────────────────┤
│ ✅ "Most recent" / "Last action"   │
│ ✅ Matching pairs (ngoặc, tags)    │
│ ✅ Undo/Redo functionality         │
│ ✅ DFS (Depth-First Search)        │
│ ✅ Backtracking                    │
│ ✅ Expression evaluation           │
│ ✅ Function call tracking          │
└────────────────────────────────────┘
```

### Khi nào dùng QUEUE?
```
┌────────────────────────────────────┐
│          USE QUEUE WHEN:           │
├────────────────────────────────────┤
│ ✅ "First come first served"       │
│ ✅ BFS (Breadth-First Search)      │
│ ✅ Level-order tree traversal      │
│ ✅ Task scheduling                 │
│ ✅ Buffer / Streaming              │
│ ✅ Printer queue                   │
│ ✅ Message passing                 │
└────────────────────────────────────┘
```

---

## 🔄 CÁC BIẾN THỂ

### Stack Variants
| Loại | Đặc điểm |
|------|----------|
| **Min Stack** | getMin() O(1) |
| **Max Stack** | getMax() O(1) |
| **Two Stacks in Array** | 2 stacks share 1 array |

### Queue Variants
| Loại | Đặc điểm |
|------|----------|
| **Circular Queue** | Tái sử dụng không gian |
| **Priority Queue** | Ra theo priority, không FIFO |
| **Deque** | Thêm/xóa cả 2 đầu |
| **Blocking Queue** | Thread-safe, wait if full/empty |

---

## 💡 ỨNG DỤNG

### Stack Applications

| Bài toán | Pattern |
|----------|---------|
| **Balanced Parentheses** | Push mở, pop đóng, check match |
| **Infix to Postfix** | Dùng stack lưu operators |
| **Postfix Evaluation** | Push số, pop khi gặp operator |
| **DFS Graph** | Push neighbors, pop to visit |
| **Undo/Redo** | 2 stacks: undo và redo |
| **Browser Back** | Stack of visited pages |

### Queue Applications

| Bài toán | Pattern |
|----------|---------|
| **BFS Graph** | Enqueue neighbors, dequeue to visit |
| **Level Order Tree** | Enqueue children at each level |
| **Sliding Window Max** | Deque giữ max candidates |
| **CPU Scheduling** | Queue of processes |
| **Printer Spooler** | Queue of print jobs |

---

## ⚠️ EDGE CASES

### Stack
```cpp
// Push khi đầy → Stack Overflow
// Pop khi rỗng → Stack Underflow

if (top >= MAX - 1) // Full
if (top < 0)        // Empty
```

### Queue
```cpp
// Enqueue khi đầy → Queue Full
// Dequeue khi rỗng → Queue Empty

if (count == MAX)   // Full
if (count == 0)     // Empty

// Circular: dùng modulo
rear = (rear + 1) % MAX;
front = (front + 1) % MAX;
```

---

## 🆚 ARRAY vs LINKED LIST

| Cài đặt | Stack | Queue |
|---------|-------|-------|
| **Array** | Đơn giản, fast | Cần circular |
| **Linked List** | Dynamic size | Need front+rear ptr |
| **Memory** | Array tốt hơn | Depends |

---

## 🔧 IMPLEMENT VỚI STL (C++)

```cpp
#include <stack>
#include <queue>

// STACK
stack<int> st;
st.push(5);      // Thêm
st.pop();        // Xóa top
st.top();        // Xem top
st.empty();      // Check rỗng
st.size();       // Số phần tử

// QUEUE
queue<int> q;
q.push(5);       // Enqueue
q.pop();         // Dequeue
q.front();       // Xem đầu
q.back();        // Xem cuối
q.empty();       // Check rỗng

// PRIORITY QUEUE (Max Heap)
priority_queue<int> pq;
pq.push(5);      // Thêm
pq.top();        // Xem max
pq.pop();        // Xóa max

// DEQUE
deque<int> dq;
dq.push_front(5);
dq.push_back(10);
dq.pop_front();
dq.pop_back();
```

---

## 📚 GHI NHỚ

1. **"LIFO = Undo"**: Stack → thao tác gần nhất ra trước

2. **"FIFO = Fair"**: Queue → ai đến trước được phục vụ trước

3. **"DFS = Stack, BFS = Queue"**: Nhớ pattern duyệt đồ thị

4. **"Circular = Modulo"**: `(index + 1) % MAX`

5. **"Priority Queue ≠ Queue"**: Không theo FIFO!

---

## 🎮 DEMOS

- [Stack Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_4_Stack_Queue/Stack.ts)
- [Queue Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_4_Stack_Queue/Queue.ts)
