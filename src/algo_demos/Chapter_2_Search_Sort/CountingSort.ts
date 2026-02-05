/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COUNTING SORT - SẮP XẾP ĐẾM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Counting Sort là thuật toán sắp xếp KHÔNG SO SÁNH (Non-comparison sort).
 * Đếm số lần xuất hiện của mỗi giá trị, rồi xây dựng mảng kết quả.
 * 
 * Ý TƯỞNG:
 * - Nếu biết range của dữ liệu [min, max], có thể ĐẾM số lần xuất hiện
 * - Từ count, tính vị trí của mỗi phần tử trong mảng kết quả
 * - Không cần so sánh giữa các phần tử!
 * 
 * THUẬT TOÁN:
 * 1. Tìm min và max trong mảng
 * 2. Tạo mảng đếm count[max - min + 1]
 * 3. Đếm số lần xuất hiện: count[arr[i] - min]++
 * 4. Tính cumulative count: count[i] += count[i-1]
 * 5. Xây dựng output từ cuối → đầu (để stable)
 * 
 * VÍ DỤ:
 * arr = [4, 2, 2, 8, 3, 3, 1]
 * min = 1, max = 8, k = 8
 * 
 * Bước 3 - Đếm:
 * count = [1, 2, 2, 1, 0, 0, 0, 1]
 *          1  2  3  4  5  6  7  8
 * 
 * Bước 4 - Cumulative:
 * count = [1, 3, 5, 6, 6, 6, 6, 7]
 * 
 * Bước 5 - Xây output (từ cuối):
 * → [1, 2, 2, 3, 3, 4, 8] [OK]
 * 
 * ĐỘ PHỨC TẠP:
 * - Time: O(n + k) với k = max - min + 1 (range)
 * - Space: O(n + k)
 * 
 * ⚠️ KHI NÀO COUNTING SORT TỐT?
 * - k = O(n): Rất nhanh, O(n f)
 * - k >> n: Tốn bộ nhớ và chậm, dùng sort khác
 * 
 * SO SÁNH VỚI CÁC THUẬT TOÁN KHÁC:
 * | Thuật toán    | Type           | Time       | Space      | Stable |
 * |---------------|----------------|------------|------------|--------|
 * | Quick Sort    | Comparison     | O(n log n) | O(log n)   | No     |
 * | Merge Sort    | Comparison     | O(n log n) | O(n)       | Yes    |
 * | Counting Sort | Non-comparison | O(n + k)   | O(k)       | Yes    |
 * | Radix Sort    | Non-comparison | O(d(n + k))| O(n + k)   | Yes    |
 * 
 * ƯU ĐIỂM:
 * + O(n) khi k = O(n) - nhanh hơn O(n log n)
 * + Stable sort (giữ thứ tự tương đối)
 * + Đơn giản, dễ implement
 * + Là building block cho Radix Sort
 * 
 * NHƯỢC ĐIỂM:
 * - Chỉ áp dụng cho số nguyên (hoặc keys rời rạc)
 * - Tốn O(k) bộ nhớ - không tốt nếu range lớn
 * - Không hoạt động với số âm (cần offset)
 * - Không hoạt động với floating point
 * 
 * @module CountingSort
 * @category AlgoDemos/Sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// COUNTING SORT - MAIN ALGORITHM

// ═══════════════════════════════════════════════════════════════════════════
// COUNTING SORT - MAIN ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Counting Sort
 * 
 * THUẬT TOÁN CHI TIẾT:
 * 
 * 1. TÌM MIN VÀ MAX
 *    - Xác định range của dữ liệu
 *    - k = max - min + 1
 * 
 * 2. ĐẾM SỐ LẦN XUẤT HIỆN
 *    - count[x - min]++ cho mỗi phần tử x
 *    - Offset bởi min để xử lý số âm
 * 
 * 3. TÍNH CUMULATIVE COUNT
 *    - count[i] = count[i] + count[i-1]
 *    - Sau bước này, count[x] = số phần tử ≤ x
 *    - Cũng là vị trí CUỐI CÙNG của x trong output
 * 
 * 4. XÂY DỰNG OUTPUT
 *    - Duyệt input từ CUỐI → ĐẦU (để stable)
 *    - output[count[x] - 1] = x
 *    - count[x]-- (chuẩn bị cho phần tử tiếp theo cùng giá trị)
 * 
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng đã sorted
 */
