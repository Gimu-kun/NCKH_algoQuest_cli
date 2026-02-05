/**
 * =============================================================================
 * FILE: QuickSort.ts (Sắp Xếp Nhanh)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp mảng theo thứ tự tăng dần.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Divide and Conquer (Chia để trị)**: Chia mảng dựa trên một điểm chốt (Pivot).
 *    - **Partitioning (Phân hoạch)**: Kỹ thuật quan trọng nhất của QuickSort. Chia mảng thành 2 phần: các số nhỏ hơn Pivot và các số lớn hơn Pivot.
 *    - **Recursion (Đệ quy)**: Áp dụng cùng logic cho 2 phần mảng con.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: **Base Case**: Nếu mảng có < 2 phần tử -> Return (đã sort).
 *    - B2: **Pivot Selection**: Chọn 1 phần tử làm Pivot (ví dụ: phần tử cuối cùng).
 *    - B3: **Partitioning**:
 *         + Tạo mảng `left`: Chứa các phần tử < Pivot.
 *         + Tạo mảng `right`: Chứa các phần tử >= Pivot.
 *    - B4: **Recursion**: Gọi đệ quy `quickSort(left)` và `quickSort(right)`.
 *    - B5: **Combine**: Gộp kết quả lại: `[...sortedLeft, pivot, ...sortedRight]`.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**:
 *      + Average Case: O(n log n).
 *      + Best Case: O(n log n) (Khi Pivot chia đôi mảng đều).
 *      + Worst Case: O(n^2) (Khi mảng đã sorted hoặc reverse sorted mà chọn Pivot là phần tử cuối -> Mảng bị chia lệch 0 : n-1).
 *    - **Space Complexity**:
 *      + O(log n) (Stack depth) + O(n) (Do cách cài đặt tạo mảng phụ ở đây - *Lưu ý: QuickSort chuẩn In-place chỉ tốn O(log n)*).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Rất nhanh trong thực tế (nhanh hơn Merge Sort và Heap Sort vì hằng số nhỏ).
 *      + Cache-friendly (Thân thiện với bộ nhớ cache CPU).
 *    - **Nhược điểm**:
 *      + Unstable Sort (Không ổn định).
 *      + Worst case O(n^2). Cần chọn Pivot khéo léo (vd: Random Pivot hoặc Median-of-Three) để tránh.
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Merge Sort**: Quick Sort thường nhanh hơn nhưng không ổn định. Merge Sort an toàn hơn về time complexity O(n log n) nhưng tốn ram.
 */

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateQuickSortSteps - Tạo các bước cho Quick Sort (In-place).
 *
 * THUẬT TOÁN QUICKSORT (In-place):
 * 1. Chọn pivot (ví dụ: phần tử cuối).
 * 2. Partition: Đưa các phần tử nhỏ hơn pivot sang trái, lớn hơn sang phải.
 * 3. Pivot về vị trí đúng (sorted).
 * 4. Đệ quy cho left part và right part.
 */
export function generateQuickSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Quick Sort. Chia để trị (Divide & Conquer).',
        codeSnippet: `// QUICK SORT - O(n log n)
// Ý tưởng: Chọn Pivot, phân chia mảng
function quickSort(arr, low, high) {
    if (low < high) {
        pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    });

    quickSortRecursive(array, 0, n - 1, steps);

    // Final sorted state
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Quick Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH QUICKSORT
// Kết quả: [${array.join(', ')}]
//
// ƯU ĐIỂM:
// - Rất nhanh (O(n log n))
// - In-place (bản cải tiến)
//
// NHƯỢC ĐIỂM:
// - Unstable
// - Worst case O(n²) nếu pivot tệ`,
    });

    return steps;
}

