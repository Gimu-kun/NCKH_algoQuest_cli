/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HỆ THỐNG QUẢN LÝ ÂM THANH (Audio Manager System)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH (Purpose):
 * Quản lý tập trung toàn bộ âm thanh trong game thông qua Singleton Pattern.
 * Hỗ trợ 2 loại âm thanh chính:
 * - BGM (Background Music): Nhạc nền lặp vô hạn với fade transitions mượt mà
 * - SFX (Sound Effects): Hiệu ứng âm thanh ngắn (click, attack, notification)
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * KIẾN TRÚC HỆ THỐNG (System Architecture):
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 1. DESIGN PATTERN: Singleton Pattern
 *    - Đảm bảo chỉ có duy nhất 1 instance trong toàn bộ ứng dụng
 *    - Private constructor: Ngăn khởi tạo trực tiếp từ bên ngoài
 *    - Static getInstance(): Factory method để lấy instance duy nhất
 *    - Lợi ích: Tránh conflict khi nhiều component cùng điều khiển audio
 * 
 * 2. LIBRARY: Howler.js Integration
 *    - Thay thế HTML5 Audio native API
 *    - Ưu điểm so với HTML5 Audio:
 *      + Cross-browser compatibility tốt hơn (Safari, iOS)
 *      + Audio sprite support (nhiều sound trong 1 file)
 *      + Fade in/out mượt mà với API đơn giản
 *      + Memory management tự động (pooling, caching)
 *      + Xử lý autoplay policy của browser hiệu quả
 * 
 * 3. VOLUME ARCHITECTURE: Multi-layer Volume System
 *    - Master Volume: Điều chỉnh tổng âm lượng toàn bộ hệ thống
 *    - Music Volume: Điều chỉnh riêng BGM (nhạc nền)
 *    - SFX Volume: Điều chỉnh riêng sound effects
 *    - Final Volume = Master × (Music hoặc SFX) [0.0 → 1.0]
 * 
 * 4. PERSISTENCE LAYER: LocalStorage Integration
 *    - Auto-save: Tự động lưu settings mỗi khi user thay đổi volume
 *    - Auto-load: Khôi phục settings khi khởi động app
 *    - Storage Key: 'settings_audio'
 *    - Format: JSON { master, music, sfx }
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * KỸ THUẬT VÀ THUẬT TOÁN (Techniques & Algorithms):
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 1. FADE TRANSITION ALGORITHM:
 *    - Linear Interpolation (LERP): Volume từ A → B trong khoảng thời gian T
 *    - fadeIn: 0 → targetVolume trong 1000ms
 *    - fadeOut: currentVolume → 0 trong 1000ms
 *    - Công thức: volume(t) = startVol + (endVol - startVol) × (t / duration)
 *    - Tránh "pop/click" sounds khi thay đổi volume đột ngột
 * 
 * 2. AUDIO LIFECYCLE MANAGEMENT:
 *    BGM Lifecycle:
 *      [Idle] → playBGM() → [Loading] → onload → [Playing] → fade → stopBGM() → [Unloaded]
 *    
 *    SFX Lifecycle:
 *      playSFX() → [Playing] → onend → unload() → [Garbage Collected]
 *    
 *    - BGM: Singleton instance, chỉ 1 bài phát tại 1 thời điểm
 *    - SFX: Multi-instance, có thể phát đồng thời nhiều sounds (overlapping)
 * 
 * 3. MEMORY OPTIMIZATION:
 *    - BGM: Manual unload() khi stop/switch để giải phóng audio buffer
 *    - SFX: Auto-unload trong onend callback sau khi phát xong
 *    - Tránh memory leaks do tích lũy các Howl instances không dùng
 * 
 * 4. ERROR HANDLING STRATEGY:
 *    - onloaderror: File không tồn tại hoặc format không hỗ trợ
 *    - onplayerror: Autoplay bị chặn bởi browser (Chrome policy)
 *    - unlock event: Chờ user interaction để unlock AudioContext
 * 
 * 5. STATE MANAGEMENT:
 *    - currentBgmPath: Track bài BGM đang phát (debouncing duplicate calls)
 *    - isMuted: Global mute state
 *    - Conditional Logic: if (playing same track) → skip để tránh restart
 * 
 * @module AudioManager
 * @category Game Engine / Audio System
 * @author AlgoQuest Team
 * @version 2.0 (Howler.js Integration)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { Howl } from 'howler';

