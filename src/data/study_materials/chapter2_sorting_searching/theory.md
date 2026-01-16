# 📖 Chương 2: Sorting & Searching (Sắp Xếp & Tìm Kiếm)

> **Mục tiêu học tập**: Nắm vững các thuật toán sắp xếp và tìm kiếm cơ bản đến nâng cao

---

## 🎯 Tổng Quan

**Sorting** (Sắp xếp) và **Searching** (Tìm kiếm) là hai nhóm thuật toán quan trọng nhất trong Computer Science:
- **Sorting**: Sắp xếp dữ liệu theo thứ tự (tăng/giảm)
- **Searching**: Tìm kiếm phần tử trong tập dữ liệu

---

## 🔍 PHẦN A: TÌM KIẾM (SEARCHING)

### 1. Linear Search (Tìm Kiếm Tuần Tự)

**Ý tưởng**: Duyệt từ đầu đến cuối, so sánh từng phần tử với target.

```cpp
// Pseudocode
for i = 0 to n-1:
    if arr[i] == target:
        return i
return -1
```

**Độ phức tạp**:
| Case | Time | Giải thích |
|------|------|------------|
| Best | O(1) | Target ở vị trí đầu |
| Average | O(n/2) = O(n) | Target ở giữa |
| Worst | O(n) | Target ở cuối hoặc không có |

**Ưu điểm**:
- ✅ Đơn giản, dễ cài đặt
- ✅ Không yêu cầu mảng sắp xếp
- ✅ Hoạt động với mọi loại dữ liệu

**Nhược điểm**:
- ❌ Chậm với dữ liệu lớn
- ❌ Không tận dụng được thông tin về thứ tự

---

### 2. Binary Search (Tìm Kiếm Nhị Phân)

**Ý tưởng**: Chia đôi phạm vi tìm kiếm mỗi bước.

**Điều kiện tiên quyết**: ⚠️ Mảng PHẢI được sắp xếp!

```cpp
// Pseudocode
left = 0, right = n-1
while left <= right:
    mid = (left + right) / 2
    if arr[mid] == target: return mid
    else if arr[mid] < target: left = mid + 1
    else: right = mid - 1
return -1
```

**Độ phức tạp**:
| Case | Time | Giải thích |
|------|------|------------|
| Best | O(1) | Target ở chính giữa |
| Average | O(log n) | Chia đôi mỗi bước |
| Worst | O(log n) | Phải chia đến phần tử cuối |

**So sánh Linear vs Binary Search**:

| Tiêu chí | Linear Search | Binary Search |
|----------|---------------|---------------|
| Time Complexity | O(n) | O(log n) |
| Yêu cầu sắp xếp | ❌ Không | ✅ Có |
| n = 1,000,000 | ~1,000,000 bước | ~20 bước |
| Phù hợp | Dữ liệu nhỏ, không sắp xếp | Dữ liệu lớn, đã sắp xếp |

---

## 📊 PHẦN B: SẮP XẾP (SORTING)

### Phân loại thuật toán Sorting

```
                    SORTING ALGORITHMS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   SIMPLE O(n²)    EFFICIENT O(n log n)   NON-COMPARISON O(n)
        │                  │                  │
   ┌────┴────┐      ┌──────┴──────┐          │
   │ Bubble  │      │ Merge Sort │      Counting Sort
   │Selection│      │ Quick Sort │      Radix Sort
   │Insertion│      │ Heap Sort  │
```

---

### 🔹 NHÓM 1: SIMPLE SORTS - O(n²)

#### 1.1 Bubble Sort (Sắp xếp nổi bọt)

**Ý tưởng**: So sánh và đổi chỗ các cặp liền kề, phần tử lớn "nổi" lên cuối.

**Flow**:
1. Duyệt từ đầu đến cuối mảng
2. So sánh arr[j] với arr[j+1]
3. Nếu arr[j] > arr[j+1] → swap
4. Lặp lại n-1 lần

```cpp
for i = 0 to n-2:
    for j = 0 to n-2-i:
        if arr[j] > arr[j+1]:
            swap(arr[j], arr[j+1])
```

**Minh họa**:
```
[5, 3, 8, 1, 2]  → Bắt đầu
[3, 5, 1, 2, 8]  → Pass 1: 8 nổi lên cuối
[3, 1, 2, 5, 8]  → Pass 2: 5 nổi lên
[1, 2, 3, 5, 8]  → Pass 3: 3 nổi lên
[1, 2, 3, 5, 8]  → Hoàn thành!
```

**Độ phức tạp**:
- Time: O(n²) worst/average, O(n) best (đã sắp xếp)
- Space: O(1) - in-place
- Stable: ✅ Có

---

#### 1.2 Interchange Sort (Đổi chỗ trực tiếp)

**Ý tưởng**: So sánh phần tử đầu dãy với các phần tử phía sau, nếu nhỏ hơn thì đổi chỗ ngay lập tức. Đảm bảo sau mỗi vòng lặp, phần tử đầu tiên là nhỏ nhất.

**Độ phức tạp**: O(n²)
- Nhược điểm: Swap quá nhiều lần (không hiệu quả bằng Selection Sort).

