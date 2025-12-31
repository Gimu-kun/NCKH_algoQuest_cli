/**
 * SparkyGuide Component
 * Hiển thị trợ lý AI Sparky và các thông báo hướng dẫn
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import './SparkyGuide.css';

export const SparkyGuide: React.FC = () => {
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
                    <div className="sparky-avatar">
                        <img src="/assets/images/characters/Sparky/Sparky Normal.png" alt="Sparky AI" />
                    </div>

                    <div className="sparky-bubble">
                        <div className="sparky-content">
                            <h4>✨ Sparky Hướng Dẫn</h4>
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
