/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SORTING ANIMATION UTILS - Tiện ích cho animations sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export interface AnimationStep {
    type: 'compare' | 'swap' | 'sorted' | 'pivot' | 'merge' | 'insert';
    indices: number[];
    array: number[];
    description: string;
}

/**
 * Generate Bubble Sort animation steps
 */
export function generateBubbleSortSteps(arr: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Compare step
            steps.push({
                type: 'compare',
                indices: [j, j + 1],
                array: [...array],
                description: `So sánh ${array[j]} và ${array[j + 1]}`
            });

            if (array[j] > array[j + 1]) {
                // Swap step
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                steps.push({
                    type: 'swap',
                    indices: [j, j + 1],
                    array: [...array],
                    description: `Đổi chỗ ${array[j + 1]} ↔ ${array[j]}`
                });
            }
        }
        // Mark sorted
        steps.push({
            type: 'sorted',
            indices: [n - i - 1],
            array: [...array],
            description: `${array[n - i - 1]} đã ở đúng vị trí`
        });
    }

    return steps;
}

/**
 * Generate Selection Sort animation steps
 */
export function generateSelectionSortSteps(arr: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
            steps.push({
                type: 'compare',
                indices: [minIdx, j],
                array: [...array],
                description: `Tìm min: so sánh ${array[minIdx]} với ${array[j]}`
            });

            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            steps.push({
                type: 'swap',
                indices: [i, minIdx],
                array: [...array],
                description: `Đổi min ${array[minIdx]} về vị trí ${i}`
            });
        }

        steps.push({
            type: 'sorted',
            indices: [i],
            array: [...array],
            description: `Vị trí ${i} đã sorted`
        });
    }

    return steps;
}

/**
 * Generate Insertion Sort animation steps
 */
export function generateInsertionSortSteps(arr: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const array = [...arr];
    const n = array.length;

    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;

        steps.push({
            type: 'compare',
            indices: [i],
            array: [...array],
            description: `Chọn key = ${key} để chèn`
        });

        while (j >= 0 && array[j] > key) {
            steps.push({
                type: 'compare',
                indices: [j, j + 1],
                array: [...array],
                description: `So sánh ${array[j]} > ${key}? Shift`
            });

            array[j + 1] = array[j];
            steps.push({
                type: 'insert',
                indices: [j, j + 1],
                array: [...array],
                description: `Dịch ${array[j]} sang phải`
            });
            j--;
        }

        array[j + 1] = key;
        steps.push({
            type: 'insert',
            indices: [j + 1],
            array: [...array],
            description: `Chèn ${key} vào vị trí ${j + 1}`
        });
    }

    return steps;
}

/**
 * Generate Quick Sort animation steps
 */
export function generateQuickSortSteps(arr: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const array = [...arr];

    function partition(low: number, high: number): number {
        const pivot = array[high];
        steps.push({
            type: 'pivot',
            indices: [high],
            array: [...array],
            description: `Chọn pivot = ${pivot}`
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
            steps.push({
                type: 'compare',
                indices: [j, high],
                array: [...array],
                description: `So sánh ${array[j]} với pivot ${pivot}`
            });

            if (array[j] <= pivot) {
                i++;
                if (i !== j) {
                    [array[i], array[j]] = [array[j], array[i]];
                    steps.push({
                        type: 'swap',
                        indices: [i, j],
                        array: [...array],
                        description: `Swap ${array[j]} ↔ ${array[i]}`
                    });
                }
            }
        }

        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        steps.push({
            type: 'swap',
            indices: [i + 1, high],
            array: [...array],
            description: `Đặt pivot vào vị trí ${i + 1}`
        });

        steps.push({
            type: 'sorted',
            indices: [i + 1],
            array: [...array],
            description: `Pivot ${array[i + 1]} đã ở đúng vị trí`
        });

        return i + 1;
    }

    function quickSort(low: number, high: number): void {
        if (low < high) {
            const pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }

    quickSort(0, array.length - 1);
    return steps;
}

// Export all generators
export default {
    generateBubbleSortSteps,
    generateSelectionSortSteps,
    generateInsertionSortSteps,
    generateQuickSortSteps
};
