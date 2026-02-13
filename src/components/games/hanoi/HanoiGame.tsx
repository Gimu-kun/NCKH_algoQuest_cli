/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HANOI GAME UI - THÁP HÀ NỘI (Interactive Game Component)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ CHI TIẾT & PHÂN TÍCH KỸ THUẬT (Detailed Description & Analysis)
 * ─────────────────────────────────────────────────────────────────────────────
 * Component này implement trò chơi Tháp Hà Nội (Tower of Hanoi) - một bài toán
 * kinh điển trong Khoa học Máy tính dùng để minh họa Đệ quy (Recursion).
 *
 * 1. MỤC ĐÍCH CHỨC NĂNG (Functional Purpose):
 *    - Cung cấp giao diện tương tác (Interactive UI) để người dùng giải bài toán.
 *    - Minh họa trực quan thuật toán giải (Auto-solve Visualizer).
 *    - Hỗ trợ gợi ý nước đi tối ưu (AI Hint).
 *
 * 2. CƠ CHẾ HOẠT ĐỘNG (Mechanism):
 *    - **State Representation**: Trạng thái game được mã hóa (Encoding) thành một số nguyên duy nhất.
 *      Mỗi đĩa được biểu diễn bởi 2 bit (00=Peg0, 01=Peg1, 10=Peg2).
 *      Điều này cho phép lưu trữ trạng thái cực kỳ gọn nhẹ (Bitwise Operations).
 *    - **Validation**: Mỗi nước đi được kiểm tra tính hợp lệ (Disk nhỏ trên Disk lớn) trước khi apply.
 *    - **Auto-solve**: Sử dụng thuật toán Breadth-First Search (BFS) để tìm đường đi ngắn nhất
 *      từ trạng thái hiện tại đến đích. Tại sao dùng BFS thay vì Đệ quy chuẩn?
 *      -> Vì người chơi có thể đang ở một trạng thái "lệch" khỏi đường đi tối ưu,
 *         BFS luôn tìm được đường về đích ngắn nhất từ BẤT KỲ trạng thái nào.
 *
 * 3. SO SÁNH THUẬT TOÁN (Algorithm Comparison):
 *    | Thuật toán | Use Case | Ưu điểm | Nhược điểm |
 *    |------------|----------|---------|------------|
 *    | Đệ quy (Recursive) | Giải từ đầu (Classic) | Code ngắn, dễ hiểu (3 dòng) | Chỉ chạy được từ trạng thái chuẩn (tất cả đĩa ở A) |
 *    | BFS (Breadth-First) | Hint / Auto-solve | Tìm đường từ mọi trạng thái | Tốn mem hơn (lưu queue), phức tạp hơn |
 *    | Iterative | Optimized solver | Không lo tràn stack | Khó code hơn đệ quy |
 *
 * 4. INTERFACE & UX:
 *    - Sử dụng `framer-motion` cho animation mượt mà (Spring physics).
 *    - Feedback visual rõ ràng (Highlight cọc, disable nút không hợp lệ).
 *    - Layout responsive (Grid system).
 *
 * 3. AUTO-SOLVE (Tự động giải):
 *    - Chạy lần lượt các bước BFS path (setInterval)
 *    - Minh họa thuật toán đang chạy
 *    - Người chơi có thể xem máy giải
 *
 * FLOW XỬ LÝ CLICK (Click Handling Flow)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. User click vào một peg
 * 2. handlePegClick(peg) được gọi
 * 3. Nếu chưa có selectedPeg:
 *    - Check peg có disk không (pegs[peg].length > 0)
 *    - Có: setSelectedPeg(peg)
 *    - Không: không làm gì
 * 4. Nếu đã có selectedPeg:
 *    - Thử applyMove(encoding, disks, {from: selectedPeg, to: peg})
 *    - Nếu valid: setEncoding(next), setMoves(m+1), clear selection
 *    - Nếu invalid: clear selection (không move)
 *
 * KIẾN TRÚC STATE (State Architecture)
 * ─────────────────────────────────────────────────────────────────────────────
 * - encoding (number): trạng thái game encoded (ternary)
 * - moves (number): số bước đã đi
 * - selectedPeg (PegIndex | null): cọc đang được chọn
 * - hintMove ({from, to} | null): gợi ý bước tiếp
 * - autoSolving (boolean): đang auto-solve hay không
 * - finishedAt (number | null): timestamp khi hoàn thành
 * - nowTick (number): current time cho timer display
 *
 * DERIVED STATE (useMemo):
 * - pegs: encodingToPegs(encoding) - cho UI render
 * - completed: isGoalEncoding(encoding) - đã win chưa
 * - remaining: getShortestRemainingMoves(encoding) - số bước tối ưu còn lại
 * - elapsedMs: thời gian đã chơi
 *
 * KỸ THUẬT SỬ DỤNG (Techniques Used)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Pure Engine Pattern:
 *    - Logic game (encoding, validation, solving) tách khỏi UI
 *    - UI chỉ gọi engine functions
 *    - Dễ test, reusable cho multiplayer
 *
 * 2. Derived State (useMemo):
 *    - pegs/completed/remaining tính từ encoding
 *    - Chỉ recompute khi dependencies thay đổi
 *    - Performance tốt hơn tính trong render
 *
 * 3. Effect Separation:
 *    - Timer effect riêng
 *    - Progress callback effect riêng
 *    - Auto-solve effect riêng
 *    - Dễ reason about lifecycle
 *
 * 4. Framer Motion Animation:
 *    - layout prop cho smooth disk transitions
 *    - whileHover/whileTap cho button feedback
 *    - Spring physics cho natural feel
 *
 * SO SÁNH KIẾN TRÚC (Architecture Comparison)
 * ─────────────────────────────────────────────────────────────────────────────
 * | Approach          | Pros                    | Cons                   |
 * |-------------------|-------------------------|------------------------|
 * | Local state (now) | Simple, self-contained  | Hard to persist        |
 * | Global store      | Persist, share state    | More boilerplate       |
 * | URL state         | Shareable, bookmarkable | Complex encoding       |
 * | Canvas rendering  | Smooth animation        | More code, less React  |
 *
 * ƯU ĐIỂM THIẾT KẾ HIỆN TẠI (Pros of Current Design)
 * - Tách biệt engine và UI (testability)
 * - Local state đơn giản cho single-player
 * - Props interface rõ ràng cho multiplayer integration
 * - onProgress callback cho sync với parent/store
 *
 * NHƯỢC ĐIỂM (Cons)
 * - Không persist khi refresh (chấp nhận được cho game)
 * - Auto-solve có thể bị desync nếu nhiều effects
 *
 * @component HanoiGame
 * @category Games/ThapHaNoi
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PegIndex } from './hanoiEngine';
import {
  applyMove,
  encodingToPegs,
  getShortestRemainingMoves,
  isGoalEncoding,
  solveHanoiBfs
} from './hanoiEngine';
import './HanoiGame.css';

