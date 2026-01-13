/**
 * =============================================================================
 * FILE: HeapSort.ts (Sắp Xếp Vun Đống)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp mảng theo thứ tự tăng dần.
 *    - Sử dụng cấu trúc dữ liệu Heap để tối ưu việc tìm phần tử lớn nhất.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Max-Heap (Đống cực đại)**: Một cây nhị phân hoàn chỉnh (Complete Binary Tree) nơi mỗi node cha luôn lớn hơn hoặc bằng các node con.
 *    - **Heapify (Vun đống)**: Quá trình sắp xếp lại các node để đảm bảo tính chất Max-Heap.
 *    - **Extract Max**: Lấy phần tử lớn nhất (ở gốc Heap) ra khỏi Heap và để vào cuối mảng (vị trí đã sort).
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: **Build Max-Heap**: Chuyển mảng input ban đầu thành một Max-Heap hợp lệ.
 *          + Bắt đầu từ node không phải lá (non-leaf) cuối cùng (`n/2 - 1`) lùi về 0.
 *          + Gọi hàm `heapify` cho mỗi node đó.
 *    - B2: **Extraction Phase** (Lặp `n-1` lần):
 *          + Hoán đổi (Swap) phần tử lớn nhất (`arr[0]`) với phần tử cuối cùng của Heap (`arr[i]`).
 *          + "Cắt" phần tử cuối cùng đó ra khỏi Heap (coi như đã sort).
 *          + Gọi `heapify` cho Root (`arr[0]`) để khôi phục tính chất Max-Heap cho phần còn lại.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**: O(n log n)
 *      + Bước Build Heap: O(n).
 *      + Bước Extract Max: n lần, mỗi lần Heapify tốn O(log n) -> Total O(n log n).
 *      + Ổn định tốt trong mọi trường hợp (Best/Avg/Worst đều là O(n log n)).
 *    - **Space Complexity**: O(1)
 *      + In-place sorting (Sắp xếp tại chỗ).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Hiệu năng tốt và ổn định (không bị O(n^2) như Quick Sort).
 *      + Không tốn bộ nhớ phụ (O(1) space) như Merge Sort.
 *    - **Nhược điểm**:
 *      + Unstable Sort (Không ổn định).
 *      + Chậm hơn Quick Sort trong thực tế vì hằng số lớn và kém thân thiện với Cache (do truy cập chỉ số nhảy cóc `2*i`).
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Merge Sort**: Heap Sort tiết kiệm RAM hơn (O(1) vs O(n)) nhưng Merge Sort nhanh hơn và stable.
 *    - So với **Quick Sort**: Heap Sort an toàn hơn (không có Worst Case O(n^2)) nhưng thường chậm hơn trung bình.
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
