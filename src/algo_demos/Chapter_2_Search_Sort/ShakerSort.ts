/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHAKER SORT (COCKTAIL SORT) - SẮP XẾP LẮC
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Shaker Sort (Cocktail Sort) là biến thể CẢI TIẾN của Bubble Sort.
 * Còn gọi là: Cocktail Shaker Sort, Bidirectional Bubble Sort, Ripple Sort.
 * 
 * Ý TƯỞNG:
 * - Bubble Sort chỉ duyệt 1 CHIỀU (trái → phải)
 * - Shaker Sort duyệt 2 CHIỀU (trái → phải, rồi phải → trái)
 * - Mỗi pass, cả phần tử lớn nhất VÀ nhỏ nhất được đặt đúng vị trí
 * 
 * THUẬT TOÁN:
 * 1. Duyệt từ trái → phải: Đưa MAX lên cuối
 * 2. Duyệt từ phải → trái: Đưa MIN xuống đầu
 * 3. Thu hẹp range: left++, right--
 * 4. Lặp lại cho đến khi left >= right hoặc không có swap
 * 
 * VÍ DỤ:
 * arr = [5, 1, 4, 2, 8, 0, 2]
 * 
 * Pass 1 (→): [1, 4, 2, 5, 0, 2, 8]  ← 8 về cuối
 * Pass 1 (←): [0, 1, 4, 2, 5, 2, 8]  ← 0 về đầu
 * Pass 2 (→): [0, 1, 2, 4, 2, 5, 8]  ← 5 về gần cuối
 * Pass 2 (←): [0, 1, 2, 2, 4, 5, 8]  ← 2 về vị trí đúng
 * [OK] Sorted!
 * 
 * ĐỘ PHỨC TẠP:
 * - Best: O(n) - mảng đã sorted
 * - Average: O(n²)
 * - Worst: O(n²) - mảng sorted ngược
 * - Space: O(1) - in-place
 * 
 * SO SÁNH VỚI BUBBLE SORT:
 * |   Tiêu chí   | Bubble Sort | Shaker Sort |
 * |--------------|-------------|-------------|
 * | Hướng duyệt  | 1 chiều     | 2 chiều     |
 * | Số pass      | ~n          | ~n/2        |
 * | Với "turtle" | Chậm        | Nhanh hơn   |
 * | Complexity   | O(n²)       | O(n²)       |
 * | Stable       | Yes         | Yes         |
 * 
 * VẤN ĐỀ "TURTLE" VÀ "RABBIT":
 * - Rabbit: Phần tử lớn ở đầu mảng → nhanh chóng về cuối (OK)
 * - Turtle: Phần tử nhỏ ở cuối mảng → chậm về đầu (PROBLEM!)
 * - Shaker Sort giải quyết vấn đề Turtle bằng cách duyệt ngược
 * 
 * ƯU ĐIỂM:
 * + Nhanh hơn Bubble Sort (giải quyết turtle problem)
 * + Stable sort
 * + In-place (O(1) space)
 * + Adaptive (dừng sớm nếu đã sorted)
 * + Đơn giản, dễ hiểu
 * 
 * NHƯỢC ĐIỂM:
 * - Vẫn O(n²) - chậm với dữ liệu lớn
 * - Không phù hợp cho production
 * - Chỉ cải tiến constant factor
 * 
 * @module ShakerSort
 * @category AlgoDemos/Sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateShakerSortSteps - Tạo các bước cho Shaker Sort.
 * 
 * THUẬT TOÁN:
 * Shaker Sort (Cocktail Sort) là cải tiến của Bubble Sort:
 * - Duyệt 2 chiều: Trái -> Phải (đưa max về cuối) rồi Phải -> Trái (đưa min về đầu).
 * - Giúp giải quyết vấn đề "rùa" (giá trị nhỏ ở cuối mảng).
 * 
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateShakerSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    let left = 0;
    let right = n - 1;
    let swapped = true;
    let pass = 1;

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Shaker Sort (Cocktail Sort). Duyệt 2 chiều để đẩy min/max về 2 đầu.',
        codeSnippet: `// SHAKER SORT
// Pass 1: Trái -> Phải (Bubble Up Max)
// Pass 2: Phải -> Trái (Bubble Down Min)
while (left < right && swapped) {
    // ... forward pass ...
    // ... backward pass ...
}`,
    });

    while (left < right && swapped) {
        swapped = false;

        // --- Forward Pass (Left -> Right) ---
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Pass ${pass} (Forward): Duyệt từ ${left} đến ${right}. Đẩy phần tử lớn nhất về cuối.`,
            codeSnippet: `// Forward Pass: Tìm Max
for (i = left; i < right; i++) {
    if (arr[i] > arr[i+1]) swap...
}
right--;`,
        });

        for (let i = left; i < right; i++) {
            steps.push({
                array: [...array],
                comparing: [i, i + 1],
                swapping: [],
                sorted: [...sorted],
                description: `So sánh arr[${i}]=${array[i]} và arr[${i + 1}]=${array[i + 1]}`,
                codeSnippet: `if (arr[${i}] > arr[${i + 1}])`,
            });

            if (array[i] > array[i + 1]) {
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [i, i + 1],
                    sorted: [...sorted],
                    description: `${array[i]} > ${array[i + 1]} → Swap`,
                    codeSnippet: `swap(arr[${i}], arr[${i + 1}]);
swapped = true;`,
                });
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapped = true;
            }
        }

        // Element at `right` is now sorted (Max)
        sorted.unshift(right); // Add to beginning to keep logic simple, or just manage `sorted` list
        right--;

        if (!swapped) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [],
                sorted: [...sorted, ...Array.from({ length: n }, (_, k) => k).filter(k => !sorted.includes(k))], // Valid visualization of full sort
                description: 'Không có swap nào trong lượt đi -> Mảng đã sắp xếp.',
                codeSnippet: `if (!swapped) break;`,
            });
            break;
        }

        swapped = false;

        // --- Backward Pass (Right -> Left) ---
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Pass ${pass} (Backward): Duyệt từ ${right} về ${left}. Đẩy phần tử nhỏ nhất về đầu.`,
            codeSnippet: `// Backward Pass: Tìm Min
for (i = right; i > left; i--) {
    if (arr[i] < arr[i-1]) swap...
}
left++;`,
        });

        for (let i = right; i > left; i--) {
            steps.push({
                array: [...array],
                comparing: [i - 1, i],
                swapping: [],
                sorted: [...sorted],
                description: `So sánh arr[${i}]=${array[i]} và arr[${i - 1}]=${array[i - 1]}`,
                codeSnippet: `if (arr[${i}] < arr[${i - 1}])`,
            });

            if (array[i] < array[i - 1]) {
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [i - 1, i],
                    sorted: [...sorted],
                    description: `${array[i]} < ${array[i - 1]} → Swap`,
                    codeSnippet: `swap(arr[${i}], arr[${i - 1}]);
swapped = true;`,
                });
                [array[i], array[i - 1]] = [array[i - 1], array[i]];
                swapped = true;
            }
        }

        // Element at `left` is now sorted (Min)
        sorted.push(left);
        left++;
        pass++;
    }

    // Final sorted state update
    // Recalculate all sorted indices just to be sure
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Shaker Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH
// Kết quả: [${array.join(', ')}]`,
    });

    return steps;
}

/**
 * Shaker Sort implementation
 */
export function shakerSort(arr: number[]): void {
    let left = 0;
    let right = arr.length - 1;
    let swapped = true;
    while (left < right && swapped) {
        swapped = false;
        for (let i = left; i < right; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        right--;
        if (!swapped) break;
        swapped = false;
        for (let i = right; i > left; i--) {
            if (arr[i] < arr[i - 1]) {
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                swapped = true;
            }
        }
        left++;
    }
}

export default {
    shakerSort,
    generateShakerSortSteps
};
