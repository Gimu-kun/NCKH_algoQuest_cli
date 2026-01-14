import React, { useState } from 'react';
import { audioManager } from '../../../game/audio/AudioManager';

export const AudioSettings: React.FC = () => {
    // Initialize from AudioManager
    const initialSettings = audioManager.getSettings();
    const [volume, setVolume] = useState(initialSettings.master * 100);
    const [musicVolume, setMusicVolume] = useState(initialSettings.music * 100);
    const [sfxVolume, setSfxVolume] = useState(initialSettings.sfx * 100);
    const [isMuted, setIsMuted] = useState(audioManager.isMutedState());

    /**
     * LOGIC: Toggle Mute State
     * MỤC ĐÍCH: Cho phép người chơi tắt toàn bộ âm thanh nhanh chóng.
     * FLOW:
     * 1. Get current state from AudioManager.
     * 2. Toggle boolean state (true <-> false).
     * 3. Update React State -> Re-render UI.
     * 4. Call AudioManager.setMuted() to apply changes to Howler.js context.
     */
    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        audioManager.setMuted(newState);
    };

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

    return (
        <div className="setting-group">
            <h3><i className="fi fi-rr-volume"></i>Âm Thanh</h3>

            {/* MASTER VOLUME + MUTE */}
            <div className="setting-item">
                <span className="setting-label">Âm Lượng Tổng</span>
                <div className="slider-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={toggleMute}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            padding: '0 5px',
                            color: isMuted ? '#e74c3c' : '#4ecca3',
                            transition: 'transform 0.2s'
                        }}
                        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>

                    <div className="slider-container" style={{ flex: 1 }}>
                        <input
                            className="slider-input"
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
                            disabled={isMuted} // Disable slider when muted
                            style={{ opacity: isMuted ? 0.5 : 1 }}
                        />
                        <span className="slider-value">{volume}%</span>
                    </div>
                </div>
            </div>

            {/* MUSIC VOLUME */}
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
                        disabled={isMuted}
                        style={{ opacity: isMuted ? 0.5 : 1 }}
                    />
                    <span className="slider-value">{musicVolume}%</span>
                </div>
            </div>

            {/* SFX VOLUME */}
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
                        disabled={isMuted}
                        style={{ opacity: isMuted ? 0.5 : 1 }}
                    />
                    <span className="slider-value">{sfxVolume}%</span>
                </div>
            </div>
        </div>
    );
};
