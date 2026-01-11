/**
 * Tên thuật toán: Merge Sort (Sắp xếp trộn)
 *
 * Mục tiêu: Sắp xếp mảng theo thứ tự tăng dần.
 *
 * Kỹ thuật (Technique): Divide and Conquer (Chia để trị) & Recursion (Đệ quy).
 *
 * Độ phức tạp (Complexity):
 *  - Time Complexity: O(n log n) (Luôn luôn ổn định cho mọi trường hợp).
 *  - Space Complexity: O(n) (Cần mảng phụ để lưu kết quả trộn).
 *
 * Steps Flow (Các bước thực hiện):
 * 1. Divide (Chia): Chia đôi mảng cho đến khi mỗi mảng con chỉ còn 1 phần tử.
 * 2. Conquer (Trị): Đệ quy sắp xếp các mảng con (thực tế là base case trả về mảng 1 phần tử đã sort).
 * 3. Merge (Trộn): Trộn 2 mảng con đã sắp xếp thành 1 mảng lớn hơn cũng sắp xếp.
 *    - So sánh phần tử đầu của 2 mảng con, lấy phần tử nhỏ hơn bỏ vào kết quả.
 */

export function mergeSort(arr: number[]): number[] {
    // Base Case: Mảng 1 phần tử hoặc rỗng coi như đã sort
    if (arr.length <= 1) return arr;

    // 1. Divide: Tìm điểm giữa
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    console.log(`Splitting: [${left}] và [${right}]`);

    // 2. Recursive calls
    return merge(mergeSort(left), mergeSort(right));
}

// Hàm trợ giúp: Trộn 2 mảng đã sort
function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0; // Con trỏ mảng trái
    let j = 0; // Con trỏ mảng phải

    console.log(`Merging: [${left}] + [${right}]`);

    // 3. Merge logic
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Nối nốt các phần tử còn dư (nếu có)
    const merged = result.concat(left.slice(i)).concat(right.slice(j));
    console.log(`  -> Result: [${merged}]`);
    return merged;
}
