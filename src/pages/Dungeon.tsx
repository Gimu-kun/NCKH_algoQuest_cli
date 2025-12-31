/**
 * Cảnh Hầm Ngục - Khám Phá Dựa Trên Lưới
 * Di chuyển qua các phòng, gặp quái vật, tìm kho báu
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { ResourceType } from '../data/models/Item';
import { DUNGEON_1, type DungeonRoom } from '../data/dungeons/dungeon1';
import inputManager from '../game/engine/InputManager';
import './Dungeon.css';

export const Dungeon: React.FC = () => {
    const {
        setScene, startCombat, showSparky,
        dungeonState, initDungeon, updateDungeonState
    } = useGameStore();
    const { addResource } = usePlayerStore();
    const [showMessage, setShowMessage] = useState<React.ReactNode | null>(null);

    // Initialize dungeon if needed
    useEffect(() => {
        if (!dungeonState) {
            initDungeon(DUNGEON_1);
        }
    }, [dungeonState, initDungeon]);

    // Intro message
    useEffect(() => {
        const timer = setTimeout(() => {
            showSparky(
                `Chào mừng đến với ${DUNGEON_1.name}!\n` +
                `👉 Cách chơi: Dùng phím W-A-S-D hoặc các nút mũi tên trên màn hình để di chuyển.\n` +
                `🎯 Nhiệm vụ: Khám phá các ô vuông để tìm Kho Báu và Trùm cuối!`
            );
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // If still loading state
    if (!dungeonState) {
        return <div className="dungeon-loading">Loading Dungeon...</div>;
    }

    const { rooms, playerPos } = dungeonState;
    const currentRoom = rooms.find(r => r.x === playerPos.x && r.y === playerPos.y);

    // Xử lý di chuyển
    const handleMove = (dx: number, dy: number) => {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        // Kiểm tra biên
        if (newX < 0 || newX >= DUNGEON_1.size.width ||
            newY < 0 || newY >= DUNGEON_1.size.height) {
            setShowMessage(<span><i className="fi fi-rr-ban"></i> Không thể đi hướng này!</span>);
            setTimeout(() => setShowMessage(null), 1500);
            return;
        }

        const newPos = { x: newX, y: newY };

        // Đánh dấu phòng đã khám phá
        const newRooms = rooms.map(r =>
            r.x === newX && r.y === newY ? { ...r, explored: true } : r
        );

        updateDungeonState({
            playerPos: newPos,
            rooms: newRooms
        });
    };

    // Thiết lập điều khiển bàn phím (Moved after handleMove definition)
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
    }, [playerPos, rooms]); // Depend on current state

    // Xử lý khi vào phòng
    useEffect(() => {
        if (!currentRoom) return;

        if (currentRoom.type === 'monster' && !currentRoom.cleared) {
            // Kích hoạt chiến đấu
            setTimeout(() => {
                startCombat('logic_slime');
                // Do not set scene here immediately, let store handle it? 
                // Wait, startCombat only updates state. App renders based on state.
                // But startCombat in store sets scene to COMBAT. So it auto switches.
            }, 500);
        } else if (currentRoom.type === 'treasure' && !currentRoom.cleared) {
            // Give reward
            const reward = Math.floor(Math.random() * 20) + 10;
            addResource(ResourceType.DATA_WOOD, reward);
            setShowMessage(<span><i className="fi fi-rr-gift"></i> Tìm thấy {reward} Gỗ Dữ Liệu!</span>);

            // Mark cleared
            updateDungeonState({
                rooms: rooms.map(r =>
                    r.x === playerPos.x && r.y === playerPos.y
                        ? { ...r, cleared: true }
                        : r
                )
            });

            setTimeout(() => setShowMessage(null), 2000);
        } else if (currentRoom.type === 'boss' && !currentRoom.cleared) {
            setShowMessage(<span><i className="fi fi-rr-skull"></i> Đấu Trùm! Hãy chuẩn bị!</span>);
            setTimeout(() => {
                startCombat('chapter1_boss');
            }, 1500);
        }
    }, [playerPos]); // Only trigger when player moves to a new position. rooms change should not trigger this loop.


    // Get room icon
    const getRoomIcon = (room: DungeonRoom): React.ReactNode => {
        // Player is always visible on their current tile
        if (room.x === playerPos.x && room.y === playerPos.y) {
            return (
                <div className="player-marker">
                    <img
                        src="/assets/images/characters/The Apprentice(Main Character)/The Apprentice Idle.png"
                        alt="Player"
                        className="player-sprite"
                    />
                </div>
            );
        }

        // Unexplored rooms
        if (!room.explored) return <i className="fi fi-rr-question"></i>;

        // Explored rooms content
        if (room.type === 'boss') return room.cleared ? <i className="fi fi-rr-check"></i> : <i className="fi fi-rr-skull"></i>;
        if (room.type === 'treasure') return room.cleared ? <i className="fi fi-rr-box-open"></i> : <i className="fi fi-rr-gem"></i>;
        if (room.type === 'monster') return room.cleared ? <i className="fi fi-rr-check"></i> : <i className="fi fi-rr-spider"></i>;
        if (room.type === 'entrance') return <i className="fi fi-rr-door-open"></i>;

        // Default empty explored room
        return <span className="room-dot"></span>;
    };

    // Get room class
    const getRoomClass = (room: DungeonRoom): string => {
        const classes = ['dungeon-room'];
        if (room.x === playerPos.x && room.y === playerPos.y) classes.push('current');
        if (!room.explored) classes.push('unexplored');
        if (room.cleared) classes.push('cleared');
        classes.push(`room-${room.type}`);
        return classes.join(' ');
    };

    return (
        <div className="dungeon-scene">
            {/* Header */}
            <div className="dungeon-header">
                <h1>{DUNGEON_1.name}</h1>
                <p>{DUNGEON_1.description}</p>
                <button className="btn-exit" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    ← Rời Hầm Ngục
                </button>
            </div>

            {/* Grid Display */}
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

            {/* Controls */}
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

            {/* Message Display */}
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

            {/* Legend */}
            <div className="dungeon-legend">
                <h3>Chú Giải</h3>
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
