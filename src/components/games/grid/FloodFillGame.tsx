/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FLOOD FILL GAME - Trò chơi chiếm vùng
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ (Description):
 * Turn-based game: mỗi lượt fill từ vị trí hiện tại.
 * Ai fill nhiều ô hơn khi grid đầy thắng.
 *
 * THUẬT TOÁN (Algorithm):
 * - Flood Fill: BFS/DFS từ vị trí click
 * - Score = tổng số ô đã fill
 *
 * @component FloodFillGame
 * @category Games/Grid
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Grid, Cell } from './gridEngine';
import {
    CellType,
    createEmptyGrid,
    floodFill,
    copyGrid,
} from './gridEngine';
import './GridGame.css';

// ============================================================================
// TYPES
// ============================================================================

export interface FloodFillGameProps {
    rows?: number;
    cols?: number;
    playerCount?: number;
    currentPlayer?: number; // For multiplayer sync
    startedAt?: number;
    disabled?: boolean;
    onProgress?: (progress: FloodFillProgress) => void;
    onComplete?: (result: FloodFillResult) => void;
}

export interface FloodFillProgress {
    scores: number[];
    currentPlayer: number;
    grid: Grid;
    completed: boolean;
}

export interface FloodFillResult {
    scores: number[];
    winner: number;
    timeMs: number;
}

// ============================================================================
// HELPER: Create grid with obstacles
// ============================================================================

