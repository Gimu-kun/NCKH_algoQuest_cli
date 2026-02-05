/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * THEORY PAGE - LÝ THUYẾT HỌC TẬP
 * (TRANG LÝ THUYẾT VÀ BÀI GIẢNG)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - Component hiển thị nội dung bài giảng lý thuyết cốt lõi.
 * - Là nơi người học tiếp thu kiến thức mới thông qua văn bản Markdown, ví dụ minh họa và concept cards.
 * - Đảm bảo người học thực sự đọc bài thông qua cơ chế tracking thời gian đọc.
 * 
 * 🏗️ KIẾN TRÚC CLIENT-SIDE DATABASE:
 * - Sử dụng pattern `THEORY_CONTENTS` mapping để ánh xạ `pageId` sang object nội dung cụ thể.
 * - Dữ liệu được import static từ file `theory_content.ts` của từng chương để tối ưu performance (Code Splitting).
 * 
 * 🛠️ KỸ THUẬT & THUẬT TOÁN:
 * 1. **Time-Based Progress Tracking**: 
 *    - Sử dụng `startTimeRef` và `setInterval` để tính thời gian thực tế user ở trên trang.
 *    - Force completion: Chỉ cho phép hoàn thành khi user đã đọc đủ thời gian quy định (70% `readingTime`).
 * 2. **Content Fallback**: 
 *    - Xử lý trường hợp thiếu nội dung bằng default object để tránh crash trang.
 * 3. **Interactive UI**:
 *    - Highlight key concepts bằng thẻ màu theo độ quan trọng (Critical/Important/Info).
 * 
 * ✅ ƯU ĐIỂM:
 * - **Rich Content**: Hỗ trợ Markdown, code highlighting, và custom components.
 * - **Engagement**: Cơ chế progress bar và bắt buộc đọc giúp tăng chất lượng học tập.
 * 
 * @component TheoryPage
 * @category Components/StudyMaterials/Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MarkdownViewer } from '../../ui/MarkdownViewer';
import { useLearningProgressStore } from '../../../store/learningProgressStore';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

import type { TheoryContent } from '../../../data/study_materials/types';

