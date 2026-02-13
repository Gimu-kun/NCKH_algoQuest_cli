import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StackGameProps {
    onComplete?: (score: number) => void;
}

interface Box {
    id: string;
    label: string;
    color: string;
}

export const StackGame: React.FC<StackGameProps> = ({ onComplete }) => {
    const [stack, setStack] = useState<Box[]>([]);
    const [message, setMessage] = useState('Xếp các thùng hàng vào kho! Thùng vào sau cùng sẽ phải lấy ra trước (LIFO).');
    const [completed, setCompleted] = useState(false);

    const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
    const labels = ['A', 'B', 'C', 'D', 'E'];

    const initGame = useCallback(() => {
        setStack([]);
        setCompleted(false);
        setMessage('Nhiệm vụ: Xếp 4 thùng A, B, C, D vào chồng. Sau đó lấy ra theo đúng thứ tự LIFO!');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const push = (label: string) => {
        if (stack.length >= 5 || completed) return;
        if (stack.some(b => b.label === label)) {
            setMessage(`Thùng ${label} đã có trong chồng!`);
            return;
        }
        const newBox: Box = {
            id: Math.random().toString(),
            label,
            color: colors[labels.indexOf(label)]
        };
        setStack(prev => [...prev, newBox]);
        setMessage(`Đã PUSH thùng ${label}.`);
    };

    const pop = () => {
        if (stack.length === 0 || completed) return;
        const popped = stack[stack.length - 1];
        const newStack = stack.slice(0, -1);
        setStack(newStack);
        setMessage(`Đã POP thùng ${popped.label}.`);

        if (newStack.length === 0 && stack.length === 1 && popped.label === 'A') {
            // Logic simplification for learning: if they pushed A,B,C,D and popped D,C,B,A
        }
    };

    useEffect(() => {
        // Winning condition: User pushed A,B,C,D then popped them all
        // For simplicity: if they reach 4 items and then empty it, they win
        if (stack.length === 4) {
            setMessage('Tốt! Bây giờ hãy dùng lệnh POP để lấy hết các thùng ra.');
        }
        if (stack.length === 0 && completed === false && message.includes('POP')) {
            setCompleted(true);
            setMessage('Tuyệt vời! Bạn đã nắm vững nguyên lý LIFO của Stack. 🎉');
            if (onComplete) onComplete(100);
        }
    }, [stack, message, completed, onComplete]);

    return (
        <div className="p-8 bg-slate-900 rounded-2xl flex flex-col items-center h-full border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-rose-400 font-mono tracking-tighter">Memory Stack Simulator</h3>
            <p className="text-gray-400 mb-8 text-center text-sm">{message}</p>

            <div className="flex gap-12 items-start w-full max-w-2xl">
                {/* Control Panel */}
                <div className="flex flex-col gap-4">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Lệnh Điều Khiển</div>
                    <div className="grid grid-cols-2 gap-2">
                        {labels.slice(0, 4).map(l => (
                            <button
                                key={l}
                                onClick={() => push(l)}
                                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded hover:bg-rose-500/20 hover:border-rose-500 text-xs transition-all font-bold"
                            >
                                PUSH {l}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={pop}
                        className="mt-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold shadow-lg shadow-rose-900/40 transition-all active:scale-95"
                    >
                        POP (Lấy ra)
                    </button>
                    <button onClick={initGame} className="text-[10px] text-slate-600 underline">Reset Memory</button>
                </div>

                {/* Stack Visualization */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="relative w-48 h-80 border-x-4 border-b-4 border-slate-700 rounded-b-xl bg-black/40 flex flex-col-reverse p-2 gap-1 overflow-hidden">
                        <AnimatePresence>
                            {stack.map((box, idx) => (
                                <motion.div
                                    key={box.id}
                                    initial={{ y: -300, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -300, opacity: 0 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                    className={`w-full h-14 ${box.color} border-2 border-white/20 rounded flex items-center justify-center text-2xl font-black text-white shadow-lg`}
                                >
                                    {box.label}
                                    {idx === stack.length - 1 && (
                                        <div className="absolute -right-2 bg-white text-black text-[8px] px-1 font-bold rounded">TOP</div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {!stack.length && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-mono text-xs text-center p-4">
                                Stack rỗng<br />(PUSH để thêm dữ liệu)
                            </div>
                        )}
                    </div>
                    <div className="mt-4 text-[10px] text-slate-600 uppercase tracking-widest font-mono">Cấu trúc ngăn xếp (LIFO)</div>
                </div>
            </div>
        </div>
    );
};
