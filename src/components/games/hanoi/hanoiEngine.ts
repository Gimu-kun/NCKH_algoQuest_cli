/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HANOI ENGINE - THÁP HÀ NỘI (Tower of Hanoi)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Ý NGHĨA BÀI TOÁN (Problem Meaning)
 * ─────────────────────────────────────────────────────────────────────────────
 * Có N đĩa (disks) kích thước khác nhau xếp trên cọc A (peg 0).
 * Mục tiêu: chuyển tất cả sang cọc C (peg 2) theo luật:
 *   1) Mỗi lần chỉ chuyển 1 đĩa (single move).
 *   2) Không được đặt đĩa lớn lên trên đĩa nhỏ (size constraint).
 *
 * ĐÂY LÀ BÀI TOÁN ĐỆ QUY (Recursion) KINH ĐIỂN:
 * - Công thức chuẩn: T(n) = 2*T(n-1) + 1 => T(n) = 2^n - 1 (optimal moves)
 * - Với n = 5 đĩa => cần tối thiểu 31 bước
 * - Với n = 8 đĩa => cần tối thiểu 255 bước
 *
 * LỊCH SỬ (History):
 * - Được phát minh bởi Édouard Lucas (1883, Pháp)
 * - Dựa trên truyền thuyết đền Benares (Ấn Độ)
 *
 * TẠI SAO CẦN ENGINE RIÊNG? (Why Separate Engine?)
 * ─────────────────────────────────────────────────────────────────────────────
 * - UI chỉ nên render + bắt sự kiện (separation of concerns).
 * - Engine thuần (pure functions) giúp test dễ, tái sử dụng cho multiplayer.
 * - Không có side effects => predictable, dễ debug.
 *
 * 2 CÁCH GIẢI CHÍNH (Two Main Algorithms)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1) RECURSIVE CANONICAL SOLUTION (Giải đệ quy chuẩn):
 *    - Ý tưởng: để chuyển n đĩa từ A -> C:
 *      a) Chuyển (n-1) đĩa trên cùng từ A -> B (đĩa phụ)
 *      b) Chuyển đĩa lớn nhất từ A -> C
 *      c) Chuyển (n-1) đĩa từ B -> C
 *    - Time complexity: O(2^n)
 *    - Space complexity: O(n) (call stack depth)
 *    - Ưu: code ngắn gọn, đúng bản chất đệ quy.
 *    - Nhược: chỉ works từ trạng thái ban đầu (all disks on peg 0).
 *
 * 2) BFS SHORTEST PATH (Đường đi ngắn nhất bằng BFS):
 *    - Ý tưởng: coi mỗi configuration là 1 node trong graph
 *    - Dùng BFS để tìm đường ngắn nhất từ state hiện tại -> goal state
 *    - Mỗi trạng thái = vị trí của từng disk trên 3 cọc => 3^n states
 *    - Time complexity: O(3^n) worst case nhưng thường nhanh hơn do pruning
 *    - Space complexity: O(3^n) cho visited set
 *    - Ưu: tìm được số bước tối ưu từ BẤT KỲ trạng thái nào
 *    - Nhược: memory tăng theo 3^n, chỉ practical với n <= 10
 *
 * SO SÁNH VỚI CÁC KỸ THUẬT KHÁC (Comparison with Other Techniques)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * - DFS/Backtracking:
 *   ❌ Không đảm bảo tối ưu (có thể lạc vào nhánh dài)
 *   ✅ Memory thấp hơn BFS
 *
 * - A* Search:
 *   ✅ Nhanh hơn BFS nếu heuristic tốt
 *   ❌ Cần thiết kế heuristic phù hợp
 *   ❌ Code phức tạp hơn
 *
 * - Iterative Gray-code:
 *   ✅ Rất elegant, O(1) per move không cần lưu đường đi
 *   ❌ Chỉ works từ trạng thái chuẩn, không dùng được cho "hint"
 *
 * - Dynamic Programming:
 *   ❌ Không phù hợp vì không có overlapping subproblems theo nghĩa cổ điển
 *
 * STATE ENCODING (Mã hóa trạng thái)
 * ─────────────────────────────────────────────────────────────────────────────
 * Dùng số base-3 (ternary):
 * - Mỗi disk có thể ở 1 trong 3 pegs (0, 1, 2)
 * - N disks => encoding là số từ 0 đến 3^N - 1
 * - Ví dụ N=3: encoding = 17 = 122(base3) => disk1 ở peg2, disk2 ở peg2, disk3 ở peg1
 *
 * Ưu điểm encoding:
 * - State nhỏ gọn (1 số nguyên thay vì array)
 * - Dễ hash cho BFS visited set
 * - Dễ serialize cho multiplayer sync
 *
 * @module hanoiEngine
 * @category Games/Algorithms
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/* =============================================================================
   TYPE DEFINITIONS - Định nghĩa kiểu dữ liệu
   ============================================================================= */

