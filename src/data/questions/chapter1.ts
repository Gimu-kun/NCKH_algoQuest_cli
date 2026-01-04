/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NGÂN HÀNG CÂU HỎI CHƯƠNG 1 (Question Bank - Chapter 1)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Cung cấp các câu hỏi kiểm tra kiến thức nền tảng về:
 * - Thuật toán (Algorithms) và độ phức tạp (Complexity).
 * - Phân tích Big O (Time & Space Complexity).
 * - Các khái niệm cơ bản (Loop, Recursion, Memory).
 * 
 * CẤU TRÚC:
 * - 40 câu hỏi được phân loại theo Bloom's Taxonomy:
 *   + 10 câu REMEMBER (Nhớ)
 *   + 10 câu UNDERSTAND (Hiểu)
 *   + 10 câu APPLY (Vận dụng)
 *   + 10 câu ANALYZE (Phân tích)
 * 
 * NGUỒN DỮ LIỆU:
 * - Dựa trên tài liệu "200 Câu Hỏi Chương 1.MD".
 * 
 * @module Chapter1Questions
 * @category Data/Questions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { QuestionType, BloomLevel } from '../models/Question';
import type { QuestionBank } from '../models/Question';

export const CHAPTER_1_QUESTIONS: QuestionBank = {
    chapter: 1,
    title: 'Tổng quan về thuật toán và độ phức tạp',
    description: 'Giới thiệu về thuật toán và phân tích độ phức tạp Big O',
    questions: [
        // ========== MỨC ĐỘ NHỚ - REMEMBER LEVEL (10 câu) ==========
        {
            id: 'ch1_fill_r_001',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Ký Hiệu Big O',
            question: 'Thuật toán có độ phức tạp thời gian là O(____) được gọi là tuyến tính.',
            blanks: [
                { text: 'Thuật toán có độ phức tạp thời gian là O(', answer: 'n', caseSensitive: false }
            ],
            explanation: 'O(n) là độ phức tạp tuyến tính - thời gian tỷ lệ thuận với kích thước đầu vào.'
        },

        {
            id: 'ch1_fill_r_002',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Thời Gian Hằng Số',
            question: 'Độ phức tạp thời gian trong trường hợp tốt nhất của một thuật toán thực hiện đúng 1 thao tác bất kể đầu vào là: ___',
            blanks: [
                { text: 'Độ phức tạp là: ', answer: 'O(1)', caseSensitive: false }
            ],
            explanation: 'O(1) là độ phức tạp hằng số - không phụ thuộc kích thước đầu vào.'
        },

        {
            id: 'ch1_fill_r_003',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Độ Phức Tạp Bậc Ba',
            question: 'Tổng số bước trong thuật toán có độ phức tạp bậc ba là: ___',
            blanks: [
                { text: 'Độ phức tạp bậc ba: ', answer: 'O(n^3)', caseSensitive: false }
            ],
            explanation: 'O(n³) là độ phức tạp bậc ba - thường xuất hiện trong 3 vòng lặp lồng nhau.'
        },

        {
            id: 'ch1_fill_r_004',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Độ Phức Tạp Logarit',
            question: 'Công thức biểu diễn độ phức tạp theo logarit nhị phân là: ___',
            blanks: [
                { text: 'Công thức: ', answer: 'log₂(n)', caseSensitive: false }
            ],
            explanation: 'log₂(n) xuất hiện khi chia đôi dữ liệu mỗi bước (như binary search).'
        },

        {
            id: 'ch1_fill_r_005',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Tăng Trưởng Mũ',
            question: 'Nếu một thuật toán có số bước tăng gấp đôi mỗi khi kích thước đầu vào tăng 1, công thức là: ___',
            blanks: [
                { text: 'Công thức: ', answer: '2^n', caseSensitive: false }
            ],
            explanation: '2^n là độ phức tạp mũ - tăng rất nhanh, thường là brute force.'
        },

        {
            id: 'ch1_fill_r_006',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Vòng Lặp Lồng Nhau',
            question: 'Số bước thực hiện của vòng lặp lồng:\nfor (int i = 0; i < n; ++i)\n    for (int j = 0; j < n; ++j)\n        count++;\nBiểu thức: ___',
            blanks: [
                { text: 'Số bước: ', answer: 'n^2', caseSensitive: false }
            ],
            explanation: '2 vòng lặp lồng nhau mỗi vòng n lần → n × n = n².'
        },

        {
            id: 'ch1_fill_r_007',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Chia Để Trị',
            question: 'Tổng số bước của thuật toán chia đôi đầu vào liên tiếp cho đến khi còn 1 phần tử là: ___',
            blanks: [
                { text: 'Số bước: ', answer: '⌊log₂(n)⌋', caseSensitive: false }
            ],
            explanation: 'Chia đôi liên tục → log₂(n) bước.'
        },

        {
            id: 'ch1_fill_r_008',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Thuật Toán Tham Lam',
            question: 'Phương pháp thuật toán ___ xây dựng lời giải tối ưu bằng cách chọn từng bước tốt nhất tại mỗi thời điểm.',
            blanks: [
                { text: 'Phương pháp: ', answer: 'tham lam', caseSensitive: false }
            ],
            explanation: 'Thuật toán tham lam (greedy) chọn lựa tối ưu ở mỗi bước.'
        },

        {
            id: 'ch1_fill_r_009',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Phép Toán Thời Gian Hằng Số',
            question: 'Trong mô hình RAM, mỗi phép toán cơ bản như cộng, so sánh được gán giá trị độ phức tạp bằng ___ đơn vị thời gian.',
            blanks: [
                { text: 'Độ phức tạp: ', answer: '1', caseSensitive: false }
            ],
            explanation: 'Mô hình RAM giả định mỗi phép toán cơ bản mất O(1).'
        },

        {
            id: 'ch1_fill_r_010',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Thuộc Tính Thuật Toán',
            question: 'Giai đoạn đầu tiên trong quy trình thiết kế thuật toán là ___, nhằm xác định yêu cầu và đặc tả bài toán.',
            blanks: [
                { text: 'Giai đoạn đầu: ', answer: 'phân tích bài toán', caseSensitive: false }
            ],
            explanation: 'Phân tích bài toán là bước đầu quan trọng trước khi thiết kế thuật toán.'
        },

        // ========== UNDERSTAND LEVEL (10 câu) ==========
        {
            id: 'ch1_fill_u_001',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Phân Tích Vòng Lặp Lồng',
            question: 'Khi một thuật toán có 2 vòng lặp lồng nhau, mỗi vòng chạy từ 1 đến n, tổng số bước thực hiện được ước lượng: ___',
            blanks: [
                { text: 'Tổng bước: ', answer: 'n^2', caseSensitive: false }
            ],
            explanation: 'Vòng ngoài n lần × vòng trong n lần = n² bước.'
        },

        {
            id: 'ch1_fill_u_002',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Công Thức Thời Gian Tuyến Tính',
            question: 'Để ước lượng thời gian thực thi thuật toán có độ phức tạp tuyến tính, công thức tổng quát là: ___',
            blanks: [
                { text: 'Công thức: ', answer: 'T(n) = an + b', caseSensitive: false }
            ],
            explanation: 'Hàm tuyến tính có dạng T(n) = an + b, với a là hệ số góc.'
        },

        {
            id: 'ch1_fill_u_003',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Tính Tổng Dãy Số',
            question: 'Một vòng lặp thực hiện tổng số bước ∑(i=1 to n) i. Biểu thức tương đương: ___',
            blanks: [
                { text: 'Tổng = ', answer: 'n(n + 1)/2', caseSensitive: false }
            ],
            explanation: 'Công thức tổng dãy số 1+2+3+...+n = n(n+1)/2.'
        },

        {
            id: 'ch1_fill_u_004',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Độ Phức Tạp Không Gian',
            question: 'Độ phức tạp không gian của thuật toán sử dụng một mảng kích thước n và một biến đếm là: ___',
            blanks: [
                { text: 'Space complexity: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Mảng n phần tử chiếm O(n), biến đếm O(1) → tổng O(n).'
        },

        {
            id: 'ch1_fill_u_005',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Vòng Lặp Logarit',
            question: 'Số lần lặp trong vòng lặp:\nfor (int i = 1; i < n; i *= 2)\nđược ước lượng bởi: ___',
            blanks: [
                { text: 'Số lần lặp: ', answer: '⌊log₂(n)⌋', caseSensitive: false }
            ],
            explanation: 'i nhân đôi mỗi lần → số bước = log₂(n).'
        },

        {
            id: 'ch1_fill_u_006',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Hàm Bậc Hai',
            question: 'Khi biểu diễn thời gian thực thi dưới dạng hàm bậc hai, biểu thức tổng quát là: ___',
            blanks: [
                { text: 'T(n) = ', answer: 'an^2 + bn + c', caseSensitive: false }
            ],
            explanation: 'Hàm bậc 2 có dạng ax² + bx + c.'
        },

        {
            id: 'ch1_fill_u_007',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Hệ thức Truy Hồi',
            question: 'Thuật toán chia dữ liệu làm 2 phần và xử lý cả hai. Biểu thức đệ quy: ___',
            blanks: [
                { text: 'T(n) = ', answer: '2·T(n/2) + cn', caseSensitive: false }
            ],
            explanation: 'Divide and conquer: T(n) = 2T(n/2) + cn (như merge sort).'
        },

        {
            id: 'ch1_fill_u_008',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Độ Phức Tạp N log N',
            question: 'Thuật toán:\nfor (int i = 0; i < n; ++i)\n    for (int j = 0; j < log2(n); ++j)\n        count++;\nTổng bước: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'nlog₂(n)', caseSensitive: false }
            ],
            explanation: 'Vòng ngoài n × vòng trong log(n) = n log(n).'
        },

        {
            id: 'ch1_fill_u_009',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Ký Hiệu Big O',
            question: 'Ký hiệu ___ được dùng để mô tả độ phức tạp thời gian trong trường hợp xấu nhất.',
            blanks: [
                { text: 'Kýhiệu: ', answer: 'O', caseSensitive: false }
            ],
            explanation: 'Big O (O) mô tả worst-case complexity.'
        },

        {
            id: 'ch1_fill_u_010',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Chia Để Trị',
            question: 'Chiến lược thuật toán ___ chia bài toán thành các phần nhỏ, giải từng phần và kết hợp lời giải.',
            blanks: [
                { text: 'Chiến lược: ', answer: 'chia để trị', caseSensitive: false }
            ],
            explanation: 'Divide and Conquer (chia để trị) là kỹ thuật quan trọng.'
        },

        // ========== APPLY LEVEL (10 câu) ==========
        {
            id: 'ch1_fill_ap_001',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Phân Tích Độ Phức Tạp Code',
            question: 'Đoạn mã sau có độ phức tạp O(____):\nvoid method(int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            printf("Hello");\n        }\n    }\n}',
            blanks: [
                { text: 'Độ phức tạp: O(', answer: 'n^2', caseSensitive: false }
            ],
            explanation: '2 vòng lặp lồng nhau, mỗi vòng n lần → O(n²).'
        },

        {
            id: 'ch1_fill_ap_002',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Phân Tích Logarit',
            question: 'Đoạn mã có độ phức tạp O(____):\nint method(int n) {\n    int sum = 0, i = 1;\n    while (i < n) {\n        sum += i;\n        i = i * 2;\n    }\n    return sum;\n}',
            blanks: [
                { text: 'O(', answer: 'log2(n)', caseSensitive: false }
            ],
            explanation: 'i nhân đôi mỗi bước → độ phức tạp O(log n).'
        },

        {
            id: 'ch1_fill_ap_003',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Mẫu N log N',
            question: 'Độ phức tạp O(____):\nvoid method(int n) {\n    for (int i = 1; i < n; i = i * 2) {\n        for (int j = 0; j < n; j++) {\n            printf("Process");\n        }\n    }\n}',
            blanks: [
                { text: 'O(', answer: 'nlogn', caseSensitive: false }
            ],
            explanation: 'Vòng ngoài log(n) × vòng trong n = O(n log n).'
        },

        {
            id: 'ch1_fill_ap_004',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Vòng Lặp Tuần Tự',
            question: 'Độ phức tạp O(____):\nint method(int n) {\n    for (int i = 0; i < n; i++) sum += i;\n    for (int j = 0; j < n; j++) sum += j;\n    return sum;\n}',
            blanks: [
                { text: 'O(', answer: 'n', caseSensitive: false }
            ],
            explanation: '2 vòng lặp tuần tự: n + n = 2n → O(n).'
        },

        {
            id: 'ch1_fill_ap_005',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Kiểu Trả Về Hàm',
            question: 'Xác định kiểu dữ liệu:\n________ isNegative(int x) {\n    return x < 0;\n}',
            blanks: [
                { text: 'Kiểu trả về: ', answer: 'bool', caseSensitive: false }
            ],
            explanation: 'Hàm trả về true/false → kiểu bool.'
        },

        {
            id: 'ch1_fill_ap_006',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Các Hàm Toán Học',
            question: 'Để tính √x, dùng hàm ___ trong thư viện cmath.',
            blanks: [
                { text: 'Hàm: ', answer: 'sqrt', caseSensitive: false }
            ],
            explanation: 'sqrt(x) tính căn bậc 2 của x.'
        },

        {
            id: 'ch1_fill_ap_007',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Kiểu Dữ Liệu Enum',
            question: 'Lưu trạng thái READY, RUNNING, FINISHED. Kiểu dữ liệu phù hợp: __________',
            blanks: [
                { text: 'Kiểu: ', answer: 'enum', caseSensitive: false }
            ],
            explanation: 'enum định nghĩa tập hợp các hằng số có tên.'
        },

        {
            id: 'ch1_fill_ap_008',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Lựa Chọn Vòng Lặp',
            question: 'Khi cần lặp đúng 100 lần, chọn vòng lặp: __________',
            blanks: [
                { text: 'Vòng lặp: ', answer: 'for', caseSensitive: false }
            ],
            explanation: 'for loop thích hợp khi biết trước số lần lặp.'
        },

        {
            id: 'ch1_fill_ap_009',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Toán Tử Logic',
            question: 'Kiểm tra hai điều kiện x > 0 và y > 0 đồng thời, dùng phép toán: __________',
            blanks: [
                { text: 'Phép toán: ', answer: '&&', caseSensitive: false }
            ],
            explanation: '&& (AND) kiểm tra cả hai điều kiện đều đúng.'
        },

        {
            id: 'ch1_fill_ap_010',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Phương Pháp Dò Lỗi',
            question: 'Khi chạy thử và theo dõi giá trị từng biến trong mỗi bước, đang dùng phương pháp: __________',
            blanks: [
                { text: 'Phương pháp: ', answer: 'dò bước', caseSensitive: false }
            ],
            explanation: 'Trace/dò bước là kỹ thuật debug quan trọng.'
        },

        // ========== ANALYZE LEVEL (10 câu) ==========
        {
            id: 'ch1_fill_an_001',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Vòng Lặp Phức Tạp',
            question: 'Độ phức tạp O(____):\nvoid method(int n) {\n    int sum = 0, i = 0;\n    while (i < n) {\n        int j = 0;\n        while (j < n / 2) {\n            sum += i + j;\n            j++;\n        }\n        i++;\n    }\n}',
            blanks: [
                { text: 'O(', answer: 'n^2', caseSensitive: false }
            ],
            explanation: 'Vòng ngoài n × vòng trong n/2 = n²/2 → O(n²).'
        },

        {
            id: 'ch1_fill_an_002',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Độ Phức Tạp Có Điều Kiện',
            question: 'Độ phức tạp O(____):\nvoid method(int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if (i == j) sum += i + j;\n        }\n    }\n}',
            blanks: [
                { text: 'O(', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Chỉ thực hiện khi i==j (n lần), không phải n² lần.'
        },

        {
            id: 'ch1_fill_an_003',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: '3 Vòng Lặp Lồng Nhau',
            question: 'Độ phức tạp O(____):\nvoid method(int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            for (int k = j; k < n; k++) {\n                sum += i + j + k;\n            }\n        }\n    }\n}',
            blanks: [
                { text: 'O(', answer: 'n^3', caseSensitive: false }
            ],
            explanation: '3 vòng lặp lồng nhau → O(n³).'
        },

        {
            id: 'ch1_fill_an_004',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Bước Nhảy Vòng Lặp',
            question: 'Độ phức tạp O(____):\nvoid method(int n) {\n    int sum = 0, i = 0;\n    while (i < n) {\n        sum += i;\n        i += 3;\n    }\n}',
            blanks: [
                { text: 'O(', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Tăng 3 mỗi bước vẫn là O(n), chỉ khác hằng số.'
        },

        {
            id: 'ch1_fill_an_005',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Điều Kiện Modulo',
            question: 'Độ phức tạp O(____):\nvoid method(int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if ((i + j) % 3 == 0) sum += i + j;\n        }\n    }\n}',
            blanks: [
                { text: 'O(', answer: 'n^2', caseSensitive: false }
            ],
            explanation: 'Vẫn duyệt n² lần dù chỉ thực hiện 1/3 lần.'
        },

        {
            id: 'ch1_fill_an_006',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Chuỗi Điều Hòa',
            question: 'Độ phức tạp O(____):\nvoid method(int n) {\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= n / i; j++) {\n            sum += i * j;\n        }\n    }\n}',
            blanks: [
                { text: 'O(', answer: 'nlogn', caseSensitive: false }
            ],
            explanation: 'Tổng điều hòa: n/1 + n/2 + ... + n/n = n log(n).'
        },

        {
            id: 'ch1_fill_an_007',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Ảnh Hưởng Kiểu Dữ Liệu',
            question: 'Thuật toán cho kết quả sai nếu dùng int, đúng nếu dùng float. Nguyên nhân do thuật toán phụ thuộc: ___',
            blanks: [
                { text: 'Phụ thuộc: ', answer: 'kiểu dữ liệu', caseSensitive: false }
            ],
            explanation: 'Độ chính xác của kiểu dữ liệu ảnh hưởng kết quả.'
        },

        {
            id: 'ch1_fill_an_008',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Phân Tích Hiệu Quả',
            question: 'Thuật toán cho kết quả đúng nhưng tiêu tốn thời gian, bộ nhớ rất lớn. Thuật toán không đảm bảo tính: _________',
            blanks: [
                { text: 'Tính chất: ', answer: 'hiệu quả', caseSensitive: false }
            ],
            explanation: 'Correctness ≠ Efficiency. Cần tối ưu thuật toán.'
        },

        {
            id: 'ch1_fill_an_009',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Đánh Đổi Thời Gian-Không Gian',
            question: 'Một thuật toán nhanh nhưng dùng nhiều bộ nhớ, thuật toán khác chậm hơn nhưng tiết kiệm. Đây là sự đánh đổi giữa thời gian và: __________',
            blanks: [
                { text: 'Và: ', answer: 'không gian', caseSensitive: false }
            ],
            explanation: 'Time-space tradeoff là khái niệm quan trọng trong tối ưu.'
        },

        {
            id: 'ch1_fill_an_010',
            type: QuestionType.FILL_BLANK,
            chapter: 1,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Cấu Trúc Điều Khiển',
            question: 'Trong thuật toán, bạn kiểm tra điều kiện và lựa chọn nhánh tương ứng. Đây là cấu trúc điều khiển: __________',
            blanks: [
                { text: 'Cấu trúc: ', answer: 'rẽ nhánh', caseSensitive: false }
            ],
            explanation: 'Selection/branching (rẽ nhánh) dùng if-else, switch.'
        }
    ]
};

export default CHAPTER_1_QUESTIONS;
