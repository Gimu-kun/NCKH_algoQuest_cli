/**
 * =============================================================================
 * FILE: HeapSort.ts
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Cài đặt thuật toán Heap Sort (Sắp xếp vun đống).
 * - Sử dụng cấu trúc Max-Heap để sắp xếp mảng tăng dần.
 *
 * THUẬT TOÁN HEAP SORT (Algorithm):
 *
 * KHÁI NIỆM HEAP:
 * - Heap là Complete Binary Tree thỏa mãn Heap Property.
 * - Max-Heap: Mỗi parent >= tất cả children của nó.
 * - Min-Heap: Mỗi parent <= tất cả children của nó.
 *
 * CÁC BƯỚC THỰC HIỆN:
 * 1. BUILD MAX-HEAP: Biến mảng input thành Max-Heap.
 *    - Bắt đầu từ non-leaf node cuối cùng (index = n/2 - 1).
 *    - Heapify từ dưới lên để đảm bảo mỗi subtree là valid heap.
 *
 * 2. EXTRACT MAX LIÊN TỤC:
 *    - Swap root (max element) với phần tử cuối của heap.
 *    - Giảm heap size đi 1 (phần tử cuối đã sorted).
 *    - Heapify root để duy trì Max-Heap property.
 *    - Lặp lại cho đến khi heap size = 1.
 *
 * HEAPIFY (Vun đống):
 * - Đảm bảo subtree có root tại index i thỏa mãn Max-Heap property.
 * - So sánh node với 2 children, swap với child lớn nhất nếu cần.
 * - Đệ quy heapify subtree bị ảnh hưởng.
 *
 * ARRAY REPRESENTATION:
 * - Parent(i) = floor((i - 1) / 2)
 * - Left Child(i) = 2 * i + 1
 * - Right Child(i) = 2 * i + 2
 *
 * ĐỘ PHỨC TẠP (Complexity):
 * - Time: O(n log n) cho TẤT CẢ cases (best, average, worst).
 * - Space: O(1) - In-place algorithm.
 *
 * SO SÁNH VỚI CÁC THUẬT TOÁN KHÁC:
 * ┌──────────────┬────────────────┬────────────────┬─────────┬────────┐
 * │ Algorithm    │ Time (avg)     │ Time (worst)   │ Space   │ Stable │
 * ├──────────────┼────────────────┼────────────────┼─────────┼────────┤
 * │ Heap Sort    │ O(n log n)     │ O(n log n)     │ O(1)    │ No     │
 * │ Quick Sort   │ O(n log n)     │ O(n²)          │ O(log n)│ No     │
 * │ Merge Sort   │ O(n log n)     │ O(n log n)     │ O(n)    │ Yes    │
 * └──────────────┴────────────────┴────────────────┴─────────┴────────┘
 *
 * ƯU ĐIỂM:
 * - O(n log n) trong MỌI trường hợp - không có worst case O(n²).
 * - In-place: chỉ cần O(1) bộ nhớ phụ.
 * - Không cần recursion stack như Quick Sort.
 *
 * NHƯỢC ĐIỂM:
 * - Unstable sort: không bảo toàn thứ tự tương đối của phần tử bằng nhau.
 * - Cache-unfriendly: truy cập bộ nhớ không liên tục (parent-child xa nhau).
 * - Hằng số lớn hơn Quick Sort, thường chậm hơn trong practice.
 *
 * ỨNG DỤNG THỰC TẾ:
 * 1. Priority Queue implementation.
 * 2. Selection problem (tìm k phần tử lớn/nhỏ nhất).
 * 3. Embedded systems với bộ nhớ hạn chế.
 * 4. Systems yêu cầu worst-case guarantees.
 *
 * =============================================================================
 */

/**
 * heapify - Duy trì tính chất Max-Heap cho subtree có root tại index i.
 *
 * @param arr - Mảng cần heapify
 * @param heapSize - Kích thước heap hiện tại (không phải toàn bộ mảng)
 * @param i - Index của root cần heapify
 */
function heapify(arr: number[], heapSize: number, i: number): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // So sánh với left child
    if (left < heapSize && arr[left] > arr[largest]) {
        largest = left;
    }

    // So sánh với right child
    if (right < heapSize && arr[right] > arr[largest]) {
        largest = right;
    }

    // Nếu largest không phải root
    if (largest !== i) {
        // Swap
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        // Đệ quy heapify subtree bị ảnh hưởng
        heapify(arr, heapSize, largest);
    }
}

/**
 * heapSort - Sắp xếp mảng sử dụng thuật toán Heap Sort.
 *
 * @param arr - Mảng cần sắp xếp (sẽ được modify in-place)
 * @returns Mảng đã được sắp xếp
 *
 * @example
 * const arr = [64, 25, 12, 22, 11, 90];
 * heapSort(arr);
 * console.log(arr); // [11, 12, 22, 25, 64, 90]
 */
export function heapSort(arr: number[]): number[] {
    const n = arr.length;

    // Phase 1: Build Max-Heap
    // Bắt đầu từ non-leaf node cuối cùng: index = n/2 - 1
    // Heapify từ dưới lên
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Phase 2: Extract max liên tục
    // Swap root (max) với cuối, giảm heap size, heapify root
    for (let i = n - 1; i > 0; i--) {
        // Swap root với phần tử cuối của heap
        [arr[0], arr[i]] = [arr[i], arr[0]];

        // Heapify root với heap size giảm
        heapify(arr, i, 0);
    }

    return arr;
}

export default heapSort;
