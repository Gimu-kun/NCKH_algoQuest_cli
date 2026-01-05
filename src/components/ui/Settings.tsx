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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import './Settings.css';
import { AudioSettings } from './settings/AudioSettings';
import { ControlSettings } from './settings/ControlSettings';
import { DisplaySettings } from './settings/DisplaySettings';
import { MenuActions } from './settings/MenuActions';

export const Settings: React.FC = () => {
    const { menuOpen, toggleMenu } = useGameStore();

    if (!menuOpen) return null;

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
                    {/* Header */}
                    <div className="settings-header">
                        <h2><i className="fi fi-rr-settings"></i>Cài Đặt</h2>
                        <button className="btn-close" onClick={toggleMenu}><i className="fi fi-rr-cross"></i></button>
                    </div>

                    <div className="settings-content">
                        <AudioSettings />
                        <ControlSettings />
                        <DisplaySettings />
                        <MenuActions onClose={toggleMenu} />
                    </div>

                    {/* Footer */}
                    <div className="settings-footer">
                        <p>Algorithm Wizard v0.1.0 • Build 20250101</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

