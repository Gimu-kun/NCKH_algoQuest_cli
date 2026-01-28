/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * INTERCHANGE SORT - SẮP XẾP ĐỔI CHỖ TRỰC TIẾP
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Interchange Sort là thuật toán sắp xếp ĐƠN GIẢN NHẤT.
 * So sánh MỌI cặp phần tử và swap nếu không đúng thứ tự.
 * 
 * Ý TƯỞNG:
 * - Với mỗi phần tử arr[i], so sánh với TẤT CẢ phần tử phía sau (arr[j])
 * - Nếu arr[i] > arr[j] → swap ngay lập tức
 * - Sau mỗi vòng i, arr[i] là phần tử nhỏ nhất trong phần chưa sorted
 * 
 * THUẬT TOÁN:
 * For i = 0 to n-2:
 *     For j = i+1 to n-1:
 *         If arr[i] > arr[j]:
 *             Swap(arr[i], arr[j])
 * 
 * SO SÁNH VỚI CÁC THUẬT TOÁN TƯƠNG TỰ:
 * 
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ Thuật toán  |          Ý tưởng         |      Số swap       | Số so sánh |
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Interchange | Swap ngay khi sai thứ tự | Nhiều nhất         | n(n-1)/2   |
 * │ Selection   | Tìm min rồi swap 1 lần   | n-1                | n(n-1)/2   |
 * │ Bubble      | Swap cặp liền kề         | Ít hơn Interchange | n(n-1)/2   |
 * └──────────────────────────────────────────────────────────────────────────┘
 * 
 * KHÁC VỚI SELECTION SORT:
 * - Selection Sort: Tìm MIN rồi mới swap (1 swap/vòng)
 * - Interchange Sort: Swap NGAY khi phát hiện sai thứ tự (nhiều swap/vòng)
 * 
 * KHÁC VỚI BUBBLE SORT:
 * - Bubble Sort: Chỉ swap các phần tử LIỀN KỀ (adjacent)
 * - Interchange Sort: Swap BẤT KỲ 2 phần tử nào
 * 
 * VÍ DỤ:
 * arr = [5, 3, 8, 1]
 * 
 * i=0: Compare 5 với {3,8,1}
 *      5>3 → swap [3,5,8,1]
 *      3>8 → no
 *      3>1 → swap [1,5,8,3]
 * 
 * i=1: Compare 5 với {8,3}
 *      5>8 → no
 *      5>3 → swap [1,3,8,5]
 * 
 * i=2: Compare 8 với {5}
 *      8>5 → swap [1,3,5,8] [OK]
 * 
 * ĐỘ PHỨC TẠP:
 * - Best: O(n²) - Không có early termination!
 * - Average: O(n²)
 * - Worst: O(n²)
 * - Space: O(1) - in-place
 * 
 * [!] ĐIỂM KHÁC BIỆT QUAN TRỌNG:
 * - Interchange Sort KHÔNG có early termination
 * - Bubble Sort có thể dừng sớm nếu không có swap
 * - Interchange Sort LUÔN chạy n(n-1)/2 lần so sánh
 * 
 * ƯU ĐIỂM:
 * + Cực kỳ đơn giản, dễ hiểu
 * + In-place (O(1) space)
 * + Dễ code, ít bug
 * 
 * NHƯỢC ĐIỂM:
 * - Chậm nhất trong O(n²) sorts
 * - Không adaptive (luôn O(n²))
 * - Nhiều swap không cần thiết
 * - KHÔNG Stable (có thể đảo thứ tự bằng nhau)
 * 
 * KHI NÀO DÙNG:
 * - Học thuật, minh họa concept
 * - Mảng rất nhỏ (<10 phần tử)
 * - Không quan tâm performance
 * 
 * @module InterchangeSort
 * @category AlgoDemos/Sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho mỗi bước của Interchange Sort
 */
