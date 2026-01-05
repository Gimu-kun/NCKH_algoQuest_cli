/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÀN HÌNH HẦM NGỤC (Dungeon Page / Scene)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Scene chính cho việc khám phá Dungeon theo phong cách Grid-based RPG:
 * - Render bản đồ Dungeon (Grid 5x5).
 * - Xử lý di chuyển của Player (WASD / Arrow Keys).
 * - Tương tác với các ô đặc biệt (Gặp quái -> Combat, Nhặt rương -> Reward).
 * - Quản lý Fog of War (Sương mù chiến tranh - Che các ô chưa khám phá).
 * 
 * TÍNH NĂNG:
 * - Điều khiển nhân vật di chuyển theo Grid.
 * - Hệ thống Fog of War (Sương mù): Che khuất các vùng chưa khám phá.
 * - Tương tác Event: Battle, Treasure, Boss, NPC.
 * - Phản hồi UI (Toast Notifications, Sparky Guide).
 * 
 * THUẬT TOÁN & FLOW DI CHUYỂN:
 * 1. Nhận Input (Keyboard/Button).
 * 2. Tính tọa độ mới (Candidate Position).
 * 3. Kiểm tra va chạm biên (Collision Detection w/ Walls).
 * 4. Cập nhật `PlayerPos` và trạng thái `Explored` của phòng mới.
 * 5. Trigger sự kiện phòng (gặp Monster, nhặt Item).
 * 
 * KỸ THUẬT:
 * - State Management (Zustand): Đồng bộ trạng thái Dungeon toàn cục.
 * - Event Loop: Sử dụng `useEffect` để bắt sự kiện di chuyển và trigger game logic.
 * - CSS Grid/Flexbox: Layout bàn cờ 5x5 responsive.
 * 
 * @component Dungeon
 * @category Game Scene
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { ResourceType } from '../data/models/Item';
import { type DungeonRoom } from '../data/dungeons/dungeon1';
import inputManager from '../game/engine/InputManager';
import { MonsterSpawner } from '../game/spawner/MonsterSpawner';
import './Dungeon.css';

