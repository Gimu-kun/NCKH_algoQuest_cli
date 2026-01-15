/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHAKER SORT (COCKTAIL SORT) - SẮP XẾP LẮC
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Shaker Sort (Cocktail Sort) là biến thể CẢI TIẾN của Bubble Sort.
 * Còn gọi là: Cocktail Shaker Sort, Bidirectional Bubble Sort, Ripple Sort.
 * 
 * Ý TƯỞNG:
 * - Bubble Sort chỉ duyệt 1 CHIỀU (trái → phải)
 * - Shaker Sort duyệt 2 CHIỀU (trái → phải, rồi phải → trái)
 * - Mỗi pass, cả phần tử lớn nhất VÀ nhỏ nhất được đặt đúng vị trí
 * 
 * THUẬT TOÁN:
 * 1. Duyệt từ trái → phải: Đưa MAX lên cuối
 * 2. Duyệt từ phải → trái: Đưa MIN xuống đầu
 * 3. Thu hẹp range: left++, right--
 * 4. Lặp lại cho đến khi left >= right hoặc không có swap
 * 
 * VÍ DỤ:
 * arr = [5, 1, 4, 2, 8, 0, 2]
 * 
 * Pass 1 (→): [1, 4, 2, 5, 0, 2, 8]  ← 8 về cuối
 * Pass 1 (←): [0, 1, 4, 2, 5, 2, 8]  ← 0 về đầu
 * Pass 2 (→): [0, 1, 2, 4, 2, 5, 8]  ← 5 về gần cuối
 * Pass 2 (←): [0, 1, 2, 2, 4, 5, 8]  ← 2 về vị trí đúng
 * [OK] Sorted!
 * 
 * ĐỘ PHỨC TẠP:
 * - Best: O(n) - mảng đã sorted
 * - Average: O(n²)
 * - Worst: O(n²) - mảng sorted ngược
 * - Space: O(1) - in-place
 * 
 * SO SÁNH VỚI BUBBLE SORT:
 * | Tiêu chí | Bubble Sort | Shaker Sort |
 * |----------|-------------|-------------|
 * | Hướng duyệt | 1 chiều | 2 chiều |
 * | Số pass | ~n | ~n/2 |
 * | Với "turtle" | Chậm | Nhanh hơn |
 * | Complexity | O(n²) | O(n²) |
 * | Stable | Yes | Yes |
 * 
 * VẤN ĐỀ "TURTLE" VÀ "RABBIT":
 * - Rabbit: Phần tử lớn ở đầu mảng → nhanh chóng về cuối (OK)
 * - Turtle: Phần tử nhỏ ở cuối mảng → chậm về đầu (PROBLEM!)
 * - Shaker Sort giải quyết vấn đề Turtle bằng cách duyệt ngược
 * 
 * ƯU ĐIỂM:
 * + Nhanh hơn Bubble Sort (giải quyết turtle problem)
 * + Stable sort
 * + In-place (O(1) space)
 * + Adaptive (dừng sớm nếu đã sorted)
 * + Đơn giản, dễ hiểu
 * 
 * NHƯỢC ĐIỂM:
 * - Vẫn O(n²) - chậm với dữ liệu lớn
 * - Không phù hợp cho production
 * - Chỉ cải tiến constant factor
 * 
 * @module ShakerSort
 * @category AlgoDemos/Sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho mỗi bước của Shaker Sort
 */
