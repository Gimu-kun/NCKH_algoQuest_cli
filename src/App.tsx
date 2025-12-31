/**
 * Component App Chính - Pháp Sư Thuật Toán
 * Điều hướng giữa các cảnh game khác nhau dựa trên trạng thái game
 */

import { useGameStore, GameScene } from './store/gameStore';
import { MainMenu } from './components/ui/MainMenu';
import { HubWorld } from './pages/HubWorld';
import { Dungeon } from './pages/Dungeon';
import { LogicFarm } from './pages/LogicFarm';
import { Achievements } from './pages/Achievements';
import { Leaderboards } from './pages/Leaderboards';
import { RunicConsole } from './components/ui/RunicConsole';
import { QuizBattle } from './components/combat/QuizBattle';
import { DialogueBox } from './components/ui/DialogueBox';
import { QuestTracker } from './components/quests/QuestTracker';
import { Settings } from './components/ui/Settings';
import { SparkyGuide } from './components/ui/SparkyGuide';
import './App.css';

import { useEffect } from 'react';

function App() {
  const { currentScene, endCombat, theme, combat } = useGameStore();

  // Apply theme class
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // Điều hướng Cảnh
  const renderScene = () => {
    switch (currentScene) {
      case GameScene.MAIN_MENU:
        return <MainMenu />;

      case GameScene.HUB_WORLD:
        return <HubWorld />;

      case GameScene.COMBAT:
        return (
          <QuizBattle
            monsterId={combat.monsterId || 'logic_slime'}
            onVictory={() => {
              endCombat(true);
            }}
          />
        );

      case GameScene.DUNGEON:
        return <Dungeon />;

      case GameScene.LOGIC_FARM:
        return <LogicFarm />;

      case GameScene.ACHIEVEMENTS:
        return <Achievements />;

      case GameScene.LEADERBOARDS:
        return <Leaderboards />;

      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="app">
      {renderScene()}

      {/* Lớp Phủ UI Toàn Cục */}
      <RunicConsole />
      <DialogueBox />
      <QuestTracker />

      <SparkyGuide />
      <Settings />
    </div>
  );
}

export default App;
