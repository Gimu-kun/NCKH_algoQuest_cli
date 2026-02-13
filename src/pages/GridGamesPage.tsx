/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GRID GAMES PAGE - TRANG TRÒ CHƠI DẠNG LƯỚI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ (Description):
 * Trang tổng hợp các mini-game thuật toán trên lưới:
 * 1. Island Counter (DFS/BFS)
 * 2. Maze Runner (Pathfinding)
 * 3. Flood Fill (Recursion)
 *
 * CHỨC NĂNG (Features):
 * - Menu chọn game
 * - Khu vực chơi game (Game Container)
 * - Hướng dẫn và giải thích thuật toán
 *
 * @component GridGamesPage
 * @category Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { IslandGame } from '../components/games/grid/IslandGame';
import { MazeGame } from '../components/games/grid/MazeGame';
import { FloodFillGame } from '../components/games/grid/FloodFillGame';
import { SortingGame } from '../components/games/sorting/SortingGame';
import { PathfindingGame } from '../components/games/grid/PathfindingGame';
import { BinarySearchGame } from '../components/games/search/BinarySearchGame';
import './GridGamesPage.css';

enum GridGameType {
    ISLAND = 'ISLAND',
    MAZE = 'MAZE',
    FLOOD_FILL = 'FLOOD_FILL',
    SORTING = 'SORTING',
    PATHFINDING = 'PATHFINDING',
    BINARY_SEARCH = 'BINARY_SEARCH'
}

