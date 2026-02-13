
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface LinearSearchGameProps {
    onComplete?: (score: number) => void;
}

export const LinearSearchGame: React.FC<LinearSearchGameProps> = ({ onComplete }) => {
    const [items, setItems] = useState<number[]>([]);
    const [target, setTarget] = useState<number>(0);
    const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
    const [message, setMessage] = useState('Hãy tìm phần tử mục tiêu bằng cách kiểm tra từng ô!');
    const [completed, setCompleted] = useState(false);

    const initGame = useCallback(() => {
        const count = 12;
        const vals = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
        const targetVal = vals[Math.floor(Math.random() * count)];
        setItems(vals);
        setTarget(targetVal);
        setCheckedIndices([]);
        setCompleted(false);
        setMessage(`Tìm giá trị: ${targetVal}. Bạn nên kiểm tra từ trái qua phải.`);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const checkIndex = (idx: number) => {
        if (completed) return;

        // Linear search check: should check in order for "perfect" score, but allow any.
        // But to demonstrate linear search, we should highlight current vs target.
        if (checkedIndices.includes(idx)) return;

        const nextIndices = [...checkedIndices, idx];
        setCheckedIndices(nextIndices);

        if (items[idx] === target) {
            setCompleted(true);
            setMessage(`Tuyệt vời! Bạn đã tìm thấy ${target} tại vị trí ${idx}. 🎉`);
            if (onComplete) onComplete(100);
        } else {
            setMessage(`Vị trí ${idx} là ${items[idx]}. Không phải mục tiêu.`);
        }
    };

    return (
        <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-700 h-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-2 text-indigo-400">Thử thách: Tìm kiếm Tuyến tính</h3>
            <div className="mb-6 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded text-center">
                Mục tiêu cần tìm: <span className="text-2xl font-bold text-white">{target}</span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                {items.map((val, idx) => (
                    <motion.div
                        key={idx}
                        className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer border-2 transition-all
                            ${checkedIndices.includes(idx)
                                ? (val === target ? 'bg-green-600 border-green-400' : 'bg-slate-700 border-slate-500 opacity-50')
                                : 'bg-slate-800 border-slate-600 hover:border-indigo-400'}
                        `}
                        onClick={() => checkIndex(idx)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {checkedIndices.includes(idx) ? val : '?'}
                    </motion.div>
                ))}
            </div>

            <p className="text-slate-400 text-sm italic mb-8 h-8">{message}</p>

            <button onClick={initGame} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                Làm lại
            </button>
        </div>
    );
};
