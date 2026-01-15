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

/**
 * Interface cho mỗi bước của Shell Sort
 */
export interface ShellSortStep {
    gap: number;
    comparing: [number, number];  // Indices đang so sánh
    arrayState: number[];
    swapped: boolean;
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// GAP SEQUENCE GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shell's Original Sequence: n/2, n/4, n/8, ..., 1
 * 
 * ĐẶC ĐIỂM:
 * - Đơn giản nhất
 * - Worst case: O(n²)
 * - Không tối ưu nhưng dễ hiểu
 */
function shellGaps(n: number): number[] {
    const gaps: number[] = [];
    let gap = Math.floor(n / 2);
    while (gap >= 1) {
        gaps.push(gap);
        gap = Math.floor(gap / 2);
    }
    return gaps;
}

/**
 * Knuth's Sequence: 1, 4, 13, 40, 121, ... ((3^k - 1) / 2)
 * 
 * ĐẶC ĐIỂM:
 * - Tốt hơn Shell's sequence
 * - O(n^1.5) average
 */
function knuthGaps(n: number): number[] {
    const gaps: number[] = [];
    let gap = 1;
    // Tìm gap lớn nhất < n/3
    while (gap < Math.floor(n / 3)) {
        gap = gap * 3 + 1;  // 1, 4, 13, 40, 121, ...
    }
    // Thu thập gaps từ lớn → nhỏ
    while (gap >= 1) {
        gaps.push(gap);
        gap = Math.floor((gap - 1) / 3);
    }
    return gaps;
}

/**
 * Hibbard's Sequence: 1, 3, 7, 15, 31, ... (2^k - 1)
 * 
 * ĐẶC ĐIỂM:
 * - O(n^1.5) worst case
 */
function hibbardGaps(n: number): number[] {
    const gaps: number[] = [];
    let k = 1;
    while (Math.pow(2, k) - 1 < n) {
        gaps.unshift(Math.pow(2, k) - 1);  // Thêm vào đầu
        k++;
    }
    return gaps.length > 0 ? gaps : [1];
}

// ═══════════════════════════════════════════════════════════════════════════
// SHELL SORT - MAIN ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shell Sort với Shell's original gap sequence
 * 
 * THUẬT TOÁN CHI TIẾT:
 * 
 * 1. Bắt đầu với gap = n/2
 * 2. Với mỗi gap:
 *    a. Duyệt từ vị trí gap đến n-1
 *    b. Với mỗi phần tử arr[i]:
 *       - Lưu vào temp
 *       - So sánh với phần tử cách gap vị trí (arr[j-gap])
 *       - Nếu lớn hơn → dịch arr[j-gap] lên vị trí j
 *       - Lặp lại với j-gap cho đến khi tìm đúng vị trí
 *       - Đặt temp vào vị trí đúng
 * 3. Giảm gap (gap = gap/2)
 * 4. Lặp lại cho đến gap = 0
 * 
 * @param arr - Mảng cần sắp xếp (in-place)
 */
export function shellSort(arr: number[]): void {
    const n = arr.length;

    // Bắt đầu với gap = n/2, giảm dần đến 1
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {

        // Thực hiện gapped insertion sort cho gap này
        // Các phần tử đầu tiên (0 đến gap-1) đã là "sorted" trong nhóm của chúng
        // Bắt đầu từ phần tử thứ gap
        for (let i = gap; i < n; i++) {

            // Lưu arr[i] để chèn vào vị trí đúng
            const temp = arr[i];

            // Dịch các phần tử đã sorted trong nhóm này
            // về phía trước cho đến khi tìm được vị trí cho temp
            let j = i;

            // So sánh với phần tử cách gap vị trí
            // Dịch lên nếu lớn hơn temp
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];  // Dịch phần tử về phía cuối
                j -= gap;
            }

            // Đặt temp vào vị trí đúng
            arr[j] = temp;
        }
    }
}

/**
 * Shell Sort với Knuth's gap sequence (tối ưu hơn)
 */
export function shellSortKnuth(arr: number[]): void {
    const n = arr.length;
    const gaps = knuthGaps(n);

    for (const gap of gaps) {
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

// ═══════════════════════════════════════════════════════════════════════════
// SHELL SORT WITH VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shell Sort với từng bước visualization
 */
export function shellSortWithSteps(arr: number[]): ShellSortStep[] {
    const steps: ShellSortStep[] = [];
    const workArr = [...arr];
    const n = workArr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {

        for (let i = gap; i < n; i++) {
            const temp = workArr[i];
            let j = i;

            while (j >= gap && workArr[j - gap] > temp) {
                // Ghi lại bước so sánh và swap
                steps.push({
                    gap,
                    comparing: [j - gap, j],
                    arrayState: [...workArr],
                    swapped: true,
                    message: `Gap=${gap}: So sánh arr[${j - gap}]=${workArr[j - gap]} với temp=${temp}, dịch chuyển`
                });

                workArr[j] = workArr[j - gap];
                j -= gap;
            }

            if (j !== i) {
                workArr[j] = temp;
                steps.push({
                    gap,
                    comparing: [j, i],
                    arrayState: [...workArr],
                    swapped: false,
                    message: `Gap=${gap}: Đặt ${temp} vào vị trí ${j}`
                });
            }
        }

        // Ghi lại trạng thái sau mỗi gap
        steps.push({
            gap,
            comparing: [-1, -1],
            arrayState: [...workArr],
            swapped: false,
            message: `✓ Hoàn thành Gap=${gap}: [${workArr.join(', ')}]`
        });
    }

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Shell Sort với ví dụ minh họa chi tiết
 */
export function demonstrateShellSort(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('           SHELL SORT DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const arr = [8, 5, 1, 3, 9, 2, 7, 4, 6];
    console.log('Mảng ban đầu:', arr);
    console.log('Gap sequence (Shell):', shellGaps(arr.length));
    console.log('Gap sequence (Knuth):', knuthGaps(arr.length));

    const steps = shellSortWithSteps([...arr]);

    console.log('\n--- Chi tiết từng bước ---\n');

    let currentGap = -1;
    for (const step of steps) {
        if (step.gap !== currentGap) {
            console.log(`\n=== Processing Gap = ${step.gap} ===`);
            currentGap = step.gap;
        }
        console.log(step.message);
    }

    const sorted = [...arr];
    shellSort(sorted);
    console.log('\n[OK] Kết quả cuối cùng:', sorted);

    // So sánh các gap sequences
    console.log('\n--- So sánh Gap Sequences ---');

    const testArr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));

    // Shell's gaps
    const arr1 = [...testArr];
    const start1 = performance.now();
    shellSort(arr1);
    const time1 = performance.now() - start1;

    // Knuth's gaps
    const arr2 = [...testArr];
    const start2 = performance.now();
    shellSortKnuth(arr2);
    const time2 = performance.now() - start2;

    console.log(`Shell's gaps: ${time1.toFixed(3)}ms`);
    console.log(`Knuth's gaps: ${time2.toFixed(3)}ms`);
}

/**
 * Export default
 */
export default {
    shellSort,
    shellSortKnuth,
    shellSortWithSteps,
    demonstrateShellSort,
    // Export gap generators
    shellGaps,
    knuthGaps,
    hibbardGaps
};
