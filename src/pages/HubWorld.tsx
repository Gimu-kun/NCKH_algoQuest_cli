/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * THẾ GIỚI TRUNG TÂM (Hub World Scene)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Màn hình chính nơi người chơi quay lại sau mỗi chuyến phiêu lưu (Dungeon).
 * Nơi tập trung các NPC cung cấp dịch vụ và nhiệm vụ.
 * 
 * CÁC KHU VỰC:
 * 1. NPC Zones: Tương tác với NPC (Giáo sư Alric, Linh, Bork, v.v.).
 * 2. Navigation: Cổng vào Dungeon, Logic Farm, và các màn hình phụ (Thành tựu, Leaderboard).
 * 3. Sparky Companion: AI trợ lý bay lơ lửng, sẵn sàng hỗ trợ.
 * 
 * KỸ THUẬT:
 * - Framer Motion: Animation cho UI panels và nhân vật.
 * - Game Store Interaction: Trigger dialogue, chuyển cảnh.
 * 
 * @component HubWorld
 * @category Game Scene
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { HUD } from '../components/ui/HUD';
import './HubWorld.css';

export const HubWorld: React.FC = () => {
    // Truy cập Global State để điều khiển chuyển cảnh và hội thoại
    const { setScene, enterDungeon, openDialogue, openRunicConsole, theme, showSparky } = useGameStore();

    // Handler Actions


    const handleTestCombat = () => {
        setScene(GameScene.COMBAT); // Test mode combat
    };

    const handleTestBuild = () => {
        // Mở Bảng Cổ Ngữ với một phép thuật thử nghiệm (Blueprint ID)
        openRunicConsole('spell_is_increasing');
    };

    return (
        <div className="hub-world">
            {/* Background Layer - Dynamic theo Theme */}
            <div
                className="hub-background"
                style={{
                    backgroundImage: theme === 'light' ? 'none' : 'url(/src/assets/Ảnh Assets/Hub World Concept.png)'
                }}
            />

            {/* Heads-Up Display (Thanh trạng thái người chơi) */}
            <HUD />

            {/* Main Content Layer */}
            <div className="hub-content">

                {/* Welcome Banner Animation */}
                <motion.div
                    className="welcome-panel"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h1><i className="fi fi-rr-landmark"></i> Thế Giới Trung Tâm - Thánh Địa Dòng Chảy</h1>
                    <p>Chào mừng bạn trở lại! Hãy gặp gỡ các NPC để nhận nhiệm vụ.</p>
                </motion.div>

                {/* === KHU VỰC NPC (NPC INTERACTION ZONES) === */}
                <div className="npc-zones">

                    {/* Professor Alric - Quest Giver */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('ALRIC')}
                    >
                        <img src="/src/assets/Ảnh Assets/Nhân vật/Giáo Sư Alric (The Mentor).png" alt="Professor Alric" />
                        <h3>Giáo sư Alric</h3>
                        <p>Nhiệm Vụ Chiến Dịch</p>
                        <span className="quest-marker">!</span>
                    </motion.div>

                    {/* Linh - The Archivist */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('LINH')}
                    >
                        <img src="/src/assets/Ảnh Assets/Nhân vật/Linh (The Archivist).png" alt="Linh" />
                        <h3>Linh</h3>
                        <p>Huấn Luyện & Thư Viện</p>
                    </motion.div>

                    {/* Bork - The Blacksmith */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('BORK')}
                    >
                        <img src="/src/assets/Ảnh Assets/Nhân vật/Bork (The Blacksmith).png" alt="Bork" />
                        <h3>Bork</h3>
                        <p>Cửa Hàng & Trang Trí</p>
                    </motion.div>

                    {/* Guild Leader */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('GUILD_LEADER')}
                    >
                        <img src="/src/assets/Ảnh Assets/Nhân vật/Thur Lĩnh Guild (The Guild Leader).png" alt="Guild Leader" />
                        <h3>Chủ Guild</h3>
                        <p>Nhiệm Vụ Đa Người Chơi</p>
                    </motion.div>

                    {/* The Oracle */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('ORACLE')}
                    >
                        <img src="/src/assets/Ảnh Assets/Nhân vật/Nhà Tiên Tri (The Oracle).png" alt="Oracle" />
                        <h3>Nhà Tiên Tri</h3>
                        <p>Sự Kiện Trùm</p>
                    </motion.div>

                    {/* The Bookkeeper */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('BOOKKEEPER')}
                    >
                        <img src="/src/assets/Ảnh Assets/Nhân vật/Kẻ Giữ Sách ( The Bookkeeper).png" alt="Bookkeeper" />
                        <h3>Kẻ Giữ Sách</h3>
                        <p>Bảng Xếp Hạng</p>
                    </motion.div>
                </div>

                {/* === NAVIGATION BUTTONS === */}
                <div className="farm-access">
                    <button
                        className="farm-btn disabled"
                        onClick={() => showSparky('🚧 Khu vực này đang được nâng cấp! Vui lòng quay lại sau.')}
                        style={{ opacity: 0.6, cursor: 'not-allowed', filter: 'grayscale(1)' }}
                    >
                        <i className="fi fi-rr-lock"></i> Trang Trại Logic (Bảo trì)
                    </button>

                    <button className="farm-btn achievements-btn" onClick={() => setScene(GameScene.ACHIEVEMENTS)}>
                        <i className="fi fi-rr-trophy"></i> Thành Tựu & Huy Hiệu
                    </button>

                    <button className="farm-btn leaderboards-btn" onClick={() => setScene(GameScene.LEADERBOARDS)}>
                        <i className="fi fi-rr-stats"></i> Bảng Xếp Hạng
                    </button>
                </div>

                {/* === DEV TOOLS (Test Actions) === */}
                <div className="test-actions">
                    <h3><i className="fi fi-rr-flask"></i> Thử Nghiệm (Dev Mode)</h3>
                    <button className="test-btn" onClick={() => enterDungeon('dungeon_1')}>
                        <i className="fi fi-rr-sword"></i> Vào Ải 1 (Intro)
                    </button>
                    <button className="test-btn" onClick={() => enterDungeon('dungeon_2')}>
                        <i className="fi fi-rr-sword"></i> Vào Ải 2 (Sort)
                    </button>
                    <button className="test-btn" onClick={() => enterDungeon('dungeon_3')}>
                        <i className="fi fi-rr-sword"></i> Vào Ải 3 (Linked List)
                    </button>
                    <button className="test-btn" onClick={() => enterDungeon('dungeon_4')}>
                        <i className="fi fi-rr-sword"></i> Vào Ải 4 (Stack/Queue)
                    </button>
                    <button className="test-btn" onClick={() => enterDungeon('dungeon_5')}>
                        <i className="fi fi-rr-sword"></i> Vào Ải 5 (BST)
                    </button>
                    <button className="test-btn" onClick={() => enterDungeon('dungeon_7')}>
                        <i className="fi fi-rr-skull"></i> ẢI FINAL (Void Core)
                    </button>
                    <button className="test-btn" onClick={handleTestCombat}>
                        <i className="fi fi-rr-bullseye"></i> Thử Nghiệm Chiến Đấu
                    </button>
                    <button className="test-btn" onClick={handleTestBuild}>
                        <i className="fi fi-rr-hammer"></i> Thử Nghiệm Bảng Cổ Ngữ
                    </button>
                </div>
            </div>

            {/* Sparky Animation */}
            <motion.div
                className="sparky-companion"
                animate={{
                    y: [0, -10, 0], // Floating Effect
                    rotate: [0, 2, -2, 0] // Gentle Wobble
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <img
                    src="/src/assets/Ảnh Assets/Nhân vật/Sparky/Sparky (Normal).png"
                    alt="Sparky"
                />
            </motion.div>
        </div>
    );
};
