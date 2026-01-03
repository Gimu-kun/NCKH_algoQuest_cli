/**
 * Quản Lý Trạng Thái Game
 * Quản lý cảnh hiện tại, trạng thái chiến đấu và trạng thái UI
 */

import { create } from 'zustand';
import { DUNGEON_1, generateDungeonRooms } from '../data/dungeons/dungeon1';
import type { DungeonRoom, DungeonConfig } from '../data/dungeons/dungeon1';

export interface DungeonState {
    rooms: DungeonRoom[];
    playerPos: { x: number; y: number };
    config: DungeonConfig;
}

export const enum GameScene {
    MAIN_MENU = 'MAIN_MENU',
    HUB_WORLD = 'HUB_WORLD',
    DUNGEON = 'DUNGEON',
    LOGIC_FARM = 'LOGIC_FARM',
    CUTSCENE = 'CUTSCENE',
    COMBAT = 'COMBAT',
    BUILD_INTERFACE = 'BUILD_INTERFACE',
    SHOP = 'SHOP',
    ACHIEVEMENTS = 'ACHIEVEMENTS',
    LEADERBOARDS = 'LEADERBOARDS'
}

export interface CombatState {
    active: boolean;
    monsterId: string | null;
    currentQuestion: string | null;
    playerHealth: number;
    monsterHealth: number;
    hintsUsed: number;
    currentPhase: number;
}

export interface GameState {
    // Quản lý Cảnh
    currentScene: GameScene;
    previousScene: GameScene | null;
    currentDungeonId: string | null;

    // Combat
    combat: CombatState;

    // Trạng Thái UI
    sparkyVisible: boolean;
    sparkyMessage: string | null;
    dialogueOpen: boolean;
    dialogueNPC: string | null;
    inventoryOpen: boolean;
    menuOpen: boolean;
    questsOpen: boolean;
    settingsOpen: boolean;

    // Bảng Cổ Ngữ (Trình Soạn Code)
    runicConsoleOpen: boolean;
    currentBlueprintId: string | null;

    // Toast notifications
    toasts: Array<{ id: string; type: string; message: string; duration?: number }>;

    // Loading
    isLoading: boolean;
    loadingMessage: string;

    // Theme
    theme: 'dark' | 'light';

    // Dungeon State persistence
    dungeonState: DungeonState | null;
}

interface GameActions {
    // Chuyển Cảnh
    setScene: (scene: GameScene) => void;
    enterDungeon: (dungeonId: string) => void;
    exitDungeon: () => void;

    // Combat
    startCombat: (monsterId: string, questionId?: string) => void;
    endCombat: (victory: boolean) => void;
    updateMonsterHealth: (health: number) => void;
    useHint: () => void;

    // Trợ Lý AI Sparky
    showSparky: (message: string) => void;
    hideSparky: () => void;

    // Hội Thoại
    openDialogue: (npcId: string) => void;
    closeDialogue: () => void;

    // Chuyển Đổi UI
    toggleInventory: () => void;
    toggleMenu: () => void;
    toggleQuests: () => void;
    toggleSettings: () => void;

    // Runic Console
    openRunicConsole: (blueprintId: string) => void;
    closeRunicConsole: () => void;

    // Toast notifications
    addToast: (type: string, message: string, duration?: number) => void;
    removeToast: (id: string) => void;

    // Loading
    setLoading: (loading: boolean, message?: string) => void;

    // Theme System
    toggleTheme: () => void;

    // Dungeon State Actions
    initDungeon: (config: DungeonConfig) => void;
    updateDungeonState: (newState: Partial<DungeonState>) => void;
}

