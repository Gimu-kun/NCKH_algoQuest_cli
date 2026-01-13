/**
 * =============================================================================
 * FILE: SortingVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Tạo component trực quan hóa các thuật toán sắp xếp (Sorting Algorithms).
 * - Hỗ trợ: Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort.
 * - Hiển thị từng bước (step-by-step) của thuật toán với animations.
 *
 * CHỨC NĂNG CHI TIẾT (Detailed Functionality):
 * 1. Nhận mảng đầu vào và loại thuật toán từ props.
 * 2. Generate danh sách các bước (steps) để sắp xếp mảng.
 * 3. Hiển thị mảng dưới dạng các thanh (bars) với ArrayBar component.
 * 4. Animate qua từng bước: highlight comparing, swapping, sorted elements.
 * 5. Cho phép user điều khiển: Play/Pause, Step, Reset, Speed.
 *
 * KỸ THUẬT SỬ DỤNG (Techniques):
 * 1. Generator Functions: Tạo steps một cách lazy, tiết kiệm memory.
 * 2. Framer Motion AnimatePresence: Smooth transitions khi array thay đổi.
 * 3. useEffect + setInterval: Auto-play qua các steps.
 * 4. useRef: Lưu interval ID để có thể clear khi cần.
 * 5. State Management: useState cho local state, không cần global store.
 *
 * STEPS FLOW (Luồng hoạt động):
 * 1. Component mount → generate tất cả sorting steps.
 * 2. User click Play → setInterval bắt đầu, currentStep tăng dần.
 * 3. Mỗi step → update displayArray và highlightedIndices.
 * 4. ArrayBar components animate dựa trên state.
 * 5. Hoàn thành → tất cả bars có state 'sorted'.
 *
 * CÁC THUẬT TOÁN ĐƯỢC HỖ TRỢ (Supported Algorithms):
 *
 * 1. BUBBLE SORT (Sắp xếp nổi bọt):
 *    - Technique: Comparison-based, in-place, stable.
 *    - Flow: So sánh các cặp liền kề, swap nếu sai thứ tự.
 *    - Time: O(n²) average/worst, O(n) best (đã sorted).
 *    - Space: O(1).
 *    - Ưu điểm: Đơn giản, dễ hiểu, stable sort.
 *    - Nhược điểm: Chậm với dữ liệu lớn.
 *
 * 2. SELECTION SORT (Sắp xếp chọn):
 *    - Technique: Comparison-based, in-place, unstable.
 *    - Flow: Tìm min trong unsorted portion, swap về đầu.
 *    - Time: O(n²) tất cả cases.
 *    - Space: O(1).
 *    - Ưu điểm: Ít swaps (tốt nếu swap tốn kém).
 *    - Nhược điểm: Không stable, luôn O(n²).
 *
 * 3. INSERTION SORT (Sắp xếp chèn):
 *    - Technique: Comparison-based, in-place, stable.
 *    - Flow: Chèn từng phần tử vào đúng vị trí trong sorted portion.
 *    - Time: O(n²) average/worst, O(n) best.
 *    - Space: O(1).
 *    - Ưu điểm: Nhanh với small/nearly sorted data, stable.
 *    - Nhược điểm: Chậm với large random data.
 *
 * 4. MERGE SORT (Sắp xếp trộn):
 *    - Technique: Divide and Conquer, stable.
 *    - Flow: Chia đôi → sort đệ quy → merge.
 *    - Time: O(n log n) tất cả cases.
 *    - Space: O(n) - cần auxiliary array.
 *    - Ưu điểm: Luôn O(n log n), stable.
 *    - Nhược điểm: Tốn memory O(n).
 *
 * 5. QUICK SORT (Sắp xếp nhanh):
 *    - Technique: Divide and Conquer, in-place (gần như), unstable.
 *    - Flow: Chọn pivot → partition → sort đệ quy.
 *    - Time: O(n log n) average, O(n²) worst (rare với good pivot).
 *    - Space: O(log n) call stack.
 *    - Ưu điểm: Nhanh nhất trong practice, cache-friendly.
 *    - Nhược điểm: Worst case O(n²), không stable.
 *
 * SO SÁNH TỔNG QUAN:
 * ┌──────────────────┬──────────────┬──────────────┬─────────┬────────┐
 * │ Algorithm        │ Time (avg)   │ Time (worst) │ Space   │ Stable │
 * ├──────────────────┼──────────────┼──────────────┼─────────┼────────┤
 * │ Bubble Sort      │ O(n²)        │ O(n²)        │ O(1)    │ Yes    │
 * │ Selection Sort   │ O(n²)        │ O(n²)        │ O(1)    │ No     │
 * │ Insertion Sort   │ O(n²)        │ O(n²)        │ O(1)    │ Yes    │
 * │ Merge Sort       │ O(n log n)   │ O(n log n)   │ O(n)    │ Yes    │
 * │ Quick Sort       │ O(n log n)   │ O(n²)        │ O(log n)│ No     │
 * └──────────────────┴──────────────┴──────────────┴─────────┴────────┘
 *
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrayBar, { type ArrayBarState } from './ArrayBar';
import AnimationControls from '../shared/AnimationControls';
import '../shared/VisualizationStyles.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * SortingAlgorithmType - Các loại thuật toán sắp xếp được hỗ trợ.
 */
