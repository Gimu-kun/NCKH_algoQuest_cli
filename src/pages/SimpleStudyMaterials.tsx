/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * STUDY MATERIALS - SIMPLIFIED PAGE-BASED SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Phiên bản đơn giản hoá của study materials với page-based learning.
 * Tập trung vào core functionality trước, sau đó mở rộng.
 * 
 * @module SimpleStudyMaterials
 * @category Pages/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../store/gameStore';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface StudyPage {
  id: string;
  title: string;
  type: 'theory' | 'demo' | 'quiz' | 'practice' | 'summary';
  content: React.ReactNode;
  estimatedTime: number;
}

interface StudyModule {
  id: string;
  title: string;
  description: string;
  pages: StudyPage[];
  totalEstimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const STUDY_MODULES: StudyModule[] = [
  {
    id: 'big-o-basics',
    title: 'Big O Notation Cơ Bản',
    description: 'Hiểu khái niệm độ phức tạp thuật toán và cách phân loại',
    totalEstimatedTime: 25,
    difficulty: 'easy',
    icon: 'fi fi-rr-clock',
    color: 'from-blue-500 to-purple-600',
    pages: [
      {
        id: 'page-1',
        title: 'Giới Thiệu Big O',
        type: 'theory',
        estimatedTime: 8,
        content: (
          <div className="prose prose-invert max-w-none">
            <h2>Big O Notation là gì?</h2>
            <p>
              Big O notation là một cách để mô tả <strong>độ phức tạp thuật toán</strong> - 
              tốc độ tăng trưởng của thời gian chạy hoặc không gian bộ nhớ khi kích thước input tăng lên.
            </p>
            
            <h3>Tại sao cần Big O?</h3>
            <ul>
              <li>Hiểu hiệu suất của thuật toán</li>
              <li>So sánh các giải pháp khác nhau</li>
              <li>Dự đoán performance scaling</li>
            </ul>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 my-6">
              <h4 className="text-blue-300 flex items-center gap-2">
                <i className="fi fi-rr-lightbulb"></i>
                Key Concept
              </h4>
              <p className="text-blue-200">
                Big O focus vào worst-case scenario và growth rate khi input size → ∞
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'page-2',
        title: 'Minh Họa Trực Quan',
        type: 'demo',
        estimatedTime: 5,
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Visual Demo: O(n) vs O(n²)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-green-400 font-semibold mb-3">O(n) - Linear</h4>
                <div className="space-y-2">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-gray-300">Operation {i}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-red-400 font-semibold mb-3">O(n²) - Quadratic</h4>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({length: 16}, (_, i) => (
                    <div key={i} className="w-4 h-4 bg-red-500 rounded"></div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">n×n operations</p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200">
                <strong>Takeaway:</strong> O(n) scales linearly, O(n²) scales exponentially. 
                Với n=1000, O(n) = 1000 ops, O(n²) = 1,000,000 ops!
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'page-3',
        title: 'Kiểm Tra Hiểu Biết',
        type: 'quiz',
        estimatedTime: 5,
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Quick Quiz</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-white mb-3">1. Thuật toán nào có độ phức tạp O(1)?</p>
                <div className="space-y-2">
                  {['Access array by index', 'Linear search', 'Bubble sort', 'Binary search'].map((option, i) => (
                    <button key={i} className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 transition-colors">
                      {String.fromCharCode(65 + i)}. {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'page-4',
        title: 'Thực Hành Code',
        type: 'practice',
        estimatedTime: 7,
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Coding Exercise</h3>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Bài tập:</h4>
              <p className="text-gray-300 mb-4">
                Viết function để phân tích độ phức tạp của đoạn code đơn giản:
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <pre className="text-green-400">{`function example(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
}`}</pre>
              </div>
              
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <strong>Hint:</strong> Đếm số vòng lặp và các thao tác bên trong.
                </p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'page-5',
        title: 'Tổng Kết',
        type: 'summary',
        estimatedTime: 3,
        content: (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white">Chúc mừng!</h3>
            <p className="text-gray-300 text-lg">
              Bạn đã hoàn thành module Big O Notation cơ bản.
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="text-white font-semibold mb-3">Bạn đã học được:</h4>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>✅ Khái niệm Big O notation</li>
                <li>✅ Các loại độ phức tạp cơ bản</li>
                <li>✅ Cách phân tích thuật toán</li>
                <li>✅ Ví dụ thực tế</li>
              </ul>
            </div>
            
            <div className="text-sm text-gray-400">
              Thời gian học: ~25 phút
            </div>
          </div>
        )
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module Card Component
 */
const ModuleCard: React.FC<{
  module: StudyModule;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ module, isSelected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300
        ${isSelected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-gray-700/50 hover:border-gray-600/50'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-lg flex items-center justify-center`}>
          <i className={`${module.icon} text-white text-xl`}></i>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{module.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1">
            <i className="fi fi-rr-clock"></i>
            {module.totalEstimatedTime} phút
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            module.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
            module.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {module.difficulty === 'easy' ? 'Dễ' : 
             module.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
          </span>
        </div>
        
        <div className="text-blue-400">
          <i className="fi fi-rr-arrow-right"></i>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Progress Bar Component
 */
const ProgressBar: React.FC<{
  current: number;
  total: number;
  label?: string;
}> = ({ current, total, label }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{label}</span>
          <span>{current} / {total}</span>
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

/**
 * Navigation Controls
 */
const NavigationControls: React.FC<{
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentPage: number;
  totalPages: number;
}> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  currentPage,
  totalPages
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${canGoPrevious 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <i className="fi fi-rr-arrow-left"></i>
        Trước
      </button>

      <div className="flex-1 mx-4">
        <ProgressBar 
          current={currentPage + 1} 
          total={totalPages}
          label={`Trang ${currentPage + 1} / ${totalPages}`}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${canGoNext 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        Tiếp
        <i className="fi fi-rr-arrow-right"></i>
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const SimpleStudyMaterials: React.FC = () => {
  const { setScene } = useGameStore();
  const [currentView, setCurrentView] = useState<'hub' | 'module'>('hub');
  const [selectedModule, setSelectedModule] = useState<StudyModule | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleModuleSelect = (module: StudyModule) => {
    setSelectedModule(module);
    setCurrentPageIndex(0);
    setCurrentView('module');
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setSelectedModule(null);
    setCurrentPageIndex(0);
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (selectedModule && currentPageIndex < selectedModule.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={currentView === 'module' ? handleBackToHub : () => setScene(GameScene.HUB_WORLD)}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <i className="fi fi-rr-arrow-left text-gray-300"></i>
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {currentView === 'hub' ? 'Trung Tâm Học Tập' : selectedModule?.title}
                </h1>
                <p className="text-gray-400 text-sm">
                  {currentView === 'hub' 
                    ? 'Chinh phục thuật toán từng bước' 
                    : 'Page-based learning system'
                  }
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            {currentView === 'module' && selectedModule && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Trang</div>
                  <div className="text-white font-semibold">
                    {currentPageIndex + 1} / {selectedModule.pages.length}
                  </div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-700"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${((currentPageIndex + 1) / selectedModule.pages.length) * 100}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'hub' ? (
            <motion.div
              key="hub"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-[calc(100vh-80px)]"
            >
              {/* Learning Hub */}
              <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Introduction */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Lộ Trình Học Thuật Toán
                    </h2>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                      Hành trình 5 chương từ cơ bản đến nâng cao. Mỗi chương được chia thành 
                      các module nhỏ với cơ chế học page-by-page giúp bạn theo dõi tiến độ 
                      và ôn luyện hiệu quả.
                    </p>
                  </motion.div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {STUDY_MODULES.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <ModuleCard
                        module={module}
                        isSelected={false}
                        onSelect={() => handleModuleSelect(module)}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Coming Soon */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 text-center"
                >
                  <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30">
                    <h3 className="text-2xl font-semibold text-white mb-4">Sắp ra mắt</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-400">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📚</div>
                        <div className="text-sm">Chương 2-5</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-sm">Quiz nâng cao</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">💻</div>
                        <div className="text-sm">Code challenges</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-sm">Progress tracking</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="module"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-[calc(100vh-80px)]"
            >
              {/* Learning Interface */}
              {selectedModule && (
                <div className="max-w-7xl mx-auto px-6 py-8">
                  {/* Module Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${selectedModule.color} rounded-xl flex items-center justify-center`}>
                        <i className={`${selectedModule.icon} text-white text-2xl`}></i>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedModule.title}</h2>
                        <p className="text-gray-400">{selectedModule.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <i className="fi fi-rr-clock"></i>
                        {selectedModule.totalEstimatedTime} phút
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedModule.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        selectedModule.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedModule.difficulty === 'easy' ? 'Dễ' : 
                         selectedModule.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                      </span>
                    </div>
                  </div>

                  {/* Page Content */}
                  <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden mb-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPageIndex}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="p-8 min-h-[500px]"
                      >
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              selectedModule.pages[currentPageIndex].type === 'theory' ? 'bg-blue-500 text-white' :
                              selectedModule.pages[currentPageIndex].type === 'demo' ? 'bg-green-500 text-white' :
                              selectedModule.pages[currentPageIndex].type === 'quiz' ? 'bg-yellow-500 text-white' :
                              selectedModule.pages[currentPageIndex].type === 'practice' ? 'bg-purple-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              {currentPageIndex + 1}
                            </div>
                            <h3 className="text-xl font-semibold text-white">
                              {selectedModule.pages[currentPageIndex].title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="capitalize">
                              {selectedModule.pages[currentPageIndex].type}
                            </span>
                            <span>•</span>
                            <span>{selectedModule.pages[currentPageIndex].estimatedTime} phút</span>
                          </div>
                        </div>

                        {/* Page Content */}
                        <div className="prose prose-invert max-w-none">
                          {selectedModule.pages[currentPageIndex].content}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Controls */}
                  <NavigationControls
                    onPrevious={handlePreviousPage}
                    onNext={handleNextPage}
                    canGoPrevious={currentPageIndex > 0}
                    canGoNext={currentPageIndex < selectedModule.pages.length - 1}
                    currentPage={currentPageIndex}
                    totalPages={selectedModule.pages.length}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SimpleStudyMaterials;