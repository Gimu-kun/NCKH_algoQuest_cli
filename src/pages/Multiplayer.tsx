/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MULTIPLAYER PAGE - TRANG CHƠI NHIỀU NGƯỜI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ CHỨC NĂNG (Functional Description):
 * ─────────────────────────────────────────────────────────────────────────────
 * Trang chính cho chế độ multiplayer, bao gồm:
 * - Room lobby: Tạo/tham gia phòng
 * - Waiting room: Chờ người chơi và chuẩn bị
 * - Game arena: Chơi game với nhiều người
 * - Scoreboard: Xem kết quả và xếp hạng
 *
 * FLOW NGƯỜI DÙNG (User Flow):
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Vào trang Multiplayer
 * 2. Chọn "Tạo phòng" hoặc "Tham gia phòng"
 * 3. Nếu tạo: Chọn game, config, đợi người khác join
 * 4. Nếu join: Nhập room code, đợi host start
 * 5. Tất cả ready → Host start game
 * 6. Chơi game, xem progress của người khác real-time
 * 7. Kết thúc → Xem bảng xếp hạng
 *
 * @component MultiplayerPage
 * @category Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useEffect, useState } from 'react';
import { useMultiplayerStore, GameType, RoomState } from '../store/multiplayerStore';
import { HanoiGame } from '../components/games/hanoi/HanoiGame';
import { MazeGame } from '../components/games/grid/MazeGame';
import { FloodFillGame } from '../components/games/grid/FloodFillGame';
import { IslandGame } from '../components/games/grid/IslandGame';
import { SortingGame } from '../components/games/sorting/SortingGame';
import { PathfindingGame } from '../components/games/grid/PathfindingGame';
import { BinarySearchGame } from '../components/games/search/BinarySearchGame';
import './Multiplayer.css';

/**
 * MultiplayerPage - Component chính
 */
