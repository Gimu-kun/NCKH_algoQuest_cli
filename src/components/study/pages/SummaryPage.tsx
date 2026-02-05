/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SUMMARY PAGE - TRANG TỔNG KẾT & VINH DANH
 * (MODULE COMPLETION & RESULTS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - Là điểm đến cuối cùng của một Learning Module (Happy Path).
 * - Tổng kết lại toàn bộ quá trình học tập: Thời gian, Điểm số, Streak.
 * - Khen thưởng người dùng (Gamification) để tạo động lực (Dopamine hit).
 * - Mở khóa nội dung tiếp theo (Progression System).
 * 
 * 🏗️ CƠ CHẾ HOẠT ĐỘNG:
 * 1. **Achievement Calculation**:
 *    - Tự động tính toán các huy hiệu dựa trên hiệu suất (Tốc độ, Chính xác, Chuỗi ngày).
 * 2. **Progression Logic**:
 *    - Gọi `completeModule` để lưu trạng thái vào Store.
 *    - Kiểm tra điều kiện unlock chapter kế tiếp (nếu là bài cuối cùng).
 * 3. **Celebration UI**:
 *    - Sử dụng hiệu ứng pháo hoa/vinh danh (motion) để tạo cảm giác chiến thắng.
 * 
 * @component SummaryPage
 * @category Components/StudyMaterials/Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLearningProgressStore } from '../../../store/learningProgressStore';
import { getModuleById, getNextModule } from '../../../data/learningModules';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

interface SummaryPageProps {
  moduleId: string;
  title: string;
  onComplete?: () => void;      // Callback quay về Hub
  onModuleComplete?: () => void; // Callback đi tiếp module sau
}

interface Achievement {
  icon: string;
  title: string;
  description: string;
  type: 'completion' | 'speed' | 'accuracy' | 'streak';
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (COMPONENT CHÍNH)
// ═══════════════════════════════════════════════════════════════════════════

export const SummaryPage: React.FC<SummaryPageProps> = ({
  moduleId,
  title,
  onComplete,
  onModuleComplete
}) => {
  // Global State Access
  const {
    moduleProgress,
    currentStreak,
    completeModule,
    unlockChapter
  } = useLearningProgressStore();

  const [showCelebration, setShowCelebration] = useState(true);

  // Retrieve Module Data & Progress Stats
  const currentModule = getModuleById(moduleId);
  const progress = moduleProgress[moduleId];
  const moduleTime = progress?.totalTimeSpent || 0;
  const averageScore = progress?.averageScore || 0;

  /**
   * ACHIEVEMENT SYSTEM
   * Tính toán các thành tựu đạt được trong session này.
   */
  const achievements = useMemo(() => {
    const newAchievements: Achievement[] = [];

    // 1. Completion Achievement (Luôn có)
    newAchievements.push({
      icon: '🏆',
      title: 'Hoàn thành module',
      description: `Bạn đã hoàn thành module ${currentModule?.title}`,
      type: 'completion'
    });

    // 2. Speed Achievement (Nếu nhanh hơn 20% dự kiến)
    if (currentModule && moduleTime < currentModule.totalEstimatedTime * 0.8) {
      newAchievements.push({
        icon: '⚡',
        title: 'Tốc độ ánh sáng',
        description: 'Hoàn thành nhanh hơn dự kiến 20%',
        type: 'speed'
      });
    }

    // 3. Accuracy Achievement (Nếu điểm TB >= 80)
    if (averageScore >= 80) {
      newAchievements.push({
        icon: '🎯',
        title: 'Chính xác cao',
        description: `Đạt ${Math.round(averageScore)}% điểm trung bình`,
        type: 'accuracy'
      });
    }

    // 4. Streak Achievement (Nếu duy trì chuỗi >= 3 ngày)
    if (currentStreak >= 3) {
      newAchievements.push({
        icon: '🔥',
        title: 'Chuỗi học tập',
        description: `${currentStreak} ngày học liên tiếp`,
        type: 'streak'
      });
    }

    return newAchievements;
  }, [currentModule, moduleTime, averageScore, currentStreak]);

  // Tìm module tiếp theo để suggest navigation
  const nextModule = useMemo(() => getNextModule(moduleId), [moduleId]);

  /**
   * COMPLETION SIDE EFFECTS
   * Lưu trạng thái hoàn thành và mở khóa nội dung mới.
   */
  useEffect(() => {
    // 1. Mark module as completed in Store
    completeModule(moduleId);

    // 2. Check unlock condition for next chapter
    if (currentModule) {
      const currentChapter = currentModule.chapter;
      // Logic đơn giản hóa: Giả sử đây là bài cuối thì unlock chương sau.
      // Thực tế nên check xem tất cả modules chương hiện tại đã xong chưa.
      const isLastModule = true; // Placeholder logic 

      if (isLastModule && currentChapter < 5) {
        unlockChapter(currentChapter + 1);
      }
    }
  }, [moduleId, completeModule, unlockChapter, currentModule]);

  /**
   * CELEBRATION TIMER
   * Tắt hiệu ứng chúc mừng sau 5 giây.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleContinue = () => {
    if (onComplete) {
      onComplete(); // Back to Hub
    }
  };

  const handleNextModule = () => {
    if (nextModule && onModuleComplete) {
      // Navigate to next module (Logic xử lý ở Parent/Router)
      console.log('Next module requested:', nextModule.id);
    }
  };

  // Animation Variants
  const celebrationVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-[600px] bg-gray-900/95 rounded-xl overflow-hidden shadow-xl border border-gray-800/50 relative">

      {/* 1. CELEBRATION OVERLAY (PHÁO HOA/HUY HIỆU) */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={celebrationVariants}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-gray-900/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30"
              >
                <i className="fi fi-rr-trophy text-white text-4xl"></i>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Chúc mừng!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base text-gray-300"
              >
                Bạn đã hoàn thành xuất sắc module này.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HEADER SECTION */}
      <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-b border-gray-700/30 p-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fi fi-rr-flag-checkered text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          <p className="text-gray-400 text-sm">Tổng kết thành tích học tập</p>
        </div>
      </div>

