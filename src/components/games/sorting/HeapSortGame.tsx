
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface HeapSortGameProps {
    onComplete?: (score: number) => void;
}

export const HeapSortGame: React.FC<HeapSortGameProps> = ({ onComplete }) => {
    const [array, setArray] = useState<number[]>([]);
    const [message, setMessage] = useState('Hãy xây dựng Max-Heap! Phần tử cha phải lớn hơn các con.');
    const [completed, setCompleted] = useState(false);

    const initGame = useCallback(() => {
        const vals = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 1);
        setArray(vals);
        setCompleted(false);
        setMessage('Click vào 2 phần tử để hoán đổi. Cha >= Con để tạo Max-Heap!');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const swap = (i: number, j: number) => {
        const newArr = [...array];
        const temp = newArr[i];
        newArr[i] = newArr[j];
        newArr[j] = temp;
        setArray(newArr);
        checkHeap(newArr);
    };

    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const handleNodeClick = (idx: number) => {
        if (completed) return;
        if (selectedIdx === null) {
            setSelectedIdx(idx);
        } else {
            if (selectedIdx !== idx) {
                swap(selectedIdx, idx);
            }
            setSelectedIdx(null);
        }
    };

    const checkHeap = (arr: number[]) => {
        let isMaxHeap = true;
        for (let i = 0; i <= Math.floor((arr.length - 2) / 2); i++) {
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            if (left < arr.length && arr[i] < arr[left]) isMaxHeap = false;
            if (right < arr.length && arr[i] < arr[right]) isMaxHeap = false;
        }

        if (isMaxHeap) {
            setCompleted(true);
            setMessage('Chúc mừng! Bạn đã tạo được Max-Heap hoàn chỉnh! 🎉');
            if (onComplete) onComplete(100);
        }
    };

    const getNodePos = (idx: number) => {
        const levels = [
            { y: 50, x: 50 }, // Root
            { y: 130, x: 25 }, { y: 130, x: 75 }, // Level 1
            { y: 210, x: 12.5 }, { y: 210, x: 37.5 }, { y: 210, x: 62.5 }, { y: 210, x: 87.5 } // Level 2
        ];
        return levels[idx];
    };

    return (
        <div className="p-6 bg-slate-900 rounded-xl h-full flex flex-col items-center select-none">
            <h3 className="text-xl font-bold mb-2 text-yellow-400">Thử thách: Xây dựng Max Heap</h3>
            <p className="text-sm text-slate-400 mb-8 h-8 text-center">{message}</p>

            <div className="relative w-full h-[300px] mb-8">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {array.map((_, i) => {
                        const left = 2 * i + 1;
                        const right = 2 * i + 2;
                        const lines = [];
                        if (left < array.length) {
                            const p1 = getNodePos(i);
                            const p2 = getNodePos(left);
                            lines.push(<line key={`l-${i}-${left}`} x1={`${p1.x}%`} y1={p1.y} x2={`${p2.x}%`} y2={p2.y} stroke="#334155" strokeWidth="2" />);
                        }
                        if (right < array.length) {
                            const p1 = getNodePos(i);
                            const p2 = getNodePos(right);
                            lines.push(<line key={`l-${i}-${right}`} x1={`${p1.x}%`} y1={p1.y} x2={`${p2.x}%`} y2={p2.y} stroke="#334155" strokeWidth="2" />);
                        }
                        return lines;
                    })}
                </svg>

                {array.map((val, idx) => {
                    const pos = getNodePos(idx);
                    const isParentWrong = () => {
                        const left = 2 * idx + 1;
                        const right = 2 * idx + 2;
                        if (left < array.length && val < array[left]) return true;
                        if (right < array.length && val < array[right]) return true;
                        return false;
                    };

                    return (
                        <motion.div
                            key={`node-${idx}`}
                            layout
                            className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold cursor-pointer border-2 transition-colors
                                ${selectedIdx === idx ? 'border-yellow-400 bg-yellow-900/40 text-yellow-200' :
                                    isParentWrong() ? 'border-red-500 bg-red-900/20 text-red-200' : 'border-slate-600 bg-slate-800 text-slate-200'}
                            `}
                            style={{ left: `${pos.x}%`, top: pos.y, transform: 'translate(-50%, -50%)' }}
                            onClick={() => handleNodeClick(idx)}
                            whileHover={{ scale: 1.1 }}
                        >
                            {val}
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex gap-4">
                <button onClick={initGame} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all border border-slate-700">
                    Làm mới
                </button>
            </div>

            <div className="mt-8 text-xs text-slate-500 flex items-center gap-2">
                <i className="fi fi-rr-info"></i>
                Duyệt từng phần tử cha từ dưới lên và đổi chỗ với con lớn nhất nếu cần.
            </div>
        </div>
    );
};
