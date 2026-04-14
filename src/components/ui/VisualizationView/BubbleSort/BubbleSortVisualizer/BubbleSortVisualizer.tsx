import React, { useState, useEffect, useRef } from 'react';
import './BubbleSortVisualizer.css';
import '../../visualizationCommon.css'
import { ThunderboltTwoTone } from '@ant-design/icons';

interface Props {
    vizData: any;
    onFinish: (isPassed: boolean, failCount: number) => void;
}

export const BubbleSortVisualizer:React.FC<Props> = ({ vizData, onFinish }) => {
    const { array: initialArray } = vizData;

    const [array, setArray] = useState([...initialArray]);
    const [i, setI] = useState(0);
    const [j, setJ] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [highlightLine, setHighlightLine] = useState(2);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [wrongClicks, setWrongClicks] = useState(0);
    const [isWrongPulse, setIsWrongPulse] = useState(false);
    const [pointerPos, setPointerPos] = useState({ j: 0, jNext: 0 });

    // --- State mới cho thông báo kết quả ---
    const [resultToast, setResultToast] = useState<{ success: boolean; message: string; score: number } | null>(null);

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);
    const maxVal = Math.max(...initialArray, 1);

    const pseudoCode = [
        { line: 1, text: "for i from 0 to n-1:" },
        { line: 2, text: "  for j from 0 to n-i-2:" },
        { line: 3, text: "    if array[j] > array[j+1]:" },
        { line: 4, text: "      swap(array[j], array[j+1])" }
    ];

    // Hàm xử lý kết thúc thử thách
    const handleFinishChallenge = (success: boolean, message: string) => {
        const score = success ? Math.max(0, 1000 - (wrongClicks * 150)) : 0;
        setResultToast({ success, message, score });

        // Trả kết quả về component cha sau khi hiển thị toast một khoảng thời gian
        setTimeout(() => {
            onFinish(success, wrongClicks);
        }, 3500);
    };

    useEffect(() => {
        const updatePointerPositions = () => {
            if (barRefs.current[j] && barRefs.current[j + 1]) {
                const barJ = barRefs.current[j]!;
                const barJNext = barRefs.current[j + 1]!;
                setPointerPos({
                    j: barJ.offsetLeft + barJ.offsetWidth / 2,
                    jNext: barJNext.offsetLeft + barJNext.offsetWidth / 2
                });
            }
        };
        updatePointerPositions();
        const timer = setTimeout(updatePointerPositions, 100);
        return () => clearTimeout(timer);
    }, [j, array, isSidebarOpen]);

    const triggerError = (msg: string) => {
        const newCount = wrongClicks + 1;
        setWrongClicks(newCount);
        setIsWrongPulse(true);
        setTimeout(() => setIsWrongPulse(false), 500);

        if (newCount >= 5) {
            handleFinishChallenge(false, "Bạn đã mắc quá nhiều lỗi (5/5)!");
        }
    };

    const handleAction = (action: 'SWAP' | 'KEEP') => {
        if (isFinished || resultToast) return;

        const needsSwap = array[j] > array[j + 1];

        if ((action === 'SWAP' && !needsSwap) || (action === 'KEEP' && needsSwap)) {
            triggerError(needsSwap ? "Lẽ ra bạn phải Hoán đổi!" : "Cặp này đã đúng thứ tự!");
            return;
        }

        let newArray = [...array];
        if (action === 'SWAP') {
            [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
            setArray(newArray);
            setHighlightLine(4);
        } else {
            setHighlightLine(3);
        }

        setTimeout(() => moveToNextStep(newArray), 400);
    };

    const moveToNextStep = (currentArr: number[]) => {
        const n = currentArr.length;
        let nextJ = j + 1;
        let nextI = i;

        if (nextJ >= n - 1 - i) {
            nextJ = 0;
            nextI = i + 1;
        }

        if (nextI >= n - 1) {
            setIsFinished(true);
            setHighlightLine(0);
            handleFinishChallenge(true, "Chúc mừng! Bạn đã sắp xếp mảng thành công bằng Bubble Sort.");
        } else {
            setI(nextI);
            setJ(nextJ);
            setHighlightLine(2);
        }
    };

    const getPointerStyle = (posX: number) => ({
        left: 0,
        transform: `translateX(${posX}px) translateX(-50%)`,
        opacity: isFinished || resultToast ? 0 : 1,
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s'
    });

    return (
        <div className={`viz-layout bubble-sort-visualizer ${!isSidebarOpen ? 'sidebar-closed' : ''} ${isWrongPulse ? 'shake' : ''}`}>
            <div className="viz-main-area">

                {/* TOAST KẾT QUẢ */}
                {resultToast && (
                    <div className={`result-toast ${resultToast.success ? 'success' : 'fail'}`}>
                        <div className="result-icon">{resultToast.success ? '🏆' : '❌'}</div>
                        <div className="result-info">
                            <h4>{resultToast.success ? 'Hoàn thành!' : 'Thất bại!'}</h4>
                            <p>{resultToast.message}</p>
                            <small>Điểm: {resultToast.score} | Lỗi: {wrongClicks}/5</small>
                        </div>
                    </div>
                )}

                <div className="viz-header">
                    <h3 className="header-title">Tương tác: Bubble Sort</h3>
                    <div className="target-box">Mục tiêu: <span className="target-val">Tăng dần</span></div>
                    <div className={`lives ${wrongClicks >= 4 ? 'danger' : ''}`}>
                        <ThunderboltTwoTone twoToneColor="#ffe7a6" /> {5 - wrongClicks}
                    </div>
                    <button className="btn-toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? '✕ Đóng mã giả' : '☰ Mở mã giả'}
                    </button>
                </div>

                <div className="chart-container" ref={chartContainerRef}>
                    <div className="pointer p-j" style={getPointerStyle(pointerPos.j)}>J</div>
                    <div className="pointer p-j-next" style={getPointerStyle(pointerPos.jNext)}>J+1</div>

                    {array.map((val, idx) => {
                        const isSorted = isFinished || (idx > array.length - 1 - i);
                        const isComparing = !isFinished && !resultToast && (idx === j || idx === j + 1);

                        return (
                            <div key={`${idx}-${val}`} ref={(el) => { barRefs.current[idx] = el }}
                                className={`bar-wrapper ${isComparing ? 'comparing' : ''} ${isSorted ? 'sorted' : ''}`}>
                                <div className="bar" style={{ height: `${(val / maxVal) * 180}px` }}>
                                    <span className="bar-value">{val}</span>
                                </div>
                                <span className="bar-index monospace">{idx}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="control-interaction">
                    {!isFinished && !resultToast ? (
                        <div className="btn-group">
                            <button className="btn-decide left" onClick={() => handleAction('KEEP')}>Giữ nguyên</button>
                            <button className="btn-decide right" onClick={() => handleAction('SWAP')}>
                                <ThunderboltTwoTone twoToneColor="#f1e05a" /> Hoán đổi
                            </button>
                        </div>
                    ) : (
                        <div className="finish-msg">{isFinished ? "✨ Hoàn tất sắp xếp ✨" : "💀 Thử thách kết thúc 💀"}</div>
                    )}
                </div>
            </div>

            <aside className="viz-code-sidebar">
                <div className="sidebar-content">
                    <h4>Mã giả (Pseudo-code)</h4>
                    <div className="code-block">
                        {pseudoCode.map(line => (
                            <div key={line.line} className={`code-line ${highlightLine === line.line ? 'active-line' : ''}`}>
                                <span className="line-num">{line.line}</span>
                                <code>{line.text}</code>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
};