/**
 * =============================================================================
 * FILE: MergeSort.ts (Sắp Xếp Trộn)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp mảng theo thứ tự tăng dần.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Divide and Conquer (Chia để trị)**: Chia bài toán lớn thành các bài toán con nhỏ hơn để giải quyết, sau đó gộp kết quả lại.
 *    - **Recursion (Đệ quy)**: Gọi lại chính hàm đó để xử lý các phần mảng con.
 *    - **Two Pointers (Kỹ thuật 2 con trỏ)**: Dùng trong bước Merge để trộn 2 mảng đã sắp xếp.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: **Divide (Chia)**: Chia đôi mảng input thành 2 nửa `left` và `right`.
 *    - B2: **Base Case (Điều kiện dừng)**: Nếu mảng chỉ còn 0 hoặc 1 phần tử -> Đã sắp xếp -> Return.
 *    - B3: **Conquer (Trị)**: Gọi đệ quy `mergeSort` cho cả 2 nửa `left` và `right`.
 *    - B4: **Merge (Trộn)**: Sử dụng hàm `merge` để trộn 2 mảng con (đã được sort từ bước đệ quy về) thành 1 mảng lớn đã sort hoàn chỉnh.
 *         + So sánh phần tử đầu của 2 mảng con.
 *         + Lấy phần tử nhỏ hơn bỏ vào mảng kết quả.
 *         + Lặp lại cho đến khi hết một trong 2 mảng.
 *         + Nối phần thừa còn lại của mảng chưa hết vào cuối.
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**: O(n log n)
 *      + Luôn luôn ổn định (Stable) cho mọi trường hợp (Best, Average, Worst) vì luôn chia đôi đều đặn.
 *    - **Space Complexity**: O(n)
 *      + Cần bộ nhớ phụ để tạo các mảng con trong quá trình chia và trộn (Auxiliary Space).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Hiệu năng cao, ổn định (O(n log n)).
 *      + Stable Sort (Giữ nguyên thứ tự của các phần tử bằng nhau).
 *      + Phù hợp cho Linked List.
 *    - **Nhược điểm**:
 *      + Tốn bộ nhớ (Space O(n)) -> Không tốt cho các hệ thống nhúng hoặc hạn chế RAM.
 *      + Cài đặt đệ quy có thể gây Stack Overflow với dữ liệu quá lớn (tuy nhiên JS hiện đại xử lý khá tốt).
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Quick Sort**: Merge Sort chậm hơn một chút về hằng số thời gian và tốn bộ nhớ hơn, nhưng ổn định hơn (Quick Sort có thể bị O(n^2)).
 *    - So với **Heap Sort**: Merge Sort nhanh hơn nhưng tốn bộ nhớ hơn (Heap Sort là In-place O(1)).
 */

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateMergeSortSteps - Tạo các bước cho Merge Sort.
 */
export function generateMergeSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Merge Sort. Chia để trị (Divide & Conquer).',
        codeSnippet: `// MERGE SORT - O(n log n)
// Chia đôi mảng, sort đệ quy, rồi trộn lại
function mergeSort(arr, left, right) {
    if (left < right) {
        mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
    });

    mergeSortRecursive(array, 0, n - 1, steps);

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
// - Luôn O(n log n)
// - Stable sort
//
// NHƯỢC ĐIỂM:
// - Space O(n)`,
    });

    return steps;
}

function mergeSortRecursive(array: number[], left: number, right: number, steps: SortingStep[]) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);

        mergeSortRecursive(array, left, mid, steps);
        mergeSortRecursive(array, mid + 1, right, steps);

        mergeVisualize(array, left, mid, right, steps);
    }
}

