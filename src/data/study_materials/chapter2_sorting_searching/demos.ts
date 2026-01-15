/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAPTER 2: DEMOS - SORTING & SEARCHING
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Export các demo và thông tin chi tiết về thuật toán Sorting & Searching.
 * Kết nối với các demo trong folder algo_demos/Chapter_2_Search_Sort/.
 * 
 * NỘI DUNG:
 * - 2 thuật toán Searching: Linear Search, Binary Search
 * - 6 thuật toán Sorting: Bubble, Selection, Insertion, Merge, Quick, Heap
 * 
 * ĐẶC ĐIỂM:
 * - Mỗi thuật toán có phân tích chi tiết về độ phức tạp
 * - So sánh ưu/nhược điểm giữa các thuật toán
 * - Code mẫu với giải thích từng bước
 * 
 * @module Chapter2Demos
 * @category StudyMaterials/Demos
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DemoReference, ChapterInfo, AlgorithmComparison } from '../types';
import { ChapterNumber } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// THÔNG TIN CHƯƠNG 2
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về Chương 2: Sorting & Searching
 */
export const CHAPTER_2_INFO: ChapterInfo = {
    chapterNumber: ChapterNumber.SORTING_SEARCHING,
    title: 'Thuật Toán Sắp Xếp & Tìm Kiếm',
    titleEn: 'Sorting & Searching Algorithms',
    description: 'Học các thuật toán sắp xếp từ đơn giản đến phức tạp và thuật toán tìm kiếm hiệu quả.',
    topics: [
        'Linear Search - Tìm kiếm tuần tự',
        'Binary Search - Tìm kiếm nhị phân',
        'Bubble Sort - Sắp xếp nổi bọt',
        'Selection Sort - Sắp xếp chọn',
        'Insertion Sort - Sắp xếp chèn',
        'Binary Insertion Sort - Sắp xếp chèn nhị phân',
        'Merge Sort - Sắp xếp trộn (Divide & Conquer)',
        'Quick Sort - Sắp xếp nhanh (Partition)',
        'Heap Sort - Sắp xếp vun đống',
        'Shell Sort - Sắp xếp vỏ sò (Gap-based)',
        'Shaker Sort - Sắp xếp lắc (Cocktail Sort)',
        'Interchange Sort - Sắp xếp đổi chỗ trực tiếp',
        'Counting Sort - Sắp xếp đếm O(n+k)',
        'Radix Sort - Sắp xếp theo cơ số O(d(n+k))'
    ],
    demos: [
        {
            name: 'Linear Search',
            path: 'algo_demos/Chapter_2_Search_Sort/LinearSearch.ts',
            description: 'Tìm kiếm tuần tự - duyệt từ đầu đến cuối O(n)'
        },
        {
            name: 'Binary Search',
            path: 'algo_demos/Chapter_2_Search_Sort/BinarySearch.ts',
            description: 'Tìm kiếm nhị phân - chia đôi mỗi bước O(log n)'
        },
        {
            name: 'Bubble Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/BubbleSort.ts',
            description: 'Sắp xếp nổi bọt - swap cặp liền kề O(n²)'
        },
        {
            name: 'Selection Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/SelectionSort.ts',
            description: 'Sắp xếp chọn - tìm min đặt vào đầu O(n²)'
        },
        {
            name: 'Insertion Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/InsertionSort.ts',
            description: 'Sắp xếp chèn - chèn vào vị trí đúng O(n²)'
        },
        {
            name: 'Binary Insertion Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/BinaryInsertionSort.ts',
            description: 'Sắp xếp chèn dùng Binary Search tìm vị trí'
        },
        {
            name: 'Merge Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/MergeSort.ts',
            description: 'Sắp xếp trộn - Divide & Conquer O(n log n)'
        },
        {
            name: 'Quick Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/QuickSort.ts',
            description: 'Sắp xếp nhanh - Partition O(n log n)'
        },
        {
            name: 'Heap Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/HeapSort.ts',
            description: 'Sắp xếp vun đống - Max Heap O(n log n)'
        },
        {
            name: 'Shell Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/ShellSort.ts',
            description: 'Cải tiến Insertion Sort với gap sequence'
        },
        {
            name: 'Shaker Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/ShakerSort.ts',
            description: 'Bubble Sort 2 chiều (Cocktail Sort)'
        },
        {
            name: 'Interchange Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/InterchangeSort.ts',
            description: 'Đổi chỗ trực tiếp - swap ngay khi sai thứ tự'
        },
        {
            name: 'Counting Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/CountingSort.ts',
            description: 'Non-comparison sort - đếm số lần xuất hiện O(n+k)'
        },
        {
            name: 'Radix Sort',
            path: 'algo_demos/Chapter_2_Search_Sort/RadixSort.ts',
            description: 'Non-comparison sort - sắp xếp theo từng digit O(d(n+k))'
        }
    ],
    prerequisites: [ChapterNumber.COMPLEXITY] // Cần hiểu Big O trước
};

