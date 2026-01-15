/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PAGE: CÁC THÀNH TỰU (Achievements Page)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị hệ thống tiến trình (Progression System) của người chơi.
 * Nơi người chơi theo dõi các cột mốc đã đạt được, danh hiệu và bộ sưu tập huy hiệu.
 * 
 * TÍNH NĂNG:
 * - Progress Tracking: Visualizer thanh tiến độ tổng (Total Completion).
 * - Dual View: Chuyển đổi linh hoạt giữa Thành tựu (Achievements) và Huy hiệu (Badges).
 * - Categorization: Bộ lọc theo loại (Combat, Logical, Exploration, Social).
 * - Rarity Statistics: Thống kê phân bố độ hiếm (Common, Rare, Epic, Legendary).
 * 
 * FLOW HIỂN THỊ:
 * 1. Load User Data: Lấy danh sách ID thành tựu/huy hiệu đã mở từ `PlayerStore`.
 * 2. Data Mapping: Map ID sang thông tin chi tiết (Tên, Mô tả, Ảnh) từ `ACHIEVEMENTS`/`BADGES` constant.
 * 3. Filter Logic: Áp dụng bộ lọc Category (nếu tab Achievements) hoặc hiển thị toàn bộ (Badges).
 * 4. Render Grid: Hiển thị các thẻ thành tựu với trạng thái Locked/Unlocked.
 *    - Unlocked: Sáng, tương tác được, hiện chi tiết.
 *    - Locked: Tối màu, có thể ẩn nội dung (nếu là Hidden Achievement).
 * 
 * KỸ THUẬT:
 * - Conditional Rendering: Xử lý logic hiển thị Unlock/Lock/Secret.
 * - Array Filtering: Tính toán thống kê real-time dựa trên dữ liệu lọc.
 * - Framer Motion: Animation cho Cards và Progress Bar.
 * 
 * @page Achievements
 * @category Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import { useGameStore, GameScene } from '../store/gameStore';
import { ACHIEVEMENTS, BADGES, AchievementCategory } from '../data/achievements';
import './Achievements.css';

