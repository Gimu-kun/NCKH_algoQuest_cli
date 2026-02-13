/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MULTIPLAYER STORE (Zustand) - ĐẤU TRƯỜNG NHIỀU NGƯỜI CHƠI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MỤC TIÊU THIẾT KẾ (Design Goals)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1) KHÔNG CẦN BACKEND (No Server) nhưng vẫn "giả lập" real-time nhiều tab:
 *    - Dùng BroadcastChannel để đồng bộ state giữa các tab cùng trình duyệt
 *    - Phù hợp demo/đồ án: mở 2 tab là thấy lobby/game update
 *    - Không cần deploy server, không cần WebSocket infrastructure
 *
 * 2) ROOM-BASED MULTIPLAYER (Phòng chơi):
 *    - Host tạo phòng -> phát metadata (room meta) + roster (danh sách player)
 *    - Client join bằng mã phòng (room code) -> handshake -> vào lobby
 *    - Mỗi phòng có settings riêng (số đĩa, max players)
 *
 * 3) TÁCH BIỆT TRANSPORT VÀ UI:
 *    - UI chỉ gọi actions (createRoom/joinRoom/leaveRoom/startGame/...)
 *    - Store xử lý message bus và cập nhật state
 *    - Dễ swap transport layer (BroadcastChannel -> WebSocket -> WebRTC)
 *
 * FLOW TỔNG QUAN (High-level Flow)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CREATE ROOM FLOW:
 * 1. createRoom() -> tạo roomId -> connectToRoom(host) -> publish room meta
 * 2. Host định kỳ ping để cập nhật lastSeen
 * 3. Host có thể startGame() khi đủ người
 *
 * JOIN ROOM FLOW:
 * 1. joinRoom(roomId) -> connectToRoom(client) -> send HELLO
 * 2. Host nhận HELLO -> add player -> broadcast roster + WELCOME(target)
 * 3. Client nhận WELCOME -> set room meta + roster
 *
 * GAME FLOW:
 * 1. Host startGame() -> broadcast START_GAME
 * 2. All players receive -> gamePhase = 'in_game'
 * 3. Players send HANOI_PROGRESS -> scoreboard updates
 * 4. First to complete wins
 *
 * KỸ THUẬT SỬ DỤNG (Techniques Used)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1) BROADCASTCHANNEL API:
 *    - Web API cho phép giao tiếp giữa các contexts (tabs, windows) cùng origin
 *    - Syntax: new BroadcastChannel(name), postMessage(data), onmessage
 *    - Low latency (< 1ms), không cần server
 *
 * 2) HEARTBEAT MECHANISM (Ping/Pong):
 *    - Mỗi player gửi PING định kỳ (2s)
 *    - Other players update lastSeen
 *    - UI check: nowTick - player.lastSeen <= 6s => online
 *    - Detect disconnect khi không nhận PING
 *
 * 3) LOCALSTORAGE DISCOVERY:
 *    - Host cập nhật public rooms vào localStorage
 *    - Other tabs listen 'storage' event để refresh list
 *    - Cho phép "discover" rooms trong cùng browser
 *
 * 4) ZUSTAND STATE MANAGEMENT:
 *    - Minimal, no-boilerplate state library
 *    - Actions đính kèm trong store
 *    - No reducers, no dispatchers
 *
 * SO SÁNH KIẾN TRÚC MULTIPLAYER (Architecture Comparison)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * | Approach          | Cross-Device | Authority    | Latency | Complexity |
 * |-------------------|--------------|--------------|---------|------------|
 * | BroadcastChannel  | ❌ No        | None         | ~1ms    | Low        |
 * | WebSocket Server  | ✅ Yes       | Server       | ~50ms   | Medium     |
 * | WebRTC P2P        | ✅ Yes       | Client       | ~20ms   | High       |
 * | Firebase Realtime | ✅ Yes       | Server       | ~100ms  | Medium     |
 *
 * BROADCASTCHANNEL (hiện tại):
 * ✅ Ưu điểm:
 *    - Không cần server -> triển khai nhanh, dễ demo
 *    - Real-time thật giữa các tab
 *    - Zero configuration
 *
 * ❌ Nhược điểm:
 *    - Không chơi được giữa các máy khác nhau
 *    - Không có authoritative server -> dễ "cheat"
 *    - Limited to same browser
 *
 * WEBSOCKET SERVER:
 * ✅ Ưu điểm:
 *    - Cross-device play
 *    - Server authoritative (anti-cheat)
 *    - Persistent connections
 *
 * ❌ Nhược điểm:
 *    - Cần backend infrastructure
 *    - Higher latency
 *    - Server costs
 *
 * WEBRTC P2P:
 * ✅ Ưu điểm:
 *    - Low latency (direct connection)
 *    - No server for game data
 *
 * ❌ Nhược điểm:
 *    - Cần signaling server
 *    - NAT traversal issues
 *    - Complex debugging
 *
 * GỢI Ý MỞ RỘNG (Future Extensions)
 * ─────────────────────────────────────────────────────────────────────────────
 * - Thay transport: WebSocket (server authoritative) / WebRTC (P2P)
 * - Tách module: multiplayerTransport.ts (interfaces) + implementations
 * - Add voice chat với WebRTC
 * - Persist game state cho reconnect
 *
 * @module multiplayerStore
 * @category State Management/Multiplayer
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { create } from 'zustand';
import { usePlayerStore } from './playerStore';

