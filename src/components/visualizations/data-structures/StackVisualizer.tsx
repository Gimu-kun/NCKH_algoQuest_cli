/**
 * =============================================================================
 * FILE: StackVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa cấu trúc dữ liệu Stack (Ngăn xếp).
 * - Minh họa các thao tác: Push, Pop, Peek.
 * - Giúp user hiểu nguyên tắc LIFO (Last In, First Out).
 *
 * CẤU TRÚC DỮ LIỆU STACK (Chi tiết):
 *
 * KHÁI NIỆM (Concept):
 * - Stack là cấu trúc dữ liệu tuyến tính theo nguyên tắc LIFO.
 * - LIFO = Last In, First Out = Vào sau, Ra trước.
 * - Tưởng tượng như chồng đĩa: Chỉ có thể lấy đĩa trên cùng.
 *
 * CÁC THAO TÁC CƠ BẢN (Operations):
 *
 * 1. PUSH (Thêm vào đỉnh):
 *    - Thêm phần tử mới vào đỉnh (top) của stack.
 *    - Time Complexity: O(1).
 *    - Không có giới hạn về size (với dynamic array).
 *
 * 2. POP (Lấy ra từ đỉnh):
 *    - Lấy và xóa phần tử ở đỉnh stack.
 *    - Time Complexity: O(1).
 *    - Trả về giá trị hoặc undefined nếu stack rỗng.
 *
 * 3. PEEK/TOP (Xem đỉnh):
 *    - Xem phần tử đỉnh mà KHÔNG xóa.
 *    - Time Complexity: O(1).
 *
 * 4. isEmpty (Kiểm tra rỗng):
 *    - Kiểm tra stack có rỗng không.
 *    - Time Complexity: O(1).
 *
 * ĐỘ PHỨC TẠP (Complexity):
 * ┌──────────────┬──────────────┐
 * │ Operation    │ Time         │
 * ├──────────────┼──────────────┤
 * │ Push         │ O(1)         │
 * │ Pop          │ O(1)         │
 * │ Peek         │ O(1)         │
 * │ isEmpty      │ O(1)         │
 * │ Search       │ O(n)         │
 * └──────────────┴──────────────┘
 * Space Complexity: O(n) - n là số phần tử trong stack.
 *
 * ỨNG DỤNG THỰC TẾ (Real-world Applications):
 * 1. Undo/Redo: Lưu các thao tác để hoàn tác.
 * 2. Call Stack: Quản lý function calls trong programming.
 * 3. Expression Evaluation: Tính toán biểu thức (postfix, prefix).
 * 4. Backtracking: DFS, giải maze, Sudoku solver.
 * 5. Browser History: Back button.
 * 6. Parentheses Matching: Kiểm tra ngoặc hợp lệ.
 *
 * IMPLEMENTATION METHODS:
 * 1. Array-based: Dùng dynamic array. Đơn giản, cache-friendly.
 * 2. Linked List-based: Dùng linked list. Flexible size, overhead pointer.
 *
 * SO SÁNH VỚI QUEUE:
 * ┌─────────────┬──────────────┬──────────────┐
 * │ Tiêu chí    │ Stack        │ Queue        │
 * ├─────────────┼──────────────┼──────────────┤
 * │ Principle   │ LIFO         │ FIFO         │
 * │ Add         │ Push (top)   │ Enqueue (rear)│
 * │ Remove      │ Pop (top)    │ Dequeue (front)│
 * │ Real-world  │ Plates stack │ Checkout line │
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
 * StackItem - Đại diện cho một phần tử trong stack.
 */
interface StackItem {
    /**
     * id: Unique identifier cho mỗi item.
     * Dùng làm key cho AnimatePresence.
     */
    id: string;

    /**
     * value: Giá trị của item.
     */
    value: number;
}

/**
 * StackAction - Các action có thể thực hiện trên stack.
 */
type StackAction = 'push' | 'pop' | 'peek' | 'idle';

/**
 * StackVisualizerProps - Props cho component.
 */
interface StackVisualizerProps {
    /**
     * initialItems: Mảng các giá trị ban đầu cho stack.
     * Optional, default = mảng rỗng.
     */
    initialItems?: number[];

    /**
     * maxSize: Giới hạn số phần tử tối đa.
     * Optional, default = 10.
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

/**
 * generateId - Tạo unique ID cho stack item.
 * Dùng timestamp + random để đảm bảo unique.
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// COMPONENT: StackVisualizer
// =============================================================================

const StackVisualizer: React.FC<StackVisualizerProps> = ({
    initialItems = [],
    maxSize = 10,
    title,
    showInfo = true,
}) => {
    // =========================================================================
    // STATE
    // =========================================================================

    /**
     * stack: Mảng các StackItem.
     * Item cuối cùng trong mảng = đỉnh stack (top).
     */
    const [stack, setStack] = useState<StackItem[]>(
        initialItems.map(value => ({ id: generateId(), value }))
    );

