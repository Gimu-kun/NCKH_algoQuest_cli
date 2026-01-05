/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HỆ THỐNG CHIẾN ĐẤU (Quiz Battle System)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Component lõi quản lý màn hình chiến đấu (Battle Screen):
 * - Hiển thị quái vật và thanh máu (HP Bar).
 * - Hiển thị câu hỏi (Trắc nghiệm, Điền khuyết, Nối...).
 * - Xử lý logic tấn công: Trả lời đúng -> Gây sát thương -> Nhận thưởng.
 * - Xử lý logic phòng thủ: Trả lời sai -> Nhận sát thương -> Sparky gợi ý.
 * 
 * TÍNH NĂNG:
 * - Hiển thị và tương tác với nhiều loại câu hỏi (MCQ, Fill-Blank, Matching).
 * - Hệ thống Feedback Loop: Visual (Animation, Shake) và Audio (Sound Effects).
 * - Tích hợp Hint System: Gợi ý từ Sparky Bot.
 * - Quản lý State Combat: HP Player/Monster, Phases, Rewards.
 * 
 * FLOW CHIẾN ĐẤU:
 * 1. Load quái vật & câu hỏi phù hợp (Dựa trên Dungeon & Monster Tier).
 * 2. Player chọn đáp án (Input).
 * 3. Feedback Loop:
 *    - Đúng: Trigger Animation tấn công, trừ máu quái, cộng tài nguyên.
 *    - Sai: Trigger Animation nhận sát thương, hiện gợi ý từ Sparky AI.
 * 4. Win Condition: Máu quái <= 0 -> Victory Callback.
 * 
 * KỸ THUẬT:
 * - Polymorphic Rendering: Render UI khác nhau tùy theo `QuestionType`.
 * - Animation Orchestration: Sử dụng `framer-motion` cho các hiệu ứng chuyển động.
 * - State Synchronization: Đồng bộ dữ liệu với Global Store.
 * 
 * PHỤ THUỘC:
 * - `MonsterSpawner`: Lấy thông tin quái.
 * - `QuestionManager`: Lấy ngân hàng câu hỏi.
 * - `SparkyBot`: AI Suggestions.
 * - `GameStore` & `PlayerStore`: Quản lý state.
 * 
 * @component QuizBattle
 * @category Combat System
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { sparky } from '../../game/ai/SparkyBot';
import type { Question, MultipleChoiceQuestion, FillBlankQuestion, MatchingQuestion } from '../../data/models/Question';
import { QuestionType } from '../../data/models/Question';
import { ResourceType } from '../../data/models/Item';
import { audioManager } from '../../game/audio/AudioManager';
import { FillBlankQuiz } from '../quiz/FillBlankQuiz';
import { MatchingQuiz } from '../quiz/MatchingQuiz';
import { getQuestionsForMonster } from '../../data/questions/QuestionManager';
import { MonsterSpawner } from '../../game/spawner/MonsterSpawner';
import './QuizBattle.css';
import { SPELLS } from '../../data/models/Spell';
import type { SpellData } from '../../data/models/Spell';

interface QuizBattleProps {
    monsterId: string;
    onVictory: () => void;
}

