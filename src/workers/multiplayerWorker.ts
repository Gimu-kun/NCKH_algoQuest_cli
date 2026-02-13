/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MULTIPLAYER WORKER - WebWorker cho kết nối low-latency
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ (Description):
 * WebWorker chạy trong thread riêng, không block UI. Quản lý:
 * - BroadcastChannel connection
 * - Heartbeat loop (500ms)
 * - Message buffering khi busy
 *
 * TẠI SAO DÙNG WORKER? (Why Worker?)
 * - Main thread bận render UI → heartbeat bị delay
 * - Tab inactive → browser throttle setInterval
 * - Worker thread không bị throttle nhiều
 *
 * SO SÁNH (Comparison):
 * ┌─────────────────┬──────────────┬──────────────────┐
 * │ Approach        │ UI Blocking  │ Tab Inactive     │
 * ├─────────────────┼──────────────┼──────────────────┤
 * │ Main Thread     │ ❌ Yes       │ ❌ Throttled     │
 * │ Web Worker      │ ✅ No        │ ⚠️ Less throttle │
 * │ SharedWorker    │ ✅ No        │ ✅ Persists      │
 * └─────────────────┴──────────────┴──────────────────┘
 *
 * MESSAGE PROTOCOL:
 * Main → Worker:
 *   { type: 'INIT', roomId, playerId }
 *   { type: 'SEND', message: RoomMessage }
 *   { type: 'STOP' }
 *
 * Worker → Main:
 *   { type: 'RECEIVED', message: RoomMessage }
 *   { type: 'HEARTBEAT_SENT' }
 *   { type: 'ERROR', error: string }
 *
 * @module multiplayerWorker
 * @category Workers/Multiplayer
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ============================================================================
// TYPES - Định nghĩa message types
// ============================================================================

/**
 * Message từ Main Thread → Worker
 */
type MainToWorkerMessage =
    | { type: 'INIT'; roomId: string; playerId: string; channelName: string }
    | { type: 'SEND'; message: unknown }
    | { type: 'STOP' };

/**
 * Message từ Worker → Main Thread
 */
type WorkerToMainMessage =
    | { type: 'RECEIVED'; message: unknown }
    | { type: 'HEARTBEAT_SENT'; timestamp: number }
    | { type: 'CONNECTED'; channelName: string }
    | { type: 'DISCONNECTED' }
    | { type: 'ERROR'; error: string };

// ============================================================================
// STATE - Trạng thái của Worker
// ============================================================================

/**
 * Channel instance - null khi chưa init
 */
let channel: BroadcastChannel | null = null;

/**
 * Heartbeat interval ID
 */
let heartbeatInterval: number | null = null;

/**
 * Room và Player info
 */
let currentRoomId: string | null = null;
let currentPlayerId: string | null = null;

/**
 * Message buffer - queue messages khi channel busy
 *
 * KỸ THUẬT (Technique):
 * - Khi channel đang gửi, buffer message mới
 * - Flush buffer sau mỗi 50ms
 * - Tránh mất message khi burst
 */
const messageBuffer: unknown[] = [];
let isProcessingBuffer = false;

// ============================================================================
// HEARTBEAT - Giữ kết nối
// ============================================================================

/**
 * HEARTBEAT_INTERVAL_MS - Khoảng cách giữa các heartbeat
 *
 * TẠI SAO 500ms? (Why 500ms?)
 * - Quá nhanh (100ms): tốn bandwidth, spam channel
 * - Quá chậm (2000ms): detect disconnect chậm
 * - 500ms: cân bằng giữa responsiveness và efficiency
 */
const HEARTBEAT_INTERVAL_MS = 500;

/**
 * startHeartbeat - Bắt đầu gửi heartbeat định kỳ
 *
 * FLOW:
 * 1. Clear interval cũ (nếu có)
 * 2. Tạo interval mới
 * 3. Mỗi 500ms gửi PING message
 * 4. Thông báo main thread
 */
function startHeartbeat(): void {
    // Clear existing interval
    if (heartbeatInterval !== null) {
        clearInterval(heartbeatInterval);
    }

    heartbeatInterval = self.setInterval(() => {
        if (!channel || !currentRoomId || !currentPlayerId) return;

        const pingMessage = {
            type: 'PING',
            roomId: currentRoomId,
            playerId: currentPlayerId,
            sentAt: Date.now(),
        };

        try {
            channel.postMessage(pingMessage);

            // Notify main thread
            const response: WorkerToMainMessage = {
                type: 'HEARTBEAT_SENT',
                timestamp: Date.now(),
            };
            self.postMessage(response);
        } catch (err) {
            const errorResponse: WorkerToMainMessage = {
                type: 'ERROR',
                error: `Heartbeat failed: ${err}`,
            };
            self.postMessage(errorResponse);
        }
    }, HEARTBEAT_INTERVAL_MS);
}

