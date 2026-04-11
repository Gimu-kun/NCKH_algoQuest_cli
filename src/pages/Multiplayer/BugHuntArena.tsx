import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BugHuntArena.css';

type BugTask = {
  id: string;
  title: string;
  snippet: string;
  choices: string[];
  correct: number;
  explain: string;
};

const TASKS: BugTask[] = [
  {
    id: 'b1',
    title: 'Off-by-one in loop',
    snippet: 'for (let i = 0; i <= arr.length; i++) sum += arr[i];',
    choices: [
      'Change <= to <',
      'Start from i = 1',
      'Use while(true)',
      'No bug here',
    ],
    correct: 0,
    explain: 'i <= arr.length truy cap phan tu ngoai bien mang.',
  },
  {
    id: 'b2',
    title: 'Null pointer access',
    snippet: 'return user.profile.name.toUpperCase();',
    choices: [
      'Add optional chaining or guard for user/profile',
      'Replace toLowerCase',
      'Convert to Number',
      'No bug here',
    ],
    correct: 0,
    explain: 'Neu user hoac profile null thi se runtime error.',
  },
  {
    id: 'b3',
    title: 'Mutating shared state',
    snippet: 'state.items.push(newItem); setState(state);',
    choices: [
      'Use immutable update: setState({...state, items: [...state.items, newItem]})',
      'Use pop() before push()',
      'Call setState twice',
      'No bug here',
    ],
    correct: 0,
    explain: 'Mutate truc tiep co the khong trigger render dung.',
  },
];

export const BugHuntArena: React.FC = () => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [myScore, setMyScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const task = TASKS[index % TASKS.length];

  React.useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timeLeft, done]);

  React.useEffect(() => {
    if (done) return;
    const enemyId = window.setTimeout(() => {
      const gain = Math.random() > 0.4 ? 100 : 20;
      setEnemyScore((s) => s + gain);
    }, 2500);
    return () => window.clearTimeout(enemyId);
  }, [index, done]);

  const statusText = useMemo(() => {
    if (!done) return 'Dang thi dau';
    if (myScore >= enemyScore) return 'Ban thang tran Bug Hunt!';
    return 'Ban thua tran Bug Hunt!';
  }, [done, myScore, enemyScore]);

  const submit = () => {
    if (picked === null || done) return;
    const correct = picked === task.correct;
    const gain = correct ? 120 + Math.floor(timeLeft / 3) : 10;
    setMyScore((s) => s + gain);
    setLog((prev) => [
      `Task ${task.id.toUpperCase()}: ${correct ? 'Dung' : 'Sai'} (+${gain})`,
      ...prev,
    ]);

    if (index >= TASKS.length - 1) {
      setDone(true);
      return;
    }

    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setTimeLeft(60);
    setMyScore(0);
    setEnemyScore(0);
    setPicked(null);
    setDone(false);
    setLog([]);
  };

  return (
    <div className="bug-hunt-page">
      <div className="bug-hunt-header">
        <h1>Bug Hunt Arena 2v2 (Standalone)</h1>
        <p>San bug toc do: fix dung bug de gianh diem cao.</p>
      </div>

      <div className="bug-hunt-grid">
        <section className="bug-card">
          <div className="bug-top">
            <span>Timer: {timeLeft}s</span>
            <span>Round: {index + 1}/{TASKS.length}</span>
          </div>

          <h2>{task.title}</h2>
          <pre>{task.snippet}</pre>

          <div className="choice-list">
            {task.choices.map((c, i) => (
              <button
                key={c}
                className={picked === i ? 'picked' : ''}
                onClick={() => setPicked(i)}
                disabled={done}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="actions">
            <button onClick={submit} disabled={picked === null || done}>Submit fix</button>
            <button onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>

          <p className="explain">Goi y: {task.explain}</p>
        </section>

        <section className="score-card">
          <h3>Scoreboard</h3>
          <p>Team Ban: <strong>{myScore}</strong></p>
          <p>Team Doi Thu: <strong>{enemyScore}</strong></p>
          <p className="status">{statusText}</p>

          {done && <button onClick={restart}>Rematch</button>}

          <h4>Combat log</h4>
          <ul>
            {log.length === 0 && <li>Chua co log.</li>}
            {log.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
