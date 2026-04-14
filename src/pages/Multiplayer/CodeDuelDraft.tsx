import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiplayerStandalone.css';

const SKILLS = ['Search Boost', 'Sort Shield', 'Graph Dash', 'DP Shield', 'Memo Cache'];

const QUESTIONS = [
  { q: 'Best average complexity for comparison sort?', a: 'O(n log n)' },
  { q: 'Data structure for FIFO?', a: 'Queue' },
  { q: 'BST left subtree relation?', a: 'Smaller than root' },
];

export const CodeDuelDraft: React.FC = () => {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [enemy, setEnemy] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('Draft 3 skills then fight');

  const current = QUESTIONS[index % QUESTIONS.length];

  const canStart = picked.length === 3;

  const draftPower = useMemo(() => picked.length * 10, [picked]);

  const toggleSkill = (skill: string) => {
    setPicked((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= 3) return prev;
      return [...prev, skill];
    });
  };

  const submit = () => {
    if (!canStart) return;
    const correct = answer.trim().toLowerCase() === current.a.toLowerCase();
    const gain = correct ? 100 + draftPower : 15;
    setScore((s) => s + gain);
    setEnemy((e) => e + (Math.random() > 0.45 ? 85 : 25));
    setStatus(correct ? `Correct +${gain}` : `Wrong +${gain}`);
    setIndex((i) => i + 1);
    setAnswer('');
  };

  return (
    <div className="mp-standalone-page">
      <div className="mp-standalone-header">
        <h1>Code Duel Draft (Standalone)</h1>
        <p>Chon skill, sau do dau tri toc do va do chinh xac.</p>
      </div>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Draft Skills</h2>
          <div className="mp-row">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                className="mp-btn"
                style={{ borderColor: picked.includes(skill) ? '#ffd166' : undefined }}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          <p>Picked: {picked.length}/3</p>

          <h2>Question</h2>
          <p>{current.q}</p>
          <input className="mp-input" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer" />
          <div className="mp-actions">
            <button className="mp-btn primary" onClick={submit}>Submit</button>
            <button className="mp-btn" onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>
          <p className="mp-status">{status}</p>
        </section>

        <aside className="mp-card">
          <h3>Scoreboard</h3>
          <p>Ban: <strong>{score}</strong></p>
          <p>Doi thu: <strong>{enemy}</strong></p>
          <p>Draft bonus: +{draftPower}</p>
          <p className="mp-status">{score >= enemy ? 'Dang dan truoc' : 'Dang bi dan'}</p>
        </aside>
      </div>
    </div>
  );
};
