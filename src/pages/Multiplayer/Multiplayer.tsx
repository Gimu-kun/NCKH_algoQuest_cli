import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { multiplayerRealtimeService } from '../../services/multiplayerRealtimeService';
import type { MatchPhase, MultiplayerMode, QuizQuestion, RoomState } from '../../types/multiplayerType';
import './Multiplayer.css';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    chapter: 2,
    prompt: 'Do phuc tap trung binh cua Quick Sort la gi?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    answerIndex: 1,
  },
  {
    id: 'q2',
    chapter: 3,
    prompt: 'Cau truc du lieu nao hoat dong theo LIFO?',
    options: ['Queue', 'Heap', 'Stack', 'Graph'],
    answerIndex: 2,
  },
  {
    id: 'q3',
    chapter: 5,
    prompt: 'Trong BST, tat ca node ben trai co gia tri nhu the nao?',
    options: ['Lon hon node goc', 'Nho hon node goc', 'Bang node goc', 'Ngau nhien'],
    answerIndex: 1,
  },
];

const MODE_META: Record<MultiplayerMode, { title: string; description: string }> = {
  DUEL_1V1: {
    title: 'Dau toc do 1v1',
    description: 'Tra loi nhanh va chinh xac de gianh chien thang tung luot.',
  },
  COOP_DUNGEON: {
    title: 'Co-op Dungeon 2 nguoi',
    description: 'Mot nguoi giai do, mot nguoi chien dau, phoi hop de vuot ai.',
  },
  TEAM_2V2: {
    title: 'Team Quiz 2v2 theo chapter',
    description: 'Hai doi doi khang theo bo cau hoi chuong da chon.',
  },
};

function getResultText(state: RoomState | null, myId: string): string {
  if (!state) return 'Tran dau ket thuc.';
  const me = state.players.find((p) => p.id === myId);
  const opponentScore = state.players.filter((p) => p.id !== myId).reduce((sum, p) => sum + p.score, 0);
  const myScore = me?.score ?? 0;

  if (state.mode === 'COOP_DUNGEON') {
    return myScore + opponentScore >= 200
      ? 'Co-op thanh cong! Hai ban da vuot ai.'
      : 'Co-op that bai, can phoi hop tot hon.';
  }

  if (state.mode === 'TEAM_2V2') {
    return myScore >= opponentScore ? 'Doi cua ban thang vong chapter!' : 'Doi ban thua vong chapter.';
  }

  return myScore >= opponentScore ? 'Ban thang tran 1v1!' : 'Ban thua tran 1v1.';
}

