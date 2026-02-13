/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MULTIPLAYER ARENA - ĐẤU TRƯỜNG NHIỀU NGƯỜI CHƠI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ TỔNG QUAN (Overview)
 * ─────────────────────────────────────────────────────────────────────────────
 * Trang chính cho chế độ chơi nhiều người. Cho phép:
 * - Tạo phòng (host)
 * - Tham gia phòng bằng mã (client)
 * - Lobby: chờ người chơi, toggle ready
 * - Game: chơi Tower of Hanoi với live scoreboard
 *
 * KIẾN TRÚC UI (UI Architecture)
 * ─────────────────────────────────────────────────────────────────────────────
 * Component sử dụng state machine pattern với 3 views chính:
 *
 * 1. DISCONNECTED VIEW (renderDisconnected):
 *    - Form tạo phòng (room name, max players, số đĩa)
 *    - Form join phòng (room code)
 *    - Danh sách phòng công khai (LocalStorage discovery)
 *
 * 2. LOBBY VIEW (renderLobby):
 *    - Room info (name, code, settings)
 *    - Player list với online/ready status
 *    - Copy link to invite
 *    - Ready toggle + Start game (host only)
 *
 * 3. GAME VIEW (renderGame):
 *    - HanoiGame component (gameplay area)
 *    - Live scoreboard (sorted by completion, then moves)
 *    - Leave room button
 *
 * STATE MACHINE TRANSITIONS:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   [disconnected]
 *        │
 *   createRoom() / joinRoom()
 *        │
 *        ▼
 *   [connected, lobby]
 *        │
 *   startGame() (host)
 *        │
 *        ▼
 *   [connected, in_game]
 *        │
 *   leaveRoom()
 *        │
 *        ▼
 *   [disconnected]
 *
 * FLOW TẠO PHÒNG (Create Room Flow)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. User nhập: tên phòng, số người tối đa, số đĩa
 * 2. Click "Tạo phòng" -> handleCreate()
 * 3. createRoom() tạo roomId -> connect BroadcastChannel
 * 4. Publish room metadata to localStorage
 * 5. status = 'connected', gamePhase = 'lobby'
 * 6. UI switch sang renderLobby()
 *
 * FLOW THAM GIA PHÒNG (Join Room Flow)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. User nhập mã phòng HOẶC click phòng trong danh sách
 * 2. joinRoom(roomId) -> connect BroadcastChannel -> send HELLO
 * 3. Host nhận HELLO -> add player -> send WELCOME
 * 4. Client nhận WELCOME -> set room meta + roster
 * 5. UI switch sang renderLobby()
 *
 * FLOW BẮT ĐẦU GAME (Start Game Flow)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Host click "Host bắt đầu" (cần >= 1 player ready)
 * 2. startGame() -> broadcast START_GAME
 * 3. All players receive -> gamePhase = 'in_game'
 * 4. UI switch sang renderGame()
 * 5. HanoiGame component handles gameplay
 * 6. Progress broadcasts update scoreboard real-time
 *
 * KỸ THUẬT SỬ DỤNG (Techniques Used)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. ZUSTAND STORE INTEGRATION:
 *    - useMultiplayerStore() hook để access state và actions
 *    - Reactive: UI auto-update khi state thay đổi
 *
 * 2. URL-BASED ROOM SHARING:
 *    - Room ID lưu trong URL hash: #/arena?room=ABC123
 *    - User có thể share link để mời người khác
 *    - useSearchParams() để sync URL ↔ state
 *
 * 3. LOCALSTORAGE DISCOVERY:
 *    - Host định kỳ publish room metadata
 *    - Other tabs listen 'storage' event
 *    - Cho phép "discover" rooms trong cùng browser
 *
 * 4. FRAMER MOTION TRANSITIONS:
 *    - AnimatePresence cho smooth view switching
 *    - exit/enter animations cho polish UX
 *
 * 5. HEARTBEAT-BASED ONLINE DETECTION:
 *    - nowTick updates mỗi 500ms
 *    - Online = lastSeen trong 6s
 *    - Show green/red dot cho status
 *
 * SO SÁNH VỚI CÁC APPROACHES KHÁC (Comparison)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * | Approach              | Pros                  | Cons                    |
 * |-----------------------|-----------------------|-------------------------|
 * | Single component (now)| Simple, all in one    | Long file, hard to test |
 * | Separate components   | Modular, testable     | More files, prop drill  |
 * | Page router           | URL-based navigation  | Overkill for 3 views    |
 *
 * ƯU ĐIỂM THIẾT KẾ HIỆN TẠI (Pros)
 * - Self-contained: tất cả logic trong 1 file
 * - Clear state machine: dễ trace flow
 * - URL sharing: invites dễ dàng
 *
 * NHƯỢC ĐIỂM (Cons)
 * - File dài (~500 lines)
 * - Khó unit test từng phần
 *
 * @component MultiplayerArena
 * @category Pages/Multiplayer
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { useMultiplayerStore } from '../store/multiplayerStore';
import type { GameId } from '../store/multiplayerStore';
import { HanoiGame } from '../components/games/hanoi/HanoiGame';
import { MazeGame, FloodFillGame, IslandGame } from '../components/games/grid';
import './MultiplayerArena.css';

