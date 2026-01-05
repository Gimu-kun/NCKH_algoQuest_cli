import React from 'react';
import { useGameStore, GameScene } from '../../../store/gameStore';

interface MenuActionsProps {
    onClose: () => void;
}

export const MenuActions: React.FC<MenuActionsProps> = ({ onClose }) => {
    const { setScene } = useGameStore();

    const handleBackToMenu = () => {
        onClose();
        setScene(GameScene.MAIN_MENU);
    };

    return (
        <div className="menu-actions">
            <button className="btn-menu-action btn-resume" onClick={onClose}>
                <i className="fi fi-rr-play"></i>Tiếp Tục
            </button>
            <button className="btn-menu-action btn-quit" onClick={handleBackToMenu}>
                <i className="fi fi-rr-home"></i>Về Menu Chính
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
                <i className="fi fi-rr-trash"></i>Xóa Dữ Liệu
            </button>
        </div>
    );
};
