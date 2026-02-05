/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUIZ PAGE - TRANG TRẮC NGHIỆM & KIỂM TRA
 * (KNOWLEDGE CHECK)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - Là chốt chặn kiến thức cuối mỗi bài học.
 * - Giúp người học tự đánh giá mức độ hiểu bài thông qua các câu hỏi trắc nghiệm.
 * - Cung cấp phản hồi tức thì (Immediate Feedback) và giải thích chi tiết.
 * 
 * 🏗️ KIẾN TRÚC CLIENT-SIDE DATA:
 * - Dữ liệu câu hỏi được tổng hợp từ nhiều nguồn (`exercises.ts` của từng chương).
 * - Sử dụng pattern `ALL_QUIZ_QUESTIONS` map để linh hoạt cấu hình bộ câu hỏi cho từng trang.
 * - Hỗ trợ trộn câu hỏi (trong tương lai) và filter theo topic.
 * 
 * 🛠️ CƠ CHẾ HOẠT ĐỘNG:
 * 1. **State Management**:
 *    - `selectedAnswers`: Lưu trữ đáp án người dùng chọn.
 *    - `score`: Tính điểm realtime hoặc khi hoàn thành.
 * 2. **Interaction Flow**:
 *    - Chọn đáp án -> Hiển thị đúng/sai ngay lập tức (Immediate Feedback).
 *    - Hiển thị giải thích chi tiết (Explanation) sau khi trả lời.
 *    - Next question -> Tổng kết điểm số cuối cùng.
 * 3. **UI/UX**:
 *    - Sử dụng `AnimatePresence` để chuyển đổi câu hỏi mượt mà.
 *    - Gamification: Hiển thị huy hiệu/lời khen dựa trên điểm số.
 * 
 * @component QuizPage
 * @category Components/StudyMaterials/Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningProgressStore } from '../../../store/learningProgressStore';

// ═══════════════════════════════════════════════════════════════════════════
// IMPORT QUIZ/EXERCISES DATA (NHẬP DỮ LIỆU CÂU HỎI TỪ CÁC CHƯƠNG)
// ═══════════════════════════════════════════════════════════════════════════

// Chapter 1: Complexity Exercises
import { COMPLEXITY_EXERCISES } from '../../../data/study_materials/chapter1_complexity/exercises';

// Chapter 2: Sorting & Searching Exercises
import { SORTING_QUIZ } from '../../../data/study_materials/chapter2_sorting_searching/exercises';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

