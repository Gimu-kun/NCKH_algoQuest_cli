/**
 * Bộ Quản Lý Âm Thanh
 * Xử lý nhạc nền và hiệu ứng âm thanh
 */

class AudioManager {
    private bgMusic: HTMLAudioElement | null = null;
    private sfxVolume: number = 1.0;
    private musicVolume: number = 0.8;
    private masterVolume: number = 1.0;
    private muted: boolean = false;

    // Bộ nhớ cache hiệu ứng âm thanh
    private sfxCache: Map<string, HTMLAudioElement> = new Map();

    constructor() {
        // Khởi tạo với tùy chọn người dùng từ localStorage
        this.loadSettings();
    }

    /**
     * Tải cài đặt từ localStorage
     */
    private loadSettings() {
        const saved = localStorage.getItem('audio-settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.masterVolume = settings.masterVolume ?? 1.0;
            this.musicVolume = settings.musicVolume ?? 0.8;
            this.sfxVolume = settings.sfxVolume ?? 1.0;
            this.muted = settings.muted ?? false;
        }
    }

    /**
     * Lưu cài đặt vào localStorage
     */
    private saveSettings() {
        localStorage.setItem('audio-settings', JSON.stringify({
            masterVolume: this.masterVolume,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            muted: this.muted
        }));
    }

    /**
     * Phát nhạc nền (lặp lại)
     */
    public playMusic(src: string) {
        if (this.bgMusic) {
            this.bgMusic.pause();
        }

        this.bgMusic = new Audio(src);
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.getMusicVolume();

        if (!this.muted) {
            this.bgMusic.play().catch(err => {
                console.warn('[AudioManager] Music autoplay blocked:', err);
            });
        }
    }

    /**
     * Dừng nhạc nền
     */
    public stopMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    /**
     * Phát hiệu ứng âm thanh
     */
    public playSFX(name: string, src?: string) {
        if (this.muted) return;

        // Kiểm tra cache trước
        let sfx = this.sfxCache.get(name);

        if (!sfx && src) {
            // Tạo element audio mới
            sfx = new Audio(src);
            this.sfxCache.set(name, sfx);
        }

        if (sfx) {
            sfx.volume = this.getSFXVolume();
            sfx.currentTime = 0; // Reset về đầu
            sfx.play().catch(err => {
                console.warn(`[AudioManager] SFX ${name} play failed:`, err);
            });
        }
    }

    /**
     * Tải trước hiệu ứng âm thanh
     */
    public preloadSFX(sounds: { name: string; src: string }[]) {
        sounds.forEach(({ name, src }) => {
            if (!this.sfxCache.has(name)) {
                const audio = new Audio(src);
                audio.preload = 'auto';
                this.sfxCache.set(name, audio);
            }
        });
    }

    /**
     * Set master volume (0-1)
     */
    public setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
        this.saveSettings();
    }

    /**
     * Set music volume (0-1)
     */
    public setMusicVolume(volume: number) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
        this.saveSettings();
    }

    /**
     * Set SFX volume (0-1)
     */
    public setSFXVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    /**
     * Chuyển đổi tắt tiếng
     */
    public toggleMute() {
        this.muted = !this.muted;

        if (this.muted) {
            this.stopMusic();
        } else if (this.bgMusic) {
            this.bgMusic.play().catch(() => { });
        }

        this.saveSettings();
        return this.muted;
    }

    /**
     * Lấy âm lượng tổng hiện tại
     */
    public getMasterVolume(): number {
        return this.masterVolume;
    }

    /**
     * Lấy âm lượng nhạc hiệu dụng
     */
    private getMusicVolume(): number {
        return this.masterVolume * this.musicVolume;
    }

    /**
     * Lấy âm lượng SFX hiệu dụng
     */
    private getSFXVolume(): number {
        return this.masterVolume * this.sfxVolume;
    }

    /**
     * Cập nhật âm lượng tất cả audio đang phát
     */
    private updateVolumes() {
        if (this.bgMusic) {
            this.bgMusic.volume = this.getMusicVolume();
        }
    }

    /**
     * Lấy các cài đặt hiện tại
     */
    public getSettings() {
        return {
            masterVolume: this.masterVolume,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            muted: this.muted
        };
    }
}

// Instance đơn (Singleton)
export const audioManager = new AudioManager();
export default audioManager;

// Tên SFX định nghĩa sẵn để dễ tham khảo
export const SFX = {
    BUTTON_CLICK: 'button_click',
    CORRECT_ANSWER: 'correct',
    WRONG_ANSWER: 'wrong',
    REWARD: 'reward',
    LEVEL_UP: 'level_up',
    QUEST_COMPLETE: 'quest_complete',
    DIALOGUE_OPEN: 'dialogue_open',
    INVENTORY_OPEN: 'inventory_open',
    MENU_OPEN: 'menu_open'
} as const;
