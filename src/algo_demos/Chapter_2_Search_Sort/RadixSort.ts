/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * RADIX SORT - SẮP XẾP THEO CƠ SỐ
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ĐỊNH NGHĨA:
 * Radix Sort là thuật toán sắp xếp KHÔNG SO SÁNH (Non-comparison sort).
 * Sắp xếp theo từng chữ số (digit), từ hàng đơn vị đến hàng cao nhất (LSD).
 * 
 * Ý TƯỞNG:
 * - Thay vì so sánh 2 phần tử, ta phân loại theo từng chữ số
 * - Sử dụng Counting Sort làm stable sort cho từng digit
 * - Sau d vòng (d = số chữ số lớn nhất), mảng được sắp xếp
 * 
 * THUẬT TOÁN (LSD - Least Significant Digit first):
 * 1. Tìm số lớn nhất để biết số chữ số d
 * 2. For mỗi chữ số từ hàng đơn vị → hàng cao nhất:
 *    a. Dùng Counting Sort sắp xếp theo chữ số đó
 *    b. Phải dùng STABLE sort để giữ thứ tự từ vòng trước
 * 
 * VÍ DỤ:
 * arr = [170, 45, 75, 90, 802, 24, 2, 66]
 * 
 * Vòng 1 (hàng đơn vị):
 * → [170, 90, 802, 2, 24, 45, 75, 66]
 * 
 * Vòng 2 (hàng chục):
 * → [802, 2, 24, 45, 66, 170, 75, 90]
 * 
 * Vòng 3 (hàng trăm):
 * → [2, 24, 45, 66, 75, 90, 170, 802] [OK]
 * 
 * ĐỘ PHỨC TẠP:
 * - Time: O(d × (n + k))
 *   + d = số chữ số của số lớn nhất
 *   + n = số phần tử
 *   + k = range của chữ số (10 cho decimal)
 * - Space: O(n + k) cho counting sort
 * 
 * ⚠️ KHI NÀO RADIX SORT TỐT?
 * - Khi d nhỏ (số không quá lớn)
 * - Khi n lớn và k nhỏ
 * - d × k < n × log(n) thì Radix Sort nhanh hơn O(n log n) sorts
 * 
 * SO SÁNH VỚI CÁC THUẬT TOÁN KHÁC:
 * |   Thuật toán   | Type           | Best       | Average    | Worst      | Stable |
 * |----------------|----------------|------------|------------|------------|--------|
 * | Quick Sort     | Comparison     | O(nlogn)   | O(nlogn)   | O(n²)      | No     |
 * | Merge Sort     | Comparison     | O(nlogn)   | O(nlogn)   | O(nlogn)   | Yes    |
 * | Radix Sort     | Non-comparison | O(d(n+k))  | O(d(n+k))  | O(d(n+k))  | Yes    |
 * | Counting Sort  | Non-comparison | O(n+k)     | O(n+k)     | O(n+k)     | Yes    |
 * 
 * ƯU ĐIỂM:
 * + Có thể nhanh hơn O(n log n) với dữ liệu phù hợp
 * + Stable sort
 * + Không so sánh phần tử
 * 
 * NHƯỢC ĐIỂM:
 * - Chỉ áp dụng cho số nguyên (hoặc string)
 * - Cần bộ nhớ phụ O(n + k)
 * - Chậm nếu d lớn (số rất lớn)
 * - Không hoạt động với số âm (cần xử lý riêng)
 * 
 * @module RadixSort
 * @category AlgoDemos/Sorting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho mỗi bước của Radix Sort visualization
 */
