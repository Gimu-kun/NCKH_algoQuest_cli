/**
 * Bảng Cổ Ngữ - Thành Phần Trình Soạn Code
 * Giao diện chính để xây dựng phép thuật thông qua bài tập lập trình
 */

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { ResourceType } from '../../data/models/Item';
import { sparky } from '../../game/ai/SparkyBot';
import { SPELLS } from '../../data/models/Spell';
import './RunicConsole.css';

export const RunicConsole: React.FC = () => {
    const { runicConsoleOpen, currentBlueprintId, closeRunicConsole, showSparky } = useGameStore();
    const { unlockSpell, addResource } = usePlayerStore();

    const [code, setCode] = useState('');
    const [phase, setPhase] = useState<'EDITING' | 'SYNTAX' | 'MEMORY' | 'LOGIC' | 'SUCCESS'>('EDITING');
    const [error, setError] = useState<string | null>(null);
    const [vfxActive, setVfxActive] = useState<string | null>(null);

    // Get spell data - do this before early returns affect hooks
    const spell = currentBlueprintId ?
        Object.values(SPELLS).find(s => s.id === currentBlueprintId) :
        null;

    // Khởi tạo code với mẫu ban đầu - hook must be called unconditionally
    React.useEffect(() => {
        if (spell) {
            setCode(spell.starterCode);
            setPhase('EDITING');
            setError(null);
        }
    }, [spell]);

    // Conditional returns AFTER all hooks
    if (!runicConsoleOpen || !currentBlueprintId) return null;

    if (!spell) {
        console.error('Spell not found:', currentBlueprintId);
        return null;
    }

    // Xử lý gửi code
    const handleBuild = async () => {
        setError(null);

        // Giai đoạn 1: Kiểm Tra Cú Pháp (mô phỏng cppcheck)
        setPhase('SYNTAX');
        setVfxActive('smoke');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const syntaxError = sparky.analyzeCode(code, 'SYNTAX');
        if (syntaxError) {
            setError(syntaxError.message);
            setVfxActive('smoke');
            showSparky(syntaxError.message);
            setPhase('EDITING');
            return;
        }

        // Giai đoạn 2: Kiểm Tra Bộ Nhớ (mô phỏng valgrind)
        setPhase('MEMORY');
        setVfxActive('dissolve');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const memoryError = sparky.analyzeCode(code, 'MEMORY');
        if (memoryError) {
            setError(memoryError.message);
            setVfxActive('dissolve');
            showSparky(memoryError.message);
            setPhase('EDITING');
            return;
        }

        // Giai đoạn 3: Kiểm Tra Logic (mô phỏng unit tests)
        setPhase('LOGIC');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Cho MVP, chúng ta sẽ mô phỏng thực thi test
        // Trong sản phẩm, điều này sẽ gửi code đến backend để thực thi thực sự
        const testsPassed = Math.random() > 0.3; // 70% success rate for demo

        if (!testsPassed) {
            setError('💡 Test Failed! Google Test reports: Expected output doesn\'t match actual output.');
            setVfxActive('explosion');
            showSparky('💡 Your logic has an error. Check the test cases!');
            setPhase('EDITING');
            return;
        }

        // Success!
        setPhase('SUCCESS');
        setVfxActive('success');

        // Unlock the spell
        unlockSpell(spell.id);
        addResource(ResourceType.DATA_WOOD, 50);
        showSparky('💡 Success! The altar has been built! You\'ve unlocked ' + spell.displayName);

        // Close after animation
        setTimeout(() => {
            closeRunicConsole();
            setPhase('EDITING');
            setVfxActive(null);
        }, 3000);
    };

    const handleCancel = () => {
        closeRunicConsole();
        setPhase('EDITING');
        setError(null);
    };

    return (
        <div className="runic-console-overlay">
            <motion.div
                className="runic-console"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                {/* Header */}
                <div className="console-header">
                    <div className="console-title-group">
                        <h2>🪄 Bảng Cổ Ngữ</h2>
                        <p className="spell-name">:: {spell.displayName}</p>
                    </div>
                    <button className="close-btn" onClick={handleCancel}>✕</button>
                </div>

                <div className="console-content">
                    {/* Left Sidebar */}
                    <div className="console-sidebar">
                        <div className="console-description">
                            <p><strong>Nhiệm vụ:</strong></p>
                            <p>{spell.description}</p>
                            <div className="signature">{spell.functionSignature}</div>
                        </div>

                        <div className="console-phase">
                            {phase === 'SYNTAX' && (
                                <div className="phase-indicator syntax">
                                    ⚙️ Đang kiểm tra cú pháp...
                                </div>
                            )}
                            {phase === 'MEMORY' && (
                                <div className="phase-indicator memory">
                                    🔍 Đang kiểm tra bộ nhớ...
                                </div>
                            )}
                            {phase === 'LOGIC' && (
                                <div className="phase-indicator logic">
                                    🧪 Đang chạy kiểm thử...
                                </div>
                            )}
                            {phase === 'SUCCESS' && (
                                <div className="phase-indicator success">
                                    ✨ Phép thuật hoàn tất!
                                </div>
                            )}
                            {phase === 'EDITING' && (
                                <div className="phase-indicator editing" style={{ color: '#888' }}>
                                    ... Đang chờ nhập liệu ...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Editor Area */}
                    <div className="console-editor-container">
                        <div className="console-editor">
                            <Editor
                                height="100%"
                                defaultLanguage="cpp"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: "'Fira Code', 'Consolas', monospace",
                                    lineNumbers: 'on',
                                    readOnly: phase !== 'EDITING',
                                    padding: { top: 16 }
                                }}
                            />

                            {/* VFX Overlay */}
                            <AnimatePresence>
                                {vfxActive && (
                                    <motion.div
                                        className={`vfx-overlay vfx-${vfxActive}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {vfxActive === 'success' && <div className="success-particles">✨</div>}
                                        {vfxActive === 'smoke' && <div className="smoke-effect">💨</div>}
                                        {vfxActive === 'explosion' && <div className="explosion-effect">💥</div>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="console-error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <span className="error-icon">⚠️</span>
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="console-actions">
                            <button
                                className="btn-cancel"
                                onClick={handleCancel}
                                disabled={phase !== 'EDITING'}
                            >
                                Hủy Bỏ
                            </button>
                            <button
                                className="btn-build"
                                onClick={handleBuild}
                                disabled={phase !== 'EDITING'}
                            >
                                🔨 Khắc Họa Phép Thuật
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