// ═══════════════════════════════════════════════════════════════════════════
// CHI TIẾT CÁC THUẬT TOÁN SEARCHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thông tin chi tiết về thuật toán Linear Search
 * 
 * THUẬT TOÁN:
 * - Duyệt tuần tự từ đầu đến cuối mảng
 * - So sánh từng phần tử với target
 * - Trả về index nếu tìm thấy, -1 nếu không
 * 
 * KHI NÀO DÙNG:
 * - Mảng chưa sắp xếp
 * - Mảng nhỏ
 * - Chỉ tìm kiếm một lần
 */
export const LINEAR_SEARCH_INFO: AlgorithmComparison = {
    name: 'Linear Search',
    complexity: {
        timeComplexity: {
            best: 'O(1)',      // Target ở đầu mảng
            average: 'O(n)',   // Target ở giữa
            worst: 'O(n)'      // Target ở cuối hoặc không có
        },
        spaceComplexity: 'O(1)' // Chỉ dùng biến index
    },
    isStable: true,  // Không áp dụng cho searching
    isInPlace: true, // Không dùng bộ nhớ phụ
    advantages: [
        'Đơn giản, dễ cài đặt',
        'Không yêu cầu mảng sắp xếp',
        'Hoạt động với mọi loại dữ liệu',
        'Tốt cho mảng nhỏ'
    ],
    disadvantages: [
        'Chậm với mảng lớn O(n)',
        'Không tận dụng được thông tin thứ tự',
        'Phải duyệt toàn bộ nếu không tìm thấy'
    ],
    bestUseCases: [
        'Mảng chưa sắp xếp',
        'Mảng kích thước nhỏ (n < 100)',
        'Chỉ tìm kiếm một lần (không đáng sắp xếp)',
        'Linked List (không thể truy cập ngẫu nhiên)'
    ]
};

/**
 * Thông tin chi tiết về thuật toán Binary Search
 * 
 * THUẬT TOÁN:
 * 1. So sánh target với phần tử giữa (mid)
 * 2. Nếu bằng → trả về mid
 * 3. Nếu target < arr[mid] → tìm nửa trái
 * 4. Nếu target > arr[mid] → tìm nửa phải
 * 5. Lặp lại cho đến khi tìm thấy hoặc hết phạm vi
 * 
 * ĐIỀU KIỆN TIÊN QUYẾT:
 * ⚠️ MẢNG PHẢI ĐƯỢC SẮP XẾP TRƯỚC!
 * 
 * KĨ THUẬT:
 * - Divide and Conquer: Chia bài toán thành bài toán con
 * - Two Pointers: Dùng left và right để thu hẹp phạm vi
 */