/* =============================================================================
   TYPE DEFINITIONS - Định nghĩa kiểu dữ liệu
   ============================================================================= */

/**
 * MultiplayerRole - Vai trò của player trong room
 *
 * TYPES:
 * - 'host': người tạo phòng, có quyền start game
 * - 'client': người tham gia, chờ host start
 */
export type MultiplayerRole = 'host' | 'client';

/**
 * GameId - ID của game mode
 *
 * CURRENT GAMES:
 * - 'hanoi': Tower of Hanoi puzzle
 * - 'maze': Maze Race (BFS pathfinding)
 * - 'flood': Flood Fill Battle (territory control)
 * - 'island': Island Counter (DFS counting)
 */
export type GameId = 'hanoi' | 'maze' | 'flood' | 'island';

/**
 * PublicRoomSummary - Thông tin phòng công khai
 *
 * PURPOSE:
 * Dùng cho room discovery qua localStorage.
 * Chứa đủ thông tin để hiển thị trong danh sách phòng.
 *
 * TTL (Time To Live):
 * - updatedAt dùng để check freshness
 * - Phòng không update > 15s được coi là "dead"
 */
export interface PublicRoomSummary {
  id: string;           // Room ID (6 char uppercase)
  name: string;         // Display name
  gameId: GameId;       // Game type
  maxPlayers: number;   // Max capacity
  settings: Record<string, unknown>; // Game-specific settings
  updatedAt: number;    // Last update timestamp
}

/**
 * RoomMeta - Metadata đầy đủ của phòng
 *
 * PURPOSE:
 * Thông tin chi tiết về phòng, lưu trong store khi connected.
 */
export interface RoomMeta {
  id: string;           // Room ID
  name: string;         // Display name
  hostId: string;       // Player ID của host
  gameId: GameId;       // Game type
  maxPlayers: number;   // Max capacity
  settings: {
    hanoiDisks: number;   // Số đĩa cho Tower of Hanoi
    gridRows?: number;    // Grid rows for Maze/Flood/Island
    gridCols?: number;    // Grid cols for Maze/Flood/Island
    landRatio?: number;   // Land ratio for Island game (0-1)
  };
  createdAt: number;    // Creation timestamp
}

/**
 * RoomPlayer - Thông tin player trong phòng
 *
 * PURPOSE:
 * Track state của mỗi player: online status, ready status, game progress.
 *
 * FIELDS:
 * - id: unique identifier
 * - name: display name (from playerStore)
 * - isHost: là host hay không
 * - ready: đã ready trong lobby chưa
 * - lastSeen: last heartbeat timestamp (for online detection)
 * - hanoi/maze/flood/island: game-specific progress
 */
export interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
  ready: boolean;
  lastSeen: number;
  // Hanoi progress
  hanoi?: {
    encoding: number;
    moves: number;
    completed: boolean;
    finishedAt: number | null;
  };
  // Maze progress
  maze?: {
    position: { row: number; col: number };
    moves: number;
    completed: boolean;
    finishedAt: number | null;
  };
  // Flood Fill progress
  flood?: {
    scores: number[];
    currentPlayer: number;
    completed: boolean;
    finishedAt: number | null;
  };
  // Island Counter progress
  island?: {
    markedIslands: number;
    answer: number | null;
    correct: boolean | null;
    finishedAt: number | null;
  };
}

/**
 * MultiplayerState - State chính của store
 *
 * SECTIONS:
 * - self: info về current user
 * - status: connection status
 * - role: host/client
 * - room: current room metadata
 * - players: roster của room
 * - gamePhase: lobby/in_game/results
 * - publicRooms: discovered rooms
 */
export interface MultiplayerState {
  self: { id: string; name: string };
  status: 'disconnected' | 'connected';
  role: MultiplayerRole | null;

  room: RoomMeta | null;
  players: Record<string, RoomPlayer>;
  gamePhase: 'lobby' | 'in_game' | 'results';
  gameStartedAt: number | null;

  publicRooms: PublicRoomSummary[];
}

