/**
 * Mô Hình Dữ Liệu Hầm Ngục và Quái Vật
 * Định nghĩa tất cả 7 hầm ngục (6 chương + endgame)
 */

import { QuestionType, BloomLevel } from './Question';

export const enum MonsterType {
    MINION = 'MINION',       // Quái nhỏ
    ELITE = 'ELITE',         // Quái mạnh hơn
    MINI_BOSS = 'MINI_BOSS', // Boss phụ của chương
    BOSS = 'BOSS'            // Boss chính của chương
}

export interface MonsterData {
    id: string;
    name: string;
    displayName: string;
    type: MonsterType;
    chapter: number;
    sprite: {
        idle: string;
        attack: string;
        hurt: string;
        death: string;
    };
    stats: {
        health: number;
        difficulty: number;      // 1-10
    };
    attackPattern: {
        questionTypes: QuestionType[];
        bloomLevels: BloomLevel[];
        questionCount: number;   // Bao nhiêu câu hỏi trong một cuộc gặp gỡ
    };
    lootTable: {
        dataWood: { min: number; max: number; chance: number };
        logicStone?: { min: number; max: number; chance: number };
        blueprints?: { id: string; chance: number }[];
    };
    aiAuraEnabled?: boolean;  // Cho Chế Độ Farm (câu hỏi sinh bởi ML)
    phases?: {
        threshold: number;    // Phần trăm HP để kích hoạt giai đoạn (ví dụ: 50%)
        message: string;      // "Golem nổi giận!"
        newAttackPattern?: {
            questionTypes: QuestionType[];
            bloomLevels: BloomLevel[];
            questionCount: number;
        };
    }[];
}

export interface DungeonPuzzle {
    id: string;
    type: 'SPELL_REQUIRED' | 'QUIZ' | 'ENVIRONMENTAL';
    description: string;
    requiredSpell?: string;   // Spell ID needed to solve
    requiredQuestion?: string; // Question ID to answer
    reward?: {
        dataWood?: number;
        oPoints?: number;
    };
}

export interface DungeonData {
    id: string;
    chapter: number;
    name: string;
    displayName: string;
    description: string;
    lore: string;             // Story context
    background: string;       // Background image
    music?: string;           // Background music
    unlockRequirement?: number; // Previous chapter needed

    monsters: {
        minions: MonsterData[];
        elites: MonsterData[];
        miniBoss?: MonsterData;
        boss: MonsterData;
    };

    puzzles: DungeonPuzzle[];

    layout: {
        rooms: number;
        difficulty: number;     // 1-10
    };

    firstClearRewards: {
        dataWood: number;
        logicStone: number;
        blueprints: string[];   // Blueprint IDs
    };

    farmMode: {
        enabled: boolean;       // Unlocked after first clear
        aiGeneratedQuestions: boolean;
    };
}

