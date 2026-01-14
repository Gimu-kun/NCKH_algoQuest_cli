/**
 * =============================================================================
 * FILE: InsertionSort.ts (Sắp Xếp Chèn)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp mảng theo thứ tự tăng dần bằng cách xây dựng dần mảng con đã sắp xếp.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Incremental Approach (Tiếp cận tăng dần)**: Lấy từng phần tử và chèn nó vào đúng vị trí trong phần đã sắp xếp trước đó.
 *    - **Online Algorithm**: Có thể sắp xếp dữ liệu ngay khi nhận được nó (stream), không cần có toàn bộ dữ liệu ngay từ đầu.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: Coi phần tử đầu tiên `arr[0]` là mảng đã được sắp xếp.
 *    - B2: Bắt đầu vòng lặp từ phần tử thứ 2 (`i = 1`) đến hết mảng. Gọi phần tử này là `key`.
 *    - B3: So sánh `key` với các phần tử trong mảng đã sắp xếp (`arr[0...i-1]`), đi ngược từ `j = i - 1` về 0.
 *    - B4: Nếu `arr[j] > key` -> Dịch chuyển `arr[j]` sang phải (`arr[j+1] = arr[j]`) để tạo chỗ trống.
 *    - B5: Lặp lại B4 cho đến khi gặp phần tử nhỏ hơn `key` hoặc về đầu mảng.
 *    - B6: Chèn `key` vào vị trí trống tìm được (`arr[j+1] = key`).
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**:
 *      + Best Case: O(n) - Khi mảng đã sắp xếp (chỉ cần so sánh 1 lần mỗi bước).
 *      + Average/Worst Case: O(n^2) - Khi mảng ngược chiều hoàn toàn.
 *    - **Space Complexity**: O(1) (In-place).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Cực kỳ nhanh với dữ liệu nhỏ hoặc "Nearly Sorted" (Gần như đã sắp xếp).
 *      + Stable Sort (Ổn định - giữ nguyên thứ tự tương đối của các phần tử bằng nhau).
 *      + Đơn giản, tự nhiên (giống xếp bài).
 *    - **Nhược điểm**:
 *      + Chậm (O(n^2)) với dữ liệu lớn và ngẫu nhiên.
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Bubble/Selection**: Insertion Sort thường nhanh hơn trong thực tế, đặc biệt là với mảng "Nearly Sorted".
 *    - Là nền tảng cho **Shell Sort** và được dùng trong **TimSort** (thuật toán sort mặc định của Python/Java) cho các mảng con nhỏ.
 */

export function insertionSort(arr: number[]): number[] {
    const n = arr.length;
    // Copy array để đảm bảo tính bất biến (Immutability) cho input
    const result = [...arr];

    console.log("--- Bắt đầu Insertion Sort ---");

    // Vòng lặp chính: Duyệt từ phần tử thứ 2
    for (let i = 1; i < n; i++) {
        const key = result[i]; // Giá trị cần chèn (Key)
        let j = i - 1; // Index của phần tử cuối cùng trong mảng con đã sort

        console.log(`Đang xét key: ${key} tại index ${i}`);

        // Vòng lặp con: Dịch chuyển (Shift) các phần tử lớn hơn Key sang phải
        // Điều kiện: j >= 0 (chưa về đầu mảng) VÀ result[j] > key (sai thứ tự)
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j]; // Dời chỗ sang phải 1 bước
            j--; // Tiếp tục lùi về bên trái
        }

        // Sau khi tìm được vị trí (hoặc j = -1), chèn Key vào
        result[j + 1] = key;
        console.log(`  -> Chèn ${key} vào vị trí ${j + 1}. Mảng hiện tại: [${result}]`);
    }

    return result;
}
