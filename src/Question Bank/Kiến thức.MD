Nội dung chính:

✔ Khái niệm thuật toán

Đặc tính:

Input

Output

Definiteness

Finiteness

Effectiveness

✔ Độ phức tạp

Time Complexity

Space Complexity

✔ Big-O, Big-Ω, Big-Θ

Bảng ước lượng độ tăng dần:

Complexity	Ví dụ
O(1)	Hashing
O(log n)	Binary Search, BST
O(n)	Linear search
O(n log n)	Merge, Quick, Heap
O(n²)	Bubble, Selection, Insertion
O(2ⁿ)	Backtracking
O(n!)	Permutations

Kèm kiến thức:

Worst / Average / Best-case

Trade-off time-space

➡ Kết luận: phần này là nền tảng cho học DS & các thuật toán sorting, searching.

PHẦN 2 — POINTER & DATA REPRESENTATION

Nội dung chính:

Pointer & địa chỉ

& và *

Con trỏ & mảng

Con trỏ & struct

Heap vs Stack Memory

malloc, calloc, free

Pointer arithmetic

Function pointer

➡ Phần này rất quan trọng vì hầu hết DS = pointer.

PHẦN 3 — CẤU TRÚC DỮ LIỆU TUYẾN TÍNH

Gồm 4 cấu trúc:

3.1 — Linked List

Kiến thức:

Node: data + next

Head, Tail

Singly / Doubly / Circular

Thao tác:

Insert head

Insert tail

Insert after Q

Delete head

Delete tail

Delete after Q

Traversal

Reverse list

Ưu điểm / nhược điểm / complexity:

Search: O(n)

Random access: không có

3.2 — Stack (LIFO)


Thao tác:

Push

Pop

Top / Peek

isEmpty()

Ứng dụng:

DFS

Backtracking

Infix → Postfix

Biên dịch

Convert base

Hàm đệ quy

3.3 — Queue (FIFO)

Dạng đặc biệt:

Circular Queue

Priority Queue

Deque

Ứng dụng:

BFS

Scheduling OS

Pipeline / Buffer

Ticketing system

3.4 — Strings/Arrays (ngầm trong sorting/searching)


PHẦN 4 — CẤU TRÚC DỮ LIỆU PHI TUYẾN
4.1 — Tree & Binary Tree


Khái niệm:

Root

Parent

Children

Degree

Level

Depth

Height

Leaf

Binary Tree:

Full Binary Tree

Complete Binary Tree

Perfect Binary Tree

Traversal:

Preorder

Inorder

Postorder

Level-order

4.2 — BST (Binary Search Tree)

Tính chất:

Left < Root < Right


Thao tác:

Search

Insert

Delete (3 case)

Độ phức tạp:

TB: O(log n)

Worst: O(n) (skew tree)

4.3 — AVL Tree (Self-balanced BST)

Đặc điểm:

Balance factor ∈ {−1, 0, +1}

Height = O(log n)

Rotation:

LL

LR

RR

RL

Cân bằng khi:

Insert

Delete

4.4 — B-Tree

Ứng dụng:

Database

File System

Disk Storage

Đặc điểm:

M-ary Search Tree

Node chứa nhiều key

Tất cả leaf cùng độ sâu

MP3 không có phần này → slide lecture bổ sung.


PHẦN 5 — SEARCHING & SORTING

5.1 — Searching

Linear Search → O(n)

Binary Search → O(log n)

5.2 — Sorting

O(n²) nhóm cơ bản:

Interchange

Bubble

Shaker

Selection

Insertion

Binary Insertion

O(n log n) nhóm hiệu quả:

Merge Sort

Quick Sort

Heap Sort

Shell Sort (phụ thuộc gap)

O(n + k) non-comparison:

Radix

Counting

🎯 KẾT LUẬN TỔNG HỢP



✔ Kỹ thuật phân tích thuật toán
✔ Pointer & memory
✔ Linear DS (LL, Stack, Queue)
✔ Non-linear DS (Tree, BST, AVL, B-Tree)
✔ Searching
✔ Sorting
✔ Applications (DFS/BFS, Scheduling, Compiler, Storage, DB)

