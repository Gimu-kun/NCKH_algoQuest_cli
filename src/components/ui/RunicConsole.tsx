/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UI: BẢNG CỔ NGỮ (Runic Console / Coding Interface)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Giao diện IDE tích hợp trong game (In-game IDE) cho phép người chơi viết code
 * để giải quyết các bài toán thuật toán và "chế tạo" phép thuật.
 * 
 * TÍNH NĂNG:
 * - Monaco Editor: Trình soạn thảo code chuyên nghiệp (VS Code core) với syntax highlighting.
 * - Code Analysis Pipeline: Quy trình kiểm tra 3 bước tự động:
 *   1. Syntax Check (Phân tích cú pháp - Mô phỏng CppCheck).
 *   2. Memory Check (Kiểm tra rò rỉ bộ nhớ - Mô phỏng Valgrind).
 *   3. Logic Check (Unit Testing - Mô phỏng GoogleTest).
 * - Visual Feedback (VFX): Hiệu ứng khói, tan biến, nổ hạt tương ứng với trạng thái build.
 * - AI Assistance: Tích hợp Sparky để gợi ý sửa lỗi khi compile thất bại.
 * 
 * FLOW XỬ LÝ (BUILD PIPELINE):
 * 1. User nhập code -> `code` state update.
 * 2. Nhấn 'Khắc Họa' (Build) -> Set Phase 'SYNTAX'.
 *    - Gọi `sparky.analyzeCode('SYNTAX')`. Nếu lỗi -> Break & Show Error.
 * 3. Set Phase 'MEMORY' -> Gọi `sparky.analyzeCode('MEMORY')`.
 *    - Nếu lỗi -> Trigger VFX 'dissolve' & Show Error.
 * 4. Set Phase 'LOGIC' -> Chạy Mock Unit Tests.
 *    - Nếu sai kết quả -> Trigger VFX 'explosion' & Show Error.
 * 5. Success -> Trigger VFX 'success', Unclock Spell, Close Console.
 * 
 * KỸ THUẬT:
 * - Workflow State Machine: Quản lý trạng thái `phase` (EDITING -> SYNTAX -> MEMORY -> LOGIC -> SUCCESS).
 * - Asynchronous Simulation: Sử dụng `setTimeout` và `await` để tạo cảm giác xử lý thời gian thực.
 * - Library Integration: `@monaco-editor/react` cho trải nghiệm code chuẩn.
 * 
 * @component RunicConsole
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { ResourceType } from '../../data/models/Item';
import { sparky } from '../../game/ai/SparkyBot';
import { SPELLS } from '../../data/models/Spell';
import './RunicConsole.css';

