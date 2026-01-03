/**
 * Mô Hình Dữ Liệu Achievement (Thành Tựu) và Badge (Huy Hiệu)
 * Định nghĩa các thành tựu có thể mở khóa và huy hiệu
 */

export enum AchievementCategory {
    DUNGEON = 'DUNGEON',
    COMBAT = 'COMBAT',
    CODE = 'CODE',
    COLLECTION = 'COLLECTION',
    SOCIAL = 'SOCIAL',
    HIDDEN = 'HIDDEN'
}

export interface Achievement {
    id: string;
    name: string;
    displayName: string;
    description: string;
    category: AchievementCategory;
    icon: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    hidden: boolean;

    // Unlock criteria
    criteria: {
        type: 'DUNGEON_CLEAR' | 'QUESTIONS_CORRECT' | 'BOSS_DEFEAT' | 'SPELL_UNLOCK' | 'SPEEDRUN' | 'ACCURACY' | 'CODE_QUALITY';
        target: number | string;
        condition?: string; // e.g., "under 5 minutes", "100% accuracy"
    };

    // Rewards
    rewards: {
        oPoints?: number;
        logicStone?: number;
        badge?: string; // Badge ID
        title?: string; // Player title
    };
}

// Achievement definitions
export const ACHIEVEMENTS: Record<string, Achievement> = {
    FIRST_STEPS: {
        id: 'first_steps',
        name: 'firstSteps',
        displayName: '🎓 Bước Đầu Tiên',
        description: 'Hoàn thành Dungeon đầu tiên',
        category: AchievementCategory.DUNGEON,
        icon: '/assets/images/achievements/first_steps.png',
        rarity: 'COMMON',
        hidden: false,
        criteria: {
            type: 'DUNGEON_CLEAR',
            target: 1
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
        description: 'Hoàn thành dungeon dưới 5 phút',
        category: AchievementCategory.COMBAT,
        icon: '/assets/images/achievements/speedrunner.png',
        rarity: 'RARE',
        hidden: false,
        criteria: {
            type: 'SPEEDRUN',
            target: 300, // 5 minutes in seconds
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
        description: 'Đánh bại boss với 100% accuracy',
        category: AchievementCategory.COMBAT,
        icon: '/assets/images/achievements/perfect.png',
        rarity: 'EPIC',
        hidden: false,
        criteria: {
            type: 'ACCURACY',
            target: 100,
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
        description: 'Viết solution O(log n) hoặc tốt hơn',
        category: AchievementCategory.CODE,
        icon: '/assets/images/achievements/code_wizard.png',
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
        description: 'Mở khóa 10 phép thuật',
        category: AchievementCategory.COLLECTION,
        icon: '/assets/images/achievements/collector.png',
        rarity: 'RARE',
        hidden: false,
        criteria: {
            type: 'SPELL_UNLOCK',
            target: 10
        },
        rewards: {
            oPoints: 300,
            badge: 'collector'
        }
    },

    HIDDEN_MASTER: {
        id: 'hidden_master',
        name: 'hiddenMaster',
        displayName: '👁️ ???',
        description: 'Đánh bại Kẻ Tham Nhũng mà không dùng gợi ý',
        category: AchievementCategory.HIDDEN,
        icon: '/assets/images/achievements/hidden.png',
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

// Badge definitions
export interface Badge {
    id: string;
    name: string;
    displayName: string;
    description: string;
    icon: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    unlockedBy: string; // Achievement ID
}

export const BADGES: Record<string, Badge> = {
    apprentice: {
        id: 'apprentice',
        name: 'apprentice',
        displayName: '🎓 Học Viên',
        description: 'Hoàn thành dungeon đầu tiên',
        icon: '/assets/images/badges/apprentice.png',
        rarity: 'COMMON',
        unlockedBy: 'first_steps'
    },

    speedrunner: {
        id: 'speedrunner',
        name: 'speedrunner',
        displayName: '⚡ Tốc Hành',
        description: 'Bậc thầy tốc độ',
        icon: '/assets/images/badges/speedrunner.png',
        rarity: 'RARE',
        unlockedBy: 'speedrunner'
    },

    perfectionist: {
        id: 'perfectionist',
        name: 'perfectionist',
        displayName: '💯 Hoàn Hảo',
        description: 'Thực thi hoàn hảo',
        icon: '/assets/images/badges/perfectionist.png',
        rarity: 'EPIC',
        unlockedBy: 'perfectionist'
    },

    grandmaster: {
        id: 'grandmaster',
        name: 'grandmaster',
        displayName: '🧙 Đại Pháp Sư',
        description: 'Pháp sư thuật toán huyền thoại',
        icon: '/assets/images/badges/grandmaster.png',
        rarity: 'LEGENDARY',
        unlockedBy: 'code_wizard'
    },

    collector: {
        id: 'collector',
        name: 'collector',
        displayName: '📚 Sưu Tầm',
        description: 'Người sưu tầm phép thuật',
        icon: '/assets/images/badges/collector.png',
        rarity: 'RARE',
        unlockedBy: 'spell_collector'
    },

    hidden_master: {
        id: 'hidden_master',
        name: 'hiddenMaster',
        displayName: '👁️ Bí Mật',
        description: 'Bậc thầy lối đi bí mật',
        icon: '/assets/images/badges/hidden.png',
        rarity: 'LEGENDARY',
        unlockedBy: 'hidden_master'
    }
};
