/**
 * =============================================================================
 * FILE: SortingVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Tạo component trực quan hóa các thuật toán sắp xếp (Sorting Algorithms).
 * - Hỗ trợ: Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort.
 * - Hiển thị từng bước (step-by-step) của thuật toán với animations.
 *
 * CHỨC NĂNG CHI TIẾT (Detailed Functionality):
 * 1. Nhận mảng đầu vào và loại thuật toán từ props.
 * 2. Generate danh sách các bước (steps) để sắp xếp mảng.
 * 3. Hiển thị mảng dưới dạng các thanh (bars) với ArrayBar component.
 * 4. Animate qua từng bước: highlight comparing, swapping, sorted elements.
 * 5. Cho phép user điều khiển: Play/Pause, Step, Reset, Speed.
 *
 * KỸ THUẬT SỬ DỤNG (Techniques):
 * 1. Generator Functions: Tạo steps một cách lazy, tiết kiệm memory.
 * 2. Framer Motion AnimatePresence: Smooth transitions khi array thay đổi.
 * 3. useEffect + setInterval: Auto-play qua các steps.
 * 4. useRef: Lưu interval ID để có thể clear khi cần.
 * 5. State Management: useState cho local state, không cần global store.
 *
 * STEPS FLOW (Luồng hoạt động):
 * 1. Component mount → generate tất cả sorting steps.
 * 2. User click Play → setInterval bắt đầu, currentStep tăng dần.
 * 3. Mỗi step → update displayArray và highlightedIndices.
 * 4. ArrayBar components animate dựa trên state.
 * 5. Hoàn thành → tất cả bars có state 'sorted'.
 *
 * CÁC THUẬT TOÁN ĐƯỢC HỖ TRỢ (Supported Algorithms):
 *
 * 1. BUBBLE SORT (Sắp xếp nổi bọt):
 *    - Technique: Comparison-based, in-place, stable.
 *    - Flow: So sánh các cặp liền kề, swap nếu sai thứ tự.
 *    - Time: O(n²) average/worst, O(n) best (đã sorted).
 *    - Space: O(1).
 *    - Ưu điểm: Đơn giản, dễ hiểu, stable sort.
 *    - Nhược điểm: Chậm với dữ liệu lớn.
 *
 * 2. SELECTION SORT (Sắp xếp chọn):
 *    - Technique: Comparison-based, in-place, unstable.
 *    - Flow: Tìm min trong unsorted portion, swap về đầu.
 *    - Time: O(n²) tất cả cases.
 *    - Space: O(1).
 *    - Ưu điểm: Ít swaps (tốt nếu swap tốn kém).
 *    - Nhược điểm: Không stable, luôn O(n²).
 *
 * 3. INSERTION SORT (Sắp xếp chèn):
 *    - Technique: Comparison-based, in-place, stable.
 *    - Flow: Chèn từng phần tử vào đúng vị trí trong sorted portion.
 *    - Time: O(n²) average/worst, O(n) best.
 *    - Space: O(1).
 *    - Ưu điểm: Nhanh với small/nearly sorted data, stable.
 *    - Nhược điểm: Chậm với large random data.
 *
 * 4. MERGE SORT (Sắp xếp trộn):
 *    - Technique: Divide and Conquer, stable.
 *    - Flow: Chia đôi → sort đệ quy → merge.
 *    - Time: O(n log n) tất cả cases.
 *    - Space: O(n) - cần auxiliary array.
 *    - Ưu điểm: Luôn O(n log n), stable.
 *    - Nhược điểm: Tốn memory O(n).
 *
 * 5. QUICK SORT (Sắp xếp nhanh):
 *    - Technique: Divide and Conquer, in-place (gần như), unstable.
 *    - Flow: Chọn pivot → partition → sort đệ quy.
 *    - Time: O(n log n) average, O(n²) worst (rare với good pivot).
 *    - Space: O(log n) call stack.
 *    - Ưu điểm: Nhanh nhất trong practice, cache-friendly.
 *    - Nhược điểm: Worst case O(n²), không stable.
 *
 * SO SÁNH TỔNG QUAN:
 * ┌──────────────────┬──────────────┬──────────────┬─────────┬────────┐
 * │ Algorithm        │ Time (avg)   │ Time (worst) │ Space   │ Stable │
 * ├──────────────────┼──────────────┼──────────────┼─────────┼────────┤
 * │ Bubble Sort      │ O(n²)        │ O(n²)        │ O(1)    │ Yes    │
 * │ Selection Sort   │ O(n²)        │ O(n²)        │ O(1)    │ No     │
 * │ Insertion Sort   │ O(n²)        │ O(n²)        │ O(1)    │ Yes    │
 * │ Merge Sort       │ O(n log n)   │ O(n log n)   │ O(n)    │ Yes    │
 * │ Quick Sort       │ O(n log n)   │ O(n²)        │ O(log n)│ No     │
 * └──────────────────┴──────────────┴──────────────┴─────────┴────────┘
 *
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrayBar, { type ArrayBarState } from './ArrayBar';
import AnimationControls from '../shared/AnimationControls';
import '../shared/VisualizationStyles.css';

// Import Types
import type { SortingStep, SortingAlgorithmType } from '../types';

// Import Algorithms
import { generateBubbleSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/BubbleSort';
import { generateSelectionSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/SelectionSort';
import { generateInsertionSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/InsertionSort';
import { generateQuickSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/QuickSort';
import { generateMergeSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/MergeSort';
import { generateHeapSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/HeapSort';
import { generateInterchangeSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/InterchangeSort';
import { generateShakerSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/ShakerSort';
import { generateShellSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/ShellSort';
import { generateBinaryInsertionSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/BinaryInsertionSort';
import { generateCountingSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/CountingSort';
import { generateRadixSortSteps } from '../../../algo_demos/Chapter_2_Search_Sort/RadixSort';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * SortingVisualizerProps - Props cho SortingVisualizer component.
 */
