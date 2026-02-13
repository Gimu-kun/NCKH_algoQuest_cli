
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './LinkedListGame.css';

interface Node {
    id: string;
    value: number;
    nextId: string | null;
    x: number;
    y: number;
}

export interface LinkedListGameProps {
    startedAt?: number;
    onComplete?: (score: number) => void;
}

export const LinkedListGame: React.FC<LinkedListGameProps> = ({
    onComplete
}) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [message, setMessage] = useState('Nối các nút để tạo thành danh sách tăng dần!');
    const [completed, setCompleted] = useState(false);
    const [moves, setMoves] = useState(0);

    // Khởi tạo level
    const initLevel = useCallback(() => {
        const count = 5;
        const values = Array.from({ length: count }, () => Math.floor(Math.random() * 99) + 1);

        const newNodes: Node[] = values.map((val, i) => ({
            id: `node-${i}`,
            value: val,
            nextId: null,
            // Random positions in a grid-like area
            x: 15 + (i % 3) * 30 + (Math.random() * 10 - 5),
            y: 20 + Math.floor(i / 3) * 30 + (Math.random() * 10 - 5)
        }));

        setNodes(newNodes);
        setCompleted(false);
        setMoves(0);
        setMessage('Hãy nối các nút theo thứ tự tăng dần!');
    }, []);

    useEffect(() => {
        initLevel();
    }, [initLevel]);

    const handleNodeClick = (id: string) => {
        if (completed) return;

        if (selectedNodeId === null) {
            setSelectedNodeId(id);
        } else if (selectedNodeId === id) {
            setSelectedNodeId(null);
        } else {
            // Nối selectedNodeId -> id
            setNodes(prev => prev.map(node => {
                if (node.id === selectedNodeId) {
                    return { ...node, nextId: id };
                }
                // Nếu id khác đang trỏ tới node này thì xóa? (Đơn hướng)
                return node;
            }));
            setMoves(m => m + 1);
            setSelectedNodeId(null);
        }
    };

    const clearConnection = (id: string) => {
        if (completed) return;
        setNodes(prev => prev.map(node =>
            node.id === id ? { ...node, nextId: null } : node
        ));
    };

    // Kiểm tra kết quả
    useEffect(() => {
        if (nodes.length === 0 || completed) return;

        // Tìm node đầu tiên (không có ai trỏ tới)
        const hasIncoming = new Set(nodes.map(n => n.nextId).filter(Boolean));
        const starters = nodes.filter(n => !hasIncoming.has(n.id));

        if (starters.length === 1) {
            const sequence: number[] = [];
            let current: Node | undefined = starters[0];

            while (current) {
                sequence.push(current.value);
                const nextId: string | null = current.nextId;
                current = nodes.find(n => n.id === nextId);
                // Simple cycle prevention
                if (sequence.length > nodes.length) break;
            }

            if (sequence.length === nodes.length) {
                const isSorted = sequence.every((val, i) => i === 0 || val >= sequence[i - 1]);
                if (isSorted) {
                    setCompleted(true);
                    setMessage('Tuyệt vời! Bạn đã hoàn thành danh sách liên kết! 🎉');
                    if (onComplete) onComplete(100);
                }
            }
        }
    }, [nodes, completed, onComplete]);

    return (
        <div className="linked-list-game">
            <div className="game-header">
                <h3>Thử thách: Xây dựng Danh sách liên kết</h3>
                <div className="stats">
                    <span>Bước đi: {moves}</span>
                </div>
                <p className="message">{message}</p>
            </div>

            <div className="nodes-container">
                <svg className="connections-svg">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7"
                            refX="20" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                        </marker>
                    </defs>
                    {nodes.map(node => {
                        if (!node.nextId) return null;
                        const target = nodes.find(n => n.id === node.nextId);
                        if (!target) return null;
                        return (
                            <line
                                key={`line-${node.id}-${target.id}`}
                                x1={`${node.x}%`} y1={`${node.y}%`}
                                x2={`${target.x}%`} y2={`${target.y}%`}
                                stroke="#6366f1"
                                strokeWidth="3"
                                markerEnd="url(#arrowhead)"
                                className="connection-line"
                            />
                        );
                    })}
                </svg>

                {nodes.map(node => (
                    <motion.div
                        key={node.id}
                        className={`node-circle ${selectedNodeId === node.id ? 'selected' : ''}`}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onClick={() => handleNodeClick(node.id)}
                        onContextMenu={(e) => { e.preventDefault(); clearConnection(node.id); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="node-value">{node.value}</div>
                        {node.nextId && (
                            <div className="node-pointer-hint">Next →</div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="game-controls">
                <button onClick={initLevel} className="reset-btn">
                    <i className="fi fi-rr-refresh"></i> Làm mới
                </button>
                <div className="hint text-xs mt-2 text-gray-500">
                    * Click 1 nút rồi click nút tiếp theo để nối. Chuột phải để xóa nối.
                </div>
            </div>
        </div>
    );
};