export class AudioManager {
    // ══════════════════════════════════════════════════════════════════════════
    // SINGLETON PATTERN IMPLEMENTATION
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Instance tĩnh duy nhất của AudioManager (Singleton Instance)
     * - Static: Thuộc về class, không phải instance riêng lẻ
     * - Private: Chỉ truy cập được bên trong class
     */
    private static instance: AudioManager;

    // ══════════════════════════════════════════════════════════════════════════
    // STATE VARIABLES (Biến trạng thái hệ thống)
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * BGM Instance: Đối tượng Howl đang phát nhạc nền
     * - Type: Howl | null
     * - null: Không có nhạc đang phát
     * - Howl: Đang phát nhạc nền
     */
    private bgm: Howl | null = null;

    /**
     * VOLUME SETTINGS: Hệ thống âm lượng đa tầng (Multi-layer Volume)
     * - Giá trị: 0.0 (im lặng) → 1.0 (tối đa)
     * - masterVolume: Âm lượng chính, ảnh hưởng tất cả âm thanh
     * - musicVolume: Âm lượng riêng cho BGM
     * - sfxVolume: Âm lượng riêng cho SFX
     */
    private masterVolume: number = 1.0;   // Default: 100%
    private musicVolume: number = 0.5;    // Default: 50% (tránh quá ồn)
    private sfxVolume: number = 1.0;      // Default: 100%

    /**
     * TRACKING STATE: Theo dõi trạng thái phát nhạc
     * - currentBgmPath: Đường dẫn file BGM đang phát (dùng để debounce)
     * - isMuted: Trạng thái tắt tiếng toàn cục
     */
    private currentBgmPath: string | null = null;
    private isMuted: boolean = false;

    /**
     * FADE CONFIGURATION: Thời gian chuyển tiếp mượt mà
     * - FADE_DURATION: 1000ms (1 giây) cho fade in/out
     * - readonly: Không thể thay đổi sau khi khởi tạo (constant)
     */
    private readonly FADE_DURATION = 1000;

    // ══════════════════════════════════════════════════════════════════════════
    // SINGLETON PATTERN: Constructor & Factory Method
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * PRIVATE CONSTRUCTOR: Ngăn khởi tạo trực tiếp từ bên ngoài
     * 
     * FLOW:
     * 1. Gọi loadSettings() để khôi phục volume từ LocalStorage
     * 2. Thiết lập các giá trị mặc định nếu chưa có settings đã lưu
     * 
     * Note: Chỉ được gọi 1 lần duy nhất bởi getInstance()
     */
    private constructor() {
        this.loadSettings();
    }

