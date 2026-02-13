
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './GridGame.css'; // Recycle CSS

// ============================================================================
// TYPES
// ============================================================================

export enum TerrainType {
    GRASS = 1,
    SAND = 2,
    WATER = 5,
    WALL = 999,
    START = 0,
    END = 0
}

export interface PathfindingGameProgress {
    cost: number;
    position: { r: number, c: number };
    completed: boolean;
    finishedAt: number | null;
}

export interface PathfindingGameProps {
    rows?: number;
    cols?: number;
    startedAt?: number;
    disabled?: boolean;
    onProgress?: (progress: PathfindingGameProgress) => void;
    onComplete?: (result: { cost: number, timeMs: number }) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PathfindingGame: React.FC<PathfindingGameProps> = ({
    rows = 10,
    cols = 10,
    startedAt,
    disabled = false,
    onProgress,
    onComplete
}) => {
    // ────────────────────────────────────────────────────────────────────────
    // STATE
    // ────────────────────────────────────────────────────────────────────────

    const [grid, setGrid] = useState<TerrainType[][]>([]);
    const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
    const [endPos, setEndPos] = useState({ r: 9, c: 9 });
    const [cost, setCost] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    // ────────────────────────────────────────────────────────────────────────
    // LOGIC
    // ────────────────────────────────────────────────────────────────────────

    const initGrid = useCallback(() => {
        const newGrid: TerrainType[][] = [];
        for (let r = 0; r < rows; r++) {
            const row: TerrainType[] = [];
            for (let c = 0; c < cols; c++) {
                // Random terrain
                const rand = Math.random();
                if (rand < 0.6) row.push(TerrainType.GRASS);
                else if (rand < 0.8) row.push(TerrainType.SAND);
                else if (rand < 0.9) row.push(TerrainType.WATER);
                else row.push(TerrainType.WALL);
            }
            newGrid.push(row);
        }

        // Entrances
        newGrid[0][0] = TerrainType.GRASS;
        newGrid[rows - 1][cols - 1] = TerrainType.GRASS;

        setGrid(newGrid);
        setPlayerPos({ r: 0, c: 0 });
        setEndPos({ r: rows - 1, c: cols - 1 });
        setCost(0);
        setCompleted(false);
        setElapsed(0);
    }, [rows, cols]);

    const movePlayer = (dr: number, dc: number) => {
        if (disabled || completed) return;

        const nr = playerPos.r + dr;
        const nc = playerPos.c + dc;

        // Check bounds
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;

        const terrain = grid[nr][nc];
        if (terrain === TerrainType.WALL) return; // Blocked

        // Move
        setPlayerPos({ r: nr, c: nc });
        setCost(c => c + terrain); // Add movement cost based on terrain

        // Check End
        if (nr === endPos.r && nc === endPos.c) {
            setCompleted(true);
            const finalTime = startedAt ? Date.now() - startedAt : 0;
            if (onComplete) {
                onComplete({ cost: cost + terrain, timeMs: finalTime });
            }
        }
    };

    // ────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ────────────────────────────────────────────────────────────────────────

    /** Init */
    useEffect(() => {
        initGrid();
    }, [initGrid]);

    /** Controls */
    useEffect(() => {
        if (disabled || completed) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': movePlayer(-1, 0); break;
                case 'ArrowDown': movePlayer(1, 0); break;
                case 'ArrowLeft': movePlayer(0, -1); break;
                case 'ArrowRight': movePlayer(0, 1); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPos, disabled, completed, grid]); // Dependency on playerPos to access current state in closure? No, useState updater is safe. Dependency on grid is needed.

    /** Timer */
    useEffect(() => {
        if (!startedAt || completed || disabled) return;
        const interval = setInterval(() => {
            setElapsed(Date.now() - startedAt);
        }, 100);
        return () => clearInterval(interval);
    }, [startedAt, completed, disabled]);

    /** Progress */
    useEffect(() => {
        if (onProgress) {
            onProgress({
                cost,
                position: playerPos,
                completed,
                finishedAt: completed ? (startedAt ? startedAt + elapsed : Date.now()) : null
            });
        }
    }, [cost, playerPos, completed, elapsed, onProgress, startedAt]);

    // ────────────────────────────────────────────────────────────────────────
    // RENDER Helpers
    // ────────────────────────────────────────────────────────────────────────

    const getCellClass = (r: number, c: number, type: TerrainType) => {
        const classes = ['grid-cell'];
        if (r === playerPos.r && c === playerPos.c) classes.push('player');
        else if (r === endPos.r && c === endPos.c) classes.push('end');
        else {
            switch (type) {
                case TerrainType.GRASS: classes.push('grass'); break;
                case TerrainType.SAND: classes.push('sand'); break;
                case TerrainType.WATER: classes.push('water-deep'); break;
                case TerrainType.WALL: classes.push('wall'); break;
            }
        }
        return classes.join(' ');
    };

    return (
        <div className="grid-game pathfinding-game">
            <div className="grid-header">
                <div className="grid-stats">
                    <div className="stat-item">
                        <i className="fi fi-rr-coins"></i>
                        Cost: {cost}
                    </div>
                </div>
                <button className="grid-btn" onClick={initGrid}>
                    <i className="fi fi-rr-refresh"></i> Reset
                </button>
            </div>

            <div
                className="grid-board"
                style={{ gridTemplateColumns: `repeat(${cols}, 30px)` }}
            >
                {grid.map((row, r) =>
                    row.map((cell, c) => (
                        <motion.div
                            key={`${r}-${c}`}
                            className={getCellClass(r, c, cell)}
                            onClick={() => {
                                // Allow click to move if adjacent
                                const dr = Math.abs(r - playerPos.r);
                                const dc = Math.abs(c - playerPos.c);
                                if (dr + dc === 1) movePlayer(r - playerPos.r, c - playerPos.c);
                            }}
                            whileHover={{ scale: 1.1 }}
                        />
                    ))
                )}
            </div>

            <div className="grid-footer">
                <div className="legend">
                    <span className="legend-item"><span className="dot grass"></span> Cỏ (1)</span>
                    <span className="legend-item"><span className="dot sand"></span> Cát (2)</span>
                    <span className="legend-item"><span className="dot water-deep"></span> Nước (5)</span>
                </div>
            </div>
        </div>
    );
};
