
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DoublyLinkedListGameProps {
    onComplete?: (score: number) => void;
}

interface Song {
    id: string;
    title: string;
    artist: string;
}

export const DoublyLinkedListGame: React.FC<DoublyLinkedListGameProps> = ({ onComplete }) => {
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [targetSongId, setTargetSongId] = useState('');
    const [message, setMessage] = useState('Dùng nút Previous và Next để tìm bài hát yêu cầu!');
    const [completed, setCompleted] = useState(false);

    const initGame = useCallback(() => {
        const songs: Song[] = [
            { id: '1', title: 'Algorithm Blues', artist: 'The Recursive Beats' },
            { id: '2', title: 'Binary Soul', artist: 'Binary Stars' },
            { id: '3', title: 'Hash Map Heart', artist: 'Data Drifters' },
            { id: '4', title: 'Stack Overflow', artist: 'The Debuggers' },
            { id: '5', title: 'Queue for Love', artist: 'FIFO Friends' }
        ];
        setPlaylist(songs);
        setCurrentIndex(0);
        const randomTarget = songs[Math.floor(Math.random() * (songs.length - 1)) + 1];
        setTargetSongId(randomTarget.id);
        setCompleted(false);
        setMessage(`Mục tiêu: Tìm bài hát "${randomTarget.title}"`);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const goNext = () => {
        if (completed || currentIndex >= playlist.length - 1) return;
        setCurrentIndex(prev => prev + 1);
    };

    const goPrev = () => {
        if (completed || currentIndex <= 0) return;
        setCurrentIndex(prev => prev - 1);
    };

    useEffect(() => {
        if (playlist.length > 0 && playlist[currentIndex].id === targetSongId) {
            setCompleted(true);
            setMessage(`Chính xác! Bạn đã tìm thấy bài hát. Danh sách liên kết đôi cho phép quay lại (Prev) dễ dàng. 🎉`);
            if (onComplete) onComplete(100);
        }
    }, [currentIndex, targetSongId, playlist, onComplete]);

    return (
        <div className="p-8 bg-black/40 rounded-2xl border border-white/10 h-full flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold mb-2 text-cyan-400">Trình phát nhạc (DLL Simulator)</h3>
            <p className="text-gray-400 mb-8 text-center px-4">{message}</p>

            <div className="relative w-full max-w-sm aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/5 p-8 flex flex-col items-center justify-between">
                <div className="w-full aspect-square bg-black/20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl text-cyan-500"
                    >
                        <i className="fi fi-rr-music"></i>
                    </motion.div>
                </div>

                <div className="text-center w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-1"
                        >
                            <h4 className="text-xl font-bold text-white truncate">{playlist[currentIndex]?.title}</h4>
                            <p className="text-sm text-gray-500 uppercase tracking-widest">{playlist[currentIndex]?.artist}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="w-full mt-8 flex items-center justify-between">
                    <button
                        onClick={goPrev}
                        disabled={currentIndex === 0 || completed}
                        className={`p-4 rounded-full transition-all ${currentIndex === 0 ? 'opacity-20' : 'hover:bg-white/10 text-cyan-400 active:scale-95'}`}
                    >
                        <i className="fi fi-rr-rewind"></i>
                    </button>

                    <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-black">
                        <i className="fi fi-rr-play"></i>
                    </div>

                    <button
                        onClick={goNext}
                        disabled={currentIndex === playlist.length - 1 || completed}
                        className={`p-4 rounded-full transition-all ${currentIndex === playlist.length - 1 ? 'opacity-20' : 'hover:bg-white/10 text-cyan-400 active:scale-95'}`}
                    >
                        <i className="fi fi-rr-forward"></i>
                    </button>
                </div>

                <div className="mt-4 flex gap-1">
                    {playlist.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-4 bg-cyan-500' : 'w-1 bg-gray-700'}`} />
                    ))}
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-600 flex items-center gap-4">
                <span><i className="fi fi-rr-arrow-small-left"></i> prev = node.prev</span>
                <span>curr = node</span>
                <span>next = node.next <i className="fi fi-rr-arrow-small-right"></i></span>
            </div>

            <button onClick={initGame} className="mt-8 text-xs underline opacity-40 hover:opacity-100">Reset Case</button>
        </div>
    );
};
