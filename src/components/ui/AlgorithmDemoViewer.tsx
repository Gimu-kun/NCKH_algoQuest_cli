/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ALGORITHM DEMO VIEWER - Hiển thị code demos với syntax highlighting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import './AlgorithmDemoViewer.css';

interface DemoInfo {
    name: string;
    path: string;
    description: string;
}

interface AlgorithmInfo {
    name: string;
    complexity?: {
        timeComplexity?: { best: string; average: string; worst: string };
        spaceComplexity?: string;
    };
    advantages?: string[];
    disadvantages?: string[];
    bestUseCases?: string[];
}

interface Props {
    demos: DemoInfo[];
    algorithmInfo?: AlgorithmInfo;
    code?: string;
    onClose?: () => void;
}

export const AlgorithmDemoViewer: React.FC<Props> = ({
    demos,
    algorithmInfo,
    code,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<'code' | 'info' | 'comparison'>('info');
    const [selectedDemo, setSelectedDemo] = useState<DemoInfo | null>(demos[0] || null);

    return (
        <div className="algo-demo-viewer">
            {/* Header */}
            <div className="demo-header">
                <h2>{algorithmInfo?.name || 'Algorithm Demo'}</h2>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>
                        ✕
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="demo-tabs">
                <button
                    className={`tab ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Thông tin
                </button>
                <button
                    className={`tab ${activeTab === 'code' ? 'active' : ''}`}
                    onClick={() => setActiveTab('code')}
                >
                    Code Demo
                </button>
                <button
                    className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comparison')}
                >
                    So sánh
                </button>
            </div>

            {/* Content */}
            <div className="demo-content">
                {activeTab === 'info' && algorithmInfo && (
                    <div className="info-panel">
                        {/* Complexity */}
                        {algorithmInfo.complexity && (
                            <div className="complexity-section">
                                <h3>Độ phức tạp</h3>
                                <div className="complexity-grid">
                                    {algorithmInfo.complexity.timeComplexity && (
                                        <>
                                            <div className="complexity-item">
                                                <span className="label">Best:</span>
                                                <span className="value best">
                                                    {algorithmInfo.complexity.timeComplexity.best}
                                                </span>
                                            </div>
                                            <div className="complexity-item">
                                                <span className="label">Average:</span>
                                                <span className="value average">
                                                    {algorithmInfo.complexity.timeComplexity.average}
                                                </span>
                                            </div>
                                            <div className="complexity-item">
                                                <span className="label">Worst:</span>
                                                <span className="value worst">
                                                    {algorithmInfo.complexity.timeComplexity.worst}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    {algorithmInfo.complexity.spaceComplexity && (
                                        <div className="complexity-item">
                                            <span className="label">Space:</span>
                                            <span className="value">
                                                {algorithmInfo.complexity.spaceComplexity}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Advantages */}
                        {algorithmInfo.advantages && (
                            <div className="pros-cons">
                                <div className="pros">
                                    <h4>✅ Ưu điểm</h4>
                                    <ul>
                                        {algorithmInfo.advantages.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                {algorithmInfo.disadvantages && (
                                    <div className="cons">
                                        <h4>❌ Nhược điểm</h4>
                                        <ul>
                                            {algorithmInfo.disadvantages.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Best Use Cases */}
                        {algorithmInfo.bestUseCases && (
                            <div className="use-cases">
                                <h4>🎯 Khi nào dùng</h4>
                                <ul>
                                    {algorithmInfo.bestUseCases.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="code-panel">
                        {/* Demo Selector */}
                        <div className="demo-selector">
                            {demos.map((demo, i) => (
                                <button
                                    key={i}
                                    className={`demo-btn ${selectedDemo === demo ? 'active' : ''}`}
                                    onClick={() => setSelectedDemo(demo)}
                                >
                                    {demo.name}
                                </button>
                            ))}
                        </div>

                        {/* Description */}
                        {selectedDemo && (
                            <p className="demo-description">{selectedDemo.description}</p>
                        )}

                        {/* Code Display */}
                        <div className="code-display">
                            <pre>
                                <code>{code || '// Code sẽ được load từ file demo'}</code>
                            </pre>
                        </div>
                    </div>
                )}

                {activeTab === 'comparison' && (
                    <div className="comparison-panel">
                        <p>Bảng so sánh với các thuật toán khác sẽ hiển thị ở đây.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlgorithmDemoViewer;
