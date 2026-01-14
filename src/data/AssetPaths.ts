/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUẢN LÝ ĐƯỜNG DẪN TÀI NGUYÊN (Asset Path Management)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Central Repository (Kho lưu trữ trung tâm) cho tất cả đường dẫn (paths) tới assets của game:
 * - Hình ảnh (Images/Sprites)
 * - UI Elements (Icons, Backgrounds)
 * - Audio files (Future)
 * 
 * LỢI ÍCH:
 * - Single Source of Truth: Tránh hardcode đường dẫn rải rác trong code.
 * - Refactoring dễ dàng: Chỉ cần sửa path ở một nơi.
 * - Type Safety: Giúp IDE gợi ý code và tránh lỗi typo.
 * 
 * KỸ THUẬT:
 * - Constant Object (`ASSETS`): Group các assets theo category.
 * - Helper Functions: Logic để lấy asset dynamic dựa trên ID hoặc Type.
 * 
 * @module AssetPaths
 * @category Data Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

<<<<<<< HEAD
const ASSET_BASE = '/assets/Ảnh Assets';
=======
const ASSET_BASE = '/src/assets/Ảnh Assets';
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b

export const ASSETS = {
    // ========== LOGOS & BRANDING ==========
    LOGO: `${ASSET_BASE}/Game Logo.png`,

    // ========== BACKGROUNDS (Nền) ==========
    BACKGROUNDS: {
        MAIN_MENU: `${ASSET_BASE}/Main Menu Background.png`,
        HUB_WORLD: `${ASSET_BASE}/Hub World Concept.png`,
    },

    // ========== CUTSCENES (Phân cảnh) ==========
    CUTSCENES: {
        OPENING: `${ASSET_BASE}/Mở Đầu Sự Sụp Đổ (The Shattering).png`,
        ENDING: `${ASSET_BASE}/Kết Thúc Sự Tái Sinh (The Restoration).png`,
    },

    // ========== DUNGEON BACKGROUNDS (Nền Ải) ==========
    DUNGEONS: {
        DUNGEON_1: `${ASSET_BASE}/Ải/Ải 1 Đền Thờ Hướng Dẫn (The Tutorial Temple).png`,
        DUNGEON_2: `${ASSET_BASE}/Ải/Ải 2 Đền Thờ Hỗn Loạn (The Chaotic Library).png`,
        DUNGEON_3: `${ASSET_BASE}/Ải/Ải 3 Hành Lang Dây Xích (The Chain Corridor).png`,
        DUNGEON_4: `${ASSET_BASE}/Ải/Ải 4 Thánh Tích Hai Mặt (The Two-Faced Relic).png`,
        DUNGEON_5: `${ASSET_BASE}/Ải/Ải 5 Khu Rừng Đệ Quy (The Recursive Forest).png`,
        DUNGEON_6: `${ASSET_BASE}/Ải/Ải Cuối Lõi Hư Không (The Corrupted Core).png`,
    },

    // ========== RESOURCES/ITEMS (Tài nguyên/Vật phẩm) ==========
    RESOURCES: {
        DATA_WOOD: `${ASSET_BASE}/Vật Phẩm/Data-Wood.png`,
        LOGIC_STONE: `${ASSET_BASE}/Vật Phẩm/Logic-Stone.png`,
        O_POINT: `${ASSET_BASE}/Vật Phẩm/O-Point.png`,
        GOLD: `${ASSET_BASE}/Vật Phẩm/Gold Coin.png`,
    },

    // ========== UI ELEMENTS (Thành phần giao diện) ==========
    UI: {
        // Icons
        ALERT_BUG: `${ASSET_BASE}/UI/Alert Icon Bug.png`,
        ALERT_LIGHTBULB: `${ASSET_BASE}/UI/Alert Icon Lightbulb.png`,

        // Buttons
        BUTTON_BAG: `${ASSET_BASE}/UI/Menu Buttons Bag.png`,
        BUTTON_MAP: `${ASSET_BASE}/UI/Menu Buttons Map.png`,
        BUTTON_QUEST: `${ASSET_BASE}/UI/Menu Buttons Quest.png`,
        BUTTON_EXIT: `${ASSET_BASE}/UI/Menu Buttons Exit.png`,

        // HUD
        PLAYER_STATUS_HUD: `${ASSET_BASE}/UI/Player Status HUD.png`,
<<<<<<< HEAD
=======
        DIALOGUE_BOX: `${ASSET_BASE}/UI/Dialogue UI Box.png`,
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        CODING_CONSOLE: `${ASSET_BASE}/UI/Coding Console UI.png`,

        // Inventory
        INVENTORY_SLOT: `${ASSET_BASE}/UI/Inventory Slot.png`,
        SELECTED_SLOT: `${ASSET_BASE}/UI/Selected Slot.png`,
        SKILL_FRAME: `${ASSET_BASE}/UI/Skill Icon Frame.png`,
    },

    // ========== CHARACTERS (Nhân vật & NPCs) ==========
    CHARACTERS: {
<<<<<<< HEAD
        SPARKY_NORMAL: `${ASSET_BASE}/Nhân vật/Sparky/Sparky (Normal).png`,
        SPARKY_ALERT: `${ASSET_BASE}/Nhân vật/Sparky/Sparky (Alert).png`,
        SPARKY_ERROR: `${ASSET_BASE}/Nhân vật/Sparky/Sparky (Synax Error).png`,
        SPARKY_SUCCESS: `${ASSET_BASE}/Nhân vật/Sparky/Sparky (Normal).png`, // Fallback as no success sprite

        PROFESSOR_ALRIC: `${ASSET_BASE}/Nhân vật/Giáo Sư Alric (The Mentor)/Giáo Sư Alric (Idle).png`,
        LINH: `${ASSET_BASE}/Nhân vật/Linh (The Archivist)/Linh (Idle).png`,
        BORK: `${ASSET_BASE}/Nhân vật/Bork (The Blacksmith)/Bork (Idle).png`,
        GUILD_LEADER: `${ASSET_BASE}/Nhân vật/Thủ Lĩnh Guild (The Guild Leader)/Thủ Lĩnh Guild (Idle).png`,
=======
        SPARKY_NORMAL: `${ASSET_BASE}/Nhân vật/Sparky/Sparky Normal.png`,
        SPARKY_ALERT: `${ASSET_BASE}/Nhân vật/Sparky/Sparky Alert.png`,
        SPARKY_ERROR: `${ASSET_BASE}/Nhân vật/Sparky/Sparky Error.png`,
        SPARKY_SUCCESS: `${ASSET_BASE}/Nhân vật/Sparky/Sparky Success.png`,

        PROFESSOR_ALRIC: `${ASSET_BASE}/Nhân vật/Professor Alric.png`,
        LINH: `${ASSET_BASE}/Nhân vật/Linh (The Archivist).png`,
        BORK: `${ASSET_BASE}/Nhân vật/Bork (The Blacksmith).png`,
        GUILD_LEADER: `${ASSET_BASE}/Nhân vật/Guild Leader.png`,
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
    }
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY ICON TÀI NGUYÊN (Get Resource Icon)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Helper function để lấy đường dẫn icon dựa trên loại tài nguyên (ResourceType).
 * 
 * @param {string} resourceType - Loại tài nguyên (ví dụ: 'DATA_WOOD', 'O_POINTS').
 * @returns {string} Đường dẫn tới file ảnh icon.
 */
export function getResourceIcon(resourceType: string): string {
    switch (resourceType) {
        case 'DATA_WOOD':
            return ASSETS.RESOURCES.DATA_WOOD;
        case 'LOGIC_STONE':
            return ASSETS.RESOURCES.LOGIC_STONE;
        case 'O_POINTS':
        case 'O_POINT':
            return ASSETS.RESOURCES.O_POINT;
        case 'GOLD':
            return ASSETS.RESOURCES.GOLD;
        default:
            return ASSETS.RESOURCES.O_POINT;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY ẢNH NỀN DUNGEON (Get Dungeon Background)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Lấy ảnh nền phù hợp cho Dungeon dựa trên ID.
 * 
 * LOGIC XỬ LÝ:
 * - Trích xuất số từ dungeonId (ví dụ: 'dungeon_1' -> 1).
 * - Map số này với background tương ứng trong ASSETS.DUNGEONS.
 * 
 * @param {string} dungeonId - ID của dungeon.
 * @returns {string} Đường dẫn tới ảnh nền.
 */
export function getDungeonBackground(dungeonId: string): string {
    const dungeonNumber = parseInt(dungeonId.replace(/\D/g, ''));

    switch (dungeonNumber) {
        case 1:
            return ASSETS.DUNGEONS.DUNGEON_1;
        case 2:
            return ASSETS.DUNGEONS.DUNGEON_2;
        case 3:
            return ASSETS.DUNGEONS.DUNGEON_3;
        case 4:
            return ASSETS.DUNGEONS.DUNGEON_4;
        case 5:
            return ASSETS.DUNGEONS.DUNGEON_5;
        case 6:
        case 7:
            return ASSETS.DUNGEONS.DUNGEON_6;
        default:
            return ASSETS.DUNGEONS.DUNGEON_1;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY ICON SPARKY THEO TRẠNG THÁI (Get Sparky Icon by State)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Lấy ảnh biểu cảm của Sparky (AI Assistant) dựa trên trạng thái cảm xúc.
 * 
 * STATES:
 * - normal: Trạng thái bình thường.
 * - alert: Cảnh báo hoặc chú ý.
 * - error: Khi player làm sai hoặc gặp lỗi cú pháp.
 * - success: Khi player trả lời đúng.
 * 
 * @param {'normal' | 'alert' | 'error' | 'success'} state - Trạng thái của Sparky.
 * @returns {string} Đường dẫn tới ảnh Sparky.
 */
export function getSparkyIcon(state: 'normal' | 'alert' | 'error' | 'success'): string {
    switch (state) {
        case 'alert':
            return ASSETS.CHARACTERS.SPARKY_ALERT;
        case 'error':
            return ASSETS.CHARACTERS.SPARKY_ERROR;
        case 'success':
            return ASSETS.CHARACTERS.SPARKY_SUCCESS;
        default:
            return ASSETS.CHARACTERS.SPARKY_NORMAL;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DANH SÁCH PRELOAD ASSETS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MỤC ĐÍCH:
 * Danh sách các assets quan trọng cần được tải trước (Preload) khi game khởi động
 * để tránh hiện tượng "nháy" hoặc load chậm khi chuyển cảnh.
 */
export const PRELOAD_ASSETS = [
    ASSETS.LOGO,
    ASSETS.BACKGROUNDS.MAIN_MENU,
    ASSETS.BACKGROUNDS.HUB_WORLD,
    ASSETS.CHARACTERS.SPARKY_NORMAL,
    ASSETS.UI.PLAYER_STATUS_HUD,
    ASSETS.RESOURCES.O_POINT,
    ASSETS.RESOURCES.LOGIC_STONE,
];

export default ASSETS;
