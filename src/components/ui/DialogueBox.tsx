/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: HỘP THOẠI (Dialogue Box)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị giao diện hội thoại giữa Người Chơi và NPC.
 * 
 * TÍNH NĂNG:
 * - Hiển thị chân dung, tên và vai trò của NPC.
 * - Hiển thị nội dung văn bản theo từng đoạn (Step-by-step).
 * - Các nút điều hướng (Tiếp theo, Bỏ qua, Hoàn tất).
 * - Các nút tính năng đặc biệt (Nhiệm vụ, Cửa hàng, Tập luyện) tùy theo NPC.
 * 
 * @component DialogueBox
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { NPCS } from '../../data/models/NPC';
import './DialogueBox.css';

export const DialogueBox: React.FC = () => {
    // Hooks truy cập global state
    const { dialogueOpen, dialogueNPC, closeDialogue } = useGameStore();

    // State cục bộ để theo dõi dòng hội thoại hiện tại
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    // Không hiển thị nếu chưa kích hoạt hội thoại
    if (!dialogueOpen || !dialogueNPC) return null;

    // Lấy dữ liệu NPC từ ID
    const npc = NPCS[dialogueNPC];

    if (!npc) {
        console.error('Không tìm thấy dữ liệu NPC:', dialogueNPC);
        return null; // Hoặc hiển thị UI lỗi fallback
    }

    const currentDialogue = npc.dialogues[currentDialogueIndex];

    /**
     * Xử lý khi nhấn nút "Tiếp Theo"
     * Chuyển đến dialogue tiếp theo dựa trên nextId hoặc index tuần tự
     */
    const handleNext = () => {
        if (currentDialogue.nextId) {
            // Tìm hội thoại tiếp theo theo ID định danh
            const nextIndex = npc.dialogues.findIndex(d => d.id === currentDialogue.nextId);
            if (nextIndex !== -1) {
                setCurrentDialogueIndex(nextIndex);
                return;
            }
        }

        // Nếu không có nextId, kiểm tra xem còn dòng tiếp theo trong mảng không
        if (currentDialogueIndex < npc.dialogues.length - 1) {
            setCurrentDialogueIndex(currentDialogueIndex + 1);
        } else {
            // Kết thúc hội thoại
            handleClose();
        }
    };

    /**
     * Đóng hộp thoại và reset trạng thái
     */
    const handleClose = () => {
        setCurrentDialogueIndex(0);
        closeDialogue();
    };

    // Xử lý sự kiện khi nhấn nút tính năng
    const handleFeatureClick = (feature: string) => {
        closeDialogue(); // Đóng hội thoại trước khi chuyển cảnh

        switch (feature) {
            case 'SHOP':
                useGameStore.getState().setScene(GameScene.SHOP);
                break;
            case 'CAMPAIGN_QUESTS': {
                const questId = 'quest_intro_1'; // Nhiệm vụ khởi đầu
                const { activeQuests, completedQuests, startQuest } = usePlayerStore.getState();

                if (completedQuests.includes(questId)) {
                    useGameStore.getState().showSparky('Bạn đã hoàn thành nhiệm vụ này rồi! Tuyệt vời!');
                } else if (activeQuests.includes(questId)) {
                    useGameStore.getState().showSparky('Bạn đang thực hiện nhiệm vụ này. Hãy kiểm tra Sổ Tay (Q)!');
                } else {
                    startQuest(questId);
                    useGameStore.getState().showSparky('📜 Đã nhận nhiệm vụ: Khởi Đầu Hành Trình!');
                }
                break;
            }
            case 'TRAINING_AREA':
                // useGameStore.getState().setScene(GameScene.LOGIC_FARM);
                useGameStore.getState().showSparky('🚧 Khu vực này đang được nâng cấp! Vui lòng quay lại sau.');
                break;
            case 'MULTIPLAYER':
                useGameStore.getState().setScene(GameScene.LEADERBOARDS);
                break;
            default:
                useGameStore.getState().showSparky('Tính năng này đang được phát triển!');
        }
    };

    return (
        <div className="dialogue-overlay">
            <AnimatePresence>
                <motion.div
                    className="dialogue-box"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                >
                    {/* === CHÂN DUNG NPC === */}
                    <div className="dialogue-portrait">
                        <img
                            src={npc.sprite.talk}
                            alt={npc.displayName}
                        />
                    </div>

                    {/* === NỘI DUNG HỘI THOẠI === */}
                    <div className="dialogue-content">
                        {/* Header: Tên & Vai Trò */}
                        <div className="dialogue-header">
                            <h3>{npc.displayName}</h3>
                            <span className="dialogue-role">{npc.description}</span>
                        </div>

                        {/* Văn Bản Chính */}
                        <div className="dialogue-text">
                            <p>{currentDialogue.text}</p>
                        </div>

                        {/* Các Nút Điều Hướng */}
                        <div className="dialogue-actions">
                            {/* Nút Skip: Đóng nhanh */}
                            <button className="btn-skip" onClick={handleClose}>
                                Đóng ✕
                            </button>

                            {(currentDialogue.nextId || currentDialogueIndex < npc.dialogues.length - 1) ? (
                                <button className="btn-next" onClick={handleNext}>
                                    Tiếp Theo ➡️
                                </button>
                            ) : (
                                <button className="btn-close" onClick={handleClose}>
                                    Hoàn Tất ✓
                                </button>
                            )}
                        </div>

                        {/* === TÍNH NĂNG NPC (NẾU CÓ) === */}
                        {npc.features && npc.features.length > 0 && (
                            <div className="dialogue-features">
                                {npc.features.includes('CAMPAIGN_QUESTS') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('CAMPAIGN_QUESTS')}>
                                        📜 Nhận Nhiệm Vụ
                                    </button>
                                )}
                                {npc.features.includes('TRAINING_AREA') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('TRAINING_AREA')}>
                                        🎓 Khu Tập Luyện
                                    </button>
                                )}
                                {npc.features.includes('SHOP') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('SHOP')}>
                                        🛒 Xem Cửa Hàng
                                    </button>
                                )}
                                {npc.features.includes('MULTIPLAYER') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('MULTIPLAYER')}>
                                        🤝 Vào Đấu Trường
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
