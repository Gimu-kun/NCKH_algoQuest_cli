import React, { useState } from 'react';

export interface QuizQuestion {
    id: string;
    title: string;
    titleVi: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface Props {
    quiz: QuizQuestion;
    onNext?: () => void;
    onPrevious?: () => void;
}

export const QuizRunner: React.FC<Props> = ({ quiz, onNext, onPrevious }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleOptionSelect = (option: string) => {
        if (isSubmitted) return;
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setSelectedOption(null);
        setIsSubmitted(false);
    };

    const isCorrect = selectedOption === quiz.correctAnswer;
    const difficultyVi = quiz.difficulty === 'easy'
        ? 'Dễ'
        : quiz.difficulty === 'medium'
            ? 'Trung bình'
            : 'Khó';

    return (
        <div className="quiz-runner" style={{
            background: '#11111b', padding: '24px', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)', color: '#cdd6f4'
        }}>
            {/* Header */}
            <div className="quiz-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, color: '#f5c2e7' }}>{quiz.titleVi}</h3>
                <span style={{
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                    background: quiz.difficulty === 'easy' ? 'rgba(74, 222, 128, 0.2)' : quiz.difficulty === 'medium' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                    color: quiz.difficulty === 'easy' ? '#4ade80' : quiz.difficulty === 'medium' ? '#fbbf24' : '#f87171'
                }}>
                    {difficultyVi}
                </span>
            </div>

            {/* Question */}
            <p className="quiz-question" style={{ fontSize: '1.1rem', marginBottom: '24px' }}>
                {quiz.description}
            </p>

            {/* Options */}
            <div className="quiz-options" style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                {quiz.options.map((option, idx) => {
                    let className = 'quiz-option';
                    let style: React.CSSProperties = {
                        padding: '16px', borderRadius: '8px', cursor: 'pointer',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px'
                    };

                    if (selectedOption === option) {
                        style.background = 'rgba(99, 102, 241, 0.2)';
                        style.borderColor = '#6366f1';
                    }

                    if (isSubmitted) {
                        if (option === quiz.correctAnswer) {
                            style.background = 'rgba(74, 222, 128, 0.2)';
                            style.borderColor = '#4ade80';
                        } else if (selectedOption === option && option !== quiz.correctAnswer) {
                            style.background = 'rgba(248, 113, 113, 0.2)';
                            style.borderColor = '#f87171';
                        }
                    }

                    return (
                        <div
                            key={idx}
                            className={className}
                            style={style}
                            onClick={() => handleOptionSelect(option)}
                        >
                            <div className="option-marker" style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                border: '2px solid rgba(255,255,255,0.3)',
                                background: selectedOption === option ? '#6366f1' : 'transparent',
                                flexShrink: 0
                            }}></div>
                            {option}
                        </div>
                    );
                })}
            </div>

            {/* Feedback & explanation */}
            {isSubmitted && (
                <div className="quiz-feedback" style={{
                    padding: '16px', borderRadius: '8px', marginBottom: '24px',
                    background: isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                    border: `1px solid ${isCorrect ? '#4ade80' : '#f87171'}`
                }}>
                    <strong style={{ color: isCorrect ? '#4ade80' : '#f87171', display: 'block', marginBottom: '8px' }}>
                        {isCorrect ? '🎉 Chính xác!' : '❌ Chưa đúng!'}
                    </strong>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{quiz.explanation}</p>
                </div>
            )}

            {/* Actions */}
            <div className="quiz-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="nav-group">
                    {onPrevious && <button onClick={onPrevious} style={navBtnStyle}>← Trước</button>}
                    {onNext && <button onClick={onNext} style={navBtnStyle}>Sau →</button>}
                </div>

                {!isSubmitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        style={{
                            padding: '10px 24px', borderRadius: '8px', border: 'none',
                            background: selectedOption ? '#6366f1' : '#313244',
                            color: selectedOption ? 'white' : '#6c7086',
                            cursor: selectedOption ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold'
                        }}
                    >
                        Kiểm tra
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        style={{
                            padding: '10px 24px', borderRadius: '8px', border: 'none',
                            background: '#313244', color: 'white', cursor: 'pointer'
                        }}
                    >
                        Làm lại
                    </button>
                )}
            </div>
        </div>
    );
};

const navBtnStyle: React.CSSProperties = {
    padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent', color: '#a6adc8', cursor: 'pointer', marginRight: '10px'
};
