/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * BỘ SINH HẦM NGỤC TỰ ĐỘNG (Procedural Dungeon Generator)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Tạo ra Layout của hầm ngục (Dungeon) một cách ngẫu nhiên nhưng đảm bảo tính logic (Playability):
 * - Luôn có đường đi từ Entrance -> Boss.
 * - Phân bố quái vật và kho báu hợp lý.
 * - Đảm bảo không có phòng cô lập làm Player bị kẹt (Fully Accessible).
 * 
 * TÍNH NĂNG:
 * - Sinh bản đồ Grid 2D ngẫu nhiên (Map Generation).
 * - Đảm bảo tính liên thông (Connectivity Guarantee).
 * - Phân bố tài nguyên và thử thách cân bằng (Balanced Distribution).
 * 
 * THUẬT TOÁN:
 * 1. Initialize Grid: Tạo lưới 2D rỗng (kích thước theo Config).
 * 2. Place Markers: Đặt điểm đầu (Entrance) và điểm cuối (Boss).
 * 3. Pathfinding / Tunneling: Tạo đường nối (Critical Path) đảm bảo từ Entrance tới Boss.
 *    - Sử dụng Random Walk có định hướng (Biased Random Walk).
 * 4. Random Placement: Rải Monster và Treasure vào các ô trống còn lại.
 * 5. Fill Empty Rooms: Các ô null còn lại được chuyển thành phòng trống (Open Plan).
 * 
 * KỸ THUẬT:
 * - 2D Grid Representation: Dùng mảng 2 chiều để biểu diễn bản đồ.
 * - Procedural Content Generation (PCG): Sinh nội dung tự động theo thuật toán.
 * 
 * @module DungeonGenerator
 * @category Game Engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { DungeonConfig, DungeonRoom } from '../../data/dungeons/dungeon1';

interface Point {
    x: number;
    y: number;
}

export class DungeonGenerator {
    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * SINH HẦM NGỤC (Generate Dungeon)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Hàm chính để tạo ra danh sách các phòng (Rooms) cho một Level.
     * 
     * FLOW HOẠT ĐỘNG:
     * 1. Khởi tạo Grid RxC.
     * 2. Đặt Entrance và Boss theo Config (Fixed Points).
     * 3. Gọi `createPath` để nối Entrance và Boss (Path Generation).
     * 4. Gọi `placeRandomly` để đặt Monster và Treasure (Pacing).
     * 5. Duyệt lại Grid để tạo các phòng 'empty' cho các ô còn lại (Map Filling).
     * 6. Convert Grid -> Array of Room Objects (Serialization).
     * 
     * @param {DungeonConfig} config - Cấu hình (Kích thước, số lượng quái...).
     * @returns {DungeonRoom[]} Danh sách các phòng đã sinh ra.
     */
    static generate(config: DungeonConfig): DungeonRoom[] {
        const rooms: DungeonRoom[] = [];
        const width = config.size.width;
        const height = config.size.height;

        // Khởi tạo lưới 2D với giá trị null
        const grid: (DungeonRoom['type'] | null)[][] = Array(height).fill(null).map(() => Array(width).fill(null));

        // 1. Đặt Lối Vào (Entrance) - Thường là (0,0) hoặc từ Config
        const entrance = config.entrance;
        grid[entrance.y][entrance.x] = 'entrance';

        // 2. Đặt Phòng Boss (Boss Room) - Thường là (4,0) hoặc từ Config
        const boss = config.bossRoom;
        grid[boss.y][boss.x] = 'boss';

        // 3. Tạo đường đi chính tuyến (Critical Path) kết nối Entrance -> Boss
        this.createPath(grid, entrance, boss);

        // 4. Đặt Quái Vật và Kho Báu ngẫu nhiên
        // Lấy số lượng mong muốn từ độ dài mảng config
        const monsterCount = config.monsterRooms.length;
        const treasureCount = config.treasureRooms.length;

        this.placeRandomly(grid, 'monster', monsterCount, width, height);
        this.placeRandomly(grid, 'treasure', treasureCount, width, height);

        // 5. Điền đầy các ô còn lại thành phòng trống (Empty Room)
        // Mục đích: Tạo ra map 5x5 đầy đủ để Player tự do di chuyển (Open Plan)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!grid[y][x]) {
                    // Trong tương lai có thể thêm Logic Wall (Tường)
                    // Hiện tại để 'empty' cho đơn giản.
                    grid[y][x] = 'empty';
                }
            }
        }

        // 6. Chuyển đổi Grid thành mảng Room Objects
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const type = grid[y][x];
                if (type) {
                    rooms.push({
                        x,
                        y,
                        type: type as DungeonRoom['type'],
                        explored: type === 'entrance', // Entrance luôn Explored từ đầu
                        // Entrance, Empty và Treasure coi như Cleared ngay (hoặc sau khi nhặt)
                        // Monster/Boss cần đánh bại mới Cleared
                        cleared: type === 'entrance' || type === 'empty' || type === 'treasure'
                    });
                }
            }
        }

        return rooms;
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * TẠO ĐƯỜNG ĐI (Create Path)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Tạo đường nối giữa 2 điểm sử dụng thuật toán Random Walk có định hướng (Biased Random Walk).
     * Đảm bảo luôn có ít nhất một con đường để đi đến đích (Guarantee Reachability).
     * 
     * THUẬT TOÁN:
     * - Bắt đầu từ `start`.
     * - Trong khi chưa tới `end`:
     *   - Di chuyển 1 bước về phía `end` (có thể Random X hoặc Y trước).
     *   - Nếu ô đó chưa có gì, đặt là 'empty'.
     * 
     * @param grid - Lưới bản đồ.
     * @param start - Điểm bắt đầu.
     * @param end - Điểm kết thúc.
     */
    private static createPath(
        grid: (string | null)[][],
        start: Point,
        end: Point
    ) {
        const current = { ...start };

        // Di chuyển cho đến khi trùng tọa độ đích
        while (current.x !== end.x || current.y !== end.y) {
            // Nếu ô hiện tại chưa set loại phòng, set là 'empty' để đánh dấu đường đi
            // (Tránh ghi đè lên Boss hoặc Entrance nếu Loop chạm vào)
            if (!grid[current.y][current.x]) {
                grid[current.y][current.x] = 'empty';
            }

            // Simple Dog-leg Pathfinding: Di chuyển X rồi đến Y hoặc ngược lại
            // Để sinh động hơn có thể Random chọn đi X hoặc Y ở mỗi bước
            if (current.x < end.x) current.x++;
            else if (current.x > end.x) current.x--;
            else if (current.y < end.y) current.y++;
            else if (current.y > end.y) current.y--;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * ĐẶT PHÒNG NGẪU NHIÊN (Place Randomly)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Đặt một loại phòng (Monster/Treasure) vào vị trí ngẫu nhiên còn trống trên lưới.
     * 
     * @param grid - Lưới bản đồ.
     * @param type - Loại phòng cần đặt ('monster', 'treasure').
     * @param count - Số lượng cần đặt.
     * @param width - Chiều rộng lưới.
     * @param height - Chiều cao lưới.
     */
    private static placeRandomly(
        grid: (string | null)[][],
        type: string,
        count: number,
        width: number,
        height: number
    ) {
        let placed = 0;
        let attempts = 0;

        // Cố gắng đặt đủ số lượng (tối đa 100 lần thử để tránh Infinite Loop)
        while (placed < count && attempts < 100) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);

            // Chỉ đặt vào ô chưa có gì (null)
            if (!grid[y][x]) {
                grid[y][x] = type;
                placed++;
            }
            attempts++;
        }
    }
}