/**
 * PegIndex - Chỉ số của cọc (0=A, 1=B, 2=C)
 *
 * CHỨC NĂNG (Purpose):
 * Type union giới hạn giá trị chỉ có thể là 0, 1, hoặc 2.
 * Giúp TypeScript catch lỗi khi truyền sai giá trị.
 */
export type PegIndex = 0 | 1 | 2;

/**
 * HanoiMove - Một nước đi
 *
 * CHỨC NĂNG (Purpose):
 * Đại diện cho một nước đi: chuyển đĩa từ cọc `from` sang cọc `to`.
 *
 * LƯU Ý (Note):
 * Không cần specify disk nào vì luôn chuyển đĩa top của cọc nguồn.
 */
export interface HanoiMove {
  from: PegIndex;
  to: PegIndex;
}

/* =============================================================================
   HELPER FUNCTIONS - Các hàm tiện ích
   ============================================================================= */

/**
 * pow3 - Tính 3 lũy thừa n
 *
 * CHỨC NĂNG (Purpose):
 * Tính nhanh 3^n dùng cho encoding/decoding.
 *
 * TẠI SAO KHÔNG DÙNG Math.pow()? (Why not Math.pow?)
 * - 3 ** n là operator, hơi nhanh hơn function call
 * - Modern JS engines optimize ** rất tốt
 *
 * @param n - Số mũ
 * @returns 3^n
 */
export const pow3 = (n: number) => 3 ** n;

/**
 * clampDisks - Giới hạn số đĩa trong khoảng hợp lệ
 *
 * CHỨC NĂNG (Purpose):
 * Đảm bảo số đĩa nằm trong [1, 12] để tránh:
 * - n < 1: không có gì để chơi
 * - n > 12: 3^12 = 531441 states, có thể gây lag
 *
 * KỸ THUẬT (Technique):
 * Dùng Math.max/min chain để clamp value.
 *
 * @param disks - Số đĩa input
 * @returns Số đĩa đã được clamp
 */
const clampDisks = (disks: number) => Math.max(1, Math.min(12, Math.floor(disks)));

/* =============================================================================
   ENCODING/DECODING FUNCTIONS - Các hàm mã hóa/giải mã
   ============================================================================= */

/**
 * createInitialEncoding - Tạo encoding cho trạng thái ban đầu
 *
 * CHỨC NĂNG (Purpose):
 * Trạng thái ban đầu: tất cả đĩa ở peg 0.
 * Encoding = 0 vì 000...0 (base 3) = 0 (base 10).
 *
 * CHỨNG MINH (Proof):
 * Mỗi digit ternary = 0 (peg 0) => encoding = 0*3^0 + 0*3^1 + ... = 0
 *
 * @param disks - Số đĩa
 * @returns 0 (initial state encoding)
 */
export const createInitialEncoding = (disks: number) => {
  clampDisks(disks); // validate input
  return 0;
};

/**
 * isGoalEncoding - Kiểm tra xem đã đạt trạng thái đích chưa
 *
 * CHỨC NĂNG (Purpose):
 * Goal state: tất cả đĩa ở goalPeg (mặc định là peg 2 = cọc C).
 *
 * THUẬT TOÁN (Algorithm):
 * 1. Duyệt qua từng "digit" ternary của encoding
 * 2. Nếu bất kỳ digit nào != goalPeg => return false
 * 3. Nếu tất cả đều = goalPeg => return true
 *
 * BƯỚC FLOW (Step-by-step):
 * - Ví dụ: N=3, goalPeg=2, encoding muốn = 222(base3) = 26(base10)
 * - Loop: extract digit bằng x % 3, rồi x = floor(x/3)
 *
 * COMPLEXITY:
 * - Time: O(n) với n là số đĩa
 * - Space: O(1)
 *
 * @param encoding - State hiện tại
 * @param disks - Số đĩa
 * @param goalPeg - Cọc đích (mặc định 2)
 * @returns true nếu đã hoàn thành
 */
