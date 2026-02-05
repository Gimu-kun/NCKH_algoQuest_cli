/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHELL SORT - SẮP XẾP VỎ SÒ
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Shell Sort là phiên bản CẢI TIẾN của Insertion Sort.
 * Được đặt theo tên người phát minh Donald Shell (1959).
 * Còn gọi là "Diminishing Increment Sort".
 * 
 * Ý TƯỞNG CHÍNH:
 * - Insertion Sort hiệu quả với mảng GẦN NHƯ ĐÃ SẮP XẾP
 * - Shell Sort chia mảng thành các nhóm cách nhau một khoảng GAP
 * - Insertion Sort từng nhóm, rồi GIẢM GAP dần
 * - Khi GAP = 1, thực hiện Insertion Sort cuối cùng (mảng gần sorted)
 * 
 * THUẬT TOÁN:
 * 1. Chọn dãy GAP (ví dụ: n/2, n/4, n/8, ..., 1)
 * 2. Với mỗi GAP:
 *    - Chia mảng thành các nhóm cách nhau GAP vị trí
 *    - Insertion Sort từng nhóm
 * 3. Lặp lại với GAP nhỏ hơn cho đến GAP = 1
 * 
 * VÍ DỤ (GAP = n/2, n/4, ...):
 * arr = [8, 5, 1, 3, 9, 2] (n = 6)
 * 
 * GAP = 3: Nhóm (0,3), (1,4), (2,5)
 *   [8] và [3] → swap → [3, 5, 1, 8, 9, 2]
 *   [5] và [9] → OK
 *   [1] và [2] → OK
 *   → [3, 5, 1, 8, 9, 2]
 * 
 * GAP = 1: Insertion Sort thông thường
 *   → [1, 2, 3, 5, 8, 9] [OK]
 * 
 * ĐỘ PHỨC TẠP:
 * - Phụ thuộc vào dãy GAP được chọn!
 * 
 * | Dãy GAP              | Time Complexity |
 * |----------------------|-----------------|
 * | Shell's (n/2)        | O(n²) worst     |
 * | Hibbard's (2^k - 1)  | O(n^1.5)        |
 * | Knuth's (3^k - 1)/2  | O(n^1.5)        |
 * | Sedgewick's          | O(n^(4/3))      |
 * 
 * SO SÁNH VỚI CÁC THUẬT TOÁN KHÁC:
 * |   Thuật toán   |        Average      |   Space  | Stable |         Đặc điểm            |
 * |----------------|---------------------|----------|--------|-----------------------------|
 * | Insertion Sort | O(n²)               | O(1)     |  Yes   | Tốt cho mảng nhỏ/gần sorted |
 * | Shell Sort     | O(n^1.3) ~ O(n^1.5) | O(1)     |  No    | Cải tiến Insertion          |
 * | Quick Sort     | O(n log n)          | O(log n) |  No    | Nhanh nhất thực tế          |
 * | Merge Sort     | O(n log n)          | O(n)     |  Yes   | Ổn định, cần bộ nhớ         |
 * 
 * ƯU ĐIỂM:
 * + Nhanh hơn Insertion Sort đáng kể
 * + In-place (O(1) space)
 * + Đơn giản hơn Quick Sort, Merge Sort
 * + Tốt cho medium-sized arrays
 * + Adaptive (tốt với dữ liệu gần sorted)
 * 
 * NHƯỢC ĐIỂM:
 * - KHÔNG Stable (thứ tự có thể đảo)
 * - Độ phức tạp phụ thuộc vào GAP sequence
 * - Khó chứng minh độ phức tạp chính xác
 * - Chậm hơn O(n log n) sorts với dữ liệu lớn
 * 
 * @module ShellSort
 * @category AlgoDemos/Sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateShellSortSteps - Tạo các bước cho Shell Sort.
 * 
 * THUẬT TOÁN:
 * Shell Sort là cải tiến của Insertion Sort.
 * - Sắp xếp theo các gap giảm dần (ví dụ: n/2, n/4... 1).
 * - "Insertion Sort" trên các subarray cách nhau `gap`.
 * - Gap = 1 chính là Insertion Sort tiêu chuẩn (lúc này mảng đã gần sorted).
 * 
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateShellSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    // sorted state is hard to track effectively in Shell Sort until the end

    // Initial State
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Shell Sort. Sử dụng Gap sequence giảm dần.',
        codeSnippet: `// SHELL SORT
// Insertion Sort với bước nhảy Gap
for (gap = n/2; gap > 0; gap /= 2) {
    for (i = gap; i < n; i++) {
        // Shift phần tử về đúng vị trí trong gap-group
    }
}`,
    });

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [],
            description: `Khởi tạo Gap = ${gap}. Thực hiện Insertion Sort cho các nhóm cách nhau ${gap}.`,
            codeSnippet: `gap = ${gap}; // Bắt đầu vòng lặp mới`,
        });

        for (let i = gap; i < n; i++) {
            const temp = array[i];
            let j = i;

            steps.push({
                array: [...array],
                comparing: [i], // Highlight current element
                swapping: [],
                sorted: [],
                description: `Xét phần tử arr[${i}]=${array[i]} (Gap=${gap})`,
                codeSnippet: `temp = arr[${i}]; // ${temp}
j = ${i};`,
            });

            // Compare and shift
            while (j >= gap && array[j - gap] > temp) {
                steps.push({
                    array: [...array],
                    comparing: [j - gap, j],
                    swapping: [], // Visualizing shift, not direct swap yet, but highlighting comparison
                    sorted: [],
                    description: `So sánh: arr[${j - gap}]=${array[j - gap]} > temp=${temp}. Dịch chuyển ${array[j - gap]} sang vị trí ${j}.`,
                    codeSnippet: `while (arr[${j - gap}] > temp) {
    arr[${j}] = arr[${j - gap}];
    j -= ${gap};
}`,
                });

                array[j] = array[j - gap];

                // Show state after shift
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [j, j - gap], // Highlight the movement
                    sorted: [],
                    description: `Dịch chuyển xong: arr[${j}] = ${array[j]}. Tiếp tục lùi lại ${gap} bước.`,
                    codeSnippet: `arr[${j}] = ${array[j]}; // Shifted`,
                });

                j -= gap;
            }

            // Found correct position for temp
            if (j !== i) {
                array[j] = temp;
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [j],
                    sorted: [],
                    description: `Đặt temp=${temp} vào vị trí đúng trong nhóm: arr[${j}]`,
                    codeSnippet: `arr[${j}] = temp; // ${temp}`,
                });
            } else {
                steps.push({
                    array: [...array],
                    comparing: [j],
                    swapping: [],
                    sorted: [],
                    description: `Phần tử ${temp} đã ở đúng vị trí (không cần dịch chuyển).`,
                    codeSnippet: `// No shift needed`,
                });
            }
        }
    }

    // Final sorted state
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Shell Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH
// Kết quả: [${array.join(', ')}]`,
    });

    return steps;
}

/**
 * Shell Sort implementation
 */
export function shellSort(arr: number[]): void {
    const n = arr.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}

/**
 * Helper to get different gap sequences (for info only now)
 */
export function shellGaps(n: number): number[] {
    const gaps: number[] = [];
    let gap = Math.floor(n / 2);
    while (gap >= 1) {
        gaps.push(gap);
        gap = Math.floor(gap / 2);
    }
    return gaps;
}

export function knuthGaps(n: number): number[] {
    const gaps: number[] = [];
    let gap = 1;
    while (gap < Math.floor(n / 3)) {
        gap = gap * 3 + 1;
    }
    while (gap >= 1) {
        gaps.push(gap);
        gap = Math.floor((gap - 1) / 3);
    }
    return gaps;
}

export default {
    shellSort,
    generateShellSortSteps,
    shellGaps,
    knuthGaps
};
