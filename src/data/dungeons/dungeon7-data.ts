/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HẦM NGỤC 7: LÕI HƯ KHÔNG (The Void Core) - CHƯƠNG CUỐI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu hình dữ liệu cho Chương Cuối.
 * Thử thách tổng hợp tất cả kiến thức thuật toán.
 * 
 * QUÁI VẬT & CẤP ĐỘ BLOOM:
 * - Tier 1 (Remember): Corrupted Bug - Lỗi vi hệ thống.
 * - Tier 2 (Understand): Glitch Shadow - Bóng ma đệ quy lỗi.
 * - Tier 3 (Apply): Big O Gatekeeper - Kẻ gác cổng độ phức tạp.
 * - Tier 4 (Analyze): The Corruptor - Trùm cuối của mọi lỗi lầm.
 * 
 * @module Dungeon7Data
 * @category Game Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonData } from '../models/Dungeon';
import { MonsterType } from '../models/Dungeon';
import { QuestionType, BloomLevel } from '../models/Question';

const ASSETS_BASE = '/assets/Ảnh Assets/Quái vật/QUÁI ẢI 7 LÕI HƯ KHÔNG (CHƯƠNG CUỐI)';

export const DUNGEON_7_FINAL: DungeonData = {
    id: 'dungeon_7',
    chapter: 7,
    name: 'The Void Core',
    displayName: 'Lõi Hư Không (Chương Cuối)',
    description: 'Đối mặt với Lỗi Hư Không tại trung tâm của Mạng Lưới Logic. Thử thách cuối cùng!',
    lore: 'Nơi khởi nguồn của sự sụp đổ. The Corruptor đang nuốt chửng mọi dữ liệu tại đây.',
    background: '/assets/Ảnh Assets/Ải/Ải Cuối Lõi Hư Không (The Corrupted Core).png',

    monsters: {
        minions: [
            // Tier 1 (R) - Corrupted Bug
            {
                id: 'corrupted_bug',
                name: 'Corrupted Bug',
                displayName: 'Lỗi Hư Hại',
                type: MonsterType.MINION,
                chapter: 7,
                sprite: {
                    idle: `${ASSETS_BASE}/Tier 1 (R) Corrupted Bug (Quái Thường)/Corrupted Bug (Idle).png`,
                    attack: `${ASSETS_BASE}/Tier 1 (R) Corrupted Bug (Quái Thường)/Corrupted Bug (Attack).png`,
                    hurt: `${ASSETS_BASE}/Tier 1 (R) Corrupted Bug (Quái Thường)/Corrupted Bug (Hurt).png`,
                    death: `${ASSETS_BASE}/Tier 1 (R) Corrupted Bug (Quái Thường)/Corrupted Bug (Death).png`
                },
                stats: { health: 300, difficulty: 8 },
                attackPattern: {
                    questionTypes: [QuestionType.MULTIPLE_CHOICE],
                    bloomLevels: [BloomLevel.REMEMBER, BloomLevel.UNDERSTAND],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 20, max: 40, chance: 1.0 }
                }
            },
            // Tier 2 (U) - Glitch Shadow
            {
                id: 'glitch_shadow',
                name: 'Glitch Shadow',
                displayName: 'Bóng Ma Glitch',
                type: MonsterType.MINION,
                chapter: 7,
                sprite: {
                    idle: `${ASSETS_BASE}/Tier 2 (U) Glitch Shadow (Quái Biến Thể)/Glitch Shadow (Idle).png`,
                    attack: `${ASSETS_BASE}/Tier 2 (U) Glitch Shadow (Quái Biến Thể)/Glitch Shadow (Attack).png`,
                    hurt: `${ASSETS_BASE}/Tier 2 (U) Glitch Shadow (Quái Biến Thể)/Glitch Shadow (Hurt).png`,
                    death: `${ASSETS_BASE}/Tier 2 (U) Glitch Shadow (Quái Biến Thể)/Glitch Shadow (Death).png`
                },
                stats: { health: 450, difficulty: 9 },
                attackPattern: {
                    questionTypes: [QuestionType.FILL_BLANK, QuestionType.PROGRAMMING],
                    bloomLevels: [BloomLevel.UNDERSTAND, BloomLevel.APPLY],
                    questionCount: 1
                },
                lootTable: {
                    dataWood: { min: 30, max: 50, chance: 1.0 },
                    logicStone: { min: 2, max: 5, chance: 0.5 }
                }
            }
        ],
        elites: [
            // Tier 3 (AP) - Big O Gatekeeper
            {
                id: 'big_o_gatekeeper',
                name: 'Big O Gatekeeper',
                displayName: 'Vệ Thần Big O',
                type: MonsterType.ELITE,
                chapter: 7,
                sprite: {
                    idle: `${ASSETS_BASE}/Tier 3 (AP) Big O Gatekeeper (Quái Tinh Anh)/Big O Gatekeeper (Idle).png`,
                    attack: `${ASSETS_BASE}/Tier 3 (AP) Big O Gatekeeper (Quái Tinh Anh)/Big O Gatekeeper (Attack).png`,
                    hurt: `${ASSETS_BASE}/Tier 3 (AP) Big O Gatekeeper (Quái Tinh Anh)/Big O Gatekeeper (Hurt).png`,
                    death: `${ASSETS_BASE}/Tier 3 (AP) Big O Gatekeeper (Quái Tinh Anh)/Big O Gatekeeper (Death).png`
                },
                stats: { health: 800, difficulty: 10 },
                attackPattern: {
                    questionTypes: [QuestionType.MATCHING, QuestionType.PROGRAMMING],
                    bloomLevels: [BloomLevel.APPLY, BloomLevel.ANALYZE],
                    questionCount: 2
                },
                lootTable: {
                    dataWood: { min: 50, max: 100, chance: 1.0 },
                    logicStone: { min: 5, max: 10, chance: 0.8 },
                    blueprints: [{ id: 'spell_final_void_burst', chance: 0.5 }]
                }
            }
        ],
        // Tier 4 (AN) - The Corruptor (Boss)
        boss: {
            id: 'the_corruptor',
            name: 'The Corruptor',
            displayName: 'Kẻ Hủy Diệt',
            type: MonsterType.BOSS,
            chapter: 7,
            sprite: {
                idle: `${ASSETS_BASE}/Tier 4 (AN) The Corruptor (Final Boss)/The Corruptor (Idle).png`,
                attack: `${ASSETS_BASE}/Tier 4 (AN) The Corruptor (Final Boss)/The Corruptor (Attack).png`,
                hurt: `${ASSETS_BASE}/Tier 4 (AN) The Corruptor (Final Boss)/The Corruptor (Hurt).png`,
                death: `${ASSETS_BASE}/Tier 4 (AN) The Corruptor (Final Boss)/The Corruptor (Death).png`
            },
            stats: { health: 2000, difficulty: 12 },
            attackPattern: {
                questionTypes: [QuestionType.PROGRAMMING],
                bloomLevels: [BloomLevel.ANALYZE],
                questionCount: 3
            },
            lootTable: {
                dataWood: { min: 500, max: 1000, chance: 1.0 },
                logicStone: { min: 50, max: 100, chance: 1.0 },
                blueprints: [{ id: 'spell_omnipotent', chance: 1.0 }] // Phần thưởng cuối cùng
            },
            phases: [
                {
                    threshold: 75,
                    message: "⚠️ CẢNH BÁO: Dữ liệu đang bị xóa sổ! Hắn đang mạnh lên!",
                    newAttackPattern: {
                        questionTypes: [QuestionType.PROGRAMMING],
                        bloomLevels: [BloomLevel.ANALYZE],
                        questionCount: 2
                    }
                },
                {
                    threshold: 40,
                    message: "🛑 NGUY HIỂM: Lõi Hư Không sắp nổ tung! Hãy kết thúc nhanh lên!",
                    newAttackPattern: {
                        questionTypes: [QuestionType.PROGRAMMING],
                        bloomLevels: [BloomLevel.ANALYZE],
                        questionCount: 3
                    }
                }
            ]
        }
    },

    puzzles: [],

    layout: {
        rooms: 9, // Dungeon lớn nhất
        difficulty: 5
    },

    firstClearRewards: {
        dataWood: 1000,
        logicStone: 100,
        blueprints: ['spell_omnipotent']
    },

    farmMode: {
        enabled: true,
        aiGeneratedQuestions: true
    }
};
