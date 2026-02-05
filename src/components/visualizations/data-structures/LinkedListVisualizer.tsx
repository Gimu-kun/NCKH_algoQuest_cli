import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import '../shared/VisualizationStyles.css';

import type { LinkedListStep } from '../../../algo_demos/Chapter_3_LinkedList/LinkedList';
import {
    generateTraversalSteps,
    generateInsertAtHeadSteps,
    generateInsertAtTailSteps,
    generateDeleteSteps
} from '../../../algo_demos/Chapter_3_LinkedList/LinkedList';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface ListNode {
    id: string;
    value: number;
}

interface LinkedListVisualizerProps {
    initialItems?: number[];
    maxSize?: number;
    title?: string;
    showInfo?: boolean;
    onRegenerate?: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId(): string {
    return `${Date.now()} -${Math.random().toString(36).substr(2, 9)} `;
}

// =============================================================================
// COMPONENT: LinkedListVisualizer
// =============================================================================

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
    initialItems = [],
    maxSize = 8,
    title,
    showInfo = true,
    onRegenerate,
}) => {
    // =========================================================================
    // STATE
    // =========================================================================

    const [list, setList] = useState<ListNode[]>(
        initialItems.map(value => ({ id: generateId(), value }))
    );

    useEffect(() => {
        setList(initialItems.map(value => ({ id: generateId(), value })));
    }, [initialItems]);

    const [inputValue, setInputValue] = useState<string>('');
    const [message, setMessage] = useState<string>('Linked List: Các nodes liên kết qua pointers.');
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [traversingIndex, setTraversingIndex] = useState<number | null>(null);
    const [codeDisplay, setCodeDisplay] = useState<string>(`// SINGLY LINKED LIST
// Mỗi node chứa value và pointer 'next'

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    // Các thao tác: Append, Prepend, Delete, Traverse
} `);

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    const isEmpty = list.length === 0;
    const isFull = list.length >= maxSize;

    // =========================================================================
    // HELPER: Play Animation
    // =========================================================================

    const playSteps = async (steps: LinkedListStep[]) => {
        for (const step of steps) {
            setMessage(step.description);

            // Highlight logic
            if (step.nodeIndex !== -1) {
                if (step.type === 'traverse') setTraversingIndex(step.nodeIndex);
                if (step.type === 'found') setHighlightedIndex(step.nodeIndex);
                if (step.type === 'insert' || step.type === 'update') setHighlightedIndex(step.nodeIndex);
            } else {
                setTraversingIndex(null);
            }

            // Highlighting specific nodes from array
            if (step.highlight && step.highlight.length > 0) {
                // Could map multiple highlights if supported
                if (step.type !== 'traverse') setHighlightedIndex(step.highlight[0]);
            }

            await new Promise(r => setTimeout(r, 600));
        }
        setTraversingIndex(null);
        setHighlightedIndex(null);
    };

    // =========================================================================
    // ACTION HANDLERS
    // =========================================================================

    const handlePrepend = useCallback(async () => {
        const value = parseInt(inputValue, 10);
        if (isNaN(value) || isFull) return;

        const currentValues = list.map(n => n.value);
        const steps = generateInsertAtHeadSteps(currentValues, value);

        await playSteps(steps);

        const newNode: ListNode = { id: generateId(), value };
        setList(prev => [newNode, ...prev]);
        setInputValue('');

        setMessage(`[PREPEND] Thêm ${value} vào đầu.O(1) - Cực nhanh!`);
        setCodeDisplay(`// PREPEND - Thêm vào đầu list
// Time Complexity: O(1)

function prepend(value) {
    const newNode = new Node(${value});
    newNode.next = this.head;
    this.head = newNode;
} `);
        setHighlightedIndex(0);
        setTimeout(() => setHighlightedIndex(null), 1000);

    }, [inputValue, isFull, maxSize, list]); // Added list dependency

    const handleAppend = useCallback(async () => {
        const value = parseInt(inputValue, 10);
        if (isNaN(value) || isFull) return;

        const currentValues = list.map(n => n.value);
        const steps = generateInsertAtTailSteps(currentValues, value);
        const traverseSteps = steps.filter(s => s.type === 'traverse');

        await playSteps(traverseSteps);

        const newNode: ListNode = { id: generateId(), value };
        setList(prev => [...prev, newNode]);
        setInputValue('');

        setMessage(`[APPEND] Đã thêm ${value} vào cuối.`);
        setCodeDisplay(`// APPEND - Thêm vào cuối list
// Time Complexity: O(n) (nếu không có tail pointer)

function append(value) {
    const newNode = new Node(${value});
    if (!this.head) {
        this.head = newNode;
        return;
    }
    let current = this.head;
    while (current.next) {
        current = current.next;
    }
    current.next = newNode;
} `);
        setHighlightedIndex(list.length);
        setTimeout(() => setHighlightedIndex(null), 1000);
    }, [inputValue, isFull, maxSize, list]);

    const handleDelete = useCallback(async () => {
        const value = parseInt(inputValue, 10);
        if (isNaN(value) || isEmpty) return;

        const currentValues = list.map(n => n.value);
        const steps = generateDeleteSteps(currentValues, value);
        const foundStepIndex = steps.findIndex(s => s.type === 'found');

        if (foundStepIndex === -1 && steps[steps.length - 1].description.includes('Không tìm thấy')) {
            await playSteps(steps);
            return;
        }

        const preDeleteSteps = steps.slice(0, foundStepIndex + 1);
        await playSteps(preDeleteSteps);

        const targetIndex = steps[foundStepIndex].nodeIndex;
        setList(prev => prev.filter((_, idx) => idx !== targetIndex));

        setMessage(`[DELETE] Đã xóa node ${value}.`);
        setCodeDisplay(`// DELETE - Xóa node theo value
// Time Complexity: O(n)

function delete (value) {
    if (!this.head) return;
    if (this.head.value === ${value}) {
        this.head = this.head.next;
        return;
    }
    let current = this.head;
    while (current.next) {
        if (current.next.value === ${value}) {
            current.next = current.next.next;
            return;
        }
        current = current.next;
    }
} `);
    }, [inputValue, isEmpty, list]);

    const handleTraverse = useCallback(async () => {
        if (isEmpty) return;
        const currentValues = list.map(n => n.value);
        const steps = generateTraversalSteps(currentValues);
        await playSteps(steps);
        setCodeDisplay(`// TRAVERSE - Duyệt từng node
// Time Complexity: O(n)

function traverse() {
    let current = this.head;
    while (current) {
        print(current.value);
        current = current.next;
    }
} `);
    }, [isEmpty, list]);

    const handleClear = useCallback(() => {
        setList([]);
        setMessage('[Xóa] Đã xóa toàn bộ linked list. HEAD = null.');
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAppend();
        }
    };

    // =========================================================================
    // ANIMATION VARIANTS
    // =========================================================================

    const nodeVariants: Variants = {
        initial: { opacity: 0, scale: 0, x: -50 },
        animate: {
            opacity: 1, scale: 1, x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 } as const
        },
        exit: {
            opacity: 0, scale: 0, y: -50,
            transition: { duration: 0.3 }
        },
    };

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <div className="viz-container linked-list-visualizer">
            {/* Header */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || 'Singly Linked List (DSLK Đơn)'}
                    </h2>
                    <p className="viz-subtitle">
                        Các nodes liên kết qua pointers (con trỏ)
                    </p>
                </div>

                <div className="viz-info-badges">
                    <span className="viz-badge"><i className="fi fi-rr-box"></i> Size: {list.length}/{maxSize}</span>
                    <span className="viz-badge"><i className="fi fi-rr-clock"></i> Prepend: O(1)</span>
                    <span className="viz-badge"><i className="fi fi-rr-clock"></i> Append: O(n)</span>
                </div>
            </header>

            {/* Linked List Visualization */}
            <div style={{
                padding: '30px 20px',
                background: 'var(--viz-bg-glass)',
                borderRadius: 'var(--viz-border-radius-sm)',
                border: '1px solid var(--viz-border-primary)',
                overflowX: 'auto',
            }}>
                {/* HEAD Label */}
                <div style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <span style={{
                        padding: '4px 12px',
                        background: 'var(--viz-color-pointer)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'white',
                    }}>
                        HEAD
                    </span>
                    <span style={{ color: 'var(--viz-text-muted)', fontSize: '0.85rem' }}>
                        → {isEmpty ? 'null' : `Node(${list[0]?.value})`}
                    </span>
                </div>

                {/* Nodes Container */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    minHeight: '100px',
                    padding: '10px 0',
                }}>
                    <AnimatePresence mode="popLayout">
                        {list.map((node, index) => {
                            const isHead = index === 0;
                            const isTail = index === list.length - 1;
                            const isHighlighted = highlightedIndex === index;
                            const isTraversing = traversingIndex === index;

                            return (
                                <motion.div
                                    key={node.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Node */}
                                    <motion.div
                                        variants={nodeVariants}
                                        initial="initial"
                                        animate="animate"
                                        layout
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {/* Head/Tail indicator */}
                                        <div style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            color: isHead
                                                ? 'var(--viz-color-pointer)'
                                                : 'var(--viz-text-muted)',
                                            marginBottom: '4px',
                                            height: '16px',
                                        }}>
                                            {isHead && 'HEAD'}
                                            {isTail && !isHead && 'TAIL'}
                                        </div>

                                        {/* Node box */}
                                        <motion.div
                                            animate={{
                                                scale: isTraversing ? 1.1 : 1,
                                                y: isTraversing ? -5 : 0,
                                            }}
                                            style={{
                                                display: 'flex',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                boxShadow: isHighlighted
                                                    ? '0 0 20px rgba(34, 197, 94, 0.6)'
                                                    : isTraversing
                                                        ? '0 0 15px rgba(251, 191, 36, 0.5)'
                                                        : '0 2px 4px rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            {/* Data section */}
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 600,
                                                fontSize: '1.1rem',
                                                backgroundColor: isHighlighted
                                                    ? 'var(--viz-color-sorted)'
                                                    : isTraversing
                                                        ? 'var(--viz-color-comparing)'
                                                        : 'var(--viz-color-normal)',
                                                color: isHighlighted || isTraversing
                                                    ? 'rgba(0,0,0,0.8)'
                                                    : 'white',
                                            }}>
                                                {node.value}
                                            </div>

                                            {/* Next pointer section */}
                                            <div style={{
                                                width: '30px',
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'var(--viz-bg-secondary)',
                                                fontSize: '0.8rem',
                                                color: 'var(--viz-text-muted)',
                                                borderLeft: '1px solid rgba(255,255,255,0.1)',
                                            }}>
                                                {isTail ? '∅' : '→'}
                                            </div>
                                        </motion.div>

                                        {/* Index */}
                                        <div style={{
                                            fontSize: '0.65rem',
                                            color: 'var(--viz-text-muted)',
                                            marginTop: '4px',
                                        }}>
                                            [{index}]
                                        </div>
                                    </motion.div>

                                    {/* Arrow connecting to next */}
                                    {!isTail && (
                                        <motion.div
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            animate={{ opacity: 1, scaleX: 1 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0 4px',
                                                color: isTraversing
                                                    ? 'var(--viz-color-comparing)'
                                                    : 'var(--viz-text-muted)',
                                                fontSize: '1.2rem',
                                            }}
                                        >
                                            →
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* NULL terminator */}
                    {!isEmpty && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                marginLeft: '8px',
                                padding: '8px 12px',
                                background: 'var(--viz-bg-secondary)',
                                borderRadius: '4px',
                                color: 'var(--viz-text-muted)',
                                fontSize: '0.85rem',
                                fontStyle: 'italic',
                            }}
                        >
                            null
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {isEmpty && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                color: 'var(--viz-text-muted)',
                                fontStyle: 'italic',
                            }}
                        >
                            HEAD → null (List rỗng)
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
            }}>
                {/* Input */}
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập số..."
                    style={{
                        width: '120px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                        background: 'var(--viz-bg-secondary)',
                        color: 'var(--viz-text-primary)',
                        fontSize: '1rem',
                        outline: 'none',
                    }}
                />

                {/* Action Buttons */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrepend}
                    disabled={isFull}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isFull ? 'var(--viz-color-inactive)' : 'var(--viz-color-pointer)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: isFull ? 'not-allowed' : 'pointer',
                    }}
                >
                    PREPEND
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAppend}
                    disabled={isFull}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isFull ? 'var(--viz-color-inactive)' : 'var(--viz-color-sorted)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: isFull ? 'not-allowed' : 'pointer',
                    }}
                >
                    APPEND
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    disabled={isEmpty}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isEmpty ? 'var(--viz-color-inactive)' : 'var(--viz-color-swapping)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: isEmpty ? 'not-allowed' : 'pointer',
                    }}
                >
                    DELETE
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTraverse}
                    disabled={isEmpty}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isEmpty ? 'var(--viz-color-inactive)' : 'var(--viz-color-comparing)',
                        color: isEmpty ? 'white' : 'rgba(0,0,0,0.8)',
                        fontWeight: 600,
                        cursor: isEmpty ? 'not-allowed' : 'pointer',
                    }}
                >
                    TRAVERSE
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    disabled={isEmpty}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                        background: 'transparent',
                        color: isEmpty ? 'var(--viz-text-muted)' : 'var(--viz-text-secondary)',
                        fontWeight: 500,
                        cursor: isEmpty ? 'not-allowed' : 'pointer',
                    }}
                >
                    <i className="fi fi-rr-trash"></i> CLEAR
                </motion.button>


                {onRegenerate && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRegenerate}
                        style={{
                            marginTop: '12px',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-color-found)',
                            background: 'transparent',
                            color: 'var(--viz-color-found)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%'
                        }}
                    >
                        <i className="fi fi-rr-refresh"></i> Tạo Dữ Liệu Mới
                    </motion.button>
                )}
            </div>

            {/* Message */}
            <motion.div
                key={message}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="viz-step-description"
            >
                {message}
            </motion.div>

            {/* Code Display Section */}
            <motion.div
                key={codeDisplay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                    marginTop: '16px',
                    marginBottom: '16px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
                    borderRadius: '12px',
                    border: '1px solid var(--viz-border-primary)',
                }}
            >
                <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--viz-color-pointer)',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <i className="fi fi-rr-code-simple"></i> CODE MINH HỌA
                </h4>
                <pre style={{
                    margin: 0,
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: 'var(--viz-text-primary)',
                    overflow: 'auto',
                    maxHeight: '200px',
                    fontFamily: 'JetBrains Mono, Consolas, monospace',
                }}>
                    {codeDisplay}
                </pre>
            </motion.div>

            {/* Info Section */}
            {
                showInfo && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '10px',
                    }}>
                        <div style={{
                            padding: '12px',
                            background: 'var(--viz-bg-glass)',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                        }}>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--viz-color-pointer)', fontSize: '0.85rem' }}>
                                PREPEND
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--viz-text-secondary)' }}>
                                Thêm vào đầu. O(1)
                            </p>
                        </div>
                        <div style={{
                            padding: '12px',
                            background: 'var(--viz-bg-glass)',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                        }}>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--viz-color-sorted)', fontSize: '0.85rem' }}>
                                APPEND
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--viz-text-secondary)' }}>
                                Thêm vào cuối. O(n)
                            </p>
                        </div>
                        <div style={{
                            padding: '12px',
                            background: 'var(--viz-bg-glass)',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                        }}>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--viz-color-swapping)', fontSize: '0.85rem' }}>
                                DELETE
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--viz-text-secondary)' }}>
                                Tìm và xóa. O(n)
                            </p>
                        </div>
                        <div style={{
                            padding: '12px',
                            background: 'var(--viz-bg-glass)',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                        }}>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--viz-color-comparing)', fontSize: '0.85rem' }}>
                                TRAVERSE
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--viz-text-secondary)' }}>
                                Duyệt qua nodes. O(n)
                            </p>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

// =============================================================================
// EXPORTS
// =============================================================================

LinkedListVisualizer.displayName = 'LinkedListVisualizer';

export default LinkedListVisualizer;
export { LinkedListVisualizer };
export type { LinkedListVisualizerProps };
