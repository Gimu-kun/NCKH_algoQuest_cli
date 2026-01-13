/**
 * =============================================================================
 * FILE: BSTVisualizer.tsx
 * =============================================================================
 *
 * MỤC TIÊU (Purpose):
 * - Trực quan hóa cấu trúc dữ liệu Binary Search Tree (Cây nhị phân tìm kiếm).
 * - Minh họa các thao tác: Insert, Search, Traversals (In/Pre/Post-Order).
 * - Giúp user hiểu cách BST tổ chức data và các quy tắc BST.
 *
 * CẤU TRÚC DỮ LIỆU BST (Chi tiết):
 *
 * KHÁI NIỆM (Concept):
 * - BST là cây nhị phân với tính chất đặc biệt về thứ tự.
 * - Mỗi node có tối đa 2 children: LEFT và RIGHT.
 *
 * QUY TẮC BST (BST Property):
 * - Tất cả nodes trong LEFT subtree < node hiện tại.
 * - Tất cả nodes trong RIGHT subtree >= node hiện tại.
 * - Áp dụng đệ quy cho mọi node.
 *
 * CẤU TRÚC NODE:
 *         [value]
 *        /       \
 *   [left]       [right]
 *   < value      >= value
 *
 * CÁC THAO TÁC CƠ BẢN (Operations):
 *
 * 1. INSERT (Chèn):
 *    - Bắt đầu từ root.
 *    - Nếu value < node.value → đi LEFT.
 *    - Nếu value >= node.value → đi RIGHT.
 *    - Khi gặp null → chèn node mới.
 *    - Time: O(log n) balanced, O(n) skewed.
 *
 * 2. SEARCH (Tìm kiếm):
 *    - Tương tự Insert, nhưng so sánh và return khi match.
 *    - Time: O(log n) balanced, O(n) skewed.
 *
 * 3. TRAVERSALS (Duyệt cây):
 *    a. IN-ORDER: Left → Root → Right (Kết quả SORTED!)
 *    b. PRE-ORDER: Root → Left → Right (Dùng để copy tree)
 *    c. POST-ORDER: Left → Right → Root (Dùng để delete tree)
 *
 * ĐỘ PHỨC TẠP (Complexity):
 * ┌──────────────┬────────────────┬────────────────┐
 * │ Operation    │ Balanced BST   │ Skewed BST     │
 * ├──────────────┼────────────────┼────────────────┤
 * │ Insert       │ O(log n)       │ O(n)           │
 * │ Search       │ O(log n)       │ O(n)           │
 * │ Delete       │ O(log n)       │ O(n)           │
 * │ Traversal    │ O(n)           │ O(n)           │
 * └──────────────┴────────────────┴────────────────┘
 *
 * BALANCED vs SKEWED:
 * - Balanced: Height ≈ log(n). Efficient operations.
 * - Skewed: Height ≈ n. Giống như Linked List. Slow!
 *
 * CẢI TIẾN - SELF-BALANCING TREES:
 * 1. AVL Tree: Strict balance, faster lookups.
 * 2. Red-Black Tree: Less strict, faster insertions.
 * 3. B-Tree: For databases, disk-based storage.
 *
 * ỨNG DỤNG THỰC TẾ:
 * 1. Database indexing.
 * 2. File systems.
 * 3. Auto-complete/suggestions.
 * 4. Symbol tables in compilers.
 * 5. Priority queues.
 *
 * =============================================================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../shared/VisualizationStyles.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * TreeNode - Đại diện cho một node trong BST.
 */
interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

/**
 * PositionedNode - Node với thông tin vị trí để render.
 */
interface PositionedNode {
    node: TreeNode;
    x: number;
    y: number;
    level: number;
}

/**
 * TraversalType - Các loại duyệt cây.
 */
type TraversalType = 'inorder' | 'preorder' | 'postorder';

/**
 * BSTVisualizerProps - Props cho component.
 */
interface BSTVisualizerProps {
    /**
     * initialValues: Mảng các giá trị để insert ban đầu.
     */
    initialValues?: number[];

    /**
     * title: Tiêu đề tùy chọn.
     */
    title?: string;

