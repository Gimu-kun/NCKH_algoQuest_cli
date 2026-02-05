/**
 * =============================================================================
 * FILE: LinearSearch.ts (Tìm Kiếm Tuyến Tính)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Tìm vị trí index của một giá trị (target) trong mảng bất kỳ.
 *    - Không yêu cầu mảng phải được sắp xếp trước.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Sequential Search (Tìm kiếm tuần tự)**: Duyệt từng phần tử một từ đầu đến cuối.
 *    - **Brute Force (Vét cạn)**: Kiểm tra mọi khả năng có thể cho đến khi tìm thấy kết quả.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: Bắt đầu vòng lặp từ `i = 0` đến `n - 1` (hết mảng).
 *    - B2: Tại mỗi bước `i`:
 *         + So sánh phần tử hiện tại `arr[i]` với `target`.
 *         + Nếu `arr[i] == target`:
 *           -> Tìm thấy! Trả về `i` ngay lập tức (Early Return).
 *    - B3: Nếu kết thúc vòng lặp mà chưa tìm thấy:
 *         -> Có nghĩa là `target` không tồn tại trong mảng.
 *         -> Trả về -1.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**: O(n)
 *      + Best Case: O(1) - Nếu target nằm ngay đầu mảng.
 *      + Worst Case: O(n) - Nếu target nằm cuối mảng hoặc không có.
 *      + Average Case: O(n/2) ~ O(n).
 *    - **Space Complexity**: O(1)
 *      + Chỉ sử dụng một biến đếm `i` cho vòng lặp, không tốn bộ nhớ phụ.
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Đơn giản, dễ cài đặt.
 *      + Không yêu cầu mảng phải sắp xếp (Sorted).
 *      + Hiệu quả với mảng nhỏ (< 100 phần tử).
 *    - **Nhược điểm**:
 *      + Rất chậm với dữ liệu lớn (Big Data). Ví dụ: 1 triệu phần tử có thể mất 1 triệu phép so sánh.
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Binary Search**: Chậm hơn nhiều (O(n) vs O(log n)), nhưng linh hoạt hơn vì làm việc được trên mảng chưa sort.
 */

import type { LinearSearchStep } from '../../components/visualizations/types';

/**
 * generateLinearSearchSteps - Tạo các bước cho Linear Search.
 *
 * Algorithm đơn giản:
 * for i = 0 to n-1:
 *     if arr[i] == target:
 *         return i
 * return -1
 *
 * @param arr - Mảng để tìm
 * @param target - Giá trị cần tìm
 * @returns Mảng các LinearSearchStep
 */
