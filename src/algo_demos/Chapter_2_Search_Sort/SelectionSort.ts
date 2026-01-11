/**
 * Tên thuật toán: Selection Sort (Sắp xếp chọn)
 *
 * Mục tiêu: Sắp xếp mảng theo thứ tự tăng dần.
 *
 * Kỹ thuật (Technique): Greedy (Tham lam) - Luôn chọn cái tốt nhất (nhỏ nhất) ở mỗi bước.
 *
 * Độ phức tạp (Complexity):
 *  - Time Complexity: O(n^2) (Luôn luôn, vì phải duyệt hết để tìm Min).
 *  - Space Complexity: O(1) (In-place).
 *
 * Steps Flow (Các bước thực hiện):
 * 1. Chia mảng làm 2 phần: Sorted (bên trái) và Unsorted (bên phải). Ban đầu sorted rỗng.
 * 2. Tìm phần tử nhỏ nhất (Min) trong phần Unsorted.
 * 3. Hoán đổi (Swap) phần tử Min đó với phần tử đầu tiên của phần Unsorted.
 * 4. Mở rộng phần Sorted sang phải 1 bước. Lặp lại.
 */

export function selectionSort(arr: number[]): number[] {
    const n = arr.length;
    const result = [...arr];

    console.log("--- Bắt đầu Selection Sort ---");

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i; // Giả sử phần tử đầu của đoạn chưa sort là nhỏ nhất

        // Tìm Min thực sự trong đoạn [i+1 ... n]
        for (let j = i + 1; j < n; j++) {
            if (result[j] < result[minIndex]) {
                minIndex = j; // Update index của Min mới
            }
        }

        // Nếu Min không nằm ở vị trí i ban đầu thì Swap
        if (minIndex !== i) {
            console.log(`Swap vị trí ${i} (${result[i]}) với vị trí ${minIndex} (${result[minIndex]})`);
            [result[i], result[minIndex]] = [result[minIndex], result[i]];
        }
    }

    return result;
}
