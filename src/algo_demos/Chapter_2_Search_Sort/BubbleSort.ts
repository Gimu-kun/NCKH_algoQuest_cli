/**
 * Tên thuật toán: Bubble Sort (Sắp xếp nổi bọt)
 *
 * Mục tiêu: Sắp xếp mảng theo thứ tự tăng dần.
 *
 * Kỹ thuật (Technique): Comparison-based Sorting (Sắp xếp dựa trên so sánh) & Swapping (Hoán đổi).
 *
 * Độ phức tạp (Complexity):
 *  - Time Complexity: O(n^2) (Trung bình/Xấu nhất), O(n) (Tốt nhất - nếu mảng đã sort).
 *  - Space Complexity: O(1) (In-place).
 *
 * Steps Flow (Các bước thực hiện):
 * 1. Duyệt qua mảng nhiều lần.
 * 2. Trong mỗi lần duyệt, so sánh các cặp phần tử liền kề.
 * 3. Nếu phần tử đứng trước > phần tử đứng sau -> Hoán đổi (Swap).
 * 4. Sau mỗi vòng lặp lớn, phần tử lớn nhất sẽ "nổi" về cuối mảng.
 */

export function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    console.log("--- Bắt đầu Bubble Sort ---");

    // Copy array để giữ tính Pure Function (không đổi mảng gốc)
    const result = [...arr];

    for (let i = 0; i < n - 1; i++) {
        let swapped = false; // Cờ hiệu để tối ưu (Optimization)

        console.log(`\nIterration ${i + 1}:`);

        // Vòng lặp so sánh các cặp liền kề
        // Chỉ chạy đến `n - i - 1` vì `i` phần tử cuối cùng đã đúng vị trí
        for (let j = 0; j < n - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                // Hoán đổi (Swap)
                console.log(`  Swap ${result[j]} và ${result[j + 1]}`);
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }

        // Nếu không có swap nào xảy ra -> Mảng đã sắp xếp -> Dừng sớm
        if (!swapped) {
            console.log("  -> Không có swap nào. Mảng đã sắp xếp.");
            break;
        }
    }

    return result;
}
