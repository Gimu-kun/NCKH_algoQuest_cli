import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThunderboltTwoTone, QuestionCircleOutlined, SwapOutlined, TrophyOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './SelectionSortVisualizer.css';

interface Props {
    vizData: any;
    onFinish: (isPassed: boolean, failCount: number) => void;
}

export const SelectionSortVisualizer: React.FC<Props> = ({ vizData, onFinish }) => {
    const [array, setArray] = useState([...vizData.array]);
    const [i, setI] = useState(0); 
    const [j, setJ] = useState(1); 
    const [userMinIdx, setUserMinIdx] = useState(0); 
    const [step, setStep] = useState<'SCANNING_DECISION' | 'SWAPPING' | 'FINISHED'>('SCANNING_DECISION');
    
    // Feedback & Summary States
    const [wrongClicks, setWrongClicks] = useState(0);
    const [dialog, setDialog] = useState<{ title: string; message: string; type: 'error' | 'success' | 'summary' } | null>(null);

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const maxVal = Math.max(...array);

    const MAX_ERRORS = 5;

    // Kiểm tra kết thúc do quá nhiều lỗi
    useEffect(() => {
        if (wrongClicks >= MAX_ERRORS) {
            setStep('FINISHED');
            setDialog({
                title: "Thất bại!",
                message: `Bạn đã sai quá ${MAX_ERRORS} lần. Hãy xem lại luồng hoạt động của Selection Sort nhé!`,
                type: 'summary'
            });
        }
    }, [wrongClicks]);

    const handleDecision = (shouldReplace: boolean) => {
        const isActuallySmaller = array[j] < array[userMinIdx];
        if (shouldReplace === isActuallySmaller) {
            if (shouldReplace) setUserMinIdx(j);
            
            if (j < array.length - 1) {
                setJ(prev => prev + 1);
            } else {
                // Duyệt xong vòng lặp: KIỂM TRA TỰ ĐỘNG BỎ QUA SWAP
                checkNeedSwap(shouldReplace ? (shouldReplace ? j : userMinIdx) : userMinIdx);
            }
        } else {
            handleWrongAction("Sai rồi!", isActuallySmaller 
                ? `Giá trị ${array[j]} nhỏ hơn ${array[userMinIdx]}, bạn nên chọn Có.` 
                : `Giá trị ${array[j]} không nhỏ hơn, không cần thay thế.`);
        }
    };

    const checkNeedSwap = (finalMinIdx: number) => {
        if (finalMinIdx === i) {
            // Phần tử nhỏ nhất đã ở đúng vị trí i -> Tự động qua bước kế
            setDialog({
                title: "Không cần đổi chỗ",
                message: `Giá trị ${array[i]} đã là nhỏ nhất trong phần còn lại. Tự động chuyển sang vòng lặp kế tiếp.`,
                type: 'success'
            });
            setTimeout(() => {
                setDialog(null);
                nextIteration(array);
            }, 1500);
        } else {
            setStep('SWAPPING');
        }
    };

    const handleDragEnd = (draggedIdx: number, info: any) => {
        if (step !== 'SWAPPING') return;
    
        // 1. Lấy tọa độ X thực tế của phần tử đang kéo khi kết thúc
        // info.point.x là tọa độ tuyệt đối trên màn hình
        const dropX = info.point.x;
    
        // 2. Tìm xem tọa độ này nằm trong phạm vi của cột nào
        let targetIdx = -1;
        for (let index = 0; index < array.length; index++) {
            const el = cardRefs.current[index];
            if (el) {
                const rect = el.getBoundingClientRect();
                // Kiểm tra xem điểm thả có nằm giữa cạnh trái và cạnh phải của cột index không
                if (dropX >= rect.left && dropX <= rect.right) {
                    targetIdx = index;
                    break;
                }
            }
        }
    
        // 3. Kiểm tra logic Selection Sort
        // draggedIdx phải là userMinIdx và targetIdx phải là i
        if (draggedIdx === userMinIdx && targetIdx === i) {
            const newArray = [...array];
            [newArray[i], newArray[userMinIdx]] = [newArray[userMinIdx], newArray[i]];
            setArray(newArray);
            
            setDialog({ 
                title: "Chính xác!", 
                message: `Đã đưa giá trị ${newArray[i]} về vị trí ${i}`, 
                type: 'success' 
            });
            nextIteration(newArray);
        } else {
            // Nếu thả sai hoặc thả ra ngoài mảng
            handleWrongAction(
                "Vị trí chưa đúng!", 
                targetIdx === -1 
                    ? "Bạn cần thả phần tử vào trong các ô chỉ số." 
                    : `Bạn đang thả vào vị trí ${targetIdx}, nhưng phần tử nhỏ nhất phải về vị trí ${i}.`
            );
        }
    };

    const nextIteration = (currentArray: number[]) => {
        if (i < currentArray.length - 2) {
            const nextI = i + 1;
            setI(nextI);
            setJ(nextI + 1);
            setUserMinIdx(nextI);
            setStep('SCANNING_DECISION');
        } else {
            setStep('FINISHED');
            setDialog({
                title: "Hoàn thành!",
                message: `Chúc mừng! Bạn đã sắp xếp xong mảng với ${wrongClicks} lỗi.`,
                type: 'summary'
            });
        }
    };

    const handleWrongAction = (title: string, msg: string) => {
        setWrongClicks(prev => prev + 1);
        setDialog({ title, message: msg, type: 'error' });
    };

    return (
        <div className="selection-sort-immersive">
            <div className="viz-main-area">
                <AnimatePresence>
                    {dialog && (
                        <div className="dialog-overlay">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`dialog-card ${dialog.type}`}>
                                {dialog.type === 'summary' ? (
                                    wrongClicks < MAX_ERRORS ? <TrophyOutlined className="summary-icon success"/> : <CloseCircleOutlined className="summary-icon fail"/>
                                ) : null}
                                <h4>{dialog.title}</h4>
                                <p>{dialog.message}</p>
                                {dialog.type === 'summary' ? (
                                    <button className="btn-finish" onClick={() => onFinish(wrongClicks < MAX_ERRORS, wrongClicks)}>Đóng & Kết thúc</button>
                                ) : (
                                    <button className="dialog-btn" onClick={() => setDialog(null)}>Tiếp tục</button>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="viz-header">
                    <h3 className="header-title">Selection Sort Challenge</h3>
                    <div className={`lives ${wrongClicks >= 4 ? 'danger' : ''}`}>
                        <ThunderboltTwoTone twoToneColor={wrongClicks >= 4 ? "#ff4d4f" : "#fadb14"}/> 
                        Lỗi: {wrongClicks}/{MAX_ERRORS}
                    </div>
                </div>

                <div className="chart-container">
                    {array.map((val, idx) => (
                        <motion.div
                            key={`${idx}-${val}`}
                            ref={(el) => { cardRefs.current[idx] = el; }}
                            layout
                            drag={step === 'SWAPPING' && idx === userMinIdx ? "x" : false}
                            dragMomentum={false}
                            onDragEnd={(_, info) => handleDragEnd(idx, info)}
                            className={`bar-wrapper ${idx < i ? 'sorted' : ''} ${idx === j && step === 'SCANNING_DECISION' ? 'scanning' : ''}`}
                        >
                            <div className={`bar ${idx === userMinIdx ? 'is-user-min' : ''}`} style={{ height: `${(val / maxVal) * 180}px` }}>
                                <span className="bar-value">{val}</span>
                            </div>
                            <span className="bar-index">{idx}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="control-panel">
                    {step === 'SCANNING_DECISION' ? (
                        <div className="action-step">
                            <p>So sánh <strong>{array[j]}</strong> với Min hiện tại (<strong>{array[userMinIdx]}</strong>). Thay thế Min?</p>
                            <div className="btn-group">
                                <button className="btn-decide yes" onClick={() => handleDecision(true)}>Có</button>
                                <button className="btn-decide no" onClick={() => handleDecision(false)}>Không</button>
                            </div>
                        </div>
                    ) : step === 'SWAPPING' ? (
                        <div className="action-step"><p><SwapOutlined /> Hãy kéo <strong>{array[userMinIdx]}</strong> về vị trí <strong>{i}</strong>.</p></div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};