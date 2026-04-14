import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiplayerStandalone.css';

const BRACKET = [
  ['Team A', 'Team B'],
  ['Team C', 'Team D'],
  ['Team E', 'Team F'],
  ['Team G', 'Team H'],
];

export const TournamentBracket: React.FC = () => {
  const navigate = useNavigate();
  const [round, setRound] = useState<'QF' | 'SF' | 'F' | 'WIN'>('QF');
  const [wins, setWins] = useState(0);

  const advance = () => {
    if (round === 'QF') {
      setRound('SF');
      setWins((w) => w + 1);
      return;
    }
    if (round === 'SF') {
      setRound('F');
      setWins((w) => w + 1);
      return;
    }
    if (round === 'F') {
      setRound('WIN');
      setWins((w) => w + 1);
    }
  };

  const reset = () => {
    setRound('QF');
    setWins(0);
  };

  return (
    <div className="mp-standalone-page">
      <div className="mp-standalone-header">
        <h1>Tournament Bracket 8 (Standalone)</h1>
        <p>Dau loai truc tiep QF - SF - Final - Champion.</p>
      </div>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Bracket</h2>
          <ul className="mp-list">
            {BRACKET.map((pair) => (
              <li key={pair.join('-')}>{pair[0]} vs {pair[1]}</li>
            ))}
          </ul>
          <p>Round hien tai: <strong>{round}</strong></p>
          <p>So tran da thang: <strong>{wins}</strong></p>
          <div className="mp-actions">
            <button className="mp-btn primary" onClick={advance} disabled={round === 'WIN'}>Advance Round</button>
            <button className="mp-btn" onClick={reset}>Reset Tournament</button>
            <button className="mp-btn" onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>
          <p className="mp-status">{round === 'WIN' ? 'Ban la nha vo dich!' : 'Tiep tuc thi dau...'}</p>
        </section>

        <aside className="mp-card">
          <h3>Season Info</h3>
          <p>Format: BO1</p>
          <p>Teams: 8</p>
          <p>Reward: 500 trophy + title</p>
        </aside>
      </div>
    </div>
  );
};
