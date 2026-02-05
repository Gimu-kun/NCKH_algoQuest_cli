/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DEMO PAGE - TRANG MINH HỌA TRỰC QUAN
 * (INTERACTIVE ALGORITHM VISUALIZATION)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 📌 MỤC ĐÍCH & Ý NGHĨA:
 * - Là trái tim của ứng dụng AlgoQuest, nơi biến các thuật toán trừu tượng thành hình ảnh động.
 * - Cung cấp môi trường tương tác (Sandbox) để người học thử nghiệm với dữ liệu của chính mình.
 * - Hỗ trợ đa dạng các loại thuật toán: Sorting, Searching, Graph, Tree, Linked List...
 * 
 * 🏗️ KIẾN TRÚC & PATTERNS:
 * 1. **Configuration-Driven Design**:
 *    - Sử dụng `VISUALIZATION_CONFIGS` để định nghĩa meta-data cho từng bài học.
 *    - Giúp dễ dàng thêm bài minh họa mới mà không cần sửa logic render chính.
 * 2. **Factory Pattern**:
 *    - Render component visualizer tương ứng dựa trên `config.type` (Sorting, Searching, Tree...).
 * 3. **Smart State Synchronization**:
 *    - Đồng bộ hóa input text (JSON) với state nội bộ của visualizer.
 *    - Sử dụng `useMemo` và `queueMicrotask` để tối ưu hiệu năng render khi data thay đổi.
 * 
 * 🛠️ TÍNH NĂNG NỔI BẬT:
 * - **Custom Input**: Cho phép nhập mảng tùy ý dưới dạng JSON.
 * - **Auto-Completion**: Tự động đánh dấu hoàn thành khi user tương tác xong (xem hết animation).
 * - **Responsive Controls**: Play/Pause/Reset/Speed control (tùy visualizer).
 * 
 * @component DemoPage
 * @category Components/StudyMaterials/Pages
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLearningProgressStore } from '../../../store/learningProgressStore';

// ═══════════════════════════════════════════════════════════════════════════
// IMPORT VISUALIZERS (CÁC THÀNH PHẦN HIỂN THỊ THUẬT TOÁN)
// ═══════════════════════════════════════════════════════════════════════════

import SortingVisualizer from '../../visualizations/sorting/SortingVisualizer';
import BinarySearchVisualizer from '../../visualizations/searching/BinarySearchVisualizer';
import LinkedListVisualizer from '../../visualizations/data-structures/LinkedListVisualizer';
import StackVisualizer from '../../visualizations/data-structures/StackVisualizer';
import QueueVisualizer from '../../visualizations/data-structures/QueueVisualizer';
import BSTVisualizer from '../../visualizations/data-structures/BSTVisualizer';

// Import Types
import type { SortingAlgorithmType } from '../../visualizations/types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ═══════════════════════════════════════════════════════════════════════════

interface DemoPageProps {
  moduleId: string;
  pageId: string;
  title: string;
  onComplete?: () => void;
}

interface VisualizationConfig {
  type: 'sorting' | 'searching' | 'data-structure' | 'graph' | 'tree';
  algorithm: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>; // Component visualizer tương ứng
  defaultData: number[];               // Dữ liệu mẫu ban đầu
  controls: {                          // Cấu hình các nút điều khiển cho phép hiển thị
    play: boolean;
    pause: boolean;
    step: boolean;
    reset: boolean;
    speed: boolean;
  };
}

