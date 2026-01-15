/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 1: DEMOS - PHÂN TÍCH ĐỘ PHỨC TẠP THUẬT TOÁN
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Export các demo liên quan đến Chapter 1 về Algorithm Complexity Analysis.
 * Kết nối với các demo trong folder algo_demos/Chapter_1_Overview/.
 * 
 * DEMOS TRONG CHAPTER NÀY:
 * 1. ComplexityAnalysis - Minh họa các mức độ phức tạp O(1), O(n), O(n²), O(log n)
 * 
 * CÁCH SỬ DỤNG:
 * Import các demo từ file này để sử dụng trong UI học tập.
 * 
 * @module Chapter1Demos
 * @category StudyMaterials/Demos
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DemoReference, ChapterInfo } from '../types';
import { ChapterNumber, TimeComplexity } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// THÔNG TIN CHƯƠNG 1
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về Chương 1: Algorithm Complexity
 * 
 * KIẾN THỨC CHÍNH:
 * - Big O Notation (Ký hiệu O lớn)
 * - Time Complexity Analysis (Phân tích độ phức tạp thời gian)
 * - Space Complexity Analysis (Phân tích độ phức tạp không gian)
 * - Best/Average/Worst Case (Các trường hợp phân tích)
 */
export const CHAPTER_1_INFO: ChapterInfo = {
    chapterNumber: ChapterNumber.COMPLEXITY,
    title: 'Phân Tích Độ Phức Tạp Thuật Toán',
    titleEn: 'Algorithm Complexity Analysis',
    description: 'Học cách đánh giá hiệu quả thuật toán thông qua Big O notation, phân tích thời gian và không gian.',
    topics: [
        'Big O, Big Omega, Big Theta',
        'Time Complexity Analysis',
        'Space Complexity Analysis',
        'Best Case, Average Case, Worst Case',
        'Quy tắc cộng và nhân trong phân tích',
        'Time-Space Tradeoff'
    ],
    demos: [
        {
            name: 'Complexity Analysis',
            path: 'algo_demos/Chapter_1_Overview/ComplexityAnalysis.ts',
            description: 'Demo trực quan so sánh các mức độ phức tạp O(1), O(log n), O(n), O(n²)'
        }
    ],
    prerequisites: [] // Chương 1 không cần điều kiện tiên quyết
};

// ═══════════════════════════════════════════════════════════════════════════
// DANH SÁCH CÁC ĐỘ PHỨC TẠP PHỔ BIẾN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Danh sách các mức độ phức tạp thời gian phổ biến
 * Sắp xếp từ TỐT NHẤT → XẤU NHẤT
 * 
 * ỨNG DỤNG:
 * - Hiển thị trong bảng so sánh
 * - Dùng trong quiz/exercises
 * - Reference cho learners
 */
