/**
 * Tất Cả Cấu Hình Dungeon
 * Xuất tất cả 7 dungeon để truy cập dễ dàng
 */

import { DUNGEON_1, type DungeonConfig } from './dungeon1';

// Dungeon 2: Temple of Chaos (Chapter 2 - Search & Sort)
export const DUNGEON_2: DungeonConfig = {
    id: 'temple_of_chaos',
    name: 'Đền Thờ Hỗn Loạn',
    chapter: 2,
    description: 'Làm chủ tìm kiếm và sắp xếp trong mê cung hỗn loạn này',
    size: { width: 5, height: 5 },
    entrance: { x: 2, y: 0 },
    bossRoom: { x: 2, y: 4 },
    monsterRooms: [
        { x: 1, y: 1 }, { x: 3, y: 1 },
        { x: 0, y: 2 }, { x: 4, y: 2 },
        { x: 1, y: 3 }, { x: 3, y: 3 },
        { x: 2, y: 2 }
    ],
    treasureRooms: [
        { x: 0, y: 1 }, { x: 4, y: 1 }, { x: 2, y: 3 }
    ],
    requiredLevel: 3
};

// Dungeon 3: Chained Corridor (Chapter 3 - Linked Lists)
export const DUNGEON_3: DungeonConfig = {
    id: 'chained_corridor',
    name: 'Hành Lang Dây Xích',
    chapter: 3,
    description: 'Điều hướng qua các đường dẫn liên kết và câu đố con trỏ',
    size: { width: 6, height: 4 },
    entrance: { x: 0, y: 1 },
    bossRoom: { x: 5, y: 2 },
    monsterRooms: [
        { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 2 },
        { x: 4, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 0 }
    ],
    treasureRooms: [
        { x: 1, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 0 }
    ],
    requiredLevel: 5
};

// Dungeon 4: Dual Sanctuary (Chapter 4 - Stacks & Queues)
export const DUNGEON_4: DungeonConfig = {
    id: 'dual_sanctuary',
    name: 'Thánh Tích Hai Mặt',
    chapter: 4,
    description: 'Cân bằng cơ chế LIFO và FIFO',
    size: { width: 4, height: 6 },
    entrance: { x: 1, y: 0 },
    bossRoom: { x: 2, y: 5 },
    monsterRooms: [
        { x: 0, y: 1 }, { x: 3, y: 1 },
        { x: 1, y: 2 }, { x: 2, y: 2 },
        { x: 0, y: 3 }, { x: 3, y: 3 },
        { x: 1, y: 4 }
    ],
    treasureRooms: [
        { x: 2, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 4 }
    ],
    requiredLevel: 7
};

// Dungeon 5: Recursive Forest (Chapter 5 - Trees)
export const DUNGEON_5: DungeonConfig = {
    id: 'recursive_forest',
    name: 'Khu Rừng Đệ Quy',
    chapter: 5,
    description: 'Khám phá các đường dẫn phân nhánh và cấu trúc cây',
    size: { width: 7, height: 5 },
    entrance: { x: 3, y: 0 },
    bossRoom: { x: 3, y: 4 },
    monsterRooms: [
        { x: 1, y: 1 }, { x: 5, y: 1 },
        { x: 0, y: 2 }, { x: 3, y: 2 }, { x: 6, y: 2 },
        { x: 2, y: 3 }, { x: 4, y: 3 },
        { x: 1, y: 4 }, { x: 5, y: 4 }
    ],
    treasureRooms: [
        { x: 2, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 3 }
    ],
    requiredLevel: 9
};

// Dungeon 6: Infinite Library (Chapter 6 - Hash Tables)
export const DUNGEON_6: DungeonConfig = {
    id: 'infinite_library',
    name: 'Thư Viện Vô Hạn',
    chapter: 6,
    description: 'Băm (Hash) qua vô vàn kệ sách tri thức',
    size: { width: 6, height: 6 },
    entrance: { x: 0, y: 0 },
    bossRoom: { x: 5, y: 5 },
    monsterRooms: [
        { x: 1, y: 0 }, { x: 2, y: 1 }, { x: 4, y: 1 },
        { x: 0, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 },
        { x: 1, y: 3 }, { x: 4, y: 3 },
        { x: 2, y: 4 }, { x: 3, y: 5 }
    ],
    treasureRooms: [
        { x: 3, y: 0 }, { x: 1, y: 2 }, { x: 4, y: 4 }, { x: 0, y: 5 }
    ],
    requiredLevel: 11
};

// Dungeon 7: Corrupted Core (Endgame)
export const DUNGEON_7: DungeonConfig = {
    id: 'corrupted_core',
    name: 'Lõi Hư Không',
    chapter: 7,
    description: 'Thử thách cuối cùng - đối mặt với nguồn gốc của sự tham nhũng',
    size: { width: 7, height: 7 },
    entrance: { x: 3, y: 0 },
    bossRoom: { x: 3, y: 6 },
    monsterRooms: [
        { x: 2, y: 1 }, { x: 4, y: 1 },
        { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 },
        { x: 0, y: 3 }, { x: 6, y: 3 },
        { x: 1, y: 4 }, { x: 5, y: 4 },
        { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }
    ],
    treasureRooms: [
        { x: 3, y: 1 }, { x: 0, y: 2 }, { x: 6, y: 2 },
        { x: 3, y: 3 }, { x: 2, y: 4 }, { x: 4, y: 4 }
    ],
    requiredLevel: 15
};

// Export all dungeons
export const ALL_DUNGEONS = [
    DUNGEON_1,
    DUNGEON_2,
    DUNGEON_3,
    DUNGEON_4,
    DUNGEON_5,
    DUNGEON_6,
    DUNGEON_7
];

export { DUNGEON_1 };
export type { DungeonConfig } from './dungeon1';
