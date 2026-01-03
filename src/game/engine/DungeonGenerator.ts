/**
 * Bộ Sinh Hầm Ngục Tự Động
 * Sử dụng thuật toán Random Walk / Grid placement được sửa đổi để đảm bảo kết nối
 */

import type { DungeonConfig, DungeonRoom } from '../../data/dungeons/dungeon1';

interface Point {
    x: number;
    y: number;
}

export class DungeonGenerator {
    /**
     * Sinh layout hầm ngục ngẫu nhiên
     */
    static generate(config: DungeonConfig): DungeonRoom[] {
        const rooms: DungeonRoom[] = [];
        const width = config.size.width;
        const height = config.size.height;

        // Khởi tạo lưới
        const grid: (DungeonRoom['type'] | null)[][] = Array(height).fill(null).map(() => Array(width).fill(null));

        // 1. Đặt Lối Vào (Cố định hoặc Ngẫu nhiên nếu không chỉ định)
        // Với triển khai này, chúng ta sẽ tôn trọng lối vào của config nếu có thể
        const entrance = config.entrance;
        grid[entrance.y][entrance.x] = 'entrance';

        // 2. Đặt Boss (Cố định từ config hiện tại, để đảm bảo khớp với vị trí lịch sử nếu cụ thể)
        const boss = config.bossRoom;
        grid[boss.y][boss.x] = 'boss';

        // 3. Tạo đường đi từ Lối Vào đến Boss (đảm bảo kết nối)
        this.createPath(grid, entrance, boss);

        // 4. Đặt Quái Vật và Kho Báu ngẫu nhiên vào các vị trí trống có thể tiếp cận
        // Chúng ta cần đếm số lượng phòng quái/kho báu mà config mong đợi
        // hoặc chỉ sử dụng một hệ số mật độ.
        const monsterCount = config.monsterRooms.length; // Sử dụng độ dài làm số lượng mong muốn
        const treasureCount = config.treasureRooms.length;

        this.placeRandomly(grid, 'monster', monsterCount, width, height);
        this.placeRandomly(grid, 'treasure', treasureCount, width, height);

        // 5. Fill remaining accessible connected spots with 'empty' rooms or keep them null (walls)
        // For our grid-based movement, we usually want a full grid or a sparse connected grid.
        // Let's make it a sparse connected grid (rooms vs walls).
        // Current logic in Dungeon.tsx might expect a full 5x5 grid.
        // Let's assume we fill the rest with 'empty' to maintain the "open plan" style 
        // OR distinct rooms. Let's start with filling all nulls as 'empty' 
        // but marking them so we know which are "generated" vs "walls" in future.
        // For now, simpler: Fill all nulls as 'empty' rooms so the user can walk everywhere.

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!grid[y][x]) {
                    // Random chance to be a "wall" (unwalkable) could be cool, 
                    // but for this specific "Temple" 5x5, let's keep it fully walkable for now
                    // or maybe 10% walls?
                    grid[y][x] = 'empty';
                }
            }
        }

        // Convert grid to Room objects
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const type = grid[y][x];
                if (type) {
                    rooms.push({
                        x,
                        y,
                        type: type as any,
                        explored: type === 'entrance',
                        cleared: type === 'entrance' || type === 'empty' || type === 'treasure' // Treasure clears on pickup, empty clears immediately
                    });
                }
            }
        }

        return rooms;
    }

    /**
     * Tìm đường đơn giản (Random Walk với xu hướng) để đảm bảo điểm bắt đầu kết nối với điểm kết thúc
     */
    private static createPath(
        grid: (string | null)[][],
        start: Point,
        end: Point
    ) {
        let current = { ...start };

        // Di chuyển theo kiểu dog-leg hoặc random walk hướng vào mục tiêu
        while (current.x !== end.x || current.y !== end.y) {
            // Đặt phòng trống nếu chưa có gì ở đó
            if (!grid[current.y][current.x]) {
                grid[current.y][current.x] = 'empty';
            }

            // Di chuyển gần hơn
            if (current.x < end.x) current.x++;
            else if (current.x > end.x) current.x--;
            else if (current.y < end.y) current.y++;
            else if (current.y > end.y) current.y--;

            // Or add some randomness so it's not a straight line?
            // For 5x5 it's small enough that direct path is fine, 
            // but we can add "branches" later.
        }
    }

    private static placeRandomly(
        grid: (string | null)[][],
        type: string,
        count: number,
        width: number,
        height: number
    ) {
        let placed = 0;
        let attempts = 0;
        while (placed < count && attempts < 100) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);

            if (!grid[y][x]) {
                grid[y][x] = type;
                placed++;
            }
            attempts++;
        }
    }
}