      {/* 3. MAIN CONTENT: STATS & ACHIEVEMENTS */}
      <div className="p-6 space-y-6">

        {/* A. Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Time Stat */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 text-center group hover:border-blue-500/30 transition-colors"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i className="fi fi-rr-clock text-blue-400"></i>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-0.5">
              {Math.round(moduleTime)}
            </div>
            <div className="text-gray-500 text-xs uppercase tracking-wide">phút học</div>
          </motion.div>

          {/* Score Stat */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 text-center group hover:border-green-500/30 transition-colors"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i className="fi fi-rr-chart-pie text-green-400"></i>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-0.5">
              {Math.round(averageScore)}%
            </div>
            <div className="text-gray-500 text-xs uppercase tracking-wide">điểm TB</div>
          </motion.div>

          {/* Streak Stat */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 text-center group hover:border-purple-500/30 transition-colors"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <i className="fi fi-rr-fire-flame-curved text-purple-400"></i>
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-0.5">
              {currentStreak}
            </div>
            <div className="text-gray-500 text-xs uppercase tracking-wide">ngày streak</div>
          </motion.div>

          {/* Efficiency Stat */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 text-center group hover:border-yellow-500/30 transition-colors"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <i className="fi fi-rr-bolt text-yellow-400"></i>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-0.5">
              {currentModule ? Math.min(100, Math.round((moduleTime / currentModule.totalEstimatedTime) * 100)) : 0}%
            </div>
            <div className="text-gray-500 text-xs uppercase tracking-wide">tiến độ</div>
          </motion.div>
        </div>

        {/* B. Achievements List */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-white mb-3 text-center flex items-center justify-center gap-2">
              <i className="fi fi-rr-medal text-yellow-400"></i>
              Thành tựu đạt được
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.08, type: "spring" }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30 hover:border-yellow-500/30 transition-colors flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-inner shadow-yellow-500/10">
                    {achievement.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{achievement.title}</h3>
                    <p className="text-gray-400 text-xs truncate">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* C. Action Buttons (Navigation) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30 mt-4"
        >
          <h2 className="text-base font-semibold text-white mb-4 text-center">
            Bước tiếp theo
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* Next Module Button */}
            {nextModule ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextModule}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <span>Mở bài học tiếp theo</span>
                <motion.i
                  className="fi fi-rr-arrow-right"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                ></motion.i>
              </motion.button>
            ) : (
              <div className="text-center text-gray-400 py-2">
                <i className="fi fi-rr-confetti text-yellow-400 mb-1"></i>
                <p className="text-xs">Bạn đã hoàn thành tất cả nội dung!</p>
              </div>
            )}

            {/* Back to Home Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="w-full sm:w-auto px-6 py-3 bg-gray-700/80 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-gray-600/50"
            >
              <i className="fi fi-rr-home"></i>
              <span>Về màn hình chính</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SummaryPage;