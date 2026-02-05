/**
 * =============================================================================
 * FILE: ArrayBar.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Tạo component hiển thị 1 phần tử của mảng dưới dạng "thanh" (bar) dọc.
 * - Thanh có chiều cao tỷ lệ với giá trị, giúp visualize so sánh các phần tử.
 * - Hỗ trợ nhiều trạng thái (states) với màu sắc và animations khác nhau.
 *
 * CHỨC NĂNG CHI TIẾT (Detailed Functionality):
 * 1. Hiển thị thanh dọc với height = (value / maxValue) * containerHeight.
 * 2. Hiển thị giá trị số bên trong hoặc bên trên thanh.
 * 3. Thay đổi màu sắc dựa trên state: normal, comparing, swapping, sorted, found.
 * 4. Animations mượt mà khi:
 *    - State thay đổi (color transition)
 *    - Vị trí thay đổi (position swap animation)
 *    - Thanh mới xuất hiện (mount animation)
 *
 * KỸ THUẬT SỬ DỤNG (Techniques):
 * 1. Framer Motion với animate và variants: Declarative animations.
 * 2. CSS-in-JS via inline styles + CSS variables: Flexible theming.
 * 3. TypeScript Discriminated Unions: Type-safe state handling.
 * 4. Memoization (React.memo): Tránh re-render không cần thiết.
 *
 * STEPS FLOW (Luồng hoạt động):
 * 1. Parent (SortingVisualizer) pass props: value, state, index, maxValue.
 * 2. ArrayBar tính toán height dựa trên value/maxValue ratio.
 * 3. ArrayBar chọn màu sắc dựa trên state hiện tại.
 * 4. Framer Motion animate các thay đổi.
 *
 * SO SÁNH VỚI CÁC PHƯƠNG PHÁP KHÁC:
 * - D3.js: Mạnh hơn cho data visualization nhưng learning curve cao.
 * - Chart.js: Dễ dùng cho charts nhưng khó customize animations.
 * - Canvas API: Performance tốt nhưng không declarative.
 * → Chọn React + Framer Motion: Declarative, dễ hiểu, phù hợp với React app.
 *
 * ƯU ĐIỂM (Advantages):
 * - Intuitive: Dễ hiểu logic height = value visualization.
 * - Smooth: Framer Motion tự xử lý interpolation giữa các states.
 * - Reusable: Có thể dùng cho bất kỳ array visualization nào.
 *
 * NHƯỢC ĐIỂM (Disadvantages):
 * - Performance: Với mảng rất lớn (>100 elements), có thể cần virtualization.
 * - Fixed height container: Cần biết containerHeight trước.
 *
 * =============================================================================
 */

import React from 'react';
import { motion, type Variants, type Transition } from 'framer-motion';

// =============================================================================
// TYPES & INTERFACES - Định nghĩa kiểu dữ liệu
// =============================================================================

/**
 * ArrayBarState - Các trạng thái có thể của một ArrayBar.
 *
 * Sử dụng Union Type của TypeScript:
 * - Compile-time checking: Không thể pass state không hợp lệ.
 * - Autocomplete: IDE gợi ý các values hợp lệ.
 *
 * Các trạng thái:
 * - 'normal': Trạng thái mặc định, không có gì đặc biệt.
 * - 'comparing': Đang được so sánh với phần tử khác (highlight để user chú ý).
 * - 'swapping': Đang được hoán đổi vị trí (màu khác + animation).
 * - 'sorted': Đã ở đúng vị trí cuối cùng (màu xanh = hoàn thành).
 * - 'pivot': Đang là pivot trong Quick Sort.
 * - 'found': Đã tìm thấy (dùng cho searching algorithms).
 * - 'inactive': Bị loại khỏi search space (dim/mờ đi).
 */
export type ArrayBarState =
    | 'normal'
    | 'comparing'
    | 'swapping'
    | 'sorted'
    | 'pivot'
    | 'found'
    | 'inactive';

/**
 * ArrayBarProps - Props interface cho ArrayBar component.
 */
interface ArrayBarProps {
    /**
     * value: Giá trị số của phần tử.
     * Hiển thị bên trong thanh và dùng để tính chiều cao.
     */
    value: number;

