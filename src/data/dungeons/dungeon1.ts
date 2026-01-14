/**
<<<<<<< HEAD
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CẤU HÌNH HẦM NGỤC 1: ĐỀN THỜ HƯỚNG DẪN (Dungeon 1 Configuration)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc tĩnh (Static Configuration) cho màn chơi đầu tiên (Level 1).
 * Đây là nơi người chơi làm quen với cơ chế di chuyển và chiến đấu.
 * 
 * NỘI DUNG GIÁO DỤC (EDUCATIONAL CONTENT):
 * - Chủ đề: Tổng quan Thuật Toán & Độ Phức Tạp (Algorithm Complexity).
 * - Boss: Initialization Golem (Tượng vệ thần Khởi tạo).
 * 
 * DATA STRUCTURE:
 * - Grid System: Bản đồ lưới 5x5.
 * - Coordinates: Hệ tọa độ Descartes (x, y) với gốc (0,0) ở góc trên-trái.
 * 
 * @module Dungeon1Config
 * @category Game Data / Level Design
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Định nghĩa trạng thái của một Phòng trong Hầm Ngục (Dungeon Room State).
 */
export interface DungeonRoom {
    x: number; // Tọa độ X (Horizontal)
    y: number; // Tọa độ Y (Vertical)

    /** 
     * Loại phòng (Room Type):
     * - empty: Ô trống đi qua được.
     * - monster: Có quái vật (Combat Event).
     * - treasure: Có rương thưởng (Reward Event).
     * - boss: Phòng trùm cuối (Victory Condition).
     * - entrance: Điểm xuất phát.
     * - exit: Lối ra (sau khi thắng Boss).
     */
    type: 'empty' | 'monster' | 'treasure' | 'boss' | 'entrance' | 'exit';

    explored: boolean; // Đã khám phá (FoV System)
    cleared: boolean;  // Đã hoàn thành (Monster defeated / Treasure looted)
    description?: string; // Mô tả nội dung (Flavor text)
=======
 * Hầm Ngục 1: Đền Thờ Hướng Dẫn
 * Chương 1 - Tổng Quan Thuật Toán & Độ Phức Tạp
 */

export interface DungeonRoom {
    x: number;
    y: number;
    type: 'empty' | 'monster' | 'treasure' | 'boss' | 'entrance' | 'exit';
    explored: boolean;
    cleared: boolean;
    description?: string;
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
}

export interface DungeonConfig {
    id: string;
    name: string;
    chapter: number;
    description: string;
    size: { width: number; height: number };
    entrance: { x: number; y: number };
    bossRoom: { x: number; y: number };
    monsterRooms: { x: number; y: number }[];
    treasureRooms: { x: number; y: number }[];
    requiredLevel: number;
}

export const DUNGEON_1: DungeonConfig = {
    id: 'dungeon_1',
    name: 'Đền Thờ Hướng Dẫn',
    chapter: 1,
    description: 'Thử thách đầu tiên - Làm chủ kiến thức thuật toán cơ bản',
    size: { width: 5, height: 5 },
    entrance: { x: 0, y: 2 }, // Giữa bên trái
    bossRoom: { x: 4, y: 2 }, // Giữa bên phải
    monsterRooms: [
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 2, y: 0 },
        { x: 2, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 1 },
        { x: 3, y: 3 }
    ],
    treasureRooms: [
        { x: 1, y: 2 }, // Gần lối vào
        { x: 3, y: 2 }, // Trước phòng Boss
        { x: 2, y: 1 }  // Trung tâm
    ],
    requiredLevel: 1
};

/**
 * Sinh các phòng hầm ngục từ cấu hình (Generate dungeon rooms from config)
 */
import { DungeonGenerator } from '../../game/engine/DungeonGenerator';

/**
 * Sinh phòng sử dụng Bộ Sinh Tự Động (Procedural Generator)
 */
export function generateDungeonRooms(config: DungeonConfig): DungeonRoom[] {
    // Kiểm tra xem muốn dùng map tĩnh hay động
    // Hiện tại dùng bộ sinh động (dynamic generator)
    // Chúng ta có thể override tọa độ monsterRooms trong config nếu muốn
    // vì generator sẽ đặt chúng ngẫu nhiên dựa trên số lượng.

    return DungeonGenerator.generate(config);
}

export default DUNGEON_1;
