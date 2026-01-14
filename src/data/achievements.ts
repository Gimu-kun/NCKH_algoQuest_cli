/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÔ HÌNH DỮ LIỆU THÀNH TỰU & HUY HIỆU (Achievement & Badge Data Model)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa tất cả các thành tựu (Achievements) và huy hiệu (Badges) trong game.
 * Đây là core của hệ thống Gamification.
 * 
 * KỸ THUẬT:
 * - Achievement Criteria: Định nghĩa điều kiện unlock (Type, Target).
 * - Reward System: Liên kết achievement với phần thưởng (O-Points, Badges).
 * 
 * LOẠI THÀNH TỰU:
 * - DUNGEON: Liên quan đến hoàn thành ải.
 * - COMBAT: Liên quan đến chiến đấu (Accuracy, No Hints).
 * - CODE: Liên quan đến chất lượng code (Big O).
 * - SOCIAL: Liên quan đến tương tác (Leaderboard).
 * 
 * @module AchievementData
 * @category Data Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

<<<<<<< HEAD
import { ASSETS } from './AssetPaths';

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
export enum AchievementCategory {
    DUNGEON = 'DUNGEON',       // Thám hiểm hầm ngục
    COMBAT = 'COMBAT',         // Chiến đấu
    CODE = 'CODE',             // Lập trình & Thuật toán
    COLLECTION = 'COLLECTION', // Sưu tầm (Spells/Runes)
    SOCIAL = 'SOCIAL',         // Xã hội (Ranking)
    HIDDEN = 'HIDDEN'          // Bí mật
}

// Interface định nghĩa Thành Tựu
export interface Achievement {
    id: string;
    name: string;               // Tên nội bộ
    displayName: string;        // Tên hiển thị
    description: string;        // Mô tả cách đạt được
    category: AchievementCategory;
    icon: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'; // Độ hiếm
    hidden: boolean;            // Ẩn nếu chưa mở khóa?

    // Tiêu chí Mở khóa (Unlock criteria)
    criteria: {
        type: 'DUNGEON_CLEAR' | 'QUESTIONS_CORRECT' | 'BOSS_DEFEAT' | 'SPELL_UNLOCK' | 'SPEEDRUN' | 'ACCURACY' | 'CODE_QUALITY';
        target: number | string;   // Mục tiêu (Value hoặc ID)
        condition?: string;        // Điều kiện phụ (e.g., "under 5 minutes", "100% accuracy")
    };

    // Phần thưởng (Rewards)
    rewards: {
        oPoints?: number;          // Điểm O
        logicStone?: number;       // Đá Logic
        badge?: string;            // ID Huy hiệu (nếu có)
        title?: string;            // Danh hiệu người chơi (Player Title)
    };
}

// Định nghĩa Danh sách Thành Tựu
<<<<<<< HEAD

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
export const ACHIEVEMENTS: Record<string, Achievement> = {
    FIRST_STEPS: {
        id: 'first_steps',
        name: 'firstSteps',
        displayName: '🎓 Bước Đầu Tiên',
        description: 'Hoàn thành Dungeon đầu tiên.',
        category: AchievementCategory.DUNGEON,
<<<<<<< HEAD
        icon: ASSETS.UI.BUTTON_QUEST,
=======
        icon: '/assets/images/achievements/first_steps.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'COMMON',
        hidden: false,
        criteria: {
            type: 'DUNGEON_CLEAR',
            target: 1 // 1 Dungeon
        },
        rewards: {
            oPoints: 100,
            badge: 'apprentice'
        }
    },

    SPEEDRUNNER: {
        id: 'speedrunner',
        name: 'speedrunner',
        displayName: '⚡ Tốc Hành Gia',
        description: 'Hoàn thành dungeon dưới 5 phút.',
        category: AchievementCategory.COMBAT,
<<<<<<< HEAD
        icon: ASSETS.UI.BUTTON_MAP,
=======
        icon: '/assets/images/achievements/speedrunner.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'RARE',
        hidden: false,
        criteria: {
            type: 'SPEEDRUN',
            target: 300, // 300 giây = 5 phút
            condition: 'any_dungeon'
        },
        rewards: {
            oPoints: 200,
            logicStone: 5,
            badge: 'speedrunner'
        }
    },

    PERFECTIONIST: {
        id: 'perfectionist',
        name: 'perfectionist',
        displayName: '💯 Người Hoàn Hảo',
        description: 'Đánh bại boss với độ chính xác 100%.',
        category: AchievementCategory.COMBAT,
<<<<<<< HEAD
        icon: ASSETS.UI.SKILL_FRAME,
=======
        icon: '/assets/images/achievements/perfect.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'EPIC',
        hidden: false,
        criteria: {
            type: 'ACCURACY',
            target: 100, // 100%
            condition: 'boss_fight'
        },
        rewards: {
            oPoints: 500,
            logicStone: 10,
            badge: 'perfectionist',
            title: 'The Perfect'
        }
    },

    CODE_WIZARD: {
        id: 'code_wizard',
        name: 'codeWizard',
        displayName: '🧙 Đại Pháp Sư',
        description: 'Viết giải pháp với độ phức tạp tối ưu O(log n) hoặc tốt hơn.',
        category: AchievementCategory.CODE,
<<<<<<< HEAD
        icon: ASSETS.UI.CODING_CONSOLE,
=======
        icon: '/assets/images/achievements/code_wizard.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'LEGENDARY',
        hidden: false,
        criteria: {
            type: 'CODE_QUALITY',
            target: 'O(log n)',
            condition: 'optimal_solution'
        },
        rewards: {
            oPoints: 1000,
            logicStone: 50,
            badge: 'grandmaster',
            title: 'Grand Wizard'
        }
    },

    SPELL_COLLECTOR: {
        id: 'spell_collector',
        name: 'spellCollector',
        displayName: '📚 Nhà Sưu Tầm',
        description: 'Mở khóa 10 phép thuật khác nhau.',
        category: AchievementCategory.COLLECTION,
<<<<<<< HEAD
        icon: ASSETS.UI.BUTTON_BAG,
=======
        icon: '/assets/images/achievements/collector.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'RARE',
        hidden: false,
        criteria: {
            type: 'SPELL_UNLOCK',
            target: 10 // 10 Spells
        },
        rewards: {
            oPoints: 300,
            badge: 'collector'
        }
    },

    HIDDEN_MASTER: {
        id: 'hidden_master',
        name: 'hiddenMaster',
        displayName: '👁️ ???', // Tên ẩn
        description: 'Đánh bại Kẻ Tham Nhũng mà không dùng bất kỳ gợi ý nào.',
        category: AchievementCategory.HIDDEN,
<<<<<<< HEAD
        icon: ASSETS.LOGO,
=======
        icon: '/assets/images/achievements/hidden.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'LEGENDARY',
        hidden: true,
        criteria: {
            type: 'BOSS_DEFEAT',
            target: 'the_corruptor',
            condition: 'no_hints'
        },
        rewards: {
            oPoints: 2000,
            logicStone: 100,
            badge: 'hidden_master',
            title: 'Master of Secrets'
        }
    }
};

