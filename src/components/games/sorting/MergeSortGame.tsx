
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface MergeSortGameProps {
    onComplete?: (score: number) => void;
}

export const MergeSortGame: React.FC<MergeSortGameProps> = ({ onComplete }) => {
    const [leftPile, setLeftPile] = useState<number[]>([]);
    const [rightPile, setRightPile] = useState<number[]>([]);
    const [merged, setMerged] = useState<number[]>([]);
    const [message, setMessage] = useState('Chọn số nhỏ hơn từ 2 cọc để gộp lại!');
    const [completed, setCompleted] = useState(false);

    const initPiles = useCallback(() => {
        const left = Array.from({ length: 4 }, () => Math.floor(Math.random() * 50)).sort((a, b) => a - b);
        const right = Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 50).sort((a, b) => a - b);
        setLeftPile(left);
        setRightPile(right);
        setMerged([]);
        setCompleted(false);
        setMessage('Chọn số nhỏ hơn từ 2 đầu cọc!');
    }, []);

    useEffect(() => {
        initPiles();
    }, [initPiles]);

    const pickLeft = () => {
        if (completed || leftPile.length === 0) return;
        const val = leftPile[0];
        const otherVal = rightPile[0];

        if (rightPile.length === 0 || val <= otherVal) {
            setMerged([...merged, val]);
            setLeftPile(leftPile.slice(1));
        } else {
            setMessage('Sai rồi! Bạn phải chọn số NHỎ nhất trong các số hiện có.');
        }
    };

    const pickRight = () => {
        if (completed || rightPile.length === 0) return;
        const val = rightPile[0];
        const otherVal = leftPile[0];

        if (leftPile.length === 0 || val <= otherVal) {
            setMerged([...merged, val]);
            setRightPile(rightPile.slice(1));
        } else {
            setMessage('Sai rồi! Bạn phải chọn số NHỎ nhất trong các số hiện có.');
        }
    };

    useEffect(() => {
        if (leftPile.length === 0 && rightPile.length === 0 && merged.length > 0) {
            setCompleted(true);
            setMessage('Hoàn hảo! Bạn đã gộp thành công danh sách đã sắp xếp. 🎉');
            if (onComplete) onComplete(100);
        }
    }, [leftPile, rightPile, merged, onComplete]);

    return (
        <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-700 h-full flex flex-col">
            <h3 className="text-xl font-bold text-center mb-4 text-blue-400">Thử thách: Merge Sort (Hợp nhất)</h3>
            <p className="text-center text-gray-400 mb-8">{message}</p>

            <div className="flex-1 flex flex-col gap-8 justify-center items-center">
                <div className="flex gap-20">
                    <div className="flex flex-col items-center">
                        <span className="mb-2 text-xs text-gray-500 uppercase">Cọc Trái</span>
                        <div className="flex flex-col-reverse gap-1">
                            {leftPile.map((v, i) => (
                                <motion.div
                                    key={`left-${v}-${i}`}
                                    layoutId={`num-${v}`}
                                    className={`w-16 h-10 rounded border ${i === 0 ? 'bg-blue-600 border-blue-400 cursor-pointer' : 'bg-gray-800 border-gray-700 opacity-50'}`}
                                    onClick={i === 0 ? pickLeft : undefined}
                                >
                                    <center className="leading-10 font-bold">{v}</center>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="mb-2 text-xs text-gray-500 uppercase">Cọc Phải</span>
                        <div className="flex flex-col-reverse gap-1">
                            {rightPile.map((v, i) => (
                                <motion.div
                                    key={`right-${v}-${i}`}
                                    layoutId={`num-${v}`}
                                    className={`w-16 h-10 rounded border ${i === 0 ? 'bg-purple-600 border-purple-400 cursor-pointer' : 'bg-gray-800 border-gray-700 opacity-50'}`}
                                    onClick={i === 0 ? pickRight : undefined}
                                >
                                    <center className="leading-10 font-bold">{v}</center>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-lg p-4 bg-black/30 rounded-lg min-h-[60px] flex gap-2 justify-center items-center border border-dashed border-gray-700">
                    {merged.map((v, i) => (
                        <motion.div
                            key={`merged-${v}-${i}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-12 h-10 bg-green-900/40 border border-green-500/50 rounded flex items-center justify-center font-bold text-green-400"
                        >
                            {v}
                        </motion.div>
                    ))}
                    {merged.length === 0 && <span className="text-gray-600 italic">Kéo hoặc chọn để gộp vào đây...</span>}
                </div>
            </div>

            <button onClick={initPiles} className="mt-8 self-center px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm">
                Làm mới
            </button>
        </div>
    );
};
