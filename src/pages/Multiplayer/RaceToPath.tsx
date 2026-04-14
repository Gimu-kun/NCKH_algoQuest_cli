import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiplayerStandalone.css';

export const RaceToPath: React.FC = () => {
  const navigate = useNavigate();
  const [mySteps, setMySteps] = useState(0);
  const [enemySteps, setEnemySteps] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [status, setStatus] = useState('Chon canh de toi uu duong di');

  const move = (type: 'FAST' | 'SAFE') => {
    const gain = type === 'FAST' ? 3 : 2;
    const cost = type === 'FAST' ? 18 : 10;
    if (energy < cost) {
      setStatus('Khong du nang luong');
      return;
    }
    const next = Math.min(18, mySteps + gain);
    setMySteps(next);
    setEnemySteps((e) => Math.min(18, e + (Math.random() > 0.5 ? 3 : 2)));
    setEnergy((e) => Math.max(0, e - cost));
    setStatus(next >= 18 ? 'Ban da ve dich!' : 'Dang tiep tuc route');
  };

  return (
    <div className="mp-standalone-page">
      <div className="mp-standalone-header">
        <h1>Race to Path (Standalone)</h1>
        <p>Tinh shortest path nhanh hon doi thu de ve dich truoc.</p>
      </div>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Path Progress</h2>
          <p>Ban: {mySteps}/18</p>
          <div className="mp-progress"><span style={{ width: `${(mySteps / 18) * 100}%` }} /></div>
          <p>Doi thu: {enemySteps}/18</p>
          <div className="mp-progress"><span style={{ width: `${(enemySteps / 18) * 100}%` }} /></div>

          <p>Nang luong: {energy}</p>
          <div className="mp-actions">
            <button className="mp-btn primary" onClick={() => move('FAST')}>Edge Risk (+3)</button>
            <button className="mp-btn" onClick={() => move('SAFE')}>Edge Safe (+2)</button>
            <button className="mp-btn" onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>
          <p className="mp-status">{status}</p>
        </section>

        <aside className="mp-card">
          <h3>Rule nhanh</h3>
          <ul className="mp-list">
            <li>FAST nhanh hon nhung ton nang luong nhieu.</li>
            <li>SAFE cham hon nhung an toan.</li>
            <li>Dat 18 diem route truoc se thang.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};