export const Multiplayer: React.FC = () => {
  const navigate = useNavigate();

  const [joinCode, setJoinCode] = useState('');
  const [localMode, setLocalMode] = useState<MultiplayerMode>('DUEL_1V1');
  const [localChapter, setLocalChapter] = useState(2);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [localFeedback, setLocalFeedback] = useState('');

  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [connection, setConnection] = useState({ connected: true, ping: 32 });
  const [timeLeft, setTimeLeft] = useState(30);

  const myId = multiplayerRealtimeService.getPlayerId();
  const phase: MatchPhase = roomState?.phase ?? 'LOBBY';

  const myPlayer = roomState?.players.find((p) => p.id === myId);
  const opponentPlayers = roomState?.players.filter((p) => p.id !== myId) ?? [];

  const currentQuestion = useMemo(() => {
    const chapter = roomState?.chapter ?? localChapter;
    const questionIndex = roomState?.questionIndex ?? 0;
    const byChapter = QUESTIONS.filter((q) => q.chapter === chapter);
    const pool = byChapter.length ? byChapter : QUESTIONS;
    return pool[questionIndex % pool.length];
  }, [roomState?.chapter, roomState?.questionIndex, localChapter]);

  useEffect(() => {
    const playerName = `Nguoi-Choi-${myId.slice(-4).toUpperCase()}`;
    multiplayerRealtimeService.setIdentity(playerName);

    const unsubState = multiplayerRealtimeService.subscribe((state) => {
      setRoomState(state);
      if (!state || state.phase !== 'MATCH') {
        setSubmitted(false);
        setSelectedAnswer(null);
      }
      if (state?.phase === 'RESULT') {
        setLocalFeedback(state.resultText || getResultText(state, myId));
      }
    });

    const unsubConn = multiplayerRealtimeService.subscribeConnection(setConnection);

    return () => {
      unsubState();
      unsubConn();
    };
  }, [myId]);

  useEffect(() => {
    if (!roomState?.timerEndsAt || roomState.phase !== 'MATCH') {
      setTimeLeft(30);
      return;
    }

    const update = () => {
      const remaining = Math.max(0, Math.ceil((roomState.timerEndsAt! - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        multiplayerRealtimeService.finishRound(getResultText(roomState, myId));
      }
    };

    update();
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [roomState, myId]);

  const createRoom = () => {
    const code = multiplayerRealtimeService.createRoom(localMode, localChapter);
    setJoinCode(code);
  };

  const joinRoom = () => {
    multiplayerRealtimeService.joinRoom(joinCode);
  };

  const toggleReady = () => {
    multiplayerRealtimeService.toggleReady();
  };

  const startMatch = () => {
    multiplayerRealtimeService.startMatch();
    setSubmitted(false);
    setSelectedAnswer(null);
    setLocalFeedback('');
  };

  const submitAnswer = () => {
    if (submitted || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQuestion.answerIndex;
    multiplayerRealtimeService.submitAnswer(isCorrect, timeLeft);
    setSubmitted(true);
    setLocalFeedback(isCorrect ? 'Ban tra loi dung!' : 'Ban tra loi sai.');
  };

  const finishRound = () => {
    multiplayerRealtimeService.finishRound(getResultText(roomState, myId));
  };

  const rematch = () => {
    multiplayerRealtimeService.rematch();
    setSubmitted(false);
    setSelectedAnswer(null);
    setLocalFeedback('');
  };

  const backLobby = () => {
    multiplayerRealtimeService.leaveRoom();
    setRoomState(null);
    setSelectedAnswer(null);
    setSubmitted(false);
    setLocalFeedback('');
  };

  const onModeChange = (mode: MultiplayerMode) => {
    setLocalMode(mode);
    if (roomState?.phase === 'LOBBY') multiplayerRealtimeService.setMode(mode);
  };

  const onChapterChange = (chapter: number) => {
    setLocalChapter(chapter);
    if (roomState?.phase === 'LOBBY') multiplayerRealtimeService.setChapter(chapter);
  };

  const onRoleChange = (role: 'GIAI_DO' | 'CHIEN_DAU') => {
    multiplayerRealtimeService.setRole(role);
  };

  const canStart = multiplayerRealtimeService.canStart();
  const mode = roomState?.mode ?? localMode;
  const chapter = roomState?.chapter ?? localChapter;

  return (
    <div className="multiplayer-page">
      <div className="multiplayer-header">
        <div>
          <h1>Dau Truong Multiplayer</h1>
          <p>Realtime room sync: create/join, ready, timer, ket qua, rematch, reconnect.</p>
        </div>
        <div className="connection-panel">
          <span className={`status-dot ${connection.connected ? 'online' : 'offline'}`} />
          <span>{connection.connected ? 'Da ket noi' : 'Mat ket noi'}</span>
          <span>Ping: {connection.connected ? `${connection.ping} ms` : '--'}</span>
          <button onClick={() => multiplayerRealtimeService.reconnect()}>Reconnect</button>
        </div>
      </div>

      <div className="mode-grid">
        {(Object.keys(MODE_META) as MultiplayerMode[]).map((m) => (
          <motion.button
            key={m}
            whileHover={{ y: -4 }}
            className={`mode-card ${mode === m ? 'active' : ''}`}
            onClick={() => onModeChange(m)}
          >
            <h3>{MODE_META[m].title}</h3>
            <p>{MODE_META[m].description}</p>
          </motion.button>
        ))}
      </div>

      {phase === 'LOBBY' && (
        <div className="lobby-grid">
          <section className="panel">
            <h2>Lobby</h2>
            <div className="row">
              <button onClick={createRoom}>Tao phong</button>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Nhap ma phong"
              />
              <button onClick={joinRoom}>Join room</button>
            </div>
            <p>Ma phong hien tai: <strong>{roomState?.roomCode || 'Chua co'}</strong></p>
            <p>Host: <strong>{roomState?.hostId === myId ? 'Ban' : 'Nguoi khac'}</strong></p>
          </section>

          <section className="panel">
            <h2>Thiet lap mode</h2>
            <div className="row">
              <label>Chapter</label>
              <select value={chapter} onChange={(e) => onChapterChange(Number(e.target.value))}>
                <option value={1}>Chuong 1</option>
                <option value={2}>Chuong 2</option>
                <option value={3}>Chuong 3</option>
                <option value={4}>Chuong 4</option>
                <option value={5}>Chuong 5</option>
              </select>
            </div>

            {mode === 'COOP_DUNGEON' && (
              <div className="row">
                <label>Vai tro</label>
                <select
                  value={myPlayer?.role ?? 'GIAI_DO'}
                  onChange={(e) => onRoleChange(e.target.value as 'GIAI_DO' | 'CHIEN_DAU')}
                >
                  <option value="GIAI_DO">Giai do</option>
                  <option value="CHIEN_DAU">Chien dau</option>
                </select>
              </div>
            )}

            <div className="ready-row">
              <button onClick={toggleReady}>{myPlayer?.ready ? 'Huy san sang' : 'San sang'}</button>
              <span>Ban: {myPlayer?.ready ? 'Ready' : 'Not ready'}</span>
              <span>
                Doi thu: {opponentPlayers.some((p) => p.ready) ? 'Ready' : 'Not ready'}
              </span>
            </div>

            <button className="start-btn" onClick={startMatch} disabled={!canStart}>
              Bat dau tran
            </button>
          </section>
        </div>
      )}

      {phase === 'MATCH' && (
        <div className="match-panel panel">
          <div className="match-head">
            <h2>{MODE_META[mode].title}</h2>
            <span className={`timer ${timeLeft <= 8 ? 'danger' : ''}`}>Timer: {timeLeft}s</span>
          </div>

          <p className="question">{currentQuestion.prompt}</p>

          <div className="options-grid">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={opt}
                className={selectedAnswer === idx ? 'selected' : ''}
                onClick={() => setSelectedAnswer(idx)}
                disabled={submitted}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="match-actions">
            <button onClick={submitAnswer} disabled={submitted || selectedAnswer === null}>Nop dap an</button>
            <button onClick={finishRound}>Ket thuc luot</button>
          </div>

          <div className="score-line">
            <span>Diem ban: <strong>{myPlayer?.score ?? 0}</strong></span>
            <span>
              Diem doi thu: <strong>{opponentPlayers.reduce((sum, p) => sum + p.score, 0)}</strong>
            </span>
          </div>

          {localFeedback && <p className="hint-text">{localFeedback}</p>}
        </div>
      )}

      {phase === 'RESULT' && (
        <div className="result-panel panel">
          <h2>Ket qua tran</h2>
          <p>{roomState?.resultText || localFeedback}</p>
          <div className="score-line">
            <span>Ban: <strong>{myPlayer?.score ?? 0}</strong></span>
            <span>
              Doi thu/Doi con lai: <strong>{opponentPlayers.reduce((sum, p) => sum + p.score, 0)}</strong>
            </span>
          </div>
          <div className="row">
            <button onClick={rematch}>Rematch</button>
            <button onClick={backLobby}>Ve Lobby</button>
            <button onClick={() => navigate('/v1/hub')}>Ve Hub</button>
          </div>
        </div>
      )}
    </div>
  );
};