function quickSortRecursive(array: number[], low: number, high: number, steps: SortingStep[]) {
    if (low < high) {
        const pi = partition(array, low, high, steps);

        // Recursive calls
        quickSortRecursive(array, low, pi - 1, steps);
        quickSortRecursive(array, pi + 1, high, steps);
    } else if (low === high) {
        // Single element is sorted
        // We can optionally visualize this
    }
}

function partition(array: number[], low: number, high: number, steps: SortingStep[]): number {
    const pivot = array[high];
    let i = low - 1; // Index of smaller element

    steps.push({
        array: [...array],
        comparing: [high],
        swapping: [],
        sorted: [],
        pivot: high,
        description: `Chọn Pivot: arr[${high}] = ${pivot}`,
        codeSnippet: `// Chọn Pivot là phần tử cuối
pivot = arr[${high}];  // ${pivot}
i = ${low} - 1;  // Index cho phần tử nhỏ hơn`,
    });

    for (let j = low; j < high; j++) {
        steps.push({
            array: [...array],
            comparing: [j, high],
            swapping: [],
            sorted: [],
            pivot: high,
            description: `So sánh arr[${j}]=${array[j]} với Pivot ${pivot}`,
            codeSnippet: `// Duyệt và so sánh với Pivot
if (arr[${j}] < pivot) {
    i++;
    swap(arr[i], arr[j]);
}`,
        });

        if (array[j] < pivot) {
            i++;

            if (i !== j) {
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [i, j],
                    sorted: [],
                    pivot: high,
                    description: `${array[j]} < ${pivot} → Swap vào vùng nhỏ hơn (arr[${i}])`,
                    codeSnippet: `// Swap arr[${i}] và arr[${j}]
[arr[${i}], arr[${j}]] = [arr[${j}], arr[${i}]];`,
                });

                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }

    // Swap pivot to correct position usually (i + 1)
    if (i + 1 !== high) {
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [i + 1, high],
            sorted: [],
            pivot: high,
            description: `Đưa Pivot ${pivot} về vị trí đúng ở giữa (arr[${i + 1}])`,
            codeSnippet: `// Đặt Pivot vào đúng vị trí sau khi phân chia
swap(arr[${i + 1}], arr[${high}]);`,
        });

        [array[i + 1], array[high]] = [array[high], array[i + 1]];
    }

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [i + 1], // Pivot is strictly sorted now
        description: `Pivot ${pivot} đã ở đúng vị trí ${i + 1}.`,
        codeSnippet: `// Phân hoạch hoàn tất tại index ${i + 1}
// Trả về pivot index`,
    });

    return i + 1;
}

// Keep generic implementation (simple recursive array copy version)
export function quickSort(arr: number[]): number[] {
    // 1. Base Case: Điều kiện dừng đệ quy (Mảng rỗng hoặc 1 phần tử)
    if (arr.length <= 1) {
        return arr;
    }

    // 2. Chọn Pivot (chọn phần tử cuối cùng làm chốt)
    // Có thể tối ưu bằng cách chọn Random hoặc Median
    const pivot = arr[arr.length - 1];
    console.log(`Pivot được chọn: ${pivot}`);

    // Mảng chứa các phần tử nhỏ hơn và lớn hơn Pivot
    const leftArr: number[] = [];
    const rightArr: number[] = [];

    // 3. Partitioning: Phân chia các phần tử vào 2 mảng con
    // Duyệt qua tất cả phần tử TRỪ PIVOT (do pivot nằm ở cuối)
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            leftArr.push(arr[i]); // Nhỏ hơn Pivot -> Qua trái
        } else {
            rightArr.push(arr[i]); // Lớn hơn hoặc bằng Pivot -> Qua phải
        }
    }

    console.log(`  Left (< ${pivot}): [${leftArr}]`);
    console.log(`  Right (>= ${pivot}): [${rightArr}]`);

    // 4. Recursion & 5. Combine: Đệ quy sắp xếp 2 mảng con và gộp lại cùng Pivot ở giữa
    // Spread Operator (...) dùng để nối mảng
    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
}
