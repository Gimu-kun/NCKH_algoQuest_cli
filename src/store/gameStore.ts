/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUẢN LÝ TRẠNG THÁI GAME (Game Store / State Management)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Sử dụng Zustand để quản lý Global State của Game Loop, bao gồm:
 * - Scene Management: Chuyển đổi giữa các màn chơi (Menu, Hub, Dungeon, Coombar...).
 * - Dungeon State: Lưu trữ trạng thái của Dungeon hiện tại (vị trí player, trạng thái phòng).
 * - Combat State: Quản lý turn-based combat (HP, phase, câu hỏi hiện tại).
 * - UI State: Quản lý trạng thái đóng/mở của các Panels (Inventory, Quest, Settings...).
 * 
 * KỸ THUẬT:
 * - Zustand Store: State management thư viện nhẹ, hiệu năng cao.
 * - Actions Pattern: Các hàm thay đổi state được define rõ ràng (StartCombat, EndCombat, etc.).
 * 
 * FLOW CHÍNH:
 * - Init Dungeon -> Enter Dungeon -> Move -> Combat Start -> Combat Loop -> Combat End -> Update Dungeon State.
 * 
 * @module GameStore
 * @category State Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { create } from 'zustand';
<<<<<<< HEAD
import { persist, createJSONStorage } from 'zustand/middleware';
import { usePlayerStore } from './playerStore';
import { DUNGEON_1, generateDungeonRooms } from '../data/dungeons/dungeon1';
import { DUNGEON_2_CHAOS } from '../data/dungeons/dungeon2-data';
import { DUNGEON_3_CHAINED } from '../data/dungeons/dungeon3-data';
import { DUNGEON_4_RELIC } from '../data/dungeons/dungeon4-data';
import { DUNGEON_5_FOREST } from '../data/dungeons/dungeon5-data';
import { DUNGEON_7_FINAL } from '../data/dungeons/dungeon7-data';
import type { DungeonRoom, DungeonConfig } from '../data/dungeons/dungeon1';
import type { DungeonData } from '../data/models/Dungeon';
=======
import { usePlayerStore } from './playerStore';
import { DUNGEON_1, generateDungeonRooms } from '../data/dungeons/dungeon1';
import type { DungeonRoom, DungeonConfig } from '../data/dungeons/dungeon1';
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

// Định nghĩa State cho Dungeon Session hiện tại
export interface DungeonState {
    rooms: DungeonRoom[];          // Danh sách các phòng và trạng thái
    playerPos: { x: number; y: number }; // Vị trí hiện tại của player (Grid coords)
    config: DungeonConfig;         // Cấu hình của Dungeon (kích thước, loại quái...)
}

// Enum cho các Cảnh (Screen/Scene) trong game
export const enum GameScene {
    MAIN_MENU = 'MAIN_MENU',       // Màn hình chính
    HUB_WORLD = 'HUB_WORLD',       // Thế giới trung tâm
    DUNGEON = 'DUNGEON',           // Màn chơi Dungeon (Grid movement)
    LOGIC_FARM = 'LOGIC_FARM',     // Khu vực Logic Farm (Future)
    CUTSCENE = 'CUTSCENE',         // Các đoạn cắt cảnh
    COMBAT = 'COMBAT',             // Màn hình chiến đấu
    BUILD_INTERFACE = 'BUILD_INTERFACE', // Giao diện chế tạo phép (Future)
    SHOP = 'SHOP',                 // Cửa hàng
    ACHIEVEMENTS = 'ACHIEVEMENTS', // Màn hình thành tựu
<<<<<<< HEAD
    LEADERBOARDS = 'LEADERBOARDS', // Bảng xếp hạng
    ALGO_LAB = 'ALGO_LAB'          // Phòng thí nghiệm thuật toán
=======
    LEADERBOARDS = 'LEADERBOARDS'  // Bảng xếp hạng
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
}

// State quản lý Session Combat
export interface CombatState {
    active: boolean;               // Đang trong trận chiến hay không
    monsterId: string | null;      // ID quái vật đang đánh
    currentQuestion: string | null; // ID câu hỏi hiện tại (nếu có)
    playerHealth: number;          // Máu người chơi (0-100)
    monsterHealth: number;         // Máu quái vật (0-100)
    hintsUsed: number;             // Số lần dùng gợi ý
    currentPhase: number;          // Giai đoạn của Boss (nếu là Boss fight)
}

// Interface chính cho Game Store State
export interface GameState {
    // === Quản lý Cảnh ===
    currentScene: GameScene;
    previousScene: GameScene | null;
    currentDungeonId: string | null;

    // === Combat ===
    combat: CombatState;

