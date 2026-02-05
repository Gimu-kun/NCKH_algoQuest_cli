/**
 * =============================================================================
 * FILE: BinarySearchVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa thuật toán Binary Search (Tìm kiếm nhị phân).
 * - Hiển thị quá trình thu hẹp không gian tìm kiếm với animations.
 * - Giúp user hiểu rõ cơ chế "chia đôi" của Binary Search.
 *
 * THUẬT TOÁN BINARY SEARCH (Chi tiết):
 *
 * ĐIỀU KIỆN TIÊN QUYẾT (Prerequisites):
 * - Mảng PHẢI đã được sắp xếp (sorted) tăng dần hoặc giảm dần.
 * - Nếu chưa sorted → kết quả sai hoặc không tìm thấy.
 *
 * Ý TƯỞNG CHÍNH (Main Idea):
 * - Thay vì duyệt tuần tự O(n), ta chia đôi search space mỗi bước.
 * - Mỗi bước loại bỏ 50% elements → O(log n).
 *
 * STEPS FLOW (Các bước thực hiện):
 * 1. Khởi tạo: left = 0, right = n - 1.
 * 2. Tính mid = left + (right - left) / 2.
 *    - Tại sao không dùng (left + right) / 2?
 *    - Để tránh Integer Overflow khi left + right > MAX_INT.
 * 3. So sánh arr[mid] với target:
 *    - arr[mid] === target → TÌM THẤY! Return mid.
 *    - arr[mid] < target → target ở bên PHẢI → left = mid + 1.
 *    - arr[mid] > target → target ở bên TRÁI → right = mid - 1.
 * 4. Repeat cho đến khi left > right (không tìm thấy).
 *
 * ĐỘ PHỨC TẠP (Complexity):
 * - Time Complexity: O(log n) - Mỗi bước giảm một nửa search space.
 *   - log₂(1000) ≈ 10 → Chỉ cần 10 bước cho 1000 elements!
 *   - log₂(1,000,000) ≈ 20 → 20 bước cho 1 triệu elements!
 * - Space Complexity:
 *   - O(1) với Iterative approach.
 *   - O(log n) với Recursive approach (call stack).
 *
 * SO SÁNH VỚI LINEAR SEARCH:
 * ┌─────────────────┬────────────────┬─────────────────┐
 * │ Tiêu chí        │ Binary Search  │ Linear Search   │
 * ├─────────────────┼────────────────┼─────────────────┤
 * │ Time Complexity │ O(log n)       │ O(n)            │
 * │ Requires Sorted │ YES            │ NO              │
 * │ Use Case        │ Large sorted   │ Small/unsorted  │
 * │ 1000 elements   │ ~10 steps      │ ~1000 steps     │
 * │ 1M elements     │ ~20 steps      │ ~1M steps       │
 * └─────────────────┴────────────────┴─────────────────┘
 *
 * VARIANTS & APPLICATIONS (Biến thể và ứng dụng):
 * - Lower Bound: Tìm index đầu tiên >= target.
 * - Upper Bound: Tìm index đầu tiên > target.
 * - Search in Rotated Sorted Array: LeetCode #33.
 * - Search Insert Position: LeetCode #35.
 * - Peak Element: LeetCode #162.
 *
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimationControls from '../shared/AnimationControls';
import '../shared/VisualizationStyles.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

import type { BinarySearchStep as SearchStep } from '../types';
import { generateBinarySearchSteps } from '../../../algo_demos/Chapter_2_Search_Sort/BinarySearch';

/**
 * BinarySearchVisualizerProps - Props cho component.
 */
interface BinarySearchVisualizerProps {
    /**
     * array: Mảng ĐÃ SORTED để tìm kiếm.
     */
    array: number[];

    /**
     * target: Giá trị cần tìm.
     */
    target: number;

    /**
     * title: Tiêu đề tùy chọn.
     */
    title?: string;
    /**
     * showLegend: Hiển thị legend không.
     */
    showLegend?: boolean;

    /**
     * autoStart: Tự động play khi mount.
     */
    autoStart?: boolean;

    /**
     * onRegenerate: Callback khi người dùng muốn tạo lại mảng/target mới.
     */
    onRegenerate?: () => void;

