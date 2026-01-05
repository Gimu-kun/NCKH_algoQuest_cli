/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NGÂN HÀNG CÂU HỎI CHƯƠNG 5 (Question Bank - Chapter 5)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Cung cấp các câu hỏi kiểm tra kiến thức về:
 * - Cây Nhị Phân Tìm Kiếm (Binary Search Tree - BST).
 * - Các phép duyệt cây (Traversal: In-order, Pre-order, Post-order).
 * - Các thuộc tính của cây (Height, Depth, Leaf nodes).
 * - Đệ quy trên cây.
 * 
 * NGUỒN DỮ LIỆU:
 * - Dựa trên tài liệu "40 Câu Chương 5.MD".
 * 
 * @module Chapter5Questions
 * @category Data/Questions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { QuestionType, BloomLevel } from '../models/Question';
import type { QuestionBank } from '../models/Question';

export const CHAPTER_5_QUESTIONS: QuestionBank = {
    chapter: 5,
    title: 'Cây Nhị Phân Tìm Kiếm (BST)',
    description: 'Kiểm tra kiến thức về cấu trúc dữ liệu cây và thuật toán liên quan',
    questions: [
        // ========== MỨC ĐỘ NHỚ - REMEMBER LEVEL ==========
        {
            id: 'ch5_fill_r_001',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'BST Properties',
            question: 'Số lượng con tối đa mà một nút trong cây nhị phân tìm kiếm có thể có là: ___',
            blanks: [{ text: 'Số con tối đa: ', answer: '2', caseSensitive: false }],
            explanation: 'Cây nhị phân mỗi nút có tối đa 2 con (trái, phải).'
        },
        {
            id: 'ch5_fill_r_002',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'BST Search',
            question: 'Trong BST, số lượng phép so sánh tối đa cần để tìm một phần tử trong cây có chiều cao h=5 là: ___',
            blanks: [{ text: 'Số so sánh max: ', answer: '5', caseSensitive: false }],
            explanation: 'Trong trường hợp xấu nhất, ta duyệt từ gốc đến lá xa nhất (bằng chiều cao cây).'
        },
        {
            id: 'ch5_fill_r_003',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Leaf Counting',
            question: 'Cây nhị phân tìm kiếm với 1 nút có bao nhiêu lá? ___',
            blanks: [{ text: 'Số lá: ', answer: '1', caseSensitive: false }],
            explanation: 'Nút gốc cũng chính là lá duy nhất.'
        },
        {
            id: 'ch5_fill_r_004',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'Full Binary Tree',
            question: 'Cây nhị phân đầy đủ (full) với 3 tầng sẽ có tổng số nút là: ___',
            blanks: [{ text: 'Tổng số nút: ', answer: '7', caseSensitive: false }],
            explanation: '2^3 - 1 = 7 nút.'
        },
        {
            id: 'ch5_fill_r_005',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.REMEMBER,
            points: 10,
            topic: 'In-order Traversal',
            question: 'Trong phép duyệt in-order BST, nếu cây có 6 phần tử, số phần tử được in ra là: ___',
            blanks: [{ text: 'Số phần tử in ra: ', answer: '6', caseSensitive: false }],
            explanation: 'Duyệt cây luôn thăm tất cả các nút (6).'
        },

        // ========== MỨC ĐỘ HIỂU - UNDERSTAND LEVEL ==========
        {
            id: 'ch5_fill_u_011',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Perfectly Balanced Tree',
            question: 'Số phép so sánh tìm kiếm tối đa trong cây BST cân bằng hoàn toàn 15 nút là: ___',
            blanks: [{ text: 'Số phép so sánh: ', answer: '4', caseSensitive: false }],
            explanation: 'Chiều cao h = floor(log2(15)) + 1 = 3+1 = 4 tầng.'
        },
        {
            id: 'ch5_fill_u_012',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'In-order Min Element',
            question: 'Trong một cây BST, duyệt in-order thì phần tử nhỏ nhất sẽ được in ra ở vị trí thứ: ___',
            blanks: [{ text: 'Vị trí thứ: ', answer: '1', caseSensitive: false }],
            explanation: 'In-order (L-N-R) luôn thăm các giá trị theo thứ tự tăng dần.'
        },
        {
            id: 'ch5_fill_u_013',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'In-order Sequence',
            question: 'Cho BST: 50, 30, 70, 20, 40, 60, 80. Khi duyệt in-order, phần tử thứ 5 là: ___',
            blanks: [{ text: 'Giá trị: ', answer: '60', caseSensitive: false }],
            explanation: 'Sorted: 20, 30, 40, 50, 60, 70, 80. Vị trí 5 là 60.'
        },
        {
            id: 'ch5_fill_u_016',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.UNDERSTAND,
            points: 15,
            topic: 'Tree Levels',
            question: 'Trong cây BST có 3 tầng (root là tầng 0), số nút tối đa có thể có ở tầng thứ 2 là: ___',
            blanks: [{ text: 'Số nút tầng 2: ', answer: '4', caseSensitive: false }],
            explanation: 'Tầng 0: 1, Tầng 1: 2, Tầng 2: 4.'
        },

        // ========== MỨC ĐỘ VẬN DỤNG - APPLY LEVEL ==========
        {
            id: 'ch5_fill_ap_021',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Recursive Count',
            question: 'Đệ quy đếm nút countNodes(root) = 1 + left + right. BST: 30, 20, 40, 10, 25. Số nút là: ___',
            blanks: [{ text: 'Số nút: ', answer: '5', caseSensitive: false }],
            explanation: 'Cây có 5 giá trị duy nhất.'
        },
        {
            id: 'ch5_fill_ap_022',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Tree Height',
            question: 'Tính height(root) = 1 + max(left, right). BST từ: 50, 30, 20, 40, 70, 60. Chiều cao là: ___',
            blanks: [{ text: 'Chiều cao: ', answer: '3', caseSensitive: false }],
            explanation: 'Đường dài nhất: 50 -> 30 -> 20 (hoặc 40) là 3 nodes, hoặc 50 -> 70 -> 60.'
        },
        {
            id: 'ch5_fill_ap_023',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'Search Comparisons',
            question: 'BST: 100, 50, 150, 30, 70. Tìm x = 70. Số so sánh thực hiện là: ___',
            blanks: [{ text: 'Số so sánh: ', answer: '3', caseSensitive: false }],
            explanation: '100 (>70) -> 50 (<70) -> 70 (==). Tổng 3 bước.'
        },
        {
            id: 'ch5_fill_ap_028',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.APPLY,
            points: 20,
            topic: 'BST Insertion',
            question: 'Sau khi chèn: 50, 25, 75, 20, 30. Giá trị tại root->left->right là: ___',
            blanks: [{ text: 'Giá trị: ', answer: '30', caseSensitive: false }],
            explanation: 'Root(50) -> Left(25) -> Right(30) (vì 30 > 25).'
        },

        // ========== MỨC ĐỘ PHÂN TÍCH - ANALYZE LEVEL ==========
        {
            id: 'ch5_fill_an_031',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Code Trace In-order',
            question: 'BST: 50, 30, 70, 20, 40, 60, 80. Gọi inOrder(root) tăng biến đếm count. Kết quả count: ___',
            blanks: [{ text: 'Count: ', answer: '7', caseSensitive: false }],
            explanation: 'Hàm inOrder duyệt qua tất cả 7 node.'
        },
        {
            id: 'ch5_fill_an_032',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Max Depth Trace',
            question: 'BST: 100, 50, 150, 25, 75, 125, 175. Độ sâu tối đa maxDepth trả về là: ___',
            blanks: [{ text: 'Max Depth: ', answer: '3', caseSensitive: false }],
            explanation: 'Cây cân bằng hoàn hảo 3 tầng.'
        },
        {
            id: 'ch5_fill_an_034',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Pre-order Trace',
            question: 'BST: 50, 30, 70, 20, 40, 60, 80. Duyệt pre-order (N-L-R), giá trị in ra thứ 5 là: ___',
            blanks: [{ text: 'Giá trị: ', answer: '70', caseSensitive: false }],
            explanation: 'Thứ tự pre-order: Root(50), Left(30, 20, 40), Right(70, 60, 80). Dãy: 50, 30, 20, 40, 70, 60, 80. Phần tử thứ 5 là 70.'
        },
        {
            id: 'ch5_fill_an_036',
            type: QuestionType.FILL_BLANK,
            chapter: 5,
            bloomLevel: BloomLevel.ANALYZE,
            points: 30,
            topic: 'Search Cost Analysis',
            question: 'BST: 30, 20, 40, 10, 25, 35, 50. Số phép so sánh khi tìm giá trị 25 là: ___',
            blanks: [{ text: 'Số phép so sánh: ', answer: '3', caseSensitive: false }],
            explanation: '30 -> 20 -> 25. 3 bước.'
        }
    ]
};

export default CHAPTER_5_QUESTIONS;
