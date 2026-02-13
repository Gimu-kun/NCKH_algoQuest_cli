/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ISLAND GAME - Trò chơi đếm đảo
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ (Description):
 * Đếm số islands (connected components) trong grid.
 * Multiplayer: ai đếm đúng nhanh hơn thắng.
 *
 * THUẬT TOÁN (Algorithm):
 * - DFS để đếm connected components của LAND cells
 * - Click island → highlight bằng DFS
 *
 * @component IslandGame
 * @category Games/Grid
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Grid } from './gridEngine';
import {
    CellType,
    createRandomIslandGrid,
    countIslands,
    dfs,
} from './gridEngine';
import './GridGame.css';

// ============================================================================
// TYPES
// ============================================================================

export interface IslandGameProps {
    rows?: number;
    cols?: number;
    landRatio?: number;
    startedAt?: number;
    disabled?: boolean;
    onProgress?: (progress: IslandProgress) => void;
    onComplete?: (result: IslandResult) => void;
}

export interface IslandProgress {
    markedIslands: number;
    answer: number | null;
    submitted: boolean;
    correct: boolean;
    timeMs: number;
}

export interface IslandResult {
    answer: number;
    correctAnswer: number;
    correct: boolean;
    timeMs: number;
    markedIslands: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const IslandGame: React.FC<IslandGameProps> = ({
    rows = 10,
    cols = 14,
    landRatio = 0.35,
    startedAt,
    disabled = false,
    onProgress,
    onComplete,
}) => {
    // ──────────────────────────────────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────────────────────────────────

    const [grid, setGrid] = useState<Grid>(() =>
        createRandomIslandGrid(rows, cols, landRatio)
    );
    const [markedCells, setMarkedCells] = useState<Set<string>>(new Set());
    const [markedIslands, setMarkedIslands] = useState<number>(0);
    const [answer, setAnswer] = useState<string>('');
    const [submitted, setSubmitted] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    // ──────────────────────────────────────────────────────────────────────────
    // DERIVED STATE
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Đáp án đúng - memorized để không thay đổi khi state khác thay đổi
     */
    const correctAnswer = useMemo(() => {
        return countIslands(grid).count;
    }, [grid]);

    /**
     * Kiểm tra đáp án
     */
    const isCorrect = useMemo(() => {
        if (!submitted) return false;
        return parseInt(answer, 10) === correctAnswer;
    }, [submitted, answer, correctAnswer]);

    // ──────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ──────────────────────────────────────────────────────────────────────────

    /** Timer */
    useEffect(() => {
        if (!startedAt || submitted || disabled) return;
        const interval = setInterval(() => {
            setElapsed(Date.now() - startedAt);
        }, 100);
        return () => clearInterval(interval);
    }, [startedAt, submitted, disabled]);

    /** Progress callback */
    useEffect(() => {
        if (onProgress) {
            onProgress({
                markedIslands,
                answer: answer ? parseInt(answer, 10) : null,
                submitted,
                correct: isCorrect,
                timeMs: elapsed,
            });
        }
    }, [markedIslands, answer, submitted, isCorrect, elapsed, onProgress]);

    /** Complete callback */
    useEffect(() => {
        if (submitted && onComplete && startedAt) {
            onComplete({
                answer: parseInt(answer, 10),
                correctAnswer,
                correct: isCorrect,
                timeMs: Date.now() - startedAt,
                markedIslands,
            });
        }
    }, [
        submitted,
        onComplete,
        answer,
        correctAnswer,
        isCorrect,
        markedIslands,
        startedAt,
    ]);

    // ──────────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * handleCellClick - Click để mark island
     */
    const handleCellClick = useCallback(
        (row: number, col: number) => {
            if (disabled || submitted) return;

            const cell = grid[row][col];
            if (cell.type !== CellType.LAND) return;

            const key = `${row},${col}`;

            // If already marked, do nothing
            if (markedCells.has(key)) return;

            // DFS to mark entire island
            const visited = new Set<string>(markedCells);
            const islandCells = dfs(grid, { row, col }, visited);

            // Check if this is truly a new island
            // (Not connected to already marked cells)
            const wasNew = !markedCells.has(key);

            if (wasNew && islandCells.length > 0) {
                setMarkedCells(visited);
                setMarkedIslands((m) => m + 1);
            }
        },
        [grid, markedCells, disabled, submitted]
    );

    /**
     * handleSubmit - Submit answer
     */
    const handleSubmit = useCallback(() => {
        if (!answer || submitted) return;
        setSubmitted(true);
        setElapsed(startedAt ? Date.now() - startedAt : 0);
    }, [answer, submitted, startedAt]);

    /**
     * reset - Tạo game mới
     */
    const reset = useCallback(() => {
        setGrid(createRandomIslandGrid(rows, cols, landRatio));
        setMarkedCells(new Set());
        setMarkedIslands(0);
        setAnswer('');
        setSubmitted(false);
        setElapsed(0);
    }, [rows, cols, landRatio]);

    // ──────────────────────────────────────────────────────────────────────────
    // RENDER HELPERS
    // ──────────────────────────────────────────────────────────────────────────

    const formatTime = (ms: number) => {
        const secs = Math.floor(ms / 1000);
        const mins = Math.floor(secs / 60);
        return `${mins}:${(secs % 60).toString().padStart(2, '0')}`;
    };

    const getCellClass = (row: number, col: number): string => {
        const cell = grid[row][col];
        const classes = ['grid-cell'];

        if (cell.type === CellType.WATER) {
            classes.push('water');
        } else if (cell.type === CellType.LAND) {
            classes.push('land');
            if (markedCells.has(`${row},${col}`)) {
                classes.push('visited');
            }
        }

        return classes.join(' ');
    };

    // ──────────────────────────────────────────────────────────────────────────
    // RENDER
    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className="grid-game">
            {/* Header */}
            <div className="grid-header">
                <div className="grid-title">
                    <h2>
                        <i className="fi fi-rr-island-tropical"></i>
                        Island Counter
                    </h2>
                    <div className="grid-sub">
                        <span>
                            <i className="fi fi-rr-clock"></i>
                            {formatTime(elapsed)}
                        </span>
                        <span>
                            <i className="fi fi-rr-layers"></i>
                            Đã đánh dấu: {markedIslands} đảo
                        </span>
                    </div>
                </div>

                <div className="grid-actions">
                    <button
                        className="grid-btn secondary"
                        onClick={reset}
                        disabled={disabled}
                        type="button"
                    >
                        <i className="fi fi-rr-refresh"></i>
                        Reset
                    </button>
                </div>
            </div>

            {/* Grid Board */}
            <div
                className="grid-board"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 28px)`,
                }}
            >
                {grid.map((row, r) =>
                    row.map((cell, c) => (
                        <motion.div
                            key={`${r}-${c}`}
                            className={getCellClass(r, c)}
                            whileHover={{
                                scale: cell.type === CellType.LAND ? 1.1 : 1,
                            }}
                            onClick={() => handleCellClick(r, c)}
                        />
                    ))
                )}
            </div>

            {/* Answer Form */}
            <div className="grid-footer">
                <div className="grid-rule">
                    <i className="fi fi-rr-info"></i>
                    Click vào đảo (xanh lá) để đếm. Nhập số đảo và submit!
                </div>

                <div className="grid-input-form">
                    <input
                        type="number"
                        className="grid-input"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="?"
                        disabled={submitted || disabled}
                        min={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit();
                        }}
                    />
                    <button
                        className="grid-btn"
                        onClick={handleSubmit}
                        disabled={!answer || submitted || disabled}
                        type="button"
                    >
                        <i className="fi fi-rr-check"></i>
                        Submit
                    </button>
                </div>

                <div className={`grid-status ${submitted ? 'done' : ''}`}>
                    {submitted ? (
                        isCorrect ? (
                            <>
                                <i className="fi fi-rr-check-circle"></i>
                                Chính xác! Có {correctAnswer} đảo
                            </>
                        ) : (
                            <>
                                <i className="fi fi-rr-cross-circle"></i>
                                Sai! Đáp án đúng là {correctAnswer}
                            </>
                        )
                    ) : (
                        <>
                            <i className="fi fi-rr-search"></i>
                            Đếm số đảo (nhóm ô xanh lá liên thông)
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IslandGame;
