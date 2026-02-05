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
 * ┌─────────────────────────────────────────────────────────────┐
 * │     Tiêu chí      | Insertion Sort | Binary Insertion Sort  |
 * ├─────────────────────────────────────────────────────────────┤
 * │ Tìm vị trí        | Linear O(n)    | Binary O(log n)        |
 * │ Số so sánh        | O(n²)          | O(n log n)             |
 * │ Số dịch chuyển    | O(n²)          | O(n²) (vẫn như cũ!)    |
 * │ Overall           | O(n²)          | O(n²) (do dịch chuyển) |
 * └─────────────────────────────────────────────────────────────┘
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

// ═══════════════════════════════════════════════════════════════════════════
// BINARY SEARCH FOR INSERTION POSITION

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
import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateBinaryInsertionSortSteps - Tạo các bước cho Binary Insertion Sort.
 * 
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateBinaryInsertionSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [0]; // Initial sorted part

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Binary Insertion Sort. Tìm vị trí chèn bằng Binary Search.',
        codeSnippet: `// BINARY INSERTION SORT
// Sử dụng Binary Search để tìm vị trí chèn
for (i = 1; i < n; i++) {
    key = arr[i];
    // Binary search trong [0, i-1]
    // Dịch chuyển và chèn
}`,
    });

    for (let i = 1; i < n; i++) {
        const key = array[i];
        let left = 0;
        let right = i - 1;

        steps.push({
            array: [...array],
            comparing: [i],
            swapping: [],
            sorted: [...sorted],
            description: `Xét phần tử arr[${i}]=${key}. Tìm vị trí trong [0..${i - 1}]`,
            codeSnippet: `key = arr[${i}]; // ${key}
left = 0, right = ${i - 1};`,
        });

        // Binary Search
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            steps.push({
                array: [...array],
                comparing: [mid, i], // Compare mid with key (at i)
                swapping: [],
                sorted: [...sorted],
                description: `Binary Search: So sánh key=${key} với arr[${mid}]=${array[mid]} (Range: [${left}, ${right}])`,
                codeSnippet: `mid = ${(left + right) / 2 | 0}; // ${mid}
if (arr[mid] > key) ...`,
            });

            if (array[mid] > key) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        // Position found is `left`
        const position = left;

        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Tìm thấy vị trí chèn: ${position}. Bắt đầu dịch chuyển từ ${position} đến ${i - 1}.`,
            codeSnippet: `// Chèn tại ${position}`,
        });

        // Shifting
        // To visualize shifting nicely, we can show it step by step or in chunks
        // Standard Insertion sort usually highlights the shift.
        // Let's do it in one block logic but mapped to steps if possible, or just one "Shift" step

        // We will shift from right to left to make space
        for (let j = i; j > position; j--) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [j, j - 1], // Visualize as a swap/move
                sorted: [...sorted],
                description: `Dịch chuyển arr[${j - 1}]=${array[j - 1]} sang vị trí ${j}`,
                codeSnippet: `arr[${j}] = arr[${j - 1}];`,
            });

            array[j] = array[j - 1];
        }

        array[position] = key;
        sorted.push(i); // Now up to i is sorted

        steps.push({
            array: [...array],
            comparing: [],
            swapping: [position],
            sorted: Array.from({ length: i + 1 }, (_, k) => k),
            description: `Chèn key=${key} vào vị trí ${position}.`,
            codeSnippet: `arr[${position}] = key; // ${key}`,
        });
    }

    // Final
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Mảng đã được sắp xếp!',
        codeSnippet: `// ✓ HOÀN THÀNH`,
    });

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
    const steps = generateBinaryInsertionSortSteps([...arr]);

    console.log('\n--- Chi tiết từng bước ---\n');
    for (const step of steps) {
        console.log(step.description);
        console.log(`   → Mảng: [${step.array.join(', ')}]\n`);
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
    generateBinaryInsertionSortSteps,
    binarySearchInsertPosition,
    demonstrateBinaryInsertionSort
};
