import React, { useState, useEffect, useMemo } from 'react';
import './ComplexityAutoPlayer.css';
import "../../visualizationCommon.css"
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    QuestionCircleTwoTone, 
    CaretLeftOutlined,
    CaretRightOutlined,
} from '@ant-design/icons';
import { Slider, InputNumber } from 'antd';

interface Props {
    vizData:any,
    onFinish: (isPassed: boolean, quizSelectedId: string) => void
}

export const ComplexityAutoPlayer: React.FC<Props>  = ({ vizData, onFinish }) => {
    const {
        title,
        code_lines,
        default_n,
        max_n,
        algorithm,
        quiz
    } = vizData;

    // 1. Cấu hình bài toán mẫu (Ví dụ: Tìm kiếm tuyến tính)
    const [nValue, setNValue] = useState(default_n || 5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [quizSelectedId, setQuizSelectedId] = useState<string | null>(null);
    const [resultToast, setResultToast] = useState<{ success: boolean; message: string } | null>(null);

    // 2. Tiền tính toán các bước thực thi dựa trên n
    const steps = useMemo(() => {
        const s: any[] = [];
        let total = 0;
        let countVar = 0;

        if (algorithm === 'linear_max') {
            // Logic cho VIS00007
            total++; s.push({ line: 1, totalCount: total, instruction: "Khởi tạo max = arr[0].", vars: { max: 'arr[0]', i: '?' } });
            for (let i = 1; i < nValue; i++) {
                total++; s.push({ line: 2, totalCount: total, instruction: `Vòng lặp i = ${i}. Kiểm tra i < n.`, vars: { max: countVar, i } });
                total++; s.push({ line: 3, totalCount: total, instruction: `So sánh arr[${i}] với max hiện tại.`, vars: { max: countVar, i } });
                // Giả định trung bình có swap max (mô phỏng)
                total++; s.push({ line: 4, totalCount: total, instruction: "Cập nhật giá trị max mới.", vars: { max: 'arr[' + i + ']', i } });
            }
            total++; s.push({ line: 7, totalCount: total, instruction: "Kết thúc và trả về giá trị max.", vars: { max: 'MAX', i: nValue } });
        }
        else if (algorithm === 'nested_loops') {
            // Logic cho VIS00008
            total++; s.push({ line: 1, totalCount: total, instruction: "Khởi tạo count = 0.", vars: { count: 0, i: '?', j: '?' } });
            for (let i = 0; i < nValue; i++) {
                total++; s.push({ line: 2, totalCount: total, instruction: `Vòng lặp ngoài i = ${i}.`, vars: { count: countVar, i, j: '?' } });
                for (let j = 0; j < nValue; j++) {
                    total++; s.push({ line: 3, totalCount: total, instruction: `Vòng lặp trong j = ${j}.`, vars: { count: countVar, i, j } });
                    total++; countVar++;
                    s.push({ line: 4, totalCount: total, instruction: "Tăng biến đếm count++.", vars: { count: countVar, i, j } });
                }
            }
            total++; s.push({ line: 7, totalCount: total, instruction: "Trả về tổng số phép toán count.", vars: { count: countVar, i: nValue, j: nValue } });
        }

        return s;
    }, [nValue, algorithm]);

    // 3. Playback Logic
    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            const timer = setInterval(() => setCurrentStep(prev => prev + 1), 1000 / speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, currentStep, steps.length, speed]);

    const handleOptionSelect = (quizSelectedId: string) => {
        if (!quizSelectedId) return;
        const isCorrect = quizSelectedId === quiz.correct_id;
        setQuizSelectedId(quizSelectedId);
        onFinish?.(isCorrect, quizSelectedId)
        setTimeout(() => onFinish?.(isCorrect, quizSelectedId), 2000);
    };

    const handleStepChange = (direction: 'next' | 'prev') => {
        setIsPlaying(false); // Dừng auto-play khi người dùng tự nhấn bước
        if (direction === 'next') {
            setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
        } else {
            setCurrentStep(prev => Math.max(0, prev - 1));
        }
    };

    return (
        <div className="viz-layout auto-player complexity-visualizer">
            <div className="viz-main-area">
                {resultToast && (
                    <div className={`result-toast ${resultToast.success ? 'success' : 'fail'}`}>
                        <div className="result-icon">{resultToast.success ? '🏆' : '❌'}</div>
                        <div className="result-info">
                            <h4>{resultToast.success ? 'Chính xác!' : 'Thất bại!'}</h4>
                            <p>{resultToast.message}</p>
                        </div>
                    </div>
                )}

                <h3 className="header-title">{title}</h3>

                <div className="complexity-container">
                    <div className="code-section">
                        <div className="input-group">
                            <span>Tham số n: </span>
                            <InputNumber min={1} max={max_n} value={nValue} onChange={(v) => { setNValue(v || 1); setCurrentStep(0); setIsPlaying(false); }} />
                        </div>

                        <div className="code-block-display">
                            {code_lines.map((line: any) => {
                                const isActive = steps[currentStep]?.line === line.num;
                                // Tự động thêm khoảng trắng dựa trên nội dung mã nguồn để indent
                                const indentation = line.text.startsWith('  ') ? '    ' : ''; 
                                
                                return (
                                    <div key={line.num} className={`code-line-item ${isActive ? 'active' : ''}`}>
                                        <span className="line-num">{line.num}</span>
                                        <code className="code-content">{line.text}</code>
                                        {isActive && line.cost_type !== '-' && <span className="badge-op">+1</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="stats-section">
                        <div className="stat-card total-ops">
                            <span className="label">Tổng số phép toán đơn:</span>
                            <span className="value">{steps[currentStep]?.totalCount}</span>
                        </div>
                        
                        <div className="stat-card var-monitor">
                            {Object.entries(steps[currentStep]?.vars || {}).map(([key, val]) => (
                                <div key={key} className="var-item">
                                    <span className="var-name">{key}</span> = <span className="var-val">{String(val)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="instruction-box">
                            <div className="instruction-text">{steps[currentStep]?.instruction}</div>
                        </div>
                    </div>
                </div>

                <div className="playback-panel">
                    <div className="playback-controls">
                        <button className="btn-playback" title="Về đầu" onClick={() => {setCurrentStep(0); setIsPlaying(false);}}><StepBackwardOutlined /></button>
                        
                        {/* Nút lùi 1 bước */}
                        <button className="btn-playback" title="Lùi 1 bước" onClick={() => handleStepChange('prev')} disabled={currentStep === 0}>
                            <CaretLeftOutlined />
                        </button>

                        <button className="btn-playback play-pause" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        </button>

                        {/* Nút tiến 1 bước */}
                        <button className="btn-playback" title="Tiến 1 bước" onClick={() => handleStepChange('next')} disabled={currentStep === steps.length - 1}>
                            <CaretRightOutlined />
                        </button>

                        <button className="btn-playback" title="Đến cuối" onClick={() => {setCurrentStep(steps.length - 1); setIsPlaying(false);}}><StepForwardOutlined /></button>
                    </div>
                    <div className="speed-control">
                        <span>Tốc độ: {speed}x</span>
                        <Slider min={0.5} max={3} step={0.5} value={speed} onChange={setSpeed} style={{ width: 120 }} />
                    </div>
                </div>

                {currentStep === steps.length - 1 && (
                    <div className="quiz-panel animate-popIn">
                        <div className="quiz-header">
                            <QuestionCircleTwoTone style={{ fontSize: '1.5rem' }} />
                            <h4>{quiz.question}</h4>
                        </div>
                        <div className="quiz-options">
                            {quiz.options.map((opt: any) => (
                                <button 
                                    key={opt.id} 
                                    className={`quiz-opt-btn ${quizSelectedId === opt.id ? (opt.id === quiz.correct_id ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => handleOptionSelect(opt.id)}
                                    disabled={!!quizSelectedId}
                                >
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