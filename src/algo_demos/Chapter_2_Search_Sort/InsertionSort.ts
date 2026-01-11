/**
 * Tên thuật toán: Insertion Sort (Sắp xếp chèn)
 *
 * Mục tiêu: Sắp xếp mảng theo thứ tự tăng dần.
 *
 * Kỹ thuật (Technique): Incremental Approach (Tiếp cận tăng dần). Tương tự như xếp bài trên tay.
 *
 * Độ phức tạp (Complexity):
 *  - Time Complexity: O(n^2) (Average/Worst), O(n) (Best - nếu đã sort).
 *  - Space Complexity: O(1) (In-place).
 *
 * Steps Flow (Các bước thực hiện):
 * 1. Coi phần tử đầu tiên (index 0) là một mảng con đã sort.
 * 2. Lấy phần tử tiếp theo (Projected Element / Key).
 * 3. So sánh Key với các phần tử trong mảng con đã sort (đi ngược từ phải sang trái).
 * 4. Dịch chuyển (Shift) các phần tử lớn hơn Key sang phải để tạo chỗ trống.
 * 5. Chèn (Insert) Key vào vị trí đúng.
 */

export function insertionSort(arr: number[]): number[] {
    const n = arr.length;
    const result = [...arr];

    console.log("--- Bắt đầu Insertion Sort ---");

    for (let i = 1; i < n; i++) {
        const key = result[i]; // Phần tử cần chèn
        let j = i - 1; // Bắt đầu so sánh với phần từ ngay bên trái

        console.log(`Đang xét key: ${key} tại index ${i}`);

        // Dịch chuyển các phần tử lớn hơn Key sang phải
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j]; // Shift right
            j--;
        }

        // Chèn Key vào chỗ trống
        result[j + 1] = key;
        console.log(`  -> Chèn ${key} vào vị trí ${j + 1}. Mảng hiện tại: [${result}]`);
    }

    return result;
}
