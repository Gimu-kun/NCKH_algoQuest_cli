/**
 * =============================================================================
 * FILE: BinarySearch.ts (Tìm Kiếm Nhị Phân)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Tìm vị trí index của một giá trị (target) trong một mảng ĐÃ ĐƯỢC SẮP XẾP (Sorted Array).
 *    - Trả về index nếu tìm thấy, ngược lại trả về -1.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Divide and Conquer (Chia để trị)**: Chia bài toán lớn thành các bài toán con nhỏ hơn.
 *    - **Search Space Reduction**: Sau mỗi bước so sánh, không gian tìm kiếm (Search Space) được giảm đi một nửa (50%).
 *    - **Two Pointers (Hai con trỏ)**: Sử dụng `left` và `right` để định nghĩa phạm vi tìm kiếm hiện tại.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: Khởi tạo `left = 0`, `right = arr.length - 1`.
 *    - B2: Trong khi `left <= right`:
 *         + Tính `mid` (chỉ số giữa). Dùng `Math.floor(left + (right - left) / 2)` để tránh tràn số.
 *         + So sánh `arr[mid]` với `target`:
 *           * Nếu `arr[mid] == target` -> Tìm thấy (Match) -> Return `mid`.
 *           * Nếu `arr[mid] < target` -> Target phải ở bên phải -> Gán `left = mid + 1` (Bỏ nửa trái).
 *           * Nếu `arr[mid] > target` -> Target phải ở bên trái -> Gán `right = mid - 1` (Bỏ nửa phải).
 *    - B3: Nếu kết thúc vòng lặp mà không thấy -> Return -1.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**: O(log n)
 *      + Logarithmic time. Cực kỳ hiệu quả. Ví dụ: Với 1 tỷ phần tử, chỉ cần khoảng 30 phép so sánh ($log_2(10^9) \approx 30$).
 *    - **Space Complexity**: O(1)
 *      + Iterative approach (Vòng lặp) chỉ dùng biến tạm, không tốn stack như Đệ quy (Recursive).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**: Tốc độ rất nhanh cho dữ liệu lớn so với Linear Search (O(n)).
 *    - **Nhược điểm**: Bắt buộc mảng input phải **ĐƯỢC SẮP XẾP** trước. Nếu mảng chưa sort, chi phí sort (O(n log n)) sẽ làm mất lợi thế nếu chỉ tìm kiếm ít lần.
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Linear Search**: Nhanh hơn vượt trội (O(log n) vs O(n)), nhưng Linear Search dùng được cho mảng chưa sắp xếp.
 *    - So với **Interpolation Search**: Binary Search ổn định hơn, Interpolation Search (O(log(log n))) chỉ nhanh hơn nếu dữ liệu phân bố đều (uniform distribution).
 */

import type { BinarySearchStep } from '../../components/visualizations/types';

/**
 * generateBinarySearchSteps - Tạo các bước cho Binary Search.
 *
 * @param arr - Mảng đã sorted
 * @param target - Giá trị cần tìm
 * @returns Mảng các BinarySearchStep
 */