    /**
     * index: Chỉ số (index) của phần tử trong mảng.
     * Dùng cho:
     * - Staggered animations (delay dựa trên index).
     * - Key identification trong list.
     */
    index: number;

    /**
     * state: Trạng thái hiện tại của thanh.
     * Quyết định màu sắc và animation.
     */
    state: ArrayBarState;

    /**
     * maxValue: Giá trị lớn nhất trong toàn bộ mảng.
     * Dùng để tính tỷ lệ chiều cao: height = (value / maxValue) * 100%.
     * Đảm bảo thanh cao nhất luôn chiếm hết container.
     */
    maxValue: number;

    /**
     * showValue: Có hiển thị giá trị số không?
     * Optional, default = true.
     * Có thể ẩn đi nếu mảng quá lớn hoặc thanh quá nhỏ.
     */
    showValue?: boolean;

    /**
     * containerHeight: Chiều cao của container chứa các bars (px).
     * Optional, default = 250.
     * Dùng để tính chiều cao thực tế của từng bar.
     */
    containerHeight?: number;

    /**
     * animationDelay: Delay trước khi animation bắt đầu (seconds).
     * Optional, dùng cho staggered entrance animations.
     */
    animationDelay?: number;

    /**
     * onClick: Callback khi user click vào bar.
     * Optional, dùng cho interactive visualizations.
     */
    onClick?: (index: number, value: number) => void;
}

// =============================================================================
// CONSTANTS - Hằng số cấu hình
// =============================================================================

/**
 * STATE_COLORS - Mapping từ state sang màu sắc.
 *
 * Sử dụng CSS variables để có thể override từ parent hoặc global CSS.
 *
 * Design Rationale (Lý do chọn màu):
 * - Yellow (comparing): Trung tính, thu hút chú ý mà không quá mạnh.
 * - Red/Orange (swapping): "Action" đang xảy ra, cần chú ý.
 * - Green (sorted): Hoàn thành, thành công.
 * - Cyan (found): Kết quả tìm kiếm, khác với sorted.
 * - Purple (pivot): Đặc biệt, khác với các states khác.
 * - Gray (inactive): Fade out, không quan trọng nữa.
 */
const STATE_COLORS: Record<ArrayBarState, string> = {
    normal: 'var(--viz-color-normal, #4a90d9)',
    comparing: 'var(--viz-color-comparing, #fbbf24)',
    swapping: 'var(--viz-color-swapping, #ef4444)',
    sorted: 'var(--viz-color-sorted, #22c55e)',
    pivot: 'var(--viz-color-pointer, #a855f7)',
    found: 'var(--viz-color-found, #06b6d4)',
    inactive: 'var(--viz-color-inactive, #374151)',
};

/**
 * STATE_GLOWS - Glow effect colors cho từng state.
 * Tạo hiệu ứng "phát sáng" xung quanh bar khi active.
 */
const STATE_GLOWS: Record<ArrayBarState, string> = {
    normal: 'rgba(74, 144, 217, 0.2)',
    comparing: 'rgba(251, 191, 36, 0.5)',
    swapping: 'rgba(239, 68, 68, 0.5)',
    sorted: 'rgba(34, 197, 94, 0.4)',
    pivot: 'rgba(168, 85, 247, 0.5)',
    found: 'rgba(6, 182, 212, 0.5)',
    inactive: 'rgba(55, 65, 81, 0.2)',
};

/**
 * Framer Motion Variants - Định nghĩa các animation states.
 *
 * Variants Pattern của Framer Motion:
 * - Centralized: Tất cả animations ở 1 object.
 * - Composable: Có thể kết hợp nhiều variants.
 * - Orchestration: Dễ sync animations giữa children.
 */
