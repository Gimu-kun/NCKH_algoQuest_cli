// src/pages/MainMenu/MainMenu.example.tsx
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXAMPLE: How to Use Vietnamese Translations
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * This file shows the pattern for integrating translations
 * into existing components. Copy-paste the pattern into any
 * component to add Vietnamese language support.
 */

import { useTranslation } from '../../i18n';

// STEP 1: Import the hook at the top of your component
// import { useTranslation } from '../../i18n';

// STEP 2: Destructure the `t` function in your component
export const ExampleComponent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* STEP 3: Replace hardcoded strings with t('path.to.key') */}
      
      {/* BEFORE: */}
      {/* <h1>Pháp Sư Thuật Toán</h1> */}
      
      {/* AFTER: */}
      <h1><i className="fi fi-rr-magic-wand"></i> {t('mainMenu.title')}</h1>
      <p>{t('mainMenu.subtitle')}</p>

      {/* Example form: */}
      <form>
        <label>{t('mainMenu.username')}</label>
        <input type="text" placeholder={t('mainMenu.username')} />

        <label>{t('mainMenu.password')}</label>
        <input type="password" placeholder={t('mainMenu.password')} />

        <button>{t('mainMenu.login')}</button>
        <button>{t('mainMenu.register')}</button>
      </form>

      {/* Example error messages: */}
      <div className="error">
        {t('errors.connectionError')}
      </div>

      {/* Example common words: */}
      <p>{t('common.loading')}</p>
      <p>{t('common.cancel')}</p>
      <p>{t('common.confirm')}</p>
    </div>
  );
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TRANSLATION KEY REFERENCE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MAIN MENU:
 * ─────────────────────────────────────────────────────────────
 * t('mainMenu.title')                 → 'AlgoQuest - Cuộc Phiêu Lưu...'
 * t('mainMenu.newGame')               → 'Chơi Mới'
 * t('mainMenu.continueGame')          → 'Tiếp Tục'
 * t('mainMenu.username')              → 'Tên Người Chơi'
 * t('mainMenu.password')              → 'Mật Khẩu'
 * t('mainMenu.login')                 → 'Đăng Nhập'
 * t('mainMenu.register')              → 'Đăng Ký'
 * t('mainMenu.loginSuccess')          → 'Đăng nhập thành công!'
 * 
 * HUB WORLD:
 * ─────────────────────────────────────────────────────────────
 * t('hub.title')                      → 'Thế Giới Trung Tâm'
 * t('hub.subtitle')                   → 'Thánh Địa Dòng Chảy'
 * t('hub.npcs.professor')             → 'Giáo Sư Alric'
 * t('hub.npcs.guildLeader')           → 'Thủ Lĩnh Guild'
 * 
 * QUESTS & ADVENTURE:
 * ─────────────────────────────────────────────────────────────
 * t('adventure.title')                → 'Hành Trình Phiêu Lưu'
 * t('adventure.stage')                → 'Ải'
 * t('adventure.chapter')              → 'Chương'
 * t('adventure.completed')            → 'Hoàn Thành'
 * t('adventure.locked')               → 'Khóa'
 * t('adventure.claimReward')          → 'Nhận Phần Thưởng'
 * 
 * COMBAT:
 * ─────────────────────────────────────────────────────────────
 * t('combat.title')                   → 'Trận Chiến'
 * t('combat.victory')                 → 'Chiến Thắng!'
 * t('combat.defeat')                  → 'Thua Cuộc!'
 * t('combat.correct')                 → 'Chính Xác!'
 * t('combat.incorrect')               → 'Sai Rồi!'
 * 
 * COMMON WORDS:
 * ─────────────────────────────────────────────────────────────
 * t('common.yes')                     → 'Có'
 * t('common.no')                      → 'Không'
 * t('common.ok')                      → 'OK'
 * t('common.cancel')                  → 'Hủy'
 * t('common.confirm')                 → 'Xác Nhận'
 * t('common.loading')                 → 'Đang Tải...'
 * t('common.error')                   → 'Lỗi'
 * t('common.success')                 → 'Thành Công'
 * 
 * ERRORS:
 * ─────────────────────────────────────────────────────────────
 * t('errors.connectionError')         → 'Lỗi kết nối...'
 * t('errors.serverError')             → 'Lỗi máy chủ...'
 * t('errors.unauthorized')            → 'Bạn không được phép...'
 * 
 * See src/i18n/vi.ts for complete translation list
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * IMPLEMENTATION STEPS FOR EACH PAGE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 1. MAIN MENU (src/pages/MainMenu/MainMenu.tsx)
 *    Lines to replace: ~40 strings
 *    Effort: 30 minutes
 *    Key sections:
 *    - Logo & title
 *    - Menu buttons
 *    - Form labels
 *    - Error/success messages
 * 
 * 2. HUB WORLD (src/pages/HubWorld/HubWorld.tsx)
 *    Lines to replace: ~25 strings
 *    Effort: 20 minutes
 *    Key sections:
 *    - Page title
 *    - NPC names & roles
 *    - Button labels
 * 
 * 3. DUNGEON (src/pages/Dungeon.tsx)
 *    Lines to replace: ~35 strings
 *    Effort: 25 minutes
 *    Key sections:
 *    - UI labels (Health, Score)
 *    - Room types
 *    - Messages (battle, treasure)
 *    - Movement labels
 * 
 * 4. STAGE PLAY (src/pages/StagePlay/StagePlay.tsx)
 *    Lines to replace: ~20 strings
 *    Effort: 15 minutes
 *    Key sections:
 *    - Question type labels
 *    - Button labels
 *    - Feedback messages
 * 
 * 5. ALGO LAB (src/pages/AlgoLab.tsx)
 *    Lines to replace: ~30 strings
 *    Effort: 20 minutes
 *    Key sections:
 *    - Algorithm names
 *    - Category labels
 *    - Input/output labels
 * 
 * 6. LEADERBOARDS (src/pages/Leaderboards.tsx)
 *    Lines to replace: ~20 strings
 *    Effort: 15 minutes
 *    Key sections:
 *    - Page title
 *    - Column headers
 *    - Leaderboard types
 * 
 * 7. ACHIEVEMENTS (src/pages/Achievements.tsx)
 *    Lines to replace: ~15 strings
 *    Effort: 10 minutes
 * 
 * 8. DIALOGUE BOX (src/components/ui/DialogueBox.tsx)
 *    Lines to replace: ~25 strings
 *    Effort: 20 minutes
 * 
 * TOTAL ESTIMATED EFFORT: ~2.5 hours for a skilled dev
 * TOTAL STRINGS: ~200+ Vietnamese terms fully translated
 * 
 * Test checklist after updating each file:
 * ✓ npm run build (no errors)
 * ✓ Component renders correctly
 * ✓ All text displays in Vietnamese
 * ✓ No console warnings
 * ✓ Language switcher works (if implemented)
 */

export default ExampleComponent;