export const QuizBattle: React.FC<QuizBattleProps> = ({ monsterId, onVictory }) => {
    // Hooks truy cập Global State
    const { combat, updateMonsterHealth, updatePlayerHealth, useHint, showSparky } = useGameStore();
    const { recordAnswer, addResource, removeResource, unlockedSpells, resources } = usePlayerStore();

    // Local State cho UI logic
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false); // Hiển thị kết quả đúng/sai
    const [isCorrect, setIsCorrect] = useState(false);
    const [monsterHit, setMonsterHit] = useState(false); // Trigger animation quái bị đánh
    const [damageNumber, setDamageNumber] = useState<number | null>(null); // Số damage hiển thị (Floating Text)

    // ... (rest of the component)

    const handleCastSpell = (spell: SpellData) => {
        if (resources[ResourceType.O_POINTS] < spell.manaCost) {
            showSparky('Không đủ O-Points để dùng phép!');
            audioManager.playSFX('/assets/audio/sfx_error.mp3');
            return;
        }

        removeResource(ResourceType.O_POINTS, spell.manaCost);
        audioManager.playSFX('/assets/audio/sfx_spell_cast.mp3');

        let msg = '';
        if (spell.combatType === 'ATTACK') {
            const damage = spell.combatValue || 20;
            const newHealth = Math.max(0, combat.monsterHealth - damage);
            updateMonsterHealth(newHealth);
            setMonsterHit(true);
            setDamageNumber(damage);
            audioManager.playSFX('/assets/audio/sfx_attack_hit.mp3');

            setTimeout(() => {
                setMonsterHit(false);
                setDamageNumber(null);
            }, 800);

            if (newHealth <= 0) {
                audioManager.playSFX('/assets/audio/sfx_victory.mp3');
                setTimeout(() => onVictory(), 1500);
            }
            msg = `🔥 Đã dùng ${spell.displayName}! Gây ${damage} sát thương!`;
        } else if (spell.combatType === 'HEAL') {
            const heal = spell.combatValue || 20;
            const newHealth = Math.min(100, combat.playerHealth + heal);
            updatePlayerHealth(newHealth);
            audioManager.playSFX('/assets/audio/sfx_heal.mp3');
            msg = `💚 Đã dùng ${spell.displayName}! Hồi ${heal} HP!`;
        } else {
            msg = `✨ Đã dùng ${spell.displayName}! (Hiệu ứng chưa kích hoạt)`;
        }

        showSparky(msg);
    };

    // Lấy ID Dungeon hiện tại để lọc câu hỏi
    const { currentDungeonId } = useGameStore();
    const dungeonId = currentDungeonId || 'dungeon_1';

    // Lấy thông tin quái vật (Sprite, Stats...)
    const monsterData = MonsterSpawner.getMonsterData(monsterId);

    // Lấy danh sách câu hỏi phù hợp với độ khó của quái
    const appropriateQuestions = getQuestionsForMonster(monsterId, dungeonId);

    /**
     * Lấy đường dẫn ảnh quái vật an toàn (Safe Sprite Retrieval)
     * Fallback về ảnh mặc định nếu không tìm thấy.
     */
    const getMonsterImage = () => {
        if (monsterData && monsterData.sprite) {
            return monsterData.sprite.idle;
        }
        // Fallback cho ID cũ (Backward Compatibility)
        if (monsterId === 'chapter1_boss' || monsterId === 'initialization_golem') {
            return "/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 4 (AN) Initialization Golem (Boss)/Initialization Golem (Idle).png";
        }
        return "/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 1 (R) Logic Slime (Quái Thường)/Logic Slime (Idle).png";
    };

    /**
     * Tải câu hỏi ngẫu nhiên (Load Random Question)
     * Reset State UI mỗi khi đổi câu hỏi.
     */
    const loadRandomQuestion = () => {
        if (appropriateQuestions.length === 0) {
            console.error('Không tìm thấy câu hỏi phù hợp cho quái vật này!');
            return;
        }
        const randomIndex = Math.floor(Math.random() * appropriateQuestions.length);
        setCurrentQuestion(appropriateQuestions[randomIndex]);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsCorrect(false);
    };

    // Initialize: Load câu hỏi đầu tiên khi Mount
    useEffect(() => {
        loadRandomQuestion();
    }, []);

    if (!currentQuestion) {
        return <div>Đang tải dữ liệu chiến đấu...</div>;
    }

    /**
     * Xử lý khi người chơi trả lời (Handle Answer)
     * Đây là hàm trung tâm điều phối logic thưởng phạt (Game Loop Core).
     */
    const handleAnswer = (correct: boolean, answerData?: any) => {
        setIsCorrect(correct);
        setShowFeedback(true);
        recordAnswer(correct); // Ghi Statistic

        // Log for Debugging
        if (answerData) {
            console.log('Player answer:', answerData, 'Correct:', correct);
        }

        if (correct) {
            // === LOGIC TẤN CÔNG (ATTACK) ===
            const damage = currentQuestion.points; // Sát thương = Điểm câu hỏi
            const newHealth = Math.max(0, combat.monsterHealth - damage);
            updateMonsterHealth(newHealth);

            // Trigger Animation & Floating Text
            setMonsterHit(true);
            setDamageNumber(damage);
            setTimeout(() => {
                setMonsterHit(false);
                setDamageNumber(null);
            }, 800);

            // Trao thưởng tài nguyên ngay lập tức (Instant Gratification)
            const woodReward = Math.floor(currentQuestion.points / 5);
            const oPointsReward = currentQuestion.points;
            addResource(ResourceType.DATA_WOOD, woodReward);
            addResource(ResourceType.O_POINTS, oPointsReward);

            // Kiểm tra Phase của Boss (Boss Mechanics)
            if (newHealth > 0 && newHealth <= 50 && combat.currentPhase === 1) {
                // TODO: Set explicit phase in store if variable exists, for now just warn
                useGameStore.getState().showSparky("⚠️ CẢNH BÁO: Trùm Nổi Giận! Sát thương nhận vào sẽ tăng gấp đôi!");
                // Future: setPhase(2) via action
            } else {
                showSparky(`💡 Chính xác! Gây ${damage} sát thương! Nhận +${woodReward} Gỗ, +${oPointsReward} O-Points!`);
            }

            // Kiểm tra chiến thắng (Victory Check)
            if (newHealth <= 0) {
                setTimeout(() => onVictory(), 2000);
            }
        } else {
            // === LOGIC PHÒNG THỦ THẤT BẠI (DEFENSE FAIL) ===
            // Dynamic Damage Scaling
            let baseDamage = 10;
            if (dungeonId === 'dungeon_2') baseDamage = 15;
            if (dungeonId === 'dungeon_3') baseDamage = 20;

            // Critical Phase Penalty
            if (combat.monsterHealth <= 50) baseDamage *= 1.5;

            const damageTaken = Math.floor(baseDamage);
            const newHealth = Math.max(0, combat.playerHealth - damageTaken);
            updatePlayerHealth(newHealth);

            // Hiện gợi ý từ Sparky + Thông báo trừ máu
            const hint = sparky.provideHint(
                currentQuestion.type,
                currentQuestion.topic,
                0, // Dummy Wrong Answer
                0  // Dummy Correct Answer
            );
            showSparky(`❌ Sai rồi! Bạn bị trừ ${damageTaken} HP.\n${hint.message}`);
        }
    };

    /**
     * Lấy giải thích đáp án (Answer Explanation)
     */
    const getExplanation = (question: Question): string => {
        if (question.type === QuestionType.PROGRAMMING) {
            return 'Xem gợi ý và test cases để biết thêm chi tiết.';
        }
        return (question as MultipleChoiceQuestion | FillBlankQuestion | MatchingQuestion).explanation || 'Không có giải thích chi tiết.';
    };

    /**
     * Sử dụng Gợi ý (Hint System)
     */
    const handleUseHint = () => {
        useHint(); // Trừ lượt hint trong Store
        const explanation = getExplanation(currentQuestion);
        showSparky(`💡 Gợi ý: ${explanation}`);
    };

    const handleNext = () => {
        loadRandomQuestion();
    };

    /**
     * Render UI theo loại câu hỏi (Polymorphic Rendering)
     */
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
                        <h3>🔨 Thử thách Lập trình</h3>
                        <p>Các bài tập lập trình sẽ mở Bảng Cổ Ngữ (Runic Console)!</p>
                        <button className="btn-open-console" onClick={() => showSparky('Hãy mở Bảng Cổ Ngữ để làm bài!')}>
                            Mở Bảng Cổ Ngữ
                        </button>
                    </div>
                );

            default:
                return <div>Loại câu hỏi không hỗ trợ</div>;
        }
    };

    /**
     * Render Trắc Nghiệm (MCQ) - Inline Component
     */
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

                {/* Answer Options Grid */}
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

                {/* Action Buttons */}
                <div className="battle-actions">
                    <button
                        className="btn-hint"
                        onClick={handleUseHint}
                        disabled={showFeedback}
                    >
                        💡 Gợi ý (Đã dùng: {combat.hintsUsed})
                    </button>

                    {!showFeedback ? (
                        <button
                            className="btn-submit"
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null}
                        >
                            ⚔️ Tấn Công!
                        </button>
                    ) : (
                        <button
                            className="btn-next"
                            onClick={handleNext}
                        >
                            ➡️ Câu Tiếp Theo
                        </button>
                    )}
                </div>

                {/* Feedback Toast Animation */}
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
                                    <p>Chính xác! Quái vật chịu sát thương!</p>
                                </div>
                            ) : (
                                <div className="feedback-content">
                                    <span className="feedback-icon">❌</span>
                                    <p>Sai rồi. Đáp án đúng là: {mcqQuestion.options[mcqQuestion.correctAnswer]}</p>
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
            {/* === KHU VỰC QUÁI VẬT (MONSTER SECTION) === */}
            <div className="monster-section">
                <motion.div
                    className="monster-sprite"
                    animate={monsterHit ? {
                        x: [-5, 5, -5, 5, 0], // Shake animation
                        scale: [1, 0.95, 1]
                    } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <img
                        src={getMonsterImage()}
                        alt={monsterId}
                        style={{ maxWidth: '300px', height: 'auto' }}
                    />

                    {/* Floating Damage Number */}
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

                {/* Monster Health Bar */}
                <div className="monster-health-bar">
                    <div
                        className="health-fill monster-health"
                        style={{ width: `${combat.monsterHealth}%` }}
                    />
                    <span className="health-text">{combat.monsterHealth} / 100</span>
                </div>
            </div>

            {/* === KHU VỰC CÂU HỎI (QUESTION PANEL) === */}
            <div className="question-panel">
                <div className="question-header">
                    <span className="question-topic">📚 {currentQuestion.topic}</span>
                    <span className="question-bloom">
                        {currentQuestion.type} • {currentQuestion.bloomLevel} • {currentQuestion.points} điểm
                    </span>
                </div>

                {/* Render nội dung câu hỏi dynamic */}
                {renderQuestion()}
            </div>

            {/* === THANH MÁU BẠN (PLAYER STATUS) === */}
            <div className="player-health-bar">
                <span>HP Của Bạn:</span>
                <div
                    className="health-fill player-health"
                    style={{ width: `${combat.playerHealth}%` }}
                />
                <span className="health-text">{combat.playerHealth} / 100</span>
            </div>

            {/* === THANH KỸ NĂNG (SPELL BAR) === */}
            <div className="combat-spell-bar">
                {unlockedSpells.map((spellId) => {
                    const spell = Object.values(SPELLS).find(s => s.id === spellId);
                    if (!spell) return null;
                    const canCast = resources[ResourceType.O_POINTS] >= spell.manaCost;

                    return (
                        <button
                            key={spellId}
                            className={`btn-spell ${!canCast ? 'disabled' : ''}`}
                            onClick={() => handleCastSpell(spell)}
                            disabled={!canCast || showFeedback}
                            title={`${spell.displayName}: ${spell.description} (${spell.manaCost} O-Points)`}
                        >
                            <img src={spell.icon} alt={spell.name} />
                            <span className="spell-cost">{spell.manaCost} OP</span>
                        </button>
                    );
                })}
                {unlockedSpells.length === 0 && (
                    <div className="no-spells-hint">
                        <small>Chưa học phép thuật nào. Hãy đến Logic Farm!</small>
                    </div>
                )}
            </div>
        </div >
    );
};
