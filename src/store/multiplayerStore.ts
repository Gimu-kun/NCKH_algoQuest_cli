/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MULTIPLAYER STORE - QUẢN LÝ TRẠNG THÁI NHIỀU NGƯỜI CHƠI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ CHỨC NĂNG (Functional Description):
 * ─────────────────────────────────────────────────────────────────────────────
 * Store này quản lý toàn bộ state và logic cho chế độ multiplayer, bao gồm:
 * - Room Management: Tạo, tham gia, rời phòng
 * - Player Synchronization: Đồng bộ trạng thái giữa các người chơi
 * - Game State: Quản lý trạng thái game đang chơi
 * - Real-time Communication: Sử dụng BroadcastChannel API + Web Worker
 *
 * KIẾN TRÚC KỸ THUẬT (Technical Architecture):
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * 1. STATE MANAGEMENT (Quản lý State):
 *    - Zustand Store: State management nhẹ, reactive
 *    - Persist Middleware: Lưu state vào localStorage
 *    - Immer Integration: Immutable updates dễ dàng
 *
 * 2. REAL-TIME COMMUNICATION (Giao tiếp Real-time):
 *    - BroadcastChannel API: Giao tiếp giữa các tabs/windows
 *    - Web Worker: Thread riêng cho connection, không block UI
 *    - Message Protocol: Chuẩn hóa format messages
 *
 * 3. ROOM SYSTEM (Hệ thống Phòng):
 *    - Room ID: UUID duy nhất cho mỗi phòng
 *    - Host/Guest: Phân biệt người tạo và người tham gia
 *    - Max Players: Giới hạn số người (mặc định 4)
 *    - Room State: Waiting, Playing, Finished
 *
 * FLOW HOẠT ĐỘNG (Operation Flow):
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * TẠO PHÒNG (Create Room):
 * 1. User click "Tạo phòng"
 * 2. Generate room ID (UUID)
 * 3. Init Web Worker với room channel
 * 4. Broadcast ROOM_CREATED message
 * 5. Chuyển sang trạng thái WAITING
 * 6. Hiển thị room code cho người khác join
 *
 * THAM GIA PHÒNG (Join Room):
 * 1. User nhập room code
 * 2. Validate room code format
 * 3. Connect worker đến room channel
 * 4. Broadcast PLAYER_JOINED message
 * 5. Nhận danh sách players hiện tại
 * 6. Sync game state từ host
 *
 * ĐỒNG BỘ GAME (Game Sync):
 * 1. Player thực hiện action (move disk)
 * 2. Update local state
 * 3. Broadcast GAME_UPDATE message
 * 4. Other players nhận message
 * 5. Update their local state
 * 6. Re-render UI
 *
 * KỸ THUẬT SỬ DỤNG (Techniques Used):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. WEB WORKER PATTERN:
 *    - Tại sao: Main thread bận render UI → heartbeat bị delay
 *    - Worker thread: Chạy độc lập, không bị throttle nhiều
 *    - Message passing: postMessage/onmessage
 *    - Cleanup: terminate worker khi unmount
 *
 * 2. BROADCAST CHANNEL API:
 *    - Cross-tab communication: Nhiều tabs cùng room
 *    - Same-origin only: Bảo mật
 *    - Event-driven: onmessage callback
 *    - Lightweight: Không cần WebSocket server
 *
 * 3. OPTIMISTIC UPDATES:
 *    - Update local state ngay lập tức
 *    - Broadcast sau đó
 *    - Rollback nếu conflict (advanced)
 *    - Better UX: Không lag
 *
 * 4. HEARTBEAT MECHANISM:
 *    - Gửi PING mỗi 500ms
 *    - Detect disconnect nếu không nhận PONG
 *    - Auto-remove inactive players
 *    - Maintain connection health
 *
 * SO SÁNH VỚI CÁC GIẢI PHÁP KHÁC (Comparison):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * | Approach              | Pros                          | Cons                        |
 * |-----------------------|-------------------------------|------------------------------|
 * | BroadcastChannel      | ✅ Không cần server           | ❌ Chỉ same-origin          |
 * |                       | ✅ Rất nhanh (local)          | ❌ Không cross-device       |
 * |                       | ✅ Đơn giản                   |                             |
 * |-----------------------|-------------------------------|------------------------------|
 * | WebSocket             | ✅ Cross-device               | ❌ Cần backend server       |
 * |                       | ✅ Internet-wide              | ❌ Phức tạp hơn             |
 * |                       |                               | ❌ Latency cao hơn          |
 * |-----------------------|-------------------------------|------------------------------|
 * | WebRTC P2P            | ✅ Peer-to-peer               | ❌ NAT traversal khó        |
 * |                       | ✅ Không cần server relay     | ❌ Setup phức tạp           |
 * |                       |                               | ❌ Fallback cần TURN server |
 * |-----------------------|-------------------------------|------------------------------|
 * | Firebase Realtime DB  | ✅ Managed service            | ❌ Vendor lock-in           |
 * |                       | ✅ Offline support            | ❌ Chi phí                  |
 * |                       |                               | ❌ Overkill cho local game  |
 *
 * ƯU ĐIỂM THIẾT KẾ (Pros):
 * - Không cần backend server (giảm complexity)
 * - Latency thấp (local communication)
 * - Dễ implement và maintain
 * - Phù hợp cho local multiplayer (cùng mạng)
 *
 * NHƯỢC ĐIỂM (Cons):
 * - Không support cross-device (khác mạng)
 * - Phụ thuộc browser support BroadcastChannel
 * - Không có central authority (conflict resolution khó)
 *
 * HƯỚNG MỞ RỘNG (Future Enhancements):
 * - Thêm WebSocket fallback cho cross-device
 * - Implement conflict resolution (CRDT)
 * - Add replay system
 * - Spectator mode
 *
 * @module MultiplayerStore
 * @category State Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* =============================================================================
   TYPE DEFINITIONS - Định nghĩa kiểu dữ liệu
   ============================================================================= */