export const RunicConsole: React.FC = () => {
    // Hooks truy cập store
    const { runicConsoleOpen, currentBlueprintId, closeRunicConsole, showSparky } = useGameStore();
    const { unlockSpell, addResource } = usePlayerStore();

    // Local State
    const [code, setCode] = useState('');
    const [phase, setPhase] = useState<'EDITING' | 'SYNTAX' | 'MEMORY' | 'LOGIC' | 'SUCCESS'>('EDITING');
    const [error, setError] = useState<string | null>(null);
    const [vfxActive, setVfxActive] = useState<string | null>(null); // 'smoke', 'dissolve', 'success', 'explosion'

    // Lấy dữ liệu bài tập (Spell Blueprint)
    const spell = currentBlueprintId ?
        Object.values(SPELLS).find(s => s.id === currentBlueprintId) :
        null;

    // Effect: Reset state khi mở một bài tập mới
    useEffect(() => {
        if (spell) {
            setCode(spell.starterCode);
            setPhase('EDITING');
            setError(null);
            setVfxActive(null);
        }
    }, [spell]);

    // Nếu console không mở hoặc không có bài tập, không render gì cả
    if (!runicConsoleOpen || !currentBlueprintId || !spell) return null;

    /**
     * XỬ LÝ QUY TRÌNH BUILD (Compiling & Testing Workflow)
     */
    const handleBuild = async () => {
        setError(null);

        // --- GIAI ĐOẠN 1: KIỂM TRA CÚ PHÁP (Syntax Analysis) ---
        setPhase('SYNTAX');
        setVfxActive('smoke'); // Hiệu ứng khói nhẹ khi compile
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating delay

        const syntaxError = sparky.analyzeCode(code, 'SYNTAX');
        if (syntaxError) {
            setError(syntaxError.message);
            setVfxActive('smoke');
            showSparky(syntaxError.message);
            setPhase('EDITING');
            return;
        }

        // --- GIAI ĐOẠN 2: KIỂM TRA BỘ NHỚ (Memory Analysis) ---
        setPhase('MEMORY');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const memoryError = sparky.analyzeCode(code, 'MEMORY');
        if (memoryError) {
            setError(memoryError.message);
            setVfxActive('dissolve'); // Hiệu ứng tan biến nếu leak memory
            showSparky(memoryError.message);
            setPhase('EDITING');
            return;
        }

        // --- GIAI ĐOẠN 3: KIỂM TRA LOGIC (Unit Testing) ---
        setPhase('LOGIC');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Kiểm tra Logic (Pattern Matching Algorithm)
        const logicError = sparky.analyzeCode(code, 'LOGIC', spell.id);

        if (logicError) {
            setError(logicError.message);
            setVfxActive('explosion'); // Hiệu ứng nổ nếu logic sai
            showSparky('Có vẻ thuật toán chưa đúng. Hãy kiểm tra lại logic vòng lặp hoặc điều kiện biên!');
            setPhase('EDITING');
            return;
        }

        // --- THÀNH CÔNG (SUCCESS) ---
        setPhase('SUCCESS');
        setVfxActive('success');

        // Mở khóa phép thuật & Thưởng
        unlockSpell(spell.id);
        addResource(ResourceType.DATA_WOOD, 50);
        showSparky(`Tuyệt vời! Bạn đã khắc họa thành công phép thuật: ${spell.displayName}!`);

        // Tự động đóng sau 3 giây
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
                {/* === HEADER === */}
                <div className="console-header">
                    <div className="console-title-group">
                        <h2>🪄 Bảng Cổ Ngữ (Runic Console)</h2>
                        <p className="spell-name">:: {spell.displayName}</p>
                    </div>
                    <button className="close-btn" onClick={handleCancel}>✕</button>
                </div>

                <div className="console-content">
                    {/* === SIDEBAR (ĐỀ BÀI & TRẠNG THÁI) === */}
                    <div className="console-sidebar">
                        <div className="console-description">
                            <p><strong>Nhiệm vụ:</strong></p>
                            <p>{spell.description}</p>
                            <div className="signature">
                                <code>{spell.functionSignature}</code>
                            </div>
                        </div>

                        {/* Phase Indicators */}
                        <div className="console-phase">
                            {phase === 'SYNTAX' && (
                                <div className="phase-indicator syntax">
                                    ⚙️ <strong>CppCheck:</strong> Đang phân tích cú pháp...
                                </div>
                            )}
                            {phase === 'MEMORY' && (
                                <div className="phase-indicator memory">
                                    🔍 <strong>Valgrind:</strong> Đang kiểm tra rò rỉ bộ nhớ...
                                </div>
                            )}
                            {phase === 'LOGIC' && (
                                <div className="phase-indicator logic">
                                    🧪 <strong>GoogleTest:</strong> Đang chạy bộ kiểm thử...
                                </div>
                            )}
                            {phase === 'SUCCESS' && (
                                <div className="phase-indicator success">
                                    ✨ <strong>Thành công!</strong> Phép thuật đã sẵn sàng.
                                </div>
                            )}
                            {phase === 'EDITING' && (
                                <div className="phase-indicator editing" style={{ color: '#888' }}>
                                    ... Đang chờ nhập lệnh trượng ...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === EDITOR AREA === */}
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
                                    readOnly: phase !== 'EDITING', // Khóa edit khi đang build
                                    padding: { top: 16 }
                                }}
                            />

                            {/* VFX Overlay Layer */}
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

                        {/* Error Notification */}
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

                        {/* Action Buttons */}
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
                                🔨 Khắc Họa (Build & Run)
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
