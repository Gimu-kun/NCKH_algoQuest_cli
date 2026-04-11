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

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameScene, useGameStore } from '../../store/gameStore';
import { ASSETS } from '../../data/AssetPaths';
import './MainMenu.css';
import { loginUser, registerUser } from '../../services/authApiService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';

export const MainMenu: React.FC = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.85 }
    };

    const formVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    const menuVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const {setScene, toggleMenu, theme } = useGameStore();

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    const [showStartDialog, setShowStartDialog] = useState(false);
    const [authMode, setAuthMode] = useState<'initial' | 'login' | 'register'>('initial');

    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [loginMessage, setLoginMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [registerForm, setRegisterForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        passwords: '',
    });

    const [loginForm, setLoginForm] = useState({
        username: '',
        passwords: '',
    });


    const handleNewGame = () => {
        setShowStartDialog(true);
    };

    const handleSettings = () => {
        toggleMenu();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));
    };

    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    const startGameAfterAuth = () => {
        setShowStartDialog(false);
        navigate("/v1/hub")
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setAvatarFile(null);
            setPreviewAvatar(null);
        }
    };

    const resetRegisterForm = () => {
        setRegisterForm({
            firstName: '',
            lastName: '',
            username: '',
            passwords: '',
        });
        setAvatarFile(null);
        setPreviewAvatar(null);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const payload = {
            ...registerForm,
            avatar: avatarFile ?? undefined,
        };

        const response = await registerUser(payload);

        

        if (response.success) {
            setMessage({ text: response.message || 'Đăng ký thành công!', type: 'success' });
            resetRegisterForm();
            setTimeout(() => {
                setIsSubmitting(false);
                setAuthMode('login');
                setMessage(null);
            }, 1500);
        } else {
            setIsSubmitting(false);
            setMessage({ text: response.error || 'Đăng ký thất bại', type: 'error' });
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLoginMessage(null);
      
        const credentials = {
          username: loginForm.username,
          passwords: loginForm.passwords,
        };
      
        const response = await loginUser(credentials);
      
        setIsSubmitting(false);
      
        if (response.success) {
          // Lưu token vào cookie (hết hạn sau 7 ngày, bạn có thể chỉnh)
          Cookies.set('auth_token', response.data?.token || '', {
            expires: 7,           // 7 ngày
            secure: true,         // chỉ gửi qua HTTPS (nên bật khi deploy)
            sameSite: 'strict',   // chống CSRF
          });

          setLoginMessage({ text: response.message || 'Đăng nhập thành công!', type: 'success' });
      
          setTimeout(() => {
            startGameAfterAuth()
          }, 1000);
        } else {
          setLoginMessage({ text: response.error || 'Đăng nhập thất bại', type: 'error' });
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
                    backgroundImage: theme === 'light' ? 'none' : `url('${ASSETS.BACKGROUNDS.MAIN_MENU}')`
                }}
            />

            {/* Logo */}
            <motion.div
                className="game-logo"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <img src={ASSETS.LOGO} alt="Algorithm Wizard" />
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

                <motion.button
                    className="menu-btn menu-btn-secondary"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
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
                    src={ASSETS.CHARACTERS.SPARKY_NORMAL}
                    alt="Sparky"
                    style={{ width: '80px' }}
                />
            </motion.div>
            <AnimatePresence>
                {showStartDialog && (
                    <motion.div
                        className="auth-dialog-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowStartDialog(false)} // click ngoài để đóng
                    >
                        <motion.div
                            className="auth-dialog"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                                duration: 0.4,
                                ease: "easeOut"
                            }}
                            onClick={(e) => e.stopPropagation()} // ngăn đóng khi click vào dialog
                        >
                            <button className="dialog-close-btn" onClick={() => setShowStartDialog(false)}>
                                <i className="fi fi-rr-cross"></i>
                            </button>

                            <AnimatePresence mode="wait">
                                {authMode === 'initial' && (
                                    <motion.div key="initial" variants={formVariants} initial="hidden" animate="visible" exit="hidden">
                                        <h2 className="dialog-title">Bắt đầu cuộc phiêu lưu</h2>
                                        <p className="dialog-subtitle">Bạn muốn bắt đầu như thế nào?</p>

                                        <div className="dialog-choices">
                                            <motion.button
                                                className="menu-btn menu-btn-primary dialog-choice-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setAuthMode('login')}
                                            >
                                                <i className="fi fi-rr-sign-in-alt"></i> Đăng nhập
                                            </motion.button>

                                            <motion.button
                                                className="menu-btn menu-btn-secondary dialog-choice-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setAuthMode('register')}
                                            >
                                                <i className="fi fi-rr-user-plus"></i> Đăng ký
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {authMode === 'login' && (
                                    <motion.div key="login" variants={formVariants} initial="hidden" animate="visible" exit="hidden">
                                        <h2 className="dialog-title">Đăng nhập</h2>
                                        {loginMessage && (
                                        <div className={`message-box ${loginMessage.type}`}>
                                            {loginMessage.text}
                                        </div>
                                        )}
                                        <form className="auth-form" onSubmit={handleLoginSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="login-username">Tài khoản</label>
                                                <input
                                                    id="login-username"
                                                    name="username"
                                                    type="text"
                                                    placeholder="Nhập tên tài khoản hoặc email"
                                                    value={loginForm.username}
                                                    onChange={handleLoginInputChange}
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="login-password">Mật khẩu</label>
                                                <input
                                                    id="login-password"
                                                    name="passwords"
                                                    type="password"
                                                    placeholder="Nhập mật khẩu"
                                                    value={loginForm.passwords}
                                                    onChange={handleLoginInputChange}
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <motion.button
                                                type="submit"
                                                className="menu-btn menu-btn-primary submit-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.97 }}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập và bắt đầu'}
                                            </motion.button>

                                            <button
                                                type="button"
                                                className="back-link"
                                                onClick={() => setAuthMode('initial')}
                                                disabled={isSubmitting}
                                            >
                                                ← Quay lại
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {authMode === 'register' && (
                                    <motion.div key="register" variants={formVariants} initial="hidden" animate="visible" exit="hidden">
                                        <h2 className="dialog-title">Tạo tài khoản mới</h2>

                                        {message && (
                                            <div className={`message-box ${message.type}`}>
                                                {message.text}
                                            </div>
                                        )}

                                        <form className="auth-form register-form" onSubmit={handleRegisterSubmit}>
                                            {/* Avatar */}
                                            <div className="form-group avatar-group">
                                                <label>Ảnh đại diện (tùy chọn)</label>
                                                <div className="avatar-preview-container">
                                                    <div className="avatar-preview">
                                                        {previewAvatar ? (
                                                            <img src={previewAvatar} alt="Avatar preview" />
                                                        ) : (
                                                            <div className="avatar-placeholder">
                                                                <i className="fi fi-rr-user"></i>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="file-input"
                                                        id="avatar-upload"
                                                        onChange={handleAvatarChange}
                                                        disabled={isSubmitting}
                                                    />
                                                    <label htmlFor="avatar-upload" className="file-upload-label">
                                                        Chọn ảnh hoặc kéo thả
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Họ + Tên */}
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="register-firstname">Họ</label>
                                                    <input
                                                        id="register-firstname"
                                                        name="firstName"
                                                        type="text"
                                                        placeholder="Hồ"
                                                        value={registerForm.firstName}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="register-lastname">Tên</label>
                                                    <input
                                                        id="register-lastname"
                                                        name="lastName"
                                                        type="text"
                                                        placeholder="Ngọc Hà"
                                                        value={registerForm.lastName}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>

                                            {/* Tài khoản + Mật khẩu */}
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="register-username">Tài khoản</label>
                                                    <input
                                                        id="register-username"
                                                        name="username"
                                                        type="text"
                                                        placeholder="Tối thiểu 4 ký tự"
                                                        value={registerForm.username}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="register-password">Mật khẩu</label>
                                                    <input
                                                        id="register-password"
                                                        name="passwords"
                                                        type="password"
                                                        placeholder="Tối thiểu 8 ký tự"
                                                        value={registerForm.passwords}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>

                                            <motion.button
                                                type="submit"
                                                className="menu-btn menu-btn-primary submit-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.97 }}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Đang đăng ký...' : 'Tạo tài khoản và bắt đầu'}
                                            </motion.button>

                                            <button
                                                type="button"
                                                className="back-link"
                                                onClick={() => setAuthMode('initial')}
                                                disabled={isSubmitting}
                                            >
                                                ← Quay lại
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

    );
};