interface QuizPageProps {
  moduleId: string;
  pageId: string;
  title: string;
  onComplete?: (score: number) => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA TRANSFORMATION & AGGREGATION (CHUẨN HÓA DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

// 1. Transform Chapter 1 exercises -> Quiz format
const CHAPTER_1_QUIZ: QuizQuestion[] = COMPLEXITY_EXERCISES.map((ex) => ({
  id: ex.id,
  // Ghép code snippet vào nội dung câu hỏi nếu có
  question: ex.description + (ex.codeSnippet ? `\n\n\`\`\`typescript\n${ex.codeSnippet.trim()}\n\`\`\`` : ''),
  options: ex.options || [],
  correctAnswer: ex.options?.indexOf(ex.correctAnswer) ?? 0,
  explanation: ex.explanation,
  difficulty: ex.difficulty
}));

// 2. Transform Chapter 2 quiz -> Quiz format
const CHAPTER_2_QUIZ: QuizQuestion[] = SORTING_QUIZ.map((ex) => ({
  id: ex.id,
  question: ex.description,
  options: ex.options || [],
  correctAnswer: ex.options?.indexOf(ex.correctAnswer) ?? 0,
  explanation: ex.explanation,
  difficulty: ex.difficulty
}));

// 3. Define Chapter 3 (Linked List) Quiz manually
const CHAPTER_3_QUIZ: QuizQuestion[] = [
  {
    id: 'ch3-q1',
    question: 'Thao tác nào trên Singly Linked List có độ phức tạp O(1)?',
    options: ['Tìm kiếm phần tử', 'Xóa ở cuối', 'Thêm vào đầu (insertAtHead)', 'Truy cập phần tử thứ n'],
    correctAnswer: 2,
    explanation: 'InsertAtHead chỉ cần cập nhật con trỏ head → O(1). Các thao tác khác cần duyệt qua list → O(n).',
    difficulty: 'easy'
  },
  {
    id: 'ch3-q2',
    question: 'Thuật toán Floyd (Two Pointers: slow/fast) dùng để làm gì?',
    options: ['Sắp xếp linked list', 'Phát hiện cycle trong linked list', 'Tìm phần tử lớn nhất', 'Đảo ngược linked list'],
    correctAnswer: 1,
    explanation: 'Floyd\'s Cycle Detection: slow đi 1 bước, fast đi 2 bước. Nếu có cycle, chúng sẽ gặp nhau.',
    difficulty: 'medium'
  },
  {
    id: 'ch3-q3',
    question: 'Doubly Linked List khác Singly Linked List ở điểm nào?',
    options: ['Có thêm pointer Head', 'Có thêm pointer Tail', 'Mỗi node có thêm pointer Prev', 'Lưu trữ data lớn hơn'],
    correctAnswer: 2,
    explanation: 'Doubly Linked List: mỗi node có cả Next và Prev pointer, cho phép duyệt 2 chiều.',
    difficulty: 'easy'
  },
  {
    id: 'ch3-q4',
    question: 'Space complexity của thuật toán đảo ngược linked list iterative là bao nhiêu?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctAnswer: 2,
    explanation: 'Iterative reverse chỉ dùng 3 pointers (prev, current, next) → O(1) space.',
    difficulty: 'medium'
  }
];

// 4. Define Chapter 4 (Stack & Queue) Quiz manually
const CHAPTER_4_QUIZ: QuizQuestion[] = [
  {
    id: 'ch4-q1',
    question: 'Stack hoạt động theo nguyên tắc nào?',
    options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Random Access', 'Priority Based'],
    correctAnswer: 1,
    explanation: 'Stack: LIFO - phần tử vào sau sẽ được lấy ra trước. Ví dụ: chồng đĩa, nút Undo.',
    difficulty: 'easy'
  },
  {
    id: 'ch4-q2',
    question: 'Queue hoạt động theo nguyên tắc nào?',
    options: ['LIFO (Last In First Out)', 'FIFO (First In First Out)', 'FILO (First In Last Out)', 'LILO (Last In Last Out)'],
    correctAnswer: 1,
    explanation: 'Queue: FIFO - phần tử vào trước sẽ được lấy ra trước. Ví dụ: hàng đợi mua vé.',
    difficulty: 'easy'
  },
  {
    id: 'ch4-q3',
    question: 'Bài toán "kiểm tra ngoặc hợp lệ" nên dùng cấu trúc dữ liệu nào?',
    options: ['Queue', 'Array', 'Stack', 'Linked List'],
    correctAnswer: 2,
    explanation: 'Stack phù hợp vì ngoặc đóng phải match với ngoặc mở GẦN NHẤT (LIFO).',
    difficulty: 'easy'
  },
  {
    id: 'ch4-q4',
    question: 'Tính giá trị biểu thức Postfix (Reverse Polish Notation) dùng gì?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correctAnswer: 1,
    explanation: 'Stack: push số, khi gặp operator thì pop 2 số, tính, push kết quả.',
    difficulty: 'medium'
  },
  {
    id: 'ch4-q5',
    question: 'Implement Queue bằng 2 Stacks có độ phức tạp amortized cho dequeue là?',
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    correctAnswer: 1,
    explanation: 'Amortized O(1) vì mỗi phần tử chỉ được move từ stack1 sang stack2 tối đa 1 lần.',
    difficulty: 'hard'
  }
];

// 5. Define Chapter 5 (BST) Quiz manually
const CHAPTER_5_QUIZ: QuizQuestion[] = [
  {
    id: 'ch5-q1',
    question: 'Tính chất của Binary Search Tree (BST) là gì?',
    options: [
      'Left < Root < Right',
      'Left > Root > Right',
      'Left = Root = Right',
      'Root < Left < Right'
    ],
    correctAnswer: 0,
    explanation: 'BST Property: Tất cả nodes bên trái < Root < Tất cả nodes bên phải.',
    difficulty: 'easy'
  },
  {
    id: 'ch5-q2',
    question: 'Inorder traversal của BST cho kết quả như thế nào?',
    options: ['Dãy giảm dần', 'Dãy tăng dần', 'Dãy ngẫu nhiên', 'Dãy level-order'],
    correctAnswer: 1,
    explanation: 'Inorder (Left-Root-Right) trên BST luôn cho dãy SẮP XẾP TĂNG DẦN.',
    difficulty: 'easy'
  },
  {
    id: 'ch5-q3',
    question: 'Worst case của Search trong BST không cân bằng là?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'Nếu BST bị skewed (insert sorted data), nó trở thành linked list → O(n).',
    difficulty: 'medium'
  },
  {
    id: 'ch5-q4',
    question: 'Để tìm phần tử nhỏ nhất trong BST, ta đi theo hướng nào?',
    options: ['Luôn đi về bên phải', 'Luôn đi về bên trái', 'Đi theo level-order', 'Đi ngẫu nhiên'],
    correctAnswer: 1,
    explanation: 'Phần tử nhỏ nhất luôn ở node trái nhất (leftmost node) của BST.',
    difficulty: 'easy'
  },
  {
    id: 'ch5-q5',
    question: 'Độ sâu tối đa (max depth) của cây nhị phân có n nodes là?',
    options: ['O(log n)', 'O(n)', 'O(√n)', 'O(1)'],
    correctAnswer: 1,
    explanation: 'Worst case: cây lệch hoàn toàn → depth = n - 1 = O(n).',
    difficulty: 'medium'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ MAPPING REGISTRY (ĐĂNG KÝ CÂU HỎI THEO PAGE ID)
// ═══════════════════════════════════════════════════════════════════════════
// Map pageId -> Array of Questions

const ALL_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  // Chapter 1: Complexity Quiz
  'ch1-p4-quiz-basics': CHAPTER_1_QUIZ.slice(0, 3),
  'ch1-quiz-basics': CHAPTER_1_QUIZ.slice(0, 3),
  'ch1-quiz-complexity': CHAPTER_1_QUIZ.slice(3, 6),
  'ch1-quiz-time': CHAPTER_1_QUIZ.filter(q => q.id.includes('ex1') || q.id.includes('ex2') || q.id.includes('ex3')),
  'ch1-quiz-space': CHAPTER_1_QUIZ.filter(q => q.id.includes('ex7')),
  'ch1-quiz-full': CHAPTER_1_QUIZ,

  // Chapter 2: Sorting & Searching Quiz
  'ch2-p4-quiz-bubble': CHAPTER_2_QUIZ,
  'ch2-p8-quiz-quick': CHAPTER_2_QUIZ,
  'ch2-p11-quiz-binary': CHAPTER_2_QUIZ,
  'ch2-quiz-sorting': CHAPTER_2_QUIZ,
  'ch2-quiz-searching': CHAPTER_2_QUIZ,
  'ch2-quiz-full': CHAPTER_2_QUIZ,

  // Chapter 3: Linked List Quiz
  'ch3-p3-quiz-singly': CHAPTER_3_QUIZ.slice(0, 2),
  'ch3-p4-quiz-doubly': CHAPTER_3_QUIZ.slice(2, 4),
  'ch3-quiz-singly': CHAPTER_3_QUIZ.slice(0, 2),
  'ch3-quiz-doubly': CHAPTER_3_QUIZ.slice(2, 4),
  'ch3-quiz-operations': CHAPTER_3_QUIZ,
  'ch3-quiz-full': CHAPTER_3_QUIZ,

  // Chapter 4: Stack & Queue Quiz
  'ch4-p4-quiz-stack': CHAPTER_4_QUIZ.slice(0, 2),
  'ch4-p5-quiz-queue': CHAPTER_4_QUIZ.slice(2, 4),
  'ch4-quiz-stack': CHAPTER_4_QUIZ.slice(0, 3),
  'ch4-quiz-queue': CHAPTER_4_QUIZ.slice(3, 5),
  'ch4-quiz-applications': CHAPTER_4_QUIZ.slice(2, 5),
  'ch4-quiz-full': CHAPTER_4_QUIZ,

  // Chapter 5: BST Quiz
  'ch5-p3-quiz-traversal': CHAPTER_5_QUIZ.slice(0, 2),
  'ch5-p5-quiz-operations': CHAPTER_5_QUIZ.slice(2, 4),
  'ch5-quiz-fundamentals': CHAPTER_5_QUIZ.slice(0, 2),
  'ch5-quiz-traversal': CHAPTER_5_QUIZ.slice(1, 3),
  'ch5-quiz-operations': CHAPTER_5_QUIZ.slice(2, 5),
  'ch5-quiz-full': CHAPTER_5_QUIZ
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (COMPONENT CHÍNH)
// ═══════════════════════════════════════════════════════════════════════════

export const QuizPage: React.FC<QuizPageProps> = ({
  moduleId,
  pageId,
  title,
  onComplete
}) => {
  // Global Store Access
  const { updateTimeSpent } = useLearningProgressStore();

  // Memoize questions list to avoid recalc on render
  const questions = useMemo(() => ALL_QUIZ_QUESTIONS[pageId] || [], [pageId]);

  // Local Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  /**
   * LEARNING TIME TRACKING
   * Update thời gian học mỗi 30s
   */
  useEffect(() => {
    const timer = setInterval(() => {
      updateTimeSpent(moduleId, pageId, 0.5); // Update every 30 seconds
    }, 30000);

    return () => clearInterval(timer);
  }, [moduleId, pageId, updateTimeSpent]);

  // Derived state
  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = selectedAnswers[currentQuestion?.id] !== undefined;

  /**
   * ANSWER HANDLER
   * Xử lý khi user chọn một đáp án. Chỉ cho phép chọn 1 lần (nếu chưa xem kết quả).
   */
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return; // Prevent changing answers in result mode? 
    // Actually, design cho phép chọn lại nếu chưa submit? 
    // Ở đây logic là "Instant Feedback" nên chọn xong là lock câu hiện tại.

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  /**
   * NAVIGATION HANDLER
   * Chuyển câu hỏi tiếp theo hoặc kết thúc quiz.
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate final score
      const finalScore = questions.reduce((acc, question) => {
        return acc + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0);
      }, 0);

      const percentage = Math.round((finalScore / questions.length) * 100);
      setScore(percentage);
      setShowResults(true);

      // Call onComplete with score to parent/store
      if (onComplete) {
        setTimeout(() => onComplete(percentage), 1000); // Delay chút để UI trượt mượt
      }
    }
  };

  // Helper: Get color class based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Helper: Get encouraging message
  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Xuất sắc! Bạn đã nắm vững kiến thức.';
    if (score >= 60) return 'Tốt! Còn một số điểm cần ôn lại.';
    return 'Cần ôn lại kiến thức. Đừng lo, hãy thử lại!';
  };

  // Fallback UI: Empty Quiz
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fi fi-rr-file text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-white mb-2">Không có câu hỏi</h3>
          <p className="text-gray-400">Bộ câu hỏi cho trang này đang được cập nhật.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-gray-900/95 rounded-xl overflow-hidden shadow-xl border border-gray-800/50">

      {/* 1. HEADER SECTION */}
      <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-gray-700/30 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fi fi-rr-list-check text-white"></i>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{title}</h1>
              <p className="text-gray-400 text-xs">Kiểm tra hiểu biết cúa bạn về nội dung đã học</p>
            </div>
          </div>

          {/* Question Counter Badge */}
          <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg px-3 py-2 border border-gray-700/40 flex-shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">Câu hỏi</div>
              <div className="text-lg font-bold text-blue-400 leading-tight">
                {currentQuestionIndex + 1}<span className="text-gray-500 text-sm">/{questions.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-700/40 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="p-6">
        {!showResults ? (
          /* A. QUESTION VIEW */
          <div className="space-y-6">

            {/* Animated Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30"
              >
                {/* Difficulty Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                    {currentQuestion.difficulty === 'easy' ? 'Dễ' :
                      currentQuestion.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-lg font-semibold text-white mb-4 whitespace-pre-line">
                  {currentQuestion.question}
                </h3>

                {/* Answer Options Grid */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const showFeedback = hasAnswered; // Chỉ show đúng sai khi đã trả lời

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback} // Disable click sau khi đã chọn
                        className={`
                          w-full p-3.5 text-left rounded-lg border-2 transition-all duration-200
                          ${isSelected
                            ? showFeedback
                              ? isCorrect
                                ? 'bg-green-500/15 border-green-500/80 text-green-200' // Selected Correct
                                : 'bg-red-500/15 border-red-500/80 text-red-200'       // Selected Wrong
                              : 'bg-blue-500/15 border-blue-500/80 text-blue-200'     // Selected (waiting)
                            : showFeedback && isCorrect
                              ? 'bg-green-500/10 border-green-500/40 text-green-300'   // Show correct answer if wrong selected
                              : 'bg-gray-800/40 border-gray-700/40 text-gray-300 hover:bg-gray-700/40 hover:border-gray-600/60' // Normal state
                          }
                        `}
                        whileHover={{ scale: showFeedback ? 1 : 1.01 }}
                        whileTap={{ scale: showFeedback ? 1 : 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Option Letter (A, B, C, D) */}
                          <div className={`
                            w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                            ${isSelected
                              ? showFeedback
                                ? isCorrect
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                                : 'bg-blue-500 text-white'
                              : 'bg-gray-700/80 text-gray-300'
                            }
                          `}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1 text-sm">{option}</span>

                          {/* Feedback Icon */}
                          {showFeedback && (isSelected || isCorrect) && (
                            <motion.i
                              className={`fi ${isCorrect ? 'fi-rr-check text-green-400' : 'fi-rr-cross text-red-400'}`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            ></motion.i>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation Box (Revealed after answering) */}
                <AnimatePresence>
                  {hasAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg overflow-hidden"
                    >
                      <div className="flex items-start gap-3">
                        <i className="fi fi-rr-info text-blue-400 mt-1"></i>
                        <div>
                          <h4 className="text-blue-300 font-semibold mb-2">Giải thích</h4>
                          <p className="text-blue-200 text-sm">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {hasAnswered ? (
                  <span className="flex items-center gap-1.5 text-green-400">
                    <i className="fi fi-rr-check-circle"></i>
                    Đã trả lời - Nhấn tiếp để tiếp tục
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <i className="fi fi-rr-cursor-finger text-blue-400"></i>
                    Chọn một đáp án
                  </span>
                )}
              </div>
              <motion.button
                onClick={handleNextQuestion}
                disabled={!hasAnswered}
                className={`
                  px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2
                  ${hasAnswered
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  }
                `}
                whileHover={hasAnswered ? { scale: 1.02 } : {}}
                whileTap={hasAnswered ? { scale: 0.98 } : {}}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                <motion.i
                  className="fi fi-rr-arrow-right"
                  animate={hasAnswered ? { x: [0, 3, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                ></motion.i>
              </motion.button>
            </div>
          </div>
        ) : (
          /* B. RESULTS VIEW -- Hiển thị khi hoàn thành tất cả câu hỏi */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            {/* Score Circle & Badge */}
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${score >= 80 ? 'bg-green-500/20 ring-4 ring-green-500/50' :
                  score >= 60 ? 'bg-yellow-500/20 ring-4 ring-yellow-500/50' :
                    'bg-red-500/20 ring-4 ring-red-500/50'
                  }`}
              >
                <span className={`text-2xl font-bold ${score >= 80 ? 'text-green-400' :
                  score >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                  {score}%
                </span>
              </motion.div>

              <h2 className="text-xl font-bold text-white mb-1">
                {score >= 80 ? (
                  <span className="flex items-center justify-center gap-2"><i className="fi fi-rr-trophy text-yellow-400"></i> Xuất sắc!</span>
                ) : score >= 60 ? (
                  <span className="flex items-center justify-center gap-2"><i className="fi fi-rr-thumbs-up text-blue-400"></i> Tốt!</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><i className="fi fi-rr-redo text-orange-400"></i> Cố gắng thêm!</span>
                )}
              </h2>

              <p className={`text-sm ${getScoreColor(score)} mb-2`}>
                {getScoreMessage(score)}
              </p>

              <div className="text-xs text-gray-400">
                Bạn đã trả lời đúng {Math.round((score / 100) * questions.length)}/{questions.length} câu
              </div>
            </div>

            {/* Review List - Xem lại các câu đúng/sai */}
            <div className="space-y-2 max-w-md mx-auto">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg border text-left ${isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      <i className={`fi ${isCorrect ? 'fi-rr-check text-green-400' : 'fi-rr-cross text-red-400'} mt-0.5`}></i>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-medium mb-0.5 truncate">
                          Câu {index + 1}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Đáp án: {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer].slice(0, 40)}...
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;