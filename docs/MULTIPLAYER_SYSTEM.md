# HỆ THỐNG MULTIPLAYER - THÁP HÀ NỘI

## 📋 TỔNG QUAN

Hệ thống multiplayer cho phép nhiều người chơi cùng tham gia các trò chơi thuật toán trong thời gian thực. Phiên bản đầu tiên tập trung vào **Tháp Hà Nội** với khả năng tạo phòng, tham gia phòng, và thi đấu real-time.

---

## 🏗️ KIẾN TRÚC TỔNG QUAN

### 1. **Các Thành Phần Chính**

```
┌─────────────────────────────────────────────────────────────┐
│                    MULTIPLAYER SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐     ┌──────────────┐  │
│  │ Multiplayer  │───▶│ Web Worker   │───▶│ Broadcast    │  │
│  │ Store        │    │ (Thread)     │     │ Channel      │  │
│  │ (Zustand)    │    │              │     │ (Real-time)  │  │
│  └──────────────┘    └──────────────┘     └──────────────┘  │
│         │                                         │         │
│         │                                         │         │
│         ▼                                         ▼         │
│  ┌──────────────┐                        ┌──────────────┐   │
│  │ UI Layer     │                        │ Other Tabs/  │   │
│  │ - Lobby      │                        │ Players      │   │
│  │ - Waiting    │                        │              │   │
│  │ - Game Arena │                        │              │   │
│  └──────────────┘                        └──────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Luồng Dữ Liệu (Data Flow)**

```
User Action
    │
    ▼
UI Component (React)
    │
    ▼
Multiplayer Store (Zustand)
    │
    ├──▶ Local State Update (Optimistic)
    │
    └──▶ Web Worker
            │
            ▼
        Broadcast Channel
            │
            ├──▶ Same Tab (Echo)
            │
            └──▶ Other Tabs/Players
                    │
                    ▼
                Worker receives
                    │
                    ▼
                Store updates
                    │
                    ▼
                UI re-renders
```

---

## 🔧 THÀNH PHẦN KỸ THUẬT

### 1. **Multiplayer Store** (`multiplayerStore.ts`)

**Chức năng:**
- Quản lý state của room, players, game progress
- Xử lý logic tạo/join/leave room
- Đồng bộ state giữa các players
- Giao tiếp với Web Worker

**Kỹ thuật sử dụng:**
- **Zustand**: State management nhẹ, reactive
- **Persist Middleware**: Lưu state vào localStorage
- **Message Protocol**: Chuẩn hóa format messages

**State chính:**
```typescript
interface MultiplayerState {
    connected: boolean;
    worker: Worker | null;
    currentRoom: RoomInfo | null;
    myPlayerId: string | null;
    gameProgress: Map<string, GameProgress>;
}
```

**Actions chính:**
```typescript
- initWorker(): Khởi tạo Web Worker
- createRoom(): Tạo phòng mới
- joinRoom(): Tham gia phòng
- leaveRoom(): Rời phòng
- setReady(): Đánh dấu sẵn sàng
- startGame(): Bắt đầu game (host only)
- updateProgress(): Cập nhật tiến trình
```

### 2. **Web Worker** (`multiplayerWorker.ts`)

**Tại sao dùng Worker?**
- Main thread bận render UI → heartbeat bị delay
- Tab inactive → browser throttle setInterval
- Worker thread không bị throttle nhiều

**Chức năng:**
- Chạy trong thread riêng, không block UI
- Quản lý BroadcastChannel connection
- Heartbeat loop (500ms) để maintain connection
- Message buffering khi busy

**Message Protocol:**
```typescript
Main → Worker:
  { type: 'INIT', roomId, playerId, channelName }
  { type: 'SEND', message: RoomMessage }
  { type: 'STOP' }

Worker → Main:
  { type: 'RECEIVED', message: RoomMessage }
  { type: 'HEARTBEAT_SENT', timestamp }
  { type: 'CONNECTED', channelName }
  { type: 'ERROR', error }
