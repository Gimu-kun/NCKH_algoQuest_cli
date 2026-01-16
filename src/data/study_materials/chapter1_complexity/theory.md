# 📖 Chương 1: Phân Tích Độ Phức Tạp Thuật Toán (Algorithm Complexity Analysis)

> **Mục tiêu học tập**: Hiểu và áp dụng Big O notation để đánh giá hiệu quả thuật toán

---

## 🎯 Tổng quan

**Độ phức tạp thuật toán** (Algorithm Complexity) là thước đo đánh giá hiệu quả của thuật toán dựa trên:
- **Thời gian** (Time Complexity): Thuật toán chạy nhanh/chậm như thế nào?
- **Không gian** (Space Complexity): Thuật toán cần bao nhiêu bộ nhớ?

---

## 📚 Các Khái Niệm Cơ Bản

### 1. Đặc tính của Thuật toán (Algorithm Characteristics)

Một thuật toán chuẩn cần đảm bảo các đặc tính sau:
- **Input**: Có 0 hoặc nhiều đầu vào.
- **Output**: Có ít nhất 1 đầu ra.
- **Definiteness (Tính xác định)**: Các bước phải rõ ràng, không gây nhầm lẫn.
- **Finiteness (Tính hữu hạn)**: Thuật toán phải dừng sau một số bước hữu hạn.
- **Effectiveness (Tính hiệu quả)**: Các bước phải thực hiện được bằng giấy bút trong thời gian hữu hạn.

---

### 2. Big O Notation (Ký hiệu O lớn)

**Định nghĩa**: Big O mô tả **giới hạn trên** (upper bound) của thời gian chạy thuật toán khi input tăng lên vô cực.

```
T(n) = O(f(n)) 
⟹ Tồn tại c > 0, n₀ > 0 sao cho T(n) ≤ c·f(n) với mọi n ≥ n₀
```

**Ý nghĩa thực tế**: Big O cho biết thuật toán chạy **chậm nhất** bao nhiêu trong trường hợp xấu nhất (Worst Case).

---

### 3. Các ký hiệu tiệm cận khác

| Ký hiệu | Tên gọi | Ý nghĩa |
|---------|---------|---------|
| **O(n)** | Big O | Giới hạn trên (Upper Bound) - Worst Case |
| **Ω(n)** | Big Omega | Giới hạn dưới (Lower Bound) - Best Case |
| **Θ(n)** | Big Theta | Giới hạn chặt (Tight Bound) - Average Case |

---

### 4. Các mức độ phức tạp phổ biến

Sắp xếp từ **tốt nhất** → **xấu nhất**:

| Độ phức tạp | Tên gọi | Ví dụ | n=1000 (số phép tính) |
|-------------|---------|-------|----------------------|
| **O(1)** | Constant | Hashing, Truy cập mảng | 1 |
| **O(log n)** | Logarithmic | Binary Search, BST | ~10 |
| **O(n)** | Linear | Linear Search | 1,000 |
| **O(n log n)** | Linearithmic | Merge Sort, Quick Sort | ~10,000 |
| **O(n²)** | Quadratic | Bubble, Selection, Insertion | 1,000,000 |
| **O(2ⁿ)** | Exponential | Backtracking, Recursive Fib | ~10³⁰⁰ |
| **O(n!)** | Factorial | Permutations | Không thể tính! |

---

## 🔍 Phân Tích Time Complexity

### Quy tắc phân tích:

#### 1. Quy tắc Cộng (Sum Rule)
Khi có **nhiều đoạn code nối tiếp** nhau:
```cpp
// Đoạn 1: O(n)
for (int i = 0; i < n; i++) { ... }

// Đoạn 2: O(n²)
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) { ... }
}

// Tổng: O(n) + O(n²) = O(n²)  ← Lấy độ phức tạp LỚN NHẤT
```

#### 2. Quy tắc Nhân (Product Rule)
Khi có **vòng lặp lồng nhau**:
```cpp
for (int i = 0; i < n; i++) {      // O(n)
    for (int j = 0; j < m; j++) {  // O(m)
        ...                         // O(1)
    }
}
// Tổng: O(n) × O(m) = O(n·m)
```

#### 3. Bỏ qua hằng số
- `O(2n)` → `O(n)`
- `O(n² + 3n + 5)` → `O(n²)`
- `O(n/2)` → `O(n)`

---

## 📊 Phân Tích Space Complexity

**Space Complexity** = Bộ nhớ Input + **Auxiliary Space** (Bộ nhớ phụ)

| Thuật toán | Auxiliary Space | Giải thích |
|------------|-----------------|------------|
| Bubble Sort | O(1) | Chỉ dùng vài biến tạm |
| Merge Sort | O(n) | Cần mảng phụ để merge |
| Quick Sort | O(log n) | Stack đệ quy |
| Fibonacci DP | O(n) | Mảng lưu kết quả |

---

## 💡 So Sánh: Time vs Space Tradeoff

**Định lý**: Thường phải **đánh đổi** giữa thời gian và bộ nhớ!

| Cách tiếp cận | Time | Space | Ví dụ |
|---------------|------|-------|-------|
| **Tốn thời gian, tiết kiệm bộ nhớ** | Chậm hơn | Ít hơn | Fibonacci đệ quy |
| **Tốn bộ nhớ, nhanh hơn** | Nhanh hơn | Nhiều hơn | Fibonacci với Memoization |

---

## 🎮 Demo Tương Tác

Xem demo phân tích độ phức tạp tại:
- [ComplexityAnalysis.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_1_Overview/ComplexityAnalysis.ts)

---

## 📝 Bài Tập Thực Hành

### Bài 1: Xác định độ phức tạp
Phân tích Time Complexity của các đoạn code sau:

```cpp
// Code A
int sum = 0;
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        sum += i + j;
    }
}
// Đáp án: O(n²) - Tổng = n + (n-1) + ... + 1 = n(n+1)/2

// Code B
int i = 1;
while (i < n) {
    i = i * 2;
}
// Đáp án: O(log n) - i nhân đôi mỗi bước

// Code C
for (int i = 0; i < n; i++) {
    for (int j = 0; j < 1000; j++) {
        printf("*");
    }
}
// Đáp án: O(n) - Vòng trong là hằng số 1000 = O(1)
```

---

## ✅ Checklist Kiến Thức

Sau chương này, bạn cần nắm được:

- [ ] Hiểu Big O, Big Omega, Big Theta
- [ ] Phân biệt Best/Average/Worst Case
- [ ] Phân tích được độ phức tạp vòng lặp đơn
- [ ] Phân tích được độ phức tạp vòng lặp lồng
- [ ] Hiểu Time-Space Tradeoff
- [ ] So sánh được các mức độ phức tạp

---

## 📖 Tài Liệu Tham Khảo

1. **Introduction to Algorithms** - CLRS (Chapter 3: Growth of Functions)
2. **Data Structures and Algorithms** - DSA Handbook
3. **Big O Cheat Sheet** - bigocheatsheet.com