/* =============================================================================
   TYPE DEFINITIONS - Định nghĩa kiểu
   ============================================================================= */

/**
 * HanoiGameProgress - Trạng thái tiến trình của game
 *
 * CHỨC NĂNG (Purpose):
 * Interface dùng cho callback onProgress để sync với parent component
 * hoặc multiplayer store.
 *
 * USAGE (Cách sử dụng):
 * - Parent nhận progress và broadcast cho other players
 * - Hiển thị trên scoreboard
 */
export interface HanoiGameProgress {
  encoding: number;      // State hiện tại
  moves: number;         // Số bước đã đi
  completed: boolean;    // Đã hoàn thành chưa
  finishedAt: number | null; // Timestamp hoàn thành
}

/**
 * HanoiGameProps - Props cho component
 *
 * CHỨC NĂNG (Purpose):
 * Interface định nghĩa các props component nhận.
 *
 * PROPS:
 * - disks: số đĩa (độ khó)
 * - startedAt: timestamp bắt đầu (cho timer)
 * - disabled: vô hiệu hóa tương tác (ví dụ khi spectating)
 * - onProgress: callback khi có thay đổi (cho multiplayer sync)
 */
export interface HanoiGameProps {
  disks: number;
  startedAt: number | null;
  disabled?: boolean;
  onProgress?: (progress: HanoiGameProgress) => void;
}

