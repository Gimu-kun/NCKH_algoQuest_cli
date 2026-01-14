/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MENU CHÍNH (Main Menu)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Màn hình khởi động của trò chơi, nơi người chơi bắt đầu hành trình.
 * 
 * TÍNH NĂNG:
 * - New Game: Bắt đầu chơi mới (Reset state).
 * - Continue: Tiếp tục chơi (Load state từ LocalStorage).
 * - Multiplayer: Vào đấu trường (Tính năng tương lai).
 * - Settings: Mở bảng cài đặt.
 * - Dynamic Background: Thay đổi nền theo theme Sáng/Tối.
 * 
 * @component MainMenu
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
<<<<<<< HEAD
import { ASSETS } from '../../data/AssetPaths';
=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
import './MainMenu.css';

export const MainMenu: React.FC = () => {
    const { setScene, toggleMenu, theme } = useGameStore();
    const { name, stats } = usePlayerStore();

    const handleNewGame = () => {
        setScene(GameScene.HUB_WORLD);
    };

    const handleContinue = () => {
        setScene(GameScene.HUB_WORLD);
    };

    const handleMultiplayer = () => {
        // TODO: Triển khai menu nhiều người chơi
        alert('Đấu trường chưa mở cửa!');
    };

    const handleSettings = () => {
        toggleMenu();
    };

    const menuVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <motion.div
            className="main-menu"
            initial="hidden"
            animate="visible"
            variants={menuVariants}
        >
            {/* Nền */}
            <div
                className="menu-background"
                style={{
<<<<<<< HEAD
                    backgroundImage: theme === 'light' ? 'none' : `url('${ASSETS.BACKGROUNDS.MAIN_MENU}')`
=======
                    backgroundImage: theme === 'light' ? 'none' : 'url(/assets/images/Main Menu Background.png)'
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                }}
            />

            {/* Logo */}
            <motion.div
                className="game-logo"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            >
<<<<<<< HEAD
                <img src={ASSETS.LOGO} alt="Algorithm Wizard" />
=======
                <img src="/assets/images/Game Logo.png" alt="Algorithm Wizard" />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                <h1><i className="fi fi-rr-magic-wand"></i> Pháp Sư Thuật Toán</h1>
                <p className="subtitle">Algorithm Wizard</p>
            </motion.div>

            {/* Các Nút Menu */}
            <motion.div
                className="menu-buttons"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
            >
                <motion.button
                    className="menu-btn menu-btn-primary"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNewGame}
                >
                    <i className="fi fi-rr-bolt"></i> Hành Trình Mới
                </motion.button>

                {stats.dungeonsCleared > 0 && (
                    <motion.button
                        className="menu-btn menu-btn-secondary"
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleContinue}
                    >
                        <i className="fi fi-rr-book-alt"></i> Tiếp Tục ({name})
                    </motion.button>
                )}

                <motion.button
                    className="menu-btn menu-btn-secondary"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMultiplayer}
                >
                    <i className="fi fi-rr-swords"></i> Đấu Trường
                </motion.button>

                <motion.button
                    className="menu-btn menu-btn-secondary"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
<<<<<<< HEAD
                    onClick={() => setScene(GameScene.ALGO_LAB)}
                >
                    <i className="fi fi-rr-flask"></i> Phòng Thí Nghiệm
                </motion.button>

                <motion.button
                    className="menu-btn menu-btn-secondary"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                    onClick={handleSettings}
                >
                    <i className="fi fi-rr-settings"></i> Cài Đặt
                </motion.button>
            </motion.div>

            {/* Thông Tin Phiên Bản */}
            <div className="version-info">
                <p>Giai Đoạn 1 - Hạ Tầng Cốt Lõi v1.0</p>
                <p>© 2025 Algorithm Wizard</p>
            </div>

            {/* Sparky Bay Lơ Lửng */}
            <motion.div
                className="sparky-menu"
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <img
<<<<<<< HEAD
                    src={ASSETS.CHARACTERS.SPARKY_NORMAL}
=======
                    src="/assets/images/Nhân vật/Sparky/Sparky Normal.png"
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                    alt="Sparky"
                    style={{ width: '80px' }}
                />
            </motion.div>
        </motion.div>
    );
};
