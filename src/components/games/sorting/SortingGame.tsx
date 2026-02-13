import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './SortingGame.css';

// ============================================================================
// TYPES
// ============================================================================

export interface SortingGameProgress {
    array: number[];
    swaps: number;
    completed: boolean;
    finishedAt: number | null;
}

export interface SortingGameProps {
    size?: number;
    maxValue?: number;
    startedAt?: number;
    disabled?: boolean;
    onProgress?: (progress: SortingGameProgress) => void;
    onComplete?: (result: { swaps: number, timeMs: number }) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SortingGame: React.FC<SortingGameProps> = ({
    size = 10,
    maxValue = 50,
    startedAt,
    disabled = false,
    onProgress,
    onComplete
}) => {
    // ────────────────────────────────────────────────────────────────────────
    // STATE
    // ────────────────────────────────────────────────────────────────────────

    const [array, setArray] = useState<number[]>([]);
    const [swaps, setSwaps] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    // ────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ────────────────────────────────────────────────────────────────────────

    /** Initialize Game */
    useEffect(() => {
        reset();
    }, [size, maxValue]);

    /** Check Completion */
    useEffect(() => {
        if (array.length === 0) return;

        // Simple check if array is sorted ascending
        const isSorted = array.every((v, i, a) => !i || a[i - 1] <= v);

        if (isSorted && !completed) {
            setCompleted(true);
            if (onComplete && startedAt) {
                onComplete({
                    swaps,
                    timeMs: Date.now() - startedAt
                });
            }
        }
    }, [array, swaps, completed, onComplete, startedAt]);

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
                array,
                swaps,
                completed,
                finishedAt: completed ? (startedAt ? startedAt + elapsed : Date.now()) : null
            });
        }
    }, [array, swaps, completed, elapsed, onProgress, startedAt]);

    // ────────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ────────────────────────────────────────────────────────────────────────

    const reset = useCallback(() => {
        const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * maxValue) + 1);
        setArray(newArr);
        setSwaps(0);
        setSelectedIdx(null);
        setCompleted(false);
        setElapsed(0);
    }, [size, maxValue]);

    const handleBarClick = (idx: number) => {
        if (disabled || completed) return;

        if (selectedIdx === null) {
            // Select first
            setSelectedIdx(idx);
        } else if (selectedIdx === idx) {
            // Deselect
            setSelectedIdx(null);
        } else {
            // Swap
            const newArr = [...array];
            [newArr[selectedIdx], newArr[idx]] = [newArr[idx], newArr[selectedIdx]];
            setArray(newArr);
            setSwaps(s => s + 1);
            setSelectedIdx(null);
        }
    };

    // ────────────────────────────────────────────────────────────────────────
    // RENDER HELPERS
    // ────────────────────────────────────────────────────────────────────────

    const formatTime = (ms: number) => {
        const secs = Math.floor(ms / 1000);
        return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
    };

    return (
        <div className="sorting-game">
            <div className="game-header">
                <div className="game-stats">
                    <div className="stat-item">
                        <i className="fi fi-rr-arrows-repeat"></i>
                        <span>Hoán đổi: {swaps}</span>
                    </div>
                    <div className="stat-item">
                        <i className="fi fi-rr-clock"></i>
                        <span>{formatTime(elapsed)}</span>
                    </div>
                </div>

                <button
                    className="btn-reset"
                    onClick={reset}
                    disabled={disabled}
                >
                    <i className="fi fi-rr-refresh"></i>
                    Reset
                </button>
            </div>

            <div className={`bars-container ${completed ? 'completed' : ''}`}>
                {array.map((value, idx) => (
                    <motion.div
                        key={idx}
                        className={`bar ${selectedIdx === idx ? 'selected' : ''}`}
                        style={{
                            height: `${(value / maxValue) * 100}%`,
                            width: `${100 / size}%`
                        }}
                        onClick={() => handleBarClick(idx)}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <span className="bar-value">{value}</span>
                    </motion.div>
                ))}
            </div>

            <div className="game-footer">
                {completed ? (
                    <div className="success-msg">
                        <i className="fi fi-rr-check-circle"></i>
                        Đã sắp xếp xong!
                    </div>
                ) : (
                    <div className="intro-msg">
                        <i className="fi fi-rr-info"></i>
                        Click 2 cột để hoán đổi vị trí sao cho tăng dần
                    </div>
                )}
            </div>
        </div>
    );
};