export const BINARY_SEARCH_INFO: AlgorithmComparison = {
    name: 'Binary Search',
    complexity: {
        timeComplexity: {
            best: 'O(1)',        // Target ở chính giữa
            average: 'O(log n)', // Trung bình chia đôi
            worst: 'O(log n)'    // Phải chia đến tận cùng
        },
        spaceComplexity: 'O(1)' // Iterative version
        // Nếu dùng đệ quy: O(log n) cho stack
    },
    isStable: true,
    isInPlace: true,
    advantages: [
        'Rất nhanh O(log n) - 1 triệu phần tử chỉ cần ~20 bước',
        'Có thể mở rộng để tìm lower_bound, upper_bound',
        'Áp dụng được cho nhiều bài toán tối ưu',
        'Dễ cài đặt iterative hoặc recursive'
    ],
    disadvantages: [
        'YÊU CẦU mảng đã sắp xếp',
        'Không hoạt động với Linked List',
        'Chi phí sắp xếp O(n log n) nếu chưa sorted',
        'Cần chú ý integer overflow khi tính mid'
    ],
    bestUseCases: [
        'Mảng đã sắp xếp và tìm kiếm nhiều lần',
        'Database index lookup',
        'Tìm kiếm trong đáp án có thứ tự',
        'Bài toán tối ưu (binary search on answer)'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// CHI TIẾT CÁC THUẬT TOÁN SORTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bubble Sort - Sắp xếp nổi bọt
 * 
 * Ý TƯỞNG:
 * - So sánh từng cặp phần tử liền kề
 * - Nếu sai thứ tự → swap (đổi chỗ)
 * - Phần tử lớn nhất "nổi" lên cuối mỗi pass
 * 
 * TẠI SAO GỌI LÀ "NỔI BỌT"?
 * → Giống bọt khí nổi lên mặt nước, phần tử lớn "nổi" lên cuối mảng
 * 
 * TỐI ƯU HÓA:
 * - Dùng flag để kiểm tra có swap không
 * - Nếu không swap → mảng đã sorted → dừng sớm → O(n) best case
 */
export const BUBBLE_SORT_INFO: AlgorithmComparison = {
    name: 'Bubble Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n)',    // Mảng đã sắp xếp (với tối ưu)
            average: 'O(n²)',
            worst: 'O(n²)'   // Mảng sắp xếp ngược
        },
        spaceComplexity: 'O(1)'
    },
    isStable: true,    // Chỉ swap khi arr[j] > arr[j+1], không swap khi bằng
    isInPlace: true,   // Chỉ dùng biến swap, không cần mảng phụ
    advantages: [
        'Đơn giản nhất, dễ hiểu và cài đặt',
        'In-place - không cần bộ nhớ phụ',
        'Stable - giữ thứ tự các phần tử bằng nhau',
        'Best case O(n) nếu đã sorted (với tối ưu flag)'
    ],
    disadvantages: [
        'Chậm nhất trong các thuật toán O(n²)',
        'Số lần swap nhiều (mỗi cặp so sánh có thể swap)',
        'Không phù hợp cho dữ liệu lớn',
        'Không thực tế cho production'
    ],
    bestUseCases: [
        'Học và demo cơ bản về sorting',
        'Mảng rất nhỏ (n < 20)',
        'Kiểm tra mảng đã gần sorted chưa'
    ]
};

/**
 * Selection Sort - Sắp xếp chọn
 * 
 * Ý TƯỞNG:
 * - Tìm phần tử NHỎ NHẤT trong đoạn chưa sắp xếp
 * - Đổi chỗ với phần tử đầu đoạn chưa sắp xếp
 * - Thu hẹp đoạn chưa sắp xếp, lặp lại
 * 
 * ĐẶC ĐIỂM:
 * - Số lần swap ít nhất: chính xác n-1 swaps
 * - Số lần so sánh: luôn n(n-1)/2 (không phụ thuộc input)
 */
