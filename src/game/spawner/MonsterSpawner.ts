/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HỆ THỐNG SINH QUÁI VẬT (Monster Spawner System)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Class này quản lý việc Spawn (triệu hồi) Monster ngẫu nhiên dựa trên:
 * - Dungeon ID (Ải đang chơi).
 * - Room Type (Phòng thường, phòng Elite, phòng Boss).
 * - Bloom Level tương ứng với độ khó câu hỏi.
 * 
 * TÍNH NĂNG:
 * - Spawn quái vật dựa trên ngữ cảnh (Dungeon, Room Type).
 * - Hỗ trợ nhiều ID Dungeon khác nhau (Mapping System).
 * - Cung cấp API để truy xuất data quái vật.
 * 
 * KỸ THUẬT:
 * - Static Factory Pattern: Không cần tạo Instance, gọi trực tiếp Static Methods.
 * - Weighted Random Selection: Spawn quái theo xác suất (70% Minion, 30% Elite).
 * - Data Mapping: Map nhiều Dungeon ID khác nhau về cùng 1 Data Source.
 * 
 * FLOW HOẠT ĐỘNG:
 * 1. Game request Spawn quái: `MonsterSpawner.getRandomMonster(dungeonId, isBoss)`.
 * 2. Tra cứu Dungeon Data từ `DUNGEON_DATA_MAP`.
 * 3. Nếu là Boss Room → Return Boss ID.
 * 4. Nếu là Regular Room → Random:
 *    - 70% cơ hội: Spawn Minion (R hoặc U Tier).
 *    - 30% cơ hội: Spawn Elite (AP Tier).
 * 5. Return Monster ID để `QuizBattle` sử dụng.
 * 
 * @module MonsterSpawner
 * @category Game Systems
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonData } from '../../data/models/Dungeon';
import { DUNGEON_1_TEMPLE } from '../../data/dungeons/dungeon1-data';
import { DUNGEON_2_CHAOS } from '../../data/dungeons/dungeon2-data';
import { DUNGEON_3_CHAINED } from '../../data/dungeons/dungeon3-data';
<<<<<<< HEAD
import { DUNGEON_4_RELIC } from '../../data/dungeons/dungeon4-data';
import { DUNGEON_5_FOREST } from '../../data/dungeons/dungeon5-data';
import { DUNGEON_7_FINAL } from '../../data/dungeons/dungeon7-data';
=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DUNGEON DATA MAPPING
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Maps các Dungeon IDs khác nhau về cùng `DungeonData` source.
 * Hỗ trợ cả 2 naming conventions:
 * - 'dungeon_X': Format mới, dùng cho Monster Data.
 * - 'temple_of_X': Format cũ, dùng cho Grid Layout.
 * 
 * WHY: Đảm bảo Compatibility giữa 2 hệ thống Dungeon ID.
 */