export type SortingAlgorithmType =
    | 'bubble'
    | 'selection'
    | 'insertion'
    | 'merge'
    | 'quick'
    | 'heap';

/**
 * SortingStep - Đại diện cho một bước trong quá trình sắp xếp.
 *
 * Mỗi step chứa đầy đủ thông tin để render UI:
 * - Array state tại thời điểm đó.
 * - Indices nào đang được thao tác.
 * - Mô tả bằng text cho user hiểu.
 */
interface SortingStep {
    /**
     * array: Trạng thái mảng tại step này.
     * Là copy, không phải reference, để có thể review lại các steps trước.
     */
    array: number[];

    /**
     * comparing: Indices đang được so sánh.
     * Thường là 2 elements.
     */
    comparing: number[];

    /**
     * swapping: Indices đang được hoán đổi.
     * Có thể rỗng nếu step này không có swap.
     */
    swapping: number[];

    /**
     * sorted: Indices đã ở đúng vị trí cuối cùng.
     * Accumulated qua các steps.
     */
    sorted: number[];

    /**
     * pivot: Index của pivot element (chỉ dùng trong Quick Sort).
     * Optional.
     */
    pivot?: number;

    /**
     * description: Mô tả bước này bằng text.
     * Hiển thị cho user để giải thích đang làm gì.
     */
    description: string;

    /**
     * codeSnippet: Đoạn code minh họa cho bước này.
     * Hiển thị pseudo-code hoặc code thực tế để user hiểu thuật toán.
     * Optional - không phải step nào cũng cần code.
     */
    codeSnippet?: string;
}

/**
 * SortingVisualizerProps - Props cho SortingVisualizer component.
 */
interface SortingVisualizerProps {
    /**
     * initialArray: Mảng ban đầu cần sắp xếp.
     */
    initialArray: number[];

    /**
     * algorithm: Loại thuật toán sắp xếp.
     */
    algorithm: SortingAlgorithmType;

    /**
     * title: Tiêu đề hiển thị (optional).
     */
    title?: string;

    /**
     * showLegend: Có hiển thị legend (chú thích màu) không.
     * Default = true.
     */
    showLegend?: boolean;

    /**
     * autoStart: Tự động bắt đầu play khi component mount.
     * Default = false.
     */
    autoStart?: boolean;
    onRegenerate?: () => void;
    /**
     * onComplete: Callback khi sắp xếp hoàn tất.
     * Optional.
     */
    onComplete?: (sortedArray: number[]) => void;
}

// =============================================================================
// ALGORITHM METADATA - Thông tin về các thuật toán
// =============================================================================

/**
 * ALGORITHM_INFO - Metadata cho từng thuật toán.
 * Dùng để hiển thị title, complexity info cho user.
 */
const ALGORITHM_INFO: Record<SortingAlgorithmType, {
    name: string;
    nameVi: string;
    timeComplexity: string;
    spaceComplexity: string;
    stable: boolean;
}> = {
    bubble: {
        name: 'Bubble Sort',
        nameVi: 'Sắp xếp nổi bọt',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
    },
    selection: {
        name: 'Selection Sort',
        nameVi: 'Sắp xếp chọn',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: false,
    },
    insertion: {
        name: 'Insertion Sort',
        nameVi: 'Sắp xếp chèn',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
    },
    merge: {
        name: 'Merge Sort',
        nameVi: 'Sắp xếp trộn',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        stable: true,
    },
    quick: {
        name: 'Quick Sort',
        nameVi: 'Sắp xếp nhanh',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        stable: false,
    },
    heap: {
        name: 'Heap Sort',
        nameVi: 'Sắp xếp vun đống',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        stable: false,
    },
};

