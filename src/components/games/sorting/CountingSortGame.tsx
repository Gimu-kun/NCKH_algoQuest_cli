
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CountingSortGameProps {
    onComplete?: (score: number) => void;
}

export const CountingSortGame: React.FC<CountingSortGameProps> = ({ onComplete }) => {
    const [array, setArray] = useState<number[]>([]);
    const [countArr, setCountArr] = useState<number[]>(new Array(6).fill(0));
    const [phase, setPhase] = useState<'counting' | 'output'>('counting');
    const [processedIdx, setProcessedIdx] = useState(0);
    const [message, setMessage] = useState('Hãy đếm số lần xuất hiện của mỗi giá trị!');
    const [completed, setCompleted] = useState(false);

    const initGame = useCallback(() => {
        const vals = Array.from({ length: 8 }, () => Math.floor(Math.random() * 5)); // Values 0-4
        setArray(vals);
        setCountArr(new Array(5).fill(0));
        setPhase('counting');
        setProcessedIdx(0);
        setCompleted(false);
        setMessage('Click vào đúng ô giá trị ở bảng Đếm cho mỗi số từ trái qua phải!');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleCountClick = (val: number) => {
        if (completed || phase !== 'counting') return;

        const currentNum = array[processedIdx];
        if (val === currentNum) {
            const newCount = [...countArr];
            newCount[val]++;
            setCountArr(newCount);

            if (processedIdx < array.length - 1) {
                setProcessedIdx(p => p + 1);
                setMessage(`Đúng! ${currentNum} đã được đếm. Tiếp theo...`);
            } else {
                setPhase('output');
                setProcessedIdx(0);
                setMessage('Xong! Bây giờ hãy xây dựng mảng kết quả dựa trên bảng đếm.');
            }
        } else {
            setMessage(`Sai rồi! Số hiện tại cần đếm là ${currentNum}.`);
        }
    };

    const [outputArr, setOutputArr] = useState<number[]>([]);

    const handleOutputClick = (val: number) => {
        if (completed || phase !== 'output') return;

        // Check if val is the smallest available in countArr
        const firstAvailable = countArr.findIndex(c => c > 0);
        if (val === firstAvailable) {
            setOutputArr(prev => [...prev, val]);
            const newCount = [...countArr];
            newCount[val]--;
            setCountArr(newCount);

            if (newCount.every(c => c === 0)) {
                setCompleted(true);
                setMessage('Tuyệt vời! Bạn đã hoàn thành thuật toán Counting Sort. 🎉');
                if (onComplete) onComplete(100);
            }
        } else {
            setMessage('Bạn phải lấy ra giá trị nhỏ nhất từ bảng đếm!');
        }
    };

    return (
        <div className="p-6 bg-indigo-950/20 rounded-xl border border-indigo-500/30 h-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-indigo-300">Thử thách: Counting Sort</h3>

            <div className="w-full max-w-lg bg-slate-900/40 p-4 rounded-lg mb-6">
                <div className="text-xs text-slate-500 uppercase mb-2">Mảng đầu vào</div>
                <div className="flex gap-2">
                    {array.map((v, i) => (
                        <div key={i} className={`w-10 h-10 border rounded flex items-center justify-center font-bold
                            ${phase === 'counting' && i === processedIdx ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-lg' :
                                phase === 'counting' && i < processedIdx ? 'bg-slate-800 border-slate-700 opacity-30 shadow-none' : 'bg-slate-800 border-slate-700'}
                        `}>
                            {v}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-lg bg-slate-900/40 p-4 rounded-lg mb-6">
                <div className="text-xs text-slate-500 uppercase mb-2">Bảng Đếm (Count Array)</div>
                <div className="flex gap-4">
                    {countArr.map((count, val) => (
                        <div key={val} className="flex flex-col items-center gap-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => phase === 'counting' ? handleCountClick(val) : handleOutputClick(val)}
                                className={`w-14 h-14 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
                                    ${phase === 'counting' ? 'border-indigo-500 hover:bg-indigo-500/20' :
                                        count > 0 ? 'border-green-500 bg-green-950/20 hover:bg-green-500/40' : 'border-slate-700 opacity-50'}
                                `}
                            >
                                <span className="text-xs opacity-60">Val {val}</span>
                                <span className="text-lg font-bold">{count}</span>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-lg">
                <div className="text-xs text-slate-500 uppercase mb-2">Mảng kết quả (Output)</div>
                <div className="min-h-[50px] flex gap-2 p-2 border border-dashed border-slate-700 rounded-lg bg-black/20">
                    <AnimatePresence>
                        {outputArr.map((v, i) => (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                key={`out-${i}`}
                                className="w-10 h-10 bg-green-900/40 border border-green-500/50 rounded flex items-center justify-center font-bold text-green-400"
                            >
                                {v}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <p className="mt-8 text-sm text-slate-400 h-8 italic">{message}</p>
            <button onClick={initGame} className="mt-4 px-4 py-2 text-xs bg-slate-800 rounded hover:bg-slate-700">Làm lại</button>
        </div>
    );
};
