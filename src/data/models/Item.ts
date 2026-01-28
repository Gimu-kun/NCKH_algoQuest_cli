/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÔ HÌNH DỮ LIỆU VẬT PHẨM & TÀI NGUYÊN (Item & Resource Data Model)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc dữ liệu cho hệ thống Inventory (Kho đồ):
 * - Resources: Tài nguyên tiêu thụ (Gỗ, Đá Logic, O-Points).
 * - Decorations: Vật phẩm trang trí Logic Farm.
 * - Cosmetics: Trang phục và phụ kiện cho nhân vật.
 * 
 * KỸ THUẬT:
 * - TypeScript Interfaces: Định nghĩa chặt chẽ các loại vật phẩm.
 * - Discriminated Unions: Phân loại item theo `type` và `slot`.
 * 
 * CẤU TRÚC:
 * - ResourceType: Enum các loại tài nguyên.
 * - DecorationType: Enum các loại đồ trang trí.
 * - CosmeticSlot: Enum các vị trí trang bị (Mũ, Áo, Weapon...).
 * 
 * @module ItemModel
 * @category Data Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export const enum ResourceType {
    DATA_WOOD = 'DATA_WOOD',
    LOGIC_STONE = 'LOGIC_STONE',
    O_POINTS = 'O_POINTS',
    GOLD = 'GOLD'
}

// Interface cho Tài Nguyên (Resources)
export interface Resource {
    type: ResourceType;
    name: string;            // Tên định danh (Internal)
    displayName: string;     // Tên hiển thị
    description: string;     // Mô tả
    icon: string;            // Đường dẫn icon
    stackable: true;         // Có thể xếp chồng
    maxStack: number;        // Số lượng tối đa trong 1 ô
}

// Danh sách Tài Nguyên mặc định
export const RESOURCES: Record<ResourceType, Resource> = {
    DATA_WOOD: {
        type: ResourceType.DATA_WOOD,
        name: 'Data-Wood',
        displayName: 'Gỗ Dữ liệu',
        description: 'Tài nguyên phổ biến từ lỗi nhỏ. Dùng để xây dựng và tạo phép.',
        icon: '/assets/images/items/Data-Wood.png',
        stackable: true,
        maxStack: 999
    },
    LOGIC_STONE: {
        type: ResourceType.LOGIC_STONE,
        name: 'Logic-Stone',
        displayName: 'Đá Logic',
        description: 'Tài nguyên hiếm từ trùm. Dùng cho xây dựng cao cấp.',
        icon: '/assets/images/items/Logic-Stone.png',
        stackable: true,
        maxStack: 99
    },
    O_POINTS: {
        type: ResourceType.O_POINTS,
        name: 'O-Points',
        displayName: 'Điểm O',
        description: 'Điểm năng lượng đại diện cho độ phức tạp tính toán.',
        icon: '/assets/images/items/O-Point.png',
        stackable: true,
        maxStack: 9999
    },
    GOLD: {
        type: ResourceType.GOLD,
        name: 'Gold Coin',
        displayName: 'Vàng',
        description: 'Tiền tệ để mua vật phẩm.',
        icon: '/assets/images/items/Gold Coin.png',
        stackable: true,
        maxStack: 999999
    }
};

// Loại đồ trang trí cho Logic Farm
export const enum DecorationType {
    FENCE = 'FENCE',       // Hàng rào
    STATUE = 'STATUE',     // Tượng
    PATH = 'PATH',         // Đường đi
    MONUMENT = 'MONUMENT'  // Đài tưởng niệm
}

// Interface cho Đồ Trang Trí
export interface DecorationItem {
    id: string;
    type: DecorationType;
    name: string;
    displayName: string;
    description: string;
    sprite: string;
    size: { width: number; height: number }; // Kích thước trên Grid (Số ô)
    cost: {
        logicStone?: number;
        dataWood?: number;
        gold?: number;
    };
    unlockRequirement?: string; // Yêu cầu mở khóa (Quest/Achievement ID)
}

// Slot trang bị cho nhân vật (Cosmetics)
export const enum CosmeticSlot {
    HAT = 'HAT',       // Mũ / Tóc
    ROBE = 'ROBE',     // Áo choàng / Trang phục
    WEAPON = 'WEAPON', // Vũ khí / Gậy phép
    PET = 'PET',       // Thú cưng đi theo
    BADGE = 'BADGE'    // Huy hiệu ngực
}

// Interface cho Vật Phẩm Thời Trang (Cosmetic)
export interface CosmeticItem {
    id: string;
    slot: CosmeticSlot;
    name: string;
    displayName: string;
    description: string;
    sprite: string;
    vfx?: string;      // Hiệu ứng hình ảnh đặc biệt (Optional)
    cost: {
        logicStone?: number;
        gold?: number;
    };
    unlockRequirement?: string;
}

// Dữ liệu mẫu cho Shop (Decorations & Cosmetics)
export const SHOP_ITEMS = {
    decorations: [
        {
            id: 'fence_logic',
            type: DecorationType.FENCE,
            name: 'Logic Fence',
            displayName: 'Hàng rào Logic',
            description: 'Hàng rào trang trí cho Trang Trại Logic',
            sprite: '/assets/images/decorations/fence_logic.png',
            size: { width: 1, height: 1 },
            cost: { dataWood: 10 }
        },
        {
            id: 'golem_statue',
            type: DecorationType.STATUE,
            name: 'Golem Statue',
            displayName: 'Tượng Golem',
            description: 'Tượng Golem hùng vĩ',
            sprite: '/assets/images/decorations/golem_statue.png',
            size: { width: 2, height: 2 },
            cost: { logicStone: 5, dataWood: 50 }
        }
    ],
    cosmetics: [
        {
            id: 'quicksort_robe',
            slot: CosmeticSlot.ROBE,
            name: 'QuickSort Robe',
            displayName: 'Áo choàng QuickSort',
            description: 'Áo choàng bay vút với hiệu ứng gió',
            sprite: '/assets/images/cosmetics/quicksort_robe.png',
            vfx: 'wind_particles',
            cost: { logicStone: 20 }
        },
        {
            id: 'recursion_hat',
            slot: CosmeticSlot.HAT,
            name: 'Recursion Hat',
            displayName: 'Mũ Đệ Quy',
            description: 'Mũ hình xoắn ốc',
            sprite: '/assets/images/cosmetics/recursion_hat.png',
            cost: { logicStone: 15 }
        }
    ]
};

// Interface cho Slot trong Kho Đồ
export interface InventorySlot {
    item: Resource | DecorationItem | CosmeticItem | null;
    quantity: number;
    equipped?: boolean; // Đang trang bị (Cho cosmetics)
}

// Interface cho Kho Đồ Người Chơi (Inventory System)
export interface PlayerInventory {
    resources: Record<ResourceType, number>;
    decorations: DecorationItem[];
    cosmetics: CosmeticItem[];
    equippedCosmetics: Partial<Record<CosmeticSlot, string>>; // Slot -> item ID
    maxSlots: number; // Sức chứa tối đa (Future)
}
