/**
 * Mô Hình Dữ Liệu NPC
 * Định nghĩa tất cả 7 NPC trong Thế Giới Trung Tâm
 */

export const enum NPCRole {
    QUEST_GIVER = 'QUEST',
    MERCHANT = 'SHOP',
    TRAINER = 'TRAIN',
    GUILD_MASTER = 'GUILD',
    ORACLE = 'BOSS',
    ARCHIVIST = 'LIBRARY',
    COMPANION = 'HELPER'
}

export interface DialogueLine {
    id: string;
    text: string;
    conditions?: string[];     // Điều kiện tùy chọn để hiển thị hội thoại này
    nextId?: string;           // Liên kết đến hội thoại tiếp theo
}

export interface QuestRequirement {
    type: 'COMPLETE_DUNGEON' | 'ANSWER_QUESTIONS' | 'BUILD_SPELL' | 'COLLECT_ITEMS';
    target: string;
    count: number;
    chapter?: number;
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    type: 'CAMPAIGN' | 'DAILY' | 'SPONTANEOUS';
    requirements: QuestRequirement[];
    rewards: {
        dataWood?: number;
        logicStone?: number;
        oPoints?: number;
        blueprints?: string[];   // ID các Bản thiết kế
    };
    chapter?: number;          // Cho các nhiệm vụ chiến dịch
    active: boolean;
}

export interface NPCData {
    id: string;
    name: string;
    displayName: string;       // Tên hiển thị tiếng Việt
    role: NPCRole;
    description: string;
    location: {
        x: number;
        y: number;
        zone: string;            // Khu vực trong Thế Giới Trung Tâm
    };
    sprite: {
        idle: string;            // Đường dẫn đến animation chờ
        talk: string;            // Đường dẫn đến animation nói chuyện
    };
    dialogues: DialogueLine[];
    quests?: Quest[];          // Các nhiệm vụ NPC này cung cấp
    shop?: {
        items: string[];         // ID các vật phẩm có sẵn
    };
    features?: string[];       // Tính năng đặc biệt (ví dụ: "TRAINING_AREA", "UGC")
}

// Các NPC Định Nghĩa Sẵn
export const NPCS: Record<string, Omit<NPCData, 'quests'>> = {
    ALRIC: {
        id: 'professor_alric',
        name: 'Professor Alric',
        displayName: 'Giáo sư Alric',
        role: NPCRole.QUEST_GIVER,
        description: 'The wise professor who guides your journey through the 6 chapters',
        location: { x: 400, y: 300, zone: 'CENTRAL_PLAZA' },
        sprite: {
            idle: '/assets/images/characters/Professor Alric.png',
            talk: '/assets/images/characters/Professor Alric.png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Welcome, Apprentice! The Logic Network has been shattered by The Corruptor. You must restore it by mastering the algorithms!',
                nextId: 'quest_intro'
            },
            {
                id: 'quest_intro',
                text: 'Begin your journey in the Temple of Guidance. Learn the foundations of algorithmic thinking.',
            }
        ],
        features: ['CAMPAIGN_QUESTS']
    },

    SPARKY: {
        id: 'sparky',
        name: 'Sparky',
        displayName: 'Sparky (Bot ML)',
        role: NPCRole.COMPANION,
        description: 'An AI fragment of the shattered Logic Core, your personal ML assistant',
        location: { x: 0, y: -50, zone: 'FOLLOWS_PLAYER' }, // Floats above player
        sprite: {
            idle: '/assets/images/Nhân vật/Sparky/Sparky Normal.png',
            talk: '/assets/images/Nhân vật/Sparky/Sparky Alert.png'
        },
        dialogues: [
            {
                id: 'intro',
                text: '💡 Hi! I\'m Sparky, a fragment of the Logic Core. I\'ll help you learn and debug your code!',
            },
            {
                id: 'hint_syntax',
                text: '💡 Oops! Syntax error detected. Remember to check your semicolons and brackets!',
            }
        ],
        features: ['AI_HINTS', 'ERROR_DETECTION', 'CONTENT_GENERATION']
    },

    LINH: {
        id: 'linh_archivist',
        name: 'Linh',
        displayName: 'Linh (The Archivist)',
        role: NPCRole.ARCHIVIST,
        description: 'Guardian of the Infinite Library, manages training and UGC',
        location: { x: 200, y: 500, zone: 'LIBRARY' },
        sprite: {
            idle: '/assets/images/characters/Linh (The Archivist).png',
            talk: '/assets/images/characters/Linh (The Archivist).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Welcome to the Infinite Library. Here you can practice any topic or create your own content.',
            }
        ],
        features: ['TRAINING_AREA', 'UGC', 'QUESTION_CRAFTER', 'TEST_CRAFTER']
    },

    BORK: {
        id: 'bork_blacksmith',
        name: 'Bork',
        displayName: 'Bork (The Blacksmith)',
        role: NPCRole.MERCHANT,
        description: 'The gruff blacksmith who sells decorations and cosmetics',
        location: { x: 600, y: 400, zone: 'FORGE' },
        sprite: {
            idle: '/assets/images/characters/Bork (The Blacksmith).png',
            talk: '/assets/images/characters/Bork (The Blacksmith).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Grr! Looking for some decorations for your Logic Farm? I\'ve got the finest designs!',
            }
        ],
        shop: {
            items: ['fence_logic', 'golem_statue', 'quicksort_robe', 'recursion_hat']
        },
        features: ['SHOP']
    },

    GUILD_LEADER: {
        id: 'guild_leader',
        name: 'Guild Leader',
        displayName: 'Thủ Lĩnh Guild',
        role: NPCRole.GUILD_MASTER,
        description: 'Manages multiplayer activities and daily quests',
        location: { x: 500, y: 200, zone: 'ARENA' },
        sprite: {
            idle: '/assets/images/characters/Guild Leader.png',
            talk: '/assets/images/characters/Guild Leader.png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Ready to test your skills against others? Join the Arena or form a Guild!',
            }
        ],
        features: ['MULTIPLAYER', 'DAILY_QUESTS', 'CLASSROOM_MODE']
    },

    ORACLE: {
        id: 'oracle',
        name: 'The Oracle',
        displayName: 'Nhà Tiên Tri',
        role: NPCRole.ORACLE,
        description: 'Announces boss events and world challenges',
        location: { x: 400, y: 100, zone: 'OBSERVATORY' },
        sprite: {
            idle: '/assets/images/characters/Guild Leader.png',
            talk: '/assets/images/characters/Guild Leader.png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'The stars foretell great challenges ahead. Face the daily, weekly, and world bosses!',
            }
        ],
        features: ['BOSS_EVENTS']
    },

    BOOKKEEPER: {
        id: 'bookkeeper',
        name: 'The Bookkeeper',
        displayName: 'Kẻ Giữ Sách',
        role: NPCRole.ARCHIVIST,
        description: 'Maintains leaderboards and achievement records',
        location: { x: 300, y: 600, zone: 'HALL_OF_FAME' },
        sprite: {
            idle: '/assets/images/characters/Guild Leader.png',
            talk: '/assets/images/characters/Guild Leader.png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Your deeds are recorded here. Check your rank and achievements!',
            }
        ],
        features: ['LEADERBOARDS', 'ACHIEVEMENTS']
    }
};
