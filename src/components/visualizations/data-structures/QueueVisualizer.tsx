/**
 * =============================================================================
 * FILE: QueueVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa cấu trúc dữ liệu Queue (Hàng đợi).
 * - Minh họa các thao tác: Enqueue, Dequeue, Front, Rear.
 * - Giúp user hiểu nguyên tắc FIFO (First In, First Out).
 *
 * CẤU TRÚC DỮ LIỆU QUEUE (Chi tiết):
 *
 * KHÁI NIỆM (Concept):
 * - Queue là cấu trúc dữ liệu tuyến tính theo nguyên tắc FIFO.
 * - FIFO = First In, First Out = Vào trước, Ra trước.
 * - Tưởng tượng như hàng đợi siêu thị: Người đến trước được phục vụ trước.
 *
 * CẤU TRÚC:
 * - FRONT: Đầu hàng đợi, nơi phần tử được lấy ra (dequeue).
 * - REAR: Cuối hàng đợi, nơi phần tử mới được thêm vào (enqueue).
 *
 * CÁC THAO TÁC CƠ BẢN (Operations):
 *
 * 1. ENQUEUE (Thêm vào cuối):
 *    - Thêm phần tử mới vào REAR của queue.
 *    - Time Complexity: O(1).
 *
 * 2. DEQUEUE (Lấy từ đầu):
 *    - Lấy và xóa phần tử ở FRONT của queue.
 *    - Time Complexity: O(1) với Linked List, O(n) với Array (do shift).
 *
 * 3. FRONT/PEEK (Xem đầu):
 *    - Xem phần tử FRONT mà KHÔNG xóa.
 *    - Time Complexity: O(1).
 *
 * 4. isEmpty (Kiểm tra rỗng):
 *    - Time Complexity: O(1).
 *
 * ĐỘ PHỨC TẠP (Complexity):
 * ┌──────────────┬────────────────┬────────────────┐
 * │ Operation    │ Array          │ Linked List    │
 * ├──────────────┼────────────────┼────────────────┤
 * │ Enqueue      │ O(1) amortized │ O(1)           │
 * │ Dequeue      │ O(n) - shift   │ O(1)           │
 * │ Front        │ O(1)           │ O(1)           │
 * │ isEmpty      │ O(1)           │ O(1)           │
 * └──────────────┴────────────────┴────────────────┘
 *
 * CẢI TIẾN: Circular Queue
 * - Dùng array với 2 pointers (front, rear).
 * - Tránh được O(n) shift của dequeue.
 * - wrap around: rear = (rear + 1) % capacity.
 *
 * ỨNG DỤNG THỰC TẾ (Real-world Applications):
 * 1. Task Scheduling: CPU scheduling, print queue.
 * 2. BFS (Breadth-First Search): Duyệt đồ thị theo chiều rộng.
 * 3. Message Queues: RabbitMQ, Kafka.
 * 4. Buffering: IO buffers, keyboard buffer.
 * 5. Customer Service: Hệ thống xếp hàng, ticket system.
 * 6. Async Processing: Job queues, event loops.
 *
 * VARIANTS (Biến thể):
 * 1. Priority Queue: Phần tử có priority được xử lý trước.
 * 2. Deque (Double-ended): Add/remove từ cả 2 đầu.
 * 3. Circular Queue: Tránh waste space.
 * 4. Blocking Queue: Thread-safe, wait khi empty/full.
 *
 * SO SÁNH VỚI STACK:
 * ┌─────────────┬──────────────┬──────────────┐
 * │ Tiêu chí    │ Queue        │ Stack        │
 * ├─────────────┼──────────────┼──────────────┤
 * │ Principle   │ FIFO         │ LIFO         │
 * │ Add         │ Rear         │ Top          │
 * │ Remove      │ Front        │ Top          │
 * │ Use Case    │ BFS, Tasks   │ DFS, Undo    │
 * └─────────────┴──────────────┴──────────────┘
 *
 * =============================================================================
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../shared/VisualizationStyles.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * QueueItem - Đại diện cho một phần tử trong queue.
 */
interface QueueItem {
    id: string;
    value: number;
}

/**
 * QueueVisualizerProps - Props cho component.
 */
interface QueueVisualizerProps {
    /**
     * initialItems: Mảng các giá trị ban đầu cho queue.
     */
    initialItems?: number[];

    /**
     * maxSize: Giới hạn số phần tử tối đa.
     */
    maxSize?: number;

    /**
     * title: Tiêu đề tùy chọn.
     */
    title?: string;