/**
 * MultiplayerActions - Actions của store
 *
 * LIFECYCLE:
 * - initSelf(): initialize player identity
 *
 * ROOM MANAGEMENT:
 * - loadPublicRooms(): refresh room list
 * - createRoom(): tạo phòng mới
 * - joinRoom(): tham gia phòng
 * - leaveRoom(): rời phòng
 *
 * GAME ACTIONS:
 * - setReady(): toggle ready status
 * - startGame(): host bắt đầu game
 * - updateHanoiProgress(): sync progress
 *
 * INTERNAL:
 * - _handleMessage(): process incoming messages
 */
export interface MultiplayerActions {
  initSelf: () => void;

  loadPublicRooms: () => void;
  createRoom: (input: {
    name: string;
    maxPlayers: number;
    gameId?: GameId;
    hanoiDisks?: number;
    gridRows?: number;
    gridCols?: number;
    landRatio?: number;
  }) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;

  setReady: (ready: boolean) => void;
  startGame: () => void;

  // Game-specific progress updates
  updateHanoiProgress: (progress: {
    encoding: number;
    moves: number;
    completed: boolean;
    finishedAt: number | null;
  }) => void;

  updateMazeProgress: (progress: {
    position: { row: number; col: number };
    moves: number;
    completed: boolean;
    finishedAt: number | null;
  }) => void;

  updateFloodProgress: (progress: {
    scores: number[];
    currentPlayer: number;
    completed: boolean;
    finishedAt: number | null;
  }) => void;

  updateIslandProgress: (progress: {
    markedIslands: number;
    answer: number | null;
    correct: boolean | null;
    finishedAt: number | null;
  }) => void;

  _handleMessage: (msg: RoomMessage) => void;
}

type MultiplayerStore = MultiplayerState & MultiplayerActions;

/* =============================================================================
   MESSAGE PROTOCOL - Giao thức tin nhắn
   ============================================================================= */

/**
 * RoomMessage - Union type cho tất cả message types
 *
 * PROTOCOL DESIGN:
 * - Mỗi message có type field để discriminate
 * - roomId để filter messages (chỉ xử lý room của mình)
 * - sentAt để ordering và debugging
 *
 * MESSAGE TYPES:
 *
 * HELLO:
 * - Client gửi khi muốn join room
 * - Host nhận và add player
 *
 * WELCOME:
 * - Host gửi cho client mới join
 * - Chứa room meta và roster
 *
 * ROSTER_UPDATE:
 * - Host broadcast khi roster thay đổi
 * - All clients update local roster
 *
 * PLAYER_READY:
 * - Player broadcast khi toggle ready
 *
 * START_GAME:
 * - Host broadcast khi bắt đầu game
 *
 * HANOI_PROGRESS:
 * - Player broadcast game progress
 * - Dùng cho live scoreboard
 *
 * PING:
 * - Heartbeat để detect online/offline
 *
 * LEAVE:
 * - Player broadcast khi rời phòng
 */
type RoomMessage =
  | {
    type: 'HELLO';
    roomId: string;
    fromPlayer: { id: string; name: string };
    sentAt: number;
  }
  | {
    type: 'WELCOME';
    roomId: string;
    targetPlayerId: string;
    room: RoomMeta;
    players: Record<string, RoomPlayer>;
    sentAt: number;
  }
  | {
    type: 'ROSTER_UPDATE';
    roomId: string;
    players: Record<string, RoomPlayer>;
    sentAt: number;
  }
  | {
    type: 'PLAYER_READY';
    roomId: string;
    playerId: string;
    ready: boolean;
    sentAt: number;
  }
  | {
    type: 'START_GAME';
    roomId: string;
    startedAt: number;
    sentAt: number;
  }
  | {
    type: 'HANOI_PROGRESS';
    roomId: string;
    playerId: string;
    progress: RoomPlayer['hanoi'];
    sentAt: number;
  }
  | {
    type: 'MAZE_PROGRESS';
    roomId: string;
    playerId: string;
    progress: RoomPlayer['maze'];
    sentAt: number;
  }
  | {
    type: 'FLOOD_PROGRESS';
    roomId: string;
    playerId: string;
    progress: RoomPlayer['flood'];
    sentAt: number;
  }
  | {
    type: 'ISLAND_PROGRESS';
    roomId: string;
    playerId: string;
    progress: RoomPlayer['island'];
    sentAt: number;
  }
  | {
    type: 'PING';
    roomId: string;
    playerId: string;
    sentAt: number;
  }
  | {
    type: 'LEAVE';
    roomId: string;
    playerId: string;
    sentAt: number;
  };

/* =============================================================================
   CONSTANTS - Hằng số
   ============================================================================= */

/**
 * PUBLIC_ROOMS_KEY - LocalStorage key cho room discovery
 *
 * PURPOSE:
 * Cho phép các tabs cùng browser "see" nhau mà không cần server.
 */
