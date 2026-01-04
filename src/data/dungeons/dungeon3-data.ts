/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HẦM NGỤC 3: HÀNH LANG DÂY XÍCH (Chained Corridor)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu hình dữ liệu cho Chương 3.
 * Tập trung vào Danh sách Liên kết (Linked Lists) và Con trỏ (Pointers).
 * 
 * QUÁI VẬT & CẤP ĐỘ BLOOM:
 * - Tier 1 (Remember): Broken Link - Nhớ khái niệm Node/Link.
 * - Tier 2 (Understand): Null Pointer Wisp - Hiểu về Null/Pointer Safety.
 * - Tier 3 (Apply): Bridge Keeper - Vận dụng thao tác danh sách (Insert/Delete).
 * - Tier 4 (Analyze): The Messy Hydra - Phân tích và quản lý danh sách phức tạp.
 * 
 * @module Dungeon3Data
 * @category Game Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonData } from '../models/Dungeon';
import { MonsterType } from '../models/Dungeon';
import { QuestionType, BloomLevel } from '../models/Question';

export const DUNGEON_3_CHAINED: DungeonData = {
    id: 'dungeon_3',
    chapter: 3,
    name: 'Chained Corridor',
    displayName: 'Hành Lang Dây Xích',
    description: 'Điều hướng các lối đi liên kết và làm chủ thao tác con trỏ.',
    lore: 'Mảnh vỡ thứ ba bị mắc kẹt trong một hành lang vô tận nơi mỗi bước đi đều liên kết với bước tiếp theo.',
    background: '/src/assets/Ảnh Assets/Main Menu Background.png',

    monsters: {
        minions: [
            // Tier 1 (R) - NHỚ (REMEMBER)
            {
                id: 'broken_link',
                name: 'Broken Link',
                displayName: 'Liên Kết Gãy',
                type: MonsterType.MINION,
                chapter: 3,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 1 (R) Broken Link (Quái Thường)/Broken Link (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 1 (R) Broken Link (Quái Thường)/Broken Link (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 1 (R) Broken Link (Quái Thường)/Broken Link (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 1 (R) Broken Link (Quái Thường)/Broken Link (Death).png'
                },
                stats: { health: 140, difficulty: 3 },
                attackPattern: {
                    questionTypes: [QuestionType.MULTIPLE_CHOICE],
                    bloomLevels: [BloomLevel.REMEMBER],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 10, max: 15, chance: 1.0 },
                    blueprints: [
                        { id: 'rune_linked_list_basics', chance: 0.3 }
                    ]
                }
            },
            // Tier 2 (U) - HIỂU (UNDERSTAND)
            {
                id: 'null_pointer_wisp',
                name: 'Null Pointer Wisp',
                displayName: 'Ma Trơi Null',
                type: MonsterType.MINION,
                chapter: 3,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 2 (U) Null Pointer Wisp (Quái Biến Thể)/Null Pointer Wisp (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 2 (U) Null Pointer Wisp (Quái Biến Thể)/Null Pointer Wisp (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 2 (U) Null Pointer Wisp (Quái Biến Thể)/Null Pointer Wisp (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 2 (U) Null Pointer Wisp (Quái Biến Thể)/Null Pointer Wisp (Death).png'
                },
                stats: { health: 190, difficulty: 4 },
                attackPattern: {
                    questionTypes: [QuestionType.FILL_BLANK],
                    bloomLevels: [BloomLevel.UNDERSTAND],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 12, max: 20, chance: 1.0 },
                    blueprints: [
                        { id: 'rune_pointer_safety', chance: 0.4 }
                    ]
                }
            }
        ],
        elites: [
            // Tier 3 (AP) - VẬN DỤNG (APPLY)
            {
                id: 'bridge_keeper',
                name: 'Bridge Keeper',
                displayName: 'Người Giữ Cầu',
                type: MonsterType.ELITE,
                chapter: 3,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 3 (AP) Bridge Keeper (Quái Tinh Anh)/Bridge Keeper (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 3 (AP) Bridge Keeper (Quái Tinh Anh)/Bridge Keeper (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 3 (AP) Bridge Keeper (Quái Tinh Anh)/Bridge Keeper (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 3 (AP) Bridge Keeper (Quái Tinh Anh)/Bridge Keeper (Death).png'
                },
                stats: { health: 350, difficulty: 6 },
                attackPattern: {
                    questionTypes: [QuestionType.MATCHING],
                    bloomLevels: [BloomLevel.APPLY],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 20, max: 30, chance: 1.0 },
                    logicStone: { min: 2, max: 4, chance: 0.4 },
                    blueprints: [
                        { id: 'rune_doubly_linked', chance: 0.5 }
                    ]
                }
            }
        ],
        // Tier 4 (AN) - PHÂN TÍCH (ANALYZE)
        boss: {
            id: 'messy_hydra',
            name: 'The Messy Hydra',
            displayName: 'Hydra Hỗn Loạn',
            type: MonsterType.BOSS,
            chapter: 3,
            sprite: {
                idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 4 (AN) The Messy Hydra (Boss)/The Messy Hydra (Idle).png',
                attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 4 (AN) The Messy Hydra (Boss)/The Messy Hydra (Attack).png',
                hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 4 (AN) The Messy Hydra (Boss)/The Messy Hydra (Hurt).png',
                death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 3 HÀNH LANG DÂY XÍCH (CHƯƠNG 3)/Tier 4 (AN) The Messy Hydra (Boss)/The Messy Hydra (Death).png'
            },
            stats: { health: 700, difficulty: 9 },
            attackPattern: {
                questionTypes: [QuestionType.PROGRAMMING],
                bloomLevels: [BloomLevel.ANALYZE],
                questionCount: 1
            },
            lootTable: {
                dataWood: { min: 70, max: 140, chance: 1.0 },
                logicStone: { min: 10, max: 15, chance: 1.0 },
                blueprints: [
                    { id: 'spell_reverse_list', chance: 1.0 }
                ]
            },
            phases: [
                {
                    threshold: 50,
                    message: "⚠️ CẢNH BÁO: Hydra Hỗn Loạn đang hồi phục! Số đầu đang nhân lên!",
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
        rooms: 7,
        difficulty: 4
    },

    firstClearRewards: {
        dataWood: 200,
        logicStone: 20,
        blueprints: ['spell_reverse_list']
    },

    farmMode: {
        enabled: false,
        aiGeneratedQuestions: false
    }
};
