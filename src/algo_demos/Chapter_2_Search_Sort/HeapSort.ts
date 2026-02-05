import type { SortingStep } from '../../components/visualizations/types';

/**
 * generateHeapSortSteps - Tạo các bước cho Heap Sort.
 *
 * THUẬT TOÁN HEAP SORT:
 * 1. Build Max-Heap: Biến mảng thành Max-Heap (parent >= children).
 * 2. Extract Max: Swap root (max) với cuối, giảm heap size, heapify root.
 * 3. Repeat: Cho đến khi heap size = 1.
 */
export function generateHeapSortSteps(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    // Step 0: Initial
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Bắt đầu Heap Sort. Bước 1: Xây dựng Max-Heap.',
        codeSnippet: `// HEAP SORT - O(n log n) time, O(1) space
// Sử dụng cấu trúc Max-Heap

// Bước 1: Build Max-Heap từ mảng
for (i = n/2 - 1; i >= 0; i--) {
    heapify(arr, n, i);
}

// Bước 2: Extract max liên tục
for (i = n-1; i > 0; i--) {
    swap(arr[0], arr[i]);  // Đưa max về cuối
    heapify(arr, i, 0);    // Heapify phần còn lại
}`,
    });

    /**
     * heapify - Duy trì tính chất Max-Heap cho subtree có root tại index i.
     */
    function heapify(heapSize: number, i: number): void {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        // So sánh với left child
        if (left < heapSize) {
            steps.push({
                array: [...array],
                comparing: [largest, left],
                swapping: [],
                sorted: [...sorted],
                description: `Heapify: So sánh arr[${largest}]=${array[largest]} với left child arr[${left}]=${array[left]}`,
                codeSnippet: `// So sánh với left child
left = 2 * ${i} + 1 = ${left}
if (arr[${left}] > arr[${largest}]) {  // ${array[left]} > ${array[largest]} ?
    largest = ${left};
}`,
            });

            if (array[left] > array[largest]) {
                largest = left;
            }
        }

        // So sánh với right child  
        if (right < heapSize) {
            steps.push({
                array: [...array],
                comparing: [largest, right],
                swapping: [],
                sorted: [...sorted],
                description: `Heapify: So sánh arr[${largest}]=${array[largest]} với right child arr[${right}]=${array[right]}`,
                codeSnippet: `// So sánh với right child
right = 2 * ${i} + 2 = ${right}
if (arr[${right}] > arr[${largest}]) {  // ${array[right]} > ${array[largest]} ?
    largest = ${right};
}`,
            });

            if (array[right] > array[largest]) {
                largest = right;
            }
        }

        // Nếu largest không phải root, swap và đệ quy heapify
        if (largest !== i) {
            steps.push({
                array: [...array],
                comparing: [],
                swapping: [i, largest],
                sorted: [...sorted],
                description: `Swap arr[${i}]=${array[i]} với arr[${largest}]=${array[largest]} để duy trì Max-Heap`,
                codeSnippet: `// Largest không phải root → Swap
[arr[${i}], arr[${largest}]] = [arr[${largest}], arr[${i}]];
// ${array[i]} ↔ ${array[largest]}
// Tiếp tục heapify subtree bị ảnh hưởng`,
            });

            [array[i], array[largest]] = [array[largest], array[i]];

            // Đệ quy heapify subtree
            heapify(heapSize, largest);
        }
    }

    // Phase 1: Build Max-Heap
    // Bắt đầu từ node không phải leaf cuối cùng
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: 'Xây dựng Max-Heap: Heapify từ dưới lên, bắt đầu từ non-leaf node cuối.',
        codeSnippet: `// BUILD MAX-HEAP
// Non-leaf node cuối: index = n/2 - 1 = ${Math.floor(n / 2) - 1}
// Heapify từ dưới lên để đảm bảo subtree đã là heap
for (i = ${Math.floor(n / 2) - 1}; i >= 0; i--) {
    heapify(arr, n, i);
}`,
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }

    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: `Max-Heap đã xây dựng xong! Root arr[0]=${array[0]} là giá trị lớn nhất.`,
        codeSnippet: `// Max-Heap hoàn thành!
// arr = [${array.join(', ')}]
// arr[0] = ${array[0]} là MAX
// Bây giờ extract max liên tục...`,
    });

    // Phase 2: Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [0, i],
            sorted: [...sorted],
            description: `Extract: Swap root arr[0]=${array[0]} với arr[${i}]=${array[i]}`,
            codeSnippet: `// EXTRACT MAX
// Swap max (root) với cuối heap
[arr[0], arr[${i}]] = [arr[${i}], arr[0]];
// ${array[0]} ↔ ${array[i]}`,
        });

        [array[0], array[i]] = [array[i], array[0]];

        sorted.push(i);
        steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [...sorted],
            description: `arr[${i}]=${array[i]} đã ở đúng vị trí. Giảm heap size và heapify root.`,
            codeSnippet: `// Phần tử ${array[i]} đã sorted
// Giảm heap size: ${i}
// Heapify root để duy trì Max-Heap
heapify(arr, ${i}, 0);`,
        });

        // Heapify root với heap size giảm
        heapify(i, 0);
    }

    // Mark first element as sorted
    sorted.push(0);

    // Final step
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: allSorted,
        description: '[Hoàn thành] Heap Sort đã sắp xếp xong mảng!',
        codeSnippet: `// ✓ HOÀN THÀNH HEAP SORT
// Kết quả: [${array.join(', ')}]
//
// ƯU ĐIỂM:
// - O(n log n) worst case - predictable
// - In-place: O(1) space
//
// NHƯỢC ĐIỂM:
// - Unstable sort
// - Cache-unfriendly`,
    });

    return steps;
}

// Keep generic export for simple use cases
export function heapSort(arr: number[]): number[] {
    const steps = generateHeapSortSteps(arr);
    return steps[steps.length - 1].array;
}
