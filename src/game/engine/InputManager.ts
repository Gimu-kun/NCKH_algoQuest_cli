/**
 * Bộ Quản Lý Đầu Vào
 * Xử lý tất cả các đầu vào bàn phím và chuột cho game
 */

type KeyCallback = () => void;

interface KeyBinding {
    key: string;
    callback: KeyCallback;
    description: string;
    enabled: boolean;
}

class InputManager {
    private keyBindings: Map<string, KeyBinding> = new Map();
    private pressedKeys: Set<string> = new Set();

    constructor() {
        this.setupEventListeners();
        this.setupDefaultBindings();
    }

    private setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        this.pressedKeys.add(key);

        // Kiểm tra xem binding có tồn tại và đã bật hay chưa
        const binding = this.keyBindings.get(key);
        if (binding && binding.enabled) {
            event.preventDefault();
            binding.callback();
        }
    }

    private handleKeyUp(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        this.pressedKeys.delete(key);
    }

    /**
     * Đăng ký một key binding mới
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
     * Bật/tắt một binding cụ thể
     */
    public setEnabled(key: string, enabled: boolean) {
        const binding = this.keyBindings.get(key.toLowerCase());
        if (binding) {
            binding.enabled = enabled;
        }
    }

    /**
     * Kiểm tra xem phím hiện đang được nhấn hay không
     */
    public isKeyPressed(key: string): boolean {
        return this.pressedKeys.has(key.toLowerCase());
    }

    /**
     * Lấy tất cả các binding đã đăng ký (để hiển thị trong cài đặt)
     */
    public getBindings(): KeyBinding[] {
        return Array.from(this.keyBindings.values());
    }

    /**
     * Thiết lập các binding mặc định của game
     */
    private setupDefaultBindings() {
        // Các binding này sẽ bị ghi đè bởi các component
        // Chỉ thiết lập các phím chung ở đây
        this.bind('escape', () => {
            console.log('[InputManager] ESC pressed - should close modals');
        }, 'Đóng bảng/menu');
    }

    /**
     * Dọn dẹp
     */
    public destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.keyBindings.clear();
        this.pressedKeys.clear();
    }
}

// Instance đơn (Singleton)
export const inputManager = new InputManager();
export default inputManager;