export const MultiplayerPage: React.FC = () => {
    const {
        currentRoom,
        myPlayerId,
        gameProgress,
        connected,
        worker,
        initWorker,
        createRoom,
        joinRoom,
        leaveRoom,
        setReady,
        startGame,
        updateProgress
    } = useMultiplayerStore();

    // Local UI state
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [playerName, setPlayerName] = useState('Player');
    const [selectedGame, setSelectedGame] = useState<GameType>(GameType.HANOI);
    const [hanoiDisks, setHanoiDisks] = useState(3);
    const [gameStartedAt, setGameStartedAt] = useState<number | null>(null);

    // Init worker khi mount và cleanup stale state
    useEffect(() => {
        // Fix: Nếu có stale room state (do persist) mà chưa kết nối, reset lại về Lobby
        // để tránh kẹt ở màn hình game mà không có worker.
        if (currentRoom && !connected) {
            leaveRoom();
        }

        initWorker();

        return () => {
            // Cleanup khi unmount
            // Note: Chúng ta leaveRoom khi unmount để đảm bảo tính nhất quán
            // Nếu muốn giữ room khi navigate, cần logic Reconnect phức tạp hơn.
            if (currentRoom) {
                leaveRoom();
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle game start
    useEffect(() => {
        if (currentRoom?.state === RoomState.PLAYING && !gameStartedAt) {
            setGameStartedAt(Date.now());
        }
    }, [currentRoom?.state, gameStartedAt]);

    /**
     * handleCreateRoom - Xử lý tạo phòng
     */
    const handleCreateRoom = () => {
        if (!roomName.trim()) {
            alert('Vui lòng nhập tên phòng!');
            return;
        }

        const config = {
            disks: hanoiDisks
        };

        createRoom(roomName, selectedGame, config);
    };

    /**
     * handleJoinRoom - Xử lý tham gia phòng
     */
    const handleJoinRoom = () => {
        if (!roomCode.trim() || roomCode.length !== 6) {
            alert('Vui lòng nhập mã phòng hợp lệ (6 ký tự)!');
            return;
        }

        if (!playerName.trim()) {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }

        joinRoom(roomCode.toUpperCase(), playerName);
    };

    /**
     * handleGameProgress - Callback từ game component
     */
    /**
     * handleGameUpdates - Generic handler for game updates
     */
    const handleGameUpdate = (data: {
        moves?: number;
        completed?: boolean;
        finishedAt?: number;
        encoding?: unknown;
        // Grid game specifics
        position?: unknown;
        scores?: number[];
        grid?: unknown;
    }) => {
        updateProgress({
            playerId: myPlayerId!,
            moves: data.moves || 0,
            timeElapsed: gameStartedAt ? Date.now() - gameStartedAt : 0,
            completed: data.completed || false,
            finishedAt: data.finishedAt || (data.completed ? Date.now() : null),
            gameState: data.encoding || data.position || data.grid || data.scores
        });
    };

    /**
     * renderLobby - Render lobby (chưa vào phòng)
     */
    const renderLobby = () => (
        <div className="multiplayer-lobby">
            <div className="lobby-header">
                <h1>
                    <i className="fi fi-rr-users-alt"></i>
                    Chế độ Nhiều Người Chơi
                </h1>
                <p className="lobby-subtitle">
                    Thách đấu với bạn bè trong các trò chơi thuật toán!
                </p>
            </div>

            <div className="lobby-content">
                {/* Create Room Section */}
                <div className="lobby-section">
                    <div className="section-header">
                        <i className="fi fi-rr-plus-hexagon"></i>
                        <h2>Tạo Phòng Mới</h2>
                    </div>

                    <div className="form-group">
                        <label>Tên Phòng</label>
                        <input
                            type="text"
                            placeholder="Phòng của tôi"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label>Trò Chơi</label>
                        <select
                            value={selectedGame}
                            onChange={(e) => setSelectedGame(e.target.value as GameType)}
                        >
                            <option value={GameType.HANOI}>Tháp Hà Nội</option>
                            <option value={GameType.MAZE}>Mê Cung (Maze Race)</option>
                            <option value={GameType.ISLAND}>Đếm Đảo (Island Counter)</option>
                            <option value={GameType.FLOOD_FILL}>Tô Màu (Flood Fill)</option>
                            <option value={GameType.SORTING}>Sắp Xếp (Sorting Race)</option>
                            <option value={GameType.PATHFINDING}>Tìm Đường (Pathfinding)</option>
                            <option value={GameType.BINARY_SEARCH}>Đoán Số (Binary Search)</option>
                        </select>
                    </div>

                    {selectedGame === GameType.HANOI && (
                        <div className="form-group">
                            <label>Số Đĩa: {hanoiDisks}</label>
                            <input
                                type="range"
                                min="3"
                                max="8"
                                value={hanoiDisks}
                                onChange={(e) => setHanoiDisks(parseInt(e.target.value))}
                            />
                            <div className="range-labels">
                                <span>Dễ (3)</span>
                                <span>Khó (8)</span>
                            </div>
                        </div>
                    )}

                    {(selectedGame === GameType.MAZE || selectedGame === GameType.ISLAND || selectedGame === GameType.FLOOD_FILL) && (
                        <div className="form-info">
                            <i className="fi fi-rr-info"></i>
                            Kích thước mặc định: 15x25
                        </div>
                    )}

                    <button className="btn-primary" onClick={handleCreateRoom}>
                        <i className="fi fi-rr-rocket-launch"></i>
                        Tạo Phòng
                    </button>
                </div>

                {/* Join Room Section */}
                <div className="lobby-section">
                    <div className="section-header">
                        <i className="fi fi-rr-sign-in-alt"></i>
                        <h2>Tham Gia Phòng</h2>
                    </div>

                    <div className="form-group">
                        <label>Tên Của Bạn</label>
                        <input
                            type="text"
                            placeholder="Player 1"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={20}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mã Phòng</label>
                        <input
                            type="text"
                            placeholder="ABC123"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            maxLength={6}
                            style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}
                        />
                    </div>

                    <button className="btn-secondary" onClick={handleJoinRoom}>
                        <i className="fi fi-rr-arrow-right"></i>
                        Tham Gia
                    </button>
                </div>
            </div>

            {/* Connection Status */}
            <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
                <i className={`fi ${connected ? 'fi-rr-wifi' : 'fi-rr-wifi-slash'}`}></i>
                {connected
                    ? 'Đã kết nối'
                    : worker
                        ? 'Đang kết nối...'
                        : 'Chưa kết nối (Offline mode)'
                }
            </div>
        </div>
    );

    /**
     * renderWaitingRoom - Render phòng chờ
     */
    const renderWaitingRoom = () => {
        if (!currentRoom || !myPlayerId) return null;

        const myPlayer = currentRoom.players.find(p => p.id === myPlayerId);
        const isHost = myPlayer?.isHost || false;
        const allReady = currentRoom.players.every(p => p.isReady || p.isHost);

        return (
            <div className="waiting-room">
                <div className="room-header">
                    <div className="room-info">
                        <h1>{currentRoom.name}</h1>
                        <div className="room-code">
                            <span>Mã phòng:</span>
                            <code>{currentRoom.id}</code>
                            <button
                                className="btn-copy"
                                onClick={() => {
                                    navigator.clipboard.writeText(currentRoom.id);
                                    alert('Đã copy mã phòng!');
                                }}
                            >
                                <i className="fi fi-rr-copy"></i>
                            </button>
                        </div>
                    </div>

                    <button className="btn-leave" onClick={leaveRoom}>
                        <i className="fi fi-rr-exit"></i>
                        Rời Phòng
                    </button>
                </div>

                <div className="room-content">
                    {/* Players List */}
                    <div className="players-section">
                        <h2>
                            <i className="fi fi-rr-users"></i>
                            Người Chơi ({currentRoom.players.length}/{currentRoom.maxPlayers})
                        </h2>

                        <div className="players-list">
                            {currentRoom.players.map((player) => (
                                <div
                                    key={player.id}
                                    className={`player-card ${player.isReady ? 'ready' : ''} ${player.isHost ? 'host' : ''}`}
                                >
                                    <div className="player-avatar">
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="player-info">
                                        <div className="player-name">
                                            {player.name}
                                            {player.isHost && (
                                                <span className="host-badge">
                                                    <i className="fi fi-rr-crown"></i>
                                                    Host
                                                </span>
                                            )}
                                        </div>
                                        <div className="player-status">
                                            {player.isHost ? (
                                                <span className="status-host">Chủ phòng</span>
                                            ) : player.isReady ? (
                                                <span className="status-ready">
                                                    <i className="fi fi-rr-check"></i>
                                                    Sẵn sàng
                                                </span>
                                            ) : (
                                                <span className="status-waiting">Đang chờ...</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Game Info */}
                    <div className="game-info-section">
                        <h2>
                            <i className="fi fi-rr-gamepad"></i>
                            Thông Tin Game
                        </h2>

                        <div className="game-details">
                            <div className="detail-item">
                                <span className="detail-label">Trò chơi:</span>
                                <span className="detail-value">
                                    {currentRoom.gameType === GameType.HANOI && 'Tháp Hà Nội'}
                                </span>
                            </div>

                            {currentRoom.gameType === GameType.HANOI && (
                                <div className="detail-item">
                                    <span className="detail-label">Số đĩa:</span>
                                    <span className="detail-value">
                                        {currentRoom.gameConfig.disks as number} đĩa
                                    </span>
                                </div>
                            )}

                            <div className="detail-item">
                                <span className="detail-label">Mục tiêu:</span>
                                <span className="detail-value">
                                    Hoàn thành nhanh nhất với ít bước nhất
                                </span>
                            </div>
                        </div>

                        {/* Ready Button */}
                        {!isHost && (
                            <button
                                className={`btn-ready ${myPlayer?.isReady ? 'active' : ''}`}
                                onClick={() => setReady(!myPlayer?.isReady)}
                            >
                                <i className={`fi ${myPlayer?.isReady ? 'fi-rr-cross' : 'fi-rr-check'}`}></i>
                                {myPlayer?.isReady ? 'Hủy Sẵn Sàng' : 'Sẵn Sàng'}
                            </button>
                        )}

                        {/* Start Button (Host only) */}
                        {isHost && (
                            <button
                                className="btn-start"
                                onClick={startGame}
                                disabled={!allReady}
                            >
                                <i className="fi fi-rr-play"></i>
                                {allReady ? 'Bắt Đầu Game' : 'Chờ người chơi sẵn sàng...'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    /**
     * renderGameArena - Render khu vực chơi game
     */
    const renderGameArena = () => {
        if (!currentRoom || !myPlayerId) return null;

        return (
            <div className="game-arena">
                <div className="arena-header">
                    <h2>{currentRoom.name}</h2>
                    <button className="btn-leave-small" onClick={leaveRoom}>
                        <i className="fi fi-rr-exit"></i>
                        Rời
                    </button>
                </div>

                <div className="arena-content">
                    {/* Main Game Area */}
                    <div className="game-area">
                        {currentRoom.gameType === GameType.HANOI && (
                            <HanoiGame
                                disks={currentRoom.gameConfig.disks as number}
                                startedAt={gameStartedAt}
                                onProgress={(p) => handleGameUpdate({
                                    moves: p.moves,
                                    completed: p.completed,
                                    finishedAt: p.finishedAt || undefined,
                                    encoding: p.encoding
                                })}
                            />
                        )}

                        {currentRoom.gameType === GameType.MAZE && (
                            <MazeGame
                                rows={15}
                                cols={25}
                                startedAt={gameStartedAt || undefined}
                                disabled={false}
                                onProgress={(p) => handleGameUpdate({
                                    moves: p.moves,
                                    completed: p.completed,
                                    finishedAt: p.completedAt,
                                    position: p.position
                                })}
                            />
                        )}

                        {currentRoom.gameType === GameType.ISLAND && (
                            <IslandGame
                                rows={15}
                                cols={25}
                                startedAt={gameStartedAt || undefined}
                                onComplete={(res) => handleGameUpdate({
                                    completed: true,
                                    moves: res.markedIslands, // Use marked islands count as "score/moves"
                                    finishedAt: Date.now()
                                })}
                            />
                            // IslandGame currently doesn't support real-time progress update
                        )}

                        {currentRoom.gameType === GameType.FLOOD_FILL && (
                            <FloodFillGame
                                rows={12}
                                cols={20}
                                playerCount={currentRoom.players.length}
                                currentPlayer={0} // TODO: Sync turns via store
                                startedAt={gameStartedAt || undefined}
                                onProgress={(p) => handleGameUpdate({
                                    scores: p.scores,
                                    grid: p.grid,
                                    completed: p.completed
                                })}
                            />
                        )}

                        {currentRoom.gameType === GameType.SORTING && (
                            <SortingGame
                                size={10}
                                maxValue={50}
                                startedAt={gameStartedAt || undefined}
                                onProgress={(p) => handleGameUpdate({
                                    moves: p.swaps,
                                    completed: p.completed,
                                    finishedAt: p.finishedAt || undefined,
                                    encoding: p.array // Store array state as "encoding"
                                })}
                            />
                        )}

                        {currentRoom.gameType === GameType.PATHFINDING && (
                            <PathfindingGame
                                rows={10}
                                cols={10}
                                startedAt={gameStartedAt || undefined}
                                onProgress={(p) => handleGameUpdate({
                                    moves: p.cost, // Use cost as "moves"
                                    completed: p.completed,
                                    finishedAt: p.finishedAt || undefined,
                                    position: p.position
                                })}
                            />
                        )}

                        {currentRoom.gameType === GameType.BINARY_SEARCH && (
                            <BinarySearchGame
                                min={1}
                                max={100}
                                startedAt={gameStartedAt || undefined}
                                onProgress={(p) => handleGameUpdate({
                                    moves: p.guesses,
                                    completed: p.completed,
                                    finishedAt: p.finishedAt || undefined,
                                    encoding: p.range // Use range as encoding
                                })}
                            />
                        )}
                    </div>

                    {/* Scoreboard */}
                    <div className="scoreboard">
                        <h3>
                            <i className="fi fi-rr-trophy"></i>
                            Bảng Xếp Hạng
                        </h3>

                        <div className="scoreboard-list">
                            {currentRoom.players
                                .map((player) => {
                                    const progress = gameProgress.get(player.id);
                                    return {
                                        player,
                                        progress: progress || {
                                            playerId: player.id,
                                            moves: 0,
                                            timeElapsed: 0,
                                            completed: false,
                                            finishedAt: null,
                                            gameState: null
                                        }
                                    };
                                })
                                .sort((a, b) => {
                                    // Completed first
                                    if (a.progress.completed && !b.progress.completed) return -1;
                                    if (!a.progress.completed && b.progress.completed) return 1;

                                    // Then by time
                                    if (a.progress.completed && b.progress.completed) {
                                        return (a.progress.finishedAt || 0) - (b.progress.finishedAt || 0);
                                    }

                                    // Then by moves
                                    return b.progress.moves - a.progress.moves;
                                })
                                .map((item, index) => (
                                    <div
                                        key={item.player.id}
                                        className={`score-item ${item.player.id === myPlayerId ? 'me' : ''} ${item.progress.completed ? 'completed' : ''}`}
                                    >
                                        <div className="rank">#{index + 1}</div>
                                        <div className="player-name-score">
                                            {item.player.name}
                                            {item.player.id === myPlayerId && <span className="me-badge">(Bạn)</span>}
                                        </div>
                                        <div className="stats">
                                            <span className="moves">
                                                <i className="fi fi-rr-arrows-repeat"></i>
                                                {item.progress.moves}
                                            </span>
                                            {item.progress.completed && (
                                                <span className="completed-badge">
                                                    <i className="fi fi-rr-check-circle"></i>
                                                    Hoàn thành
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Main render logic
    if (!currentRoom) {
        return renderLobby();
    }

    if (currentRoom.state === RoomState.WAITING) {
        return renderWaitingRoom();
    }

    if (currentRoom.state === RoomState.PLAYING) {
        return renderGameArena();
    }

    return null;
};

export default MultiplayerPage;
