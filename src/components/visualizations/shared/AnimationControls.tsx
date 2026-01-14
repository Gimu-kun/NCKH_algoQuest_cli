/**
 * =============================================================================
 * FILE: AnimationControls.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Tạo component điều khiển animations cho các Algorithm Visualizations.
 * - Cho phép user: Play/Pause, Step forward/backward, Reset, và điều chỉnh Speed.
 *
 * CHỨC NĂNG CHI TIẾT (Detailed Functionality):
 * 1. Play/Pause Button: Toggle giữa trạng thái chạy tự động và dừng.
 * 2. Step Controls: Tiến/lùi từng bước để xem chi tiết từng iteration.
 * 3. Reset Button: Đưa visualization về trạng thái ban đầu.
 * 4. Speed Slider: Điều chỉnh tốc độ animation (0.25x → 4x).
 * 5. Progress Bar: Hiển thị tiến độ hiện tại (step X / total steps).
 *
 * KỸ THUẬT SỬ DỤNG (Techniques):
 * 1. React Functional Component với TypeScript: Type-safe, predictable.
 * 2. Framer Motion: Animations mượt mà cho buttons và transitions.
 * 3. Controlled Component Pattern: Parent quản lý state, child nhận props.
 * 4. Event Handling: onClick, onChange handlers được lift up (Lifting State Up).
 *
 * STEPS FLOW (Luồng hoạt động):
 * 1. Parent component (VD: SortingVisualizer) truyền props xuống.
 * 2. User tương tác với controls → triggers callbacks.
 * 3. Parent cập nhật state → re-render với animations mới.
 *
 * SO SÁNH VỚI CÁC PHƯƠNG PHÁP KHÁC:
 * - Uncontrolled Component: Đơn giản hơn nhưng khó sync với parent.
 * - Context API: Có thể dùng nếu controls cần share across nhiều components.
 * - Redux/Zustand: Overkill cho use case này, local state đủ dùng.
 * → Chọn Controlled Component: Đơn giản, dễ debug, phù hợp với scope.
 *
 * ƯU ĐIỂM (Advantages):
 * - Reusable: Có thể dùng cho mọi loại visualization.
 * - Customizable: Props cho phép điều chỉnh behavior linh hoạt.
 * - Accessible: Buttons có aria-labels và keyboard support.
 *
 * NHƯỢC ĐIỂM (Disadvantages):
 * - Parent phải quản lý nhiều state (isPlaying, speed, currentStep, etc.).
 * - Cần nhiều props, có thể refactor thành Context nếu cây component sâu.
 *
 * =============================================================================
 */

import React from 'react';
import { motion } from 'framer-motion';
import './VisualizationStyles.css';

// =============================================================================
// TYPES & INTERFACES - Định nghĩa kiểu dữ liệu TypeScript
// =============================================================================

/**
 * Interface AnimationControlsProps
 * 
 * Định nghĩa các props mà component này nhận từ parent.
 * Sử dụng TypeScript interfaces để:
 * - Type checking tại compile time.
 * - IntelliSense/autocomplete trong IDE.
 * - Documentation cho developers.
 */
interface AnimationControlsProps {
    /**
     * isPlaying: Trạng thái animation đang chạy hay đang pause.
     * Type: boolean
     * - true: Animation đang auto-play.
     * - false: Animation đang dừng/pause.
     */
    isPlaying: boolean;

    /**
     * onPlayPause: Callback khi user click Play/Pause button.
     * Không có tham số, parent sẽ toggle state.
     */
    onPlayPause: () => void;

    /**
     * onStepForward: Callback khi user muốn tiến 1 bước.
     * Optional vì một số visualizations không cần step controls.
     */
    onStepForward?: () => void;

    /**
     * onStepBackward: Callback khi user muốn lùi 1 bước.
     * Optional - không phải algo nào cũng cho phép đi lùi.
     */
    onStepBackward?: () => void;

    /**
     * onReset: Callback khi user muốn reset về trạng thái ban đầu.
     */
    onReset: () => void;

    /**
     * speed: Tốc độ animation hiện tại (multiplier).
     * Type: number
     * - 0.25: Rất chậm (1/4 tốc độ bình thường)
     * - 0.5: Chậm
     * - 1: Bình thường
     * - 2: Nhanh
     * - 4: Rất nhanh
     */
    speed: number;

