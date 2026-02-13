
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './SearchGame.css';

// ============================================================================
// TYPES
// ============================================================================

export interface SearchGameProgress {
    guesses: number;
    range: { low: number, high: number };
    completed: boolean;
    finishedAt: number | null;
}

export interface SearchGameProps {
    min?: number;
    max?: number;
    startedAt?: number;
    disabled?: boolean;
    onProgress?: (progress: SearchGameProgress) => void;
    onComplete?: (result: { guesses: number, timeMs: number }) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BinarySearchGame: React.FC<SearchGameProps> = ({
    min = 1,
    max = 100,
    startedAt,
    disabled = false,
    onProgress,
    onComplete
}) => {
    // ────────────────────────────────────────────────────────────────────────
    // STATE
    // ────────────────────────────────────────────────────────────────────────

    const [target, setTarget] = useState<number>(() =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
    const [low, setLow] = useState(min);
    const [high, setHigh] = useState(max);
    const [guessCount, setGuessCount] = useState(0);
    const [lastGuess, setLastGuess] = useState<number | null>(null);
    const [status, setStatus] = useState<string>('Hãy đoán số!');
    const [completed, setCompleted] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    // ────────────────────────────────────────────────────────────────────────
    // LOGIC
    // ────────────────────────────────────────────────────────────────────────

    const handleGuess = (num: number) => {
        if (disabled || completed) return;
        if (num < low || num > high) return; // Out of range

        setGuessCount(c => c + 1);
        setLastGuess(num);

        if (num === target) {
            setCompleted(true);
            setStatus('Chính xác! 🎉');
            const finalTime = startedAt ? Date.now() - startedAt : 0;
            if (onComplete) {
                onComplete({ guesses: guessCount + 1, timeMs: finalTime });
            }
        } else if (num < target) {
            setLow(num + 1);
            setStatus(`Lớn hơn ${num} 🔼`);
        } else {
            setHigh(num - 1);
            setStatus(`Nhỏ hơn ${num} 🔽`);
        }
    };

    const reset = useCallback(() => {
        const newTarget = Math.floor(Math.random() * (max - min + 1)) + min;
        setTarget(newTarget);
        setLow(min);
        setHigh(max);
        setGuessCount(0);
        setLastGuess(null);
        setStatus('Hãy đoán số!');
        setCompleted(false);
        setElapsed(0);
    }, [min, max]);

    // ────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ────────────────────────────────────────────────────────────────────────

    /** Init */
    useEffect(() => {
        reset();
    }, [reset]);

    /** Timer */
    useEffect(() => {
        if (!startedAt || completed || disabled) return;
        const interval = setInterval(() => {
            setElapsed(Date.now() - startedAt);
        }, 100);
        return () => clearInterval(interval);
    }, [startedAt, completed, disabled]);

    /** Progress Sync */
    useEffect(() => {
        if (onProgress) {
            onProgress({
                guesses: guessCount,
                range: { low, high },
                completed,
                finishedAt: completed ? (startedAt ? startedAt + elapsed : Date.now()) : null
            });
        }
    }, [guessCount, low, high, completed, elapsed, onProgress, startedAt]);


    // ────────────────────────────────────────────────────────────────────────
    // RENDER HELPERS
    // ────────────────────────────────────────────────────────────────────────

    // Optimal moves calculation (log2)
    const optimalMoves = Math.ceil(Math.log2(max - min + 1));

    // Render grid numbers
    const renderGrid = () => {
        const numbers = [];
        // Only render numbers from current min to max for performance? 
        // Or render all but apply styles.
        // For range 1-100, rendering 100 items is fine.

        for (let i = min; i <= max; i++) {
            const isOutOfRange = i < low || i > high;
            const isTarget = completed && i === target;
            const isLastGuess = i === lastGuess;

            numbers.push(
                <motion.button
                    key={i}
                    className={`number-btn 
                        ${isOutOfRange ? 'disabled' : ''} 
                        ${isTarget ? 'target' : ''}
                        ${isLastGuess ? 'last-guess' : ''}
                    `}
                    disabled={isOutOfRange || disabled || completed}
                    onClick={() => handleGuess(i)}
                    whileHover={!isOutOfRange && !disabled ? { scale: 1.1 } : {}}
                    whileTap={!isOutOfRange && !disabled ? { scale: 0.95 } : {}}
                >
                    {i}
                </motion.button>
            );
        }
        return numbers;
    };

    return (
        <div className="search-game">
            <div className="game-header">
                <div className="game-stats">
                    <div className="stat-item">
                        <i className="fi fi-rr-expand-arrows"></i>
                        <span>Phạm vi: [{low}, {high}]</span>
                    </div>
                    <div className="stat-item">
                        <i className="fi fi-rr-arrows-repeat"></i>
                        <span>Đoán: {guessCount} / {optimalMoves} (Tối ưu)</span>
                    </div>
                </div>
                <div className="game-status">
                    {status}
                </div>
                <button className="game-btn-reset" onClick={reset} disabled={disabled}>
                    <i className="fi fi-rr-refresh"></i> Reset
                </button>
            </div>

            <div className="numbers-grid">
                {renderGrid()}
            </div>

            <div className="game-footer">
                <div className="intro-msg">
                    <i className="fi fi-rr-info"></i>
                    Thuật toán <strong>Binary Search</strong> có thể tìm ra số bất kỳ trong 100 số chỉ với tối đa {optimalMoves} lần đoán!
                </div>
            </div>
        </div>
    );
};