interface TheoryPageProps {
  moduleId: string;
  pageId: string;
  title: string;
  onComplete?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// IMPORT ALL THEORY CONTENT (TẬP HỢP NỘI DUNG TỪ CÁC CHƯƠNG)
// ═══════════════════════════════════════════════════════════════════════════
// Pattern: Import static content object từ file data riêng biệt

// Chapter 1: Algorithm Complexity
import {
  CH1_P1_INTRO,
  CH1_P2_COMMON,
  CH1_P6_TIME,
  CH1_P7_SPACE
} from '../../../data/study_materials/chapter1_complexity/theory_content';

// Chapter 2: Sorting & Searching
import {
  CH2_P1_BUBBLE,
  CH2_P5_DIVIDE_CONQUER,
  CH2_P6_QUICK,
  CH2_P9_BINARY
} from '../../../data/study_materials/chapter2_sorting_searching/theory_content';

// Chapter 3: Linked List
import { CH3_P1_STRUCTURE } from '../../../data/study_materials/chapter3_linked_list/theory_content';

// Chapter 4: Stack & Queue
import { CHAPTER_4_THEORY } from '../../../data/study_materials/chapter4_stack_queue/theory_content';

// Chapter 5: Binary Search Tree
import {
  CHAPTER_5_THEORY,
  CH5_P1_FUNDAMENTALS
} from '../../../data/study_materials/chapter5_bst/theory_content';

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT MAPPING REGISTRY (SỔ ĐỊA CHỈ NỘI DUNG)
// ═══════════════════════════════════════════════════════════════════════════
// Map pageId (string) -> Content Object.
// Giúp dễ dàng lookup nội dung O(1) mà không cần switch-case dài dòng.

const THEORY_CONTENTS: Record<string, TheoryContent> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1: ALGORITHM COMPLEXITY (Phân tích độ phức tạp)
  // ═══════════════════════════════════════════════════════════════════════════
  'ch1-theory-overview': CH1_P1_INTRO,
  'ch1-p1-theory-intro': CH1_P1_INTRO,
  'ch1-p2-theory-common': CH1_P2_COMMON,
  'ch1-p6-theory-time': CH1_P6_TIME,
  'ch1-p7-theory-space': CH1_P7_SPACE,
  // Alias mappings (phòng trường hợp đổi ID nhưng muốn giữ content cũ)
  'ch1-theory-intro': CH1_P1_INTRO,
  'ch1-theory-bigo': CH1_P1_INTRO,
  'ch1-theory-time': CH1_P6_TIME,
  'ch1-theory-space': CH1_P7_SPACE,
  'ch1-theory-common-types': CH1_P2_COMMON,

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2: SORTING & SEARCHING (Sắp xếp và Tìm kiếm)
  // ═══════════════════════════════════════════════════════════════════════════
  'ch2-theory-overview': CH2_P1_BUBBLE,
  'ch2-p1-theory-bubble': CH2_P1_BUBBLE,
  'ch2-p5-theory-divide-conquer': CH2_P5_DIVIDE_CONQUER,
  'ch2-p6-theory-quick': CH2_P6_QUICK,
  'ch2-p9-theory-binary': CH2_P9_BINARY,
  // Additional mappings
  'ch2-theory-bubble': CH2_P1_BUBBLE,
  'ch2-theory-quick': CH2_P6_QUICK,
  'ch2-theory-binary-search': CH2_P9_BINARY,
  'ch2-theory-divide-conquer': CH2_P5_DIVIDE_CONQUER,
  'ch2-theory-sorting': CH2_P1_BUBBLE,
  'ch2-theory-searching': CH2_P9_BINARY,

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3: LINKED LIST (Danh sách liên kết)
  // ═══════════════════════════════════════════════════════════════════════════
  'ch3-theory-overview': CH3_P1_STRUCTURE,
  'ch3-p1-theory-structure': CH3_P1_STRUCTURE,
  'ch3-theory-structure': CH3_P1_STRUCTURE,
  'ch3-theory-singly': CH3_P1_STRUCTURE,
  'ch3-theory-doubly': CH3_P1_STRUCTURE,
  'ch3-theory-circular': CH3_P1_STRUCTURE,
  'ch3-theory-operations': CH3_P1_STRUCTURE,

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4: STACK & QUEUE (Ngăn xếp và Hàng đợi)
  // ═══════════════════════════════════════════════════════════════════════════
  'ch4-theory-overview': CHAPTER_4_THEORY,
  'ch4-p1-theory-stack-queue': CHAPTER_4_THEORY,
  'ch4-theory-stack': CHAPTER_4_THEORY,
  'ch4-theory-queue': CHAPTER_4_THEORY,
  'ch4-theory-lifo': CHAPTER_4_THEORY,
  'ch4-theory-fifo': CHAPTER_4_THEORY,
  'ch4-theory-applications': CHAPTER_4_THEORY,

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5: BINARY SEARCH TREE (Cây nhị phân tìm kiếm)
  // ═══════════════════════════════════════════════════════════════════════════
  'ch5-theory-overview': CH5_P1_FUNDAMENTALS,
  'ch5-p1-theory-fundamentals': CH5_P1_FUNDAMENTALS,
  'ch5-theory-bst': CHAPTER_5_THEORY,
  'ch5-p4-theory-bst': CHAPTER_5_THEORY,
  'ch5-theory-fundamentals': CH5_P1_FUNDAMENTALS,
  'ch5-theory-binary-tree': CH5_P1_FUNDAMENTALS,
  'ch5-theory-traversal': CHAPTER_5_THEORY,
  'ch5-theory-operations': CHAPTER_5_THEORY,
  'ch5-theory-balanced': CHAPTER_5_THEORY
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (COMPONENT CHÍNH)
// ═══════════════════════════════════════════════════════════════════════════

export const TheoryPage: React.FC<TheoryPageProps> = ({
  moduleId,
  pageId,
  title,
  onComplete
}) => {
  // Global Store Access
  const { updateTimeSpent } = useLearningProgressStore();

  // Local UI State
  const [isCompleted, setIsCompleted] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0); // Progress % (0-100)

