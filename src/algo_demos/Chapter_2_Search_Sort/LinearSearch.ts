/**
 * =============================================================================
 * FILE: LinearSearch.ts (Tìm Kiếm Tuyến Tính)
 * =============================================================================
 *
 * MỤC TIÊU:
 * - Tìm vị trí của một giá trị (target) trong mảng.
 * - Không yêu cầu mảng phải được sắp xếp.
 *
 * ĐỘ PHỨC TẠP (COMPLEXITY):
 * - Time Complexity: O(n)
 *   + Best Case: O(1) - Tìm thấy ngay ở phần tử đầu tiên.
 *   + Worst Case: O(n) - Tìm thấy ở cuối hoặc không tìm thấy.
 *   + Average Case: O(n).
 * - Space Complexity: O(1) - Chỉ dùng vài biến tạm.
 *
 * Ý TƯỞNG (ALGORITHM):
 * - Duyệt qua từng phần tử của mảng từ đầu đến cuối.
 * - Tại mỗi bước, so sánh phần tử hiện tại với target.
 * - Nếu khớp -> Trả về index.
 * - Nếu duyệt hết mảng mà không thấy -> Trả về -1.
 */

export function linearSearch(arr: number[], target: number): number {
    console.log(`\n--- BẮT ĐẦU LINEAR SEARCH (Tìm kiếm tuyến tính) ---`);
    console.log(`Target: ${target}`);
    console.log(`Array: [${arr.join(', ')}]`);

    // Bước 1: Duyệt qua từng phần tử của mảng
    for (let i = 0; i < arr.length; i++) {
        // Log chi tiết bước duyệt
        console.log(`Step ${i + 1}: Kiểm tra arr[${i}] = ${arr[i]}`);

        // Bước 2: So sánh phần tử hiện tại với target
        if (arr[i] === target) {
            console.log(`   -> KHỚP! Tìm thấy ${target} tại index ${i}.`);

            // Bước 3: Trả về kết quả nếu tìm thấy
            console.log(`--- KẾT THÚC (FOUND) ---`);
            return i;
        } else {
            console.log(`   -> Không khớp. Tiếp tục...`);
        }
    }

    // Bước 4: Nếu duyệt hết mảng mà không thấy
    console.log(`--- KẾT THÚC (NOT FOUND) - Trả về -1 ---`);
    return -1;
}
