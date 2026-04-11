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

const SKILLS = ['Search Boost', 'Sort Shield', 'DP Shield', 'Graph Dash', 'Tree Vision'];

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
  CODE_DUEL_DRAFT: {
    title: 'Code Duel Draft 1v1',
    description: 'Draft 3 ky nang truoc tran, dau tri toc do va chien thuat.',
  },
  RACE_TO_PATH: {
    title: 'Race to Path (2-4 nguoi)',
    description: 'Toi uu duong di tren do thi, ai toi dich truoc se thang.',
  },
  BUG_HUNT_2V2: {
    title: 'Bug Hunt Arena 2v2',
    description: 'San bug nhanh, doi nao sua dung nhieu loi hon se thang.',
  },
  TOWER_DEFENSE_COOP: {
    title: 'Tower Defense Algo Co-op',
    description: 'Phoi hop queue, cache, va chon cau truc de giu lane.',
  },
  MEMORY_RELAY: {
    title: 'Memory Relay (3-5 nguoi)',
    description: 'Truyen chuoi thao tac DS theo luot, sai mot buoc la mat combo.',
  },
  TOURNAMENT_8: {
    title: 'Tournament Bracket 8',
    description: 'Dau nhanh theo nhanh dau, vao ban ket va chung ket.',
  },
};