// Example: Dungeon 1 - Temple of Guidance
export const DUNGEON_1_TEMPLE: DungeonData = {
    id: 'dungeon_1',
    chapter: 1,
    name: 'Temple of Guidance',
    displayName: 'Đền Thờ Hướng Dẫn',
    description: 'Learn the foundations of algorithmic complexity',
    lore: 'The first fragment of the shattered Logic Network lies here, guarded by elementary constructs.',
    background: '/assets/images/dungeons/dungeon1_bg.png',

    monsters: {
        minions: [
            {
                id: 'logic_slime',
                name: 'Logic Slime',
                displayName: 'Logic Slime',
                type: MonsterType.MINION,
                chapter: 1,
                sprite: {
                    idle: '/assets/images/monsters/Quái Ải 1/Logic Slime(Quái Ải 1).png',
                    attack: '/assets/images/monsters/Quái Ải 1/Logic Slime(Quái Ải 1).png',
                    hurt: '/assets/images/monsters/Quái Ải 1/Logic Slime(Quái Ải 1).png',
                    death: '/assets/images/monsters/Quái Ải 1/Logic Slime(Quái Ải 1).png'
                },
                stats: { health: 100, difficulty: 1 },
                attackPattern: {
                    questionTypes: [QuestionType.MULTIPLE_CHOICE],
                    bloomLevels: [BloomLevel.REMEMBER],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 5, max: 10, chance: 1.0 },
                    blueprints: [
                        { id: 'rune_basic_complexity', chance: 0.3 }
                    ]
                }
            }
        ],
        elites: [
            {
                id: 'rune_golem',
                name: 'Rune Golem',
                displayName: 'Rune Golem',
                type: MonsterType.ELITE,
                chapter: 1,
                sprite: {
                    idle: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png',
                    attack: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png',
                    hurt: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png',
                    death: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png'
                },
                stats: { health: 200, difficulty: 3 },
                attackPattern: {
                    questionTypes: [QuestionType.MATCHING],
                    bloomLevels: [BloomLevel.REMEMBER, BloomLevel.UNDERSTAND],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 10, max: 20, chance: 1.0 },
                    blueprints: [
                        { id: 'rune_big_o', chance: 0.5 }
                    ]
                }
            }
        ],
        miniBoss: {
            id: 'analysis_gatekeeper',
            name: 'Analysis Gatekeeper',
            displayName: 'Kẻ Gác Cổng Phân Tích',
            type: MonsterType.MINI_BOSS,
            chapter: 1,
            sprite: {
                idle: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png',
                attack: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png',
                hurt: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png',
                death: '/assets/images/monsters/Quái Ải 1/Rune Golem(Quái Tinh Anh Ải 1).png'
            },
            stats: { health: 300, difficulty: 5 },
            attackPattern: {
                questionTypes: [QuestionType.FILL_BLANK],
                bloomLevels: [BloomLevel.ANALYZE],
                questionCount: 2
            },
            lootTable: {
                dataWood: { min: 20, max: 30, chance: 1.0 },
                logicStone: { min: 1, max: 2, chance: 0.5 }
            }
        },
        boss: {
            id: 'initialization_golem',
            name: 'Initialization Golem',
            displayName: 'Golem Khởi Tạo',
            type: MonsterType.BOSS,
            chapter: 1,
            sprite: {
                idle: '/assets/images/monsters/Quái Ải 1/The Initialization Golem(Boss Ải 1).png',
                attack: '/assets/images/monsters/Quái Ải 1/The Initialization Golem(Boss Ải 1).png',
                hurt: '/assets/images/monsters/Quái Ải 1/The Initialization Golem(Boss Ải 1).png',
                death: '/assets/images/monsters/Quái Ải 1/The Initialization Golem(Boss Ải 1).png'
            },
            stats: { health: 500, difficulty: 7 },
            attackPattern: {
                questionTypes: [QuestionType.PROGRAMMING],
                bloomLevels: [BloomLevel.APPLY],
                questionCount: 1
            },
            lootTable: {
                dataWood: { min: 50, max: 100, chance: 1.0 },
                logicStone: { min: 5, max: 10, chance: 1.0 },
                blueprints: [
                    { id: 'spell_is_increasing', chance: 1.0 }
                ]
            },
            phases: [
                {
                    threshold: 50,
                    message: "⚠️ SYSTEM WARNING: Initialization Golem is compiling defensive protocols!",
                    newAttackPattern: {
                        questionTypes: [QuestionType.PROGRAMMING],
                        bloomLevels: [BloomLevel.ANALYZE],
                        questionCount: 2
                    }
                }
            ]
        }
    },

    puzzles: [],

    layout: {
        rooms: 5,
        difficulty: 2
    },

    firstClearRewards: {
        dataWood: 100,
        logicStone: 10,
        blueprints: ['spell_is_increasing']
    },

    farmMode: {
        enabled: false, // Enabled after first clear
        aiGeneratedQuestions: false
    }
};

// More dungeons can be defined similarly
export const ALL_DUNGEONS: DungeonData[] = [
    DUNGEON_1_TEMPLE,
    // DUNGEON_2_CHAOS,
    // DUNGEON_3_CHAINED,
    // DUNGEON_4_DUAL,
    // DUNGEON_5_RECURSIVE,
    // DUNGEON_6_LIBRARY,
    // DUNGEON_7_CORRUPTED_CORE
];
