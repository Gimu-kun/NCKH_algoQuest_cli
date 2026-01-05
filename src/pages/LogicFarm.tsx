/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PAGE: TRANG TRẠI LOGIC (Logic Farm)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Không gian cá nhân hóa (Personalized Space) nơi người chơi phát triển kỹ năng và sáng tạo.
 * Kết hợp giữa cơ chế Cây Kỹ Năng (Skill Tree) và trang trí căn cứ (Base Building).
 * 
 * TÍNH NĂNG:
 * - Skill Tree (Vườn Bệ Thờ): Hệ thống node mở khóa phép thuật thông qua các thử thách lập trình.
 * - Creative Zone (Khu Vực Sáng Tạo): Sandbox cho phép tự do đặt vật phẩm trang trí.
 * - Interactive Nodes: Các bệ thờ có trạng thái (Locked, Unlocked) và sự kiện click.
 * 
 * FLOW HOẠT ĐỘNG:
 * 1. Mode Selection: Người chơi chọn giữa 'Functional' (Skill Tree) hoặc 'Creative'.
 * 2. Visual Rendering: 
 *    - Functional: Render các 'Altar Nodes' tại vị trí cố định (Static Layout).
 *    - Creative: Render lưới (Grid) và các vật phẩm đã đặt (User-defined Layout).
 * 3. Interaction:
 *    - Click vào Locked Node -> Mở giao diện 'Runic Console' để giải đố mở khóa.
 *    - (Future) Drag & Drop vật phẩm trang trí.
 * 
 * KỸ THUẬT:
 * - Dynamic Rendering: Dựa vào `activeTab` state để switch component.
 * - Coordination System: Sử dụng Absolute Positioning (x, y) để đặt các node trên bản đồ.
 * - Integration: Kết nối trực tiếp với `RunicConsole` để trigger minigame coding.
 * 
 * @page LogicFarm
 * @category Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { HUD } from '../components/ui/HUD';
import './LogicFarm.css';
import { SHOP_ITEMS } from '../data/models/Item';
import { usePlayerStore } from '../store/playerStore';

export const LogicFarm: React.FC = () => {
    // Hooks truy cập global state
    const { setScene, openRunicConsole, addToast } = useGameStore();
    const { placedDecorations, decorations: inventoryDecorations, placeDecoration } = usePlayerStore();

    // Local state
    const [activeTab, setActiveTab] = useState<'FUNCTIONAL' | 'CREATIVE'>('FUNCTIONAL');
    const [selectedDecorId, setSelectedDecorId] = useState<string | null>(null);

    /**
     * Dữ liệu mẫu cho các Bệ Thờ (Nodes trong Skill Tree)
     */
    const altars = [
        { id: 'spell_bubble_sort', name: 'Bệ Thờ Bong Bóng (Bubble Sort)', type: 'ACTIVE', unlocked: false, x: 100, y: 150 },
        { id: 'spell_binary_search', name: 'Đền Tìm Kiếm Nhị Phân', type: 'ACTIVE', unlocked: false, x: 300, y: 100 },
        { id: 'passive_big_o', name: 'Đài Tưởng Niệm Big-O', type: 'PASSIVE', unlocked: true, x: 200, y: 300 },
    ];

    const handleBuild = (altarId: string) => {
        openRunicConsole(altarId);
    };

    const handlePlaceDecoration = (index: number) => {
        if (!selectedDecorId) return;

        const x = index % 5;
        const y = Math.floor(index / 5);

        // Check if spot is taken
        const isOccupied = placedDecorations.some(d => d.x === x && d.y === y);
        if (isOccupied) {
            addToast('error', 'Ô đất này đã có vật phẩm!', 2000);
            return;
        }

        placeDecoration(selectedDecorId, x, y);
        addToast('success', 'Đã đặt vật phẩm!', 1000);
        setSelectedDecorId(null);
    };

    const getDecorImage = (id: string) => {
        const item = SHOP_ITEMS.decorations.find(d => d.id === id);
        return item ? item.sprite : undefined;
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
                        <i className="fi fi-rr-network-cloud"></i> Cây Kỹ Năng
                    </button>
                    <button
                        className={activeTab === 'CREATIVE' ? 'active' : ''}
                        onClick={() => setActiveTab('CREATIVE')}
                    >
                        <i className="fi fi-rr-palette"></i> Sáng Tạo
                    </button>
                </div>

                <button className="btn-exit" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    <i className="fi fi-rr-arrow-left"></i> Về Sảnh
                </button>
            </div>

            <div className="farm-workspace">
                {activeTab === 'FUNCTIONAL' ? (
                    <div className="altar-garden">
                        <p className="instruction">Xây dựng Bệ Thờ bằng Bản Thiết Kế tìm được trong Hầm Ngục để mở khóa phép thuật!</p>
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
                        <p className="instruction">Chọn vật phẩm bên dưới và nhấn vào ô đất trống để đặt trang trí!</p>

                        {/* GRID HIỂN THỊ */}
                        <div className="grid-placeholder">
                            {[...Array(25)].map((_, i) => {
                                const x = i % 5;
                                const y = Math.floor(i / 5);
                                const placedItem = placedDecorations.find(d => d.x === x && d.y === y);

                                return (
                                    <div
                                        key={i}
                                        className={`grid-cell ${selectedDecorId && !placedItem ? 'active-drop' : ''}`}
                                        onClick={() => handlePlaceDecoration(i)}
                                        title={placedItem ? `Vật phẩm tại ${x},${y}` : "Ô đất trống"}
                                    >
                                        {placedItem && (
                                            <img
                                                src={getDecorImage(placedItem.id)}
                                                alt="Decor"
                                                className="placed-decor-img"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* SELECTOR PANEL */}
                        <div className="decor-selector">
                            <h3>Kho Trang Trí:</h3>
                            <div className="decor-list">
                                {inventoryDecorations.length === 0 && (
                                    <div className="empty-inventory-hint">
                                        <p>Bạn chưa có đồ trang trí nào!</p>
                                        <button
                                            className="btn-go-shop"
                                            onClick={() => setScene(GameScene.SHOP)}
                                            style={{
                                                marginTop: '10px',
                                                padding: '8px 16px',
                                                background: 'linear-gradient(45deg, #f1c40f, #f39c12)',
                                                border: 'none',
                                                borderRadius: '20px',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            🛍️ Ghé Cửa Hàng Ngay
                                        </button>
                                    </div>
                                )}
                                {inventoryDecorations.map((decorId, idx) => {
                                    const item = SHOP_ITEMS.decorations.find(d => d.id === decorId);
                                    if (!item) return null;
                                    return (
                                        <div
                                            key={`${decorId}-${idx}`}
                                            className={`decor-option ${selectedDecorId === decorId ? 'selected' : ''}`}
                                            onClick={() => setSelectedDecorId(decorId)}
                                        >
                                            <img src={item.sprite} alt={item.name} />
                                            <span>{item.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