    // === Trạng Thái UI (Visibility) ===
    sparkyVisible: boolean;
    sparkyMessage: string | null;
    dialogueOpen: boolean;
    dialogueNPC: string | null;
    inventoryOpen: boolean;
    menuOpen: boolean;
    questsOpen: boolean;
    settingsOpen: boolean;

    // === Bảng Cổ Ngữ (Trình Soạn Code - Future) ===
    runicConsoleOpen: boolean;
    currentBlueprintId: string | null;

    // === Toast Notifications (Thông báo nổi) ===
    toasts: Array<{ id: string; type: string; message: string; duration?: number }>;

    // === Loading State ===
    isLoading: boolean;
    loadingMessage: string;

    // === Theme (Giao diện Sáng/Tối) ===
    theme: 'dark' | 'light';

    // === Dungeon State Persistence ===
    dungeonState: DungeonState | null;
}

// Interface cho các Actions (Methods thay đổi state)
interface GameActions {
    // === Chuyển Cảnh ===
    setScene: (scene: GameScene) => void;
    enterDungeon: (dungeonId: string) => void;
    exitDungeon: () => void;

    // === Combat Actions ===
    startCombat: (monsterId: string, questionId?: string) => void;
    endCombat: (victory: boolean) => void;
    updateMonsterHealth: (health: number) => void;
    updatePlayerHealth: (health: number) => void;
    useHint: () => void;

    // === Trợ Lý AI Sparky ===
    showSparky: (message: string) => void;
    hideSparky: () => void;

    // === Hệ Thống Hội Thoại (Dialogue) ===
    openDialogue: (npcId: string) => void;
    closeDialogue: () => void;

    // === Quản Lý UI Panels ===
    toggleInventory: () => void;
    toggleMenu: () => void;
    toggleQuests: () => void;
    toggleSettings: () => void;

    // === Runic Console ===
    openRunicConsole: (blueprintId: string) => void;
    closeRunicConsole: () => void;

    // === Toast Notifications ===
    addToast: (type: string, message: string, duration?: number) => void;
    removeToast: (id: string) => void;

    // === Loading System ===
    setLoading: (loading: boolean, message?: string) => void;

    // === Theme System ===
    toggleTheme: () => void;

    // === Dungeon Management ===
    initDungeon: (config: DungeonConfig) => void;
    updateDungeonState: (newState: Partial<DungeonState>) => void;
}

