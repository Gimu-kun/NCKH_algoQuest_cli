import React, { useState } from 'react';
import { UserOutlined, SendOutlined, RocketOutlined } from '@ant-design/icons';
import './TeamBattle.css';

export const TeamBattleLobby = () => {
    const [teamA, setTeamA] = useState([{ name: "Bạn (Captain)", status: "Ready" }, { name: "Đang đợi...", status: "Empty" }]);
    const [teamB, setTeamB] = useState([{ name: "Player_321", status: "Ready" }, { name: "Player_888", status: "Ready" }]);

    return (
        <div className="battle-lobby-container">
            <div className="lobby-header">
                <h2><RocketOutlined /> Chế độ Đấu Đội 2vs2: Thuật toán tiếp sức</h2>
                <div className="battle-settings">Đề bài: Cấu trúc dữ liệu & Giải thuật (Random)</div>
            </div>

            <div className="teams-grid">
                {/* Team A */}
                <div className="team-card team-blue">
                    <h3>Đội Xanh</h3>
                    {teamA.map((member, i) => (
                        <div key={i} className={`member-slot ${member.status === 'Empty' ? 'empty' : ''}`}>
                            <UserOutlined /> {member.name}
                            {member.status === 'Empty' && <button className="invite-btn">Mời +</button>}
                        </div>
                    ))}
                </div>

                <div className="vs-circle">VS</div>

                {/* Team B */}
                <div className="team-card team-red">
                    <h3>Đội Đỏ</h3>
                    {teamB.map((member, i) => (
                        <div key={i} className="member-slot">
                            <UserOutlined /> {member.name}
                        </div>
                    ))}
                </div>
            </div>
            
            <button className="start-battle-btn">BẮT ĐẦU TRẬN ĐẤU</button>
        </div>
    );
};