/**
 * Quản Lý Trạng Thái Game Toàn Cục sử dụng Zustand
 * Quản lý tiến độ người chơi, kho đồ, nhiệm vụ và trạng thái game
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResourceType } from '../data/models/Item';

// Thống kê và tiến độ người chơi
export interface PlayerState {
    // Thông tin cơ bản
    name: string;
    level: number;
    experience: number;

    // Tài nguyên
    resources: Record<ResourceType, number>;

    // Tiến độ
    currentChapter: number;
    completedDungeons: string[];  // Dungeon IDs
    unlockedSpells: string[];     // Spell IDs
    unlockedRunes: string[];      // Rune IDs

    // Kho Đồ
    decorations: string[];        // Decoration item IDs
    cosmetics: string[];          // Cosmetic item IDs
    equippedCosmetics: Record<string, string>; // Slot -> item ID

    // Thành Tựu & Huy Hiệu
    achievements: string[];       // Unlocked achievement IDs
    badges: string[];             // Unlocked badge IDs
    equippedBadge: string | null; // Currently equipped badge
    playerTitle: string | null;   // Current title

    // Nhiệm vụ
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
    activeQuests: string[];       // Quest IDs
    completedQuests: string[];

    // Thống kê
    stats: {
        questionsAnswered: number;
        questionsCorrect: number;
        spellsBuilt: number;
        dungeonsCleared: number;
        bossesDefeated: number;
    };
}

interface PlayerActions {
    // Tài nguyên
    addResource: (type: ResourceType, amount: number) => void;
    removeResource: (type: ResourceType, amount: number) => boolean;

    // Tiến độ
    completeDungeon: (dungeonId: string) => void;
    unlockSpell: (spellId: string) => void;
    unlockRune: (runeId: string) => void;

    // Quests
    startQuest: (questId: string) => void;
    completeQuest: (questId: string) => void;

    // Kho Đồ
    addDecoration: (itemId: string) => void;
    addCosmetic: (itemId: string) => void;
    equipCosmetic: (slot: string, itemId: string) => void;

    // Stats
    recordAnswer: (correct: boolean) => void;

    // Achievements
    unlockAchievement: (achievementId: string) => void;

    // Reset (để kiểm thử)
    reset: () => void;
}

const initialPlayerState: PlayerState = {
    name: 'Apprentice',
    level: 1,
    experience: 0,
    resources: {
        [ResourceType.DATA_WOOD]: 0,
        [ResourceType.LOGIC_STONE]: 0,
        [ResourceType.O_POINTS]: 100,
        [ResourceType.GOLD]: 0
    },
    currentChapter: 1,
    completedDungeons: [],
    unlockedSpells: [],
    unlockedRunes: [],
    decorations: [],
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

export const usePlayerStore = create<PlayerState & PlayerActions>()(
    persist(
        (set, get) => ({
            ...initialPlayerState,

            addResource: (type, amount) => {
                set((state) => ({
                    resources: {
                        ...state.resources,
                        [type]: state.resources[type] + amount
                    }
                }));
            },

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

            completeDungeon: (dungeonId) => {
                set((state) => ({
                    completedDungeons: [...state.completedDungeons, dungeonId],
                    stats: {
                        ...state.stats,
                        dungeonsCleared: state.stats.dungeonsCleared + 1
                    }
                }));
            },

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
                set((state) => ({
                    activeQuests: [...state.activeQuests, questId]
                }));
            },

            completeQuest: (questId) => {
                set((state) => ({
                    activeQuests: state.activeQuests.filter(id => id !== questId),
                    completedQuests: [...state.completedQuests, questId]
                }));
            },

            addDecoration: (itemId) => {
                set((state) => ({
                    decorations: [...state.decorations, itemId]
                }));
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

            reset: () => {
                set(initialPlayerState);
            }
        }),
        {
            name: 'algorithm-wizard-player', // LocalStorage key
        }
    )
);