// =============================================================================
// STEP GENERATORS - Các hàm tạo steps cho từng thuật toán
// =============================================================================

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
function generateBubbleSortSteps(arr: number[]): SortingStep[] {
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
function generateSelectionSortSteps(arr: number[]): SortingStep[] {
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
 * generateInsertionSortSteps - Tạo các bước cho Insertion Sort.
 *
 * THUẬT TOÁN INSERTION SORT:
 * 1. Coi phần tử đầu tiên là sorted.
 * 2. Lấy phần tử tiếp theo từ unsorted.
 * 3. "Chèn" vào đúng vị trí trong sorted portion bằng cách shift.
 * 4. Repeat cho đến hết unsorted.
 *
 * Giống như cách ta sắp xếp bài tây trong tay.
 *
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
function generateInsertionSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [0]; // First element is "sorted"

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [0],
        description: 'Bắt đầu Insertion Sort. Phần tử đầu tiên được coi là đã sắp xếp.',
        codeSnippet: `// INSERTION SORT - O(n²) time, O(1) space
// Ý tưởng: Như sắp xếp bài tây trong tay
for (i = 1; i < n; i++) {
    key = arr[i];  // Phần tử cần chèn
    j = i - 1;
    // Dời các phần tử lớn hơn key sang phải
    while (j >= 0 && arr[j] > key) {
        arr[j+1] = arr[j];
        j--;
    }
    arr[j+1] = key;  // Chèn key vào đúng vị trí
}`,
    });

    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;

        steps.push({
            array: [...array],
            comparing: [i],
            swapping: [],
            sorted: [...sorted],
            description: `Chọn key = arr[${i}] = ${key}. Tìm vị trí để chèn.`,
            codeSnippet: `// Bước ${i}: Chọn key để chèn vào sorted region
key = arr[${i}];  // key = ${key}
j = ${i - 1};     // Bắt đầu từ cuối sorted region
// Tìm vị trí đúng cho key...`,
        });

        // Compare and shift
        while (j >= 0 && array[j] > key) {
            steps.push({
                array: [...array],
                comparing: [j, j + 1],
                swapping: [],
                sorted: [...sorted],
                description: `arr[${j}]=${array[j]} > ${key} → Shift arr[${j}] sang phải.`,
                codeSnippet: `// So sánh với phần tử trong sorted region
if (arr[${j}] > key) {  // ${array[j]} > ${key}
    // Dời phần tử sang phải để tạo chỗ trống
    arr[${j + 1}] = arr[${j}];
    j--;
}`,
            });

            array[j + 1] = array[j];

            steps.push({
                array: [...array],
                comparing: [],
                swapping: [j, j + 1],
                sorted: [...sorted],
                description: `Shifted: arr[${j + 1}] = ${array[j + 1]}`,
                codeSnippet: `// Kết quả sau shift:
arr = [${array.join(', ')}]
// Chỗ trống đang ở vị trí ${j + 1}`,
            });

            j--;
        }

        // Insert key at correct position
        array[j + 1] = key;

        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Chèn ${key} vào vị trí ${j + 1}.`,
            codeSnippet: `// Tìm thấy vị trí đúng! Chèn key vào
arr[${j + 1}] = ${key};
// arr = [${array.join(', ')}]`,
        });

        // Update sorted indices
        sorted.push(i);
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Phần tử ${key} đã được chèn đúng vị trí.`,
            codeSnippet: `// Hoàn thành insertion cho key = ${key}
// sorted region mở rộng: [0..${i}]
// [${array.slice(0, i + 1).join(', ')}] đã sorted`,
        });
    }

    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Insertion Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH INSERTION SORT
// Kết quả: [${array.join(', ')}]
//
// ƯU ĐIỂM:
// - Stable sort
// - Rất nhanh với mảng gần sorted: O(n)
// - Hiệu quả với mảng nhỏ
// - Online algorithm (sort từng phần tử khi nhận)
//
// NHƯỢC ĐIỂM:
// - O(n²) với mảng random lớn`,
    });

    return steps;
}

/**
 * generateQuickSortSteps - Tạo các bước cho Quick Sort.
 *
 * THUẬT TOÁN QUICK SORT:
 * 1. Chọn một phần tử làm pivot (ở đây: phần tử cuối).
 * 2. Partition: Đưa các phần tử nhỏ hơn pivot sang trái, lớn hơn sang phải.
 * 3. Đệ quy: Quick Sort cho phần trái và phần phải.
 * 4. Base case: Array có 0 hoặc 1 phần tử thì dừng.
 *
 * Pivot Selection Strategies:
 * - Last element: Đơn giản nhưng worst case với sorted array.
 * - First element: Tương tự last.
 * - Random: Tránh worst case, unpredictable.
 * - Median-of-three: Lấy median của first, middle, last. Tốt hơn.
 *
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
function generateQuickSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Quick Sort. Chọn pivot và phân hoạch (partition) mảng.',
        codeSnippet: `// QUICK SORT - O(n log n) avg, O(n²) worst
// Divide and Conquer: Phân hoạch rồi đệ quy
function quickSort(arr, low, high) {
    if (low < high) {
        pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);   // Sort trái
        quickSort(arr, pi + 1, high);  // Sort phải
    }
}
// partition: Đưa pivot về đúng vị trí`,
    });

    /**
     * partition - Hàm phân hoạch (core của Quick Sort).
     *
     * @param low - Index bắt đầu
     * @param high - Index kết thúc (chứa pivot)
     * @returns Index cuối cùng của pivot sau partition
     */
    function partition(low: number, high: number): number {
        const pivot = array[high];

        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            pivot: high,
            description: `Chọn pivot = arr[${high}] = ${pivot}`,
            codeSnippet: `// Chọn Pivot là phần tử cuối
pivot = arr[high]; // ${pivot}
i = low - 1;       // Index của phần tử nhỏ hơn pivot`,
        });

        let i = low - 1; // Index của smaller element

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...array],
                comparing: [j, high],
                swapping: [],
                sorted: [...sorted],
                pivot: high,
                description: `So sánh arr[${j}]=${array[j]} với pivot=${pivot}`,
                codeSnippet: `// Duyệt qua mảng hiện tại
// So sánh arr[${j}] với pivot
if (arr[${j}] < pivot) { // ${array[j]} < ${pivot} ?
    // Nếu nhỏ hơn pivot -> swap vào vùng nhỏ hơn
}`,
            });

            if (array[j] < pivot) {
                i++;

                if (i !== j) {
                    steps.push({
                        array: [...array],
                        comparing: [],
                        swapping: [i, j],
                        sorted: [...sorted],
                        pivot: high,
                        description: `${array[j]} < ${pivot} → Swap arr[${i}] với arr[${j}]`,
                        codeSnippet: `// Swap phần tử nhỏ hơn vào vị trí i
i++; // i = ${i}
swap(arr[${i}], arr[${j}]);
// Đưa ${array[j]} về đầu`,
                    });

                    [array[i], array[j]] = [array[j], array[i]];

                    steps.push({
                        array: [...array],
                        comparing: [],
                        swapping: [],
                        sorted: [...sorted],
                        pivot: high,
                        description: `Sau swap: arr[${i}]=${array[i]}, arr[${j}]=${array[j]}`,
                        codeSnippet: `// Mảng sau khi swap:
// [${array.join(', ')}]`,
                    });
                }
            }
        }

        // Place pivot at correct position
        const pivotFinalPos = i + 1;

        if (pivotFinalPos !== high) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [pivotFinalPos, high],
                sorted: [...sorted],
                pivot: high,
                description: `Đặt pivot vào vị trí đúng: Swap arr[${pivotFinalPos}] với arr[${high}]`,
                codeSnippet: `// Đưa Pivot về đúng vị trí (chính giữa)
swap(arr[i + 1], arr[high]);
// Pivot ${pivot} chốt tại vị trí ${pivotFinalPos}`,
            });

            [array[pivotFinalPos], array[high]] = [array[high], array[pivotFinalPos]];
        }

        // Pivot is now at its final position
        sorted.push(pivotFinalPos);
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Pivot ${array[pivotFinalPos]} đã ở đúng vị trí ${pivotFinalPos}.`,
            codeSnippet: `// Hoàn thành partition
