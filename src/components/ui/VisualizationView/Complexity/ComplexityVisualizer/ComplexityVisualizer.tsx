import React, { useState } from 'react';
import './ComplexityVisualizer.css';
import '../../visualizationCommon.css'
import { 
    ThunderboltTwoTone, 
    QuestionCircleTwoTone, 
    CodeOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

interface Props {
    vizData: any;
    onFinish: (isPassed: boolean, failCount: number) => void;
}

export const ComplexityVisualizer: React.FC<Props>  = ({ vizData, onFinish }) => {
    const { title, code_lines, algorithm, default_n, quiz } = vizData;

    // --- Core States ---
    const [currentLine, setCurrentLine] = useState(1);
    const [wrongClicks, setWrongClicks] = useState(0);
    const [totalOps, setTotalOps] = useState(0);
    const [vars, setVars] = useState({ i: 0, j: 0, n: default_n, count: 0 });
    
    // --- UI States ---
    const [isWrongPulse, setIsWrongPulse] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [resultToast, setResultToast] = useState<{ success: boolean; message: string } | null>(null);
    const [quizSelectedIds, setQuizSelectedIds] = useState<string[]>([]); // Lưu các option đã nhấn sai

    const MAX_LIVES = 5;

    const getExpectedNextLine = (current: number, v: any): number => {
        if (algorithm === 'linear_max') {
            switch (current) {
                case 1: return 2;
                case 2: return v.i < v.n ? 3 : 7;
                case 3: return 4;
                case 4: return 2;
                default: return 7;
            }
        } 
        if (algorithm === 'nested_loops') {
            switch (current) {
                case 1: return 2;
                case 2: return v.i < v.n ? 3 : 7;
                case 3: return v.j < v.n ? 4 : 2;
                case 4: return 3;
                default: return 7;
            }
        }
        return current + 1;
    };

    // Xử lý lỗi chung (dùng cho cả code và quiz)
    const triggerError = (message: string) => {
        const newWrongs = wrongClicks + 1;
        setWrongClicks(newWrongs);
        setIsWrongPulse(true);
        setTimeout(() => setIsWrongPulse(false), 500);

        if (newWrongs >= MAX_LIVES) {
            setResultToast({ success: false, message: "Bạn đã hết lượt thử! Trò chơi kết thúc." });
            setTimeout(() => onFinish?.(false, newWrongs), 3000);
        }
    };

    const handleLineClick = (line: any) => {
        if (wrongClicks >= MAX_LIVES || isFinished || resultToast) return;
        if (!line.isActionable) return;

        const expected = getExpectedNextLine(currentLine, vars);

        if (line.num === expected) {
            let newVars = { ...vars };
            if (line.num === 2) newVars.i += 1;
            if (line.num === 3 && algorithm === 'nested_loops') {
                if (currentLine === 2) newVars.j = 0; 
                else newVars.j += 1;
            }
            if (line.num === 4) newVars.count += 1;
            
            setVars(newVars);
            setTotalOps(prev => prev + 1);
            setCurrentLine(line.num);
            if (line.num === 7) setIsFinished(true);
        } else {
            triggerError("Sai luồng thực thi!");
        }
    };

    const handleQuizOptionClick = (optionId: string) => {
        if (wrongClicks >= MAX_LIVES || resultToast || quizSelectedIds.includes(optionId)) return;

        if (optionId === quiz.correct_id) {
            // Thắng game
            setQuizSelectedIds(prev => [...prev, optionId]);
            setResultToast({ success: true, message: "Tuyệt vời! Bạn đã hoàn thành thử thách." });
            setTimeout(() => onFinish?.(true, wrongClicks), 3000);
        } else {
            // Chọn sai quiz -> Trừ 1 mạng và cho chọn lại
            setQuizSelectedIds(prev => [...prev, optionId]);
            triggerError("Đáp án Big O chưa chính xác!");
        }
    };

    return (
        <div className={`viz-layout complexity-challenge ${isWrongPulse ? 'shake' : ''}`}>
            <div className="viz-main-area">
                {resultToast && (
                    <div className={`result-toast ${resultToast.success ? 'success' : 'fail'}`}>
                        <div className="result-icon">{resultToast.success ? '🏆' : '❌'}</div>
                        <div className="result-info">
                            <h4>{resultToast.success ? 'Thành công!' : 'Thất bại'}</h4>
                            <p>{resultToast.message}</p>
                        </div>
                    </div>
                )}

                <h3 className="header-title">{title}</h3>
                <div className="viz-header">
                    <div className="target-box">Phép toán: <span>{totalOps}</span></div>
                    <div className={`lives ${wrongClicks >= 4 ? 'danger' : ''}`}>
                                        <ThunderboltTwoTone twoToneColor="#ffe7a6" /> {5 - wrongClicks}
                                    </div>
                </div>

                <div className="challenge-main">
                    <div className='code-container'>
                    <div className="code-window">
                        <div className="window-header">
                            <CodeOutlined style={{ color: '#8b949e', marginRight: 8 }} />
                            <span className="file-name">challenge.cpp (Chọn tuần tự từng bước để đếm số phép toán)</span>
                        </div>
                        <div className="code-display-area">
                            {code_lines.map((line: any) => (
                                <div 
                                    key={line.num} 
                                    className={`code-row 
                                        ${currentLine === line.num ? 'current-step' : ''} 
                                        ${line.isActionable ? 'actionable' : 'passive'}
                                    `}
                                    onClick={() => handleLineClick(line)}
                                >
                                    <span className="line-number">{line.num}</span>
                                    <code className="code-text">{line.text}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="side-panel">
                        <div className="monitor-card">
                            <div className="monitor-header">Biến (n = {vars.n})</div>
                            <div className="var-list">
                                <div className="var-row">i: <span>{vars.i}</span></div>
                                {algorithm === 'nested_loops' && <div className="var-row">j: <span>{vars.j}</span></div>}
                                <div className="var-row highlight">count: <span>{vars.count}</span></div>
                            </div>
                        </div>
                    </div>

                        
                    </div>
                    {isFinished && (
                            <div className="quiz-mini-panel animate-popIn">
                                <h4><QuestionCircleTwoTone /> Độ phức tạp Big O?</h4>
                                <p>{quiz.question}</p>
                                <div className="quiz-grid">
                                    {quiz.options.map((opt: any) => {
                                        const isSelected = quizSelectedIds.includes(opt.id);
                                        const isCorrect = opt.id === quiz.correct_id;
                                        return (
                                            <button 
                                                key={opt.id} 
                                                className={`quiz-btn ${isSelected ? (isCorrect ? 'pass' : 'fail') : ''}`}
                                                onClick={() => handleQuizOptionClick(opt.id)}
                                                disabled={resultToast !== null || (isSelected && !isCorrect)}
                                            >
                                                {opt.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};