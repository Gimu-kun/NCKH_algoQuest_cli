/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUẢN LÝ TIẾN ĐỘ HỌC TẬP (Learning Progress Store)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Quản lý tiến độ học tập page-based của người dùng trong study materials.
 * - Theo dõi trạng thái hoàn thành từng page
 * - Lưu điểm số và thời gian học
 * - Tính toán progress tổng thể
 * 
 * KỸ THUẬT:
 * - Zustand store với persistence
 * - Type-safe interfaces
 * - Real-time progress tracking
 * 
 * @module LearningProgressStore
 * @category State Management/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChapterNumber } from '../data/study_materials/types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Loại page trong learning module
 */
export const enum PageType {
  THEORY = 'theory',
  DEMO = 'demo',
  QUIZ = 'quiz',
  PRACTICE = 'practice',
  SUMMARY = 'summary',
  GAME = 'game'
}

/**
 * Trạng thái hoàn thành của page
 */
export const enum PageStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

/**
 * Interface cho một learning page
 */
export interface LearningPage {
  id: string;
  type: PageType;
  title: string;
  estimatedTime: number; // minutes
  prerequisites?: string[];
  nextPage?: string;
  chapter: ChapterNumber;
  moduleId: string;
  gameType?: string;
}

/**
 * Interface cho learning module
 */
export interface LearningModule {
  id: string;
  chapter: ChapterNumber;
  title: string;
  description: string;
  pages: LearningPage[];
  totalEstimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[]; // module IDs
}

/**
 * Interface cho tiến độ một page
 */
export interface PageProgress {
  pageId: string;
  status: PageStatus;
  timeSpent: number; // minutes
  score?: number; // 0-100, chỉ dùng cho quiz/practice
  completedAt?: Date;
  attempts: number;
}

/**
 * Interface cho tiến độ một module
 */
export interface ModuleProgress {
  moduleId: string;
  status: PageStatus;
  pageProgress: Record<string, PageProgress>;
  totalTimeSpent: number;
  averageScore: number;
  startedAt?: Date;
  completedAt?: Date;
  currentPageId?: string; // Track current page in module
}

/**
 * Interface cho state của learning progress
 */
export interface LearningProgressState {
  // Module hiện tại đang học
  currentModuleId: string | null;
  currentPageId: string | null;

  // Tiến độ các modules
  moduleProgress: Record<string, ModuleProgress>;

  // Overall stats
  totalStudyTime: number; // total minutes
  totalModulesCompleted: number;
  averageScore: number;

  // Learning streak và achievements
  currentStreak: number; // consecutive days
  lastStudyDate: string | null;

  // Unlock status cho chapters
  unlockedChapters: ChapterNumber[];
  currentChapter: ChapterNumber;
}

/**
 * Interface cho actions của learning progress
 */
export interface LearningProgressActions {
  // Module management
  startModule: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;

  // Page management
  startPage: (moduleId: string, pageId: string) => void;
  completePage: (moduleId: string, pageId: string, score?: number) => void;
  updateTimeSpent: (moduleId: string, pageId: string, minutes: number) => void;

  // Progress tracking
  getModuleProgress: (moduleId: string) => number; // 0-100
  getChapterProgress: (chapter: ChapterNumber) => number; // 0-100
  getOverallProgress: () => number; // 0-100

  // Navigation
  getNextPage: (currentModuleId: string, currentPageId: string) => LearningPage | null;
  getPreviousPage: (currentModuleId: string, currentPageId: string) => LearningPage | null;
  canAccessPage: (moduleId: string, pageId: string) => boolean;

  // Chapter unlock
  unlockChapter: (chapter: ChapterNumber) => void;
  canAccessChapter: (chapter: ChapterNumber) => boolean;

