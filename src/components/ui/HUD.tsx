/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HUD (HEADS-UP DISPLAY) - GIAO DIỆN NGƯỜI CHƠI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Thành phần UI luôn hiển thị trên màn hình để cung cấp thông tin quan trọng:
 * - Player Info: Avatar, Level, Tên.
 * - Resources: Gỗ dữ liệu, Đá Logic, O-Points, Vàng.
 * - Quick Actions: Truy cập nhanh Túi đồ, Bản đồ, Nhiệm vụ, Cài đặt.
 * - Quick Spells: Các phím tắt kỹ năng (1-4).
 * - Sparky Notifications: Thông báo từ trợ lý AI.
 * 
 * CẤU TRÚC:
 * Chia làm 4 góc màn hình để tối ưu không gian hiển thị:
 * - Top Left: Player Status
 * - Top Right: Resources
 * - Bottom Left: Spells/Skills
 * - Bottom Right: Menu System
 * 
 * @component HUD
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { useGameStore } from '../../store/gameStore';
import { ResourceType } from '../../data/models/Item';
import './HUD.css';

export const HUD: React.FC = () => {
    // Hooks lấy dữ liệu từ Store
    const { resources, level, name, unlockedSpells } = usePlayerStore();
    const {
        toggleInventory,
        toggleMenu,
        toggleQuests,
        sparkyVisible,
        sparkyMessage
    } = useGameStore();

    return (
        <div className="hud-container">
            {/* === GÓC TRÊN TRÁI: THÔNG TIN NGƯỜI CHƠI === */}
            <div className="hud-panel hud-player-info">
                <div className="player-avatar">
                    <img
<<<<<<< HEAD
                        src="/assets/Ảnh Assets/Nhân vật/The Apprentice(Main Character)/The Apprentice Idle.png"
=======
                        src="/src/assets/Ảnh Assets/Nhân vật/The Apprentice(Main Character)/The Apprentice Idle.png"
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                        alt={name}
                    />
                </div>
                <div className="player-details">
                    <h3>{name}</h3>
<<<<<<< HEAD
                    <div className="level-badge">{level}</div>
=======
                    <div className="level-badge">Cấp {level}</div>
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                </div>
            </div>

            {/* === GÓC TRÊN PHẢI: TÀI NGUYÊN === */}
            <div className="hud-panel hud-resources">
                <div className="resource-item" title="Gỗ Dữ Liệu">
<<<<<<< HEAD
                    <img src="/assets/Ảnh Assets/Vật Phẩm/Data-Wood.png" alt="Data-Wood" />
                    <span>{resources[ResourceType.DATA_WOOD]}</span>
                </div>
                <div className="resource-item" title="Đá Logic">
                    <img src="/assets/Ảnh Assets/Vật Phẩm/Logic-Stone.png" alt="Logic-Stone" />
                    <span>{resources[ResourceType.LOGIC_STONE]}</span>
                </div>
                <div className="resource-item" title="Điểm O (Năng lượng)">
                    <img src="/assets/Ảnh Assets/Vật Phẩm/O-Point.png" alt="O-Points" />
                    <span>{resources[ResourceType.O_POINTS]}</span>
                </div>
                <div className="resource-item" title="Vàng">
                    <img src="/assets/Ảnh Assets/Vật Phẩm/Gold Coin.png" alt="Gold" />
=======
                    <img src="/src/assets/Ảnh Assets/Vật Phẩm/Data-Wood.png" alt="Data-Wood" />
                    <span>{resources[ResourceType.DATA_WOOD]}</span>
                </div>
                <div className="resource-item" title="Đá Logic">
                    <img src="/src/assets/Ảnh Assets/Vật Phẩm/Logic-Stone.png" alt="Logic-Stone" />
                    <span>{resources[ResourceType.LOGIC_STONE]}</span>
                </div>
                <div className="resource-item" title="Điểm O (Năng lượng)">
                    <img src="/src/assets/Ảnh Assets/Vật Phẩm/O-Point.png" alt="O-Points" />
                    <span>{resources[ResourceType.O_POINTS]}</span>
                </div>
                <div className="resource-item" title="Vàng">
                    <img src="/src/assets/Ảnh Assets/Vật Phẩm/Gold Coin.png" alt="Gold" />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                    <span>{resources[ResourceType.GOLD]}</span>
                </div>
            </div>

            {/* === GÓC DƯỚI TRÁI: PHÍM TẮT KỸ NĂNG === */}
            <div className="hud-panel hud-spells">
                <h4><i className="fi fi-rr-magic-wand"></i> Phép Thuật (Hotkeys)</h4>
                <div className="spell-slots">
                    {[0, 1, 2, 3].map(index => (
                        <div key={index} className="spell-slot">
                            {unlockedSpells[index] ? (
                                <div className="spell-icon-frame">
                                    {/* Placeholder icon, replace with specific spell icon later */}
                                    <img
<<<<<<< HEAD
                                        src={`/assets/Ảnh Assets/UI/Skill Icon Frame.png`}
=======
                                        src={`/src/assets/Ảnh Assets/UI/Skill Icon Frame.png`}
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
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

            {/* === GÓC DƯỚI PHẢI: MENU HỆ THỐNG === */}
            <div className="hud-panel hud-menu-buttons">
                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleInventory}
                    title="Túi Đồ (B)"
                >
<<<<<<< HEAD
                    <img src="/assets/Ảnh Assets/UI/Menu Buttons Bag.png" alt="Inventory" />
=======
                    <img src="/src/assets/Ảnh Assets/UI/Menu Buttons Bag.png" alt="Inventory" />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                </motion.button>

                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Bản Đồ (M) - Chưa mở"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
<<<<<<< HEAD
                    <img src="/assets/Ảnh Assets/UI/Menu Buttons Map.png" alt="Map" />
=======
                    <img src="/src/assets/Ảnh Assets/UI/Menu Buttons Map.png" alt="Map" />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                </motion.button>

                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleQuests}
                    title="Nhiệm Vụ (Q)"
                >
<<<<<<< HEAD
                    <img src="/assets/Ảnh Assets/UI/Menu Buttons Quest.png" alt="Quests" />
=======
                    <img src="/src/assets/Ảnh Assets/UI/Menu Buttons Quest.png" alt="Quests" />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                </motion.button>

                <motion.button
                    className="hud-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMenu}
                    title="Cài Đặt / Menu (ESC)"
                >
<<<<<<< HEAD
                    <img src="/assets/Ảnh Assets/UI/Menu Buttons Exit.png" alt="Menu" />
=======
                    <img src="/src/assets/Ảnh Assets/UI/Menu Buttons Exit.png" alt="Menu" />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                </motion.button>
            </div>

            {/* === CỬA SỔ TRỢ LÝ SPARKY (POPUP) === */}
            {sparkyVisible && sparkyMessage && (
                <motion.div
                    className="sparky-popup"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                >
                    <div className="sparky-avatar">
                        <img
<<<<<<< HEAD
                            src="/assets/Ảnh Assets/Nhân vật/Sparky/Sparky (Normal).png"
=======
                            src="/src/assets/Ảnh Assets/Nhân vật/Sparky/Sparky (Normal).png"
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                            alt="Sparky"
                        />
                    </div>
                    <div className="sparky-bubble">
<<<<<<< HEAD
                        <img src="/assets/Ảnh Assets/UI/Alert Icon Lightbulb.png" alt="Hint" className="alert-icon" />
=======
                        <img src="/src/assets/Ảnh Assets/UI/Alert Icon Lightbulb.png" alt="Hint" className="alert-icon" />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                        <p>{sparkyMessage}</p>
                    </div>
                </motion.div>
            )}

            {/* === CÁC PANEL ẨN (MODALS) === */}
            {/* Inventory và Settings được render tại App.tsx để đảm bảo overlay toàn cục */}
        </div>
    );
};
