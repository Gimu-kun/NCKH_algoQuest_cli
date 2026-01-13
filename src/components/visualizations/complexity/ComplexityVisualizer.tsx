import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../shared/VisualizationStyles.css';

interface ComplexityVisualizerProps {
    onRegenerate?: () => void;
}

const ComplexityVisualizer: React.FC<ComplexityVisualizerProps> = () => {
    const [selectedComplexity, setSelectedComplexity] = useState<string>('O(1)');

    const complexities = [
        {
            id: 'O(1)',
            name: 'O(1) - Constant Time',
            description: 'Thời gian thực hiện KHÔNG phụ thuộc vào kích thước đầu vào (n).',
            example: 'Truy cập mảng theo index, phép cộng trừ.',
            code: `function accessElement(arr, index) {
    // Luôn chỉ mất 1 bước thực hiện
    return arr[index];
}`
        },
        {
            id: 'O(log n)',
            name: 'O(log n) - Logarithmic Time',
            description: 'Thời gian tăng rất chậm. Mỗi bước giảm một nửa không gian tìm kiếm.',
            example: 'Binary Search (Tìm kiếm nhị phân).',
            code: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        // Chia đôi không gian tìm kiếm
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
        },
        {
            id: 'O(n)',
            name: 'O(n) - Linear Time',
            description: 'Thời gian tăng TỈ LỆ THUẬN với kích thước đầu vào.',
            example: 'Duyệt mảng, Linear Search.',
            code: `function linearSearch(arr, target) {
    // Duyệt qua từng phần tử -> n bước
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}`
        },
        {
            id: 'O(n log n)',
            name: 'O(n log n) - Linearithmic',
            description: 'Thường thấy trong các thuật toán sắp xếp hiệu quả.',
            example: 'Merge Sort, Quick Sort, Heap Sort.',
            code: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    // Chia đôi (log n) * Trộn lại (n)
    const mid = Math.floor(arr.length / 2);
    // ... Recursive calls ...
}`
        },
        {
            id: 'O(n^2)',
            name: 'O(n²) - Quadratic Time',
            description: 'Thời gian tăng theo BÌNH PHƯƠNG kích thước đầu vào.',
            example: 'Bubble Sort, Nested Loops.',
            code: `function printPairs(arr) {
    const n = arr.length;
    // 2 vòng lặp lồng nhau -> n * n bước
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            console.log(arr[i], arr[j]);
        }
    }
}`
        }
    ];

    const current = complexities.find(c => c.id === selectedComplexity);

    return (
        <div className="viz-container complexity-visualizer">
            <header className="viz-header">
                <div>
                    <h2 className="viz-title">Độ Phức Tạp Thuật Toán (Time Complexity)</h2>
                    <p className="viz-subtitle">Khái niệm Big O Notation và ví dụ minh họa</p>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '20px', height: '100%', minHeight: '400px' }}>
                {/* Sidebar list */}
                <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {complexities.map(c => (
                        <motion.button
                            key={c.id}
                            onClick={() => setSelectedComplexity(c.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                padding: '15px',
                                borderRadius: '8px',
                                border: '1px solid var(--viz-border-primary)',
                                background: selectedComplexity === c.id ? 'var(--viz-bg-secondary)' : 'transparent',
                                color: selectedComplexity === c.id ? 'var(--viz-color-pointer)' : 'var(--viz-text-primary)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{c.id}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{c.name.split(' - ')[1]}</div>
                        </motion.button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {current && (
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                padding: '20px',
                                background: 'var(--viz-bg-glass)',
                                borderRadius: '12px',
                                border: '1px solid var(--viz-border-primary)',
                                flex: 1
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--viz-color-pointer)' }}>
                                {current.name}
                            </h3>
                            <p style={{ fontSize: '1.1rem', marginBottom: '15px', lineHeight: '1.6' }}>
                                {current.description}
                            </p>
                            <div style={{
                                padding: '10px 15px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '6px',
                                marginBottom: '20px'
                            }}>
                                <strong>Ví dụ:</strong> {current.example}
                            </div>

                            <div className="viz-code-display" style={{
                                flex: 1,
                                overflow: 'auto',
                                padding: '20px',
                                borderRadius: '8px',
                                background: '#1e1e1e',
                                fontFamily: 'monospace',
                                border: '1px solid #333'
                            }}>
                                <pre style={{ margin: 0, color: '#d4d4d4' }}>
                                    {current.code}
                                </pre>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplexityVisualizer;
