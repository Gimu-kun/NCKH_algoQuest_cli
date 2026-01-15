/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * BINARY INSERTION SORT - SẮP XẾP CHÈN NHỊ PHÂN
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Binary Insertion Sort là phiên bản CẢI TIẾN của Insertion Sort.
 * Sử dụng BINARY SEARCH để tìm vị trí chèn thay vì tìm kiếm tuyến tính.
 * 
 * Ý TƯỞNG:
 * - Insertion Sort thường dùng Linear Search O(n) để tìm vị trí chèn
 * - Binary Insertion Sort dùng Binary Search O(log n) 
 * - Tận dụng việc phần sorted đã được SẮP XẾP
 * 
 * THUẬT TOÁN:
 * 1. Duyệt từ phần tử thứ 2 đến cuối mảng
 * 2. Với mỗi phần tử key:
 *    a. Dùng Binary Search tìm vị trí chèn trong phần đã sorted
 *    b. Dịch các phần tử từ vị trí chèn → phải
 *    c. Đặt key vào vị trí chèn
 * 
 * SO SÁNH VỚI INSERTION SORT THƯỜNG:
 * 
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ Tiêu chí | Insertion Sort | Binary Insertion Sort |
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Tìm vị trí | Linear O(n) | Binary O(log n) |
 * │ Số so sánh | O(n²) | O(n log n) |
 * │ Số dịch chuyển | O(n²) | O(n²) (vẫn như cũ!) |
 * │ Overall | O(n²) | O(n²) (do dịch chuyển) |
 * └──────────────────────────────────────────────────────────────────────────┘
 * 
 * [!] CHÚ Ý QUAN TRỌNG:
 * - Số SO SÁNH giảm từ O(n²) xuống O(n log n)
 * - Nhưng số DỊCH CHUYỂN vẫn là O(n²)
 * - Tổng complexity vẫn là O(n²) vì bị bottleneck bởi dịch chuyển
 * - Binary Insertion Sort chỉ THỰC SỰ nhanh hơn khi so sánh tốn kém
 * 
 * VÍ DỤ:
 * arr = [5, 3, 8, 1]
 * 
 * i=1, key=3:
 *   Sorted part: [5]
 *   Binary Search: vị trí 0 (trước 5)
 *   Dịch 5 → phải, chèn 3 → [3, 5, 8, 1]
 * 
 * i=2, key=8:
 *   Sorted part: [3, 5]
 *   Binary Search: vị trí 2 (sau 5)
 *   Không cần dịch, chèn 8 → [3, 5, 8, 1]
 * 
 * i=3, key=1:
 *   Sorted part: [3, 5, 8]
 *   Binary Search: vị trí 0 (trước 3)
 *   Dịch 3,5,8 → phải, chèn 1 → [1, 3, 5, 8] [OK]
 * 
 * ĐỘ PHỨC TẠP:
 * - Best: O(n) - mảng đã sorted (không dịch chuyển)
 * - Average: O(n²) - dịch chuyển chiếm ưu thế
 * - Worst: O(n²)
 * - Comparisons: O(n log n) ← cải tiến!
 * - Shifts: O(n²)
 * - Space: O(1) - in-place
 * 
 * ƯU ĐIỂM:
 * + Ít so sánh hơn Insertion Sort thường
 * + Tốt khi so sánh tốn kém (strings, objects lớn)
 * + Stable sort
 * + In-place
 * + Adaptive (tốt với dữ liệu gần sorted)
 * 
 * NHƯỢC ĐIỂM:
 * - Vẫn O(n²) do dịch chuyển
 * - Không nhanh hơn đáng kể với primitive types
 * - Cache không thân thiện (truy cập nhảy cóc khi binary search)
 * 
 * KHI NÀO DÙNG:
 * - Khi so sánh tốn kém (strings dài, objects)
 * - Dữ liệu gần như đã sorted
 * - Mảng nhỏ/vừa
 * 
 * @module BinaryInsertionSort
 * @category AlgoDemos/Sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho mỗi bước của Binary Insertion Sort
 */