```

### 3. **BroadcastChannel API**

**Ưu điểm:**
- ✅ Không cần backend server
- ✅ Latency thấp (local communication)
- ✅ Dễ implement
- ✅ Phù hợp cho local multiplayer

**Nhược điểm:**
- ❌ Chỉ same-origin (cùng domain)
- ❌ Không cross-device (khác mạng)
- ❌ Phụ thuộc browser support

**Khi nào dùng:**
- Local multiplayer (cùng mạng WiFi)
- Testing và development
- Classroom/workshop setting

### 4. **Room System**

**Room Info:**
```typescript
interface RoomInfo {
    id: string;              // Room code (6 ký tự)
    name: string;            // Tên phòng
    gameType: GameType;      // HANOI, SORTING, etc.
    state: RoomState;        // WAITING, PLAYING, FINISHED
    maxPlayers: number;      // Số người tối đa (4)
    players: PlayerInfo[];   // Danh sách người chơi
    hostId: string;          // ID của host
    gameConfig: object;      // Config game (số đĩa, etc.)
}
```

**Room States:**
- **WAITING**: Đang chờ người chơi join
- **PLAYING**: Đang chơi
- **FINISHED**: Đã kết thúc

---

## 🎮 FLOW NGƯỜI DÙNG

### 1. **Tạo Phòng (Create Room)**

```
1. User click "Tạo Phòng"
2. Nhập tên phòng, chọn game, config
3. Generate room code (6 ký tự)
4. Init Web Worker với room channel
5. Broadcast ROOM_CREATED message
6. Chuyển sang Waiting Room
7. Hiển thị room code cho người khác join
```

**Code:**
```typescript
createRoom(name, gameType, config) {
    const roomId = generateRoomCode();  // ABC123
    const playerId = generateId();       // UUID
    
    // Init worker
    worker.postMessage({
        type: 'INIT',
        roomId,
        playerId,
        channelName: `arena-${roomId}`
    });
    
    // Broadcast
    worker.postMessage({
        type: 'SEND',
        message: {
            type: 'ROOM_CREATED',
            roomId,
            senderId: playerId,
            payload: roomInfo
        }
    });
}
```

### 2. **Tham Gia Phòng (Join Room)**

```
1. User click "Tham Gia"
2. Nhập room code (ABC123)
3. Validate code format
4. Connect worker đến room channel
5. Broadcast PLAYER_JOINED message
6. Request STATE_SYNC từ host
7. Nhận danh sách players hiện tại
8. Sync game state
```

**Code:**
```typescript
joinRoom(roomCode, playerName) {
    const playerId = generateId();
    
    // Init worker
    worker.postMessage({
        type: 'INIT',
        roomId: roomCode,
        playerId,
        channelName: `arena-${roomCode}`
    });
    
    // Broadcast join
    worker.postMessage({
        type: 'SEND',
        message: {
            type: 'PLAYER_JOINED',
            roomId: roomCode,
            senderId: playerId,
            payload: playerInfo
        }
    });
    
    // Request sync
    worker.postMessage({
        type: 'SEND',
        message: {
            type: 'REQUEST_SYNC',
            roomId: roomCode,
            senderId: playerId
        }
    });
}
```

### 3. **Chơi Game (Game Flow)**

```
1. Tất cả players ready
2. Host click "Bắt Đầu"
3. Broadcast GAME_START
4. Chuyển sang Game Arena
5. Mỗi player chơi độc lập
6. Mỗi move → broadcast GAME_UPDATE
7. Other players nhận update
8. Scoreboard real-time update
9. First to finish → broadcast completion
10. Hiển thị kết quả cuối
```

**Sync Logic:**
```typescript
// Player makes move
handleGameProgress(progress) {
    // 1. Update local state (optimistic)
    setLocalProgress(progress);
    
    // 2. Broadcast to others
    updateProgress({
        playerId: myPlayerId,
        moves: progress.moves,
        completed: progress.completed,
        gameState: progress.encoding
    });
}

// Receive update from others
handleMessage(message) {
    if (message.type === 'GAME_UPDATE') {
        const progress = message.payload;
        // Update progress map
        gameProgress.set(progress.playerId, progress);
        // UI auto re-renders
    }
}
```

---

## 🎯 THÁP HÀ NỘI MULTIPLAYER

### **Game Rules**
- Mỗi player có bàn chơi riêng
- Cùng số đĩa, cùng config
- Mục tiêu: Hoàn thành nhanh nhất với ít bước nhất
- Real-time scoreboard

### **Scoring**
```
Rank = (Completed ? 1 : 0, FinishTime, Moves)

Sắp xếp:
1. Completed trước (true > false)
2. Finish time sớm hơn
3. Moves ít hơn
```

### **UI Components**

**Scoreboard:**
```typescript
<div className="scoreboard">
    {players
        .map(player => ({
            player,
            progress: gameProgress.get(player.id)
        }))
        .sort((a, b) => {
            // Completed first
            if (a.completed && !b.completed) return -1;
            // Then by time
            if (a.completed && b.completed) {
                return a.finishedAt - b.finishedAt;
            }
            // Then by moves
            return b.moves - a.moves;
        })
        .map((item, index) => (
            <div className="score-item">
                <div className="rank">#{index + 1}</div>
                <div className="name">{item.player.name}</div>
                <div className="stats">
                    Moves: {item.progress.moves}
                    {item.progress.completed && '✓'}
                </div>
            </div>
        ))
    }
</div>
```

---

## 🎨 THIẾT KẾ GIAO DIỆN

### **Color Palette (Sáng, Tươi)**

```css
/* Primary Colors */
--mp-primary: #06b6d4;        /* Cyan 500 */
--mp-primary-light: #22d3ee;  /* Cyan 400 */
--mp-secondary: #14b8a6;      /* Teal 500 */

