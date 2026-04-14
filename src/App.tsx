/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ỨNG DỤNG CHÍNH (Main Application)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Component gốc của ứng dụng (Root Component).
 * Quản lý định tuyến trạng thái (State-based Routing) giữa các màn hình game.
 * 
 * CHỨC NĂNG:
 * - Scene Management: Chuyển đổi giữa Menu, Hub, Dungeon, Combat, etc.
 * - Global UI Overlay: Hiển thị các lớp phủ UI toàn cục (Dialog, Console, Quest, Sparky).
 * - Theme Management: Xử lý Dark/Light mode.
 * 
 * @component App
 * @category Core Application
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
import { useEffect } from 'react';
import './App.css';
import { RouteList } from './routes/RouteList';
import { useGameStore } from './store/gameStore';
import { usePlayerStore } from './store/playerStore';
import { initializeAutoSync } from './services/playerSyncService';

function App() {
  const theme = useGameStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark-theme');
    }
  }, [theme]);

  useEffect(() => {
    const cleanup = initializeAutoSync(() => {
      const player = usePlayerStore.getState();
      return {
        playerId: player.id,
        currentLevel: player.level,
        totalExperience: player.experience,
        achievements: player.achievements,
        questsCompleted: player.completedQuests.length,
        lastSyncTime: Date.now(),
      };
    });

    return () => cleanup();
  }, []);

  return (
    <div className="app">
      <RouteList/>
    </div>
  );
}

export default App;