function createFloodFillGrid(rows: number, cols: number): Grid {
    const grid = createEmptyGrid(rows, cols, CellType.EMPTY);

    // Add random obstacles (20% walls)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() < 0.1) {
                grid[r][c].type = CellType.WALL;
            }
        }
    }

    return grid;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const FloodFillGame: React.FC<FloodFillGameProps> = ({
    rows = 12,
    cols = 16,
    playerCount = 2,
    currentPlayer: externalCurrentPlayer,
    startedAt,
    disabled = false,
    onProgress,
    onComplete,
}) => {
    // ──────────────────────────────────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────────────────────────────────

    const [grid, setGrid] = useState<Grid>(() => createFloodFillGrid(rows, cols));
    const [scores, setScores] = useState<number[]>(() =>
        Array(playerCount).fill(0)
    );
    const [currentPlayer, setCurrentPlayer] = useState(
        externalCurrentPlayer ?? 0
    );
    const [elapsed, setElapsed] = useState(0);

    // ──────────────────────────────────────────────────────────────────────────
    // DERIVED STATE
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Kiểm tra grid đã full chưa
     */
    const completed = useMemo(() => {
        for (const row of grid) {
            for (const cell of row) {
                if (cell.type === CellType.EMPTY && cell.color === undefined) {
                    return false;
                }
            }
        }
        return true;
    }, [grid]);

    /**
     * Winner = player với score cao nhất
     */
    const winner = useMemo(() => {
        if (!completed) return -1;
        let maxScore = -1;
        let winnerId = 0;
        scores.forEach((s, i) => {
            if (s > maxScore) {
                maxScore = s;
                winnerId = i;
            }
        });
        return winnerId;
    }, [completed, scores]);

    // ──────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ──────────────────────────────────────────────────────────────────────────

    /** Timer */
    useEffect(() => {
        if (!startedAt || completed || disabled) return;
        const interval = setInterval(() => {
            setElapsed(Date.now() - startedAt);
        }, 100);
        return () => clearInterval(interval);
    }, [startedAt, completed, disabled]);

    /** Progress callback */
    useEffect(() => {
        if (onProgress) {
            onProgress({ scores, currentPlayer, grid, completed });
        }
    }, [scores, currentPlayer, grid, completed, onProgress]);

    /** Complete callback */
    useEffect(() => {
        if (completed && onComplete && startedAt) {
            onComplete({
                scores,
                winner,
                timeMs: Date.now() - startedAt,
            });
        }
    }, [completed, onComplete, scores, winner, startedAt]);

    // ──────────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * handleCellClick - Click để fill
     */
    const handleCellClick = useCallback(
        (row: number, col: number) => {
            if (disabled || completed) return;

            const cell = grid[row][col];

            // Cannot fill wall or already colored cell
            if (cell.type === CellType.WALL) return;
            if (cell.color !== undefined) return;

            // Perform flood fill
            const newGrid = copyGrid(grid);
            const result = floodFill(newGrid, { row, col }, currentPlayer);

            if (result.count === 0) return;

            // Update state
            setGrid(newGrid);
            setScores((prev) => {
                const newScores = [...prev];
                newScores[currentPlayer] += result.count;
                return newScores;
            });

            // Next player's turn
            setCurrentPlayer((p) => (p + 1) % playerCount);
        },
        [grid, currentPlayer, playerCount, disabled, completed]
    );

    /**
     * reset - Tạo game mới
     */
    const reset = useCallback(() => {
        setGrid(createFloodFillGrid(rows, cols));
        setScores(Array(playerCount).fill(0));
        setCurrentPlayer(0);
        setElapsed(0);
    }, [rows, cols, playerCount]);

    // ──────────────────────────────────────────────────────────────────────────
    // RENDER HELPERS
    // ──────────────────────────────────────────────────────────────────────────

    const formatTime = (ms: number) => {
        const secs = Math.floor(ms / 1000);
        const mins = Math.floor(secs / 60);
        return `${mins}:${(secs % 60).toString().padStart(2, '0')}`;
    };

    const getPlayerColor = (playerId: number): string => {
        const colors = [
            'rgba(52, 152, 219, 0.7)', // Blue
            'rgba(231, 76, 60, 0.7)', // Red
            'rgba(243, 156, 18, 0.7)', // Orange
            'rgba(155, 89, 182, 0.7)', // Purple
        ];
        return colors[playerId % colors.length];
    };

    const getCellStyle = (cell: Cell): React.CSSProperties => {
        if (cell.type === CellType.WALL) {
            return {};
        }
        if (cell.color !== undefined) {
            return {
                background: getPlayerColor(cell.color),
                borderColor: getPlayerColor(cell.color).replace('0.7', '0.9'),
            };
        }
        return {};
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
                        <i className="fi fi-rr-fill-bucket"></i>
                        Flood Fill Battle
                    </h2>
                    <div className="grid-sub">
                        <span>
                            <i className="fi fi-rr-clock"></i>
                            {formatTime(elapsed)}
                        </span>
                        <span>
                            <i className="fi fi-rr-users"></i>
                            {playerCount} người chơi
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

            {/* Scoreboard */}
            <div
                style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                {scores.map((score, i) => (
                    <div
                        key={i}
                        className="grid-score"
                        style={{
                            background:
                                currentPlayer === i
                                    ? getPlayerColor(i).replace('0.7', '0.25')
                                    : undefined,
                            borderColor:
                                currentPlayer === i
                                    ? getPlayerColor(i).replace('0.7', '0.6')
                                    : undefined,
                        }}
                    >
                        <div
                            className="player-marker"
                            style={{ background: getPlayerColor(i) }}
                        />
                        <div className="grid-score-label">
                            Player {i + 1}
                            {currentPlayer === i && ' (lượt)'}
                        </div>
                        <div className="grid-score-value">{score}</div>
                    </div>
                ))}
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
                            className={`grid-cell ${cell.type === CellType.WALL ? 'wall' : 'empty'
                                }`}
                            style={getCellStyle(cell)}
                            whileHover={{
                                scale: cell.color === undefined ? 1.1 : 1,
                            }}
                            onClick={() => handleCellClick(r, c)}
                        />
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="grid-footer">
                <div className="grid-rule">
                    <i className="fi fi-rr-info"></i>
                    Click ô trống để fill. Ai fill nhiều ô hơn thắng!
                </div>

                <div className={`grid-status ${completed ? 'done' : ''}`}>
                    {completed ? (
                        <>
                            <i className="fi fi-rr-trophy"></i>
                            Player {winner + 1} thắng với {scores[winner]} ô!
                        </>
                    ) : (
                        <>
                            <div
                                className="player-marker"
                                style={{ background: getPlayerColor(currentPlayer) }}
                            />
                            Lượt của Player {currentPlayer + 1}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FloodFillGame;