export function countingSort(arr: number[]): number[] {
    if (arr.length <= 1) return [...arr];

    // BƯỚC 1: Tìm min và max
    let min = arr[0];
    let max = arr[0];
    for (const num of arr) {
        if (num < min) min = num;
        if (num > max) max = num;
    }

    const k = max - min + 1;  // Range của giá trị

    // BƯỚC 2: Đếm số lần xuất hiện
    const count: number[] = new Array(k).fill(0);
    for (const num of arr) {
        count[num - min]++;  // Offset bởi min
    }

    // BƯỚC 3: Tính cumulative count
    for (let i = 1; i < k; i++) {
        count[i] += count[i - 1];
    }

    // BƯỚC 4: Xây dựng output
    // PHASE 1: Đếm
    const output: number[] = new Array(arr.length);

    // [IMPORTANT] QUAN TRỌNG: Duyệt từ CUỐI → ĐẦU để giữ STABLE
    for (let i = arr.length - 1; i >= 0; i--) {
        const num = arr[i];
        const index = count[num - min] - 1;  // Vị trí trong output
        output[index] = num;
        count[num - min]--;  // Giảm count cho phần tử tiếp theo
    }

    return output;
}

/**
 * Counting Sort in-place (modify original array)
 */
export function countingSortInPlace(arr: number[]): void {
    const result = countingSort(arr);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = result[i];
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// COUNTING SORT WITH VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Counting Sort với từng bước visualization
 */
import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateCountingSortSteps - Tạo các bước cho Counting Sort.
 * 
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateCountingSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const n = arr.length;
    if (n === 0) return steps;

    // Phase 1: Find Min/Max
    let min = arr[0];
    let max = arr[0];
    for (const num of arr) {
        if (num < min) min = num;
        if (num > max) max = num;
    }
    const range = max - min + 1;

    steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [],
        description: `Bắt đầu Counting Sort. Range: [${min}, ${max}] (k=${range}).`,
        codeSnippet: `// COUNTING SORT
// 1. Đếm tần suất
// 2. Tính vị trí
// 3. Xây dựng mảng kết quả`,
    });

    // Phase 2: Count
    const count: number[] = new Array(range).fill(0);

    // Visualize variable-speed counting? Just do it in chunks or one pass.
    for (let i = 0; i < n; i++) {
        const num = arr[i];
        count[num - min]++;

        // Visualize scanning? Might be too slow for large arrays, but okay for demo.
        steps.push({
            array: [...arr],
            comparing: [i],
            swapping: [],
            sorted: [],
            description: `Đếm: arr[${i}]=${num}. count[${num - min}] = ${count[num - min]}`,
            codeSnippet: `count[arr[${i}] - min]++;`,
        });
    }

    // Phase 3: Cumulative
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Đã tính toán mảng cộng dồn (Cumulative Count). Bắt đầu xây dựng mảng kết quả.',
        codeSnippet: `// Cumulative Count Calculated`,
    });

    // Phase 4: Build Output
    // Since we can't show a 2nd array, we will visualize the "sorted array" being built locally 
    // and then assume we copy it back?
    // Or we can simulate the stable placement into a NEW array, but we can only show ONE array.
    // Hack: We will show the "Output" array overwriting the "Input" array step-by-step?
    // Be careful: Overwriting input destroys info needed for later steps IF we were doing it in-place without aux.
    // But here we have real `output` array. We can make the visualization show the `output` array state 
    // assuming un-filled spots are 0 or original?

    // Better visualization for single-array view:
    // Just show the final sorted inputs appearing in the correct positions.
    // BUT Counting Sort (Stable) builds from back to front.

    // Let's perform the valid sort logic first to get the output, capturing steps.
    // Wait, if I show `output` array, it will be mostly empty initially.
    // If I show `arr`, it's full.
    // Transition: "Switching view to Output Array"

    // To minimize confusion, let's keep showing `arr` but assume we are constructing `output` separately,
    // and then at the end we show the full swap.
    // OR: We visualize the "Copy Back" phase which is common.
    // Let's do the "Build Output" into a temp array, then "Copy Back" frame by frame.

    const outputArr: number[] = new Array(n).fill(0);
    // Use a copy of count for logic
    const countCopy = [...count];

    // Standard Stable construction
    for (let i = n - 1; i >= 0; i--) {
        const num = arr[i];
        const index = countCopy[num - min] - 1;
        outputArr[index] = num;
        countCopy[num - min]--;
    }

    // Now visualize copying back to `arr`
    steps.push({
        array: [...arr], // Still showing input
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Đã xây dựng xong mảng kết quả (trong bộ nhớ phụ). Sao chép ngược lại vào mảng chính.',
        codeSnippet: `// Copy output -> arr`,
    });

    const finalArr = [...arr];
    for (let i = 0; i < n; i++) {
        finalArr[i] = outputArr[i];
        steps.push({
            array: [...finalArr],
            comparing: [],
            swapping: [i], // Highlight the write
            sorted: Array.from({ length: i + 1 }, (_, k) => k),
            description: `Sao chép: arr[${i}] = ${finalArr[i]}`,
            codeSnippet: `arr[${i}] = output[${i}];`,
        });
    }

    // Final
    steps.push({
        array: [...finalArr],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        description: '[Hoàn thành] Mảng đã được sắp xếp!',
        codeSnippet: `// ✓ HOÀN THÀNH`,
    });

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// COUNTING SORT FOR RANGE (Sử dụng trong Radix Sort)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Counting Sort với fixed range 0-9 (dùng cho Radix Sort)
 * 
 * @param arr - Mảng gốc
 * @param getKey - Function lấy key (0-9) từ mỗi phần tử
 */
