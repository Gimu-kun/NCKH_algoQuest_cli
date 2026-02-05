/**
 * =============================================================================
 * FILE: InsertionSort.ts (Sắp Xếp Chèn)
 * =============================================================================
 *
 * 1. MỤC TIÊU (GOAL):
 *    - Sắp xếp mảng theo thứ tự tăng dần bằng cách xây dựng dần mảng con đã sắp xếp.
 *
 * 2. THUẬT TOÁN & KỸ THUẬT (ALGORITHM & TECHNIQUE):
 *    - **Incremental Approach (Tiếp cận tăng dần)**: Lấy từng phần tử và chèn nó vào đúng vị trí trong phần đã sắp xếp trước đó.
 *    - **Online Algorithm**: Có thể sắp xếp dữ liệu ngay khi nhận được nó (stream), không cần có toàn bộ dữ liệu ngay từ đầu.
 *
 * 3. BƯỚC THỰC HIỆN (STEPS FLOW):
 *    - B1: Coi phần tử đầu tiên `arr[0]` là mảng đã được sắp xếp.
 *    - B2: Bắt đầu vòng lặp từ phần tử thứ 2 (`i = 1`) đến hết mảng. Gọi phần tử này là `key`.
 *    - B3: So sánh `key` với các phần tử trong mảng đã sắp xếp (`arr[0...i-1]`), đi ngược từ `j = i - 1` về 0.
 *    - B4: Nếu `arr[j] > key` -> Dịch chuyển `arr[j]` sang phải (`arr[j+1] = arr[j]`) để tạo chỗ trống.
 *    - B5: Lặp lại B4 cho đến khi gặp phần tử nhỏ hơn `key` hoặc về đầu mảng.
 *    - B6: Chèn `key` vào vị trí trống tìm được (`arr[j+1] = key`).
 *
 * 4. ĐỘ PHỨC TẠP (COMPLEXITY):
 *    - **Time Complexity**:
 *      + Best Case: O(n) - Khi mảng đã sắp xếp (chỉ cần so sánh 1 lần mỗi bước).
 *      + Average/Worst Case: O(n^2) - Khi mảng ngược chiều hoàn toàn.
 *    - **Space Complexity**: O(1) (In-place).
 *
 * 5. ƯU ĐIỂM & NHƯỢC ĐIỂM (PROS & CONS):
 *    - **Ưu điểm**:
 *      + Cực kỳ nhanh với dữ liệu nhỏ hoặc "Nearly Sorted" (Gần như đã sắp xếp).
 *      + Stable Sort (Ổn định - giữ nguyên thứ tự tương đối của các phần tử bằng nhau).
 *      + Đơn giản, tự nhiên (giống xếp bài).
 *    - **Nhược điểm**:
 *      + Chậm (O(n^2)) với dữ liệu lớn và ngẫu nhiên.
 *
 * 6. SO SÁNH (VS OTHER ALGORITHMS):
 *    - So với **Bubble/Selection**: Insertion Sort thường nhanh hơn trong thực tế, đặc biệt là với mảng "Nearly Sorted".
 *    - Là nền tảng cho **Shell Sort** và được dùng trong **TimSort** (thuật toán sort mặc định của Python/Java) cho các mảng con nhỏ.
 */

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateInsertionSortSteps - Tạo các bước cho Insertion Sort.
 *
 * THUẬT TOÁN INSERTION SORT:
 * 1. Coi phần tử đầu tiên là sorted.
 * 2. Lấy phần tử tiếp theo từ unsorted.
 * 3. "Chèn" vào đúng vị trí trong sorted portion bằng cách shift.
 * 4. Repeat cho đến hết unsorted.
 *
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateInsertionSortSteps(arr: number[]): SortingStep[] {
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

export function insertionSort(arr: number[]): number[] {
    const n = arr.length;
    // Copy array để đảm bảo tính bất biến (Immutability) cho input
    const result = [...arr];

    console.log("--- Bắt đầu Insertion Sort ---");

    // Vòng lặp chính: Duyệt từ phần tử thứ 2
    for (let i = 1; i < n; i++) {
        const key = result[i]; // Giá trị cần chèn (Key)
        let j = i - 1; // Index của phần tử cuối cùng trong mảng con đã sort

        console.log(`Đang xét key: ${key} tại index ${i}`);

        // Vòng lặp con: Dịch chuyển (Shift) các phần tử lớn hơn Key sang phải
        // Điều kiện: j >= 0 (chưa về đầu mảng) VÀ result[j] > key (sai thứ tự)
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j]; // Dời chỗ sang phải 1 bước
            j--; // Tiếp tục lùi về bên trái
        }

        // Sau khi tìm được vị trí (hoặc j = -1), chèn Key vào
        result[j + 1] = key;
        console.log(`  -> Chèn ${key} vào vị trí ${j + 1}. Mảng hiện tại: [${result}]`);
    }

    return result;
}