    /**
     * GET SINGLETON INSTANCE: Factory method lấy instance duy nhất
     * 
     * ALGORITHM: Lazy Initialization Pattern
     * 1. Kiểm tra: Đã có instance chưa?
     * 2. Nếu chưa → Khởi tạo instance mới
     * 3. Return instance (đảm bảo luôn trả về cùng 1 object)
     * 
     * @returns {AudioManager} Instance duy nhất của AudioManager
     * 
     * USAGE EXAMPLE:
     * ```typescript
     * const audio = AudioManager.getInstance();
     * audio.playBGM('/path/to/music.mp3');
     * ```
     */
    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // BGM CONTROL: Background Music Management
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * PHÁT NHẠC NỀN (Background Music Playback)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ FLOW DIAGRAM: BGM Playback với Smooth Transitions              │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * playBGM(path) được gọi
     *       │
     *       ├─► [Case 1] Đang phát cùng bài?
     *       │         │
     *       │         └─► YES → Return (không làm gì, tiếp tục phát)
     *       │
     *       ├─► [Case 2] Đang phát bài khác?
     *       │         │
     *       │         ├─► 1. Fade out bài cũ (volume → 0 trong 1s)
     *       │         ├─► 2. Đợi fade hoàn thành (event: 'fade')
     *       │         ├─► 3. Stop và unload bài cũ
     *       │         └─► 4. startNewBGM(path)
     *       │
     *       └─► [Case 3] Không phát nhạc nào?
     *                 │
     *                 ├─► 1. stopBGM() (cleanup nếu có)
     *                 └─► 2. startNewBGM(path)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ KỸ THUẬT: Debouncing & State Checking                          │
     * └─────────────────────────────────────────────────────────────────┘
     * - Debouncing: Kiểm tra path + playing state để tránh restart
     * - State Machine: Idle → Loading → Playing → FadingOut → Stopped
     * 
     * @param {string} path - Đường dẫn tuyệt đối đến file audio (mp3/ogg/wav)
     * 
     * EXAMPLE:
     * ```typescript
     * audioManager.playBGM('/assets/audio/bgm_combat.mp3');
     * // Gọi lại với cùng path → Không restart
     * audioManager.playBGM('/assets/audio/bgm_combat.mp3'); // Bỏ qua
     * ```
     */
    public playBGM(path: string): void {
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: Debouncing - Kiểm tra xem có đang phát cùng bài không
        // ═══════════════════════════════════════════════════════════════
        // Logic: currentPath === newPath AND bgm đang playing
        // → Return sớm để tránh restart không cần thiết
        if (this.currentBgmPath === path && this.bgm && this.bgm.playing()) {
            return; // Early exit optimization
        }

        // ═══════════════════════════════════════════════════════════════
        // STEP 2: Smooth Transition - Fade out bài cũ nếu đang phát
        // ═══════════════════════════════════════════════════════════════
        if (this.bgm && this.bgm.playing()) {
            // Kỹ thuật: Linear Fade Out
            // fade(fromVolume, toVolume, duration)
            this.bgm.fade(this.bgm.volume(), 0, this.FADE_DURATION);

            // Event-driven Cleanup: Đợi fade hoàn thành mới cleanup
            // once(): Chỉ lắng nghe 1 lần, tự động unbind sau khi trigger
            this.bgm.once('fade', () => {
                this.bgm?.stop();        // Dừng phát
                this.bgm?.unload();      // Giải phóng audio buffer khỏi memory
                this.startNewBGM(path);  // Bắt đầu bài mới
            });
        } else {
            // ═══════════════════════════════════════════════════════════
            // STEP 3: Direct Start - Không có nhạc đang phát
            // ═══════════════════════════════════════════════════════════
            this.stopBGM();             // Cleanup defensive (nếu có rác)
            this.startNewBGM(path);     // Khởi động bài mới ngay lập tức
        }
    }

