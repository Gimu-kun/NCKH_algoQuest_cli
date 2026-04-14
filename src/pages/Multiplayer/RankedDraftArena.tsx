import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiplayerStandalone.css';

const DRAFT_POOL = ['Search Boost', 'Sort Shield', 'Graph Dash', 'DP Burst', 'Cache Trick', 'Tree Vision'];
const SEASON_TARGET = 5;

type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

const getTier = (elo: number): RankTier => {
  if (elo >= 1700) return 'Diamond';
  if (elo >= 1500) return 'Platinum';
  if (elo >= 1300) return 'Gold';
  if (elo >= 1100) return 'Silver';
  return 'Bronze';
};

export const RankedDraftArena: React.FC = () => {
  const navigate = useNavigate();

  const [picked, setPicked] = useState<string[]>([]);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [elo, setElo] = useState(1200);
  const [lastResult, setLastResult] = useState('Draft 3 skills, then queue ranked');

  const draftBonus = useMemo(() => picked.length * 8, [picked]);
  const tier = getTier(elo);

  const togglePick = (skill: string) => {
    setPicked((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= 3) return prev;
      return [...prev, skill];
    });
  };

  const playRanked = () => {
    if (picked.length !== 3) {
      setLastResult('Need exactly 3 drafted skills');
      return;
    }

    const winChance = 0.42 + draftBonus / 100;
    const isWin = Math.random() < Math.min(0.8, winChance);

    if (isWin) {
      const gain = 24 + draftBonus;
      setElo((v) => v + gain);
      setWins((v) => v + 1);
      setLastResult(`Win +${gain} ELO`);
    } else {
      const minus = 18;
      setElo((v) => Math.max(900, v - minus));
      setLosses((v) => v + 1);
      setLastResult(`Lose -${minus} ELO`);
    }
  };

  const resetSeason = () => {
    setPicked([]);
    setWins(0);
    setLosses(0);
    setElo(1200);
    setLastResult('Season reset done');
  };

  return (
    <div className="mp-standalone-page">
      <div className="mp-standalone-header">
        <h1>Ranked Draft 1v1 (Standalone)</h1>
        <p>Draft ky nang, vao xep hang, leo tier theo ELO mua giai.</p>
      </div>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Draft Phase</h2>
          <div className="mp-row">
            {DRAFT_POOL.map((skill) => (
              <button
                key={skill}
                className="mp-btn"
                style={{ borderColor: picked.includes(skill) ? '#ffd166' : undefined }}
                onClick={() => togglePick(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          <p>Picked: {picked.length}/3</p>

          <div className="mp-actions">
            <button className="mp-btn primary" onClick={playRanked}>Queue Ranked Match</button>
            <button className="mp-btn" onClick={resetSeason}>Reset Season</button>
            <button className="mp-btn" onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>
          <p className="mp-status">{lastResult}</p>
        </section>

        <aside className="mp-card">
          <h3>Season Stats</h3>
          <p>Tier: <strong>{tier}</strong></p>
          <p>ELO: <strong>{elo}</strong></p>
          <p>Record: <strong>{wins}W - {losses}L</strong></p>
          <p>Season progress</p>
          <div className="mp-progress"><span style={{ width: `${Math.min(100, (wins / SEASON_TARGET) * 100)}%` }} /></div>
          <p>{wins}/{SEASON_TARGET} wins for season milestone</p>
        </aside>
      </div>
    </div>
  );
};
