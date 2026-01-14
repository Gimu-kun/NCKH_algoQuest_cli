/**
 * =============================================================================
 * FILE: BubbleSort.ts (Sắp Xếp Nổi Bọt)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp các phần tử trong mảng theo thứ tự tăng dần.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Comparison-based Sorting**: Sắp xếp dựa trên việc so sánh hai phần tử.
 *    - **Swapping (Hoán vị)**: Đổi chỗ hai phần tử nếu chúng sai thứ tự.
 *    - **Bubble Up**: Phần tử lớn nhất sẽ "nổi" (di chuyển) dần về cuối mảng sau mỗi vòng lặp lớn.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: Duyệt mảng `n - 1` lần (vòng lặp ngoài).
 *    - B2: Trong mỗi lần duyệt (vòng lặp trong), so sánh từng cặp phần tử liền kề `(j, j+1)`.
 *    - B3: Nếu `arr[j] > arr[j+1]` (sai thứ tự) -> Swap (Hoán đổi) chúng.
 *    - B4: Nếu sau một vòng lặp trong mà KHÔNG có lần swap nào -> Mảng đã sắp xếp -> Dừng sớm (Optimized Flag).
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**:
 *      + Average/Worst Case: O(n^2) - Hai vòng lặp lồng nhau.
 *      + Best Case: O(n) - Nếu mảng đã sắp xếp sẵn (nhờ cờ `swapped`).
 *    - **Space Complexity**: O(1)
 *      + In-place sorting (Sắp xếp tại chỗ), không tạo mảng phụ đáng kể.
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Rất dễ hiểu và cài đặt.
 *      + Phát hiện được mảng đã sắp xếp rất nhanh (Best case O(n)).
 *    - **Nhược điểm**:
 *      + Hiệu năng rất kém (O(n^2)), không dùng cho dữ liệu thực tế lớn.
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **QuickSort/MergeSort**: Bubble Sort chậm hơn rất nhiều (O(n^2) vs O(n log n)).
 *    - Thường chỉ dùng trong giáo dục để minh họa thuật toán.
 */

export function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    console.log("--- Bắt đầu Bubble Sort ---");

    // Copy array để giữ tính Pure Function (không biến đổi (mutate) mảng gốc của user)
    // Kỹ thuật: Shallow Copy
    const result = [...arr];

    // Vòng lặp ngoài: Số lần duyệt cần thiết để đảm bảo mảng được sắp xếp
    for (let i = 0; i < n - 1; i++) {
        let swapped = false; // Flag (Cờ hiệu) để tối ưu hóa (Optimization)

        console.log(`\nIteration (Vòng lặp thứ) ${i + 1}:`);

        // Vòng lặp trong: So sánh các cặp liền kề
        // Chỉ chạy đến `n - i - 1` vì `i` phần tử cuối cùng đã được sắp đặt đúng vị trí (đã "nổi" lên).
        for (let j = 0; j < n - i - 1; j++) {
            // So sánh phần tử trước và sau
            if (result[j] > result[j + 1]) {
                // Nếu phần tử trước lớn hơn -> Sai thứ tự -> Hoán đổi (Swap)
                console.log(`  Swap (Đổi chỗ) ${result[j]} và ${result[j + 1]}`);

                // Kỹ thuật: Destructuring assignment để swap trong JS
                [result[j], result[j + 1]] = [result[j + 1], result[j]];

                swapped = true; // Đánh dấu là có sự thay đổi
            }
        }

        // Nếu qua hết một lượt (vòng lặp trong) mà không cần swap lần nào
        // -> Có nghĩa là mọi cặp liền kề đều đúng thứ tự -> Mảng đã sorted xong.
        if (!swapped) {
            console.log("  -> Không có swap nào xảy ra. Mảng đã được sắp xếp hoàn tất.");
            break; // Break sớm để tiết kiệm thời gian
        }
    }

    return result;
}
