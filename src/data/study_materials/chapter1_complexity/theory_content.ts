import type { TheoryContent } from '../types';

export const CH1_P1_INTRO: TheoryContent = {
    introduction: `
# Chương 1: Phân Tích Độ Phức Tạp Thuật Toán

**Độ phức tạp thuật toán** (Algorithm Complexity) là thước đo đánh giá hiệu quả của thuật toán dựa trên:
- **Thời gian** (Time Complexity): Thuật toán chạy nhanh/chậm như thế nào?
- **Không gian** (Space Complexity): Thuật toán cần bao nhiêu bộ nhớ?

## Tại sao cần Big O?

Big O mô tả **giới hạn trên** (upper bound) của thời gian chạy thuật toán khi input tăng lên vô cực. Nó giúp ta dự đoán hiệu suất trong trường hợp xấu nhất (Worst Case).
  `,
    keyConcepts: [
        {
            title: 'Algorithm Complexity',
            content: 'Đánh giá hiệu quả thuật toán về thời gian và bộ nhớ.',
            importance: 'critical'
        },
        {
            title: 'Big O Notation',
            content: 'Ký hiệu toán học mô tả hành vi giới hạn của hàm số.',
            importance: 'basic'
        }
    ],
    examples: [],
    summary: 'Hiểu Big O là bước đầu tiên để trở thành lập trình viên giỏi, giúp viết code hiệu quả và tối ưu hơn.',
    readingTime: 5
};

export const CH1_P2_COMMON: TheoryContent = {
    introduction: `
# Các Loại Độ Phức Tạp Thông Dụng

Trong thực tế, chúng ta thường gặp các loại độ phức tạp sau (xếp từ tốt nhất đến tệ nhất):

1. **O(1) - Constant**: Không phụ thuộc input.
2. **O(log n) - Logarithmic**: Tăng chậm hơn input (Binary Search).
3. **O(n) - Linear**: Tăng tuyến tính với input.
4. **O(n log n) - Linearithmic**: Các thuật toán sort hiệu quả (Merge Sort, Quick Sort).
5. **O(n²) - Quadratic**: 2 vòng lặp lồng nhau (Bubble Sort).
    `,
    keyConcepts: [
        {
            title: 'O(1) vs O(n)',
            content: 'O(1) luôn tốt nhất, O(n) chấp nhận được cho xử lý tuần tự.',
            importance: 'critical'
        },
        {
            title: 'O(n²) vs O(n log n)',
            content: 'Với input lớn, sự khác biệt giữa n² và n log n là khổng lồ.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'O(1) - Constant Time',
            description: 'Truy cập phần tử mảng',
            code: `function getFirst(arr: number[]): number {
    return arr[0]; // 1 step
}`,
            language: 'typescript',
            explanation: 'Luôn tốn 1 bước bất kể mảng dài bao nhiêu.'
        },
        {
            title: 'O(n) - Linear Time',
            description: 'Duyệt mảng',
            code: `for (let i = 0; i < n; i++) {
    console.log(arr[i]);
}`,
            language: 'typescript',
            explanation: 'Số bước chạy bằng số phần tử n.'
        }
    ],
    summary: 'Nắm vững bảng xếp hạng Big O giúp bạn nhanh chóng ước lượng hiệu suất code.',
    readingTime: 8
};

export const CH1_P6_TIME: TheoryContent = {
    introduction: `
# Phân Tích Time Complexity Chi Tiết

Để tính toán Time Complexity chính xác, chúng ta sử dụng **Quy tắc cộng** và **Quy tắc nhân**.

## Quy tắc cộng (Sum Rule)
Nếu thực hiện 2 công việc nối tiếp nhau: $T(n) = T1(n) + T2(n)$.
Ta lấy thành phần lớn nhất: $O(n^2 + n) = O(n^2)$.

## Quy tắc nhân (Product Rule)
Nếu thực hiện lồng nhau (vòng lặp lồng): $T(n) = T1(n) * T2(n)$.
$O(n) * O(n) = O(n^2)$.
    `,
    keyConcepts: [
        {
            title: 'Bỏ hằng số',
            content: 'O(2n) hay O(100n) đều đơn giản hóa thành O(n).',
            importance: 'basic'
        },
        {
            title: 'Dominant Term',
            content: 'Chỉ giữ lại bậc cao nhất của đa thức.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'Vòng lặp lồng nhau (Nested Loops)',
            description: 'Ví dụ điển hình của quy tắc nhân',
            code: `for (let i = 0; i < n; i++) {       // O(n)
    for (let j = 0; j < n; j++) {   // O(n)
        console.log(i, j);          // O(1)
    }
}
// Total: O(n * n) = O(n²)`,
            language: 'typescript',
            explanation: 'Mỗi lần lặp ngoài chạy n lần lặp trong.'
        }
    ],
    summary: 'Luôn xác định worst-case scenario và dùng các quy tắc để đơn giản hóa biểu thức Big O.',
    readingTime: 10
};

export const CH1_P7_SPACE: TheoryContent = {
    introduction: `
# Space Complexity và Bộ Nhớ Phụ

Space Complexity đo lường lượng bộ nhớ máy tính mà thuật toán cần để thực thi.

## Auxiliary Space vs Input Space
- **Input Space**: Bộ nhớ để lưu input ban đầu.
- **Auxiliary Space**: Bộ nhớ *phụ* phát sinh trong quá trình chạy (biến tạm, stack đệ quy).

Khi nói Space Complexity, ta thường tính tổng cả hai, nhưng Auxiliary Space quan trọng hơn để tối ưu.
    `,
    keyConcepts: [
        {
            title: 'In-place Algorithm',
            content: 'Thuật toán dùng O(1) bộ nhớ phụ (Bubble Sort). Rất tiết kiệm.',
            importance: 'critical'
        },
        {
            title: 'Recursive Stack',
            content: 'Đệ quy tốn bộ nhớ stack O(depth). Cẩn thận Stack Overflow.',
            importance: 'important'
        }
    ],
    examples: [
        {
            title: 'O(n) Space',
            description: 'Tạo mảng mới chứa n phần tử',
            code: `function copyArray(arr: number[]): number[] {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i]); // Tốn thêm n ô nhớ
    }
    return newArr;
}`,
            language: 'typescript',
            explanation: 'Cần bộ nhớ tuyến tính theo input n.'
        }
    ],
    summary: 'Cân bằng giữa Time và Space (Time-Space Tradeoff) là nghệ thuật của lập trình viên.',
    readingTime: 8
};
