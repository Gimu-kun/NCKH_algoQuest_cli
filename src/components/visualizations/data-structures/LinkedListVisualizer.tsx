/**
 * =============================================================================
 * FILE: LinkedListVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa cấu trúc dữ liệu Linked List (Danh sách liên kết).
 * - Minh họa các thao tác: Append, Prepend, Delete, Traverse.
 * - Giúp user hiểu cách nodes liên kết với nhau qua pointers.
 *
 * CẤU TRÚC DỮ LIỆU LINKED LIST (Chi tiết):
 *
 * KHÁI NIỆM (Concept):
 * - Linked List là cấu trúc dữ liệu tuyến tính gồm các nodes.
 * - Mỗi node chứa: DATA (dữ liệu) + NEXT POINTER (con trỏ đến node tiếp theo).
 * - Nodes không cần liền kề trong memory → linh hoạt hơn array.
 *
 * CẤU TRÚC NODE:
 * ┌────────────────────────┐
 * │   ┌───────┬────────┐   │
 * │   │ DATA  │  NEXT  │ ──┼──→ [Next Node hoặc null]
 * │   └───────┴────────┘   │
 * └────────────────────────┘
 *
 * CÁC LOẠI LINKED LIST:
 * 1. Singly Linked List: Mỗi node trỏ đến node kế tiếp.
 * 2. Doubly Linked List: Có thêm PREV pointer, duyệt 2 chiều.
 * 3. Circular Linked List: Node cuối trỏ về node đầu.
 *
 * CÁC THAO TÁC CƠ BẢN (Operations):
 *
 * 1. APPEND (Thêm vào cuối):
 *    - Duyệt đến node cuối → link NEXT đến new node.
 *    - Time: O(n) không có tail pointer, O(1) có tail pointer.
 *
 * 2. PREPEND (Thêm vào đầu):
 *    - New node.NEXT = HEAD → HEAD = new node.
 *    - Time: O(1) - Luôn nhanh!
 *
 * 3. DELETE (Xóa node):
 *    - Tìm node → Relink: prev.NEXT = target.NEXT.
 *    - Time: O(n) để tìm, O(1) để xóa.
 *
 * 4. SEARCH (Tìm kiếm):
 *    - Duyệt từ HEAD đến cuối hoặc tìm thấy.
 *    - Time: O(n).
 *
 * ĐỘ PHỨC TẠP (Complexity):
 * ┌──────────────────┬────────────────┬────────────────┐
 * │ Operation        │ Singly LL      │ Doubly LL      │
 * ├──────────────────┼────────────────┼────────────────┤
 * │ Access (by index)│ O(n)           │ O(n)           │
 * │ Search           │ O(n)           │ O(n)           │
 * │ Prepend          │ O(1)           │ O(1)           │
 * │ Append (w/o tail)│ O(n)           │ O(n)           │
 * │ Append (w/ tail) │ O(1)           │ O(1)           │
 * │ Delete head      │ O(1)           │ O(1)           │
 * │ Delete middle    │ O(n)           │ O(n)           │
 * └──────────────────┴────────────────┴────────────────┘
 *
 * SO SÁNH VỚI ARRAY:
 * ┌─────────────────┬────────────────┬────────────────┐
 * │ Tiêu chí        │ Array          │ Linked List    │
 * ├─────────────────┼────────────────┼────────────────┤
 * │ Access by index │ O(1)           │ O(n)          │
 * │ Insert at start │ O(n)           │ O(1)           │
 * │ Insert at end   │ O(1) amortized │ O(1) with tail │
 * │ Delete at start │ O(n)           │ O(1)           │
 * │ Memory usage    │ Contiguous     │ Scattered      │
 * │ Cache locality  │ Good           │ Poor           │
 * └─────────────────┴────────────────┴────────────────┘
 *
 * KHI NÀO DÙNG LINKED LIST:
 * - Cần insert/delete thường xuyên ở đầu/giữa.
 * - Không cần random access.
 * - Size thay đổi nhiều.
 * - Implement Stack/Queue.
 *
 * ỨNG DỤNG THỰC TẾ:
 * 1. Browser history (back/forward buttons).
 * 2. Music playlist (prev/next song).
 * 3. Undo functionality.
 * 4. Memory allocation (free lists).
 * 5. Hash table chaining.
 *
 * =============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../shared/VisualizationStyles.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * ListNode - Đại diện cho một node trong linked list.
 */
