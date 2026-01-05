/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: CÂU HỎI ĐIỀN KHUYẾT (Fill-in-Blank Quiz)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị và xử lý logic cho loại câu hỏi yêu cầu người chơi điền từ/số vào chỗ trống.
 * 
 * TÍNH NĂNG:
 * - Render câu hỏi với nhiều chỗ trống (Multi-blank Support).
 * - Feedback tức thì sau khi nộp bài (Correct/Wrong indicators).
 * - Hiển thị đáp án đúng và giải thích chi tiết.
 * 
 * FLOW XỬ LÝ:
 * 1. User nhập liệu vào các ô input -> Update Local State (`answers`).
 * 2. User nhấn 'Gửi' -> Trigger `handleSubmit`.
 * 3. Validate từng ô input so với đáp án gốc (`isCorrectAnswer`).
 *    - Có thể hỗ trợ Case Sensitivity hoặc Fuzzy Check (Future).
 * 4. Hiển thị kết quả (Blue/Red borders, Icons).
 * 5. Callback `onAnswer` trả về kết quả cho `QuizBattle`.
 * 
 * KỸ THUẬT:
 * - Controlled Components: Input value được bind với React State.
 * - String Normalization: Trim/LowerCase để so sánh chính xác.
 * - Conditional Rendering: Hiển thị đáp án/Giải thích sau khi submit.
 * 
 * @component FillBlankQuiz
 * @category Educational Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FillBlankQuestion } from '../../data/models/Question';
import './FillBlankQuiz.css';

interface FillBlankQuizProps {
    question: FillBlankQuestion;
    onAnswer: (correct: boolean, answers: string[]) => void;
}

export const FillBlankQuiz: React.FC<FillBlankQuizProps> = ({ question, onAnswer }) => {
    // State lưu trữ câu trả lời của người dùng
    const [answers, setAnswers] = useState<string[]>(
        question.blanks.map(() => '')
    );
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<boolean[]>([]); // Mảng kết quả cho từng ô

    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    /**
     * Thuật toán Levenshtein Distance để so sánh chuỗi (Fuzzy Match)
     * Dùng để chấp nhận các lỗi chính tả nhỏ (nếu cần).
     * @param a Chuỗi gốc
     * @param b Chuỗi so sánh
     * @returns Khoảng cách chỉnh sửa (Edit distance)
     */
    /*
    const levenshtein = (a: string, b: string): number => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // thay thế
                        Math.min(
                            matrix[i][j - 1] + 1, // chèn
                            matrix[i - 1][j] + 1  // xóa
                        )
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };
    */

    /**
     * Kiểm tra đáp án
     * @param input Dữ liệu người dùng nhập
     * @param target Đáp án đúng
     * @param caseSensitive Có phân biệt hoa thường không
     */
    const isCorrectAnswer = (input: string, target: string, caseSensitive: boolean = false) => {
        const cleanInput = input.trim();
        const cleanTarget = target.trim();

        if (caseSensitive) {
            return cleanInput === cleanTarget;
        }

        const inputLower = cleanInput.toLowerCase();
        const targetLower = cleanTarget.toLowerCase();

        // 1. Khớp chính xác (Exact match)
        if (inputLower === targetLower) return true;

        // 2. Khớp mờ (Fuzzy match) - Chấp nhận sai số 20% hoặc tối đa 1 ký tự (cho từ ngắn)
        // Lưu ý: Chỉ áp dụng nếu hệ thống cho phép "gần đúng". 
        // Trong lập trình (code syntax), thường yêu cầu chính xác tuyệt đối.
        // Có thể cấu hình thêm cờ `fuzzyAllowed` trong model Question.

        // Hiện tại: Tắt fuzzy match cho code để đảm bảo tính chính xác
        return inputLower === targetLower;

        /* 
        // Fuzzy logic cũ (nếu muốn dùng lại cho câu hỏi khái niệm):
        const dist = levenshtein(inputLower, targetLower);
        const maxErrors = Math.max(1, Math.floor(targetLower.length * 0.2));
        return dist <= maxErrors;
        */
    };

    const handleSubmit = () => {
        const newResults = answers.map((answer, index) => {
            const blank = question.blanks[index];
            return isCorrectAnswer(answer, blank.answer, blank.caseSensitive);
        });

        setResults(newResults);
        setSubmitted(true);

        const allCorrect = newResults.every(r => r);
        onAnswer(allCorrect, answers);
    };

    const handleReset = () => {
        setAnswers(question.blanks.map(() => ''));
        setSubmitted(false);
        setResults([]);
    };

    return (
        <div className="fill-blank-quiz">
            {/* Header câu hỏi */}
            <div className="question-prompt">
                <h3>{question.question}</h3>
                <span className="question-points">{question.points} điểm | {question.bloomLevel}</span>
            </div>

            {/* Khu vực điền đáp án */}
            <div className="fill-blank-content">
                {question.blanks.map((blank, index) => (
                    <div key={index} className="blank-group">
                        <p className="blank-text">{blank.text}</p>
                        <div className={`blank-input-wrapper ${submitted ? (results[index] ? 'correct' : 'wrong') : ''}`}>
                            <input
                                type="text"
                                className="blank-input"
                                value={answers[index]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                disabled={submitted}
                                placeholder={`Chỗ trống ${index + 1}`}
                                autoFocus={index === 0}
                            />
                            {submitted && (
                                <span className="result-icon">
                                    {results[index] ? '✓' : '✗'}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hiển thị đáp án đúng sau khi nộp */}
            {submitted && (
                <motion.div
                    className="correct-answers"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h4>Đáp án chính xác:</h4>
                    {question.blanks.map((blank, index) => (
                        <div key={index} className="answer-item">
                            <span className="answer-label">Chỗ trống {index + 1}:</span>
                            <code className="answer-code">{blank.answer}</code>
                        </div>
                    ))}
                    {question.explanation && (
                        <p className="explanation">💡 {question.explanation}</p>
                    )}
                </motion.div>
            )}

            {/* Nút hành động */}
            <div className="fill-blank-actions">
                {!submitted ? (
                    <button
                        className="btn-submit"
                        onClick={handleSubmit}
                        disabled={answers.some(a => a.trim() === '')}
                    >
                        ✓ Gửi Câu Trả Lời
                    </button>
                ) : (
                    // Chỉ hiển thị nút thử lại nếu cần (trong chế độ luyện tập)
                    // Trong combat thực tế, QuizBattle sẽ xử lý việc next qua câu khác
                    <button className="btn-reset" onClick={handleReset}>
                        ↻ Làm Lại (Debug)
                    </button>
                )}
            </div>
        </div>
    );
};