const DUNGEON_DATA_MAP: Record<string, DungeonData> = {
    'dungeon_1': DUNGEON_1_TEMPLE,
    'temple_of_guidance': DUNGEON_1_TEMPLE,

    'dungeon_2': DUNGEON_2_CHAOS,
    'temple_of_chaos': DUNGEON_2_CHAOS,

    'dungeon_3': DUNGEON_3_CHAINED,
    'chained_corridor': DUNGEON_3_CHAINED,
<<<<<<< HEAD

    'dungeon_4': DUNGEON_4_RELIC,
    'two_faced_relic': DUNGEON_4_RELIC,

    'dungeon_5': DUNGEON_5_FOREST,
    'recursive_forest': DUNGEON_5_FOREST,

    'dungeon_7': DUNGEON_7_FINAL,
    'void_core': DUNGEON_7_FINAL,
=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CLASS: MonsterSpawner
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
export class MonsterSpawner {
    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * LẤY MONSTER NGẪU NHIÊN (Get Random Monster)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Chọn ngẫu nhiên 1 Monster phù hợp với Dungeon và loại phòng hiện tại.
     * 
     * THUẬT TOÁN - WEIGHTED RANDOM SELECTION:
     * 1. Tra cứu Dungeon Data từ `dungeonId`.
     * 2. Nếu không tìm thấy → Fallback về `dungeon_1` default Monsters.
     * 3. Nếu `isBoss` = true → Return Boss ID (100%).
     * 4. Nếu Regular Room → Weighted Random:
     *    - Generate Random Number [0, 1).
     *    - Nếu > 0.7 (30% Chance) → Chọn Random Elite.
     *    - Nếu ≤ 0.7 (70% Chance) → Chọn Random Minion.
     * 5. Return Monster ID.
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(1) - Constant Time Lookup và Random.
     * - Space: O(1) - Không tạo Data Structure mới.
     * 
     * @param {string} dungeonId - ID của Dungeon (ví dụ: 'dungeon_1', 'temple_of_guidance').
     * @param {boolean} isBoss - True nếu là phòng Boss, False nếu phòng thường.
     * @returns {string} Monster ID để Spawn (ví dụ: 'logic_slime', 'initialization_golem').
     */
    static getRandomMonster(dungeonId: string, isBoss: boolean = false): string {
        // Bước 1: Tra cứu Dungeon Data
        const dungeonData = DUNGEON_DATA_MAP[dungeonId];

        // Bước 2: Fallback nếu Dungeon không tồn tại
        if (!dungeonData) {
            console.warn(`Unknown dungeon: ${dungeonId}, defaulting to dungeon_1`);
            return isBoss ? 'initialization_golem' : 'logic_slime';
        }

        // Bước 3: Boss Room - Return trực tiếp Boss Monster
        if (isBoss) {
            return dungeonData.monsters.boss.id;
        }

        // Bước 4: Regular Room - Weighted Random Selection
        const roll = Math.random(); // [0, 1)

        // Bước 5: 30% Elite hoặc 70% Minion
        if (roll > 0.7 && dungeonData.monsters.elites.length > 0) {
            // Elite Spawn (30% Chance) - Tier 3 (AP - APPLY)
            const elites = dungeonData.monsters.elites;
            const randomIndex = Math.floor(Math.random() * elites.length);
            return elites[randomIndex].id;
        } else {
            // Minion Spawn (70% Chance) - Tier 1-2 (R-U: REMEMBER-UNDERSTAND)
            const minions = dungeonData.monsters.minions;
            const randomIndex = Math.floor(Math.random() * minions.length);
            return minions[randomIndex].id;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * LẤY TẤT CẢ MONSTER IDS (Get All Monster IDs)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Trả về danh sách ALL Monster IDs có trong 1 Dungeon.
     * 
     * USE CASE:
     * - Debug/Testing: Xem Dungeon có bao nhiêu Monster.
     * - Achievement Tracking: Kiểm tra đã Defeat hết Monsters chưa.
     * - Bestiary System: List tất cả Monsters Player có thể gặp.
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(n) - n là số Monsters trong Dungeon.
     * - Space: O(n) - Tạo Array chứa n Monster IDs.
     * 
     * @param {string} dungeonId - ID của Dungeon.
     * @returns {string[]} Array of Monster IDs.
     */
    static getAllMonsterIds(dungeonId: string): string[] {
        const dungeonData = DUNGEON_DATA_MAP[dungeonId];
        if (!dungeonData) return ['logic_slime']; // Fallback

        const ids: string[] = [];

        // Collect tất cả Minions (Tier 1-2)
        dungeonData.monsters.minions.forEach(m => ids.push(m.id));

        // Collect tất cả Elites (Tier 3)
        dungeonData.monsters.elites.forEach(m => ids.push(m.id));

        // Thêm Boss (Tier 4)
        ids.push(dungeonData.monsters.boss.id);

        return ids;
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * LẤY MONSTER DATA THEO ID (Get Monster Data by ID)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Tìm và trả về FULL Monster Data Object từ bất kỳ Dungeon nào.
     * 
     * THUẬT TOÁN - LINEAR SEARCH ACROSS DUNGEONS:
     * 1. Duyệt qua TẤT CẢ Dungeons trong `DUNGEON_DATA_MAP`.
     * 2. Với mỗi Dungeon:
     *    a. Tìm trong Minions Array.
     *    b. Tìm trong Elites Array.
     *    c. Kiểm tra Boss.
     * 3. Nếu tìm thấy → Return Monster Data Object.
     * 4. Nếu không tìm thấy → Return null.
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(d × m) - d Dungeons, m Monsters per Dungeon.
     * - Space: O(1) - Chỉ Return Reference, không Copy.
     * 
     * OPTIMIZATION:
     * - Có thể Cache trong `Map<monsterId, MonsterData>` nếu Call nhiều.
     * - Hiện tại OK vì chỉ có 3 Dungeons × ~4 Monsters = 12 Lookups Max.
     * 
     * @param {string} monsterId - ID của Monster cần tìm.
     * @returns {MonsterData | null} Monster Data Object hoặc null nếu không tìm thấy.
     */
    static getMonsterData(monsterId: string) {
        // Linear Search qua tất cả Dungeons
        for (const dungeonData of Object.values(DUNGEON_DATA_MAP)) {
            // Tìm trong Minions
            const minion = dungeonData.monsters.minions.find(m => m.id === monsterId);
            if (minion) return minion;

            // Tìm trong Elites
            const elite = dungeonData.monsters.elites.find(m => m.id === monsterId);
            if (elite) return elite;

            // Kiểm tra Boss
            if (dungeonData.monsters.boss.id === monsterId) {
                return dungeonData.monsters.boss;
            }
        }

        // Không tìm thấy → Return null
        return null;
    }
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * USAGE EXAMPLES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * // Trong Dungeon.tsx khi player vào phòng quái:
 * const handleEnterRoom = (room: DungeonRoom) => {
 *     if (room.type === 'MONSTER') {
 *         const isBoss = room.position.x === dungeon.bossRoom.x;
 *         const monsterId = MonsterSpawner.getRandomMonster(dungeonId, isBoss);
 *         startCombat(monsterId);
 *     }
 * };
 * 
 * // Trong QuizBattle.tsx để lấy monster sprite:
 * const monsterData = MonsterSpawner.getMonsterData(monsterId);
 * const sprite = monsterData?.sprite.idle || fallbackSprite;
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
