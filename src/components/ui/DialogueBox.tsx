/**
 * Thành Phần Hộp Thoại
 * Hiển thị cuộc trò chuyện với NPC và các lựa chọn hội thoại
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { NPCS } from '../../data/models/NPC';
import './DialogueBox.css';

export const DialogueBox: React.FC = () => {
    const { dialogueOpen, dialogueNPC, closeDialogue } = useGameStore();
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    if (!dialogueOpen || !dialogueNPC) return null;

    const npc = NPCS[dialogueNPC.toUpperCase().replace('_', '')];

    if (!npc) {
        console.error('NPC not found:', dialogueNPC);
        return null;
    }

    const currentDialogue = npc.dialogues[currentDialogueIndex];

    const handleNext = () => {
        if (currentDialogue.nextId) {
            // Tìm hội thoại tiếp theo theo ID
            const nextIndex = npc.dialogues.findIndex(d => d.id === currentDialogue.nextId);
            if (nextIndex !== -1) {
                setCurrentDialogueIndex(nextIndex);
                return;
            }
        }

        // Không còn hội thoại nào, đóng lại
        handleClose();
    };

    const handleClose = () => {
        setCurrentDialogueIndex(0);
        closeDialogue();
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
                    {/* Chân Dung NPC */}
                    <div className="dialogue-portrait">
                        <img
                            src={npc.sprite.talk}
                            alt={npc.displayName}
                        />
                    </div>

                    {/* Nội Dung Hội Thoại */}
                    <div className="dialogue-content">
                        {/* Tên NPC */}
                        <div className="dialogue-header">
                            <h3>{npc.displayName}</h3>
                            <span className="dialogue-role">{npc.description}</span>
                        </div>

                        {/* Văn Bản Hội Thoại */}
                        <div className="dialogue-text">
                            <p>{currentDialogue.text}</p>
                        </div>

                        {/* Nút Hành Động */}
                        <div className="dialogue-actions">
                            {/* Nút đóng nhanh */}
                            <button className="btn-skip" onClick={handleClose}>
                                Bỏ Qua ⏭️
                            </button>

                            {currentDialogue.nextId || currentDialogueIndex < npc.dialogues.length - 1 ? (
                                <button className="btn-next" onClick={handleNext}>
                                    Tiếp Theo ➡️
                                </button>
                            ) : (
                                <button className="btn-close" onClick={handleClose}>
                                    Hoàn Tất ✓
                                </button>
                            )}
                        </div>

                        {/* Nút Tính Năng (dựa trên vai trò NPC) */}
                        {npc.features && npc.features.length > 0 && (
                            <div className="dialogue-features">
                                {npc.features.includes('CAMPAIGN_QUESTS') && (
                                    <button className="feature-btn">
                                        📜 Nhiệm Vụ
                                    </button>
                                )}
                                {npc.features.includes('TRAINING_AREA') && (
                                    <button className="feature-btn">
                                        🎓 Tập Luyện
                                    </button>
                                )}
                                {npc.features.includes('SHOP') && (
                                    <button className="feature-btn">
                                        🛒 Cửa Hàng
                                    </button>
                                )}
                                {npc.features.includes('MULTIPLAYER') && (
                                    <button className="feature-btn">
                                        🤝 Đấu Trường
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
