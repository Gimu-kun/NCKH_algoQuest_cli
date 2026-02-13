/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MAZE GAME - Trò chơi thoát mê cung
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ (Description):
 * Game tìm đường thoát maze. Multiplayer: ai đến đích trước thắng.
 *
 * THUẬT TOÁN (Algorithms):
 * - Maze generation: Prim's algorithm
 * - Pathfinding hint: BFS (shortest path)
 *
 * GAMEPLAY:
 * 1. Maze ngẫu nhiên được tạo
 * 2. Mỗi player bắt đầu tại START (xanh lá)
 * 3. Di chuyển bằng arrow keys hoặc click
 * 4. Ai đến END (đỏ) trước thắng
 *
 * @component MazeGame
 * @category Games/Grid
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Grid, Position } from './gridEngine';
import {
    CellType,
    createRandomMaze,
    bfs,
    findCellByType,
    isValidMove,
} from './gridEngine';
import './GridGame.css';

// ============================================================================
// TYPES
// ============================================================================

export interface MazeGameProps {
    /** Số hàng của maze (nên lẻ, tối thiểu 11) */
    rows?: number;
    /** Số cột của maze (nên lẻ, tối thiểu 11) */
    cols?: number;
    /** Thời điểm bắt đầu game (timestamp) */
    startedAt?: number;
    /** Disable input (khi game kết thúc hoặc multiplayer sync) */
    disabled?: boolean;
    /** Callback khi có progress update */
    onProgress?: (progress: MazeProgress) => void;
    /** Callback khi hoàn thành */
    onComplete?: (result: MazeResult) => void;
}

export interface MazeProgress {
    position: Position;
    moves: number;
    completed: boolean;
    completedAt?: number;
}

