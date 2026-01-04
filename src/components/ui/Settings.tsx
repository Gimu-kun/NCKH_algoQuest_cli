/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UI: BẢNG CÀI ĐẶT (Settings Panel)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Nơi người chơi tùy chỉnh trải nghiệm game và quản lý các thiết lập hệ thống.
 * Đồng thời đóng vai trò là Pause Menu khi trong game.
 * 
 * TÍNH NĂNG:
 * - Audio Control: Ba kênh âm thanh riêng biệt (Master, Music, SFX).
 * - Key Bindings: Hiển thị danh sách phím tắt hiện tại (Read-only view).
 * - Display Options: Tùy chỉnh Theme (Dark/Light), Tutorial, Damage Numbers.
 * - Game Flow Control: Resume, Quit to Menu.
 * 
 * FLOW XỬ LÝ:
 * 1. Mở Menu: Pause game logic (nếu đang combat) -> Show Overlay.
 * 2. Thay đổi Volume: Update local state -> Gửi event update tới `AudioManager`.
 * 3. Thay đổi Theme: Switch CSS var/class trên `document.body` via `GameStore`.
 * 4. Đóng Menu: Resume game logic -> Hide Overlay.
 * 
 * KỸ THUẬT:
 * - Input Binding Integration: Lấy danh sách phím từ `InputManager` để hiển thị động.
 * - Reactive State: Sync UI với `GameStore` và Local Storage.
 * - Event Propagation Control: `stopPropagation` để ngăn click đóng modal ngoài ý muốn.
 * 
 * @component Settings
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import inputManager from '../../game/engine/InputManager';
import { audioManager } from '../../game/audio/AudioManager';
import './Settings.css';

export const Settings: React.FC = () => {
    const { menuOpen, toggleMenu, setScene, theme, toggleTheme } = useGameStore();

    // Initialize from AudioManager
    const initialSettings = audioManager.getSettings();
    const [volume, setVolume] = useState(initialSettings.master * 100);
    const [musicVolume, setMusicVolume] = useState(initialSettings.music * 100);
    const [sfxVolume, setSfxVolume] = useState(initialSettings.sfx * 100);

    // Handlers
    const handleMasterVolumeChange = (val: number) => {
        setVolume(val);
        audioManager.setMasterVolume(val / 100);
    };

    const handleMusicVolumeChange = (val: number) => {
        setMusicVolume(val);
        audioManager.setMusicVolume(val / 100);
    };

    const handleSfxVolumeChange = (val: number) => {
        setSfxVolume(val);
        audioManager.setSfxVolume(val / 100);
    };
    const [showTutorial, setShowTutorial] = useState(true);
    const [showDamage, setShowDamage] = useState(true);
    const [pixelPerfect, setPixelPerfect] = useState(true);

    if (!menuOpen) return null;

    const handleBackToMenu = () => {
        toggleMenu();
        setScene(GameScene.MAIN_MENU);
    };

    const keyBindings = inputManager.getBindings();

    return (
        <div className="settings-overlay" onClick={toggleMenu}>
            <AnimatePresence>
                <motion.div
                    className="settings-container"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Tiêu Đề (Header) */}
                    <div className="settings-header">
                        <h2><i className="fi fi-rr-settings"></i> Cài Đặt</h2>
                        <button className="btn-close" onClick={toggleMenu}><i className="fi fi-rr-cross"></i></button>
                    </div>

                    <div className="settings-content">
                        {/* Cài Đặt Âm Thanh (Audio Settings) */}
                        <div className="setting-group">
                            <h3><i className="fi fi-rr-volume"></i> Âm Thanh</h3>
                            <div className="setting-item">
                                <span className="setting-label">Âm Lượng Tổng</span>
                                <div className="slider-container">
                                    <input
                                        className="slider-input"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volume}
                                        onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
                                    />
                                    <span className="slider-value">{volume}%</span>
                                </div>
                            </div>
                            <div className="setting-item">
                                <span className="setting-label">Nhạc Nền</span>
                                <div className="slider-container">
                                    <input
                                        className="slider-input"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={musicVolume}
                                        onChange={(e) => handleMusicVolumeChange(Number(e.target.value))}
                                    />
                                    <span className="slider-value">{musicVolume}%</span>
                                </div>
                            </div>
                            <div className="setting-item">
                                <span className="setting-label">Hiệu Ứng</span>
                                <div className="slider-container">
                                    <input
                                        className="slider-input"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={sfxVolume}
                                        onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
                                    />
                                    <span className="slider-value">{sfxVolume}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Điều Khiển Bàn Phím (Key Bindings) */}
                        <div className="setting-group">
                            <h3><i className="fi fi-rr-keyboard"></i> Điều Khiển</h3>
                            <div className="keybindings-list">
                                {keyBindings.map((binding, index) => (
                                    <div key={index} className="setting-item">
                                        <span className="setting-label">{binding.description}</span>
                                        <kbd style={{
                                            background: 'rgba(0,0,0,0.5)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid #555',
                                            fontFamily: 'monospace',
                                            color: '#fff'
                                        }}>
                                            {binding.key.toUpperCase()}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cài Đặt Hiển Thị (Display Settings) */}
                        <div className="setting-group">
                            <h3><i className="fi fi-rr-computer"></i> Hiển Thị</h3>
                            <div className="setting-item">
                                <span className="setting-label">Giao Diện Sáng (Light Mode)</span>
                                <div
                                    className={`toggle-switch ${theme === 'light' ? 'active' : ''}`}
                                    onClick={toggleTheme}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                            <div className="setting-item">
                                <span className="setting-label">Hiện Hướng Dẫn</span>
                                <div
                                    className={`toggle-switch ${showTutorial ? 'active' : ''}`}
                                    onClick={() => setShowTutorial(!showTutorial)}
                                >
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                            <div className="setting-item">
                                <span className="setting-label">Hiện Sát Thương</span>
                                <div
                                    className={`toggle-switch ${showDamage ? 'active' : ''}`}
                                    onClick={() => setShowDamage(!showDamage)}
                                >
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                            <div className="setting-item">
                                <span className="setting-label">Pixel Perfect</span>
                                <div
                                    className={`toggle-switch ${pixelPerfect ? 'active' : ''}`}
                                    onClick={() => setPixelPerfect(!pixelPerfect)}
                                >
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                        </div>

                        {/* Hành Động Menu (Menu Actions) */}
                        <div className="menu-actions">
                            <button className="btn-menu-action btn-resume" onClick={toggleMenu}>
                                <i className="fi fi-rr-play"></i> Tiếp Tục
                            </button>
                            <button className="btn-menu-action btn-quit" onClick={handleBackToMenu}>
                                <i className="fi fi-rr-home"></i> Về Menu Chính
                            </button>
                            <button
                                className="btn-menu-action btn-danger"
                                onClick={() => {
                                    if (window.confirm('CẢNH BÁO: Bạn có chắc muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác!')) {
                                        localStorage.clear();
                                        window.location.reload();
                                    }
                                }}
                                style={{ background: '#c0392b', color: 'white', border: '1px solid #e74c3c' }}
                            >
                                <i className="fi fi-rr-trash"></i> Xóa Dữ Liệu
                            </button>
                        </div>
                    </div>

                    {/* Chân Trang (Footer) */}
                    <div className="settings-footer">
                        <p>Algorithm Wizard v0.1.0 • Build 20250101</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
