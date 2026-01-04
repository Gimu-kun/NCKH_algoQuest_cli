/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: HIỂN THỊ TÀI NGUYÊN (Resource Display)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị số lượng tài nguyên hiện có của người chơi (Vàng, O-Points, v.v.).
 * Hỗ trợ 2 chế độ hiển thị: Đầy đủ (Full) và Gọn nhẹ (Compact).
 * 
 * TÍNH NĂNG:
 * - Tự động cập nhật từ PlayerStore.
 * - Hiển thị icon và số lượng.
 * - Hỗ trợ format số (toLocaleString).
 * 
 * @component ResourceDisplay
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { getResourceIcon } from '../../data/AssetPaths';
import { ResourceType } from '../../data/models/Item';
import './ResourceDisplay.css';

interface ResourceDisplayProps {
    compact?: boolean; // Chế độ hiển thị gọn
    showAll?: boolean; // Hiển thị tất cả tài nguyên hay chỉ những loại có > 0
}

export const ResourceDisplay: React.FC<ResourceDisplayProps> = ({
    compact = false,
    showAll = true
}) => {
    const { resources } = usePlayerStore();

    // Cấu hình danh sách tài nguyên cần hiển thị
    const resourceData = [
        {
            type: ResourceType.O_POINTS,
            name: 'O-Points',
            icon: getResourceIcon('O_POINTS'), // Helper lấy path icon
            value: resources[ResourceType.O_POINTS] || 0,
            color: '#FFD700' // Màu vàng gold
        },
        {
            type: ResourceType.LOGIC_STONE,
            name: 'Đá Logic',
            icon: getResourceIcon('LOGIC_STONE'),
            value: resources[ResourceType.LOGIC_STONE] || 0,
            color: '#9B59B6' // Màu tím
        },
        {
            type: ResourceType.DATA_WOOD,
            name: 'Gỗ Dữ Liệu',
            icon: getResourceIcon('DATA_WOOD'),
            value: resources[ResourceType.DATA_WOOD] || 0,
            color: '#8B4513' // Màu nâu
        },
        {
            type: ResourceType.GOLD,
            name: 'Vàng',
            icon: getResourceIcon('GOLD'),
            value: resources[ResourceType.GOLD] || 0,
            color: '#FFA500' // Màu cam
        }
    ];

    // Lọc tài nguyên nếu showAll = false
    const displayResources = showAll
        ? resourceData
        : resourceData.filter(r => r.value > 0);

    // === CHẾ ĐỘ COMPACT (GỌN) ===
    if (compact) {
        return (
            <div className="resource-display-compact">
                {displayResources.map(resource => (
                    <div key={resource.type} className="resource-item-compact">
                        <img
                            src={resource.icon}
                            alt={resource.name}
                            className="resource-icon-small"
                        />
                        <span
                            className="resource-value"
                            style={{ color: resource.color }}
                        >
                            {resource.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    // === CHẾ ĐỘ FULL (ĐẦY ĐỦ) ===
    return (
        <div className="resource-display">
            {displayResources.map(resource => (
                <div key={resource.type} className="resource-item">
                    <div className="resource-icon-container">
                        <img
                            src={resource.icon}
                            alt={resource.name}
                            className="resource-icon"
                        />
                    </div>
                    <div className="resource-info">
                        <div className="resource-name">{resource.name}</div>
                        <div
                            className="resource-amount"
                            style={{ color: resource.color }}
                        >
                            {resource.value.toLocaleString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * COMPONENT: SINGLE RESOURCE
 * Hiển thị một tài nguyên đơn lẻ (thường dùng trong Dialog hoặc Quest Reward)
 */
interface SingleResourceProps {
    type: ResourceType;
    amount: number;
    showName?: boolean;
}

export const SingleResource: React.FC<SingleResourceProps> = ({
    type,
    amount,
    showName = false
}) => {
    const icon = getResourceIcon(type);

    // Map tên hiển thị tiếng Việt
    const names: Record<ResourceType, string> = {
        [ResourceType.O_POINTS]: 'O-Points',
        [ResourceType.LOGIC_STONE]: 'Đá Logic',
        [ResourceType.DATA_WOOD]: 'Gỗ Dữ Liệu',
        [ResourceType.GOLD]: 'Vàng'
    };

    return (
        <div className="single-resource">
            <img
                src={icon}
                alt={names[type]}
                className="resource-icon-inline"
            />
            <span className="resource-value-inline">
                {amount.toLocaleString()}
            </span>
            {showName && (
                <span className="resource-name-inline">
                    {names[type]}
                </span>
            )}
        </div>
    );
};
