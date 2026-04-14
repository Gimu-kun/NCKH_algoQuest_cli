/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * STUDY MATERIALS PAGE - Timeline Roadmap & Inline Demos
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * DESIGN:
 * - Timeline Layout: Dọc theo chiều trang (Vertical Timeline).
 * - Nodes: 
 *   + Chapter Node (Large Circle)
 *   + Lesson Node (Small Circle)
 * - Interaction:
 *   + Click Lesson Node -> Expand Inline Card (Accordion style).
 *   + Card contains: Theory + Embedded Demo.
 * - Scroll: Page scroll is maintained. No modals.
 * 
 * @component StudyMaterialsPage
 * @category Dev Tools
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { ALGO_REGISTRY, type AlgoMetadata } from '../data/algo_registry';
import { MarkdownViewer } from '../components/ui/MarkdownViewer';
import { THEORY_CONTENT } from '../data/theory_content';

// Import Visualizers for Embedded Demos
import SortingVisualizer from '../components/visualizations/sorting/SortingVisualizer';
import BinarySearchVisualizer from '../components/visualizations/searching/BinarySearchVisualizer';
import LinearSearchVisualizer from '../components/visualizations/searching/LinearSearchVisualizer';
import StackVisualizer from '../components/visualizations/data-structures/StackVisualizer';
import QueueVisualizer from '../components/visualizations/data-structures/QueueVisualizer';
import LinkedListVisualizer from '../components/visualizations/data-structures/LinkedListVisualizer';
import BSTVisualizer from '../components/visualizations/data-structures/BSTVisualizer';
import GraphVisualizer from '../components/visualizations/graph/GraphVisualizer';
import DPVisualizer from '../components/visualizations/dp/DPVisualizer';
import ComplexityVisualizer from '../components/visualizations/complexity/ComplexityVisualizer';

// -----------------------------------------------------------------------------
// COMPONENT: Embedded Demo Player
// -----------------------------------------------------------------------------

