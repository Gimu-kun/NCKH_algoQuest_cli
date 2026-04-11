import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiplayerStandalone.css';

type Role = 'Tank' | 'DPS' | 'Support';

type BossPhase = 1 | 2 | 3;

export const CoopRaidBoss: React.FC = () => {
  const navigate = useNavigate();

  const [teamHp, setTeamHp] = useState(100);
  const [bossHp, setBossHp] = useState(100);
  const [phase, setPhase] = useState<BossPhase>(1);
  const [role, setRole] = useState<Role>('DPS');
  const [log, setLog] = useState<string[]>(['Raid started']);

  const atkPower = useMemo(() => {
    if (role === 'Tank') return 9;
    if (role === 'Support') return 10;
    return 14;
  }, [role]);

  const defendPower = role === 'Tank' ? 12 : role === 'Support' ? 9 : 6;

  const appendLog = (value: string) => {
    setLog((prev) => [value, ...prev].slice(0, 10));
  };

  const nextPhaseByHp = (nextBossHp: number): BossPhase => {
    if (nextBossHp <= 30) return 3;
    if (nextBossHp <= 65) return 2;
    return 1;
  };

  const actionAttack = () => {
    const hit = Math.max(5, atkPower + Math.floor(Math.random() * 5) - 1);
    const counter = Math.max(4, phase * 6 - Math.floor(defendPower / 4));

    const nextBoss = Math.max(0, bossHp - hit);
    const nextTeam = Math.max(0, teamHp - counter);

    setBossHp(nextBoss);
    setTeamHp(nextTeam);
    setPhase(nextPhaseByHp(nextBoss));
    appendLog(`Attack deal ${hit}, counter ${counter}`);
  };

  const actionStabilize = () => {
    const heal = role === 'Support' ? 12 : 7;
    const chip = phase === 3 ? 10 : 6;

    setTeamHp((v) => Math.min(100, v + heal - chip));
    appendLog(`Stabilize +${heal}, chip -${chip}`);
  };

  const resetRaid = () => {
    setTeamHp(100);
    setBossHp(100);
    setPhase(1);
    setRole('DPS');
    setLog(['Raid restarted']);
  };

  return (
    <div className="mp-standalone-page">
      <div className="mp-standalone-header">
        <h1>Co-op Raid Boss 3P (Standalone)</h1>
        <p>Tank - DPS - Support phoi hop qua 3 phase de ha boss.</p>
      </div>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Raid Control</h2>
          <div className="mp-row">
            <label>Role</label>
            <select className="mp-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="Tank">Tank</option>
              <option value="DPS">DPS</option>
              <option value="Support">Support</option>
            </select>
          </div>

          <p>Boss HP: {bossHp}</p>
          <div className="mp-progress"><span style={{ width: `${bossHp}%` }} /></div>
          <p>Team HP: {teamHp}</p>
          <div className="mp-progress"><span style={{ width: `${teamHp}%` }} /></div>
          <p>Phase: {phase}/3</p>

          <div className="mp-actions">
            <button className="mp-btn primary" onClick={actionAttack}>Attack Rotation</button>
            <button className="mp-btn" onClick={actionStabilize}>Stabilize Team</button>
            <button className="mp-btn" onClick={resetRaid}>Reset Raid</button>
            <button className="mp-btn" onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>

          <p className="mp-status">
            {bossHp <= 0 ? 'Raid clear! Boss defeated.' : teamHp <= 0 ? 'Team wiped! Try again.' : 'Raid in progress...'}
          </p>
        </section>

        <aside className="mp-card">
          <h3>Battle Log</h3>
          <ul className="mp-list">
            {log.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};
