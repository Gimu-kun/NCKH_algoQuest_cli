/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÔ HÌNH DỮ LIỆU NPC (Non-Player Character Data Model)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc dữ liệu cho các nhân vật NPC trong Hub World:
 * - Thông tin cơ bản (Tên, vai trò, địa điểm).
 * - Hệ thống hội thoại (Dialogue System).
 * - Hệ thống nhiệm vụ (Quest System) gắn liền với NPC.
 * 
 * KỸ THUẬT:
 * - Interface Chứa Đựng: `NPCData` chứa `quests` và `dialogues`.
 * - Role-Based Enum: Phân loại hành vi NPC qua `NPCRole`.
 * 
 * DANH SÁCH NPC CHÍNH:
 * - Professor Alric (Quest Giver)
 * - Sparky (AI Companion)
 * - Linh (Archivist/Library)
 * - Bork (Blacksmith/Shop)
 * 
 * @module NPCModel
 * @category Data Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export const enum NPCRole {
    QUEST_GIVER = 'QUEST',     // Người giao nhiệm vụ
    MERCHANT = 'SHOP',         // Thương nhân bán đồ
    TRAINER = 'TRAIN',         // Huấn luyện viên (Training Mode)
    GUILD_MASTER = 'GUILD',    // Quản lý bang hội
    ORACLE = 'BOSS',           // Tiên tri (Boss Events)
    ARCHIVIST = 'LIBRARY',     // Thủ thư (Lưu trữ/Leaderboards)
    COMPANION = 'HELPER'       // Đồng hành (AI Bot)
}

// Interface cho một dòng hội thoại
export interface DialogueLine {
    id: string;
    text: string;
    conditions?: string[];     // Điều kiện hiển thị dòng này (VD: "has_met_alric")
    nextId?: string;           // ID của dòng hội thoại tiếp theo (Chuỗi hội thoại)
}

// Yêu cầu của nhiệm vụ
export interface QuestRequirement {
    type: 'COMPLETE_DUNGEON' | 'ANSWER_QUESTIONS' | 'BUILD_SPELL' | 'COLLECT_ITEMS';
    target: string;            // ID đối tượng cần tác động (Dungeon ID, Spell ID...)
    count: number;             // Số lượng cần đạt
    chapter?: number;          // Chương (nếu áp dụng)
}

// Định nghĩa Nhiệm Vụ (Quest)
export interface Quest {
    id: string;
    name: string;
    description: string;
    type: 'CAMPAIGN' | 'DAILY' | 'SPONTANEOUS'; // Chiến dịch / Hàng ngày / Ngẫu nhiên
    requirements: QuestRequirement[];
    rewards: {
        gold?: number;
        dataWood?: number;
        logicStone?: number;
        oPoints?: number;
        blueprints?: string[];   // ID các Bản thiết kế được thưởng
    };
    chapter?: number;          // Chương liên quan (Cho Campaign Quest)
    active: boolean;           // Trạng thái kích hoạt
}

// Cấu trúc dữ liệu chính của NPC
export interface NPCData {
    id: string;
    name: string;              // Tên định danh (Internal)
    displayName: string;       // Tên hiển thị (Tiếng Việt)
    role: NPCRole;             // Vai trò
    description: string;       // Mô tả ngắn
    location: {                // Vị trí trong Hub
        x: number;
        y: number;
        zone: string;          // Khu vực (e.g., 'CENTRAL_PLAZA')
    };
    sprite: {
        idle: string;          // Ảnh động khi chờ
        talk: string;          // Ảnh động khi nói chuyện
    };
    dialogues: DialogueLine[]; // Danh sách hội thoại
    quests?: Quest[];          // Các nhiệm vụ NPC này cung cấp
    shop?: {
        items: string[];       // ID các vật phẩm bán (Referencing Item IDs)
    };
    features?: string[];       // Tính năng đặc biệt kích hoạt khi tương tác
    // (e.g., "TRAINING_AREA", "UGC")
}