const DemoPlayer: React.FC<{ algo: AlgoMetadata }> = ({ algo }) => {
    const [vizArray, setVizArray] = useState<number[]>([]);
    const [vizTarget, setVizTarget] = useState<number>(0);
    const [vizKey, setVizKey] = useState<number>(0);
    const [vizGraphData, setVizGraphData] = useState<any>(null);

    // Initialize
    useEffect(() => {
        handleRegenerate();
    }, [algo]);

    const handleRegenerate = useCallback(() => {
        let newArray: number[] = [];

        if (algo.inputType === 'number') {
            setVizTarget(Math.floor(Math.random() * 14) + 2);
            setVizKey(k => k + 1);
            return;
        }

        if (algo.visualization === 'graph') {
            // Simple static graph for demo
            setVizGraphData({
                nodes: [{ id: 0, x: 250, y: 50, label: '0' }, { id: 1, x: 150, y: 150, label: '1' }, { id: 2, x: 350, y: 150, label: '2' }],
                edges: [{ source: 0, target: 1 }, { source: 0, target: 2 }],
                adjList: { 0: [1, 2], 1: [0], 2: [0] }
            });
            setVizKey(k => k + 1);
            return;
        }

        const length = algo.visualization === 'sorting' ? 7 : 10;
        newArray = Array.from({ length }, () => Math.floor(Math.random() * 50) + 1);

        if (['binarySearch', 'bst'].includes(algo.id)) newArray.sort((a, b) => a - b);

        setVizArray(newArray);

        if (algo.inputType === 'array_target') {
            const target = newArray[Math.floor(Math.random() * length)] || 10;
            setVizTarget(target);
        }

        setVizKey(k => k + 1);
    }, [algo]);

    const renderViz = () => {
        const props = {
            key: `${algo.id}-${vizKey}`,
            autoStart: false,
            onRegenerate: handleRegenerate,
            initialArray: vizArray,
            array: vizArray,
            target: vizTarget,
            initialItems: vizArray,
            initialValues: vizArray,
            algorithm: (algo as any).sortingType || (algo as any).graphType || (algo as any).dpType,
            graphData: vizGraphData
        };

        switch (algo.visualization) {
            case 'sorting': return <SortingVisualizer {...props} />;
            case 'binarySearch': return <BinarySearchVisualizer {...props} />;
            case 'linearSearch': return <LinearSearchVisualizer {...props} />;
            case 'stack': return <StackVisualizer {...props} maxSize={8} />;
            case 'queue': return <QueueVisualizer {...props} maxSize={8} />;
            case 'linkedList': return <LinkedListVisualizer {...props} maxSize={8} />;
            case 'bst': return <BSTVisualizer {...props} />;
            case 'graph': return <GraphVisualizer {...props} />;
            case 'dp': return <DPVisualizer {...props} />;
            case 'complexity': return <ComplexityVisualizer {...props} />;
            default: return <div className="p-4 text-gray-500">Visualization not available</div>;
        }
    };

    return (
        <div className="embedded-demo">
            <div className="demo-header-controls">
                <span className="demo-label">DEMO TRỰC QUAN</span>
                <button onClick={handleRegenerate} className="refresh-btn">
                    <i className="fi fi-rr-refresh"></i> Tạo Mới
                </button>
            </div>
            <div className="viz-container">
                {renderViz()}
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// SUB-COMPONENTS: Timeline Nodes
// -----------------------------------------------------------------------------

// Import Exercise Data
import { SORTING_CHALLENGES, SORTING_QUIZ } from '../data/study_materials/chapter2_sorting_searching/exercises';
import ExerciseRunner from '../components/ui/ExerciseRunner';
import { QuizRunner, type QuizQuestion } from '../components/ui/QuizRunner';

const LessonCard: React.FC<{ algo: AlgoMetadata }> = ({ algo }) => {
    const [activeTab, setActiveTab] = useState<'learn' | 'demo' | 'quiz' | 'practice'>('learn');

    // Default to 'learn' tab. If not theory-only, maybe 'demo' or 'learn' is fine.

    // MOCK DATA MAPPING (In real app, this should be in a centralized store or registry)
    const getPracticeData = () => {
        // Simple mapping based on ID or Type
        if (algo.id === 'bubbleSort') return SORTING_CHALLENGES.find(c => c.id === 'ch2-sort1');
        if (algo.id === 'binarySearch') return SORTING_CHALLENGES.find(c => c.id === 'ch2-sort2');
        if (algo.visualization === 'sorting') return SORTING_CHALLENGES[0]; // Fallback
        return null;
    };

    const getQuizData = () => {
        if (algo.visualization === 'sorting') return SORTING_QUIZ[0];
        return null;
    };

    const practiceData = getPracticeData();
    const quizData = getQuizData();

    return (
        <motion.div
            className="lesson-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-custom-tabs">
                <button
                    className={`custom-tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
                    onClick={() => setActiveTab('learn')}
                >
                    <i className="fi fi-rr-book-alt"></i> Lý Thuyết
                </button>
                {algo.inputType !== 'none' && (
                    <button
                        className={`custom-tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('demo')}
                    >
                        <i className="fi fi-rr-play-alt"></i> Minh Họa
                    </button>
                )}
                <button
                    className={`custom-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    <i className="fi fi-rr-list-check"></i> Trắc Nghiệm
                </button>
                <button
                    className={`custom-tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
                    onClick={() => setActiveTab('practice')}
                >
                    <i className="fi fi-rr-code-simple"></i> Thực Hành
                </button>
            </div>

            <div className="card-inner">
                <AnimatePresence mode='wait'>
                    {activeTab === 'learn' && (
                        <motion.div
                            key="learn"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="tab-content"
                        >
                            <div className="card-header">
                                <h3>{algo.name}</h3>
                                <p>{algo.description}</p>
                                <div className="tags">
                                    <span className="tag time"><i className="fi fi-rr-clock"></i> {algo.timeComplexity}</span>
                                    <span className="tag space"><i className="fi fi-rr-database"></i> {algo.spaceComplexity}</span>
                                </div>
                            </div>
                            <div className="theory-viewer-container">
                                {THEORY_CONTENT[algo.id] ? (
                                    <MarkdownViewer content={THEORY_CONTENT[algo.id]} />
                                ) : (
                                    <div className="empty-state-msg">
                                        <i className="fi fi-rr-document"></i>
                                        <p>Nội dung lý thuyết đang được biên soạn.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'demo' && algo.inputType !== 'none' && (
                        <motion.div
                            key="demo"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="tab-content demo-full-width"
                        >
                            <DemoPlayer algo={algo} />
                        </motion.div>
                    )}

                    {activeTab === 'quiz' && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="tab-content"
                        >
                            {quizData ? (
                                <QuizRunner quiz={quizData as QuizQuestion} />
                            ) : (
                                <div className="empty-state-msg">
                                    <i className="fi fi-rr-time-fast"></i>
                                    <h3>Sắp ra mắt!</h3>
                                    <p>Bộ câu hỏi trắc nghiệm cho chủ đề <strong>{algo.name}</strong> đang được xây dựng.</p>
                                    <p>Vui lòng quay lại sau nhé!</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'practice' && (
                        <motion.div
                            key="practice"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="tab-content"
                        >
                            {practiceData ? (
                                <ExerciseRunner exercise={practiceData as any} />
                            ) : (
                                <div className="empty-state-msg">
                                    <i className="fi fi-rr-laptop-code"></i>
                                    <h3>Thử thách Coding</h3>
                                    <p>Các bài tập thực hành cho <strong>{algo.name}</strong> sẽ sớm được cập nhật.</p>
                                    <p>Hãy thử các bài Sort hoặc Search để trải nghiệm trước nhé!</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .card-custom-tabs {
                    display: flex; gap: 8px; padding: 16px 24px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    background: #181926;
                }
                .custom-tab-btn {
                    background: transparent; border: none;
                    padding: 10px 16px; color: #a5adcb;
                    font-weight: 500; font-size: 0.95rem;
                    cursor: pointer; position: relative;
                    display: flex; gap: 8px; align-items: center;
                    transition: all 0.2s;
                }
                .custom-tab-btn:hover:not(:disabled) { color: #fff; background: rgba(255,255,255,0.03); border-radius: 8px 8px 0 0; }
                .custom-tab-btn.active { color: #8aadf4; }
                .custom-tab-btn.active::after {
                    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
                    height: 2px; background: #8aadf4;
                    box-shadow: 0 -2px 10px rgba(138, 173, 244, 0.5);
                }
                .custom-tab-btn i { font-size: 1.1rem; }

                .empty-state-msg {
                    padding: 40px; text-align: center;
                    background: rgba(255,255,255,0.02);
                    border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);
                    color: #a5adcb;
                }
                .empty-state-msg i { font-size: 3rem; color: #4e5575; margin-bottom: 16px; display: block; }
                .empty-state-msg h3 { color: #cdd6f4; margin: 0 0 8px; }
                .empty-state-msg p { margin: 0; }
                .empty-state-msg strong { color: #8aadf4; }
            `}</style>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// MAIN PAGE
// -----------------------------------------------------------------------------

export const StudyMaterialsPage: React.FC = () => {
    const { setScene } = useGameStore();
    const [expandedAlgoId, setExpandedAlgoId] = useState<string | null>(null);

    const toggleAlgo = (id: string) => {
        setExpandedAlgoId(prev => prev === id ? null : id);
    };

    return (
        <div className="study-timeline-page">
            {/* Header */}
            <header className="page-header">
                <button className="back-btn" onClick={() => setScene(GameScene.HUB_WORLD)}>
                    <i className="fi fi-rr-arrow-left"></i> Trở về Hub
                </button>
                <div className="header-text">
                    <h1>Lộ Trình DSA</h1>
                    <p>Hành trình chinh phục thuật toán</p>
                </div>
            </header>

            {/* Timeline Container */}
            <div className="timeline-container">
                {/* Central Line */}
                <div className="timeline-line"></div>

                {/* Nodes */}
                <div className="nodes-list">
                    {ALGO_REGISTRY.map((chapter, cIndex) => (
                        <div key={chapter.id} className="chapter-section">
                            {/* Chapter Node */}
                            <div className="timeline-item chapter-item">
                                <div className="chapter-node">
                                    <div className="chapter-icon">
                                        <i className={chapter.icon}></i>
                                    </div>
                                    <div className="chapter-info">
                                        <span className="chapter-num">Chương {cIndex + 1}</span>
                                        <h2>{chapter.title}</h2>
                                    </div>
                                </div>
                            </div>

                            {/* Lesson Nodes */}
                            <div className="lessons-group">
                                {chapter.algos.map((algo) => (
                                    <div key={algo.id} className="timeline-item lesson-item">
                                        {/* Node Circle */}
                                        <div
                                            className={`lesson-node ${expandedAlgoId === algo.id ? 'active' : ''}`}
                                            onClick={() => toggleAlgo(algo.id)}
                                        >
                                            <div className="node-dot"></div>
                                            <span className="node-label">{algo.name}</span>
                                            <i className={`chevron fi fi-rr-angle-down ${expandedAlgoId === algo.id ? 'rotated' : ''}`}></i>
                                        </div>

                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {expandedAlgoId === algo.id && (
                                                <LessonCard algo={algo} />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* End Node */}
                    <div className="timeline-item chapter-item end-node">
                        <div className="chapter-node end">
                            <div className="chapter-icon"><i className="fi fi-rr-flag-checkered"></i></div>
                            <div className="chapter-info">
                                <h2>Hoàn Thành</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .study-timeline-page {
                    width: 100%; 
                    height: 100vh; /* Fixed height to allow internal scroll */
                    background: #0f111a; color: #e2e8f0;
                    font-family: 'Inter', sans-serif;
                    overflow-y: auto; overflow-x: hidden;
                    padding-bottom: 100px;
                }

                .page-header {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(15, 17, 26, 0.9); backdrop-filter: blur(10px);
                    padding: 16px 32px; border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex; align-items: center; gap: 24px;
                }
                .back-btn {
                    padding: 8px 16px; background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                    color: #94a3b8; cursor: pointer; display: flex; align-items: center; gap: 8px;
                }
                .back-btn:hover { background: rgba(255,255,255,0.1); color: white; }
                .header-text h1 { margin: 0; font-size: 1.2rem; color: #fff; }
                .header-text p { margin: 0; font-size: 0.8rem; color: #64748b; }

                /* Timeline */
                .timeline-container {
                    position: relative; max-width: 1400px; margin: 40px auto;
                    padding: 0 20px;
                }

                .timeline-line {
                    position: absolute; top: 20px; bottom: 0; left: 50px;
                    width: 2px; background: rgba(99, 102, 241, 0.2);
                    z-index: 0;
                }

                .chapter-section { margin-bottom: 40px; }

                .timeline-item { position: relative; z-index: 1; padding-left: 80px; margin-bottom: 24px; }
                
                /* Chapter Node */
                .chapter-item { margin-bottom: 32px; padding-left: 0; display: flex; align-items: center; }
                .chapter-node {
                    display: flex; align-items: center; gap: 16px;
                    background: #1e293b; padding: 12px 24px 12px 12px;
                    border-radius: 40px; border: 1px solid rgba(99, 102, 241, 0.3);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                .chapter-node.end { background: #064e3b; border-color: #059669; margin-left: 0; margin-top: 40px; }
                
                .chapter-icon {
                    width: 56px; height: 56px; border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.5rem; color: white; box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
                }
                .end .chapter-icon { background: linear-gradient(135deg, #10b981, #059669); }

                .chapter-info h2 { margin: 0; font-size: 1.2rem; color: #fff; }
                .chapter-num { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }

                /* Lesson Node */
                .lesson-item { }
                .lesson-node {
                    position: absolute; left: 42px; /* Center on line (50px) - half width (8px + border) */
                    top: 0; 
                    /* Custom positioning is tricky. Let's make it simple list items relative to padding */
                    position: relative; left: 0;
                    
                    display: flex; align-items: center; gap: 16px;
                    cursor: pointer; padding: 8px 16px;
                    border-radius: 8px; transition: all 0.2s;
                }
                .lesson-node:hover { background: rgba(255,255,255,0.03); }
                .lesson-node.active { background: rgba(99, 102, 241, 0.1); }

                .node-dot {
                    position: absolute; left: -35px; /* Adjust to hit the line at 50px total offset */
                    width: 12px; height: 12px; border-radius: 50%;
                    background: #0f111a; border: 2px solid #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                    transition: all 0.3s;
                }
                .lesson-node:hover .node-dot { background: #6366f1; transform: scale(1.2); }
                .lesson-node.active .node-dot { background: #6366f1; box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.2); }

                .node-label { font-size: 1rem; color: #cbd5e1; font-weight: 500; flex: 1; }
                .lesson-node.active .node-label { color: #818cf8; font-weight: 600; }
                
                .chevron { color: #64748b; transition: transform 0.3s; }
                .chevron.rotated { transform: rotate(180deg); color: #818cf8; }

                /* Lesson Card (Expanded) */
                .lesson-card { overflow: hidden; margin-top: 12px; border-radius: 12px; background: #181926; border: 1px solid rgba(255,255,255,0.05); }
                .card-inner { padding: 24px; }
                
                .card-header { margin-bottom: 24px; }
                .card-header h3 { margin: 0 0 8px; color: #8aadf4; font-size: 1.4rem; }
                .card-header p { margin: 0 0 16px; color: #a5adcb; font-size: 0.95rem; }
                .tags { display: flex; gap: 12px; }
                .tag { font-size: 0.8rem; padding: 4px 10px; border-radius: 20px; background: rgba(255,255,255,0.05); display: flex; gap: 6px; align-items: center; }
                .tag.time { color: #f5a97f; }
                .tag.space { color: #8bd5ca; }

                .card-content-grid { display: grid; grid-template-columns: 1fr 220px; gap: 24px; }
                .card-content-grid.theory-only { grid-template-columns: 1fr; }
                @media (max-width: 1200px) { .card-content-grid { grid-template-columns: 1fr; } }

                .demo-column { background: #11111b; border-radius: 12px; overflow: hidden; min-height: 400px; border: 1px solid rgba(255,255,255,0.05); }
                .theory-column { padding: 8px; }
                .theory-column h4 { color: #cad3f5; margin-top: 0; }
                .theory-list { list-style: disc; padding-left: 20px; color: #a5adcb; line-height: 1.6; }
                .theory-list li { margin-bottom: 8px; }

                .pro-tip { margin-top: 24px; padding: 12px; background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; border-radius: 4px; color: #fcd34d; font-size: 0.9rem; display: flex; gap: 8px; align-items: start; }

                /* Live Demo Styling */
                .embedded-demo { display: flex; flex-direction: column; height: 100%; }
                .demo-header-controls { padding: 12px 16px; background: #1e1e2e; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .demo-label { font-size: 0.75rem; font-weight: bold; color: #ef4444; display: flex; align-items: center; gap: 6px; }
                .demo-label::before { content: ''; width: 6px; height: 6px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 8px #ef4444; }
                .refresh-btn { background: #313244; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; display: flex; gap: 6px; align-items: center; transition: all 0.2s; }
                .refresh-btn:hover { background: #45475a; }
                .viz-container { flex: 1; min-height: 350px; position: relative; overflow: hidden; background: #0f111a; }
            `}</style>
        </div>
    );
};

export default StudyMaterialsPage;
