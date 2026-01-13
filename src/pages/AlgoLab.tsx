/**
 * =============================================================================
 * FILE: AlgoLab.tsx
 * =============================================================================
 *
 * PHÒNG THÍ NGHIỆM THUẬT TOÁN - REDESIGNED
 *
 * Giao diện mới:
 * - Sidebar: Danh sách thuật toán theo chương
 * - Input Panel: Ô nhập dữ liệu đầu vào (JSON hoặc array)
 * - Visualization Panel: Minh họa thuật toán bằng animation
 *
 * Sử dụng Flaticon UIcons thay vì emoji.
 *
 * =============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore, GameScene } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import './AlgoLab.css';

// Import Algorithms
import { binarySearch } from '../algo_demos/Chapter_2_Search_Sort/BinarySearch';
import { linearSearch } from '../algo_demos/Chapter_2_Search_Sort/LinearSearch';
import { bubbleSort } from '../algo_demos/Chapter_2_Search_Sort/BubbleSort';
import { quickSort } from '../algo_demos/Chapter_2_Search_Sort/QuickSort';
import { mergeSort } from '../algo_demos/Chapter_2_Search_Sort/MergeSort';
import { selectionSort } from '../algo_demos/Chapter_2_Search_Sort/SelectionSort';
import { insertionSort } from '../algo_demos/Chapter_2_Search_Sort/InsertionSort';
import { heapSort } from '../algo_demos/Chapter_2_Search_Sort/HeapSort';

// Import Visualization Components
import SortingVisualizer from '../components/visualizations/sorting/SortingVisualizer';
import BinarySearchVisualizer from '../components/visualizations/searching/BinarySearchVisualizer';
import LinearSearchVisualizer from '../components/visualizations/searching/LinearSearchVisualizer';
import StackVisualizer from '../components/visualizations/data-structures/StackVisualizer';
import QueueVisualizer from '../components/visualizations/data-structures/QueueVisualizer';
import LinkedListVisualizer from '../components/visualizations/data-structures/LinkedListVisualizer';
import BSTVisualizer from '../components/visualizations/data-structures/BSTVisualizer';
import GraphVisualizer from '../components/visualizations/graph/GraphVisualizer';
import DPVisualizer from '../components/visualizations/dp/DPVisualizer';
import ComplexityVisualizer from '../components/visualizations/complexity/ComplexityVisualizer';

// =============================================================================
// TYPES
// =============================================================================

type VisualizationType =
    | 'sorting'
    | 'binarySearch'
    | 'linearSearch'
    | 'stack'
    | 'queue'
    | 'linkedList'
    | 'bst'
    | 'graph'
    | 'graph'
    | 'dp'
    | 'complexity';

type SortingAlgorithmType = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';
export type GraphAlgorithmType = 'bfs' | 'dfs';
export type DPAlgorithmType = 'fibonacci' | 'knapsack';

interface AlgoMetadata {
    id: string;
    name: string;
    description: string;
    icon: string; // Flaticon class
    inputType: 'array' | 'array_target' | 'active_node' | 'number' | 'interactive' | 'none';
    defaultArray?: number[];
    defaultTarget?: number;
    visualization: VisualizationType;
    sortingType?: SortingAlgorithmType;
    graphType?: GraphAlgorithmType;
    dpType?: DPAlgorithmType;
    timeComplexity: string;
    spaceComplexity: string;
    execute?: (arr: number[], target?: number) => any;
}

interface Chapter {
    id: string;
    title: string;
    icon: string;
    algos: AlgoMetadata[];
}

// =============================================================================
// CHAPTERS REGISTRY
// =============================================================================

const CHAPTERS: Chapter[] = [
    {
        id: 'overview',
        title: 'Chương 1: Tổng Quan',
        icon: 'fi fi-rr-info',
        algos: [
            {
                id: 'complexity',
                name: 'Độ Phức Tạp (Big O)',
                description: 'Hiểu về Time & Space Complexity',
                icon: 'fi fi-rr-chart-histogram',
                inputType: 'none',
                defaultArray: [],
                visualization: 'complexity',
                timeComplexity: 'N/A',
                spaceComplexity: 'N/A',
                execute: () => { },
            },
        ],
    },
    {
        id: 'search',
        title: 'Tìm Kiếm',
        icon: 'fi fi-rr-search',
        algos: [
            {
                id: 'linearSearch',
                name: 'Tìm Kiếm Tuyến Tính',
                description: 'Duyệt từ đầu đến cuối mảng',
                icon: 'fi fi-rr-arrow-right',
                inputType: 'array_target',
                defaultArray: [10, 50, 30, 70, 80, 20, 40],
                defaultTarget: 30,
                visualization: 'linearSearch',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                execute: (arr, target) => linearSearch(arr, target!),
            },
            {
                id: 'binarySearch',
                name: 'Tìm Kiếm Nhị Phân',
                description: 'Chia đôi để tìm (mảng đã sắp xếp)',
                icon: 'fi fi-rr-divide',
                inputType: 'array_target',
                defaultArray: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
                defaultTarget: 7,
                visualization: 'binarySearch',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(1)',
                execute: (arr, target) => binarySearch(arr, target!),
            },
        ],
    },
    {
        id: 'sort',
        title: 'Sắp Xếp',
        icon: 'fi fi-rr-sort',
        algos: [
            {
                id: 'bubbleSort',
                name: 'Bubble Sort',
                description: 'Hoán đổi phần tử liền kề',
                icon: 'fi fi-rr-chart-bubble',
                inputType: 'array',
                defaultArray: [64, 34, 25, 12, 22, 11, 90],
                visualization: 'sorting',
                sortingType: 'bubble',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => bubbleSort([...arr]),
            },
            {
                id: 'selectionSort',
                name: 'Selection Sort',
                description: 'Chọn phần tử nhỏ nhất',
                icon: 'fi fi-rr-cursor-finger',
                inputType: 'array',
                defaultArray: [64, 25, 12, 22, 11],
                visualization: 'sorting',
                sortingType: 'selection',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => selectionSort([...arr]),
            },
            {
                id: 'insertionSort',
                name: 'Insertion Sort',
                description: 'Chèn vào vị trí đúng',
                icon: 'fi fi-rr-add',
                inputType: 'array',
                defaultArray: [12, 11, 13, 5, 6],
                visualization: 'sorting',
                sortingType: 'insertion',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                execute: (arr) => insertionSort([...arr]),
            },
            {
                id: 'mergeSort',
                name: 'Merge Sort',
                description: 'Chia để trị, trộn lại',
                icon: 'fi fi-rr-layer-plus',
                inputType: 'array',
                defaultArray: [38, 27, 43, 3, 9, 82, 10],
                visualization: 'sorting',
                sortingType: 'merge',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                execute: (arr) => mergeSort([...arr]),
            },
            {
                id: 'quickSort',
                name: 'Quick Sort',
                description: 'Pivot và phân hoạch',
                icon: 'fi fi-rr-bolt',
                inputType: 'array',
                defaultArray: [10, 7, 8, 9, 1, 5],
                visualization: 'sorting',
                sortingType: 'quick',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(log n)',
                execute: (arr) => quickSort([...arr]),
            },
            {
                id: 'heapSort',
                name: 'Heap Sort',
                description: 'Sắp xếp dùng Max-Heap',
                icon: 'fi fi-rr-hierarchy-alt',
                inputType: 'array',
                defaultArray: [64, 25, 12, 22, 11, 90, 42],
                visualization: 'sorting',
                sortingType: 'heap',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(1)',
                execute: (arr) => heapSort([...arr]),
            },
        ],
    },
    {
        id: 'dataStructures',
        title: 'Cấu Trúc Dữ Liệu',
        icon: 'fi fi-rr-cube',
        algos: [
            {
                id: 'stack',
                name: 'Stack (Ngăn Xếp)',
                description: 'LIFO - Vào sau ra trước',
                icon: 'fi fi-rr-layers',
                inputType: 'array',
                defaultArray: [10, 20, 30],
                visualization: 'stack',
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'queue',
                name: 'Queue (Hàng Đợi)',
                description: 'FIFO - Vào trước ra trước',
                icon: 'fi fi-rr-arrow-alt-right',
                inputType: 'array',
                defaultArray: [1, 2, 3],
                visualization: 'queue',
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'linkedList',
                name: 'Linked List',
                description: 'Danh sách liên kết đơn',
                icon: 'fi fi-rr-link-alt',
                inputType: 'array',
                defaultArray: [5, 10, 15, 20],
                visualization: 'linkedList',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
            },
            {
                id: 'bst',
                name: 'Binary Search Tree',
                description: 'Cây nhị phân tìm kiếm',
                icon: 'fi fi-rr-network',
                inputType: 'array',
                defaultArray: [50, 30, 70, 20, 40, 60, 80],
                visualization: 'bst',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(n)',
            },
        ],
    },
    {
        id: 'graph',
        title: 'Đồ Thị',
        icon: 'fi fi-rr-vector',
        algos: [
            {
                id: 'bfs',
                name: 'Breadth First Search (BFS)',
                description: 'Duyệt theo chiều rộng',
                icon: 'fi fi-rr-chart-network',
                inputType: 'active_node',
                visualization: 'graph',
                graphType: 'bfs',
                timeComplexity: 'O(V + E)',
                spaceComplexity: 'O(V)',
            },
            {
                id: 'dfs',
                name: 'Depth First Search (DFS)',
                description: 'Duyệt theo chiều sâu',
                icon: 'fi fi-rr-diagram-project',
                inputType: 'active_node',
                visualization: 'graph',
                graphType: 'dfs',
                timeComplexity: 'O(V + E)',
                spaceComplexity: 'O(V)',
            },
        ],
    },
    {
        id: 'dp',
        title: 'Quy Hoạch Động',
        icon: 'fi fi-rr-chart-histogram',
        algos: [
            {
                id: 'fibonacci',
                name: 'Fibonacci Sequence',
                description: 'Tính số Fibonacci thứ n',
                icon: 'fi fi-rr-calculator',
                inputType: 'number',
                visualization: 'dp',
                dpType: 'fibonacci',
                defaultTarget: 5,
                timeComplexity: 'O(n) / O(2^n)',
                spaceComplexity: 'O(n)',
            },
        ],
    },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AlgoLab: React.FC = () => {
    const { setScene } = useGameStore();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [selectedChapterId, setSelectedChapterId] = useState<string>(CHAPTERS[0].id);
    const [selectedAlgoId, setSelectedAlgoId] = useState<string>(CHAPTERS[0].algos[0].id);

    // Input state
    const [arrayInput, setArrayInput] = useState<string>('');
    const [targetInput, setTargetInput] = useState<string>('');

    // Visualization data
    const [vizArray, setVizArray] = useState<number[]>([]);
    const [vizTarget, setVizTarget] = useState<number>(0);

    // Key để force re-render visualization
    const [vizKey, setVizKey] = useState<number>(0);

    // -------------------------------------------------------------------------
    // DERIVED STATE
    // -------------------------------------------------------------------------

    const activeChapter = CHAPTERS.find((c) => c.id === selectedChapterId);
    const activeAlgo = activeChapter?.algos.find((a) => a.id === selectedAlgoId);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    // Initialize input khi chọn algo mới
    useEffect(() => {
        if (activeAlgo) {
            setArrayInput(JSON.stringify(activeAlgo.defaultArray));
            setTargetInput(activeAlgo.defaultTarget?.toString() || '');
            setVizArray(activeAlgo.defaultArray || []);
            setVizTarget(activeAlgo.defaultTarget || 0);
            setVizKey((prev) => prev + 1);
        }
    }, [activeAlgo]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSelectAlgo = useCallback((chapterId: string, algoId: string) => {
        setSelectedChapterId(chapterId);
        setSelectedAlgoId(algoId);
    }, []);

    const handleApplyInput = useCallback(() => {
        try {
            const parsed = JSON.parse(arrayInput);
            if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')) {
                setVizArray(parsed);
                const target = parseInt(targetInput, 10);
                if (!isNaN(target)) {
                    setVizTarget(target);
                }
                setVizKey((prev) => prev + 1);
            }
        } catch (e) {
            // Invalid JSON - giữ nguyên
        }
    }, [arrayInput, targetInput]);

    const handleRegenerate = useCallback(() => {
        if (!activeAlgo) return;

        let newArray: number[] = [];
        let newTarget: number | undefined = undefined;

        // DP Case
        if (activeAlgo.inputType === 'number') {
            const newN = Math.floor(Math.random() * 14) + 2; // 2 to 15
            setVizTarget(newN);
            setVizKey((prev) => prev + 1);
            return;
        }

        // Complexity Case
        if (activeAlgo.visualization === 'complexity') {
            // No random data needed
            return;
        }

        // Graph Case
        if (activeAlgo.inputType === 'active_node') {
            setVizKey((prev) => prev + 1);
            return;
        }

        // Array / Array Target
        const isSort = activeAlgo.visualization === 'sorting';
        const length = isSort ? 7 : 10;

        newArray = Array.from({ length }, () => Math.floor(Math.random() * 50) + 1);

        if (activeAlgo.id === 'binarySearch' || activeAlgo.id === 'bst') {
            newArray.sort((a, b) => a - b);
            if (activeAlgo.id === 'bst') {
                newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
            }
        }

        if (activeAlgo.inputType === 'array_target') {
            const exists = Math.random() > 0.4;
            if (exists) {
                newTarget = newArray[Math.floor(Math.random() * newArray.length)];
            } else {
                newTarget = Math.floor(Math.random() * 50) + 1;
            }
        }

        // Sync inputs so user sees the change!
        setVizArray(newArray);
        setArrayInput(JSON.stringify(newArray));

        if (newTarget !== undefined) {
            setVizTarget(newTarget);
            setTargetInput(newTarget.toString());
        }

        setVizKey((prev) => prev + 1);
    }, [activeAlgo]);

    const handleReset = useCallback(() => {
        // User request: Reset button should generate random input
        handleRegenerate();
    }, [handleRegenerate]);



    // -------------------------------------------------------------------------
    // RENDER VISUALIZATION
    // -------------------------------------------------------------------------

    const renderVisualization = () => {
        if (!activeAlgo) return null;

        const key = `${activeAlgo.id}-${vizKey}`;

        switch (activeAlgo.visualization) {
            case 'sorting':
                return (
                    <SortingVisualizer
                        key={key}
                        initialArray={vizArray}
                        algorithm={activeAlgo.sortingType || 'bubble'}
                        autoStart={false}
                        onRegenerate={handleRegenerate}
                    />
                );

            case 'binarySearch':
                return (
                    <BinarySearchVisualizer
                        key={key}
                        array={vizArray}
                        target={vizTarget}
                        autoStart={false}
                        onRegenerate={handleRegenerate}
                    />
                );

            case 'linearSearch':
                return (
                    <LinearSearchVisualizer
                        key={key}
                        array={vizArray}
                        target={vizTarget}
                        autoStart={false}
                        onRegenerate={handleRegenerate}
                    />
                );

            case 'stack':
                return <StackVisualizer key={key} initialItems={vizArray} maxSize={10} onRegenerate={handleRegenerate} />;

            case 'queue':
                return <QueueVisualizer key={key} initialItems={vizArray} maxSize={10} onRegenerate={handleRegenerate} />;

            case 'linkedList':
                return <LinkedListVisualizer key={key} initialItems={vizArray} maxSize={10} onRegenerate={handleRegenerate} />;

            case 'bst':
                return <BSTVisualizer key={key} initialValues={vizArray} onRegenerate={handleRegenerate} />;

            case 'graph':
                return (
                    <GraphVisualizer
                        key={key}
                        algorithm={activeAlgo.graphType || 'bfs'}
                        onRegenerate={handleRegenerate}
                    />
                );

                return (
                    <DPVisualizer
                        key={key}
                        algorithm={activeAlgo!.dpType || 'fibonacci'}
                        target={vizTarget}
                        onRegenerate={handleRegenerate}
                    />
                );

            case 'complexity':
                return (
                    <ComplexityVisualizer
                        key={key}
                    />
                );

            default:
                return null;
        }
    };

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------

    return (
        <div className="algo-lab-container w-full h-screen flex">
            {/* ============================================= */}
            {/* SIDEBAR */}
            {/* ============================================= */}
            <div className="lab-sidebar w-72 flex flex-col">
                {/* Header */}
                <div className="lab-sidebar-header p-5">
                    <h1 className="text-xl font-bold text-white flex items-center gap-3">
                        <i className="fi fi-rr-flask text-lg"></i>
                        Phòng Thí Nghiệm
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Trực quan hóa thuật toán
                    </p>
                </div>

                {/* Algorithm List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {CHAPTERS.map((chapter) => (
                        <div key={chapter.id}>
                            <h3 className="chapter-title text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                <span className="chapter-dot"></span>
                                <i className={chapter.icon}></i>
                                {chapter.title}
                            </h3>
                            <div className="space-y-1">
                                {chapter.algos.map((algo) => (
                                    <button
                                        key={algo.id}
                                        onClick={() => handleSelectAlgo(chapter.id, algo.id)}
                                        className={`algo-tab w-full text-left px-3 py-2.5 ${selectedAlgoId === algo.id ? 'active' : ''
                                            }`}
                                    >
                                        <div className="algo-tab-name">
                                            <i className={algo.icon}></i>
                                            {algo.name}
                                        </div>
                                        <div className="algo-tab-desc">{algo.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disconnect Button */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => setScene(GameScene.MAIN_MENU)}
                        className="lab-disconnect-btn w-full"
                    >
                        <i className="fi fi-rr-sign-out-alt"></i>
                        Thoát
                    </button>
                </div>
            </div>

            {/* ============================================= */}
            {/* MAIN CONTENT */}
            {/* ============================================= */}
            <div className="lab-main-content">
                {activeAlgo && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeAlgo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col min-h-0 gap-5"
                        >
                            {/* Header */}
                            <div className="lab-header">
                                <div>
                                    <h2 className="lab-algo-title">
                                        <i className={activeAlgo.icon}></i>
                                        {activeAlgo.name}
                                        <span className="lab-algo-type-badge">
                                            {activeAlgo.inputType === 'interactive'
                                                ? 'Tương tác'
                                                : 'Thuật toán'}
                                        </span>
                                    </h2>
                                    <p className="lab-algo-desc">{activeAlgo.description}</p>
                                </div>

                                {/* Complexity Badges */}
                                <div className="flex gap-3">
                                    <div className="complexity-badge time">
                                        <i className="fi fi-rr-clock"></i>
                                        {activeAlgo.timeComplexity}
                                    </div>
                                    <div className="complexity-badge space">
                                        <i className="fi fi-rr-database"></i>
                                        {activeAlgo.spaceComplexity}
                                    </div>
                                </div>
                            </div>

                            {/* Workspace */}
                            <div className="lab-workspace flex-1 min-h-0">
                                {/* Input Panel */}
                                <div className="lab-input-panel">
                                    <div className="lab-panel flex-1">
                                        <div className="lab-panel-header input">
                                            <i className="fi fi-rr-terminal"></i>
                                            Dữ Liệu Đầu Vào
                                        </div>
                                        <div className="lab-panel-body">
                                            {activeAlgo.inputType === 'interactive' ? (
                                                <div className="lab-no-input">
                                                    <i className="fi fi-rr-hand-pointer"></i>
                                                    <span>
                                                        Sử dụng các nút điều khiển
                                                        <br />
                                                        trong visualization
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Target input - hiển thị trước cho search algorithms */}
                                                    {activeAlgo.inputType === 'array_target' && (
                                                        <div className="lab-target-input-top">
                                                            <label>
                                                                <i className="fi fi-rr-bullseye"></i>
                                                                Giá Trị Cần Tìm (Target)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={targetInput}
                                                                onChange={(e) =>
                                                                    setTargetInput(e.target.value)
                                                                }
                                                                placeholder="Nhập giá trị target..."
                                                            />
                                                        </div>
                                                    )}

                                                    <textarea
                                                        value={arrayInput}
                                                        onChange={(e) => setArrayInput(e.target.value)}
                                                        placeholder="[1, 2, 3, 4, 5]"
                                                        className="lab-input-textarea"
                                                        spellCheck={false}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {activeAlgo.inputType !== 'interactive' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleApplyInput}
                                                className="lab-run-btn flex-1"
                                            >
                                                <i className="fi fi-rr-play"></i>
                                                Áp Dụng
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="lab-reset-btn"
                                            >
                                                <i className="fi fi-rr-refresh"></i>
                                                Reset
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Visualization Panel */}
                                <div className="lab-viz-panel lab-panel">
                                    <div className="lab-panel-header viz">
                                        <i className="fi fi-rr-chart-tree"></i>
                                        Minh Họa Thuật Toán
                                    </div>
                                    <div className="lab-viz-content">{renderVisualization()}</div>
                                    <div className="lab-info-bar">
                                        <div className="lab-info-item">
                                            <i className="fi fi-rr-list"></i>
                                            <span>Số phần tử:</span>
                                            <span className="value">{vizArray.length}</span>
                                        </div>
                                        {activeAlgo.inputType === 'array_target' && (
                                            <div className="lab-info-item">
                                                <i className="fi fi-rr-bullseye"></i>
                                                <span>Target:</span>
                                                <span className="value">{vizTarget}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};