const barVariants: Variants = {
    /**
     * initial: Trạng thái ban đầu khi component mount.
     * - scaleY: 0 → Bar "mọc" từ dưới lên.
     * - opacity: 0 → Fade in.
     */
    initial: {
        scaleY: 0,
        opacity: 0,
        originY: 1, // Scale from bottom
    },

    /**
     * animate: Trạng thái khi đã mount xong.
     * - scaleY: 1 → Full height.
     * - opacity: 1 → Fully visible.
     */
    animate: {
        scaleY: 1,
        opacity: 1,
        originY: 1,
    },

    /**
     * exit: Trạng thái khi component unmount.
     * Dùng với AnimatePresence.
     */
    exit: {
        scaleY: 0,
        opacity: 0,
        originY: 1,
    },

    /**
     * hover: Trạng thái khi mouse hover.
     */
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },

    /**
     * tap: Trạng thái khi click/tap.
     */
    tap: {
        scale: 0.98,
    },
};

/**
 * Spring Transition - Cấu hình animation kiểu spring (lò xo).
 *
 * So sánh các loại transition trong Framer Motion:
 * 1. Tween: duration-based, predictable, dùng easing functions.
 * 2. Spring: physics-based, tự nhiên hơn, có bounce.
 * 3. Inertia: momentum-based, dùng cho drag gestures.
 *
 * Spring parameters:
 * - stiffness: Độ cứng lò xo. Cao = nhanh nhưng không mượt.
 * - damping: Độ giảm chấn. Cao = ít bounce, dừng nhanh.
 * - mass: Khối lượng. Cao = chậm hơn, momentum lớn hơn.
 *
 * Giá trị đã chọn: Balance giữa responsive và smooth.
 */
const springTransition: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

// =============================================================================
// COMPONENT: ArrayBar
// =============================================================================

/**
 * ArrayBar Component
 *
 * Hiển thị một phần tử mảng dưới dạng thanh dọc với animations.
 *
 * @param props - ArrayBarProps
 * @returns JSX.Element
 *
 * React.memo được sử dụng để memoize component:
 * - Chỉ re-render khi props thực sự thay đổi.
 * - Quan trọng vì parent re-render thường xuyên trong animations.
 *
 * So sánh với useMemo/useCallback:
 * - React.memo: Wrap component, check tất cả props.
 * - useMemo: Cache giá trị computed.
 * - useCallback: Cache function reference.
 */
