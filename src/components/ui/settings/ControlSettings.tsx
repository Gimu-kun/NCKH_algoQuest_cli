import React from 'react';
import inputManager from '../../../game/engine/InputManager';

export const ControlSettings: React.FC = () => {
    const keyBindings = inputManager.getBindings();

    return (
        <div className="setting-group">
            <h3><i className="fi fi-rr-keyboard"></i>Điều Khiển</h3>
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
    );
};
