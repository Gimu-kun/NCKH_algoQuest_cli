import type { TheoryContent } from '../types';

export const CH2_P1_BUBBLE: TheoryContent = {
    introduction: `
# Bubble Sort Algorithm (Sắp Xếp Nổi Bọt)

**Bubble Sort** là thuật toán sắp xếp đơn giản nhất, hoạt động bằng cách lặp đi lặp lại việc đổi chỗ 2 phần tử liền kề nếu chúng đứng sai thứ tự.

## Nguyên lý hoạt động
Giống như những bọt khí nhẹ nổi lên mặt nước, các phần tử lớn nhất sẽ "nổi" dần về cuối mảng sau mỗi vòng lặp.

## Độ phức tạp
- **Time**: $O(n^2)$ - Chậm, không dùng cho dữ liệu lớn.
- **Space**: $O(1)$ - In-place, không tốn bộ nhớ phụ.
    `,
    keyConcepts: [
        {
            title: 'Swapping mechanism',
            content: 'So sánh cặp liền kề (j, j+1) và đổi chỗ nếu a[j] > a[j+1].',
            importance: 'critical'
        },
        {
            title: 'Simple Sorts',
            content: 'Thuộc nhóm thuật toán đơn giản, dễ cài đặt nhưng hiệu suất thấp.',
            importance: 'basic'
        }
    ],
    examples: [
        {
            title: 'Bubble Sort Implementation',
            description: 'Sắp xếp nổi bọt - Đẩy phần tử lớn nhất về cuối mỗi vòng lặp.',
            code: `function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
            }
        }
    }
    return arr;
}`,
            language: 'typescript',
            explanation: 'Hai vòng lặp lồng nhau tạo nên độ phức tạp O(n²).'
        }
    ],
    summary: 'Bubble Sort là bài học vỡ lòng về thuật toán sắp xếp, phù hợp để hiểu concept cơ bản về so sánh và hoán đổi.',
    readingTime: 12
};

export const CH2_P5_DIVIDE_CONQUER: TheoryContent = {
    introduction: `
# Divide & Conquer Strategy (Chia Để Trị)

**Divide & Conquer** là một mô hình thiết kế thuật toán quan trọng, giải quyết vấn đề bằng cách:
1. **Divide**: Chia bài toán lớn thành các bài toán con nhỏ hơn.
2. **Conquer**: Giải quyết các bài toán con (thường bằng đệ quy).
3. **Combine**: Kết hợp kết quả các bài toán con để ra kết quả cuối cùng.

Chiến lược này là nền tảng của các thuật toán hiệu quả như Merge Sort, Quick Sort, Binary Search.
    `,
    keyConcepts: [
        {
            title: 'Recursion (Đệ quy)',
            content: 'Công cụ chính để implement Divide & Conquer.',
            importance: 'critical'
        },
        {
            title: 'Logarithmic Efficiency',
            content: 'Chia đôi bài toán thường dẫn đến độ phức tạp logarit O(log n) hoặc linearithmic O(n log n).',
            importance: 'important'
        }
    ],
    examples: [],
    summary: 'Hiểu tư duy "Chia để trị" giúp bạn giải quyết các bài toán phức tạp bằng cách bẻ nhỏ chúng ra.',
    readingTime: 10
};

export const CH2_P6_QUICK: TheoryContent = {
    introduction: `
# Quick Sort Algorithm

**Quick Sort** là thuật toán sắp xếp theo kiểu Divide & Conquer cực kỳ hiệu quả.

## Nguyên lý hoạt động
1. Chọn một phần tử làm **Pivot** (chốt).
2. **Partitioning**: Đưa tất cả phần tử nhỏ hơn Pivot sang trái, lớn hơn sang phải.
3. Đệ quy sắp xếp 2 phần con bên trái và bên phải Pivot.

## Độ phức tạp
- **Average**: $O(n log n)$ - Rất nhanh.
- **Worst Case**: $O(n^2)$ - Nếu chọn pivot tệ (vd: mảng đã sort sẵn mà chọn pivot là phần tử đầu).
    `,
    keyConcepts: [
        {
            title: 'Pivot Selection',
            content: 'Cách chọn pivot ảnh hưởng lớn đến hiệu suất (đầu, cuối, giữa, random).',
            importance: 'critical'
        },
        {
            title: 'In-place but Unstable',
            content: 'Quick Sort không tốn bộ nhớ phụ O(n) như Merge Sort, nhưng là thuật toán không ổn định.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'Quick Sort Partition Logic',
            description: 'Trái tim của Quick Sort',
            code: `function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high]; // Chọn phần tử cuối làm pivot
    let i = (low - 1);
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
            language: 'typescript',
            explanation: 'Sau partition, pivot nằm đúng vị trí "chuẩn" của nó trong mảng đã sắp xếp.'
        }
    ],
    summary: 'Quick Sort là thuật toán sắp xếp mặc định trong nhiều ngôn ngữ lập trình (như C++ std::sort) vì tốc độ thực tế rất cao.',
    readingTime: 15
};

export const CH2_P9_BINARY: TheoryContent = {
    introduction: `
# Binary Search (Tìm Kiếm Nhị Phân)

**Binary Search** là thuật toán tìm kiếm tối ưu trên **dữ liệu đã được sắp xếp**.

## Nguyên lý hoạt động
Thay vì tìm từng phần tử (Linear Search), ta so sánh target với phần tử **giữa** (mid):
- Nếu bằng: Tìm thấy!
- Nếu nhỏ hơn: Tìm tiếp ở nửa bên trái.
- Nếu lớn hơn: Tìm tiếp ở nửa bên phải.

Mỗi bước đi loại bỏ được **một nửa** số phần tử còn lại → $O(log n)$.
    `,
    keyConcepts: [
        {
            title: 'Sorted Requirement',
            content: 'Bắt buộc mảng phải được sắp xếp trước thì mới dùng được Binary Search.',
            importance: 'critical'
        },
        {
            title: 'O(log n) speed',
            content: 'Tìm trong 1 triệu phần tử chỉ mất khoảng 20 bước so sánh.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'Binary Search Implementation',
            description: 'Tìm kiếm nhị phân lặp (Iterative)',
            code: `function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid; // Found
        if (arr[mid] < target) left = mid + 1; // Go Right
        else right = mid - 1; // Go Left
    }
    return -1; // Not Found
}`,
            language: 'typescript',
            explanation: 'Biến left và right thu hẹp dần phạm vi tìm kiếm.'
        }
    ],
    summary: 'Binary Search minh chứng cho sức mạnh của việc giảm không gian tìm kiếm. Nó nhanh hơn Linear Search gấp bội khi n lớn.',
    readingTime: 12
};
