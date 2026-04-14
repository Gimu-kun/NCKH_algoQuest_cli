import React, { useState, useEffect } from 'react';
import { CodeOutlined, SyncOutlined } from '@ant-design/icons';

export const CoopCodingEditor = ({ problemData }: any) => {
    // Giả sử đồng đội đang làm hàm 1, bạn làm hàm 2
    const [myCode, setMyCode] = useState("// Viết hàm của bạn tại đây...");
    const [partnerCode, setPartnerCode] = useState("// Đồng đội đang gõ...");

    return (
        <div className="battle-editor-layout">
            <div className="battle-sidebar">
                <div className="timer">14:59</div>
                <div className="testcase-status">
                    <h4>Testcases:</h4>
                    <div className="tc-item pass">TC1: 0.02ms</div>
                    <div className="tc-item fail">TC2: --</div>
                </div>
            </div>

            <div className="dual-editor-container">
                {/* Hàm 1: Read-only (Đồng đội làm) */}
                <div className="editor-section partner-section">
                    <div className="editor-label">HÀM 1: QuickSort Partition (Đồng đội)</div>
                    <pre className="partner-live-code">{partnerCode}</pre>
                </div>

                {/* Hàm 2: Editable (Bạn làm) */}
                <div className="editor-section my-section">
                    <div className="editor-label">HÀM 2: QuickSort Main Recursive (Bạn)</div>
                    <textarea 
                        value={myCode} 
                        onChange={(e) => setMyCode(e.target.value)}
                        className="code-textarea"
                    />
                </div>
            </div>

            <div className="battle-footer">
                <button className="merge-btn"><SyncOutlined /> Ghép code & Chạy Test</button>
            </div>
        </div>
    );
};