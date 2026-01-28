/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: MENU BUTTONS & ASSISTANT UI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * - Cung cấp các nút truy cập nhanh vào các tính năng chính (Túi đồ, Nhiệm vụ, Bản đồ, Menu).
 * - Hiển thị Trợ lý ảo Sparky với các thông báo trạng thái.
 * - Hiển thị các Icon cảnh báo (Bug, Hint).
 * 
 * TÍNH NĂNG:
 * - Menu Buttons: Quick access bar ở góc màn hình.
 * - Sparky Assistant: Avatar và bong bóng chat thông báo.
 * - Alert Icons: Biểu tượng cảnh báo nhỏ.
 * 
 * @component MenuButtons
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { useGameStore, GameScene } from '../../store/gameStore';
import ASSETS from '../../data/AssetPaths';
import './MenuButtons.css';

export const MenuButtons: React.FC = () => {
    // Hooks truy cập global state
    const { setScene, toggleInventory, toggleQuests, toggleMenu } = useGameStore();

    // Cấu hình danh sách nút
    const buttons = [
        {
            id: 'bag',
            icon: ASSETS.UI.BUTTON_BAG,
            label: 'Túi Đồ',
            onClick: toggleInventory,
            tooltip: 'Mở Túi Đồ (I)'
        },
        {
            id: 'quest',
            icon: ASSETS.UI.BUTTON_QUEST,
            label: 'Nhiệm Vụ',
            onClick: toggleQuests,
            tooltip: 'Xem Nhiệm Vụ (Q)'
        },
        {
            id: 'map',
            icon: ASSETS.UI.BUTTON_MAP,
            label: 'Bản Đồ',
            onClick: () => setScene(GameScene.HUB_WORLD),
            tooltip: 'Về Sảnh Chính (M)'
        },
        {
            id: 'exit',
            icon: ASSETS.UI.BUTTON_EXIT,
            label: 'Menu',
            onClick: toggleMenu,
            tooltip: 'Menu Hệ Thống (ESC)'
        }
    ];

    return (
        <div className="menu-buttons">
            {buttons.map(button => (
                <button
                    key={button.id}
                    className="menu-button"
                    onClick={button.onClick}
                    title={button.tooltip}
                    aria-label={button.label}
                >
                    <img
                        src={button.icon}
                        alt={button.label}
                        className="menu-button-icon"
                    />
                    <span className="menu-button-label">{button.label}</span>
                </button>
            ))}
        </div>
    );
};

/**
 * COMPONENT: SPARKY ASSISTANT
 * Hiển thị trợ lý AI Sparky với các trạng thái cảm xúc khác nhau.
 */
interface SparkyProps {
    message?: string;
    state?: 'normal' | 'alert' | 'error' | 'success';
}

export const SparkyAssistant: React.FC<SparkyProps> = ({
    message,
    state = 'normal'
}) => {
    const { sparkyVisible, sparkyMessage, hideSparky } = useGameStore();

    // Chỉ hiển thị nếu state visible = true hoặc có message truyền vào trực tiếp
    if (!sparkyVisible && !message) return null;

    const displayMessage = message || sparkyMessage;

    // Chọn icon dựa trên trạng thái cảm xúc
    let icon: string = ASSETS.CHARACTERS.SPARKY_NORMAL;
    if (state === 'alert') icon = ASSETS.CHARACTERS.SPARKY_ALERT;
    else if (state === 'error') icon = ASSETS.CHARACTERS.SPARKY_ERROR;
    else if (state === 'success') icon = ASSETS.CHARACTERS.SPARKY_SUCCESS;

    return (
        <div className="sparky-container">
            <div className="sparky-avatar">
                <img
                    src={icon}
                    alt="Sparky"
                    className="sparky-image"
                />
            </div>
            {displayMessage && (
                <div className="sparky-message-box">
                    <p className="sparky-message" dangerouslySetInnerHTML={{ __html: (displayMessage || '').replace(/\n/g, '<br/>') }} />
                    <button
                        className="sparky-close"
                        onClick={hideSparky}
                        title="Đóng thông báo"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};

/**
 * COMPONENT: ALERT ICON
 * Hiển thị icon cảnh báo nhỏ (ví dụ: Bug, Gợi ý) để người chơi chú ý.
 */
interface AlertIconProps {
    type: 'bug' | 'hint';
    message: string;
}

export const AlertIcon: React.FC<AlertIconProps> = ({ type, message }) => {
    const icon = type === 'bug' ? ASSETS.UI.ALERT_BUG : ASSETS.UI.ALERT_LIGHTBULB;

    return (
        <div className="alert-icon-container" title={message}>
            <img
                src={icon}
                alt={type}
                className="alert-icon"
            />
        </div>
    );
};
