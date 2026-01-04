/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HẦM NGỤC 2: ĐỀN THỜ HỖN LOẠN (Temple of Chaos)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu hình dữ liệu cho Chương 2.
 * Tập trung vào các thuật toán Sắp xếp (Sorting) và Tìm kiếm (Searching).
 * 
 * QUÁI VẬT & CẤP ĐỘ BLOOM:
 * - Tier 1 (Remember): Unsorted Book - Nhớ khái niệm sắp xếp.
 * - Tier 2 (Understand): Index Spider - Hiểu về chỉ mục (index).
 * - Tier 3 (Apply): Binary Sentry - Vận dụng Tìm kiếm nhị phân.
 * - Tier 4 (Analyze): The Chaotic Boss - Phân tích hiệu quả thuật toán.
 * 
 * @module Dungeon2Data
 * @category Game Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonData } from '../models/Dungeon';
import { MonsterType } from '../models/Dungeon';
import { QuestionType, BloomLevel } from '../models/Question';

export const DUNGEON_2_CHAOS: DungeonData = {
    id: 'dungeon_2',
    chapter: 2,
    name: 'Temple of Chaos',
    displayName: 'Đền Thờ Hỗn Loạn',
    description: 'Làm chủ các thuật toán tìm kiếm và sắp xếp trong sự hỗn loạn.',
    lore: 'Mảnh vỡ thứ hai nằm trong ngôi đền nơi trật tự đã bị biến chất thành hỗn mang.',
    background: '/src/assets/Ảnh Assets/Main Menu Background.png', // Background tạm thời

    monsters: {
        minions: [
            // Tier 1 (R) - Sách Chưa Xếp (Unsorted Book)
            {
                id: 'unsorted_book',
                name: 'Unsorted Book',
                displayName: 'Sách Chưa Xếp',
                type: MonsterType.MINION,
                chapter: 2,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 1 (R) Unsorted Book (Quái Thường)/Unsorted Book (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 1 (R) Unsorted Book (Quái Thường)/Unsorted Book (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 1 (R) Unsorted Book (Quái Thường)/Unsorted Book (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 1 (R) Unsorted Book (Quái Thường)/Unsorted Book (Death).png'
                },
                stats: { health: 120, difficulty: 2 },
                attackPattern: {
                    questionTypes: [QuestionType.MULTIPLE_CHOICE],
                    bloomLevels: [BloomLevel.REMEMBER],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 7, max: 12, chance: 1.0 }
                }
            },
            // Tier 2 (U) - Nhện Chỉ Mục (Index Spider)
            {
                id: 'index_spider',
                name: 'Index Spider',
                displayName: 'Nhện Chỉ Mục',
                type: MonsterType.MINION,
                chapter: 2,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 2 (U) Index Spider (Quái Biến Thể)/Index Spider (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 2 (U) Index Spider (Quái Biến Thể)/Index Spider (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 2 (U) Index Spider (Quái Biến Thể)/Index Spider (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 2 (U) Index Spider (Quái Biến Thể)/Index Spider (Death).png'
                },
                stats: { health: 170, difficulty: 3 },
                attackPattern: {
                    questionTypes: [QuestionType.FILL_BLANK],
                    bloomLevels: [BloomLevel.UNDERSTAND],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 10, max: 17, chance: 1.0 }
                }
            }
        ],
        elites: [
            // Tier 3 (AP) - Lính Canh Nhị Phân (Binary Sentry)
            {
                id: 'binary_sentry',
                name: 'Binary Sentry',
                displayName: 'Lính Canh Nhị Phân',
                type: MonsterType.ELITE,
                chapter: 2,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 3 (AP) Binary Sentry (Quái Tinh Anh)/Binary Sentry (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 3 (AP) Binary Sentry (Quái Tinh Anh)/Binary Sentry (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 3 (AP) Binary Sentry (Quái Tinh Anh)/Binary Sentry (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 3 (AP) Binary Sentry (Quái Tinh Anh)/Binary Sentry (Death).png'
                },
                stats: { health: 300, difficulty: 5 },
                attackPattern: {
                    questionTypes: [QuestionType.MATCHING],
                    bloomLevels: [BloomLevel.APPLY],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 18, max: 28, chance: 1.0 },
                    logicStone: { min: 1, max: 3, chance: 0.4 }
                }
            }
        ],
        // Tier 4 (AN) - Trùm (Boss)
        boss: {
            id: 'chaotic_boss',
            name: 'The Chaotic Boss',
            displayName: 'Hiện Thân Hỗn Loạn',
            type: MonsterType.BOSS,
            chapter: 2,
            sprite: {
                idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 4 (AN) The Chaotic Boss (Boss)/The Chaotic Boss (Idle).png',
                attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 4 (AN) The Chaotic Boss (Boss)/The Chaotic Boss (Attack).png',
                hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 4 (AN) The Chaotic Boss (Boss)/The Chaotic Boss (Hurt).png',
                death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 2 ĐỀN THỜ HỖN LOẠN (CHƯƠNG 2)/Tier 4 (AN) The Chaotic Boss (Boss)/The Chaotic Boss (Death).png'
            },
            stats: { health: 600, difficulty: 8 },
            attackPattern: {
                questionTypes: [QuestionType.PROGRAMMING],
                bloomLevels: [BloomLevel.ANALYZE],
                questionCount: 1
            },
            lootTable: {
                dataWood: { min: 60, max: 120, chance: 1.0 },
                logicStone: { min: 7, max: 12, chance: 1.0 }
            }
        }
    },

    puzzles: [],

    layout: {
        rooms: 6,
        difficulty: 3
    },

    firstClearRewards: {
        dataWood: 150,
        logicStone: 15,
        blueprints: []
    },

    farmMode: {
        enabled: false,
        aiGeneratedQuestions: false
    }
};
