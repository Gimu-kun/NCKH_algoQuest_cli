/**
 * Mô Hình Dữ Liệu Leaderboard (Bảng Xếp Hạng)
 * Định nghĩa các loại ranking và player entry
 */

export enum LeaderboardType {
    CODE_SPEED = 'CODE_SPEED',        // Tốc độ code
    ACCURACY = 'ACCURACY',             // Tỷ lệ đúng
    BIG_O_MASTER = 'BIG_O',           // Optimal solutions
    RUNE_COLLECTOR = 'RUNES',          // Most runes
    WEEKLY = 'WEEKLY',                 // Weekly ranking
    MONTHLY = 'MONTHLY',               // Monthly ranking
    ALL_TIME = 'ALL_TIME'              // All-time ranking
}

export interface LeaderboardEntry {
    rank: number;
    playerId: string;
    playerName: string;
    avatar?: string;
    score: number;

    // Additional stats
    stats?: {
        questionsAnswered?: number;
        dungeonsCleareed?: number;
        accuracy?: number;
        avgCodeSpeed?: number; // milliseconds
        optimalSolutions?: number;
    };

    // Time tracking
    lastUpdated: Date;
    badge?: string; // Current equipped badge
    title?: string; // Current title
}

export interface Leaderboard {
    type: LeaderboardType;
    displayName: string;
    description: string;
    icon: string;
    entries: LeaderboardEntry[];
    lastRefresh: Date;

    // Rewards for top ranks
    rewards?: {
        rank: number; // e.g., top 10
        oPoints: number;
        logicStone: number;
        badge?: string;
    }[];
}

// Mock leaderboard data (sẽ được thay bằng API backend)
export const MOCK_LEADERBOARDS: Record<LeaderboardType, Leaderboard> = {
    [LeaderboardType.CODE_SPEED]: {
        type: LeaderboardType.CODE_SPEED,
        displayName: '⚡ Tốc Độ Code',
        description: 'Fastest code execution time',
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
        description: 'Highest accuracy rate',
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
        description: 'Most optimal solutions',
        icon: '/assets/images/leaderboard/bigo.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.RUNE_COLLECTOR]: {
        type: LeaderboardType.RUNE_COLLECTOR,
        displayName: '📚 Nhà Sưu Tầm',
        description: 'Most runes collected',
        icon: '/assets/images/leaderboard/collector.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.WEEKLY]: {
        type: LeaderboardType.WEEKLY,
        displayName: '📅 Tuần Này',
        description: 'Top players this week',
        icon: '/assets/images/leaderboard/weekly.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.MONTHLY]: {
        type: LeaderboardType.MONTHLY,
        displayName: '📆 Tháng Này',
        description: 'Top players this month',
        icon: '/assets/images/leaderboard/monthly.png',
        entries: [],
        lastRefresh: new Date()
    },

    [LeaderboardType.ALL_TIME]: {
        type: LeaderboardType.ALL_TIME,
        displayName: '🏆 Mọi Thời Đại',
        description: 'All-time champions',
        icon: '/assets/images/leaderboard/alltime.png',
        entries: [],
        lastRefresh: new Date()
    }
};