function mergeVisualize(array: number[], left: number, mid: number, right: number, steps: SortingStep[]) {
    // Kỹ thuật merge thông thường dùng mảng phụ, nhưng để visualize ta sẽ overwrite lại mảng chính
    // và capture state mỗi khi overwrite.

    steps.push({
        array: [...array],
        comparing: [left, right], // Highlight range being merged
        swapping: [],
        sorted: [],
        description: `Merge 2 sorted parts: [${left}...${mid}] và [${mid + 1}...${right}]`,
        codeSnippet: `// Merge [${left}..${mid}] và [${mid + 1}..${right}]`,
    });

    const n1 = mid - left + 1;
    const n2 = right - mid;

    // Create temp arrays
    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[left + i];
    for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j];

    let i = 0, j = 0;
    let k = left;

    while (i < n1 && j < n2) {
        steps.push({
            array: [...array],
            comparing: [left + i, mid + 1 + j],
            swapping: [],
            sorted: [],
            description: `So sánh left: ${L[i]} vs right: ${R[j]}`,
            codeSnippet: `if (L[i] <= R[j]) arr[k] = L[i];
else arr[k] = R[j];`,
        });

        if (L[i] <= R[j]) {
            array[k] = L[i];
            steps.push({
                array: [...array],
                comparing: [k],
                swapping: [],
                sorted: [],
                description: `Chọn ${L[i]} đặt vào vị trí ${k}`,
                codeSnippet: `arr[${k}] = ${L[i]}; i++; k++;`,
            });
            i++;
        } else {
            array[k] = R[j];
            steps.push({
                array: [...array],
                comparing: [k],
                swapping: [],
                sorted: [],
                description: `Chọn ${R[j]} đặt vào vị trí ${k}`,
                codeSnippet: `arr[${k}] = ${R[j]}; j++; k++;`,
            });
            j++;
        }
        k++;
    }

    // Use while loops to flush remaining elements
    while (i < n1) {
        array[k] = L[i];
        steps.push({
            array: [...array],
            comparing: [k],
            swapping: [],
            sorted: [],
            description: `Copy phần còn lại của Left (${L[i]}) vào ${k}`,
            codeSnippet: `arr[${k}] = L[i]; i++; k++;`,
        });
        i++;
        k++;
    }

    while (j < n2) {
        array[k] = R[j];
        steps.push({
            array: [...array],
            comparing: [k],
            swapping: [],
            sorted: [],
            description: `Copy phần còn lại của Right (${R[j]}) vào ${k}`,
            codeSnippet: `arr[${k}] = R[j]; j++; k++;`,
        });
        j++;
        k++;
    }
}

export function mergeSort(arr: number[]): number[] {
    // Base Case: Nếu mảng có 0 hoặc 1 phần tử thì coi như đã sort -> Trả về ngay.
    if (arr.length <= 1) return arr;

    // 1. Divide: Tìm điểm giữa để chia đôi mảng
    const mid = Math.floor(arr.length / 2);

    // Tạo 2 mảng con: Left (từ đầu đến mid) và Right (từ mid đến hết)
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    console.log(`Splitting (Chia): [${left}] và [${right}]`);

    // 2. Recursive calls (Gọi đệ quy): Tiếp tục chia nhỏ và sort các mảng con
    // Sau đó gọi hàm merge để trộn kết quả trả về
    return merge(mergeSort(left), mergeSort(right));
}

// Hàm trợ giúp: Trộn 2 mảng con ĐÃ ĐƯỢC SẮP XẾP thành 1 mảng lớn cũng SẮP XẾP
function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0; // Con trỏ cho mảng left
    let j = 0; // Con trỏ cho mảng right

    console.log(`Merging (Trộn): [${left}] + [${right}]`);

    // 3. Merge logic: So sánh từng cặp phần tử và lấy phần tử nhỏ hơn
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++; // Tăng con trỏ left sau khi đã lấy phần tử
        } else {
            result.push(right[j]);
            j++; // Tăng con trỏ right sau khi đã lấy phần tử
        }
    }

    // Sau khi vòng lặp kết thúc, có thể còn dư phần tử ở một trong 2 mảng
    // Nối tất cả phần thừa đó vào cuối mảng result
    const merged = result.concat(left.slice(i)).concat(right.slice(j));

    console.log(`  -> Result sau khi merge: [${merged}]`);
    return merged;
}
