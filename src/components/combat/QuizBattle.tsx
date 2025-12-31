/**
 * Thành Phần Chiến Đấu Quiz Nâng Cao
 * Hệ thống chiến đấu hỗ trợ ĐỘNG tất cả các loại câu hỏi
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { sparky } from '../../game/ai/SparkyBot';
import type { Question, MultipleChoiceQuestion, FillBlankQuestion, MatchingQuestion } from '../../data/models/Question';
import { QuestionType } from '../../data/models/Question';
import { ResourceType } from '../../data/models/Item';
import { FillBlankQuiz } from '../quiz/FillBlankQuiz';
import { MatchingQuiz } from '../quiz/MatchingQuiz';
import CHAPTER_1_QUESTIONS from '../../data/questions/chapter1';
import './QuizBattle.css';

interface QuizBattleProps {
    monsterId: string;
    onVictory: () => void;
}

export const QuizBattle: React.FC<QuizBattleProps> = ({ monsterId, onVictory }) => {
    const { combat, updateMonsterHealth, useHint, showSparky } = useGameStore();
    const { recordAnswer, addResource } = usePlayerStore();

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [monsterHit, setMonsterHit] = useState(false);
    const [damageNumber, setDamageNumber] = useState<number | null>(null);

    // Kết hợp tất cả câu hỏi (hoặc lọc theo màn chơi)
    // Đối với Dungeon 1 (Chapter 1), chúng ta ưu tiên câu hỏi Chapter 1
    const allQuestions = CHAPTER_1_QUESTIONS.questions;

    // Xác định hình ảnh quái vật
    const getMonsterImage = () => {
        if (monsterId === 'chapter1_boss') return "/assets/images/monsters/Quái Ải 1/The Initialization Golem(Boss Ải 1).png";
        if (monsterId === 'rune_golem') return "/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png";
        return "/assets/images/monsters/Quái Ải 1/Logic Slime(Quái Ải 1).png";
    };

    // Tải một câu hỏi ngẫu nhiên
    const loadRandomQuestion = () => {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        setCurrentQuestion(allQuestions[randomIndex]);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsCorrect(false);
    };

    useEffect(() => {
        loadRandomQuestion();
    }, []);

    if (!currentQuestion) {
        return <div>Loading question...</div>;
    }

    // ... (rest of logic) ...

    // ... inside return ...
    <img
        src={getMonsterImage()}
        alt={monsterId}
        style={{ maxWidth: '300px', height: 'auto' }} // Adjust size for Boss
    />

    // Xử lý câu trả lời cho BẤT KỲ loại câu hỏi nào
    const handleAnswer = (correct: boolean, answerData?: any) => {
        setIsCorrect(correct);
        setShowFeedback(true);
        recordAnswer(correct);

        // Log answer data cho debugging và analytics
        if (answerData) {
            console.log('Player answer:', answerData, 'Correct:', correct);
        }

        if (correct) {
            // Gây sát thương cho quái vật
            const damage = currentQuestion.points; // Sát thương dựa trên độ khó câu hỏi
            const newHealth = Math.max(0, combat.monsterHealth - damage);
            updateMonsterHealth(newHealth);

            // Trigger damage animation
            setMonsterHit(true);
            setDamageNumber(damage);
            setTimeout(() => {
                setMonsterHit(false);
                setDamageNumber(null);
            }, 800);

            // Thưởng tài nguyên dựa trên điểm câu hỏi
            const woodReward = Math.floor(currentQuestion.points / 5);
            const oPointsReward = currentQuestion.points;
            addResource(ResourceType.DATA_WOOD, woodReward);
            addResource(ResourceType.O_POINTS, oPointsReward);

            // Kiểm tra chuyển giai đoạn Boss (đơn giản hóa)
            if (newHealth > 0 && newHealth <= 50 && combat.currentPhase === 1) {
                showSparky("⚠️ WARNING: Boss entering Phase 2! Difficulty increasing!");
                // Trong triển khai thực tế, chúng ta sẽ cập nhật trạng thái để đưa ra câu hỏi khó hơn
                // Hiện tại, chỉ thông báo.
            } else {
                showSparky(`💡 Correct! ${damage} damage dealt! +${woodReward} Data-Wood, +${oPointsReward} O-Points!`);
            }

            // Kiểm tra chiến thắng
            if (newHealth <= 0) {
                setTimeout(() => onVictory(), 2000);
            }
        } else {
            // Người chơi nhận sát thương khi trả lời sai
            // Hiện gợi ý từ Sparky
            const hint = sparky.provideHint(
                currentQuestion.type,
                currentQuestion.topic,
                0,
                0
            );
            showSparky(hint.message);
        }
    };

    // Hàm trợ giúp để lấy giải thích một cách an toàn (Câu hỏi lập trình không có)
    const getExplanation = (question: Question): string => {
        if (question.type === QuestionType.PROGRAMMING) {
            return 'Check the hints and test cases for guidance.';
        }
        return (question as MultipleChoiceQuestion | FillBlankQuestion | MatchingQuestion).explanation || 'No explanation available.';
    };

    const handleUseHint = () => {
        useHint();
        const explanation = getExplanation(currentQuestion);
        showSparky(`💡 Hint: ${explanation}`);
    };

    const handleNext = () => {
        loadRandomQuestion();
    };

    // Hiển thị câu hỏi dựa trên loại
    const renderQuestion = () => {
        switch (currentQuestion.type) {
            case QuestionType.MULTIPLE_CHOICE:
                return renderMCQ(currentQuestion as MultipleChoiceQuestion);

            case QuestionType.FILL_BLANK:
                return (
                    <FillBlankQuiz
                        question={currentQuestion as FillBlankQuestion}
                        onAnswer={handleAnswer}
                    />
                );

            case QuestionType.MATCHING:
                return (
                    <MatchingQuiz
                        question={currentQuestion as MatchingQuestion}
                        onAnswer={handleAnswer}
                    />
                );

            case QuestionType.PROGRAMMING:
                return (
                    <div className="programming-placeholder">
                        <h3>🔨 Programming Challenge</h3>
                        <p>Programming exercises will open the Runic Console!</p>
                        <button className="btn-open-console" onClick={() => showSparky('Open Runic Console for programming questions!')}>
                            Open Runic Console
                        </button>
                    </div>
                );

            default:
                return <div>Unsupported question type</div>;
        }
    };

    // MCQ rendering (inline, not separate component)
    const renderMCQ = (mcqQuestion: MultipleChoiceQuestion) => {
        const handleAnswerSelect = (index: number) => {
            if (showFeedback) return;
            setSelectedAnswer(index);
        };

        const handleSubmit = () => {
            if (selectedAnswer === null) return;
            const correct = selectedAnswer === mcqQuestion.correctAnswer;
            handleAnswer(correct, selectedAnswer);
        };

        return (
            <>
                <div className="question-text">
                    <p>{mcqQuestion.question}</p>
                </div>

                {/* Answer Options */}
                <div className="answer-options">
                    {mcqQuestion.options.map((option, index) => (
                        <motion.button
                            key={index}
                            className={`answer-option ${selectedAnswer === index ? 'selected' : ''
                                } ${showFeedback && index === mcqQuestion.correctAnswer
                                    ? 'correct'
                                    : showFeedback && selectedAnswer === index && !isCorrect
                                        ? 'wrong'
                                        : ''
                                }`}
                            whileHover={!showFeedback ? { scale: 1.02 } : {}}
                            whileTap={!showFeedback ? { scale: 0.98 } : {}}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showFeedback}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Actions */}
                <div className="battle-actions">
                    <button
                        className="btn-hint"
                        onClick={handleUseHint}
                        disabled={showFeedback}
                    >
                        💡 Hint ({combat.hintsUsed} used)
                    </button>

                    {!showFeedback ? (
                        <button
                            className="btn-submit"
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null}
                        >
                            ⚔️ Attack!
                        </button>
                    ) : (
                        <button
                            className="btn-next"
                            onClick={handleNext}
                        >
                            ➡️ Next Question
                        </button>
                    )}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {isCorrect ? (
                                <div className="feedback-content">
                                    <span className="feedback-icon">✅</span>
                                    <p>Correct! The monster takes damage!</p>
                                </div>
                            ) : (
                                <div className="feedback-content">
                                    <span className="feedback-icon">❌</span>
                                    <p>Incorrect. The correct answer was: {mcqQuestion.options[mcqQuestion.correctAnswer]}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    };

    return (
        <div className="quiz-battle-container">
            {/* Monster Display */}
            <div className="monster-section">
                <motion.div
                    className="monster-sprite"
                    animate={monsterHit ? {
                        x: [-5, 5, -5, 5, 0],
                        scale: [1, 0.95, 1]
                    } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <img
                        src={getMonsterImage()}
                        alt={monsterId}
                        style={{ maxWidth: '300px', height: 'auto' }}
                    />
                    {/* Floating damage number */}
                    <AnimatePresence>
                        {damageNumber !== null && (
                            <motion.div
                                className="damage-number"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 0, y: -50 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                -{damageNumber}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <div className="monster-health-bar">
                    <div
                        className="health-fill monster-health"
                        style={{ width: `${combat.monsterHealth}%` }}
                    />
                    <span className="health-text">{combat.monsterHealth} / 100</span>
                </div>
            </div>

            {/* Question Panel */}
            <div className="question-panel">
                <div className="question-header">
                    <span className="question-topic">📚 {currentQuestion.topic}</span>
                    <span className="question-bloom">
                        {currentQuestion.type} • {currentQuestion.bloomLevel} • {currentQuestion.points} pts
                    </span>
                </div>

                {/* Dynamic Question Rendering */}
                {renderQuestion()}
            </div>

            {/* Player Health */}
            <div className="player-health-bar">
                <span>Your HP:</span>
                <div
                    className="health-fill player-health"
                    style={{ width: `${combat.playerHealth}%` }}
                />
                <span className="health-text">{combat.playerHealth} / 100</span>
            </div>
        </div >
    );
};
