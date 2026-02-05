/**
 * FILE: ComplexityAnalysis.ts
 * CHƯƠNG 1: TỔNG QUAN VỀ THUẬT TOÁN VÀ CẤU TRÚC DỮ LIỆU
 * 
 * MỤC TIÊU: Minh họa khái niệm về Độ phức tạp thuật toán (Time & Space Complexity) và Big O Notation.
 */

// ============================================================================
// 1. O(1) - Constant Time (Độ phức tạp hằng số)
// ============================================================================

/**
 * Truy cập phần tử đầu tiên của mảng
 * 
 * PHÂN TÍCH:
 * - Số phép tính: 1 (chỉ truy cập index 0)
 * - Không phụ thuộc kích thước mảng
 * - T(n) = c = O(1) với mọi n
 * 
 * SO SÁNH:
 * ✅ O(1): Truy cập trực tiếp bằng index
 * ❌ O(n): Phải duyệt từ đầu nếu dùng Linked List
 */
export function getFirst<T>(arr: T[]): T | undefined {
    console.log("--- O(1) Example: getFirst ---");
    return arr[0]; // O(1) - Một phép tính duy nhất
}

/**
 * Kiểm tra số chẵn hay lẻ
 * 
 * PHÂN TÍCH:
 * - Chỉ 1 phép modulo và 1 phép so sánh
 * - Không quan tâm n lớn hay nhỏ
 * - T(n) = 2 = O(1)
 */
export function isEven(n: number): boolean {
    console.log("--- O(1) Example: isEven ---");
    return n % 2 === 0; // O(1)
}

// ============================================================================
// 2. O(log n) - Logarithmic Time (Độ phức tạp logarit)
// ============================================================================

/**
 * Binary Search - Tìm kiếm nhị phân
 * 
 * THUẬT TOÁN:
 * 1. So sánh target với phần tử giữa
 * 2. Nếu bằng → tìm thấy
 * 3. Nếu nhỏ hơn → tìm nửa trái
 * 4. Nếu lớn hơn → tìm nửa phải
 * 5. Lặp lại cho đến khi tìm thấy hoặc hết phạm vi
 * 
 * PHÂN TÍCH:
 * - Mỗi bước: chia đôi phạm vi tìm kiếm
 * - Số bước tối đa: log₂(n)
 * - Ví dụ: n = 1,000,000 → chỉ cần ~20 bước!
 * 
 * ĐIỀU KIỆN:
 * ⚠️ Mảng PHẢI được sắp xếp trước!
 */
export function binarySearch(arr: number[], target: number): number {
    console.log("--- O(log n) Example: binarySearch ---");
    let left = 0;                    // O(1)
    let right = arr.length - 1;      // O(1)

    // Vòng lặp chạy log₂(n) lần
    while (left <= right) {          // O(log n) iterations
        const mid = Math.floor((left + right) / 2);  // O(1)

        if (arr[mid] === target) {
            return mid;              // Tìm thấy!
        } else if (arr[mid] < target) {
            left = mid + 1;          // Tìm nửa phải
        } else {
            right = mid - 1;         // Tìm nửa trái
        }
    }

    return -1; // Không tìm thấy
}

// ============================================================================
// 3. O(n) - Linear Time (Độ phức tạp tuyến tính)
// ============================================================================

/**
 * Tìm giá trị lớn nhất trong mảng
 * 
 * THUẬT TOÁN:
 * 1. Giả sử phần tử đầu là max
 * 2. Duyệt qua từng phần tử
 * 3. Nếu phần tử hiện tại > max → cập nhật max
 * 4. Trả về max
 * 
 * PHÂN TÍCH:
 * - Số phép so sánh: n-1
 * - Phải xem TẤT CẢ phần tử (không thể bỏ qua)
 * - T(n) = n - 1 = O(n)
 */
export function findMax(arr: number[]): number {
    console.log("--- O(n) Example: findMax ---");
    if (arr.length === 0) {
        throw new Error('Mảng rỗng!');
    }

    let max = arr[0];  // O(1)

    // Duyệt n-1 phần tử còn lại
    for (let i = 1; i < arr.length; i++) {  // O(n)
        if (arr[i] > max) {  // O(1)
            max = arr[i];
        }
    }

    return max;
}

/**
 * Linear Search - Tìm kiếm tuần tự
 * 
 * SO SÁNH VỚI BINARY SEARCH:
 * ✅ Ưu điểm: Không cần mảng sắp xếp
 * ❌ Nhược điểm: Chậm hơn nhiều với dữ liệu lớn
 */
export function linearSearch(arr: number[], target: number): number {
    console.log("--- O(n) Example: linearSearch ---");
    for (let i = 0; i < arr.length; i++) {  // O(n)
        if (arr[i] === target) {
            return i;  // Best case: O(1) nếu ở đầu
        }
    }
    return -1;  // Worst case: O(n) nếu không có
}

// ============================================================================
// 4. O(n²) - Quadratic Time (Độ phức tạp bậc hai)
// ============================================================================

/**
 * Bubble Sort - Sắp xếp nổi bọt
 * 
 * THUẬT TOÁN:
 * 1. So sánh từng cặp phần tử liền kề
 * 2. Nếu sai thứ tự → đổi chỗ (swap)
 * 3. Phần tử lớn nhất "nổi" lên cuối
 * 4. Lặp lại n-1 lần
 * 
 * PHÂN TÍCH:
 * - Vòng ngoài: n-1 lần
 * - Vòng trong: trung bình n/2 lần
 * - Tổng: (n-1) × (n/2) ≈ n²/2 = O(n²)
 */
export function bubbleSort(arr: number[]): number[] {
    console.log("--- O(n²) Example: bubbleSort ---");
    const n = arr.length;

    // Vòng ngoài: n-1 lần
    for (let i = 0; i < n - 1; i++) {      // O(n)

        // Vòng trong: duyệt phần chưa sắp xếp
        for (let j = 0; j < n - i - 1; j++) { // O(n)

            // So sánh và swap nếu cần
            if (arr[j] > arr[j + 1]) {        // O(1)
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }

    return arr;
}