// Các NPC Định Nghĩa Sẵn (Presetted NPCs)
export const NPCS: Record<string, Omit<NPCData, 'quests'>> = {
    ALRIC: {
        id: 'professor_alric',
        name: 'Professor Alric',
        displayName: 'Giáo sư Alric',
        role: NPCRole.QUEST_GIVER,
        description: 'Giáo sư thông thái dẫn dắt hành trình của bạn qua 6 chương.',
        location: { x: 400, y: 300, zone: 'CENTRAL_PLAZA' },
        sprite: {
            idle: '/assets/Ảnh Assets/Nhân vật/Giáo Sư Alric (The Mentor)/Giáo Sư Alric (Idle).png',
            talk: '/assets/Ảnh Assets/Nhân vật/Giáo Sư Alric (The Mentor)/Giáo Sư Alric (Talk).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Chào mừng, Học Việc! Mạng Lưới Logic đã bị Kẻ Hủy Diệt phá vỡ. Bạn phải khôi phục nó bằng cách làm chủ các thuật toán!',
                nextId: 'quest_intro'
            },
            {
                id: 'quest_intro',
                text: 'Hãy bắt đầu hành trình tại Đền Thờ Hướng Dẫn. Học các nền tảng của tư duy thuật toán.',
            }
        ],
        features: ['CAMPAIGN_QUESTS']
    },

    SPARKY: {
        id: 'sparky',
        name: 'Sparky',
        displayName: 'Sparky (Bot ML)',
        role: NPCRole.COMPANION,
        description: 'Một mảnh vỡ AI của Lõi Logic đã vỡ, trợ lý ML cá nhân của bạn.',
        location: { x: 0, y: -50, zone: 'FOLLOWS_PLAYER' }, // Bay phía trên người chơi
        sprite: {
            idle: '/assets/Ảnh Assets/Nhân vật/Sparky/Sparky (Normal).png',
            talk: '/assets/Ảnh Assets/Nhân vật/Sparky/Sparky (Alert).png'
        },
        dialogues: [
            {
                id: 'intro',
                text: '💡 Xin chào! Mình là Sparky, một mảnh vỡ của Lõi Logic. Mình sẽ giúp bạn học và sửa lỗi code!',
            },
            {
                id: 'hint_syntax',
                text: '💡 Ấy chết! Phát hiện lỗi cú pháp. Nhớ kiểm tra dấu chấm phẩy và ngoặc nhé!',
            }
        ],
        features: ['AI_HINTS', 'ERROR_DETECTION', 'CONTENT_GENERATION']
    },

    LINH: {
        id: 'linh_archivist',
        name: 'Linh',
        displayName: 'Linh (Thủ Thư)',
        role: NPCRole.ARCHIVIST,
        description: 'Người bảo vệ Thư Viện Vô Tận, quản lý huấn luyện và nội dung người dùng.',
        location: { x: 200, y: 500, zone: 'LIBRARY' },
        sprite: {
            idle: '/assets/Ảnh Assets/Nhân vật/Linh (The Archivist)/Linh (Idle).png',
            talk: '/assets/Ảnh Assets/Nhân vật/Linh (The Archivist)/Linh (Talk).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Chào mừng đến với Thư Viện Vô Tận. Tại đây bạn có thể luyện tập bất kỳ chủ đề nào hoặc tạo nội dung của riêng mình.',
            }
        ],
        features: ['TRAINING_AREA', 'UGC', 'QUESTION_CRAFTER', 'TEST_CRAFTER']
    },

    BORK: {
        id: 'bork_blacksmith',
        name: 'Bork',
        displayName: 'Bork (Thợ Rèn)',
        role: NPCRole.MERCHANT,
        description: 'Thợ rèn cộc cằn chuyên bán đồ trang trí và trang phục.',
        location: { x: 600, y: 400, zone: 'FORGE' },
        sprite: {
            idle: '/assets/Ảnh Assets/Nhân vật/Bork (The Blacksmith)/Bork (Idle).png',
            talk: '/assets/Ảnh Assets/Nhân vật/Bork (The Blacksmith)/Bork (Talk).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Grr! Tìm đồ trang trí cho Trang Trại Logic hả? Ta có những thiết kế xịn nhất đây!',
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
        description: 'Quản lý các hoạt động nhiều người chơi và nhiệm vụ hàng ngày.',
        location: { x: 500, y: 200, zone: 'ARENA' },
        sprite: {
            idle: '/assets/Ảnh Assets/Nhân vật/Thủ Lĩnh Guild (The Guild Leader)/Thủ Lĩnh Guild (Idle).png',
            talk: '/assets/Ảnh Assets/Nhân vật/Thủ Lĩnh Guild (The Guild Leader)/Thủ Lĩnh Guild (Talk).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Sẵn sàng thử sức với người khác chưa? Tham gia Đấu Trường hoặc lập Guild ngay!',
            }
        ],
        features: ['MULTIPLAYER', 'DAILY_QUESTS', 'CLASSROOM_MODE']
    },

    ORACLE: {
        id: 'oracle',
        name: 'The Oracle',
        displayName: 'Nhà Tiên Tri',
        role: NPCRole.ORACLE,
        description: 'Thông báo các sự kiện trùm và thử thách thế giới.',
        location: { x: 400, y: 100, zone: 'OBSERVATORY' },
        sprite: {
            idle: '/assets/Ảnh Assets/Nhân vật/Nhà Tiên Tri (The Oracle)/Nhà Tiên Tri (Idle).png',
            talk: '/assets/Ảnh Assets/Nhân vật/Nhà Tiên Tri (The Oracle)/Nhà Tiên Tri (Talk).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Các vì sao tiên đoán những thử thách lớn phía trước. Hãy đối mặt với trùm hàng ngày, hàng tuần và thế giới!',
            }
        ],
        features: ['BOSS_EVENTS']
    },

    BOOKKEEPER: {
        id: 'bookkeeper',
        name: 'The Bookkeeper',
        displayName: 'Kẻ Giữ Sách',
        role: NPCRole.ARCHIVIST,
        description: 'Duy trì bảng xếp hạng và hồ sơ thành tựu.',
        location: { x: 300, y: 600, zone: 'HALL_OF_FAME' },
        sprite: {
            idle: '/assets/Ảnh Assets/Nhân vật/Kẻ Giữ Sách ( The Bookkeeper)/Kẻ Giữ Sách (Idle).png',
            talk: '/assets/Ảnh Assets/Nhân vật/Kẻ Giữ Sách ( The Bookkeeper)/Kẻ Giữ Sách (Talk).png'
        },
        dialogues: [
            {
                id: 'greeting',
                text: 'Chiến công của bạn được ghi lại tại đây. Kiểm tra thứ hạng và thành tựu của bạn đi!',
            }
        ],
        features: ['LEADERBOARDS', 'ACHIEVEMENTS']
    }
};
