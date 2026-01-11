/**
 * =============================================================================
 * FILE: LinearSearchVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa thuật toán Linear Search (Tìm kiếm tuyến tính).
 * - Hiển thị quá trình duyệt tuần tự qua mảng để tìm target.
 * - So sánh trực quan với Binary Search để thấy sự khác biệt về hiệu suất.
 *
 * THUẬT TOÁN LINEAR SEARCH (Chi tiết):
 *
 * Ý TƯỞNG CHÍNH (Main Idea):
 * - Duyệt qua từng phần tử từ đầu đến cuối mảng.
 * - So sánh mỗi phần tử với target.
 * - Trả về index ngay khi tìm thấy, hoặc -1 nếu không có.
 *
 * ĐIỀU KIỆN (Prerequisites):
 * - KHÔNG yêu cầu mảng sorted → Linh hoạt hơn Binary Search.
 * - Hoạt động với mọi loại dữ liệu.
 *
 * STEPS FLOW (Các bước):
 * 1. Bắt đầu từ index 0.
 * 2. So sánh arr[i] với target.
 * 3. Nếu bằng → TÌM THẤY, return i.
 * 4. Nếu không → i++, tiếp tục.
 * 5. Nếu i >= n → KHÔNG TÌM THẤY, return -1.
 *
 * ĐỘ PHỨC TẠP (Complexity):
 * - Time Complexity:
 *   - Best Case: O(1) - Target ở đầu mảng.
 *   - Average Case: O(n/2) ≈ O(n) - Target ở giữa.
 *   - Worst Case: O(n) - Target ở cuối hoặc không có.
 * - Space Complexity: O(1) - Chỉ dùng vài biến.
 *
 * ƯU ĐIỂM (Advantages):
 * 1. Đơn giản, dễ implement.
 * 2. Không yêu cầu sorted array.
 * 3. Tốt cho small datasets.
 * 4. Tốt khi target thường ở gần đầu.
 * 5. Có thể dừng sớm với unordered data.
 *
 * NHƯỢC ĐIỂM (Disadvantages):
 * 1. Chậm với large datasets O(n).
 * 2. Không tận dụng được bất kỳ thông tin nào về data.
 * 3. Kém hiệu quả nếu cần tìm nhiều lần.
 *
 * KHI NÀO DÙNG LINEAR SEARCH:
 * - Mảng nhỏ (n < 20-30).
 * - Mảng không sorted.
 * - Chỉ tìm 1 lần.
 * - Data structure không hỗ trợ random access (Linked List).
 *
 * VARIANTS (Biến thể):
 * - Sentinel Search: Thêm target vào cuối, bỏ bounds check.
 * - Find All: Tìm tất cả occurrences.
 * - Find Min/Max: Tìm giá trị nhỏ nhất/lớn nhất.
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

/**
 * LinearSearchStep - Đại diện cho một bước.
 */
interface LinearSearchStep {
    /**
     * array: Mảng (không thay đổi trong quá trình search).
     */
    array: number[];

    /**
     * currentIndex: Index đang xét hiện tại.
     * -1 nghĩa là chưa bắt đầu hoặc đã kết thúc.
     */
    currentIndex: number;

    /**
     * target: Giá trị cần tìm.
     */
    target: number;

    /**
     * checkedIndices: Các indices đã kiểm tra xong (không match).
     */
    checkedIndices: number[];

    /**
     * foundIndex: Index tìm thấy target, -1 nếu chưa/không tìm thấy.
     */
    foundIndex: number;

    /**
     * description: Mô tả bước.
     */
    description: string;

    /**
     * isComplete: Đã hoàn thành chưa.
     */
    isComplete: boolean;

    /**
     * comparisonCount: Số lần so sánh đã thực hiện.
     */
    comparisonCount: number;
}

/**
 * LinearSearchVisualizerProps - Props cho component.
 */
interface LinearSearchVisualizerProps {
    /**
     * array: Mảng để tìm kiếm (không cần sorted).
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
     * showLegend: Hiển thị legend.
     */
    showLegend?: boolean;

    /**
     * autoStart: Tự động bắt đầu.
     */
    autoStart?: boolean;

    /**
     * onComplete: Callback khi hoàn thành.
     */
    onComplete?: (foundIndex: number, comparisonCount: number) => void;
}

// =============================================================================
// STEP GENERATOR
// =============================================================================