  // Reset và utilities
  resetProgress: () => void;
  exportProgress: () => LearningProgressState;
  importProgress: (data: LearningProgressState) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════

const initialState: LearningProgressState = {
  currentModuleId: null,
  currentPageId: null,
  moduleProgress: {},
  totalStudyTime: 0,
  totalModulesCompleted: 0,
  averageScore: 0,
  currentStreak: 0,
  lastStudyDate: null,
  unlockedChapters: [
    ChapterNumber.COMPLEXITY,
    ChapterNumber.SORTING_SEARCHING,
    ChapterNumber.LINKED_LIST,
    ChapterNumber.STACK_QUEUE,
    ChapterNumber.BST
  ], // Mở khóa tất cả chapters
  currentChapter: ChapterNumber.COMPLEXITY
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tính toán progress percentage cho một module
 * Dựa trên số page đã hoàn thành và điểm số
 */
function calculateModuleProgress(moduleProgress: ModuleProgress): number {
  const pages = Object.values(moduleProgress.pageProgress);
  if (pages.length === 0) return 0;

  const completedPages = pages.filter(p => p.status === PageStatus.COMPLETED).length;
  const baseProgress = (completedPages / pages.length) * 100;

  // Bonus cho điểm cao
  const quizPages = pages.filter(p => p.score !== undefined);
  if (quizPages.length > 0) {
    const avgScore = quizPages.reduce((sum, p) => sum + (p.score || 0), 0) / quizPages.length;
    return Math.min(100, baseProgress + (avgScore * 0.1));
  }

  return baseProgress;
}

/**
 * Kiểm tra xem một page có thể truy cập được không
 * Dựa trên prerequisites và trạng thái của các page trước đó
 * @TODO: Implement when module data is available
 */
// function canAccessPage(
//   moduleId: string, 
//   pageId: string, 
//   modules: LearningModule[], 
//   progress: Record<string, ModuleProgress>
// ): boolean {
//   const module = modules.find(m => m.id === moduleId);
//   if (!module) return false;
//   
//   const page = module.pages.find(p => p.id === pageId);
//   if (!page) return false;
//   
//   // Nếu không có prerequisites, cho phép truy cập
//   if (!page.prerequisites || page.prerequisites.length === 0) {
//     return true;
//   }
//   
//   // Kiểm tra tất cả prerequisites đã hoàn thành
//   const moduleProg = progress[moduleId];
//   if (!moduleProg) return false;
//   
//   return page.prerequisites.every(prereqId => {
//     const prereqPage = moduleProg.pageProgress[prereqId];
//     return prereqPage && prereqPage.status === PageStatus.COMPLETED;
//   });
// }

/**
 * Cập nhật learning streak
 */
function updateStreak(currentStreak: number, lastStudyDate: string | null): number {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  if (!lastStudyDate) return 1; // Lần đầu học

  if (lastStudyDate === today) return currentStreak; // Đã học hôm nay
  if (lastStudyDate === yesterday) return currentStreak + 1; // Học liên tiếp

  return 1; // Bị gián đoạn streak
}

// ═══════════════════════════════════════════════════════════════════════════
// STORE CREATION
// ═══════════════════════════════════════════════════════════════════════════

export const useLearningProgressStore = create<LearningProgressState & LearningProgressActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Bắt đầu một module mới
       * Reset tiến độ nếu đã học trước đó
       */
      startModule: (moduleId) => {
        const { moduleProgress } = get();
        const existingProgress = moduleProgress[moduleId];

        // Nếu đã hoàn thành, không cho phép học lại (có thể thay đổi rule này)
        if (existingProgress?.status === PageStatus.COMPLETED) {
          console.log(`Module ${moduleId} đã hoàn thành, không thể học lại`);
          return;
        }

        // Khởi tạo progress mới nếu chưa có
        if (!existingProgress) {
          const newProgress: ModuleProgress = {
            moduleId,
            status: PageStatus.IN_PROGRESS,
            pageProgress: {},
            totalTimeSpent: 0,
            averageScore: 0,
            startedAt: new Date()
          };

          set(state => ({
            currentModuleId: moduleId,
            currentPageId: null,
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: newProgress
            },
            lastStudyDate: new Date().toDateString(),
            currentStreak: updateStreak(state.currentStreak, state.lastStudyDate)
          }));
        } else {
          // Resume module đang học dở
          set(state => ({
            currentModuleId: moduleId,
            currentPageId: existingProgress.currentPageId || null,
            lastStudyDate: new Date().toDateString(),
            currentStreak: updateStreak(state.currentStreak, state.lastStudyDate)
          }));
        }
      },