export interface InterchangeSortStep {
    i: number;                    // Index phần tử đang xét
    j: number;                    // Index phần tử so sánh
    comparing: [number, number];  // Values đang so sánh
    arrayState: number[];
    swapped: boolean;
    totalSwaps: number;
    totalComparisons: number;
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERCHANGE SORT - MAIN ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interchange Sort
 * 
 * THUẬT TOÁN CHI TIẾT:
 * 
 * 1. Duyệt i từ 0 đến n-2 (phần tử đang xét)
 * 2. Với mỗi i, duyệt j từ i+1 đến n-1 (các phần tử sau i)
 * 3. Nếu arr[i] > arr[j]:
 *    - Swap ngay lập tức
 *    - Sau swap, arr[i] mới sẽ tiếp tục được so sánh
 * 4. Sau khi xong vòng j, arr[i] là phần tử nhỏ nhất cần đặt ở i
 * 
 * MINH HỌA:
 * 
 * arr = [5, 3, 2, 4, 1]
 * 
 * i=0: │ 5│ 3  2  4  1  → 5>3 swap
 *      │ 3│ 5  2  4  1  → 3>5 no
 *      │ 3│ 5  2  4  1  → 3>2 swap
 *      │ 2│ 5  3  4  1  → 2>4 no
 *      │ 2│ 5  3  4  1  → 2>1 swap
 *      │ 1│ 5  3  4  2  ← i=0 done, min (1) at position 0
 * 
 * i=1:   1 │ 5│ 3  4  2  → 5>3 swap
 *        1 │ 3│ 5  4  2  → 3>4 no
 *        1 │ 3│ 5  4  2  → 3>2 swap
 *        1 │ 2│ 5  4  3  ← i=1 done, second min (2) at position 1
 * 
 * ... tiếp tục
 * 
 * @param arr - Mảng cần sắp xếp (in-place)
 */
export function interchangeSort(arr: number[]): void {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        // So sánh arr[i] với TẤT CẢ phần tử phía sau
        for (let j = i + 1; j < n; j++) {
            // Nếu arr[i] > arr[j], swap NGAY LẬP TỨC
            if (arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        // Sau vòng j, arr[i] là phần tử nhỏ nhất từ vị trí i trở đi
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERCHANGE SORT WITH VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interchange Sort với từng bước visualization
 */
export function interchangeSortWithSteps(arr: number[]): InterchangeSortStep[] {
    const steps: InterchangeSortStep[] = [];
    const workArr = [...arr];
    const n = workArr.length;

    let totalSwaps = 0;
    let totalComparisons = 0;

    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            const shouldSwap = workArr[i] > workArr[j];
            totalComparisons++;

            steps.push({
                i,
                j,
                comparing: [workArr[i], workArr[j]],
                arrayState: [...workArr],
                swapped: shouldSwap,
                totalSwaps,
                totalComparisons,
                message: `Compare arr[${i}]=${workArr[i]} với arr[${j}]=${workArr[j]}: ${shouldSwap ? 'SWAP' : 'no swap'}`
            });

            if (shouldSwap) {
                [workArr[i], workArr[j]] = [workArr[j], workArr[i]];
                totalSwaps++;
            }
        }

        // Đánh dấu hoàn thành vòng i
        steps.push({
            i,
            j: -1,
            comparing: [workArr[i], -1],
            arrayState: [...workArr],
            swapped: false,
            totalSwaps,
            totalComparisons,
            message: `[Done] Vòng i=${i} hoàn thành: arr[${i}]=${workArr[i]} là phần tử nhỏ nhất từ [${i}..${n - 1}]`
        });
    }

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * So sánh với Selection Sort
 */
function selectionSortWithCount(arr: number[]): { swaps: number; comparisons: number } {
    const workArr = [...arr];
    const n = workArr.length;
    let swaps = 0;
    let comparisons = 0;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            if (workArr[j] < workArr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [workArr[i], workArr[minIdx]] = [workArr[minIdx], workArr[i]];
            swaps++;
        }
    }

    return { swaps, comparisons };
}

/**
 * So sánh với Bubble Sort
 */
function bubbleSortWithCount(arr: number[]): { swaps: number; comparisons: number } {
    const workArr = [...arr];
    const n = workArr.length;
    let swaps = 0;
    let comparisons = 0;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            comparisons++;
            if (workArr[j] > workArr[j + 1]) {
                [workArr[j], workArr[j + 1]] = [workArr[j + 1], workArr[j]];
                swaps++;
                swapped = true;
            }
        }
        if (!swapped) break;
    }

    return { swaps, comparisons };
}

/**
 * Interchange Sort với count
 */
function interchangeSortWithCount(arr: number[]): { swaps: number; comparisons: number } {
    const workArr = [...arr];
    const n = workArr.length;
    let swaps = 0;
    let comparisons = 0;

    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            if (workArr[i] > workArr[j]) {
                [workArr[i], workArr[j]] = [workArr[j], workArr[i]];
                swaps++;
            }
        }
    }

    return { swaps, comparisons };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Interchange Sort với so sánh các thuật toán
 */
export function demonstrateInterchangeSort(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('           INTERCHANGE SORT DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const arr = [5, 3, 8, 1, 2];
    console.log('Mảng ban đầu:', arr);

    // Chi tiết từng bước
    const steps = interchangeSortWithSteps([...arr]);

    console.log('\n--- Chi tiết từng bước ---\n');
    let currentI = -1;
    for (const step of steps) {
        if (step.i !== currentI) {
            console.log(`\n=== Vòng i = ${step.i} (xét arr[${step.i}]) ===`);
            currentI = step.i;
        }
        console.log(step.message);
    }

    // So sánh với các thuật toán khác
    console.log('\n\n--- So sánh với Selection Sort và Bubble Sort ---\n');

    const testCases = [
        { name: 'Random', arr: [5, 3, 8, 1, 2, 9, 4, 7, 6] },
        { name: 'Nearly Sorted', arr: [1, 2, 3, 5, 4, 6, 7, 8, 9] },
        { name: 'Reversed', arr: [9, 8, 7, 6, 5, 4, 3, 2, 1] }
    ];

    for (const tc of testCases) {
        console.log(`\n[${tc.name}]: ${tc.arr.join(', ')}`);

        const interchange = interchangeSortWithCount([...tc.arr]);
        const selection = selectionSortWithCount([...tc.arr]);
        const bubble = bubbleSortWithCount([...tc.arr]);

        console.log(`  Interchange: ${interchange.comparisons} comparisons, ${interchange.swaps} swaps`);
        console.log(`  Selection:   ${selection.comparisons} comparisons, ${selection.swaps} swaps`);
        console.log(`  Bubble:      ${bubble.comparisons} comparisons, ${bubble.swaps} swaps`);
    }

    const sorted = [...arr];
    interchangeSort(sorted);
    console.log('\n[OK] Kết quả cuối cùng:', sorted);
}

/**
 * Export default
 */
export default {
    interchangeSort,
    interchangeSortWithSteps,
    demonstrateInterchangeSort
};
