/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UI: TÚI ĐỒ (Inventory System)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Quản lý và hiển thị tài sản của người chơi (Tài nguyên, Items, Cosmetics).
 * Cho phép xem chi tiết, sắp xếp và sử dụng vật phẩm.
 * 
 * TÍNH NĂNG:
 * - Tabbed Interface: Phân loại item thành Resources, Decorations, Cosmetics.
 * - Grid View: Hiển thị item dưới dạng lưới slot cổ điển (RPG Style).
 * - Detail Panel: Xem thông tin chi tiết (Tên, Mô tả, Stats) khi click chọn.
 * - Resource Tracking: Hiển thị số lượng Data-Wood, Logic-Stone, Gold.
 * 
 * FLOW HIỂN THỊ:
 * 1. Fetch Data: Lấy danh sách item từ `PlayerStore` (resources, decorations, cosmetics).
 * 2. Tab Selection: User chọn tab -> Filter item hiển thị.
 * 3. Render Grid:
 *    - Loop qua danh sách item -> Render `InventorySlot`.
 *    - Fill các slot trống để duy trì layout lưới đẹp.
 * 4. Interaction:
 *    - Click Slot -> Set `selectedItem` -> Hiển thị thông tin bên Detail Panel.
 * 
 * KỸ THUẬT:
 * - Conditional Rendering: Switch-case để render nội dung theo Active Tab.
 * - Type Guard: Kiểm tra loại item (`in` operator) để hiển thị thông tin phù hợp.
 * - Flexbox/Grid Layout: CSS Grid cho inventory slots.
 * 
 * @component Inventory
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { RESOURCES, ResourceType } from '../../data/models/Item';
import type { Resource, DecorationItem, CosmeticItem } from '../../data/models/Item';
<<<<<<< HEAD
import { SHOP_ITEMS } from '../../data/models/Item';
=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
import './Inventory.css';

// Định nghĩa các tab trong kho đồ
type InventoryTab = 'RESOURCES' | 'DECORATIONS' | 'COSMETICS';