const PUBLIC_ROOMS_KEY = 'algoquest_public_rooms_v1';

/* =============================================================================
   UTILITY FUNCTIONS - Hàm tiện ích
   ============================================================================= */

/**
 * now - Get current timestamp
 *
 * PURPOSE:
 * Wrapper để dễ mock trong tests.
 */
const now = () => Date.now();

/**
 * generateId - Tạo random ID 6 ký tự
 *
 * ALGORITHM:
 * 1. Random số từ 0 đến 36^6 - 1
 * 2. Convert sang base36 (0-9, a-z)
 * 3. Convert sang uppercase
 * 4. Pad với 0 nếu < 6 chars
 *
 * RESULT: String như "0A12BC"
 *
 * COLLISION PROBABILITY:
 * - 36^6 = ~2 billion combinations
 * - Very low collision cho demo use case
 */
const generateId = () => {
  const rand = Math.floor(Math.random() * 36 ** 6);
  return rand.toString(36).toUpperCase().padStart(6, '0');
};

/**
 * normalizeRoomId - Chuẩn hóa room ID
 *
 * PURPOSE:
 * - Trim whitespace
 * - Convert to uppercase
 * - Cho phép user nhập "abc123" và match với "ABC123"
 */
const normalizeRoomId = (roomId: string) => roomId.trim().toUpperCase();

/**
 * safeParseJson - Parse JSON an toàn
 *
 * PURPOSE:
 * Tránh crash khi localStorage chứa dữ liệu không hợp lệ
 *
 * RETURNS:
 * - Parsed object nếu valid
 * - null nếu invalid hoặc empty
 */
const safeParseJson = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

/* =============================================================================
   LOCALSTORAGE DISCOVERY - Khám phá phòng qua localStorage
   ============================================================================= */

/**
 * loadRoomsFromStorage - Load danh sách phòng từ localStorage
 *
 * FLOW:
 * 1. Get raw string from localStorage
 * 2. Parse JSON safely
 * 3. Return empty array if invalid
 */
const loadRoomsFromStorage = (): PublicRoomSummary[] => {
  const parsed = safeParseJson<PublicRoomSummary[]>(localStorage.getItem(PUBLIC_ROOMS_KEY));
  return Array.isArray(parsed) ? parsed : [];
};

/**
 * saveRoomsToStorage - Save danh sách phòng vào localStorage
 *
 * TRIGGERS 'storage' EVENT:
 * Other tabs listening 'storage' event sẽ thấy update.
 */
const saveRoomsToStorage = (rooms: PublicRoomSummary[]) => {
  localStorage.setItem(PUBLIC_ROOMS_KEY, JSON.stringify(rooms));
};

/**
 * upsertPublicRoom - Thêm hoặc update phòng trong danh sách
 *
 * ALGORITHM:
 * 1. Load current list
 * 2. Remove existing entry with same id (if any)
 * 3. Add new entry at front (MRU order)
 * 4. Limit to 30 entries (prevent unbounded growth)
 * 5. Save back
 */
const upsertPublicRoom = (summary: PublicRoomSummary) => {
  const rooms = loadRoomsFromStorage();
  const next = [
    summary,
    ...rooms.filter((r) => r.id !== summary.id),
  ].slice(0, 30);
  saveRoomsToStorage(next);
};

/**
 * removePublicRoom - Xóa phòng khỏi danh sách
 *
 * USAGE:
 * Called when host leaves room.
 */
const removePublicRoom = (roomId: string) => {
  const rooms = loadRoomsFromStorage();
  saveRoomsToStorage(rooms.filter((r) => r.id !== roomId));
};

/* =============================================================================
   TRANSPORT LAYER - Lớp truyền tải
   ============================================================================= */

/**
 * Module-level variables for transport
 *
 * Tại sao không để trong store?
 * - BroadcastChannel là mutable instance, không fit Zustand immutable pattern
 * - Timers cần persist across render cycles
 * - Cleanup dễ hơn khi tách biệt
 */
let channel: BroadcastChannel | null = null;
let heartbeatTimer: number | null = null;
let discoveryTimer: number | null = null;

/**
 * post - Gửi message qua BroadcastChannel
 *
 * SAFETY:
 * Check channel exists trước khi post.
 */
const post = (msg: RoomMessage) => {
  channel?.postMessage(msg);
};

/**
 * closeTransport - Đóng connection và cleanup
 *
 * ACTIONS:
 * 1. Clear heartbeat timer
 * 2. Clear discovery timer
 * 3. Close BroadcastChannel
 */
const closeTransport = () => {
  if (heartbeatTimer) window.clearInterval(heartbeatTimer);
  if (discoveryTimer) window.clearInterval(discoveryTimer);
  heartbeatTimer = null;
  discoveryTimer = null;

  if (channel) {
    channel.close();
    channel = null;
  }
};

