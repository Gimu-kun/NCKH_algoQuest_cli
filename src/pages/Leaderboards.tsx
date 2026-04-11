/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PAGE: BẢNG XẾP HẠNG (Leaderboards)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị thứ hạng của người chơi so với cộng đồng (Mock Data cho MVP).
 * Khuyến khích tính cạnh tranh thông qua điểm số và tốc độ giải thuật toán.
 * 
 * TÍNH NĂNG:
 * - Type Selector: Chuyển đổi giữa các bảng xếp hạng (Code Speed, Optimization, v.v.).
 * - Ranking List: Danh sách Top 10-100 người chơi xuất sắc nhất.
 * - Player Rank Card: Thẻ hiển thị thứ hạng hiện tại của người chơi (Sticky).
 * - Reward Preview: Xem phần thưởng cho từng bậc xếp hạng.
 * 
 * @page Leaderboards
 * @category Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import { useGameStore, GameScene } from '../store/gameStore';
import { MOCK_LEADERBOARDS, LeaderboardType } from '../data/leaderboards';
import type { LeaderboardEntry } from '../data/leaderboards';
import './Leaderboards.css';

export const Leaderboards: React.FC = () => {
    // Hooks truy cập state
    const { setScene } = useGameStore();
    const { firstname, lastname } = usePlayerStore();

    // Local state cho loại bảng xếp hạng đang xem
    const [selectedType, setSelectedType] = useState<LeaderboardType>(LeaderboardType.CODE_SPEED);

    // Lấy dữ liệu bảng xếp hạng tương ứng (Mock Data)
    const currentLeaderboard = MOCK_LEADERBOARDS[selectedType];

    /**
     * Dữ liệu giả lập thứ hạng của người chơi hiện tại
     * Trong thực tế, dữ liệu này sẽ được fetch từ Backend API
     */
    const playerEntry: LeaderboardEntry = {
        rank: 25, // Ví dụ: Đang đứng thứ 25
        playerId: 'current_player',
        playerName: `${firstname} ${lastname}`.trim(),
        score: 1200,
        stats: {
            avgCodeSpeed: 350,
            questionsAnswered: 100
        },
        lastUpdated: new Date()
    };

    /**
     * Helper: Xác định màu sắc khung viền dựa trên thứ hạng (Top 3)
     */
    const getRankColor = (rank: number) => {
        if (rank === 1) return 'gold';
        if (rank === 2) return 'silver';
        if (rank === 3) return 'bronze';
        return 'default';
    };

    /**
     * Helper: Lấy icon huy chương cho Top 3
     */
    const getRankIcon = (rank: number) => {
        if (rank === 1) return <i className="fi fi-rr-medal" style={{ color: '#ffd700' }}></i>;
        if (rank === 2) return <i className="fi fi-rr-medal" style={{ color: '#c0c0c0' }}></i>;
        if (rank === 3) return <i className="fi fi-rr-medal" style={{ color: '#cd7f32' }}></i>;
        return `#${rank}`;
    };

    return (
        <div className="leaderboards-page">
            {/* === HEADER === */}
            <div className="leaderboards-header">
                <button className="btn-back" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    <i className="fi fi-rr-arrow-left"></i> Về Sảnh
                </button>
                <h1><i className="fi fi-rr-trophy"></i> Bảng Xếp Hạng</h1>
                <p className="subtitle">Cạnh tranh vinh quang cùng các Pháp Sư khác!</p>
            </div>

            {/* === LEADERBOARD TYPE SELECTOR === */}
            <div className="leaderboard-types">
                {Object.values(LeaderboardType).map(type => {
                    const leaderboard = MOCK_LEADERBOARDS[type];
                    // Tách icon và tên từ display name (Ví dụ: "⚡ Tốc Độ Code" -> Icon: ⚡, Name: Tốc Độ Code)
                    const icon = leaderboard.displayName.split(' ')[0];
                    const name = leaderboard.displayName.substring(2);

                    return (
                        <motion.button
                            key={type}
                            className={`type-btn ${selectedType === type ? 'active' : ''}`}
                            onClick={() => setSelectedType(type)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="type-icon">{icon}</span>
                            <span className="type-name">{name}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* === MAIN CONTENT === */}
            <div className="leaderboard-container">
                {/* Info & Meta Data */}
                <div className="leaderboard-info">
                    <h2>{currentLeaderboard.displayName}</h2>
                    <p>{currentLeaderboard.description}</p>
                    <span className="last-refresh">
                        Cập nhật cuối: {currentLeaderboard.lastRefresh.toLocaleTimeString('vi-VN')} {currentLeaderboard.lastRefresh.toLocaleDateString('vi-VN')}
                    </span>
                </div>

                {/* === PLAYER RANK CARD (STICKY) === */}
                <div className="player-rank-card">
                    <div className="rank-position">{getRankIcon(playerEntry.rank)}</div>
                    <div className="player-info">
                        <div className="player-name">
                            {playerEntry.playerName} <span className="you-label">(Bạn)</span>
                        </div>
                        {playerEntry.badge && (
                            <span className="player-badge"><i className="fi fi-rr-badge"></i> {playerEntry.badge}</span>
                        )}
                    </div>
                    <div className="player-score">{playerEntry.score.toLocaleString()}</div>
                    {playerEntry.stats && (
                        <div className="player-stats">
                            {playerEntry.stats.avgCodeSpeed && (
                                <span><i className="fi fi-rr-bolt"></i> {playerEntry.stats.avgCodeSpeed}ms avg</span>
                            )}
                            {playerEntry.stats.avgCodeSpeed && playerEntry.stats.questionsAnswered && (
                                <div className="stat-separator"></div>
                            )}
                            {playerEntry.stats.questionsAnswered && (
                                <span><i className="fi fi-rr-edit"></i> {playerEntry.stats.questionsAnswered} câu</span>
                            )}
                        </div>
                    )}
                </div>

                {/* === GLOBAL RANKINGS LIST === */}
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
                                        <div className="player-badge"><i className="fi fi-rr-badge"></i> {entry.badge}</div>
                                    )}
                                </div>

                                <div className="player-score">
                                    <span className="score-value">{entry.score.toLocaleString()}</span>
                                    {entry.stats && (
                                        <div className="score-stats">
                                            {entry.stats.avgCodeSpeed && (
                                                <span><i className="fi fi-rr-bolt"></i> {entry.stats.avgCodeSpeed}ms</span>
                                            )}
                                            {entry.stats.avgCodeSpeed && entry.stats.accuracy && (
                                                <div className="stat-separator"></div>
                                            )}
                                            {entry.stats.accuracy && (
                                                <span><i className="fi fi-rr-bullseye"></i> {entry.stats.accuracy}%</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="empty-leaderboard">
                            <p><i className="fi fi-rr-chart-histogram"></i> Chưa có dữ liệu bảng xếp hạng</p>
                            <p className="empty-subtitle">Hãy là người đầu tiên ghi danh!</p>
                        </div>
                    )}
                </div>

                {/* === REWARDS PREVIEW === */}
                {currentLeaderboard.rewards && currentLeaderboard.rewards.length > 0 && (
                    <div className="rewards-section">
                        <h3><i className="fi fi-rr-gift"></i> Phần Thưởng Tuần Này</h3>
                        <div className="rewards-list">
                            {currentLeaderboard.rewards.map((reward, index) => (
                                <div key={index} className="reward-item">
                                    <span className="reward-rank">
                                        Top {reward.rank === 1 ? '1' : reward.rank === 10 ? '10' : reward.rank}
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