interface ListNode {
    id: string;
    value: number;
}

/**
 * LinkedListVisualizerProps - Props cho component.
 */
interface LinkedListVisualizerProps {
    /**
     * initialItems: Mảng các giá trị ban đầu.
     */
    initialItems?: number[];

    /**
     * maxSize: Giới hạn số nodes tối đa.
     */
    maxSize?: number;

    /**
     * title: Tiêu đề tùy chọn.
     */
    title?: string;

    /**
     * showInfo: Hiển thị thông tin complexity.
     */
    showInfo?: boolean;
    onRegenerate?: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

    /**
     * list: Mảng các ListNode.
     * Index 0 = HEAD.
     * Mỗi node "trỏ" đến node index + 1.
     */
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
}`);

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    const isEmpty = list.length === 0;
    const isFull = list.length >= maxSize;

    // =========================================================================
    // ACTION HANDLERS
    // =========================================================================

    /**
     * handlePrepend - Thêm node vào đầu list (thành HEAD mới).
     *
     * Flow:
     * 1. Tạo new node.
     * 2. new node.next = current HEAD.
     * 3. HEAD = new node.
     * Time: O(1) - Không cần duyệt!
     */
    const handlePrepend = useCallback(() => {
        const value = parseInt(inputValue, 10);

        if (isNaN(value)) {
            setMessage('[Lỗi] Vui lòng nhập một số hợp lệ!');
            return;
        }

        if (isFull) {
            setMessage(`[Lỗi] List đầy! Tối đa ${maxSize} nodes.`);
            return;
        }

        const newNode: ListNode = { id: generateId(), value };

        // Prepend = add to beginning
        setList(prev => [newNode, ...prev]);
        setInputValue('');
        setHighlightedIndex(0);
        setMessage(`[PREPEND] Thêm ${value} vào đầu. O(1) - Cực nhanh!`);
        setCodeDisplay(`// PREPEND - Thêm vào đầu list
// Time Complexity: O(1)

function prepend(value) {
    const newNode = new Node(${value});
    
    // 1. Link new node to current head
    newNode.next = this.head;
    
    // 2. Update head
    this.head = newNode;
}