export interface BinaryInsertionStep {
    iteration: number;
    key: number;
    searchRange: [number, number];  // [left, right] của binary search
    insertPosition: number;
    shifted: number[];              // Các phần tử bị dịch
    arrayState: number[];
    comparisons: number;            // Số lần so sánh trong binary search
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// BINARY SEARCH FOR INSERTION POSITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Binary Search tìm vị trí chèn
 * 
 * TÌM VỊ TRÍ NHỎ NHẤT để key được chèn vào mà vẫn giữ mảng sorted
 * 
 * @param arr - Mảng đã sorted
 * @param key - Giá trị cần tìm vị trí
 * @param left - Bound trái
 * @param right - Bound phải
 * @returns Vị trí chèn [0, right+1]
 * 
 * VÍ DỤ:
 * arr = [1, 3, 5, 7], key = 4
 * Binary Search tìm vị trí 2 (giữa 3 và 5)
 */
function binarySearchInsertPosition(
    arr: number[],
    key: number,
    left: number,
    right: number
): { position: number; comparisons: number } {
    let comparisons = 0;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        comparisons++;

        if (arr[mid] === key) {
            // Tìm thấy phần tử bằng key
            // Trả về vị trí sau key để giữ stable (phần tử mới sau phần tử cũ bằng)
            return { position: mid + 1, comparisons };
        } else if (arr[mid] < key) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // left là vị trí đầu tiên có giá trị > key
    return { position: left, comparisons };
}

// ═══════════════════════════════════════════════════════════════════════════
// BINARY INSERTION SORT - MAIN ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Binary Insertion Sort
 * 
 * THUẬT TOÁN CHI TIẾT:
 * 
 * 1. Duyệt i từ 1 đến n-1 (phần tử đang xét)
 * 2. Lưu key = arr[i]
 * 3. Binary Search vị trí chèn trong [0, i-1]
 * 4. Dịch các phần tử từ vị trí chèn đến i-1 sang phải
 * 5. Đặt key vào vị trí chèn
 * 
 * @param arr - Mảng cần sắp xếp (in-place)
 */
export function binaryInsertionSort(arr: number[]): void {
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        const key = arr[i];

        // Binary Search tìm vị trí chèn trong phần đã sorted [0, i-1]
        const { position } = binarySearchInsertPosition(arr, key, 0, i - 1);

        // Dịch các phần tử từ position đến i-1 sang phải
        // Shift từ phải qua trái để tránh ghi đè
        for (let j = i; j > position; j--) {
            arr[j] = arr[j - 1];
        }

        // Đặt key vào vị trí đúng
        arr[position] = key;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// BINARY INSERTION SORT WITH VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Binary Insertion Sort với từng bước visualization
 */
export function binaryInsertionSortWithSteps(arr: number[]): BinaryInsertionStep[] {
    const steps: BinaryInsertionStep[] = [];
    const workArr = [...arr];
    const n = workArr.length;

    for (let i = 1; i < n; i++) {
        const key = workArr[i];

        // Binary Search
        const { position, comparisons } = binarySearchInsertPosition(
            workArr, key, 0, i - 1
        );

        // Ghi lại phần tử bị dịch
        const shifted: number[] = [];
        for (let j = position; j < i; j++) {
            shifted.push(workArr[j]);
        }

        // Thực hiện dịch chuyển
        for (let j = i; j > position; j--) {
            workArr[j] = workArr[j - 1];
        }
        workArr[position] = key;

        steps.push({
            iteration: i,
            key,
            searchRange: [0, i - 1],
            insertPosition: position,
            shifted,
            arrayState: [...workArr],
            comparisons,
            message: `i=${i}: key=${key}, Binary Search trong [0,${i - 1}] (${comparisons} so sánh), ` +
                `chèn tại vị trí ${position}` +
                (shifted.length > 0 ? `, dịch [${shifted.join(',')}]` : '')
        });
    }

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON WITH REGULAR INSERTION SORT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Regular Insertion Sort với đếm so sánh
 */
function insertionSortWithCount(arr: number[]): { comparisons: number; shifts: number } {
    const workArr = [...arr];
    const n = workArr.length;
    let comparisons = 0;
    let shifts = 0;

    for (let i = 1; i < n; i++) {
        const key = workArr[i];
        let j = i - 1;

        while (j >= 0) {
            comparisons++;
            if (workArr[j] > key) {
                workArr[j + 1] = workArr[j];
                shifts++;
                j--;
            } else {
                break;
            }
        }
        workArr[j + 1] = key;
    }

    return { comparisons, shifts };
}

/**
 * Binary Insertion Sort với đếm
 */
function binaryInsertionSortWithCount(arr: number[]): { comparisons: number; shifts: number } {
    const workArr = [...arr];
    const n = workArr.length;
    let comparisons = 0;
    let shifts = 0;

    for (let i = 1; i < n; i++) {
        const key = workArr[i];
        const result = binarySearchInsertPosition(workArr, key, 0, i - 1);
        comparisons += result.comparisons;

        for (let j = i; j > result.position; j--) {
            workArr[j] = workArr[j - 1];
            shifts++;
        }
        workArr[result.position] = key;
    }

    return { comparisons, shifts };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Binary Insertion Sort
 */
export function demonstrateBinaryInsertionSort(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('       BINARY INSERTION SORT DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const arr = [5, 3, 8, 1, 2, 9, 4, 7, 6];
    console.log('Mảng ban đầu:', arr);

    // Chi tiết từng bước
    const steps = binaryInsertionSortWithSteps([...arr]);

    console.log('\n--- Chi tiết từng bước ---\n');
    for (const step of steps) {
        console.log(step.message);
        console.log(`   → Mảng: [${step.arrayState.join(', ')}]\n`);
    }

    // So sánh với Regular Insertion Sort
    console.log('\n--- So sánh với Regular Insertion Sort ---\n');

    const testCases = [
        { name: 'Random (n=10)', arr: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)) },
        { name: 'Random (n=50)', arr: Array.from({ length: 50 }, () => Math.floor(Math.random() * 100)) },
        { name: 'Nearly Sorted', arr: [1, 2, 3, 5, 4, 6, 8, 7, 9, 10] },
        { name: 'Reversed', arr: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] }
    ];

    console.log('| Test Case | Regular Insertion | Binary Insertion |');
    console.log('|-----------|-------------------|------------------|');

    for (const tc of testCases) {
        const regular = insertionSortWithCount([...tc.arr]);
        const binary = binaryInsertionSortWithCount([...tc.arr]);

        console.log(`| ${tc.name.padEnd(18)} | ${regular.comparisons} cmp, ${regular.shifts} shift | ${binary.comparisons} cmp, ${binary.shifts} shift |`);
    }

    console.log('\n[Summary] Nhận xét:');
    console.log('- Binary Insertion giảm số SO SÁNH đáng kể (O(n²) → O(n log n))');
    console.log('- Nhưng số DỊCH CHUYỂN vẫn như cũ (O(n²))');
    console.log('- Tổng complexity vẫn O(n²) do bottleneck dịch chuyển');

    const sorted = [...arr];
    binaryInsertionSort(sorted);
    console.log('\n[OK] Kết quả cuối cùng:', sorted);
}

/**
 * Export default
 */
export default {
    binaryInsertionSort,
    binaryInsertionSortWithSteps,
    binarySearchInsertPosition,
    demonstrateBinaryInsertionSort
};