    /**
     * inputValue: Giá trị trong input field để push.
     */
    const [inputValue, setInputValue] = useState<string>('');

    /**
     * currentAction: Action hiện tại đang thực hiện.
     * Dùng để highlight và animate.
     */
    const [currentAction, setCurrentAction] = useState<StackAction>('idle');

    /**
     * message: Thông báo kết quả của action gần nhất.
     */
    const [message, setMessage] = useState<string>('Sẵn sàng. Hãy thử các thao tác!');

    /**
     * peekHighlight: Có đang highlight top item để peek không.
     */
    const [peekHighlight, setPeekHighlight] = useState(false);

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    const isEmpty = stack.length === 0;
    const isFull = stack.length >= maxSize;
    const topItem = stack[stack.length - 1];

    // =========================================================================
    // ACTION HANDLERS
    // =========================================================================

    /**
     * handlePush - Thêm phần tử mới vào đỉnh stack.
     *
     * Flow:
     * 1. Validate input.
     * 2. Check stack not full.
     * 3. Create new StackItem.
     * 4. Add to end of array (top of stack).
     * 5. Animate with Framer Motion.
     */
    const handlePush = useCallback(() => {
        const value = parseInt(inputValue, 10);

        // Validation
        if (isNaN(value)) {
            setMessage('[Lỗi] Vui lòng nhập một số hợp lệ!');
            return;
        }

        if (isFull) {
            setMessage(`[Lỗi] Stack đầy! Tối đa ${maxSize} phần tử.`);
            return;
        }

        // Create new item
        const newItem: StackItem = {
            id: generateId(),
            value,
        };

        // Update state
        setCurrentAction('push');
        setStack(prev => [...prev, newItem]);
        setInputValue('');
        setMessage(`[PUSH] Thêm ${value} vào đỉnh stack.`);

        // Reset action sau animation
        setTimeout(() => setCurrentAction('idle'), 500);
    }, [inputValue, isFull, maxSize]);

    /**
     * handlePop - Lấy và xóa phần tử từ đỉnh stack.
     *
     * Flow:
     * 1. Check stack not empty.
     * 2. Get top item (last in array).
     * 3. Remove from array.
     * 4. Animate exit with Framer Motion.
     * 5. Return/display value.
     */
    const handlePop = useCallback(() => {
        if (isEmpty) {
            setMessage('[Lỗi] Stack rỗng! Không thể POP.');
            return;
        }

        const poppedItem = stack[stack.length - 1];

        setCurrentAction('pop');
        setStack(prev => prev.slice(0, -1));
        setMessage(`[POP] Lấy ${poppedItem.value} ra khỏi stack.`);

        setTimeout(() => setCurrentAction('idle'), 500);
    }, [isEmpty, stack]);

    /**
     * handlePeek - Xem phần tử đỉnh mà không xóa.
     *
     * Flow:
     * 1. Check stack not empty.
     * 2. Highlight top item.
     * 3. Display value.
     * 4. Remove highlight sau 1 giây.
     */
    const handlePeek = useCallback(() => {
        if (isEmpty) {
            setMessage('[Lỗi] Stack rỗng! Không có gì để PEEK.');
            return;
        }

        setCurrentAction('peek');
        setPeekHighlight(true);
        setMessage(`[PEEK] Phần tử đỉnh là ${topItem.value} (không xóa).`);

        setTimeout(() => {
            setCurrentAction('idle');
            setPeekHighlight(false);
        }, 1500);
    }, [isEmpty, topItem]);

    /**
     * handleClear - Xóa toàn bộ stack.
     */
    const handleClear = useCallback(() => {
        setStack([]);
        setMessage('[Xóa] Đã xóa toàn bộ stack.');
    }, []);