/**
 * generateLinearSearchSteps - Tạo các bước cho Linear Search.
 *
 * Algorithm đơn giản:
 * for i = 0 to n-1:
 *     if arr[i] == target:
 *         return i
 * return -1
 *
 * @param arr - Mảng để tìm
 * @param target - Giá trị cần tìm
 * @returns Mảng các LinearSearchStep
 */
function generateLinearSearchSteps(arr: number[], target: number): LinearSearchStep[] {
    const steps: LinearSearchStep[] = [];
    const array = [...arr];
    const n = array.length;
    const checkedIndices: number[] = [];
    let comparisonCount = 0;

    // Initial step
    steps.push({
        array,
        currentIndex: -1,
        target,
        checkedIndices: [],
        foundIndex: -1,
        description: `Bắt đầu Linear Search. Tìm target = ${target}. Duyệt từ đầu đến cuối.`,
        isComplete: false,
        comparisonCount: 0,
    });

    for (let i = 0; i < n; i++) {
        // Step: Move to current index
        steps.push({
            array,
            currentIndex: i,
            target,
            checkedIndices: [...checkedIndices],
            foundIndex: -1,
            description: `Xét index ${i}: arr[${i}] = ${array[i]}`,
            isComplete: false,
            comparisonCount,
        });

        // Step: Compare
        comparisonCount++;
        steps.push({
            array,
            currentIndex: i,
            target,
            checkedIndices: [...checkedIndices],
            foundIndex: -1,
            description: `So sánh: ${array[i]} ${array[i] === target ? '==' : '!='} ${target}?`,
            isComplete: false,
            comparisonCount,
        });

        if (array[i] === target) {
            // Found!
            steps.push({
                array,
                currentIndex: i,
                target,
                checkedIndices: [...checkedIndices],
                foundIndex: i,
                description: `[TÌM THẤY] arr[${i}] = ${array[i]} = target. Sau ${comparisonCount} lần so sánh.`,
                isComplete: true,
                comparisonCount,
            });
            return steps;
        }

        // Not match, mark as checked
        checkedIndices.push(i);
        steps.push({
            array,
            currentIndex: i,
            target,
            checkedIndices: [...checkedIndices],
            foundIndex: -1,
            description: `${array[i]} ≠ ${target}. Tiếp tục tìm...`,
            isComplete: false,
            comparisonCount,
        });
    }

    // Not found
    steps.push({
        array,
        currentIndex: -1,
        target,
        checkedIndices: [...checkedIndices],
        foundIndex: -1,
        description: `[KHÔNG TÌM THẤY] Đã duyệt hết mảng. ${comparisonCount} lần so sánh.`,
        isComplete: true,
        comparisonCount,
    });

    return steps;
}

// =============================================================================
// COMPONENT: LinearSearchVisualizer
// =============================================================================