return ${pivotFinalPos}; // index của pivot`,
        });

        return pivotFinalPos;
    }

    /**
     * quickSort - Hàm đệ quy chính.
     *
     * @param low - Index bắt đầu
     * @param high - Index kết thúc
     */
    function quickSort(low: number, high: number): void {
        if (low < high) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                description: `Gọi đệ quy Quick Sort cho đoạn [${low}..${high}]`,
                codeSnippet: `// Gọi Quick Sort trên [${low}..${high}]
// 1. Partition để tìm vị trí pivot
pi = partition(arr, ${low}, ${high});`,
            });

            const pi = partition(low, high);

            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                description: `Pivot tại ${pi}. Tiếp tục sort 2 nửa trái/phải.`,
                codeSnippet: `// 2. Đệ quy sắp xếp 2 phần
quickSort(arr, ${low}, ${pi - 1});  // Trái
quickSort(arr, ${pi + 1}, ${high}); // Phải`,
            });

            // Recursively sort left and right partitions
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        } else if (low === high && !sorted.includes(low)) {
            // Single element is sorted
            sorted.push(low);
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                description: `Phần tử đơn arr[${low}]=${array[low]} đã được sắp xếp.`,
                codeSnippet: `// Base case: Mảng 1 phần tử
// arr[${low}] coi như đã sorted`,
            });
        }
    }

    quickSort(0, n - 1);

    // Final step
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Quick Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH QUICK SORT
// Kết quả: [${array.join(', ')}]
//
// ƯU ĐIỂM:
// - Rất nhanh trong thực tế: O(n log n)
// - In-place (space O(log n) cho stack)
// - Cache-friendly
//
// NHƯỢC ĐIỂM:
// - Unstable sort
// - Worst case O(n²) với mảng đã sorted
// - Cần chọn pivot tốt`,
    });

    return steps;
}