interface ControlState {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number; // 0.5x, 1x, 2x
  currentStep: number;
  totalSteps: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUALIZATION CONFIGURATIONS (CẤU HÌNH CHO TỪNG BÀI HỌC)
// ═══════════════════════════════════════════════════════════════════════════
// Map pageId -> Config Object.
// Định nghĩa thuật toán nào sẽ được hiển thị cho trang nào.

const VISUALIZATION_CONFIGS: Record<string, VisualizationConfig> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1: ALGORITHM COMPLEXITY DEMOS
  // ═══════════════════════════════════════════════════════════════════════════
  'ch1-p3-demo-visual': {
    type: 'sorting',
    algorithm: 'bubble',
    component: SortingVisualizer,
    defaultData: [64, 34, 25, 12, 22, 11, 90, 88],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch1-p8-demo-comparison': {
    type: 'sorting',
    algorithm: 'bubble',
    component: SortingVisualizer,
    defaultData: [50, 40, 30, 20, 10],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch1-demo-visual': {
    type: 'sorting',
    algorithm: 'bubble',
    component: SortingVisualizer,
    defaultData: [64, 34, 25, 12, 22, 11, 90],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch1-demo-comparison': {
    type: 'sorting',
    algorithm: 'bubble',
    component: SortingVisualizer,
    defaultData: [50, 40, 30, 20, 10, 5],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2: SORTING & SEARCHING DEMOS
  // ═══════════════════════════════════════════════════════════════════════════
  // Bubble Sort
  'ch2-p2-demo-bubble': {
    type: 'sorting',
    algorithm: 'bubble',
    component: SortingVisualizer,
    defaultData: [64, 34, 25, 12, 22, 11, 90, 88],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch2-demo-bubble': {
    type: 'sorting',
    algorithm: 'bubble',
    component: SortingVisualizer,
    defaultData: [64, 34, 25, 12, 22, 11, 90],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Selection Sort
  'ch2-demo-selection': {
    type: 'sorting',
    algorithm: 'selection',
    component: SortingVisualizer,
    defaultData: [29, 10, 14, 37, 13, 5, 21],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Insertion Sort
  'ch2-demo-insertion': {
    type: 'sorting',
    algorithm: 'insertion',
    component: SortingVisualizer,
    defaultData: [12, 11, 13, 5, 6, 7, 22],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Merge Sort
  'ch2-demo-merge': {
    type: 'sorting',
    algorithm: 'merge',
    component: SortingVisualizer,
    defaultData: [38, 27, 43, 3, 9, 82, 10],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Quick SortDemo
  'ch2-p7-demo-quick': {
    type: 'sorting',
    algorithm: 'quick',
    component: SortingVisualizer,
    defaultData: [10, 80, 30, 90, 40, 50, 70],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch2-demo-quick': {
    type: 'sorting',
    algorithm: 'quick',
    component: SortingVisualizer,
    defaultData: [10, 80, 30, 90, 40, 50, 70],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Heap Sort
  'ch2-demo-heap': {
    type: 'sorting',
    algorithm: 'heap',
    component: SortingVisualizer,
    defaultData: [12, 11, 13, 5, 6, 7, 15, 9],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Shell Sort
  'ch2-demo-shell': {
    type: 'sorting',
    algorithm: 'shell',
    component: SortingVisualizer,
    defaultData: [23, 29, 15, 19, 31, 7, 9, 5],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Binary Search
  'ch2-p10-demo-binary': {
    type: 'searching',
    algorithm: 'binary-search',
    component: BinarySearchVisualizer,
    defaultData: [2, 3, 4, 10, 40, 45, 78, 89, 90, 100],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch2-demo-binary': {
    type: 'searching',
    algorithm: 'binary-search',
    component: BinarySearchVisualizer,
    defaultData: [2, 3, 4, 10, 40, 45, 78, 89, 90, 100],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  // Linear Search
  'ch2-demo-linear': {
    type: 'searching',
    algorithm: 'linear-search',
    component: BinarySearchVisualizer,
    defaultData: [64, 34, 25, 12, 22, 11, 90],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3: LINKED LIST DEMOS
  // ═══════════════════════════════════════════════════════════════════════════
  'ch3-p2-demo-operations': {
    type: 'data-structure',
    algorithm: 'linked-list',
    component: LinkedListVisualizer,
    defaultData: [1, 2, 3, 4, 5],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch3-demo-operations': {
    type: 'data-structure',
    algorithm: 'linked-list',
    component: LinkedListVisualizer,
    defaultData: [10, 20, 30, 40, 50],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch3-demo-singly': {
    type: 'data-structure',
    algorithm: 'singly-linked-list',
    component: LinkedListVisualizer,
    defaultData: [1, 2, 3, 4, 5],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch3-demo-doubly': {
    type: 'data-structure',
    algorithm: 'doubly-linked-list',
    component: LinkedListVisualizer,
    defaultData: [10, 20, 30, 40],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch3-demo-circular': {
    type: 'data-structure',
    algorithm: 'circular-linked-list',
    component: LinkedListVisualizer,
    defaultData: [1, 2, 3, 4],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch3-demo-reverse': {
    type: 'data-structure',
    algorithm: 'linked-list-reverse',
    component: LinkedListVisualizer,
    defaultData: [1, 2, 3, 4, 5],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4: STACK & QUEUE DEMOS
  // ═══════════════════════════════════════════════════════════════════════════
  'ch4-p2-demo-stack': {
    type: 'data-structure',
    algorithm: 'stack',
    component: StackVisualizer,
    defaultData: [10, 20, 30],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch4-demo-stack': {
    type: 'data-structure',
    algorithm: 'stack',
    component: StackVisualizer,
    defaultData: [10, 20, 30, 40],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch4-demo-stack-push-pop': {
    type: 'data-structure',
    algorithm: 'stack',
    component: StackVisualizer,
    defaultData: [5, 10, 15],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch4-p3-demo-queue': {
    type: 'data-structure',
    algorithm: 'queue',
    component: QueueVisualizer,
    defaultData: [10, 20, 30],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch4-demo-queue': {
    type: 'data-structure',
    algorithm: 'queue',
    component: QueueVisualizer,
    defaultData: [10, 20, 30, 40],
    controls: { play: true, pause: true, step: true, reset: true, speed: false }
  },
  'ch4-demo-queue-enqueue-dequeue': {
    type: 'data-structure',
    algorithm: 'queue',
    component: QueueVisualizer,
    defaultData: [5, 10, 15],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch4-demo-parentheses': {
    type: 'data-structure',
    algorithm: 'stack',
    component: StackVisualizer,
    defaultData: [],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5: BINARY SEARCH TREE DEMOS
  // ═══════════════════════════════════════════════════════════════════════════
  'ch5-p2-demo-traversal': {
    type: 'tree',
    algorithm: 'binary-tree',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-traversal': {
    type: 'tree',
    algorithm: 'binary-tree-traversal',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-p4-demo-bst': {
    type: 'tree',
    algorithm: 'bst',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-bst': {
    type: 'tree',
    algorithm: 'bst',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-insert': {
    type: 'tree',
    algorithm: 'bst-insert',
    component: BSTVisualizer,
    defaultData: [50, 30, 70],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-delete': {
    type: 'tree',
    algorithm: 'bst-delete',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-search': {
    type: 'tree',
    algorithm: 'bst-search',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-inorder': {
    type: 'tree',
    algorithm: 'bst-inorder',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-preorder': {
    type: 'tree',
    algorithm: 'bst-preorder',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  },
  'ch5-demo-postorder': {
    type: 'tree',
    algorithm: 'bst-postorder',
    component: BSTVisualizer,
    defaultData: [50, 30, 70, 20, 40, 60, 80],
    controls: { play: true, pause: true, step: true, reset: true, speed: true }
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (COMPONENT CHÍNH)
// ═══════════════════════════════════════════════════════════════════════════

export const DemoPage: React.FC<DemoPageProps> = ({
  moduleId,
  pageId,
  title,
  onComplete
}) => {
  // Global Store & Config Access
  const { updateTimeSpent } = useLearningProgressStore();
  const config = VISUALIZATION_CONFIGS[pageId];

  // Local State Management
  const [controlState, setControlState] = useState<ControlState>({
    isPlaying: false,
    isPaused: false,
    speed: 1,
    currentStep: 0,
    totalSteps: 10
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [localData, setLocalData] = useState<number[]>([]);
  const [searchTarget, setSearchTarget] = useState<number>(40);

  // Refs
  const completedRef = useRef(false);
  const initializedRef = useRef(false);

  // User Input State (giống AlgoLab)
  const [arrayInput, setArrayInput] = useState<string>('');
  const [targetInput, setTargetInput] = useState<string>('');
  const [vizKey, setVizKey] = useState<number>(0); // Key để force remount component visualizer

  // Tính toán initial data (dữ liệu ban đầu) cho visualizer từ config
  const initialData = useMemo(() => {
    return config ? [...config.defaultData] : [];
  }, [config]);

  /**
   * INITIALIZATION EFFECT
   * Khởi tạo dữ liệu visualization khi component mount hoặc initialData đổi.
   */
  useEffect(() => {
    if (!initializedRef.current || localData.length === 0) {
      initializedRef.current = true;

      const newTarget = initialData.length > 0
        ? initialData[Math.floor(Math.random() * initialData.length)]
        : 40;

      // Sử dụng queueMicrotask để update state sau frame hiện tại, tránh render loop
      queueMicrotask(() => {
        setLocalData(initialData);
        setSearchTarget(newTarget);
        // Sync input fields
        setArrayInput(JSON.stringify(initialData));
        setTargetInput(newTarget.toString());
      });
    }
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * LEARNING TIME TRACKING
   * Cập nhật thời gian học mỗi 30s.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      updateTimeSpent(moduleId, pageId, 0.5);
    }, 30000);

    return () => clearInterval(timer);
  }, [moduleId, pageId, updateTimeSpent]);

  /**
   * COMPLETION HANDLER
   * Xử lý khi user hoàn thành xem visualization.
   */
  const handleAutoComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      queueMicrotask(() => {
        setIsCompleted(true);
      });
      if (onComplete) {
        setTimeout(() => onComplete(), 1000);
      }
    }
  }, [onComplete]);

  /**
   * STEP TRACKING EFFECT
   * Theo dõi step hiện tại để auto-complete khi chạy hết animation.
   */
  const prevStepRef = useRef(controlState.currentStep);
  useEffect(() => {
    if (prevStepRef.current !== controlState.currentStep) {
      prevStepRef.current = controlState.currentStep;
      if (controlState.currentStep >= controlState.totalSteps && !completedRef.current) {
        queueMicrotask(() => handleAutoComplete());
      }
    }
  }, [controlState.currentStep, controlState.totalSteps, handleAutoComplete]);

  // Fallback UI nếu không có config
  if (!config) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fi fi-rr-exclamation text-4xl text-red-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy visualization</h3>
          <p className="text-gray-400">Visualization cho page này chưa được cài đặt</p>
        </div>
      </div>
    );
  }

  // --- Handlers cho Action Buttons ---

  const handleReset = () => {
    setControlState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0
    }));
    setLocalData([...config.defaultData]);
  };

  /**
   * RANDOM DATA GENERATOR
   * Tạo dữ liệu mẫu ngẫu nhiên mới để test visualizer.
   */
  const handleDataRegenerate = () => {
    // 1. Tạo mảng random
    const newData = Array.from({ length: config.defaultData.length }, () =>
      Math.floor(Math.random() * 100) + 1
    );

    // 2. Sort nếu cần (Search algorithm yêu cầu mảng sorted)
    if (config.type === 'searching' || config.algorithm.includes('binary')) {
      newData.sort((a, b) => a - b);
    }

    // 3. Chọn target random mới
    let newTarget = searchTarget;
    if (newData.length > 0) {
      const randomIndex = Math.floor(Math.random() * newData.length);
      newTarget = newData[randomIndex];
      setSearchTarget(newTarget);
    }

    // 4. Update state và reset viz
    setLocalData(newData);
    setArrayInput(JSON.stringify(newData));
    setTargetInput(newTarget.toString());
    setVizKey(prev => prev + 1); // Force re-mount để reset visualizer state
    handleReset();
  };

  /**
   * USER INPUT APPLIER
   * Parse JSON từ input text area và update visualizer.
   */
  const handleApplyInput = () => {
    try {
      const parsed = JSON.parse(arrayInput);
      // Validate input là mảng số
      if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')) {
        setLocalData(parsed);
        const target = parseInt(targetInput, 10);
        if (!isNaN(target)) {
          setSearchTarget(target);
        }
        setVizKey((prev) => prev + 1);
      }
    } catch (e) {
      // Invalid JSON - user thông minh nên UX chưa cần báo lỗi phức tạp :D
      console.error("Invalid JSON input", e);
    }
  };

  return (
    <div className="min-h-[600px] bg-gray-900 rounded-xl overflow-hidden">

      {/* Main Content Area - Split Layout (Input | Visualization) */}
      <div className="p-5 pt-4 overflow-hidden">
        <div className="flex gap-5">

          {/* LEFT COLUMN: CONTROL & INPUT PANEL */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-gray-800/50 rounded border border-gray-700/30 p-3">
              <div className="flex items-center gap-2 mb-3">
                <i className="fi fi-rr-terminal text-cyan-400 text-sm"></i>
                <span className="text-gray-300 text-sm font-medium">Dữ Liệu Đầu Vào</span>
              </div>

              {/* Data Input Area */}
              <div className="mb-3">
                <label className="text-gray-500 text-xs block mb-1">Mảng (JSON)</label>
                <textarea
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  placeholder="[1, 2, 3, 4, 5]"
                  className="w-full bg-gray-900/50 border border-gray-700/50 rounded px-3 py-2 text-sm text-white font-mono resize-none h-[100px]"
                  spellCheck={false}
                />
              </div>

              {/* Target Input (cho Search Algorithm) */}
              {config.type === 'searching' && (
                <div className="mb-3">
                  <label className="text-gray-500 text-xs block mb-1">Giá Trị Tìm Kiếm (Target)</label>
                  <input
                    type="number"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    placeholder="Target"
                    className="w-full bg-gray-900/50 border border-gray-700/50 rounded px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={handleApplyInput}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white text-base font-medium rounded-lg transition-colors"
                >
                  <i className="fi fi-rr-play-alt"></i>
                  Áp Dụng
                </button>
                <button
                  onClick={handleDataRegenerate}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white text-base font-medium rounded-lg transition-colors"
                >
                  <i className="fi fi-rr-shuffle"></i>
                  Reset
                </button>
              </div>

              {/* Statistics/Info */}
              <div className="mt-3 pt-3 border-t border-gray-700/30">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <i className="fi fi-rr-list text-xs"></i>
                  <span>Số phần tử:</span>
                  <span className="text-cyan-400 font-medium">{localData.length}</span>
                </div>
                {config.type === 'searching' && (
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <i className="fi fi-rr-bullseye text-xs"></i>
                    <span>Target:</span>
                    <span className="text-purple-400 font-medium">{searchTarget}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: VISUALIZATION CANVAS */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="bg-gray-800/30 rounded border border-gray-700/30 p-3 overflow-hidden">
              <div className="min-h-[360px] overflow-auto">
                <div className="w-full">
                  {/* Dynamic Component Rendering switch */}

                  {/* Sorting Visualizers */}
                  {config.type === 'sorting' && (
                    <SortingVisualizer
                      key={`sorting-${vizKey}`}
                      initialArray={localData}
                      algorithm={config.algorithm as SortingAlgorithmType}
                      title={title}
                      autoStart={false}
                      onComplete={() => {
                        setControlState(prev => ({
                          ...prev,
                          isPlaying: false,
                          currentStep: prev.totalSteps
                        }));
                        handleAutoComplete();
                      }}
                      onRegenerate={handleDataRegenerate}
                    />
                  )}

                  {/* Searching Visualizers */}
                  {config.type === 'searching' && (
                    <BinarySearchVisualizer
                      key={`search-${vizKey}`}
                      array={localData.slice().sort((a, b) => a - b)}
                      target={searchTarget}
                      title={title}
                      autoStart={false}
                      onComplete={() => {
                        setControlState(prev => ({
                          ...prev,
                          isPlaying: false,
                          currentStep: prev.totalSteps
                        }));
                        handleAutoComplete();
                      }}
                      onRegenerate={handleDataRegenerate}
                    />
                  )}

                  {/* Data Structures - Linked List */}
                  {config.type === 'data-structure' && config.algorithm.includes('linked') && (
                    <LinkedListVisualizer
                      key={`linkedlist-${vizKey}`}
                      initialItems={localData}
                      maxSize={10}
                      title={title}
                      showInfo={true}
                      onRegenerate={handleDataRegenerate}
                    />
                  )}

                  {/* Data Structures - Stack */}
                  {config.type === 'data-structure' && config.algorithm === 'stack' && (
                    <StackVisualizer
                      key={`stack-${vizKey}`}
                      initialItems={localData}
                      maxSize={10}
                      title={title}
                      showInfo={true}
                      onRegenerate={handleDataRegenerate}
                    />
                  )}

                  {/* Data Structures - Queue */}
                  {config.type === 'data-structure' && config.algorithm === 'queue' && (
                    <QueueVisualizer
                      key={`queue-${vizKey}`}
                      initialItems={localData}
                      maxSize={10}
                      title={title}
                      showInfo={true}
                      onRegenerate={handleDataRegenerate}
                    />
                  )}

                  {/* Tree Visualizers */}
                  {config.type === 'tree' && (
                    <BSTVisualizer
                      key={`bst-${vizKey}`}
                      initialValues={localData}
                      title={title}
                      showInfo={true}
                      onRegenerate={handleDataRegenerate}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="bg-gray-800/50 border-t border-gray-700/30 px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {isCompleted ? '✓ Hoàn thành' : 'Tương tác để hoàn thành'}
          </span>
          <button
            onClick={() => onComplete && onComplete()}
            disabled={!isCompleted}
            className={`px-3 py-1.5 rounded text-xs font-medium ${isCompleted
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            Tiếp tục →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;