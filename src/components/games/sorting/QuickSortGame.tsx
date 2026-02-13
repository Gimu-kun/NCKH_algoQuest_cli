
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface QuickSortGameProps {
    onComplete?: (score: number) => void;
}

export const QuickSortGame: React.FC<QuickSortGameProps> = ({ onComplete }) => {
    const [array, setArray] = useState<number[]>([]);
    const [pivotIdx, setPivotIdx] = useState<number | null>(null);
    const [leftArr, setLeftArr] = useState<number[]>([]);
    const [rightArr, setRightArr] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState('Hãy chọn một Pivot (chốt) để bắt đầu phân đoạn!');
    const [phase, setPhase] = useState<'selecting' | 'partitioning' | 'completed'>('selecting');

    const initGame = useCallback(() => {
        const vals = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
        setArray(vals);
        setPivotIdx(null);
        setLeftArr([]);
        setRightArr([]);
        setCurrentIndex(0);
        setPhase('selecting');
        setMessage('Chọn một số bất kỳ làm Pivot!');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const selectPivot = (idx: number) => {
        if (phase !== 'selecting') return;
        setPivotIdx(idx);
        setPhase('partitioning');
        setCurrentIndex(0 === idx ? 1 : 0);
        setMessage(`Pivot là ${array[idx]}. Phân loại các số khác: Nhỏ hơn bên trái, Lớn hơn bên phải.`);
    };

    const addToLeft = () => {
        if (phase !== 'partitioning') return;
        const val = array[currentIndex];
        const pivot = array[pivotIdx!];

        if (val <= pivot) {
            setLeftArr(prev => [...prev, val]);
            advance();
        } else {
            setMessage(`Sai rồi! ${val} lớn hơn pivot ${pivot}, phải đưa sang Phải.`);
        }
    };

    const addToRight = () => {
        if (phase !== 'partitioning') return;
        const val = array[currentIndex];
        const pivot = array[pivotIdx!];

        if (val > pivot) {
            setRightArr(prev => [...prev, val]);
            advance();
        } else {
            setMessage(`Sai rồi! ${val} nhỏ hơn hoặc bằng pivot ${pivot}, phải đưa sang Trái.`);
        }
    };

    const advance = () => {
        let next = currentIndex + 1;
        if (next === pivotIdx) next++;

        if (next >= array.length) {
            setPhase('completed');
            setMessage('Phân đoạn (Partition) hoàn tất! Pivot đã đứng đúng vị trí giữa hai mảng. 🎉');
            if (onComplete) onComplete(100);
        } else {
            setCurrentIndex(next);
        }
    };

    return (
        <div className="p-6 bg-slate-900 rounded-xl h-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">Quick Sort: Partitioning Challenge</h3>
            <p className="text-sm text-slate-400 mb-8 h-8 text-center">{message}</p>

            <div className="flex gap-4 mb-12 min-h-[60px] items-center">
                {array.map((val, i) => (
                    <motion.div
                        key={i}
                        layout
                        onClick={() => selectPivot(i)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold border-2 transition-all cursor-pointer
                            ${pivotIdx === i ? 'bg-cyan-600 border-white scale-110 shadow-lg' :
                                phase === 'partitioning' && currentIndex === i ? 'bg-amber-600 border-amber-400 animate-bounce' :
                                    (leftArr.includes(val) || rightArr.includes(val)) && phase !== 'selecting' ? 'opacity-20 border-slate-700' : 'bg-slate-800 border-slate-600 hover:border-cyan-500'}
                        `}
                    >
                        {val}
                        {pivotIdx === i && <span className="absolute -bottom-6 text-[10px] text-cyan-400">PIVOT</span>}
                    </motion.div>
                ))}
            </div>

            {phase === 'partitioning' && (
                <div className="w-full flex justify-around gap-8">
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <div className="text-xs uppercase text-slate-500 tracking-tighter">Nhỏ hơn / Bằng</div>
                        <button
                            onClick={addToLeft}
                            className="w-full py-4 bg-indigo-900/40 border-2 border-dashed border-indigo-500 rounded-xl hover:bg-indigo-500/20 text-indigo-300 font-bold"
                        >
                            Dưa vào đây
                        </button>
                        <div className="flex gap-2 flex-wrap justify-center min-h-[40px]">
                            {leftArr.map((v, i) => <div key={i} className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-xs">{v}</div>)}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-4">
                        <div className="text-xs uppercase text-slate-500 tracking-tighter">Lớn hơn</div>
                        <button
                            onClick={addToRight}
                            className="w-full py-4 bg-emerald-900/40 border-2 border-dashed border-emerald-500 rounded-xl hover:bg-emerald-500/20 text-emerald-300 font-bold"
                        >
                            Đưa vào đây
                        </button>
                        <div className="flex gap-2 flex-wrap justify-center min-h-[40px]">
                            {rightArr.map((v, i) => <div key={i} className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-xs">{v}</div>)}
                        </div>
                    </div>
                </div>
            )}

            {phase === 'completed' && (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2 items-center text-lg font-bold">
                        <div className="flex gap-2">{leftArr.map((v, i) => <div key={i} className="px-3 py-1 bg-indigo-900/40 rounded">{v}</div>)}</div>
                        <div className="px-4 py-2 bg-cyan-600 rounded-lg shadow-lg">Pivot: {array[pivotIdx!]}</div>
                        <div className="flex gap-2">{rightArr.map((v, i) => <div key={i} className="px-3 py-1 bg-emerald-900/40 rounded">{v}</div>)}</div>
                    </div>
                    <button onClick={initGame} className="mt-8 px-6 py-2 bg-slate-800 rounded-lg text-sm border border-slate-700">Thử lại</button>
                </div>
            )}
        </div>
    );
};