export const isGoalEncoding = (encoding: number, disks: number, goalPeg: PegIndex = 2) => {
  const n = clampDisks(disks);
  let x = encoding;

  // Duyệt qua từng disk (từ nhỏ đến lớn)
  for (let i = 0; i < n; i += 1) {
    const peg = (x % 3) as PegIndex; // Lấy digit cuối cùng (peg của disk i+1)
    if (peg !== goalPeg) return false; // Có disk chưa ở goalPeg
    x = Math.floor(x / 3); // Dịch sang digit tiếp theo
  }

  return true;
};

/**
 * decodeDiskPeg - Giải mã encoding thành mảng peg của từng disk
 *
 * CHỨC NĂNG (Purpose):
 * Chuyển đổi từ số encoding sang mảng diskPeg[i] = peg của disk (i+1).
 *
 * OUTPUT FORMAT:
 * - diskPeg[0] = peg của disk 1 (nhỏ nhất)
 * - diskPeg[1] = peg của disk 2
 * - ...
 * - diskPeg[n-1] = peg của disk n (lớn nhất)
 *
 * THUẬT TOÁN (Algorithm):
 * Tương tự chuyển số từ base 10 sang base 3:
 * - digit[i] = x % 3
 * - x = floor(x / 3)
 *
 * VÍ DỤ (Example):
 * N=3, encoding=17 = 1*9 + 2*3 + 2*1 = 122(base3)
 * => diskPeg = [2, 2, 1] (disk1 ở peg2, disk2 ở peg2, disk3 ở peg1)
 *
 * @param encoding - State encoded
 * @param disks - Số đĩa
 * @returns Mảng peg index của từng disk
 */
export const decodeDiskPeg = (encoding: number, disks: number): PegIndex[] => {
  const n = clampDisks(disks);
  const diskPeg: PegIndex[] = [];
  let x = encoding;

  for (let i = 0; i < n; i += 1) {
    diskPeg.push((x % 3) as PegIndex);
    x = Math.floor(x / 3);
  }

  return diskPeg;
};

/**
 * encodeDiskPeg - Mã hóa mảng peg thành số encoding
 *
 * CHỨC NĂNG (Purpose):
 * Ngược lại với decodeDiskPeg: chuyển mảng => số.
 *
 * THUẬT TOÁN (Algorithm):
 * encoding = diskPeg[0]*3^0 + diskPeg[1]*3^1 + ... + diskPeg[n-1]*3^(n-1)
 *
 * TẠI SAO DÙNG CÁCH NÀY? (Why This Approach?)
 * - Thay vì nhân với pow3(i), ta dùng factor và nhân dần
 * - Tránh nhiều lần gọi pow3(), cải thiện performance
 *
 * @param diskPeg - Mảng peg của từng disk
 * @returns Encoding number
 */
export const encodeDiskPeg = (diskPeg: PegIndex[]): number => {
  let encoding = 0;
  let factor = 1; // 3^0 = 1

  for (let i = 0; i < diskPeg.length; i += 1) {
    encoding += diskPeg[i] * factor;
    factor *= 3; // 3^1, 3^2, ...
  }

  return encoding;
};

/**
 * encodingToPegs - Chuyển encoding thành cấu trúc pegs cho UI render
 *
 * CHỨC NĂNG (Purpose):
 * UI cần biết mỗi peg chứa những disk nào để render.
 * Output là mảng 3 phần tử, mỗi phần tử là danh sách disk sizes.
 *
 * OUTPUT FORMAT:
 * - pegs[0] = [disks trên peg A], thứ tự bottom -> top
 * - pegs[1] = [disks trên peg B]
 * - pegs[2] = [disks trên peg C]
 *
 * THUẬT TOÁN (Algorithm):
 * 1. Decode encoding thành diskPeg array
 * 2. Duyệt từ disk lớn nhất -> nhỏ nhất (n -> 1)
 * 3. Push vào pegs[diskPeg[disk-1]]
 * => Đảm bảo thứ tự bottom -> top trong mỗi peg
 *
 * VÍ DỤ (Example):
 * N=3, encoding=0 (initial) => diskPeg=[0,0,0]
 * - disk 3 (lớn nhất) ở peg 0 => pegs[0] = [3]
 * - disk 2 ở peg 0 => pegs[0] = [3, 2]
 * - disk 1 (nhỏ nhất) ở peg 0 => pegs[0] = [3, 2, 1]
 * Output: [[3,2,1], [], []]
 *
 * @param encoding - State encoded
 * @param disks - Số đĩa
 * @returns Mảng 3 pegs, mỗi peg là mảng disk sizes
 */
