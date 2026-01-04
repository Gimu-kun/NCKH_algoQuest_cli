/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NGÂN HÀNG CÂU HỎI CHƯƠNG 3 (Question Bank - Chapter 3)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Cung cấp các câu hỏi kiểm tra kiến thức về Danh sách liên kết (Linked Lists):
 * - Danh sách liên kết đơn (Singly Linked List).
 * - Danh sách liên kết đôi (Doubly Linked List).
 * - Các thao tác cơ bản: Chèn, Xóa, Duyệt, Đảo ngược.
 * 
 * CẤU TRÚC:
 * - 40 câu hỏi được phân loại theo Bloom's Taxonomy:
 *   + 10 câu REMEMBER (Nhớ)
 *   + 10 câu UNDERSTAND (Hiểu)
 *   + 10 câu APPLY (Vận dụng)
 *   + 10 câu ANALYZE (Phân tích)
 * 
 * NGUỒN DỮ LIỆU:
 * - Dựa trên tài liệu "155 Câu Hỏi Chương 3.MD".
 * 
 * @module Chapter3Questions
 * @category Data/Questions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { QuestionType, BloomLevel } from '../models/Question';
import type { QuestionBank } from '../models/Question';

export const CHAPTER_3_QUESTIONS: QuestionBank = {
    chapter: 3,
    title: 'Danh sách liên kết',
    description: 'Danh sách liên kết đơn và đôi (Singly and Doubly Linked Lists)',
    questions: [
        // ========== MỨC ĐỘ NHỚ - REMEMBER LEVEL (10 câu) ==========
        {
            id: 'ch3_fill_r_001',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Độ Phức Tạp Duyệt',
            question: 'Độ phức tạp thời gian của thao tác duyệt toàn bộ danh sách liên kết đơn có n phần tử là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Phải duyệt qua tất cả n phần tử → O(n).'
        },

        {
            id: 'ch3_fill_r_002',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Chèn Vào Đầu',
            question: 'Độ phức tạp thời gian của thao tác thêm một nút vào đầu danh sách liên kết đơn là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(1)', caseSensitive: false }
            ],
            explanation: 'Chỉ cần gán con trỏ → O(1).'
        },

        {
            id: 'ch3_fill_r_003',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Chèn Vào Cuối',
            question: 'Độ phức tạp thời gian của thao tác thêm vào cuối danh sách liên kết đơn khi không có con trỏ tail là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Phải duyệt đến cuối → O(n).'
        },

        {
            id: 'ch3_fill_r_004',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Chèn Vào Cuối (Có Tail)',
            question: 'Độ phức tạp thêm vào cuối danh sách liên kết đơn khi có con trỏ tail là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(1)', caseSensitive: false }
            ],
            explanation: 'Có tail → truy cập trực tiếp → O(1).'
        },

        {
            id: 'ch3_fill_r_005',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Độ Phức Tạp Tìm Kiếm',
            question: 'Độ phức tạp thời gian tìm một phần tử có giá trị cụ thể trong danh sách liên kết đơn có n phần tử là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Phải duyệt tuần tự → O(n).'
        },

        {
            id: 'ch3_fill_r_006',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Độ Phức Tạp Không Gian',
            question: 'Độ phức tạp không gian của danh sách liên kết đơn có n nút là: ___',
            blanks: [
                { text: 'Space complexity: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'n nút cần n ô nhớ → O(n).'
        },

        {
            id: 'ch3_fill_r_007',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Xóa Nút Cuối',
            question: 'Để xoá nút cuối cùng trong danh sách liên kết đơn không có con trỏ prev, độ phức tạp là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Phải duyệt đến nút trước cuối → O(n).'
        },

        {
            id: 'ch3_fill_r_008',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Độ Phức Tạp Đảo Ngược',
            question: 'Độ phức tạp thời gian của thao tác đảo ngược danh sách liên kết đơn có n phần tử là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(n)', caseSensitive: false }
            ],
            explanation: 'Duyệt qua n nút và đảo chiều → O(n).'
        },

        {
            id: 'ch3_fill_r_009',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Chèn DSLK Đôi',
            question: 'Độ phức tạp thời gian chèn phần tử vào đầu danh sách liên kết đôi (doubly linked list) là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(1)', caseSensitive: false }
            ],
            explanation: 'Chỉ cần cập nhật con trỏ → O(1).'
        },

        {
            id: 'ch3_fill_r_010',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Chèn Sau Nút',
            question: 'Độ phức tạp chèn một nút vào sau con trỏ đang trỏ đến nút hiện tại là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(1)', caseSensitive: false }
            ],
            explanation: 'Đã có con trỏ → chỉ cần liên kết → O(1).'
        },

        // ========== UNDERSTAND LEVEL (10 câu) ==========
        {
            id: 'ch3_fill_u_001',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Bước Chèn Cuối',
            question: 'Khi thêm vào cuối danh sách liên kết đơn không có tail, số bước duyệt cần thiết để tìm nút cuối là: ___',
            blanks: [
                { text: 'Số bước: ', answer: 'n - 1', caseSensitive: false }
            ],
            explanation: 'Duyệt từ head đến nút cuối → n-1 bước.'
        },

        {
            id: 'ch3_fill_u_002',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Truy Cập Phần Tử k',
            question: 'Trong danh sách liên kết đơn có n phần tử, công thức ước lượng thời gian tìm phần tử thứ k là: ___',
            blanks: [
                { text: 'Độ phức tạp: ', answer: 'O(k)', caseSensitive: false }
            ],
            explanation: 'Duyệt k bước từ đầu → O(k).'
        },

        {
            id: 'ch3_fill_u_003',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Công Thức Không Gian',
            question: 'Trong danh sách liên kết đơn, nếu mỗi nút có kích thước s, công thức biểu diễn tổng không gian cho n nút là: ___',
            blanks: [
                { text: 'Tổng không gian: ', answer: 'n × s', caseSensitive: false }
            ],
            explanation: 'n nút × s byte/nút = n×s byte.'
        },

        {
            id: 'ch3_fill_u_004',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Không Gian DSLK Đôi',
            question: 'Trong danh sách liên kết đôi, mỗi nút chứa 1 dữ liệu (d) và 2 con trỏ (p mỗi cái). Tổng bộ nhớ cho 1 nút: ___',
            blanks: [
                { text: 'Tổng: ', answer: 'd + 2p', caseSensitive: false }
            ],
            explanation: 'Data + next pointer + prev pointer = d + 2p.'
        },

        {
            id: 'ch3_fill_u_005',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Thao Tác Đảo Ngược',
            question: 'Số lần gán con trỏ cần thực hiện khi đảo ngược danh sách liên kết đơn có n phần tử là: ___',
            blanks: [
                { text: 'Số lần gán: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút đảo 1 lần → n lần gán.'
        },

        {
            id: 'ch3_fill_u_006',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Chèn Tại Vị Trí k',
            question: 'Nếu chèn phần tử vào giữa danh sách liên kết đơn tại vị trí k, tổng số bước duyệt là: ___',
            blanks: [
                { text: 'Số bước: ', answer: 'k', caseSensitive: false }
            ],
            explanation: 'Duyệt đến vị trí k → k bước.'
        },

        {
            id: 'ch3_fill_u_007',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Số Lượng Liên Kết',
            question: 'Số lượng liên kết (next) trong danh sách liên kết đơn gồm n phần tử là: ___',
            blanks: [
                { text: 'Số liên kết: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút có 1 next pointer → n liên kết.'
        },

        {
            id: 'ch3_fill_u_008',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Số Liên Kết DSLK Đôi',
            question: 'Trong danh sách liên kết đôi có n phần tử, tổng số liên kết (next và prev) là: ___',
            blanks: [
                { text: 'Tổng liên kết: ', answer: '2n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút có 2 pointers → 2n liên kết.'
        },

        {
            id: 'ch3_fill_u_009',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Công Thức Thời Gian',
            question: 'Trong danh sách liên kết đơn, nếu mỗi thao tác đọc một nút mất t ms, thì thời gian duyệt toàn bộ n nút là: ___',
            blanks: [
                { text: 'Thời gian: ', answer: 'n × t', caseSensitive: false }
            ],
            explanation: 'n nút × t ms/nút = n×t ms.'
        },

        {
            id: 'ch3_fill_u_010',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Chèn Sau Con Trỏ',
            question: 'Để chèn phần tử vào sau nút có con trỏ p, ta cần bao nhiêu phép gán: ___',
            blanks: [
                { text: 'Số phép gán: ', answer: '2', caseSensitive: false }
            ],
            explanation: 'newNode->next = p->next; p->next = newNode → 2 lần gán.'
        },

        // ========== APPLY LEVEL (10 câu) ==========
        {
            id: 'ch3_fill_ap_001',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Đếm Số Nút',
            question: 'int countNodes(Node* head) {\n    int count = 0;\n    while (head != nullptr) {\n        count++;\n        head = head->next;\n    }\n    return count;\n}\nGiả sử danh sách có n nút, lệnh count++ thực hiện: ___ lần',
            blanks: [
                { text: 'Số lần: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút tăng count 1 lần → n lần.'
        },

        {
            id: 'ch3_fill_ap_002',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Tìm Phần Tử k',
            question: 'Node* findKth(Node* head, int k) {\n    int i = 0;\n    while (head != nullptr && i < k) {\n        head = head->next;\n        i++;\n    }\n    return head;\n}\nSố lần di chuyển head = head->next: ___',
            blanks: [
                { text: 'Số lần: ', answer: 'k', caseSensitive: false }
            ],
            explanation: 'Lặp k lần → di chuyển k lần.'
        },

        {
            id: 'ch3_fill_ap_003',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Gán Chèn Đầu',
            question: 'Node* insertHead(Node* head, int val) {\n    Node* p = new Node{val, head};\n    return p;\n}\nSố phép gán con trỏ để chèn vào đầu: ___',
            blanks: [
                { text: 'Số phép gán: ', answer: '1', caseSensitive: false }
            ],
            explanation: 'Chỉ cần gán next = head → 1 lần.'
        },

        {
            id: 'ch3_fill_ap_004',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Gán Đảo Ngược',
            question: 'Node* reverse(Node* head) {\n    Node* prev = nullptr;\n    Node* cur = head;\n    while (cur != nullptr) {\n        Node* next = cur->next;\n        cur->next = prev;\n        prev = cur;\n        cur = next;\n    }\n    return prev;\n}\nSố phép gán cur->next = prev trong danh sách n nút: ___',
            blanks: [
                { text: 'Số lần: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút đảo 1 lần → n lần.'
        },

        {
            id: 'ch3_fill_ap_005',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'So Sánh Tìm Kiếm',
            question: 'bool search(Node* head, int x) {\n    while (head != nullptr) {\n        if (head->data == x)\n            return true;\n        head = head->next;\n    }\n    return false;\n}\nSố phép so sánh tối đa khi x không tồn tại: ___',
            blanks: [
                { text: 'Số so sánh: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Duyệt hết n nút → n so sánh.'
        },

        {
            id: 'ch3_fill_ap_006',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Xóa Đầu',
            question: 'Node* deleteHead(Node* head) {\n    if (head == nullptr) return nullptr;\n    Node* temp = head;\n    head = head->next;\n    delete temp;\n    return head;\n}\nSố phép gán con trỏ: ___',
            blanks: [
                { text: 'Số phép gán: ', answer: '2', caseSensitive: false }
            ],
            explanation: 'temp = head; head = head->next → 2 lần.'
        },

        {
            id: 'ch3_fill_ap_007',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Tính Tổng Danh Sách',
            question: 'int sumList(Node* head) {\n    int sum = 0;\n    while (head != nullptr) {\n        sum += head->data;\n        head = head->next;\n    }\n    return sum;\n}\nSố phép cộng trong danh sách n nút: ___',
            blanks: [
                { text: 'Số phép cộng: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút cộng 1 lần → n phép cộng.'
        },

        {
            id: 'ch3_fill_ap_008',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Lấy Phần Tử Cuối',
            question: 'Node* getLast(Node* head) {\n    if (head == nullptr) return nullptr;\n    while (head->next != nullptr)\n        head = head->next;\n    return head;\n}\nSố bước lặp trong danh sách n phần tử: ___',
            blanks: [
                { text: 'Số bước: ', answer: 'n-1', caseSensitive: false }
            ],
            explanation: 'Duyệt đến nút cuối → n-1 bước.'
        },

        {
            id: 'ch3_fill_ap_009',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Khai Báo Cấu Trúc',
            question: 'Điền từ khóa đúng để khai báo cấu trúc Node:\n___ Node {\n    int data;\n    Node* next;\n};',
            blanks: [
                { text: 'Từ khóa: ', answer: 'struct', caseSensitive: false }
            ],
            explanation: 'struct định nghĩa cấu trúc dữ liệu.'
        },

        {
            id: 'ch3_fill_ap_010',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Cấp Phát Động',
            question: 'Điền cú pháp cấp phát động:\nNode* newNode = ___ Node;',
            blanks: [
                { text: 'Từ khóa: ', answer: 'new', caseSensitive: false }
            ],
            explanation: 'new cấp phát bộ nhớ động.'
        },

        // ========== ANALYZE LEVEL (10 câu) ==========
        {
            id: 'ch3_fill_an_001',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Đếm Bước Duyệt',
            question: 'int countNodes(Node* head) {\n    int count = 0;\n    while (head != nullptr) {\n        count++;\n        head = head->next;\n    }\n    return count;\n}\nSố lần thực hiện head = head->next: ___',
            blanks: [
                { text: 'Số lần: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút di chuyển 1 lần → n lần.'
        },

        {
            id: 'ch3_fill_an_002',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Tìm Bước Cuối',
            question: 'Node* findLast(Node* head) {\n    while (head != nullptr && head->next != nullptr)\n        head = head->next;\n    return head;\n}\nSố lần gán head = head->next trong danh sách n phần tử: ___',
            blanks: [
                { text: 'Số lần: ', answer: 'n - 1', caseSensitive: false }
            ],
            explanation: 'Dừng ở nút cuối → n-1 lần.'
        },

        {
            id: 'ch3_fill_an_003',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Tổng Phép Gán Đảo Ngược',
            question: 'Node* reverseList(Node* head) {\n    Node *prev = nullptr, *cur = head;\n    while (cur != nullptr) {\n        Node* next = cur->next;\n        cur->next = prev;\n        prev = cur;\n        cur = next;\n    }\n    return prev;\n}\nTổng số phép gán con trỏ (next, prev, cur): ___',
            blanks: [
                { text: 'Tổng: ', answer: '3n', caseSensitive: false }
            ],
            explanation: 'Mỗi nút: 3 phép gán (next, prev, cur) → 3n.'
        },

        {
            id: 'ch3_fill_an_004',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Chèn Tại K',
            question: 'Node* insertAt(Node* head, int k, int val) {\n    Node* p = new Node{val, nullptr};\n    if (k == 0) {\n        p->next = head;\n        return p;\n    }\n    Node* cur = head;\n    for (int i = 0; i < k - 1 && cur != nullptr; ++i)\n        cur = cur->next;\n    if (cur == nullptr) return head;\n    p->next = cur->next;\n    cur->next = p;\n    return head;\n}\nSố phép duyệt cur = cur->next khi 0 ≤ k ≤ n: ___',
            blanks: [
                { text: 'Số lần: ', answer: 'k - 1', caseSensitive: false }
            ],
            explanation: 'Duyệt đến vị trí k-1 → k-1 lần.'
        },

        {
            id: 'ch3_fill_an_005',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Xóa Danh Sách',
            question: 'void deleteList(Node*& head) {\n    while (head != nullptr) {\n        Node* temp = head;\n        head = head->next;\n        delete temp;\n    }\n}\nSố phép xóa bộ nhớ (delete) khi danh sách có n phần tử: ___',
            blanks: [
                { text: 'Số phép delete: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'Xóa từng nút → n lần delete.'
        },

        {
            id: 'ch3_fill_an_006',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'So Sánh Danh Sách',
            question: 'int compareLists(Node* a, Node* b) {\n    while (a != nullptr && b != nullptr) {\n        if (a->data != b->data)\n            return 0;\n        a = a->next;\n        b = b->next;\n    }\n    return (a == nullptr && b == nullptr);\n}\nSố lần tối đa so sánh a->data != b->data trong 2 danh sách cùng kích thước n: ___',
            blanks: [
                { text: 'Số so sánh: ', answer: 'n', caseSensitive: false }
            ],
            explanation: 'So sánh từng cặp → tối đa n lần.'
        },

        {
            id: 'ch3_fill_an_007',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Kiểm Tra Rỗng',
            question: 'Khi thêm nút vào danh sách rỗng, nếu không gán head = newNode thì danh sách vẫn rỗng. Điền điều kiện:\nif (___) {\n    head = newNode;\n    newNode->next = NULL;\n}',
            blanks: [
                { text: 'Điều kiện: ', answer: 'head == NULL', caseSensitive: false }
            ],
            explanation: 'Kiểm tra danh sách rỗng → head == NULL.'
        },

        {
            id: 'ch3_fill_an_008',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Truy Cập An Toàn',
            question: 'Để tránh lỗi khi truy cập temp->data, điền điều kiện an toàn:\nif (___) {\n    cout << temp->data;\n}',
            blanks: [
                { text: 'Điều kiện: ', answer: 'temp != NULL', caseSensitive: false }
            ],
            explanation: 'Kiểm tra pointer không NULL trước khi truy cập.'
        },

        {
            id: 'ch3_fill_an_009',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Xóa Sau Nút',
            question: 'Để xoá nút sau temp, phải kiểm tra:\nif (temp != NULL && ___) {\n    Node* delNode = temp->next;\n    temp->next = delNode->next;\n    delete delNode;\n}',
            blanks: [
                { text: 'Điều kiện: ', answer: 'temp->next != NULL', caseSensitive: false }
            ],
            explanation: 'Kiểm tra nút tiếp theo tồn tại.'
        },

        {
            id: 'ch3_fill_an_010',
            type: QuestionType.FILL_BLANK,
            chapter: 3,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Chèn Đầu DSLK Đôi',
            question: 'Thêm vào đầu danh sách liên kết đôi:\nnewNode->next = head;\nnewNode->prev = NULL;\nif (head != NULL) {\n    ___ = newNode;\n}\nhead = newNode;',
            blanks: [
                { text: 'Cập nhật: ', answer: 'head->prev', caseSensitive: false }
            ],
            explanation: 'Cập nhật prev của head cũ trỏ về newNode.'
        }
    ]
};

export default CHAPTER_3_QUESTIONS;