const initialCombatState: CombatState = {
    active: false,
    monsterId: null,
    currentQuestion: null,
    playerHealth: 100,
    monsterHealth: 100,
    hintsUsed: 0,
    currentPhase: 1
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
    // Initial state
    currentScene: GameScene.MAIN_MENU,
    previousScene: null,
    currentDungeonId: null,
    combat: initialCombatState,
    sparkyVisible: false,
    sparkyMessage: null,
    dialogueOpen: false,
    dialogueNPC: null,
    inventoryOpen: false,
    menuOpen: false,
    questsOpen: false,
    settingsOpen: false,
    runicConsoleOpen: false,
    currentBlueprintId: null,
    toasts: [],
    isLoading: false,
    loadingMessage: '',

    // Theme defaults to dark
    theme: 'dark',

    // Dungeon State persistence
    dungeonState: null,

    // Các Hành Động
    setScene: (scene) => {
        set((state) => ({
            previousScene: state.currentScene,
            currentScene: scene
        }));
    },

    initDungeon: (config) => {
        // Only init if not already exists or different dungeon
        // For simplicity in Phase 1, we force init
        const rooms = generateDungeonRooms(config);
        set({
            dungeonState: {
                rooms,
                playerPos: config.entrance,
                config
            }
        });
    },

    updateDungeonState: (newState) => {
        set((state) => ({
            dungeonState: {
                ...state.dungeonState!,
                ...newState
            }
        }));
    },

    enterDungeon: (dungeonId) => {
        // Initialize dungeon state based on ID
        // For Phase 1, we only have one dungeon

        let config = DUNGEON_1;
        // Logic to select dungeon config based on ID would go here

        const rooms = generateDungeonRooms(config);

        set({
            currentScene: GameScene.DUNGEON,
            currentDungeonId: dungeonId,
            isLoading: true,
            loadingMessage: 'Entering dungeon...',
            dungeonState: {
                rooms,
                playerPos: config.entrance,
                config
            }
        });

        // Mô phỏng quá trình tải
        setTimeout(() => {
            set({ isLoading: false });
        }, 1000);
    },

    exitDungeon: () => {
        set({
            currentScene: GameScene.HUB_WORLD,
            currentDungeonId: null,
            combat: initialCombatState,
            dungeonState: null // Reset state on exit
        });
    },

    startCombat: (monsterId, questionId) => {
        set({
            currentScene: GameScene.COMBAT,
            combat: {
                active: true,
                monsterId,
                currentQuestion: questionId || null,
                playerHealth: 100,
                monsterHealth: 100,
                hintsUsed: 0,
                currentPhase: 1
            }
        });
    },

    endCombat: (victory) => {
        const state = get();
        let newDungeonState = state.dungeonState;

        // Nếu thắng và đang trong Dungeon, đánh dấu phòng đã hoàn thành
        if (victory && state.dungeonState) {
            const { x, y } = state.dungeonState.playerPos;
            const newRooms = state.dungeonState.rooms.map(r =>
                r.x === x && r.y === y ? { ...r, cleared: true } : r
            );

            newDungeonState = {
                ...state.dungeonState,
                rooms: newRooms
            };
        }

        const previousScene = state.previousScene;
        set({
            currentScene: previousScene || GameScene.DUNGEON,
            combat: initialCombatState,
            dungeonState: newDungeonState
        });

        if (victory) {
            get().showSparky('💡 Chiến thắng! Phòng đã được dọn sạch!');
        }
    },

    updateMonsterHealth: (health) => {
        set((state) => ({
            combat: {
                ...state.combat,
                monsterHealth: health
            }
        }));

        if (health <= 0) {
            get().endCombat(true);
        }
    },

    useHint: () => {
        set((state) => ({
            combat: {
                ...state.combat,
                hintsUsed: state.combat.hintsUsed + 1
            }
        }));
    },

    showSparky: (message) => {
        set({
            sparkyVisible: true,
            sparkyMessage: message
        });
    },

    hideSparky: () => {
        set({
            sparkyVisible: false,
            sparkyMessage: null
        });
    },

    openDialogue: (npcId) => {
        set({
            dialogueOpen: true,
            dialogueNPC: npcId
        });
    },

    closeDialogue: () => {
        set({
            dialogueOpen: false,
            dialogueNPC: null
        });
    },

    toggleInventory: () => {
        set((state) => ({
            inventoryOpen: !state.inventoryOpen
        }));
    },

    toggleMenu: () => {
        set((state) => ({
            menuOpen: !state.menuOpen
        }));
    },

    toggleQuests: () => {
        set((state) => ({
            questsOpen: !state.questsOpen
        }));
    },

    toggleSettings: () => {
        set((state) => ({
            settingsOpen: !state.settingsOpen
        }));
    },

    openRunicConsole: (blueprintId) => {
        set({
            runicConsoleOpen: true,
            currentBlueprintId: blueprintId
        });
    },

    closeRunicConsole: () => {
        set({
            runicConsoleOpen: false,
            currentBlueprintId: null
        });
    },

    addToast: (type, message, duration) => {
        const id = `toast-${Date.now()}`;
        set((state) => ({
            toasts: [...state.toasts, { id, type, message, duration }]
        }));
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }));
    },

    setLoading: (loading, message = '') => {
        set({
            isLoading: loading,
            loadingMessage: message
        });
    },

    toggleTheme: () => {
        set((state) => ({
            theme: state.theme === 'dark' ? 'light' : 'dark'
        }));
    }
}));
