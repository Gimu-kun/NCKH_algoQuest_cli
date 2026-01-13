/**
 * =============================================================================
 * FILE: BinarySearch.ts (Tìm Kiếm Nhị Phân)
 * =============================================================================
 *
 * MỤC TIÊU:
 * - Tìm vị trí của target trong mảng ĐÃ SẮP XẾP (Sorted Array).
 *
 * KỸ THUẬT:
 * - Divide and Conquer (Chia để trị).
 * - Thu hẹp phạm vi tìm kiếm (Search Space) đi một nửa sau mỗi bước.
 *
 * ĐỘ PHỨC TẠP (COMPLEXITY):
 * - Time Complexity: O(log n) - Cực kỳ nhanh với dữ liệu lớn.
 *   + Ví dụ: Tìm trong 1 triệu phần tử chỉ mất tối đa ~20 bước.
 * - Space Complexity: O(1) - Dùng vòng lặp (Iterative).
 *
 * Ý TƯỞNG (ALGORITHM):
 * 1. Khởi tạo 2 con trỏ: left (đầu), right (cuối).
 * 2. Trong khi left <= right:
 *    - Tính mid = (left + right) / 2.
 *    - So sánh arr[mid] với target.
 *    - Nếu bằng -> Tìm thấy -> Return mid.
 *    - Nếu arr[mid] < target -> Target nằm bên phải -> left = mid + 1.
 *    - Nếu arr[mid] > target -> Target nằm bên trái -> right = mid - 1.
 * 3. Nếu kết thúc vòng lặp mà chưa thấy -> Return -1.
 */

export function binarySearch(arr: number[], target: number): number {
    console.log(`\n--- BẮT ĐẦU BINARY SEARCH (Tìm kiếm nhị phân) ---`);
    console.log(`Target: ${target}`);
    console.log(`Search Space ban đầu: [0, ${arr.length - 1}]`);

    let left = 0;
    let right = arr.length - 1;
    let step = 0;

    // Bước 1: Vòng lặp chính, điều kiện là không gian tìm kiếm hợp lệ
    while (left <= right) {
        step++;

        // Bước 2: Tính chỉ số giữa (mid)
        // Dùng công thức left + (right - left) / 2 để tránh tràn số (overflow)
        const mid = Math.floor(left + (right - left) / 2);
        const midValue = arr[mid];

        console.log(`\n[Bước ${step}]`);
        console.log(`   Range: [${left}...${right}], Mid index: ${mid}, Mid value: ${midValue}`);

        // Bước 3: So sánh midValue với target
        if (midValue === target) {
            console.log(`   -> FOUND! Giá trị tại mid bằng target.`);
            console.log(`--- KẾT THÚC (Tìm thấy tại index ${mid}) ---`);
            return mid;
        }

        if (midValue < target) {
            // Case: Target lớn hơn Mid -> Tìm bên phải
            console.log(`   -> ${midValue} < ${target}: Target nằm bên PHẢI.`);
            console.log(`   -> Cập nhật Left: ${mid} + 1 = ${mid + 1}`);
            left = mid + 1;
        } else {
            // Case: Target nhỏ hơn Mid -> Tìm bên trái
            console.log(`   -> ${midValue} > ${target}: Target nằm bên TRÁI.`);
            console.log(`   -> Cập nhật Right: ${mid} - 1 = ${mid - 1}`);
            right = mid - 1;
        }
    }

    // Bước 4: Không tìm thấy
    console.log(`\n--- KẾT THÚC (Không tìm thấy - Trả về -1) ---`);
    return -1;
}