    /**
     * onSpeedChange: Callback khi user thay đổi speed.
     * Parameter: newSpeed - giá trị speed mới.
     */
    onSpeedChange: (newSpeed: number) => void;

    /**
     * currentStep: Bước hiện tại trong chuỗi animation.
     * Type: number (0-indexed hoặc 1-indexed tùy parent).
     */
    currentStep: number;

    /**
     * totalSteps: Tổng số bước trong chuỗi animation.
     * Dùng để tính progress percentage.
     */
    totalSteps: number;

    /**
     * disabled: Vô hiệu hóa tất cả controls.
     * Optional, default = false.
     * Dùng khi visualization chưa sẵn sàng hoặc đang loading.
     */
    disabled?: boolean;

    /**
     * canStepBackward: Cho phép nút Step Backward không.
     * Optional, default = true nếu onStepBackward được cung cấp.
     */
    canStepBackward?: boolean;

    /**
     * canStepForward: Cho phép nút Step Forward không.
     * Optional, default = true nếu onStepForward được cung cấp.
     */
    canStepForward?: boolean;
}

// =============================================================================
// CONSTANTS - Các hằng số cấu hình
// =============================================================================

/**
 * SPEED_OPTIONS: Các mức speed có sẵn cho slider.
 * 
 * Thiết kế theo Logarithmic Scale (thang đo log):
 * - Khoảng cách giữa 0.25 → 0.5 → 1 tương đương 1 → 2 → 4
 * - Phù hợp với cảm nhận của con người về "tốc độ"
 * 
 * So sánh với Linear Scale:
 * - Linear [0.25, 0.5, 0.75, 1.0, 1.25, ...]: Ít hữu ích ở tốc độ cao
 * - Logarithmic: Mỗi step cảm giác thay đổi đều hơn
 */
const SPEED_OPTIONS: { value: number; label: string }[] = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' },
];

/**
 * Framer Motion Variants
 * 
 * Định nghĩa các animation states cho buttons.
 * Sử dụng Variants Pattern của Framer Motion:
 * - Centralized: Tất cả animations ở 1 chỗ, dễ quản lý.
 * - Reusable: Apply cho nhiều elements.
 * - Orchestration: Dễ chain và stagger animations.
 */
const buttonVariants = {
    // Trạng thái hover - phóng to nhẹ
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 }
    },
    // Trạng thái tap/click - thu nhỏ tạo feedback
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
    }
};

// =============================================================================
// COMPONENT: AnimationControls
// =============================================================================

/**
 * AnimationControls Component
 * 
 * Component điều khiển animations cho Algorithm Visualizations.
 * 
 * @param props - AnimationControlsProps
 * @returns JSX.Element
 * 
 * Design Pattern: Controlled Component
 * - Component không có internal state riêng.
 * - Tất cả data và handlers đến từ props (parent).
 * - Single source of truth = parent's state.
 */