  // Ref để track thời điểm bắt đầu học (tránh re-render loop)
  const startTimeRef = useRef<number>(0);

  /**
   * Initialize Time Tracking
   * Ghi nhận thời điểm mount component.
   */
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  /**
   * Content Retrieval Logic
   * Lấy nội dung từ Registry. Fallback về nội dung mặc định nếu không tìm thấy ID.
   */
  const content = THEORY_CONTENTS[pageId] || {
    introduction: `# ${title}\n\nNội dung đang được cập nhật...`,
    keyConcepts: [],
    examples: [],
    summary: 'Tóm tắt đang được cập nhật',
    readingTime: 5 // Default 5 phút đọc
  };

  /**
   * Progress Tracking Effect
   * 
   * 🔹 Logic kép (Double Timer):
   * 1. `progressTimer` (1s): Cập nhật UI Progress Bar mượt mà local state.
   * 2. `storeUpdateTimer` (30s): Sync data về Global Store/BE để tránh spam requests.
   * 
   * 🔹 Completion Logic: 
   * - Tự động mark completed khi đọc được 70% thời gian ước tính.
   */
  useEffect(() => {
    // 1. Local Progress Updater (UI only)
    const progressTimer = setInterval(() => {
      if (startTimeRef.current === 0) return;

      const elapsedMinutes = (Date.now() - startTimeRef.current) / (1000 * 60);

      // Calculate % based on estimated reading time
      const newProgress = Math.min(100, (elapsedMinutes / content.readingTime) * 100);
      setReadingProgress(newProgress);

      // Auto-mark logic: >= 70% time
      // Use a functional update check or ref to ensure we don't trigger multiple times
      if (elapsedMinutes >= content.readingTime * 0.7) {
        setIsCompleted(prev => {
          if (!prev) {
            // Only trigger onComplete ONCE when transitioning from false -> true
            if (onComplete) {
              // Use setTimeout to push to next tick, but ensure it's cleaned up if unmount
              setTimeout(onComplete, 1000);
            }
            return true;
          }
          return prev;
        });
      }
    }, 1000);

    // 2. Global Persistence Updater (Data store)
    const storeUpdateTimer = setInterval(() => {
      updateTimeSpent(moduleId, pageId, 0.5);
    }, 30000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(storeUpdateTimer);
    };
  }, [moduleId, pageId, updateTimeSpent, onComplete, content.readingTime]);

  // Handler for manual skip/complete (cho phép đọc xong sớm nếu muốn)
  const handleComplete = () => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-[600px] bg-gray-900/95 rounded-xl overflow-hidden shadow-xl border border-gray-800/50">
      {/* Header Block w/ Reading Stats */}
      <div className="relative bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-gray-700/30 p-5 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Animated Icon Box */}
            <motion.div
              className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <i className="fi fi-rr-book-open-cover text-xl text-white"></i>
            </motion.div>

            {/* Title & Metadata */}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white mb-0.5 truncate">{title}</h1>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-blue-200">
                  <i className="fi fi-rr-clock text-blue-400 text-[10px]"></i>
                  {content.readingTime} phút đọc
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-purple-200">
                  <i className="fi fi-rr-book text-purple-400 text-[10px]"></i>
                  Lý thuyết
                </span>
              </div>
            </div>
          </div>

