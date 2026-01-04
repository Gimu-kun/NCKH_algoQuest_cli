/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: SPARKY GUIDE (Trợ Lý Ảo)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị nhân vật trợ lý ảo Sparky (AI Companion) để tương tác và hướng dẫn người chơi.
 * Đóng vai trò là cầu nối giữa Hệ thống Game (System) và Người chơi (User).
 * 
 * TÍNH NĂNG:
 * - Contextual Alerts: Hiển thị thông báo dựa trên ngữ cảnh (Cảnh báo máu thấp, Gợi ý giải đố).
 * - Animated Appearance: Hiệu ứng xuất hiện sinh động (Pop-up, Floating).
 * - User Acknowledgement: Yêu cầu người chơi xác nhận ("Đã hiểu") để đóng thông báo quan trọng.
 * 
 * CƠ CHẾ HOẠT ĐỘNG:
 * 1. Các module khác (Combat, Dungeon) gọi `showSparky(message)` từ `GameStore`.
 * 2. Store update state `sparkyVisible` = true và `sparkyMessage`.
 * 3. Component `SparkyGuide` lắng nghe thay đổi và render UI.
 * 4. User click "Đã hiểu" hoặc nút đóng -> gọi `hideSparky()`.
 * 
 * KỸ THUẬT:
 * - Global Event Bus (via Zustand): Bất kỳ component nào cũng có thể trigger Sparky.
 * - AnimatePresence: Quản lý animation unmount mượt mà khi ẩn component.
 * 
 * @component SparkyGuide
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import './SparkyGuide.css';

export const SparkyGuide: React.FC = () => {
    // Hooks truy cập global state
    const { sparkyVisible, sparkyMessage, hideSparky } = useGameStore();

    return (
        <AnimatePresence>
            {sparkyVisible && (
                <motion.div
                    className="sparky-container"
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {/* Hình Ảnh Đại Diện Sparky */}
                    <div className="sparky-avatar">
                        <img src="/assets/images/characters/Sparky/Sparky Normal.png" alt="Sparky AI" />
                    </div>

                    {/* Bong Bóng Chat */}
                    <div className="sparky-bubble">
                        <div className="sparky-content">
                            <h4>✨ Sparky Mách Nước</h4>
                            <p>{sparkyMessage}</p>
                        </div>
                        <button className="sparky-close-btn" onClick={hideSparky}>
                            Đã Hiểu 👍
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
