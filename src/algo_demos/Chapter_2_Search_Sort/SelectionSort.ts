/**
 * =============================================================================
 * FILE: SelectionSort.ts (Sắp Xếp Chọn)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp mảng theo thứ tự tăng dần.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Greedy Approach (Chiến thuật Tham lam)**: Ở mỗi bước, luôn chọn phần tử nhỏ nhất (tốt nhất) chưa được sắp xếp và đưa nó về đúng vị trí.
 *    - **In-place Sorting**: Sắp xếp trực tiếp trên mảng đầu vào mà không cần thêm bộ nhớ đáng kể.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: Chia mảng thành 2 phần ảo: Sorted (bên trái, ban đầu rỗng) và Unsorted (bên phải, ban đầu là cả mảng).
 *    - B2: Lặp `i` từ 0 đến `n - 2` (phần tử cuối cùng sẽ tự động đúng nếu `n-1` phần tử trước đúng).
 *    - B3: Tìm **Minimum Value (Min)** trong phần Unsorted (từ `i` đến `n-1`).
 *    - B4: Hoán đổi (Swap) phần tử `Min` tìm được với phần tử đầu tiên của phần Unsorted (`arr[i]`).
 *    - B5: Tăng kích thước phần Sorted lên 1 đơn vị. Lặp lại cho đến hết.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**: O(n^2)
 *      + Luôn luôn là O(n^2) bất kể mảng ban đầu thế nào, vì luôn phải quét hết phần còn lại để tìm min.
 *    - **Space Complexity**: O(1) (In-place).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Số lần Swap ít nhất trong các thuật toán O(n^2) (tối đa n lần swap). Tốt khi việc ghi bộ nhớ (write) tốn kém.
 *      + Dễ cài đặt.
 *    - **Nhược điểm**:
 *      + Chậm. Không tận dụng được mảng đã sắp xếp một phần (Adaptive).
 *      + Unstable Sort (Không ổn định - có thể làm đổi chỗ các phần tử bằng nhau).
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Bubble Sort**: Nhanh hơn một chút trong thực tế vì ít swap hơn.
 *    - So với **Insertion Sort**: Chậm hơn nếu mảng đã gần như được sorted.
 */

export function selectionSort(arr: number[]): number[] {
    const n = arr.length;
    // Copy array để giữ tính Pure Function
    const result = [...arr];

    console.log("--- Bắt đầu Selection Sort ---");

    // Vòng lặp chính: Duyệt qua từng vị trí i cần được điền giá trị đúng (Min)
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i; // Giả sử phần tử đầu tiên của đoạn chưa sort là nhỏ nhất

        // Vòng lặp con: Tìm Min thực sự trong đoạn [i+1 ... n]
        for (let j = i + 1; j < n; j++) {
            if (result[j] < result[minIndex]) {
                minIndex = j; // Cập nhật index của Min mới nếu tìm thấy số nhỏ hơn
            }
        }

        // Sau khi quét hết, nếu Min không nằm ở vị trí i ban đầu thì Swap
        // (Nếu minIndex == i tức là phần tử đó đã đúng vị trí, không cần swap)
        if (minIndex !== i) {
            console.log(`Swap vị trí ${i} (Giá trị: ${result[i]}) với vị trí Min ${minIndex} (Giá trị: ${result[minIndex]})`);
            // Kỹ thuật Swap dùng Destructuring
            [result[i], result[minIndex]] = [result[minIndex], result[i]];
        }
    }

    return result;
}
