
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface QueueGameProps {
    onComplete?: (score: number) => void;
}

interface Customer {
    id: string;
    type: string;
    icon: string;
}

export const QueueGame: React.FC<QueueGameProps> = ({ onComplete }) => {
    const [queue, setQueue] = useState<Customer[]>([]);
    const [servedCount, setServedCount] = useState(0);
    const [message, setMessage] = useState('Chào mừng bạn đến quầy phục vụ! Người đến trước sẽ được phục vụ trước (FIFO).');
    const [completed, setCompleted] = useState(false);

    const icons = ['fi-rr-user', 'fi-rr-user-robot', 'fi-rr-smiley', 'fi-rr-glasses'];

    const initGame = useCallback(() => {
        setQueue([]);
        setServedCount(0);
        setCompleted(false);
        setMessage('Nhiệm vụ: Thêm khách hàng vào hàng đợi và phục vụ họ đúng thứ tự FIFO!');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const enqueue = () => {
        if (queue.length >= 6 || completed) return;
        const newCustomer: Customer = {
            id: Math.random().toString(),
            type: 'customer',
            icon: icons[Math.floor(Math.random() * icons.length)]
        };
        setQueue(prev => [...prev, newCustomer]);
        setMessage('Đã thêm khách hàng vào cuối hàng (ENQUEUE).');
    };

    const dequeue = () => {
        if (queue.length === 0 || completed) return;
        setQueue(prev => prev.slice(1));
        setServedCount(s => s + 1);
        setMessage('Đã phục vụ khách hàng ở đầu hàng (DEQUEUE).');
    };

    useEffect(() => {
        if (servedCount >= 5 && queue.length === 0) {
            setCompleted(true);
            setMessage('Tuyệt vời! Bạn đã phục vụ hành khách theo đúng nguyên lý FIFO của Queue. 🎉');
            if (onComplete) onComplete(100);
        }
    }, [servedCount, queue, onComplete]);

    return (
        <div className="p-8 bg-blue-950/20 rounded-2xl flex flex-col items-center h-full border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-2 text-blue-400">Customer Queue (FIFO)</h3>
            <p className="text-gray-400 mb-12 text-center text-sm">{message}</p>

            {/* Service Counter */}
            <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                <div className="flex items-center gap-12">
                    <div className="w-32 h-32 bg-slate-800 rounded-2xl border-4 border-blue-500 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <i className="fi fi-rr-shop text-4xl text-blue-400 mb-2"></i>
                        <span className="text-[10px] font-bold uppercase text-slate-500">Service Desk</span>
                    </div>

                    <div className="flex-1 flex items-center justify-start gap-4 min-h-[100px] bg-black/40 p-4 rounded-3xl border border-dashed border-slate-700 relative w-[400px]">
                        <AnimatePresence>
                            {queue.map((c, i) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    className={`w-14 h-14 rounded-full bg-slate-800 border-2 flex items-center justify-center text-xl shadow-lg
                                        ${i === 0 ? 'border-green-500 text-green-400' : 'border-slate-600 text-slate-400'}
                                    `}
                                >
                                    <i className={`fi ${c.icon}`}></i>
                                    {i === 0 && <div className="absolute -top-6 text-[8px] font-bold text-green-500">FRONT</div>}
                                    {i === queue.length - 1 && queue.length > 1 && <div className="absolute -top-6 text-[8px] font-bold text-blue-500">REAR</div>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {!queue.length && (
                            <div className="flex-1 text-center text-[10px] text-slate-600 uppercase tracking-widest font-mono">
                                Hàng đợi trống
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={enqueue}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center gap-3"
                    >
                        <i className="fi fi-rr-add-user text-xl"></i> ENQUEUE
                    </button>
                    <button
                        onClick={dequeue}
                        disabled={queue.length === 0}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-3 disabled:opacity-20"
                    >
                        DEQUEUE (Serve) <i className="fi fi-rr-check text-xl"></i>
                    </button>
                </div>
            </div>

            <div className="mt-12 flex items-center gap-8">
                <div className="text-center">
                    <div className="text-3xl font-bold text-white">{servedCount}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Đã phục vụ</div>
                </div>
                <div className="h-12 w-px bg-slate-800" />
                <button onClick={initGame} className="text-xs text-slate-600 hover:text-white transition-colors">Làm mới hệ thống</button>
            </div>
        </div>
    );
};
