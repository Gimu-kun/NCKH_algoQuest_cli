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

import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateInterchangeSortSteps - Tạo các bước cho Interchange Sort.
 * 
 * THUẬT TOÁN:
 * Interchange Sort (Đổi chỗ trực tiếp) là thuật toán đơn giản nhất:
 * - So sánh cặp (i, j) với j chạy từ i+1 đến n-1.
 * - Nếu arr[i] > arr[j], đổi chỗ NGAY LẬP TỨC.
 * - Khác với Selection Sort (chỉ đổi chỗ sau khi tìm min).
 * 
 * @param arr - Mảng cần sắp xếp
 * @returns Mảng các SortingStep
 */
export function generateInterchangeSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Interchange Sort. So sánh từng cặp và đổi chỗ ngay nếu sai thứ tự.',
        codeSnippet: `// INTERCHANGE SORT
// So sánh trực tiếp và đổi chỗ ngay
for (i = 0; i < n - 1; i++) {
    for (j = i + 1; j < n; j++) {
        if (arr[j] < arr[i]) {
            swap(arr[i], arr[j]);
        }
    }
}`,
    });

    for (let i = 0; i < n - 1; i++) {
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Bắt đầu vòng lặp i=${i}. Tìm phần tử nhỏ nhất cho vị trí này.`,
            codeSnippet: `// Xét vị trí i = ${i}
// Duyệt j từ ${i + 1} -> ${n - 1}`,
        });

        for (let j = i + 1; j < n; j++) {
            steps.push({
                array: [...array],
                comparing: [i, j],
                swapping: [],
                sorted: [...sorted],
                description: `So sánh arr[${i}]=${array[i]} với arr[${j}]=${array[j]}`,
                codeSnippet: `if (arr[${j}] < arr[${i}]) {
    // ${array[j]} < ${array[i]} ?
    swap(arr[${i}], arr[${j}]);
}`,
            });

            if (array[j] < array[i]) {
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapping: [i, j],
                    sorted: [...sorted],
                    description: `${array[j]} < ${array[i]} → Đổi chỗ ngay lập tức`,
                    codeSnippet: `// Phát hiện nghịch thế -> Swap ngay
[arr[${i}], arr[${j}]] = [arr[${j}], arr[${i}]];`,
                });

                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        sorted.push(i);
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `Hoàn thành vị trí ${i}. Giá trị ${array[i]} đã đúng thứ tự.`,
            codeSnippet: `// Xong vị trí ${i}`,
        });
    }

    // Last element is sorted
    sorted.push(n - 1);
    const allSorted = Array.from({ length: n }, (_, i) => i);

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Mảng đã được sắp xếp!',
        codeSnippet: `// ✓ SẮP XẾP HOÀN TẤT
// Kết quả: [${array.join(', ')}]`,
    });

    return steps;
}

/**
 * Interchange Sort implementation (Main algorithm)
 */
export function interchangeSort(arr: number[]): void {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            if (arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }
}

export default {
    interchangeSort,
    generateInterchangeSortSteps
};
