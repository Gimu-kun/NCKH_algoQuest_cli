/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * LEARNING HUB - MODULE SELECTION & PROGRESS OVERVIEW
 * (TRUNG TÂM HỌC TẬP - LỰA CHỌN MODULE & TỔNG QUAN TIẾN ĐỘ)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - Component đóng vai trò là "Dashboard" (Bảng điều khiển) chính cho khu vực học tập.
 * - Cung cấp cái nhìn toàn cảnh về lộ trình học (Learning Path) qua 5 chương.
 * - Cho phép người dùng theo dõi tiến độ cá nhân và chọn bài học tiếp theo.
 * 
 * 🏗️ KIẾN TRÚC & FLOW:
 * 1. **Data Aggregation**: Thu thập dữ liệu từ store (`useLearningProgressStore`) và static data (`learningModules`).
 * 2. **Structure Hierarchy**:
 *    - `LearningHub` (Main Container)
 *      └── `ChapterSection` (List rendered per chapter)
 *          └── `ModuleCard` (Individual item)
 * 3. **Navigation Flow**: User chọn Module -> Trigger `startModule` -> Chuyển view sang `LearningInterface`.
 * 
 * 🛠️ KỸ THUẬT & THUẬT TOÁN:
 * - **Calculated State**: Tính toán tiến độ chương (`completed/total`) on-the-fly dựa trên tiến độ từng module.
 * - **Conditional Rendering**: Hiển thị trạng thái Locked/Unlocked/Completed cho từng card.
 * - **Animations**: Sử dụng `framer-motion` cho các hiệu ứng hover, stagger children, và progress bar.
 * 
 * ✅ ƯU ĐIỂM:
 * - **Modular Design**: Tách nhỏ UI thành `ModuleCard` và `ChapterSection` giúp code dễ đọc và sửa.
 * - **Reactive Updates**: Bất kỳ thay đổi nào trong `learningProgressStore` sẽ lập tức phản ánh lên UI (ví dụ: vừa học xong 1 bài).
 * 
 * ❌ NHƯỢC ĐIỂM:
 * - **Performance**: Việc tính toán `calculateChapterProgress` trong render body có thể tốn kém nếu số lượng module rất lớn (tuy nhiên với < 100 modules thì không đáng kể).
 *   -> *Giải pháp tiềm năng*: Dùng `useMemo` nếu danh sách module mở rộng.
 * 
 * @component LearningHub
 * @category Components/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useLearningProgressStore,
  PageStatus
} from '../../store/learningProgressStore';
import {
  getModulesByChapter,
  getModuleById
} from '../../data/learningModules';
import { ChapterNumber } from '../../data/study_materials/types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface cho dữ liệu tiến độ của một chương.
 * Được tính toán tổng hợp từ các modules bên trong.
 */
interface ChapterProgress {
  completed: number;   // Số module đã hoàn thành (100%)
  total: number;       // Tổng số module trong chương
  percentage: number;  // % hoàn thành của cả chương
  totalTime: number;   // Tổng thời gian ước tính (phút)
}

interface ModuleCardProps {
  module: ReturnType<typeof getModuleById>;
  progress: number;    // Tiến độ cụ thể của module (0-100)
  status: PageStatus;  // Trạng thái: LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
  onSelect: () => void;
}