export const COMPLEXITY_LEVELS = [
    {
        notation: 'O(1)',
        name: 'Constant',
        nameVi: 'Hằng số',
        description: 'Thời gian không đổi, không phụ thuộc kích thước input',
        examples: [
            'Truy cập phần tử mảng theo index: arr[i]',
            'Push/Pop trong Stack',
            'Kiểm tra số chẵn/lẻ: n % 2'
        ],
        color: '#22c55e' // Green - Tốt nhất
    },
    {
        notation: 'O(log n)',
        name: 'Logarithmic',
        nameVi: 'Logarit',
        description: 'Chia đôi dữ liệu mỗi bước, rất hiệu quả',
        examples: [
            'Binary Search trong mảng đã sắp xếp',
            'Tìm kiếm trong Binary Search Tree',
            'Tìm số mũ: 2^k = n → k = log₂(n)'
        ],
        color: '#84cc16' // Lime - Rất tốt
    },
    {
        notation: 'O(n)',
        name: 'Linear',
        nameVi: 'Tuyến tính',
        description: 'Tỷ lệ thuận với kích thước input, duyệt qua tất cả phần tử',
        examples: [
            'Tìm max/min trong mảng chưa sắp xếp',
            'Linear Search',
            'Tính tổng các phần tử mảng'
        ],
        color: '#eab308' // Yellow - Trung bình
    },
    {
        notation: 'O(n log n)',
        name: 'Linearithmic',
        nameVi: 'Tuyến tính logarit',
        description: 'Hiệu quả nhất cho comparison-based sorting',
        examples: [
            'Merge Sort',
            'Quick Sort (average case)',
            'Heap Sort'
        ],
        color: '#f97316' // Orange - Chấp nhận được
    },
    {
        notation: 'O(n²)',
        name: 'Quadratic',
        nameVi: 'Bậc hai / Bình phương',
        description: 'Hai vòng lặp lồng nhau, chậm với input lớn',
        examples: [
            'Bubble Sort',
            'Selection Sort',
            'Insertion Sort (worst case)'
        ],
        color: '#ef4444' // Red - Chậm
    },
    {
        notation: 'O(2^n)',
        name: 'Exponential',
        nameVi: 'Hàm mũ',
        description: 'Tăng gấp đôi mỗi khi n tăng 1, rất chậm',
        examples: [
            'Fibonacci đệ quy naive',
            'Subset generation (tất cả tập con)',
            'Tower of Hanoi'
        ],
        color: '#dc2626' // Dark Red - Rất chậm
    },
    {
        notation: 'O(n!)',
        name: 'Factorial',
        nameVi: 'Giai thừa',
        description: 'Chậm nhất, chỉ dùng cho n rất nhỏ',
        examples: [
            'Brute force Traveling Salesman Problem',
            'Sinh tất cả hoán vị của mảng',
            'Permutation problems'
        ],
        color: '#7f1d1d' // Very Dark Red - Không thể chấp nhận
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// VÍ DỤ CODE VỚI PHÂN TÍCH CHI TIẾT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ví dụ code với phân tích độ phức tạp chi tiết
 * 
 * MỖI VÍ DỤ BAO GỒM:
 * - Code mẫu (TypeScript)
 * - Giải thích từng dòng
 * - Big O analysis
 * - So sánh với cách tiếp cận khác
 */
export const CODE_EXAMPLES = {
    /**
     * VÍ DỤ 1: O(1) - CONSTANT TIME
     * 
     * ĐẶC ĐIỂM:
     * - Không có vòng lặp phụ thuộc n
     * - Chỉ có phép tính cố định
     * - Thời gian không đổi dù input lớn hay nhỏ
     */
    constant: {
        title: 'O(1) - Constant Time',
        code: `
/**
 * Truy cập phần tử đầu tiên của mảng
 * 
 * PHÂN TÍCH:
 * - Số phép tính: 1 (chỉ truy cập index 0)
 * - Không phụ thuộc kích thước mảng
 * - T(n) = c = O(1) với mọi n
 * 
 * SO SÁNH:
 * ✅ O(1): Truy cập trực tiếp bằng index
 * ❌ O(n): Phải duyệt từ đầu nếu dùng Linked List
 */
function getFirst<T>(arr: T[]): T | undefined {
    return arr[0]; // O(1) - Một phép tính duy nhất
}

/**
 * Kiểm tra số chẵn hay lẻ
 * 
 * PHÂN TÍCH:
 * - Chỉ 1 phép modulo và 1 phép so sánh
 * - Không quan tâm n lớn hay nhỏ
 * - T(n) = 2 = O(1)
 */
function isEven(n: number): boolean {
    return n % 2 === 0; // O(1)
}
`,
        complexity: TimeComplexity.CONSTANT,
        keyPoints: [
            'Không có vòng lặp',
            'Số phép tính cố định',
            'Thời gian không đổi với mọi input size'
        ]
    },

    /**
     * VÍ DỤ 2: O(log n) - LOGARITHMIC TIME
     * 
     * ĐẶC ĐIỂM:
     * - Chia đôi dữ liệu mỗi bước
     * - Số bước = log₂(n)
     * - Rất hiệu quả cho dữ liệu lớn
     */
    logarithmic: {
        title: 'O(log n) - Logarithmic Time',
        code: `
/**
 * Binary Search - Tìm kiếm nhị phân
 * 
 * THUẬT TOÁN:
 * 1. So sánh target với phần tử giữa
 * 2. Nếu bằng → tìm thấy
 * 3. Nếu nhỏ hơn → tìm nửa trái
 * 4. Nếu lớn hơn → tìm nửa phải
 * 5. Lặp lại cho đến khi tìm thấy hoặc hết phạm vi
 * 
 * PHÂN TÍCH:
 * - Mỗi bước: chia đôi phạm vi tìm kiếm
 * - Số bước tối đa: log₂(n)
 * - Ví dụ: n = 1,000,000 → chỉ cần ~20 bước!
 * 
 * ĐIỀU KIỆN:
 * ⚠️ Mảng PHẢI được sắp xếp trước!
 * 
 * SO SÁNH VỚI LINEAR SEARCH:
 * | Input size | Linear Search | Binary Search |
 * |------------|---------------|---------------|
 * | 1,000      | 1,000 bước    | ~10 bước      |
 * | 1,000,000  | 1,000,000 bước| ~20 bước      |
 */
function binarySearch(arr: number[], target: number): number {
    let left = 0;                    // O(1)
    let right = arr.length - 1;      // O(1)
    
    // Vòng lặp chạy log₂(n) lần
    while (left <= right) {          // O(log n) iterations
        const mid = Math.floor((left + right) / 2);  // O(1)
        
        if (arr[mid] === target) {
            return mid;              // Tìm thấy!
        } else if (arr[mid] < target) {
            left = mid + 1;          // Tìm nửa phải
        } else {
            right = mid - 1;         // Tìm nửa trái
        }
    }
    
    return -1; // Không tìm thấy
}
// Tổng: O(1) + O(log n) × O(1) = O(log n)
`,
        complexity: TimeComplexity.LOGARITHMIC,
        keyPoints: [
            'Chia đôi phạm vi mỗi bước',
            'Yêu cầu mảng đã sắp xếp',
            'Cực kỳ hiệu quả: 1 triệu phần tử chỉ cần ~20 bước'
        ]
    },

    /**
     * VÍ DỤ 3: O(n) - LINEAR TIME
     * 
     * ĐẶC ĐIỂM:
     * - Duyệt qua tất cả n phần tử
     * - Thời gian tỷ lệ thuận với n
     * - Thường gặp với 1 vòng lặp đơn
     */
    linear: {
        title: 'O(n) - Linear Time',
        code: `
/**
 * Tìm giá trị lớn nhất trong mảng
 * 
 * THUẬT TOÁN:
 * 1. Giả sử phần tử đầu là max
 * 2. Duyệt qua từng phần tử
 * 3. Nếu phần tử hiện tại > max → cập nhật max
 * 4. Trả về max
 * 
 * PHÂN TÍCH:
 * - Số phép so sánh: n-1
 * - Phải xem TẤT CẢ phần tử (không thể bỏ qua)
 * - T(n) = n - 1 = O(n)
 * 
 * TẠI SAO KHÔNG THỂ NHỎ HƠN O(n)?
 * → Vì phải kiểm tra MỌI phần tử để chắc chắn đó là max!
 * → Nếu bỏ qua 1 phần tử, có thể bỏ lỡ max thực sự.
 */
function findMax(arr: number[]): number {
    if (arr.length === 0) {
        throw new Error('Mảng rỗng!');
    }
    
    let max = arr[0];  // O(1)
    
    // Duyệt n-1 phần tử còn lại
    for (let i = 1; i < arr.length; i++) {  // O(n)
        if (arr[i] > max) {  // O(1)
            max = arr[i];
        }
    }
    
    return max;
}
// Tổng: O(1) + O(n) × O(1) = O(n)

/**
 * Linear Search - Tìm kiếm tuần tự
 * 
 * SO SÁNH VỚI BINARY SEARCH:
 * ✅ Ưu điểm: Không cần mảng sắp xếp
 * ❌ Nhược điểm: Chậm hơn nhiều với dữ liệu lớn
 */
function linearSearch(arr: number[], target: number): number {
    for (let i = 0; i < arr.length; i++) {  // O(n)
        if (arr[i] === target) {
            return i;  // Best case: O(1) nếu ở đầu
        }
    }
    return -1;  // Worst case: O(n) nếu không có
}
`,
        complexity: TimeComplexity.LINEAR,
        keyPoints: [
            'Duyệt qua tất cả phần tử',
            'Thời gian tỷ lệ thuận với n',
            'Không thể tối ưu hơn nếu phải xem mọi phần tử'
        ]
    },

    /**
     * VÍ DỤ 4: O(n²) - QUADRATIC TIME
     * 
     * ĐẶC ĐIỂM:
     * - 2 vòng lặp lồng nhau
     * - Thời gian tăng theo bình phương
     * - Chậm đáng kể khi n lớn
     */
    quadratic: {
        title: 'O(n²) - Quadratic Time',
        code: `
/**
 * Bubble Sort - Sắp xếp nổi bọt
 * 
 * THUẬT TOÁN:
 * 1. So sánh từng cặp phần tử liền kề
 * 2. Nếu sai thứ tự → đổi chỗ (swap)
 * 3. Phần tử lớn nhất "nổi" lên cuối
 * 4. Lặp lại n-1 lần
 * 
 * PHÂN TÍCH:
 * - Vòng ngoài: n-1 lần
 * - Vòng trong: trung bình n/2 lần
 * - Tổng: (n-1) × (n/2) ≈ n²/2 = O(n²)
 * 
 * SO SÁNH VỚI CÁC THUẬT TOÁN SORT KHÁC:
 * | Thuật toán | Average | Worst | Space | Stable? |
 * |------------|---------|-------|-------|---------|
 * | Bubble     | O(n²)   | O(n²) | O(1)  | ✅      |
 * | Selection  | O(n²)   | O(n²) | O(1)  | ❌      |
 * | Merge      | O(nlogn)| O(nlogn)| O(n)| ✅      |
 * | Quick      | O(nlogn)| O(n²) | O(logn)| ❌     |
 * 
 * ƯU ĐIỂM:
 * ✅ Đơn giản, dễ hiểu
 * ✅ In-place (không cần bộ nhớ phụ)
 * ✅ Stable (giữ thứ tự các phần tử bằng nhau)
 * 
 * NHƯỢC ĐIỂM:
 * ❌ Rất chậm với dữ liệu lớn
 * ❌ Không phù hợp cho production
 */
function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    
    // Vòng ngoài: n-1 lần
    for (let i = 0; i < n - 1; i++) {      // O(n)
        
        // Vòng trong: duyệt phần chưa sắp xếp
        for (let j = 0; j < n - i - 1; j++) { // O(n)
            
            // So sánh và swap nếu cần
            if (arr[j] > arr[j + 1]) {        // O(1)
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return arr;
}
// Tổng: O(n) × O(n) = O(n²)

/**
 * TÍNH SỐ PHÉP TÍNH CHI TIẾT:
 * - Pass 1: n-1 comparisons
 * - Pass 2: n-2 comparisons
 * - ...
 * - Pass n-1: 1 comparison
 * 
 * Tổng = (n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)
 */
`,
        complexity: TimeComplexity.QUADRATIC,
        keyPoints: [
            '2 vòng lặp lồng nhau → O(n²)',
            'Chậm đáng kể khi n > 1000',
            'Thường dùng cho dữ liệu nhỏ hoặc demo học tập'
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEMOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Danh sách tất cả demos cho Chapter 1
 */
export const CHAPTER_1_DEMOS: DemoReference[] = CHAPTER_1_INFO.demos;

/**
 * Export default cho Chapter 1
 */
export default {
    info: CHAPTER_1_INFO,
    demos: CHAPTER_1_DEMOS,
    complexityLevels: COMPLEXITY_LEVELS,
    codeExamples: CODE_EXAMPLES
};