export const SELECTION_SORT_INFO: AlgorithmComparison = {
    name: 'Selection Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n²)',   // Luôn phải tìm min
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        spaceComplexity: 'O(1)'
    },
    isStable: false,   // Swap có thể đảo thứ tự (ví dụ: [2a, 2b, 1] → [1, 2b, 2a])
    isInPlace: true,
    advantages: [
        'Đơn giản, dễ hiểu',
        'In-place - O(1) space',
        'Số lần swap ÍT NHẤT: chỉ n-1 swaps',
        'Tốt khi chi phí swap cao (vì swap ít)'
    ],
    disadvantages: [
        'Luôn O(n²) kể cả mảng đã sorted',
        'Không Stable',
        'Không thực tế cho dữ liệu lớn'
    ],
    bestUseCases: [
        'Khi chi phí swap cao (bộ nhớ flash)',
        'Cần biết chính xác số swap',
        'Mảng nhỏ'
    ]
};

/**
 * Insertion Sort - Sắp xếp chèn
 * 
 * Ý TƯỞNG:
 * - Giống cách sắp bài trong tay
 * - Lấy từng "lá bài" (phần tử)
 * - Chèn vào vị trí đúng trong phần đã sorted
 * 
 * KĨ THUẬT:
 * - Dịch chuyển (shift) các phần tử lớn hơn sang phải
 * - Chèn phần tử hiện tại vào "lỗ trống"
 * 
 * ƯU ĐIỂM ĐẶC BIỆT:
 * - Online algorithm: Có thể xử lý dữ liệu đến từng phần tử một
 * - Adaptive: Nhanh với dữ liệu gần sorted
 */
export const INSERTION_SORT_INFO: AlgorithmComparison = {
    name: 'Insertion Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n)',    // Mảng đã sorted
            average: 'O(n²)',
            worst: 'O(n²)'   // Mảng sorted ngược
        },
        spaceComplexity: 'O(1)'
    },
    isStable: true,    // Chỉ dịch chuyển khi arr[j] > key, không khi bằng
    isInPlace: true,
    advantages: [
        'Đơn giản, dễ cài đặt',
        'Adaptive - O(n) cho mảng gần sorted',
        'Online - có thể sort từng phần tử khi nhận được',
        'Stable và In-place',
        'Ít overhead so với thuật toán phức tạp',
        'Tốt cho mảng nhỏ - được dùng trong hybrid sort'
    ],
    disadvantages: [
        'O(n²) worst case',
        'Nhiều phép shift khi mảng ngược'
    ],
    bestUseCases: [
        'Mảng nhỏ (n < 50) - thậm chí nhanh hơn Quick Sort',
        'Mảng gần như đã sorted',
        'Cần stable sort và in-place',
        'Dùng trong hybrid sort (TimSort, IntroSort)'
    ]
};

/**
 * Merge Sort - Sắp xếp trộn
 * 
 * KĨ THUẬT CHÍNH: Divide and Conquer (Chia để trị)
 * 
 * THUẬT TOÁN:
 * 1. DIVIDE: Chia mảng thành 2 nửa
 * 2. CONQUER: Đệ quy sắp xếp từng nửa
 * 3. COMBINE: Trộn (merge) 2 nửa đã sorted thành 1 mảng sorted
 * 
 * PHÂN TÍCH:
 * - Số mức đệ quy: log₂(n)
 * - Mỗi mức: O(n) operations cho merge
 * - Tổng: O(n log n)
 * 
 * RECURRENCE RELATION:
 * T(n) = 2·T(n/2) + O(n)
 * → T(n) = O(n log n) [Master Theorem]
 */
export const MERGE_SORT_INFO: AlgorithmComparison = {
    name: 'Merge Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)' // Luôn ổn định!
        },
        spaceComplexity: 'O(n)' // Cần mảng phụ để merge
    },
    isStable: true,    // Merge chọn left khi bằng nhau
    isInPlace: false,  // Cần O(n) bộ nhớ phụ
    advantages: [
        'Luôn O(n log n) - worst case đảm bảo',
        'Stable',
        'Hiệu quả với dữ liệu lớn',
        'Tốt cho external sorting (file lớn)',
        'Parallelizable - có thể chạy song song',
        'Predictable performance'
    ],
    disadvantages: [
        'Cần O(n) bộ nhớ phụ - KHÔNG in-place',
        'Overhead đệ quy',
        'Chậm hơn Quick Sort trong thực tế (vì cache miss)'
    ],
    bestUseCases: [
        'CẦN STABLE SORT',
        'Worst case performance quan trọng',
        'External sorting (dữ liệu không vừa RAM)',
        'Linked List (merge dễ, không cần random access)',
        'Parallel processing'
    ]
};

