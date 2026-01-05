import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';

export const DisplaySettings: React.FC = () => {
    const { theme, toggleTheme } = useGameStore();
    const [showTutorial, setShowTutorial] = useState(true);
    const [showDamage, setShowDamage] = useState(true);
    const [pixelPerfect, setPixelPerfect] = useState(true);

    return (
        <div className="setting-group">
            <h3><i className="fi fi-rr-computer"></i>Hiển Thị</h3>
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
    );
};
