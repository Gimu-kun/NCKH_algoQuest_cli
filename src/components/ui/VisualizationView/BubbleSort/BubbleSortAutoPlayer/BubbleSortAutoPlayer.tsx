import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './BubbleSortAutoPlayer.css';
import {
    StepBackwardOutlined,
    BackwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    ForwardOutlined,
    StepForwardOutlined,
    QuestionCircleTwoTone,
} from '@ant-design/icons';
import { Slider } from 'antd';

// Định nghĩa các loại hành động trong thuật toán Bubble Sort
type AlgoAction =
    | { type: 'INIT', instruction: string }
    | { type: 'OUTER_LOOP', i: number, instruction: string }
    | { type: 'COMPARE', i: number, j: number, instruction: string }
    | { type: 'SWAP', i: number, j: number, newArray: number[], instruction: string }
    | { type: 'KEEP', i: number, j: number, instruction: string }
    | { type: 'INNER_END', instruction: string }
    | { type: 'END', instruction: string };

interface Props {
    vizData:any,
    onFinish: (isPassed: boolean, quizSelectedId: string) => void
}

export const BubbleSortAutoPlayer:React.FC<Props> = ({ vizData, onFinish }) => {
    const { array: initialArray } = vizData;
    const quizOptions = vizData.quiz?.options || [];
    const correctAlgorithmId = vizData.quiz?.correct_id || "";

    // --- Core Logic & Pointer States ---
    const [array, setArray] = useState([...initialArray]);
    const [iPtr, setIPtr] = useState<number | null>(null);
    const [jPtr, setJPtr] = useState<number | null>(null);
    const [tick, setTick] = useState(0);

    // --- Playback Control States ---
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizSelectedId, setQuizSelectedId] = useState<string | null>(null);
    const [resultToast, setResultToast] = useState<{ success: boolean; message: string } | null>(null);

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);
    const maxVal = useMemo(() => Math.max(...initialArray, 1), [initialArray]);

    // --- 1. Tiền tính toán (Pre-compute Steps) ---
    const steps = useMemo(() => {
        const s: AlgoAction[] = [];
        let tempArr = [...initialArray];
        const n = tempArr.length;

        s.push({ type: 'INIT', instruction: "Bắt đầu thuật toán Sắp xếp nổi bọt (Bubble Sort)." });

        for (let i = 0; i < n - 1; i++) {
            s.push({ type: 'OUTER_LOOP', i, instruction: `Vòng lặp ngoài: Lượt quét thứ ${i + 1}.` });
            for (let j = 0; j < n - i - 1; j++) {
                s.push({ type: 'COMPARE', i, j, instruction: `So sánh cặp phần tử tại index ${j} (${tempArr[j]}) và ${j + 1} (${tempArr[j + 1]}).` });

                if (tempArr[j] > tempArr[j + 1]) {
                    [tempArr[j], tempArr[j + 1]] = [tempArr[j + 1], tempArr[j]];
                    s.push({
                        type: 'SWAP', i, j,
                        newArray: [...tempArr],
                        instruction: `${tempArr[j+1]} > ${tempArr[j]}, thực hiện hoán đổi để đưa giá trị lớn hơn về phía sau.`
                    });
                } else {
                    s.push({ type: 'KEEP', i, j, instruction: `${tempArr[j]} <= ${tempArr[j+1]}, giữ nguyên vị trí.` });
                }
            }
            s.push({ type: 'INNER_END', instruction: `Phần tử lớn nhất đã "nổi" về vị trí ${n - i - 1}.` });
        }

        s.push({ type: 'END', instruction: "Mảng đã được sắp xếp hoàn tất." });
        return s;
    }, [initialArray]);

    const currentInstruction = steps[currentStepIndex]?.instruction || "";

    // --- 2. Hàm thực thi một bước (Step Logic) ---
    const executeStep = useCallback((index: number) => {
        const step = steps[index];
        if (!step) return;

        switch (step.type) {
            case 'INIT':
                setArray([...initialArray]); setIPtr(null); setJPtr(null); break;
            case 'OUTER_LOOP':
                setIPtr(step.i); setJPtr(null); break;
            case 'COMPARE':
            case 'KEEP':
                setJPtr(step.j); break;
            case 'SWAP':
                setArray(step.newArray); setJPtr(step.j); break;
            case 'INNER_END':
                setJPtr(null); break;
            case 'END':
                setIPtr(null); setJPtr(null); break;
        }
    }, [initialArray, steps]);

    // --- 3. Playback Effects ---
    useEffect(() => {
        if (!chartContainerRef.current) return;
        const resizeObserver = new ResizeObserver(() => setTick(t => t + 1));
        resizeObserver.observe(chartContainerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (isPlaying && !showQuiz && currentStepIndex < steps.length - 1) {
            const timer = setInterval(() => setCurrentStepIndex(prev => prev + 1), 1000 / speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, currentStepIndex, steps.length, speed, showQuiz]);

    useEffect(() => {
        executeStep(currentStepIndex);
        if (currentStepIndex === steps.length - 1) {
            setIsPlaying(false);
            setTimeout(() => setShowQuiz(true), 1500);
        }
    }, [currentStepIndex, executeStep, steps.length]);

    // --- Handlers ---
    const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(true); setShowQuiz(false); setQuizSelectedId(null); setArray([...initialArray]); };
    const handleOptionSelect = (optionId: string) => {
        if (quizSelectedId) return;
        const isCorrect = optionId === correctAlgorithmId;
        setResultToast({ success: isCorrect, message: isCorrect ? "Chính xác! Bạn rất am hiểu thuật toán." : "Chưa đúng rồi! Đây là Bubble Sort." });
        setQuizSelectedId(optionId);
        setTimeout(() => onFinish(isCorrect, optionId), 3000);
    };

    const getPointerPos = (index: number | null, type: 'i' | 'j' | 'jNext'): React.CSSProperties => {
        if (index === null || !barRefs.current[index] || !chartContainerRef.current || currentStepIndex === steps.length - 1) {
            return { opacity: 0, visibility: 'hidden' };
        }
        const bar = barRefs.current[index]!;
        const x = bar.offsetLeft + (bar.offsetWidth / 2);
        return {
            transform: `translateX(${x}px) translateX(-50%)`,
            opacity: 1,
            zIndex: 20
        };
    };

    return (
        <div className="viz-layout auto-player bubble-sort-immersive">
            <div className="viz-main-area">
                {resultToast && (
                    <div className={`result-toast ${resultToast.success ? 'success' : 'fail'}`}>
                        <div className="result-icon">{resultToast.success ? '🏆' : '❌'}</div>
                        <div className="result-info">
                            <h4>{resultToast.success ? 'Tuyệt vời!' : 'Rất tiếc!'}</h4>
                            <p>{resultToast.message}</p>
                        </div>
                    </div>
                )}

                <h3 className="header-title">Minh họa tự động: Bubble Sort</h3>

                <div className="chart-container" ref={chartContainerRef}>
                    <div className="pointer p-j animated-pointer" style={getPointerPos(jPtr, 'j')}>J</div>
                    <div className="pointer p-j-next animated-pointer" style={getPointerPos(jPtr !== null ? jPtr + 1 : null, 'jNext')}>J+1</div>

                    {array.map((val, idx) => {
                        const isSorted = (iPtr !== null && idx >= array.length - iPtr) || currentStepIndex === steps.length - 1;
                        const isComparing = jPtr !== null && (idx === jPtr || idx === jPtr + 1);
                        return (
                            <div key={`${idx}-${val}`} ref={(el) => {barRefs.current[idx] = el}} className="bar-wrapper">
                                <div className="bar" style={{
                                    height: `${(val / maxVal) * 180}px`,
                                    backgroundColor: isSorted ? '#238636' : isComparing ? '#58a6ff' : '#21262d',
                                    borderColor: isSorted ? '#3fb950' : isComparing ? '#58a6ff' : '#30363d',
                                    transition: 'all 0.4s ease'
                                }}>
                                    <span className="bar-value">{val}</span>
                                </div>
                                <span className="bar-index monospace">{idx}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="instruction-box animate-fadeIn">
                    <div className="instruction-icon">💡</div>
                    <div className="instruction-text">{currentInstruction}</div>
                </div>

                <div className="playback-panel">
                    <div className="playback-controls">
                        <button className="btn-playback" onClick={handleReset}><StepBackwardOutlined /></button>
                        <button className="btn-playback" onClick={() => {setCurrentStepIndex(prev => Math.max(0, prev - 1)); setIsPlaying(false);}}><BackwardOutlined /></button>
                        <button className="btn-playback play-pause" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        </button>
                        <button className="btn-playback" onClick={() => {setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1)); setIsPlaying(false);}}><ForwardOutlined /></button>
                        <button className="btn-playback" onClick={() => {setCurrentStepIndex(steps.length - 2); setIsPlaying(true);}}><StepForwardOutlined /></button>
                    </div>
                    <div className="speed-control">
                        <span>Tốc độ: {speed}x</span>
                        <Slider min={0.5} max={3} step={0.5} value={speed} onChange={setSpeed} style={{ width: 150 }} />
                    </div>
                </div>

                {showQuiz && (
                    <div className="quiz-panel animate-popIn">
                        <div className="quiz-header">
                            <QuestionCircleTwoTone style={{ fontSize: '1.5rem' }} />
                            <h4>Nhận dạng Thuật toán</h4>
                        </div>
                        <p>Dựa trên minh họa vừa xem, đây là thuật toán nào?</p>
                        <div className="quiz-options">
                            {quizOptions.map((opt: any) => (
                                <button key={opt.id} className={`quiz-opt-btn ${quizSelectedId === opt.id ? (opt.id === correctAlgorithmId ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => handleOptionSelect(opt.id)} disabled={quizSelectedId !== null}>
                                    {opt.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};