    /**
     * handleKeyPress - Xử lý Enter key để push.
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handlePush();
        }
    };

    // =========================================================================
    // ANIMATION VARIANTS
    // =========================================================================

    /**
     * itemVariants - Animation config cho stack items.
     *
     * - initial: Trạng thái khi mới xuất hiện (push).
     * - animate: Trạng thái bình thường.
     * - exit: Trạng thái khi bị xóa (pop).
     */
    const itemVariants = {
        initial: {
            opacity: 0,
            y: -50,
            scale: 0.8,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            x: 100,
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
        <div className="viz-container stack-visualizer">
            {/* Header */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || 'Stack (Ngăn xếp) - LIFO'}
                    </h2>
                    <p className="viz-subtitle">
                        Last In, First Out - Vào sau, Ra trước
                    </p>
                </div>

                <div className="viz-info-badges">
                    <span className="viz-badge"><i className="fi fi-rr-box"></i> Size: {stack.length}/{maxSize}</span>
                    <span className="viz-badge">
                        <i className="fi fi-rr-clock"></i> Push/Pop: O(1)
                    </span>
                </div>
            </header>

            {/* Main Content: Stack + Controls side by side */}
            <div style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
            }}>
                {/* Stack Visualization - Vertical */}
                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--viz-bg-glass)',
                    borderRadius: 'var(--viz-border-radius-sm)',
                    border: '1px solid var(--viz-border-primary)',
                    minHeight: '350px',
                    position: 'relative',
                }}>
                    {/* TOP Label */}
                    {!isEmpty && (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            padding: '4px 12px',
                            background: 'var(--viz-color-pointer)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'white',
                        }}>
                            TOP ↘
                        </div>
                    )}

                    {/* Stack Container - Items stack from bottom */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column-reverse', // Bottom to top
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '40px 0 20px 0',
                        width: '100%',
                    }}>
                        <AnimatePresence mode="popLayout">
                            {stack.map((item, index) => {
                                const isTop = index === stack.length - 1;
                                const shouldHighlight = isTop && (peekHighlight || currentAction === 'push');

                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        layout
                                        style={{
                                            width: '120px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            position: 'relative',
                                            backgroundColor: shouldHighlight
                                                ? 'var(--viz-color-comparing)'
                                                : isTop
                                                    ? 'var(--viz-color-found)'
                                                    : 'var(--viz-color-normal)',
                                            color: shouldHighlight || isTop
                                                ? 'rgba(0,0,0,0.8)'
                                                : 'white',
                                            boxShadow: shouldHighlight
                                                ? '0 0 20px rgba(251, 191, 36, 0.6)'
                                                : isTop
                                                    ? '0 0 10px rgba(6, 182, 212, 0.4)'
                                                    : '0 2px 4px rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        {item.value}

                                        {/* Index label */}
                                        <span style={{
                                            position: 'absolute',
                                            right: '-30px',
                                            fontSize: '0.7rem',
                                            color: 'var(--viz-text-muted)',
                                        }}>
                                            [{index}]
                                        </span>

                                        {/* TOP indicator */}
                                        {isTop && (
                                            <span style={{
                                                position: 'absolute',
                                                left: '-40px',
                                                fontSize: '0.75rem',
                                                color: 'var(--viz-color-pointer)',
                                                fontWeight: 600,
                                            }}>
                                                TOP →
                                            </span>
                                        )}
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
                                    color: 'var(--viz-text-muted)',
                                    fontStyle: 'italic',
                                }}
                            >
                                Stack rỗng
                            </motion.div>
                        )}
                    </div>

                    {/* Base of stack */}
                    <div style={{
                        width: '140px',
                        height: '10px',
                        background: 'var(--viz-border-primary)',
                        borderRadius: '0 0 8px 8px',
                    }} />
                </div>

                {/* Controls */}
                <div style={{
                    width: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}>
                    {/* Push Input */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
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
                            onClick={handlePush}
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
                            }}
                        >
                            PUSH
                        </motion.button>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                    }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePop}
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
                            POP
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePeek}
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
                            PEEK
                        </motion.button>
                    </div>

                    {/* Clear Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClear}
                        disabled={isEmpty}
                        style={{
                            padding: '10px',
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
                        <i className="fi fi-rr-trash"></i> Xóa tất cả
                    </motion.button>

                    {/* Message */}
                    <motion.div
                        key={message}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'var(--viz-bg-glass)',
                            border: '1px solid var(--viz-border-primary)',
                            fontSize: '0.9rem',
                            color: 'var(--viz-text-primary)',
                            minHeight: '50px',
                        }}
                    >
                        {message}
                    </motion.div>
                </div>
            </div>

            {/* Info Section */}
            {showInfo && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginTop: '16px',
                }}>
                    <div style={{
                        padding: '16px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: 'var(--viz-color-sorted)' }}>
                            <i className="fi fi-rr-inbox-in"></i> PUSH
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--viz-text-secondary)' }}>
                            Thêm phần tử mới vào đỉnh (top) stack. O(1) time.
                        </p>
                    </div>
                    <div style={{
                        padding: '16px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: 'var(--viz-color-swapping)' }}>
                            <i className="fi fi-rr-box-alt"></i> POP
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--viz-text-secondary)' }}>
                            Lấy và xóa phần tử đỉnh. O(1) time. LIFO principle.
                        </p>
                    </div>
                    <div style={{
                        padding: '16px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: 'var(--viz-color-comparing)' }}>
                            <i className="fi fi-rr-eye"></i> PEEK
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--viz-text-secondary)' }}>
                            Xem phần tử đỉnh mà không xóa. O(1) time.
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

StackVisualizer.displayName = 'StackVisualizer';

export default StackVisualizer;
export { StackVisualizer };
export type { StackVisualizerProps };