/* =============================================================================
   UTILITY FUNCTIONS - Hàm tiện ích
   ============================================================================= */

/**
 * formatRoomLink - Tạo link invite chứa room ID
 *
 * FORMAT:
 * https://[origin]/#/arena?room=ABC123
 *
 * PURPOSE:
 * Cho phép user share link để mời người khác join.
 *
 * @param roomId - Mã phòng
 * @returns Full URL có thể share
 */
const formatRoomLink = (roomId: string) => {
  const url = new URL(window.location.href);
  url.hash = `#/arena?room=${encodeURIComponent(roomId)}`;
  return url.toString();
};

/**
 * copyToClipboard - Copy text vào clipboard
 *
 * BROWSER API:
 * navigator.clipboard.writeText() - async, returns Promise
 *
 * ERROR HANDLING:
 * Catch any errors (permission denied, etc.) và return false
 *
 * @param text - Text cần copy
 * @returns true nếu thành công, false nếu thất bại
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/* =============================================================================
   MAIN COMPONENT - Component chính
   ============================================================================= */

/**
 * MultiplayerArena - Trang đấu trường nhiều người chơi
 *
 * RENDER STRUCTURE:
 * .arena-page
 * ├── .arena-topbar (title + back button)
 * └── AnimatePresence
 *     ├── [disconnected] renderDisconnected()
 *     ├── [lobby] renderLobby()
 *     └── [in_game] renderGame()
 */