/**
 * Quick Sort - Sắp xếp nhanh
 * 
 * KĨ THUẬT CHÍNH: Divide and Conquer + Partition
 * 
 * THUẬT TOÁN:
 * 1. Chọn PIVOT (phần tử chốt)
 * 2. PARTITION: Chia mảng thành 3 phần
 *    - Trái: các phần tử < pivot
 *    - Pivot: đã đúng vị trí
 *    - Phải: các phần tử > pivot
 * 3. Đệ quy sắp xếp phần trái và phải
 * 
 * CHỌN PIVOT:
 * - Đầu/Cuối: Đơn giản nhưng O(n²) với sorted array
 * - Random: Tránh worst case
 * - Median-of-three: Lấy median của first, middle, last
 * 
 * TẠI SAO "QUICK"?
 * - In-practice nhanh nhất vì cache-friendly
 * - Ít data movement so với Merge Sort
 */
export const QUICK_SORT_INFO: AlgorithmComparison = {
    name: 'Quick Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)'     // Xảy ra khi pivot luôn là min/max
        },
        spaceComplexity: 'O(log n)' // Stack đệ quy
    },
    isStable: false,   // Partition có thể đảo thứ tự
    isInPlace: true,   // Chỉ dùng O(log n) stack
    advantages: [
        'Nhanh nhất trong thực tế (cache-friendly)',
        'In-place - chỉ O(log n) stack',
        'Divide and Conquer - có thể parallelize',
        'Thường được dùng trong standard library'
    ],
    disadvantages: [
        'O(n²) worst case (có thể tránh bằng random pivot)',
        'Không Stable',
        'Đệ quy sâu có thể stack overflow'
    ],
    bestUseCases: [
        'Sorting array trong RAM',
        'Khi tốc độ trung bình quan trọng nhất',
        'Không cần stable sort',
        'Standard library sort'
    ]
};

/**
 * Heap Sort - Sắp xếp vun đống
 * 
 * CẤU TRÚC DỮ LIỆU: Max Heap
 * - Complete Binary Tree
 * - Mỗi node >= con của nó
 * - Root là phần tử lớn nhất
 * 
 * THUẬT TOÁN:
 * 1. Build Max Heap từ mảng: O(n)
 * 2. Lặp n-1 lần:
 *    a. Swap root (max) với phần tử cuối
 *    b. Giảm heap size
 *    c. Heapify để khôi phục heap: O(log n)
 * 
 * ĐẶC ĐIỂM:
 * - Không cần bộ nhớ phụ (in-place)
 * - Worst case đảm bảo O(n log n)
 * - Nhưng chậm hơn Quick Sort trong thực tế (cache miss)
 */