/**
 * connectTransport - Mở connection mới
 *
 * ALGORITHM:
 * 1. Close existing connection (if any)
 * 2. Create new BroadcastChannel với room-specific name
 *
 * CHANNEL NAME:
 * Format: "algoquest_room_{roomId}"
 * Mỗi room có channel riêng để không nhận message từ room khác.
 */
const connectTransport = (roomId: string) => {
  closeTransport();
  channel = new BroadcastChannel(`algoquest_room_${roomId}`);
};

/* =============================================================================
   ZUSTAND STORE - State management
   ============================================================================= */

/**
 * useMultiplayerStore - Zustand store cho multiplayer
 *
 * USAGE:
 * const { status, createRoom, joinRoom } = useMultiplayerStore();
 *
 * REACTIVE:
 * Component sẽ re-render khi state thay đổi.
 */
export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  /* =========================================================================
     INITIAL STATE - Trạng thái ban đầu
     ========================================================================= */

  self: { id: generateId(), name: 'Apprentice' },
  status: 'disconnected',
  role: null,

  room: null,
  players: {},
  gamePhase: 'lobby',
  gameStartedAt: null,

  publicRooms: [],

  /* =========================================================================
     ACTIONS - Các hành động
     ========================================================================= */

  /**
   * initSelf - Khởi tạo identity của player
   *
   * PURPOSE:
   * Sync name từ playerStore (global player profile).
   *
   * WHEN:
   * Call khi component mount.
   */
  initSelf: () => {
    const { name } = usePlayerStore.getState();
    set((state) => ({
      self: {
        ...state.self,
        name: name || 'Apprentice'
      }
    }));
  },

  /**
   * loadPublicRooms - Load và filter danh sách phòng
   *
   * FILTER:
   * Chỉ giữ phòng updated trong 15s qua.
   * Phòng cũ hơn được coi là "dead".
   */
  loadPublicRooms: () => {
    const rooms = loadRoomsFromStorage();
    const fresh = rooms.filter((r) => now() - r.updatedAt <= 15_000);
    set({ publicRooms: fresh });
  },

  /**
   * createRoom - Khởi tạo phòng chơi mới (Host side)
   *
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * CHI TIẾT CHỨC NĂNG (Detailed Functionality):
   * Hàm này đóng vai trò là "Constructor" cho một session multiplayer.
   * Nó thiết lập môi trường cho phòng, bao gồm ID, settings, và người chơi đầu tiên (host).
   *
   * FLOW CHI TIẾT (Step-by-Step Flow):
   * 1. [Identity] Lấy thông tin user hiện tại (self) từ store.
   * 2. [ID Generation] Tạo Room ID ngẫu nhiên (6 ký tự, uppercase) đảm bảo tính unique (xác suất trùng thấp).
   * 3. [Meta Setup] Cấu hình metadata cho phòng:
   *    - Game type (Hanoi, Maze, etc.)
   *    - Max players limit
   *    - Game-specific settings (số đĩa, size lưới...)
   * 4. [Host Setup] Tạo record Player cho host, đánh dấu isHost=true.
   * 5. [State Update] Commit vào store (Zustand) để UI render lobby.
   * 6. [Transport] Khởi tạo BroadcastChannel để lắng nghe người khác.
   * 7. [Listeners] Đăng ký handler cho tin nhắn đến (onmessage).
   * 8. [Heartbeat] Bắt đầu gửi tín hiệu PING định kỳ (Keep-alive).
   *
   * KỸ THUẬT & THUẬT TOÁN (Techniques & Algorithms):
   * - **UUID Shortening**: Dùng Base36 string generation `Math.random().toString(36)` để tạo ID ngắn gọn, dễ chia sẻ, thay vì UUID v4 dài dòng.
   * - **Optimistic UI**: Cập nhật UI ngay lập tức trước khi có bất kỳ network acknowledgement nào (vì là Host/Local).
   * - **Dependency Injection**: Tiêm settings vào room meta để các clients khác có thể đọc được cấu hình game.
   *
   * SO SÁNH (Comparison):
   * - So với **Server-Side Room**: Ở đây room state nằm trên máy Host. Nếu Host F5, phòng bay màu. Server-side thì persistent hơn.
   * - So với **P2P Hash**: ID ngắn dễ đọc hơn hash dài, nhưng cần đảm bảo entropy đủ lớn.
   *
   * ƯU/NHƯỢC ĐIỂM (Pros/Cons):
   * ✅ **Ưu**: Tức thì (Zero latency), không tốn server cost.
   * ❌ **Nhược**: Host là Single Point of Failure (SPOF). Host out = Room out.
   *
   * @param input - Các tham số cấu hình phòng từ UI
   */
  createRoom: (input) => {
    const roomId = normalizeRoomId(generateId());
    const createdAt = now();
    const self = get().self;

    // 1. Create room metadata (Metadata phòng)
    const room: RoomMeta = {
      id: roomId,
      name: input.name.trim() || `Phòng ${roomId}`,
      hostId: self.id,
      gameId: input.gameId || 'hanoi',
      maxPlayers: Math.max(2, Math.min(8, input.maxPlayers)),
      settings: {
        hanoiDisks: Math.max(3, Math.min(8, input.hanoiDisks || 5)),
        gridRows: Math.max(8, Math.min(20, input.gridRows || 15)),
        gridCols: Math.max(8, Math.min(20, input.gridCols || 15)),
        landRatio: Math.max(0.2, Math.min(0.6, input.landRatio || 0.4))
      },
      createdAt
    };

    // 2. Create host player entry
    const hostPlayer: RoomPlayer = {
      id: self.id,
      name: self.name,
      isHost: true,
      ready: false,
      lastSeen: now(),
      hanoi: {
        encoding: 0,
        moves: 0,
        completed: false,
        finishedAt: null
      }
    };

    // 3. Update store state
    set({
      status: 'connected',
      role: 'host',
      room,
      players: { [hostPlayer.id]: hostPlayer },
      gamePhase: 'lobby',
      gameStartedAt: null
    });

    // 4. Connect transport
    connectTransport(roomId);

    // 5. Setup message handler
    channel!.onmessage = (event) => {
      const msg = event.data as RoomMessage;
      get()._handleMessage(msg);
    };

    // 6. Heartbeat timer - gửi PING mỗi 2s
    heartbeatTimer = window.setInterval(() => {
      const state = get();
      if (!state.room) return;

      // Send PING
      post({ type: 'PING', roomId: state.room.id, playerId: state.self.id, sentAt: now() });

      // Update own lastSeen
      set((s) => ({
        players: {
          ...s.players,
          [s.self.id]: {
            ...s.players[s.self.id],
            lastSeen: now()
          }
        }
      }));
    }, 2000);

    // 7. Discovery timer - update localStorage mỗi 3s
    discoveryTimer = window.setInterval(() => {
      const state = get();
      if (!state.room || state.role !== 'host') return;

      upsertPublicRoom({
        id: state.room.id,
        name: state.room.name,
        gameId: state.room.gameId,
        maxPlayers: state.room.maxPlayers,
        settings: state.room.settings,
        updatedAt: now()
      });
    }, 3000);

    // 8. Initial publish to localStorage
    upsertPublicRoom({
      id: room.id,
      name: room.name,
      gameId: room.gameId,
      maxPlayers: room.maxPlayers,
      settings: room.settings,
      updatedAt: now()
    });

    // 9. Broadcast initial roster
    post({
      type: 'ROSTER_UPDATE',
      roomId,
      players: get().players,
      sentAt: now()
    });
  },

  /**
   * joinRoom - Tham gia phòng có sẵn
   *
   * FLOW:
   * 1. Normalize room ID
   * 2. Update store state (optimistic)
   * 3. Connect transport
   * 4. Setup message handler
   * 5. Setup heartbeat
   * 6. Send HELLO message
   * 7. Wait for WELCOME from host
   *
   * @param rawRoomId - Room ID (có thể chưa normalized)
   */
  joinRoom: (rawRoomId) => {
    const roomId = normalizeRoomId(rawRoomId);
    const self = get().self;

    // Set connecting state
    set({
      status: 'connected',
      role: 'client',
      room: null, // Will be set when WELCOME received
      players: {},
      gamePhase: 'lobby',
      gameStartedAt: null
    });

    // Connect transport
    connectTransport(roomId);

    // Setup message handler
    channel!.onmessage = (event) => {
      const msg = event.data as RoomMessage;
      get()._handleMessage(msg);
    };

    // Heartbeat timer
    heartbeatTimer = window.setInterval(() => {
      const state = get();
      if (!state.role || state.status !== 'connected') return;
      post({ type: 'PING', roomId, playerId: state.self.id, sentAt: now() });
    }, 2000);

    // Send HELLO to request join
    post({
      type: 'HELLO',
      roomId,
      fromPlayer: { id: self.id, name: self.name },
      sentAt: now()
    });
  },

  /**
   * leaveRoom - Rời phòng hiện tại
   *
   * ACTIONS:
   * 1. Send LEAVE message
   * 2. If host: remove from localStorage
   * 3. Close transport
   * 4. Reset store state
   */
  leaveRoom: () => {
    const state = get();

    if (state.room) {
      // Broadcast leave
      post({ type: 'LEAVE', roomId: state.room.id, playerId: state.self.id, sentAt: now() });

      // If host, remove from discovery
      if (state.role === 'host') removePublicRoom(state.room.id);
    }

    // Cleanup
    closeTransport();

    // Reset state
    set({
      status: 'disconnected',
      role: null,
      room: null,
      players: {},
      gamePhase: 'lobby',
      gameStartedAt: null
    });
  },

  /**
   * setReady - Toggle ready status trong lobby
   *
   * FLOW:
   * 1. Update local state
   * 2. Broadcast PLAYER_READY
   */
  setReady: (ready) => {
    const state = get();
    if (!state.room) return;

    // Update local
    set((s) => ({
      players: {
        ...s.players,
        [s.self.id]: {
          ...s.players[s.self.id],
          ready
        }
      }
    }));

    // Broadcast
    post({
      type: 'PLAYER_READY',
      roomId: state.room.id,
      playerId: state.self.id,
      ready,
      sentAt: now()
    });
  },

  /**
   * startGame - Host bắt đầu game
   *
   * GUARD:
   * - Must be host
   * - Must have room
   *
   * ACTIONS:
   * 1. Set gamePhase = 'in_game'
   * 2. Set gameStartedAt for timer
   * 3. Broadcast START_GAME
   */
  startGame: () => {
    const state = get();
    if (!state.room || state.role !== 'host') return;

    const startedAt = now();

    set({ gamePhase: 'in_game', gameStartedAt: startedAt });

    post({ type: 'START_GAME', roomId: state.room.id, startedAt, sentAt: now() });
  },

  /**
   * updateHanoiProgress - Gửi progress update
   *
   * PURPOSE:
   * Sync game progress với other players cho live scoreboard.
   *
   * FLOW:
   * 1. Update local player state
   * 2. Broadcast HANOI_PROGRESS
   */
  updateHanoiProgress: (progress) => {
    const state = get();
    if (!state.room) return;

    // Update local
    set((s) => ({
      players: {
        ...s.players,
        [s.self.id]: {
          ...s.players[s.self.id],
          hanoi: {
            encoding: progress.encoding,
            moves: progress.moves,
            completed: progress.completed,
            finishedAt: progress.finishedAt
          },
          lastSeen: now()
        }
      }
    }));

    // Broadcast
    post({
      type: 'HANOI_PROGRESS',
      roomId: state.room.id,
      playerId: state.self.id,
      progress: {
        encoding: progress.encoding,
        moves: progress.moves,
        completed: progress.completed,
        finishedAt: progress.finishedAt
      },
      sentAt: now()
    });
  },

  /**
   * updateMazeProgress - Gửi Maze game progress
   */
  updateMazeProgress: (progress) => {
    const state = get();
    if (!state.room) return;

    set((s) => ({
      players: {
        ...s.players,
        [s.self.id]: {
          ...s.players[s.self.id],
          maze: {
            position: progress.position,
            moves: progress.moves,
            completed: progress.completed,
            finishedAt: progress.finishedAt
          },
          lastSeen: now()
        }
      }
    }));

    post({
      type: 'MAZE_PROGRESS',
      roomId: state.room.id,
      playerId: state.self.id,
      progress,
      sentAt: now()
    });
  },

  /**
   * updateFloodProgress - Gửi Flood Fill game progress
   */
  updateFloodProgress: (progress) => {
    const state = get();
    if (!state.room) return;

    set((s) => ({
      players: {
        ...s.players,
        [s.self.id]: {
          ...s.players[s.self.id],
          flood: {
            scores: progress.scores,
            currentPlayer: progress.currentPlayer,
            completed: progress.completed,
            finishedAt: progress.finishedAt
          },
          lastSeen: now()
        }
      }
    }));

    post({
      type: 'FLOOD_PROGRESS',
      roomId: state.room.id,
      playerId: state.self.id,
      progress,
      sentAt: now()
    });
  },

  /**
   * updateIslandProgress - Gửi Island game progress
   */
  updateIslandProgress: (progress) => {
    const state = get();
    if (!state.room) return;

    set((s) => ({
      players: {
        ...s.players,
        [s.self.id]: {
          ...s.players[s.self.id],
          island: {
            markedIslands: progress.markedIslands,
            answer: progress.answer,
            correct: progress.correct,
            finishedAt: progress.finishedAt
          },
          lastSeen: now()
        }
      }
    }));

    post({
      type: 'ISLAND_PROGRESS',
      roomId: state.room.id,
      playerId: state.self.id,
      progress,
      sentAt: now()
    });
  },

  /**
 * _handleMessage - Xử lý incoming messages
 *
 * PATTERN: Message Handler Pattern
 * - Switch trên message type
 * - Guard clause: check roomId match
 * - Update store state accordingly
 *
 * VISIBILITY:
 * Prefixed với _ để indicate internal use.
 * Không nên call từ UI code.
 */
  _handleMessage: (msg: RoomMessage) => {
    const state = get();

    // Guard: Skip messages not for our room (except handshake messages)
    if (msg.type !== 'HELLO' && msg.type !== 'WELCOME' && msg.type !== 'ROSTER_UPDATE') {
      if (!state.room) return;
      if (msg.roomId !== state.room.id) return;
    }

    switch (msg.type) {
      /**
       * HELLO - Client muốn join room
       *
       * HANDLER: Host only
       *
       * FLOW:
       * 1. Check if we are host
       * 2. Check room capacity
       * 3. Add player to roster
       * 4. Send WELCOME to joiner
       * 5. Broadcast ROSTER_UPDATE to all
       */
      case 'HELLO': {
        if (state.role !== 'host' || !state.room) return;
        if (msg.roomId !== state.room.id) return;
        if (Object.keys(state.players).length >= state.room.maxPlayers) return;

        const joining = msg.fromPlayer;

        // Create new player entry
        const nextPlayers: Record<string, RoomPlayer> = {
          ...state.players,
          [joining.id]: {
            id: joining.id,
            name: joining.name,
            isHost: false,
            ready: false,
            lastSeen: now(),
            hanoi: {
              encoding: 0,
              moves: 0,
              completed: false,
              finishedAt: null
            }
          }
        };

        set({ players: nextPlayers });

        // Send WELCOME to joiner
        post({
          type: 'WELCOME',
          roomId: state.room.id,
          targetPlayerId: joining.id,
          room: state.room,
          players: nextPlayers,
          sentAt: now()
        });

        // Broadcast updated roster
        post({
          type: 'ROSTER_UPDATE',
          roomId: state.room.id,
          players: nextPlayers,
          sentAt: now()
        });
        return;
      }

      /**
       * WELCOME - Host chào đón client mới
       *
       * HANDLER: Client only
       *
       * GUARD: Check targetPlayerId là mình
       *
       * ACTIONS:
       * - Set room metadata
       * - Set players roster
       */
      case 'WELCOME': {
        if (state.role !== 'client') return;
        if (msg.targetPlayerId !== state.self.id) return;

        set({
          room: msg.room,
          players: msg.players,
          gamePhase: 'lobby',
          gameStartedAt: null
        });
        return;
      }

      /**
       * ROSTER_UPDATE - Host broadcast roster changes
       *
       * HANDLER: All clients
       *
       * ACTIONS:
       * - Replace local roster with received
       */
      case 'ROSTER_UPDATE': {
        if (!state.room) {
          if (state.role === 'client') return;
          return;
        }

        set({ players: msg.players });
        return;
      }

      /**
       * PLAYER_READY - Player toggle ready status
       *
       * HANDLER: All in room
       *
       * ACTIONS:
       * - Update player.ready
       * - Update player.lastSeen
       */
      case 'PLAYER_READY': {
        set((s) => ({
          players: {
            ...s.players,
            [msg.playerId]: {
              ...s.players[msg.playerId],
              ready: msg.ready,
              lastSeen: now()
            }
          }
        }));
        return;
      }

      /**
       * START_GAME - Host bắt đầu game
       *
       * HANDLER: All in room
       *
       * ACTIONS:
       * - Set gamePhase = 'in_game'
       * - Set gameStartedAt for timer
       */
      case 'START_GAME': {
        set({ gamePhase: 'in_game', gameStartedAt: msg.startedAt });
        return;
      }

      /**
       * HANOI_PROGRESS - Player game progress
       *
       * HANDLER: All in room
       *
       * ACTIONS:
       * - Update player.hanoi
       * - Update player.lastSeen
       */
      case 'HANOI_PROGRESS': {
        if (!msg.progress) return;

        set((s) => ({
          players: {
            ...s.players,
            [msg.playerId]: {
              ...s.players[msg.playerId],
              hanoi: msg.progress,
              lastSeen: now()
            }
          }
        }));
        return;
      }

      /**
       * PING - Heartbeat
       *
       * HANDLER: All in room
       *
       * ACTIONS:
       * - Update player.lastSeen
       */
      case 'PING': {
        set((s) => ({
          players: {
            ...s.players,
            [msg.playerId]: {
              ...s.players[msg.playerId],
              lastSeen: now()
            }
          }
        }));
        return;
      }

      /**
       * LEAVE - Player rời phòng
       *
       * HANDLER: All in room
       *
       * ACTIONS:
       * - Remove player từ roster
       */
      case 'LEAVE': {
        set((s) => {
          const next = { ...s.players };
          delete next[msg.playerId];
          return { players: next };
        });
        return;
      }
    }
  }
} as MultiplayerStore));

