/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: THEO DÕI NHIỆM VỤ (Quest Tracker)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Panel trượt (Slide-in Panel) hiển thị danh sách nhiệm vụ của người chơi.
 * Giúp người chơi theo dõi tiến độ thời gian thực của Active và Completed Quests.
 * 
 * TÍNH NĂNG:
 * - Active Quests View: Hiển thị chi tiết (Icon, Title, Desc, Progress Bar dạng %, Rewards).
 * - Completed Quests Log: Lưu trữ lịch sử nhiệm vụ đã hoàn thành.
 * - Quick Toggle: Phím tắt 'Q' hoặc click nút UI để mở/đóng nhanh.
 * - Empty State: Hiển thị hướng dẫn khi chưa có nhiệm vụ nào.
 * 
 * FLOW HIỂN THỊ:
 * 1. Truy cập `StudentStore` lấy mảng `quests`.
 * 2. Filter thành 2 mảng con: `activeQuests` và `completedQuests`.
 * 3. Render danh sách Active với thanh tiến độ (`current/target`).
 * 4. Render danh sách Completed (giới hạn hiển thị 3 item gần nhất để gọn UI).
 * 
 * KỸ THUẬT:
 * - Global State Access: Lấy dữ liệu trực tiếp từ `usePlayerStore`.
 * - Modal Overlay Pattern: Click ra ngoài (Overlay) sẽ đóng panel.
 * - CSS Animations: Panel trượt từ phải sang (`x: 300 -> 0`).
 * 
 * @component QuestTracker
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import './QuestTracker.css';

export const QuestTracker: React.FC = () => {
    // Hooks truy cập store
    const { questsOpen, toggleQuests } = useGameStore();
    const { quests } = usePlayerStore();

    // Nếu tracker chưa mở, không render gì cả
    if (!questsOpen) return null;

    // Phân loại nhiệm vụ
    const activeQuests = quests.filter(q => q.status === 'active');
    const completedQuests = quests.filter(q => q.status === 'completed');

    return (
        // Overlay mờ che background
        <div className="quest-overlay" onClick={toggleQuests}>
            <AnimatePresence>
                <motion.div
                    className="quest-panel"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()} // Ngăn click vào panel đóng modal
                >
                    {/* === HEADER === */}
                    <div className="quest-header">
                        <h2><i className="fi fi-rr-books"></i> Sổ Tay Nhiệm Vụ</h2>
                        <button className="close-btn" onClick={toggleQuests}>✕</button>
                    </div>

                    {/* === ACTIVE QUESTS === */}
                    <div className="quest-section">
                        <h3><i className="fi fi-rr-flame"></i> Đang Thực Hiện ({activeQuests.length})</h3>

                        {activeQuests.length > 0 ? (
                            <div className="quest-list">
                                {activeQuests.map(quest => (
                                    <div key={quest.id} className="quest-item active">
                                        <div className="quest-title">
                                            <span className="quest-icon"><i className="fi fi-rr-sword"></i></span>
                                            <h4>{quest.title}</h4>
                                        </div>

                                        <p className="quest-description">{quest.description}</p>

                                        {/* Thanh tiến độ */}
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

                                        {/* Phần thưởng */}
                                        <div className="quest-rewards">
                                            <span><i className="fi fi-rr-gift"></i> Thưởng:</span>
                                            {quest.rewards.gold > 0 && <span><i className="fi fi-rr-coins"></i> {quest.rewards.gold} Vàng</span>}
                                            {quest.rewards.exp > 0 && <span><i className="fi fi-rr-star"></i> {quest.rewards.exp} KN</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-message">
                                <i className="fi fi-rr-search-alt" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}></i>
                                <p>Hiện chưa có nhiệm vụ nào.<br />Hãy nói chuyện với NPC tại Sảnh!</p>
                            </div>
                        )}
                    </div>

                    {/* === COMPLETED QUESTS === */}
                    <div className="quest-section">
                        <h3><i className="fi fi-rr-check-circle"></i> Đã Hoàn Thành ({completedQuests.length})</h3>

                        {completedQuests.length > 0 && (
                            <div className="quest-list collapsed">
                                {/* Chỉ hiện tối đa 3 nhiệm vụ đã xong gần nhất */}
                                {completedQuests.slice(0, 3).map(quest => (
                                    <div key={quest.id} className="quest-item completed">
                                        <div className="quest-title">
                                            <span className="quest-icon"><i className="fi fi-rr-check"></i></span>
                                            <h4>{quest.title}</h4>
                                        </div>
                                    </div>
                                ))}

                                {completedQuests.length > 3 && (
                                    <p className="more-text">... và {completedQuests.length - 3} nhiệm vụ khác</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* === FOOTER === */}
                    <div className="quest-footer">
                        <p>Mẹo: Nhấn phím <kbd>Q</kbd> để bật/tắt nhanh</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
