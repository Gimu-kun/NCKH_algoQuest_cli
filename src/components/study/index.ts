/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * STUDY MATERIALS COMPONENTS INDEX (MỤC LỤC COMPONENT HỌC TẬP)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - File này đóng vai trò là "Barrel File" hoặc "Public API" cho module `components/study`.
 * - Áp dụng Design Pattern: **Facade Pattern** (ở mức module import).
 * - Nó tập trung tất cả các exports từ các file con vào một điểm duy nhất, giúp việc import
 *   từ bên ngoài trở nên gọn gàng và dễ quản lý hơn.
 * 
 * 🏗️ KIẾN TRÚC MODULE:
 * Module này cung cấp toàn bộ giao diện cho hệ thống học tập (Study System), bao gồm:
 * 1. **Containers**: `LearningHub` (Trung tâm), `LearningInterface` (Giao diện học).
 * 2. **Pages**: Các trang nội dung cụ thể (Theory, Demo, Quiz, Practice, Summary).
 * 3. **Data & Types**: Dữ liệu và định nghĩa kiểu từ 5 chương kiến thức cốt lõi.
 * 
 * 🌐 PHẠM VI KIẾN THỨC (5 Chương):
 * - Chapter 1: Algorithm Complexity (Big O, Time/Space Analysis)
 * - Chapter 2: Sorting & Searching (Bubble, Merge, Quick, Binary Search)
 * - Chapter 3: Linked Lists (Singly, Doubly, Circular, Operations)
 * - Chapter 4: Stack & Queue (LIFO, FIFO, Applications)
 * - Chapter 5: Binary Search Tree (BST - Insert, Delete, Search, Traversals)
 * 
 * ✅ ƯU ĐIỂM:
 * - **Encapsulation (Tính đóng gói):** Che giấu cấu trúc thư mục nội bộ. Người dùng chỉ cần
 *   import từ `components/study` mà không cần biết file nằm ở `pages/TheoryPage.tsx` hay đâu.
 * - **Maintainability (Khả năng bảo trì):** Khi di chuyển file nội bộ, chỉ cần sửa file index này,
 *   không ảnh hưởng đến các file sử dụng component.
 * 
 * ❌ NHƯỢC ĐIỂM:
 * - **Bundle Size:** Nếu không cấu hình Tree Shaking tốt, có thể import thừa code không dùng.
 *   (Tuy nhiên với các bundler hiện đại như Vite/Webpack, vấn đề này đã được tối ưu).
 * 
 * @module StudyMaterialsComponents
 * @category Components/StudyMaterials
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. MAIN CONTAINER COMPONENTS (CÁC COMPONENT CHỨA CHÍNH)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LearningHub: Trang chủ của hệ thống học tập.
 * - Chức năng: Hiển thị danh sách chương/bài học, theo dõi tiến độ tổng quan.
 * - Vai trò: Entry point (điểm bắt đầu) cho user vào khu vực học tập.
 */
export { default as LearningHub } from './LearningHub';

/**
 * LearningInterface: Giao diện học tập chính (Learning Environment).
 * - Chức năng: Điều hướng giữa các trang bài học, hiển thị nội dung chi tiết.
 * - Vai trò: Container quản lý luồng học tập (Learning Flow).
 */
export { default as LearningInterface } from './LearningInterface';

// ═══════════════════════════════════════════════════════════════════════════
// 2. PAGE COMPONENTS (CÁC LOẠI TRANG HỌC TẬP)
// ═══════════════════════════════════════════════════════════════════════════

// TheoryPage: Trang lý thuyết (Markdown rendering, Interactive concepts)
export { default as TheoryPage } from './pages/TheoryPage';

// DemoPage: Trang minh họa thuật toán (Visualization, Animation)
export { default as DemoPage } from './pages/DemoPage';

// QuizPage: Trang trắc nghiệm (Evaluation, Instant feedback)
export { default as QuizPage } from './pages/QuizPage';

// PracticePage: Trang thực hành code (Code Editor, Test cases)
export { default as PracticePage } from './pages/PracticePage';

// SummaryPage: Trang tổng kết (Achievements, Progress update)
export { default as SummaryPage } from './pages/SummaryPage';

// ═══════════════════════════════════════════════════════════════════════════
// 3. DATA RE-EXPORTS (DỮ LIỆU THAM CHIẾU)
// ═══════════════════════════════════════════════════════════════════════════
// Export lại data để các component khác dễ dàng truy cập mà không cần import sâu.

export {
  // Dữ liệu nội dung của các chương
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  // Metadata và thông tin cấu trúc
  CHAPTER_INFOS,
  ALL_CHAPTERS,
  LEARNING_PATH,
  // Enums và Constants định nghĩa miền dữ liệu
  TimeComplexity,
  SortingCategory,
  ChapterNumber
} from '../../data/study_materials';

// ═══════════════════════════════════════════════════════════════════════════
// 4. TYPE DEFINITIONS (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════
// Re-export types để đảm bảo tính nhất quán (Type Consistency) trong toàn bộ module.

// Types liên quan đến Learning Progress (Tiến độ học tập)
export type {
  LearningPage,
  LearningModule,
  PageProgress,
  ModuleProgress,
  LearningProgressState,
  LearningProgressActions
} from '../../store/learningProgressStore';

// Types liên quan đến Content Structure (Cấu trúc nội dung)
export type {
  TheoryContent,
  ChapterInfo,
  ComplexityInfo,
  DemoReference,
  AlgorithmComparison
} from '../../data/study_materials/types';