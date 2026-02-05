/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * LEARNING INTERFACE - BOOK-STYLE PAGE-BASED LEARNING SYSTEM
 * (GIAO DIỆN HỌC TẬP - HỆ THỐNG HỌC THEO TRANG SÁCH)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - Component đóng vai trò là "container" chính cho trải nghiệm học tập chi tiết.
 * - Mô phỏng giao diện một cuốn sách điện tử (E-Book) hiện đại, tạo cảm giác thân thiện.
 * - Quản lý việc hiển thị nội dung của từng trang (Theory, Demo, Quiz...) dựa trên ID.
 * 
 * 🏗️ KIẾN TRÚC & FLOW:
 * 1. **Component Structure**:
 *    - `LearningInterface` (Root)
 *      └── `BookPageTabs` (Thanh điều hướng nhanh phía trên)
 *      └── `BookNavigationArrows` (Nút lật trang trái/phải)
 *      └── `BookContainer` (Khung cuốn sách với hiệu ứng 3D/Shadow)
 *          └── `BookPageTransition` (Wrapper xử lý animation lật trang)
 *              └── `PageContent` (Nội dung thực tế: TheoryPage, QuizPage...)
 * 
 * 2. **Navigation Flow**:
 *    - User click tab hoặc arrow -> Update `currentPageId` -> Trigger Animation -> Render Page mới.
 *    - Keyboard Event (Arrow Keys) cũng kích hoạt luồng này.
 * 
 * 🛠️ KỸ THUẬT & THUẬT TOÁN:
 * - **Derived State with useMemo**: Tính toán `pageIndex` từ `pageId` để đảm bảo hiệu năng.
 * - **Framer Motion Variants**: Xử lý animation phức tạp (lật trang 3D, slide in/out).
 * - **Defensive Programming**: Kiểm tra kỹ null/undefined cho module và page để tránh crash.
 * 
 * ✅ ƯU ĐIỂM:
 * - **Immersive Experience**: Giao diện sách giúp người dùng tập trung hơn.
 * - **Scalable**: Dễ dàng thêm loại trang mới bằng cách mở rộng `PAGE_TYPE_CONFIG` và `switch-case`.
 * 
 * ❌ NHƯỢC ĐIỂM:
 * - **Complexity**: Logic xử lý animation 2 chiều (prev/next) khá phức tạp.
 * 
 * @component LearningInterface
 * @category Components/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import {
  useLearningProgressStore,
  PageType,
  type LearningPage
} from '../../store/learningProgressStore';
import { getModuleById } from '../../data/learningModules';

// Import Page Components (Lazy loading could be applied here for optimization)
import TheoryPage from './pages/TheoryPage';
import DemoPage from './pages/DemoPage';
import QuizPage from './pages/QuizPage';
import PracticePage from './pages/PracticePage';
import SummaryPage from './pages/SummaryPage';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

interface LearningInterfaceProps {
  moduleId: string;        // ID của module đang học
  onComplete?: () => void; // Callback khi hoàn thành toàn bộ module
  onExit?: () => void;     // Callback khi thoát khỏi giao diện học
}