export const Dungeon: React.FC = () => {
    // Hooks truy cập Global State
    const {
        setScene, startCombat, showSparky,
        dungeonState, updateDungeonState
    } = useGameStore();
    const { addResource } = usePlayerStore();
    const [showMessage, setShowMessage] = useState<React.ReactNode | null>(null);

    // Initial Load: Tạo Dungeon nếu chưa có hoặc state bị lỗi
    useEffect(() => {
        // Kiểm tra tính hợp lệ của dungeonState
        const isValidState = dungeonState && dungeonState.config && dungeonState.rooms && dungeonState.playerPos;

        if (!isValidState) {
            console.log("Dungeon State invalid or missing, initializing...");
            // Nếu mất state (F5), thử vào lại dungeon hiện tại hoặc mặc định Dungeon 1
            const dungeonId = useGameStore.getState().currentDungeonId || 'dungeon_1';
            useGameStore.getState().enterDungeon(dungeonId);
        }
    }, [dungeonState]);

    // Hướng dẫn tân thủ (Tutorial Message)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (dungeonState?.config) {
                showSparky(
                    `Chào mừng đến với ${dungeonState.config.name}!\n` +
                    `👉 Cách chơi: Dùng phím W-A-S-D hoặc các nút mũi tên trên màn hình để di chuyển.\n` +
                    `🎯 Nhiệm vụ: Khám phá các ô vuông để tìm Kho Báu và Trùm cuối!`
                );
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [showSparky, dungeonState?.config]);

    const rooms = dungeonState?.rooms;
    const playerPos = dungeonState?.playerPos;

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * XỬ LÝ DI CHUYỂN (Movement Logic)
     * ═══════════════════════════════════════════════════════════════════════════
     */
    const handleMove = useCallback((dx: number, dy: number) => {
        if (!dungeonState || !rooms || !playerPos) return;

        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        // 1. Kiểm tra va chạm biên (Boundary Check / Collision Detection)
        if (newX < 0 || newX >= dungeonState.config.size.width ||
            newY < 0 || newY >= dungeonState.config.size.height) {
            setShowMessage(<span><i className="fi fi-rr-ban"></i> Không thể đi hướng này! (Tường chắn)</span>);
            setTimeout(() => setShowMessage(null), 1500);
            return;
        }

        const newPos = { x: newX, y: newY };

        // 2. Logic cập nhật phòng (Explored + Events)
        let newRooms = [...rooms];
        const targetRoom = rooms.find(r => r.x === newX && r.y === newY);

        if (targetRoom) {
            // Mark as Explored
            if (!targetRoom.explored) {
                newRooms = newRooms.map(r => r.x === newX && r.y === newY ? { ...r, explored: true } : r);
            }

            // --- EVENT HANDLING ---
            // CASE 1: Quái vật (Monster Encounter)
            if (targetRoom.type === 'monster' && !targetRoom.cleared) {
                setTimeout(() => {
                    const monsterId = MonsterSpawner.getRandomMonster(
                        dungeonState.config.id || 'dungeon_1',
                        false
                    );
                    startCombat(monsterId);
                }, 500);
            }
            // CASE 2: Kho báu (Treasure)
            else if (targetRoom.type === 'treasure' && !targetRoom.cleared) {
                const reward = Math.floor(Math.random() * 20) + 10;
                addResource(ResourceType.DATA_WOOD, reward);
                setShowMessage(<span><i className="fi fi-rr-gift"></i> Tìm thấy {reward} Gỗ Dữ Liệu!</span>);
                setTimeout(() => setShowMessage(null), 2000);

                // Mark Cleared
                newRooms = newRooms.map(r => r.x === newX && r.y === newY ? { ...r, cleared: true, explored: true } : r);
            }
            // CASE 3: Boss Fight
            else if (targetRoom.type === 'boss' && !targetRoom.cleared) {
                setShowMessage(<span><i className="fi fi-rr-skull"></i> CẢNH BÁO: Đấu Trùm! Hãy chuẩn bị!</span>);
                setTimeout(() => {
                    const bossId = MonsterSpawner.getRandomMonster(
                        dungeonState.config.id || 'dungeon_1',
                        true
                    );
                    startCombat(bossId);
                }, 1500);
            }
        }

        // 3. Commit state change
        updateDungeonState({
            playerPos: newPos,
            rooms: newRooms
        });
    }, [dungeonState, rooms, playerPos, updateDungeonState, startCombat, addResource]);

    /**
     * Đăng ký sự kiện bàn phím (Input Binding Management)
     */
    useEffect(() => {
        const moveUp = () => handleMove(0, -1);
        const moveDown = () => handleMove(0, 1);
        const moveLeft = () => handleMove(-1, 0);
        const moveRight = () => handleMove(1, 0);

        inputManager.bind('w', moveUp, 'Đi Lên');
        inputManager.bind('arrowup', moveUp, 'Đi Lên');
        inputManager.bind('s', moveDown, 'Đi Xuống');
        inputManager.bind('arrowdown', moveDown, 'Đi Xuống');
        inputManager.bind('a', moveLeft, 'Qua Trái');
        inputManager.bind('arrowleft', moveLeft, 'Qua Trái');
        inputManager.bind('d', moveRight, 'Qua Phải');
        inputManager.bind('arrowright', moveRight, 'Qua Phải');

        // Cleanup: Hủy Binding khi Component Unmount
        return () => {
            inputManager.unbind('w');
            inputManager.unbind('arrowup');
            inputManager.unbind('s');
            inputManager.unbind('arrowdown');
            inputManager.unbind('a');
            inputManager.unbind('arrowleft');
            inputManager.unbind('d');
            inputManager.unbind('arrowright');
        };
    }, [handleMove]); // Re-bind khi state thay đổi để Closure Capture đúng giá trị mới nhất

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * XỬ LÝ SỰ KIỆN PHÒNG (Room Event Trigger)
     * ═══════════════════════════════════════════════════════════════════════════
     */


    /**
     * Helper: Render Icon cho từng loại phòng (Visual Representation)
     */
    const getRoomIcon = (room: DungeonRoom): React.ReactNode => {
        if (!playerPos) return null;

        // Player Marker (Luôn hiển thị nếu Player đang ở ô này)
        if (room.x === playerPos.x && room.y === playerPos.y) {
            return (
                <div className="player-marker">
                    <img
                        src="/src/assets/Ảnh Assets/Nhân vật/The Apprentice(Main Character)/The Apprentice Idle.png"
                        alt="Player"
                        className="player-sprite"
                    />
                </div>
            );
        }

        // Fog of War: Phòng chưa khám phá
        if (!room.explored) return <i className="fi fi-rr-question"></i>;

        // Nội dung phòng đã khám phá
        if (room.type === 'boss') return room.cleared ? <i className="fi fi-rr-check"></i> : <i className="fi fi-rr-skull"></i>;
        if (room.type === 'treasure') return room.cleared ? <i className="fi fi-rr-box-open"></i> : <i className="fi fi-rr-gem"></i>;
        if (room.type === 'monster') return room.cleared ? <i className="fi fi-rr-check"></i> : <i className="fi fi-rr-spider"></i>;
        if (room.type === 'entrance') return <i className="fi fi-rr-door-open"></i>;

        // Phòng trống mặc định (Empty Room)
        return <span className="room-dot"></span>;
    };

    /**
     * Helper: Tính CSS Classes cho phòng (Styling Logic)
     */
    const getRoomClass = (room: DungeonRoom): string => {
        if (!playerPos) return 'dungeon-room';

        const classes = ['dungeon-room'];
        if (room.x === playerPos.x && room.y === playerPos.y) classes.push('current');
        if (!room.explored) classes.push('unexplored');
        if (room.cleared) classes.push('cleared');
        classes.push(`room-${room.type}`); // room-monster, room-treasure...
        return classes.join(' ');
    };

    if (!dungeonState || !rooms || !playerPos) {
        return <div className="dungeon-loading">Đang tải Hầm Ngục...</div>;
    }

    return (
        <div className="dungeon-scene">
            {/* Header / Top Bar */}
            <div className="dungeon-header">
                <h1>{dungeonState.config.name}</h1>
                <p>{dungeonState.config.description}</p>
                <button className="btn-exit" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    ← Rời Hầm Ngục
                </button>
            </div>

            {/* Grid Container */}
            <div className="dungeon-grid-container">
                <div className="dungeon-grid">
                    {rooms.map((room, index) => (
                        <motion.div
                            key={index}
                            className={getRoomClass(room)}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                        >
                            <span className="room-icon">{getRoomIcon(room)}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Controls / Instructions */}
            <div className="dungeon-controls">
                <p className="controls-hint">Sử dụng WASD hoặc Phím Mũi Tên để di chuyển</p>
                <div className="movement-buttons">
                    <button onClick={() => handleMove(0, -1)} title="Đi Lên (W / ↑)">↑</button>
                    <div className="movement-row">
                        <button onClick={() => handleMove(-1, 0)} title="Qua Trái (A / ←)">←</button>
                        <button onClick={() => handleMove(0, 1)} title="Đi Xuống (S / ↓)">↓</button>
                        <button onClick={() => handleMove(1, 0)} title="Qua Phải (D / →)">→</button>
                    </div>
                </div>
            </div>

            {/* In-Game Notifications (Toasts) */}
            {showMessage && (
                <motion.div
                    className="dungeon-message"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                >
                    {showMessage}
                </motion.div>
            )}

            {/* Legend / Key */}
            <div className="dungeon-legend">
                <h3>Chú Giải Bản Đồ</h3>
                <div className="legend-items">
                    <span><i className="fi fi-rr-user"></i> Bạn</span>
                    <span><i className="fi fi-rr-bug"></i> Quái Vật</span>
                    <span><i className="fi fi-rr-gift"></i> Kho Báu</span>
                    <span><i className="fi fi-rr-skull"></i> Trùm</span>
                    <span><i className="fi fi-rr-question"></i> Chưa Biết</span>
                </div>
            </div>
        </div>
    );
};
