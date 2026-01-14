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

<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { ResourceType } from '../data/models/Item';
<<<<<<< HEAD
import { type DungeonRoom } from '../data/dungeons/dungeon1';
=======
import { DUNGEON_1, type DungeonRoom } from '../data/dungeons/dungeon1';
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
import inputManager from '../game/engine/InputManager';
import { MonsterSpawner } from '../game/spawner/MonsterSpawner';
import './Dungeon.css';

export const Dungeon: React.FC = () => {
    // Hooks truy cập Global State
    const {
        setScene, startCombat, showSparky,
<<<<<<< HEAD
        dungeonState, updateDungeonState
=======
        dungeonState, initDungeon, updateDungeonState
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
    } = useGameStore();
    const { addResource } = usePlayerStore();
    const [showMessage, setShowMessage] = useState<React.ReactNode | null>(null);

<<<<<<< HEAD
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
=======
    // Initial Load: Tạo Dungeon nếu chưa có
    useEffect(() => {
        if (!dungeonState) {
            initDungeon(DUNGEON_1);
        }
    }, [dungeonState, initDungeon]);
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

    // Hướng dẫn tân thủ (Tutorial Message)
    useEffect(() => {
        const timer = setTimeout(() => {
<<<<<<< HEAD
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
=======
            showSparky(
                `Chào mừng đến với ${DUNGEON_1.name}!\n` +
                `👉 Cách chơi: Dùng phím W-A-S-D hoặc các nút mũi tên trên màn hình để di chuyển.\n` +
                `🎯 Nhiệm vụ: Khám phá các ô vuông để tìm Kho Báu và Trùm cuối!`
            );
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Loading State
    if (!dungeonState) {
        return <div className="dungeon-loading">Đang tải Hầm Ngục...</div>;
    }

    const { rooms, playerPos } = dungeonState;
    const currentRoom = rooms.find(r => r.x === playerPos.x && r.y === playerPos.y);
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * XỬ LÝ DI CHUYỂN (Movement Logic)
     * ═══════════════════════════════════════════════════════════════════════════
     */
<<<<<<< HEAD
    const handleMove = useCallback((dx: number, dy: number) => {
        if (!dungeonState || !rooms || !playerPos) return;

=======
    const handleMove = (dx: number, dy: number) => {
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        // 1. Kiểm tra va chạm biên (Boundary Check / Collision Detection)
<<<<<<< HEAD
        if (newX < 0 || newX >= dungeonState.config.size.width ||
            newY < 0 || newY >= dungeonState.config.size.height) {
=======
        if (newX < 0 || newX >= DUNGEON_1.size.width ||
            newY < 0 || newY >= DUNGEON_1.size.height) {
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
            setShowMessage(<span><i className="fi fi-rr-ban"></i> Không thể đi hướng này! (Tường chắn)</span>);
            setTimeout(() => setShowMessage(null), 1500);
            return;
        }

        const newPos = { x: newX, y: newY };

<<<<<<< HEAD
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
=======
        // 2. Cập nhật trạng thái "Đã khám phá" (Explored) cho phòng mới
        const newRooms = rooms.map(r =>
            r.x === newX && r.y === newY ? { ...r, explored: true } : r
        );

        // 3. Commit state change (Zustand Update)
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        updateDungeonState({
            playerPos: newPos,
            rooms: newRooms
        });
<<<<<<< HEAD
    }, [dungeonState, rooms, playerPos, updateDungeonState, startCombat, addResource]);
=======
    };
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

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
<<<<<<< HEAD
    }, [handleMove]); // Re-bind khi state thay đổi để Closure Capture đúng giá trị mới nhất
=======
    }, [playerPos, rooms]); // Re-bind khi state thay đổi để Closure Capture đúng giá trị mới nhất
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * XỬ LÝ SỰ KIỆN PHÒNG (Room Event Trigger)
     * ═══════════════════════════════════════════════════════════════════════════
     */
<<<<<<< HEAD

=======
    useEffect(() => {
        if (!currentRoom) return;

        // CASE 1: Quái vật (Chưa bị đánh bại - Monster Encounter)
        if (currentRoom.type === 'monster' && !currentRoom.cleared) {
            setTimeout(() => {
                // Spawn quái ngẫu nhiên (dựa trên config Dungeon ID)
                const monsterId = MonsterSpawner.getRandomMonster(
                    dungeonState?.config.id || 'dungeon_1',
                    false // Not Boss
                );
                startCombat(monsterId);
            }, 500);
        }

        // CASE 2: Kho báu (Chưa nhặt - Treasure Event)
        else if (currentRoom.type === 'treasure' && !currentRoom.cleared) {
            // Trao thưởng ngẫu nhiên (Random Reward Generation)
            const reward = Math.floor(Math.random() * 20) + 10;
            addResource(ResourceType.DATA_WOOD, reward);
            setShowMessage(<span><i className="fi fi-rr-gift"></i> Tìm thấy {reward} Gỗ Dữ Liệu!</span>);

            // Đánh dấu đã nhặt (State Update)
            updateDungeonState({
                rooms: rooms.map(r =>
                    r.x === playerPos.x && r.y === playerPos.y
                        ? { ...r, cleared: true }
                        : r
                )
            });

            setTimeout(() => setShowMessage(null), 2000);
        }

        // CASE 3: Boss Fight (Trùm Cuối)
        else if (currentRoom.type === 'boss' && !currentRoom.cleared) {
            setShowMessage(<span><i className="fi fi-rr-skull"></i> CẢNH BÁO: Đấu Trùm! Hãy chuẩn bị!</span>);
            setTimeout(() => {
                const bossId = MonsterSpawner.getRandomMonster(
                    dungeonState?.config.id || 'dungeon_1',
                    true // Is Boss
                );
                startCombat(bossId);
            }, 1500);
        }
    }, [playerPos]); // Trigger mỗi khi Player di chuyển sang ô mới
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

    /**
     * Helper: Render Icon cho từng loại phòng (Visual Representation)
     */
    const getRoomIcon = (room: DungeonRoom): React.ReactNode => {
<<<<<<< HEAD
        if (!playerPos) return null;

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        // Player Marker (Luôn hiển thị nếu Player đang ở ô này)
        if (room.x === playerPos.x && room.y === playerPos.y) {
            return (
                <div className="player-marker">
                    <img
<<<<<<< HEAD
                        src="/assets/Ảnh Assets/Nhân vật/The Apprentice(Main Character)/The Apprentice Idle.png"
=======
                        src="/src/assets/Ảnh Assets/Nhân vật/The Apprentice(Main Character)/The Apprentice Idle.png"
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
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
<<<<<<< HEAD
        if (!playerPos) return 'dungeon-room';

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        const classes = ['dungeon-room'];
        if (room.x === playerPos.x && room.y === playerPos.y) classes.push('current');
        if (!room.explored) classes.push('unexplored');
        if (room.cleared) classes.push('cleared');
        classes.push(`room-${room.type}`); // room-monster, room-treasure...
        return classes.join(' ');
    };

<<<<<<< HEAD
    if (!dungeonState || !rooms || !playerPos) {
        return <div className="dungeon-loading">Đang tải Hầm Ngục...</div>;
    }

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
    return (
        <div className="dungeon-scene">
            {/* Header / Top Bar */}
            <div className="dungeon-header">
<<<<<<< HEAD
                <h1>{dungeonState.config.name}</h1>
                <p>{dungeonState.config.description}</p>
=======
                <h1>{DUNGEON_1.name}</h1>
                <p>{DUNGEON_1.description}</p>
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
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
