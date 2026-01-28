# 📋 Cheatsheet: Độ Phức Tạp Thuật Toán (Algorithm Complexity)

> **Mẹo**: In cheatsheet này ra để tra cứu nhanh khi học!

---

## 🚀 Big O - Bảng So Sánh Nhanh

```
TĂNG TỐC ĐỘ CHẬM ───────────────────────────────────────► TĂNG ĐỘ PHỨC TẠP

  O(1)  <  O(log n)  <  O(n)  <  O(n log n)  <  O(n²)  <  O(2ⁿ)  <  O(n!)
   ▲         ▲          ▲           ▲            ▲          ▲         ▲
   │         │          │           │            │          │         │
Hằng số  Logarit    Tuyến     Linearithmic   Bậc 2      Mũ      Giai thừa
         (Binary    tính      (Merge Sort)   (2 loop)           (TSP)
         Search)
```

---

## 📊 So Sánh Thực Tế (với n = 1,000,000)

|  Độ phức tạp   | n = 10 | n = 1,000 | n = 1,000,000 | Thời gian (1μs/op) |
|----------------|--------|-----------|---------------|--------------------|
| **O(1)**       |    1   | 1         |        1      |         1 μs       |
| **O(log n)**   |    3   | 10        |        20     |         20 μs      |
| **O(n)**       |    10  | 1,000     |    1,000,000  |         1 giây     |
| **O(n log n)** |    33  | 10,000    |   20,000,000  |         20 giây    |
| **O(n²)**      |    100 | 1,000,000 |       10¹²    |        11.5 ngày   |
| **O(2ⁿ)**      |  1,024 | 10³⁰⁰     |        ∞      |        Không thể!  |

---

## 🔢 Công Thức Quan Trọng

### Tổng dãy số
```
1 + 2 + 3 + ... + n = n(n+1)/2 = O(n²)
```

### Tổng lũy thừa 2
```
1 + 2 + 4 + 8 + ... + 2ⁿ = 2ⁿ⁺¹ - 1 = O(2ⁿ)
```

### Logarit
```
log₂(1024) = 10    (2¹⁰ = 1024)
log₂(n) ≈ số lần chia đôi n đến khi còn 1
```

---

## 🎯 Nhận Diện Nhanh Pattern

### 1. O(1) - Constant
```cpp
int x = arr[0];        // Truy cập trực tiếp
int sum = a + b;       // Phép tính đơn giản
stack.push(x);         // Stack/Queue operations
```

### 2. O(log n) - Logarithmic
```cpp
// Binary Search pattern
while (left < right) {
    mid = (left + right) / 2;
    if (condition) right = mid;
    else left = mid + 1;
}
```

### 3. O(n) - Linear
```cpp
// Duyệt mảng 1 lần
for (int i = 0; i < n; i++) {
    process(arr[i]);
}
```

### 4. O(n log n) - Linearithmic
```cpp
// Divide and Conquer
mergeSort(arr, 0, n-1);  // Chia đôi + merge
sort(arr, arr + n);       // Built-in sort
```

### 5. O(n²) - Quadratic
```cpp
// 2 vòng lặp lồng nhau
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // O(1) operation
    }
}
```

### 6. O(2ⁿ) - Exponential
```cpp
// Đệ quy chia 2 nhánh
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);  // 2 recursive calls
}
```

---

## ⚡ Quy Tắc Tính Nhanh

### ✅ Quy tắc CỘNG (Nối tiếp)
```
O(f) + O(g) = O(max(f, g))

Ví dụ: O(n) + O(n²) = O(n²)
```

### ✅ Quy tắc NHÂN (Lồng nhau)
```
O(f) × O(g) = O(f × g)

Ví dụ: O(n) × O(m) = O(n × m)
```

### ✅ Bỏ hằng số
```
O(2n) = O(n)
O(n²/2) = O(n²)
O(100) = O(1)
```

### ✅ Bỏ số hạng bậc thấp
```
O(n² + n) = O(n²)
O(n³ + n² + n) = O(n³)
```

---

## 🆚 So Sánh Best/Average/Worst Case

| Thuật toán | Best | Average | Worst | Stable? |
|------------|------|---------|-------|---------|
| Bubble Sort | O(n) | O(n²) | O(n²) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | ❌ |
| Insertion Sort | O(n) | O(n²) | O(n²) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | ❌ |
| Binary Search | O(1) | O(log n) | O(log n) | - |
| Linear Search | O(1) | O(n) | O(n) | - |

---

## 💾 Space Complexity Cheatsheet

| Loại | Ví dụ | Space |
|------|-------|-------|
| Biến đơn | `int x, y, z;` | O(1) |
| Mảng cố định | `int arr[100];` | O(1) |
| Mảng động | `int arr[n];` | O(n) |
| Ma trận | `int matrix[n][n];` | O(n²) |
| Đệ quy | `factorial(n)` | O(n) - stack |
| Binary recursion | `fib(n)` | O(n) - stack depth |

---

## 🎓 Mẹo Ghi Nhớ

1. **"Chia đôi = Log"**: Binary Search, Merge Sort chia đôi → O(log n)

2. **"1 vòng lặp = n"**: Duyệt hết mảng 1 lần → O(n)

3. **"2 vòng lồng = n²"**: 2 vòng for lồng nhau → O(n²)

4. **"Đệ quy 2 nhánh = 2ⁿ"**: Gọi đệ quy 2 lần mỗi level → O(2ⁿ)

5. **"Sort tốt nhất = n log n"**: Không thể sort comparison-based nhanh hơn O(n log n)

---

## 🔗 Demo Liên Quan

- [ComplexityAnalysis Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_1_Overview/ComplexityAnalysis.ts)
