/**
 * =============================================================================
 * FILE: SelectionSort.ts (Sắp Xếp Chọn)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp mảng theo thứ tự tăng dần.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Greedy Approach (Chiến thuật Tham lam)**: Ở mỗi bước, luôn chọn phần tử nhỏ nhất (tốt nhất) chưa được sắp xếp và đưa nó về đúng vị trí.
 *    - **In-place Sorting**: Sắp xếp trực tiếp trên mảng đầu vào mà không cần thêm bộ nhớ đáng kể.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: Chia mảng thành 2 phần ảo: Sorted (bên trái, ban đầu rỗng) và Unsorted (bên phải, ban đầu là cả mảng).
 *    - B2: Lặp `i` từ 0 đến `n - 2` (phần tử cuối cùng sẽ tự động đúng nếu `n-1` phần tử trước đúng).
 *    - B3: Tìm **Minimum Value (Min)** trong phần Unsorted (từ `i` đến `n-1`).
 *    - B4: Hoán đổi (Swap) phần tử `Min` tìm được với phần tử đầu tiên của phần Unsorted (`arr[i]`).
 *    - B5: Tăng kích thước phần Sorted lên 1 đơn vị. Lặp lại cho đến hết.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**: O(n^2)
 *      + Luôn luôn là O(n^2) bất kể mảng ban đầu thế nào, vì luôn phải quét hết phần còn lại để tìm min.
 *    - **Space Complexity**: O(1) (In-place).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Số lần Swap ít nhất trong các thuật toán O(n^2) (tối đa n lần swap). Tốt khi việc ghi bộ nhớ (write) tốn kém.
 *      + Dễ cài đặt.
 *    - **Nhược điểm**:
 *      + Chậm. Không tận dụng được mảng đã sắp xếp một phần (Adaptive).
 *      + Unstable Sort (Không ổn định - có thể làm đổi chỗ các phần tử bằng nhau).
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Bubble Sort**: Nhanh hơn một chút trong thực tế vì ít swap hơn.
 *    - So với **Insertion Sort**: Chậm hơn nếu mảng đã gần như được sorted.
 */

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateSelectionSortSteps - Tạo các bước cho Selection Sort.
 *
 * THUẬT TOÁN SELECTION SORT:
 * 1. Chia mảng thành 2 phần: sorted (trái) và unsorted (phải).
 * 2. Tìm phần tử nhỏ nhất trong unsorted.
 * 3. Swap với phần tử đầu tiên của unsorted.
 * 4. Mở rộng sorted region sang phải.
 * 5. Repeat cho đến khi unsorted rỗng.
 *
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateSelectionSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Selection Sort. Tìm phần tử nhỏ nhất và đưa về đầu.',
        codeSnippet: `// SELECTION SORT - O(n²) time, O(1) space
// Ý tưởng: Chọn min từ unsorted, đưa vào sorted
for (i = 0; i < n-1; i++) {
    minIdx = i;
    for (j = i+1; j < n; j++) {
        if (arr[j] < arr[minIdx]) minIdx = j;
    }
    swap(arr[i], arr[minIdx]);
}`,
    });

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        // Find minimum in unsorted portion
        for (let j = i + 1; j < n; j++) {
            steps.push({
                array: [...array],
                comparing: [minIdx, j],
                swapping: [],
                sorted: [...sorted],
                description: `Tìm min: So sánh arr[${minIdx}]=${array[minIdx]} với arr[${j}]=${array[j]}`,
                codeSnippet: `// Tìm phần tử nhỏ nhất trong vùng unsorted
if (arr[${j}] < arr[${minIdx}]) {  // ${array[j]} < ${array[minIdx]} ?
    minIdx = ${j};  // Cập nhật vị trí min
}`,
            });

            if (array[j] < array[minIdx]) {
                minIdx = j;
                steps.push({
                    array: [...array],
                    comparing: [minIdx],
                    swapping: [],
                    sorted: [...sorted],
                    description: `Min mới tìm thấy: arr[${minIdx}]=${array[minIdx]}`,
                    codeSnippet: `// Tìm thấy min mới!
minIdx = ${minIdx};  // arr[${minIdx}] = ${array[minIdx]}
// Tiếp tục tìm trong phần còn lại...`,
                });
            }
        }

        // Swap if needed
        if (minIdx !== i) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [i, minIdx],
                sorted: [...sorted],
                description: `Swap arr[${i}]=${array[i]} với min arr[${minIdx}]=${array[minIdx]}`,
                codeSnippet: `// Đưa min về đầu vùng unsorted
// Swap vị trí ${i} với vị trí ${minIdx}
[arr[${i}], arr[${minIdx}]] = [arr[${minIdx}], arr[${i}]];
// ${array[i]} ↔ ${array[minIdx]}`,
            });

            [array[i], array[minIdx]] = [array[minIdx], array[i]];

            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                description: `Sau swap: vị trí ${i} có giá trị ${array[i]}`,
                codeSnippet: `// Kết quả sau swap:
arr = [${array.join(', ')}]
// Phần tử ${array[i]} đã ở đúng vị trí`,
            });
        }

        sorted.push(i);
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Phần tử ${array[i]} đã ở đúng vị trí ${i}.`,
            codeSnippet: `// Hoàn thành iteration ${i + 1}
// sorted region: [${sorted.map(idx => array[idx]).join(', ')}]
// unsorted region: [${array.slice(i + 1).join(', ')}]`,
        });
    }

    // Last element is automatically sorted
    sorted.push(n - 1);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        description: '[Hoàn thành] Selection Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH SELECTION SORT
// Kết quả: [${array.join(', ')}]
//
// ƯU ĐIỂM:
// - Ít thao tác swap (tối đa n-1 lần)
// - In-place, không cần bộ nhớ phụ
//
// NHƯỢC ĐIỂM:
// - Unstable sort
// - Luôn O(n²) dù mảng đã sorted`,
    });

    return steps;
}

/**
 * selectionSort - Phiên bản trả về mảng đã sắp xếp.
 */
export function selectionSort(arr: number[]): number[] {
    const n = arr.length;
    const result = [...arr];
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (result[j] < result[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [result[i], result[minIdx]] = [result[minIdx], result[i]];
        }
    }
    return result;
}