export const GridGamesPage: React.FC = () => {
    const { setScene } = useGameStore();
    const [selectedGame, setSelectedGame] = useState<GridGameType>(GridGameType.ISLAND);
    const [gameStartTime, setGameStartTime] = useState<number>(Date.now());

    const handleSelectGame = (type: GridGameType) => {
        setSelectedGame(type);
        setGameStartTime(Date.now());
    };

    // --- Render Content ---
    const renderGame = () => {
        switch (selectedGame) {
            case GridGameType.ISLAND:
                return (
                    <IslandGame
                        rows={12}
                        cols={20}
                        startedAt={gameStartTime}
                        onComplete={(result) => {
                            console.log('Island Game Completed:', result);
                            // Có thể thêm logic thưởng điểm hoặc hiển thị modal chúc mừng ở đây
                        }}
                    />
                );
            case GridGameType.MAZE:
                return (
                    <MazeGame
                        rows={15}
                        cols={25}
                        startedAt={gameStartTime}
                    />
                );
                return (
                    <FloodFillGame
                        rows={12}
                        cols={20}
                        playerCount={2}
                        startedAt={gameStartTime}
                    />
                );
            case GridGameType.SORTING:
                return (
                    <SortingGame
                        size={10}
                        maxValue={50}
                        startedAt={gameStartTime}
                    />
                );
            case GridGameType.PATHFINDING:
                return (
                    <PathfindingGame
                        rows={10}
                        cols={10}
                        startedAt={gameStartTime}
                    />
                );
            case GridGameType.BINARY_SEARCH:
                return (
                    <BinarySearchGame
                        min={1}
                        max={100}
                        startedAt={gameStartTime}
                        onComplete={(res) => console.log('Binary Search Done:', res)}
                    />
                );
            default:
                return null;
        }
    };

    const renderDescription = () => {
        switch (selectedGame) {
            case GridGameType.ISLAND:
                return (
                    <div className="game-description">
                        <h3><i className="fi fi-rr-island-tropical"></i> Đếm Số Đảo</h3>
                        <p>
                            Sử dụng thuật toán <strong>DFS (Depth-First Search)</strong> để tìm các vùng đất liên thông.
                            Mỗi lần click vào một ô đất, thuật toán sẽ duyệt qua toàn bộ hòn đảo đó.
                        </p>
                        <div className="algo-info">
                            <span className="tag">DFS</span>
                            <span className="tag">Connected Components</span>
                            <span className="tag">Graph Theory</span>
                        </div>
                    </div>
                );
            case GridGameType.MAZE:
                return (
                    <div className="game-description">
                        <h3><i className="fi fi-rr-labyrinth"></i> Mê Cung</h3>
                        <p>
                            Tìm đường đi ngắn nhất từ điểm bắt đầu đến đích sử dụng <strong>BFS (Breadth-First Search)</strong>.
                        </p>
                    </div>
                );
            case GridGameType.FLOOD_FILL:
                return (
                    <div className="game-description">
                        <h3><i className="fi fi-rr-fill"></i> Tô Màu (Flood Fill)</h3>
                        <p>
                            Thuật toán loang màu đệ quy, tương tự công cụ Paint Bucket trong các phần mềm chỉnh sửa ảnh.
                        </p>
                    </div>
                );
            case GridGameType.SORTING:
                return (
                    <div className="game-description">
                        <h3><i className="fi fi-rr-sort-amount-down-alt"></i> Sắp Xếp</h3>
                        <p>
                            Sắp xếp các cột tăng dần bằng cách hoán đổi (Swap). Minh họa thuật toán <strong>Bubble Sort</strong> hoặc <strong>Selection Sort</strong>.
                        </p>
                    </div>
                );
            case GridGameType.PATHFINDING:
                return (
                    <div className="game-description">
                        <h3><i className="fi fi-rr-map-marker"></i> Tìm Đường</h3>
                        <p>
                            Di chuyển từ điểm bắt đầu đến đích với chi phí thấp nhất. Minh họa <strong>Dijkstra</strong> hoặc <strong>A* Search</strong>.
                        </p>
                    </div>
                );
            case GridGameType.BINARY_SEARCH:
                return (
                    <div className="game-description">
                        <h3><i className="fi fi-rr-search-alt"></i> Đoán Số (Binary Search)</h3>
                        <p>
                            Tìm con số bí mật trong khoảng 1-100. Mỗi lần đoán sai, bạn sẽ loại bỏ được một nửa số lượng cần tìm!
                        </p>
                    </div>
                );
        }
    };

    return (
        <motion.div
            className="grid-games-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    <i className="fi fi-rr-arrow-left"></i> Quay Lại
                </button>
                <h1><i className="fi fi-rr-grid"></i> Arcade Thuật Toán</h1>
            </div>

            <div className="page-content">
                {/* Sidebar Menu */}
                <div className="games-sidebar">
                    <button
                        className={`game-menu-item ${selectedGame === GridGameType.ISLAND ? 'active' : ''}`}
                        onClick={() => handleSelectGame(GridGameType.ISLAND)}
                    >
                        <i className="fi fi-rr-island-tropical"></i>
                        <span>Đếm Đảo</span>
                    </button>

                    <button
                        className={`game-menu-item ${selectedGame === GridGameType.MAZE ? 'active' : ''}`}
                        onClick={() => handleSelectGame(GridGameType.MAZE)}
                    >
                        <i className="fi fi-rr-labyrinth"></i>
                        <span>Mê Cung</span>
                    </button>

                    <button
                        className={`game-menu-item ${selectedGame === GridGameType.FLOOD_FILL ? 'active' : ''}`}
                        onClick={() => handleSelectGame(GridGameType.FLOOD_FILL)}
                    >
                        <i className="fi fi-rr-fill"></i>
                        <span>Tô Màu</span>
                    </button>

                    <button
                        className={`game-menu-item ${selectedGame === GridGameType.SORTING ? 'active' : ''}`}
                        onClick={() => handleSelectGame(GridGameType.SORTING)}
                    >
                        <i className="fi fi-rr-sort-amount-down-alt"></i>
                        <span>Sắp Xếp</span>
                    </button>

                    <button
                        className={`game-menu-item ${selectedGame === GridGameType.PATHFINDING ? 'active' : ''}`}
                        onClick={() => handleSelectGame(GridGameType.PATHFINDING)}
                    >
                        <i className="fi fi-rr-map-marker"></i>
                        <span>Tìm Đường</span>
                    </button>

                    <button
                        className={`game-menu-item ${selectedGame === GridGameType.BINARY_SEARCH ? 'active' : ''}`}
                        onClick={() => handleSelectGame(GridGameType.BINARY_SEARCH)}
                    >
                        <i className="fi fi-rr-search-alt"></i>
                        <span>Đoán Số</span>
                    </button>
                </div>

                {/* Main Game Area */}
                <div className="game-container">
                    <motion.div
                        key={selectedGame}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderDescription()}
                    </motion.div>

                    <motion.div
                        className="game-viewport"
                        key={`viewport-${selectedGame}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {renderGame()}
                    </motion.div>
                </div>
            </div>
        </motion.div >
    );
};

export default GridGamesPage;
