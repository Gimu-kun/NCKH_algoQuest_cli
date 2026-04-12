import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './SelectionSortAutoPlayer.css'; // Sẽ tạo file CSS sau
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

// Định nghĩa các loại hành động trong thuật toán
type AlgoAction =
    | { type: 'INIT', instruction: string }
    | { type: 'OUTER_LOOP', i: number, instruction: string }
    | { type: 'SET_MIN', minIdx: number, instruction: string }
    | { type: 'SCAN', j: number, instruction: string }
    | { type: 'UPDATE_MIN', minIdx: number, instruction: string }
    | { type: 'SWAP', i: number, minIdx: number, newArray: number[], instruction: string }
    | { type: 'END', instruction: string };

interface Props {
    vizData:any,
    onFinish: (isPassed: boolean, quizSelectedId: string) => void
}

export const SelectionSortAutoPlayer: React.FC<Props>  = ({ vizData, onFinish }) => {
    const { array: initialArray } = vizData;
    const quizOptions = vizData.quiz?.options || [];
    const correctAlgorithmId = vizData.quiz?.correct_id || "";

    // --- State cho Logic và Con trỏ ---
    const [array, setArray] = useState([...initialArray]);
    const [iPtr, setIPtr] = useState<number | null>(null);
    const [jPtr, setJPtr] = useState<number | null>(null);
    const [minPtr, setMinPtr] = useState<number | null>(null);
    const [tick, setTick] = useState(0); // Buộc render lại khi resize
    const [pointerTrigger, setPointerTrigger] = useState(0);

    // --- State cho Playback Control ---
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true); // Mặc định tự chạy
    const [speed, setSpeed] = useState(1); // 1 = 1 giây/bước
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizSelectedId, setQuizSelectedId] = useState<string | null>(null);
    const [resultToast, setResultToast] = useState<{ success: boolean; message: string } | null>(null);
    

    // --- Refs ---
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Tính maxVal để scale chiều cao cột
    const maxVal = useMemo(() => Math.max(...initialArray, 1), [initialArray]);


    const getBarStyles = (idx: number, val: number): React.CSSProperties => {
        const isFullyFinished = currentStepIndex === steps.length - 1;
        const isSorted = isFullyFinished || (iPtr !== null && idx < iPtr);
        const isMin = idx === minPtr;

        return {
            height: `${(val / maxVal) * 180}px`,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', // Animation mượt cho cả màu và vị trí
            backgroundColor: isSorted ? '#238636' : isMin && !isFullyFinished ? '#f1e05a' : '#21262d',
            borderColor: isSorted ? '#3fb950' : isMin && !isFullyFinished ? '#f1e05a' : '#30363d',
            boxShadow: isMin && !isFullyFinished ? '0 0 15px rgba(241, 224, 90, 0.4)' : 'none',
        };
    };

    
    // --- 1. Tiền tính toán (Pre-compute Steps) ---
    const steps = useMemo(() => {
        const s: AlgoAction[] = [];
        let tempArr = [...initialArray];
        const n = tempArr.length;

        s.push({ type: 'INIT', instruction: "Bắt đầu thuật toán Sắp xếp chọn (Selection Sort)." });

        for (let i = 0; i < n - 1; i++) {
            s.push({ type: 'OUTER_LOOP', i, instruction: `Vòng lặp ngoài: Xét vị trí index ${i}.` });
            let minIdx = i;
            s.push({ type: 'SET_MIN', minIdx, instruction: `Giả sử giá trị tại index ${i} (${tempArr[i]}) là nhỏ nhất.` });

            for (let j = i + 1; j < n; j++) {
                s.push({ type: 'SCAN', j, instruction: `So sánh giá trị tại index ${j} (${tempArr[j]}) với Min hiện tại (${tempArr[minIdx]}).` });
                if (tempArr[j] < tempArr[minIdx]) {
                    minIdx = j;
                    s.push({ type: 'UPDATE_MIN', minIdx, instruction: `Tìm thấy giá trị nhỏ hơn! Cập nhật Min mới tại index ${minIdx}.` });
                }
            }

            // Hoán đổi (luôn tạo bước swap để hiển thị mảng cập nhật)
            const oldValI = tempArr[i];
            const oldValMin = tempArr[minIdx];
            [tempArr[i], tempArr[minIdx]] = [tempArr[minIdx], tempArr[i]];

            s.push({
                type: 'SWAP',
                i,
                minIdx,
                newArray: [...tempArr],
                instruction: minIdx !== i
                    ? `Hoán đổi giá trị nhỏ nhất (${oldValMin}) về vị trí ${i}.`
                    : `Giá trị tại index ${i} đã là nhỏ nhất. Không cần hoán đổi.`
            });
        }

        s.push({ type: 'END', instruction: "Mảng đã được sắp xếp hoàn tất." });
        return s;
    }, [initialArray]);

    // Lời giải thích hiện tại
    const currentInstruction = steps[currentStepIndex]?.instruction || "";

    // --- 2. Hàm thực thi một bước (Step Logic) ---
    const executeStep = useCallback((index: number) => {
        const step = steps[index];
        if (!step) return;

        switch (step.type) {
            case 'INIT':
                setArray([...initialArray]); setIPtr(null); setJPtr(null); setMinPtr(null); break;
            case 'OUTER_LOOP':
                setIPtr(step.i); setJPtr(null); setMinPtr(null); break;
            case 'SET_MIN':
                setMinPtr(step.minIdx); break;
            case 'SCAN':
                setJPtr(step.j); break;
            case 'UPDATE_MIN':
                setMinPtr(step.minIdx); break;
            case 'SWAP':
                setArray(step.newArray); setMinPtr(step.minIdx); setJPtr(null); break;
            case 'END':
                setIPtr(null); setJPtr(null); setMinPtr(null); break;
        }
    }, [initialArray, steps]);

    // --- 3. Playback Control Effects ---

    // ResizeObserver để cập nhật con trỏ khi resize
    useEffect(() => {
        if (!chartContainerRef.current) return;
        const resizeObserver = new ResizeObserver(() => setTick(t => t + 1));
        resizeObserver.observe(chartContainerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Slice barRefs để khớp với độ dài mảng
    useEffect(() => { barRefs.current = barRefs.current.slice(0, array.length); }, [array]);

    // Tự động chạy
    useEffect(() => {
        if (isPlaying && !showQuiz && currentStepIndex < steps.length - 1) {
            const timer = setInterval(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, 1000 / speed); // speed > 0
            return () => clearInterval(timer);
        }
    }, [isPlaying, currentStepIndex, steps.length, speed, showQuiz]);

    useEffect(() => {
        executeStep(currentStepIndex);
        // Trigger tính toán lại vị trí sau một khoảng thời gian ngắn để DOM kịp render
        const timeout = setTimeout(() => setPointerTrigger(prev => prev + 1), 50);
        
        if (currentStepIndex === steps.length - 1) {
            setIsPlaying(false);
            setTimeout(() => setShowQuiz(true), 1500);
        }
        return () => clearTimeout(timeout);
    }, [currentStepIndex, executeStep, steps.length]);

    // Cập nhật UI khi currentStepIndex thay đổi
    useEffect(() => {
        executeStep(currentStepIndex);

        // Khi đến bước cuối cùng -> hiện Quiz
        if (currentStepIndex === steps.length - 1) {
            setIsPlaying(false);
            setTimeout(() => setShowQuiz(true), 1500);
        }
    }, [currentStepIndex, executeStep, steps.length]);

    // --- Handlers cho Control Buttons ---
    const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(true); setShowQuiz(false); setQuizSelectedId(null); };
    const handlePrev = () => { setCurrentStepIndex(prev => Math.max(0, prev - 1)); setIsPlaying(false); };
    const handleNext = () => { setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1)); setIsPlaying(false); };
    const handleSkipEnd = () => { setCurrentStepIndex(steps.length - 2); setIsPlaying(true); };

    // --- Quiz Handler ---
    const handleOptionSelect = (optionId: string) => {
        if (quizSelectedId) return;

        const isCorrect = optionId === correctAlgorithmId;
        const message = isCorrect ? "Chúc mừng! Bạn đã nhận dạng đúng thuật toán." : "Sai rồi! Thuật toán vừa chạy là Binary Search.";

        setResultToast({ success: isCorrect, message });

        setQuizSelectedId(optionId);
        setTimeout(() => onFinish(optionId === correctAlgorithmId, optionId), 2000);
    };

    // --- Tính toán vị trí Con trỏ trượt ---
    const getPointerPos = (index: number | null, type: 'i' | 'j' | 'Min'): React.CSSProperties => {
        if (index === null || !barRefs.current[index] || !chartContainerRef.current) {
            return { opacity: 0, visibility: 'hidden' };
        }

        const barWrapper = barRefs.current[index]!;
        // offsetLeft là chìa khóa để trượt theo cột
        const x = barWrapper.offsetLeft + (barWrapper.offsetWidth / 2);
        const isFullyFinished = currentStepIndex === steps.length - 1;

        return {
            transform: `translateX(${x}px) translateX(-50%)`,
            opacity: isFullyFinished ? 0 : 1,
            visibility: isFullyFinished ? 'hidden' : 'visible',
            zIndex: type === 'Min' ? 30 : 20
        };
};

    return (
        <div className="viz-layout auto-player selection-sort-immersive">
            <div className="viz-main-area">
                {resultToast && (
                    <div className={`result-toast ${resultToast.success ? 'success' : 'fail'}`}>
                        <div className="result-icon">{resultToast.success ? '🏆' : '❌'}</div>
                        <div className="result-info">
                            <h4>{resultToast.success ? 'Chính xác!' : 'Sai rồi!'}</h4>
                            <p>{resultToast.message}</p>
                        </div>
                    </div>
                )}
                <h3 className="header-title">Hệ thống Minh họa: Selection Sort</h3>

                {/* --- BAR CHART AREA WITH SLIDING POINTERS --- */}
                <div className="chart-container" ref={chartContainerRef}>
                    {/* Các Pointer trượt */}
                    <div className="pointer p-i animated-pointer" style={getPointerPos(iPtr, 'i')}>I</div>
                    <div className="pointer p-j animated-pointer" style={getPointerPos(jPtr, 'j')}>J</div>
                    <div className={`pointer p-min animated-pointer`} style={getPointerPos(minPtr, 'Min')}>Min</div>

                    {/* Dùng array gốc từ state, React Key là index hoặc val nếu val là duy nhất */}
                    {array.map((val, idx) => (
                        <div key={`${val}-${idx}`} // Key kết hợp giúp React nhận diện sự thay đổi vị trí
                             ref={(el) => { barRefs.current[idx] = el }}
                             className={`bar-wrapper ${iPtr !== null && idx < iPtr ? 'sorted' : ''}`}>
                            <div className="bar" style={getBarStyles(idx, val)}>
                                <span className="bar-value">{val}</span>
                            </div>
                            <span className="bar-index monospace">{idx}</span>
                        </div>
                    ))}
                </div>

                {/* --- INSTRUCTION BOX --- */}
                <div className="instruction-box animate-fadeIn">
                    <div className="instruction-icon">💡</div>
                    <div className="instruction-text monospace">
                        {currentInstruction}
                    </div>
                </div>

                {/* --- PLAYBACK CONTROL PANEL --- */}
                <div className="playback-panel">
                    <div className="playback-controls">
                        <button className="btn-playback" onClick={handleReset} title="Tua về đầu">
                            <StepBackwardOutlined />
                        </button>
                        <button className="btn-playback" onClick={handlePrev} title="Về bước trước">
                            <BackwardOutlined />
                        </button>
                        <button className="btn-playback play-pause" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        </button>
                        <button className="btn-playback" onClick={handleNext} title="Đến bước sau">
                            <ForwardOutlined />
                        </button>
                        <button className="btn-playback" onClick={handleSkipEnd} title="Tua đến cuối">
                            <StepForwardOutlined />
                        </button>
                    </div>

                    <div className="speed-control">
                        <span>Tốc độ: {speed}x</span>
                        <Slider min={0.5} max={3} step={0.5} value={speed} onChange={setSpeed} style={{ width: 150 }} />
                    </div>
                </div>

                {/* --- QUIZ PANEL --- */}
                {showQuiz && (
                    <div className="quiz-panel animate-popIn">
                        <div className="quiz-header">
                            <QuestionCircleTwoTone style={{ fontSize: '1.5rem' }} />
                            <h4>Nhận dạng Thuật toán</h4>
                        </div>
                        <p>Dựa trên minh họa vừa xem, đây là thuật toán nào?</p>
                        <div className="quiz-options">
                            {quizOptions.map((opt: any) => (
                                <button key={opt.id}
                                    className={`quiz-opt-btn ${quizSelectedId === opt.id ? (opt.id === correctAlgorithmId ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => handleOptionSelect(opt.id)}
                                    disabled={quizSelectedId !== null}>
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