interface ChapterSectionProps {
  chapter: ChapterNumber;
  title: string;
  description: string;
  modules: ReturnType<typeof getModulesByChapter>;
  progress: ChapterProgress;
  isUnlocked: boolean; // Trạng thái mở khóa của chương
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (CÁC HÀM HỖ TRỢ)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * getChapterInfo: Mapping function (Ánh xạ dữ liệu).
 * 
 * 🔹 Mục đích:
 * - Chuyển đổi `ChapterNumber` (enum/id) thành thông tin hiển thị (UI Data).
 * - Centralize (tập trung) config màu sắc và icon cho từng chương.
 * 
 * 🔹 Kỹ thuật:
 * - Sử dụng Object Lookup (Map) thay vì Switch-Case để code gọn hơn và dễ mở rộng.
 * 
 * @param chapter - Mã chương
 * @returns Object chứa title, description, icon, color theme.
 */
function getChapterInfo(chapter: ChapterNumber) {
  const chapterInfos = {
    [ChapterNumber.COMPLEXITY]: {
      title: 'Chương 1: Algorithm Complexity',
      description: 'Nền tảng về Big O, Time và Space Complexity',
      icon: 'fi fi-rr-clock',
      color: 'from-blue-500 to-purple-600'
    },
    [ChapterNumber.SORTING_SEARCHING]: {
      title: 'Chương 2: Sorting & Searching',
      description: 'Các thuật toán sắp xếp và tìm kiếm cơ bản',
      icon: 'fi fi-rr-sort',
      color: 'from-green-500 to-teal-600'
    },
    [ChapterNumber.LINKED_LIST]: {
      title: 'Chương 3: Linked Lists',
      description: 'Cấu trúc dữ liệu động với con trỏ',
      icon: 'fi fi-rr-link',
      color: 'from-orange-500 to-red-600'
    },
    [ChapterNumber.STACK_QUEUE]: {
      title: 'Chương 4: Stack & Queue',
      description: 'LIFO và FIFO data structures',
      icon: 'fi fi-rr-layer-group',
      color: 'from-indigo-500 to-blue-600'
    },
    [ChapterNumber.BST]: {
      title: 'Chương 5: Binary Search Tree',
      description: 'Cây nhị phân tìm kiếm và ứng dụng',
      icon: 'fi fi-rr-graph-tree',
      color: 'from-pink-500 to-purple-600'
    }
  };

  return chapterInfos[chapter];
}

/**
 * getDifficultyInfo: Helper formatting.
 * 
 * 🔹 Mục đích:
 * - Chuẩn hóa hiển thị độ khó (text & style) dựa trên giá trị raw string.
 * - Fallback về 'medium' nếu dữ liệu không hợp lệ (Defensive Programming).
 */
function getDifficultyInfo(difficulty: string) {
  const difficultyMap = {
    easy: { text: 'Dễ', color: 'text-green-400 bg-green-400/10', icon: '⭐' },
    medium: { text: 'Trung Bình', color: 'text-yellow-400 bg-yellow-400/10', icon: '⭐⭐' },
    hard: { text: 'Khó', color: 'text-red-400 bg-red-400/10', icon: '⭐⭐⭐' }
  };

  return difficultyMap[difficulty as keyof typeof difficultyMap] || difficultyMap.medium;
}

/**
 * formatTime: Utility function.
 * 
 * 🔹 Thuật toán:
 * - Chia và lấy dư (Modulo Arithmetic) để chuyển đổi phút -> giờ:phút.
 * - Xử lý các edge case (nhỏ hơn 60p, chẵn giờ).
 */
function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} giờ`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS (CÁC COMPONENT CON)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ModuleCard Component
 * 
 * 🔹 Chức năng:
 * - Hiển thị một thẻ bài học (module) đơn lẻ.
 * - Trực quan hóa trạng thái: Khóa (Locked), Đang học (In Progress), Hoàn thành (Completed).
 * - Xử lý tương tác click để vào học.
 * 
 * 🔹 UI Pattern:
 * - "Card" layout với shadow và border.
 * - Visual Feedback: Grayscale khi Locked, Ring/Glow khi Active.
 */
const ModuleCard: React.FC<ModuleCardProps> = ({ module, progress, status, onSelect }) => {
  if (!module) return null;
  const difficultyInfo = getDifficultyInfo(module.difficulty);

  // Định nghĩa các biến thể animation cho từng trạng thái
  const cardVariants = {
    locked: {
      opacity: 0.6,
      scale: 0.98,
      filter: 'grayscale(0.8)'
    },
    available: {
      opacity: 1,
      scale: 1,
      filter: 'grayscale(0)'
    },
    in_progress: {
      opacity: 1,
      scale: 1.02,
      filter: 'grayscale(0)' // Đã mở nên có màu
    },
    completed: {
      opacity: 1,
      scale: 1,
      filter: 'grayscale(0)'
    }
  };

  const isLocked = status === PageStatus.LOCKED;
  const isInProgress = status === PageStatus.IN_PROGRESS;
  const isCompleted = status === PageStatus.COMPLETED;

  return (
    <motion.div
      variants={cardVariants}
      initial="locked"
      animate={status} // Animate dựa trên prop status
      whileHover={!isLocked ? { scale: 1.05, y: -4 } : {}}
      className={`
        relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 
        border border-gray-700/50 transition-all duration-300
        ${!isLocked ? 'cursor-pointer hover:border-blue-500/50' : 'cursor-not-allowed'}
        ${isInProgress ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''}
        ${isCompleted ? 'ring-2 ring-green-500/50 shadow-lg shadow-green-500/20' : ''}
      `}
      onClick={!isLocked ? onSelect : undefined}
    >
      {/* Progress Indicator (Circular chart hoặc Lock Icon) */}
      <div className="absolute top-4 right-4">
        {isCompleted ? (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <i className="fi fi-rr-check text-white text-sm"></i>
          </div>
        ) : isInProgress ? (
          <div className="relative w-8 h-8">
            {/* SVG Circle Progress Chart */}
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
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
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">{Math.round(progress)}%</span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <i className="fi fi-rr-lock text-gray-400 text-sm"></i>
          </div>
        )}
      </div>

      {/* Module Icon Container */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <i className="fi fi-rr-book text-white text-lg"></i>
        </div>
      </div>

      {/* Module Info Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{module.description}</p>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center justify-between text-sm">
          <div className={`px-2 py-1 rounded-full ${difficultyInfo.color}`}>
            <span className="font-medium">{difficultyInfo.text}</span>
          </div>
          <div className="text-gray-400">
            <i className="fi fi-rr-clock mr-1"></i>
            {formatTime(module.totalEstimatedTime)}
          </div>
        </div>

        {/* Linear Progress Bar for In-Progress Modules (Visual reinforcement) */}
        {isInProgress && progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Tiến độ</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Call to Action Button */}
        {!isLocked && (
          <motion.button
            className={`w-full mt-4 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isCompleted
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : isInProgress
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
              } text-white shadow-lg hover:shadow-xl`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className={`fi ${isCompleted ? 'fi-rr-eye' : isInProgress ? 'fi-rr-play' : 'fi-rr-rocket'
              }`}></i>
            {isInProgress ? 'Tiếp Tục Học' : isCompleted ? 'Xem Lại' : 'Bắt Đầu Ngay'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Chapter Section Component
 * 
 * 🔹 Chức năng:
 * - Render một nhóm module thuộc cùng một chương.
 * - Hiển thị Header chương và tổng quan tiến độ của chương đó.
 * 
 * 🔹 Kỹ thuật:
 * - **List Rendering**: Map qua danh sách modules để render `ModuleCard`.
 * - **Condition Rendering**: Kiểm tra `isUnlocked` để hiển thị visual cue (ổ khóa).
 */
const ChapterSection: React.FC<ChapterSectionProps> = ({
  chapter,
  title,
  description,
  modules,
  progress,
  isUnlocked
}) => {
  const chapterInfo = getChapterInfo(chapter);
  const { startModule, getModuleProgress } = useLearningProgressStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      {/* Chapter Header Block */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className={`w-16 h-16 bg-gradient-to-br ${chapterInfo.color} rounded-xl flex items-center justify-center shadow-lg shadow-${chapterInfo.color.split('-')[1]}-500/20`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className={`${chapterInfo.icon} text-white text-2xl`}></i>
          </motion.div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              {title}
              {progress.percentage === 100 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400 text-lg"
                >
                  ✓
                </motion.span>
              )}
            </h2>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          {!isUnlocked && (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/70 rounded-lg border border-gray-600/50 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
            >
              <i className="fi fi-rr-lock text-gray-400"></i>
              <span className="text-gray-400 text-sm font-medium">Chưa Mở Khóa</span>
            </motion.div>
          )}
        </div>

        {/* Chapter Summary Progress Bar */}
        {isUnlocked && progress.total > 0 && (
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Tiến độ chương</span>
              <span className="text-white font-semibold">{progress.completed}/{progress.total} modules</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${chapterInfo.color}`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
              <span>{Math.round(progress.percentage)}% hoàn thành</span>
              <span>Thời gian: {formatTime(progress.totalTime)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modules Grid - Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {modules.map((module) => {
            if (!module) return null;
            const moduleProgress = getModuleProgress(module.id);

            return (
              <ModuleCard
                key={module.id}
                module={module}
                progress={moduleProgress}
                status={isUnlocked ? PageStatus.AVAILABLE : PageStatus.LOCKED}
                // Handler Logic: Chỉ cho phép click nếu đã unlock
                onSelect={() => {
                  if (isUnlocked) {
                    console.log('Starting module:', module.id);
                    startModule(module.id);
                  }
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (COMPONENT CHÍNH)
// ═══════════════════════════════════════════════════════════════════════════

export const LearningHub: React.FC = () => {
  // Kết nối với Zustand store để lấy data global
  const {
    unlockedChapters,
    getModuleProgress
  } = useLearningProgressStore();

  /**
   * calculateChapterProgress: Hàm tính toán tổng hợp.
   * 
   * 🔹 Logic:
   * - Lấy tất cả modules của chương.
   * - Đếm số module có progress == 100.
   * - Cộng dồn thời gian ước tính.
   * 
   * 🔹 Performance Note:
   * - Chạy mỗi lần render. Nếu lag, cần dùng `useMemo`.
   */
  const calculateChapterProgress = (chapter: ChapterNumber): ChapterProgress => {
    const modules = getModulesByChapter(chapter);
    const completed = modules.filter((m) => {
      const progress = getModuleProgress(m.id);
      return progress === 100;
    }).length;

    const totalTime = modules.reduce((sum: number, m) => sum + m.totalEstimatedTime, 0);

    return {
      completed,
      total: modules.length,
      percentage: modules.length > 0 ? (completed / modules.length) * 100 : 0,
      totalTime
    };
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Main Content Container */}
      <main className="w-full max-w-[1600px] mx-auto px-6 py-8 pb-32">
        {/* Intro Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Lộ Trình Học Thuật Toán
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Hành trình 5 chương từ cơ bản đến nâng cao. Mỗi chương được chia thành
            các module nhỏ với cơ chế học page-by-page giúp bạn theo dõi tiến độ
            và ôn luyện hiệu quả.
          </p>
        </div>

        {/* Learning Path - Render từng section theo thứ tự chương */}
        <div className="space-y-12">
          {[ChapterNumber.COMPLEXITY, ChapterNumber.SORTING_SEARCHING, ChapterNumber.LINKED_LIST, ChapterNumber.STACK_QUEUE, ChapterNumber.BST].map((chapter: ChapterNumber) => {
            const chapterInfo = getChapterInfo(chapter);
            const modules = getModulesByChapter(chapter);
            const progress = calculateChapterProgress(chapter);
            const isUnlocked = unlockedChapters.includes(chapter); // Check unlock status

            if (!chapterInfo) return null;

            return (
              <ChapterSection
                key={chapter}
                chapter={chapter}
                title={chapterInfo.title}
                description={chapterInfo.description}
                modules={modules}
                progress={progress}
                isUnlocked={isUnlocked}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LearningHub;