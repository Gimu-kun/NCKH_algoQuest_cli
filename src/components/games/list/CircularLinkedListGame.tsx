
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface CircularLinkedListGameProps {
    onComplete?: (score: number) => void;
}

interface Node {
    id: string;
    value: number;
}

export const CircularLinkedListGame: React.FC<CircularLinkedListGameProps> = ({ onComplete }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [targetSum, setTargetSum] = useState(0);
    const [currentSum, setCurrentSum] = useState(0);
    const [message, setMessage] = useState('Duyệt vòng tròn để thu thập đủ tổng yêu cầu!');
    const [completed, setCompleted] = useState(false);

    const initGame = useCallback(() => {
        const count = 6;
        const vals = Array.from({ length: count }, (_, i) => ({
            id: `node-${i}`,
            value: Math.floor(Math.random() * 10) + 1
        }));
        setNodes(vals);
        setCurrentIndex(0);
        setCurrentSum(0);
        setTargetSum(20 + Math.floor(Math.random() * 20)); // Target sum around 20-40
        setCompleted(false);
        setMessage(`Hãy đi vòng quanh! Mục tiêu tổng: ${targetSum || 30}. Hiện tại: 0`);
    }, [targetSum]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const moveNext = () => {
        if (completed) return;
        const nextIdx = (currentIndex + 1) % nodes.length;
        const nodeVal = nodes[nextIdx].value;
        const newSum = currentSum + nodeVal;

        setCurrentIndex(nextIdx);
        setCurrentSum(newSum);
        setMessage(`Tổng hiện tại: ${newSum} / ${targetSum}`);

        if (newSum >= targetSum) {
            setCompleted(true);
            setMessage(`Tuyệt vời! Bạn đã quay qua điểm bắt đầu ${Math.floor(newSum / 10)} lần để đạt mục tiêu. 🎉`);
            if (onComplete) onComplete(100);
        }
    };

    return (
        <div className="p-8 bg-slate-900 rounded-2xl flex flex-col items-center h-full">
            <h3 className="text-2xl font-bold mb-2 text-orange-400">Vòng quay Liên Kết (Circular List)</h3>
            <p className="text-gray-400 mb-12 text-center h-8">{message}</p>

            <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Visual Ring */}
                <div className="absolute inset-0 border-4 border-dashed border-slate-700/50 rounded-full" />

                {nodes.map((node, i) => {
                    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
                    const x = Math.cos(angle) * 120;
                    const y = Math.sin(angle) * 120;
                    const isPointer = i === currentIndex;

                    return (
                        <motion.div
                            key={node.id}
                            className={`absolute w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors
                                ${isPointer ? 'bg-orange-500 border-white shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-slate-800 border-slate-600 text-slate-400'}
                            `}
                            style={{
                                left: `calc(50% + ${x}px - 28px)`,
                                top: `calc(50% + ${y}px - 28px)`
                            }}
                            animate={isPointer ? { scale: 1.2 } : { scale: 1 }}
                        >
                            {node.value}
                            {isPointer && (
                                <motion.div
                                    layoutId="pointer"
                                    className="absolute -top-4 text-orange-400 text-xs font-black uppercase"
                                >
                                    HERE
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}

                <button
                    onClick={moveNext}
                    disabled={completed}
                    className="w-24 h-24 rounded-full bg-slate-800 border-4 border-orange-500/20 hover:border-orange-500 text-orange-400 flex flex-col items-center justify-center transition-all active:scale-90"
                >
                    <i className="fi fi-rr-redo text-3xl mb-1"></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Next</span>
                </button>
            </div>

            <div className="mt-12 w-full max-w-sm bg-black/20 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-500 mb-2 uppercase tracking-widest">
                    <span>Tiến trình thu thập</span>
                    <span>{Math.round((currentSum / targetSum) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (currentSum / targetSum) * 100)}%` }}
                    />
                </div>
            </div>

            <button onClick={initGame} className="mt-8 text-xs underline opacity-40 hover:opacity-100">Reset Case</button>
        </div>
    );
};
