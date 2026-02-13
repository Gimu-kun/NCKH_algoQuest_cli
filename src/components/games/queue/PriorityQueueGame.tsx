
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PriorityQueueGameProps {
    onComplete?: (score: number) => void;
}

interface Patient {
    id: string;
    name: string;
    priority: number; // 1: High, 2: Medium, 3: Low
}

export const PriorityQueueGame: React.FC<PriorityQueueGameProps> = ({ onComplete }) => {
    const [queue, setQueue] = useState<Patient[]>([]);
    const [processed, setProcessed] = useState<Patient[]>([]);
    const [message, setMessage] = useState('Hãy chọn bệnh nhân có độ ưu tiên cao nhất (Priority 1) để xử lý trước!');
    const [completed, setCompleted] = useState(false);

    const names = ['Nam', 'An', 'Bình', 'Chi', 'Dương', 'Hương', 'Linh', 'Minh'];

    const initGame = useCallback(() => {
        const patients: Patient[] = Array.from({ length: 6 }, (_, i) => ({
            id: `p-${i}`,
            name: names[Math.floor(Math.random() * names.length)],
            priority: Math.floor(Math.random() * 3) + 1
        }));
        setQueue(patients);
        setProcessed([]);
        setCompleted(false);
        setMessage('Xử lý bệnh nhân theo độ ưu tiên: 1 (Cao nhất) -> 3 (Thấp nhất)');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const processPatient = (p: Patient) => {
        if (completed) return;

        // Check if any patient in queue has higher priority (smaller number)
        const highestPriority = Math.min(...queue.map(item => item.priority));

        if (p.priority === highestPriority) {
            setQueue(prev => prev.filter(item => item.id !== p.id));
            setProcessed(prev => [...prev, p]);
            setMessage(`Đã xử lý: ${p.name} (Priority ${p.priority})`);
        } else {
            setMessage(`Sai rồi! Còn bệnh nhân có Priority ${highestPriority} đang đợi.`);
        }
    };

    useEffect(() => {
        if (queue.length === 0 && processed.length > 0) {
            setCompleted(true);
            setMessage('Tất cả bệnh nhân đã được xử lý đúng trình tự! 🎉');
            if (onComplete) onComplete(100);
        }
    }, [queue, processed, onComplete]);

    return (
        <div className="p-6 bg-slate-900 rounded-xl h-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-2 text-rose-400">Thử thách: Hàng đợi ưu tiên (Hospital Triage)</h3>
            <p className="text-sm text-slate-400 mb-8">{message}</p>

            <div className="flex gap-4 mb-12 flex-wrap justify-center">
                <AnimatePresence>
                    {queue.map(p => (
                        <motion.div
                            key={p.id}
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0, x: 200 }}
                            className={`p-4 rounded-lg flex flex-col items-center cursor-pointer border-2 shadow-lg
                                ${p.priority === 1 ? 'bg-red-900/40 border-red-500' :
                                    p.priority === 2 ? 'bg-amber-900/40 border-amber-500' :
                                        'bg-slate-800 border-slate-600'}
                            `}
                            onClick={() => processPatient(p)}
                        >
                            <div className="text-xs uppercase opacity-60 mb-1">Priority {p.priority}</div>
                            <div className="text-xl font-bold text-white">{p.name}</div>
                            <div className="mt-2 text-[10px] py-0.5 px-2 bg-black/40 rounded uppercase text-gray-400">Hỗ trợ ngay</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="w-full max-w-2xl">
                <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest text-center">Đã xử lý xong</div>
                <div className="flex gap-2 justify-center min-h-[50px] bg-black/20 p-4 rounded-xl border border-dashed border-slate-700">
                    {processed.map(p => (
                        <div key={p.id} className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded text-xs text-green-400">
                            {p.name} ({p.priority})
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={initGame} className="mt-auto px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all border border-slate-700">
                Làm lại
            </button>
        </div>
    );
};
