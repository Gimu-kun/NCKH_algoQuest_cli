import React, { useState, useEffect, useRef } from 'react';
import "./ComplexityGame.css";
import { usePlayerStore } from '../../../store/playerStore';
import { submitVisualChallenge } from '../../../services/singlePlayApiService';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Props {
    questId: string;
    visualData: any;
}

export const ComplexityGame: React.FC<Props> = ({ questId, visualData }) => {

    const COMPLEXITY_OPTIONS = [
        { value: "O(1)", label: "O(1)" },
        { value: "O(log n)", label: "O(log n)" },
        { value: "O(n)", label: "O(n)" },
        { value: "O(n log n)", label: "O(n log n)" },
        { value: "O(n^2)", label: "O(n²)" },  // Hiển thị n² nhưng giá trị là n^2
        { value: "O(2^n)", label: "O(2ⁿ)" },  // Hiển thị 2ⁿ nhưng giá trị là 2^n
        { value: "O(n!)", label: "O(n!)" },
    ];

    const { id: topicId } = useParams<{ id: string }>();
    const { visualization } = visualData;
    const config = JSON.parse(visualization.data);
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState<string>("5");
    const [speed, setSpeed] = useState<number>(600);
    const [steps, setSteps] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    // Refs để điều khiển luồng từ bên ngoài vòng lặp async
    const isPausedRef = useRef(false);
    const stopRequestedRef = useRef(false);
    const stepRequestedRef = useRef(false);

    const userId = usePlayerStore(state => state.id);
    const hydrate = usePlayerStore(state => state.hydrateFromServer);
    const codeLines = (visualization.templateCode || "").split('\n');

    // Hàm đợi hỗ trợ Pause và Step-by-Step
    const waitForNext = async () => {
        if (stopRequestedRef.current) throw new Error("STOPPED");

        // Nếu đang pause, đợi cho đến khi hết pause hoặc có yêu cầu "Next Step"
        while (isPausedRef.current && !stepRequestedRef.current) {
            if (stopRequestedRef.current) throw new Error("STOPPED");
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Reset yêu cầu bước tiếp theo sau khi đã thực hiện
        stepRequestedRef.current = false;

        // Tốc độ bình thường khi không pause
        if (!isPausedRef.current) {
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    };

    const runSimulation = async () => {
        const n = parseInt(inputValue) || 0;
        if (n <= 0) {
            Swal.fire({
                title: 'Cảnh báo!',
                text: 'Nhập n phải là số dương.',
                icon: 'warning',
                confirmButtonColor: '#f85149'
            });
            return
        }

        if (n > 20 && config.target.includes("2^n")) {
            Swal.fire({
                title: 'Cảnh báo!',
                text: 'n > 20 với O(2^n) sẽ khiến CPU "nổ tung"! Hãy thử số nhỏ hơn.',
                icon: 'warning',
                confirmButtonColor: '#f85149'
            });
        }

        // Reset trạng thái
        setIsRunning(true);
        setIsPaused(false);
        setSteps(0);
        setShowOptions(false);
        isPausedRef.current = false;
        stopRequestedRef.current = false;

        const target = config.target.toLowerCase();

        try {
            // --- LEVEL 1: LOGARITHMIC O(log n) ---
            if (target.includes("log n")) {
                let tempN = n;
                while (tempN > 1) {
                    setActiveLine(0); await waitForNext(); // while (n > 1)
                    setActiveLine(1); // n = n / 2
                    tempN = Math.floor(tempN / 2);
                    await waitForNext();
                    setActiveLine(2); // count++
                    setSteps(prev => prev + 1);
                    await waitForNext();
                }
            }

            // --- LEVEL 2: QUADRATIC O(n²) ---
            else if (target.includes("n²")) {
                for (let i = 0; i < n; i++) {
                    setActiveLine(0); await waitForNext(); // for i
                    for (let j = 0; j < n; j++) {
                        setActiveLine(1); await waitForNext(); // for j
                        setActiveLine(2); // count++
                        setSteps(prev => prev + 1);
                        await waitForNext();
                    }
                }
            }

            // --- LEVEL 3: EXPONENTIAL O(2^n) ---
            else if (target.includes("2^n")) {
                // Định nghĩa hàm đệ quy bên trong để highlight
                const recursiveFib = async (currentN: number) => {
                    if (stopRequestedRef.current) return;

                    setActiveLine(1); await waitForNext(); // if (n <= 1)
                    if (currentN <= 1) return;

                    setActiveLine(2); // count++
                    setSteps(prev => prev + 1);
                    await waitForNext();

                    setActiveLine(3); // return fib(n-1) + fib(n-2)
                    await recursiveFib(currentN - 1);
                    await recursiveFib(currentN - 2);
                };

                setActiveLine(0); await waitForNext(); // int fibonacci(int n)
                await recursiveFib(n);
            }

            // --- DEFAULT: LINEAR O(n) ---
            else {
                for (let i = 0; i < n; i++) {
                    setActiveLine(0); await waitForNext();
                    setActiveLine(1);
                    setSteps(prev => prev + 1);
                    await waitForNext();
                }
            }

            setShowOptions(true);
        } catch (e: any) {
            if (e.message !== "STOPPED") console.error(e);
        } finally {
            setIsRunning(false);
            setActiveLine(null);
        }
    };

    const handlePauseResume = () => {
        isPausedRef.current = !isPausedRef.current;
        setIsPaused(isPausedRef.current);
    };

    const handleStop = () => {
        stopRequestedRef.current = true;
        setIsRunning(false);
        setIsPaused(false);
        setSteps(0);
        setActiveLine(null);
    };

    const handleNextStep = () => {
        stepRequestedRef.current = true;
    };

    const handleGuess = async (answer: string, explanation: string) => {
        try {
            const res = await submitVisualChallenge(userId, questId, visualization.id, answer);
            console.log(res)
            if (res.status == 200) {
                // 1. Cập nhật dữ liệu người chơi vào Store
                if (res.data) hydrate(res.data);

                Swal.fire({
                    title: 'Trả lời đúng rồi!',
                    text: explanation,
                    icon: 'success',
                    confirmButtonText: 'Tiếp tục cuộc phiêu lưu',
                    confirmButtonColor: '#238636',
                    background: '#161b22',
                    color: '#fff'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`/v1/adventure/${topicId}`);
                    }
                });
            } else {
                Swal.fire({
                    title: 'Chưa đúng!',
                    text: 'Hãy thử quan sát lại chu kỳ CPU một lần nữa.',
                    icon: 'error',
                    confirmButtonColor: '#f85149'
                });
            }
        } catch (error) {
            console.error("Lỗi khi submit:", error);
            Swal.fire({
                title: 'Lỗi chưa xác định!',
                text: 'Có lỗi xảy ra khi gửi kết quả.',
                icon: 'error',
                confirmButtonColor: '#f85149'
            });
        }
    };

    return (
        <div className="complexity-game-wrapper">
            <div className="game-grid">
                <div className="code-container">
                    <div className="code-header-bar">
                        <div className="dots"><span></span><span></span><span></span></div>
                        <div className="file-name">algorithm.cpp</div>
                    </div>
                    <div className="code-window">
                        {codeLines.map((line: any, index: number) => (
                            <div key={index} className={`code-line ${activeLine === index ? 'highlight' : ''}`}>
                                <span className="line-number">{index + 1}</span>
                                <pre className="line-content">{line || " "}</pre>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="visual-container">
                    <div className="control-card">
                        <label>Input Value (n)</label>
                        <input type="number" className="n-input" value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)} disabled={isRunning} />
                        <input
                            type="range" min="300" max="900" step="300"
                            value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                        />
                        <span>{speed == 900 ? "Chậm" : speed == 600 ? "Vừa" : "Nhanh"}</span>
                        {!isRunning ? (
                            <button className="run-btn start" onClick={runSimulation}>EXECUTE</button>
                        ) : (
                            <div className="playback-controls">
                                <button className="control-btn" onClick={handlePauseResume}>
                                    {isPaused ? "▶ RESUME" : "⏸ PAUSE"}
                                </button>
                                <button className="control-btn" onClick={handleNextStep} disabled={!isPaused}>
                                    ⏭ STEP
                                </button>
                                <button className="control-btn stop" onClick={handleStop}>
                                    ⏹ STOP
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="monitor-card">
                        <div className="monitor-label">CPU CYCLES</div>
                        <div className="monitor-value">{steps}</div>
                        <div className="status-text">
                            {isRunning && (isPaused ? "PAUSED - MANUAL MODE" : "EXECUTING...")}
                        </div>
                    </div>
                </div>
            </div>

            {showOptions && (
                <div className="quiz-overlay">
                    <div className="quiz-card">
                        <h3>Dự đoán độ phức tạp:</h3>
                        <p className="quiz-hint">Dựa vào số bước CPU đã đếm được với n = {inputValue}</p>
                        <div className="options-grid">
                            {COMPLEXITY_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleGuess(opt.value, config.explanation)}
                                    className="quiz-opt"
                                >
                                    {/* Hiển thị số mũ đẹp mắt */}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};