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
import { ShopInterface } from './components/ui/ShopInterface';
import './App.css';

import { useEffect } from 'react';

function App() {
  const { currentScene, endCombat, theme, combat } = useGameStore();

  // Áp dụng lớp giao diện (Theme Class)
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // Quản lý Nhạc nền (BGM System)
  useEffect(() => {
    const bgmMap: Record<string, string> = {
      [GameScene.MAIN_MENU]: '/assets/audio/bgm_menu.mp3',
      [GameScene.HUB_WORLD]: '/assets/audio/bgm_hub.mp3',
      [GameScene.LOGIC_FARM]: '/assets/audio/bgm_farm.mp3',
      [GameScene.DUNGEON]: '/assets/audio/bgm_dungeon.mp3',
      [GameScene.COMBAT]: '/assets/audio/bgm_combat.mp3',
      [GameScene.SHOP]: '/assets/audio/bgm_shop.mp3',
    };

    const track = bgmMap[currentScene];
    if (track) {
      import('./game/audio/AudioManager').then(({ audioManager }) => {
        audioManager.playBGM(track);
      });
    }
  }, [currentScene]);

  // Điều hướng Cảnh (Render Scene)
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

      case GameScene.SHOP:
        return <ShopInterface />;

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

      {/* Lớp Phủ UI Toàn Cục (Global UI Overlay) */}
      <RunicConsole />
      <DialogueBox />
      <QuestTracker />

      <SparkyGuide />
      <Settings />
    </div>
  );
}

export default App;