/**
 * PlayerInfo - Thông tin người chơi
 * 
 * CHỨC NĂNG (Purpose):
 * Lưu trữ thông tin cơ bản của mỗi người chơi trong phòng.
 */
export interface PlayerInfo {
    id: string;              // UUID của player
    name: string;            // Tên hiển thị
    isHost: boolean;         // Có phải host không
    isReady: boolean;        // Đã sẵn sàng chưa
    lastHeartbeat: number;   // Timestamp heartbeat cuối
    avatar?: string;         // Avatar URL (optional)
}

/**
 * GameType - Loại game
 * 
 * CHỨC NĂNG (Purpose):
 * Enum định nghĩa các loại game hỗ trợ multiplayer.
 */
export enum GameType {
    HANOI = 'HANOI',           // Tháp Hà Nội
    ISLAND = 'ISLAND',         // Đếm Đảo (DFS)
    MAZE = 'MAZE',             // Mê Cung (BFS)
    FLOOD_FILL = 'FLOOD_FILL', // Tô Màu (Loang)
    SORTING = 'SORTING',       // Sắp xếp (future)
    PATHFINDING = 'PATHFINDING', // Tìm đường (future)
    BINARY_SEARCH = 'BINARY_SEARCH', // Tìm kiếm nhị phân
    BST_SEARCH = 'BST_SEARCH' // Tìm kiếm trên cây BST
}

/**
 * RoomState - Trạng thái phòng
 * 
 * CHỨC NĂNG (Purpose):
 * Enum định nghĩa các trạng thái của phòng chơi.
 */
export enum RoomState {
    WAITING = 'WAITING',       // Đang chờ người chơi
    PLAYING = 'PLAYING',       // Đang chơi
    FINISHED = 'FINISHED'      // Đã kết thúc
}

/**
 * RoomInfo - Thông tin phòng chơi
 * 
 * CHỨC NĂNG (Purpose):
 * Lưu trữ toàn bộ thông tin và state của một phòng chơi.
 */
export interface RoomInfo {
    id: string;                // Room ID (UUID)
    name: string;              // Tên phòng
    gameType: GameType;        // Loại game
    state: RoomState;          // Trạng thái phòng
    maxPlayers: number;        // Số người tối đa
    players: PlayerInfo[];     // Danh sách người chơi
    hostId: string;            // ID của host
    createdAt: number;         // Timestamp tạo phòng
    gameConfig: Record<string, unknown>; // Config game (ví dụ: số đĩa Hanoi)
}

/**
 * GameProgress - Tiến trình game của player
 * 
 * CHỨC NĂNG (Purpose):
 * Lưu trữ tiến trình chơi của từng người chơi.
 * Dùng để so sánh và xếp hạng.
 */
