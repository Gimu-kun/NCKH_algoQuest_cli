/**
 * Tên thuật toán: Quick Sort (Sắp xếp nhanh)
 *
 * Mục tiêu: Sắp xếp mảng theo thứ tự tăng dần.
 *
 * Kỹ thuật (Technique): Divide and Conquer (Chia để trị) & Recursion (Đệ quy).
 *
 * Độ phức tạp (Complexity):
 *  - Time Complexity: O(n log n) (Trung bình), O(n^2) (Xấu nhất - hiếm gặp khi chọn Pivot tốt).
 *  - Space Complexity: O(log n) (Bộ nhớ Stack cho đệ quy).
 *
 * Steps Flow (Các bước thực hiện):
 * 1. Base Case: Nếu mảng có < 2 phần tử -> Return mảng đó (đã sort).
 * 2. Chọn Pivot: Chọn 1 phần tử làm "chốt" (ví dụ: phần tử cuối).
 * 3. Partition (Phân hoạch):
 *    - Tạo mảng `left`: Chứa các số < Pivot.
 *    - Tạo mảng `right`: Chứa các số >= Pivot.
 * 4. Recursion: Gọi đệ quy Quick Sort cho `left` và `right`.
 * 5. Combine: Kết hợp `[...sortedLeft, pivot, ...sortedRight]`.
 */

export function quickSort(arr: number[]): number[] {
    // 1. Base Case: Điều kiện dừng đệ quy
    if (arr.length <= 1) {
        return arr;
    }

    // 2. Chọn Pivot (ở đây chọn phần tử cuối cùng)
    const pivot = arr[arr.length - 1];
    console.log(`Pivot được chọn: ${pivot}`);

    const leftArr: number[] = [];  // Chứa phần tử nhỏ hơn Pivot
    const rightArr: number[] = []; // Chứa phần tử lớn hơn hoặc bằng Pivot

    // 3. Partitioning: Chia mảng thành 2 phần
    // Duyệt đến length - 1 (trừ pivot ra)
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }

    console.log(`  Left (< ${pivot}): [${leftArr}]`);
    console.log(`  Right (>= ${pivot}): [${rightArr}]`);

    // 4. Recursion & 5. Combine
    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
}
