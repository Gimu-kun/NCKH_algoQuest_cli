/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HẦM NGỤC 4: THÁNH TÍCH HAI MẶT (The Two-Faced Relic)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu hình dữ liệu cho Chương 4.
 * Tập trung vào Ngăn Xếp (Stack) và Hàng Đợi (Queue).
 * 
 * QUÁI VẬT & CẤP ĐỘ BLOOM:
 * - Tier 1 (Remember): FIFO Spirit / LIFO Spirit - Nhớ cơ chế vào/ra.
 * - Tier 2 (Understand): Overflow Slime - Hiểu về tràn bộ nhớ.
 * - Tier 3 (Apply): Polish Gatekeeper - Vận dụng ký pháp Ba Lan (Postfix).
 * - Tier 4 (Analyze): Balanced Chimera - Phân tích cân bằng ngoặc.
 * 
 * @module Dungeon4Data
 * @category Game Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonData } from '../models/Dungeon';
import { MonsterType } from '../models/Dungeon';
import { QuestionType, BloomLevel } from '../models/Question';

export const DUNGEON_4_RELIC: DungeonData = {
    id: 'dungeon_4',
    chapter: 4,
    name: 'The Two-Faced Relic',
    displayName: 'Thánh Tích Hai Mặt',
    description: 'Thám hiểm di tích cổ đại nơi quy tắc Vào Trước-Ra Trước và Vào Sau-Ra Trước ngự trị.',
    lore: 'Nơi lưu giữ ký ức của những thuật toán sơ khai, chia làm hai bản thể đối lập nhau.',
    background: '/src/assets/Ảnh Assets/Ải/Ải 4 Thánh Tích Hai Mặt (The Two-Faced Relic).png',

    monsters: {
        minions: [
            // Tier 1 (R) - NHỚ (REMEMBER)
            {
                id: 'fifo_spirit',
                name: 'FIFO Spirit',
                displayName: 'Linh Hồn FIFO',
                type: MonsterType.MINION,
                chapter: 4,
                sprite: {
                    // NOTE: Folder names in assets seem swapped. LIFO folder contains FIFO sprites.
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) LIFO Spirit (Stack) (Quái Thường)/FIFO Spirit (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) LIFO Spirit (Stack) (Quái Thường)/FIFO Spirit (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) LIFO Spirit (Stack) (Quái Thường)/FIFO Spirit (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) LIFO Spirit (Stack) (Quái Thường)/FIFO Spirit (Death).png'
                },
                stats: { health: 180, difficulty: 3 },
                attackPattern: {
                    questionTypes: [QuestionType.MULTIPLE_CHOICE],
                    bloomLevels: [BloomLevel.REMEMBER],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 10, max: 15, chance: 1.0 },
                    blueprints: [{ id: 'rune_queue_mastery', chance: 0.3 }]
                }
            },
            {
                id: 'lifo_spirit',
                name: 'LIFO Spirit',
                displayName: 'Linh Hồn LIFO',
                type: MonsterType.MINION,
                chapter: 4,
                sprite: {
                    // NOTE: Folder names in assets seem swapped. FIFO folder contains LIFO sprites.
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) FIFO Spirit (Queue) (Quái Thường)/LIFO Spirit (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) FIFO Spirit (Queue) (Quái Thường)/LIFO Spirit (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) FIFO Spirit (Queue) (Quái Thường)/LIFO Spirit (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 1 (R) FIFO Spirit (Queue) (Quái Thường)/LIFO Spirit (Death).png'
                },
                stats: { health: 180, difficulty: 3 },
                attackPattern: {
                    questionTypes: [QuestionType.MULTIPLE_CHOICE],
                    bloomLevels: [BloomLevel.REMEMBER],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 10, max: 15, chance: 1.0 },
                    blueprints: [{ id: 'rune_stack_overflow', chance: 0.3 }]
                }
            },
            // Tier 2 (U) - HIỂU (UNDERSTAND)
            {
                id: 'overflow_slime',
                name: 'Overflow Slime',
                displayName: 'Slime Tràn',
                type: MonsterType.MINION,
                chapter: 4,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 2 (U) Overflow Slime (Quái Biến Thể)/Overflow Slime (Idle).png',
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 2 (U) Overflow Slime (Quái Biến Thể)/Overflow Slime (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 2 (U) Overflow Slime (Quái Biến Thể)/Overflow Slime (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 2 (U) Overflow Slime (Quái Biến Thể)/Overflow Slime (Death).png'
                },
                stats: { health: 220, difficulty: 4 },
                attackPattern: {
                    questionTypes: [QuestionType.FILL_BLANK],
                    bloomLevels: [BloomLevel.UNDERSTAND],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 15, max: 20, chance: 1.0 },
                    blueprints: [{ id: 'rune_memory_limit', chance: 0.4 }]
                }
            }
        ],
        elites: [
            // Tier 3 (AP) - VẬN DỤNG (APPLY)
            {
                id: 'polish_gatekeeper',
                name: 'Polish Gatekeeper',
                displayName: 'Người Gác Cổng Ba Lan',
                type: MonsterType.ELITE,
                chapter: 4,
                sprite: {
                    idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 3 (AP) Polish Gatekeeper (Quái Tinh Anh)/Polish Gatekeeper (Idle).png', // Assuming name matches
                    attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 3 (AP) Polish Gatekeeper (Quái Tinh Anh)/Polish Gatekeeper (Attack).png',
                    hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 3 (AP) Polish Gatekeeper (Quái Tinh Anh)/Polish Gatekeeper (Hurt).png',
                    death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 3 (AP) Polish Gatekeeper (Quái Tinh Anh)/Polish Gatekeeper (Death).png'
                },
                stats: { health: 350, difficulty: 6 },
                attackPattern: {
                    questionTypes: [QuestionType.MATCHING],
                    bloomLevels: [BloomLevel.APPLY],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 30, max: 50, chance: 1.0 },
                    logicStone: { min: 2, max: 4, chance: 0.4 },
                    blueprints: [{ id: 'rune_postfix_calc', chance: 0.5 }]
                }
            }
        ],
        boss: {
            // Tier 4 (AN) - PHÂN TÍCH (ANALYZE)
            id: 'balanced_chimera',
            name: 'Balanced Chimera',
            displayName: 'Chimera Cân Bằng',
            type: MonsterType.BOSS,
            chapter: 4,
            sprite: {
                idle: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 4 (AN) Balanced Chimera (Boss)/Balanced Chimera (Idle).png', // Assuming name matches
                attack: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 4 (AN) Balanced Chimera (Boss)/Balanced Chimera (Attack).png',
                hurt: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 4 (AN) Balanced Chimera (Boss)/Balanced Chimera (Hurt).png',
                death: '/src/assets/Ảnh Assets/Quái vật/QUÁI ẢI 4 THÁNH TÍCH HAI MẶT (CHƯƠNG 4)/Tier 4 (AN) Balanced Chimera (Boss)/Balanced Chimera (Death).png'
            },
            stats: { health: 700, difficulty: 8 },
            attackPattern: {
                questionTypes: [QuestionType.PROGRAMMING],
                bloomLevels: [BloomLevel.ANALYZE],
                questionCount: 1
            },
            lootTable: {
                dataWood: { min: 80, max: 150, chance: 1.0 },
                logicStone: { min: 10, max: 20, chance: 1.0 },
                blueprints: [{ id: 'spell_parenthesis_shield', chance: 1.0 }]
            },
            phases: [
                {
                    threshold: 50,
                    message: "⚠️ CẢNH BÁO: Chimera đang phá vỡ sự cân bằng! Các dấu ngoặc trở nên hỗn loạn!",
                    newAttackPattern: {
                        questionTypes: [QuestionType.PROGRAMMING],
                        bloomLevels: [BloomLevel.ANALYZE],
                        questionCount: 2
                    }
                }
            ]
        }
    },

    puzzles: [], // Có thể thêm puzzle tháp Hà Nội sau

    layout: {
        rooms: 8,
        difficulty: 3
    },

    firstClearRewards: {
        dataWood: 150,
        logicStone: 15,
        blueprints: ['spell_parenthesis_shield']
    },

    farmMode: {
        enabled: false,
        aiGeneratedQuestions: false
    }
};
