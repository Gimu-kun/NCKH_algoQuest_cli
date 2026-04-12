import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './BinarySearchAutoPlayer.css';
import '../../visualizationCommon.css'
import {
    StepBackwardOutlined,
    BackwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    ForwardOutlined,
    StepForwardOutlined,
    QuestionCircleTwoTone,
} from '@ant-design/icons';
import { Slider } from 'antd'; // Hoặc bạn tự viết slider
import type { BinarySearchDataType } from '../../../../../types/BinarySearchDataType';

export interface AlgorithmVisualizationAutoPlayerProps {
    vizData: BinarySearchDataType;
    onFinish: (isPassed: boolean, quizSelectedId: string) => void;
}

// Định nghĩa các loại hành động trong thuật toán (để highlight code & di chuyển pointer)
type AlgoAction =
    | { type: 'INIT', instruction: string }
    | { type: 'LOOP_START', highlightLine: 1, instruction: string }
    | { type: 'CALC_MID', highlightLine: 2, left: number, right: number, instruction: string }
    | { type: 'COMPARE', highlightLine: 3, mid: number, instruction: string }
    | { type: 'MOVE_LEFT', highlightLine: 5, newLeft: number, instruction: string }
    | { type: 'MOVE_RIGHT', highlightLine: 7, newRight: number, instruction: string }
    | { type: 'FOUND', highlightLine: 3, mid: number, instruction: string }
    | { type: 'NOT_FOUND', highlightLine: 1, instruction: string }
    | { type: 'END', instruction: string };