export function countingSortByKey(
    arr: number[],
    getKey: (num: number) => number
): number[] {
    const n = arr.length;
    const count: number[] = new Array(10).fill(0);
    const output: number[] = new Array(n);

    // Đếm
    for (const num of arr) {
        count[getKey(num)]++;
    }

    // Cumulative
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Output (từ cuối để stable)
    for (let i = n - 1; i >= 0; i--) {
        const key = getKey(arr[i]);
        output[count[key] - 1] = arr[i];
        count[key]--;
    }

    return output;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Counting Sort
 */
export function demonstrateCountingSort(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('           COUNTING SORT DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const arr = [4, 2, 2, 8, 3, 3, 1, 5];
    console.log('Mảng ban đầu:', arr);
    console.log('Min:', Math.min(...arr), '| Max:', Math.max(...arr));
    console.log('Range k:', Math.max(...arr) - Math.min(...arr) + 1);

    // Chi tiết từng bước
    const steps = generateCountingSortSteps([...arr]);

    console.log('\n--- Chi tiết từng bước ---\n');
    for (const step of steps) {
        console.log(step.description);
    }

    const sorted = countingSort(arr);
    console.log('\n[OK] Kết quả cuối cùng:', sorted);

    // So sánh hiệu suất
    console.log('\n\n--- Khi nào Counting Sort hiệu quả? ---\n');

    const cases = [
        { name: 'k = n (good)', arr: [5, 2, 8, 1, 9, 3, 7, 4, 6] },
        { name: 'k << n (best)', arr: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2] },
        { name: 'k >> n (bad)', arr: [1, 1000000] }
    ];

    for (const c of cases) {
        const min = Math.min(...c.arr);
        const max = Math.max(...c.arr);
        const k = max - min + 1;
        const n = c.arr.length;

        console.log(`${c.name}:`);
        console.log(`  n = ${n}, k = ${k}, k/n ratio = ${(k / n).toFixed(2)}`);
        console.log(`  Time: O(n + k) = O(${n} + ${k}) = O(${n + k})`);
        console.log(`  So với O(n log n) = O(${n} × ${Math.log2(n).toFixed(1)}) = O(${Math.round(n * Math.log2(n))})`);
        console.log();
    }
}

/**
 * Export default
 */
export default {
    countingSort,
    countingSortInPlace,
    generateCountingSortSteps,
    countingSortByKey,
    demonstrateCountingSort
};
