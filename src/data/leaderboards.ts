/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÔ HÌNH DỮ LIỆU BẢNG XẾP HẠNG (Leaderboard Data Model)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc dữ liệu cho hệ thống Bảng Xếp Hạng (Leaderboards) toàn cầu.
 * Hỗ trợ nhiều loại xếp hạng (Tốc độ, Chính xác, Weekly, Monthly...).
 * 
 * KỸ THUẬT:
 * - Mock Data Implementation: Hiện tại sử dụng dữ liệu giả lập (MOCK_LEADERBOARDS).
 * - Trong tương lai sẽ tích hợp với Backend API.
 * 
 * LOẠI RANKING:
 * - CODE_SPEED: Tốc độ giải thuật toán.
 * - ACCURACY: Độ chính xác trung bình.
 * - BIG_O_MASTER: Số lượng giải pháp tối ưu.
 * 
 * @module LeaderboardData
 * @category Data Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export enum LeaderboardType {
    CODE_SPEED = 'CODE_SPEED',        // Tốc độ Code
    ACCURACY = 'ACCURACY',            // Tỷ lệ Chính xác
    BIG_O_MASTER = 'BIG_O',           // Giải pháp Tối ưu (Big O)
    RUNE_COLLECTOR = 'RUNES',         // Sưu tầm Cổ ngữ
    WEEKLY = 'WEEKLY',                // Xếp hạng Tuần
    MONTHLY = 'MONTHLY',              // Xếp hạng Tháng
    ALL_TIME = 'ALL_TIME'             // Mọi thời đại
}

// Interface cho một mục trong bảng xếp hạng (Một user)
export interface LeaderboardEntry {
    rank: number;               // Thứ hạng (1, 2, 3...)
    playerId: string;           // ID người chơi
    playerName: string;         // Tên hiển thị
    avatar?: string;            // Avatar URL
    score: number;              // Điểm số xếp hạng

    // Các thông số thống kê bổ sung
    stats?: {
        questionsAnswered?: number; // Số câu đã trả lời
        dungeonsCleareed?: number;  // Số ải đã qua
        accuracy?: number;          // Tỷ lệ chính xác (%)
        avgCodeSpeed?: number;      // Tốc độ TB (ms)
        optimalSolutions?: number;  // Số giải pháp tối ưu
    };

    // Theo dõi thời gian
    lastUpdated: Date;          // Thời gian cập nhật lần cuối
    badge?: string;             // Huy hiệu đang đeo (ID)
    title?: string;             // Danh hiệu đang dùng
}

// Interface cho một Bảng Xếp Hạng
export interface Leaderboard {
    type: LeaderboardType;      // Loại bảng xếp hạng
    displayName: string;        // Tên hiển thị
    description: string;        // Mô tả
    icon: string;               // Icon hiển thị
    entries: LeaderboardEntry[];// Danh sách các entries
    lastRefresh: Date;          // Lần làm mới cuối cùng

    // Phần thưởng cho Top Rank
    rewards?: {
        rank: number;           // Top X (e.g., 1, 10, 100)
        oPoints: number;        // Thưởng O-Points
        logicStone: number;     // Thưởng Đá Logic
        badge?: string;         // Thưởng Huy hiệu
    }[];
}

// Mock leaderboard data (Sẽ được thay thế bằng API Backend)
export const MOCK_LEADERBOARDS: Record<LeaderboardType, Leaderboard> = {
    [LeaderboardType.CODE_SPEED]: {
        type: LeaderboardType.CODE_SPEED,
        displayName: '⚡ Tốc Độ Code',
        description: 'Thời gian thực thi code nhanh nhất',
        icon: '/assets/images/leaderboard/speed.png',
        entries: [
            {
                rank: 1,
                playerId: 'player1',
                playerName: 'CodeNinja',
                score: 1500,
                stats: { avgCodeSpeed: 250, questionsAnswered: 150 },
                lastUpdated: new Date(),
                badge: 'grandmaster',
                title: 'Speed Demon'
            },
            {
                rank: 2,
                playerId: 'player2',
                playerName: 'AlgoMaster',
                score: 1450,
                stats: { avgCodeSpeed: 280, questionsAnswered: 140 },
                lastUpdated: new Date(),
                badge: 'speedrunner'
            }
        ],
        lastRefresh: new Date(),
        rewards: [
            { rank: 1, oPoints: 1000, logicStone: 50, badge: 'weekly_champion' },
            { rank: 10, oPoints: 500, logicStone: 20 }
        ]
    },

    [LeaderboardType.ACCURACY]: {
        type: LeaderboardType.ACCURACY,
        displayName: '🎯 Tỷ Lệ Đúng',
        description: 'Tỷ lệ chính xác cao nhất',
        icon: '/assets/images/leaderboard/accuracy.png',
        entries: [
            {
                rank: 1,
                playerId: 'player3',
                playerName: 'Perfectionist',
                score: 9850, // 98.5%
                stats: { accuracy: 98.5, questionsAnswered: 200 },
                lastUpdated: new Date(),
                badge: 'perfectionist',
                title: 'The Perfect'
            }
        ],
        lastRefresh: new Date(),
        rewards: [
            { rank: 1, oPoints: 800, logicStone: 40 }
        ]
    },

    [LeaderboardType.BIG_O_MASTER]: {
        type: LeaderboardType.BIG_O_MASTER,
        displayName: '🧠 Big-O Master',
        description: 'Số giải pháp tối ưu nhiều nhất',
        icon: '/assets/images/leaderboard/bigo.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.RUNE_COLLECTOR]: {
        type: LeaderboardType.RUNE_COLLECTOR,
        displayName: '📚 Nhà Sưu Tầm',
        description: 'Số lượng cổ ngữ sưu tầm nhiều nhất',
        icon: '/assets/images/leaderboard/collector.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.WEEKLY]: {
        type: LeaderboardType.WEEKLY,
        displayName: '📅 Tuần Này',
        description: 'Người chơi xuất sắc nhất tuần',
        icon: '/assets/images/leaderboard/weekly.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.MONTHLY]: {
        type: LeaderboardType.MONTHLY,
        displayName: '📆 Tháng Này',
        description: 'Người chơi xuất sắc nhất tháng',
        icon: '/assets/images/leaderboard/monthly.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.ALL_TIME]: {
        type: LeaderboardType.ALL_TIME,
        displayName: '🏆 Mọi Thời Đại',
        description: 'Nhà vô địch mọi thời đại',
        icon: '/assets/images/leaderboard/alltime.png',
        entries: [],
        lastRefresh: new Date()
    }
};
