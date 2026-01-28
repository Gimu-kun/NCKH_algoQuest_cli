/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXERCISE RUNNER - Component để làm bài tập coding
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import './ExerciseRunner.css';

interface Exercise {
    id: string;
    title: string;
    titleVi: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    starterCode?: string;
    hints?: string[];
    solution?: string;
}

interface Props {
    exercise: Exercise;
    onSubmit?: (code: string) => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

export const ExerciseRunner: React.FC<Props> = ({
    exercise,
    onSubmit,
    onNext,
    onPrevious
}) => {
    const [code, setCode] = useState(exercise.starterCode || '');
    const [showHints, setShowHints] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [currentHint, setCurrentHint] = useState(0);

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return '#4ade80';
            case 'medium': return '#fbbf24';
            case 'hard': return '#f87171';
            default: return '#a0a0a0';
        }
    };

    const getDifficultyLabel = (diff: string) => {
        switch (diff) {
            case 'easy': return 'Dễ';
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            default: return diff;
        }
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(code);
        }
    };

    const handleShowNextHint = () => {
        if (exercise.hints && currentHint < exercise.hints.length) {
            setCurrentHint(currentHint + 1);
        }
    };

    const handleReset = () => {
        setCode(exercise.starterCode || '');
        setShowHints(false);
        setShowSolution(false);
        setCurrentHint(0);
    };

    return (
        <div className="exercise-runner">
            {/* Header */}
            <div className="exercise-header">
                <div className="exercise-info">
                    <h2>{exercise.titleVi}</h2>
                    <span className="exercise-id">{exercise.id}</span>
                </div>
                <span
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                >
                    {getDifficultyLabel(exercise.difficulty)}
                </span>
            </div>

            {/* Description */}
            <div className="exercise-description">
                <p>{exercise.description}</p>
            </div>

            {/* Code Editor */}
            <div className="code-editor-container">
                <div className="editor-header">
                    <span>Code Editor</span>
                    <div className="editor-actions">
                        <button className="reset-btn" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
                <textarea
                    className="code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    placeholder="// Viết code ở đây..."
                />
            </div>

            {/* Actions */}
            <div className="exercise-actions">
                <div className="action-group">
                    {exercise.hints && exercise.hints.length > 0 && (
                        <button
                            className="hint-btn"
                            onClick={() => {
                                setShowHints(true);
                                handleShowNextHint();
                            }}
                        >
                            💡 Gợi ý ({currentHint}/{exercise.hints.length})
                        </button>
                    )}
                    <button
                        className="solution-btn"
                        onClick={() => setShowSolution(!showSolution)}
                    >
                        {showSolution ? '🙈 Ẩn đáp án' : '👁️ Xem đáp án'}
                    </button>
                </div>
                <button className="submit-btn" onClick={handleSubmit}>
                    ▶ Chạy code
                </button>
            </div>

            {/* Hints */}
            {showHints && exercise.hints && currentHint > 0 && (
                <div className="hints-panel">
                    <h4>💡 Gợi ý</h4>
                    <ul>
                        {exercise.hints.slice(0, currentHint).map((hint, i) => (
                            <li key={i}>{hint}</li>
                        ))}
                    </ul>
                    {currentHint < exercise.hints.length && (
                        <button className="more-hints-btn" onClick={handleShowNextHint}>
                            Xem thêm gợi ý
                        </button>
                    )}
                </div>
            )}

            {/* Solution */}
            {showSolution && exercise.solution && (
                <div className="solution-panel">
                    <h4>✅ Đáp án</h4>
                    <pre>
                        <code>{exercise.solution}</code>
                    </pre>
                </div>
            )}

            {/* Navigation */}
            <div className="exercise-navigation">
                {onPrevious && (
                    <button className="nav-btn prev" onClick={onPrevious}>
                        ← Bài trước
                    </button>
                )}
                {onNext && (
                    <button className="nav-btn next" onClick={onNext}>
                        Bài tiếp →
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExerciseRunner;