export interface MazeResult {
    moves: number;
    timeMs: number;
    path: Position[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MazeGame: React.FC<MazeGameProps> = ({
    rows = 15,
    cols = 21,
    startedAt,
    disabled = false,
    onProgress,
    onComplete,
}) => {
    // ──────────────────────────────────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────────────────────────────────

    /** Grid state */
    const [grid, setGrid] = useState<Grid>(() => createRandomMaze(rows, cols));

    /** Player position */
    const [position, setPosition] = useState<Position>(() => {
        const start = findCellByType(grid, CellType.START);
        return start || { row: 1, col: 1 };
    });

    /** Move count */
    const [moves, setMoves] = useState(0);

    /** Path history for visualization */
    const [path, setPath] = useState<Position[]>([]);

    /** Hint path (BFS result) */
    const [hintPath, setHintPath] = useState<Position[] | null>(null);

    /** Timer */
    const [elapsed, setElapsed] = useState(0);

    // ──────────────────────────────────────────────────────────────────────────
    // DERIVED STATE
    // ──────────────────────────────────────────────────────────────────────────

    const endPos = useMemo(() => {
        return findCellByType(grid, CellType.END);
    }, [grid]);

    const completed = useMemo(() => {
        if (!endPos) return false;
        return position.row === endPos.row && position.col === endPos.col;
    }, [position, endPos]);

    // ──────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Timer effect
     */
    useEffect(() => {
        if (!startedAt || completed || disabled) return;

        const interval = setInterval(() => {
            setElapsed(Date.now() - startedAt);
        }, 100);

        return () => clearInterval(interval);
    }, [startedAt, completed, disabled]);

    /**
     * Progress callback effect
     */
    useEffect(() => {
        if (onProgress) {
            onProgress({
                position,
                moves,
                completed,
                completedAt: completed ? Date.now() : undefined,
            });
        }
    }, [position, moves, completed, onProgress]);

    /**
     * Complete callback effect
     */
    useEffect(() => {
        if (completed && onComplete && startedAt) {
            onComplete({
                moves,
                timeMs: Date.now() - startedAt,
                path,
            });
        }
    }, [completed, onComplete, moves, path, startedAt]);

    /**
     * Keyboard controls
     */
    useEffect(() => {
        if (disabled || completed) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            let dr = 0;
            let dc = 0;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    dr = -1;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    dr = 1;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    dc = -1;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    dc = 1;
                    break;
                default:
                    return;
            }

            e.preventDefault();
            movePlayer(dr, dc);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [disabled, completed, position, grid]);

    // ──────────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * movePlayer - Di chuyển player
     */
    const movePlayer = useCallback(
        (dr: number, dc: number) => {
            const newPos: Position = {
                row: position.row + dr,
                col: position.col + dc,
            };

            if (!isValidMove(grid, newPos)) return;

            setPosition(newPos);
            setMoves((m) => m + 1);
            setPath((p) => [...p, newPos]);
            setHintPath(null); // Clear hint after move
        },
        [position, grid]
    );

    /**
     * showHint - Hiện BFS shortest path
     */
    const showHint = useCallback(() => {
        if (!endPos) return;

        const result = bfs(grid, position, endPos);
        if (result.found) {
            setHintPath(result.path);
        }
    }, [grid, position, endPos]);

    /**
     * reset - Tạo maze mới
     */
    const reset = useCallback(() => {
        const newGrid = createRandomMaze(rows, cols);
        setGrid(newGrid);

        const start = findCellByType(newGrid, CellType.START);
        setPosition(start || { row: 1, col: 1 });
        setMoves(0);
        setPath([]);
        setHintPath(null);
        setElapsed(0);
    }, [rows, cols]);

    // ──────────────────────────────────────────────────────────────────────────
    // RENDER HELPERS
    // ──────────────────────────────────────────────────────────────────────────

    const formatTime = (ms: number) => {
        const secs = Math.floor(ms / 1000);
        const mins = Math.floor(secs / 60);
        const remainSecs = secs % 60;
        return `${mins}:${remainSecs.toString().padStart(2, '0')}`;
    };

    const getCellClass = (row: number, col: number): string => {
        const cell = grid[row][col];
        const classes = ['grid-cell'];

        // Cell type
        switch (cell.type) {
            case CellType.WALL:
                classes.push('wall');
                break;
            case CellType.START:
                classes.push('start');
                break;
            case CellType.END:
                classes.push('end');
                break;
            default:
                classes.push('empty');
        }

        // Hint path
        if (hintPath?.some((p) => p.row === row && p.col === col)) {
            classes.push('path');
        }

        // Current position
        if (position.row === row && position.col === col) {
            classes.push('current');
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
                        <i className="fi fi-rr-map-marker-cross"></i>
                        Maze Race
                    </h2>
                    <div className="grid-sub">
                        <span>
                            <i className="fi fi-rr-grid"></i>
                            {grid.length}×{grid[0]?.length || 0}
                        </span>
                        <span>
                            <i className="fi fi-rr-walking"></i>
                            {moves} bước
                        </span>
                        <span>
                            <i className="fi fi-rr-clock"></i>
                            {formatTime(elapsed)}
                        </span>
                    </div>
                </div>

                <div className="grid-actions">
                    <button
                        className="grid-btn"
                        onClick={showHint}
                        disabled={disabled || completed}
                        type="button"
                    >
                        <i className="fi fi-rr-bulb"></i>
                        Gợi ý
                    </button>
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
                    gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 28px)`,
                }}
            >
                {grid.map((row, r) =>
                    row.map((_, c) => (
                        <motion.div
                            key={`${r}-${c}`}
                            className={getCellClass(r, c)}
                            initial={false}
                            animate={{
                                scale: position.row === r && position.col === c ? 1.1 : 1,
                            }}
                            onClick={() => {
                                // Click to move if adjacent
                                const dr = r - position.row;
                                const dc = c - position.col;
                                if (Math.abs(dr) + Math.abs(dc) === 1) {
                                    movePlayer(dr, dc);
                                }
                            }}
                        >
                            {position.row === r && position.col === c && (
                                <div className="player-marker player-1" />
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Controls */}
            <div className="grid-footer">
                <div className="grid-rule">
                    <i className="fi fi-rr-info"></i>
                    Dùng ↑↓←→ hoặc WASD để di chuyển
                </div>

                <div className="grid-controls">
                    <div className="grid-controls-row">
                        <button
                            className="grid-control-btn"
                            onClick={() => movePlayer(-1, 0)}
                            disabled={disabled || completed}
                            type="button"
                        >
                            ↑
                        </button>
                    </div>
                    <div className="grid-controls-row">
                        <button
                            className="grid-control-btn"
                            onClick={() => movePlayer(0, -1)}
                            disabled={disabled || completed}
                            type="button"
                        >
                            ←
                        </button>
                        <button
                            className="grid-control-btn"
                            onClick={() => movePlayer(1, 0)}
                            disabled={disabled || completed}
                            type="button"
                        >
                            ↓
                        </button>
                        <button
                            className="grid-control-btn"
                            onClick={() => movePlayer(0, 1)}
                            disabled={disabled || completed}
                            type="button"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className={`grid-status ${completed ? 'done' : ''}`}>
                    {completed ? (
                        <>
                            <i className="fi fi-rr-trophy"></i>
                            Hoàn thành trong {moves} bước!
                        </>
                    ) : (
                        <>
                            <i className="fi fi-rr-walking"></i>
                            Tìm đường đến ô đỏ
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MazeGame;
