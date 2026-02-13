
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DequeGameProps {
    onComplete?: (score: number) => void;
}

interface Item {
    id: string;
    value: string;
}

export const DequeGame: React.FC<DequeGameProps> = ({ onComplete }) => {
    const [deque, setDeque] = useState<Item[]>([]);
    const [message, setMessage] = useState('Chào mừng tới trạm vận chuyển Deque! Bạn có thể thêm/xóa ở cả hai đầu.');
    const [completed, setCompleted] = useState(false);
    const [targetPattern, setTargetPattern] = useState<string[]>([]);

    const initGame = useCallback(() => {
        setDeque([]);
        setTargetPattern(['📦', '🎁', '💎']);
        setCompleted(false);
        setMessage('Nhiệm vụ: Tạo dãy [📦, 🎁, 💎] bằng cách thêm vào Front hoặc Rear!');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const addFront = (val: string) => {
        if (deque.length >= 5 || completed) return;
        setDeque(prev => [{ id: Math.random().toString(), value: val }, ...prev]);
    };

    const addRear = (val: string) => {
        if (deque.length >= 5 || completed) return;
        setDeque(prev => [...prev, { id: Math.random().toString(), value: val }]);
    };

    const removeFront = () => {
        if (deque.length === 0 || completed) return;
        setDeque(prev => prev.slice(1));
    };

    const removeRear = () => {
        if (deque.length === 0 || completed) return;
        setDeque(prev => prev.slice(0, -1));
    };

    useEffect(() => {
        const currentVals = deque.map(d => d.value);
        if (JSON.stringify(currentVals) === JSON.stringify(targetPattern)) {
            setCompleted(true);
            setMessage('Chính xác! Deque cho phép linh hoạt tối đa khi thêm/xóa dữ liệu. 🎉');
            if (onComplete) onComplete(100);
        }
    }, [deque, targetPattern, onComplete]);

    return (
        <div className="p-8 bg-slate-900 rounded-2xl flex flex-col items-center h-full">
            <h3 className="text-2xl font-bold mb-2 text-indigo-400">Double-Ended Queue (Deque)</h3>
            <p className="text-gray-400 mb-8 text-center text-sm">{message}</p>

            <div className="w-full max-w-xl flex flex-col gap-12">
                {/* Deque Visualization */}
                <div className="relative flex items-center justify-center gap-4 bg-black/40 p-8 rounded-3xl border-2 border-indigo-500/30 min-h-[140px]">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-500 origin-center -rotate-90">FRONT</div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-pink-500 origin-center rotate-90">REAR</div>

                    <AnimatePresence>
                        {deque.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                            >
                                {item.value}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {!deque.length && <div className="text-slate-700 font-mono italic">Hàng đợi rỗng</div>}
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                        <div className="text-center text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Front Operations</div>
                        <div className="flex gap-2 justify-center">
                            {['📦', '🎁', '💎'].map(v => (
                                <button key={v} onClick={() => addFront(v)} className="w-10 h-10 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all">{v}</button>
                            ))}
                        </div>
                        <button onClick={removeFront} className="w-full py-2 bg-slate-800 hover:bg-red-500/20 text-xs rounded-lg border border-slate-700">Remove Front</button>
                    </div>

                    <div className="space-y-4 p-4 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                        <div className="text-center text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Rear Operations</div>
                        <div className="flex gap-2 justify-center">
                            {['📦', '🎁', '💎'].map(v => (
                                <button key={v} onClick={() => addRear(v)} className="w-10 h-10 bg-pink-600 rounded-lg hover:bg-pink-500 transition-all">{v}</button>
                            ))}
                        </div>
                        <button onClick={removeRear} className="w-full py-2 bg-slate-800 hover:bg-red-500/20 text-xs rounded-lg border border-slate-700">Remove Rear</button>
                    </div>
                </div>
            </div>

            <button onClick={initGame} className="mt-12 text-xs text-slate-600 underline">Reset Station</button>
        </div>
    );
};