const LinearSearchVisualizer: React.FC<LinearSearchVisualizerProps> = ({
    array: initialArray,
    target,
    title,
    showLegend = true,
    autoStart = false,
    onComplete,
}) => {
    // =========================================================================
    // STATE
    // =========================================================================

    const [steps, setSteps] = useState<LinearSearchStep[]>([]);
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
        currentIndex: -1,
        target,
        checkedIndices: [],
        foundIndex: -1,
        description: '',
        isComplete: false,
        comparisonCount: 0,
    };

    // maxValue có thể dùng cho height visualization nếu cần
    // const maxValue = useMemo(() => Math.max(...initialArray, 1), [initialArray]);

    const isComplete = currentStepData.isComplete;

    // =========================================================================
    // EFFECTS
    // =========================================================================

    useEffect(() => {
        const newSteps = generateLinearSearchSteps(initialArray, target);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(autoStart);
    }, [initialArray, target, autoStart]);

    useEffect(() => {
        const BASE_INTERVAL = 600;

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
            onComplete(currentStepData.foundIndex, currentStepData.comparisonCount);
        }
    }, [isComplete, onComplete, currentStepData.foundIndex, currentStepData.comparisonCount]);

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
        setCurrentStep(0);
        setIsPlaying(false);
    }, []);

    const handleSpeedChange = useCallback((newSpeed: number) => {
        setSpeed(newSpeed);
    }, []);

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    /**
     * getElementState - Xác định state của element.
     */
    const getElementState = (index: number): 'found' | 'current' | 'checked' | 'pending' => {
        if (currentStepData.foundIndex === index) {
            return 'found';
        }
        if (currentStepData.currentIndex === index) {
            return 'current';
        }
        if (currentStepData.checkedIndices.includes(index)) {
            return 'checked';
        }
        return 'pending';
    };

    const getElementColor = (state: ReturnType<typeof getElementState>): string => {
        const colors: Record<typeof state, string> = {
            found: 'var(--viz-color-found, #06b6d4)',
            current: 'var(--viz-color-comparing, #fbbf24)',
            checked: 'var(--viz-color-swapping, #ef4444)',
            pending: 'var(--viz-color-normal, #4a90d9)',
        };
        return colors[state];
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="viz-container linear-search-visualizer">
            {/* Header */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || 'Linear Search (Tìm kiếm tuyến tính)'}
                    </h2>
                    <p className="viz-subtitle">
                        Tìm target = <strong>{target}</strong> bằng cách duyệt tuần tự
                    </p>
                </div>

                <div className="viz-info-badges">
                    <span className="viz-badge"><i className="fi fi-rr-clock"></i> Time: O(n)</span>
                    <span className="viz-badge"><i className="fi fi-rr-database"></i> Space: O(1)</span>
                    <span className="viz-badge">
                        <i className="fi fi-rr-stats"></i> So sánh: {currentStepData.comparisonCount}
                    </span>
                </div>
            </header>

            {/* Array Visualization */}
            <div className="viz-array-container" style={{ minHeight: '180px', alignItems: 'center' }}>
                {/* Pointer Arrow */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px',
                }}>
                    {currentStepData.array.map((_, index) => (
                        <div
                            key={`pointer-${index}`}
                            style={{
                                width: '50px',
                                textAlign: 'center',
                                fontSize: '1.2rem',
                                opacity: currentStepData.currentIndex === index ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                            }}
                        >
                            ↓
                        </div>
                    ))}
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
                            const isCurrent = state === 'current';
                            const isFound = state === 'found';
                            const isChecked = state === 'checked';

                            return (
                                <motion.div
                                    key={`element-${index}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        y: isCurrent ? -8 : 0,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 25,
                                        delay: index * 0.03,
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
                                        color: isFound || isCurrent ? 'rgba(0,0,0,0.8)' : 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: isFound
                                            ? '0 0 20px rgba(6, 182, 212, 0.6)'
                                            : isCurrent
                                                ? '0 0 15px rgba(251, 191, 36, 0.5)'
                                                : '0 2px 4px rgba(0,0,0,0.2)',
                                        border: value === target
                                            ? '2px solid var(--viz-color-found)'
                                            : '1px solid rgba(255,255,255,0.1)',
                                        position: 'relative',
                                        opacity: isChecked ? 0.6 : 1,
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

                                    {/* X mark for checked (not found) */}
                                    {isChecked && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: 'var(--viz-color-swapping)',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            ✗
                                        </motion.span>
                                    )}

                                    {/* Checkmark for found */}
                                    {isFound && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: 'var(--viz-color-sorted)',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            ✓
                                        </motion.span>
                                    )}
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

            {/* Step Description */}
            <motion.div
                className="viz-step-description"
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {currentStepData.description}
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
                        <span>Chưa kiểm tra</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-comparing)' }} />
                        <span>Đang kiểm tra</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-swapping)' }} />
                        <span>Không khớp</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color" style={{ background: 'var(--viz-color-found)' }} />
                        <span>Tìm thấy!</span>
                    </div>
                </div>
            )}

            {/* Comparison note */}
            <div style={{
                padding: '12px 16px',
                background: 'var(--viz-bg-glass)',
                borderRadius: 'var(--viz-border-radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--viz-text-secondary)',
            }}>
                <i className="fi fi-rr-bulb"></i> <strong>So với Binary Search:</strong> Linear Search không yêu cầu mảng sorted,
                nhưng với mảng {initialArray.length} phần tử, Binary Search chỉ cần
                ~{Math.ceil(Math.log2(initialArray.length))} lần so sánh (O(log n))
                thay vì {initialArray.length} lần (O(n)).
            </div>
        </div>
    );
};

// =============================================================================
// EXPORTS
// =============================================================================

LinearSearchVisualizer.displayName = 'LinearSearchVisualizer';

export default LinearSearchVisualizer;
export { LinearSearchVisualizer };
export type { LinearSearchVisualizerProps, LinearSearchStep };