export const encodingToPegs = (encoding: number, disks: number): number[][] => {
  const n = clampDisks(disks);
  const pegs: number[][] = [[], [], []];
  const diskPeg = decodeDiskPeg(encoding, n);

  // Duyệt từ disk lớn -> nhỏ để đảm bảo thứ tự stack đúng
  for (let disk = n; disk >= 1; disk -= 1) {
    const peg = diskPeg[disk - 1];
    pegs[peg].push(disk);
  }

  return pegs;
};

/**
 * getTopDisks - Lấy disk trên cùng của mỗi peg
 *
 * CHỨC NĂNG (Purpose):
 * Để kiểm tra nước đi hợp lệ, cần biết disk nào ở trên cùng mỗi peg.
 * Disk trên cùng = disk nhỏ nhất trên peg đó.
 *
 * OUTPUT FORMAT:
 * - top[peg] = disk nhỏ nhất trên peg đó, hoặc null nếu peg rỗng
 *
 * THUẬT TOÁN (Algorithm):
 * 1. Duyệt từ disk 1 (nhỏ nhất) -> n (lớn nhất)
 * 2. Với mỗi disk, nếu peg của nó chưa có top => đó là top
 * 3. Vì duyệt từ nhỏ -> lớn, disk đầu tiên gặp = nhỏ nhất = top
 *
 * TẠI SAO DUYỆT TỪ NHỎ ĐẾN LỚN? (Why Small to Large?)
 * - Disk nhỏ luôn ở trên (Hanoi rule)
 * - Disk đầu tiên gặp trên mỗi peg chính là top
 *
 * @param encoding - State encoded
 * @param disks - Số đĩa
 * @returns Mảng 3 giá trị: top disk của mỗi peg (null nếu rỗng)
 */
export const getTopDisks = (encoding: number, disks: number): Array<number | null> => {
  const n = clampDisks(disks);
  const diskPeg = decodeDiskPeg(encoding, n);
  const top: Array<number | null> = [null, null, null];

  for (let disk = 1; disk <= n; disk += 1) {
    const peg = diskPeg[disk - 1];
    if (top[peg] === null) top[peg] = disk; // First disk found = smallest = top
  }

  return top;
};

/* =============================================================================
   GAME LOGIC FUNCTIONS - Logic trò chơi
   ============================================================================= */

/**
 * isLegalMove - Kiểm tra nước đi có hợp lệ không
 *
 * CHỨC NĂNG (Purpose):
 * Áp dụng luật Hanoi để validate nước đi:
 * 1. Không thể move từ peg sang chính nó
 * 2. Peg nguồn phải có ít nhất 1 disk
 * 3. Disk di chuyển phải nhỏ hơn disk đích (nếu có)
 *
 * BƯỚC FLOW (Step-by-step):
 * 1. Check from === to => false
 * 2. Lấy top disks của cả 3 pegs
 * 3. movingDisk = top[from], nếu null => false (peg rỗng)
 * 4. destTop = top[to], nếu null => true (peg đích rỗng, luôn ok)
 * 5. Nếu movingDisk < destTop => true (disk nhỏ lên disk lớn, ok)
 *
 * COMPLEXITY:
 * - Time: O(n) do getTopDisks
 * - Space: O(n) do decodeDiskPeg
 *
 * @param encoding - State hiện tại
 * @param disks - Số đĩa
 * @param from - Cọc nguồn
 * @param to - Cọc đích
 * @returns true nếu nước đi hợp lệ
 */
