/**
 * =============================================================================
 * FILE: BubbleSort.ts (Sắp Xếp Nổi Bọt)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp các phần tử trong mảng theo thứ tự tăng dần.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Comparison-based Sorting**: Sắp xếp dựa trên việc so sánh hai phần tử.
 *    - **Swapping (Hoán vị)**: Đổi chỗ hai phần tử nếu chúng sai thứ tự.
 *    - **Bubble Up**: Phần tử lớn nhất sẽ "nổi" (di chuyển) dần về cuối mảng sau mỗi vòng lặp lớn.
 *
 * 6. INTEGRATION (VISUALIZATION):
 *    - Hàm `generateBubbleSortSteps` tạo ra các bước để hiển thị animation trên UI.
 */

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateBubbleSortSteps - Tạo các bước cho Bubble Sort.
 *
 * THUẬT TOÁN BUBBLE SORT:
 * 1. Duyệt qua mảng nhiều lần (passes).
 * 2. Mỗi pass: so sánh các cặp liền kề.
 * 3. Nếu sai thứ tự → swap.
 * 4. Sau mỗi pass: phần tử lớn nhất "nổi" lên cuối.
 * 5. Tối ưu: dừng sớm nếu không có swap trong 1 pass.
 *
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateBubbleSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr]; // Copy để không modify original
    const n = array.length;
    const sorted: number[] = [];

    // Step 0: Initial state - Hiển thị cấu trúc thuật toán tổng quan
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Bubble Sort. Duyệt và so sánh các cặp phần tử liền kề.',
        codeSnippet: `// BUBBLE SORT - O(n²) time, O(1) space
// Ý tưởng: Phần tử lớn "nổi" lên cuối như bọt khí
for (i = 0; i < n-1; i++) {
    for (j = 0; j < n-i-1; j++) {
        if (arr[j] > arr[j+1]) {
            swap(arr[j], arr[j+1]);
        }
    }
}`,
    });

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            // Step: Comparing - Hiển thị code so sánh
            steps.push({
                array: [...array],
                comparing: [j, j + 1],
                swapping: [],
                sorted: [...sorted],
                description: `So sánh arr[${j}]=${array[j]} với arr[${j + 1}]=${array[j + 1]}`,
                codeSnippet: `// So sánh 2 phần tử liền kề
if (arr[${j}] > arr[${j + 1}]) {  // ${array[j]} > ${array[j + 1]} ?
    // Nếu sai thứ tự → cần swap
}`,
            });

            if (array[j] > array[j + 1]) {
                // Step: Swapping - Hiển thị code swap
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [j, j + 1],
                    sorted: [...sorted],
                    description: `${array[j]} > ${array[j + 1]} → Swap!`,
                    codeSnippet: `// Hoán đổi (Swap) hai phần tử
// Kỹ thuật: Destructuring assignment
[arr[${j}], arr[${j + 1}]] = [arr[${j + 1}], arr[${j}]];
// Hoặc dùng biến tạm (temp variable):
// temp = arr[${j}];
// arr[${j}] = arr[${j + 1}];
// arr[${j + 1}] = temp;`,
                });

                // Perform swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapped = true;

                // Step: After swap
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [],
                    sorted: [...sorted],
                    description: `Sau swap: arr[${j}]=${array[j]}, arr[${j + 1}]=${array[j + 1]}`,
                    codeSnippet: `// Kết quả sau swap:
arr = [${array.join(', ')}]
// Phần tử lớn hơn đã "nổi" lên 1 vị trí`,
                });
            }
        }

        // Mark element as sorted
        sorted.push(n - i - 1);
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Pass ${i + 1} hoàn thành. Phần tử ${array[n - i - 1]} đã ở đúng vị trí.`,
            codeSnippet: `// Kết thúc pass ${i + 1}
// Phần tử lớn nhất trong vùng chưa sắp xếp
// đã "nổi" lên đúng vị trí cuối
// sorted: [${sorted.join(', ')}]`,
        });

        // Optimization: Early termination
        if (!swapped) {
            // Mark all remaining as sorted
            for (let k = 0; k < n - i - 1; k++) {
                if (!sorted.includes(k)) {
                    sorted.push(k);
                }
            }
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                description: 'Không có swap → Mảng đã sắp xếp. Dừng sớm!',
                codeSnippet: `// TỐI ƯU: Early termination
// Nếu không có swap trong 1 pass
// → Mảng đã sorted → Dừng sớm
if (!swapped) break;
// Giảm từ O(n²) xuống O(n) cho mảng đã sắp xếp`,
            });
            break;
        }
    }

    // Final step: All sorted
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Bubble Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH BUBBLE SORT
// Kết quả: [${array.join(', ')}]
// 
// ƯU ĐIỂM:
// - Đơn giản, dễ hiểu, dễ cài đặt
// - Stable sort (giữ thứ tự tương đối)
// - In-place (không cần bộ nhớ phụ)
//
// NHƯỢC ĐIỂM:
// - Chậm: O(n²) ngay cả với mảng gần đúng
// - Không phù hợp với dữ liệu lớn`,
    });

    return steps;
}

/**
 * bubbleSort - Phiên bản trả về mảng đã sắp xếp (dùng cho execute/registry).
 */
export function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    const result = [...arr];
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return result;
}

// Keep the console version for CLI testing if needed
export function bubbleSortConsole(arr: number[]): number[] {
    const n = arr.length;
    console.log("--- Bắt đầu Bubble Sort ---");
    const result = [...arr];
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        console.log(`\nIteration (Vòng lặp thứ) ${i + 1}:`);
        for (let j = 0; j < n - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                console.log(`  Swap (Đổi chỗ) ${result[j]} và ${result[j + 1]}`);
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }
        if (!swapped) {
            console.log("  -> Không có swap nào xảy ra. Mảng đã được sắp xếp hoàn tất.");
            break;
        }
    }
    return result;
}
