/**
 * Component Kho Đồ
 * Quản lý tài nguyên và vật phẩm người chơi
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { RESOURCES, ResourceType } from '../../data/models/Item';
import type { Resource, DecorationItem, CosmeticItem } from '../../data/models/Item';
import './Inventory.css';

type InventoryTab = 'RESOURCES' | 'DECORATIONS' | 'COSMETICS';

export const Inventory: React.FC = () => {
    const { inventoryOpen, toggleInventory } = useGameStore();
    const { resources, decorations, cosmetics } = usePlayerStore();

    const [activeTab, setActiveTab] = useState<InventoryTab>('RESOURCES');
    const [selectedItem, setSelectedItem] = useState<Resource | DecorationItem | CosmeticItem | null>(null);

    if (!inventoryOpen) return null;

    const renderGrid = () => {
        switch (activeTab) {
            case 'RESOURCES':
                return [
                    ResourceType.DATA_WOOD,
                    ResourceType.LOGIC_STONE,
                    ResourceType.O_POINTS,
                    ResourceType.GOLD
                ].map(type => {
                    const resource = RESOURCES[type];
                    const amount = resources[type] || 0;
                    return (
                        <div
                            key={type}
                            className={`inventory-slot ${selectedItem === resource ? 'selected' : ''}`}
                            onClick={() => setSelectedItem(resource)}
                        >
                            <img className="item-icon" src={resource.icon} alt={resource.displayName} />
                            <span className="item-count">{amount}</span>
                        </div>
                    );
                });

            case 'DECORATIONS':
                // Placeholder logic for decorations
                return decorations.map((_itemId: any, index: number) => (
                    <div key={index} className="inventory-slot locked">
                        {/* Placeholder icon */}
                        <div className="item-icon"><i className="fi fi-rr-building" style={{ fontSize: '24px', color: '#666' }}></i></div>
                    </div>
                ));

            case 'COSMETICS':
                // Placeholder logic for cosmetics
                return cosmetics.map((_itemId: any, index: number) => (
                    <div key={index} className="inventory-slot locked">
                        <div className="item-icon"><i className="fi fi-rr-shirt" style={{ fontSize: '24px', color: '#666' }}></i></div>
                    </div>
                ));

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
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="inventory-header">
                        <h2><i className="fi fi-rr-box-alt" style={{ marginRight: '10px' }}></i> Túi Đồ</h2>
                        <button className="btn-close" onClick={toggleInventory}><i className="fi fi-rr-cross"></i></button>
                    </div>

                    {/* Tabs */}
                    <div className="inventory-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'RESOURCES' ? 'active' : ''}`}
                            onClick={() => setActiveTab('RESOURCES')}
                        >
                            Tài Nguyên
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'DECORATIONS' ? 'active' : ''}`}
                            onClick={() => setActiveTab('DECORATIONS')}
                        >
                            Trang Trí
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'COSMETICS' ? 'active' : ''}`}
                            onClick={() => setActiveTab('COSMETICS')}
                        >
                            Trang Phục
                        </button>
                    </div>

                    <div className="inventory-content">
                        {/* Grid Area */}
                        <div className="inventory-grid-container">
                            <div className="inventory-grid">
                                {renderGrid()}
                                {/* Empty slots to fill grid visually */}
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={`empty-${i}`} className="inventory-slot empty" />
                                ))}
                            </div>
                        </div>

                        {/* Details Area */}
                        <div className="item-details-panel">
                            {selectedItem ? (
                                <div className="selected-item-info">
                                    <div className="large-icon">
                                        {'icon' in selectedItem ? (
                                            <img src={selectedItem.icon} alt={selectedItem.displayName} />
                                        ) : (
                                            <div style={{ fontSize: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <i className="fi fi-rr-box-open"></i>
                                            </div>
                                        )}
                                    </div>
                                    <h3>{selectedItem.displayName}</h3>
                                    <span className="item-type">
                                        {'type' in selectedItem ? selectedItem.type : 'Item'}
                                    </span>

                                    <div className="item-description">
                                        {selectedItem.description}
                                    </div>

                                    <div className="item-actions">
                                        {activeTab !== 'RESOURCES' ? (
                                            <button
                                                className="btn-use"
                                                onClick={() => alert('Tính năng đang phát triển!')}
                                            >
                                                Sử Dụng
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-use disabled"
                                                disabled
                                                style={{
                                                    opacity: 0.5,
                                                    cursor: 'not-allowed',
                                                    background: '#444',
                                                    color: '#aaa',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                Vật Liệu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-selection">
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}><i className="fi fi-rr-hand-pointer"></i></div>
                                    <p>Chọn một vật phẩm để xem chi tiết</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