---

#### 1.3 Shaker Sort (Bubble Sort 2 chiều)

**Ý tưởng**: Giống Bubble Sort nhưng duyệt 2 chiều (đi lên mang phần tử lớn nhất về cuối, đi về mang phần tử nhỏ nhất về đầu).

**Ưu điểm**: Giải quyết vấn đề "rùa" (phần tử nhỏ ở cuối mảng) của Bubble Sort.

---

#### 1.4 Selection Sort (Sắp xếp chọn)

**Ý tưởng**: Tìm phần tử nhỏ nhất, đặt vào vị trí đầu; lặp lại cho phần còn lại.

**Flow**:
1. Tìm min trong đoạn [i, n-1]
2. Swap min với arr[i]
3. Tăng i, lặp lại

```cpp
for i = 0 to n-2:
    minIdx = i
    for j = i+1 to n-1:
        if arr[j] < arr[minIdx]:
            minIdx = j
    swap(arr[i], arr[minIdx])
```

**Minh họa**:
```
[5, 3, 8, 1, 2]  → Tìm min = 1, swap với vị trí 0
[1, 3, 8, 5, 2]  → Tìm min = 2, swap với vị trí 1
[1, 2, 8, 5, 3]  → Tìm min = 3, swap với vị trí 2
[1, 2, 3, 5, 8]  → Hoàn thành!
```

**Độ phức tạp**:
- Time: O(n²) cả 3 cases
- Space: O(1) - in-place
- Stable: ❌ Không (vì swap có thể đảo thứ tự)

---

#### 1.3 Insertion Sort (Sắp xếp chèn)

**Ý tưởng**: Giống cách xếp bài - lấy từng lá bài và chèn vào vị trí đúng.

**Flow**:
1. Xét phần tử arr[i]
2. So sánh với các phần tử bên trái
3. Dịch chuyển phần tử lớn hơn sang phải
4. Chèn arr[i] vào vị trí đúng

```cpp
for i = 1 to n-1:
    key = arr[i]
    j = i - 1
    while j >= 0 AND arr[j] > key:
        arr[j+1] = arr[j]
        j = j - 1
    arr[j+1] = key
```

**Minh họa**:
```
[5, 3, 8, 1, 2]  → key=3, chèn vào trước 5
[3, 5, 8, 1, 2]  → key=8, đã đúng vị trí
[3, 5, 8, 1, 2]  → key=1, chèn vào đầu
[1, 3, 5, 8, 2]  → key=2, chèn sau 1
[1, 2, 3, 5, 8]  → Hoàn thành!
```

**Độ phức tạp**:
- Time: O(n²) worst, O(n) best (đã sắp xếp gần đúng)
- Space: O(1) - in-place
- Stable: ✅ Có

**Khi nào dùng Insertion Sort?**
- ✅ Mảng nhỏ (n < 50)
- ✅ Mảng gần như đã sắp xếp
- ✅ Cần stable sort và in-place

- Stable: ✅ Có

---

#### 1.6 Binary Insertion Sort

**Ý tưởng**:
- Giống Insertion Sort.
- Nhưng dùng **Binary Search** để tìm vị trí chèn thay vì Linear Search.

**Độ phức tạp**:
- Giảm số lần so sánh xuống O(n log n).
- Vẫn tốn O(n²) lần di chuyển phần tử (shift).

---

### 🔸 NHÓM 2: EFFICIENT SORTS - O(n log n)

#### 2.1 Merge Sort (Sắp xếp trộn)

**Kỹ thuật**: Divide and Conquer (Chia để trị)

**Ý tưởng**:
1. **Divide**: Chia mảng thành 2 nửa
2. **Conquer**: Đệ quy sắp xếp từng nửa
3. **Combine**: Trộn (merge) 2 nửa đã sắp xếp

```cpp
mergeSort(arr, left, right):
    if left < right:
        mid = (left + right) / 2
        mergeSort(arr, left, mid)      // Sort nửa trái
        mergeSort(arr, mid+1, right)   // Sort nửa phải
        merge(arr, left, mid, right)   // Trộn lại
```

**Minh họa**:
```
         [5, 3, 8, 1, 2, 7, 4, 6]
                    │
         ┌──────────┴──────────┐
    [5, 3, 8, 1]          [2, 7, 4, 6]
         │                     │
    ┌────┴────┐           ┌────┴────┐
  [5,3]    [8,1]       [2,7]    [4,6]
    │        │           │        │
  [3,5]    [1,8]       [2,7]    [4,6]
    └────┬────┘           └────┬────┘
    [1, 3, 5, 8]          [2, 4, 6, 7]
         └──────────┬──────────┘
         [1, 2, 3, 4, 5, 6, 7, 8]
```

**Độ phức tạp**:
- Time: O(n log n) cả 3 cases ✅
- Space: O(n) - cần mảng phụ ❌
- Stable: ✅ Có

---

#### 2.2 Quick Sort (Sắp xếp nhanh)

**Kỹ thuật**: Divide and Conquer + Partition

