/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HỆ THỐNG ÂM THANH (Audio Manager)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Quản lý toàn bộ âm thanh trong game:
 * - Nhạc nền (BGM): Lặp lại, chuyển bài mượt mà.
 * - Hiệu ứng (SFX): Tiếng click, chiến đấu, thông báo.
 * - Volume Control: Điều chỉnh âm lượng theo 3 kênh (Master, Music, SFX).
 * 
 * TÍNH NĂNG:
 * - Singleton Pattern: Truy cập toàn cục thông qua `audioManager`.
 * - Persistence: Tự động lưu cài đặt âm lượng vào LocalStorage.
 * - Error Handling: Xử lý trường hợp trình duyệt chặn Autoplay.
 * 
 * @module AudioManager
 * @category Audio System
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export class AudioManager {
    private static instance: AudioManager;

    // Audio Elements
    private bgm: HTMLAudioElement | null = null;

    // Volume Settings (0.0 to 1.0)
    private masterVolume: number = 1.0;
    private musicVolume: number = 0.5;
    private sfxVolume: number = 1.0;

    // State
    private currentBgmPath: string | null = null;
    private isMuted: boolean = false;

    private constructor() {
        this.loadSettings();
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * Phát nhạc nền (Backgound Music)
     * Nếu nhạc đang phát trùng với request thì không làm gì (tiếp tục phát).
     * @param path Đường dẫn đến file âm thanh
     */
    public playBGM(path: string): void {
        if (this.currentBgmPath === path && this.bgm && !this.bgm.paused) {
            return; // Đã đang phát bài này
        }

        this.stopBGM();

        this.currentBgmPath = path;
        this.bgm = new Audio(path);
        this.bgm.loop = true;
        this.updateBgmVolume();

        const playPromise = this.bgm.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('[AudioManager] Autoplay blocked or file not found:', error);
            });
        }
    }

    public stopBGM(): void {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.bgm = null;
        }
    }

    /**
     * Phát hiệu ứng âm thanh (Sound Effect)
     * SFX luôn tạo instance mới để có thể phát chồng lên nhau (overlapping).
     * @param path Đường dẫn file SFX
     */
    public playSFX(path: string): void {
        const sfx = new Audio(path);
        const volume = this.isMuted ? 0 : (this.masterVolume * this.sfxVolume);
        sfx.volume = Math.max(0, Math.min(1, volume));

        sfx.play().catch(() => {
            // SFX lỗi thường do file thiếu, ignore để không spam console
            // console.debug('[AudioManager] SFX play failed:', path);
        });
    }

    /**
     * CẬP NHẬT ÂM LƯỢNG
     */
    public setMasterVolume(value: number): void {
        this.masterVolume = this.clamp(value);
        this.updateBgmVolume();
        this.saveSettings();
    }

    public setMusicVolume(value: number): void {
        this.musicVolume = this.clamp(value);
        this.updateBgmVolume();
        this.saveSettings();
    }

    public setSfxVolume(value: number): void {
        this.sfxVolume = this.clamp(value);
        this.saveSettings();
    }

    public getSettings() {
        return {
            master: this.masterVolume,
            music: this.musicVolume,
            sfx: this.sfxVolume
        };
    }

    // INTERNAL HELPERS
    private updateBgmVolume(): void {
        if (this.bgm) {
            const finalVol = this.isMuted ? 0 : (this.masterVolume * this.musicVolume);
            this.bgm.volume = Math.max(0, Math.min(1, finalVol));
        }
    }

    private clamp(value: number): number {
        return Math.max(0, Math.min(1, value));
    }

    private saveSettings(): void {
        const settings = {
            master: this.masterVolume,
            music: this.musicVolume,
            sfx: this.sfxVolume
        };
        localStorage.setItem('settings_audio', JSON.stringify(settings));
    }

    private loadSettings(): void {
        const saved = localStorage.getItem('settings_audio');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (typeof parsed.master === 'number') this.masterVolume = parsed.master;
                if (typeof parsed.music === 'number') this.musicVolume = parsed.music;
                if (typeof parsed.sfx === 'number') this.sfxVolume = parsed.sfx;
            } catch (e) {
                console.error('[AudioManager] Failed to load settings', e);
            }
        }
    }
}

export const audioManager = AudioManager.getInstance();