export const HEAP_SORT_INFO: AlgorithmComparison = {
    name: 'Heap Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)' // Đảm bảo!
        },
        spaceComplexity: 'O(1)' // In-place
    },
    isStable: false,   // Heapify có thể đảo thứ tự
    isInPlace: true,
    advantages: [
        'Worst case đảm bảo O(n log n)',
        'In-place - O(1) space',
        'Không có worst case input (không như Quick Sort)',
        'Học về Heap data structure'
    ],
    disadvantages: [
        'Chậm hơn Quick Sort trong thực tế',
        'Không Stable',
        'Cache-unfriendly (truy cập không liên tục)',
        'Phức tạp hơn Quick Sort'
    ],
    bestUseCases: [
        'Khi cần worst case guarantee + in-place',
        'Memory hạn chế (embedded systems)',
        'Tìm k phần tử lớn nhất/nhỏ nhất (partial sort)'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// THUẬT TOÁN SORTING BỔ SUNG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shell Sort - Cải tiến Insertion Sort với gap sequence
 * 
 * Ý TƯỞNG:
 * - Insertion Sort hiệu quả với mảng gần sorted
 * - Shell Sort chia mảng thành nhóm cách nhau GAP phần tử
 * - Sort từng nhóm, rồi giảm GAP cho đến 1
 */
export const SHELL_SORT_INFO: AlgorithmComparison = {
    name: 'Shell Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n^1.3)',  // Phụ thuộc gap sequence
            worst: 'O(n²)'        // Shell's original sequence
        },
        spaceComplexity: 'O(1)'
    },
    isStable: false,
    isInPlace: true,
    advantages: [
        'Nhanh hơn Insertion Sort đáng kể',
        'In-place O(1) space',
        'Đơn giản hơn Quick/Merge',
        'Tốt cho medium-sized arrays'
    ],
    disadvantages: [
        'Không Stable',
        'Độ phức tạp phụ thuộc gap sequence',
        'Chậm hơn O(n log n) sorts'
    ],
    bestUseCases: [
        'Mảng vừa (100-10000 phần tử)',
        'Embedded systems',
        'Khi cần cải tiến Insertion Sort'
    ]
};

/**
 * Shaker Sort (Cocktail Sort) - Bubble Sort 2 chiều
 * 
 * Ý TƯỞNG:
 * - Bubble Sort chỉ đi 1 chiều
 * - Shaker Sort đi cả 2 chiều (forward & backward)
 * - Giải quyết vấn đề "turtle" (phần tử nhỏ ở cuối)
 */
export const SHAKER_SORT_INFO: AlgorithmComparison = {
    name: 'Shaker Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        spaceComplexity: 'O(1)'
    },
    isStable: true,
    isInPlace: true,
    advantages: [
        'Giải quyết turtle problem của Bubble Sort',
        'Stable và In-place',
        'Adaptive (dừng sớm nếu đã sorted)'
    ],
    disadvantages: [
        'Vẫn O(n²)',
        'Không thực tế cho production'
    ],
    bestUseCases: [
        'Học thuật, demo sorting',
        'Mảng có turtle/rabbit elements'
    ]
};

/**
 * Interchange Sort - Đổi chỗ trực tiếp
 * 
 * Ý TƯỞNG:
 * - So sánh mọi cặp (i, j) với j > i
 * - Swap ngay nếu arr[i] > arr[j]
 * - Đơn giản nhất trong các sort
 */
export const INTERCHANGE_SORT_INFO: AlgorithmComparison = {
    name: 'Interchange Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n²)',   // Không có early termination
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        spaceComplexity: 'O(1)'
    },
    isStable: false,
    isInPlace: true,
    advantages: [
        'Cực kỳ đơn giản',
        'In-place',
        'Dễ hiểu và code'
    ],
    disadvantages: [
        'Chậm nhất trong O(n²) sorts',
        'Nhiều swap không cần thiết',
        'Không adaptive'
    ],
    bestUseCases: [
        'Học thuật, minh họa concept',
        'Mảng rất nhỏ'
    ]
};

/**
 * Binary Insertion Sort - Dùng Binary Search tìm vị trí
 * 
 * Ý TƯỞNG:
 * - Insertion Sort thường: Linear Search O(n) tìm vị trí
 * - Binary Insertion: Binary Search O(log n) tìm vị trí
 * - Giảm số SO SÁNH, nhưng số DỊCH CHUYỂN vẫn O(n)
 */
export const BINARY_INSERTION_SORT_INFO: AlgorithmComparison = {
    name: 'Binary Insertion Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n)',
            average: 'O(n²)',  // Vẫn bị bottleneck bởi shifts
            worst: 'O(n²)'
        },
        spaceComplexity: 'O(1)'
    },
    isStable: true,
    isInPlace: true,
    advantages: [
        'Ít so sánh hơn Insertion Sort thường: O(n log n) comparisons',
        'Tốt khi so sánh tốn kém (strings, objects)',
        'Stable và In-place'
    ],
    disadvantages: [
        'Vẫn O(n²) do dịch chuyển',
        'Cache không thân thiện'
    ],
    bestUseCases: [
        'Khi so sánh tốn kém',
        'Strings dài, complex objects'
    ]
};

