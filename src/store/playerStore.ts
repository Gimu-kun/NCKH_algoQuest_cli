/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUẢN LÝ DỮ LIỆU NGƯỜI CHƠI (Player Store / Data Persistence)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Quản lý toàn bộ dữ liệu bền vững (persistent data) của người chơi:
 * - Stats: Level, XP, tài nguyên (Gold, O-Points...).
 * - Progression: Chapter hiện tại, ải đã qua, spells đã học.
 * - Inventory: Items, Decorations, Cosmetics.
 * - Achievements & Quests: Danh sách thành tựu và nhiệm vụ.
 * 
 * KỸ THUẬT:
 * - Zustand Persist Middleware: Tự động lưu/đọc data từ LocalStorage.
 * - Atomic Operations: Các hành động (mua item, nhận thưởng) đảm bảo tính toàn vẹn.
 * 
 * DATA STRUCTURE:
 * - PlayerState: Chứa raw data.
 * - PlayerActions: Chứa các hàm business logic (addGold, unlockLevel...).
 * 
 * @module PlayerStore
 * @category State Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResourceType } from '../data/models/Item';
import { QUEST_DATABASE } from '../data/quests/QuestDatabase';

// Interface chính chứa dữ liệu người chơi
export interface PlayerState {
    // === Thông Tin Cơ Bản ===
    name: string;
    level: number;
    experience: number;

    // === Tài Nguyên (Economy) ===
    resources: Record<ResourceType, number>;

    // === Tiến Độ Game (Progression) ===
    currentChapter: number;
    completedDungeons: string[];  // Danh sách ID các ải đã hoàn thành
    unlockedSpells: string[];     // Danh sách ID các phép thuật (Blueprints)
    unlockedRunes: string[];      // Danh sách ID các cổ ngữ (Runes)

    // === Kho Đồ (Inventory) ===
    decorations: string[];        // Vật phẩm trang trí Logic Farm (Trong kho)
    placedDecorations: { id: string, x: number, y: number }[]; // Vật phẩm đã đặt ra farm
    cosmetics: string[];          // Trang phục cho nhân vật
    equippedCosmetics: Record<string, string>; // Slot (Head/Body) -> ItemID

    // === Thành Tựu & Danh Hiệu ===
    achievements: string[];       // Thành tựu đã mở khóa
    badges: string[];             // Huy hiệu đã thu thập
    equippedBadge: string | null; // Huy hiệu đang đeo
    playerTitle: string | null;   // Danh hiệu hiển thị (VD: "Algorithm Wizard")

    // === Hệ Thống Nhiệm Vụ (Quest System) ===
    quests: Array<{
        id: string;
        title: string;
        description: string;
        progress: number;
        target: number;
        status: 'active' | 'completed';
        rewards: {
            gold: number;
            exp: number;
        };
    }>;
    activeQuests: string[];       // ID các nhiệm vụ đang thực hiện
    completedQuests: string[];    // ID các nhiệm vụ đã xong

    // === Thống Kê Tổng Hợp (Statistics) ===
    stats: {
        questionsAnswered: number; // Tổng số câu hỏi đã trả lời
        questionsCorrect: number;  // Số câu đúng
        spellsBuilt: number;       // Số phép thuật đã chế tạo
        dungeonsCleared: number;   // Số lần vượt ải
        bossesDefeated: number;    // Số trùm đã hạ gục
    };
}

// Interface định nghĩa các hành động tương tác với dữ liệu
<<<<<<< HEAD
export interface PlayerActions {
=======
interface PlayerActions {
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
    // === Quản Lý Tài Nguyên ===
    addResource: (type: ResourceType, amount: number) => void;
    removeResource: (type: ResourceType, amount: number) => boolean;

    // === Quản Lý Tiến Độ ===
    completeDungeon: (dungeonId: string) => void;
    unlockSpell: (spellId: string) => void;
    unlockRune: (runeId: string) => void;

    // === Quản Lý Nhiệm Vụ ===
    startQuest: (questId: string) => void;
    checkQuestProgress: (type: string, target: string, amount: number) => void;
    completeQuest: (questId: string) => void;

    // === Quản Lý Kho Đồ ===
    addDecoration: (itemId: string) => void;
    placeDecoration: (itemId: string, x: number, y: number) => void;
    addCosmetic: (itemId: string) => void;
    equipCosmetic: (slot: string, itemId: string) => void;

