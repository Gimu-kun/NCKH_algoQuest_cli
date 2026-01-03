/**
 * Thế Giới Trung Tâm - Trung tâm với các NPC
 * Triển khai đơn giản tạm thời cho Giai đoạn 1
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { HUD } from '../components/ui/HUD';
import './HubWorld.css';

export const HubWorld: React.FC = () => {
    const { setScene, enterDungeon, openDialogue, openRunicConsole, theme } = useGameStore();

    const handleEnterDungeon = () => {
        enterDungeon('dungeon_1');
    };

    const handleTestCombat = () => {
        setScene(GameScene.COMBAT);
    };

    const handleTestBuild = () => {
        // Mở Bảng Cổ Ngữ với một phép thuật thử nghiệm
        openRunicConsole('spell_is_increasing');
    };

    return (
        <div className="hub-world">
            {/* Nền */}
            <div
                className="hub-background"
                style={{
                    backgroundImage: theme === 'light' ? 'none' : 'url(/assets/images/Hub World Concept.png)'
                }}
            />

            {/* HUD */}
            <HUD />

            {/* Nội Dung Trung Tâm */}
            <div className="hub-content">
                <motion.div
                    className="welcome-panel"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h1><i className="fi fi-rr-landmark"></i> Thế Giới Trung Tâm - Thánh Địa Dòng Chảy</h1>
                    <p>Chào mừng bạn trở lại! Hãy gặp gỡ các NPC để nhận nhiệm vụ.</p>
                </motion.div>

                {/* Các Khu Vực NPC - Đơn giản hóa cho Giai đoạn 1 */}
                <div className="npc-zones">
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('professor_alric')}
                    >
                        <img src="/assets/images/characters/Professor Alric.png" alt="Professor Alric" />
                        <h3>Giáo sư Alric</h3>
                        <p>Nhiệm Vụ Chiến Dịch</p>
                        <span className="quest-marker">!</span>
                    </motion.div>

                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('linh_archivist')}
                    >
                        <img src="/assets/images/characters/Linh (The Archivist).png" alt="Linh" />
                        <h3>Linh</h3>
                        <p>Huấn Luyện & Thư Viện</p>
                    </motion.div>

                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('bork_blacksmith')}
                    >
                        <img src="/assets/images/characters/Bork (The Blacksmith).png" alt="Bork" />
                        <h3>Bork</h3>
                        <p>Cửa Hàng & Trang Trí</p>
                    </motion.div>

                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('guild_leader')}
                    >
                        <img src="/assets/images/characters/Guild Leader.png" alt="Guild Leader" />
                        <h3>Guild Leader</h3>
                        <p>Nhiệm Vụ Đa Người Chơi</p>
                    </motion.div>

                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('oracle')}
                    >
                        <img src="/assets/images/characters/Guild Leader.png" alt="Oracle" />
                        <h3>Nhà Tiên Tri</h3>
                        <p>Sự Kiện Trùm</p>
                    </motion.div>

                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDialogue('bookkeeper')}
                    >
                        <img src="/assets/images/characters/Guild Leader.png" alt="Bookkeeper" />
                        <h3>Kẻ Giữ Sách</h3>
                        <p>Bảng Xếp Hạng</p>
                    </motion.div>
                </div>

                {/* Building Zone Access */}
                <div className="farm-access">
                    <button className="farm-btn" onClick={() => setScene(GameScene.LOGIC_FARM)}>
                        <i className="fi fi-rr-home"></i> Vào Trang Trại Logic
                    </button>

                    <button className="farm-btn achievements-btn" onClick={() => setScene(GameScene.ACHIEVEMENTS)}>
                        <i className="fi fi-rr-trophy"></i> Thành Tựu & Huy Hiệu
                    </button>

                    <button className="farm-btn leaderboards-btn" onClick={() => setScene(GameScene.LEADERBOARDS)}>
                        <i className="fi fi-rr-stats"></i> Bảng Xếp Hạng
                    </button>
                </div>

                {/* Test Actions - For Phase 1 Demo */}
                <div className="test-actions">
                    <h3><i className="fi fi-rr-flask"></i> Thử Nghiệm (Dev Mode)</h3>
                    <button className="test-btn" onClick={handleEnterDungeon}>
                        <i className="fi fi-rr-sword"></i> Vào Hầm Ngục 1
                    </button>
                    <button className="test-btn" onClick={handleTestCombat}>
                        <i className="fi fi-rr-bullseye"></i> Thử Nghiệm Chiến Đấu
                    </button>
                    <button className="test-btn" onClick={handleTestBuild}>
                        <i className="fi fi-rr-hammer"></i> Thử Nghiệm Bảng Cổ Ngữ
                    </button>
                </div>
            </div>

            {/* Sparky floating companion */}
            <motion.div
                className="sparky-companion"
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <img
                    src="/assets/images/Nhân vật/Sparky/Sparky Normal.png"
                    alt="Sparky"
                />
            </motion.div>
        </div>
    );
};
