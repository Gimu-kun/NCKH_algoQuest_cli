/**
 * Giao Diện Theo Dõi Nhiệm Vụ
 * Hiển thị các nhiệm vụ đang hoạt động và tiến độ
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import './QuestTracker.css';

export const QuestTracker: React.FC = () => {
    const { questsOpen, toggleQuests } = useGameStore();
    const { quests } = usePlayerStore();

    if (!questsOpen) return null;

    const activeQuests = quests.filter(q => q.status === 'active');
    const completedQuests = quests.filter(q => q.status === 'completed');

    return (
        <div className="quest-overlay" onClick={toggleQuests}>
            <AnimatePresence>
                <motion.div
                    className="quest-panel"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Tiêu Đề */}
                    <div className="quest-header">
                        <h2><i className="fi fi-rr-books"></i> Sổ Tay Nhiệm Vụ</h2>
                        <button className="close-btn" onClick={toggleQuests}><i className="fi fi-rr-cross"></i></button>
                    </div>

                    {/* Các Nhiệm Vụ Đang Hoạt Động */}
                    <div className="quest-section">
                        <h3><i className="fi fi-rr-flame"></i> Nhiệm Vụ Đang Làm ({activeQuests.length})</h3>
                        {activeQuests.length > 0 ? (
                            <div className="quest-list">
                                {activeQuests.map(quest => (
                                    <div key={quest.id} className="quest-item active">
                                        <div className="quest-title">
                                            <span className="quest-icon"><i className="fi fi-rr-sword"></i></span>
                                            <h4>{quest.title}</h4>
                                        </div>
                                        <p className="quest-description">{quest.description}</p>
                                        <div className="quest-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                                />
                                            </div>
                                            <span className="progress-text">
                                                {quest.progress} / {quest.target}
                                            </span>
                                        </div>
                                        <div className="quest-rewards">
                                            <span><i className="fi fi-rr-gift"></i>:</span>
                                            {quest.rewards.gold > 0 && <span><i className="fi fi-rr-coins"></i> {quest.rewards.gold} Vàng</span>}
                                            {quest.rewards.exp > 0 && <span><i className="fi fi-rr-star"></i> {quest.rewards.exp} KN</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">Hiện chưa có nhiệm vụ nào. Hãy nói chuyện với NPC!</p>
                        )}
                    </div>

                    {/* Completed Quests */}
                    <div className="quest-section">
                        <h3><i className="fi fi-rr-check-circle"></i> Đã Hoàn Thành ({completedQuests.length})</h3>
                        {completedQuests.length > 0 && (
                            <div className="quest-list collapsed">
                                {completedQuests.slice(0, 3).map(quest => (
                                    <div key={quest.id} className="quest-item completed">
                                        <div className="quest-title">
                                            <span className="quest-icon"><i className="fi fi-rr-check"></i></span>
                                            <h4>{quest.title}</h4>
                                        </div>
                                    </div>
                                ))}
                                {completedQuests.length > 3 && (
                                    <p className="more-text">+ {completedQuests.length - 3} nhiệm vụ khác</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="quest-footer">
                        <p>Nhấn <kbd>Q</kbd> để bật/tắt</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