export interface RadixSortStep {
    digit: number;           // Chữ số đang xét (1 = hàng đơn vị, 10 = hàng chục, ...)
    digitPosition: number;   // Vị trí chữ số (0, 1, 2, ...)
    buckets: number[][];     // 10 buckets cho mỗi digit (0-9)
    arrayState: number[];    // Trạng thái mảng sau vòng này
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lấy chữ số ở vị trí exp của number
 * 
 * @param num - Số cần lấy chữ số
 * @param exp - Vị trí (1 = hàng đơn vị, 10 = hàng chục, 100 = hàng trăm...)
 * @returns Chữ số ở vị trí đó (0-9)
 * 
 * VÍ DỤ:
 * getDigit(170, 1) = 0   (hàng đơn vị)
 * getDigit(170, 10) = 7  (hàng chục)
 * getDigit(170, 100) = 1 (hàng trăm)
 */
function getDigit(num: number, exp: number): number {
    return Math.floor(num / exp) % 10;
}

/**
 * Tìm số lớn nhất trong mảng
 */
function getMax(arr: number[]): number {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// ═══════════════════════════════════════════════════════════════════════════
// COUNTING SORT BY DIGIT - Stable sort theo một chữ số
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Counting Sort theo một chữ số cụ thể
 * 
 * ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT CỦA RADIX SORT!
 * 
 * TÍNH CHẤT CẦN THIẾT:
 * - STABLE: Phải giữ thứ tự tương đối của các phần tử có cùng digit
 * - Nếu không stable, kết quả sẽ sai!
 * 
 * THUẬT TOÁN COUNTING SORT:
 * 1. Đếm số lần xuất hiện của mỗi digit (0-9)
 * 2. Tính vị trí bắt đầu của mỗi digit trong output
 * 3. Duyệt mảng gốc TỪ CUỐI → ĐẦU để đảm bảo stable
 * 4. Copy kết quả về mảng gốc
 * 
 * @param arr - Mảng cần sắp xếp
 * @param exp - Vị trí chữ số (1, 10, 100, ...)
 */
function countingSortByDigit(arr: number[], exp: number): void {
    const n = arr.length;
    const output: number[] = new Array(n);  // Mảng kết quả
    const count: number[] = new Array(10).fill(0);  // Đếm digit 0-9

    // BƯỚC 1: Đếm số lần xuất hiện của mỗi digit
    for (let i = 0; i < n; i++) {
        const digit = getDigit(arr[i], exp);
        count[digit]++;
    }

    // BƯỚC 2: Tính vị trí cumulative (vị trí cuối của mỗi digit trong output)
    // count[i] = số phần tử có digit ≤ i
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // BƯỚC 3: Xây dựng output array
    // ⚠️ QUAN TRỌNG: Duyệt TỪ CUỐI → ĐẦU để đảm bảo STABLE!
    // Stable nghĩa là: nếu 2 phần tử có cùng digit, phần tử nào
    // xuất hiện trước trong arr thì cũng xuất hiện trước trong output
    for (let i = n - 1; i >= 0; i--) {
        const digit = getDigit(arr[i], exp);
        output[count[digit] - 1] = arr[i];
        count[digit]--;  // Giảm count để phần tử tiếp theo đặt ở vị trí trước
    }

    // BƯỚC 4: Copy output về mảng gốc
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// RADIX SORT - MAIN ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Radix Sort (LSD - Least Significant Digit first)
 * 
 * THUẬT TOÁN:
 * 1. Tìm số lớn nhất để biết cần bao nhiêu vòng
 * 2. Với mỗi chữ số từ hàng đơn vị → hàng cao nhất:
 *    - Sắp xếp mảng theo chữ số đó bằng Counting Sort
 * 
 * TẠI SAO LSD (từ phải → trái)?
 * - Vì dùng Stable Sort, thứ tự của các vòng trước được BẢO TOÀN
 * - Vòng cuối cùng (digit cao nhất) quyết định thứ tự chính
 * - Các vòng trước quyết định thứ tự khi digit cao nhất bằng nhau
 * 
 * @param arr - Mảng cần sắp xếp (in-place)
 */
export function radixSort(arr: number[]): void {
    if (arr.length <= 1) return;

    // Tìm số lớn nhất để biết số chữ số
    const max = getMax(arr);

    // Lặp qua từng chữ số từ hàng đơn vị (exp=1) đến hàng cao nhất
    // exp: 1 → 10 → 100 → 1000 → ...
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// RADIX SORT WITH VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Radix Sort với từng bước visualization
 * 
 * Hiển thị buckets và trạng thái mảng sau mỗi vòng
 */
export function radixSortWithSteps(arr: number[]): RadixSortStep[] {
    const steps: RadixSortStep[] = [];
    const workArr = [...arr];  // Copy để không modify original

    if (workArr.length <= 1) {
        return steps;
    }

    const max = getMax(workArr);
    let digitPosition = 0;

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        // Tạo buckets để visualization
        const buckets: number[][] = Array.from({ length: 10 }, () => []);

        // Phân phối phần tử vào buckets
        for (const num of workArr) {
            const digit = getDigit(num, exp);
            buckets[digit].push(num);
        }

        // Thực hiện counting sort
        countingSortByDigit(workArr, exp);

        steps.push({
            digit: exp,
            digitPosition,
            buckets: buckets.map(b => [...b]),
            arrayState: [...workArr],
            message: `Vòng ${digitPosition + 1}: Sắp xếp theo hàng ${exp === 1 ? 'đơn vị' : exp === 10 ? 'chục' : exp === 100 ? 'trăm' : exp.toString()}`
        });

        digitPosition++;
    }

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demo Radix Sort với ví dụ minh họa
 */
export function demonstrateRadixSort(): void {
    console.log('══════════════════════════════════════════════════════');
    console.log('           RADIX SORT DEMONSTRATION');
    console.log('══════════════════════════════════════════════════════\n');

    const arr = [170, 45, 75, 90, 802, 24, 2, 66];
    console.log('Mảng ban đầu:', arr);

    const steps = radixSortWithSteps(arr);

    for (const step of steps) {
        console.log(`\n${step.message}`);
        console.log('Buckets:');
        step.buckets.forEach((bucket, i) => {
            if (bucket.length > 0) {
                console.log(`  Bucket ${i}: [${bucket.join(', ')}]`);
            }
        });
        console.log('Mảng sau vòng này:', step.arrayState);
    }

    radixSort(arr);
    console.log('\n[OK] Kết quả cuối cùng:', arr);
}

/**
 * Export default
 */
export default {
    radixSort,
    radixSortWithSteps,
    demonstrateRadixSort
};