interface SortingVisualizerProps {
    /**
     * initialArray: Mảng ban đầu cần sắp xếp.
     */
    initialArray: number[];

    /**
     * algorithm: Loại thuật toán sắp xếp.
     */
    algorithm: SortingAlgorithmType;

    /**
     * title: Tiêu đề hiển thị (optional).
     */
    title?: string;

    /**
     * showLegend: Có hiển thị legend (chú thích màu) không.
     * Default = true.
     */
    showLegend?: boolean;

    /**
     * autoStart: Tự động bắt đầu play khi component mount.
     * Default = false.
     */
    autoStart?: boolean;
    onRegenerate?: () => void;
    /**
     * onComplete: Callback khi sắp xếp hoàn tất.
     * Optional.
     */
    onComplete?: (sortedArray: number[]) => void;
}

/**
 * SortingVisualizerProps - Props cho SortingVisualizer component.
 */
interface SortingVisualizerProps {
    /**
     * initialArray: Mảng ban đầu cần sắp xếp.
     */
    initialArray: number[];

    /**
     * algorithm: Loại thuật toán sắp xếp.
     */
    algorithm: SortingAlgorithmType;

    /**
     * title: Tiêu đề hiển thị (optional).
     */
    title?: string;

    /**
     * showLegend: Có hiển thị legend (chú thích màu) không.
     * Default = true.
     */
    showLegend?: boolean;

    /**
     * autoStart: Tự động bắt đầu play khi component mount.
     * Default = false.
     */
    autoStart?: boolean;
    onRegenerate?: () => void;
    /**
     * onComplete: Callback khi sắp xếp hoàn tất.
     * Optional.
     */
    onComplete?: (sortedArray: number[]) => void;
}

// =============================================================================
// ALGORITHM METADATA - Thông tin về các thuật toán
// =============================================================================

/**
 * ALGORITHM_INFO - Metadata cho từng thuật toán.
 * Dùng để hiển thị title, complexity info cho user.
 */