export const isLegalMove = (encoding: number, disks: number, from: PegIndex, to: PegIndex) => {
  // Rule 1: Không thể move tại chỗ
  if (from === to) return false;

  const top = getTopDisks(encoding, disks);
  const movingDisk = top[from];

  // Rule 2: Peg nguồn phải có disk
  if (movingDisk === null) return false;

  const destTop = top[to];

  // Rule 3a: Peg đích rỗng => ok
  if (destTop === null) return true;

  // Rule 3b: Disk di chuyển phải nhỏ hơn disk đích
  return movingDisk < destTop;
};

/**
 * applyMove - Áp dụng nước đi và trả về encoding mới
 *
 * CHỨC NĂNG (Purpose):
 * Thực hiện nước đi: cập nhật vị trí disk được di chuyển.
 *
 * THUẬT TOÁN (Algorithm):
 * 1. Validate move bằng isLegalMove
 * 2. Decode encoding thành diskPeg array
 * 3. Cập nhật diskPeg[movingDisk - 1] = move.to
 * 4. Encode lại thành số
 *
 * TẠI SAO TRẢ VỀ null KHI ILLEGAL? (Why Return null?)
 * - Thay vì throw error, return null để caller dễ handle
 * - Phù hợp với functional programming style
 * - UI có thể check và show feedback
 *
 * SO SÁNH VỚI MUTATION (Comparison with Mutation):
 * - Cách này: immutable, tạo state mới
 * - Mutation: sửa state cũ
 * - Immutable giúp: time-travel debug, undo/redo, concurrent updates
 *
 * @param encoding - State hiện tại
 * @param disks - Số đĩa
 * @param move - Nước đi {from, to}
 * @returns Encoding mới nếu valid, null nếu invalid
 */
export const applyMove = (encoding: number, disks: number, move: HanoiMove): number | null => {
  const n = clampDisks(disks);

  // Validate first
  if (!isLegalMove(encoding, n, move.from, move.to)) return null;

  const diskPeg = decodeDiskPeg(encoding, n);
  const top = getTopDisks(encoding, n);
  const movingDisk = top[move.from];

  if (movingDisk === null) return null; // Should not happen after isLegalMove

  // Update position of moving disk
  diskPeg[movingDisk - 1] = move.to;

  return encodeDiskPeg(diskPeg);
};

/**
 * getLegalMoves - Liệt kê tất cả nước đi hợp lệ từ state hiện tại
 *
 * CHỨC NĂNG (Purpose):
 * Dùng cho BFS: cần biết các edges (nước đi) từ mỗi node (state).
 *
 * THUẬT TOÁN (Algorithm):
 * Brute force: thử tất cả cặp (from, to) với from != to
 * - 3 pegs => 3 * 2 = 6 cặp có thể
 * - Filter bằng isLegalMove
 *
 * COMPLEXITY:
 * - Cố định 6 iterations
 * - Mỗi iteration gọi isLegalMove: O(n)
 * - Tổng: O(n)
 *
 * TẠI SAO KHÔNG TỐI ƯU HÓA? (Why Not Optimize?)
 * - Chỉ 6 iterations, không đáng để phức tạp hóa
 * - Code đơn giản, dễ đọc và maintain
 *
 * @param encoding - State hiện tại
 * @param disks - Số đĩa
 * @returns Mảng các nước đi hợp lệ
 */
export const getLegalMoves = (encoding: number, disks: number): HanoiMove[] => {
  const moves: HanoiMove[] = [];
  const candidates: PegIndex[] = [0, 1, 2];

  for (const from of candidates) {
    for (const to of candidates) {
      if (from === to) continue;
      if (isLegalMove(encoding, disks, from, to)) {
        moves.push({ from, to });
      }
    }
  }

  return moves;
};

/* =============================================================================
   SOLVING ALGORITHMS - Thuật toán giải
   ============================================================================= */

