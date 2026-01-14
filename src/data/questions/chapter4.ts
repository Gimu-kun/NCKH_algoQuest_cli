/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NGÂN HÀNG CÂU HỎI CHƯƠNG 4 (Question Bank - Chapter 4)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Cung cấp các câu hỏi kiểm tra kiến thức về:
 * - Ngăn xếp (Stack) và Hàng đợi (Queue).
 * - Cơ chế LIFO và FIFO.
 * - Các phép toán Push, Pop, Enqueue, Dequeue.
 * - Ứng dụng của Stack/Queue trong biểu thức hậu tố, đệ quy, v.v.
 * 
 * NGUỒN DỮ LIỆU:
 * - Dựa trên tài liệu "75 Câu Chương 4.MD".
 * 
 * @module Chapter4Questions
 * @category Data/Questions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { QuestionType, BloomLevel } from '../models/Question';
import type { QuestionBank } from '../models/Question';

export const CHAPTER_4_QUESTIONS: QuestionBank = {
    chapter: 4,
    title: 'Ngăn Xếp và Hàng Đợi (Stack & Queue)',
    description: 'Kiểm tra kiến thức về cấu trúc dữ liệu LIFO và FIFO',
    questions: [
        // ========== MỨC ĐỘ NHỚ - REMEMBER LEVEL ==========
        {
            id: 'ch4_fill_r_001',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Stack Operations',
            question: 'Trong một ngăn xếp rỗng, để thêm 4 phần tử và sau đó loại bỏ tất cả, tổng số thao tác push và pop là ____.',
            blanks: [{ text: 'Tổng số thao tác: ', answer: '8', caseSensitive: false }],
            explanation: '4 push + 4 pop = 8 thao tác.'
        },
        {
            id: 'ch4_fill_r_002',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Stack LIFO',
            question: 'Sau khi push lần lượt 3 phần tử: 10, 20, 30 vào ngăn xếp, phần tử nằm trên đỉnh (top) là ____.',
            blanks: [{ text: 'Phần tử đỉnh: ', answer: '30', caseSensitive: false }],
            explanation: 'Phần tử vào sau cùng (30) sẽ ở trên đỉnh (LIFO).'
        },
        {
            id: 'ch4_fill_r_003',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Queue Capacity',
            question: 'Một hàng đợi chứa tối đa 6 phần tử. Nếu đang có 4 phần tử, số phần tử có thể thêm vào nữa là ____.',
            blanks: [{ text: 'Số phần tử còn lại: ', answer: '2', caseSensitive: false }],
            explanation: '6 - 4 = 2 chỗ trống.'
        },
        {
            id: 'ch4_fill_r_004',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Queue FIFO',
            question: 'Trong hàng đợi tuyến tính có 4 phần tử (1, 2, 3, 4), phần tử nào được loại bỏ đầu tiên?',
            blanks: [{ text: 'Phần tử: ', answer: '1', caseSensitive: false }],
            explanation: 'Hàng đợi theo nguyên tắc FIFO (Vào trước ra trước).'
        },
        {
            id: 'ch4_fill_r_005',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Stack State',
            question: 'Nếu thực hiện 5 lần push và 2 lần pop trên một ngăn xếp rỗng, số phần tử còn lại trong ngăn xếp là ____.',
            blanks: [{ text: 'Số phần tử: ', answer: '3', caseSensitive: false }],
            explanation: '5 - 2 = 3 phần tử.'
        },

        // ========== MỨC ĐỘ HIỂU - UNDERSTAND LEVEL ==========
        {
            id: 'ch4_fill_u_011',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Stack Sequence',
            question: 'Một ngăn xếp rỗng thực hiện: push(1), push(2), pop(), push(3), pop(). Phần tử còn lại là ____.',
            blanks: [{ text: 'Phần tử: ', answer: '1', caseSensitive: false }],
            explanation: 'Stack: [1] -> [1,2] -> [1] -> [1,3] -> [1].'
        },
        {
            id: 'ch4_fill_u_012',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Queue Sequence',
            question: 'Một hàng đợi rỗng nhận 4 thao tác enqueue và 2 thao tác dequeue. Số phần tử còn lại là ____.',
            blanks: [{ text: 'Số phần tử: ', answer: '2', caseSensitive: false }],
            explanation: '4 vào - 2 ra = 2 còn lại.'
        },
        {
            id: 'ch4_fill_u_013',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Queue Front',
            question: 'Hàng đợi rỗng. Thực hiện: enqueue(5), enqueue(7), dequeue(), enqueue(9). Phần tử ở đầu hàng đợi là ____.',
            blanks: [{ text: 'Đầu hàng đợi: ', answer: '7', caseSensitive: false }],
            explanation: 'Q: [5] -> [5,7] -> [7] -> [7,9]. Front là 7.'
        },
        {
            id: 'ch4_fill_u_014',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Postfix Depth',
            question: 'Trong quá trình tính giá trị biểu thức hậu tố "5 6 2 + * 3 -", độ sâu tối đa của ngăn xếp là ____.',
            blanks: [{ text: 'Độ sâu max: ', answer: '3', caseSensitive: false }],
            explanation: 'Stack: [5] -> [5,6] -> [5,6,2] (max 3) -> [5,8] -> [40] -> [40,3] -> [37].'
        },
        {
            id: 'ch4_fill_u_015',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Mixed Operations',
            question: 'Thực hiện: enqueue(1), enqueue(2), enqueue(3), dequeue(), enqueue(4), dequeue(). Phần tử đầu hàng đợi là ____.',
            blanks: [{ text: 'Đầu hàng đợi: ', answer: '3', caseSensitive: false }],
            explanation: '[1] -> [1,2] -> [1,2,3] -> [2,3] -> [2,3,4] -> [3,4]. Front: 3.'
        },

        // ========== MỨC ĐỘ VẬN DỤNG - APPLY LEVEL ==========
        {
            id: 'ch4_fill_ap_021',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Algorithm Trace',
            question: 'Stack rỗng. push(5), push(8), pop(), push(3), pop(). Giá trị trả về ở lần pop cuối cùng là: ____',
            blanks: [{ text: 'Giá trị: ', answer: '3', caseSensitive: false }],
            explanation: '[5] -> [5,8] -> pop 8 -> [5] -> [5,3] -> pop 3.'
        },
        {
            id: 'ch4_fill_ap_024',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Postfix Calculation',
            question: 'Cho biểu thức hậu tố: "6 2 3 + -". Giá trị kết quả là: ____',
            blanks: [{ text: 'Kết quả: ', answer: '1', caseSensitive: false }],
            explanation: '2+3=5. 6-5=1.'
        },
        {
            id: 'ch4_fill_ap_025',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Circular Queue',
            question: 'Circular Queue có front=2, rear=4, size=6. Sau 3 dequeue(), front mới là: ____',
            blanks: [{ text: 'Front mới: ', answer: '5', caseSensitive: false }],
            explanation: 'Front tịnh tiến 3 bước: 2 -> 3 -> 4 -> 5.'
        },
        {
            id: 'ch4_fill_ap_026',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Bracket Matching',
            question: 'Kiểm tra chuỗi "({[]})" dùng stack. Tổng số thao tác push là: ____',
            blanks: [{ text: 'Số lần push: ', answer: '3', caseSensitive: false }],
            explanation: 'Push (, Push {, Push [. Tổng 3.'
        },

        // ========== MỨC ĐỘ PHÂN TÍCH - ANALYZE LEVEL ==========
        {
            id: 'ch4_fill_an_031',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Code Trace C++',
            question: 'stack<int> s; s.push(10); s.push(20); s.push(30); s.pop(); s.push(40); cout << s.top(); Kết quả: ____',
            blanks: [{ text: 'Kết quả: ', answer: '40', caseSensitive: false }],
            explanation: '[10] -> [10,20] -> [10,20,30] -> [10,20] -> [10,20,40]. Top là 40.'
        },
        {
            id: 'ch4_fill_an_032',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Code Trace Queue',
            question: 'queue<int> q; q.push(5); q.push(10); q.push(15); q.pop(); q.push(20); q.pop(); cout << q.front(); Kết quả: ____',
            blanks: [{ text: 'Kết quả: ', answer: '15', caseSensitive: false }],
            explanation: '[5] -> [5,10] -> [5,10,15] -> [10,15] -> [10,15,20] -> [15,20]. Front là 15.'
        },
        {
            id: 'ch4_fill_an_033',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Loop Stack Sum',
            question: 'Stack s push 1,2,3,4. While(!empty) sum += top; pop; Tổng là: ____',
            blanks: [{ text: 'Tổng: ', answer: '10', caseSensitive: false }],
            explanation: '1+2+3+4 = 10.'
        },
        {
            id: 'ch4_fill_an_034',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Queue Size Trace',
            question: 'Queue push 1,3,5 (i+=2, <=6). Pop 2 lần. Size còn lại: ____',
            blanks: [{ text: 'Size: ', answer: '1', caseSensitive: false }],
            explanation: 'Push 1,3,5 (Size 3). Pop 2 -> Size 1.'
        },
        {
            id: 'ch4_fill_an_071',
            type: QuestionType.FILL_BLANK,
            chapter: 4,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Memory Leak Analysis',
            question: 'Phân tích code xóa Node* temp = front; ...; ______; Điền lệnh thiếu để tránh leak.',
            blanks: [{ text: 'Lệnh: ', answer: 'free(temp)', caseSensitive: false }],
            explanation: 'Cần giải phóng bộ nhớ của node đã xóa khỏi danh sách.'
        }
    ]
};

export default CHAPTER_4_QUESTIONS;