    /**
     * showInfo: Hiển thị thông tin complexity.
     */
    showInfo?: boolean;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * insertNode - Chèn giá trị vào BST (immutable).
 *
 * @param root - Root của tree (hoặc subtree)
 * @param value - Giá trị cần chèn
 * @returns New tree với node được chèn
 */
function insertNode(root: TreeNode | null, value: number): TreeNode {
    if (root === null) {
        return {
            id: generateId(),
            value,
            left: null,
            right: null,
        };
    }

    // Immutable update: tạo copy thay vì modify
    if (value < root.value) {
        return {
            ...root,
            left: insertNode(root.left, value),
        };
    } else {
        return {
            ...root,
            right: insertNode(root.right, value),
        };
    }
}

/**
 * searchPath - Tìm đường đi từ root đến value.
 *
 * @param root - Root của tree
 * @param value - Giá trị cần tìm
 * @returns Mảng các node IDs trên đường đi
 */
function searchPath(root: TreeNode | null, value: number): string[] {
    const path: string[] = [];

    let current = root;
    while (current !== null) {
        path.push(current.id);
        if (current.value === value) {
            break;
        } else if (value < current.value) {
            current = current.left;
        } else {
            current = current.right;
        }
    }

    return path;
}

/**
 * traverseTree - Duyệt cây theo thứ tự được chỉ định.
 *
 * @param root - Root của tree
 * @param type - Loại traversal
 * @returns Mảng các node IDs theo thứ tự duyệt
 */
function traverseTree(root: TreeNode | null, type: TraversalType): string[] {
    if (root === null) return [];

    switch (type) {
        case 'inorder':
            // Left → Root → Right (Kết quả sorted)
            return [
                ...traverseTree(root.left, type),
                root.id,
                ...traverseTree(root.right, type),
            ];
        case 'preorder':
            // Root → Left → Right
            return [
                root.id,
                ...traverseTree(root.left, type),
                ...traverseTree(root.right, type),
            ];
        case 'postorder':
            // Left → Right → Root
            return [
                ...traverseTree(root.left, type),
                ...traverseTree(root.right, type),
                root.id,
            ];
    }
}

/**
 * calculatePositions - Tính vị trí x, y cho mỗi node để render.
 *
 * Sử dụng thuật toán in-order counting:
 * - x position dựa trên in-order index.
 * - y position dựa trên level (depth từ root).
 */
function calculatePositions(root: TreeNode | null): PositionedNode[] {
    const positions: PositionedNode[] = [];
    let xIndex = 0;

    function traverse(node: TreeNode | null, level: number): void {
        if (node === null) return;

        // In-order traversal để tính x
        traverse(node.left, level + 1);

        positions.push({
            node,
            x: xIndex * 70, // 70px spacing horizontal
            y: level * 80,   // 80px spacing vertical
            level,
        });
        xIndex++;

        traverse(node.right, level + 1);
    }

    traverse(root, 0);
    return positions;
}

/**
 * getTreeHeight - Tính chiều cao của cây.
 */
function getTreeHeight(root: TreeNode | null): number {
    if (root === null) return 0;
    return 1 + Math.max(getTreeHeight(root.left), getTreeHeight(root.right));
}

/**
 * countNodes - Đếm số nodes trong cây.
 */
function countNodes(root: TreeNode | null): number {
    if (root === null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}

// =============================================================================
// COMPONENT: BSTVisualizer
// =============================================================================

const BSTVisualizer: React.FC<BSTVisualizerProps> = ({
    initialValues = [],
    title,
    showInfo = true,
}) => {
    // =========================================================================
    // STATE
    // =========================================================================

    /**
     * root: Root node của BST.
     * null = empty tree.
     */
    const [root, setRoot] = useState<TreeNode | null>(() => {
        // Build initial tree
        let tree: TreeNode | null = null;
        for (const value of initialValues) {
            tree = insertNode(tree, value);
        }
        return tree;
    });

    const [inputValue, setInputValue] = useState<string>('');
    const [message, setMessage] = useState<string>('Binary Search Tree: Left < Root <= Right');
    const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
    const [foundNode, setFoundNode] = useState<string | null>(null);
    const [traversalResult, setTraversalResult] = useState<number[]>([]);

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    const positions = useMemo(() => calculatePositions(root), [root]);
    const isEmpty = root === null;
    const treeHeight = useMemo(() => getTreeHeight(root), [root]);
    const nodeCount = useMemo(() => countNodes(root), [root]);

    // Calculate min/max x for centering
    const minX = positions.length > 0 ? Math.min(...positions.map(p => p.x)) : 0;
    const maxX = positions.length > 0 ? Math.max(...positions.map(p => p.x)) : 0;
    const containerWidth = maxX - minX + 100;

    // =========================================================================
    // ACTION HANDLERS
    // =========================================================================

    /**
     * handleInsert - Chèn giá trị mới vào BST.
     */
    const handleInsert = useCallback(async () => {
        const value = parseInt(inputValue, 10);

        if (isNaN(value)) {
            setMessage('[Lỗi] Vui lòng nhập một số hợp lệ!');
            return;
        }

        // Show insertion path
        if (root) {
            setMessage(`🔍 Tìm vị trí để chèn ${value}...`);
            const path = searchPath(root, value);
            for (let i = 0; i < path.length; i++) {
                setHighlightedNodes(path.slice(0, i + 1));
                await new Promise(r => setTimeout(r, 400));
            }
        }

        // Insert the value
        const newRoot = insertNode(root, value);
        setRoot(newRoot);
        setInputValue('');

        // Highlight new node
        const newPositions = calculatePositions(newRoot);
        const newNodePos = newPositions.find(p => p.node.value === value);
        if (newNodePos) {
            setHighlightedNodes([newNodePos.node.id]);
        }

        setMessage(`[INSERT] Đã chèn ${value} vào BST.`);

        setTimeout(() => setHighlightedNodes([]), 1500);
    }, [inputValue, root]);

    /**
     * handleSearch - Tìm kiếm giá trị trong BST.
     */
    const handleSearch = useCallback(async () => {
        const value = parseInt(inputValue, 10);

        if (isNaN(value)) {
            setMessage('[Lỗi] Vui lòng nhập số cần tìm!');
            return;
        }

        if (isEmpty) {
            setMessage('[Lỗi] Cây rỗng!');
            return;
        }

        setMessage(`🔍 Đang tìm kiếm ${value}...`);
        setFoundNode(null);

        const path = searchPath(root, value);

        // Animate through path
        for (let i = 0; i < path.length; i++) {
            setHighlightedNodes(path.slice(0, i + 1));
            await new Promise(r => setTimeout(r, 500));
        }

        // Check if found
        const foundPosition = positions.find(
            p => p.node.value === value && path.includes(p.node.id)
        );

        if (foundPosition) {
            setFoundNode(foundPosition.node.id);
            setMessage(`[TÌM THẤY] ${value}! Đi qua ${path.length} nodes.`);
        } else {
            setMessage(`[KHÔNG TÌM THẤY] ${value}. Đã kiểm tra ${path.length} nodes.`);
        }

        setTimeout(() => {
            setHighlightedNodes([]);
            setFoundNode(null);
        }, 2000);
    }, [inputValue, isEmpty, root, positions]);

    /**
     * handleTraversal - Thực hiện duyệt cây.
     */
    const handleTraversal = useCallback(async (type: TraversalType) => {
        if (isEmpty) {
            setMessage('[Lỗi] Cây rỗng!');
            return;
        }

        const typeNames: Record<TraversalType, string> = {
            inorder: 'IN-ORDER (Left → Root → Right)',
            preorder: 'PRE-ORDER (Root → Left → Right)',
            postorder: 'POST-ORDER (Left → Right → Root)',
        };

        setMessage(`[Duyệt] ${typeNames[type]}...`);
        setTraversalResult([]);

        const traversalOrder = traverseTree(root, type);
        const results: number[] = [];

        for (let i = 0; i < traversalOrder.length; i++) {
            setHighlightedNodes([traversalOrder[i]]);

            // Find the value for this node
            const pos = positions.find(p => p.node.id === traversalOrder[i]);
            if (pos) {
                results.push(pos.node.value);
                setTraversalResult([...results]);
            }

            await new Promise(r => setTimeout(r, 600));
        }

        setHighlightedNodes([]);
        setMessage(`[Hoàn thành] ${typeNames[type]}!`);
    }, [isEmpty, root, positions]);

    /**
     * handleClear - Xóa toàn bộ cây.
     */
    const handleClear = useCallback(() => {
        setRoot(null);
        setTraversalResult([]);
        setMessage('[Xóa] Đã xóa toàn bộ BST.');
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleInsert();
        }
    };

    // =========================================================================
    // RENDER HELPERS
    // =========================================================================

    /**
     * renderEdges - Render các đường nối giữa parent và children.
     */
    const renderEdges = () => {
        const edges: React.ReactNode[] = [];

        for (const pos of positions) {
            const { node, x, y } = pos;

            // Render edge to left child
            if (node.left) {
                const childPos = positions.find(p => p.node.id === node.left!.id);
                if (childPos) {
                    edges.push(
                        <motion.line
                            key={`edge-${node.id}-${node.left.id}`}
                            x1={x - minX + 50}
                            y1={y + 25}
                            x2={childPos.x - minX + 50}
                            y2={childPos.y + 25}
                            stroke={highlightedNodes.includes(node.left.id)
                                ? 'var(--viz-color-comparing)'
                                : 'var(--viz-border-primary)'}
                            strokeWidth={2}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    );
                }
            }

            // Render edge to right child
            if (node.right) {
                const childPos = positions.find(p => p.node.id === node.right!.id);
                if (childPos) {
                    edges.push(
                        <motion.line
                            key={`edge-${node.id}-${node.right.id}`}
                            x1={x - minX + 50}
                            y1={y + 25}
                            x2={childPos.x - minX + 50}
                            y2={childPos.y + 25}
                            stroke={highlightedNodes.includes(node.right.id)
                                ? 'var(--viz-color-comparing)'
                                : 'var(--viz-border-primary)'}
                            strokeWidth={2}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    );
                }
            }
        }

        return edges;
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="viz-container bst-visualizer">
            {/* Header */}
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">
                        {title || 'Binary Search Tree (Cây nhị phân tìm kiếm)'}
                    </h2>
                    <p className="viz-subtitle">
                        Left subtree &lt; Node &lt;= Right subtree
                    </p>
                </div>

                <div className="viz-info-badges">
                    <span className="viz-badge"><i className="fi fi-rr-tree"></i> Nodes: {nodeCount}</span>
                    <span className="viz-badge"><i className="fi fi-rr-ruler-combined"></i> Height: {treeHeight}</span>
                    <span className="viz-badge"><i className="fi fi-rr-clock"></i> Search: O(log n)</span>
                </div>
            </header>

            {/* Tree Visualization */}
            <div style={{
                padding: '20px',
                background: 'var(--viz-bg-glass)',
                borderRadius: 'var(--viz-border-radius-sm)',
                border: '1px solid var(--viz-border-primary)',
                minHeight: '300px',
                overflowX: 'auto',
            }}>
                {isEmpty ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '200px',
                        color: 'var(--viz-text-muted)',
                        fontStyle: 'italic',
                    }}>
                        Cây rỗng. Hãy INSERT để thêm nodes!
                    </div>
                ) : (
                    <svg
                        width={containerWidth + 100}
                        height={treeHeight * 80 + 60}
                        style={{ display: 'block', margin: '0 auto' }}
                    >
                        {/* Edges */}
                        {renderEdges()}

                        {/* Nodes */}
                        <AnimatePresence>
                            {positions.map(({ node, x, y }) => {
                                const isHighlighted = highlightedNodes.includes(node.id);
                                const isFound = foundNode === node.id;
                                const isRoot = node.id === root?.id;

                                return (
                                    <motion.g
                                        key={node.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    >
                                        {/* Node circle */}
                                        <motion.circle
                                            cx={x - minX + 50}
                                            cy={y + 25}
                                            r={22}
                                            fill={isFound
                                                ? 'var(--viz-color-found)'
                                                : isHighlighted
                                                    ? 'var(--viz-color-comparing)'
                                                    : 'var(--viz-color-normal)'}
                                            stroke={isRoot
                                                ? 'var(--viz-color-pointer)'
                                                : 'rgba(255,255,255,0.2)'}
                                            strokeWidth={isRoot ? 3 : 1}
                                            animate={{
                                                scale: isHighlighted ? 1.15 : 1,
                                            }}
                                            style={{
                                                filter: isHighlighted || isFound
                                                    ? 'drop-shadow(0 0 10px currentColor)'
                                                    : 'none',
                                            }}
                                        />

                                        {/* Node value */}
                                        <text
                                            x={x - minX + 50}
                                            y={y + 30}
                                            textAnchor="middle"
                                            fill={isFound || isHighlighted ? 'rgba(0,0,0,0.8)' : 'white'}
                                            fontSize="14"
                                            fontWeight="600"
                                        >
                                            {node.value}
                                        </text>

                                        {/* Root label */}
                                        {isRoot && (
                                            <text
                                                x={x - minX + 50}
                                                y={y - 5}
                                                textAnchor="middle"
                                                fill="var(--viz-color-pointer)"
                                                fontSize="10"
                                                fontWeight="600"
                                            >
                                                ROOT
                                            </text>
                                        )}
                                    </motion.g>
                                );
                            })}
                        </AnimatePresence>
                    </svg>
                )}
            </div>

            {/* Traversal Result */}
            {traversalResult.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '12px 16px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-color-found)',
                    }}
                >
                    <span style={{ color: 'var(--viz-text-secondary)', marginRight: '8px' }}>
                        Kết quả:
                    </span>
                    <span style={{ color: 'var(--viz-color-found)', fontWeight: 600 }}>
                        [{traversalResult.join(', ')}]
                    </span>
                </motion.div>
            )}

            {/* Controls */}
            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
            }}>
                {/* Insert/Search Input */}
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

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInsert}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--viz-color-sorted)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    INSERT
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSearch}
                    disabled={isEmpty}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isEmpty ? 'var(--viz-color-inactive)' : 'var(--viz-color-found)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: isEmpty ? 'not-allowed' : 'pointer',
                    }}
                >
                    SEARCH
                </motion.button>

                <div style={{ width: '1px', background: 'var(--viz-border-primary)', margin: '0 4px' }} />

                {/* Traversal Buttons */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTraversal('inorder')}
                    disabled={isEmpty}
                    style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isEmpty ? 'var(--viz-color-inactive)' : 'var(--viz-color-comparing)',
                        color: isEmpty ? 'white' : 'rgba(0,0,0,0.8)',
                        fontWeight: 600,
                        cursor: isEmpty ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                    }}
                >
                    In-Order
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTraversal('preorder')}
                    disabled={isEmpty}
                    style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isEmpty ? 'var(--viz-color-inactive)' : 'var(--viz-color-pointer)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: isEmpty ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                    }}
                >
                    Pre-Order
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTraversal('postorder')}
                    disabled={isEmpty}
                    style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isEmpty ? 'var(--viz-color-inactive)' : 'var(--viz-color-swapping)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: isEmpty ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                    }}
                >
                    Post-Order
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    disabled={isEmpty}
                    style={{
                        marginLeft: 'auto',
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
                    gap: '10px',
                }}>
                    <div style={{
                        padding: '12px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--viz-color-comparing)', fontSize: '0.85rem' }}>
                            <i className="fi fi-rr-refresh"></i> In-Order
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--viz-text-secondary)' }}>
                            L → Root → R. Kết quả SORTED!
                        </p>
                    </div>
                    <div style={{
                        padding: '12px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--viz-color-pointer)', fontSize: '0.85rem' }}>
                            <i className="fi fi-rr-refresh"></i> Pre-Order
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--viz-text-secondary)' }}>
                            Root → L → R. Dùng copy tree.
                        </p>
                    </div>
                    <div style={{
                        padding: '12px',
                        background: 'var(--viz-bg-glass)',
                        borderRadius: '8px',
                        border: '1px solid var(--viz-border-primary)',
                    }}>
                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--viz-color-swapping)', fontSize: '0.85rem' }}>
                            <i className="fi fi-rr-refresh"></i> Post-Order
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--viz-text-secondary)' }}>
                            L → R → Root. Dùng delete tree.
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

BSTVisualizer.displayName = 'BSTVisualizer';

export default BSTVisualizer;
export { BSTVisualizer };
export type { BSTVisualizerProps };
