/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * STUDY MATERIALS PAGE - NEW PAGE-BASED SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Component chuyển đổi giữa Learning Hub và Learning Interface.
 * - Route management cho page-based learning
 * - State management cho current module/page
 * - Navigation giữa các views
 * - Progress tracking integration
 * 
 * KIẾN TRÚC:
 * - Multi-view system (Hub ↔ Interface)
 * - URL-based routing
 * - State persistence
 * - Error boundary handling
 * 
 * FLOW:
 * 1. Learning Hub: Chọn module để học
 * 2. Learning Interface: Page-by-page learning
 * 3. Back to Hub: Khi hoàn thành module
 * 
 * @component StudyMaterialsPage
 * @category Pages/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';
import { useLearningProgressStore } from '../store/learningProgressStore';
import LearningHub from '../components/study/LearningHub';
import LearningInterface from '../components/study/LearningInterface';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface StudyMaterialsState {
  currentView: 'hub' | 'interface';
  currentModuleId: string | null;
  isLoading: boolean;
  error: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const StudyMaterialsPage: React.FC = () => {
  const { setScene } = useGameStore();
  const { currentModuleId, currentPageId } = useLearningProgressStore();

  const [state, setState] = useState<StudyMaterialsState>({
    currentView: 'hub',
    currentModuleId: null,
    isLoading: false,
    error: null
  });

  // Sync với store state
  useEffect(() => {
    if (currentModuleId && currentPageId) {
      setState(prev => ({
        ...prev,
        currentView: 'interface',
        currentModuleId: currentModuleId
      }));
    } else if (currentModuleId) {
      setState(prev => ({
        ...prev,
        currentView: 'interface',
        currentModuleId: currentModuleId
      }));
    }
  }, [currentModuleId, currentPageId]);

  // Handlers - Module selection is handled within LearningHub component

  const handleModuleComplete = () => {
    setState(prev => ({
      ...prev,
      currentView: 'hub',
      currentModuleId: null
    }));
  };

  const handleExit = () => {
    setScene(GameScene.HUB_WORLD);
  };

  const handleBackToHub = () => {
    setState(prev => ({
      ...prev,
      currentView: 'hub',
      currentModuleId: null,
      error: null
    }));
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-white mb-2">Đang tải module...</h2>
          <p className="text-gray-400">Chuẩn bị bài học cho bạn</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fi fi-rr-exclamation text-2xl text-red-400"></i>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Lỗi tải module</h2>
          <p className="text-gray-400 mb-6">{state.error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBackToHub}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Quay lại Hub
            </button>
            <button
              onClick={handleExit}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Thoát
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header - Always visible */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={state.currentView === 'interface' ? handleBackToHub : handleExit}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <i className="fi fi-rr-arrow-left text-gray-300"></i>
              </button>

              <div>
                <h1 className="text-xl font-semibold text-white">
                  {state.currentView === 'hub' ? 'Trung Tâm Học Tập' : 'Đang học'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {state.currentView === 'hub'
                    ? 'Chinh phục thuật toán từng bước'
                    : 'Page-based learning system'
                  }
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${state.currentView === 'hub' ? 'bg-blue-400' : 'bg-gray-600'
                  }`}></div>
                <span className={`text-sm ${state.currentView === 'hub' ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                  Hub
                </span>
              </div>

              <div className="w-8 h-0.5 bg-gray-600"></div>

              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${state.currentView === 'interface' ? 'bg-green-400' : 'bg-gray-600'
                  }`}></div>
                <span className={`text-sm ${state.currentView === 'interface' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                  Learning
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {state.currentView === 'hub' ? (
            <motion.div
              key="hub"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <LearningHub />
            </motion.div>
          ) : (
            <motion.div
              key="interface"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-[calc(100vh-80px)]"
            >
              {state.currentModuleId && (
                <LearningInterface
                  moduleId={state.currentModuleId}
                  onComplete={handleModuleComplete}
                  onExit={handleExit}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StudyMaterialsPage;