    /**
     * BẮT ĐẦU PHÁT NHẠC NỀN MỚI (Start New BGM with Fade In)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ LIFECYCLE: Howl Instance Creation & Configuration               │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * 1. [Create]    → new Howl({ config })
     * 2. [Load]      → Tải file audio (async, background loading)
     * 3. [onload]    → Trigger fade in (0 → targetVolume)
     * 4. [Playing]   → Loop vô hạn (loop: true)
     * 5. [Error]     → Fallback handling (onloaderror, onplayerror)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ THUẬT TOÁN: Fade In Effect                                      │
     * └─────────────────────────────────────────────────────────────────┘
     * Formula: volume(t) = 0 + (targetVol - 0) × (t / 1000ms)
     * - t=0ms    → volume = 0.0 (silent)
     * - t=500ms  → volume = 0.5 × targetVol
     * - t=1000ms → volume = targetVol (full)
     * 
     * @param {string} path - Đường dẫn file audio
     * @private - Internal method, chỉ được gọi bởi playBGM()
     */
    private startNewBGM(path: string): void {
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: Update State - Lưu path đang phát
        // ═══════════════════════════════════════════════════════════════
        this.currentBgmPath = path;

        // ═══════════════════════════════════════════════════════════════
        // STEP 2: Calculate Target Volume
        // ═══════════════════════════════════════════════════════════════
        // Formula: finalVolume = master × music × (mute ? 0 : 1)
        // - Nếu muted → 0 (im lặng)
        // - Nếu không → master × music
        const volume = this.isMuted ? 0 : (this.masterVolume * this.musicVolume);

        // ═══════════════════════════════════════════════════════════════
        // STEP 3: Create Howl Instance - Audio Object Configuration
        // ═══════════════════════════════════════════════════════════════
        this.bgm = new Howl({
            // ───────────────────────────────────────────────────────────
            // SOURCE: File path(s) để load
            // ───────────────────────────────────────────────────────────
            // Array format: Howler sẽ thử từng file theo thứ tự
            // Hỗ trợ fallback: ['.ogg', '.mp3'] nếu browser không support ogg
            src: [path],

            // ───────────────────────────────────────────────────────────
            // LOOP: Phát lặp vô hạn cho BGM
            // ───────────────────────────────────────────────────────────
            loop: true,

            // ───────────────────────────────────────────────────────────
            // INITIAL VOLUME: Bắt đầu từ 0 để fade in mượt mà
            // ───────────────────────────────────────────────────────────
            volume: 0, // Silent start → Fade in trong onload

            // ───────────────────────────────────────────────────────────
            // EVENT: onload - Trigger khi file đã load xong
            // ───────────────────────────────────────────────────────────
            // Thời điểm: File đã decode xong, sẵn sàng phát
            onload: () => {
                // Fade in: 0 → targetVolume trong FADE_DURATION (1000ms)
                this.bgm?.fade(0, volume, this.FADE_DURATION);
            },

            // ───────────────────────────────────────────────────────────
            // ERROR HANDLING: Load Error
            // ───────────────────────────────────────────────────────────
            // Nguyên nhân: File không tồn tại, format không hỗ trợ, network error
            onloaderror: (_id, error) => {
                console.warn('[AudioManager] BGM load error:', path, error);
                // Có thể thêm fallback: Phát nhạc default hoặc skip
            },

            // ───────────────────────────────────────────────────────────
            // ERROR HANDLING: Play Error
            // ───────────────────────────────────────────────────────────
            // Nguyên nhân phổ biến: Browser autoplay policy (Chrome, Safari)
            // - Chrome: Chặn autoplay cho đến khi có user interaction
            // - Safari iOS: Chặn audio trong background
            onplayerror: (_id, error) => {
                console.warn('[AudioManager] BGM play error:', path, error);

                // ───────────────────────────────────────────────────────
                // RECOVERY STRATEGY: Unlock AudioContext
                // ───────────────────────────────────────────────────────
                // Howler sẽ tự động unlock khi user click/tap vào page
                // Event 'unlock' được trigger khi AudioContext được unlock
                this.bgm?.once('unlock', () => {
                    this.bgm?.play(); // Retry playback sau khi unlock
                });
            }
        });

        // ═══════════════════════════════════════════════════════════════
        // STEP 4: Start Playback
        // ═══════════════════════════════════════════════════════════════
        // play() returns: sound ID (number) để track instance
        // Howler sẽ:
        // 1. Fetch file (nếu chưa cache)
        // 2. Decode audio buffer
        // 3. Trigger onload
        // 4. Bắt đầu playback (hoặc trigger onplayerror nếu bị chặn)
        this.bgm.play();
    }

