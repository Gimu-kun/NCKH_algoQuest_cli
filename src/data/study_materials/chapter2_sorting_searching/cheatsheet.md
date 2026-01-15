# 📋 Cheatsheet: Sorting & Searching

> **Mẹo**: Dùng bảng này để so sánh nhanh các thuật toán!

---

## 🔍 SEARCHING - So Sánh Nhanh

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SEARCHING ALGORITHMS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   LINEAR SEARCH                    BINARY SEARCH                    │
│   ┌───┬───┬───┬───┬───┐           ┌───┬───┬───┬───┬───┐             │
│   │ 5 │ 3 │ 8 │ 1 │ 2 │  →→→      │ 1 │ 2 │ 3 │ 5 │ 8 │             │
│   └───┴───┴───┴───┴───┘           └───┴───┴─▲─┴───┴───┘             │
│        Duyệt từ đầu                         │                       │
│        O(n)                           Chia đôi                      │
│                                       O(log n)                      │
│                                                                     │
│   ✅ Không cần sorted              ⚠️ YÊU CẦU SORTED!              │
│   ❌ Chậm                          ✅ Rất nhanh                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

|    Thuật toán     | Best |  Average |  Worst   |   Yêu cầu   |
|-------------------|------|----------|----------|-------------|
| **Linear Search** | O(1) | O(n)     | O(n)     | Không       |
| **Binary Search** | O(1) | O(log n) | O(log n) | Mảng sorted |

---

## 📊 SORTING - Bảng Tổng Hợp

### Simple Sorts (O(n²))

| Thuật toán | Best | Average | Worst | Space | Stable | Đặc điểm |
|------------|------|---------|-------|-------|--------|----------|
| **Bubble** | O(n) | O(n²) | O(n²) | O(1) | ✅ | Swap cặp liền kề |
| **Selection** | O(n²) | O(n²) | O(n²) | O(1) | ❌ | Tìm min/max |
| **Insertion** | O(n) | O(n²) | O(n²) | O(1) | ✅ | Chèn vào vị trí đúng |

### Efficient Sorts (O(n log n))

| Thuật toán | Best | Average | Worst | Space | Stable | Đặc điểm |
|------------|------|---------|-------|-------|--------|----------|
| **Merge** | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | Divide & Conquer |
| **Quick** | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | Partition |
| **Heap** | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | Dùng Max Heap |

---

## 🎯 NHẬN DIỆN THUẬT TOÁN

### Bubble Sort
```cpp
// Pattern: So sánh cặp liền kề, swap nếu sai
for i = 0 to n-2:
    for j = 0 to n-2-i:
        if arr[j] > arr[j+1]: swap
```
👉 **Nhận dạng**: 2 vòng lặp, swap liền kề

### Selection Sort
```cpp
// Pattern: Tìm min, đặt vào đầu
for i = 0 to n-2:
    min = tìm min trong [i, n-1]
    swap(arr[i], arr[min])
```
👉 **Nhận dạng**: Tìm min/max mỗi pass

### Insertion Sort
```cpp
// Pattern: Dịch chuyển và chèn
for i = 1 to n-1:
    key = arr[i]
    dịch các phần tử > key sang phải
    chèn key vào vị trí đúng
```
👉 **Nhận dạng**: Giống xếp bài

### Merge Sort
```cpp
// Pattern: Chia đôi → Sort → Merge
mergeSort(left_half)
mergeSort(right_half)
merge(left_half, right_half)
```
👉 **Nhận dạng**: Đệ quy chia đôi + hàm merge

### Quick Sort
```cpp
// Pattern: Chọn pivot → Partition → Đệ quy
pivot = partition(arr)
quickSort(left_of_pivot)
quickSort(right_of_pivot)
```
👉 **Nhận dạng**: Partition + pivot

---

## ⚡ KHI NÀO DÙNG?

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CHỌN THUẬT TOÁN SORTING                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  n < 50?  ──────YES───────►  Insertion Sort                         │
│     │                                                               │
│    NO                                                               │
│     │                                                               │
│     ▼                                                               │
│  Cần Stable?  ────YES────►  Merge Sort                              │
│     │                                                               │
│    NO                                                               │
│     │                                                               │
│     ▼                                                               │
│  Memory hạn chế?  ──YES──►  Heap Sort / Quick Sort                  │
│     │                                                               │
│    NO                                                               │
│     │                                                               │
│     ▼                                                               │
│  Tốc độ quan trọng?  ─────►  Quick Sort (randomized)                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💡 KEY FACTS

### Stable Sort là gì?
- **Stable**: Giữ nguyên thứ tự các phần tử **bằng nhau**
- Ví dụ: Sort theo tên, giữ thứ tự ban đầu nếu tên giống nhau

### In-place là gì?
- **In-place**: Không dùng bộ nhớ phụ O(n)
- Merge Sort **KHÔNG** in-place (cần mảng phụ)

### Best Case của Bubble/Insertion là O(n)?
- Khi mảng đã **sắp xếp sẵn**
- Bubble: không swap lần nào
- Insertion: không dịch chuyển lần nào

### Quick Sort worst case O(n²)?
- Khi chọn pivot **xấu** (min hoặc max)
- Xảy ra với mảng đã sorted + pivot đầu/cuối
- **Fix**: Random pivot hoặc Median-of-three

---

## 🔢 SO SÁNH THỰC TẾ

| n | O(n²) | O(n log n) | Nhanh hơn |
|---|-------|------------|-----------|
| 10 | 100 | 33 | 3x |
| 100 | 10,000 | 664 | 15x |
| 1,000 | 1,000,000 | 9,965 | 100x |
| 10,000 | 100,000,000 | 132,877 | 752x |

---

## 📝 CÔNG THỨC QUAN TRỌNG

### Số phép so sánh trong Bubble Sort
```
(n-1) + (n-2) + ... + 1 = n(n-1)/2 ≈ n²/2 = O(n²)
```

### Độ sâu đệ quy Merge Sort
```
log₂(n) levels
Mỗi level: O(n) operations
Total: O(n log n)
```

### Recurrence relation - Merge Sort
```
T(n) = 2·T(n/2) + O(n)
     = O(n log n)  [Master Theorem]
```

---

## 🎮 DEMOS

| Thuật toán | Link |
|------------|------|
| Linear Search | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/LinearSearch.ts) |
| Binary Search | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/BinarySearch.ts) |
| Bubble Sort | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/BubbleSort.ts) |
| Selection Sort | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/SelectionSort.ts) |
| Insertion Sort | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/InsertionSort.ts) |
| Merge Sort | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/MergeSort.ts) |
| Quick Sort | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/QuickSort.ts) |
| Heap Sort | [Demo](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/HeapSort.ts) |
