/**
 * Thành Phần HUD (Màn Hình Hiển Thị Thông Tin)
 * Hiển thị thống kê người chơi, tài nguyên và menu truy cập nhanh
 */

import React from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { useGameStore } from '../../store/gameStore';
import { ResourceType } from '../../data/models/Item';
import { Inventory } from './Inventory';
import { Settings } from './Settings';
import './HUD.css';

export const HUD: React.FC = () => {
    const { resources, level, name, unlockedSpells } = usePlayerStore();
    const { toggleInventory, toggleMenu, toggleQuests, sparkyVisible, sparkyMessage } = useGameStore();

    return (
        <div className="hud-container">
            {/* Trên Trái - Thông Tin Người Chơi */}
            <div className="hud-panel hud-player-info">
                <div className="player-avatar">
                    <img
                        src="/assets/images/Nhân vật/The Apprentice(Main Character)/The Apprentice Idle.png"
                        alt={name}
                    />
                </div>
                <div className="player-details">
                    <h3>{name}</h3>
                    <div className="level-badge">Lv {level}</div>
                </div>
            </div>

            {/* Trên Phải - Tài Nguyên */}
            <div className="hud-panel hud-resources">
                <div className="resource-item">
                    <img src="/assets/images/items/Data-Wood.png" alt="Data-Wood" />
                    <span>{resources[ResourceType.DATA_WOOD]}</span>
                </div>
                <div className="resource-item">
                    <img src="/assets/images/items/Logic-Stone.png" alt="Logic-Stone" />
                    <span>{resources[ResourceType.LOGIC_STONE]}</span>
                </div>
                <div className="resource-item">
                    <img src="/assets/images/items/O-Point.png" alt="O-Points" />
                    <span>{resources[ResourceType.O_POINTS]}</span>
                </div>
                <div className="resource-item">
                    <img src="/assets/images/items/Gold Coin.png" alt="Gold" />
                    <span>{resources[ResourceType.GOLD]}</span>
                </div>
            </div>

            {/* Dưới Trái - Phép Thuật Nhanh */}
            <div className="hud-panel hud-spells">
                <h4><i className="fi fi-rr-magic-wand"></i> Phép Thuật Nhanh</h4>
                <div className="spell-slots">
                    {[0, 1, 2, 3].map(index => (
                        <div key={index} className="spell-slot">
                            {unlockedSpells[index] ? (
                                <div className="spell-icon-frame">
                                    <img
                                        src={`/assets/images/UI/Skill Icon Frame.png`}
                                        alt="Spell Slot"
                                    />
                                    <span className="hotkey">{index + 1}</span>
                                </div>
                            ) : (
                                <div className="spell-slot-empty">
                                    <span className="hotkey">{index + 1}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dưới Phải - Nút Menu */}
            <div className="hud-panel hud-menu-buttons">
                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleInventory}
                    title="Túi Đồ (B)"
                >
                    <img src="/assets/images/UI/Menu Buttons Bag.png" alt="Inventory" />
                </motion.button>

                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Bản Đồ (M)"
                >
                    <img src="/assets/images/UI/Menu Buttons Map.png" alt="Map" />
                </motion.button>

                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleQuests}
                    title="Nhiệm Vụ (Q)"
                >
                    <img src="/assets/images/UI/Menu Buttons Quest.png" alt="Quests" />
                </motion.button>

                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMenu}
                    title="Cài Đặt (ESC)"
                >
                    <img src="/assets/images/UI/Menu Buttons Exit.png" alt="Menu" />
                </motion.button>
            </div>

            {/* Cửa Sổ Bật Lên Trợ Lý Sparky */}
            {sparkyVisible && sparkyMessage && (
                <motion.div
                    className="sparky-popup"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                >
                    <div className="sparky-avatar">
                        <img
                            src="/assets/images/Nhân vật/Sparky/Sparky Normal.png"
                            alt="Sparky"
                        />
                    </div>
                    <div className="sparky-bubble">
                        <img src="/assets/images/UI/Alert Icon Lightbulb.png" alt="Hint" />
                        <p>{sparkyMessage}</p>
                    </div>
                </motion.div>
            )}

            {/* Bảng Kho Đồ */}
            <Inventory />

            {/* Settings/Menu Modal */}
            <Settings />
        </div>
    );
};
