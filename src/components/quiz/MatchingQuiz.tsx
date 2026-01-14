/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: CÂU HỎI GHÉP ĐÔI (Matching Quiz)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị bài tập yêu cầu người chơi nối các cặp mục tương ứng từ hai cột (Trái/Phải).
 * Ví dụ: Ghép Thuật toán -> Độ phức tạp, Cấu trúc dữ liệu -> Đặc điểm.
 * 
 * TÍNH NĂNG:
 * - Giao diện 2 cột tương tác trực quan.
 * - Hỗ trợ chọn, hủy chọn và thay đổi liên kết linh hoạt.
 * - Visual Feedback: Đường nối logic (ẩn/hiện), màu sắc trạng thái (Selected/Matched).
 * 
 * FLOW TƯƠNG TÁC:
 * 1. User chọn item cột Trái (`selectedLeft`).
 * 2. User chọn item cột Phải -> Tạo cặp ghép (`matches`).
 *    - Nếu item Phải đã ghép -> Ghi đè.
 * 3. Click lại item đã ghép -> Hủy ghép (Unmatch).
 * 4. Submit -> Kiểm tra từng cặp với `correctMatches` trong Data.
 * 
 * THUẬT TOÁN & KỸ THUẬT:
 * - State Management: `matches` array lưu đặp `{leftId, rightId}`.
 * - Lookup Check: Sử dụng `some/find` để kiểm tra trạng thái item (Matched/Correct).
 * - Interaction Lock: Disable thao tác khi đã Submit.
 * 
 * @component MatchingQuiz
 * @category Educational Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MatchingQuestion } from '../../data/models/Question';
import './MatchingQuiz.css';

interface MatchingQuizProps {
    question: MatchingQuestion;
    onAnswer: (correct: boolean, matches: { leftId: string; rightId: string }[]) => void;
}

export const MatchingQuiz: React.FC<MatchingQuizProps> = ({ question, onAnswer }) => {
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matches, setMatches] = useState<{ leftId: string; rightId: string }[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);

    /**
     * Xử lý click cột trái
     */
    const handleLeftClick = (leftId: string) => {
        if (submitted) return;

        // Nếu item này đã được ghép đôi, click vào sẽ hủy ghép (Unmatch)
        if (matches.some(m => m.leftId === leftId)) {
            setMatches(matches.filter(m => m.leftId !== leftId));
            setSelectedLeft(null);
        } else {
            // Nếu chưa ghép, chọn nó để chuẩn bị ghép
            setSelectedLeft(leftId);
        }
    };

    /**
     * Xử lý click cột phải
     */
    const handleRightClick = (rightId: string) => {
        if (submitted || !selectedLeft) return;

        // Nếu item phải này đã được ghép với ai đó trước đó, hủy ghép cũ
        if (matches.some(m => m.rightId === rightId)) {
            setMatches(matches.filter(m => m.rightId !== rightId));
        }

        // Tạo cặp ghép mới
        setMatches([...matches, { leftId: selectedLeft, rightId }]);
        setSelectedLeft(null); // Reset selection
    };

    const handleSubmit = () => {
        // Kiểm tra từng cặp ghép
        const newResults = matches.map(match => {
            return question.correctMatches.some(
                cm => cm.leftId === match.leftId && cm.rightId === match.rightId
            );
        });

        setResults(newResults);
        setSubmitted(true);

        // Đúng nếu số lượng cặp khớp đủ VÀ tất cả đều đúng
        const allCorrect = newResults.length === question.correctMatches.length &&
            newResults.every(r => r);
        onAnswer(allCorrect, matches);
    };

    const handleReset = () => {
        setMatches([]);
        setSelectedLeft(null);
        setSubmitted(false);
        setResults([]);
    };

    // Helper: Tìm item phải đang ghép với item trái
    const getMatchedRight = (leftId: string) => {
        const match = matches.find(m => m.leftId === leftId);
        return match ? match.rightId : null;
    };

    // Helper: Kiểm tra item phải đã được ghép chưa
    const isRightMatched = (rightId: string) => {
        return matches.some(m => m.rightId === rightId);
    };

    // Helper: Lấy kết quả đúng/sai cho item trái
    const getMatchResult = (leftId: string) => {
        if (!submitted) return null;
        const matchIndex = matches.findIndex(m => m.leftId === leftId);
        return matchIndex >= 0 ? results[matchIndex] : false;
    };

    return (
        <div className="matching-quiz">
            <div className="question-prompt">
                <h3>{question.question}</h3>
                <span className="question-points">{question.points} điểm | {question.bloomLevel}</span>
            </div>

            <div className="matching-grid">
                {/* Cột Trái (Left Column) */}
                <div className="matching-column left-column">
                    {question.leftColumn.map(item => {
                        const matchedRight = getMatchedRight(item.id);
                        const matchResult = getMatchResult(item.id);

                        return (
                            <motion.div
                                key={item.id}
                                className={`matching-item ${selectedLeft === item.id ? 'selected' : ''} ${matchedRight ? 'matched' : ''
                                    } ${submitted && matchResult !== null ? (matchResult ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleLeftClick(item.id)}
                                whileHover={!submitted ? { scale: 1.02 } : {}}
                                whileTap={!submitted ? { scale: 0.98 } : {}}
                            >
                                <span className="item-text">{item.text}</span>
                                {matchedRight && (
                                    <span className="match-indicator">
                                        {submitted && matchResult !== null ? (matchResult ? '✓' : '✗') : '→'}
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Cột Phải (Right Column) */}
                <div className="matching-column right-column">
                    {question.rightColumn.map(item => {
                        const isMatched = isRightMatched(item.id);

                        return (
                            <motion.div
                                key={item.id}
                                className={`matching-item ${isMatched ? 'matched' : ''} ${selectedLeft && !isMatched ? 'clickable' : ''
                                    }`}
                                onClick={() => handleRightClick(item.id)}
                                whileHover={selectedLeft && !submitted ? { scale: 1.02 } : {}}
                                whileTap={selectedLeft && !submitted ? { scale: 0.98 } : {}}
                            >
                                <span className="item-text">{item.text}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Hiển thị kết quả chi tiết */}
            {submitted && (
                <motion.div
                    className="correct-matches"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h4>Các cặp chính xác:</h4>
                    {question.correctMatches.map((cm, index) => {
                        const leftItem = question.leftColumn.find(l => l.id === cm.leftId);
                        const rightItem = question.rightColumn.find(r => r.id === cm.rightId);

                        return (
                            <div key={index} className="match-pair">
                                <span className="match-left">{leftItem?.text}</span>
                                <span className="match-arrow">→</span>
                                <span className="match-right">{rightItem?.text}</span>
                            </div>
                        );
                    })}
                    {question.explanation && (
<<<<<<< HEAD
                        <p className="explanation"><i className="fi fi-rr-bulb"></i> {question.explanation}</p>
=======
                        <p className="explanation">💡 {question.explanation}</p>
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                    )}
                </motion.div>
            )}

            <div className="matching-actions">
                {!submitted ? (
                    <>
                        <p className="instruction">
                            Chọn một mục bên trái, sau đó chọn mục tương ứng bên phải để ghép đôi.
                        </p>
                        <button
                            className="btn-submit"
                            onClick={handleSubmit}
                            disabled={matches.length !== question.leftColumn.length}
                        >
                            ✓ Gửi Đáp Án ({matches.length}/{question.leftColumn.length})
                        </button>
                    </>
                ) : (
                    <button className="btn-reset" onClick={handleReset}>
                        ↻ Thử Lại
                    </button>
                )}
            </div>
        </div>
    );
};