const ALGORITHM_INFO: Record<SortingAlgorithmType, {
    name: string;
    nameVi: string;
    timeComplexity: string;
    spaceComplexity: string;
    stable: boolean;
}> = {
    bubble: {
        name: 'Bubble Sort',
        nameVi: 'Sắp xếp nổi bọt',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
    },
    selection: {
        name: 'Selection Sort',
        nameVi: 'Sắp xếp chọn',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: false,
    },
    insertion: {
        name: 'Insertion Sort',
        nameVi: 'Sắp xếp chèn',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
    },
    merge: {
        name: 'Merge Sort',
        nameVi: 'Sắp xếp trộn',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        stable: true,
    },
    quick: {
        name: 'Quick Sort',
        nameVi: 'Sắp xếp nhanh',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        stable: false,
    },
    heap: {
        name: 'Heap Sort',
        nameVi: 'Sắp xếp vun đống',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        stable: false,
    },
    shell: {
        name: 'Shell Sort',
        nameVi: 'Sắp xếp Shell',
        timeComplexity: 'O(n^1.3)',
        spaceComplexity: 'O(1)',
        stable: false,
    },
    shaker: {
        name: 'Shaker Sort',
        nameVi: 'Sắp xếp lắc',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
    },
    interchange: {
        name: 'Interchange Sort',
        nameVi: 'Sắp xếp đổi chỗ',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: false,
    },
    binaryInsertion: {
        name: 'Binary Insertion Sort',
        nameVi: 'Sắp xếp chèn nhị phân',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
    },
    counting: {
        name: 'Counting Sort',
        nameVi: 'Sắp xếp đếm',
        timeComplexity: 'O(n + k)',
        spaceComplexity: 'O(k)',
        stable: true,
    },
    radix: {
        name: 'Radix Sort',
        nameVi: 'Sắp xếp theo cơ số',
        timeComplexity: 'O(d(n + k))',
        spaceComplexity: 'O(n + k)',
        stable: true,
    },
};

// =============================================================================
// STEP GENERATORS - Các hàm tạo steps cho từng thuật toán
// =============================================================================





/**
 * generateSortingSteps - Factory function chọn generator phù hợp.
 *
 * Factory Pattern: Tạo object (steps) dựa trên type.
 *
 * @param arr - Mảng cần sắp xếp
 * @param algorithm - Loại thuật toán
 * @returns Mảng các SortingStep
 */
function generateSortingSteps(arr: number[], algorithm: SortingAlgorithmType): SortingStep[] {
    switch (algorithm) {
        case 'bubble':
            return generateBubbleSortSteps(arr);
        case 'selection':
            return generateSelectionSortSteps(arr);
        case 'insertion':
            return generateInsertionSortSteps(arr);
        case 'merge':
            return generateMergeSortSteps(arr);
        case 'quick':
            return generateQuickSortSteps(arr);
        case 'heap':
            return generateHeapSortSteps(arr);
        // New sorting algorithms - use similar step patterns
        case 'shell':
            return generateShellSortSteps(arr);
        case 'shaker':
            return generateShakerSortSteps(arr);
        case 'interchange':
            return generateInterchangeSortSteps(arr);
        case 'binaryInsertion':
            return generateBinaryInsertionSortSteps(arr);
        case 'counting':
            return generateCountingSortSteps(arr);
        case 'radix':
            return generateRadixSortSteps(arr);
        default:
            // TypeScript exhaustiveness check
            return generateBubbleSortSteps(arr);
    }
}

// =============================================================================
// COMPONENT: SortingVisualizer
// =============================================================================

/**
 * SortingVisualizer Component
 *
 * Component chính để trực quan hóa các thuật toán sắp xếp.
 *
 * @param props - SortingVisualizerProps
 * @returns JSX.Element
 */
