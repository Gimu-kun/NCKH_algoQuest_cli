/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ENGINE: BỘ QUẢN LÝ ĐẦU VÀO (Input Manager)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Xử lý tập trung tất cả các sự kiện đầu vào từ bàn phím (Keyboard Events).
 * Cung cấp API đơn giản để các module khác (Dungeon, Combat, UI) đăng ký nhận sự kiện
 * mà không cần trực tiếp lắng nghe `window.addEventListener`.
 * 
 * TÍNH NĂNG:
 * - Event Binding: Đăng ký hàm callback cho phím cụ thể (Bind/Unbind).
 * - State Tracking: Theo dõi trạng thái nhấn giữ (Pressed State) cho Continuous Movement.
 * - Input Suppression: Ngăn chặn hành vi mặc định của trình duyệt (Prevent Default).
 * - Context Awareness: (Future) Hỗ trợ switching giữa các context (Menu vs Gameplay).
 * 
 * FLOW HOẠT ĐỘNG:
 * 1. Khởi tạo: Lắng nghe `keydown`, `keyup`, `blur` global.
 * 2. Key Down Event:
 *    - Cập nhật `pressedKeys` Set (Thêm key).
 *    - Kiểm tra `keyBindings` Map.
 *    - Nếu có binding & enabled -> Trigger Callback.
 * 3. Key Up Event:
 *    - Cập nhật `pressedKeys` Set (Xóa key).
 * 4. Game Loop Query:
 *    - Các hệ thống khác gọi `isKeyPressed(key)` để kiểm tra trạng thái real-time.
 * 
 * KỸ THUẬT:
 * - Singleton Pattern: Đảm bảo chỉ có 1 instance quản lý input toàn cục.
 * - Event Delegation: Tập trung xử lý sự kiện tại root thay vì phân tán.
 * - Set Data Structure: Sử dụng `Set` để track các phím đang được giữ với độ phức tạp O(1).
 * 
 * @module InputManager
 * @category Game Engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

type KeyCallback = () => void;

interface KeyBinding {
    key: string;            // Tên phím (e.g., 'w', 'arrowup')
    callback: KeyCallback;  // Hàm xử lý khi nhấn
    description: string;    // Mô tả cho UI cài đặt
    enabled: boolean;       // Trạng thái bật/tắt binding này
}

class InputManager {
    // Map lưu trữ các binding: key_name -> binding_object
    private keyBindings: Map<string, KeyBinding> = new Map();
    // Set lưu trữ các phím đang được giữ (cho continuous movement)
    private pressedKeys: Set<string> = new Set();

    constructor() {
        this.setupEventListeners();
        this.setupDefaultBindings();
    }

    /**
     * Khởi tạo lắng nghe sự kiện DOM toàn cục
     */
    private setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));

        // Mất focus màn hình -> Reset phím để tránh kẹt phím
        window.addEventListener('blur', () => this.pressedKeys.clear());
    }

    /**
     * Xử lý khi nhấn phím
     */
    private handleKeyDown(event: KeyboardEvent) {
        const key = event.key.toLowerCase();

        // Tránh lặp lại event khi giữ phím (nếu HĐH tự repeat)
        // Tuy nhiên, ta vẫn track vào pressedKeys để game loop query
        this.pressedKeys.add(key);

        // Kiểm tra xem binding có tồn tại và đã bật hay chưa
        const binding = this.keyBindings.get(key);
        if (binding && binding.enabled) {
            // Ngăn chặn hành vi mặc định của trình duyệt (ví dụ: cuộn trang khi nhấn Space/Arrow)
            // Lưu ý: Cần cẩn thận nếu input vào text field
            const activeTag = document.activeElement?.tagName.toLowerCase();
            if (activeTag !== 'input' && activeTag !== 'textarea') {
                event.preventDefault();
                binding.callback();
            }
        }
    }

    /**
     * Xử lý khi thả phím
     */
    private handleKeyUp(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        this.pressedKeys.delete(key);
    }

    /**
     * Đăng ký một key binding mới
     * @param key Tên phím (lowercase)
     * @param callback Hàm gọi lại
     * @param description Mô tả hành động
     */
    public bind(key: string, callback: KeyCallback, description: string) {
        this.keyBindings.set(key.toLowerCase(), {
            key: key.toLowerCase(),
            callback,
            description,
            enabled: true
        });
    }

    /**
     * Gỡ bỏ một key binding
     */
    public unbind(key: string) {
        this.keyBindings.delete(key.toLowerCase());
    }

    /**
     * Bật/tắt một binding cụ thể (Pause/Resume inputs)
     */
    public setEnabled(key: string, enabled: boolean) {
        const binding = this.keyBindings.get(key.toLowerCase());
        if (binding) {
            binding.enabled = enabled;
        }
    }

    /**
     * Kiểm tra xem phím hiện đang được nhấn giữ hay không
     * Dùng cho Continuous Movement trong GameLoop
     */
    public isKeyPressed(key: string): boolean {
        return this.pressedKeys.has(key.toLowerCase());
    }

    /**
     * Lấy tất cả các binding đã đăng ký (để hiển thị trong menu Cài đặt)
     */
    public getBindings(): KeyBinding[] {
        return Array.from(this.keyBindings.values());
    }

    /**
     * Thiết lập các binding mặc định của hệ thống
     */
    private setupDefaultBindings() {
        // Phím ESC thường dùng để mở Menu hoặc Pause
        this.bind('escape', () => {
            // Logic mở menu pause sẽ được GameStore xử lý hoặc bind đè lên
            console.log('[InputManager] ESC pressed');
        }, 'Đóng bảng/Mở Menu');
    }

    /**
     * Hủy đăng ký sự kiện khi không dùng nữa (Component unmount)
     */
    public destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('blur', () => this.pressedKeys.clear());
        this.keyBindings.clear();
        this.pressedKeys.clear();
    }
}

// Export instance đơn (Singleton) để dùng chung toàn app
export const inputManager = new InputManager();
export default inputManager;