      /**
       * Hoàn thành một module
       * Tính toán điểm trung bình và cập nhật stats
       */
      completeModule: (moduleId) => {
        const { moduleProgress } = get();
        const progress = moduleProgress[moduleId];

        if (!progress) return;

        const pages = Object.values(progress.pageProgress);
        const completedPages = pages.filter(p => p.status === PageStatus.COMPLETED);

        if (completedPages.length === 0) return;

        // Tính điểm trung bình
        const scoredPages = completedPages.filter(p => p.score !== undefined);
        const avgScore = scoredPages.length > 0
          ? scoredPages.reduce((sum, p) => sum + (p.score || 0), 0) / scoredPages.length
          : 0;

        const updatedProgress: ModuleProgress = {
          ...progress,
          status: PageStatus.COMPLETED,
          averageScore: avgScore,
          completedAt: new Date()
        };

        set(state => ({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: updatedProgress
          },
          totalModulesCompleted: state.totalModulesCompleted + 1,
          averageScore: (state.averageScore * state.totalModulesCompleted + avgScore) / (state.totalModulesCompleted + 1)
        }));
      },

      /**
       * Bắt đầu một page mới
       * Khởi tạo progress nếu chưa có
       */
      startPage: (moduleId, pageId) => {
        const { moduleProgress } = get();
        const progress = moduleProgress[moduleId];

        if (!progress) return;

        // Khởi tạo page progress nếu chưa có
        if (!progress.pageProgress[pageId]) {
          const newPageProgress: PageProgress = {
            pageId,
            status: PageStatus.IN_PROGRESS,
            timeSpent: 0,
            attempts: 0
          };

          set(state => ({
            currentPageId: pageId,
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: {
                ...progress,
                pageProgress: {
                  ...progress.pageProgress,
                  [pageId]: newPageProgress
                }
              }
            }
          }));
        } else {
          // Resume page đang học dở
          set({
            currentPageId: pageId
          });
        }
      },

      /**
       * Hoàn thành một page
       * Cập nhật điểm số và thời gian
       */
      completePage: (moduleId, pageId, score) => {
        const { moduleProgress } = get();
        const progress = moduleProgress[moduleId];

        if (!progress || !progress.pageProgress[pageId]) return;

        const pageProgress = progress.pageProgress[pageId];
        const updatedPageProgress: PageProgress = {
          ...pageProgress,
          status: PageStatus.COMPLETED,
          score: score !== undefined ? score : pageProgress.score,
          completedAt: new Date(),
          attempts: pageProgress.attempts + 1
        };

        set({
          moduleProgress: {
            ...get().moduleProgress,
            [moduleId]: {
              ...progress,
              pageProgress: {
                ...progress.pageProgress,
                [pageId]: updatedPageProgress
              }
            }
          }
        });
      },

      /**
       * Cập nhật thời gian học cho một page
       */
      updateTimeSpent: (moduleId, pageId, minutes) => {
        const { moduleProgress, totalStudyTime } = get();
        const progress = moduleProgress[moduleId];

        if (!progress || !progress.pageProgress[pageId]) return;

        const pageProgress = progress.pageProgress[pageId];
        const updatedPageProgress: PageProgress = {
          ...pageProgress,
          timeSpent: pageProgress.timeSpent + minutes
        };

        set(state => ({
          totalStudyTime: totalStudyTime + minutes,
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: {
              ...progress,
              totalTimeSpent: progress.totalTimeSpent + minutes,
              pageProgress: {
                ...progress.pageProgress,
                [pageId]: updatedPageProgress
              }
            }
          }
        }));
      },

      /**
       * Lấy progress percentage của một module
       */
      getModuleProgress: (moduleId) => {
        const { moduleProgress } = get();
        const progress = moduleProgress[moduleId];

        if (!progress) return 0;
        return calculateModuleProgress(progress);
      },

      /**
       * Lấy progress percentage của một chapter
       */
      getChapterProgress: () => {
        // Implementation sẽ được thêm sau khi có module data
        return 0;
      },

      /**
       * Lấy overall progress
       */
      getOverallProgress: () => {
        const { moduleProgress } = get();
        const modules = Object.values(moduleProgress);

        if (modules.length === 0) return 0;

        const totalProgress = modules.reduce((sum, mod) => sum + calculateModuleProgress(mod), 0);
        return totalProgress / modules.length;
      },

      /**
       * Lấy page tiếp theo
       */
      getNextPage: () => {
        // Implementation sẽ được thêm sau khi có module data
        return null;
      },

      /**
       * Lấy page trước đó
       */
      getPreviousPage: () => {
        // Implementation sẽ được thêm sau khi có module data
        return null;
      },

      /**
       * Kiểm tra xem page có thể truy cập được không
       */
      canAccessPage: () => {
        // Implementation sẽ được thêm sau khi có module data
        return true;
      },

      /**
       * Mở khóa chapter mới
       */
      unlockChapter: (chapter) => {
        const { unlockedChapters } = get();

        if (unlockedChapters.includes(chapter)) return;

        set(state => ({
          unlockedChapters: [...state.unlockedChapters, chapter].sort(),
          currentChapter: chapter
        }));
      },

      /**
       * Kiểm tra xem chapter có thể truy cập được không
       */
      canAccessChapter: (chapter) => {
        const { unlockedChapters } = get();
        return unlockedChapters.includes(chapter);
      },

      /**
       * Reset toàn bộ progress
       */
      resetProgress: () => {
        set(initialState);
      },

      /**
       * Export progress data
       */
      exportProgress: () => {
        const state = get();
        return {
          ...state,
          exportDate: new Date().toISOString()
        };
      },

      /**
       * Import progress data
       */
      importProgress: (data) => {
        // Validate data trước khi import
        if (!data || typeof data !== 'object') {
          console.error('Invalid progress data');
          return;
        }

        set(data);
      }
    }),
    {
      name: 'algoquest-learning-progress',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Chỉ lưu những field cần thiết
        currentModuleId: state.currentModuleId,
        currentPageId: state.currentPageId,
        moduleProgress: state.moduleProgress,
        totalStudyTime: state.totalStudyTime,
        totalModulesCompleted: state.totalModulesCompleted,
        averageScore: state.averageScore,
        currentStreak: state.currentStreak,
        lastStudyDate: state.lastStudyDate,
        unlockedChapters: state.unlockedChapters,
        currentChapter: state.currentChapter
      })
    }
  )
);

