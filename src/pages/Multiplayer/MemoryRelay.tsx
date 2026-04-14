import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiplayerStandalone.css';

export const MemoryRelay: React.FC = () => {
  const navigate = useNavigate();
  const sequence = useMemo(() => ['push 10', 'push 7', 'pop', 'enqueue 5', 'dequeue'], []);

  const [step, setStep] = useState(0);
  const [combo, setCombo] = useState(0);
  const [input, setInput] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const expected = sequence[step % sequence.length];

  const submit = () => {
    const ok = input.trim().toLowerCase() === expected.toLowerCase();
    if (ok) {
      setCombo((c) => c + 1);
      setStep((s) => s + 1);
      setLog((prev) => [`Dung: ${input}`, ...prev]);
    } else {
      setCombo(0);
      setLog((prev) => [`Sai: ${input} (expected ${expected})`, ...prev]);
    }
    setInput('');
  };

  return (
    <div className="mp-standalone-page">
      <div className="mp-standalone-header">
        <h1>Memory Relay (Standalone)</h1>
        <p>Truyen chuoi thao tac DS theo dung thu tu de giu combo.</p>
      </div>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Relay Console</h2>
          <p>Expected command: <strong>{expected}</strong></p>
          <p>Combo hien tai: <strong>{combo}</strong></p>
          <input className="mp-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="VD: push 10" />
          <div className="mp-actions">
            <button className="mp-btn primary" onClick={submit}>Gui lenh</button>
            <button className="mp-btn" onClick={() => navigate('/v1/multiplayer')}>Ve Multiplayer Hub</button>
          </div>
        </section>

        <aside className="mp-card">
          <h3>Log</h3>
          <ul className="mp-list">
            {log.length === 0 && <li>Chua co thao tac.</li>}
            {log.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};