export const MultiplayerArena: React.FC = () => {
  /* =========================================================================
     STORE ACCESS - Truy cập store
     ========================================================================= */

  /**
   * useGameStore - Store chính của game
   *
   * USAGE:
   * setScene(GameScene.MAIN_MENU) để quay về menu chính
   */
  const { setScene } = useGameStore();

  /**
   * useSearchParams - React Router hook cho URL params
   *
   * USAGE:
   * - Get: searchParams.get('room')
   * - Set: setSearchParams({ room: 'ABC123' })
   */
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * useMultiplayerStore - Store cho multiplayer
   *
   * DESTRUCTURING:
   * - State: status, role, room, players, gamePhase, ...
   * - Actions: createRoom, joinRoom, leaveRoom, ...
   */
  const {
    initSelf,
    status,
    role,
    room,
    players,
    publicRooms,
    loadPublicRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
    startGame,
    updateHanoiProgress,
    updateMazeProgress,
    updateFloodProgress,
    updateIslandProgress,
    self,
    gamePhase,
    gameStartedAt
  } = useMultiplayerStore();

  /* =========================================================================
     LOCAL STATE - State cục bộ cho forms
     ========================================================================= */

  /**
   * Create room form state
   */
  const [createName, setCreateName] = useState<string>('Phòng Tháp Hà Nội');
  const [createMaxPlayers, setCreateMaxPlayers] = useState<number>(4);
  const [createDisks, setCreateDisks] = useState<number>(5);
  const [createGameType, setCreateGameType] = useState<GameId>('hanoi');
  const [createGridRows, setCreateGridRows] = useState<number>(15);
  const [createGridCols, setCreateGridCols] = useState<number>(15);

  /**
   * Join room form state
   */
  const [joinCode, setJoinCode] = useState<string>('');

  /**
   * UI feedback state
   */
  const [copyState, setCopyState] = useState<'idle' | 'ok' | 'fail'>('idle');

  /**
   * Timer tick for online detection
   * Updates every 500ms to check player.lastSeen
   */
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  /**
   * roomParam - Room ID từ URL
   *
   * NORMALIZED:
   * Convert to uppercase để case-insensitive matching
   */
  const roomParam = (searchParams.get('room') ?? '').toUpperCase();

  /* =========================================================================
     EFFECTS - Các side effects
     ========================================================================= */

  /**
   * Init Effect - Khởi tạo khi component mount
   *
   * ACTIONS:
   * 1. initSelf(): sync name từ playerStore
   * 2. loadPublicRooms(): load danh sách phòng
   * 3. Listen 'storage' event để refresh room list
   */
  useEffect(() => {
    initSelf();
    loadPublicRooms();

    const onStorage = () => loadPublicRooms();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [initSelf, loadPublicRooms]);

  /**
   * Cleanup Effect - Leave room khi unmount
   *
   * PURPOSE:
   * Đảm bảo player được remove từ room khi navigate away
   */
  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  /**
   * Timer Effect - Update nowTick cho online detection
   *
   * TRIGGER:
   * Chỉ khi connected (không cần khi disconnected)
   *
   * INTERVAL: 500ms
   */
  useEffect(() => {
    if (status !== 'connected') return;
    const t = window.setInterval(() => setNowTick(Date.now()), 500);
    return () => window.clearInterval(t);
  }, [status]);

  /**
   * URL Join Effect - Auto-join nếu có room param trong URL
   *
   * FLOW:
   * 1. Check disconnected và có roomParam
   * 2. Tự động gọi joinRoom(roomParam)
   *
   * USE CASE:
   * User click vào invite link: /arena?room=ABC123
   */
  useEffect(() => {
    if (status !== 'disconnected') return;
    if (!roomParam) return;
    joinRoom(roomParam);
  }, [status, roomParam, joinRoom]);

  /**
   * URL Sync Effect - Sync room ID vào URL
   *
   * PURPOSE:
   * Sau khi join/create thành công, update URL để shareable
   *
   * GUARD:
   * Skip nếu URL đã đúng (tránh infinite loop)
   */
  useEffect(() => {
    if (!room?.id) return;
    if (roomParam === room.id) return;
    setSearchParams({ room: room.id }, { replace: true });
  }, [room?.id, roomParam, setSearchParams]);

  /* =========================================================================
     DERIVED STATE - State tính toán
     ========================================================================= */

  /**
   * playerList - Mảng players (từ object)
   *
   * PURPOSE:
   * Easier to map/filter than object
   */
  const playerList = useMemo(() => Object.values(players), [players]);

  /**
   * onlineCutoff - Threshold cho online detection (6s)
   *
   * LOGIC:
   * Player với lastSeen > 6s ago được coi là offline
   */
  const onlineCutoff = 6_000;

  /**
   * myPlayer - Player entry của current user
   */
  const myPlayer = players[self.id];

  /**
   * readyCount - Số người đã ready
   */
  const readyCount = useMemo(() => playerList.filter((p) => p.ready).length, [playerList]);

  /**
   * canStart - Host có thể start game hay không
   *
   * CONDITIONS:
   * - Phải là host
   * - Phải ở lobby
   * - Có ít nhất 1 người ready (có thể là chính mình)
   */
  const canStart = role === 'host' && gamePhase === 'lobby' && readyCount >= 1;

  /* =========================================================================
     EVENT HANDLERS - Xử lý sự kiện
     ========================================================================= */

  /**
   * handleCreate - Xử lý khi click "Tạo phòng"
   *
   * ACTIONS:
   * Call createRoom với form values
   */
  const handleCreate = () => {
    createRoom({
      name: createName,
      maxPlayers: createMaxPlayers,
      gameId: createGameType,
      hanoiDisks: createDisks,
      gridRows: createGridRows,
      gridCols: createGridCols
    });
  };

  /**
   * handleJoin - Xử lý khi click "Join"
   */
  const handleJoin = () => {
    joinRoom(joinCode);
  };

  /**
   * handleLeave - Xử lý khi click "Rời phòng"
   *
   * ACTIONS:
   * 1. leaveRoom()
   * 2. Clear room param từ URL
   */
  const handleLeave = () => {
    leaveRoom();
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  /**
   * handleCopyLink - Copy invite link vào clipboard
   *
   * UI FEEDBACK:
   * - 'idle': default
   * - 'ok': copy thành công (1.5s)
   * - 'fail': copy thất bại (1.5s)
   */
  const handleCopyLink = async () => {
    if (!room) return;
    const link = formatRoomLink(room.id);
    const ok = await copyToClipboard(link);
    setCopyState(ok ? 'ok' : 'fail');
    window.setTimeout(() => setCopyState('idle'), 1500);
  };

  /* =========================================================================
     RENDER FUNCTIONS - Các hàm render view
     ========================================================================= */

  /**
   * renderDisconnected - Giao diện khi chưa tham gia phòng
   *
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * CHỨC NĂNG (Functionality):
   * Đây là "Landing Page" của chế độ Multiplayer. Nó cung cấp 2 luồng chính:
   * 1. **Host**: Người dùng cấu hình và tạo phòng mới.
   * 2. **Client**: Người dùng nhập mã hoặc chọn phòng từ danh sách để vào.
   *
   * PHÂN TÍCH UX (UX Analysis):
   * - **Card Layout**: Chia màn hình thành các khối (Create, Join, List) giúp phân tách luồng suy nghĩ.
   * - **Smart Defaults**: Form tạo phòng điền sẵn các giá trị phổ biến (Tên, Max Players=4, Disks=5) để user có thể click "Tạo" ngay.
   * - **Discovery List**: Tự động hiển thị các phòng đang hoạt động (cùng browser) để test nhanh mà không cần copy paste ID.
   *
   * KỸ THUẬT FORM (Form Technique):
   * - **Controlled Components**: Mọi input (text, number, select) đều bind 2 chiều với React state (`value={state} onChange={setState}`).
   * - **Conditional Rendering**: Input "Số đĩa" chỉ hiện khi chọn game "Hanoi", ẩn đi với các game khác (Maze/Flood).
   *
   * @returns JSX Element
   */
  const renderDisconnected = () => (
    <div className="arena-grid">
      {/* ===== CREATE ROOM CARD ===== */}
      <div className="arena-card">
        <div className="arena-card-header">
          <h3><i className="fi fi-rr-plus"></i> Tạo phòng</h3>
          <p>Host tạo phòng và mời người khác bằng mã phòng.</p>
        </div>

        <div className="arena-form">
          <label>
            Tên phòng
            <input value={createName} onChange={(e) => setCreateName(e.target.value)} />
          </label>

          {/* Game Type Selector */}
          <label>
            Chọn trò chơi
            <select
              value={createGameType}
              onChange={(e) => setCreateGameType(e.target.value as GameId)}
              className="arena-select"
            >
              <option value="hanoi">🏯 Tháp Hà Nội</option>
              <option value="maze">🏃 Maze Race (BFS)</option>
              <option value="flood">🎨 Flood Fill Battle</option>
              <option value="island">🏝️ Island Counter (DFS)</option>
            </select>
          </label>

          <div className="arena-form-row">
            <label>
              Số người tối đa
              <input
                type="number"
                min={2}
                max={8}
                value={createMaxPlayers}
                onChange={(e) => setCreateMaxPlayers(Number(e.target.value))}
              />
            </label>
            {createGameType === 'hanoi' && (
              <label>
                Độ khó (số đĩa)
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={createDisks}
                  onChange={(e) => setCreateDisks(Number(e.target.value))}
                />
              </label>
            )}
            {createGameType !== 'hanoi' && (
              <>
                <label>
                  Rows
                  <input
                    type="number"
                    min={8}
                    max={20}
                    value={createGridRows}
                    onChange={(e) => setCreateGridRows(Number(e.target.value))}
                  />
                </label>
                <label>
                  Cols
                  <input
                    type="number"
                    min={8}
                    max={20}
                    value={createGridCols}
                    onChange={(e) => setCreateGridCols(Number(e.target.value))}
                  />
                </label>
              </>
            )}
          </div>

          <button className="arena-btn primary" onClick={handleCreate} type="button">
            <i className="fi fi-rr-flag-alt"></i> Tạo phòng
          </button>
        </div>
      </div>

      {/* ===== JOIN ROOM CARD ===== */}
      <div className="arena-card">
        <div className="arena-card-header">
          <h3><i className="fi fi-rr-enter"></i> Tham gia phòng</h3>
          <p>Nhập mã phòng (room code) để join lobby.</p>
        </div>

        <div className="arena-form">
          <label>
            Mã phòng
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="VD: 0A12BC"
            />
          </label>
          <button className="arena-btn" onClick={handleJoin} type="button">
            <i className="fi fi-rr-sign-in-alt"></i> Join
          </button>
        </div>
      </div>

      {/* ===== PUBLIC ROOMS LIST ===== */}
      <div className="arena-card arena-card-wide">
        <div className="arena-card-header">
          <h3><i className="fi fi-rr-layout-fluid"></i> Phòng đang mở (cùng máy)</h3>
          <p>Danh sách này dùng LocalStorage discovery, phù hợp demo nhiều tab.</p>
        </div>

        {publicRooms.length === 0 ? (
          <div className="arena-empty">
            <i className="fi fi-rr-info"></i> Chưa có phòng nào.
          </div>
        ) : (
          <div className="arena-room-list">
            {publicRooms.map((r) => (
              <button
                key={r.id}
                className="arena-room-item"
                onClick={() => joinRoom(r.id)}
                type="button"
              >
                <div className="arena-room-main">
                  <div className="arena-room-name">{r.name}</div>
                  <div className="arena-room-meta">
                    <span><i className="fi fi-rr-key"></i> {r.id}</span>
                    <span><i className="fi fi-rr-users"></i> tối đa {r.maxPlayers}</span>
                    <span><i className="fi fi-rr-triangle"></i> {String((r.settings as { hanoiDisks?: number }).hanoiDisks ?? '')} đĩa</span>
                  </div>
                </div>
                <div className="arena-room-join">
                  <i className="fi fi-rr-arrow-right"></i>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /**
   * renderLobby - Render view lobby (chờ game)
   *
   * STRUCTURE:
   * - Room info card (name, code, settings, copy link)
   * - Player list card (online status, ready status)
   * - Action buttons (Ready toggle, Start game)
   */
  const renderLobby = () => {
    if (!room) {
      return (
        <div className="arena-card">
          <div className="arena-empty">
            <i className="fi fi-rr-spinner"></i> Đang kết nối phòng...
          </div>
          <button className="arena-btn" type="button" onClick={handleLeave}>
            <i className="fi fi-rr-exit"></i> Hủy
          </button>
        </div>
      );
    }

    const linkText = copyState === 'ok' ? 'Đã copy link!' : copyState === 'fail' ? 'Copy thất bại' : 'Copy link mời';

    return (
      <div className="arena-lobby">
        {/* ===== ROOM INFO CARD ===== */}
        <div className="arena-card arena-card-wide">
          <div className="arena-card-header">
            <h3>
              <i className="fi fi-rr-swords"></i> Lobby: {room.name}
            </h3>
            <p>
              <span className="arena-pill"><i className="fi fi-rr-key"></i> {room.id}</span>
              <span className="arena-pill"><i className="fi fi-rr-triangle"></i> Tháp Hà Nội</span>
              <span className="arena-pill"><i className="fi fi-rr-layer-group"></i> {room.settings.hanoiDisks} đĩa</span>
              <span className="arena-pill"><i className="fi fi-rr-users"></i> {playerList.length}/{room.maxPlayers}</span>
            </p>
          </div>

          <div className="arena-lobby-actions">
            <button className="arena-btn" onClick={handleCopyLink} type="button">
              <i className="fi fi-rr-link"></i> {linkText}
            </button>
            <button className="arena-btn danger" onClick={handleLeave} type="button">
              <i className="fi fi-rr-exit"></i> Rời phòng
            </button>
          </div>
        </div>

        {/* ===== PLAYER LIST CARD ===== */}
        <div className="arena-card arena-card-wide">
          <div className="arena-card-header">
            <h3><i className="fi fi-rr-users"></i> Người chơi</h3>
            <p>Ready để host bắt đầu. Heartbeat giúp hiển thị online/offline.</p>
          </div>

          <div className="arena-players">
            {playerList.map((p) => {
              // Check online: lastSeen trong 6s
              const online = nowTick - p.lastSeen <= onlineCutoff;
              return (
                <div key={p.id} className="arena-player-row">
                  <div className="arena-player-left">
                    {/* Online indicator dot */}
                    <div className={`arena-dot ${online ? 'on' : 'off'}`} />
                    <div className="arena-player-name">
                      {p.name} {p.isHost ? '(Host)' : ''}
                      {p.id === self.id ? ' (Bạn)' : ''}
                    </div>
                  </div>
                  <div className="arena-player-right">
                    <span className={`arena-badge ${p.ready ? 'ready' : ''}`}>
                      {p.ready ? 'READY' : 'WAIT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== LOBBY CONTROLS ===== */}
          <div className="arena-lobby-controls">
            <button
              className={`arena-btn ${myPlayer?.ready ? 'primary' : ''}`}
              type="button"
              onClick={() => setReady(!myPlayer?.ready)}
            >
              <i className="fi fi-rr-check"></i> {myPlayer?.ready ? 'Bỏ sẵn sàng' : 'Sẵn sàng'}
            </button>

            <button className="arena-btn primary" type="button" onClick={startGame} disabled={!canStart}>
              <i className="fi fi-rr-play"></i> Host bắt đầu
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * renderGame - Render view khi đang chơi
   *
   * STRUCTURE:
   * - Left: HanoiGame component
   * - Right: Live scoreboard
   *
   * SCOREBOARD SORTING:
   * 1. Completed players first
   * 2. Then by fewer moves
   */
  const renderGame = () => {
    if (!room) return null;

    // Sort players: completed first, then by moves (ascending)
    const sorted = [...playerList].sort((a, b) => {
      const aDone = a.hanoi?.completed ? 1 : 0;
      const bDone = b.hanoi?.completed ? 1 : 0;
      if (aDone !== bDone) return bDone - aDone; // Completed first
      const aMoves = a.hanoi?.moves ?? 0;
      const bMoves = b.hanoi?.moves ?? 0;
      return aMoves - bMoves; // Fewer moves better
    });

    // Get game title based on gameId
    const gameTitle = {
      hanoi: 'Tháp Hà Nội (Race)',
      maze: 'Maze Race (BFS)',
      flood: 'Flood Fill Battle',
      island: 'Island Counter (DFS)'
    }[room.gameId] || 'Game';

    // Render the appropriate game component
    const renderGameComponent = () => {
      switch (room.gameId) {
        case 'hanoi':
          return (
            <HanoiGame
              disks={room.settings.hanoiDisks}
              startedAt={gameStartedAt}
              onProgress={updateHanoiProgress}
            />
          );
        case 'maze':
          return (
            <MazeGame
              rows={room.settings.gridRows || 15}
              cols={room.settings.gridCols || 15}
              startedAt={gameStartedAt ?? undefined}
              onProgress={(p) => updateMazeProgress({
                position: p.position,
                moves: p.moves,
                completed: p.completed,
                finishedAt: p.completedAt || null
              })}
              onComplete={(r) => updateMazeProgress({
                position: { row: 0, col: 0 },
                moves: r.moves,
                completed: true,
                finishedAt: Date.now()
              })}
            />
          );
        case 'flood':
          return (
            <FloodFillGame
              rows={room.settings.gridRows || 10}
              cols={room.settings.gridCols || 10}
              playerCount={playerList.length}
              startedAt={gameStartedAt ?? undefined}
              onProgress={(p) => updateFloodProgress({
                scores: p.scores,
                currentPlayer: p.currentPlayer,
                completed: p.completed,
                finishedAt: null
              })}
              onComplete={(r) => updateFloodProgress({
                scores: r.scores,
                currentPlayer: r.winner,
                completed: true,
                finishedAt: Date.now()
              })}
            />
          );
        case 'island':
          return (
            <IslandGame
              rows={room.settings.gridRows || 10}
              cols={room.settings.gridCols || 10}
              startedAt={gameStartedAt ?? undefined}
              onProgress={(p) => updateIslandProgress({
                markedIslands: p.markedIslands,
                answer: p.answer ?? null,
                correct: p.correct ?? null,
                finishedAt: null
              })}
              onComplete={(r) => updateIslandProgress({
                markedIslands: r.markedIslands,
                answer: r.answer,
                correct: r.correct,
                finishedAt: Date.now()
              })}
            />
          );
        default:
          return <div>Game không hợp lệ</div>;
      }
    };

    return (
      <div className="arena-game">
        {/* ===== GAME AREA (LEFT) ===== */}
        <div className="arena-game-left">
          <div className="arena-card arena-card-wide">
            <div className="arena-card-header">
              <h3><i className="fi fi-rr-gamepad"></i> {gameTitle}</h3>
              <p>Mỗi người giải riêng, bảng điểm cập nhật theo progress broadcast.</p>
            </div>
            {renderGameComponent()}
          </div>
        </div>

        {/* ===== SCOREBOARD (RIGHT) ===== */}
        <div className="arena-game-right">
          <div className="arena-card">
            <div className="arena-card-header">
              <h3><i className="fi fi-rr-trophy"></i> Bảng điểm</h3>
              <p>Ưu tiên người hoàn thành, sau đó ít bước hơn.</p>
            </div>

            <div className="arena-scoreboard">
              {sorted.map((p) => (
                <div key={p.id} className="arena-score-row">
                  <div className="arena-score-name">
                    {p.name}
                    {p.id === self.id ? ' (Bạn)' : ''}
                  </div>
                  <div className="arena-score-meta">
                    {room.gameId === 'hanoi' && (
                      <>
                        <span className={`arena-badge ${p.hanoi?.completed ? 'ready' : ''}`}>
                          {p.hanoi?.completed ? 'DONE' : 'PLAY'}
                        </span>
                        <span className="arena-score-moves">{p.hanoi?.moves ?? 0} bước</span>
                      </>
                    )}
                    {room.gameId === 'maze' && (
                      <>
                        <span className={`arena-badge ${p.maze?.completed ? 'ready' : ''}`}>
                          {p.maze?.completed ? 'DONE' : 'PLAY'}
                        </span>
                        <span className="arena-score-moves">{p.maze?.moves ?? 0} bước</span>
                      </>
                    )}
                    {room.gameId === 'flood' && (
                      <>
                        <span className={`arena-badge ${p.flood?.completed ? 'ready' : ''}`}>
                          {p.flood?.completed ? 'DONE' : 'PLAY'}
                        </span>
                        <span className="arena-score-moves">{p.flood?.scores?.[0] ?? 0} ô</span>
                      </>
                    )}
                    {room.gameId === 'island' && (
                      <>
                        <span className={`arena-badge ${p.island?.correct ? 'ready' : p.island?.answer !== null ? 'not-ready' : ''}`}>
                          {p.island?.correct ? 'CORRECT' : p.island?.answer !== null ? 'WRONG' : 'PLAY'}
                        </span>
                        <span className="arena-score-moves">{p.island?.markedIslands ?? 0} đảo</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="arena-lobby-actions">
              <button className="arena-btn danger" onClick={handleLeave} type="button">
                <i className="fi fi-rr-exit"></i> Rời phòng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================================
     MAIN RENDER - Render chính
     ========================================================================= */

  return (
    <div className="arena-page">
      {/* ===== TOP BAR ===== */}
      <div className="arena-topbar">
        <div className="arena-brand">
          <div className="arena-brand-title">
            <i className="fi fi-rr-swords"></i> Đấu Trường
          </div>
          <div className="arena-brand-sub">Multiplayer Arena (Room-based)</div>
        </div>

        <div className="arena-topbar-actions">
          <button className="arena-btn" onClick={() => setScene(GameScene.HUB_WORLD)} type="button">
            <i className="fi fi-rr-angle-left"></i> Về Menu
          </button>
        </div>
      </div>

      {/* ===== ANIMATED VIEW SWITCHER ===== */}
      <AnimatePresence mode="wait">
        {/* Disconnected View */}
        {status === 'disconnected' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderDisconnected()}
          </motion.div>
        )}

        {/* Lobby View */}
        {status === 'connected' && gamePhase === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderLobby()}
          </motion.div>
        )}

        {/* Game View */}
        {status === 'connected' && gamePhase === 'in_game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

