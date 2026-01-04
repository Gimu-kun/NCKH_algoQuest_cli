/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HẦM NGỤC 1: ĐỀN THỜ HƯỚNG DẪN (Temple of Guidance)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu hình dữ liệu cho Chương 1.
 * Tập trung vào các khái niệm cơ bản về Độ phức tạp thuật toán (Big O).
 * 
 * QUÁI VẬT & CẤP ĐỘ BLOOM:
 * - Tier 1 (Remember): Logic Slime - Nhớ lại khái niệm.
 * - Tier 2 (Understand): Syntax Bat - Hiểu cú pháp/lỗi.
 * - Tier 3 (Apply): Rune Golem - Vận dụng tính toán đơn giản.
 * - Tier 4 (Analyze): Initialization Golem - Phân tích thuật toán.
 * 
 * @module Dungeon1Data
 * @category Game Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonData } from '../models/Dungeon';
import { MonsterType } from '../models/Dungeon';
import { QuestionType, BloomLevel } from '../models/Question';

export const DUNGEON_1_TEMPLE: DungeonData = {
    id: 'dungeon_1',
    chapter: 1,
    name: 'Temple of Guidance',
    displayName: 'Đền Thờ Hướng Dẫn',
    description: 'Học các nền tảng của độ phức tạp thuật toán và Big O.',
    lore: 'Mảnh vỡ đầu tiên của Mạng Lưới Logic nằm ở đây, được canh giữ bởi các cấu trúc sơ cấp.',
    background: '/src/assets/Ảnh Assets/Mở Đầu Sự Sụp Đổ (The Shattering).png',

    monsters: {
        minions: [
            // Tier 1 (R) - NHỚ (REMEMBER)
            {
                id: 'logic_slime',
                name: 'Logic Slime',
                displayName: 'Slime Logic',
                type: MonsterType.MINION,
                chapter: 1,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 1 (R) Logic Slime (Quái Thường)/Logic Slime (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 1 (R) Logic Slime (Quái Thường)/Logic Slime (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 1 (R) Logic Slime (Quái Thường)/Logic Slime (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 1 (R) Logic Slime (Quái Thường)/Logic Slime (Death).png'
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
            },
            // Tier 2 (U) - HIỂU (UNDERSTAND)
            {
                id: 'syntax_bat',
                name: 'Syntax Bat',
                displayName: 'Dơi Cú Pháp',
                type: MonsterType.MINION,
                chapter: 1,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 2 (U) Syntax Bat (Quái Biến Thể)/Syntax Bat (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 2 (U) Syntax Bat (Quái Biến Thể)/Syntax Bat (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 2 (U) Syntax Bat (Quái Biến Thể)/Syntax Bat (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 2 (U) Syntax Bat (Quái Biến Thể)/Syntax Bat (Death).png'
                },
                stats: { health: 150, difficulty: 2 },
                attackPattern: {
                    questionTypes: [QuestionType.FILL_BLANK],
                    bloomLevels: [BloomLevel.UNDERSTAND],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 8, max: 15, chance: 1.0 },
                    blueprints: [
                        { id: 'rune_syntax_check', chance: 0.4 }
                    ]
                }
            }
        ],
        elites: [
            // Tier 3 (AP) - VẬN DỤNG (APPLY)
            {
                id: 'rune_golem',
                name: 'Rune Golem',
                displayName: 'Người Đá Cổ Ngữ',
                type: MonsterType.ELITE,
                chapter: 1,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 3 (AP) Rune Golem (Quái Tinh Anh)/Rune Golem (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 3 (AP) Rune Golem (Quái Tinh Anh)/Rune Golem (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 3 (AP) Rune Golem (Quái Tinh Anh)/Rune Golem (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 3 (AP) Rune Golem (Quái Tinh Anh)/Rune Golem (Death).png'
                },
                stats: { health: 250, difficulty: 4 },
                attackPattern: {
                    questionTypes: [QuestionType.MATCHING],
                    bloomLevels: [BloomLevel.APPLY],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 15, max: 25, chance: 1.0 },
                    logicStone: { min: 1, max: 2, chance: 0.3 },
                    blueprints: [
                        { id: 'rune_big_o', chance: 0.5 }
                    ]
                }
            }
        ],
        // Không có mini-boss cho Chương 1, chỉ có 4 cấp độ
        // Tier 4 (AN) - PHÂN TÍCH (ANALYZE)
        boss: {
            id: 'initialization_golem',
            name: 'Initialization Golem',
            displayName: 'Golem Khởi Tạo',
            type: MonsterType.BOSS,
            chapter: 1,
            sprite: {
                idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 4 (AN) Initialization Golem (Boss)/Initialization Golem (Idle).png',
                attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 4 (AN) Initialization Golem (Boss)/Initialization Golem (Attack).png',
                hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 4 (AN) Initialization Golem (Boss)/Initialization Golem (Hurt).png',
                death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 1 ĐỀN THỜ HƯỚNG DẪN (CHƯƠNG 1)/Tier 4 (AN) Initialization Golem (Boss)/Initialization Golem (Death).png'
            },
            stats: { health: 500, difficulty: 7 },
            attackPattern: {
                questionTypes: [QuestionType.PROGRAMMING],
                bloomLevels: [BloomLevel.ANALYZE],
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
                    message: "⚠️ CẢNH BÁO HỆ THỐNG: Golem Khởi Tạo đang vào Giai đoạn 2! Độ phức tạp tăng lên!",
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
        enabled: false, // Mở sau khi clear lần đầu
        aiGeneratedQuestions: false
    }
};