// Interface định nghĩa Huy Hiệu (Badge)
export interface Badge {
    id: string;
    name: string;
    displayName: string;
    description: string;
    icon: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    unlockedBy: string; // ID của Achievement mở khóa badge này
}

// Danh sách Huy Hiệu
export const BADGES: Record<string, Badge> = {
    apprentice: {
        id: 'apprentice',
        name: 'apprentice',
        displayName: '🎓 Học Viên',
        description: 'Hoàn thành dungeon đầu tiên.',
<<<<<<< HEAD
        icon: ASSETS.UI.BUTTON_QUEST,
=======
        icon: '/assets/images/badges/apprentice.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'COMMON',
        unlockedBy: 'first_steps'
    },

    speedrunner: {
        id: 'speedrunner',
        name: 'speedrunner',
        displayName: '⚡ Tốc Hành',
        description: 'Bậc thầy tốc độ.',
<<<<<<< HEAD
        icon: ASSETS.UI.BUTTON_MAP,
=======
        icon: '/assets/images/badges/speedrunner.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'RARE',
        unlockedBy: 'speedrunner'
    },

    perfectionist: {
        id: 'perfectionist',
        name: 'perfectionist',
        displayName: '💯 Hoàn Hảo',
        description: 'Thực thi không tì vết.',
<<<<<<< HEAD
        icon: ASSETS.UI.SKILL_FRAME,
=======
        icon: '/assets/images/badges/perfectionist.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'EPIC',
        unlockedBy: 'perfectionist'
    },

    grandmaster: {
        id: 'grandmaster',
        name: 'grandmaster',
        displayName: '🧙 Đại Pháp Sư',
        description: 'Huyền thoại của giới thuật toán.',
<<<<<<< HEAD
        icon: ASSETS.UI.CODING_CONSOLE,
=======
        icon: '/assets/images/badges/grandmaster.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'LEGENDARY',
        unlockedBy: 'code_wizard'
    },

    collector: {
        id: 'collector',
        name: 'collector',
        displayName: '📚 Sưu Tầm',
        description: 'Người đam mê sưu tập phép thuật.',
<<<<<<< HEAD
        icon: ASSETS.UI.BUTTON_BAG,
=======
        icon: '/assets/images/badges/collector.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'RARE',
        unlockedBy: 'spell_collector'
    },

    hidden_master: {
        id: 'hidden_master',
        name: 'hiddenMaster',
        displayName: '👁️ Bí Mật',
        description: 'Bậc thầy của những lối đi ẩn.',
<<<<<<< HEAD
        icon: ASSETS.LOGO,
=======
        icon: '/assets/images/badges/hidden.png',
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        rarity: 'LEGENDARY',
        unlockedBy: 'hidden_master'
    }
};
