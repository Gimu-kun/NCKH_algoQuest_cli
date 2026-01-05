/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HỆ THỐNG QUẢN LÝ THÀNH TỰU (Achievement Manager System)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Quản lý toàn bộ lifecycle của achievements (thành tựu):
 * - Kiểm tra điều kiện unlock (achievement criteria)
 * - Tự động phát thưởng khi đạt được (auto reward distribution)
 * - Tracking progress (theo dõi tiế

n độ)
 * - Integration với combat và dungeon systems
 * 
 * KỸ THUẬT SỬ DỤNG:
 * - Strategy Pattern: Mỗi achievement type có logic check riêng
 * - Event-Driven: Check achievements sau các game events (combat win, dungeon clear)
 * - Atomic Operations: Unlock + reward trong 1 transaction
 * 
 * ACHIEVEMENT TYPES:
 * 1. DUNGEON_CLEAR - Hoàn thành X dungeons
 * 2. QUESTIONS_CORRECT - Trả lời đúng X câu hỏi
 * 3. BOSS_DEFEAT - Đánh bại boss với điều kiện đặc biệt
 * 4. SPEEDRUN - Hoàn thành dungeon dưới X giây
 * 5. ACCURACY - Đạt X% accuracy trong boss fight
 * 6. SPELL_UNLOCK - Mở khóa X spells
 * 7. CODE_QUALITY - Code đạt Big O optimal (O(log n) hoặc better)
 * 
 * INTEGRATION FLOW:
 * Combat End → checkCombatAchievements() → unlock → distribute rewards → show notification
 * Dungeon Clear → checkDungeonAchievements() → unlock → rewards → notification
 * 
 * @module AchievementManager
 * @category Core Systems / Gamification
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { ACHIEVEMENTS, BADGES, type Achievement } from './achievements';
import type { usePlayerStore } from '../store/playerStore';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CLASS: AchievementManager
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
export class AchievementManager {
    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * KIỂM TRA ĐIỀU KIỆN THÀNH TỰU (Check Achievement Criteria)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Kiểm tra xem player đã đạt được điều kiện unlock achievement chưa
     * 
     * THUẬT TOÁN - STRATEGY PATTERN:
     * 1. Extract criteria type từ achievement object
     * 2. Switch-case theo type:
     *    - DUNGEON_CLEAR: So sánh dungeonsCleared >= target
     *    - QUESTIONS_CORRECT: So sánh questionsCorrect >= target
     *    - BOSS_DEFEAT: Check bossId match + điều kiện đặc biệt (no_hints)
     *    - SPEEDRUN: Check time <= target seconds
     *    - ACCURACY: Check accuracy >= target% trong boss fight
     *    - SPELL_UNLOCK: So sánh spellsUnlocked >= target
     *    - CODE_QUALITY: Check Big O complexity string match
     * 3. Return true nếu đạt, false nếu chưa
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(1) - Constant time comparisons
     * - Space: O(1) - Không allocate memory
     * 
     * @param {Achievement} achievement - Achievement object cần check
     * @param {any} playerStats - Player statistics từ playerStore
     * @param {any} context - Optional context (combat data, dungeon data)
     * @returns {boolean} True nếu đạt điều kiện, False nếu chưa
     * 
     * @example
     * const achievement = ACHIEVEMENTS.FIRST_STEPS;
     * const met = checkAchievement(achievement, { dungeonsCleared: 1 });
     * // → true (đã clear 1 dungeon)
     */
    static checkAchievement(
        achievement: Achievement,
        playerStats: any,
        context?: any
    ): boolean {
        const { criteria } = achievement;

        switch (criteria.type) {
            case 'DUNGEON_CLEAR':
                // Check: Đã clear đủ số dungeons?
                return playerStats.dungeonsCleared >= (criteria.target as number);

            case 'QUESTIONS_CORRECT':
                // Check: Đã trả lời đúng đủ số câu?
                return playerStats.questionsCorrect >= (criteria.target as number);

            case 'BOSS_DEFEAT':
                // Check: Đánh bại đúng boss + điều kiện đặc biệt
                if (criteria.condition === 'no_hints' && context?.hintsUsed > 0) {
                    return false; // Dùng hint → fail condition
                }
                return context?.bossId === criteria.target;

            case 'SPEEDRUN':
                // Check: Hoàn thành dưới time limit
                if (criteria.condition && context?.time) {
                    return context.time <= (criteria.target as number);
                }
                return false;

            case 'ACCURACY':
                // Check: Đạt accuracy% trong boss fight
                if (criteria.condition === 'boss_fight' && context?.isBoss) {
                    return context.accuracy >= (criteria.target as number);
                }
                return false;

            case 'SPELL_UNLOCK':
                // Check: Đã unlock đủ số spells
                return playerStats.spellsUnlocked >= (criteria.target as number);

            case 'CODE_QUALITY':
                // Check: Code đạt Big O complexity tối ưu
                // VD: O(log n), O(n), O(n log n)
                if (context?.complexity) {
                    return context.complexity === criteria.target;
                }
                return false;

            default:
                return false;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * KIỂM TRA TẤT CẢ THÀNH TỰU (Check All Achievements)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Quét qua TẤT CẢ achievements để tìm những cái mới unlock được
     * 
     * THUẬT TOÁN:
     * 1. Iterate qua Object.values(ACHIEVEMENTS) - tất cả achievements
     * 2. Với mỗi achievement:
     *    a. Skip nếu đã unlock rồi (tránh duplicate)
     *    b. Call checkAchievement() để test criteria
     *    c. Nếu pass → thêm vào unlocked array
     * 3. Return array of newly unlocked achievement IDs
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(n) - n là số achievements (~6 hiện tại)
     * - Space: O(m) - m là số achievements mới unlock (thường 0-2)
     * 
     * USE CASE:
     * - Sau mỗi combat/dungeon: Check xem có unlock achievement mới không
     * - Batch checking: Kiểm tra nhiều achievements cùng lúc
     * 
     * @param {any} playerStats - Player statistics
     * @param {any} context - Game event context
     * @returns {string[]} Array of newly unlocked achievement IDs
     * 
     * @example
     * const newAchievements = checkAll(playerStats, { 
     *   victory: true, 
     *   isBoss: true, 
     *   accuracy: 100 
     * });
     * // → ['perfectionist'] nếu đạt 100% accuracy boss fight
     */
    static checkAll(playerStats: any, context?: any): string[] {
        const unlockedAchievements: string[] = [];

        Object.values(ACHIEVEMENTS).forEach((achievement) => {
            // Skip achievements đã unlock
            if (playerStats.achievements?.includes(achievement.id)) {
                return;
            }

            // Check criteria
            if (this.checkAchievement(achievement, playerStats, context)) {
                unlockedAchievements.push(achievement.id);
            }
        });

        return unlockedAchievements;
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * MỞ KHÓA THÀNH TỰU & PHÁT THƯỞNG (Unlock & Reward)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Thực hiện ATOMIC operation: Unlock achievement + Auto distribute rewards
     * 
     * FLOW - TRANSACTIONAL:
     * 1. Tra cứu achievement data từ ACHIEVEMENTS registry
     * 2. Validation: Achievement tồn tại?
     * 3. Update player state: Add achievement ID vào unlocked list
     * 4. Distribute rewards:
     *    a. O-Points (currency) → addResource()
     *    b. Logic Stones (premium currency) → addResource()
     *    c. Badges (visual) → unlockBadge()
     *    d. Titles (prestige) → setTitle() (optional)
     * 5. Return achievement + rewards data để show notification
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(1) - Direct lookups và updates
     * - Space: O(1) - Return object với 2 references
     * 
     * TRANSACTION SAFETY:
     * - Zustand store đảm bảo atomic updates
     * - Nếu 1 reward fail, các reward khác vẫn apply
     * 
     * @param {string} achievementId - ID achievement cần unlock
     * @param {any} playerStore - Zustand player store instance
     * @returns {Object|null} Achievement data + rewards, hoặc null nếu không tìm thấy
     * 
     * @example
     * const result = unlockAchievement('first_steps', playerStore);
     * // Player nhận:
     * // - Achievement "First Steps" unlocked
     * // - 100 O-Points
     * // - "Apprentice" badge
     */
    static unlockAchievement(achievementId: string, playerStore: any) {
        // Tra cứu achievement (case-insensitive)
        const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];

        if (!achievement) {
            console.warn(`Achievement not found: ${achievementId}`);
            return null;
        }

        // Unlock achievement trong player state
        playerStore.unlockAchievement(achievementId);

        // Phát thưởng (reward distribution)
        const rewards = achievement.rewards;

        if (rewards.oPoints) {
            playerStore.addResource('O_POINTS', rewards.oPoints);
        }
        if (rewards.logicStone) {
            playerStore.addResource('LOGIC_STONE', rewards.logicStone);
        }
        if (rewards.badge) {
            playerStore.unlockBadge(rewards.badge);
        }
        if (rewards.title) {
            // Optional: Tự động equip title mới
            // playerStore.setTitle(rewards.title);
        }

        // Return data để UI show notification
        return {
            achievement,
            rewards
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * TÍNH TIẾN ĐỘ THÀNH TỰU (Calculate Achievement Progress)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Tính % hoàn thành của achievements có progress bar
     * 
     * THUẬT TOÁN:
     * 1. Tra cứu achievement và extract target number
     * 2. Tùy theo type:
     *    - DUNGEON_CLEAR: (dungeonsCleared / target) * 100
     *    - QUESTIONS_CORRECT: (questionsCorrect / target) * 100
     *    - SPELL_UNLOCK: (spellsUnlocked / target) * 100
     *    - Binary types (BOSS_DEFEAT, etc): Return 0 (no progress, chỉ done/not done)
     * 3. Clamp kết quả trong [0, 100] bằng Math.min()
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(1)
     * - Space: O(1)
     * 
     * USE CASE:
     * - Achievement UI: Show progress bar
     * - Notification: "5/10 dungeons cleared"
     * 
     * @param {string} achievementId - Achievement ID
     * @param {any} playerStats - Player statistics
     * @returns {number} Progress percentage (0-100)
     * 
     * @example
     * const progress = getProgress('first_steps', { dungeonsCleared: 0 });
     * // → 0% chưa làm gì
     * 
     * const progress2 = getProgress('spell_collector', { spellsUnlocked: 5 });
     * // → 50% (5/10 spells)
     */
    static getProgress(achievementId: string, playerStats: any): number {
        const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];
        if (!achievement) return 0;

        const { criteria } = achievement;
        const target = criteria.target as number;

        switch (criteria.type) {
            case 'DUNGEON_CLEAR':
                return Math.min(100, (playerStats.dungeonsCleared / target) * 100);

            case 'QUESTIONS_CORRECT':
                return Math.min(100, (playerStats.questionsCorrect / target) * 100);

            case 'SPELL_UNLOCK':
                return Math.min(100, (playerStats.spellsUnlocked / target) * 100);

            default:
                // Binary achievements: Không có progress, chỉ 0% hoặc 100%
                return 0;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * LẤY TẤT CẢ ACHIEVEMENTS VỚI PROGRESS (Get All With Progress)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Tạo enriched list của tất cả achievements kèm unlocked status và progress
     * 
     * USE CASE:
     * - Achievement screen: Hiển thị full list với progress bars
     * - Statistics: Player đã unlock bao nhiêu %
     * 
     * ĐỘ PHỨC TẠP:
     * - Time: O(n) - n achievements
     * - Space: O(n) - Tạo enriched array
     * 
     * @param {any} playerStats - Player statistics
     * @returns {Array} Enriched achievements với unlocked flag và progress
     */
    static getAllWithProgress(playerStats: any) {
        return Object.values(ACHIEVEMENTS).map((achievement) => ({
            ...achievement,
            unlocked: playerStats.achievements?.includes(achievement.id) || false,
            progress: this.getProgress(achievement.id, playerStats)
        }));
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * CHECK COMBAT ACHIEVEMENTS (Wrapper)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Wrapper function để check achievements sau combat với typed context
     * 
     * @param combatContext - Combat event data (victory, accuracy, hints, etc)
     * @param playerStats - Player stats
     * @returns {string[]} Newly unlocked achievement IDs
     */
    static checkCombatAchievements(combatContext: {
        victory: boolean;
        accuracy: number;
        hintsUsed: number;
        isBoss: boolean;
        bossId?: string;
        time?: number;
    }, playerStats: any): string[] {
        return this.checkAll(playerStats, combatContext);
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * CHECK DUNGEON ACHIEVEMENTS (Wrapper)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Wrapper function để check achievements sau dungeon clear
     * 
     * @param dungeonContext - Dungeon completion data
     * @param playerStats - Player stats
     * @returns {string[]} Newly unlocked achievement IDs
     */
    static checkDungeonAchievements(dungeonContext: {
        dungeonId: string;
        time: number;
        perfect: boolean;
    }, playerStats: any): string[] {
        return this.checkAll(playerStats, dungeonContext);
    }
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ACHIEVEMENT NOTIFICATION INTERFACE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Data structure cho achievement unlock notifications
 */
export interface AchievementNotification {
    id: string;
    achievement: Achievement;
    rewards: {
        oPoints?: number;
        logicStone?: number;
        badge?: string;
        title?: string;
    };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TẠO NOTIFICATION DATA (Helper Function)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Helper để tạo notification object từ achievement ID
 * 
 * @param {string} achievementId - Achievement ID
 * @returns {AchievementNotification | null} Notification data hoặc null
 */
export function createAchievementNotification(
    achievementId: string
): AchievementNotification | null {
    const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];
    if (!achievement) return null;

    return {
        id: achievement.id,
        achievement,
        rewards: achievement.rewards
    };
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * USAGE EXAMPLES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * // SAU KHI CHIẾN THẮNG COMBAT
 * const newAchievements = AchievementManager.checkCombatAchievements({
 *     victory: true,
 *     accuracy: 100,
 *     hintsUsed: 0,
 *     isBoss: true,
 *     bossId: 'initialization_golem'
 * }, playerStore.stats);
 * 
 * newAchievements.forEach(id => {
 *     const result = AchievementManager.unlockAchievement(id, playerStore);
 *     showNotification(`Achievement Unlocked: ${result.achievement.displayName}`);
 * });
 * 
 * // TRONG ACHIEVEMENT SCREEN
 * const allAchievements = AchievementManager.getAllWithProgress(playerStore.stats);
 * allAchievements.forEach(ach => {
 *     console.log(`${ach.displayName}: ${ach.unlocked ? 'Unlocked' : `${ach.progress}%`}`);
 * });
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
