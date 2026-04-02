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
import './App.css';
import { RouteList } from './routes/RouteList';

function App() {
  /*
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
      [GameScene.ALGO_LAB]: '/assets/audio/bgm_hub.mp3',
    };

    const track = bgmMap[currentScene];
    if (track) {
      import('./game/audio/AudioManager').then(({ audioManager }) => {
        audioManager.playBGM(track);
      }).catch(e => console.warn('Audio system failed to load:', e));
    }
  }, [currentScene]);
  */

  return (
    <div className="app">
      <RouteList/>
    </div>
  );
}

export default App;