    // === Cập Nhật Thống Kê ===
    recordAnswer: (correct: boolean) => void;

    // === Thành Tựu & Danh Hiệu ===
    unlockAchievement: (achievementId: string) => void;
    unlockBadge: (badgeId: string) => void;
    equipBadge: (badgeId: string | null) => void;
    setTitle: (title: string | null) => void;

    // === Debug / Testing ===
    reset: () => void;
}

// Giá trị khởi tạo mặc định cho người chơi mới
const initialPlayerState: PlayerState = {
    name: 'Apprentice',
    level: 1,
    experience: 0,
    resources: {
        [ResourceType.DATA_WOOD]: 0,
        [ResourceType.LOGIC_STONE]: 0,
        [ResourceType.O_POINTS]: 100, // Tặng 100 điểm khởi đầu
        [ResourceType.GOLD]: 0
    },
    currentChapter: 1,
    completedDungeons: [],
    unlockedSpells: [],
    unlockedRunes: [],
    decorations: [],
    placedDecorations: [], // Init empty
    cosmetics: [],
    equippedCosmetics: {},
    quests: [],
    activeQuests: [],
    completedQuests: [],
    achievements: [],
    badges: [],
    equippedBadge: null,
    playerTitle: null,
    stats: {
        questionsAnswered: 0,
        questionsCorrect: 0,
        spellsBuilt: 0,
        dungeonsCleared: 0,
        bossesDefeated: 0
    }
};

<<<<<<< HEAD
// Export type for external use
export type PlayerStore = PlayerState & PlayerActions;

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CREATE PERSISTENT STORE
 * ═══════════════════════════════════════════════════════════════════════════
 */
<<<<<<< HEAD
export const usePlayerStore = create<PlayerStore>()(
=======
export const usePlayerStore = create<PlayerState & PlayerActions>()(
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
    persist(
        (set, get) => ({
            ...initialPlayerState,

            /**
             * Thêm tài nguyên cho người chơi
             */
            addResource: (type, amount) => {
                set((state) => ({
                    resources: {
                        ...state.resources,
                        [type]: state.resources[type] + amount
                    }
                }));
                // Check Quests
                get().checkQuestProgress('COLLECT_ITEMS', type, amount);
            },

            /**
             * Trừ tài nguyên (Dùng khi mua đồ, chế tạo)
             * @returns true nếu trừ thành công, false nếu không đủ tiền
             */
            removeResource: (type, amount) => {
                const current = get().resources[type];
                if (current < amount) return false;

                set((state) => ({
                    resources: {
                        ...state.resources,
                        [type]: state.resources[type] - amount
                    }
                }));
                return true;
            },

            /**
             * Ghi nhận hoàn thành ải
             * - Thêm vào list completed
             * - Tăng thống kê dungeonsCleared
             */
            completeDungeon: (dungeonId) => {
                set((state) => ({
                    completedDungeons: [...state.completedDungeons, dungeonId],
                    stats: {
                        ...state.stats,
                        dungeonsCleared: state.stats.dungeonsCleared + 1
                    }
                }));
                // Check Quests
                get().checkQuestProgress('COMPLETE_DUNGEON', dungeonId, 1);
            },

            /**
             * Mở khóa phép thuật mới (Sau khi chế tạo thành công)
             */
            unlockSpell: (spellId) => {
                set((state) => ({
                    unlockedSpells: [...state.unlockedSpells, spellId],
                    stats: {
                        ...state.stats,
                        spellsBuilt: state.stats.spellsBuilt + 1
                    }
                }));
            },

            unlockRune: (runeId) => {
                set((state) => ({
                    unlockedRunes: [...state.unlockedRunes, runeId]
                }));
            },

            startQuest: (questId) => {
                const { activeQuests, completedQuests } = get();

                // Kiểm tra nếu đã nhận hoặc đã xong
                if (activeQuests.includes(questId) || completedQuests.includes(questId)) return;

                const questDef = QUEST_DATABASE[questId];

                if (!questDef) {
                    console.error(`Quest ID ${questId} not found in database`);
                    return;
                }

                const newQuestEntry = {
                    id: questDef.id,
                    title: questDef.name,
                    description: questDef.description,
                    progress: 0,
                    target: questDef.requirements[0].count, // Giả sử quest đơn giản 1 requirement
                    status: 'active' as const,
                    rewards: {
                        gold: questDef.rewards.gold || 0,
                        exp: questDef.rewards.oPoints || 0
                    }
                };

                set((state) => ({
                    activeQuests: [...state.activeQuests, questId],
                    quests: [...state.quests, newQuestEntry]
                }));
            },

            checkQuestProgress: (type, target, amount) => {
                const { quests, activeQuests, completeQuest } = get();

                activeQuests.forEach(questId => {
                    const questEntry = quests.find(q => q.id === questId);
                    if (!questEntry) return;

                    // Lookup definition for detailed requirements
                    const questDef = QUEST_DATABASE[questId];
                    if (!questDef) return;

                    // Simple check: Assumes quest has 1 main requirement tracked by 'progress'
                    // In a complex system, we'd track each requirement separately.
                    const req = questDef.requirements[0];

                    if (req.type === type && (req.target === target || req.target === 'any')) {
                        const newProgress = Math.min(questEntry.progress + amount, questEntry.target);

                        if (newProgress !== questEntry.progress) {
                            // Update progress in state
                            set(state => ({
                                quests: state.quests.map(q =>
                                    q.id === questId ? { ...q, progress: newProgress } : q
                                )
                            }));

                            // Check completion
                            if (newProgress >= questEntry.target) {
                                completeQuest(questId);
                            }
                        }
                    }
                });
            },

            completeQuest: (questId) => {
                const { quests, addResource } = get();
                const questEntry = quests.find(q => q.id === questId);

                if (questEntry) {
                    // Grant Rewards
                    if (questEntry.rewards.gold > 0) addResource(ResourceType.GOLD, questEntry.rewards.gold);
                    if (questEntry.rewards.exp > 0) addResource(ResourceType.O_POINTS, questEntry.rewards.exp);

                    // Note: More complex rewards (items, blueprints) need more handlers
                }

                set((state) => ({
                    activeQuests: state.activeQuests.filter(id => id !== questId),
                    completedQuests: [...state.completedQuests, questId],
                    // Update status in quests array
                    quests: state.quests.map(q =>
                        q.id === questId ? { ...q, status: 'completed' } : q
                    )
                }));
            },

            addDecoration: (itemId) => {
                set((state) => ({
                    decorations: [...state.decorations, itemId]
                }));
            },

            placeDecoration: (itemId, x, y) => {
                set((state) => {
                    // Remove one instance from inventory
                    const index = state.decorations.indexOf(itemId);
                    if (index === -1) return {};

                    const newDecorations = [...state.decorations];
                    newDecorations.splice(index, 1);

                    return {
                        decorations: newDecorations,
                        placedDecorations: [...state.placedDecorations, { id: itemId, x, y }]
                    };
                });
            },

            addCosmetic: (itemId) => {
                set((state) => ({
                    cosmetics: [...state.cosmetics, itemId]
                }));
            },

            equipCosmetic: (slot, itemId) => {
                set((state) => ({
                    equippedCosmetics: {
                        ...state.equippedCosmetics,
                        [slot]: itemId
                    }
                }));
            },

            /**
             * Ghi lại kết quả trả lời câu hỏi
             * - Cập nhật thống kê tổng số câu và số câu đúng
             */
            recordAnswer: (correct) => {
                set((state) => ({
                    stats: {
                        ...state.stats,
                        questionsAnswered: state.stats.questionsAnswered + 1,
                        questionsCorrect: state.stats.questionsCorrect + (correct ? 1 : 0)
                    }
                }));
            },

            unlockAchievement: (achievementId) => {
                set((state) => ({
                    achievements: [...state.achievements, achievementId]
                }));
            },

            unlockBadge: (badgeId) => {
                set((state) => ({
                    badges: [...state.badges, badgeId]
                }));
            },

            equipBadge: (badgeId) => {
                set({ equippedBadge: badgeId });
            },

            setTitle: (title) => {
                set({ playerTitle: title });
            },

            /**
             * Reset toàn bộ dữ liệu về mặc định (Dùng cho Testing/New Game)
             */
            reset: () => {
                set(initialPlayerState);
            }
        }),
        {
            name: 'algorithm-wizard-player', // Key lưu trong LocalStorage
        }
    )
);