/**
 * generateMergeSortSteps - Tạo các bước cho Merge Sort.
 *
 * THUẬT TOÁN MERGE SORT:
 * 1. Chia mảng thành 2 nửa.
 * 2. Đệ quy Merge Sort cho mỗi nửa.
 * 3. Merge 2 nửa đã sorted thành 1 mảng sorted.
 * 4. Base case: Array có 1 phần tử thì dừng (đã sorted).
 *
 * Merge Sort là ví dụ kinh điển của Divide and Conquer:
 * - Divide: Chia problem thành subproblems nhỏ hơn.
 * - Conquer: Giải quyết subproblems (đệ quy).
 * - Combine: Kết hợp các solutions.
 *
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
function generateMergeSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Merge Sort. Chia đôi mảng rồi merge lại.',
        codeSnippet: `// MERGE SORT - O(n log n) time, O(n) space
// Divide and Conquer: Chia để trị
function mergeSort(arr, left, right) {
    if (left < right) {
        mid = (left + right) / 2;
        mergeSort(arr, left, mid);      // Chia nửa trái
        mergeSort(arr, mid+1, right);   // Chia nửa phải
        merge(arr, left, mid, right);   // Trộn lại
    }
}
// merge: Kết hợp 2 mảng đã sorted`,
    });

    /**
     * merge - Hàm merge 2 subarrays đã sorted.
     *
     * @param left - Index bắt đầu
     * @param mid - Index giữa (cuối nửa trái)
     * @param right - Index kết thúc
     */
    function merge(left: number, mid: number, right: number): void {
        const leftArr = array.slice(left, mid + 1);
        const rightArr = array.slice(mid + 1, right + 1);

        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Chuẩn bị merge: Left=[${leftArr.join(', ')}], Right=[${rightArr.join(', ')}]`,
            codeSnippet: `// Merge 2 dãy con đã sắp xếp
// Left: index ${left} -> ${mid}
// Right: index ${mid + 1} -> ${right}
leftArr = arr.slice(left, mid + 1);
rightArr = arr.slice(mid + 1, right + 1);`,
        });

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            steps.push({
                array: [...array],
                comparing: [left + i, mid + 1 + j],
                swapping: [],
                sorted: [...sorted],
                description: `So sánh left[${i}]=${leftArr[i]} và right[${j}]=${rightArr[j]}`,
                codeSnippet: `// So sánh phần tử đầu của 2 dãy
if (leftArr[${i}] <= rightArr[${j}]) {
    // ${leftArr[i]} <= ${rightArr[j]}
    arr[${k}] = leftArr[${i}];
} else {
    arr[${k}] = rightArr[${j}];
}`,
            });

            if (leftArr[i] <= rightArr[j]) {
                array[k] = leftArr[i];
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [k],
                    sorted: [...sorted],
                    description: `Chọn ${leftArr[i]} (nhỏ hơn) đưa vào mảng gốc tại vị trí ${k}`,
                    codeSnippet: `// Chọn phần tử bên trái
arr[${k}] = leftArr[${i}]; // = ${leftArr[i]}
i++; k++;`,
                });
                i++;
            } else {
                array[k] = rightArr[j];
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [k],
                    sorted: [...sorted],
                    description: `Chọn ${rightArr[j]} (nhỏ hơn) đưa vào mảng gốc tại vị trí ${k}`,
                    codeSnippet: `// Chọn phần tử bên phải
arr[${k}] = rightArr[${j}]; // = ${rightArr[j]}
j++; k++;`,
                });
                j++;
            }
            k++;
        }

        // Copy remaining elements
        while (i < leftArr.length) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [k],
                sorted: [...sorted],
                description: `Copy phần tử còn lại từ Left: ${leftArr[i]}`,
                codeSnippet: `// Copy phần dư bên trái
while (i < leftLen) {
    arr[k] = leftArr[i]; // ${leftArr[i]}
    i++; k++;
}`,
            });
            array[k] = leftArr[i];
            i++;
            k++;
        }

        while (j < rightArr.length) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [k],
                sorted: [...sorted],
                description: `Copy phần tử còn lại từ Right: ${rightArr[j]}`,
                codeSnippet: `// Copy phần dư bên phải
while (j < rightLen) {
    arr[k] = rightArr[j]; // ${rightArr[j]}
    j++; k++;
}`,
            });
            array[k] = rightArr[j];
            j++;
            k++;
        }

        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Merge xong đoạn [${left}..${right}]: [${array.slice(left, right + 1).join(', ')}]`,
            codeSnippet: `// Hoàn tất merge đoạn [${left}..${right}]
// Tiếp tục đệ quy hoặc hoàn thành.`,
        });
    }

    /**
     * mergeSort - Hàm đệ quy chính.
     *
     * @param left - Index bắt đầu
     * @param right - Index kết thúc
     */
    function mergeSort(left: number, right: number): void {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);

            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                description: `Chia đoạn [${left}..${right}] thành 2 nửa: [${left}..${mid}] và [${mid + 1}..${right}]`,
                codeSnippet: `// DIVIDE (Chia):
// mid = (${left} + ${right}) / 2 = ${mid}
mergeSort(arr, ${left}, ${mid});      // Đệ quy nửa trái
mergeSort(arr, ${mid + 1}, ${right}); // Đệ quy nửa phải`,
            });

            mergeSort(left, mid);
            mergeSort(mid + 1, right);
            merge(left, mid, right);
        }
    }

    mergeSort(0, n - 1);

    // Final step
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Merge Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH MERGE SORT
// Kết quả: [${array.join(', ')}]
//
// ƯU ĐIỂM:
// - Stable sort (giữ thứ tự tương đối)
// - Luôn O(n log n) - predictable
// - Tốt cho external sorting (dữ liệu lớn)
//
// NHƯỢC ĐIỂM:
// - Cần O(n) bộ nhớ phụ
// - Không in-place`,
    });

    return steps;
}