          {/* Compact Reading Progress Ring */}
          <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg px-3 py-2 border border-gray-700/40 flex-shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">Tiến độ</div>
              <div className="text-base font-bold text-white">
                {Math.round(readingProgress)}%
              </div>
            </div>
            <div className="w-10 h-10 relative">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-gray-700/50"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  cx="18" cy="18" r="15.9155"
                />
                <motion.circle
                  stroke="url(#theoryProgressGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${readingProgress}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  cx="18" cy="18" r="15.9155"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${readingProgress}, 100` }}
                  transition={{ duration: 0.4 }}
                />
                <defs>
                  <linearGradient id="theoryProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className={`fi ${readingProgress >= 100 ? 'fi-rr-check text-green-400' : 'fi-rr-book-open-reader text-blue-300'} text-xs`}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 space-y-8">
        {/* Section 1: Introduction Markdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <MarkdownViewer content={content.introduction} />
        </motion.div>

        {/* Section 2: Key Concepts Cards Grid */}
        {content.keyConcepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <i className="fi fi-rr-lightbulb text-yellow-400"></i>
              Khái niệm chính
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.keyConcepts.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  whileHover={{ scale: 1.01, y: -1 }}
                  // Style logic: Color coding based on importance level
                  className={`
                    p-3.5 rounded-lg border transition-all duration-200 cursor-default
                    ${concept.importance === 'critical'
                      ? 'bg-red-950/30 border-red-500/40 hover:border-red-500/60'
                      : concept.importance === 'important'
                        ? 'bg-yellow-950/30 border-yellow-500/40 hover:border-yellow-500/60'
                        : 'bg-blue-950/30 border-blue-500/40 hover:border-blue-500/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`
                      w-5 h-5 rounded flex items-center justify-center text-xs
                      ${concept.importance === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : concept.importance === 'important'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'}
                    `}>
                      <i className={`fi ${concept.importance === 'critical' ? 'fi-rr-exclamation' :
                        concept.importance === 'important' ? 'fi-rr-star' : 'fi-rr-info'
                        }`}></i>
                    </div>
                    <h3 className="font-semibold text-white text-sm">{concept.title}</h3>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed pl-7">{concept.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Section 3: Interactive Code Examples */}
        {content.examples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fi fi-rr-code text-green-400"></i>
              Ví dụ thực tế
            </h2>
            <div className="space-y-6">
              {content.examples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50"
                >
                  <div className="p-4 border-b border-gray-700/50">
                    <h3 className="font-semibold text-white mb-2">{example.title}</h3>
                    <p className="text-gray-400 text-sm">{example.description}</p>
                  </div>

                  {example.code && (
                    <div className="p-4">
                      {/* Code Block */}
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm font-mono">{example.code}</pre>
                      </div>
                      {/* Code Explanation - Explain line by line or concept */}
                      {example.explanation && (
                        <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                          <p className="text-blue-300 text-sm">
                            <strong>Giải thích:</strong> {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Section 4: Recap/Summary Box */}
        {content.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30"
          >
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <i className="fi fi-rr-summary text-purple-400"></i>
              Tóm tắt
            </h2>
            <p className="text-gray-300">{content.summary}</p>
          </motion.div>
        )}
      </div>

      {/* Action Footer: Navigation & Completion Confirmation */}
      <div className="bg-gray-800/50 border-t border-gray-700/30 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {isCompleted ? (
              <motion.span
                className="flex items-center gap-2 text-green-400 font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.i
                  className="fi fi-rr-check-circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                ></motion.i>
                Đã hoàn thành - Sẵn sàng tiếp tục!
              </motion.span>
            ) : (
              <span className="flex items-center gap-2 text-gray-400">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <i className="fi fi-rr-book-open-reader text-blue-400"></i>
                </motion.div>
                Vui lòng đọc kỹ nội dung...
              </span>
            )}
          </div>

          {/* Continue Button */}
          <motion.button
            onClick={handleComplete}
            disabled={!isCompleted}
            className={`
              px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2
              ${isCompleted
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/30'
              }
            `}
            whileHover={isCompleted ? { scale: 1.02 } : {}}
            whileTap={isCompleted ? { scale: 0.98 } : {}}
          >
            {isCompleted ? (
              <>
                Tiếp tục
                <motion.i
                  className="fi fi-rr-arrow-right"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                ></motion.i>
              </>
            ) : (
              <>
                <i className="fi fi-rr-time-fast"></i>
                Tiến độ: {Math.round(readingProgress)}%
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TheoryPage;