    /**
     * DỪNG NHẠC NỀN (Stop Background Music)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ CLEANUP PROCEDURE: Memory Management                            │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * 1. stop()     → Dừng playback ngay lập tức
     * 2. unload()   → Giải phóng audio buffer khỏi memory
     * 3. null       → Xóa reference để Garbage Collector thu hồi
     * 4. reset path → Clear tracking state
     * 
     * KỸ THUẬT: Defensive Programming
     * - Kiểm tra null trước khi gọi methods để tránh runtime error
     * 
     * MEMORY IMPACT:
     * - Audio buffer có thể chiếm 5-20MB tùy file
     * - unload() giải phóng ngay lập tức, không đợi GC
     */
    public stopBGM(): void {
        if (this.bgm) {
            this.bgm.stop();            // Dừng phát (stop position về 0)
            this.bgm.unload();          // Giải phóng audio buffer
            this.bgm = null;            // Xóa reference
            this.currentBgmPath = null; // Reset tracking state
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SFX CONTROL: Sound Effects Management
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * PHÁT HIỆU ỨNG ÂM THANH (Play Sound Effect)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ ARCHITECTURE: One-shot Sound Pattern                            │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * SFX vs BGM:
     * ┌─────────────┬──────────────────┬──────────────────────────────┐
     * │ Feature     │ BGM              │ SFX                          │
     * ├─────────────┼──────────────────┼──────────────────────────────┤
     * │ Instance    │ Singleton        │ Multi-instance (overlapping) │
     * │ Duration    │ Long (minutes)   │ Short (< 2s)                 │
     * │ Loop        │ Yes (infinite)   │ No (one-shot)                │
     * │ Lifecycle   │ Manual unload    │ Auto-unload on end           │
     * │ Overlap     │ No (1 tại 1 lúc) │ Yes (có thể phát đồng thời)  │
     * └─────────────┴──────────────────┴──────────────────────────────┘
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ MEMORY OPTIMIZATION: Auto-cleanup Pattern                       │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * Lifecycle:
     * playSFX() → [Playing] → onend → unload() → [GC]
     *                ↓
     *         (1-2 seconds)
     * 
     * - Mỗi lần gọi tạo Howl instance mới
     * - Instance tự động unload sau khi phát xong
     * - Garbage Collector thu hồi memory tự động
     * - Không cần manual cleanup như BGM
     * 
     * @param {string} path - Đường dẫn file SFX (ví dụ: '/sfx/click.mp3')
     * 
     * EXAMPLE:
     * ```typescript
     * // Phát đồng thời nhiều sounds (overlapping)
     * audioManager.playSFX('/sfx/attack.mp3');
     * audioManager.playSFX('/sfx/hit.mp3');    // Phát cùng lúc với attack
     * audioManager.playSFX('/sfx/coin.mp3');   // Phát cùng lúc cả 3
     * ```
     */
    public playSFX(path: string): void {
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: Calculate Volume - Áp dụng multi-layer volume
        // ═══════════════════════════════════════════════════════════════
        // Formula: finalVolume = master × sfx × (mute ? 0 : 1)
        const volume = this.isMuted ? 0 : (this.masterVolume * this.sfxVolume);

        // ═══════════════════════════════════════════════════════════════
        // STEP 2: Create One-shot Howl Instance
        // ═══════════════════════════════════════════════════════════════
        // Note: Không lưu vào property, local variable để auto garbage collect
        const sfx = new Howl({
            src: [path],

            // ───────────────────────────────────────────────────────────
            // VOLUME: Clamp vào [0, 1]
            // ───────────────────────────────────────────────────────────
            // Math.max(0, Math.min(1, value)): Đảm bảo giá trị trong range hợp lệ
            // - Nếu < 0 → 0
            // - Nếu > 1 → 1
            volume: Math.max(0, Math.min(1, volume)),

            // ───────────────────────────────────────────────────────────
            // EVENT: onend - Trigger khi sound phát xong
            // ───────────────────────────────────────────────────────────
            // Arrow function: Giữ reference đến 'sfx' trong closure
            onend: () => {
                // ───────────────────────────────────────────────────────
                // AUTO-CLEANUP: Giải phóng memory ngay khi phát xong
                // ───────────────────────────────────────────────────────
                // Tại sao cần unload():
                // - SFX ngắn (~1s) nhưng có thể có hàng chục sounds khác nhau
                // - Không unload → accumulate trong memory
                // - Ví dụ: 50 sounds × 100KB = 5MB idle memory
                sfx.unload();
            },

            // ───────────────────────────────────────────────────────────
            // ERROR HANDLING: Silent fail
            // ───────────────────────────────────────────────────────────
            // Rationale: SFX là non-critical, không cần log lỗi
            // - Nếu file không tồn tại → Game vẫn chơi được (chỉ mất sound)
            // - Tránh spam console với nhiều SFX calls
            onloaderror: () => {
                // Silent fail - Không log để tránh noise
            }
        });

        // ═══════════════════════════════════════════════════════════════
        // STEP 3: Play immediately
        // ═══════════════════════════════════════════════════════════════
        // Fire-and-forget pattern: Gọi play() rồi quên
        // Howl tự quản lý lifecycle thông qua onend callback
        sfx.play();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // VOLUME CONTROL: Public API cho Volume Adjustment
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * CÀI ĐẶT ÂM LƯỢNG TỔNG (Set Master Volume)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ FLOW: Volume Update Chain                                       │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * setMasterVolume(0.8)
     *       │
     *       ├─► 1. clamp(0.8) → Đảm bảo [0, 1]
     *       ├─► 2. this.masterVolume = 0.8 (Update state)
     *       ├─► 3. updateBgmVolume() → Áp dụng cho BGM đang phát
     *       └─► 4. saveSettings() → Lưu vào LocalStorage
     * 
     * IMPACT:
     * - Ảnh hưởng ngay lập tức đến BGM (nếu đang phát)
     * - SFX tiếp theo sẽ sử dụng volume mới
     * - Settings được persist, áp dụng cho session tiếp theo
     * 
     * @param {number} value - Giá trị volume [0.0 → 1.0]
     */
    public setMasterVolume(value: number): void {
        this.masterVolume = this.clamp(value);  // Validate + Update
        this.updateBgmVolume();                 // Apply to current BGM
        this.saveSettings();                    // Persist to storage
    }

    /**
     * CÀI ĐẶT ÂM LƯỢNG NHẠC NỀN (Set Music Volume)
     * 
     * Chi tiết tương tự setMasterVolume()
     * Chỉ khác công thức: finalVolume = master × MUSIC × mute
     * 
     * @param {number} value - Giá trị volume [0.0 → 1.0]
     */
    public setMusicVolume(value: number): void {
        this.musicVolume = this.clamp(value);
        this.updateBgmVolume();
        this.saveSettings();
    }

    /**
     * CÀI ĐẶT ÂM LƯỢNG HIỆU ỨNG (Set SFX Volume)
     * 
     * Note: Không cần updateBgmVolume() vì SFX không ảnh hưởng BGM
     * SFX tiếp theo sẽ tự động sử dụng giá trị mới
     * 
     * @param {number} value - Giá trị volume [0.0 → 1.0]
     */
    public setSfxVolume(value: number): void {
        this.sfxVolume = this.clamp(value);
        this.saveSettings(); // Chỉ cần save, không cần update BGM
    }

    /**
     * LẤY CÀI ĐẶT ÂM LƯỢNG (Get Volume Settings)
     * 
     * USAGE: Hiển thị sliders trong Settings UI
     * ```typescript
     * const settings = audioManager.getSettings();
     * // { master: 1.0, music: 0.5, sfx: 1.0 }
     * 
     * <Slider value={settings.music} onChange={setMusicVolume} />
     * ```
     * 
     * @returns {Object} Object chứa 3 volume levels
     */
    public getSettings() {
        return {
            master: this.masterVolume,
            music: this.musicVolume,
            sfx: this.sfxVolume
        };
    }

    /**
     * BẬT/TẮT TIẾNG (Mute/Unmute)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ MUTE BEHAVIOR:                                                  │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * Muted = true:
     *   - BGM volume → 0 (fade down trong 100ms)
     *   - SFX mới → volume = 0
     *   - Giữ nguyên masterVolume/musicVolume/sfxVolume
     * 
     * Unmuted = false:
     *   - BGM volume → restore (fade up trong 100ms)
     *   - SFX mới → volume = master × sfx
     * 
     * @param {boolean} muted - true: Mute, false: Unmute
     */
    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        this.updateBgmVolume(); // Apply mute state to current BGM
    }

    /**
     * KIỂM TRA TRẠNG THÁI MUTE (Check Mute State)
     * 
     * @returns {boolean} true nếu đang mute, false nếu không
     */
    public isMutedState(): boolean {
        return this.isMuted;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // INTERNAL HELPERS: Private Utility Methods
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * CẬP NHẬT ÂM LƯỢNG BGM (Update BGM Volume)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ ALGORITHM: Real-time Volume Update với Smooth Fade              │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * FLOW:
     * 1. Kiểm tra: BGM có đang phát không?
     * 2. Tính toán: finalVolume = master × music × (mute ? 0 : 1)
     * 3. Clamp: Đảm bảo giá trị trong [0, 1]
     * 4. Apply: Sử dụng fade() thay vì set trực tiếp
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ KỸ THUẬT: Micro Fade để tránh Pop/Click Sounds                 │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * Tại sao dùng fade(100ms) thay vì set volume trực tiếp?
     * - Set trực tiếp: volume thay đổi tức thời → tạo "pop" sound
     * - Fade 100ms: Chuyển đổi mượt mà, tai người không nhận ra
     * - Ví dụ: 0.5 → 0.8 trong 100ms thay vì 1 frame
     * 
     * @private - Internal method, không expose ra ngoài
     */
    private updateBgmVolume(): void {
        if (this.bgm) {
            // ═══════════════════════════════════════════════════════════
            // Công thức Volume: Multi-layer Multiplication
            // ═══════════════════════════════════════════════════════════
            // - isMuted check: Ternary nhanh hơn if/else
            // - Multiplication: master × music (cả 2 đều [0, 1])
            const finalVol = this.isMuted ? 0 : (this.masterVolume * this.musicVolume);

            // ═══════════════════════════════════════════════════════════
            // Clamp: Đảm bảo không vượt quá range hợp lệ
            // ═══════════════════════════════════════════════════════════
            const clampedVol = Math.max(0, Math.min(1, finalVol));

            // ═══════════════════════════════════════════════════════════
            // Apply với Micro Fade: Smooth transition
            // ═══════════════════════════════════════════════════════════
            // fade(from, to, duration)
            // - from: this.bgm.volume() → Volume hiện tại
            // - to: clampedVol → Volume mục tiêu
            // - duration: 100ms → Đủ nhanh để realtime, đủ chậm để mượt
            this.bgm.fade(this.bgm.volume(), clampedVol, 100);
        }
    }

    /**
     * CLAMP VALUE: Giới hạn giá trị trong khoảng [0, 1]
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ ALGORITHM: Min-Max Clamping                                     │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * Formula: clamp(x) = max(0, min(1, x))
     * 
     * Truth Table:
     * ┌────────┬─────────┬───────────┬────────┐
     * │ Input  │ min(1)  │ max(0)    │ Output │
     * ├────────┼─────────┼───────────┼────────┤
     * │ -0.5   │ -0.5    │ 0         │ 0      │
     * │ 0.3    │ 0.3     │ 0.3       │ 0.3    │
     * │ 1.5    │ 1.0     │ 1.0       │ 1.0    │
     * └────────┴─────────┴───────────┴────────┘
     * 
     * Tại sao cần clamp?
     * - User có thể nhập giá trị ngoài range từ UI
     * - Tính toán (master × music) có thể ra số lẻ
     * - Howler yêu cầu volume trong [0, 1]
     * 
     * @param {number} value - Giá trị cần clamp
     * @returns {number} Giá trị đã clamp trong [0, 1]
     * 
     * @private
     */
    private clamp(value: number): number {
        return Math.max(0, Math.min(1, value));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // PERSISTENCE LAYER: LocalStorage Integration
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * LƯU CÀI ĐẶT (Save Settings to LocalStorage)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ PERSISTENCE STRATEGY: Auto-save on Change                       │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * FLOW:
     * User thay đổi volume
     *       │
     *       ├─► setMasterVolume(0.8)
     *       └─► saveSettings() → LocalStorage
     * 
     * Next Session:
     * App khởi động → constructor() → loadSettings() → Restore 0.8
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ DATA STRUCTURE: JSON Format                                     │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * Key: 'settings_audio'
     * Value: { "master": 1.0, "music": 0.5, "sfx": 1.0 }
     * 
     * STORAGE SIZE: ~50 bytes (rất nhỏ, không lo limit)
     * 
     * @private - Tự động được gọi bởi setXxxVolume()
     */
    private saveSettings(): void {
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: Serialize to JSON
        // ═══════════════════════════════════════════════════════════════
        const settings = {
            master: this.masterVolume,
            music: this.musicVolume,
            sfx: this.sfxVolume
        };

        // ═══════════════════════════════════════════════════════════════
        // STEP 2: Save to LocalStorage
        // ═══════════════════════════════════════════════════════════════
        // localStorage API:
        // - Synchronous: Blocking call (nhưng nhanh ~1ms)
        // - String only: Phải JSON.stringify() trước
        // - Persistent: Tồn tại đến khi user xóa cache
        localStorage.setItem('settings_audio', JSON.stringify(settings));
    }

    /**
     * TÀI CÀI ĐẶT (Load Settings from LocalStorage)
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ INITIALIZATION: Constructor Call Chain                          │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * getInstance()
     *       │
     *       └─► new AudioManager()
     *                 │
     *                 └─► constructor()
     *                           │
     *                           └─► loadSettings()
     *                                     │
     *                                     ├─► Có data? → Restore
     *                                     └─► Không? → Dùng default
     * 
     * ┌─────────────────────────────────────────────────────────────────┐
     * │ ERROR HANDLING: Defensive Programming                           │
     * └─────────────────────────────────────────────────────────────────┘
     * 
     * Các trường hợp lỗi có thể xảy ra:
     * 1. LocalStorage không tồn tại (null)
     * 2. JSON parse fail (corrupt data)
     * 3. Wrong data type (string thay vì number)
     * 
     * Strategy: Try-catch + Type validation
     * 
     * @private - Chỉ được gọi 1 lần trong constructor
     */
    private loadSettings(): void {
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: Try to get saved data
        // ═══════════════════════════════════════════════════════════════
        const saved = localStorage.getItem('settings_audio');

        // ═══════════════════════════════════════════════════════════════
        // STEP 2: Early exit nếu không có data
        // ═══════════════════════════════════════════════════════════════
        if (saved) {
            try {
                // ═══════════════════════════════════════════════════════
                // STEP 3: Parse JSON
                // ═══════════════════════════════════════════════════════
                const parsed = JSON.parse(saved);

                // ═══════════════════════════════════════════════════════
                // STEP 4: Type Validation + Conditional Assignment
                // ═══════════════════════════════════════════════════════
                // Tại sao kiểm tra typeof?
                // - User có thể edit LocalStorage manually
                // - LocalStorage có thể bị corrupt
                // - Code cũ có thể lưu format khác
                //
                // Strategy: Chỉ restore nếu type đúng, giữ default nếu sai
                if (typeof parsed.master === 'number') this.masterVolume = parsed.master;
                if (typeof parsed.music === 'number') this.musicVolume = parsed.music;
                if (typeof parsed.sfx === 'number') this.sfxVolume = parsed.sfx;

            } catch (e) {
                // ═══════════════════════════════════════════════════════
                // ERROR RECOVERY: Fallback to Defaults
                // ═══════════════════════════════════════════════════════
                // Log error nhưng không crash app
                // Volume sẽ sử dụng giá trị default đã khai báo
                console.error('[AudioManager] Failed to load settings', e);
            }
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT: Tạo và Export Instance Duy Nhất
// ══════════════════════════════════════════════════════════════════════════════

/**
 * SINGLETON INSTANCE EXPORT
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ USAGE PATTERN: Global Import                                    │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * BEFORE (Anti-pattern):
 * ```typescript
 * const audio1 = new AudioManager(); // ❌ Error: Private constructor
 * ```
 * 
 * CORRECT USAGE:
 * ```typescript
 * import { audioManager } from './AudioManager';
 * 
 * // Anywhere in app
 * audioManager.playBGM('/music.mp3');
 * audioManager.playSFX('/click.mp3');
 * ```
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ BENEFITS:                                                        │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * 1. Single Source of Truth: Tất cả components dùng chung 1 instance
 * 2. Consistent State: Volume settings đồng bộ khắp app
 * 3. Memory Efficient: Chỉ 1 BGM instance, tránh duplicate
 * 4. Easy Access: Import và dùng ngay, không cần khởi tạo
 */
export const audioManager = AudioManager.getInstance();
