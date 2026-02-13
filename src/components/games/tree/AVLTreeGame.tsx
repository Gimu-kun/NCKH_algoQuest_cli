
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface AVLTreeGameProps {
    onComplete?: (score: number) => void;
}

export const AVLTreeGame: React.FC<AVLTreeGameProps> = ({ onComplete }) => {
    const [message, setMessage] = useState('Cây đang bị mất cân bằng! Hãy dùng các thao tác Xoay để cân bằng lại.');
    const [completed, setCompleted] = useState(false);

    const scenarios = [
        { initial: [10, 20, 30], type: 'RR', hint: 'Mất cân bằng Phải-Phải: Cần Xoay Trái tại gốc.' },
        { initial: [30, 20, 10], type: 'LL', hint: 'Mất cân bằng Trái-Trái: Cần Xoay Phải tại gốc.' },
        { initial: [10, 30, 20], type: 'RL', hint: 'Mất cân bằng Phải-Trái: Cần Xoay Phải (con) rồi Xoay Trái (gốc).' }
    ];

    const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
    const [treeState, setTreeState] = useState<number[]>([]);

    const initGame = useCallback(() => {
        const s = scenarios[currentScenarioIdx];
        setTreeState(s.initial);
        setMessage(s.hint);
        setCompleted(false);
    }, [currentScenarioIdx]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const rotateLeft = () => {
        if (completed) return;
        const [a, b, c] = treeState;
        if (a === 10 && b === 20 && c === 30) {
            setTreeState([20, 10, 30]);
            checkWin([20, 10, 30]);
        } else if (a === 10 && b === 30 && c === 20) {
            setTreeState([10, 20, 30]);
            setMessage('Tốt! Bây giờ nó trở thành Right-Right. Hãy Xoay Trái tại gốc!');
        } else {
            setMessage('Lệnh xoay này không giúp ích lúc này!');
        }
    };

    const rotateRight = () => {
        if (completed) return;
        const [a, b, c] = treeState;
        if (a === 30 && b === 20 && c === 10) {
            setTreeState([20, 10, 30]);
            checkWin([20, 10, 30]);
        } else if (a === 10 && b === 30 && c === 20) {
            setTreeState([10, 20, 30]);
            setMessage('Tốt! Bây giờ nó trở thành Right-Right. Hãy Xoay Trái tại gốc!');
        } else {
            setMessage('Lệnh xoay này không giúp ích lúc này!');
        }
    };

    const checkWin = (state: number[]) => {
        if (state[0] === 20) {
            setCompleted(true);
            setMessage('Tuyệt vời! Cây đã được cân bằng theo chuẩn AVL. 🎉');
            if (onComplete) onComplete(100);
        }
    };

    return (
        <div className="p-6 bg-slate-900 rounded-xl h-full flex flex-col items-center select-none">
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Thử thách: AVL Tree Rotation</h3>
            <p className="text-sm text-slate-400 mb-8 h-8 text-center">{message}</p>

            <div className="relative w-full h-[250px] flex justify-center">
                {treeState.length === 3 && (
                    <div className="relative w-64 h-full">
                        <motion.div layout className="absolute left-1/2 -translate-x-1/2 top-0 w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
                            {treeState[0]}
                        </motion.div>

                        <motion.div layout
                            className={`absolute w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center font-bold`}
                            style={{
                                left: treeState[0] === 20 ? '15%' : (treeState[1] > treeState[0] ? '85%' : '15%'),
                                top: '80px'
                            }}
                        >
                            {treeState[1]}
                        </motion.div>

                        <motion.div layout
                            className={`absolute w-12 h-12 rounded-full bg-emerald-900 flex items-center justify-center font-bold`}
                            style={{
                                left: treeState[0] === 20 ? '85%' : (treeState[2] > treeState[1] ? '100%' : '70%'),
                                top: treeState[0] === 20 ? '80px' : '160px'
                            }}
                        >
                            {treeState[2]}
                        </motion.div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 mt-8">
                <button
                    onClick={rotateLeft}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm flex items-center gap-2"
                >
                    <i className="fi fi-rr-rotate-left"></i> Left Rotate
                </button>
                <button
                    onClick={rotateRight}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm flex items-center gap-2"
                >
                    Right Rotate <i className="fi fi-rr-rotate-right"></i>
                </button>
            </div>

            <div className="mt-8 flex gap-2">
                {scenarios.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setCurrentScenarioIdx(i); }}
                        className={`w-8 h-8 rounded ${currentScenarioIdx === i ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};
