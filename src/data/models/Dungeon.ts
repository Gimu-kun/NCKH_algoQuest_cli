/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÔ HÌNH DỮ LIỆU HẦM NGỤC (Dungeon Data Model)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc dữ liệu cho hệ thống Dungeon và Monster:
 * - Monster Data: Thông tin quái vật (Stats, Sprite, Behavior).
 * - Dungeon Puzzle: Câu đố trong ải.
 * - Dungeon Data: Cấu hình tổng thể của một hầm ngục (Chapter, Difficulty, Rewards).
 * 
 * KỸ THUẬT:
 * - TypeScript Interfaces: Định nghĩa kiểu dữ liệu chặt chẽ.
 * - Enums: Quản lý các hằng số (MonsterType).
 * 
 * CẤU TRÚC PHÂN CẤP:
 * DungeonData -> Monsters (Minions, Elites, Boss) -> AttackPattern -> QuestionTypes.
 * 
 * @module DungeonModel
 * @category Data Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { QuestionType, BloomLevel } from './Question';

// Phân loại quái vật theo độ khó/vai trò
export const enum MonsterType {
    MINION = 'MINION',       // Quái thường (Gặp nhiều)
    ELITE = 'ELITE',         // Quái tinh nhuệ (Hiếm, drop xịn)
    MINI_BOSS = 'MINI_BOSS', // Trùm phụ
    BOSS = 'BOSS'            // Trùm cuối chương
}

// Cấu trúc dữ liệu của một Quái Vật
export interface MonsterData {
    id: string;              // Unique ID (e.g., 'logic_slime')
    name: string;            // Tên tiếng Anh (Internal reference)
    displayName: string;     // Tên hiển thị (Tiếng Việt)
    type: MonsterType;       // Phân loại
    chapter: number;         // Chương xuất hiện
    sprite: {
        idle: string;        // Animation chờ
        attack: string;      // Animation tấn công
        hurt: string;        // Animation bị thương
        death: string;       // Animation chết
    };
    stats: {
        health: number;      // Máu tối đa
        difficulty: number;  // Độ khó (1-10) để cân bằng game
    };
    attackPattern: {
        questionTypes: QuestionType[]; // Loại câu hỏi quái này dùng để tấn công
        bloomLevels: BloomLevel[];     // Độ khó câu hỏi (Bloom Taxonomy)
        questionCount: number;         // Số câu hỏi phải trả lời để thắng
    };
    lootTable: {
        dataWood: { min: number; max: number; chance: number };     // Droprate Gỗ
        logicStone?: { min: number; max: number; chance: number };  // Droprate Đá Logic
        blueprints?: { id: string; chance: number }[];              // Droprate Bản thiết kế
    };
    aiAuraEnabled?: boolean;  // Nếu true -> Câu hỏi được sinh bởi AI (Endgame)
    phases?: {                // Các giai đoạn của Boss (Phase 2, 3...)
        threshold: number;    // % HP kích hoạt (e.g., 50%)
        message: string;      // Thông báo (e.g., "Golem Nổi Giận!")
        newAttackPattern?: {
            questionTypes: QuestionType[];
            bloomLevels: BloomLevel[];
            questionCount: number;
        };
    }[];
}

// Cấu trúc Puzzle/Câu đố trong Dungeon
export interface DungeonPuzzle {
    id: string;
    type: 'SPELL_REQUIRED' | 'QUIZ' | 'ENVIRONMENTAL';
    description: string;
    requiredSpell?: string;   // ID phép thuật cần dùng để giải (e.g., 'unlock_door')
    requiredQuestion?: string; // ID câu hỏi cụ thể
    reward?: {
        dataWood?: number;
        oPoints?: number;
    };
}

// Cấu trúc dữ liệu tổng thể của một Dungeon
export interface DungeonData {
    id: string;                 // ID (e.g., 'dungeon_1')
    chapter: number;            // Chương số
    name: string;               // Tên tiếng Anh
    displayName: string;        // Tên hiển thị tiếng Việt
    description: string;        // Mô tả ngắn
    lore: string;               // Cốt truyện đằng sau Dungeon
    background: string;         // Đường dẫn ảnh nền
    music?: string;             // Nhạc nền (Future)
    unlockRequirement?: number; // Cần hoàn thành chapter X để mở

    monsters: {
        minions: MonsterData[]; // Danh sách quái thường
        elites: MonsterData[];  // Danh sách quái tinh nhuệ
        miniBoss?: MonsterData; // Trùm phụ (nếu có)
        boss: MonsterData;      // Trùm cuối
    };

    puzzles: DungeonPuzzle[];   // Danh sách câu đố

    layout: {
        rooms: number;          // Tổng số phòng dự kiến
        difficulty: number;     // Độ khó tổng thể (1-10)
    };

    firstClearRewards: {        // Phần thưởng hoàn thành lần đầu (First Clear Bonus)
        dataWood: number;
        logicStone: number;
        blueprints: string[];   // ID các phép thuật được mở khóa
    };

    farmMode: {                 // Chế độ cày cuốc (Replayability)
        enabled: boolean;       // Mở sau khi clear lần đầu
        aiGeneratedQuestions: boolean; // Dùng AI sinh câu hỏi không giới hạn
    };
}

/**
 * LƯU Ý: Dữ liệu thực tế được tách ra các file riêng trong `src/data/dungeons/`:
 * - `dungeon1-data.ts`: Dữ liệu Đền Thờ Hướng Dẫn
 * - `dungeon2-data.ts`: Dữ liệu Đền Thờ Hỗn Loạn
 * ...
 */