/**
 * solveHanoiRecursive - Giải Hanoi bằng đệ quy chuẩn
 *
 * CHỨC NĂNG (Purpose):
 * Tạo danh sách các nước đi tối ưu từ trạng thái chuẩn (all disks on `from`).
 *
 * THUẬT TOÁN ĐỆ QUY (Recursive Algorithm):
 * ─────────────────────────────────────────────────────────────────────────────
 * Để chuyển n đĩa từ A sang C (với B là auxiliary):
 *
 * BASE CASE: n = 0 => không làm gì
 *
 * RECURSIVE CASE:
 * 1. Chuyển (n-1) đĩa từ A sang B (dùng C làm auxiliary)
 *    => hanoi(n-1, A, B, C)
 *
 * 2. Chuyển đĩa lớn nhất từ A sang C
 *    => push({from: A, to: C})
 *
 * 3. Chuyển (n-1) đĩa từ B sang C (dùng A làm auxiliary)
 *    => hanoi(n-1, B, C, A)
 *
 * PHÂN TÍCH COMPLEXITY (Complexity Analysis):
 * ─────────────────────────────────────────────────────────────────────────────
 * - Recurrence: T(n) = 2*T(n-1) + 1
 * - Giải: T(n) = 2^n - 1 (bằng induction hoặc master theorem)
 *
 * VÍ DỤ (Example) với n=3:
 * hanoi(3, A, C, B):
 *   hanoi(2, A, B, C):
 *     hanoi(1, A, C, B): move A->C
 *     move A->B
 *     hanoi(1, C, B, A): move C->B
 *   move A->C
 *   hanoi(2, B, C, A):
 *     hanoi(1, B, A, C): move B->A
 *     move B->C
 *     hanoi(1, A, C, B): move A->C
 * => 7 moves = 2^3 - 1
 *
 * ƯU ĐIỂM (Pros):
 * - Code ngắn gọn, elegant
 * - Đúng bản chất toán học của bài toán
 * - Luôn cho kết quả tối ưu
 *
 * NHƯỢC ĐIỂM (Cons):
 * - Chỉ works từ trạng thái ban đầu
 * - Không dùng được làm "hint" nếu user đi sai
 * - Call stack depth = n (có thể stack overflow với n rất lớn)
 *
 * @param disks - Số đĩa
 * @param from - Cọc nguồn (mặc định 0)
 * @param to - Cọc đích (mặc định 2)
 * @param aux - Cọc phụ (mặc định 1)
 * @returns Mảng các nước đi theo thứ tự
 */
export const solveHanoiRecursive = (
  disks: number,
  from: PegIndex = 0,
  to: PegIndex = 2,
  aux: PegIndex = 1
): HanoiMove[] => {
  const n = clampDisks(disks);
  const moves: HanoiMove[] = [];

  /**
   * Inner DFS function để tránh tạo array mới mỗi call
   * @param k - Số đĩa cần di chuyển
   * @param a - Cọc nguồn
   * @param c - Cọc đích
   * @param b - Cọc phụ
   */
  const dfs = (k: number, a: PegIndex, c: PegIndex, b: PegIndex) => {
    if (k <= 0) return; // Base case

    // Step 1: Move (k-1) disks từ a -> b
    dfs(k - 1, a, b, c);

    // Step 2: Move largest disk từ a -> c
    moves.push({ from: a, to: c });

    // Step 3: Move (k-1) disks từ b -> c
    dfs(k - 1, b, c, a);
  };

  dfs(n, from, to, aux);
  return moves;
};