/* Background (SÁNG) */
--mp-bg-primary: #f0f9ff;     /* Sky 50 */
--mp-bg-secondary: #ffffff;   /* White */
--mp-bg-tertiary: #e0f2fe;    /* Sky 100 */

/* Text */
--mp-text-primary: #0c4a6e;   /* Sky 900 */
--mp-text-secondary: #075985; /* Sky 800 */
```

### **Design Principles**
1. **Clarity**: Phân biệt rõ các sections
2. **Feedback**: Hover, active states rõ ràng
3. **Consistency**: Spacing, sizing đồng nhất
4. **Accessibility**: Contrast ratio đạt chuẩn WCAG

### **Key Features**
- Gradient backgrounds nhẹ
- Box shadows mềm mại
- Border radius lớn (16px+)
- Smooth transitions (0.2s-0.3s)
- Hover effects nổi bật

---

## 🔄 SO SÁNH VỚI CÁC GIẢI PHÁP KHÁC

| Approach              | Pros                          | Cons                        |
|-----------------------|-------------------------------|------------------------------|
| **BroadcastChannel**  | ✅ Không cần server           | ❌ Chỉ same-origin          |
| (Hiện tại)            | ✅ Rất nhanh (local)          | ❌ Không cross-device       |
|                       | ✅ Đơn giản                   |                             |
|-----------------------|-------------------------------|------------------------------|
| **WebSocket**         | ✅ Cross-device               | ❌ Cần backend server       |
|                       | ✅ Internet-wide              | ❌ Phức tạp hơn             |
|                       |                               | ❌ Latency cao hơn          |
|-----------------------|-------------------------------|------------------------------|
| **WebRTC P2P**        | ✅ Peer-to-peer               | ❌ NAT traversal khó        |
|                       | ✅ Không cần server relay     | ❌ Setup phức tạp           |
|                       |                               | ❌ Fallback cần TURN server |
|-----------------------|-------------------------------|------------------------------|
| **Firebase**          | ✅ Managed service            | ❌ Vendor lock-in           |
|                       | ✅ Offline support            | ❌ Chi phí                  |
|                       |                               | ❌ Overkill cho local game  |

---

## 🚀 HƯỚNG MỞ RỘNG

### **Phase 2: Cross-Device Support**
- Thêm WebSocket fallback
- Backend server cho relay
- Room persistence
- Reconnection logic

### **Phase 3: Advanced Features**
- Spectator mode
- Replay system
- Tournament brackets
- Leaderboards
- Chat system

### **Phase 4: More Games**
- Sorting algorithms race
- Pathfinding challenges
- Tree traversal puzzles
- Graph coloring

---

## 📝 TESTING CHECKLIST

### **Local Testing**
- [ ] Tạo phòng thành công
- [ ] Join phòng với code
- [ ] Ready/Unready toggle
- [ ] Host start game
- [ ] Game sync real-time
- [ ] Scoreboard update
- [ ] Leave room cleanup

### **Multi-Tab Testing**
- [ ] Mở 2-4 tabs
- [ ] Join cùng room
- [ ] Sync state giữa tabs
- [ ] Heartbeat maintain
- [ ] Disconnect detection

### **Edge Cases**
- [ ] Invalid room code
- [ ] Room full (max players)
- [ ] Host disconnect
- [ ] Network lag simulation
- [ ] Rapid state changes

---

## 🐛 KNOWN ISSUES & LIMITATIONS

### **Current Limitations**
1. **Same-origin only**: Không support cross-device
2. **No persistence**: Room mất khi tất cả players leave
3. **No conflict resolution**: Optimistic updates có thể conflict
4. **Browser support**: Cần BroadcastChannel API

### **Workarounds**
1. Dùng ngrok/localhost tunnel cho testing cross-device
2. Implement room timeout (auto-close sau 30 phút)
3. Add timestamp để resolve conflicts
4. Polyfill cho browsers cũ

---

## 📚 TÀI LIỆU THAM KHẢO

### **APIs Used**
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Zustand](https://github.com/pmndrs/zustand)

### **Algorithms**
- Tower of Hanoi: O(2^n) optimal moves
- BFS shortest path: O(3^n) states
- Room code generation: Base-32 encoding

---

## 🎓 KẾT LUẬN

Hệ thống multiplayer này cung cấp nền tảng vững chắc cho các trò chơi thuật toán real-time. Thiết kế tập trung vào:

1. **Simplicity**: Dễ hiểu, dễ maintain
2. **Performance**: Low latency, smooth UX
3. **Scalability**: Dễ mở rộng thêm games
4. **Aesthetics**: UI đẹp, màu sắc hài hòa

Phù hợp cho:
- Educational settings (classroom)
- Local multiplayer parties
- Algorithm learning competitions
- Coding bootcamps

Không phù hợp cho:
- Internet-wide tournaments
- Mobile cross-platform
- Large-scale competitions (>4 players)
