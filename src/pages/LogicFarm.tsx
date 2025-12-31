/**
 * Cảnh Trang Trại Logic
 * Không gian cá nhân của người chơi cho Xây Dựng Sáng Tạo và Cây Kỹ Năng Chức Năng
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { HUD } from '../components/ui/HUD';
import './LogicFarm.css';

export const LogicFarm: React.FC = () => {
    const { setScene, openRunicConsole } = useGameStore();

    const [activeTab, setActiveTab] = useState<'CREATIVE' | 'FUNCTIONAL'>('FUNCTIONAL');

    // Các Bệ Thờ Mẫu (Nút Cây Kỹ Năng)
    const altars = [
        { id: 'spell_bubble_sort', name: 'Bubble Sort Altar', type: 'ACTIVE', unlocked: false, x: 100, y: 150 },
        { id: 'spell_binary_search', name: 'Binary Search Shrine', type: 'ACTIVE', unlocked: false, x: 300, y: 100 },
        { id: 'passive_big_o', name: 'Big O Monolith', type: 'PASSIVE', unlocked: true, x: 200, y: 300 }, // Ví dụ đã mở khóa
    ];

    const handleBuild = (altarId: string) => {
        // Kích hoạt quy trình "Xây Dựng" (Thử Thách Lập Trình)
        // Kiểm tra xem người chơi có bản thiết kế hay chưa (kiểm tra giả lập)
        openRunicConsole(altarId);
    };

    return (
        <div className="logic-farm">
            <HUD />

            <div className="farm-header">
                <h1>🏡 Trang Trại Logic</h1>
                <div className="farm-tabs">
                    <button
                        className={activeTab === 'FUNCTIONAL' ? 'active' : ''}
                        onClick={() => setActiveTab('FUNCTIONAL')}
                    >
                        Khu Vườn Bệ Thờ (Skill Tree)
                    </button>
                    <button
                        className={activeTab === 'CREATIVE' ? 'active' : ''}
                        onClick={() => setActiveTab('CREATIVE')}
                    >
                        Xây Dựng Sáng Tạo
                    </button>
                </div>
                <button className="btn-exit" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    ← Về Sảnh
                </button>
            </div>

            <div className="farm-workspace">
                {activeTab === 'FUNCTIONAL' ? (
                    <div className="altar-garden">
                        <p className="instruction">Xây dựng Bệ Thờ bằng Bản Thiết Kế tìm được trong Hầm Ngục để mở khóa phép thuật!</p>

                        {/* Hiển thị các Tượng/Bệ Thờ */}
                        {altars.map((altar) => (
                            <motion.div
                                key={altar.id}
                                className={`altar-node ${altar.unlocked ? 'unlocked' : 'locked'}`}
                                style={{ left: altar.x, top: altar.y }}
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleBuild(altar.id)}
                            >
                                <div className="altar-icon">
                                    {altar.unlocked ? '✨' : '🔒'}
                                </div>
                                <span className="altar-name">{altar.name}</span>
                                {!altar.unlocked && <span className="build-hint">Nhấn để Xây</span>}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="creative-zone">
                        <p className="instruction">Đặt các đồ trang trí mua từ Bork!</p>
                        <div className="grid-placeholder">
                            {/* Lưới để đặt sprite */}
                            {[...Array(25)].map((_, i) => (
                                <div key={i} className="grid-cell" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