export interface GameProgress {
    playerId: string;          // ID người chơi
    moves: number;             // Số bước đã đi
    timeElapsed: number;       // Thời gian đã chơi (ms)
    completed: boolean;        // Đã hoàn thành chưa
    finishedAt: number | null; // Timestamp hoàn thành
    gameState: unknown;        // State cụ thể của game (encoding cho Hanoi)
}

/**
 * MessageType - Loại message
 * 
 * CHỨC NĂNG (Purpose):
 * Enum định nghĩa các loại message trong protocol.
 */
export enum MessageType {
    // Room management
    ROOM_CREATED = 'ROOM_CREATED',
    PLAYER_JOINED = 'PLAYER_JOINED',
    PLAYER_LEFT = 'PLAYER_LEFT',
    PLAYER_READY = 'PLAYER_READY',

    // Game control
    GAME_START = 'GAME_START',
    GAME_UPDATE = 'GAME_UPDATE',
    GAME_END = 'GAME_END',

    // Connection
    PING = 'PING',
    PONG = 'PONG',

    // Sync
    STATE_SYNC = 'STATE_SYNC',
    REQUEST_SYNC = 'REQUEST_SYNC'
}

/**
 * RoomMessage - Message protocol
 * 
 * CHỨC NĂNG (Purpose):
 * Định nghĩa format chuẩn cho tất cả messages.
 */
export interface RoomMessage {
    type: MessageType;         // Loại message
    roomId: string;            // Room ID
    senderId: string;          // ID người gửi
    timestamp: number;         // Timestamp gửi
    payload: unknown;          // Dữ liệu (type-specific)
}

/* =============================================================================
   STORE STATE - Trạng thái Store
   ============================================================================= */

/**
 * MultiplayerState - State của Multiplayer Store
 * 
 * CHỨC NĂNG (Purpose):
 * Định nghĩa toàn bộ state quản lý multiplayer.
 */
export interface MultiplayerState {
    // Connection state
    connected: boolean;        // Đã kết nối worker chưa
    worker: Worker | null;     // Web Worker instance

    // Current room
    currentRoom: RoomInfo | null; // Phòng hiện tại
    myPlayerId: string | null;    // ID của mình

    // Game progress
    gameProgress: Map<string, GameProgress>; // Progress của tất cả players

    // UI state
    showRoomList: boolean;     // Hiển thị danh sách phòng
    showCreateRoom: boolean;   // Hiển thị form tạo phòng
    showJoinRoom: boolean;     // Hiển thị form join phòng
}

/**
 * MultiplayerActions - Actions của Store
 * 
 * CHỨC NĂNG (Purpose):
 * Định nghĩa các hàm thay đổi state và logic.
 */
export interface MultiplayerActions {
    // Connection
    initWorker: () => void;
    disconnectWorker: () => void;

    // Room management
    createRoom: (name: string, gameType: GameType, config: Record<string, unknown>) => void;
    joinRoom: (roomId: string, playerName: string) => void;
    leaveRoom: () => void;

    // Player actions
    setReady: (ready: boolean) => void;
    startGame: () => void;

    // Game updates
    updateProgress: (progress: Partial<GameProgress>) => void;
    broadcastGameState: (gameState: unknown) => void;

    // Message handling
    handleMessage: (message: RoomMessage) => void;

    // UI
    toggleRoomList: () => void;
    toggleCreateRoom: () => void;
    toggleJoinRoom: () => void;
}

/* =============================================================================
   HELPER FUNCTIONS - Hàm tiện ích
   ============================================================================= */

/**
 * generateId - Tạo UUID đơn giản
 * 
 * CHỨC NĂNG (Purpose):
 * Tạo ID duy nhất cho room và player.
 * 
 * THUẬT TOÁN (Algorithm):
 * - Sử dụng crypto.randomUUID() nếu có
 * - Fallback: timestamp + random
 * 
 * @returns UUID string
 */
const generateId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback cho browsers cũ
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * generateRoomCode - Tạo room code ngắn gọn
 * 
 * CHỨC NĂNG (Purpose):
 * Tạo code dễ nhớ, dễ chia sẻ (6 ký tự).
 * 
 * THUẬT TOÁN (Algorithm):
 * - Chỉ dùng chữ hoa và số
 * - Tránh ký tự dễ nhầm (0, O, I, 1)
 * 
 * @returns Room code (6 ký tự)
 */
const generateRoomCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Bỏ I, O, 0, 1
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

/* =============================================================================
   ZUSTAND STORE - Tạo Store
   ============================================================================= */

/**
 * useMultiplayerStore - Multiplayer Store
 * 
 * CHỨC NĂNG (Purpose):
 * Store chính quản lý toàn bộ multiplayer state và logic.
 */
export const useMultiplayerStore = create<MultiplayerState & MultiplayerActions>()(
    persist(
        (set, get) => ({
            // ===== INITIAL STATE =====
            connected: false,
            worker: null,
            currentRoom: null,
            myPlayerId: null,
            gameProgress: new Map(),
            showRoomList: false,
            showCreateRoom: false,
            showJoinRoom: false,

            // ===== CONNECTION ACTIONS =====

            /**
             * initWorker - Khởi tạo Web Worker
             * 
             * FLOW:
             * 1. Tạo Worker instance từ multiplayerWorker.ts
             * 2. Setup message handler
             * 3. Set connected = true
             * 
             * KỸ THUẬT (Technique):
             * - Worker chạy trong thread riêng
             * - Không block UI thread
             * - Tự động cleanup khi component unmount
             */
            initWorker: () => {
                const state = get();
                if (state.worker) return; // Đã init rồi

                try {
                    // Tạo worker từ file
                    const worker = new Worker(
                        new URL('../workers/multiplayerWorker.ts', import.meta.url),
                        { type: 'module' }
                    );

                    // Setup message handler
                    worker.onmessage = (event) => {
                        const message = event.data;

                        switch (message.type) {
                            case 'CONNECTED':
                                set({ connected: true });
                                console.log('[Multiplayer] Worker connected:', message.channelName);
                                break;

                            case 'DISCONNECTED':
                                set({ connected: false });
                                console.log('[Multiplayer] Worker disconnected');
                                break;

                            case 'RECEIVED':
                                // Xử lý message nhận được
                                get().handleMessage(message.message as RoomMessage);
                                break;

                            case 'ERROR':
                                console.error('[Multiplayer] Worker error:', message.error);
                                break;

                            case 'HEARTBEAT_SENT':
                                // Heartbeat thành công (optional logging)
                                break;
                        }
                    };

                    worker.onerror = (error) => {
                        console.error('[Multiplayer] Worker error:', error);
                        set({ connected: false });
                    };

                    set({ worker, connected: false }); // Connected sẽ true khi nhận CONNECTED message
                } catch (error) {
                    console.error('[Multiplayer] Failed to init worker:', error);
                }
            },

            /**
             * disconnectWorker - Ngắt kết nối Worker
             * 
             * FLOW:
             * 1. Gửi STOP message đến worker
             * 2. Terminate worker
             * 3. Reset state
             */
            disconnectWorker: () => {
                const state = get();
                if (!state.worker) return;

                try {
                    state.worker.postMessage({ type: 'STOP' });
                    state.worker.terminate();
                    set({
                        worker: null,
                        connected: false,
                        currentRoom: null
                    });
                } catch (error) {
                    console.error('[Multiplayer] Failed to disconnect worker:', error);
                }
            },

            // ===== ROOM MANAGEMENT =====

            /**
             * createRoom - Tạo phòng mới
             * 
             * FLOW:
             * 1. Generate room ID và player ID
             * 2. Tạo RoomInfo object
             * 3. Init worker với room channel
             * 4. Broadcast ROOM_CREATED
             * 5. Set currentRoom
             * 
             * @param name - Tên phòng
             * @param gameType - Loại game
             * @param config - Config game
             */
            createRoom: (name, gameType, config) => {
                const state = get();

                // Generate IDs
                const roomId = generateRoomCode();
                const playerId = generateId();

                // Tạo player info
                const hostPlayer: PlayerInfo = {
                    id: playerId,
                    name: 'Host', // TODO: Lấy từ playerStore
                    isHost: true,
                    isReady: false,
                    lastHeartbeat: Date.now()
                };

                // Tạo room info
                const room: RoomInfo = {
                    id: roomId,
                    name,
                    gameType,
                    state: RoomState.WAITING,
                    maxPlayers: 4,
                    players: [hostPlayer],
                    hostId: playerId,
                    createdAt: Date.now(),
                    gameConfig: config
                };

                // Init worker nếu chưa có
                if (!state.worker) {
                    get().initWorker();
                }

                // Wait for worker ready
                setTimeout(() => {
                    const worker = get().worker;
                    if (!worker) {
                        console.error('[Multiplayer] Worker not ready');
                        alert('Lỗi: Không thể khởi tạo kết nối. Vui lòng tải lại trang.');
                        return;
                    }

                    // Init worker với room channel
                    worker.postMessage({
                        type: 'INIT',
                        roomId,
                        playerId,
                        channelName: `arena-${roomId}`
                    });

                    // Broadcast ROOM_CREATED
                    const message: RoomMessage = {
                        type: MessageType.ROOM_CREATED,
                        roomId,
                        senderId: playerId,
                        timestamp: Date.now(),
                        payload: room
                    };

                    worker.postMessage({
                        type: 'SEND',
                        message
                    });

                    // Update state
                    set({
                        currentRoom: room,
                        myPlayerId: playerId,
                        showCreateRoom: false
                    });

                    console.log('[Multiplayer] Room created:', roomId);
                }, 500);
            },

            /**
             * joinRoom - Tham gia phòng
             * 
             * FLOW:
             * 1. Validate room code
             * 2. Generate player ID
             * 3. Init worker với room channel
             * 4. Broadcast PLAYER_JOINED
             * 5. Request STATE_SYNC từ host
             * 
             * @param roomId - Room code
             * @param playerName - Tên người chơi
             */
            joinRoom: (roomId, playerName) => {
                const state = get();

                // Validate room code
                if (!roomId || roomId.length !== 6) {
                    console.error('[Multiplayer] Invalid room code');
                    return;
                }

                const playerId = generateId();

                // Init worker nếu chưa có
                if (!state.worker) {
                    get().initWorker();
                }

                setTimeout(() => {
                    const worker = get().worker;
                    if (!worker) {
                        console.error('[Multiplayer] Worker not ready');
                        alert('Lỗi: Không thể khởi tạo kết nối. Vui lòng tải lại trang.');
                        return;
                    }

                    // Init worker với room channel
                    worker.postMessage({
                        type: 'INIT',
                        roomId,
                        playerId,
                        channelName: `arena-${roomId}`
                    });

                    // Tạo player info
                    const playerInfo: PlayerInfo = {
                        id: playerId,
                        name: playerName,
                        isHost: false,
                        isReady: false,
                        lastHeartbeat: Date.now()
                    };

                    // Broadcast PLAYER_JOINED
                    const joinMessage: RoomMessage = {
                        type: MessageType.PLAYER_JOINED,
                        roomId,
                        senderId: playerId,
                        timestamp: Date.now(),
                        payload: playerInfo
                    };

                    worker.postMessage({
                        type: 'SEND',
                        message: joinMessage
                    });

                    // Request sync từ host
                    const syncRequest: RoomMessage = {
                        type: MessageType.REQUEST_SYNC,
                        roomId,
                        senderId: playerId,
                        timestamp: Date.now(),
                        payload: null
                    };

                    worker.postMessage({
                        type: 'SEND',
                        message: syncRequest
                    });

                    // Update state (room sẽ được sync sau)
                    set({
                        myPlayerId: playerId,
                        showJoinRoom: false
                    });

                    console.log('[Multiplayer] Joined room:', roomId);
                }, 500);
            },

            /**
             * leaveRoom - Rời phòng
             * 
             * FLOW:
             * 1. Broadcast PLAYER_LEFT
             * 2. Disconnect worker
             * 3. Reset state
             */
            leaveRoom: () => {
                const state = get();
                if (!state.currentRoom || !state.myPlayerId) return;

                const worker = state.worker;
                if (worker) {
                    // Broadcast PLAYER_LEFT
                    const message: RoomMessage = {
                        type: MessageType.PLAYER_LEFT,
                        roomId: state.currentRoom.id,
                        senderId: state.myPlayerId,
                        timestamp: Date.now(),
                        payload: null
                    };

                    worker.postMessage({
                        type: 'SEND',
                        message
                    });
                }

                // Disconnect và reset
                get().disconnectWorker();
                set({
                    currentRoom: null,
                    myPlayerId: null,
                    gameProgress: new Map()
                });

                console.log('[Multiplayer] Left room');
            },

            // ===== PLAYER ACTIONS =====

            /**
             * setReady - Đánh dấu sẵn sàng
             * 
             * @param ready - Trạng thái ready
             */
            setReady: (ready) => {
                const state = get();
                if (!state.currentRoom || !state.myPlayerId) return;

                const message: RoomMessage = {
                    type: MessageType.PLAYER_READY,
                    roomId: state.currentRoom.id,
                    senderId: state.myPlayerId,
                    timestamp: Date.now(),
                    payload: { ready }
                };

                state.worker?.postMessage({
                    type: 'SEND',
                    message
                });

                // Update local state
                set((s) => ({
                    currentRoom: s.currentRoom ? {
                        ...s.currentRoom,
                        players: s.currentRoom.players.map(p =>
                            p.id === s.myPlayerId ? { ...p, isReady: ready } : p
                        )
                    } : null
                }));
            },

            /**
             * startGame - Bắt đầu game (chỉ host)
             * 
             * FLOW:
             * 1. Check tất cả players ready
             * 2. Broadcast GAME_START
             * 3. Chuyển room state sang PLAYING
             */
            startGame: () => {
                const state = get();
                if (!state.currentRoom || !state.myPlayerId) return;

                // Chỉ host mới start được
                if (state.currentRoom.hostId !== state.myPlayerId) {
                    console.error('[Multiplayer] Only host can start game');
                    return;
                }

                // Check tất cả ready
                const allReady = state.currentRoom.players.every(p => p.isReady || p.isHost);
                if (!allReady) {
                    console.error('[Multiplayer] Not all players ready');
                    return;
                }

                const message: RoomMessage = {
                    type: MessageType.GAME_START,
                    roomId: state.currentRoom.id,
                    senderId: state.myPlayerId,
                    timestamp: Date.now(),
                    payload: {
                        startedAt: Date.now(),
                        config: state.currentRoom.gameConfig
                    }
                };

                state.worker?.postMessage({
                    type: 'SEND',
                    message
                });

                // Update local state
                set((s) => ({
                    currentRoom: s.currentRoom ? {
                        ...s.currentRoom,
                        state: RoomState.PLAYING
                    } : null
                }));
            },

            // ===== GAME UPDATES =====

            /**
             * updateProgress - Cập nhật tiến trình
             * 
             * @param progress - Partial progress update
             */
            updateProgress: (progress) => {
                const state = get();
                if (!state.currentRoom || !state.myPlayerId) return;

                const currentProgress = state.gameProgress.get(state.myPlayerId) || {
                    playerId: state.myPlayerId,
                    moves: 0,
                    timeElapsed: 0,
                    completed: false,
                    finishedAt: null,
                    gameState: null
                };

                const updatedProgress: GameProgress = {
                    ...currentProgress,
                    ...progress
                };

                // Update local
                const newProgress = new Map(state.gameProgress);
                newProgress.set(state.myPlayerId, updatedProgress);
                set({ gameProgress: newProgress });

                // Broadcast
                const message: RoomMessage = {
                    type: MessageType.GAME_UPDATE,
                    roomId: state.currentRoom.id,
                    senderId: state.myPlayerId,
                    timestamp: Date.now(),
                    payload: updatedProgress
                };

                state.worker?.postMessage({
                    type: 'SEND',
                    message
                });
            },

            /**
             * broadcastGameState - Broadcast game state
             * 
             * @param gameState - State cụ thể của game
             */
            broadcastGameState: (gameState) => {
                const state = get();
                if (!state.currentRoom || !state.myPlayerId) return;

                const message: RoomMessage = {
                    type: MessageType.GAME_UPDATE,
                    roomId: state.currentRoom.id,
                    senderId: state.myPlayerId,
                    timestamp: Date.now(),
                    payload: { gameState }
                };

                state.worker?.postMessage({
                    type: 'SEND',
                    message
                });
            },

            // ===== MESSAGE HANDLING =====

            /**
             * handleMessage - Xử lý message nhận được
             * 
             * FLOW:
             * 1. Parse message type
             * 2. Route đến handler tương ứng
             * 3. Update state
             * 
             * @param message - RoomMessage nhận được
             */
            handleMessage: (message) => {
                const state = get();

                // Ignore messages từ chính mình (đã update local rồi)
                if (message.senderId === state.myPlayerId) return;

                switch (message.type) {
                    case MessageType.ROOM_CREATED:
                        // Không cần xử lý (chỉ host tạo)
                        break;

                    case MessageType.PLAYER_JOINED: {
                        const playerInfo = message.payload as PlayerInfo;
                        set((s) => ({
                            currentRoom: s.currentRoom ? {
                                ...s.currentRoom,
                                players: [...s.currentRoom.players, playerInfo]
                            } : null
                        }));
                        console.log('[Multiplayer] Player joined:', playerInfo.name);
                        break;
                    }

                    case MessageType.PLAYER_LEFT: {
                        set((s) => ({
                            currentRoom: s.currentRoom ? {
                                ...s.currentRoom,
                                players: s.currentRoom.players.filter(p => p.id !== message.senderId)
                            } : null
                        }));
                        console.log('[Multiplayer] Player left:', message.senderId);
                        break;
                    }

                    case MessageType.PLAYER_READY: {
                        const { ready } = message.payload as { ready: boolean };
                        set((s) => ({
                            currentRoom: s.currentRoom ? {
                                ...s.currentRoom,
                                players: s.currentRoom.players.map(p =>
                                    p.id === message.senderId ? { ...p, isReady: ready } : p
                                )
                            } : null
                        }));
                        break;
                    }

                    case MessageType.GAME_START: {
                        set((s) => ({
                            currentRoom: s.currentRoom ? {
                                ...s.currentRoom,
                                state: RoomState.PLAYING
                            } : null
                        }));
                        console.log('[Multiplayer] Game started');
                        break;
                    }

                    case MessageType.GAME_UPDATE: {
                        const progress = message.payload as GameProgress;
                        const newProgress = new Map(state.gameProgress);
                        newProgress.set(progress.playerId, progress);
                        set({ gameProgress: newProgress });
                        break;
                    }

                    case MessageType.REQUEST_SYNC: {
                        // Nếu là host, gửi STATE_SYNC
                        if (state.currentRoom && state.myPlayerId === state.currentRoom.hostId) {
                            const syncMessage: RoomMessage = {
                                type: MessageType.STATE_SYNC,
                                roomId: state.currentRoom.id,
                                senderId: state.myPlayerId,
                                timestamp: Date.now(),
                                payload: {
                                    room: state.currentRoom,
                                    progress: Array.from(state.gameProgress.entries())
                                }
                            };

                            state.worker?.postMessage({
                                type: 'SEND',
                                message: syncMessage
                            });
                        }
                        break;
                    }

                    case MessageType.STATE_SYNC: {
                        const { room, progress } = message.payload as {
                            room: RoomInfo;
                            progress: [string, GameProgress][];
                        };

                        set({
                            currentRoom: room,
                            gameProgress: new Map(progress)
                        });
                        console.log('[Multiplayer] State synced');
                        break;
                    }

                    case MessageType.PING:
                        // Respond với PONG
                        if (state.worker && state.currentRoom && state.myPlayerId) {
                            const pongMessage: RoomMessage = {
                                type: MessageType.PONG,
                                roomId: state.currentRoom.id,
                                senderId: state.myPlayerId,
                                timestamp: Date.now(),
                                payload: null
                            };

                            state.worker.postMessage({
                                type: 'SEND',
                                message: pongMessage
                            });
                        }
                        break;

                    case MessageType.PONG:
                        // Update lastHeartbeat
                        set((s) => ({
                            currentRoom: s.currentRoom ? {
                                ...s.currentRoom,
                                players: s.currentRoom.players.map(p =>
                                    p.id === message.senderId ? { ...p, lastHeartbeat: Date.now() } : p
                                )
                            } : null
                        }));
                        break;

                    default:
                        console.warn('[Multiplayer] Unknown message type:', message.type);
                }
            },

            // ===== UI ACTIONS =====

            toggleRoomList: () => set((s) => ({ showRoomList: !s.showRoomList })),
            toggleCreateRoom: () => set((s) => ({ showCreateRoom: !s.showCreateRoom })),
            toggleJoinRoom: () => set((s) => ({ showJoinRoom: !s.showJoinRoom }))
        }),
        {
            name: 'multiplayer-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Chỉ persist một số field cần thiết
                myPlayerId: state.myPlayerId,
                // Không persist worker, currentRoom (sẽ reconnect)
            })
        }
    )
);