const AnimationControls: React.FC<AnimationControlsProps> = ({
    isPlaying,
    onPlayPause,
    onStepForward,
    onStepBackward,
    onReset,
    speed,
    onSpeedChange,
    currentStep,
    totalSteps,
    disabled = false,
    canStepBackward = true,
    canStepForward = true,
}) => {
    // =========================================================================
    // COMPUTED VALUES - Các giá trị được tính toán từ props
    // =========================================================================

    /**
     * progressPercentage: Phần trăm tiến độ hiện tại.
     * Công thức: (currentStep / totalSteps) * 100
     * 
     * Edge cases handled:
     * - totalSteps = 0: Tránh division by zero, return 0.
     * - currentStep > totalSteps: Cap ở 100%.
     */
    const progressPercentage = totalSteps > 0
        ? Math.min((currentStep / totalSteps) * 100, 100)
        : 0;

    /**
     * isAtStart: Đang ở bước đầu tiên không?
     * Dùng để disable nút Step Backward.
     */
    const isAtStart = currentStep <= 0;

    /**
     * isAtEnd: Đã hoàn thành tất cả steps chưa?
     * Dùng để disable nút Step Forward và auto-pause.
     */
    const isAtEnd = currentStep >= totalSteps;

    // =========================================================================
    // EVENT HANDLERS - Xử lý các sự kiện
    // =========================================================================

    /**
     * handleSpeedChange: Xử lý khi user thay đổi slider speed.
     * 
     * @param e - React ChangeEvent từ input range
     * 
     * Flow:
     * 1. Parse value từ string sang number (input range trả về string).
     * 2. Map index thành giá trị speed thực tế từ SPEED_OPTIONS.
     * 3. Gọi callback onSpeedChange để update parent state.
     */
    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(e.target.value, 10);
        const newSpeed = SPEED_OPTIONS[index]?.value || 1;
        onSpeedChange(newSpeed);
    };

    /**
     * getCurrentSpeedIndex: Tìm index của speed hiện tại trong SPEED_OPTIONS.
     * 
     * Dùng Array.findIndex để tìm vị trí.
     * Fallback về index 2 (speed = 1x) nếu không tìm thấy.
     */
    const getCurrentSpeedIndex = (): number => {
        const index = SPEED_OPTIONS.findIndex(opt => opt.value === speed);
        return index >= 0 ? index : 2; // Default to 1x
    };

    // =========================================================================
    // RENDER - JSX Output
    // =========================================================================

    return (
        <div className="animation-controls">
            {/* -----------------------------------------------------------
                PROGRESS BAR SECTION - Thanh tiến độ
                -----------------------------------------------------------
                Hiển thị:
                - Thanh progress bar với width = progressPercentage
                - Text "Step X / Y"
                ----------------------------------------------------------- */}
            <div className="controls-progress">
                <div className="progress-bar-container">
                    {/* 
                        motion.div: Sử dụng Framer Motion cho animated width.
                        
                        Kỹ thuật: Layout Animation
                        - animate={{ width }}: Animate width khi value thay đổi.
                        - transition: spring animation cho feel tự nhiên.
                        
                        So sánh với CSS transition:
                        - CSS: width transition chỉ linear hoặc basic easing.
                        - Framer Motion: Spring physics, more natural feel.
                    */}
                    <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                    />
                </div>
                <span className="progress-text">
                    Bước {currentStep} / {totalSteps}
                </span>
            </div>

            {/* -----------------------------------------------------------
                MAIN CONTROLS SECTION - Các nút điều khiển chính
                ----------------------------------------------------------- */}
            <div className="controls-buttons">
                {/* -----------------------------------------------------
                    RESET BUTTON - Nút Reset
                    ----------------------------------------------------- 
                    Chức năng: Đưa visualization về trạng thái ban đầu.
                    Icon: ⟲ (rotation arrow symbol)
                    ----------------------------------------------------- */}
                <motion.button
                    className="control-btn control-btn--reset"
                    onClick={onReset}
                    disabled={disabled}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Reset animation"
                    title="Reset (R)"
                >
                    <i className="fi fi-rr-refresh"></i>
                </motion.button>

                {/* -----------------------------------------------------
                    STEP BACKWARD BUTTON - Nút lùi 1 bước
                    -----------------------------------------------------
                    Conditional Rendering:
                    - Chỉ render nếu onStepBackward được cung cấp.
                    - Disabled khi: đang disabled, đang ở đầu, hoặc canStepBackward = false.
                    ----------------------------------------------------- */}
                {onStepBackward && (
                    <motion.button
                        className="control-btn control-btn--step"
                        onClick={onStepBackward}
                        disabled={disabled || isAtStart || !canStepBackward}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Step backward"
                        title="Lùi 1 bước (←)"
                    >
                        <i className="fi fi-rr-rewind"></i>
                    </motion.button>
                )}

                {/* -----------------------------------------------------
                    PLAY/PAUSE BUTTON - Nút Play/Pause chính
                    -----------------------------------------------------
                    Design:
                    - Nút lớn nhất, nổi bật nhất (primary action).
                    - Icon thay đổi dựa trên trạng thái isPlaying.
                    
                    Accessibility:
                    - aria-label động dựa trên state.
                    - Có thể thêm keyboard shortcut (Space).
                    ----------------------------------------------------- */}
                <motion.button
                    className={`control-btn control-btn--primary ${isPlaying ? 'is-playing' : ''}`}
                    onClick={onPlayPause}
                    disabled={disabled || (isAtEnd && !isPlaying)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                    {/* 
                        Conditional Icon:
                        - isPlaying = true: Hiện icon Pause (⏸)
                        - isPlaying = false: Hiện icon Play (▶)
                        
                        AnimatePresence có thể dùng để animate giữa 2 icons,
                        nhưng ở đây đơn giản nên dùng conditional render.
                    */}
                    {isPlaying ? <i className="fi fi-rr-pause"></i> : <i className="fi fi-rr-play"></i>}
                </motion.button>

                {/* -----------------------------------------------------
                    STEP FORWARD BUTTON - Nút tiến 1 bước
                    -----------------------------------------------------
                    Mirror logic của Step Backward nhưng cho hướng tiến.
                    ----------------------------------------------------- */}
                {onStepForward && (
                    <motion.button
                        className="control-btn control-btn--step"
                        onClick={onStepForward}
                        disabled={disabled || isAtEnd || !canStepForward}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Step forward"
                        title="Tiến 1 bước (→)"
                    >
                        <i className="fi fi-rr-forward"></i>
                    </motion.button>
                )}
            </div>

            {/* -----------------------------------------------------------
                SPEED CONTROL SECTION - Điều chỉnh tốc độ
                -----------------------------------------------------------
                Sử dụng HTML5 Range Input.
                
                Kỹ thuật: Discrete Steps
                - min/max/step: Định nghĩa các discrete values.
                - mapping index → actual speed value.
                
                So sánh với alternatives:
                - Dropdown/Select: Ít visual feedback.
                - Number Input: Khó dùng, dễ nhập sai.
                - Range Slider: Intuitive, visual, dễ dùng.
                ----------------------------------------------------------- */}
            <div className="controls-speed">
                <label className="speed-label">
                    Tốc độ: <span className="speed-value">{speed}x</span>
                </label>
                <div className="speed-slider-container">
                    {/* Speed markers - Nhãn cho từng mức speed */}
                    <span className="speed-marker">Chậm</span>
                    <input
                        type="range"
                        className="speed-slider"
                        min={0}
                        max={SPEED_OPTIONS.length - 1}
                        step={1}
                        value={getCurrentSpeedIndex()}
                        onChange={handleSpeedChange}
                        disabled={disabled}
                        aria-label="Animation speed"
                    />
                    <span className="speed-marker">Nhanh</span>
                </div>
            </div>

            {/* -----------------------------------------------------------
                INLINE STYLES - CSS cho component này
                -----------------------------------------------------------
                Lý do dùng inline styles trong JSX:
                - Self-contained: Component hoạt động độc lập.
                - Co-location: Styles gần với logic sử dụng chúng.
                
                Trade-off:
                - Inline styles khó override và không hỗ trợ pseudo-classes.
                - Nên chuyển sang CSS file nếu component phức tạp hơn.
                
                Ở đây dùng <style> tag để có full CSS features.
                ----------------------------------------------------------- */}
            <style>{`
                /* Container chính của controls */
                .animation-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 16px 20px;
                    background: var(--viz-bg-glass, rgba(255, 255, 255, 0.05));
                    border-radius: var(--viz-border-radius-sm, 8px);
                    border: 1px solid var(--viz-border-primary, rgba(255, 255, 255, 0.1));
                }

                /* Progress Bar Section */
                .controls-progress {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .progress-bar-container {
                    flex: 1;
                    height: 8px;
                    background: var(--viz-bg-secondary, rgba(30, 41, 59, 0.9));
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        var(--viz-color-normal, #4a90d9),
                        var(--viz-color-found, #06b6d4)
                    );
                    border-radius: 4px;
                }

                .progress-text {
                    font-size: 0.85rem;
                    color: var(--viz-text-secondary, #94a3b8);
                    white-space: nowrap;
                    min-width: 100px;
                    text-align: right;
                }

                /* Buttons Section */
                .controls-buttons {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                }

                /* Base button styles */
                .control-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    border: 1px solid var(--viz-border-primary, rgba(255, 255, 255, 0.1));
                    border-radius: 50%;
                    
                    background: var(--viz-bg-glass, rgba(255, 255, 255, 0.05));
                    color: var(--viz-text-primary, #f1f5f9);
                    
                    cursor: pointer;
                    transition: all 0.2s ease;
                    
                    /* Remove default button styles */
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                }

                .control-btn:hover:not(:disabled) {
                    background: var(--viz-bg-glass-hover, rgba(255, 255, 255, 0.1));
                    border-color: var(--viz-border-accent, rgba(74, 144, 217, 0.5));
                }

                .control-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                /* Primary button (Play/Pause) - Lớn và nổi bật */
                .control-btn--primary {
                    width: 56px;
                    height: 56px;
                    font-size: 1.5rem;
                    
                    background: linear-gradient(
                        135deg,
                        var(--viz-color-normal, #4a90d9),
                        var(--viz-color-found, #06b6d4)
                    );
                    border-color: transparent;
                    
                    box-shadow: 0 4px 15px rgba(74, 144, 217, 0.3);
                }

                .control-btn--primary:hover:not(:disabled) {
                    box-shadow: 0 6px 20px rgba(74, 144, 217, 0.5);
                }

                .control-btn--primary.is-playing {
                    background: linear-gradient(
                        135deg,
                        var(--viz-color-comparing, #fbbf24),
                        var(--viz-color-swapping, #ef4444)
                    );
                    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
                }

                /* Step buttons - Kích thước trung bình */
                .control-btn--step {
                    width: 44px;
                    height: 44px;
                    font-size: 1.1rem;
                }

                /* Reset button - Nhỏ hơn, ít quan trọng hơn */
                .control-btn--reset {
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                }

                /* Speed Control Section */
                .controls-speed {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .speed-label {
                    font-size: 0.85rem;
                    color: var(--viz-text-secondary, #94a3b8);
                    text-align: center;
                }

                .speed-value {
                    color: var(--viz-color-found, #06b6d4);
                    font-weight: 600;
                }

                .speed-slider-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .speed-marker {
                    font-size: 0.75rem;
                    color: var(--viz-text-muted, #64748b);
                    white-space: nowrap;
                }

                /* Custom Range Slider Styles */
                .speed-slider {
                    flex: 1;
                    height: 6px;
                    
                    -webkit-appearance: none;
                    appearance: none;
                    
                    background: var(--viz-bg-secondary, rgba(30, 41, 59, 0.9));
                    border-radius: 3px;
                    
                    cursor: pointer;
                    outline: none;
                }

                /* Slider thumb - Chrome, Safari, Edge */
                .speed-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    
                    width: 18px;
                    height: 18px;
                    
                    background: var(--viz-color-normal, #4a90d9);
                    border: 2px solid var(--viz-text-primary, #f1f5f9);
                    border-radius: 50%;
                    
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .speed-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                /* Slider thumb - Firefox */
                .speed-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    
                    background: var(--viz-color-normal, #4a90d9);
                    border: 2px solid var(--viz-text-primary, #f1f5f9);
                    border-radius: 50%;
                    
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .speed-slider:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Responsive adjustments */
                @media (max-width: 480px) {
                    .animation-controls {
                        padding: 12px;
                        gap: 12px;
                    }

                    .controls-buttons {
                        gap: 8px;
                    }

                    .control-btn--primary {
                        width: 48px;
                        height: 48px;
                        font-size: 1.25rem;
                    }

                    .control-btn--step,
                    .control-btn--reset {
                        width: 36px;
                        height: 36px;
                        font-size: 1rem;
                    }

                    .progress-text {
                        font-size: 0.75rem;
                        min-width: 80px;
                    }
                }
            `}</style>
        </div>
    );
};

// =============================================================================
// EXPORT - Xuất component để sử dụng ở nơi khác
// =============================================================================

/**
 * Default Export:
 * - Cho phép import AnimationControls from './AnimationControls'
 * - Hoặc import với tên khác: import MyControls from './AnimationControls'
 */
export default AnimationControls;

/**
 * Named Export (optional):
 * - Cho phép import { AnimationControls } from './AnimationControls'
 * - Hữu ích khi file export nhiều thứ.
 */
export { AnimationControls };
