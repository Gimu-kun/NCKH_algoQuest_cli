/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: THÔNG BÁO NỔI (Toast Notifications)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị các thông báo ngắn gọn, tạm thời ở góc màn hình.
 * Dùng cho: Thông báo nhận thưởng, lỗi hệ thống, hoàn thành nhiệm vụ.
 * 
 * TÍNH NĂNG:
 * - Stackable: Có thể hiển thị nhiều thông báo xếp chồng lên nhau.
 * - Auto-dismiss: Tự động biến mất sau một khoảng thời gian.
 * - Animation: Xuất hiện và biến mất mượt mà.
 * - Types: Success, Error, Info, Reward.
 * 
 * @component Toast
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import './Toast.css';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'reward';
    message: string;
    duration?: number; // Thời gian hiển thị (ms)
}

export const Toast: React.FC = () => {
    // Hooks truy cập global state
    const { toasts, removeToast } = useGameStore();

    // Effect: Tự động xóa toast sau thời gian quy định
    useEffect(() => {
        toasts.forEach(toast => {
            const duration = toast.duration || 3000; // Mặc định 3 giây
            const timer = setTimeout(() => {
                removeToast(toast.id);
            }, duration);

            return () => clearTimeout(timer);
        });
    }, [toasts, removeToast]);

    // Helper: Lấy icon dựa trên loại thông báo
    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'reward': return '🎁';
            case 'info': default: return 'ℹ️';
        }
    };

    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        className={`toast toast-${toast.type}`}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                    >
                        <span className="toast-icon">{getIcon(toast.type)}</span>

                        <span className="toast-message">{toast.message}</span>

                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                            title="Đóng thông báo"
                        >
                            ✕
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
