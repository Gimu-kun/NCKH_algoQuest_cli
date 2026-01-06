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

import { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Định nghĩa Mapping ngoài Component
const SCENE_TO_PATH: Partial<Record<GameScene, string>> = {
  [GameScene.MAIN_MENU]: '/',
  [GameScene.HUB_WORLD]: '/hub',
  [GameScene.COMBAT]: '/combat',
  [GameScene.LOGIC_FARM]: '/farm',
  [GameScene.SHOP]: '/shop',
  [GameScene.ACHIEVEMENTS]: '/achievements',
  [GameScene.LEADERBOARDS]: '/leaderboards',
};

function App() {
  const { currentScene, setScene, enterDungeon, currentDungeonId, endCombat, theme, combat } = useGameStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRender = useRef(true);

  // Sync URL -> Store (Precedence on Load / Back Button)
  useEffect(() => {
    // 1. Check for specific dungeon path: /dungeon/:id
    if (location.pathname.startsWith('/dungeon/')) {
      const dungeonId = location.pathname.split('/')[2];
      if (dungeonId) {
        if (currentScene !== GameScene.DUNGEON || currentDungeonId !== dungeonId) {
          // Force entry on load/URL change
          enterDungeon(dungeonId);
        }
      }
    }
    // 2. Check logic bình thường cho các scene khác
    else {
      const entry = Object.entries(SCENE_TO_PATH).find(([, path]) => path === location.pathname);
      if (entry) {
        const scene = entry[0] as GameScene;
        // Chỉ update nếu khác state hiện tại
        if (currentScene !== scene) {
          setScene(scene);
        }
      }
    }
  }, [location.pathname, currentScene, currentDungeonId, enterDungeon, setScene]); // All dependencies included (zustand functions are stable)

  // Sync Store -> URL (Game Logic Navigation)
  // Chỉ chạy khi state thay đổi, nhưng bỏ qua lần đầu (do URL load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentScene === GameScene.DUNGEON) {
      const dungeonPath = `/dungeon/${currentDungeonId || 'dungeon_1'}`;
      if (location.pathname !== dungeonPath) {
        navigate(dungeonPath);
      }
    } else {
      const path = SCENE_TO_PATH[currentScene];
      if (path && location.pathname !== path) {
        navigate(path);
      }
    }
  }, [currentScene, currentDungeonId, navigate, location.pathname]); // Include all dependencies

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
