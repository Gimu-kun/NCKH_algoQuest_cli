/**
* Mô Hình Dữ Liệu Vật Phẩm và Tài Nguyên
* Định nghĩa tài nguyên, bản thiết kế, đồ trang trí và trang phục
*/

export const enum ResourceType {
    DATA_WOOD = 'DATA_WOOD',
    LOGIC_STONE = 'LOGIC_STONE',
    O_POINTS = 'O_POINTS',
    GOLD = 'GOLD'
}

export interface Resource {
    type: ResourceType;
    name: string;
    displayName: string;
    description: string;
    icon: string;
    stackable: true;
    maxStack: number;
}

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

// Decoration items for Logic Farm
export const enum DecorationType {
    FENCE = 'FENCE',
    STATUE = 'STATUE',
    PATH = 'PATH',
    MONUMENT = 'MONUMENT'
}

export interface DecorationItem {
    id: string;
    type: DecorationType;
    name: string;
    displayName: string;
    description: string;
    sprite: string;
    size: { width: number; height: number }; // Grid size
    cost: {
        logicStone?: number;
        dataWood?: number;
        gold?: number;
    };
    unlockRequirement?: string; // Quest or achievement ID
}

// Cosmetic items for player character
export const enum CosmeticSlot {
    HAT = 'HAT',
    ROBE = 'ROBE',
    WEAPON = 'WEAPON',
    PET = 'PET',
    BADGE = 'BADGE'
}

export interface CosmeticItem {
    id: string;
    slot: CosmeticSlot;
    name: string;
    displayName: string;
    description: string;
    sprite: string;
    vfx?: string; // Optional visual effect
    cost: {
        logicStone?: number;
        gold?: number;
    };
    unlockRequirement?: string;
}

// Example decorations and cosmetics
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

// Inventory system
export interface InventorySlot {
    item: Resource | DecorationItem | CosmeticItem | null;
    quantity: number;
    equipped?: boolean; // For cosmetics
}

export interface PlayerInventory {
    resources: Record<ResourceType, number>;
    decorations: DecorationItem[];
    cosmetics: CosmeticItem[];
    equippedCosmetics: Partial<Record<CosmeticSlot, string>>; // Slot -> item ID
    maxSlots: number;
}