export interface ShakerSortStep {
    pass: number;
    direction: 'forward' | 'backward';
    comparing: [number, number];
    arrayState: number[];
    swapped: boolean;
    left: number;   // Boundary trái
    right: number;  // Boundary phải
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHAKER SORT - MAIN ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shaker Sort (Cocktail Sort)
 * 
 * THUẬT TOÁN CHI TIẾT:
 * 
 * 1. Khởi tạo left = 0, right = n-1
 * 2. Lặp cho đến khi left >= right:
 *    a. FORWARD PASS (trái → phải):
 *       - Duyệt từ left đến right-1
 *       - So sánh arr[i] với arr[i+1]
 *       - Swap nếu arr[i] > arr[i+1]
 *       - Phần tử LỚN NHẤT "nổi" lên vị trí right
 *       - Giảm right (right--)
 * 
 *    b. BACKWARD PASS (phải → trái):
 *       - Duyệt từ right-1 xuống left
 *       - So sánh arr[i] với arr[i-1]
 *       - Swap nếu arr[i] < arr[i-1]
 *       - Phần tử NHỎ NHẤT "chìm" xuống vị trí left
 *       - Tăng left (left++)
 * 
 *    c. Nếu không có swap trong cả 2 pass → mảng đã sorted → dừng
 * 
 * @param arr - Mảng cần sắp xếp (in-place)
 */
export function shakerSort(arr: number[]): void {
    let left = 0;
    let right = arr.length - 1;
    let swapped = true;

    while (swapped && left < right) {
        swapped = false;

        // FORWARD PASS: Đưa phần tử lớn nhất về cuối
        for (let i = left; i < right; i++) {
            if (arr[i] > arr[i + 1]) {
                // Swap
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }

        // Sau forward pass, phần tử lớn nhất đã ở vị trí right
        right--;

        // Nếu không có swap, mảng đã sorted
        if (!swapped) break;

        swapped = false;

        // BACKWARD PASS: Đưa phần tử nhỏ nhất về đầu
        for (let i = right; i > left; i--) {
            if (arr[i] < arr[i - 1]) {
                // Swap
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                swapped = true;
            }
        }

        // Sau backward pass, phần tử nhỏ nhất đã ở vị trí left
        left++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SHAKER SORT WITH VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shaker Sort với từng bước visualization
 */
export function shakerSortWithSteps(arr: number[]): ShakerSortStep[] {
    const steps: ShakerSortStep[] = [];
    const workArr = [...arr];

    let left = 0;
    let right = workArr.length - 1;
    let swapped = true;
    let pass = 1;

    while (swapped && left < right) {
        swapped = false;

        // FORWARD PASS
        for (let i = left; i < right; i++) {
            const shouldSwap = workArr[i] > workArr[i + 1];

            steps.push({
                pass,
                direction: 'forward',
                comparing: [i, i + 1],
                arrayState: [...workArr],
                swapped: shouldSwap,
                left,
                right,
                message: `Pass ${pass} →: So sánh arr[${i}]=${workArr[i]} với arr[${i + 1}]=${workArr[i + 1]}${shouldSwap ? ' → Swap' : ''}`
            });

            if (shouldSwap) {
                [workArr[i], workArr[i + 1]] = [workArr[i + 1], workArr[i]];
                swapped = true;
            }
        }

        right--;

        if (!swapped) {
            steps.push({
                pass,
                direction: 'forward',
                comparing: [-1, -1],
                arrayState: [...workArr],
                swapped: false,
                left,
                right,
                message: `[Sorted] Không có swap trong forward pass → Mảng đã sorted!`
            });
            break;
        }

        swapped = false;

        // BACKWARD PASS
        for (let i = right; i > left; i--) {
            const shouldSwap = workArr[i] < workArr[i - 1];

            steps.push({
                pass,
                direction: 'backward',
                comparing: [i - 1, i],
                arrayState: [...workArr],
                swapped: shouldSwap,
                left,
                right,
                message: `Pass ${pass} ←: So sánh arr[${i - 1}]=${workArr[i - 1]} với arr[${i}]=${workArr[i]}${shouldSwap ? ' → Swap' : ''}`
            });

            if (shouldSwap) {
                [workArr[i], workArr[i - 1]] = [workArr[i - 1], workArr[i]];
                swapped = true;
            }
        }

        left++;
        pass++;

        // Ghi lại trạng thái sau mỗi pass đầy đủ
        steps.push({
            pass: pass - 1,
            direction: 'backward',
            comparing: [-1, -1],
            arrayState: [...workArr],
            swapped: false,
            left,
            right,
            message: `[Done] Hoàn thành Pass ${pass - 1}: Range [${left}, ${right}], Array: [${workArr.join(', ')}]`
        });
    }

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON WITH BUBBLE SORT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bubble Sort để so sánh
 */
function bubbleSort(arr: number[]): { sorted: number[]; swaps: number } {
    const workArr = [...arr];
    let swaps = 0;
    const n = workArr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            if (workArr[j] > workArr[j + 1]) {
                [workArr[j], workArr[j + 1]] = [workArr[j + 1], workArr[j]];
                swaps++;
                swapped = true;
            }
        }
        if (!swapped) break;
    }

    return { sorted: workArr, swaps };
}

/**
 * Shaker Sort với đếm swap
 */
function shakerSortWithCount(arr: number[]): { sorted: number[]; swaps: number } {
    const workArr = [...arr];
    let swaps = 0;
    let left = 0;
    let right = workArr.length - 1;
    let swapped = true;

    while (swapped && left < right) {
        swapped = false;

        for (let i = left; i < right; i++) {
            if (workArr[i] > workArr[i + 1]) {
                [workArr[i], workArr[i + 1]] = [workArr[i + 1], workArr[i]];
                swaps++;
                swapped = true;
            }
        }
        right--;

        if (!swapped) break;
        swapped = false;

        for (let i = right; i > left; i--) {
            if (workArr[i] < workArr[i - 1]) {
                [workArr[i], workArr[i - 1]] = [workArr[i - 1], workArr[i]];
                swaps++;
                swapped = true;
            }
        }
        left++;
    }

    return { sorted: workArr, swaps };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Shaker Sort với so sánh Bubble Sort
 */
export function demonstrateShakerSort(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('           SHAKER SORT (COCKTAIL SORT)');
    console.log('══════════════════════════════════════════════════════\n');

    // Ví dụ với turtle problem
    // Turtle: 2 ở cuối mảng (phần tử nhỏ ở vị trí xa)
    const arr = [5, 1, 4, 8, 0, 9, 7, 2];
    console.log('Mảng ban đầu:', arr);
    console.log('(Chú ý: 0 ở gần cuối là "turtle")\n');

    // So sánh Bubble vs Shaker
    const bubbleResult = bubbleSort([...arr]);
    const shakerResult = shakerSortWithCount([...arr]);

    console.log('--- So sánh với Bubble Sort ---');
    console.log(`Bubble Sort: ${bubbleResult.swaps} swaps`);
    console.log(`Shaker Sort: ${shakerResult.swaps} swaps`);
    console.log(`Tiết kiệm: ${bubbleResult.swaps - shakerResult.swaps} swaps\n`);

    // Chi tiết từng bước
    const steps = shakerSortWithSteps([...arr]);

    console.log('--- Chi tiết từng bước ---\n');
    let currentPass = 0;
    for (const step of steps) {
        if (step.pass !== currentPass) {
            console.log(`\n=== Pass ${step.pass} ===`);
            currentPass = step.pass;
        }
        if (step.comparing[0] >= 0) {
            console.log(step.message);
        } else {
            console.log(step.message);
        }
    }

    const sorted = [...arr];
    shakerSort(sorted);
    console.log('\n[OK] Kết quả cuối cùng:', sorted);
}

/**
 * Export default
 */
export default {
    shakerSort,
    shakerSortWithSteps,
    demonstrateShakerSort
};