/**
 * Counting Sort - Non-comparison sort
 * 
 * Ý TƯỞNG:
 * - Không so sánh phần tử!
 * - Đếm số lần xuất hiện mỗi giá trị
 * - Xây dựng output từ count array
 */
export const COUNTING_SORT_INFO: AlgorithmComparison = {
    name: 'Counting Sort',
    complexity: {
        timeComplexity: {
            best: 'O(n + k)',   // k = range
            average: 'O(n + k)',
            worst: 'O(n + k)'
        },
        spaceComplexity: 'O(k)'
    },
    isStable: true,
    isInPlace: false,
    advantages: [
        'O(n) khi k = O(n) - nhanh hơn O(n log n)',
        'Stable sort',
        'Building block cho Radix Sort'
    ],
    disadvantages: [
        'Chỉ cho số nguyên',
        'Tốn O(k) bộ nhớ nếu range lớn',
        'Không hoạt động với số âm (cần offset)'
    ],
    bestUseCases: [
        'Số nguyên với range nhỏ',
        'k = O(n)',
        'Làm subroutine cho Radix Sort'
    ]
};

/**
 * Radix Sort - Sắp xếp theo từng digit
 * 
 * Ý TƯỞNG:
 * - Sắp xếp từ digit thấp nhất (LSD) đến cao nhất
 * - Dùng Counting Sort cho mỗi digit
 * - Phải dùng STABLE sort
 */
export const RADIX_SORT_INFO: AlgorithmComparison = {
    name: 'Radix Sort',
    complexity: {
        timeComplexity: {
            best: 'O(d(n + k))',   // d = digits, k = range (10)
            average: 'O(d(n + k))',
            worst: 'O(d(n + k))'
        },
        spaceComplexity: 'O(n + k)'
    },
    isStable: true,
    isInPlace: false,
    advantages: [
        'Có thể nhanh hơn O(n log n)',
        'Stable',
        'Không so sánh phần tử'
    ],
    disadvantages: [
        'Chỉ cho số nguyên/strings',
        'Tốn O(n + k) bộ nhớ',
        'Chậm nếu d lớn'
    ],
    bestUseCases: [
        'Số nguyên với số digits cố định',
        'd × k < n × log(n)',
        'Strings có độ dài cố định'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// BẢNG SO SÁNH TỔNG HỢP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tất cả thuật toán Sorting được so sánh
 * Dùng cho UI hiển thị bảng so sánh
 */
export const ALL_SORTING_ALGORITHMS: AlgorithmComparison[] = [
    // Simple O(n²) sorts
    BUBBLE_SORT_INFO,
    SELECTION_SORT_INFO,
    INSERTION_SORT_INFO,
    BINARY_INSERTION_SORT_INFO,
    INTERCHANGE_SORT_INFO,
    SHAKER_SORT_INFO,
    SHELL_SORT_INFO,
    // Efficient O(n log n) sorts
    MERGE_SORT_INFO,
    QUICK_SORT_INFO,
    HEAP_SORT_INFO,
    // Non-comparison sorts
    COUNTING_SORT_INFO,
    RADIX_SORT_INFO
];

/**
 * Tất cả thuật toán Searching
 */
export const ALL_SEARCHING_ALGORITHMS: AlgorithmComparison[] = [
    LINEAR_SEARCH_INFO,
    BINARY_SEARCH_INFO
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const CHAPTER_2_DEMOS: DemoReference[] = CHAPTER_2_INFO.demos;

export default {
    info: CHAPTER_2_INFO,
    demos: CHAPTER_2_DEMOS,
    searching: ALL_SEARCHING_ALGORITHMS,
    sorting: ALL_SORTING_ALGORITHMS
};