// ═══════════════════════════════════════════════════════════════════════════
// SELECTORS - HELPER HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook để lấy progress hiện tại
 */
export const useCurrentProgress = () => {
  const store = useLearningProgressStore();
  return {
    currentModuleId: store.currentModuleId,
    currentPageId: store.currentPageId,
    moduleProgress: store.currentModuleId ? store.moduleProgress[store.currentModuleId] : null
  };
};

/**
 * Hook để lấy stats tổng quát
 */
export const useLearningStats = () => {
  const store = useLearningProgressStore();
  return {
    totalStudyTime: store.totalStudyTime,
    totalModulesCompleted: store.totalModulesCompleted,
    averageScore: store.averageScore,
    currentStreak: store.currentStreak,
    overallProgress: store.getOverallProgress()
  };
};

/**
 * Hook để kiểm tra access
 */
export const useLearningAccess = () => {
  const store = useLearningProgressStore();

  return {
    canAccessChapter: (chapter: ChapterNumber) => store.canAccessChapter(chapter),
    canAccessModule: (moduleId: string) => store.moduleProgress[moduleId]?.status !== PageStatus.LOCKED,
    canAccessPage: (moduleId: string, pageId: string) => store.canAccessPage(moduleId, pageId),
    getModuleProgress: (moduleId: string) => store.getModuleProgress(moduleId)
  };
};