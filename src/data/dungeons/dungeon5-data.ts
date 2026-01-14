/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HẦM NGỤC 5: KHU RỪNG ĐỆ QUY (The Recursive Forest)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu hình dữ liệu cho Chương 5.
 * Tập trung vào Cây Nhị Phân Tìm Kiếm (BST) và giải thuật Đệ Quy.
 * 
 * QUÁI VẬT & CẤP ĐỘ BLOOM:
 * - Tier 1 (Remember): Leaf Sprite - Nhớ khái niệm lá, nút.
 * - Tier 2 (Understand): Root Crawler - Hiểu duyệt cây (Traversal).
 * - Tier 3 (Apply): Balanced Treant - Vận dụng tính chất BST.
 * - Tier 4 (Analyze): Unbalanced Treant - Phân tích cân bằng cây.
 * 
 * @module Dungeon5Data
 * @category Game Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonData } from '../models/Dungeon';
import { MonsterType } from '../models/Dungeon';
import { QuestionType, BloomLevel } from '../models/Question';

export const DUNGEON_5_FOREST: DungeonData = {
    id: 'dungeon_5',
    chapter: 5,
    name: 'The Recursive Forest',
    displayName: 'Khu Rừng Đệ Quy',
    description: 'Lạc vào khu rừng nơi mỗi nhánh cây lặp lại quy luật của chính nó.',
    lore: 'Nơi tri thức phát triển và phân nhánh vô tận. Hãy cẩn thận đừng để bị lạc trong vòng lặp vô hạn.',
    background: '/assets/Ảnh Assets/Ải/Ải 5 Khu Rừng Đệ Quy (The Recursive Forest).png',

    monsters: {
        minions: [
            // Tier 1 (R) - NHỚ (REMEMBER)
            {
                id: 'leaf_sprite',
                name: 'Leaf Sprite',
                displayName: 'Tinh Linh Lá',
                type: MonsterType.MINION,
                chapter: 5,
                sprite: {
                    idle: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 1 (R) Leaf Sprite (Quái Thường)/Leaf Sprite (Idle).png',
                    attack: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 1 (R) Leaf Sprite (Quái Thường)/Leaf Sprite (Attack).png',
                    hurt: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 1 (R) Leaf Sprite (Quái Thường)/Leaf Sprite (Hurt).png',
                    death: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 1 (R) Leaf Sprite (Quái Thường)/Leaf Sprite (Death).png'
                },
                stats: { health: 200, difficulty: 3 },
                attackPattern: {
                    questionTypes: [QuestionType.MULTIPLE_CHOICE],
                    bloomLevels: [BloomLevel.REMEMBER],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 12, max: 18, chance: 1.0 },
                    blueprints: [{ id: 'rune_leaf_node', chance: 0.3 }]
                }
            },
            // Tier 2 (U) - HIỂU (UNDERSTAND)
            {
                id: 'root_crawler',
                name: 'Root Crawler',
                displayName: 'Sâu Rễ',
                type: MonsterType.MINION,
                chapter: 5,
                sprite: {
                    idle: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 2 (U) Root Crawler (Quái Biến Thể)/Root Crawler (Idle).png',
                    attack: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 2 (U) Root Crawler (Quái Biến Thể)/Root Crawler (Attack).png',
                    hurt: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 2 (U) Root Crawler (Quái Biến Thể)/Root Crawler (Hurt).png',
                    death: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 2 (U) Root Crawler (Quái Biến Thể)/Root Crawler (Death).png'
                },
                stats: { health: 250, difficulty: 4 },
                attackPattern: {
                    questionTypes: [QuestionType.FILL_BLANK],
                    bloomLevels: [BloomLevel.UNDERSTAND],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 18, max: 25, chance: 1.0 },
                    blueprints: [{ id: 'rune_tree_traversal', chance: 0.4 }]
                }
            }
        ],
        elites: [
            // Tier 3 (AP) - VẬN DỤNG (APPLY)
            {
                id: 'balanced_treant',
                name: 'Balanced Treant',
                displayName: 'Mộc Tinh Cân Bằng',
                type: MonsterType.ELITE,
                chapter: 5,
                sprite: {
                    idle: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 3 (AP) Balanced Treant (Quái Tinh Anh)/Balanced Treant (Idle).png',
                    attack: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 3 (AP) Balanced Treant (Quái Tinh Anh)/Balanced Treant (Attack).png',
                    hurt: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 3 (AP) Balanced Treant (Quái Tinh Anh)/Balanced Treant (Hurt).png',
                    death: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 3 (AP) Balanced Treant (Quái Tinh Anh)/Balanced Treant (Death).png'
                },
                stats: { health: 400, difficulty: 6 },
                attackPattern: {
                    questionTypes: [QuestionType.MATCHING],
                    bloomLevels: [BloomLevel.APPLY],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 40, max: 60, chance: 1.0 },
                    logicStone: { min: 3, max: 5, chance: 0.5 },
                    blueprints: [{ id: 'rune_bst_insert', chance: 0.5 }]
                }
            }
        ],
        boss: {
            // Tier 4 (AN) - PHÂN TÍCH (ANALYZE)
            id: 'unbalanced_treant',
            name: 'Unbalanced Treant',
            displayName: 'Mộc Tinh Mất Cân Bằng',
            type: MonsterType.BOSS,
            chapter: 5,
            sprite: {
                idle: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 4 (AN) Unbalanced Treant (Boss)/Unbalanced Treant (Idle).png',
                attack: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 4 (AN) Unbalanced Treant (Boss)/Unbalanced Treant (Attack).png',
                hurt: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 4 (AN) Unbalanced Treant (Boss)/Unbalanced Treant (Hurt).png',
                death: '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 5 KHU RỪNG ĐỆ QUY (CHƯƠNG 5)/Tier 4 (AN) Unbalanced Treant (Boss)/Unbalanced Treant (Death).png'
            },
            stats: { health: 800, difficulty: 9 },
            attackPattern: {
                questionTypes: [QuestionType.PROGRAMMING],
                bloomLevels: [BloomLevel.ANALYZE],
                questionCount: 1
            },
            lootTable: {
                dataWood: { min: 100, max: 200, chance: 1.0 },
                logicStone: { min: 15, max: 25, chance: 1.0 },
                blueprints: [{ id: 'spell_search_beam', chance: 1.0 }]
            },
            phases: [
                {
                    threshold: 50,
                    message: "⚠️ CẢNH BÁO: Mộc Tinh đang phát triển rễ phụ! Cấu trúc cây đang thay đổi!",
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
        rooms: 10,
        difficulty: 4
    },

    firstClearRewards: {
        dataWood: 200,
        logicStone: 20,
        blueprints: ['spell_search_beam']
    },

    farmMode: {
        enabled: false,
        aiGeneratedQuestions: false
    }
};
