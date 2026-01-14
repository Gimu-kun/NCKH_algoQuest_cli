/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UI: GIAO DIỆN CỬA HÀNG (Shop Interface)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Giao diện mua sắm vật phẩm từ NPC Merchant (Bork).
 * 
 * TÍNH NĂNG:
 * - Hiển thị danh sách vật phẩm (Decorations, Cosmetics).
 * - Kiểm tra tài nguyên người chơi trước khi mua.
 * - Xử lý giao dịch mua bán.
 * 
 * KỸ THUẬT:
 * - Lọc item từ `SHOP_ITEMS` constant.
 * - Sử dụng `playerStore.removeResource` để trừ tiền an toàn.
 * 
 * @component ShopInterface
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
<<<<<<< HEAD
import { SHOP_ITEMS, ResourceType, type DecorationItem, type CosmeticItem } from '../../data/models/Item';
=======
import { SHOP_ITEMS, ResourceType } from '../../data/models/Item';
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
import './ShopInterface.css';

export const ShopInterface: React.FC = () => {
    const { setScene, addToast } = useGameStore();
    const { resources, removeResource, addDecoration, addCosmetic } = usePlayerStore();
    const [activeTab, setActiveTab] = useState<'DECORATIONS' | 'COSMETICS'>('DECORATIONS');

    const handleBack = () => {
        setScene(GameScene.HUB_WORLD);
    };

<<<<<<< HEAD
    const handleBuy = (item: DecorationItem | CosmeticItem, category: 'DECORATIONS' | 'COSMETICS') => {
        // Kiểm tra đủ tiền không
        let canAfford = true;
        const cost = item.cost as DecorationItem['cost']; // Cast to superset type

        if (cost.gold && resources[ResourceType.GOLD] < cost.gold) canAfford = false;
        if (cost.dataWood && resources[ResourceType.DATA_WOOD] < cost.dataWood) canAfford = false;
        if (cost.logicStone && resources[ResourceType.LOGIC_STONE] < cost.logicStone) canAfford = false;
=======
    const handleBuy = (item: any, category: 'DECORATIONS' | 'COSMETICS') => {
        // Kiểm tra đủ tiền không
        let canAfford = true;

        if (item.cost.gold && resources[ResourceType.GOLD] < item.cost.gold) canAfford = false;
        if (item.cost.dataWood && resources[ResourceType.DATA_WOOD] < item.cost.dataWood) canAfford = false;
        if (item.cost.logicStone && resources[ResourceType.LOGIC_STONE] < item.cost.logicStone) canAfford = false;
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

        if (!canAfford) {
            addToast('error', 'Không đủ tài nguyên!', 2000);
            return;
        }

        // Trừ tiền
<<<<<<< HEAD
        if (cost.gold) removeResource(ResourceType.GOLD, cost.gold);
        if (cost.dataWood) removeResource(ResourceType.DATA_WOOD, cost.dataWood);
        if (cost.logicStone) removeResource(ResourceType.LOGIC_STONE, cost.logicStone);

        // Thêm item vào kho
        if (category === 'DECORATIONS') {
            addDecoration(item.id);
        } else {
            addCosmetic(item.id);
=======
        if (item.cost.gold) removeResource(ResourceType.GOLD, item.cost.gold);
        if (item.cost.dataWood) removeResource(ResourceType.DATA_WOOD, item.cost.dataWood);
        if (item.cost.logicStone) removeResource(ResourceType.LOGIC_STONE, item.cost.logicStone);

        // Thêm item vào kho
        if (category === 'DECORATIONS') {
            addDecoration(item);
        } else {
            addCosmetic(item);
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        }

        addToast('success', `Đã mua ${item.displayName}!`, 2000);
    };

<<<<<<< HEAD
    const renderPrice = (cost: DecorationItem['cost']) => {
=======
    const renderPrice = (cost: any) => {
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        const prices = [];
        if (cost.gold) prices.push(`${cost.gold} Vàng`);
        if (cost.dataWood) prices.push(`${cost.dataWood} Gỗ`);
        if (cost.logicStone) prices.push(`${cost.logicStone} Đá`);
        return prices.join(' + ');
    };

    return (
        <div className="shop-interface">
            <div className="shop-container">
                {/* Header */}
                <div className="shop-header">
                    <h2>🛒 Cửa Hàng Của Bork</h2>
                    <div className="player-currency">
                        <span>💰 {resources[ResourceType.GOLD]} Vàng</span>
                        <span>🪵 {resources[ResourceType.DATA_WOOD]} Gỗ</span>
                        <span>💎 {resources[ResourceType.LOGIC_STONE]} Đá</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="shop-tabs">
                    <button
                        className={activeTab === 'DECORATIONS' ? 'active' : ''}
                        onClick={() => setActiveTab('DECORATIONS')}
                    >
                        Trang Trí
                    </button>
                    <button
                        className={activeTab === 'COSMETICS' ? 'active' : ''}
                        onClick={() => setActiveTab('COSMETICS')}
                    >
                        Thời Trang
                    </button>
                </div>

                {/* Item Grid */}
                <div className="shop-grid">
                    {activeTab === 'DECORATIONS' ? (
                        SHOP_ITEMS.decorations.map((item) => (
                            <motion.div
                                key={item.id}
                                className="shop-item-card"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="item-image">
                                    <img src={item.sprite} alt={item.displayName} />
                                </div>
                                <h3>{item.displayName}</h3>
                                <p className="item-price">{renderPrice(item.cost)}</p>
                                <button onClick={() => handleBuy(item, 'DECORATIONS')}>Mua</button>
                            </motion.div>
                        ))
                    ) : (
                        SHOP_ITEMS.cosmetics.map((item) => (
                            <motion.div
                                key={item.id}
                                className="shop-item-card"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="item-image">
                                    <img src={item.sprite} alt={item.displayName} />
                                </div>
                                <h3>{item.displayName}</h3>
                                <p className="item-price">{renderPrice(item.cost)}</p>
                                <button onClick={() => handleBuy(item, 'COSMETICS')}>Mua</button>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer Actions */}
                <div className="shop-footer">
                    <button className="btn-back" onClick={handleBack}>Rời Cửa Hàng</button>
                </div>
            </div>
        </div>
    );
};