interface NavigationState {
  currentPageIndex: number;
  direction: 'next' | 'prev' | 'initial'; // Hướng di chuyển để quyết định animation
  isNavigating: boolean;                  // Khóa thao tác khi đang transition
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE TYPE CONFIG (CẤU HÌNH GIAO DIỆN THEO LOẠI TRANG)
// ═══════════════════════════════════════════════════════════════════════════
// Centralize configuration thay vì hardcode rải rác.
// Giúp dễ dàng thay đổi icon, màu sắc cho toàn bộ hệ thống.

const PAGE_TYPE_CONFIG = {
  [PageType.THEORY]: {
    icon: 'fi-rr-book-open-cover',
    label: 'Lý Thuyết',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50'
  },
  [PageType.DEMO]: {
    icon: 'fi-rr-play-circle',
    label: 'Minh Họa',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50'
  },
  [PageType.QUIZ]: {
    icon: 'fi-rr-ballot-check',
    label: 'Trắc Nghiệm',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50'
  },
  [PageType.PRACTICE]: {
    icon: 'fi-rr-code-simple',
    label: 'Thực Hành',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50'
  },
  [PageType.SUMMARY]: {
    icon: 'fi-rr-flag-checkered',
    label: 'Tóm Tắt',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS (COMPONENT HỖ TRỢ)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Book Page Tabs Component
 * 
 * 🔹 Chức năng:
 * - Hiển thị danh sách các trang dưới dạng Tabs/Bookmarks.
 * - Cho phép nhảy cóc (jump) đến một trang cụ thể.
 * - Hiển thị trạng thái hoàn thành (check mark) cho từng trang.
 */
const BookPageTabs: React.FC<{
  pages: LearningPage[];
  currentIndex: number;
  onPageSelect: (index: number) => void;
}> = ({ pages, currentIndex, onPageSelect }) => {
  return (
    <div className="flex items-center justify-center mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-800/40 rounded-2xl backdrop-blur-sm border border-gray-700/30">
        {pages.map((page, index) => {
          const config = PAGE_TYPE_CONFIG[page.type];
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex; // Giả định đơn giản: index nhỏ hơn là đã qua

          return (
            <motion.button
              key={page.id}
              onClick={() => onPageSelect(index)}
              className={`
              relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl
              transition-all duration-300 min-w-[72px]
              ${isActive
                  ? `bg-gradient-to-br ${config.color} text-white shadow-lg shadow-blue-500/20`
                  : isCompleted
                    ? 'bg-gray-700/50 text-white/80 hover:bg-gray-600/50'
                    : 'bg-transparent text-gray-400 hover:bg-gray-700/30 hover:text-gray-300'
                }
            `}
              whileHover={{ scale: isActive ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Completion indicator bubble */}
              {isCompleted && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <i className="fi fi-rr-check text-white text-[8px]"></i>
                </motion.div>
              )}

              <i className={`fi ${config.icon} ${isActive ? 'text-base' : 'text-sm'}`}></i>
              <span className="text-[10px] font-medium whitespace-nowrap">{config.label}</span>

              {/* Page number indicator */}
              <span className={`text-[9px] ${isActive ? 'text-white/60' : 'text-gray-500'}`}>
                {index + 1}/{pages.length}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Book Navigation Arrows
 * 
 * 🔹 Chức năng:
 * - Điều hướng trang Next/Previous.
 * - Xử lý nút "Hoàn Thành" ở trang cuối cùng.
 * 
 * 🔹 UI UX:
 * - Position Absolute để căn giữa theo chiều dọc.
 * - Disabled state khi ở đầu/cuối trang.
 */
const BookNavigationArrows: React.FC<{
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastPage: boolean;
  onComplete: () => void;
}> = ({ onPrevious, onNext, canGoPrevious, canGoNext, isLastPage, onComplete }) => {
  return (
    <>
      {/* Left Arrow - Previous Page */}
      <motion.button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`
          absolute left-2 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-xl flex items-center justify-center
          transition-all duration-200 border
          ${canGoPrevious
            ? 'bg-gray-800/90 hover:bg-gray-700 text-white border-gray-600/50 shadow-lg cursor-pointer'
            : 'bg-gray-900/30 text-gray-600 border-gray-800/50 cursor-not-allowed'
          }
        `}
        whileHover={canGoPrevious ? { scale: 1.08, x: -2 } : {}}
        whileTap={canGoPrevious ? { scale: 0.92 } : {}}
      >
        <i className="fi fi-rr-angle-left text-lg"></i>
      </motion.button>

      {/* Right Arrow - Next Page or Complete */}
      {isLastPage ? (
        <motion.button
          onClick={onComplete}
          className="
            absolute right-2 top-1/2 -translate-y-1/2 z-20
            px-4 py-2.5 rounded-xl flex items-center gap-2
            bg-gradient-to-r from-emerald-600 to-green-600 
            hover:from-emerald-500 hover:to-green-500
            text-white text-sm font-semibold shadow-lg shadow-green-500/25
            border border-green-500/30
          "
          whileHover={{ scale: 1.03, x: 2 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>Hoàn Thành</span>
          <i className="fi fi-rr-flag-checkered"></i>
        </motion.button>
      ) : (
        <motion.button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 rounded-xl flex items-center justify-center
            transition-all duration-200 border
            ${canGoNext
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-blue-500/30 shadow-lg shadow-blue-500/25 cursor-pointer'
              : 'bg-gray-900/30 text-gray-600 border-gray-800/50 cursor-not-allowed'
            }
          `}
          whileHover={canGoNext ? { scale: 1.08, x: 2 } : {}}
          whileTap={canGoNext ? { scale: 0.92 } : {}}
        >
          <i className="fi fi-rr-angle-right text-lg"></i>
        </motion.button>
      )}
    </>
  );
};


/**
 * BookPageTransition Component
 * 
 * 🔹 Mục đích:
 * - Tạo hiệu ứng lật trang 3D mượt mà.
 * 
 * 🔹 Thuật toán Animation (Framer Motion):
 * - Dựa vào `direction` (next/prev) để xác định điểm xuất phát (x: 300 hay -300)
 *   và góc quay (rotateY).
 * - Sử dụng `perspective` để tạo chiều sâu 3D.
 */
const BookPageTransition: React.FC<{
  children: React.ReactNode;
  direction: 'next' | 'prev' | 'initial';
  pageKey: string;
}> = ({ children, direction, pageKey }) => {
  const variants: Variants = {
    initial: {
      opacity: 0,
      x: direction === 'next' ? 300 : -300,
      rotateY: direction === 'next' ? -15 : 15,
      scale: 0.95
    },
    enter: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] // Cubic bezier curve for natural motion
      }
    },
    exit: {
      opacity: 0,
      x: direction === 'next' ? -300 : 300,
      rotateY: direction === 'next' ? 15 : -15,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <motion.div
      key={pageKey}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="w-full h-full"
      style={{ perspective: 1200 }} // Key cho hiệu ứng 3D
    >
      {children}
    </motion.div>
  );
};

/**
 * Book Container
 * Container trang trí giống cuốn sách vật lý.
 */
const BookContainer: React.FC<{
  children: React.ReactNode;
  pageType: PageType;
}> = ({ children, pageType }) => {
  const config = PAGE_TYPE_CONFIG[pageType];

  return (
    <div className="relative overflow-hidden">
      {/* Shadow layer giả lập độ cong của gáy sách */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 rounded-2xl pointer-events-none z-10"></div>

      {/* Spine (Gáy sách) indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.color} rounded-l-2xl`}></div>

      {/* Main Content Area */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
        {/* Corner Fold Effect (Hiệu ứng gấp góc) */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-700/30 to-transparent transform rotate-45 translate-x-6 -translate-y-6"></div>
        </div>

        {children}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT & LOGIC CENTER
// ═══════════════════════════════════════════════════════════════════════════

export const LearningInterface: React.FC<LearningInterfaceProps> = ({
  moduleId,
  onComplete,
  onExit
}) => {
  // Global State Access
  const { setScene } = useGameStore();
  const {
    currentModuleId,
    currentPageId,
    startModule,
    startPage,
    completePage,
    updateTimeSpent,

  } = useLearningProgressStore();

  // Local UI State
  const [navigation, setNavigation] = useState<NavigationState>({
    currentPageIndex: 0,
    direction: 'initial' as const,
    isNavigating: false
  });

  // Get Data: Lấy thông tin module hiện tại
  const module = getModuleById(moduleId);

  /**
   * Derived State Calculation
   * Tính toán index dựa trên ID để state luôn đồng bộ.
   * Dùng useMemo để tránh tính toán lại không cần thiết khi re-render.
   */
  const derivedPageIndex = useMemo(() => {
    if (module && currentPageId) {
      const idx = module.pages.findIndex((p: LearningPage) => p.id === currentPageId);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  }, [module, currentPageId]);

  /**
   * Initialization Effect
   * Đảm bảo module được start khi component mount.
   */
  /**
   * Initialization Effect
   * Đảm bảo module được start khi component mount.
   * Fix: Added check to prevent infinite loop if module object reference is unstable.
   */
  useEffect(() => {
    if (!module) return;

    // Only run if we are switching to a NEW module or if state is completely empty
    if (currentModuleId !== moduleId) {
      startModule(moduleId);

      // Only start first page if we strictly don't have one and are just initializing the module
      if (module.pages.length > 0) {
        startPage(moduleId, module.pages[0].id);
      }
    } else if (!currentPageId && module.pages.length > 0) {
      // Case where module is loaded but no page selected (e.g. manual URL navigation to module root)
      startPage(moduleId, module.pages[0].id);
    }
  }, [moduleId, module?.id]); // Depend only on primitive IDs, NOT full objects

  /**
   * Progress Auto-save Effect
   * Tự động lưu tiến độ thời gian học mỗi 30 giây.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentModuleId && currentPageId) {
        updateTimeSpent(currentModuleId, currentPageId, 0.5);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentModuleId, currentPageId, updateTimeSpent]);

  /**
   * Keyboard Navigation Effect
   * Hỗ trợ phím mũi tên trái/phải để chuyển trang.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && derivedPageIndex > 0) {
        handlePreviousPage();
      } else if (e.key === 'ArrowRight' && module && derivedPageIndex < module.pages.length - 1) {
        handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [derivedPageIndex, module]);

  // Handler Functions - Navigation Logic
  // ---------------------------------------------------------------------------

  const handlePreviousPage = useCallback(() => {
    if (!module || derivedPageIndex <= 0) return;

    const previousPage = module.pages[derivedPageIndex - 1];
    setNavigation(prev => ({
      ...prev,
      direction: 'prev',
      isNavigating: true
    }));

    // Delay chuyển page thực tế để animation kịp chạy
    setTimeout(() => {
      startPage(moduleId, previousPage.id);
      setNavigation(prev => ({
        ...prev,
        isNavigating: false
      }));
    }, 300);
  }, [module, moduleId, derivedPageIndex, startPage]);

  const handleNextPage = useCallback(() => {
    if (!module || derivedPageIndex >= module.pages.length - 1) return;

    const nextPage = module.pages[derivedPageIndex + 1];
    setNavigation(prev => ({
      ...prev,
      direction: 'next',
      isNavigating: true
    }));

    setTimeout(() => {
      startPage(moduleId, nextPage.id);
      setNavigation(prev => ({
        ...prev,
        isNavigating: false
      }));
    }, 300);
  }, [module, moduleId, derivedPageIndex, startPage]);

  const handlePageSelect = useCallback((index: number) => {
    if (!module || index === derivedPageIndex) return;

    // Xác định hướng animation dựa trên vị trí tương đối
    const direction = index > derivedPageIndex ? 'next' : 'prev';
    const targetPage = module.pages[index];

    setNavigation(prev => ({
      ...prev,
      direction,
      isNavigating: true
    }));

    setTimeout(() => {
      startPage(moduleId, targetPage.id);
      setNavigation(prev => ({
        ...prev,
        isNavigating: false
      }));
    }, 300);
  }, [module, moduleId, derivedPageIndex, startPage]);

  const handlePageComplete = useCallback((score?: number) => {
    if (currentModuleId && currentPageId) {
      completePage(currentModuleId, currentPageId, score);
    }
  }, [currentModuleId, currentPageId, completePage]);

  const handleModuleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    } else {
      // Logic mặc định: quay về Hub
      setScene(GameScene.STUDY_MATERIALS);
    }
  }, [onComplete, setScene]);

  const handleExit = useCallback(() => {
    if (onExit) {
      onExit();
    } else {
      setScene(GameScene.STUDY_MATERIALS);
    }
  }, [onExit, setScene]);

  // Error & Loading States Rendering
  // ---------------------------------------------------------------------------

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fi fi-rr-exclamation text-4xl text-red-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-white mb-2">Module không tồn tại</h2>
          <p className="text-gray-400 mb-4">Không thể tìm thấy module với ID: {moduleId}</p>
          <button onClick={handleExit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (module.pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fi fi-rr-folder-open text-4xl text-yellow-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-white mb-2">Module trống</h2>
          <p className="text-gray-400 mb-4">Module này chưa có nội dung</p>
          <button onClick={handleExit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate props for rendering
  const currentPage = module.pages[derivedPageIndex];
  const canGoPrevious = derivedPageIndex > 0;
  const canGoNext = derivedPageIndex < module.pages.length - 1;
  const isLastPage = derivedPageIndex === module.pages.length - 1;

  /**
   * Page Content Renderer
   * Factory function để render đúng component dựa trên page type.
   */
  const renderPageContent = () => {
    if (!currentPage) return null;

    const baseProps = {
      moduleId,
      pageId: currentPage.id,
      title: currentPage.title
    };

    switch (currentPage.type) {
      case PageType.THEORY:
        return <TheoryPage {...baseProps} onComplete={() => handlePageComplete()} />;
      case PageType.DEMO:
        return <DemoPage {...baseProps} onComplete={() => handlePageComplete()} />;
      case PageType.QUIZ:
        return <QuizPage {...baseProps} onComplete={(score: number) => handlePageComplete(score)} />;
      case PageType.PRACTICE:
        return <PracticePage {...baseProps} onComplete={(_code: string, passed: boolean) => handlePageComplete(passed ? 100 : 0)} />;
      case PageType.SUMMARY:
        return <SummaryPage {...baseProps} onModuleComplete={handleModuleComplete} />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <i className="fi fi-rr-question text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-400">Loại page không được hỗ trợ</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Decorative background overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Layout */}
      <main className="relative max-w-[1600px] mx-auto px-4 py-8 overflow-hidden">
        {/* Top Tabs Navigation */}
        <BookPageTabs
          pages={module.pages}
          currentIndex={derivedPageIndex}
          onPageSelect={handlePageSelect}
        />

        {/* Book Metaphor Interface */}
        <div className="relative overflow-hidden">
          {/* Navigation Arrows Layer */}
          <BookNavigationArrows
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            isLastPage={isLastPage}
            onComplete={handleModuleComplete}
          />

          {/* Book Content Container */}
          <div className="mx-6 min-w-0 overflow-hidden">
            <BookContainer pageType={currentPage.type}>
              <div className="min-h-[600px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <BookPageTransition
                    key={currentPage.id}
                    direction={navigation.direction}
                    pageKey={currentPage.id}
                  >
                    {renderPageContent()}
                  </BookPageTransition>
                </AnimatePresence>
              </div>
            </BookContainer>
          </div>
        </div>

        {/* Usage Helper Text */}
        <div className="mt-6 flex items-center justify-center gap-4 text-gray-500 text-sm">
          <span>
            <i className="fi fi-rr-keyboard mr-2"></i>
            Dùng phím ← → để chuyển trang
          </span>
          <span className="text-gray-700">•</span>
          <span>
            Trang {derivedPageIndex + 1} / {module.pages.length}
          </span>
        </div>
      </main>
    </div>
  );
};

export default LearningInterface;