import React, { useState } from 'react';
import { audioManager } from '../../../game/audio/AudioManager';

export const AudioSettings: React.FC = () => {
    // Initialize from AudioManager
    const initialSettings = audioManager.getSettings();
    const [volume, setVolume] = useState(initialSettings.master * 100);
    const [musicVolume, setMusicVolume] = useState(initialSettings.music * 100);
    const [sfxVolume, setSfxVolume] = useState(initialSettings.sfx * 100);

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
    );
};