/**
 * generateHeapSortSteps - Tạo các bước cho Heap Sort.
 *
 * THUẬT TOÁN HEAP SORT:
 * 1. Build Max-Heap: Biến mảng thành Max-Heap (parent >= children).
 * 2. Extract Max: Swap root (max) với cuối, giảm heap size, heapify root.
 * 3. Repeat: Cho đến khi heap size = 1.
 *
 * HEAP PROPERTY (Tính chất Heap):
 * - Max-Heap: parent >= cả 2 children.
 * - Complete Binary Tree: Đầy đủ trừ level cuối (từ trái sang phải).
 * - Array Representation: 
 *   - Parent(i) = floor((i-1)/2)
 *   - Left(i) = 2*i + 1
 *   - Right(i) = 2*i + 2
 *
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
function generateHeapSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    // Step 0: Initial
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Heap Sort. Bước 1: Xây dựng Max-Heap.',
        codeSnippet: `// HEAP SORT - O(n log n) time, O(1) space
// Sử dụng cấu trúc Max-Heap

// Bước 1: Build Max-Heap từ mảng
for (i = n/2 - 1; i >= 0; i--) {
    heapify(arr, n, i);
}

// Bước 2: Extract max liên tục
for (i = n-1; i > 0; i--) {
    swap(arr[0], arr[i]);  // Đưa max về cuối
    heapify(arr, i, 0);    // Heapify phần còn lại
}`,
    });

    /**
     * heapify - Duy trì tính chất Max-Heap cho subtree có root tại index i.
     * 
     * @param heapSize - Kích thước heap hiện tại
     * @param i - Index của root cần heapify
     */
    function heapify(heapSize: number, i: number): void {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        // So sánh với left child
        if (left < heapSize) {
            steps.push({
                array: [...array],
                comparing: [largest, left],
                swapping: [],
                sorted: [...sorted],
                description: `Heapify: So sánh arr[${largest}]=${array[largest]} với left child arr[${left}]=${array[left]}`,
                codeSnippet: `// So sánh với left child
left = 2 * ${i} + 1 = ${left}
if (arr[${left}] > arr[${largest}]) {  // ${array[left]} > ${array[largest]} ?
    largest = ${left};
}`,
            });

            if (array[left] > array[largest]) {
                largest = left;
            }
        }

        // So sánh với right child  
        if (right < heapSize) {
            steps.push({
                array: [...array],
                comparing: [largest, right],
                swapping: [],
                sorted: [...sorted],
                description: `Heapify: So sánh arr[${largest}]=${array[largest]} với right child arr[${right}]=${array[right]}`,
                codeSnippet: `// So sánh với right child
right = 2 * ${i} + 2 = ${right}
if (arr[${right}] > arr[${largest}]) {  // ${array[right]} > ${array[largest]} ?
    largest = ${right};
}`,
            });

            if (array[right] > array[largest]) {
                largest = right;
            }
        }

        // Nếu largest không phải root, swap và đệ quy heapify
        if (largest !== i) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [i, largest],
                sorted: [...sorted],
                description: `Swap arr[${i}]=${array[i]} với arr[${largest}]=${array[largest]} để duy trì Max-Heap`,
                codeSnippet: `// Largest không phải root → Swap
[arr[${i}], arr[${largest}]] = [arr[${largest}], arr[${i}]];
// ${array[i]} ↔ ${array[largest]}
// Tiếp tục heapify subtree bị ảnh hưởng`,
            });

            [array[i], array[largest]] = [array[largest], array[i]];

            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                description: `Sau swap: arr[${i}]=${array[i]}, arr[${largest}]=${array[largest]}. Tiếp tục heapify.`,
            });

            // Đệ quy heapify subtree
            heapify(heapSize, largest);
        }
    }

    // Phase 1: Build Max-Heap
    // Bắt đầu từ node không phải leaf cuối cùng
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Xây dựng Max-Heap: Heapify từ dưới lên, bắt đầu từ non-leaf node cuối.',
        codeSnippet: `// BUILD MAX-HEAP
// Non-leaf node cuối: index = n/2 - 1 = ${Math.floor(n / 2) - 1}
// Heapify từ dưới lên để đảm bảo subtree đã là heap
for (i = ${Math.floor(n / 2) - 1}; i >= 0; i--) {
    heapify(arr, n, i);
}`,
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: `Max-Heap đã xây dựng xong! Root arr[0]=${array[0]} là giá trị lớn nhất.`,
        codeSnippet: `// Max-Heap hoàn thành!
// arr = [${array.join(', ')}]
// arr[0] = ${array[0]} là MAX
// Bây giờ extract max liên tục...`,
    });

    // Phase 2: Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [0, i],
            sorted: [...sorted],
            description: `Extract: Swap root arr[0]=${array[0]} với arr[${i}]=${array[i]}`,
            codeSnippet: `// EXTRACT MAX
// Swap max (root) với cuối heap
[arr[0], arr[${i}]] = [arr[${i}], arr[0]];
// ${array[0]} ↔ ${array[i]}`,
        });

        [array[0], array[i]] = [array[i], array[0]];

        sorted.push(i);
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `arr[${i}]=${array[i]} đã ở đúng vị trí. Giảm heap size và heapify root.`,
            codeSnippet: `// Phần tử ${array[i]} đã sorted
// Giảm heap size: ${i}
// Heapify root để duy trì Max-Heap
heapify(arr, ${i}, 0);`,
        });

        // Heapify root với heap size giảm
        heapify(i, 0);
    }

    // Mark first element as sorted
    sorted.push(0);

    // Final step
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        description: '[Hoàn thành] Heap Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH HEAP SORT
// Kết quả: [${array.join(', ')}]
//
// ƯU ĐIỂM:
// - O(n log n) worst case - predictable
// - In-place: O(1) space
// - Không có worst case như Quick Sort
//
// NHƯỢC ĐIỂM:
// - Unstable sort
// - Cache-unfriendly (truy cập không liên tục)
// - Hằng số lớn hơn Quick Sort trong practice`,
    });

    return steps;
}

