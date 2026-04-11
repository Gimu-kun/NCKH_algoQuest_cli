import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiplayerStandalone.css';

export const TowerDefenseCoop: React.FC = () => {
  const navigate = useNavigate();
  const [towerHp, setTowerHp] = useState(100);
  const [wave, setWave] = useState(1);
  const [queueOps, setQueueOps] = useState(0);
  const [cacheHits, setCacheHits] = useState(0);

  const defend = (skill: 'QUEUE' | 'CACHE') => {
    const dmg = Math.max(4, 14 - wave);
    if (skill === 'QUEUE') {
      setQueueOps((v) => v + 1);
      setTowerHp((hp) => Math.max(0, hp - (dmg - 5)));
    } else {
      setCacheHits((v) => v + 1);
      setTowerHp((hp) => Math.max(0, hp - (dmg - 7)));
    }
    setWave((w) => Math.min(12, w + 1));
  };

  const reset = () => {
    setTowerHp(100);
    setWave(1);
    setQueueOps(0);
    setCacheHits(0);
  };

  return (
    <div className="mp-standalone-page">
      <div className="mp-standalone-header">
        <h1>Tower Defense Algo Co-op (Standalone)</h1>
        <p>Phoi hop queue + cache de giu tru qua cac wave.</p>
      </div>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Defense Core</h2>
          <p>Wave: {wave}/12</p>
          <p>HP tru: {towerHp}</p>
          <div className="mp-progress"><span style={{ width: `${towerHp}%` }} /></div>

          <div className="mp-actions">
            <button className="mp-btn primary" onClick={() => defend('QUEUE')}>Deploy Queue</button>
            <button className="mp-btn primary" onClick={() => defend('CACHE')}>Enable Cache</button>
            <button className="mp-btn" onClick={reset}>Reset</button>
            <button className="mp-btn" onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>

          <p className="mp-status">{towerHp <= 0 ? 'That thu! Tru da sap.' : wave >= 12 ? 'Thanh cong! Da giu duoc tru.' : 'Dang phong thu...'}</p>
        </section>

        <aside className="mp-card">
          <h3>Team Metrics</h3>
          <p>Queue actions: {queueOps}</p>
          <p>Cache actions: {cacheHits}</p>
          <p>Synergy score: {queueOps * 8 + cacheHits * 10}</p>
        </aside>
      </div>
    </div>
  );
};
