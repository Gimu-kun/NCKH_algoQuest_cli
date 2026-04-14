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

// Import Shared Registry
import { ALGO_REGISTRY as CHAPTERS } from '../data/algo_registry';

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
// HELPER: Random Graph Generation (Keep local as it's specific to Graph Viz setup)
// =============================================================================

/**
 * generateRandomGraph - Tạo một đồ thị ngẫu nhiên (tree-like structure) cho BFS/DFS.
 * 
 * @param numNodes - Số lượng đỉnh (5-7 recommended)
 * @returns Graph data với nodes, edges, và adjList
 */
function generateRandomGraph(numNodes: number) {
    interface GraphNode {
        id: number;
        x: number;
        y: number;
        label: string;
    }

    interface GraphEdge {
        source: number;
        target: number;
    }

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const adjList: Record<number, number[]> = {};

    // Generate node positions in a circular layout
    const centerX = 250;
    const centerY = 150;
    const radius = 100;

    for (let i = 0; i < numNodes; i++) {
        const angle = (i / numNodes) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        nodes.push({
            id: i,
            x: Math.round(x),
            y: Math.round(y),
            label: String(i),
        });

        adjList[i] = [];
    }

    // Generate edges: Create a tree-like structure (each node connects to 1-2 random children)
    // Start from node 0 as root
    const visited = new Set<number>([0]);
    const queue = [0];

    while (queue.length > 0 && visited.size < numNodes) {
        const parent = queue.shift()!;
        const maxChildren = 2; // Binary tree-ish
        const numChildren = Math.min(
            Math.floor(Math.random() * maxChildren) + 1,
            numNodes - visited.size
        );

        for (let i = 0; i < numChildren; i++) {
            // Find an unvisited node
            let child = -1;
            for (let j = 0; j < numNodes; j++) {
                if (!visited.has(j)) {
                    child = j;
                    break;
                }
            }

            if (child === -1) break;

            visited.add(child);
            queue.push(child);

            // Add edge (bidirectional for undirected graph)
            edges.push({ source: parent, target: child });
            adjList[parent].push(child);
            adjList[child].push(parent);
        }
    }

    // Add a few random cross-edges to make it more interesting (optional)
    if (numNodes > 4) {
        const numCrossEdges = Math.min(2, Math.floor(numNodes / 3));
        for (let i = 0; i < numCrossEdges; i++) {
            const a = Math.floor(Math.random() * numNodes);
            const b = Math.floor(Math.random() * numNodes);
            if (a !== b && !adjList[a].includes(b)) {
                edges.push({ source: a, target: b });
                adjList[a].push(b);
                adjList[b].push(a);
            }
        }
    }

    return { nodes, edges, adjList };
}

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
    const [vizGraphData, setVizGraphData] = useState<any>(null);

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

        // Graph Case - Generate random graph
        if (activeAlgo.inputType === 'active_node') {
            const numNodes = 5 + Math.floor(Math.random() * 3); // 5-7 nodes
            const generatedGraph = generateRandomGraph(numNodes);
            setVizGraphData(generatedGraph);
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
                        graphData={vizGraphData}
                        onRegenerate={handleRegenerate}
                    />
                );

            case 'dp':
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