**Ý tưởng**:
1. Chọn **pivot** (phần tử chốt)
2. **Partition**: Đưa các phần tử < pivot sang trái, > pivot sang phải
3. Đệ quy sắp xếp 2 phần

```cpp
quickSort(arr, low, high):
    if low < high:
        pivot = partition(arr, low, high)
        quickSort(arr, low, pivot-1)
        quickSort(arr, pivot+1, high)
```

**Minh họa** (pivot = phần tử cuối):
```
[5, 3, 8, 1, 2, 7, 4, 6]  pivot = 6
         Partition
[5, 3, 1, 2, 4, 6, 8, 7]  6 đã đúng vị trí
    ↓              ↓
  Sort          Sort
[1,2,3,4,5]   [7,8]
         Merge
[1, 2, 3, 4, 5, 6, 7, 8]
```

**Độ phức tạp**:
- Time: O(n log n) average, O(n²) worst
- Space: O(log n) - stack đệ quy
- Stable: ❌ Không

**Khi nào Quick Sort là O(n²)?**
- Mảng đã sắp xếp + chọn pivot là phần tử đầu/cuối
- → **Giải pháp**: Random pivot hoặc Median-of-three

---

#### 2.3 Heap Sort (Sắp xếp vun đống)

**Kỹ thuật**: Sử dụng cấu trúc Heap

**Ý tưởng**:
1. Build Max Heap từ mảng
2. Lấy max (root), đặt vào cuối
3. Heapify lại, lặp

**Độ phức tạp**:
- Time: O(n log n) cả 3 cases
- Space: O(1) - in-place ✅
- Stable: ❌ Không

- Stable: ❌ Không

---

#### 2.4 Shell Sort (Sắp xếp Shell)

**Ý tưởng**:
- Cải tiến Insertion Sort.
- Sắp xếp các phần tử cách nhau một khoảng `gap` (ví dụ n/2, n/4...).
- Giảm dần `gap` về 1.

**Độ phức tạp**:
- Phụ thuộc vào dãy gap (Gap sequence).
- Tốt hơn O(n²), khoảng O(n^1.25) đến O(n^1.5).

---

### 🔹 NHÓM 3: NON-COMPARISON SORTS - O(n + k)

#### 3.1 Counting Sort (Sắp xếp đếm)

**Ý tưởng**:
- Đếm số lần xuất hiện của mỗi giá trị.
- Tính vị trí thực của từng phần tử dựa trên bảng đếm.

**Điều kiện**: Dữ liệu phải là số nguyên và trong phạm vi nhỏ (k nhỏ).

**Độ phức tạp**: O(n + k)

---

#### 3.2 Radix Sort (Sắp xếp cơ số)

**Ý tưởng**:
- Sắp xếp lần lượt theo từng chữ số (hàng đơn vị → hàng chục...).
- Thường dùng Counting Sort cho từng bước.

**Độ phức tạp**: O(d * (n + k)) với d là số chữ số.

---

## 🆚 BẢNG SO SÁNH TỔNG HỢP

| Thuật toán | Best | Average | Worst | Space | Stable | In-place |
|------------|------|---------|-------|-------|--------|----------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | ❌ | ✅ |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | ❌ |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | ✅ |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | ✅ |

---

## 💡 KHI NÀO DÙNG THUẬT TOÁN NÀO?

| Tình huống | Thuật toán đề xuất |
|------------|-------------------|
| Mảng nhỏ (n < 50) | Insertion Sort |
| Mảng gần sắp xếp | Insertion Sort |
| Cần stable sort | Merge Sort |
| Memory hạn chế | Quick Sort, Heap Sort |
| Worst case quan trọng | Merge Sort, Heap Sort |
| Tốc độ trung bình quan trọng | Quick Sort |

---

## 🎮 Demos Tương Tác

| Demo | Mô tả |
|------|-------|
| [LinearSearch.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/LinearSearch.ts) | Minh họa Linear Search |
| [BinarySearch.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/BinarySearch.ts) | Minh họa Binary Search |
| [BubbleSort.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/BubbleSort.ts) | Minh họa Bubble Sort |
| [InsertionSort.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/InsertionSort.ts) | Minh họa Insertion Sort |
| [SelectionSort.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/SelectionSort.ts) | Minh họa Selection Sort |
| [MergeSort.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/MergeSort.ts) | Minh họa Merge Sort |
| [QuickSort.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/QuickSort.ts) | Minh họa Quick Sort |
| [HeapSort.ts](file:///d:/AAA_DSA/Aglo/NCKH_algoQuest_cli/src/algo_demos/Chapter_2_Search_Sort/HeapSort.ts) | Minh họa Heap Sort |

---

## ✅ Checklist Kiến Thức

- [ ] Phân biệt Linear Search vs Binary Search
- [ ] Hiểu điều kiện cần của Binary Search
- [ ] Nắm được ý tưởng 3 thuật toán O(n²)
- [ ] Hiểu Divide and Conquer trong Merge Sort
- [ ] Hiểu Partition trong Quick Sort
- [ ] Biết khi nào dùng thuật toán nào
- [ ] Phân biệt Stable vs Unstable sort
