
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import './TreeGame.css';

// ============================================================================
// TYPES
// ============================================================================

interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    x: number;
    y: number;
}

export interface BSTSearchGameProps {
    startedAt?: number;
    onComplete?: (result: { moves: number }) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BSTSearchGame: React.FC<BSTSearchGameProps> = ({
    startedAt,
    onComplete
}) => {
    // ────────────────────────────────────────────────────────────────────────
    // STATE
    // ────────────────────────────────────────────────────────────────────────

    const [root, setRoot] = useState<TreeNode | null>(null);
    const [target, setTarget] = useState<number>(0);
    const [currentNode, setCurrentNode] = useState<TreeNode | null>(null);
    const [path, setPath] = useState<string[]>([]); // Array of Node IDs visited
    const [message, setMessage] = useState<string>('');
    const [completed, setCompleted] = useState(false);
    const [moves, setMoves] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

    // ────────────────────────────────────────────────────────────────────────
    // LOGIC: GENERATE TREE
    // ────────────────────────────────────────────────────────────────────────

    const generateTree = useCallback(() => {
        // Simple random unique numbers
        const numbers = new Set<number>();
        while (numbers.size < 15) {
            numbers.add(Math.floor(Math.random() * 99) + 1);
        }
        const sorted = Array.from(numbers).sort((a, b) => a - b);

        // Build balanced BST from sorted array to avoid skew
        const buildBST = (arr: number[], x: number, y: number, level: number, parentId: string): TreeNode | null => {
            if (arr.length === 0) return null;

            const mid = Math.floor(arr.length / 2);
            const nodeVal = arr[mid];
            const id = `${parentId}-${nodeVal}`;

            // Calculate position
            // Root at 50%, next level offset decreases
            const offset = 25 / Math.pow(2, level);

            const node: TreeNode = {
                id,
                value: nodeVal,
                left: null,
                right: null,
                x,
                y
            };

            node.left = buildBST(arr.slice(0, mid), x - offset, y + 80, level + 1, id);
            node.right = buildBST(arr.slice(mid + 1), x + offset, y + 80, level + 1, id);

            return node;
        };

        const newRoot = buildBST(sorted, 50, 50, 0, 'root');
        setRoot(newRoot);
        setCurrentNode(newRoot);
        setPath(newRoot ? [newRoot.id] : []);

        // Pick a random target from the numbers
        const targetVal = Array.from(numbers)[Math.floor(Math.random() * numbers.size)];
        setTarget(targetVal);
        setMessage(`Hãy tìm số ${targetVal} trong cây BST!`);
        setCompleted(false);
        setMoves(0);
    }, []);

    useEffect(() => {
        generateTree();
    }, [generateTree]);

    // ────────────────────────────────────────────────────────────────────────
    // LOGIC: GAMEPLAY
    // ────────────────────────────────────────────────────────────────────────

    const handleNodeClick = (node: TreeNode) => {
        if (completed) return;
        if (!currentNode) return;

        // Check valid move: must be child of current node
        const isLeftChild = currentNode.left?.id === node.id;
        const isRightChild = currentNode.right?.id === node.id;

        if (!isLeftChild && !isRightChild) {
            // Check if clicking current node (do nothing)
            if (node.id === currentNode.id) return;

            setMessage('Bạn chỉ có thể đi xuống con trực tiếp!');
            return;
        }

        // Validate BST Logic
        if (target < currentNode.value && isRightChild) {
            setMessage(`Sai rồi! ${target} nhỏ hơn ${currentNode.value}, hãy đi bên Trái!`);
            setMoves(m => m + 1);
            return; // Penalize? Or allow wrong move? Let's prevent wrong move for learning.
        }

        if (target > currentNode.value && isLeftChild) {
            setMessage(`Sai rồi! ${target} lớn hơn ${currentNode.value}, hãy đi bên Phải!`);
            setMoves(m => m + 1);
            return;
        }

        // Valid move
        setCurrentNode(node);
        setPath(prev => [...prev, node.id]);
        setMoves(m => m + 1);

        if (node.value === target) {
            setCompleted(true);
            setMessage('Chúc mừng! Bạn đã tìm thấy kho báu! 🎉');
            if (onComplete) onComplete({ moves: moves + 1 });
        } else {
            // Update hint
            if (target < node.value) setMessage(`Tìm ${target}: Nhỏ hơn ${node.value} -> Đi Trái`);
            else setMessage(`Tìm ${target}: Lớn hơn ${node.value} -> Đi Phải`);
        }
    };

    // Timer implementation using startedAt
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        if (!startedAt || completed) return;
        const interval = setInterval(() => {
            setElapsed(Date.now() - startedAt);
        }, 100);
        return () => clearInterval(interval);
    }, [startedAt, completed]);

    // ────────────────────────────────────────────────────────────────────────
    // RENDER HELPERS
    // ────────────────────────────────────────────────────────────────────────

    const renderLines = (node: TreeNode | null) => {
        if (!node) return [];
        const lines: any[] = [];

        if (node.left) {
            lines.push(
                <line
                    key={`line-${node.id}-${node.left.id}`}
                    x1={`${node.x}%`} y1={node.y}
                    x2={`${node.left.x}%`} y2={node.left.y}
                    stroke="#475569" strokeWidth="2"
                />
            );
            lines.push(...renderLines(node.left));
        }
        if (node.right) {
            lines.push(
                <line
                    key={`line-${node.id}-${node.right.id}`}
                    x1={`${node.x}%`} y1={node.y}
                    x2={`${node.right.x}%`} y2={node.right.y}
                    stroke="#475569" strokeWidth="2"
                />
            );
            lines.push(...renderLines(node.right));
        }
        return lines;
    };

    const renderNodes = (node: TreeNode | null) => {
        if (!node) return [];
        const nodes: any[] = [];

        const isCurrent = currentNode?.id === node.id;
        const isVisited = path.includes(node.id);
        const isTarget = completed && node.value === target;

        nodes.push(
            <motion.div
                key={node.id}
                className={`tree-node 
                    ${isCurrent ? 'current' : ''} 
                    ${isVisited ? 'visited' : ''}
                    ${isTarget ? 'target' : ''}
                `}
                style={{ left: `${node.x}%`, top: `${node.y}px` }}
                onClick={() => handleNodeClick(node)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                {node.value}
            </motion.div>
        );

        nodes.push(...renderNodes(node.left));
        nodes.push(...renderNodes(node.right));
        return nodes;
    };

    return (
        <div className="tree-game-container" ref={containerRef}>
            <div className="game-header">
                <div className="target-display">
                    Mục tiêu: <span className="highlight">{target}</span>
                </div>
                <div className="time-display" style={{ marginLeft: '1rem', color: '#94a3b8' }}>
                    ⏱ {(elapsed / 1000).toFixed(1)}s
                </div>
                <div className="message-display">{message}</div>
                <button className="reset-btn" onClick={generateTree}>
                    <i className="fi fi-rr-refresh"></i> Reset
                </button>
            </div>

            <div className="tree-area">
                <svg className="tree-lines">
                    {renderLines(root)}
                </svg>
                {renderNodes(root)}
            </div>

            <div className="game-footer">
                <i className="fi fi-rr-info"></i> BST: Nhỏ hơn sang Trái, Lớn hơn sang Phải
            </div>
        </div>
    );
};