export const Inventory: React.FC = () => {
    const { inventoryOpen, toggleInventory } = useGameStore();
<<<<<<< HEAD
    const { resources, decorations: decorationIds, cosmetics: cosmeticIds } = usePlayerStore();
=======
    const { resources, decorations, cosmetics } = usePlayerStore();
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

    const [activeTab, setActiveTab] = useState<InventoryTab>('RESOURCES');
    const [selectedItem, setSelectedItem] = useState<Resource | DecorationItem | CosmeticItem | null>(null);

<<<<<<< HEAD
    // Helper to resolve items
    const getDecoration = (id: string) => SHOP_ITEMS.decorations.find(d => d.id === id);
    const getCosmetic = (id: string) => SHOP_ITEMS.cosmetics.find(c => c.id === id);

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
    // Nếu kho đồ chưa mở, không render gì cả
    if (!inventoryOpen) return null;

    /**
     * Render lưới item dựa trên tab đang chọn
     */
    const renderGrid = () => {
        switch (activeTab) {
            case 'RESOURCES':
                // Hiển thị danh sách tài nguyên cố định
                return [
                    ResourceType.DATA_WOOD,
                    ResourceType.LOGIC_STONE,
                    ResourceType.O_POINTS,
                    ResourceType.GOLD
                ].map(type => {
                    const resource = RESOURCES[type];
                    const amount = resources[type] || 0;
                    const isSelected = selectedItem && 'type' in selectedItem && selectedItem.type === type;

                    return (
                        <div
                            key={type}
                            className={`inventory-slot ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedItem(resource)}
                        >
                            <img className="item-icon" src={resource.icon} alt={resource.displayName} />
                            <span className="item-count">{amount}</span>
                        </div>
                    );
                });

            case 'DECORATIONS':
<<<<<<< HEAD
                // Hiển thị danh sách đồ trang trí
                if (decorationIds.length === 0) {
                    return <div className="empty-state">Chưa có vật phẩm trang trí nào.</div>;
                }
                return decorationIds.map((id, index) => {
                    const item = getDecoration(id);
                    if (!item) return null; // Bỏ qua nếu item không tồn tại
                    return (
                        <div key={index} className="inventory-slot" onClick={() => setSelectedItem(item)}>
                            <div className="item-icon">
                                <img src={item.sprite || '/assets/Ảnh Assets/Vật Phẩm/DefaultBox.png'} alt={item.displayName} />
                            </div>
                        </div>
                    );
                });

            case 'COSMETICS':
                // Hiển thị danh sách trang phục
                if (cosmeticIds.length === 0) {
                    return <div className="empty-state">Chưa có trang phục nào.</div>;
                }
                return cosmeticIds.map((id, index) => {
                    const item = getCosmetic(id);
                    if (!item) return null;
                    return (
                        <div key={index} className="inventory-slot" onClick={() => setSelectedItem(item)}>
                            <div className="item-icon">
                                <img src={item.sprite || '/assets/Ảnh Assets/Vật Phẩm/DefaultRobe.png'} alt={item.displayName} />
                            </div>
                        </div>
                    );
                });
=======
                // Hiển thị danh sách đồ trang trí (Placeholder)
                if (decorations.length === 0) {
                    return <div className="empty-state">Chưa có vật phẩm trang trí nào.</div>;
                }
                return decorations.map((item: any, index: number) => (
                    <div key={index} className="inventory-slot" onClick={() => setSelectedItem(item)}>
                        <div className="item-icon">
                            <img src={item.sprite || '/src/assets/Ảnh Assets/Vật Phẩm/DefaultBox.png'} alt={item.displayName} />
                        </div>
                    </div>
                ));

            case 'COSMETICS':
                // Hiển thị danh sách trang phục (Placeholder)
                if (cosmetics.length === 0) {
                    return <div className="empty-state">Chưa có trang phục nào.</div>;
                }
                return cosmetics.map((item: any, index: number) => (
                    <div key={index} className="inventory-slot" onClick={() => setSelectedItem(item)}>
                        <div className="item-icon">
                            <img src={item.sprite || '/src/assets/Ảnh Assets/Vật Phẩm/DefaultRobe.png'} alt={item.displayName} />
                        </div>
                    </div>
                ));
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

            default:
                return null;
        }
    };

    return (
        <div className="inventory-overlay" onClick={toggleInventory}>
            <AnimatePresence>
                <motion.div
                    className="inventory-container"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()} // Ngăn click xuyên qua modal để đóng
                >
                    {/* === HEADER === */}
                    <div className="inventory-header">
                        <h2><i className="fi fi-rr-box-alt" style={{ marginRight: '10px' }}></i> Túi Đồ</h2>
                        <button className="btn-close" onClick={toggleInventory}><i className="fi fi-rr-cross"></i></button>
                    </div>

                    {/* === TABS NAVIGATION === */}
                    <div className="inventory-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'RESOURCES' ? 'active' : ''}`}
                            onClick={() => setActiveTab('RESOURCES')}
                        >
                            <i className="fi fi-rr-diamond"></i> Tài Nguyên
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'DECORATIONS' ? 'active' : ''}`}
                            onClick={() => setActiveTab('DECORATIONS')}
                        >
                            <i className="fi fi-rr-layout-fluid"></i> Trang Trí
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'COSMETICS' ? 'active' : ''}`}
                            onClick={() => setActiveTab('COSMETICS')}
                        >
                            <i className="fi fi-rr-shirt"></i> Trang Phục
                        </button>
                    </div>

                    <div className="inventory-content">
                        {/* === GRID AREA (DANH SÁCH ITEM) === */}
                        <div className="inventory-grid-container">
                            <div className="inventory-grid">
                                {renderGrid()}
                                {/* Fill slots trống cho đẹp grid (Optional) */}
                                {activeTab === 'RESOURCES' && Array.from({ length: 16 }).map((_, i) => (
                                    <div key={`empty-${i}`} className="inventory-slot empty" />
                                ))}
                            </div>
                        </div>

                        {/* === ITEM DETAILS (CHI TIẾT) === */}
                        <div className="item-details-panel">
                            {selectedItem ? (
                                <div className="selected-item-info">
                                    <div className="large-icon">
                                        {'icon' in selectedItem ? (
                                            <img src={selectedItem.icon} alt={selectedItem.displayName} />
                                        ) : (
                                            <div className="generic-icon">
                                                <i className="fi fi-rr-box-open"></i>
                                            </div>
                                        )}
                                    </div>
                                    <h3>{selectedItem.displayName}</h3>
                                    <span className="item-type">
                                        Loại: {'type' in selectedItem ? selectedItem.type : 'Vật Phẩm'}
                                    </span>

                                    <div className="item-description">
                                        <p>{selectedItem.description}</p>
                                    </div>

                                    <div className="item-actions">
                                        {activeTab === 'COSMETICS' && 'slot' in selectedItem ? (
                                            <button
                                                className="btn-equip"
                                                onClick={() => {
                                                    usePlayerStore.getState().equipCosmetic(selectedItem.slot, selectedItem.id);
                                                    useGameStore.getState().addToast('success', `Đã trang bị ${selectedItem.displayName}!`, 2000);
                                                }}
                                            >
                                                Trang Bị
                                            </button>
                                        ) : activeTab === 'DECORATIONS' ? (
                                            <button
                                                className="btn-use"
                                                onClick={() => {
                                                    useGameStore.getState().addToast('info', 'Hãy đến Logic Farm để đặt vật phẩm này!', 3000);
                                                    useGameStore.getState().setScene(GameScene.LOGIC_FARM);
                                                    useGameStore.getState().toggleInventory();
                                                }}
                                            >
                                                Đặt Tại Farm
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-use disabled"
                                                disabled
                                                title="Tài nguyên được dùng tự động khi chế tạo"
                                            >
                                                Nguyên Liệu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-selection">
                                    <div className="empty-icon"><i className="fi fi-rr-hand-pointer"></i></div>
                                    <p>Chọn một vật phẩm để xem thông tin chi tiết</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
