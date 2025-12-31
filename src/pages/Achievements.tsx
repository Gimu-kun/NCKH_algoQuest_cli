/**
 * Trang Thành Tựu
 * Hiển thị tất cả achievements và badges của người chơi
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import { useGameStore, GameScene } from '../store/gameStore';
import { ACHIEVEMENTS, BADGES, AchievementCategory } from '../data/achievements';
import './Achievements.css';

export const Achievements: React.FC = () => {
    const { setScene } = useGameStore();
    const { achievements: unlockedAchievements, badges: unlockedBadges } = usePlayerStore();

    const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'ALL'>('ALL');
    const [showBadges, setShowBadges] = useState(false);

    // Filter achievements by category
    const filteredAchievements = Object.values(ACHIEVEMENTS).filter(achievement => {
        if (selectedCategory === 'ALL') return true;
        return achievement.category === selectedCategory;
    });

    // Check if achievement is unlocked
    const isUnlocked = (achievementId: string) => {
        return unlockedAchievements.includes(achievementId);
    };

    // Check if badge is unlocked
    const badgeUnlocked = (badgeId: string) => {
        return unlockedBadges.includes(badgeId);
    };

    // Count unlocked by rarity
    const countByRarity = (rarity: string) => {
        return Object.values(ACHIEVEMENTS)
            .filter(a => a.rarity === rarity && isUnlocked(a.id))
            .length;
    };

    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const unlockedCount = unlockedAchievements.length;
    const progress = Math.round((unlockedCount / totalAchievements) * 100);

    return (
        <div className="achievements-page">
            {/* Header */}
            <div className="achievements-header">
                <button className="btn-back" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    ← Về Sảnh
                </button>
                <h1>🏆 Thành Tựu & Huy Hiệu</h1>

                {/* Progress Bar */}
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

                {/* Rarity Stats */}
                <div className="rarity-stats">
                    <div className="rarity-item common">
                        <span className="rarity-icon">⚪</span>
                        <span>{countByRarity('COMMON')} Common</span>
                    </div>
                    <div className="rarity-item rare">
                        <span className="rarity-icon">🔵</span>
                        <span>{countByRarity('RARE')} Rare</span>
                    </div>
                    <div className="rarity-item epic">
                        <span className="rarity-icon">🟣</span>
                        <span>{countByRarity('EPIC')} Epic</span>
                    </div>
                    <div className="rarity-item legendary">
                        <span className="rarity-icon">🟠</span>
                        <span>{countByRarity('LEGENDARY')} Legendary</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="achievements-tabs">
                <button
                    className={!showBadges ? 'active' : ''}
                    onClick={() => setShowBadges(false)}
                >
                    🏆 Thành Tựu
                </button>
                <button
                    className={showBadges ? 'active' : ''}
                    onClick={() => setShowBadges(true)}
                >
                    🎖️ Huy Hiệu
                </button>
            </div>

            {!showBadges ? (
                <>
                    {/* Category Filter */}
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

                    {/* Achievements Grid */}
                    <div className="achievements-grid">
                        <AnimatePresence>
                            {filteredAchievements.map(achievement => {
                                const unlocked = isUnlocked(achievement.id);
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
                                            {hidden ? '❓' : achievement.displayName.split(' ')[0]}
                                        </div>

                                        <div className="achievement-info">
                                            <h3>{hidden ? '???' : achievement.displayName}</h3>
                                            <p className="achievement-description">
                                                {hidden ? 'Thành tựu ẩn' : achievement.description}
                                            </p>

                                            {unlocked && achievement.rewards && (
                                                <div className="achievement-rewards">
                                                    {achievement.rewards.oPoints && (
                                                        <span>+{achievement.rewards.oPoints} O-Points</span>
                                                    )}
                                                    {achievement.rewards.logicStone && (
                                                        <span>+{achievement.rewards.logicStone} Logic-Stone</span>
                                                    )}
                                                    {achievement.rewards.title && (
                                                        <span className="title-reward">"{achievement.rewards.title}"</span>
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
                /* Badges Grid */
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
                                    {unlocked ? badge.displayName.split(' ')[0] : '🔒'}
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
