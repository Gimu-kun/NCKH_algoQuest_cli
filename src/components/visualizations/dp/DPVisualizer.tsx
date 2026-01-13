/**
 * =============================================================================
 * FILE: DPVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa các thuật toán Quy hoạch động (Dynamic Programming).
 * - Hỗ trợ: Fibonacci Sequence (Tabulation).
 * - Hiển thị bảng phương án (DP Table) và quá trình điền bảng.
 *
 * =============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimationControls from '../shared/AnimationControls';
import '../shared/VisualizationStyles.css';

// =============================================================================
// TYPES
// =============================================================================

export type DPAlgorithmType = 'fibonacci' | 'knapsack';

interface DPStep {
    dpTable: (number | null)[]; // null means not calculated yet
    comparing: number[];        // Indices being used for calculation
    current: number | null;     // Index being calculated
    description: string;
    codeSnippet?: string;
}

interface DPVisualizerProps {
    algorithm: DPAlgorithmType;
    target: number; // Input size n
    autoStart?: boolean;
    onRegenerate?: () => void;
}

// =============================================================================
// ALGORITHMS
// =============================================================================

function generateFibonacciSteps(n: number): DPStep[] {
    const steps: DPStep[] = [];
    const dp: (number | null)[] = Array(n + 1).fill(null);

    // Initial State
    steps.push({
        dpTable: [...dp],
        comparing: [],
        current: null,
        description: `Bắt đầu tính số Fibonacci thứ ${n} bằng quy hoạch động (Tabulation). Tạo mảng dp kích thước ${n + 1}.`,
        codeSnippet: `// FIBONACCI (DP TABULATION) - O(n) time, O(n) space
// Ý tưởng: Lưu kết quả bài toán con vào mảng để tránh tính lại.
// Công thức: F(n) = F(n-1) + F(n-2)

int[] dp = new int[n + 1];`,
    });

    // Base cases
    steps.push({
        dpTable: [...dp],
        comparing: [],
        current: 0,
        description: 'Khởi tạo cơ sở: dp[0] = 0',
        codeSnippet: `// Bài toán cơ sở (Base Case 1)
dp[0] = 0;`,
    });
    dp[0] = 0;

    if (n >= 1) {
        steps.push({
            dpTable: [...dp],
            comparing: [],
            current: 1,
            description: 'Khởi tạo cơ sở: dp[1] = 1',
            codeSnippet: `// Bài toán cơ sở (Base Case 2)
dp[0] = 0;
dp[1] = 1;`,
        });
        dp[1] = 1;
    }

    // Iteration
    for (let i = 2; i <= n; i++) {
        steps.push({
            dpTable: [...dp],
            comparing: [i - 1, i - 2],
            current: i,
            description: `Tính dp[${i}]: Lấy dp[${i - 1}] + dp[${i - 2}]`,
            codeSnippet: `// Tính toán bài toán con thứ ${i}
// Dựa vào 2 kết quả trước đó
dp[${i}] = dp[${i} - 1] + dp[${i} - 2];
// dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]}`,
        });

        dp[i] = (dp[i - 1] || 0) + (dp[i - 2] || 0);

        steps.push({
            dpTable: [...dp],
            comparing: [],
            current: i,
            description: `Kết quả: dp[${i}] = ${dp[i]}`,
            codeSnippet: `// Kết quả lưu vào bảng
dp[${i}] = ${dp[i]};
// Tiếp tục tính số tiếp theo...`,
        });
    }

    steps.push({
        dpTable: [...dp],
        comparing: [],
        current: null,
        description: `Hoàn thành! Số Fibonacci thứ ${n} là ${dp[n]}.`,
        codeSnippet: `// Kết thúc thuật toán
return dp[n]; // ${dp[n]}

// ƯU ĐIỂM DP (Tabulation):
// - Nhanh hơn Đệ quy thường (O(n) vs O(2^n)).
// - Tránh Stack Overflow do đệ quy sâu.
// - Dễ dàng tối ưu không gian xuống O(1).`,
    });

    return steps;
}

// =============================================================================
// COMPONENT
// =============================================================================

const DPVisualizer: React.FC<DPVisualizerProps> = ({ algorithm, target, autoStart = false, onRegenerate }) => {
    const [steps, setSteps] = useState<DPStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const timerRef = useRef<any>(null);

    // Limit target size for visualization
    const safeTarget = Math.min(Math.max(target || 5, 2), 20);

    useEffect(() => {
        const generatedSteps = generateFibonacciSteps(safeTarget);
        setSteps(generatedSteps);
        setCurrentStepIndex(0);
        setIsPlaying(autoStart);
    }, [algorithm, safeTarget, autoStart]);

    useEffect(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timerRef.current = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, 1000 / speed);
        } else {
            setIsPlaying(false);
        }
        return () => clearTimeout(timerRef.current);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleStepForward = () => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
    const handleStepBackward = () => setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    const handleReset = () => {
        if (onRegenerate) onRegenerate();
        else { setIsPlaying(false); setCurrentStepIndex(0); }
    };
    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return <div>Loading...</div>;

    return (
        <div className="viz-container">
            <header className="viz-header">
                <h2 className="viz-title">
                    Fibonacci Sequence (Dynamic Programming)
                </h2>
                <p className="viz-subtitle">Tính số Fibonacci thứ {safeTarget}</p>
            </header>

            <div className="viz-main-area" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* DP Table Display */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    padding: '20px',
                    background: 'var(--viz-bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--viz-border-primary)',
                    justifyContent: 'center'
                }}>
                    <AnimatePresence>
                        {currentStep.dpTable.map((val, idx) => {
                            let stateClass = 'default';
                            if (currentStep.current === idx) stateClass = 'sorted'; // Active calculation
                            else if (currentStep.comparing.includes(idx)) stateClass = 'comparing'; // Being read
                            else if (val !== null) stateClass = 'normal';

                            return (
                                <motion.div
                                    key={idx}
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: stateClass === 'sorted' ? 1.1 : 1,
                                        opacity: 1,
                                        backgroundColor:
                                            stateClass === 'sorted' ? 'var(--viz-color-sorted)' :
                                                stateClass === 'comparing' ? 'var(--viz-color-comparing)' :
                                                    stateClass === 'normal' ? 'var(--viz-bg-glass)' :
                                                        'rgba(255,255,255,0.05)',
                                        borderColor: stateClass === 'sorted' ? 'white' : 'var(--viz-border-primary)'
                                    }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        position: 'relative',
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {val !== null ? val : '?'}
                                    </span>
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        fontSize: '0.65rem',
                                        color: 'var(--viz-text-muted)'
                                    }}>
                                        dp[{idx}]
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Description and Code */}
                <div className="viz-info-panel">
                    <div className="viz-step-description">
                        {currentStep.description}
                    </div>
                    {currentStep.codeSnippet && (
                        <div style={{
                            marginTop: '12px',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap',
                            color: 'var(--viz-text-code, #e2e8f0)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '8px',
                                color: 'var(--viz-color-comparing)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                            }}>
                                <i className="fi fi-rr-code-simple"></i>
                                CODE MINH HỌA
                            </div>
                            {currentStep.codeSnippet}
                        </div>
                    )}
                </div>
            </div>

            <AnimationControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={handleSpeedChange}
                currentStep={currentStepIndex}
                totalSteps={steps.length - 1}
            />
        </div>
    );
};

export default DPVisualizer;