/**
 * generateSortingSteps - Factory function chọn generator phù hợp.
 *
 * Factory Pattern: Tạo object (steps) dựa trên type.
 *
 * @param arr - Mảng cần sắp xếp
 * @param algorithm - Loại thuật toán
 * @returns Mảng các SortingStep
 */
function generateSortingSteps(arr: number[], algorithm: SortingAlgorithmType): SortingStep[] {
    switch (algorithm) {
        case 'bubble':
            return generateBubbleSortSteps(arr);
        case 'selection':
            return generateSelectionSortSteps(arr);
        case 'insertion':
            return generateInsertionSortSteps(arr);
        case 'merge':
            return generateMergeSortSteps(arr);
        case 'quick':
            return generateQuickSortSteps(arr);
        case 'heap':
            return generateHeapSortSteps(arr);
        default:
            // TypeScript exhaustiveness check
            // Nếu thêm algorithm mới mà quên handle, compiler sẽ warn.
            const _exhaustive: never = algorithm;
            return _exhaustive;
    }
}

// =============================================================================
// COMPONENT: SortingVisualizer
// =============================================================================

/**
 * SortingVisualizer Component
 *
 * Component chính để trực quan hóa các thuật toán sắp xếp.
 *
 * @param props - SortingVisualizerProps
 * @returns JSX.Element
 */
