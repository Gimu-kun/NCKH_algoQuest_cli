/**
 * =============================================================================
 * FILE: GraphVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa các thuật toán đồ thị (Graph Algorithms).
 * - Hỗ trợ: BFS (Breadth-First Search) và DFS (Depth-First Search).
 * - Hiển thị các bước duyệt, hàng đợi/ngăn xếp, và trạng thái các đỉnh.
 *
 * =============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimationControls from '../shared/AnimationControls';
import '../shared/VisualizationStyles.css';

// =============================================================================
// TYPES
// =============================================================================

export type GraphAlgorithmType = 'bfs' | 'dfs';

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

interface GraphStep {
    visited: number[];       // Các đỉnh đã duyệt xong
    activeNode: number | null; // Đỉnh đang xét
    queueOrStack: number[];  // Trạng thái Queue (BFS) hoặc Stack (DFS)
    description: string;
    codeSnippet?: string;
}

interface GraphVisualizerProps {
    algorithm: GraphAlgorithmType;
    graphData?: {
        nodes: GraphNode[];
        edges: GraphEdge[];
        adjList: Record<number, number[]>;
    };
    autoStart?: boolean;
    onRegenerate?: () => void;
}

// =============================================================================
// STATIC GRAPH DATA (Sample)
// =============================================================================

const NODES: GraphNode[] = [
    { id: 0, x: 250, y: 50, label: '0' },  // Root
    { id: 1, x: 150, y: 150, label: '1' },
    { id: 2, x: 350, y: 150, label: '2' },
    { id: 3, x: 100, y: 250, label: '3' },
    { id: 4, x: 200, y: 250, label: '4' },
    { id: 5, x: 300, y: 250, label: '5' },
    { id: 6, x: 400, y: 250, label: '6' },
];

const EDGES: GraphEdge[] = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 2, target: 5 },
    { source: 2, target: 6 },
    { source: 4, target: 5 }, // Cross edge to make it interesting
];

const ADJ_LIST: Record<number, number[]> = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5, 6],
    3: [1],
    4: [1, 5],
    5: [2, 4],
    6: [2],
};

// =============================================================================
// ALGORITHMS
// =============================================================================

function generateBFSSteps(startNode: number, adjList: Record<number, number[]>): GraphStep[] {
    const steps: GraphStep[] = [];
    const visited: number[] = [];
    const queue: number[] = [startNode];
    const visitedSet = new Set<number>(); // Check exist

    visitedSet.add(startNode);

    steps.push({
        visited: [],
        activeNode: null,
        queueOrStack: [...queue],
        description: `Bắt đầu BFS từ đỉnh ${startNode}. Đưa ${startNode} vào Queue.`,
        codeSnippet: `// BFS - BREADTH FIRST SEARCH - O(V+E)
// Sử dụng Queue (FIFO) để duyệt theo từng lớp (level-by-level).

Queue q = new Queue();
q.enqueue(${startNode});
visited[${startNode}] = true;`,
    });

    while (queue.length > 0) {
        const u = queue[0]; // Peek

        steps.push({
            visited: [...visited],
            activeNode: u,
            queueOrStack: [...queue],
            description: `Lấy đỉnh ${u} ra khỏi đầu Queue để xét.`,
            codeSnippet: `// Lấy phần tử đầu Queue
int u = q.dequeue();  // u = ${u}
// Xét các đỉnh kề của u...`,
        });

        queue.shift(); // Dequeue
        visited.push(u);

        const neighbors = adjList[u] || [];
        for (const v of neighbors) {
            if (!visitedSet.has(v)) {
                visitedSet.add(v);
                queue.push(v);

                steps.push({
                    visited: [...visited],
                    activeNode: u,
                    queueOrStack: [...queue],
                    description: `Đỉnh kề ${v} chưa duyệt -> Thêm vào Queue.`,
                    codeSnippet: `// Duyệt đỉnh kề v = ${v}
if (!visited[${v}]) {
    visited[${v}] = true;
    q.enqueue(${v});
}`,
                });
            }
        }
    }

    steps.push({
        visited: [...visited],
        activeNode: null,
        queueOrStack: [],
        description: 'Queue rỗng. Hoàn thành BFS!',
        codeSnippet: `// Queue rỗng -> Kết thúc thuật toán
// Thứ tự duyệt: ${visited.join(' -> ')}

// ƯU ĐIỂM BFS:
// - Tìm đường đi ngắn nhất (trong đồ thị không trọng số).
// - Duyệt theo level thích hợp cho peer-to-peer, social networks.
//
// ĐỘ PHỨC TẠP:
// - Time: O(V + E)
// - Space: O(V) cho Queue`,
    });

    return steps;
}

function generateDFSSteps(startNode: number, adjList: Record<number, number[]>): GraphStep[] {
    const steps: GraphStep[] = [];
    const visited: number[] = [];
    const stack: number[] = [startNode]; // Simulate recursion stack
    const visitedSet = new Set<number>();

    steps.push({
        visited: [],
        activeNode: null,
        queueOrStack: [...stack],
        description: `Bắt đầu DFS từ đỉnh ${startNode}. Đưa ${startNode} vào Stack.`,
        codeSnippet: `// DFS - DEPTH FIRST SEARCH - O(V+E)
// Sử dụng Stack (LIFO) hoặc Đệ quy (Recursion Stack)
// để duyệt sâu hết mức có thể.

Stack s = new Stack();
s.push(${startNode});`,
    });

    while (stack.length > 0) {
        const u = stack.pop()!;

        if (!visitedSet.has(u)) {
            visitedSet.add(u);
            visited.push(u);

            steps.push({
                visited: [...visited],
                activeNode: u,
                queueOrStack: [...stack], // Snapshot after pop
                description: `Pop đỉnh ${u} từ Stack và đánh dấu đã duyệt.`,
                codeSnippet: `// Pop phần tử từ Stack
int u = s.pop();  // u = ${u}
if (!visited[u]) {
    visited[u] = true;
    // Xét các đỉnh kề...
}`,
            });

            const neighbors = adjList[u] || [];
            // Reverse neighbors to simulate correct stack order (left to right)
            // or normal order depending on implementation.
            for (let i = neighbors.length - 1; i >= 0; i--) {
                const v = neighbors[i];
                if (!visitedSet.has(v)) {
                    stack.push(v);
                    steps.push({
                        visited: [...visited],
                        activeNode: u,
                        queueOrStack: [...stack],
                        description: `Đẩy đỉnh kề ${v} vào Stack.`,
                        codeSnippet: `// Đẩy đỉnh kề v = ${v} vào Stack
if (!visited[${v}]) {
    s.push(${v});
}`,
                    });
                }
            }
        }
    }

    steps.push({
        visited: [...visited],
        activeNode: null,
        queueOrStack: [],
        description: 'Stack rỗng. Hoàn thành DFS!',
        codeSnippet: `// Stack rỗng -> Kết thúc DFS
// Thứ tự duyệt: ${visited.join(' -> ')}

// ƯU ĐIỂM DFS:
// - Dùng ít bộ nhớ hơn BFS nếu đỉnh kề nhiều.
// - Ứng dụng: Topological Sort, tìm Cycle, Maze solving.
//
// ĐỘ PHỨC TẠP:
// - Time: O(V + E)
// - Space: O(V) cho Stack (worst case)`,
    });

    return steps;
}

// =============================================================================
// COMPONENT
// =============================================================================

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ algorithm, graphData, autoStart = false, onRegenerate }) => {
    const [steps, setSteps] = useState<GraphStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const timerRef = useRef<any>(null);

    // Use provided graphData or fall back to default
    const nodes = graphData?.nodes || NODES;
    const edges = graphData?.edges || EDGES;
    const adjList = graphData?.adjList || ADJ_LIST;

    useEffect(() => {
        const generatedSteps = algorithm === 'bfs'
            ? generateBFSSteps(0, adjList)
            : generateDFSSteps(0, adjList);
        setSteps(generatedSteps);
        setCurrentStepIndex(0);
        setIsPlaying(autoStart);
    }, [algorithm, autoStart, graphData]);

    useEffect(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timerRef.current = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, 1000 / speed);
        } else {
            setIsPlaying(false);
        }
        return () => clearTimeout(timerRef.current);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleStepForward = () => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
    const handleStepBackward = () => setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    const handleReset = () => {
        if (onRegenerate) onRegenerate();
        else { setIsPlaying(false); setCurrentStepIndex(0); }
    };
    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return <div>Loading...</div>;

    return (
        <div className="viz-container">
            <header className="viz-header">
                <h2 className="viz-title">
                    {algorithm === 'bfs' ? 'Breadth First Search (BFS)' : 'Depth First Search (DFS)'}
                </h2>
                <p className="viz-subtitle">Trực quan hóa đồ thị</p>
            </header>

            <div className="viz-main-area" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Graph Area */}
                <div style={{ position: 'relative', height: '300px', background: 'var(--viz-bg-secondary)', borderRadius: '12px', border: '1px solid var(--viz-border-primary)' }}>
                    <svg style={{ width: '100%', height: '100%', position: 'absolute' }}>
                        {edges.map((edge, idx) => {
                            const start = nodes.find(n => n.id === edge.source)!;
                            const end = nodes.find(n => n.id === edge.target)!;
                            return (
                                <line
                                    key={idx}
                                    x1={start.x} y1={start.y}
                                    x2={end.x} y2={end.y}
                                    stroke="var(--viz-border-primary)"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>

                    {nodes.map(node => {
                        const isVisited = currentStep.visited.includes(node.id);
                        const isActive = currentStep.activeNode === node.id;
                        const isInQueue = currentStep.queueOrStack.includes(node.id) && !isVisited && !isActive;

                        let bg = 'var(--viz-bg-glass)';
                        let borderColor = 'var(--viz-border-primary)';

                        if (isActive) {
                            bg = 'var(--viz-color-pointer)';
                            borderColor = 'var(--viz-color-pointer)';
                        } else if (isVisited) {
                            bg = 'var(--viz-color-found)';
                            borderColor = 'var(--viz-color-found)';
                        } else if (isInQueue) {
                            bg = 'var(--viz-color-comparing)';
                            borderColor = 'var(--viz-color-comparing)';
                        }

                        return (
                            <motion.div
                                key={node.id}
                                style={{
                                    position: 'absolute',
                                    left: node.x - 20,
                                    top: node.y - 20,
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: bg,
                                    border: `2px solid ${borderColor}`,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    zIndex: 10,
                                }}
                                animate={{ scale: isActive ? 1.2 : 1 }}
                            >
                                {node.label}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Queue/Stack Status */}
                <div style={{
                    padding: '12px',
                    background: 'var(--viz-bg-glass)',
                    borderRadius: '8px',
                    border: '1px solid var(--viz-border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <strong style={{ color: 'var(--viz-text-secondary)' }}>
                        {algorithm === 'bfs' ? 'Queue:' : 'Stack:'}
                    </strong>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {currentStep.queueOrStack.map((val, idx) => (
                            <div key={idx} style={{
                                padding: '4px 8px',
                                background: 'var(--viz-bg-secondary)',
                                borderRadius: '4px',
                                border: '1px solid var(--viz-border-primary)'
                            }}>
                                {val}
                            </div>
                        ))}
                        {currentStep.queueOrStack.length === 0 && <span style={{ color: 'var(--viz-text-muted)' }}>(Trống)</span>}
                    </div>
                </div>

                {/* Description and Code */}
                <div className="viz-info-panel">
                    <div className="viz-step-description">
                        {currentStep.description}
                    </div>
                    {currentStep.codeSnippet && (
                        <div style={{
                            marginTop: '12px',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap',
                            color: 'var(--viz-text-code, #e2e8f0)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '8px',
                                color: 'var(--viz-color-comparing)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                            }}>
                                <i className="fi fi-rr-code-simple"></i>
                                CODE MINH HỌA
                            </div>
                            {currentStep.codeSnippet}
                        </div>
                    )}
                </div>
            </div>

            <AnimationControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={handleSpeedChange}
                currentStep={currentStepIndex}
                totalSteps={steps.length - 1}
            />
        </div>
    );
};

export default GraphVisualizer;