// Initial state cho Combat
const initialCombatState: CombatState = {
    active: false,
    monsterId: null,
    currentQuestion: null,
    playerHealth: 100,
    monsterHealth: 100,
    hintsUsed: 0,
    currentPhase: 1
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CREATE ZUSTAND STORE
 * ═══════════════════════════════════════════════════════════════════════════
 */
<<<<<<< HEAD
export const useGameStore = create<GameState & GameActions>()(
    persist(
        (set, get) => ({
            // === INITIAL STATE VALUES ===
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
            theme: 'dark',
            dungeonState: null,

            // === ACTIONS IMPLEMENTATION ===

            /**
             * Chuyển đổi cảnh game (Scene Transition)
             */
            setScene: (scene) => {
                set((state) => ({
                    previousScene: state.currentScene,
                    currentScene: scene
                }));
            },

            /**
             * Khởi tạo Dungeon State mới
             * - Generate rooms dựa trên config
             * - Set vị trí player tại entrance
             */
            initDungeon: (config) => {
                const rooms = generateDungeonRooms(config);
                set({
                    dungeonState: {
                        rooms,
                        playerPos: config.entrance,
                        config
                    }
                });
            },

            /**
             * Cập nhật trạng thái Dungeon (ví dụ: Player di chuyển, Room cleared)
             */
            updateDungeonState: (newState) => {
                set((state) => ({
                    dungeonState: {
                        ...state.dungeonState!,
                        ...newState
                    }
                }));
            },

            /**
             * Action: Vào Dungeon
             * - Load config dungeon tương ứng (Hiện tại hardcode DUNGEON_1 cho demo)
             * - Chuyển scene sang DUNGEON
             * - Bật loading screen
             */
            enterDungeon: (dungeonId) => {
                // Registry Map for Dungeons
                const DUNGEON_REGISTRY: Record<string, DungeonConfig | DungeonData> = {
                    'dungeon_1': DUNGEON_1,
                    'dungeon_2': DUNGEON_2_CHAOS,
                    'dungeon_3': DUNGEON_3_CHAINED,
                    'dungeon_4': DUNGEON_4_RELIC,
                    'dungeon_5': DUNGEON_5_FOREST,
                    'dungeon_7': DUNGEON_7_FINAL,
                };

                const rawData = DUNGEON_REGISTRY[dungeonId];

                if (!rawData) {
                    console.error(`Dungeon configuration not found for ID: ${dungeonId}`);
                    return;
                }

                let config: DungeonConfig;

                // Check if it's the new DungeonData format (has 'layout' prop) or old DungeonConfig
                if ('layout' in rawData) {
                    // Convert DungeonData to DungeonConfig
                    const data = rawData as DungeonData; // New dungeon format with layout
                    config = {
                        id: data.id,
                        name: data.displayName, // Use display name for UI
                        chapter: data.chapter,
                        description: data.description,
                        size: { width: 5, height: 5 },
                        entrance: { x: 0, y: 2 },
                        bossRoom: { x: 4, y: 2 },
                        // Create dummy arrays for count-based generation
                        monsterRooms: Array(Math.max(3, Math.floor(data.layout.rooms * 0.6))).fill({ x: 0, y: 0 }),
                        treasureRooms: Array(2).fill({ x: 0, y: 0 }),
                        requiredLevel: data.chapter // Use chapter as level
                    };
                } else {
                    // It's already DungeonConfig (Dungeon 1)
                    config = rawData as DungeonConfig;
                }

                const rooms = generateDungeonRooms(config);

                // Find entrance to place player
                const entrance = rooms.find(r => r.type === 'entrance');
                const startPos = entrance ? { x: entrance.x, y: entrance.y } : { x: 0, y: 0 };

                const initialState: DungeonState = {
                    rooms: rooms.map(r => ({ ...r, cleared: r.type === 'entrance' || r.type === 'empty' })),
                    playerPos: startPos,
                    config: config
                };

                set({
                    currentScene: GameScene.DUNGEON,
                    currentDungeonId: dungeonId,
                    dungeonState: initialState
                });

                get().showSparky(`⚔️ Bạn đã bước vào: ${config.name}`);
            },

            /**
             * Action: Thoát Dungeon
             * - Reset state về Hub World
             * - Xóa dungeon state tạm thời
             */
            exitDungeon: () => {
                set({
                    currentScene: GameScene.HUB_WORLD,
                    currentDungeonId: null,
                    combat: initialCombatState,
                    dungeonState: null // Reset state on exit
                });
            },

            /**
             * Bắt đầu trận chiến (Start Combat)
             * - Chuyển scene sang COMBAT
             * - Init combat state (Máu, Monster ID)
             */
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

            /**
             * Kết thúc trận chiến (End Combat)
             * - Xử lý logic thắng/thua
             * - Nếu thắng: Đánh dấu phòng hiện tại là "Cleared"
             * - Chuyển về scene trước đó (thường là Dungeon)
             */
            endCombat: (victory) => {
                const state = get();
                let newDungeonState = state.dungeonState;

                // Nếu thắng và đang trong Dungeon, đánh dấu phòng đã hoàn thành (Cleaned/Cleared)
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
                    const combat = state.combat;
                    // Check if Boss
                    if (combat.monsterId && combat.monsterId.toLowerCase().includes('boss')) {
                        const currentDungeon = state.currentDungeonId || 'dungeon_1';
                        usePlayerStore.getState().completeDungeon(currentDungeon);
                        get().showSparky('🎉 CHÚC MỪNG! BẠN ĐÃ HOÀN THÀNH HẦM NGỤC!');
                    } else {
                        get().showSparky('💡 Chiến thắng! Phòng đã được dọn sạch!');
                    }
                }
            },

            /**
             * Cập nhật máu quái vật
             * - Tự động kết thúc combat nếu HP <= 0
             */
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

            /**
             * Cập nhật máu người chơi
             */
            updatePlayerHealth: (health) => {
                set((state) => ({
                    combat: {
                        ...state.combat,
                        playerHealth: health
                    }
                }));

                if (health <= 0) {
                    get().showSparky('⚠️ Cảnh báo: Bạn đã bị đánh bại!');
                    get().endCombat(false);
                }
            },

            /**
             * Action: Sử dụng gợi ý (Hint)
             * - Tăng counter hintsUsed (ảnh hưởng tới việc đánh giá Achievement)
             */
            useHint: () => {
                set((state) => ({
                    combat: {
                        ...state.combat,
                        hintsUsed: state.combat.hintsUsed + 1
                    }
                }));
            },

            // === UI ACTIONS ===

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
        }),
        {
            name: 'game-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                currentScene: state.currentScene,
                previousScene: state.previousScene,
                currentDungeonId: state.currentDungeonId,
                dungeonState: state.dungeonState,
                combat: state.combat,
                theme: state.theme
            }),
            version: 1, // Invalidates old storage if version mismatches (default update behavior depends on migrate fn, but good practice)
        }
    )
);
=======
export const useGameStore = create<GameState & GameActions>((set, get) => ({
    // === INITIAL STATE VALUES ===
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
    theme: 'dark',
    dungeonState: null,

    // === ACTIONS IMPLEMENTATION ===

    /**
     * Chuyển đổi cảnh game (Scene Transition)
     */
    setScene: (scene) => {
        set((state) => ({
            previousScene: state.currentScene,
            currentScene: scene
        }));
    },

    /**
     * Khởi tạo Dungeon State mới
     * - Generate rooms dựa trên config
     * - Set vị trí player tại entrance
     */
    initDungeon: (config) => {
        const rooms = generateDungeonRooms(config);
        set({
            dungeonState: {
                rooms,
                playerPos: config.entrance,
                config
            }
        });
    },

    /**
     * Cập nhật trạng thái Dungeon (ví dụ: Player di chuyển, Room cleared)
     */
    updateDungeonState: (newState) => {
        set((state) => ({
            dungeonState: {
                ...state.dungeonState!,
                ...newState
            }
        }));
    },

    /**
     * Action: Vào Dungeon
     * - Load config dungeon tương ứng (Hiện tại hardcode DUNGEON_1 cho demo)
     * - Chuyển scene sang DUNGEON
     * - Bật loading screen
     */
    enterDungeon: (dungeonId) => {
        // Registry Map for Dungeons (In real app, this might be a separate file)
        const DUNGEON_REGISTRY: Record<string, DungeonConfig> = {
            'dungeon_1': DUNGEON_1
        };

        const config = DUNGEON_REGISTRY[dungeonId];

        if (!config) {
            console.error(`Dungeon configuration not found for ID: ${dungeonId}`);
            // Fallback to Dungeon 1 or handle error
            return;
        }

        const rooms = generateDungeonRooms(config);

        // Find entrance to place player
        const entrance = rooms.find(r => r.type === 'entrance');
        const startPos = entrance ? { x: entrance.x, y: entrance.y } : { x: 0, y: 0 };

        const initialState: DungeonState = {
            rooms: rooms.map(r => ({ ...r, cleared: r.type === 'entrance' || r.type === 'empty' })),
            playerPos: startPos,
            config: config
        };

        set({
            currentScene: GameScene.DUNGEON,
            currentDungeonId: dungeonId,
            dungeonState: initialState
        });

        get().showSparky(`⚔️ Bạn đã bước vào: ${config.name}`);
    },

    /**
     * Action: Thoát Dungeon
     * - Reset state về Hub World
     * - Xóa dungeon state tạm thời
     */
    exitDungeon: () => {
        set({
            currentScene: GameScene.HUB_WORLD,
            currentDungeonId: null,
            combat: initialCombatState,
            dungeonState: null // Reset state on exit
        });
    },

    /**
     * Bắt đầu trận chiến (Start Combat)
     * - Chuyển scene sang COMBAT
     * - Init combat state (Máu, Monster ID)
     */
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

    /**
     * Kết thúc trận chiến (End Combat)
     * - Xử lý logic thắng/thua
     * - Nếu thắng: Đánh dấu phòng hiện tại là "Cleared"
     * - Chuyển về scene trước đó (thường là Dungeon)
     */
    endCombat: (victory) => {
        const state = get();
        let newDungeonState = state.dungeonState;

        // Nếu thắng và đang trong Dungeon, đánh dấu phòng đã hoàn thành (Cleaned/Cleared)
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
            const combat = state.combat;
            // Check if Boss
            if (combat.monsterId && combat.monsterId.toLowerCase().includes('boss')) {
                const currentDungeon = state.currentDungeonId || 'dungeon_1';
                usePlayerStore.getState().completeDungeon(currentDungeon);
                get().showSparky('🎉 CHÚC MỪNG! BẠN ĐÃ HOÀN THÀNH HẦM NGỤC!');
            } else {
                get().showSparky('💡 Chiến thắng! Phòng đã được dọn sạch!');
            }
        }
    },

    /**
     * Cập nhật máu quái vật
     * - Tự động kết thúc combat nếu HP <= 0
     */
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

    /**
     * Cập nhật máu người chơi
     */
    updatePlayerHealth: (health) => {
        set((state) => ({
            combat: {
                ...state.combat,
                playerHealth: health
            }
        }));

        if (health <= 0) {
            get().showSparky('⚠️ Cảnh báo: Bạn đã bị đánh bại!');
            get().endCombat(false);
        }
    },

    /**
     * Action: Sử dụng gợi ý (Hint)
     * - Tăng counter hintsUsed (ảnh hưởng tới việc đánh giá Achievement)
     */
    useHint: () => {
        set((state) => ({
            combat: {
                ...state.combat,
                hintsUsed: state.combat.hintsUsed + 1
            }
        }));
    },

    // === UI ACTIONS ===

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
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
