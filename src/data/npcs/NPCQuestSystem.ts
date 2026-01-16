/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HỆ THỐNG NHIỆM VỤ NPC (NPC Quest System)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Quản lý toàn bộ logic liên quan đến nhiệm vụ (Quests) từ NPC:
 * - Định nghĩa Campaign Quests (Nhiệm vụ cốt truyện)
 * - Định nghĩa Daily Quests (Nhiệm vụ hàng ngày)
 * - Kiểm tra điều kiện hoàn thành (Quest Requirements)
 * - Theo dõi tiến độ và trao thưởng (Progress & Rewards)
 * 
 * KỸ THUẬT SỬ DỤNG:
 * - Static Data Definitions: Định nghĩa quests dưới dạng constant objects
 * - Functional Logic: Các hàm pure functions để check conditions
 * - Dependency Injection: Nhận PlayerState để kiểm tra tiến độ
 * 
 * QUEST TYPES:
 * 1. CAMPAIGN: Nhiệm vụ chính tuyến, mở khóa theo Chapter
 * 2. DAILY: Nhiệm vụ lặp lại hàng ngày để farm tài nguyên
 * 
 * REQUIREMENT TYPES:
 * - COMPLETE_DUNGEON: Hoàn thành ải
 * - ANSWER_QUESTIONS: Trả lời câu hỏi (đúng/tổng số)
 * - BUILD_SPELL: Chế tạo phép thuật
 * - COLLECT_ITEMS: Thu thập vật phẩm
 * 
 * @module NPCQuestSystem
 * @category Quest System
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { NPCS, type Quest, type QuestRequirement } from '../models/NPC';
import type { PlayerState, PlayerStore } from '../../store/playerStore';
import { ResourceType } from '../models/Item';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUEST DEFINITIONS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// Campaign quests for each chapter
export const CAMPAIGN_QUESTS: Record<number, Quest> = {
    1: {
        id: 'chapter1_campaign',
        name: 'Đền Thờ Hướng Dẫn',
        description: 'Hoàn thành hầm ngục đầu tiên và làm chủ các kiến thức cơ bản.',
        type: 'CAMPAIGN',
        chapter: 1,
        requirements: [
            {
                type: 'COMPLETE_DUNGEON',
                target: 'dungeon_1',
                count: 1,
                chapter: 1
            },
            {
                type: 'ANSWER_QUESTIONS',
                target: 'any',
                count: 10,
                chapter: 1
            }
        ],
        rewards: {
            oPoints: 100,
            logicStone: 10,
            dataWood: 20,
            blueprints: ['bubble_sort_spell']
        },
        active: true
    },
    2: {
        id: 'chapter2_campaign',
        name: 'Đền Thờ Hỗn Loạn',
        description: 'Làm chủ các thuật toán tìm kiếm và sắp xếp.',
        type: 'CAMPAIGN',
        chapter: 2,
        requirements: [
            {
                type: 'COMPLETE_DUNGEON',
                target: 'dungeon_2',
                count: 1,
                chapter: 2
            },
            {
                type: 'ANSWER_QUESTIONS',
                target: 'any',
                count: 15,
                chapter: 2
            }
        ],
        rewards: {
            oPoints: 150,
            logicStone: 15,
            dataWood: 30,
            blueprints: ['binary_search_spell', 'merge_sort_spell']
        },
        active: true
    },
    3: {
        id: 'chapter3_campaign',
        name: 'Hành Lang Dây Xích',
        description: 'Chinh phục các thử thách về danh sách liên kết.',
        type: 'CAMPAIGN',
        chapter: 3,
        requirements: [
            {
                type: 'COMPLETE_DUNGEON',
                target: 'dungeon_3',
                count: 1,
                chapter: 3
            },
            {
                type: 'ANSWER_QUESTIONS',
                target: 'any',
                count: 20,
                chapter: 3
            }
        ],
        rewards: {
            oPoints: 200,
            logicStone: 20,
            dataWood: 40,
            blueprints: ['linked_list_spell', 'pointer_magic']
        },
        active: true
    }
};

