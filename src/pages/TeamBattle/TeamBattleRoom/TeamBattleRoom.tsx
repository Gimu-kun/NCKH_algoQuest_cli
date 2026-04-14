import React, { useState, useEffect } from 'react';
import { 
    UsergroupAddOutlined, 
    ThunderboltFilled, 
    CheckCircleFilled, 
    SyncOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import './TeamBattleRoom.css';

export const TeamBattleRoom = () => {
    const [gameState, setGameState] = useState<'lobby' | 'battle' | 'result'>('lobby');
    const [timeLeft, setTimeLeft] = useState(600); // 10 phút

    // Mock dữ liệu đề bài chia làm 2 phần
    const problem = {
        title: "Xây dựng thuật toán QuickSort",
        part1: "Hàm Partition: Phân đoạn mảng dựa trên Pivot",
        part2: "Hàm QuickSort: Đệ quy gọi hàm Partition",
    };

    return (
        <div className="battle-container">
            {gameState === 'lobby' ? (
                <div className="lobby-overlay">
                    <div className="lobby-card">
                        <h2><UsergroupAddOutlined /> Phòng Chờ Đấu Đội</h2>
                        <div className="teams-setup">
                            <div className="team blue">
                                <h4>Đội Xanh (Bạn)</h4>
                                <div className="player active">Bạn <CheckCircleFilled /></div>
                                <div className="player empty">Đợi đồng đội... <button className="invite-btn">Mời</button></div>
                            </div>
                            <div className="vs-sign">VS</div>
                            <div className="team red">
                                <h4>Đội Đỏ (Đối thủ)</h4>
                                <div className="player active">Hacker_Lord</div>
                                <div className="player active">Code_Master</div>
                            </div>
                        </div>
                        <button className="start-btn" onClick={() => setGameState('battle')}>BẮT ĐẦU TRẬN ĐẤU</button>
                    </div>
                </div>
            ) : (
                <div className="battle-arena">
                    {/* Header: Thông tin trận đấu */}
                    <div className="battle-header">
                        <div className="battle-info">
                            <h3>{problem.title}</h3>
                            <div className="timer"><ClockCircleOutlined /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                        </div>
                        <div className="score-board">
                            <div className="team-progress blue">Team A: 3/5 Testcases</div>
                            <div className="team-progress red">Team B: 2/5 Testcases</div>
                        </div>
                    </div>

                    {/* Main: IDE chia đôi */}
                    <div className="dual-editor">
                        <div className="editor-block partner-view">
                            <div className="editor-tag">Đồng đội đang làm: {problem.part1}</div>
                            <div className="code-mirror-fake">
                                <pre><code>{`int partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    // Đồng đội đang gõ...|`}</code></pre>
                            </div>
                        </div>

                        <div className="editor-block my-edit">
                            <div className="editor-tag">Bạn đang làm: {problem.part2}</div>
                            <textarea 
                                className="main-textarea" 
                                placeholder="Viết hàm đệ quy QuickSort tại đây..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="battle-footer">
                        <div className="live-status">● Đồng đội đang hoạt động</div>
                        <button className="submit-battle-btn"><ThunderboltFilled /> Ghép Code & Chạy Test</button>
                    </div>
                </div>
            )}
        </div>
    );
};