/**
 * stopHeartbeat - Dừng heartbeat loop
 */
function stopHeartbeat(): void {
    if (heartbeatInterval !== null) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

// ============================================================================
// MESSAGE BUFFER - Xử lý message queue
// ============================================================================

/**
 * flushBuffer - Gửi tất cả messages trong buffer
 *
 * KỸ THUẬT (Technique):
 * - Process từng message
 * - Không block nếu đang process
 * - Clear buffer sau khi xong
 */
function flushBuffer(): void {
    if (isProcessingBuffer || !channel) return;
    if (messageBuffer.length === 0) return;

    isProcessingBuffer = true;

    while (messageBuffer.length > 0) {
        const msg = messageBuffer.shift();
        if (msg) {
            try {
                channel.postMessage(msg);
            } catch (err) {
                console.error('[Worker] Failed to send buffered message:', err);
            }
        }
    }

    isProcessingBuffer = false;
}

/**
 * scheduleBufferFlush - Đặt lịch flush buffer
 */
function scheduleBufferFlush(): void {
    self.setTimeout(flushBuffer, 50);
}

// ============================================================================
// CHANNEL MANAGEMENT - Quản lý BroadcastChannel
// ============================================================================

/**
 * initChannel - Khởi tạo BroadcastChannel
 *
 * FLOW:
 * 1. Close channel cũ (nếu có)
 * 2. Tạo channel mới với tên được chỉ định
 * 3. Setup onmessage handler
 * 4. Bắt đầu heartbeat
 * 5. Thông báo main thread
 *
 * @param channelName - Tên channel (thường là 'arena-{roomId}')
 * @param roomId - ID của room
 * @param playerId - ID của player
 */
function initChannel(channelName: string, roomId: string, playerId: string): void {
    // Close existing channel
    if (channel) {
        channel.close();
    }

    // Store info
    currentRoomId = roomId;
    currentPlayerId = playerId;

    try {
        // Create new channel
        channel = new BroadcastChannel(channelName);

        // Handle incoming messages
        channel.onmessage = (event: MessageEvent) => {
            const response: WorkerToMainMessage = {
                type: 'RECEIVED',
                message: event.data,
            };
            self.postMessage(response);
        };

        // Start heartbeat
        startHeartbeat();

        // Notify main thread
        const response: WorkerToMainMessage = {
            type: 'CONNECTED',
            channelName,
        };
        self.postMessage(response);
    } catch (err) {
        const errorResponse: WorkerToMainMessage = {
            type: 'ERROR',
            error: `Failed to init channel: ${err}`,
        };
        self.postMessage(errorResponse);
    }
}

/**
 * closeChannel - Đóng channel và cleanup
 */
function closeChannel(): void {
    stopHeartbeat();

    if (channel) {
        channel.close();
        channel = null;
    }

    currentRoomId = null;
    currentPlayerId = null;
    messageBuffer.length = 0;

    const response: WorkerToMainMessage = {
        type: 'DISCONNECTED',
    };
    self.postMessage(response);
}

/**
 * sendMessage - Gửi message qua channel
 *
 * @param message - Message để gửi
 */
function sendMessage(message: unknown): void {
    if (!channel) {
        // Buffer message if channel not ready
        messageBuffer.push(message);
        scheduleBufferFlush();
        return;
    }

    try {
        channel.postMessage(message);
    } catch (err) {
        // Buffer on error
        messageBuffer.push(message);
        scheduleBufferFlush();
    }
}

// ============================================================================
// MESSAGE HANDLER - Xử lý messages từ Main Thread
// ============================================================================

/**
 * onmessage - Handler cho messages từ Main Thread
 *
 * FLOW:
 * 1. Parse message type
 * 2. Route đến handler tương ứng
 * 3. Respond nếu cần
 */
self.onmessage = (event: MessageEvent<MainToWorkerMessage>) => {
    const { data } = event;

    switch (data.type) {
        case 'INIT':
            initChannel(data.channelName, data.roomId, data.playerId);
            break;

        case 'SEND':
            sendMessage(data.message);
            break;

        case 'STOP':
            closeChannel();
            break;

        default:
            console.warn('[Worker] Unknown message type:', data);
    }
};

// ============================================================================
// EXPORT (for TypeScript module)
// ============================================================================
export { };