const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
    initialArray,
    algorithm,
    title,
    showLegend = true,
    autoStart = false,
    onRegenerate,
    onComplete,
}) => {
    // =========================================================================
    // STATE - Các state của component
    // =========================================================================

    /**
     * steps: Tất cả các bước của thuật toán.
     * Được generate 1 lần khi mount hoặc khi algorithm/initialArray thay đổi.
     */
    const [steps, setSteps] = useState<SortingStep[]>([]);

    /**
     * currentStep: Index của bước hiện tại đang hiển thị.
     */
    const [currentStep, setCurrentStep] = useState(0);

    /**
     * isPlaying: Đang auto-play hay đang pause.
     */
    const [isPlaying, setIsPlaying] = useState(false);

    /**
     * speed: Tốc độ animation (multiplier).
     * 1 = bình thường, 2 = nhanh gấp đôi, 0.5 = chậm gấp đôi.
     */
    const [speed, setSpeed] = useState(1);

    // =========================================================================
    // REFS - References không trigger re-render
    // =========================================================================

    /**
     * intervalRef: Lưu ID của setInterval để có thể clear.
     * Dùng useRef thay vì state vì không cần re-render khi ID thay đổi.
     */
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // =========================================================================
    // COMPUTED VALUES - Giá trị tính toán từ state
    // =========================================================================

    /**
     * currentStepData: Data của step hiện tại.
     * Fallback về empty step nếu không có.
     */
    const currentStepData = steps[currentStep] || {
        array: initialArray,
        comparing: [],
        swapping: [],
        sorted: [],
        description: '',
    };

    /**
     * maxValue: Giá trị lớn nhất trong mảng.
     * Dùng để tính tỷ lệ chiều cao cho ArrayBar.
     * useMemo để tránh tính lại mỗi render.
     */
    const maxValue = useMemo(
        () => Math.max(...initialArray, 1), // Math.max với 1 để tránh 0
        [initialArray]
    );

    /**
     * algoInfo: Metadata của thuật toán hiện tại.
     */
    const algoInfo = ALGORITHM_INFO[algorithm];

    /**
     * isComplete: Đã hoàn thành tất cả steps chưa.
     */
    const isComplete = currentStep >= steps.length - 1;

    // =========================================================================
    // EFFECTS - Side effects
    // =========================================================================

    /**
     * Effect: Generate steps khi algorithm hoặc initialArray thay đổi.
     *
     * Dependencies: [algorithm, initialArray]
     * - Khi algorithm thay đổi → generate lại steps.
     * - Khi initialArray thay đổi → generate lại steps.
     */
    useEffect(() => {
        const newSteps = generateSortingSteps(initialArray, algorithm);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(autoStart);
    }, [algorithm, initialArray, autoStart]);

    /**
     * Effect: Auto-play interval.
     *
     * Khi isPlaying = true: Tạo interval để tự động tiến bước.
     * Khi isPlaying = false hoặc complete: Clear interval.
     *
     * Interval time = BASE_INTERVAL / speed
     * - speed = 1: 800ms/step
     * - speed = 2: 400ms/step
     * - speed = 0.5: 1600ms/step
     *
     * Cleanup function: Clear interval khi effect re-run hoặc unmount.
     */
    useEffect(() => {
        const BASE_INTERVAL = 800; // milliseconds

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
            // Clear interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, speed, steps.length, isComplete]);

    /**
     * Effect: Call onComplete khi hoàn thành.
     */
    useEffect(() => {
        if (isComplete && onComplete && steps.length > 0) {
            const finalArray = steps[steps.length - 1].array;
            onComplete(finalArray);
        }
    }, [isComplete, onComplete, steps]);

    // =========================================================================
    // CALLBACKS - Event handlers
    // =========================================================================

    /**
     * handlePlayPause: Toggle play/pause state.
     */
    const handlePlayPause = useCallback(() => {
        if (isComplete) {
            // Reset và play từ đầu
            setCurrentStep(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((prev) => !prev);
        }
    }, [isComplete]);

    /**
     * handleStepForward: Tiến 1 bước.
     */
    const handleStepForward = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [currentStep, steps.length]);

    /**
     * handleStepBackward: Lùi 1 bước.
     */
    const handleStepBackward = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    /**
     * handleReset: Reset về trạng thái ban đầu.
     */
    const handleReset = useCallback(() => {
        if (onRegenerate) {
            onRegenerate();
        } else {
            setCurrentStep(0);
            setIsPlaying(false);
        }
    }, [onRegenerate]);

    /**
     * handleSpeedChange: Thay đổi tốc độ.
     */
    const handleSpeedChange = useCallback((newSpeed: number) => {
        setSpeed(newSpeed);
    }, []);

    // =========================================================================
    // HELPER FUNCTIONS - Hàm hỗ trợ render
    // =========================================================================

    /**
     * getBarState: Xác định state của bar dựa trên index.
     *
     * Priority order:
     * 1. swapping - cao nhất, đang thực hiện action
     * 2. comparing - đang xem xét
     * 3. pivot - đặc biệt (Quick Sort)
     * 4. sorted - đã hoàn thành
     * 5. normal - mặc định
     */
    const getBarState = (index: number): ArrayBarState => {
        if (currentStepData.swapping.includes(index)) {
            return 'swapping';
        }
        if (currentStepData.comparing.includes(index)) {
            return 'comparing';
        }
        if (currentStepData.pivot === index) {
            return 'pivot';
        }
        if (currentStepData.sorted.includes(index)) {
            return 'sorted';
        }
        return 'normal';
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="viz-container sorting-visualizer">
            {/* Header Section */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || `${algoInfo.nameVi} (${algoInfo.name})`}
                    </h2>
                    <p className="viz-subtitle">
                        Trực quan hóa từng bước của thuật toán
                    </p>
                </div>

                {/* Info Badges */}
                <div className="viz-info-badges">
                    <span className="viz-badge">
                        <i className="fi fi-rr-clock-three"></i> Time: {algoInfo.timeComplexity}
                    </span>
                    <span className="viz-badge">
                        <i className="fi fi-rr-database-management"></i> Space: {algoInfo.spaceComplexity}
                    </span>
                    <span className="viz-badge">
                        {algoInfo.stable ? <><i className="fi fi-br-check"></i> Ổn định</> : <><i className="fi fi-rr-cross"></i> Không ổn định</>}
                    </span>
                </div>
            </header>

            {/* Array Visualization */}
            <div className="viz-array-container">
                <AnimatePresence mode="popLayout">
                    {currentStepData.array.map((value: number, index: number) => (
                        <ArrayBar
                            key={`bar-${index}-${value}`}
                            value={value}
                            index={index}
                            state={getBarState(index)}
                            maxValue={maxValue}
                            showValue={currentStepData.array.length <= 15}
                            containerHeight={250}
                            animationDelay={index * 0.02}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Step Description */}
            <motion.div
                className="viz-step-description"
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="step-text">{currentStepData.description || 'Đang chuẩn bị...'}</div>

            </motion.div>

            {/* Code Snippet Display - Hiển thị code minh họa cho từng bước */}
            {currentStepData.codeSnippet && (
                <motion.div
                    key={`code-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginTop: '8px',
                        border: '1px solid var(--viz-border-primary)',
                        fontFamily: '"Fira Code", "Consolas", monospace',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: 'var(--viz-text-secondary)',
                        whiteSpace: 'pre-wrap',
                        overflowX: 'auto',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px',
                        color: 'var(--viz-color-comparing)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                    }}>
                        <i className="fi fi-rr-code-simple"></i>
                        CODE MINH HỌA
                    </div>
                    {currentStepData.codeSnippet}
                </motion.div>
            )}

            {/* Animation Controls */}
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
                canStepBackward={currentStep > 0}
                canStepForward={currentStep < steps.length - 1}
            />

            {/* Legend */}
            {showLegend && (
                <div className="viz-legend">
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--normal" />
                        <span>Bình thường</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--comparing" />
                        <span>Đang so sánh</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--swapping" />
                        <span>Đang swap</span>
                    </div>
                    <div className="viz-legend-item">
                        <span className="viz-legend-color viz-legend-color--sorted" />
                        <span>Đã sắp xếp</span>
                    </div>
                    {algorithm === 'quick' && (
                        <div className="viz-legend-item">
                            <span className="viz-legend-color viz-legend-color--pointer" />
                            <span>Pivot</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// =============================================================================
// DISPLAY NAME
// =============================================================================

SortingVisualizer.displayName = 'SortingVisualizer';

// =============================================================================
// EXPORTS
// =============================================================================

export default SortingVisualizer;
export { SortingVisualizer };
export type { SortingVisualizerProps, SortingStep };