export function generateBinarySearchSteps(arr: number[], target: number): BinarySearchStep[] {
    const steps: BinarySearchStep[] = [];
    const array = [...arr];
    const n = array.length;
    const eliminated: number[] = [];

    let left = 0;
    let right = n - 1;

    // Initial step
    steps.push({
        array,
        left,
        right,
        mid: -1,
        target,
        foundIndex: -1,
        eliminated: [],
        description: `Bắt đầu Binary Search. Tìm target = ${target}. Search space: [${left}, ${right}]`,
        isComplete: false,
        codeSnippet: `// BINARY SEARCH - O(log n) time, O(1) space
// ĐIỀU KIỆN: Mảng PHẢI được sắp xếp!

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;  // Tìm bên PHẢI
        else right = mid - 1;                   // Tìm bên TRÁI
    }
    return -1;
}`,
    });

    while (left <= right) {
        // Calculate mid
        const mid = Math.floor(left + (right - left) / 2);
        const midValue = array[mid];

        // Step: Show mid calculation
        steps.push({
            array,
            left,
            right,
            mid,
            target,
            foundIndex: -1,
            eliminated: [...eliminated],
            description: `mid = ${left} + (${right} - ${left}) / 2 = ${mid}. arr[${mid}] = ${midValue}`,
            isComplete: false,
            codeSnippet: `// Tính mid - QUAN TRỌNG: Tránh overflow!
// SAI: mid = (left + right) / 2  // Có thể overflow
// ĐÚNg: mid = left + (right - left) / 2

let mid = ${left} + (${right} - ${left}) / 2 = ${mid}
// arr[${mid}] = ${midValue}
// So sánh với target = ${target}`,
        });

        if (midValue === target) {
            // Found!
            steps.push({
                array,
                left,
                right,
                mid,
                target,
                foundIndex: mid,
                eliminated: [...eliminated],
                description: `[TÌM THẤY] arr[${mid}] = ${midValue} = target. Index = ${mid}`,
                isComplete: true,
                codeSnippet: `// ✓ TÌM THẤY!
if (arr[${mid}] === ${target}) {
    return ${mid};  // Trả về index
}

// KếT QUẢ: target ${target} ở index ${mid}
// Số bước: ${steps.length + 1} (O(log n) = ~${Math.ceil(Math.log2(n))})`,
            });
            return steps;
        }

        if (midValue < target) {
            // Target is on the right side
            // Eliminate left half including mid
            for (let i = left; i <= mid; i++) {
                if (!eliminated.includes(i)) {
                    eliminated.push(i);
                }
            }

            steps.push({
                array,
                left,
                right,
                mid,
                target,
                foundIndex: -1,
                eliminated: [...eliminated],
                description: `${midValue} < ${target} → Target ở bên PHẢI. Loại bỏ [${left}..${mid}]`,
                isComplete: false,
            });

            left = mid + 1;
        } else {
            // Target is on the left side
            // Eliminate right half including mid
            for (let i = mid; i <= right; i++) {
                if (!eliminated.includes(i)) {
                    eliminated.push(i);
                }
            }

            steps.push({
                array,
                left,
                right,
                mid,
                target,
                foundIndex: -1,
                eliminated: [...eliminated],
                description: `${midValue} > ${target} → Target ở bên TRÁI. Loại bỏ [${mid}..${right}]`,
                isComplete: false,
            });

            right = mid - 1;
        }

        // Show new search space
        if (left <= right) {
            steps.push({
                array,
                left,
                right,
                mid: -1,
                target,
                foundIndex: -1,
                eliminated: [...eliminated],
                description: `Search space mới: [${left}, ${right}]. Còn ${right - left + 1} phần tử.`,
                isComplete: false,
            });
        }
    }

    // Not found
    steps.push({
        array,
        left,
        right,
        mid: -1,
        target,
        foundIndex: -1,
        eliminated: [...eliminated],
        description: `[KHÔNG TÌM THẤY] Target ${target} không tồn tại trong mảng.`,
        isComplete: true,
    });

    return steps;
}

export function binarySearch(arr: number[], target: number): number {
    console.log(`\n--- BẮT ĐẦU BINARY SEARCH (Tìm kiếm nhị phân) ---`);
    console.log(`Target: ${target}`);
    console.log(`Search Space ban đầu: [0, ${arr.length - 1}]`);

    let left = 0;
    let right = arr.length - 1;
    let step = 0;

    // Vòng lặp chính: Tiếp tục tìm khi khoảng tìm kiếm còn hợp lệ (left chưa vượt quá right)
    while (left <= right) {
        step++;

        // Tính chỉ số giữa (mid).
        // Kỹ thuật: target nằm trong [left, right]
        // Phép toán (right - left) / 2 giúp tránh Integer Overflow trong một số ngôn ngữ tĩnh, dù JS High-level ít bị hơn.
        const mid = Math.floor(left + (right - left) / 2);
        const midValue = arr[mid];

        console.log(`\n[Bước ${step}]`);
        console.log(`   Range (Phạm vi): [${left}...${right}], Mid index: ${mid}, Mid value: ${midValue}`);

        // Case 1: Tìm thấy (Target Found)
        if (midValue === target) {
            console.log(`   -> FOUND! Giá trị tại mid trùng khớp với target.`);
            console.log(`--- KẾT THÚC (Tìm thấy tại index ${mid}) ---`);
            return mid;
        }

        // Case 2: Giá trị giữa < Target -> Target nằm ở nửa bên PHẢI (Right Half)
        // Nghĩa là tất cả phần tử từ left -> mid đều nhỏ hơn target -> Bỏ qua chúng.
        if (midValue < target) {
            console.log(`   -> ${midValue} < ${target}: Target lớn hơn, tìm bên PHẢI.`);
            console.log(`   -> Cập nhật Left: ${mid} + 1 = ${mid + 1}`);
            // Thu hẹp phạm vi: Dời left lên một vị trí sau mid
            left = mid + 1;
        }
        // Case 3: Giá trị giữa > Target -> Target nằm ở nửa bên TRÁI (Left Half)
        // Nghĩa là tất cả phần tử từ mid -> right đều lớn hơn target -> Bỏ qua chúng.
        else {
            console.log(`   -> ${midValue} > ${target}: Target nhỏ hơn, tìm bên TRÁI.`);
            console.log(`   -> Cập nhật Right: ${mid} - 1 = ${mid - 1}`);
            // Thu hẹp phạm vi: Dời right về một vị trí trước mid
            right = mid - 1;
        }
    }

    // Kết thúc vòng lặp mà không return -> Không tìm thấy
    console.log(`\n--- KẾT THÚC (Không tìm thấy - Trả về -1) ---`);
    return -1;
}

export default {
    binarySearch,
    generateBinarySearchSteps
};
