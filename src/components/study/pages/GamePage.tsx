import React, { useState, useCallback } from 'react';
import { HanoiGame } from '../../games/hanoi/HanoiGame';
import { SortingGame } from '../../games/sorting/SortingGame';
import { BinarySearchGame } from '../../games/search/BinarySearchGame';
import { LinearSearchGame } from '../../games/search/LinearSearchGame';
import { PathfindingGame } from '../../games/grid/PathfindingGame';
import { BSTSearchGame } from '../../games/tree/BSTSearchGame';
import { LinkedListGame } from '../../games/list/LinkedListGame';
import { DoublyLinkedListGame } from '../../games/list/DoublyLinkedListGame';
import { CircularLinkedListGame } from '../../games/list/CircularLinkedListGame';
import { MergeSortGame } from '../../games/sorting/MergeSortGame';
import { QuickSortGame } from '../../games/sorting/QuickSortGame';
import { HeapSortGame } from '../../games/sorting/HeapSortGame';
import { CountingSortGame } from '../../games/sorting/CountingSortGame';
import { StackGame } from '../../games/queue/StackGame';
import { QueueGame } from '../../games/queue/QueueGame';
import { DequeGame } from '../../games/queue/DequeGame';
import { PriorityQueueGame } from '../../games/queue/PriorityQueueGame';
import { AVLTreeGame } from '../../games/tree/AVLTreeGame';
import { MazeGame } from '../../games/grid/MazeGame';
import { FloodFillGame } from '../../games/grid/FloodFillGame';
import { IslandGame } from '../../games/grid/IslandGame';

interface GamePageProps {
    gameType?: string;
    onComplete: (score: number) => void;
    moduleId: string;
    pageId: string;
    title: string;
}

const GamePage: React.FC<GamePageProps> = ({ gameType, onComplete, title }) => {
    const [completed, setCompleted] = useState(false);

    const handleGameDone = useCallback((_result: any) => {
        if (!completed) {
            setCompleted(true);
            onComplete(100); // Max score for passing
        }
    }, [completed, onComplete]);

    const renderGameContent = () => {
        switch (gameType) {
            case 'HANOI':
                return (
                    <div className="w-full h-[550px]">
                        <HanoiGame
                            disks={4} // Increased difficulty for game mode
                            startedAt={Date.now()}
                            onProgress={(p) => {
                                if (p.completed) handleGameDone(p);
                            }}
                        />
                    </div>
                );
            case 'BST_SEARCH':
                return (
                    <div className="w-full h-[600px]">
                        <BSTSearchGame
                            startedAt={Date.now()}
                            onComplete={() => onComplete(100)} // Pass with 100 score
                        />
                    </div>
                );
            case 'SORTING':
                return (
                    <div className="w-full h-full flex justify-center">
                        <SortingGame
                            startedAt={Date.now()}
                            onComplete={handleGameDone}
                        />
                    </div>
                );
            case 'BINARY_SEARCH':
                return (
                    <div className="w-full h-full flex justify-center">
                        <BinarySearchGame
                            min={1}
                            max={50}
                            startedAt={Date.now()}
                            onComplete={handleGameDone}
                        />
                    </div>
                );
            case 'LINEAR_SEARCH':
                return (
                    <div className="w-full h-[550px]">
                        <LinearSearchGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'PATHFINDING':
                return (
                    <div className="w-full h-full flex justify-center">
                        <PathfindingGame
                            rows={10}
                            cols={10}
                            startedAt={Date.now()}
                            onProgress={(p) => {
                                if (p.completed) handleGameDone(p);
                            }}
                        />
                    </div>
                );
            case 'LINKED_LIST':
                return (
                    <div className="w-full h-[600px]">
                        <LinkedListGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'DOUBLY_LINKED_LIST':
                return (
                    <div className="w-full h-[600px]">
                        <DoublyLinkedListGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'CIRCULAR_LINKED_LIST':
                return (
                    <div className="w-full h-[600px]">
                        <CircularLinkedListGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'MERGE_SORT':
                return (
                    <div className="w-full h-[600px]">
                        <MergeSortGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'QUICK_SORT':
                return (
                    <div className="w-full h-[600px]">
                        <QuickSortGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'HEAP_SORT':
                return (
                    <div className="w-full h-[600px]">
                        <HeapSortGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'COUNTING_SORT':
                return (
                    <div className="w-full h-[600px]">
                        <CountingSortGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'PRIORITY_QUEUE':
                return (
                    <div className="w-full h-[600px]">
                        <PriorityQueueGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'STACK':
                return (
                    <div className="w-full h-[600px]">
                        <StackGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'QUEUE':
                return (
                    <div className="w-full h-[600px]">
                        <QueueGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'DEQUE':
                return (
                    <div className="w-full h-[600px]">
                        <DequeGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'AVL_TREE':
                return (
                    <div className="w-full h-[600px]">
                        <AVLTreeGame
                            onComplete={(score) => onComplete(score)}
                        />
                    </div>
                );
            case 'MAZE':
                return (
                    <div className="w-full h-[600px]">
                        <MazeGame
                            onComplete={() => onComplete(100)}
                        />
                    </div>
                );
            case 'FLOOD_FILL':
                return (
                    <div className="w-full h-[600px]">
                        <FloodFillGame
                            onComplete={() => onComplete(100)}
                        />
                    </div>
                );
            case 'ISLAND':
                return (
                    <div className="w-full h-[600px]">
                        <IslandGame
                            onComplete={() => onComplete(100)}
                        />
                    </div>
                );
            default:
                return (
                    <div className="text-center p-10 text-gray-400">
                        <i className="fi fi-rr-exclamation-triangle text-4xl mb-3 block"></i>
                        Game type "{gameType}" chưa được hỗ trợ.
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900/50 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-gray-900/40">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 flex items-center gap-3">
                        <i className="fi fi-rr-joystick text-pink-500"></i>
                        {title}
                    </h2>
                    <p className="text-gray-400 mt-1 text-sm">
                        Hoàn thành trò chơi để mở khóa bài học tiếp theo!
                    </p>
                </div>

                {completed && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 animate-pulse">
                        <i className="fi fi-rr-check-circle-fill"></i>
                        <span className="font-medium">Đã Hoàn Thành</span>
                    </div>
                )}
            </div>

            <div className="flex-1 p-6 relative overflow-y-auto custom-scrollbar">
                {renderGameContent()}
            </div>
        </div>
    );
};

export default GamePage;
