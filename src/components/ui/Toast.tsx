/**
 * Hệ Thống Thông Báo Nổi
 * Hiển thị thông báo tạm thời cho các sự kiện trong game
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import './Toast.css';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'reward';
    message: string;
    duration?: number;
}

export const Toast: React.FC = () => {
    const { toasts, removeToast } = useGameStore();

    useEffect(() => {
        // Tự động xóa toast sau thời lượng
        toasts.forEach(toast => {
            const duration = toast.duration || 3000;
            const timer = setTimeout(() => {
                removeToast(toast.id);
            }, duration);

            return () => clearTimeout(timer);
        });
    }, [toasts, removeToast]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'reward': return '🎁';
            default: return 'ℹ️';
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
                        >
                            ✕
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