function getResultText(state: RoomState | null, myId: string): string {
  if (!state) return 'Tran dau ket thuc.';
  const me = state.players.find((p) => p.id === myId);
  const opponentScore = state.players.filter((p) => p.id !== myId).reduce((sum, p) => sum + p.score, 0);
  const myScore = me?.score ?? 0;

  if (state.mode === 'COOP_DUNGEON' || state.mode === 'TOWER_DEFENSE_COOP') {
    return myScore + opponentScore >= 220
      ? 'Co-op thanh cong! Team da vuot muc tieu.'
      : 'Co-op that bai, can phoi hop tot hon.';
  }

  if (state.mode === 'TEAM_2V2' || state.mode === 'BUG_HUNT_2V2') {
    return myScore >= opponentScore ? 'Doi cua ban thang vong nay!' : 'Doi cua ban thua vong nay.';
  }

  return myScore >= opponentScore ? 'Ban thang tran!' : 'Ban thua tran!';
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

  // Mode-specific states
  const [draftSkills, setDraftSkills] = useState<string[]>([]);
  const [raceProgress, setRaceProgress] = useState(0);
  const [bugFixedCount, setBugFixedCount] = useState(0);
  const [towerHealth, setTowerHealth] = useState(100);
  const [memoryInput, setMemoryInput] = useState('');
  const [memoryCombo, setMemoryCombo] = useState(0);
  const [tournamentRound, setTournamentRound] = useState<'QF' | 'SF' | 'F'>('QF');

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

  const memorySequence = useMemo(() => {
    return ['push', 'push', 'pop', 'enqueue', 'dequeue'];
  }, []);

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
    if (mode === 'CODE_DUEL_DRAFT' && draftSkills.length < 3) {
      setLocalFeedback('Mode Draft can chon du 3 ky nang truoc khi bat dau.');
      return;
    }

    multiplayerRealtimeService.startMatch();
    setSubmitted(false);
    setSelectedAnswer(null);
    setLocalFeedback('');
    setRaceProgress(0);
    setBugFixedCount(0);
    setTowerHealth(100);
    setMemoryCombo(0);
    setMemoryInput('');
    setTournamentRound('QF');
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
    setRaceProgress(0);
    setBugFixedCount(0);
    setTowerHealth(100);
    setMemoryCombo(0);
    setMemoryInput('');
    setTournamentRound('QF');
  };

  const backLobby = () => {
    multiplayerRealtimeService.leaveRoom();
    setRoomState(null);
    setSelectedAnswer(null);
    setSubmitted(false);
    setLocalFeedback('');
  };

  const onModeChange = (nextMode: MultiplayerMode) => {
    setLocalMode(nextMode);
    if (roomState?.phase === 'LOBBY') multiplayerRealtimeService.setMode(nextMode);
    setDraftSkills([]);
    setLocalFeedback('');
  };

  const onChapterChange = (chapter: number) => {
    setLocalChapter(chapter);
    if (roomState?.phase === 'LOBBY') multiplayerRealtimeService.setChapter(chapter);
  };

  const onRoleChange = (role: 'GIAI_DO' | 'CHIEN_DAU') => {
    multiplayerRealtimeService.setRole(role);
  };

  const toggleSkill = (skill: string) => {
    setDraftSkills((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= 3) return prev;
      return [...prev, skill];
    });
  };

  const performRaceMove = (fast: boolean) => {
    const gain = fast ? 3 : 2;
    const newProgress = Math.min(12, raceProgress + gain);
    setRaceProgress(newProgress);
    multiplayerRealtimeService.submitAnswer(true, timeLeft);
    if (newProgress >= 12) {
      multiplayerRealtimeService.finishRound('Ban da ve dich truoc o mode Race to Path!');
    }
  };

  const fixBug = (isRealBug: boolean) => {
    if (isRealBug) {
      setBugFixedCount((v) => v + 1);
      multiplayerRealtimeService.submitAnswer(true, timeLeft);
      setLocalFeedback('Fix dung bug +1');
    } else {
      multiplayerRealtimeService.submitAnswer(false, timeLeft);
      setLocalFeedback('Fix sai, tru diem nhe.');
    }
  };

  const defendTower = (action: 'QUEUE' | 'CACHE') => {
    const delta = action === 'QUEUE' ? 10 : 15;
    setTowerHealth((hp) => Math.max(0, Math.min(100, hp + delta - 8)));
    multiplayerRealtimeService.submitAnswer(true, timeLeft);
  };

  const submitMemoryStep = () => {
    const expected = memorySequence[memoryCombo % memorySequence.length];
    if (memoryInput.trim().toLowerCase() === expected) {
      setMemoryCombo((v) => v + 1);
      multiplayerRealtimeService.submitAnswer(true, timeLeft);
      setLocalFeedback('Dung nhip relay!');
    } else {
      setMemoryCombo(0);
      multiplayerRealtimeService.submitAnswer(false, timeLeft);
      setLocalFeedback('Sai chuoi, reset combo.');
    }
    setMemoryInput('');
  };

  const advanceTournament = () => {
    if (tournamentRound === 'QF') setTournamentRound('SF');
    else if (tournamentRound === 'SF') setTournamentRound('F');
    else multiplayerRealtimeService.finishRound('Ban la nha vo dich Tournament!');
    multiplayerRealtimeService.submitAnswer(true, timeLeft);
  };

  const canStart = multiplayerRealtimeService.canStart();
  const mode = roomState?.mode ?? localMode;
  const chapter = roomState?.chapter ?? localChapter;

  return (
    <div className="multiplayer-page">
      <div className="multiplayer-header">
        <div>
          <h1>Dau Truong Multiplayer</h1>
          <p>Full mode pack: lobby, room, ready, ping, reconnect, result, rematch.</p>
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

            {mode === 'CODE_DUEL_DRAFT' && (
              <div className="draft-box">
                <p>Chon 3 ky nang truoc tran:</p>
                <div className="chip-row">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      className={`chip ${draftSkills.includes(skill) ? 'chip-active' : ''}`}
                      onClick={() => toggleSkill(skill)}
                      type="button"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <p>Da chon: {draftSkills.length}/3</p>
              </div>
            )}

            <div className="ready-row">
              <button onClick={toggleReady}>{myPlayer?.ready ? 'Huy san sang' : 'San sang'}</button>
              <span>Ban: {myPlayer?.ready ? 'Ready' : 'Not ready'}</span>
              <span>Doi thu: {opponentPlayers.some((p) => p.ready) ? 'Ready' : 'Not ready'}</span>
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

          <div className="mode-widget">
            {mode === 'RACE_TO_PATH' && (
              <div className="widget-card">
                <h3>Race to Path</h3>
                <p>Tien do den dich: {raceProgress}/12</p>
                <div className="row">
                  <button onClick={() => performRaceMove(true)}>Edge Risk (nhanh)</button>
                  <button onClick={() => performRaceMove(false)}>Edge Safe</button>
                </div>
              </div>
            )}

            {mode === 'BUG_HUNT_2V2' && (
              <div className="widget-card">
                <h3>Bug Hunt Arena</h3>
                <p>Bug da fix: {bugFixedCount}</p>
                <div className="row">
                  <button onClick={() => fixBug(true)}>Fix null pointer</button>
                  <button onClick={() => fixBug(true)}>Fix off-by-one</button>
                  <button onClick={() => fixBug(false)}>Fix fake bug</button>
                  <button onClick={() => navigate('/v1/multiplayer/bug-hunt')}>Mo game doc lap</button>
                </div>
              </div>
            )}

            {mode === 'TOWER_DEFENSE_COOP' && (
              <div className="widget-card">
                <h3>Tower Defense Algo</h3>
                <p>HP tru: {towerHealth}</p>
                <div className="row">
                  <button onClick={() => defendTower('QUEUE')}>Deploy Queue</button>
                  <button onClick={() => defendTower('CACHE')}>Enable Cache</button>
                </div>
              </div>
            )}

            {mode === 'MEMORY_RELAY' && (
              <div className="widget-card">
                <h3>Memory Relay</h3>
                <p>Combo: {memoryCombo}</p>
                <p>Nhap lenh tiep theo cua chuoi: {memorySequence.join(' -> ')}</p>
                <div className="row">
                  <input
                    value={memoryInput}
                    onChange={(e) => setMemoryInput(e.target.value)}
                    placeholder="VD: push"
                  />
                  <button onClick={submitMemoryStep}>Gui lenh</button>
                </div>
              </div>
            )}

            {mode === 'TOURNAMENT_8' && (
              <div className="widget-card">
                <h3>Tournament Bracket</h3>
                <p>Round hien tai: {tournamentRound}</p>
                <button onClick={advanceTournament}>Advance round</button>
              </div>
            )}
          </div>

          <div className="score-line">
            <span>Diem ban: <strong>{myPlayer?.score ?? 0}</strong></span>
            <span>Diem doi thu: <strong>{opponentPlayers.reduce((sum, p) => sum + p.score, 0)}</strong></span>
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
            <span>Doi thu/Doi con lai: <strong>{opponentPlayers.reduce((sum, p) => sum + p.score, 0)}</strong></span>
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
