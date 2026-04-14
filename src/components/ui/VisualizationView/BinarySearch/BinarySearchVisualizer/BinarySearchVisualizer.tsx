import React, { useState, useEffect, useRef } from 'react';
import './BinarySearchVisualizer.css';
import '../../visualizationCommon.css'
import type { BinarySearchDataType } from '../../../../../types/BinarySearchDataType';
import { ThunderboltTwoTone } from '@ant-design/icons';

export interface BinarySearchVisualizerProps {
    vizData: BinarySearchDataType;
    onFinish: (isPassed: boolean, failCount: number) => void;
}

export const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({ vizData, onFinish }) => {
    const { array, target } = vizData;
    
    // 1. Core Logic States
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(array.length - 1);
    const [mid, setMid] = useState<number | null>(null);
    const [tick, setTick] = useState(0);

    // 2. UI Control States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [step, setStep] = useState<'SELECT_MID' | 'PROCESS'>('SELECT_MID');
    const [subStep, setSubStep] = useState<'NONE' | 'COMPARING' | 'DECIDING'>('NONE');
    const [highlightLine, setHighlightLine] = useState(1);
    
    // 3. Feedback States
    const [wrongClicks, setWrongClicks] = useState(0);
    const [isWrongPulse, setIsWrongPulse] = useState(false);
    const [dialog, setDialog] = useState<{ title: string; message: string; type: 'info' | 'error' | 'success' } | null>(null);
    const [resultToast, setResultToast] = useState<{ success: boolean; message: string; score: number } | null>(null);

    // Refs
    const arrayContainerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    const currentMid = Math.floor((left + right) / 2);

    const pseudoCode = [
        { line: 1, text: "while left <= right:" },
        { line: 2, text: "  mid = (left + right) / 2" },
        { line: 3, text: "  if array[mid] == target: return mid" },
        { line: 4, text: "  else if array[mid] < target:" },
        { line: 5, text: "    left = mid + 1" },
        { line: 6, text: "  else:" },
        { line: 7, text: "    right = mid - 1" }
    ];

    useEffect(() => {
        if (!arrayContainerRef.current) return;
    
        // ResizeObserver sẽ bắt được sự thay đổi kích thước kể cả khi đang chạy animation CSS
        const resizeObserver = new ResizeObserver(() => {
            setTick(prev => prev + 1); // Buộc component re-render để tính lại vị trí pointer
        });
    
        resizeObserver.observe(arrayContainerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, array.length);
    }, [array]);

    // Hàm hiển thị Dialog thay vì Toast
    const showDialog = (title: string, message: string, type: 'info' | 'error' | 'success' = 'info') => {
        setDialog({ title, message, type });
    };

    const handleFinishChallenge = (success: boolean, message: string) => {
        const score = success ? Math.max(0, 1000 - (wrongClicks * 100)) : 0;
        setResultToast({ success, message, score });
        
        setTimeout(() => {
            onFinish(success, wrongClicks);
        }, 3500);
    };

    const handleElementClick = (index: number) => {
        if (wrongClicks >= 5 || step !== 'SELECT_MID' || mid !== null || resultToast || dialog) return;
        if (index === currentMid) {
            setMid(index);
            setHighlightLine(2);
            setTimeout(() => {
                setStep('PROCESS');
                setSubStep('COMPARING');
                setHighlightLine(3);
            }, 600);
        } else {
            const newCount = wrongClicks + 1;
            setWrongClicks(newCount);
            setIsWrongPulse(true);
            setTimeout(() => setIsWrongPulse(false), 800);
            setDialog({ 
                title: "Vị trí không chính xác", 
                message: "Vị trí Mid phải là trung bình cộng của L và R (lấy phần nguyên).", 
                type: 'error' 
            });
            if (newCount >= 5) handleFinishChallenge(false, "Bạn đã hết lượt thử!");
        }
    };

    const handleError = (title: string, msg: string) => {
        const newCount = wrongClicks + 1;
        setWrongClicks(newCount);
        setIsWrongPulse(true);
        setTimeout(() => setIsWrongPulse(false), 800);
        showDialog(title, msg, 'error');
        if (newCount >= 5) handleFinishChallenge(false, "Bạn đã hết lượt thử!");
    };

    const handleComparison = () => {
        if (mid === null) return;
        if (array[mid] === target) {
            handleFinishChallenge(true, `Tuyệt vời! Đã tìm thấy giá trị ${target} tại chỉ số ${mid}.`);
        } else {
            setSubStep('DECIDING');
            setHighlightLine(array[mid] < target ? 4 : 6);
        }
    };

    const handleDirectionDecision = (direction: 'LEFT' | 'RIGHT') => {
        if (mid === null) return;
        const isActuallyTargetGreater = array[mid] < target;
        if ((direction === 'RIGHT' && isActuallyTargetGreater) || (direction === 'LEFT' && !isActuallyTargetGreater)) {
            let nextLeft = direction === 'RIGHT' ? mid + 1 : left;
            let nextRight = direction === 'LEFT' ? mid - 1 : right;
            setHighlightLine(direction === 'RIGHT' ? 5 : 7);
            
            showDialog("Chính xác!", `Giá trị ${target} ${isActuallyTargetGreater ? 'lớn hơn' : 'nhỏ hơn'} ${array[mid]}. Chúng ta sẽ thu hẹp phạm vi sang phía ${direction === 'RIGHT' ? 'phải' : 'trái'}.`, 'success');

            // Đợi người dùng đóng dialog xong mới cập nhật vị trí (xử lý trong nút đóng dialog bên dưới)
            const updateStateAfterDialog = () => {
                if (nextLeft > nextRight) {
                    handleFinishChallenge(true, `Thuật toán kết thúc: Mục tiêu ${target} không tồn tại trong mảng này.`);
                    return;
                }
                setLeft(nextLeft);
                setRight(nextRight);
                setMid(null);
                setStep('SELECT_MID');
                setSubStep('NONE');
                setHighlightLine(1);
            };
            
            // Lưu hàm callback này để chạy khi đóng dialog
            (window as any).pendingUpdate = updateStateAfterDialog;
        } else {
            handleError("Sai hướng đi", "Hãy so sánh kỹ giá trị Mid hiện tại với mục tiêu để quyết định hướng duyệt.");
        }
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
        <div className={`viz-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <div className="viz-main-area">
                
                {/* --- COMPONENT DIALOG MESSAGE --- */}
                {dialog && (
                    <div className="dialog-overlay">
                        <div className={`dialog-card ${dialog.type}`}>
                            <div className="dialog-header">
                                <span>{dialog.type === 'error' ? '⚠️' : dialog.type === 'success' ? '✅' : 'ℹ️'}</span>
                                <h4>{dialog.title}</h4>
                            </div>
                            <p className="dialog-body">{dialog.message}</p>
                            <button className="dialog-btn" onClick={() => {
                                setDialog(null);
                                if ((window as any).pendingUpdate) {
                                    (window as any).pendingUpdate();
                                    (window as any).pendingUpdate = null;
                                }
                            }}>Xác nhận</button>
                        </div>
                    </div>
                )}

                {/* TOAST KẾT QUẢ */}
                {resultToast && (
                    <div className={`result-toast ${resultToast.success ? 'success' : 'fail'}`}>
                        <div className="result-icon">{resultToast.success ? '🏆' : '❌'}</div>
                        <div className="result-info">
                            <h4>{resultToast.success ? 'Hoàn thành!' : 'Thất bại!'}</h4>
                            <p>{resultToast.message}</p>
                            <small>Điểm: {resultToast.score} | Lỗi: {wrongClicks}</small>
                        </div>
                    </div>
                )}
                <h3 className="header-title">Binary Search</h3>
                <div className="viz-header">
                    
                    <div className="target-box">Mục tiêu: <span className="target-val">{target}</span></div>
                    <div className={`lives ${wrongClicks >= 4 ? 'danger' : ''}`}><ThunderboltTwoTone twoToneColor="#ffe7a6"/> {5 - wrongClicks}</div>
                    <button className="btn-toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? '✕ Đóng mã giả' : '☰ Mở mã giả'}
                    </button>
                </div>

                <div className="array-container" ref={arrayContainerRef}>
                    {/* Render Pointers với type để xử lý va chạm */}
                    <div className="pointer p-l animated-pointer" style={getPointerPosition(left, 'L')}>L</div>
                    <div className="pointer p-r animated-pointer" style={getPointerPosition(right, 'R')}>R</div>
                    <div className={`pointer p-m animated-pointer ${mid === null ? 'hide-mid' : ''}`} 
                         style={getPointerPosition(mid, 'M')}>M</div>
                    
                    {array.map((value, index) => (
                        <div key={index} ref={(el) => { cardRefs.current[index] = el; }}
                            className={`array-item ${index >= left && index <= right ? 'active' : 'dimmed'} ${index === mid ? 'is-mid' : ''}`}
                            onClick={() => handleElementClick(index)}>
                            <div className="val-card">{value}</div>
                            <div className="idx-tag">{index}</div>
                        </div>
                    ))}
                </div>

                <div className="control-panel">
                    {step === 'SELECT_MID' && <p className="hint-text">Hãy tính toán và nhấn vào ô số bạn cho là <strong>Mid</strong>.</p>}
                    {subStep === 'COMPARING' && (
                        <div className="action-step">
                            <p>So sánh giá trị tại Mid (<strong>{array[mid!]}</strong>) với mục tiêu (<strong>{target}</strong>)</p>
                            <button className="btn-action" onClick={handleComparison}>Thực hiện so sánh</button>
                        </div>
                    )}
                    {subStep === 'DECIDING' && (
                        <div className="action-step">
                            <p>{array[mid!]} {array[mid!] < target ? 'nhỏ hơn' : 'lớn hơn'} mục tiêu. Bạn sẽ duyệt mảng con bên nào?</p>
                            <div className="btn-group">
                                <button className="btn-decide left" onClick={() => handleDirectionDecision('LEFT')}>Mảng con bên trái</button>
                                <button className="btn-decide right" onClick={() => handleDirectionDecision('RIGHT')}>Mảng con bên phải</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <aside className="viz-code-sidebar">
                <div className="sidebar-content">
                    <h4>Thuật toán Binary Search</h4>
                    <div className="code-block">
                        {pseudoCode.map(item => (
                            <div key={item.line} className={`code-line ${highlightLine === item.line ? 'active-line' : ''}`}>
                                <span className="line-num">{item.line} </span>
                                <code>{item.text}</code>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
};