/* =============================================================================
   HELPER FUNCTIONS - Hàm tiện ích
   ============================================================================= */

/**
 * formatTime - Format milliseconds thành MM:SS
 *
 * CHỨC NĂNG (Purpose):
 * Hiển thị thời gian chơi theo format dễ đọc.
 *
 * THUẬT TOÁN (Algorithm):
 * 1. Chuyển ms -> seconds (Math.floor)
 * 2. Tính phút = floor(seconds / 60)
 * 3. Tính giây = seconds % 60
 * 4. Pad với 0 nếu < 10
 *
 * @param ms - Thời gian tính bằng milliseconds
 * @returns String format "MM:SS"
 */
const formatTime = (ms: number) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/* =============================================================================
   MAIN COMPONENT - Component chính
   ============================================================================= */

/**
 * HanoiGame - Interactive Tower of Hanoi game
 *
 * CHỨC NĂNG (Purpose):
 * Component React render giao diện game và xử lý tương tác người chơi.
 *
 * RENDER STRUCTURE:
 * .hanoi-game
 * ├── .hanoi-header (title + stats + action buttons)
 * ├── .hanoi-board (3 pegs với disks)
 * └── .hanoi-footer (rules + status)
 */
export const HanoiGame: React.FC<HanoiGameProps> = ({
  disks,
  startedAt,
  disabled = false,
  onProgress
}) => {
  /* ===========================================================================
     STATE MANAGEMENT - Quản lý trạng thái
     =========================================================================== */

  /**
   * encoding - Trạng thái game được mã hóa
   *
   * GIÁ TRỊ (Values):
   * - 0: initial state (tất cả đĩa ở peg 0)
   * - Thay đổi sau mỗi move hợp lệ
   *
   * TẠI SAO DÙNG ENCODING? (Why Encoding?)
   * - Compact representation (1 số thay vì nested array)
   * - Dễ compare, hash, serialize
   * - Engine functions work với encoding
   */
  const [encoding, setEncoding] = useState<number>(0);

  /**
   * moves - Số bước đã đi
   *
   * TRACKING:
   * - Bắt đầu từ 0
   * - Tăng 1 mỗi khi applyMove thành công
   * - Dùng để so sánh với optimal (2^n - 1)
   */
  const [moves, setMoves] = useState<number>(0);

  /**
   * selectedPeg - Cọc đang được chọn làm nguồn
   *
   * FLOW:
   * - null: chưa chọn gì
   * - 0/1/2: đã chọn peg này làm source
   * - Click tiếp sẽ attempt move đến peg đó
   */
  const [selectedPeg, setSelectedPeg] = useState<PegIndex | null>(null);

  /**
   * hintMove - Nước đi gợi ý
   *
   * DISPLAY:
   * - from: highlight vàng
   * - to: highlight xanh dương
   * - Clear khi user move hoặc reset
   */
  const [hintMove, setHintMove] = useState<{ from: PegIndex; to: PegIndex } | null>(null);

  /**
   * autoSolving - Đang tự động giải
   *
   * BEHAVIOR:
   * - true: setInterval chạy từng bước BFS
   * - false: người chơi tự điều khiển
   * - Disable các nút khác khi autoSolving
   */
  const [autoSolving, setAutoSolving] = useState(false);

  /**
   * finishedAt - Timestamp hoàn thành
   *
   * PURPOSE:
   * - Stop timer khi game xong
   * - Gửi trong onProgress cho leaderboard
   */
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  /**
   * nowTick - Current timestamp cho timer
   *
   * UPDATE:
   * - Interval 250ms update
   * - Dùng để tính elapsedMs
   */
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  /* ===========================================================================
     DERIVED STATE - Trạng thái tính toán
     
     Tại sao dùng useMemo?
     - Tránh tính lại mỗi render
     - Chỉ recalculate khi dependencies thay đổi
     - Performance optimization cho complex calculations
     =========================================================================== */

  /**
   * pegs - Mảng 3 cọc với các đĩa
   *
   * FORMAT: pegs[pegIndex] = [disk sizes from bottom to top]
   * USAGE: Render từng peg và disks trong đó
   */
  const pegs = useMemo(() => encodingToPegs(encoding, disks), [encoding, disks]);

  /**
   * completed - Đã hoàn thành chưa
   *
   * CHECK: isGoalEncoding kiểm tra tất cả đĩa ở peg 2
   */
  const completed = useMemo(() => isGoalEncoding(encoding, disks, 2), [encoding, disks]);

  /**
   * remaining - Số bước tối ưu còn lại
   *
   * DISPLAY: "còn tối ưu: X bước"
   * Giúp người chơi biết họ đi có tối ưu không
   */
  const remaining = useMemo(() => getShortestRemainingMoves(encoding, disks, 2), [encoding, disks]);

  /**
   * elapsedMs - Thời gian đã chơi (milliseconds)
   *
   * CALCULATION:
   * - Nếu chưa start: 0
   * - Nếu chưa finish: nowTick - startedAt
   * - Nếu đã finish: finishedAt - startedAt
   */
  const elapsedMs = useMemo(() => {
    if (!startedAt) return 0;
    const end = finishedAt ?? nowTick;
    return Math.max(0, end - startedAt);
  }, [startedAt, finishedAt, nowTick]);

  /* ===========================================================================
     EFFECTS - Các side effects
     =========================================================================== */

  /**
   * Timer Effect - Cập nhật nowTick định kỳ
   *
   * TRIGGER: Khi startedAt có giá trị
   * INTERVAL: 250ms (4 lần/giây cho smooth display)
   * CLEANUP: Clear interval khi unmount hoặc startedAt thay đổi
   */
  useEffect(() => {
    if (!startedAt) return;
    const timer = window.setInterval(() => setNowTick(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  /**
   * Progress Callback Effect - Gọi onProgress khi có thay đổi
   *
   * TRIGGER: Khi encoding/moves/completed/finishedAt thay đổi
   * PURPOSE: Sync state với parent (multiplayer scoreboard)
   *
   * TẠI SAO TÁCH EFFECT? (Why Separate Effect?)
   * - Separation of concerns
   * - Dễ debug và trace data flow
   * - Không ảnh hưởng đến game logic
   */
  useEffect(() => {
    if (!onProgress) return;
    onProgress({ encoding, moves, completed, finishedAt });
  }, [encoding, moves, completed, finishedAt, onProgress]);

  /**
   * Completion Effect - Set finishedAt khi hoàn thành
   *
   * TRIGGER: Khi completed chuyển từ false -> true
   * GUARD: Chỉ set 1 lần (check finishedAt null)
   */
  useEffect(() => {
    if (!completed) return;
    if (finishedAt) return; // Already finished
    setFinishedAt(Date.now());
  }, [completed, finishedAt]);

  /**
   * Auto-Solve Effect - Tự động thực hiện các bước giải
   *
   * TRIGGER: Khi autoSolving = true
   *
   * THUẬT TOÁN (Algorithm):
   * 1. Lấy BFS path từ state hiện tại
   * 2. Nếu path rỗng (đã ở goal): stop
   * 3. setInterval 260ms: thực hiện từng move
   * 4. Dừng khi hết path hoặc có lỗi
   *
   * TẠI SAO 260ms? (Why 260ms?)
   * - Đủ chậm để người xem thấy từng bước
   * - Đủ nhanh để không nhàm chán
   * - Match với animation duration của framer-motion
   *
   * CLEANUP:
   * - Clear interval khi autoSolving = false
   * - Clear khi component unmount
   */
  useEffect(() => {
    if (!autoSolving) return;
    if (disabled) return;

    // Lấy shortest path từ state hiện tại
    const path = solveHanoiBfs(encoding, disks, 2);
    if (path.length === 0) {
      setAutoSolving(false);
      return;
    }

    let index = 0;
    let current = encoding;

    const stepTimer = window.setInterval(() => {
      const mv = path[index];
      const next = applyMove(current, disks, mv);

      if (next === null) {
        // Should not happen với BFS path, nhưng safety check
        window.clearInterval(stepTimer);
        setAutoSolving(false);
        return;
      }

      current = next;
      setEncoding(next);
      setMoves((m) => m + 1);
      setHintMove(null);
      setSelectedPeg(null);

      index += 1;
      if (index >= path.length) {
        window.clearInterval(stepTimer);
        setAutoSolving(false);
      }
    }, 260);

    return () => window.clearInterval(stepTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSolving]);

  /* ===========================================================================
     EVENT HANDLERS - Xử lý sự kiện
     =========================================================================== */

  /**
   * reset - Reset game về trạng thái ban đầu
   *
   * ACTIONS:
   * - encoding = 0 (all disks on peg 0)
   * - moves = 0
   * - Clear selection, hint, autoSolving, finishedAt
   *
   * DISABLED WHEN:
   * - disabled prop = true
   * - autoSolving = true (đang chạy auto)
   */
  const reset = () => {
    if (disabled) return;
    setEncoding(0);
    setMoves(0);
    setSelectedPeg(null);
    setHintMove(null);
    setAutoSolving(false);
    setFinishedAt(null);
  };

  /**
   * computeHint - Tính và hiển thị gợi ý
   *
   * THUẬT TOÁN (Algorithm):
   * 1. Chạy BFS từ state hiện tại
   * 2. Lấy move đầu tiên trong path
   * 3. Set hintMove để highlight trên UI
   *
   * TẠI SAO BFS CHO HINT? (Why BFS for Hint?)
   * - Recursive solution chỉ works từ initial state
   * - BFS works từ BẤT KỲ state
   * - Người chơi có thể đi sai đường, BFS vẫn chỉ đúng
   */
  const computeHint = () => {
    const path = solveHanoiBfs(encoding, disks, 2);
    setHintMove(path[0] ?? null);
  };

  /**
   * handlePegClick - Xử lý click vào cọc
   *
   * FLOW LOGIC:
   * ─────────────────────────────────────────────────────
   * 1. Guard clauses:
   *    - disabled/autoSolving: ignore
   *    - completed: ignore
   *
   * 2. Nếu chưa có selectedPeg:
   *    - Check peg này có disk không
   *    - Có: select làm source
   *    - Không: ignore
   *
   * 3. Nếu đã có selectedPeg:
   *    - Thử move từ selected -> clicked peg
   *    - Valid: apply move, update state
   *    - Invalid: clear selection
   *
   * @param peg - PegIndex được click
   */
  const handlePegClick = (peg: PegIndex) => {
    // Guards
    if (disabled || autoSolving) return;
    if (completed) return;

    // Case 1: Chưa có source
    if (selectedPeg === null) {
      const hasDisk = pegs[peg].length > 0;
      if (hasDisk) setSelectedPeg(peg);
      return;
    }

    // Case 2: Đã có source, thử move
    const from = selectedPeg;
    const to = peg;
    const next = applyMove(encoding, disks, { from, to });

    if (next !== null) {
      // Move thành công
      setEncoding(next);
      setMoves((m) => m + 1);
      setSelectedPeg(null);
      setHintMove(null); // Clear hint khi đã move
      return;
    }

    // Move thất bại (invalid), clear selection
    setSelectedPeg(null);
  };

  /* ===========================================================================
     RENDER - Hiển thị UI
     =========================================================================== */

  // Safety check for disks
  const safeDisks = Math.max(3, disks || 3);

  return (
    <div
      className="hanoi-game"
      style={{
        // Ensure container has dimension even if CSS fails
        minHeight: '300px',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* ===== HEADER: Title, Stats, Actions ===== */}
      <div className="hanoi-header">
        <div className="hanoi-title">
          <h2>
            <i className="fi fi-rr-triangle"></i> Tháp Hà Nội
          </h2>

          {/* Stats display */}
          <div className="hanoi-sub">
            <span><i className="fi fi-rr-layer-group"></i> {disks} đĩa</span>
            <span><i className="fi fi-rr-arrows-repeat"></i> {moves} bước</span>
            <span><i className="fi fi-rr-flag"></i> còn tối ưu: {remaining}</span>
            {startedAt && (
              <span><i className="fi fi-rr-clock"></i> {formatTime(elapsedMs)}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="hanoi-actions">
          <button
            className="hanoi-btn"
            onClick={computeHint}
            disabled={disabled || completed || autoSolving}
          >
            <i className="fi fi-rr-lightbulb"></i> Gợi ý
          </button>
          <button
            className="hanoi-btn"
            onClick={() => setAutoSolving(true)}
            disabled={disabled || completed || autoSolving}
          >
            <i className="fi fi-rr-play"></i> Auto
          </button>
          <button
            className="hanoi-btn secondary"
            onClick={reset}
            disabled={disabled || autoSolving}
          >
            <i className="fi fi-rr-refresh"></i> Reset
          </button>
        </div>
      </div>

      {/* ===== GAME BOARD: 3 Pegs ===== */}
      <div className="hanoi-board">
        {([0, 1, 2] as PegIndex[]).map((peg) => {
          // Determine peg state for styling
          const isSelected = selectedPeg === peg;
          const isHintFrom = hintMove?.from === peg;
          const isHintTo = hintMove?.to === peg;
          const hintClass = isHintFrom ? 'hint-from' : isHintTo ? 'hint-to' : '';

          return (
            <motion.button
              key={peg}
              className={`hanoi-peg ${isSelected ? 'selected' : ''} ${hintClass}`}
              onClick={() => handlePegClick(peg)}
              whileHover={disabled ? {} : { scale: 1.01 }}
              whileTap={disabled ? {} : { scale: 0.99 }}
              type="button"
            >
              {/* Peg label (A, B, C) */}
              <div className="hanoi-peg-label">
                {peg === 0 ? 'A' : peg === 1 ? 'B' : 'C'}
              </div>

              {/* Decorative elements */}
              <div className="hanoi-rod" />
              <div className="hanoi-base" />

              {/* Disks stack */}
              <div className="hanoi-disks">
                {pegs[peg].map((disk) => {
                  // Tính width dựa trên disk size
                  // Công thức: 28 + (disk/safeDisks) * 140
                  const width = 28 + (disk / safeDisks) * 140;

                  return (
                    <motion.div
                      key={disk}
                      className="hanoi-disk"
                      style={{
                        width: `${width}px`,
                        // Gradient từ mint đến cyan
                        background: `linear-gradient(135deg, rgba(78, 204, 163, 0.9), rgba(52, 152, 219, 0.85))`
                      }}
                      layout // Enable framer-motion layout animation
                      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                    >
                      {disk}
                    </motion.div>
                  );
                })}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ===== FOOTER: Rules & Status ===== */}
      <div className="hanoi-footer">
        <div className="hanoi-rule">
          <i className="fi fi-rr-info"></i>
          Luật: chỉ chuyển 1 đĩa/lần, không đặt đĩa lớn lên đĩa nhỏ.
        </div>
        <div className={`hanoi-status ${completed ? 'done' : ''}`}>
          {completed ? (
            <>
              <i className="fi fi-rr-trophy"></i> Hoàn thành!
            </>
          ) : (
            <>
              <i className="fi fi-rr-hand-pointer"></i> Chọn cọc nguồn rồi chọn cọc đích.
            </>
          )}
        </div>
      </div>
    </div>
  );
};

