/**
 * Trang Bảng Xếp Hạng
 * Hiển thị rankings cho các loại khác nhau
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import { useGameStore, GameScene } from '../store/gameStore';
import { MOCK_LEADERBOARDS, LeaderboardType } from '../data/leaderboards';
import type { LeaderboardEntry } from '../data/leaderboards';
import './Leaderboards.css';

export const Leaderboards: React.FC = () => {
    const { setScene } = useGameStore();
    const { name } = usePlayerStore();
    const [selectedType, setSelectedType] = useState<LeaderboardType>(LeaderboardType.CODE_SPEED);

    const currentLeaderboard = MOCK_LEADERBOARDS[selectedType];

    // Mock player's rank (sẽ được lấy từ backend)
    const playerEntry: LeaderboardEntry = {
        rank: 25,
        playerId: 'current_player',
        playerName: name,
        score: 1200,
        stats: {
            avgCodeSpeed: 350,
            questionsAnswered: 100
        },
        lastUpdated: new Date()
    };
    // Note: 'Apprentice' title comes from backend/mock Logic, changing hardcoded logic here is risky without changing data structure.
    // I will just change the UI labels.

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'gold';
        if (rank === 2) return 'silver';
        if (rank === 3) return 'bronze';
        return 'default';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="leaderboards-page">
            {/* Header */}
            <div className="leaderboards-header">
                <button className="btn-back" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    ← Về Sảnh
                </button>
                <h1>🏆 Bảng Xếp Hạng</h1>
                <p className="subtitle">Cạnh tranh với các Pháp Sư khác!</p>
            </div>

            {/* Type Selector */}
            <div className="leaderboard-types">
                {Object.values(LeaderboardType).map(type => {
                    const leaderboard = MOCK_LEADERBOARDS[type];
                    return (
                        <motion.button
                            key={type}
                            className={`type-btn ${selectedType === type ? 'active' : ''}`}
                            onClick={() => setSelectedType(type)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="type-icon">{leaderboard.displayName.split(' ')[0]}</span>
                            <span className="type-name">{leaderboard.displayName.substring(2)}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Current Leaderboard */}
            <div className="leaderboard-container">
                <div className="leaderboard-info">
                    <h2>{currentLeaderboard.displayName}</h2>
                    <p>{currentLeaderboard.description}</p>
                    <span className="last-refresh">
                        Cập nhật cuối: {currentLeaderboard.lastRefresh.toLocaleString('vi-VN')}
                    </span>
                </div>

                {/* Player's Current Rank (Sticky) */}
                <div className="player-rank-card">
                    <div className="rank-position">{getRankIcon(playerEntry.rank)}</div>
                    <div className="player-info">
                        <div className="player-name">
                            {playerEntry.playerName} <span className="you-label">(Bạn)</span>
                        </div>
                        {playerEntry.badge && (
                            <span className="player-badge">🎖️ {playerEntry.badge}</span>
                        )}
                    </div>
                    <div className="player-score">{playerEntry.score.toLocaleString()}</div>
                    {playerEntry.stats && (
                        <div className="player-stats">
                            {playerEntry.stats.avgCodeSpeed && (
                                <span>⚡ {playerEntry.stats.avgCodeSpeed}ms avg</span>
                            )}
                            {playerEntry.stats.questionsAnswered && (
                                <span>📝 {playerEntry.stats.questionsAnswered} questions</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Top Rankings */}
                <div className="rankings-list">
                    {currentLeaderboard.entries.length > 0 ? (
                        currentLeaderboard.entries.map((entry, index) => (
                            <motion.div
                                key={entry.playerId}
                                className={`rank-entry ${getRankColor(entry.rank)}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="rank-position">
                                    {getRankIcon(entry.rank)}
                                </div>

                                <div className="player-avatar">
                                    {entry.avatar ? (
                                        <img src={entry.avatar} alt={entry.playerName} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {entry.playerName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="player-details">
                                    <div className="player-name">{entry.playerName}</div>
                                    {entry.title && (
                                        <div className="player-title">"{entry.title}"</div>
                                    )}
                                    {entry.badge && (
                                        <div className="player-badge">🎖️ {entry.badge}</div>
                                    )}
                                </div>

                                <div className="player-score">
                                    <span className="score-value">{entry.score.toLocaleString()}</span>
                                    {entry.stats && (
                                        <div className="score-stats">
                                            {entry.stats.avgCodeSpeed && (
                                                <span>⚡ {entry.stats.avgCodeSpeed}ms</span>
                                            )}
                                            {entry.stats.accuracy && (
                                                <span>🎯 {entry.stats.accuracy}%</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="empty-leaderboard">
                            <p>📊 Chưa có dữ liệu xếp hạng</p>
                            <p className="empty-subtitle">Hãy là người đầu tiên!</p>
                        </div>
                    )}
                </div>

                {/* Rewards Section */}
                {currentLeaderboard.rewards && currentLeaderboard.rewards.length > 0 && (
                    <div className="rewards-section">
                        <h3>🎁 Phần Thưởng</h3>
                        <div className="rewards-list">
                            {currentLeaderboard.rewards.map((reward, index) => (
                                <div key={index} className="reward-item">
                                    <span className="reward-rank">
                                        Top {reward.rank === 1 ? '1st' : reward.rank === 10 ? '10' : reward.rank}
                                    </span>
                                    <span className="reward-details">
                                        {reward.oPoints && `${reward.oPoints} O-Points`}
                                        {reward.logicStone && ` + ${reward.logicStone} Logic-Stone`}
                                        {reward.badge && ` + Badge: ${reward.badge}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