// Result: [${value}] -> [${list.length > 0 ? list[0].value : 'null'}]...`);

        setTimeout(() => setHighlightedIndex(null), 1500);
    }, [inputValue, isFull, maxSize]);

    /**
     * handleAppend - Thêm node vào cuối list.
     *
     * Flow:
     * 1. Nếu list rỗng → newNode là HEAD.
     * 2. Nếu không → duyệt đến node cuối → link đến newNode.
     * Time: O(n) không có tail, O(1) có tail pointer.
     */
    const handleAppend = useCallback(async () => {
        const value = parseInt(inputValue, 10);

        if (isNaN(value)) {
            setMessage('[Lỗi] Vui lòng nhập một số hợp lệ!');
            return;
        }

        if (isFull) {
            setMessage(`[Lỗi] List đầy! Tối đa ${maxSize} nodes.`);
            return;
        }

        // Animate traversal to end
        if (list.length > 0) {
            setMessage(`🔍 Đang duyệt đến cuối list... O(n)`);
            for (let i = 0; i < list.length; i++) {
                setTraversingIndex(i);
                await new Promise(r => setTimeout(r, 300));
            }
            setTraversingIndex(null);
        }

        const newNode: ListNode = { id: generateId(), value };

        setList(prev => [...prev, newNode]);
        setInputValue('');
        setHighlightedIndex(list.length);
        setMessage(`[APPEND] Thêm ${value} vào cuối. Đã duyệt ${list.length} nodes.`);
        setCodeDisplay(`// APPEND - Thêm vào cuối list
// Time Complexity: O(n) (nếu không có tail pointer)

function append(value) {
    const newNode = new Node(${value});

    // 1. If list is empty
    if (!this.head) {
        this.head = newNode;
        return;
    }

    // 2. Traverse to end
    let current = this.head;
    while (current.next) {
        current = current.next; // Duyệt ${list.length} bước
    }

    // 3. Link last node to new node
    current.next = newNode;
}`);

        setTimeout(() => setHighlightedIndex(null), 1500);
    }, [inputValue, isFull, maxSize, list.length]);

    /**
     * handleDelete - Xóa node theo giá trị.
     *
     * Flow:
     * 1. Nếu HEAD.value === target → HEAD = HEAD.next.
     * 2. Nếu không → duyệt tìm node → relink: prev.next = target.next.
     * Time: O(n) để tìm.
     */
    const handleDelete = useCallback(async () => {
        const value = parseInt(inputValue, 10);

        if (isNaN(value)) {
            setMessage('[Lỗi] Vui lòng nhập số cần xóa!');
            return;
        }

        if (isEmpty) {
            setMessage('[Lỗi] List rỗng!');
            return;
        }

        // Find the node
        let foundIndex = -1;
        for (let i = 0; i < list.length; i++) {
            setTraversingIndex(i);
            setMessage(`🔍 Tìm kiếm: Đang xét node ${i} (value = ${list[i].value})`);
            await new Promise(r => setTimeout(r, 400));

            if (list[i].value === value) {
                foundIndex = i;
                break;
            }
        }
        setTraversingIndex(null);

        if (foundIndex === -1) {
            setMessage(`[Lỗi] Không tìm thấy node với giá trị ${value}!`);
            return;
        }

        // Delete the node
        setList(prev => prev.filter((_, idx) => idx !== foundIndex));
        setMessage(`[DELETE] Đã xóa node ${value} tại vị trí ${foundIndex}.`);
        setCodeDisplay(`// DELETE - Xóa node theo value
// Time Complexity: O(n) để tìm + O(1) để xóa

function delete(value) {
    if (!this.head) return;

    // Case 1: Delete head
    if (this.head.value === ${value}) {
        this.head = this.head.next;
        return;
    }

    // Case 2: Traverse and find
    let current = this.head;
    while (current.next) {
        if (current.next.value === ${value}) {
            // Relink: Bỏ qua node cần xóa
            current.next = current.next.next;
            return;
        }
        current = current.next;
    }
}`);
    }, [inputValue, isEmpty, list]);

    /**
     * handleTraverse - Demo duyệt toàn bộ list.
     */
    const handleTraverse = useCallback(async () => {
        if (isEmpty) {
            setMessage('[Lỗi] List rỗng, không có gì để duyệt!');
            return;
        }

        setMessage('[TRAVERSE] Bắt đầu duyệt từ HEAD...');

        for (let i = 0; i < list.length; i++) {
            setTraversingIndex(i);
            setMessage(`[Duyệt] Node ${i} (value = ${list[i].value})`);
            await new Promise(r => setTimeout(r, 500));
        }

        setTraversingIndex(null);
        setMessage(`[TRAVERSE] Hoàn thành! Đã duyệt ${list.length} nodes.`);
        setCodeDisplay(`// TRAVERSE - Duyệt từng node
// Time Complexity: O(n)

function traverse() {
    let current = this.head;
    
    // Duyệt đến khi current === null
    while (current) {
        print(current.value);
        current = current.next;
    }
}

// Đã duyệt ${list.length} nodes.`);
    }, [isEmpty, list]);

    /**
     * handleClear - Xóa toàn bộ list.
     */
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

    const nodeVariants = {
        initial: {
            opacity: 0,
            scale: 0,
            x: -50,
        },
        animate: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            scale: 0,
            y: -50,
            transition: {
                duration: 0.3,
            },
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
                                <React.Fragment key={node.id}>
                                    {/* Node */}
                                    <motion.div
                                        variants={nodeVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
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
                                            exit={{ opacity: 0, scaleX: 0 }}
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
                                </React.Fragment>
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