export function generateLinearSearchSteps(arr: number[], target: number): LinearSearchStep[] {
    const steps: LinearSearchStep[] = [];
    const array = [...arr];
    const n = array.length;
    const checkedIndices: number[] = [];
    let comparisonCount = 0;

    // Initial step
    steps.push({
        array,
        currentIndex: -1,
        target,
        checkedIndices: [],
        foundIndex: -1,
        description: `Bắt đầu Linear Search. Tìm target = ${target}. Duyệt từ đầu đến cuối.`,
        isComplete: false,
        comparisonCount: 0,
        codeSnippet: `// LINEAR SEARCH - O(n) time, O(1) space
// Duyệt tuần tự từ đầu đến cuối mảng
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;  // Tìm thấy!
        }
    }
    return -1;  // Không tìm thấy
}`,
    });

    for (let i = 0; i < n; i++) {
        // Step: Move to current index
        steps.push({
            array,
            currentIndex: i,
            target,
            checkedIndices: [...checkedIndices],
            foundIndex: -1,
            description: `Xét index ${i}: arr[${i}] = ${array[i]}`,
            isComplete: false,
            comparisonCount,
            codeSnippet: `// Bước ${i + 1}: Xét phần tử tại index ${i}
for (let i = ${i}; i < ${n}; i++) {
    // Đang xét: arr[${i}] = ${array[i]}
    // So sánh với target = ${target}
}`,
        });

        // Step: Compare
        comparisonCount++;
        steps.push({
            array,
            currentIndex: i,
            target,
            checkedIndices: [...checkedIndices],
            foundIndex: -1,
            description: `So sánh: ${array[i]} ${array[i] === target ? '==' : '!='} ${target}?`,
            isComplete: false,
            comparisonCount,
            codeSnippet: `// So sánh lần ${comparisonCount}
if (arr[${i}] === target) {  // ${array[i]} === ${target} ?
    // Kết quả: ${array[i] === target ? 'TRUE - Tìm thấy!' : 'FALSE - Tiếp tục'}
}`,
        });

        if (array[i] === target) {
            // Found!
            steps.push({
                array,
                currentIndex: i,
                target,
                checkedIndices: [...checkedIndices],
                foundIndex: i,
                description: `[TÌM THẤY] arr[${i}] = ${array[i]} = target. Sau ${comparisonCount} lần so sánh.`,
                isComplete: true,
                comparisonCount,
                codeSnippet: `// ✓ TÌM THẤY!
if (arr[${i}] === ${target}) {
    return ${i};  // Trả về index
}
// Kết quả: index = ${i}, so sánh ${comparisonCount} lần
//
// SO SÁNH VỚI BINARY SEARCH:
// Linear: O(n) = ${n} lần (worst case)
// Binary: O(log n) = ${Math.ceil(Math.log2(n))} lần (nếu sorted)`,
            });
            return steps;
        }

        // Not match, mark as checked
        checkedIndices.push(i);
        steps.push({
            array,
            currentIndex: i,
            target,
            checkedIndices: [...checkedIndices],
            foundIndex: -1,
            description: `${array[i]} ≠ ${target}. Tiếp tục tìm...`,
            isComplete: false,
            comparisonCount,
            codeSnippet: `// Không khớp, tiếp tục vòng lặp
// ${array[i]} !== ${target}
i++;  // i = ${i + 1}
// Đã kiểm tra: ${checkedIndices.length} phần tử`,
        });
    }

    // Not found
    steps.push({
        array,
        currentIndex: -1,
        target,
        checkedIndices: [...checkedIndices],
        foundIndex: -1,
        description: `[KHÔNG TÌM THẤY] Đã duyệt hết mảng. ${comparisonCount} lần so sánh.`,
        isComplete: true,
        comparisonCount,
        codeSnippet: `// ✗ KHÔNG TÌM THẤY
// Đã duyệt hết ${n} phần tử
// So sánh ${comparisonCount} lần
return -1;

// NHẬN XÉT:
// Worst case của Linear Search: O(n)
// Target không có trong mảng hoặc ở cuối`,
    });

    return steps;
}

export function linearSearch(arr: number[], target: number): number {
    console.log(`\n--- BẮT ĐẦU LINEAR SEARCH (Tìm kiếm tuyến tính) ---`);
    console.log(`Target: ${target}`);
    console.log(`Array: [${arr.join(', ')}]`);

    // Vòng lặp chính: Duyệt qua từng phần tử của mảng (Sequential Traversal)
    for (let i = 0; i < arr.length; i++) {
        // Log chi tiết bước duyệt để theo dõi quá trình
        console.log(`Step ${i + 1}: Kiểm tra arr[${i}] = ${arr[i]}`);

        // So sánh phần tử hiện tại với target
        if (arr[i] === target) {
            console.log(`   -> KHỚP (MATCH)! Tìm thấy ${target} tại index ${i}.`);

            // Early Exit: Thoát khỏi hàm ngay khi tìm thấy kết quả để tối ưu hiệu năng
            console.log(`--- KẾT THÚC (FOUND) ---`);
            return i;
        } else {
            console.log(`   -> Không khớp. Tiếp tục sang phần tử kế tiếp...`);
        }
    }

    // Kết thúc vòng lặp: Đã duyệt hết mảng mà không tìm thấy
    console.log(`--- KẾT THÚC (NOT FOUND) - Trả về -1 ---`);
    return -1;
}

export default {
    linearSearch,
    generateLinearSearchSteps
};