/**
 * solveHanoiBfs - Giải Hanoi bằng BFS từ trạng thái bất kỳ
 *
 * CHỨC NĂNG (Purpose):
 * Tìm đường đi ngắn nhất từ state hiện tại đến goal state.
 * Dùng cho tính năng "Hint" - gợi ý bước tiếp theo.
 *
 * TẠI SAO CẦN BFS?
 * ─────────────────────────────────────────────────────────────────────────────
 * Recursive solution chỉ works từ trạng thái chuẩn. Nếu người chơi đi sai
 * (không theo đường tối ưu), cần BFS để tìm đường về goal.
 *
 * THUẬT TOÁN BFS (BFS Algorithm):
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Tạo queue với state ban đầu
 * 2. Tạo visited set để tránh visit lại
 * 3. Tạo parent map để reconstruct path
 *
 * 4. While queue không rỗng:
 *    a. Dequeue state hiện tại
 *    b. Với mỗi legal move:
 *       - Tính next state
 *       - Nếu đã visited => skip
 *       - Mark visited, lưu parent
 *       - Nếu là goal => reconstruct path và return
 *       - Enqueue next state
 *
 * 5. Return [] nếu không tìm được (không xảy ra với Hanoi)
 *
 * COMPLEXITY ANALYSIS:
 * ─────────────────────────────────────────────────────────────────────────────
 * - States: V = 3^n (mỗi disk có 3 vị trí)
 * - Edges: mỗi state có <= 6 moves nhưng thường 2-3 valid
 * - BFS: O(V + E) = O(3^n)
 *
 * PRACTICAL LIMITS (Giới hạn thực tế):
 * - n=8: 3^8 = 6,561 states => chạy rất nhanh (<10ms)
 * - n=10: 3^10 = 59,049 states => vẫn ok (~50ms)
 * - n=12: 3^12 = 531,441 states => có thể lag (~500ms)
 *
 * SO SÁNH VỚI CÁC THUẬT TOÁN KHÁC (Comparison):
 * ─────────────────────────────────────────────────────────────────────────────
 * | Thuật toán | Optimal? | Từ state bất kỳ? | Complexity |
 * |------------|----------|------------------|------------|
 * | Recursive  | ✅ Yes   | ❌ No           | O(2^n)     |
 * | BFS        | ✅ Yes   | ✅ Yes          | O(3^n)     |
 * | DFS        | ❌ No    | ✅ Yes          | O(3^n)     |
 * | A*         | ✅ Yes   | ✅ Yes          | < O(3^n)   |
 *
 * ƯU ĐIỂM (Pros):
 * - LUÔN tìm được đường ngắn nhất
 * - Works từ BẤT KỲ state nào
 * - Không cần heuristic phức tạp như A*
 *
 * NHƯỢC ĐIỂM (Cons):
 * - Memory tăng theo 3^n
 * - Chậm hơn recursive solution nếu từ initial state
 *
 * @param encoding - State hiện tại
 * @param disks - Số đĩa
 * @param goalPeg - Cọc đích (mặc định 2)
 * @returns Mảng các nước đi ngắn nhất, [] nếu đã ở goal
 */
export const solveHanoiBfs = (
  encoding: number,
  disks: number,
  goalPeg: PegIndex = 2
): HanoiMove[] => {
  const n = clampDisks(disks);

  // Check nếu đã ở goal
  if (isGoalEncoding(encoding, n, goalPeg)) return [];

  // BFS data structures
  const visited = new Set<number>(); // Set để O(1) lookup
  const queue: number[] = []; // FIFO queue
  const parent = new Map<number, { prev: number; move: HanoiMove }>(); // Để reconstruct path

  // Initialize BFS
  visited.add(encoding);
  queue.push(encoding);

  // BFS main loop
  while (queue.length > 0) {
    const cur = queue.shift()!; // Dequeue (FIFO)
    const moves = getLegalMoves(cur, n);

    for (const mv of moves) {
      const next = applyMove(cur, n, mv);
      if (next === null) continue; // Should not happen với legal moves
      if (visited.has(next)) continue; // Skip visited states

      // Mark visited và lưu parent để reconstruct
      visited.add(next);
      parent.set(next, { prev: cur, move: mv });

      // Check goal
      if (isGoalEncoding(next, n, goalPeg)) {
        // Reconstruct path từ goal về start
        const path: HanoiMove[] = [];
        let node = next;

        while (node !== encoding) {
          const p = parent.get(node);
          if (!p) break;
          path.push(p.move);
          node = p.prev;
        }

        path.reverse(); // Đảo lại vì ta build từ goal về start
        return path;
      }

      queue.push(next); // Enqueue
    }
  }

  return []; // Không tìm được (không xảy ra với Hanoi)
};

/**
 * getShortestRemainingMoves - Tính số bước tối ưu còn lại
 *
 * CHỨC NĂNG (Purpose):
 * Hiển thị cho người chơi biết còn bao nhiêu bước nữa (theo đường tối ưu).
 *
 * THUẬT TOÁN (Algorithm):
 * Đơn giản: chạy BFS và đếm độ dài path.
 *
 * USAGE (Cách sử dụng):
 * - Hiển thị trên UI: "còn tối ưu: X bước"
 * - Giúp người chơi biết họ đang đi đúng đường hay không
 * - Nếu số moves thực tế > shortest, nghĩa là có bước thừa
 *
 * @param encoding - State hiện tại
 * @param disks - Số đĩa
 * @param goalPeg - Cọc đích (mặc định 2)
 * @returns Số bước ngắn nhất còn lại
 */
export const getShortestRemainingMoves = (encoding: number, disks: number, goalPeg: PegIndex = 2) => {
  const path = solveHanoiBfs(encoding, disks, goalPeg);
  return path.length;
};

