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
 * Mô tả: Thời gian thực hiện KHÔNG phụ thuộc vào kích thước dữ liệu đầu vào (n).
 * Ví dụ: Truy cập phần tử mảng theo index, các phép toán cơ bản (+, -, *, /).
 */
export function accessElement(arr: number[], index: number): number | undefined {
    console.log("--- O(1) Example ---");
    // Dù mảng có 10 phần tử hay 1 triệu phần tử, việc truy cập chỉ tốn 1 bước.
    return arr[index];
}

// ============================================================================
// 2. O(n) - Linear Time (Độ phức tạp tuyến tính)
// ============================================================================
/**
 * Mô tả: Thời gian thực hiện tăng TỈ LỆ THUẬN với kích thước dữ liệu đầu vào (n).
 * Ví dụ: Duyệt mảng (Loop), tìm kiếm tuyến tính.
 */
export function logAllElements(arr: number[]): void {
    console.log("--- O(n) Example ---");
    // n phần tử -> n lần lặp.
    for (let i = 0; i < arr.length; i++) {
        console.log(`Element ${i}: ${arr[i]}`);
    }
}

// ============================================================================
// 3. O(n^2) - Quadratic Time (Độ phức tạp bậc hai)
// ============================================================================
/**
 * Mô tả: Thời gian thực hiện tăng theo BÌNH PHƯƠNG kích thước dữ liệu.
 * Thường gặp trong các vòng lặp lồng nhau (Nested Loops).
 * Ví dụ: Bubble Sort, in ra các cặp số.
 */
export function printAllPairs(arr: number[]): void {
    console.log("--- O(n^2) Example ---");
    const n = arr.length;
    // Vòng lặp i chạy n lần
    for (let i = 0; i < n; i++) {
        // Vòng lặp j chạy n lần cho mỗi i
        // Tổng số bước: n * n = n^2
        for (let j = 0; j < n; j++) {
            console.log(`Pair: (${arr[i]}, ${arr[j]})`);
        }
    }
}

// ============================================================================
// 4. O(log n) - Logarithmic Time (Độ phức tạp logarit)
// ============================================================================
/**
 * Mô tả: Thời gian tăng rất chậm khi n tăng. Mỗi bước thuật toán giúp giảm không gian tìm kiếm đi một nửa.
 * Ví dụ: Binary Search (Tìm kiếm nhị phân).
 */
export function logarithmicExample(n: number): void {
    console.log("--- O(log n) Example ---");
    let step = 0;
    // i bắt đầu từ n, sau mỗi vòng lặp i giảm đi một nửa
    for (let i = n; i > 1; i = Math.floor(i / 2)) {
        step++;
        console.log(`Step ${step}, current n = ${i}`);
    }
    console.log(`Total steps for n=${n} is approx log2(${n}) = ${step}`);
}

// ============================================================================
// 5. Space Complexity (Độ phức tạp không gian)
// ============================================================================
/**
 * Space O(n): Tạo ra một mảng mới chứa n phần tử.
 */
export function createArray(n: number): number[] {
    console.log("--- Space O(n) Example ---");
    const arr = new Array(n).fill(0); // Tốn O(n) bộ nhớ
    return arr;
}