const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
    initialArray,
    algorithm,
    title,
    showLegend = true,
    autoStart = false,
    onRegenerate,
    onComplete,
}) => {
    // =========================================================================
    // STATE - Các state của component
    // =========================================================================

    /**
     * steps: Tất cả các bước của thuật toán.
     * Được generate 1 lần khi mount hoặc khi algorithm/initialArray thay đổi.
     */
    const [steps, setSteps] = useState<SortingStep[]>([]);

    /**
     * currentStep: Index của bước hiện tại đang hiển thị.
     */
    const [currentStep, setCurrentStep] = useState(0);

    /**
     * isPlaying: Đang auto-play hay đang pause.
     */
    const [isPlaying, setIsPlaying] = useState(false);

    /**
     * speed: Tốc độ animation (multiplier).
     * 1 = bình thường, 2 = nhanh gấp đôi, 0.5 = chậm gấp đôi.
     */
    const [speed, setSpeed] = useState(1);

    // =========================================================================
    // REFS - References không trigger re-render
    // =========================================================================

    /**
     * intervalRef: Lưu ID của setInterval để có thể clear.
     * Dùng useRef thay vì state vì không cần re-render khi ID thay đổi.
     */
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // =========================================================================
    // COMPUTED VALUES - Giá trị tính toán từ state
    // =========================================================================

    /**
     * currentStepData: Data của step hiện tại.
     * Fallback về empty step nếu không có.
     */
    const currentStepData = steps[currentStep] || {
        array: initialArray,
        comparing: [],
        swapping: [],
        sorted: [],
        description: '',
    };

    /**
     * maxValue: Giá trị lớn nhất trong mảng.
     * Dùng để tính tỷ lệ chiều cao cho ArrayBar.
     * useMemo để tránh tính lại mỗi render.
     */
    const maxValue = useMemo(
        () => Math.max(...initialArray, 1), // Math.max với 1 để tránh 0
        [initialArray]
    );

    /**
     * algoInfo: Metadata của thuật toán hiện tại.
     */
    const algoInfo = ALGORITHM_INFO[algorithm];

    /**
     * isComplete: Đã hoàn thành tất cả steps chưa.
     */
    const isComplete = currentStep >= steps.length - 1;

    // =========================================================================
    // EFFECTS - Side effects
    // =========================================================================

    /**
     * Effect: Generate steps khi algorithm hoặc initialArray thay đổi.
     *
     * Dependencies: [algorithm, initialArray]
     * - Khi algorithm thay đổi → generate lại steps.
     * - Khi initialArray thay đổi → generate lại steps.
     */
    useEffect(() => {
        const newSteps = generateSortingSteps(initialArray, algorithm);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(autoStart);
    }, [algorithm, initialArray, autoStart]);

    /**
     * Effect: Auto-play interval.
     *
     * Khi isPlaying = true: Tạo interval để tự động tiến bước.
     * Khi isPlaying = false hoặc complete: Clear interval.
     *
     * Interval time = BASE_INTERVAL / speed
     * - speed = 1: 800ms/step
     * - speed = 2: 400ms/step
     * - speed = 0.5: 1600ms/step
     *
     * Cleanup function: Clear interval khi effect re-run hoặc unmount.
     */
    useEffect(() => {
        const BASE_INTERVAL = 800; // milliseconds

        if (isPlaying && !isComplete) {
            intervalRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    const next = prev + 1;
                    if (next >= steps.length) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return next;
                });
            }, BASE_INTERVAL / speed);
        } else {
            // Clear interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, speed, steps.length, isComplete]);

    /**
     * Effect: Call onComplete khi hoàn thành.
     */
    useEffect(() => {
        if (isComplete && onComplete && steps.length > 0) {
            const finalArray = steps[steps.length - 1].array;
            onComplete(finalArray);
        }
    }, [isComplete, onComplete, steps]);

    // =========================================================================
    // CALLBACKS - Event handlers
    // =========================================================================

    /**
     * handlePlayPause: Toggle play/pause state.
     */
    const handlePlayPause = useCallback(() => {
        if (isComplete) {
            // Reset và play từ đầu
            setCurrentStep(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((prev) => !prev);
        }
    }, [isComplete]);

    /**
     * handleStepForward: Tiến 1 bước.
     */
    const handleStepForward = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [currentStep, steps.length]);

    /**
     * handleStepBackward: Lùi 1 bước.
     */
    const handleStepBackward = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    /**
     * handleReset: Reset về trạng thái ban đầu.
     */
    const handleReset = useCallback(() => {
        if (onRegenerate) {
            onRegenerate();
        } else {
            setCurrentStep(0);
            setIsPlaying(false);
        }
    }, [onRegenerate]);

    /**
     * handleSpeedChange: Thay đổi tốc độ.
     */
    const handleSpeedChange = useCallback((newSpeed: number) => {
        setSpeed(newSpeed);
    }, []);

    // =========================================================================
    // HELPER FUNCTIONS - Hàm hỗ trợ render
    // =========================================================================

    /**
     * getBarState: Xác định state của bar dựa trên index.
     *
     * Priority order:
     * 1. swapping - cao nhất, đang thực hiện action
     * 2. comparing - đang xem xét
     * 3. pivot - đặc biệt (Quick Sort)
     * 4. sorted - đã hoàn thành
     * 5. normal - mặc định
     */
    const getBarState = (index: number): ArrayBarState => {
        if (currentStepData.swapping.includes(index)) {
            return 'swapping';
        }
        if (currentStepData.comparing.includes(index)) {
            return 'comparing';
        }
        if (currentStepData.pivot === index) {
            return 'pivot';
        }
        if (currentStepData.sorted.includes(index)) {
            return 'sorted';
        }
        return 'normal';
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="viz-container sorting-visualizer">
            {/* Header Section */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || `${algoInfo.nameVi} (${algoInfo.name})`}
                    </h2>
                    <p className="viz-subtitle">
                        Trực quan hóa từng bước của thuật toán
                    </p>
                </div>

                {/* Info Badges */}
                <div className="viz-info-badges">
                    <span className="viz-badge">
                        <i className="fi fi-rr-clock-three"></i> Time: {algoInfo.timeComplexity}
                    </span>
                    <span className="viz-badge">
                        <i className="fi fi-rr-database-management"></i> Space: {algoInfo.spaceComplexity}
                    </span>
                    <span className="viz-badge">
                        {algoInfo.stable ? <><i className="fi fi-br-check"></i> Ổn định</> : <><i className="fi fi-rr-cross"></i> Không ổn định</>}
                    </span>
                </div>
            </header>

            {/* Array Visualization */}
            <div className="viz-array-container">
                <AnimatePresence mode="popLayout">
                    {currentStepData.array.map((value, index) => (
                        <ArrayBar
                            key={`bar-${index}-${value}`}
                            value={value}
                            index={index}
                            state={getBarState(index)}
                            maxValue={maxValue}
                            showValue={currentStepData.array.length <= 15}
                            containerHeight={250}
                            animationDelay={index * 0.02}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Step Description */}
            <motion.div
                className="viz-step-description"
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {currentStepData.description || 'Đang chuẩn bị...'}
            </motion.div>

            {/* Code Snippet Display - Hiển thị code minh họa cho từng bước */}
            {currentStepData.codeSnippet && (
                <motion.div
                    key={`code-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginTop: '8px',
                        border: '1px solid var(--viz-border-primary)',
                        fontFamily: '"Fira Code", "Consolas", monospace',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: 'var(--viz-text-secondary)',
                        whiteSpace: 'pre-wrap',
                        overflowX: 'auto',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px',
                        color: 'var(--viz-color-comparing)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                    }}>
                        <i className="fi fi-rr-code-simple"></i>
                        CODE MINH HỌA
                    </div>
                    {currentStepData.codeSnippet}
                </motion.div>
            )}

            {/* Animation Controls */}
            <AnimationControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={handleSpeedChange}
                currentStep={currentStep}
                totalSteps={steps.length - 1}
                canStepBackward={currentStep > 0}
                canStepForward={currentStep < steps.length - 1}
            />

            {/* Legend */}
            {showLegend && (
                <div className="viz-legend">
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--normal" />
                        <span>Bình thường</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--comparing" />
                        <span>Đang so sánh</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--swapping" />
                        <span>Đang swap</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--sorted" />
                        <span>Đã sắp xếp</span>
                    </div>
                    {algorithm === 'quick' && (
                        <div className="viz-legend-item">
                            <span className="viz-legend-color viz-legend-color--pointer" />
                            <span>Pivot</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// =============================================================================
// DISPLAY NAME
// =============================================================================

SortingVisualizer.displayName = 'SortingVisualizer';

// =============================================================================
// EXPORTS
// =============================================================================

export default SortingVisualizer;
export { SortingVisualizer };
export type { SortingVisualizerProps, SortingStep };
