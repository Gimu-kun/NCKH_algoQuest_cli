export const THEORY_CONTENT: Record<string, string> = {
    algo_overview: `# 🟦 **A. TỔNG QUAN & NỀN TẢNG**

### **1. Tổng quan Thuật toán**

**Kiến thức chính:**

*   **Định nghĩa thuật toán**: Một tập hợp các bước hữu hạn để giải quyết một bài toán.
*   **Tính đúng đắn (Correctness)**: Thuật toán phải cho ra kết quả đúng với mọi input hợp lệ.
*   **Tính hiệu quả (Efficiency)**: Tiêu tốn ít tài nguyên (thời gian, bộ nhớ).
*   **Độ phức tạp thời gian (Time Complexity)**: O(n), O(log n), ...
*   **Độ phức tạp không gian (Space Complexity)**: Bộ nhớ phụ cần thiết.
*   **Big-O, Big-Theta, Big-Omega**: Các ký hiệu tiệm cận.

**Phân loại thuật toán:**
*   Sắp xếp (Sorting)
*   Tìm kiếm (Searching)
*   Chia để trị (Divide & Conquer)
*   Tham lam (Greedy)
*   Quy hoạch động (DP)
*   Quay lui (Backtracking)
`,

    pointer: `# 🟦 **A. TỔNG QUAN & NỀN TẢNG**

### **2. Pointer (Con trỏ)**

**Concepts chính:**

*   **Địa chỉ vùng nhớ**: Nơi biến được lưu trữ trong RAM.
*   **Toán tử**:
    *   \`&\`: Lấy địa chỉ.
    *   \`*\`: Truy cập giá trị tại địa chỉ.
*   **Con trỏ & Mảng**: Tương quan chặt chẽ, tên mảng là con trỏ hằng.
*   **Dynamic allocation**:
    *   \`malloc()\`: Cấp phát bộ nhớ.
    *   \`calloc()\`: Cấp phát và khởi tạo bằng 0.
    *   \`free()\`: Giải phóng bộ nhớ.

**Ứng dụng trong DS:** dùng để xây dựng Linked List, Tree, Graph.
`,

    ds_overview: `# 🟦 **A. TỔNG QUAN & NỀN TẢNG**

### **3. Tổng quan Cấu trúc dữ liệu**

**Nắm bản chất:**

*   **Dữ liệu (Data)**: Thông tin thô.
*   **Cấu trúc dữ liệu (Data Structure)**: Cách tổ chức dữ liệu để sử dụng hiệu quả.
*   **Trừu tượng dữ liệu (ADT)**: Mô hình logic (Stack, Queue) tách biệt với cài đặt cụ thể.
*   **Phân loại**:
    *   **Tuyến tính (Linear)**: Array, Linked List, Stack, Queue.
    *   **Phi tuyến tính (Non-linear)**: Tree, Graph.
`,

    arrays_strings: `# 🟨 **B. CẤU TRÚC DỮ LIỆU TUYẾN TÍNH**

### **4. Mảng & Chuỗi**

Thuộc nhóm tổ hợp thuật toán nền tảng cho Sorting & Searching.

*   **Mảng (Array)**: Tập hợp các phần tử cùng kiểu, lưu trữ liên tiếp. Truy cập ngẫu nhiên \`O(1)\`.
*   **Chuỗi (String)**: Mảng các ký tự.

**Thao tác cơ bản:**
*   Truy cập: \`O(1)\`
*   Chèn/Xóa: \`O(n)\` (do phải dời các phần tử phía sau).
`,

    linkedList: `# 🟨 **B. CẤU TRÚC DỮ LIỆU TUYẾN TÍNH**

### **5. Linked List**

**Nội dung:**

*   **Node**: Chứa dữ liệu và con trỏ \`next\`.
*   **Head / Tail**: Quản lý điểm đầu và cuối danh sách.
*   **Thao tác**:
    *   Thêm/Xóa đầu: \`O(1)\`
    *   Thêm/Xóa cuối: \`O(1)\` (nếu có tail) hoặc \`O(n)\`
    *   Thêm/Xóa giữa: \`O(n)\` (để tìm vị trí) + \`O(1)\` (nối dây).
    *   Tìm kiếm: \`O(n)\`
*   **Biến thể**:
    *   Singly Linked List (Đơn)
    *   Doubly Linked List (Đôi)
    *   Circular Linked List (Vòng)
`,

    stack: `# 🟨 **B. CẤU TRÚC DỮ LIỆU TUYẾN TÍNH**

### **6. Stack (Ngăn xếp)**

**Concepts:**

*   **LIFO** (Last in First out): Vào sau ra trước.
*   **Cấu trúc**: Cài đặt bằng Array hoặc Linked List.
*   **Operation**:
    *   \`push()\`: Thêm vào đỉnh.
    *   \`pop()\`: Lấy ra từ đỉnh.
    *   \`top()\`: Xem phần tử đỉnh.
    *   Độ phức tạp: \`O(1)\` cho tất cả.

**Ứng dụng:**
*   Chuyển Infix → Postfix
*   Tính toán biểu thức (Evaluation)
*   Backtracking (Quay lui)
*   DFS (Duyệt đồ thị)
`,

    queue: `# 🟨 **B. CẤU TRÚC DỮ LIỆU TUYẾN TÍNH**

### **7. Queue (Hàng đợi)**

**Concepts:**

*   **FIFO** (First in First out): Vào trước ra trước.
*   **Operation**:
    *   \`enqueue()\`: Thêm vào cuối.
    *   \`dequeue()\`: Lấy ra từ đầu.
    *   Độ phức tạp: \`O(1)\`.

**Biến thể:**
*   Circular Queue
*   Priority Queue (Hàng đợi ưu tiên)
*   Deque (Hàng đợi 2 đầu)

**Ứng dụng:**
*   BFS (Duyệt theo chiều rộng)
*   Scheduling (Lập lịch CPU)
*   Buffer IO
`,

    tree_binaryTree: `# 🟥 **C. CẤU TRÚC DỮ LIỆU PHI TUYẾN TÍNH**

### **8. Tree & Binary Tree**

**Nội dung chính:**

*   **Cấu thành**: Root (gốc), Parent (cha), Child (con), Leaf (lá).
*   **Đặc tính**: Height (chiều cao), Depth (độ sâu).
*   **Binary Tree (Cây nhị phân) đặc thù**:
    *   **Full BT**: Mọi node có 0 hoặc 2 con.
    *   **Complete BT**: Điền đầy các mức trừ mức cuối, dồn về trái.
    *   **Perfect BT**: Mọi node lá cùng độ sâu.

**Duyệt cây (Traversals):**
*   Inorder (Trái - Gốc - Phải)
*   Preorder (Gốc - Trái - Phải)
*   Postorder (Trái - Phải - Gốc)
*   Level-order (Theo tầng - BFS)
`,

    bst: `# 🟥 **C. CẤU TRÚC DỮ LIỆU PHI TUYẾN TÍNH**

### **9. Binary Search Tree (BST)**

**Đặc tính quan trọng:**
\`\`\`
Left < Root < Right
\`\`\`
Mọi node bên trái nhỏ hơn gốc, mọi node bên phải lớn hơn gốc.

**Thao tác & Độ phức tạp:**
*   Search / Insert:
    *   Trung bình: \`O(log n)\`
    *   Tệ nhất (Skewed/Lệch): \`O(n)\`
*   Delete (3 trường hợp):
    1.  Node lá: Xóa trực tiếp.
    2.  Node có 1 con: Nối con với ông nội.
    3.  Node có 2 con: Tìm node thay thế (Max cây con trái hoặc Min cây con phải).
`,

    avlTree: `# 🟥 **C. CẤU TRÚC DỮ LIỆU PHI TUYẾN TÍNH**

### **10. AVL Tree**

**Đặc tính:**

*   Là **Self-Balancing BST** (BST tự cân bằng).
*   **Hệ số cân bằng (Balance Factor)**:
    \`\`\`
    BF = height(left) - height(right)
    \`\`\`
    Luôn đảm bảo \`|BF| ≤ 1\`.

**Xoay cây (Rotation):** để cân bằng lại khi thêm/xóa.
*   LL (Left-Left)
*   RR (Right-Right)
*   LR (Left-Right)
*   RL (Right-Left)

**Độ phức tạp:**
Luôn là \`O(log n)\` cho Search/Insert/Delete (tốt hơn BST thường trong worst case).
`,

    searching: `# 🟩 **D. TÌM KIẾM & SẮP XẾP**

### **11. Searching (Tìm Kiếm)**

**1. Tìm kiếm tuyến tính (Linear Search):**
*   Duyệt tuần tự từ đầu đến cuối.
*   Không cần mảng sắp xếp.
*   Độ phức tạp: \`O(n)\`.

**2. Tìm kiếm nhị phân (Binary Search):**
*   Chia đôi không gian tìm kiếm.
*   **Yêu cầu**: Mảng đã sắp xếp.
*   Độ phức tạp: \`O(log n)\`.
`,

    sorting: `# 🟩 **D. TÌM KIẾM & SẮP XẾP**

### **12. Sorting (Sắp Xếp)**

**A. Simple Sorts (O(n²))**
*   **Interchange Sort**: Đổi chỗ trực tiếp.
*   **Bubble Sort**: Nổi bọt.
*   **Insertion Sort**: Chèn.
*   **Selection Sort**: Chọn.

**B. Efficient Sorts (O(n log n))**
*   **Quick Sort**: Phân hoạch (Pivot). Trung bình nhanh nhất.
*   **Merge Sort**: Trộn (Divide & Conquer). Ổn định.
*   **Heap Sort**: Dùng Heap. Không ổn định.

**C. Other**
*   **Shell Sort**: Cải tiến Insertion với gap.
*   **Radix / Counting Sort**: Không dùng so sánh (\`O(nk)\`).
`
};
