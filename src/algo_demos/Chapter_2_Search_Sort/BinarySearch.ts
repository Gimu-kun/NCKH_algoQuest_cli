/**
 * Tên thuật toán: Binary Search (Tìm kiếm nhị phân)
 *
 * Mục tiêu: Tìm kiếm vị trí của một phần tử (target) trong một mảng đã được sắp xếp (sorted array).
 *
 * Kỹ thuật (Technique): Divide and Conquer (Chia để trị) / Two Pointers.
 *
 * Độ phức tạp (Complexity):
 *  - Time Complexity (Độ phức tạp thời gian): O(log n) - Do Search Space (không gian tìm kiếm) giảm đi một nửa sau mỗi bước iteration.
 *  - Space Complexity (Độ phức tạp không gian): O(1) - Sử dụng Iterative approach (vòng lặp) thay vì Recursive (đệ quy) để tối ưu Stack memory.
 *
 * Steps Flow (Các bước thực hiện):
 * 1. Initialization (Khởi tạo):
 *    - Đặt con trỏ `left` ở chỉ số đầu tiên (0).
 *    - Đặt con trỏ `right` ở chỉ số cuối cùng (n - 1).
 * 
 * 2. Iteration (Vòng lặp):
 *    - Điều kiện lặp: Trong khi `left` <= `right`.
 *    - Bước 2a: Tính chỉ số trung tâm `mid`.
 *      - Công thức: `mid = left + floor((right - left) / 2)` (Tránh Integer Overflow so với `(left + right) / 2`).
 *    - Bước 2b: So sánh `arr[mid]` với `target`.
 *      - Case 1: `arr[mid] === target` -> Match found (Tìm thấy), trả về `mid`.
 *      - Case 2: `arr[mid] < target` -> Target nằm ở nửa bên phải (Right Subarray). Cập nhật `left = mid + 1` (Discard Left Half).
 *      - Case 3: `arr[mid] > target` -> Target nằm ở nửa bên trái (Left Subarray). Cập nhật `right = mid - 1` (Discard Right Half).
 * 
 * 3. Termination (Kết thúc):
 *    - Nếu vòng lặp kết thúc mà chưa return -> Target not found (Không tìm thấy), trả về -1.
 */

export function binarySearch(arr: number[], target: number): number {
    // `left` pointer đại diện cho giới hạn dưới (lower bound) của không gian tìm kiếm
    let left = 0;

    // `right` pointer đại diện cho giới hạn trên (upper bound) của không gian tìm kiếm
    let right = arr.length - 1;

    console.log(`Bắt đầu Binary Search cho target: ${target}`);

    while (left <= right) {
        // Tính toán Middle Index.
        // Sử dụng Binary Operator (hoặc Math.floor) để đảm bảo kết quả là integer.
        // Kỹ thuật: `left + (right - left) / 2` an toàn hơn `(left + right) / 2` với các ngôn ngữ typed chặt overflow, 
        // ở JS JS số là 64-bit float nên ít rủi ro hơn nhưng vẫn là best practice.
        const mid = Math.floor(left + (right - left) / 2);
        const midValue = arr[mid];

        console.log(`Checking range [${left}, ${right}]: Mid index ${mid} = ${midValue}`);

        if (midValue === target) {
            // Case: Found Element
            console.log("-> Found target!");
            return mid;
        }

        if (midValue < target) {
            // Case: Target is on the Right side
            // Giá trị giữa nhỏ hơn Target -> Bỏ qua nửa bên phải (từ left đến mid)
            // Shift Left Pointer sang phải
            console.log("-> Target > Mid. Search Right half.");
            left = mid + 1;
        } else {
            // Case: Target is on the Left side
            // Giá trị giữa lớn hơn Target -> Bỏ qua nửa bên trái (từ mid đến right)
            // Shift Right Pointer sang trái
            console.log("-> Target < Mid. Search Left half.");
            right = mid - 1;
        }
    }

    // End of Loop without return -> Element not exists
    console.log("-> Target not found.");
    return -1;
}

// Example Usage (Ví dụ sử dụng)
// const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
// const target = 7;
// const index = binarySearch(sortedArray, target);
