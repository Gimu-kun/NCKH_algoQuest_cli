/**
 * Tên thuật toán: Linear Search (Tìm kiếm tuyến tính)
 *
 * Mục tiêu: Tìm vị trí của phần tử trong mảng (không cần sắp xếp).
 *
 * Kỹ thuật (Technique): Iteration (Duyệt tuần tự).
 *
 * Độ phức tạp (Complexity):
 *  - Time Complexity: O(n) (Phải duyệt qua từng phần tử).
 *  - Space Complexity: O(1).
 *
 * Steps Flow (Các bước thực hiện):
 * 1. Bắt đầu từ phần tử đầu tiên (index 0).
 * 2. So sánh phần tử hiện tại với target.
 * 3. Nếu khớp -> Trả về index.
 * 4. Nếu không -> Chuyển sang phần tử kế tiếp.
 * 5. Nếu hết mảng mà không thấy -> Trả về -1.
 */

export function linearSearch(arr: number[], target: number): number {
    console.log(`--- Bắt đầu Linear Search cho target: ${target} ---`);

    for (let i = 0; i < arr.length; i++) {
        console.log(`Checking index ${i}: Value ${arr[i]}`);
        if (arr[i] === target) {
            console.log("-> Found!");
            return i;
        }
    }

    console.log("-> Not found.");
    return -1;
}