DATA STRUCTURES & ALGORITHMS (DSA)
│
├── 1. NỀN TẢNG THUẬT TOÁN
│     ├── Khái niệm thuật toán
│     │     ├ Input / Output
│     │     ├ Rõ ràng (Definiteness)
│     │     ├ Hiệu quả (Effectiveness)
│     │     └ Kết thúc (Finiteness)
│     ├── Phân tích độ phức tạp
│     │     ├ Time Complexity
│     │     └ Space Complexity
│     ├── Ký pháp độ phức tạp
│     │     ├ Big-O (Giới hạn trên)
│     │     ├ Big-Ω (Giới hạn dưới)
│     │     └ Big-Θ (Chính xác)
│     └── Bảng độ phức tạp cơ bản
│           ├ O(1), O(logn), O(n)
│           ├ O(n log n), O(n²)
│           ├ O(2ⁿ), O(n!)
│           └ Best / Average / Worst-case
│
├── 2. POINTER & BỘ NHỚ
│     ├── Con trỏ (Pointer)
│     │     ├ `&` lấy địa chỉ
│     │     └ `*` truy xuất vùng nhớ
│     ├── Con trỏ & Mảng
│     ├── Con trỏ & Struct
│     ├── Cấp phát động
│     │     ├ malloc()
│     │     ├ calloc()
│     │     └ free()
│     └── Bộ nhớ
│           ├ Stack
│           └ Heap
│
├── 3. CẤU TRÚC DỮ LIỆU TUYẾN TÍNH
│     ├── (A) Array & String
│     │     ├ Truy cập O(1)
│     │     └ Chèn/Xóa O(n)
│     ├── (B) Linked List
│     │     ├ Single Linked List
│     │     ├ Double Linked List
│     │     ├ Circular Linked List
│     │     ├ Thao tác
│     │     │     ├ Chèn đầu/cuối
│     │     │     ├ Chèn sau Q
│     │     │     ├ Xóa đầu/cuối
│     │     │     └ Duyệt list
│     │     └ Độ phức tạp
│     │           ├ Tìm kiếm: O(n)
│     │           └ Chèn/Xóa: O(1) (nếu đã có Q)
│     ├── (C) Stack (LIFO)
│     │     ├ Push / Pop / Top
│     │     ├ Ứng dụng:
│     │     │     ├ Biên dịch (Infix → Postfix)
│     │     │     ├ Undo/Redo
│     │     │     └ DFS
│     │     └ Độ phức tạp: O(1)
│     └── (D) Queue (FIFO)
│           ├ Enqueue / Dequeue
│           ├ Circular Queue
│           ├ Priority Queue
│           ├ Deque
│           ├ Ứng dụng:
│           │     ├ BFS
│           │     ├ Scheduling CPU
│           │     └ Buffer IO
│           └ Độ phức tạp: O(1)
│
├── 4. CẤU TRÚC DỮ LIỆU PHI TUYẾN
│     ├── TREE (CÂY)
│     │     ├ Thuật ngữ: Root, Parent, Child, Leaf
│     │     ├ Mức & Chiều cao
│     │     └ Biểu diễn: Linked List, Array
│     ├── BINARY TREE
│     │     ├ Full Binary Tree
│     │     ├ Complete Binary Tree
│     │     ├ Perfect Binary Tree
│     │     └ Duyệt cây
│     │           ├ Pre-Order
│     │           ├ In-Order
│     │           └ Post-Order
│     ├── BST (Binary Search Tree)
│     │     ├ Tính chất: Left < Root < Right
│     │     ├ Thao tác: Search / Insert / Delete
│     │     ├ Complexity:
│     │     │     ├ TB: O(log n)
│     │     │     └ Worst: O(n)
│     │     └ Nhược điểm: mất cân bằng
│     ├── AVL TREE (Cây cân bằng)
│     │     ├ Balance factor ∈ {–1, 0, +1}
│     │     ├ Tự cân bằng sau Insert/Delete
│     │     ├ Rotation:
│     │     │     ├ LL
│     │     │     ├ LR
│     │     │     ├ RR
│     │     │     └ RL
│     │     └ Complexity: O(log n)
│     └── B-TREE
│           ├ Node ≥ 2 keys
│           ├ Tất cả leaf cùng mức
│           ├ Dùng trong: Database, File system
│           └ Tối ưu truy cập đĩa
│
│
├── 5. SEARCHING (TÌM KIẾM)
│     ├── Linear Search: O(n)
│     └── Binary Search: O(log n) (mảng đã sắp xếp)
│
└── 6. SORTING (SẮP XẾP)
      ├── O(n²) — cơ bản
      │     ├ Bubble
      │     ├ Selection
      │     ├ Insertion
      │     ├ Interchange
      │     ├ Shaker
      │     └ Binary Insertion
      ├── O(n log n) — hiệu quả
      │     ├ Merge Sort
      │     ├ Heap Sort
      │     ├ Quick Sort
      │     └ Shell Sort
      └── O(n + k) — không so sánh
            ├ Counting Sort
            └ Radix Sort