export const BinarySearchAutoPlayer: React.FC<AlgorithmVisualizationAutoPlayerProps> = ({
    vizData,
    onFinish,
}) => {
    const { array, target } = vizData;
    const quizOptions = vizData.quiz?.options || [];
    const correctAlgorithmId = vizData.quiz?.correct_id || "";

    // --- Core Logic & Pointer States ---
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(array.length - 1);
    const [mid, setMid] = useState<number | null>(null);
    const [tick, setTick] = useState(0);

    // --- Playback Control States ---
    const [isPlaying, setIsPlaying] = useState(true); // Mặc định tự động chạy
    const [speed, setSpeed] = useState(0.5); // Tốc độ (1 = 1 giây/bước)
    const [quizSelectedId, setQuizSelectedId] = useState<string | null>(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [resultToast, setResultToast] = useState<{ success: boolean; message: string } | null>(null);

    // --- Quiz Option Ref ---
    const arrayContainerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // --- 1. Tiền tính toán toàn bộ các bước chạy của thuật toán (Pre-compute Steps) ---
    const precomputedSteps = useMemo(() => {
        const steps: AlgoAction[] = [];
        let curLeft = 0;
        let curRight = array.length - 1;

        steps.push({ type: 'INIT', instruction: "Khởi tạo phạm vi tìm kiếm từ chỉ số 0 đến " + curRight });

        while (curLeft <= curRight) {
            steps.push({
                type: 'LOOP_START',
                highlightLine: 1,
                instruction: `Kiểm tra điều kiện: ${curLeft} <= ${curRight}. Phạm vi tìm kiếm vẫn còn.`
            });

            const curMid = Math.floor((curLeft + curRight) / 2);
            steps.push({
                type: 'CALC_MID',
                highlightLine: 2,
                left: curLeft,
                right: curRight,
                instruction: `Tính toán chỉ số giữa: mid = floor((${curLeft} + ${curRight}) / 2) = ${curMid}`
            });

            steps.push({
                type: 'COMPARE',
                highlightLine: 3,
                mid: curMid,
                instruction: `So sánh giá trị tại vị trí mid (${array[curMid]}) với mục tiêu (${target})`
            });

            if (array[curMid] === target) {
                steps.push({
                    type: 'FOUND',
                    highlightLine: 3,
                    mid: curMid,
                    instruction: `Tìm thấy! Giá trị tại mid bằng đúng mục tiêu (${target}).`
                });
                break;
            } else if (array[curMid] < target) {
                curLeft = curMid + 1;
                steps.push({
                    type: 'MOVE_LEFT',
                    highlightLine: 5,
                    newLeft: curLeft,
                    instruction: `${array[curMid]} < ${target}. Thu hẹp phạm vi sang bên phải: left = mid + 1`
                });
            } else {
                curRight = curMid - 1;
                steps.push({
                    type: 'MOVE_RIGHT',
                    highlightLine: 7,
                    newRight: curRight,
                    instruction: `${array[curMid]} > ${target}. Thu hẹp phạm vi sang bên trái: right = mid - 1`
                });
            }
        }

        if (curLeft > curRight) {
            steps.push({
                type: 'NOT_FOUND',
                highlightLine: 1,
                instruction: "Phạm vi tìm kiếm rỗng (left > right). Không tìm thấy giá trị trong mảng."
            });
        }

        steps.push({ type: 'END', instruction: "Thuật toán kết thúc." });
        return steps;
    }, [array, target]);


    // State lưu vị trí bước hiện tại
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const currentInstruction = precomputedSteps[currentStepIndex]?.instruction || "";

    // --- 2. Hàm thực thi một bước (Step Logic) ---
    const executeStep = useCallback((step: AlgoAction) => {
        if (!step) return;

        switch (step.type) {
            case 'INIT':
                setLeft(0); setRight(array.length - 1); setMid(null);
                break;
            case 'CALC_MID':
                setLeft(step.left); setRight(step.right); setMid(null); break;
            case 'COMPARE':
                setMid(step.mid); break;
            case 'MOVE_LEFT':
                setLeft(step.newLeft); setMid(null); break;
            case 'MOVE_RIGHT':
                setRight(step.newRight); setMid(null);  break;
            case 'FOUND':
                setMid(step.mid);  break;
        }
    }, [array.length]);

    // --- 3. Tự động chạy thuật toán (Auto-play effect) ---
    useEffect(() => {
        if (!isPlaying || showQuiz || currentStepIndex >= precomputedSteps.length) return;

        const intervalId = setInterval(() => {
            setCurrentStepIndex(prev => {
                const nextIndex = prev + 1;
                if (nextIndex >= precomputedSteps.length) {
                    setIsPlaying(false);
                    return prev; // Giữ ở bước cuối
                }
                return nextIndex;
            });
        }, 1000 / speed); // Speed > 0, chia 1000 cho speed để đổi thành ms

        return () => clearInterval(intervalId);
    }, [isPlaying, speed, currentStepIndex, precomputedSteps, showQuiz]);

    // --- 4. Cập nhật giao diện khi currentStepIndex thay đổi (Playback effect) ---
    useEffect(() => {
        if (currentStepIndex >= precomputedSteps.length) return;
        const currentStep = precomputedSteps[currentStepIndex];
        executeStep(currentStep);

        // NẾU đến bước cuối cùng (FOUND hoặc NOT_FOUND) -> Chuyển sang Quiz
        if (currentStepIndex === precomputedSteps.length - 2) { // Vị trí END-1
            setTimeout(() => {
                setShowQuiz(true);
            }, 1500 / speed); // Đợi 1 chút sau bước FOUND/NOT_FOUND
        }
    }, [currentStepIndex, precomputedSteps, executeStep, speed]);

    // --- Effects for UI (ResizeObserver & Slice) ---
    useEffect(() => {
        if (!arrayContainerRef.current) return;
        const resizeObserver = new ResizeObserver(() => setTick(t => t + 1));
        resizeObserver.observe(arrayContainerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, array.length);
    }, [array]);

    // --- Playback Handlers ---
    const handleTogglePlay = () => setIsPlaying(!isPlaying);
    const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(true); };
    const handleNext = () => setCurrentStepIndex(prev => Math.min(precomputedSteps.length - 1, prev + 1));
    const handlePrev = () => setCurrentStepIndex(prev => Math.max(0, prev - 1));

    // --- Quiz Handlers ---
    const handleOptionSelect = (optionId: string) => {
        if (quizSelectedId) return; // Không cho chọn lại
        setQuizSelectedId(optionId);

        const isCorrect = optionId === correctAlgorithmId;
        const message = isCorrect ? "Chúc mừng! Bạn đã nhận dạng đúng thuật toán." : "Sai rồi! Thuật toán vừa chạy là Binary Search.";

        setResultToast({ success: isCorrect, message });

        setTimeout(() => {
            onFinish(isCorrect, optionId);
        }, 3000);
    };

    const getPointerPosition = (index: number | null, type: 'L' | 'R' | 'M'): React.CSSProperties => {
        // Thêm tick vào dependency ngầm để hàm này chạy lại khi kích thước container thay đổi
        if (index === null || !cardRefs.current[index] || !arrayContainerRef.current) {
            return { opacity: 0, transform: 'translateX(0)' };
        }

        const containerRect = arrayContainerRef.current.getBoundingClientRect();
        const cardRect = cardRefs.current[index]!.getBoundingClientRect();

        let xPosition = (cardRect.left - containerRect.left) + (cardRect.width / 2);

        // Xử lý va chạm khi L và R chồng lên nhau
        if (left === right && (type === 'L' || type === 'R')) {
            xPosition += type === 'L' ? -20 : 20;
        }

        return {
            left: 0,
            transform: `translateX(calc(${xPosition}px - 50%))`,
            opacity: 1,
            zIndex: type === 'M' ? 30 : 20
        };
    };

    return (
        <div className={`viz-layout auto-player`}>
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

                <h3 className="header-title">Hệ thống Minh họa Thuật toán</h3>
                <div className="viz-header">
                    <div className="header-left">Minh họa tự động:</div>
                    <div className="target-box">Mục tiêu: <span className="target-val">{target}</span></div>
                    {/* Bỏ lives trong chế độ xem tự động */}
                    <div className="current-step">Bước: {currentStepIndex + 1}/{precomputedSteps.length}</div>
                </div>

                <div className="array-container" ref={arrayContainerRef}>
                    <div className="pointer p-l animated-pointer" style={getPointerPosition(left, 'L')}>L</div>
                    <div className="pointer p-r animated-pointer" style={getPointerPosition(right, 'R')}>R</div>
                    <div className={`pointer p-m animated-pointer ${mid === null ? 'hide-mid' : ''}`}
                        style={getPointerPosition(mid, 'M')}>M</div>

                    {array.map((value, index) => (
                        <div key={index} ref={(el) => { cardRefs.current[index] = el; }}
                            className={`array-item ${index >= left && index <= right ? 'active' : 'dimmed'} ${index === mid ? 'is-mid' : ''}`}>
                            <div className="val-card">{value}</div>
                            <div className="idx-tag">{index}</div>
                        </div>
                    ))}
                </div>
                {/* BOX LỜI DIỄN GIẢI */}
                <div className="instruction-box animate-fadeIn">
                    <div className="instruction-icon">💡</div>
                    <div className="instruction-text">
                        {currentInstruction}
                    </div>
                </div>
                <div className="playback-panel">
                    <div className="playback-controls">
                        <button className="btn-playback" onClick={handleReset} title="Tua về đầu">
                            <StepBackwardOutlined />
                        </button>
                        <button className="btn-playback" onClick={handlePrev} title="Về bước trước">
                            <BackwardOutlined />
                        </button>
                        <button className="btn-playback play-pause" onClick={handleTogglePlay}>
                            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        </button>
                        <button className="btn-playback" onClick={handleNext} title="Đến bước sau">
                            <ForwardOutlined />
                        </button>
                        <button className="btn-playback" onClick={() => setCurrentStepIndex(precomputedSteps.length - 2)} title="Tua đến cuối">
                            <StepForwardOutlined />
                        </button>
                    </div>

                    <div className="speed-control">
                        <span>Tốc độ: {speed}x</span>
                        {/* Tùy chỉnh slider cho tốc độ (0.5x đến 3x) */}
                        <Slider min={0.5} max={3} step={0.5} value={speed} onChange={(val) => setSpeed(val)} />
                    </div>
                </div>
                {showQuiz && (
                    <div className="quiz-panel animate-popIn">
                        <div className="quiz-header">
                            <QuestionCircleTwoTone twoToneColor="#58a6ff" style={{ fontSize: '1.5rem' }} />
                            <h4>Nhận dạng Thuật toán</h4>
                        </div>
                        <p>Dựa trên minh họa vừa xem, đây là thuật toán nào?</p>
                        <div className="quiz-options">
                            {quizOptions.map(option => (
                                <button key={option.id}
                                    className={`quiz-opt-btn ${quizSelectedId === option.id ? (option.id === correctAlgorithmId ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => handleOptionSelect(option.id)}
                                    disabled={quizSelectedId !== null}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};