// Daily quests
export const DAILY_QUESTS: Quest[] = [
    {
        id: 'daily_warrior',
        name: 'Chiến Binh Thuật Toán',
        description: 'Trả lời đúng 20 câu hỏi.',
        type: 'DAILY',
        requirements: [
            {
                type: 'ANSWER_QUESTIONS',
                target: 'correct',
                count: 20
            }
        ],
        rewards: {
            oPoints: 50,
            logicStone: 5
        },
        active: true
    },
    {
        id: 'daily_dungeoneer',
        name: 'Nhà Thám Hiểm Hầm Ngục',
        description: 'Hoàn thành bất kỳ hầm ngục nào.',
        type: 'DAILY',
        requirements: [
            {
                type: 'COMPLETE_DUNGEON',
                target: 'any',
                count: 1
            }
        ],
        rewards: {
            oPoints: 30,
            dataWood: 15
        },
        active: true
    }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KIỂM TRA MỘT ĐIỀU KIỆN NHIỆM VỤ (Check Single Requirement)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Kiểm tra xem người chơi đã thỏa mãn MỘT điều kiện cụ thể của quest chưa.
 * 
 * THUẬT TOÁN:
 * 1. Kiểm tra requirement.type.
 * 2. So sánh dữ liệu trong PlayerState với yêu cầu:
 *    - COMPLETE_DUNGEON: Check dungeonsCleared stats hoặc list completedDungeons.
 *    - ANSWER_QUESTIONS: Check questionsCorrect hoặc questionsAnswered stats.
 *    - BUILD_SPELL: Check spellsBuilt stats.
 * 3. Trả về true/false.
 * 
 * ĐỘ PHỨC TẠP:
 * - Time: O(1) hoặc O(n) tùy vào độ dài list completedDungeons (thường nhỏ).
 * - Space: O(1).
 * 
 * @param {QuestRequirement} requirement - Điều kiện cần kiểm tra.
 * @param {PlayerState} playerState - Trạng thái hiện tại của người chơi.
 * @returns {boolean} True nếu điều kiện đã được thỏa mãn.
 */
export function checkQuestRequirement(
    requirement: QuestRequirement,
    playerState: PlayerState
): boolean {
    switch (requirement.type) {
        case 'COMPLETE_DUNGEON':
            if (requirement.target === 'any') {
                return playerState.stats.dungeonsCleared >= requirement.count;
            }
            return playerState.completedDungeons.includes(requirement.target);

        case 'ANSWER_QUESTIONS':
            if (requirement.target === 'correct') {
                return playerState.stats.questionsCorrect >= requirement.count;
            }
            return playerState.stats.questionsAnswered >= requirement.count;

        case 'BUILD_SPELL':
            return playerState.stats.spellsBuilt >= requirement.count;

        case 'COLLECT_ITEMS':
            // Check if player has items
            return false; // TODO: Implement item collection

        default:
            return false;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KIỂM TRA HOÀN THÀNH NHIỆM VỤ (Check Quest Completion)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Kiểm tra xem người chơi đã hoàn thành TẤT CẢ các điều kiện của quest chưa.
 * 
 * THUẬT TOÁN:
 * 1. Duyệt qua mảng requirements của quest.
 * 2. Gọi checkQuestRequirement cho từng phần tử.
 * 3. Trả về true nếu requirements.every() trả về true.
 * 
 * @param {Quest} quest - Nhiệm vụ cần kiểm tra.
 * @param {PlayerState} playerState - Trạng thái người chơi.
 * @returns {boolean} True nếu quest đã hoàn thành.
 */
export function isQuestComplete(quest: Quest, playerState: PlayerState): boolean {
    return quest.requirements.every(req => checkQuestRequirement(req, playerState));
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TÍNH TIẾN ĐỘ NHIỆM VỤ (Get Quest Progress)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Tính phần trăm hoàn thành nhiệm vụ để hiển thị thanh tiến độ.
 * 
 * CÔNG THỨC:
 * (Số requirement đã đạt / Tổng số requirement) * 100
 * 
 * @param {Quest} quest - Nhiệm vụ.
 * @param {PlayerState} playerState - Trạng thái người chơi.
 * @returns {number} Phần trăm hoàn thành (0-100).
 */
export function getQuestProgress(quest: Quest, playerState: PlayerState): number {
    const requirements = quest.requirements;
    const completedRequirements = requirements.filter(req =>
        checkQuestRequirement(req, playerState)
    ).length;

    return (completedRequirements / requirements.length) * 100;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY DANH SÁCH NHIỆM VỤ CỦA NPC (Get NPC Quests)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Trả về danh sách tất cả quest mà một NPC cụ thể cung cấp.
 * 
 * LOGIC MAPPING:
 * - Professor Alric -> Campaign Quests
 * - Guild Leader -> Daily Quests
 * 
 * @param {string} npcId - ID của NPC.
 * @returns {Quest[]} Danh sách quests.
 */
export function getNPCQuests(npcId: string): Quest[] {
    const npc = NPCS[npcId.toUpperCase()];

    if (!npc) return [];

    // Professor Alric gives campaign quests
    if (npcId === 'professor_alric' || npcId === 'ALRIC') {
        return Object.values(CAMPAIGN_QUESTS);
    }

    // Guild Leader gives daily quests
    if (npcId === 'guild_leader' || npcId === 'GUILD_LEADER') {
        return DAILY_QUESTS;
    }

    return [];
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY NHIỆM VỤ KÍCH HOẠT TỪ NPC (Get Active NPC Quests)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Lọc danh sách quest của NPC để chỉ trả về những quest CHO PHÉP NHẬN:
 * - Chưa hoàn thành (trừ daily quest có cơ chế reset riêng - chưa implement reset).
 * - Đủ điều kiện Chapter (Chapter Gating).
 * - Quest đang active.
 * 
 * @param {string} npcId - ID của NPC.
 * @param {PlayerState} playerState - Trạng thái người chơi.
 * @returns {Quest[]} Danh sách quest khả dụng.
 */
export function getActiveNPCQuests(npcId: string, playerState: PlayerState): Quest[] {
    const allQuests = getNPCQuests(npcId);

    return allQuests.filter(quest => {
        // Not already completed
        if (playerState.completedQuests.includes(quest.id)) {
            return false;
        }

        // Check if player meets requirements (chapter gating)
        if (quest.chapter && playerState.currentChapter < quest.chapter) {
            return false;
        }

        return quest.active;
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOÀN THÀNH NHIỆM VỤ & TRAO THƯỞNG (Complete Quest & Reward)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Thực hiện logic hoàn thành quest:
 * 1. Cộng tài nguyên (O-Points, Logic Stone, Data Wood).
 * 2. Mở khóa Blueprints/Spells.
 * 3. Đánh dấu quest đã hoàn thành trong PlayerStore.
 * 
 * @param {Quest} quest - Nhiệm vụ hoàn thành.
 * @param {ReturnType<typeof usePlayerStore>} playerStore - Player Store instance (Zustand).
 * @returns {Object} Thông tin phần thưởng đã trao.
 */
export function completeQuest(quest: Quest, playerStore: PlayerStore) {
    const rewards = quest.rewards;

    // Give resources
    if (rewards.oPoints) {
        playerStore.addResource(ResourceType.O_POINTS, rewards.oPoints);
    }
    if (rewards.logicStone) {
        playerStore.addResource(ResourceType.LOGIC_STONE, rewards.logicStone);
    }
    if (rewards.dataWood) {
        playerStore.addResource(ResourceType.DATA_WOOD, rewards.dataWood);
    }

    // Unlock blueprints/spells
    if (rewards.blueprints) {
        rewards.blueprints.forEach(blueprintId => {
            playerStore.unlockSpell(blueprintId);
        });
    }

    // Mark as completed
    playerStore.completeQuest(quest.id);

    return rewards;
}