    /**
     * onComplete: Callback khi hoàn thành.
     */
    onComplete?: (foundIndex: number) => void;
}

// =============================================================================
// COMPONENT: BinarySearchVisualizer
// =============================================================================

const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({
    array: initialArray,
    target,
    title,
    showLegend = true,
    autoStart = false,
    onRegenerate,
    onComplete,
}) => {
    // =========================================================================
    // STATE
    // =========================================================================

    const [steps, setSteps] = useState<SearchStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    // =========================================================================
    // REFS
    // =========================================================================

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    const currentStepData = steps[currentStep] || {
        array: initialArray,
        left: 0,
        right: initialArray.length - 1,
        mid: -1,
        target,
        foundIndex: -1,
        eliminated: [],
        description: '',
        isComplete: false,
    };

    // maxValue có thể dùng cho height visualization nếu cần
    // const maxValue = useMemo(() => Math.max(...initialArray, 1), [initialArray]);

    const isComplete = currentStepData.isComplete;

    // =========================================================================
    // EFFECTS
    // =========================================================================

    useEffect(() => {
        const newSteps = generateBinarySearchSteps(initialArray, target);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(autoStart);
    }, [initialArray, target, autoStart]);

    useEffect(() => {
        const BASE_INTERVAL = 1000;

        if (isPlaying && !isComplete) {
            intervalRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    const next = prev + 1;
                    if (next >= steps.length) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return next;
                });
            }, BASE_INTERVAL / speed);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, speed, steps.length, isComplete]);

    useEffect(() => {
        if (isComplete && onComplete) {
            onComplete(currentStepData.foundIndex);
        }
    }, [isComplete, onComplete, currentStepData.foundIndex]);

    // =========================================================================
    // CALLBACKS
    // =========================================================================

    const handlePlayPause = useCallback(() => {
        if (isComplete) {
            setCurrentStep(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((prev) => !prev);
        }
    }, [isComplete]);

    const handleStepForward = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [currentStep, steps.length]);

    const handleStepBackward = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    const handleReset = useCallback(() => {
        if (onRegenerate) {
            onRegenerate();
        } else {
            setCurrentStep(0);
            setIsPlaying(false);
        }
    }, [onRegenerate]);

    const handleSpeedChange = useCallback((newSpeed: number) => {
        setSpeed(newSpeed);
    }, []);

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    /**
     * getElementState - Xác định state hiển thị của element.
     *
     * States theo priority:
     * 1. found - Đã tìm thấy target
     * 2. mid - Đang xét (middle element)
     * 3. active - Trong search space [left, right]
     * 4. eliminated - Đã bị loại khỏi search space
     */
    const getElementState = (index: number): 'found' | 'mid' | 'left' | 'right' | 'active' | 'eliminated' | 'normal' => {
        if (currentStepData.foundIndex === index) {
            return 'found';
        }
        if (currentStepData.mid === index) {
            return 'mid';
        }
        if (currentStepData.left === index) {
            return 'left';
        }
        if (currentStepData.right === index) {
            return 'right';
        }
        if (currentStepData.eliminated.includes(index)) {
            return 'eliminated';
        }
        if (index >= currentStepData.left && index <= currentStepData.right) {
            return 'active';
        }
        return 'normal';
    };

    /**
     * getElementColor - Lấy màu cho element dựa trên state.
     */
    const getElementColor = (state: ReturnType<typeof getElementState>): string => {
        const colors: Record<typeof state, string> = {
            found: 'var(--viz-color-found, #06b6d4)',
            mid: 'var(--viz-color-comparing, #fbbf24)',
            left: 'var(--viz-color-pointer, #a855f7)',
            right: 'var(--viz-color-pointer, #a855f7)',
            active: 'var(--viz-color-normal, #4a90d9)',
            eliminated: 'var(--viz-color-inactive, #374151)',
            normal: 'var(--viz-color-normal, #4a90d9)',
        };
        return colors[state];
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="viz-container binary-search-visualizer">
            {/* Header */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || 'Binary Search (Tìm kiếm nhị phân)'}
                    </h2>
                    <p className="viz-subtitle">
                        Tìm target = <strong>{target}</strong> trong mảng đã sắp xếp
                    </p>
                </div>

                <div className="viz-info-badges">
                    <span className="viz-badge"><i className="fi fi-rr-clock-three"></i> Time: O(log n)</span>
                    <span className="viz-badge"><i className="fi fi-rr-database-management"></i> Space: O(1)</span>
                    <span className="viz-badge viz-badge--highlight">
                        Yêu cầu: Sorted Array
                    </span>
                </div>
            </header>

            {/* Array Visualization */}
            <div className="viz-array-container" style={{ minHeight: '200px', alignItems: 'center' }}>
                {/* Pointer Labels Row */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px',
                }}>
                    {currentStepData.array.map((_, index) => {
                        const isLeft = currentStepData.left === index;
                        const isRight = currentStepData.right === index;
                        const isMid = currentStepData.mid === index;

                        return (
                            <div
                                key={`label-${index}`}
                                style={{
                                    width: '50px',
                                    textAlign: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    minHeight: '20px',
                                }}
                            >
                                {isMid && <span style={{ color: 'var(--viz-color-comparing)' }}>mid</span>}
                                {isLeft && !isMid && <span style={{ color: 'var(--viz-color-pointer)' }}>left</span>}
                                {isRight && !isMid && <span style={{ color: 'var(--viz-color-pointer)' }}>right</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Array Elements */}
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    marginTop: '30px',
                }}>
                    <AnimatePresence>
                        {currentStepData.array.map((value, index) => {
                            const state = getElementState(index);
                            const isEliminated = state === 'eliminated';
                            const isFound = state === 'found';
                            const isMid = state === 'mid';

                            return (
                                <motion.div
                                    key={`element-${index}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: isEliminated ? 0.85 : 1,
                                        opacity: isEliminated ? 0.4 : 1,
                                        y: isMid ? -10 : 0,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 25,
                                    }}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        backgroundColor: getElementColor(state),
                                        color: isFound || isMid ? 'rgba(0,0,0,0.8)' : 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: isFound
                                            ? '0 0 20px rgba(6, 182, 212, 0.6)'
                                            : isMid
                                                ? '0 0 15px rgba(251, 191, 36, 0.5)'
                                                : '0 2px 4px rgba(0,0,0,0.2)',
                                        border: value === target && !isEliminated
                                            ? '2px solid var(--viz-color-found)'
                                            : '1px solid rgba(255,255,255,0.1)',
                                        position: 'relative',
                                    }}
                                >
                                    <span>{value}</span>
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '-18px',
                                        fontSize: '0.65rem',
                                        color: 'var(--viz-text-muted)',
                                    }}>
                                        [{index}]
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Target indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '20px',
                    padding: '8px 16px',
                    background: 'var(--viz-bg-glass)',
                    borderRadius: '8px',
                    border: '1px solid var(--viz-color-found)',
                    fontSize: '0.9rem',
                }}>
                    <span style={{ color: 'var(--viz-text-secondary)' }}>Target: </span>
                    <span style={{ color: 'var(--viz-color-found)', fontWeight: 600 }}>{target}</span>
                </div>
            </div>

            {/* Step Description & Code */}
            <motion.div
                className="viz-step-description"
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="step-text">{currentStepData.description}</div>
                {currentStepData.codeSnippet && (
                    <div className="step-code-block">
                        <pre><code>{currentStepData.codeSnippet}</code></pre>
                    </div>
                )}
            </motion.div>

            {/* Controls */}
            <AnimationControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={handleSpeedChange}
                currentStep={currentStep}
                totalSteps={steps.length - 1}
                disabled={steps.length === 0}
            />

            {/* Legend */}
            {showLegend && (
                <div className="viz-legend">
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-normal)' }} />
                        <span>Search space</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-comparing)' }} />
                        <span>Mid (đang xét)</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-pointer)' }} />
                        <span>Left/Right pointer</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-inactive)' }} />
                        <span>Đã loại bỏ</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-found)' }} />
                        <span>Tìm thấy!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// EXPORTS
// =============================================================================

BinarySearchVisualizer.displayName = 'BinarySearchVisualizer';

export default BinarySearchVisualizer;
export { BinarySearchVisualizer };
export type { BinarySearchVisualizerProps };
