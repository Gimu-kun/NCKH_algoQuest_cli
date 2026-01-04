/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NGÂN HÀNG CÂU HỎI CHƯƠNG 2 (Chapter 2 Question Bank)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Tuyển chọn các câu hỏi đánh giá kiến thức về Thuật toán Sắp xếp & Tìm kiếm (Sorting & Searching).
 * Phục vụ cho dungeon và các bài kiểm tra trong game.
 * 
 * CẤU TRÚC:
 * 40 câu hỏi được phân chia theo thang đo Bloom's Taxonomy:
 * - 10 câu NHỚ (Remember): Định nghĩa, độ phức tạp cơ bản.
 * - 10 câu HIỂU (Understand): Cơ chế hoạt động, so sánh thuật toán.
 * - 10 câu VẬN DỤNG (Apply): Điền code, trace thuật toán đơn giản.
 * - 10 câu PHÂN TÍCH (Analyze): Trường hợp xấu/tốt nhất, tối ưu hóa.
 * 
 * NGUỒN DỮ LIỆU:
 * - 160 Câu Hỏi Chương 2.MD
 * 
 * @module Chapter2Questions
 * @category Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { QuestionType, BloomLevel } from '../models/Question';
import type { QuestionBank } from '../models/Question';

export const CHAPTER_2_QUESTIONS: QuestionBank = {
    chapter: 2,
    title: 'Tìm kiếm và Sắp xếp',
    description: 'Các thuật toán Sắp xếp và Tìm kiếm (Sorting and Searching Algorithms)',
    questions: [
        // ========== MỨC ĐỘ NHỚ - REMEMBER LEVEL (10 câu) ==========
        {
            id: 'ch2_fill_r_001',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Tìm Kiếm Tuyến Tính',
            question: 'Độ phức tạp thời gian trung bình của thuật toán tìm kiếm tuyến tính trong mảng không sắp xếp có kích thước n là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Tìm kiếm tuyến tính phải duyệt qua từng phần tử → O(n).'
        },

        {
            id: 'ch2_fill_r_002',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Tìm Kiếm Nhị Phân',
            question: 'Độ phức tạp thời gian của tìm kiếm nhị phân trong worst case là: ___',
            blanks: [
                { text: 'Worst case: ', answer: 'O(log n)', caseSensitive: false }
            ],
            explanation: 'Chia đôi liên tục → log(n) bước.'
        },

        {
            id: 'ch2_fill_r_003',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Sắp Xếp Nổi Bọt',
            question: 'Độ phức tạp thời gian trung bình của thuật toán Bubble Sort là: ___',
            blanks: [
                { text: 'Average case: ', answer: 'O(n^2)', caseSensitive: false }
            ],
            explanation: 'Bubble Sort có độ phức tạp bậc 2 do 2 vòng lặp lồng nhau.'
        },

        {
            id: 'ch2_fill_r_004',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Sắp Xếp Trộn',
            question: 'Độ phức tạp thời gian trung bình của Merge Sort là: ___',
            blanks: [
                { text: 'Complexity: ', answer: 'O(n log n)', caseSensitive: false }
            ],
            explanation: 'Merge Sort luôn chia đôi và trộn → O(n log n).'
        },

        {
            id: 'ch2_fill_r_005',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Sắp Xếp Nhanh',
            question: 'Độ phức tạp thời gian tệ nhất của Quick Sort là: ___',
            blanks: [
                { text: 'Worst case: ', answer: 'O(n^2)', caseSensitive: false }
            ],
            explanation: 'Khi pivot luôn chia không cân bằng → O(n²).'
        },

        {
            id: 'ch2_fill_r_006',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Tên Thuật Toán',
            question: 'Thuật toán sắp xếp đơn giản nhất, hoạt động bằng cách hoán đổi các phần tử liền kề là __________.',
            blanks: [
                { text: 'Tên: ', answer: 'Bubble Sort', caseSensitive: false }
            ],
            explanation: 'Bubble Sort (nổi bọt) đơn giản nhất.'
        },

        {
            id: 'ch2_fill_r_007',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Yêu Cầu Tìm Kiếm Nhị Phân',
            question: 'Trong tìm kiếm nhị phân, dãy cần được __________ trước khi tìm.',
            blanks: [
                { text: 'Yêu cầu: ', answer: 'sắp xếp', caseSensitive: false }
            ],
            explanation: 'Binary Search yêu cầu mảng đã được sắp xếp.'
        },

        {
            id: 'ch2_fill_r_008',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Sắp Xếp Chèn',
            question: 'Sắp xếp __________ là phương pháp sắp xếp bằng cách chèn từng phần tử vào vị trí đúng.',
            blanks: [
                { text: 'Thuật toán: ', answer: 'chèn', caseSensitive: false }
            ],
            explanation: 'Insertion Sort (sắp xếp chèn).'
        },

        {
            id: 'ch2_fill_r_009',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Sắp Xếp Trộn',
            question: 'Thuật toán sắp xếp __________ chia dãy thành hai phần, sắp từng phần và trộn lại.',
            blanks: [
                { text: 'Thuật toán: ', answer: 'Merge Sort', caseSensitive: false }
            ],
            explanation: 'Merge Sort chia để trị và trộn.'
        },

        {
            id: 'ch2_fill_r_010',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Sắp Xếp Nhanh',
            question: 'Quick Sort sử dụng kỹ thuật chia mảng gọi là __________.',
            blanks: [
                { text: 'Tên: ', answer: 'partition', caseSensitive: false }
            ],
            explanation: 'Partition (phân hoạch) chia mảng theo pivot.'
        },

        // ========== UNDERSTAND LEVEL (10 câu) ==========
        {
            id: 'ch2_fill_u_001',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Chia Để Trị',
            question: 'Nếu thuật toán sắp xếp dùng chia để trị, có độ phức tạp T(n)=2T(n/2)+cn, thì độ phức tạp tổng thể là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(n log n)', caseSensitive: false }
            ],
            explanation: 'Master Theorem: T(n) = 2T(n/2) + cn → O(n log n).'
        },

        {
            id: 'ch2_fill_u_002',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'So Sánh Bubble Sort',
            question: 'Số phép so sánh trong Bubble Sort khi sắp xếp mảng kích thước n (không tối ưu) là: ___',
            blanks: [
                { text: 'Số so sánh: ', answer: 'n(n - 1)/2', caseSensitive: false }
            ],
            explanation: 'Vòng ngoài n-1 lần, vòng trong giảm dần → n(n-1)/2.'
        },

        {
            id: 'ch2_fill_u_003',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Trường Hợp Tốt Của Insertion Sort',
            question: 'Trong Insertion Sort, nếu dãy đã sắp xếp, số lần so sánh là: ___',
            blanks: [
                { text: 'Số so sánh: ', answer: 'n - 1', caseSensitive: false }
            ],
            explanation: 'Mỗi phần tử chỉ so sánh 1 lần → n-1 lần.'
        },

        {
            id: 'ch2_fill_u_004',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Trường Hợp Tốt Của Quick Sort',
            question: 'Độ phức tạp Quick Sort khi pivot luôn chia đều là: ___',
            blanks: [
                { text: 'O(', answer: 'n log n', caseSensitive: false }
            ],
            explanation: 'Chia đều → tree cân bằng → O(n log n).'
        },

        {
            id: 'ch2_fill_u_005',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Trung Bình Tìm Kiếm Tuyến Tính',
            question: 'Tìm kiếm tuyến tính trong mảng kích thước n, trung bình phải duyệt qua ____ phần tử.',
            blanks: [
                { text: 'Số phần tử: ', answer: 'n/2', caseSensitive: false }
            ],
            explanation: 'Trung bình tìm thấy ở giữa dãy → n/2 phần tử.'
        },

        {
            id: 'ch2_fill_u_006',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Chốt Quick Sort',
            question: 'Quick Sort sử dụng phần tử gọi là __________ để phân chia mảng.',
            blanks: [
                { text: 'Tên: ', answer: 'pivot', caseSensitive: false }
            ],
            explanation: 'Pivot là phần tử chốt để phân hoạch mảng.'
        },

        {
            id: 'ch2_fill_u_007',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Tính Chất Merge Sort',
            question: 'Merge Sort luôn chia dãy thành hai phần có kích thước gần __________.',
            blanks: [
                { text: 'Kích thước: ', answer: 'bằng nhau', caseSensitive: false }
            ],
            explanation: 'Merge Sort chia đôi đều mảng mỗi lần.'
        },

        {
            id: 'ch2_fill_u_008',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Hướng Tìm Kiếm Nhị Phân',
            question: 'Trong tìm kiếm nhị phân, nếu phần tử cần tìm lớn hơn phần tử giữa, ta tìm trong nửa __________ của dãy.',
            blanks: [
                { text: 'Nửa: ', answer: 'phải', caseSensitive: false }
            ],
            explanation: 'Phần tử lớn hơn nằm ở nửa bên phải.'
        },

        {
            id: 'ch2_fill_u_009',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Sắp Xếp vs Tìm Kiếm',
            question: 'Sự khác biệt giữa tìm kiếm tuyến tính và nhị phân là giả định về __________ của dữ liệu.',
            blanks: [
                { text: 'Giả định: ', answer: 'thứ tự', caseSensitive: false }
            ],
            explanation: 'Binary Search cần mảng sắp xếp.'
        },

        {
            id: 'ch2_fill_u_010',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Đệ Quy Merge Sort',
            question: 'Merge Sort chia dãy và xử lý cả hai phần. Biểu thức đệ quy: ___',
            blanks: [
                { text: 'T(n) = ', answer: '2T(n/2) + cn', caseSensitive: false }
            ],
            explanation: 'Công thức đệ quy của Merge Sort.'
        },

        // ========== APPLY LEVEL (10 câu) ==========
        {
            id: 'ch2_fill_ap_001',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Duyệt Tìm Kiếm Tuyến Tính',
            question: 'Số phép so sánh trong worst case:\nfor (int i = 0; i < n; ++i)\n    if (a[i] == x) return i;\nreturn -1;\nSố so sánh: ___',
            blanks: [
                { text: 'Số so sánh: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Worst case: duyệt hết n phần tử.'
        },

        {
            id: 'ch2_fill_ap_002',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Vòng Lặp Tìm Kiếm Nhị Phân',
            question: 'Điền điều kiện:\nwhile (low ___ high) {\n    int m = (low + high) / 2;\n    ...\n}',
            blanks: [
                { text: 'Điều kiện: ', answer: '<=', caseSensitive: false }
            ],
            explanation: 'Lặp khi low <= high.'
        },

        {
            id: 'ch2_fill_ap_003',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Hàm Hoán Đổi (Swap)',
            question: 'Hàm chuẩn C++ trong <algorithm> dùng để hoán đổi: ___',
            blanks: [
                { text: 'Hàm: ', answer: 'swap', caseSensitive: false }
            ],
            explanation: 'swap(a, b) hoán đổi 2 giá trị.'
        },

        {
            id: 'ch2_fill_ap_004',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Quick Sort Đệ Quy',
            question: 'Điền hàm gọi đệ quy:\nint pi = partition(arr, low, high);\nquickSort(arr, low, pi - 1);\n___(arr, pi + 1, high);',
            blanks: [
                { text: 'Hàm: ', answer: 'quickSort', caseSensitive: false }
            ],
            explanation: 'Gọi đệ quy quickSort cho phần bên phải.'
        },

        {
            id: 'ch2_fill_ap_005',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Merge Sort Đệ Quy',
            question: 'Điền hàm:\nvoid mergeSort(int a[], int l, int r) {\n    int m = (l + r) / 2;\n    ___(a, l, m);\n    mergeSort(a, m + 1, r);\n    merge(a, l, m, r);\n}',
            blanks: [
                { text: 'Hàm: ', answer: 'mergeSort', caseSensitive: false }
            ],
            explanation: 'Gọi đệ quy mergeSort cho nửa trái.'
        },

        {
            id: 'ch2_fill_ap_006',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Nhận Diện Bubble Sort',
            question: 'Thuật toán hoán đổi phần tử liền kề là __________.',
            blanks: [
                { text: 'Tên: ', answer: 'Bubble Sort', caseSensitive: false }
            ],
            explanation: 'Bubble Sort đặc trưng bởi việc swap liền kề.'
        },

        {
            id: 'ch2_fill_ap_007',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Nhận Diện Insertion Sort',
            question: 'Thuật toán chèn phần tử vào đúng vị trí trong phần đã sắp là __________.',
            blanks: [
                { text: 'Tên: ', answer: 'Insertion Sort', caseSensitive: false }
            ],
            explanation: 'Insertion Sort chèn vào vị trí đúng.'
        },

        {
            id: 'ch2_fill_ap_008',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Thao Tác Phân Hoạch',
            question: 'Trong Quick Sort, phần __________ chia mảng theo pivot.',
            blanks: [
                { text: 'Tên phần: ', answer: 'partition', caseSensitive: false }
            ],
            explanation: 'Partition phân hoạch mảng.'
        },

        {
            id: 'ch2_fill_ap_009',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Thao Tác Trộn (Merge)',
            question: 'Trong Merge Sort, bước kết hợp 2 mảng con gọi là __________.',
            blanks: [
                { text: 'Tên bước: ', answer: 'merge', caseSensitive: false }
            ],
            explanation: 'Merge trộn 2 mảng đã sắp xếp.'
        },

        {
            id: 'ch2_fill_ap_010',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Tính Toán Binary Search',
            question: 'Điền mid calculation:\nint mid = (low + high) ___ 2;',
            blanks: [
                { text: 'Phép toán: ', answer: '/', caseSensitive: false }
            ],
            explanation: 'Chia 2 để lấy giá trị giữa.'
        },

        // ========== ANALYZE LEVEL (10 câu) ==========
        {
            id: 'ch2_fill_an_001',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Yêu Cầu Tìm Kiếm Nhị Phân',
            question: 'Binary search chỉ hoạt động đúng khi mảng __________.',
            blanks: [
                { text: 'Điều kiện: ', answer: 'đã sắp xếp', caseSensitive: false }
            ],
            explanation: 'Binary Search yêu cầu mảng phải sắp xếp.'
        },

        {
            id: 'ch2_fill_an_002',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Đệ Quy Quick Sort',
            question: 'Quick Sort gọi lại chính nó, dùng kỹ thuật __________.',
            blanks: [
                { text: 'Kỹ thuật: ', answer: 'đệ quy', caseSensitive: false }
            ],
            explanation: 'Hàm gọi lại chính nó → đệ quy.'
        },

        {
            id: 'ch2_fill_an_003',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Trường Hợp Tốt Của Insertion Sort',
            question: 'Insertion Sort trên mảng gần sắp xếp có hiệu suất __________.',
            blanks: [
                { text: 'Hiệu suất: ', answer: 'gần tuyến tính', caseSensitive: false }
            ],
            explanation: 'Mảng gần sắp xếp → ít dịch → gần O(n).'
        },

        {
            id: 'ch2_fill_an_004',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Trường Hợp Xấu Của Quick Sort',
            question: 'Khi mảng đã sắp xếp, Quick Sort với pivot cuối là trường hợp __________.',
            blanks: [
                { text: 'Trường hợp: ', answer: 'tệ nhất', caseSensitive: false }
            ],
            explanation: 'Mảng đã sắp với pivot cuối → worst case.'
        },

        {
            id: 'ch2_fill_an_005',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Đệ Quy Merge Sort',
            question: 'Biểu thức đệ quy của Merge Sort: T(n) = ___',
            blanks: [
                { text: 'T(n) = ', answer: '2T(n/2) + n', caseSensitive: false }
            ],
            explanation: 'Chia 2 nửa + trộn n phần tử.'
        },

        {
            id: 'ch2_fill_an_006',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Số Nghịch Thế',
            question: 'Đếm số nghịch thế với 2 vòng lặp lồng có độ phức tạp: ___',
            blanks: [
                { text: 'O(', answer: 'n^2', caseSensitive: false }
            ],
            explanation: '2 vòng lặp lồng → O(n²).'
        },

        {
            id: 'ch2_fill_an_007',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Bubble Sort Chậm',
            question: 'Bubble Sort không tối ưu vẫn thực hiện __________ so sánh dù mảng đã sắp.',
            blanks: [
                { text: 'Số so sánh: ', answer: 'n(n-1)/2', caseSensitive: false }
            ],
            explanation: 'Không kiểm tra đã sắp → vẫn duyệt hết.'
        },

        {
            id: 'ch2_fill_an_008',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Insertion Sort Tệ Nhất',
            question: 'Insertion Sort trên dãy giảm dần có số so sánh: ___',
            blanks: [
                { text: 'Số so sánh: ', answer: 'n(n-1)/2', caseSensitive: false }
            ],
            explanation: 'Dãy ngược là worst case.'
        },

        {
            id: 'ch2_fill_an_009',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Tìm Kiếm Tuyến Tính Cải Tiến',
            question: 'Tìm kiếm tuyến tính cải tiến trên mảng có thứ tự khai thác tính chất __________.',
            blanks: [
                { text: 'Tính chất: ', answer: 'có thứ tự', caseSensitive: false }
            ],
            explanation: 'Dừng sớm khi gặp phần tử lớn hơn.'
        },

        {
            id: 'ch2_fill_an_010',
            type: QuestionType.FILL_BLANK,
            chapter: 2,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Jump Search',
            question: 'Jump search nhảy √n mỗi bước có độ phức tạp: ___',
            blanks: [
                { text: 'O(', answer: '√n', caseSensitive: false }
            ],
            explanation: 'Nhảy √n bước → O(√n).'
        }
    ]
};

export default CHAPTER_2_QUESTIONS;