const ArrayBar = React.memo(React.forwardRef<HTMLDivElement, ArrayBarProps>(({
    value,
    index,
    state,
    maxValue,
    showValue = true,
    containerHeight = 250,
    animationDelay = 0,
    onClick,
}, ref) => {
    // =========================================================================
    // COMPUTED VALUES - Các giá trị tính toán
    // =========================================================================

    /**
     * heightPercentage: Tỷ lệ chiều cao của bar so với container.
     *
     * Công thức: (value / maxValue) * 100
     *
     * Math.max(5, ...) đảm bảo bar luôn có chiều cao tối thiểu 5%.
     * Điều này giúp:
     * - Bar với value = 0 vẫn hiển thị.
     * - User vẫn có thể click vào bar nhỏ.
     *
     * Math.min(..., 100) đảm bảo không vượt quá 100%.
     */
    const heightPercentage = Math.min(
        Math.max((value / maxValue) * 100, 5),
        100
    );

    /**
     * actualHeight: Chiều cao thực tế bằng pixels.
     * Tính từ heightPercentage và containerHeight.
     */
    const actualHeight = (heightPercentage / 100) * containerHeight;

    /**
     * backgroundColor: Màu nền của bar dựa trên state.
     */
    const backgroundColor = STATE_COLORS[state];

    /**
     * glowColor: Màu glow effect dựa trên state.
     */
    const glowColor = STATE_GLOWS[state];

    /**
     * isHighlighted: Check nếu bar đang ở trạng thái cần highlight.
     * Dùng để thêm glow effect và pulse animation.
     */
    const isHighlighted = ['comparing', 'swapping', 'pivot', 'found'].includes(state);

    /**
     * isInactive: Check nếu bar bị dim (inactive state).
     */
    const isInactive = state === 'inactive';

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================

    /**
     * handleClick: Xử lý click event.
     * Gọi callback nếu được cung cấp.
     */
    const handleClick = () => {
        if (onClick) {
            onClick(index, value);
        }
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <motion.div
            ref={ref}
            className="array-bar"
            data-index={index}
            data-value={value}
            data-state={state}

            // Framer Motion Props
            variants={barVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover={onClick ? "hover" : undefined}
            whileTap={onClick ? "tap" : undefined}

            // Layout prop cho position animations (swap)
            // Khi key thay đổi vị trí trong list, Framer Motion sẽ animate smoothly.
            layout

            // Transition configuration
            transition={{
                ...springTransition,
                delay: animationDelay,
            }}

            // Click handler
            onClick={handleClick}

            // Inline styles
            style={{
                // Sizing
                height: actualHeight,
                minWidth: 'var(--viz-bar-min-width, 30px)',
                maxWidth: 'var(--viz-bar-max-width, 60px)',
                flex: '1 1 auto',

                // Colors
                backgroundColor,

                // Box shadow for glow effect
                // Template: horizontal vertical blur spread color
                boxShadow: isHighlighted
                    ? `0 0 15px ${glowColor}, 0 0 30px ${glowColor}`
                    : `0 2px 4px rgba(0, 0, 0, 0.2)`,

                // Opacity for inactive state
                opacity: isInactive ? 0.4 : 1,

                // Border
                borderRadius: '4px 4px 0 0', // Rounded top corners only
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: 'none',

                // Flexbox for value label
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '8px',

                // Interaction
                cursor: onClick ? 'pointer' : 'default',
                userSelect: 'none' as const,

                // Position for absolute children if needed
                position: 'relative' as const,
            }}
        >
            {/* Value Label - Hiển thị giá trị số */}
            {showValue && (
                <motion.span
                    className="array-bar-value"
                    /**
                     * AnimatePresence alternative: Animate opacity.
                     *
                     * Hiển thị value với animation fade khi state thay đổi.
                     * whileHover có thể dùng để show value khi ẩn mặc định.
                     */
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                        opacity: actualHeight > 40 ? 1 : 0, // Ẩn nếu bar quá ngắn
                        y: 0,
                    }}
                    transition={{ delay: animationDelay + 0.1, duration: 0.2 }}

                    style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: getContrastColor(state),
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    {value}
                </motion.span>
            )}

            {/* Index Label - Hiển thị index bên dưới bar (ở ngoài container) */}
            <span
                className="array-bar-index"
                style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: 'var(--viz-text-muted, #64748b)',
                }}
            >
                [{index}]
            </span>

            {/* Pulse Animation Layer - Thêm hiệu ứng pulse cho highlighted states */}
            {isHighlighted && (
                <motion.div
                    className="array-bar-pulse"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        backgroundColor: backgroundColor,
                        zIndex: -1,
                        pointerEvents: 'none' as const,
                    }}
                />
            )}
        </motion.div>
    );
}));

// =============================================================================
// HELPER FUNCTIONS - Các hàm hỗ trợ
// =============================================================================

/**
 * getContrastColor - Chọn màu text contrast với background.
 *
 * @param state - Trạng thái hiện tại của bar
 * @returns Màu text phù hợp (trắng hoặc đen)
 *
 * Design Principle: Contrast Ratio
 * - WCAG 2.0 yêu cầu contrast ratio tối thiểu 4.5:1 cho text thường.
 * - Màu sáng (yellow, cyan) cần text tối.
 * - Màu tối (blue, red, purple) cần text sáng.
 *
 * Approach đơn giản: Dựa vào state thay vì tính toán luminance.
 */
function getContrastColor(state: ArrayBarState): string {
    // States với background sáng cần text tối
    const lightBackgrounds: ArrayBarState[] = ['comparing', 'found', 'sorted'];

    if (lightBackgrounds.includes(state)) {
        return 'rgba(0, 0, 0, 0.8)';
    }

    // Mặc định: text sáng
    return 'rgba(255, 255, 255, 0.95)';
}

// =============================================================================
// DISPLAY NAME - Tên hiển thị trong React DevTools
// =============================================================================

/**
 * displayName giúp debug:
 * - React DevTools hiển thị tên component thay vì "Anonymous".
 * - Useful khi dùng React.memo vì nó wrap component.
 */
ArrayBar.displayName = 'ArrayBar';

// =============================================================================
// EXPORTS
// =============================================================================

export default ArrayBar;
export { ArrayBar };