    /**
     * showInfo: Hiển thị thông tin về complexity.
     */
    showInfo?: boolean;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// COMPONENT: QueueVisualizer
// =============================================================================

const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
    initialItems = [],
    maxSize = 8,
    title,
    showInfo = true,
}) => {
    // =========================================================================
    // STATE
    // =========================================================================

    /**
     * queue: Mảng các QueueItem.
     * - Index 0 = FRONT (sẽ được dequeue trước).
     * - Index cuối = REAR (mới được enqueue).
     */
    const [queue, setQueue] = useState<QueueItem[]>(
        initialItems.map(value => ({ id: generateId(), value }))
    );

    const [inputValue, setInputValue] = useState<string>('');
    const [message, setMessage] = useState<string>('Hàng đợi FIFO: Vào trước, Ra trước.');
    const [frontHighlight, setFrontHighlight] = useState(false);

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    const isEmpty = queue.length === 0;
    const isFull = queue.length >= maxSize;
    const frontItem = queue[0];
    // rearItem được tính khi cần, không cần lưu biến

    // =========================================================================
    // ACTION HANDLERS
    // =========================================================================

    /**
     * handleEnqueue - Thêm phần tử vào cuối hàng đợi (REAR).
     *
     * Flow:
     * 1. Validate input.
     * 2. Check queue not full.
     * 3. Create new QueueItem.
     * 4. Add to end of array (REAR of queue).
     */
    const handleEnqueue = useCallback(() => {
        const value = parseInt(inputValue, 10);

        if (isNaN(value)) {
            setMessage('[Lỗi] Vui lòng nhập một số hợp lệ!');
            return;
        }

        if (isFull) {
            setMessage(`[Lỗi] Queue đầy! Tối đa ${maxSize} phần tử.`);
            return;
        }

        const newItem: QueueItem = {
            id: generateId(),
            value,
        };

        setQueue(prev => [...prev, newItem]);
        setInputValue('');
        setMessage(`[ENQUEUE] Thêm ${value} vào cuối hàng đợi (REAR).`);
    }, [inputValue, isFull, maxSize]);

    /**
     * handleDequeue - Lấy và xóa phần tử từ đầu hàng đợi (FRONT).
     *
     * Flow:
     * 1. Check queue not empty.
     * 2. Get front item (index 0).
     * 3. Remove from array (shift).
     */
    const handleDequeue = useCallback(() => {
        if (isEmpty) {
            setMessage('[Lỗi] Queue rỗng! Không thể DEQUEUE.');
            return;
        }

        const dequeuedItem = queue[0];
        setQueue(prev => prev.slice(1));
        setMessage(`[DEQUEUE] Lấy ${dequeuedItem.value} ra khỏi đầu hàng đợi (FRONT).`);
    }, [isEmpty, queue]);

    /**
     * handlePeekFront - Xem phần tử FRONT mà không xóa.
     */
    const handlePeekFront = useCallback(() => {
        if (isEmpty) {
            setMessage('[Lỗi] Queue rỗng! Không có gì để xem.');
            return;
        }

        setFrontHighlight(true);
        setMessage(`[FRONT] Phần tử đầu hàng đợi là ${frontItem.value} (không xóa).`);

        setTimeout(() => setFrontHighlight(false), 1500);
    }, [isEmpty, frontItem]);

    /**
     * handleClear - Xóa toàn bộ queue.
     */
    const handleClear = useCallback(() => {
        setQueue([]);
        setMessage('[Xóa] Đã xóa toàn bộ hàng đợi.');
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEnqueue();
        }
    };

    // =========================================================================
    // ANIMATION VARIANTS
    // =========================================================================

    /**
     * Enqueue: Slide in từ phải (REAR).
     * Dequeue: Slide out sang trái (FRONT).
     */
    const itemVariants = {
        initial: {
            opacity: 0,
            x: 100, // Slide in từ phải
            scale: 0.8,
        },
        animate: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            x: -100, // Slide out sang trái
            scale: 0.8,
            transition: {
                duration: 0.3,
            },
        },
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="viz-container queue-visualizer">
            {/* Header */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || 'Queue (Hàng đợi) - FIFO'}
                    </h2>
                    <p className="viz-subtitle">
                        First In, First Out - Vào trước, Ra trước
                    </p>
                </div>

                <div className="viz-info-badges">
                    <span className="viz-badge"><i className="fi fi-rr-box"></i> Size: {queue.length}/{maxSize}</span>
                    <span className="viz-badge"><i className="fi fi-rr-clock"></i> Enqueue: O(1)</span>
                    <span className="viz-badge"><i className="fi fi-rr-clock"></i> Dequeue: O(1)*</span>
                </div>
            </header>

            {/* Queue Visualization - Horizontal */}
            <div style={{
                padding: '30px 20px',
                background: 'var(--viz-bg-glass)',
                borderRadius: 'var(--viz-border-radius-sm)',
                border: '1px solid var(--viz-border-primary)',
                position: 'relative',
            }}>
                {/* FRONT and REAR Labels */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    padding: '0 10px',
                }}>
                    <div style={{
                        padding: '4px 12px',
                        background: 'var(--viz-color-swapping)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'white',
                    }}>
                        ← FRONT (Dequeue)
                    </div>
                    <div style={{
                        padding: '4px 12px',
                        background: 'var(--viz-color-sorted)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'white',
                    }}>
                        REAR (Enqueue) →
                    </div>
                </div>

                {/* Queue Container - Horizontal */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '80px',
                    padding: '10px',
                    overflowX: 'auto',
                }}>
                    {/* Arrows showing flow direction */}
                    <div style={{
                        fontSize: '1.5rem',
                        color: 'var(--viz-color-swapping)',
                        opacity: isEmpty ? 0.3 : 1,
                    }}>
                        ◄
                    </div>

                    <AnimatePresence mode="popLayout">
                        {queue.map((item, index) => {
                            const isFront = index === 0;
                            const isRear = index === queue.length - 1;
                            const shouldHighlight = isFront && frontHighlight;

                            return (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    layout
                                    style={{
                                        minWidth: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        position: 'relative',
                                        backgroundColor: shouldHighlight
                                            ? 'var(--viz-color-comparing)'
                                            : isFront
                                                ? 'var(--viz-color-swapping)'
                                                : isRear
                                                    ? 'var(--viz-color-sorted)'
                                                    : 'var(--viz-color-normal)',
                                        color: 'white',
                                        boxShadow: shouldHighlight
                                            ? '0 0 20px rgba(251, 191, 36, 0.6)'
                                            : '0 2px 4px rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    {item.value}

                                    {/* Position labels */}
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '-18px',
                                        fontSize: '0.65rem',
                                        color: isFront
                                            ? 'var(--viz-color-swapping)'
                                            : isRear
                                                ? 'var(--viz-color-sorted)'
                                                : 'var(--viz-text-muted)',
                                        fontWeight: isFront || isRear ? 600 : 400,
                                    }}>
                                        {isFront && isRear
                                            ? 'F/R'
                                            : isFront
                                                ? 'FRONT'
                                                : isRear
                                                    ? 'REAR'
                                                    : `[${index}]`}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Empty State */}
                    {isEmpty && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                color: 'var(--viz-text-muted)',
                                fontStyle: 'italic',
                            }}
                        >
                            Hàng đợi rỗng
                        </motion.div>
                    )}

                    <div style={{
                        fontSize: '1.5rem',
                        color: 'var(--viz-color-sorted)',
                        opacity: isEmpty ? 0.3 : 1,
                    }}>
                        ◄
                    </div>
                </div>

                {/* Flow direction indicator */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '0.8rem',
                    color: 'var(--viz-text-muted)',
                }}>
                    ← Hướng di chuyển (FIFO Flow)
                </div>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
            }}>
                {/* Enqueue Input */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flex: '1 1 250px',
                }}>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập số..."
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                            background: 'var(--viz-bg-secondary)',
                            color: 'var(--viz-text-primary)',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEnqueue}
                        disabled={isFull}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isFull
                                ? 'var(--viz-color-inactive)'
                                : 'var(--viz-color-sorted)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: isFull ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        ENQUEUE
                    </motion.button>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flex: '1 1 250px',
                }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDequeue}
                        disabled={isEmpty}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isEmpty
                                ? 'var(--viz-color-inactive)'
                                : 'var(--viz-color-swapping)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: isEmpty ? 'not-allowed' : 'pointer',
                        }}
                    >
                        DEQUEUE
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePeekFront}
                        disabled={isEmpty}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isEmpty
                                ? 'var(--viz-color-inactive)'
                                : 'var(--viz-color-comparing)',
                            color: isEmpty ? 'white' : 'rgba(0,0,0,0.8)',
                            fontWeight: 600,
                            cursor: isEmpty ? 'not-allowed' : 'pointer',
                        }}
                    >
                        FRONT
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClear}
                        disabled={isEmpty}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--viz-border-primary)',
                            background: 'transparent',
                            color: isEmpty
                                ? 'var(--viz-text-muted)'
                                : 'var(--viz-text-secondary)',
                            fontWeight: 500,
                            cursor: isEmpty ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <i className="fi fi-rr-trash"></i>
                    </motion.button>
                </div>
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

            {/* Info Section */}
            {showInfo && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                }}>
                    <div style={{
                        padding: '14px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 6px 0', color: 'var(--viz-color-sorted)', fontSize: '0.9rem' }}>
                            <i className="fi fi-rr-inbox-in"></i> ENQUEUE
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--viz-text-secondary)' }}>
                            Thêm vào REAR. O(1).
                        </p>
                    </div>
                    <div style={{
                        padding: '14px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 6px 0', color: 'var(--viz-color-swapping)', fontSize: '0.9rem' }}>
                            <i className="fi fi-rr-box-alt"></i> DEQUEUE
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--viz-text-secondary)' }}>
                            Lấy từ FRONT. O(1)*.
                        </p>
                    </div>
                    <div style={{
                        padding: '14px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 6px 0', color: 'var(--viz-color-comparing)', fontSize: '0.9rem' }}>
                            <i className="fi fi-rr-eye"></i> FRONT
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--viz-text-secondary)' }}>
                            Xem phần tử đầu. O(1).
                        </p>
                    </div>
                    <div style={{
                        padding: '14px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 6px 0', color: 'var(--viz-color-pointer)', fontSize: '0.9rem' }}>
                            <i className="fi fi-rr-bulb"></i> Ứng dụng
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--viz-text-secondary)' }}>
                            BFS, Task scheduling, Buffers.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// EXPORTS
// =============================================================================

QueueVisualizer.displayName = 'QueueVisualizer';

export default QueueVisualizer;
export { QueueVisualizer };
export type { QueueVisualizerProps };