export const Achievements: React.FC = () => {
    // Hooks truy cập state
    const { setScene } = useGameStore();
    const { achievements: unlockedAchievements, badges: unlockedBadges } = usePlayerStore();

    // Local state cho UI (Tabs, Filters)
    const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'ALL'>('ALL');
    const [showBadges, setShowBadges] = useState(false); // Toggle giữa Achievements và Badges

    /**
     * Lọc danh sách thành tựu theo danh mục đang chọn
     */
    const filteredAchievements = Object.values(ACHIEVEMENTS).filter(achievement => {
        if (selectedCategory === 'ALL') return true;
        return achievement.category === selectedCategory;
    });

    /**
     * Kiểm tra xem thành tựu đã mở khóa chưa
     */
    const isUnlocked = (achievementId: string) => {
        return unlockedAchievements.includes(achievementId);
    };

    /**
     * Kiểm tra xem huy hiệu đã mở khóa chưa
     */
    const badgeUnlocked = (badgeId: string) => {
        return unlockedBadges.includes(badgeId);
    };

    /**
     * Đếm số lượng thành tựu đã mở khóa theo độ hiếm
     */
    const countByRarity = (rarity: string) => {
        return Object.values(ACHIEVEMENTS)
            .filter(a => a.rarity === rarity && isUnlocked(a.id))
            .length;
    };

    // Tính toán tiến độ tổng quan
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const unlockedCount = unlockedAchievements.length;
    const progress = Math.round((unlockedCount / totalAchievements) * 100);

    return (
        <div className="achievements-page">
            {/* === HEADER === */}
            <div className="achievements-header">
                <button className="btn-back" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    <i className="fi fi-rr-arrow-left"></i> Về Sảnh
                </button>
                <h1><i className="fi fi-rr-trophy"></i> Thành Tựu & Huy Hiệu</h1>

                {/* Thanh Tiến Độ */}
                <div className="achievements-progress">
                    <div className="progress-info">
                        <span>{unlockedCount} / {totalAchievements} Đã Đạt</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Thống Kê Độ Hiếm */}
                <div className="rarity-stats">
                    <div className="rarity-item common">
                        <span className="rarity-icon"><i className="fi fi-rr-circle" style={{ color: '#cbd5e1' }}></i></span>
                        <span>Phổ Biến</span>
                    </div>
                    <div className="rarity-legend-item rare">
                        <span className="rarity-icon"><i className="fi fi-rr-circle" style={{ color: '#60a5fa' }}></i></span>
                        <span>Hiếm</span>
                    </div>
                    <div className="rarity-legend-item epic">
                        <span className="rarity-icon"><i className="fi fi-rr-circle" style={{ color: '#c084fc' }}></i></span>
                        <span>Sử Thi</span>
                    </div>
                    <div className="rarity-legend-item legendary">
                        <span className="rarity-icon"><i className="fi fi-rr-circle" style={{ color: '#fbbf24' }}></i></span>
                        <span>{countByRarity('LEGENDARY')} Legendary</span>
                    </div>
                </div>
            </div>

            {/* === TABS NAVIGATION === */}
            <div className="tabs">
                <button
                    className={`tab-btn ${!showBadges ? 'active' : ''}`}
                    onClick={() => setShowBadges(false)}
                >
                    <i className="fi fi-rr-trophy"></i> Thành Tựu
                </button>
                <button
                    className={`tab-btn ${showBadges ? 'active' : ''}`}
                    onClick={() => setShowBadges(true)}
                >
                    <i className="fi fi-rr-badge"></i> Huy Hiệu
                </button>
            </div>

            {!showBadges ? (
                <>
                    {/* === CATEGORY FILTER (CHỈ HIỆN CHO THÀNH TỰU) === */}
                    <div className="category-filter">
                        <button
                            className={selectedCategory === 'ALL' ? 'active' : ''}
                            onClick={() => setSelectedCategory('ALL')}
                        >
                            Tất Cả
                        </button>
                        {Object.values(AchievementCategory).map(cat => (
                            <button
                                key={cat}
                                className={selectedCategory === cat ? 'active' : ''}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* === ACHIEVEMENTS LIST === */}
                    <div className="achievements-grid">
                        <AnimatePresence>
                            {filteredAchievements.map(achievement => {
                                const unlocked = isUnlocked(achievement.id);
                                // Ẩn thông tin nếu là thành tựu bí mật và chưa mở
                                const hidden = achievement.hidden && !unlocked;

                                return (
                                    <motion.div
                                        key={achievement.id}
                                        className={`achievement-card ${unlocked ? 'unlocked' : 'locked'} ${achievement.rarity.toLowerCase()}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        whileHover={{ scale: unlocked ? 1.05 : 1 }}
                                    >
                                        <div className="achievement-icon">
                                            {hidden ? '❓' : (
                                                // Tạm thời lấy chữ cái đầu làm icon text nếu không có hình
                                                achievement.displayName.split(' ')[0]
                                            )}
                                        </div>

                                        <div className="achievement-info">
                                            <h3>{hidden ? '???' : achievement.displayName}</h3>
                                            <p className="achievement-description">
                                                {hidden ? 'Thành tựu ẩn - Hãy khám phá để mở khóa!' : achievement.description}
                                            </p>

                                            {/* Hiển thị phần thưởng đính kèm nếu có */}
                                            {unlocked && achievement.rewards && (
                                                <div className="achievement-rewards">
                                                    {achievement.rewards.oPoints && (
                                                        <span>+{achievement.rewards.oPoints} O-Points</span>
                                                    )}
                                                    {achievement.rewards.logicStone && (
                                                        <span>+{achievement.rewards.logicStone} Logic-Stone</span>
                                                    )}
                                                    {achievement.rewards.title && (
                                                        <span className="title-reward">Danh hiệu: "{achievement.rewards.title}"</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className={`rarity-badge ${achievement.rarity.toLowerCase()}`}>
                                            {achievement.rarity}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                /* === BADGES GRID === */
                <div className="badges-grid">
                    {Object.values(BADGES).map(badge => {
                        const unlocked = badgeUnlocked(badge.id);

                        return (
                            <motion.div
                                key={badge.id}
                                className={`badge-card ${unlocked ? 'unlocked' : 'locked'} ${badge.rarity.toLowerCase()}`}
                                whileHover={{ scale: unlocked ? 1.1 : 1 }}
                            >
                                <div className="badge-icon">
                                    {unlocked ? (
                                        // TODO: Thay thế bằng Icon Image
                                        badge.displayName.split(' ')[0]
                                    ) : <i className="fi fi-rr-lock"></i>}
                                </div>
                                <h4>{unlocked ? badge.displayName : '???'}</h4>
                                <p>{unlocked ? badge.description : 'Đang khóa'}</p>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
