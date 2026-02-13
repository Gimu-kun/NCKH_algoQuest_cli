/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GRID ENGINE - Core algorithms cho Grid-based Games
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * MÔ TẢ (Description):
 * Engine thuần (pure functions) cho tất cả grid-based games:
 * - Maze Race: BFS tìm đường ngắn nhất
 * - Flood Fill: DFS tô màu vùng liên thông
 * - Island Count: DFS đếm số component liên thông
 *
 * THUẬT TOÁN CHÍNH (Core Algorithms):
 *
 * 1. BFS (Breadth-First Search):
 *    - Tìm đường ngắn nhất trên unweighted graph
 *    - Time: O(V + E) = O(rows × cols)
 *    - Space: O(V) cho queue và visited
 *
 * 2. DFS (Depth-First Search):
 *    - Duyệt toàn bộ connected component
 *    - Time: O(V + E)
 *    - Space: O(V) cho stack (recursive)
 *
 * SO SÁNH BFS vs DFS (Comparison):
 * ┌──────────────┬─────────────────┬─────────────────┐
 * │ Tiêu chí     │ BFS             │ DFS             │
 * ├──────────────┼─────────────────┼─────────────────┤
 * │ Tìm path     │ ✅ Shortest     │ ❌ Any path     │
 * │ Memory       │ ❌ Queue lớn    │ ✅ Stack nhỏ    │
 * │ Use case     │ Pathfinding     │ Flood fill      │
 * └──────────────┴─────────────────┴─────────────────┘
 *
 * @module gridEngine
 * @category Games/Grid
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ============================================================================
// TYPES - Định nghĩa types
// ============================================================================

/**
 * CellType - Loại ô trong grid
 *
 * - EMPTY: ô trống, có thể đi qua
 * - WALL: tường, không thể đi qua
 * - START: điểm bắt đầu
 * - END: điểm kết thúc (goal)
 * - WATER: nước (cho island game)
 * - LAND: đất liền (cho island game)
 */
export enum CellType {
    EMPTY = 0,
    WALL = 1,
    START = 2,
    END = 3,
    WATER = 4,
    LAND = 5,
}

/**
 * Position - Vị trí trong grid
 */
export interface Position {
    row: number;
    col: number;
}

/**
 * Cell - Một ô trong grid
 */
export interface Cell {
    type: CellType;
    visited: boolean;
    color?: number; // Player color for flood fill
    distance?: number; // For BFS pathfinding
    parent?: Position; // For path reconstruction
}

/**
 * Grid - Ma trận 2D các cells
 */
export type Grid = Cell[][];

/**
 * PathResult - Kết quả tìm đường
 */
export interface PathResult {
    found: boolean;
    path: Position[];
    visited: Position[];
    distance: number;
}

/**
 * FloodFillResult - Kết quả flood fill
 */
export interface FloodFillResult {
    filledCells: Position[];
    count: number;
}

/**
 * IslandCountResult - Kết quả đếm đảo
 */
export interface IslandCountResult {
    count: number;
    islands: Position[][]; // Mỗi island là list positions
}

// ============================================================================
// GRID CREATION - Tạo và khởi tạo grid
// ============================================================================

/**
 * createEmptyGrid - Tạo grid rỗng
 *
 * @param rows - Số hàng
 * @param cols - Số cột
 * @param defaultType - Loại cell mặc định
 * @returns Grid mới
 */
export function createEmptyGrid(
    rows: number,
    cols: number,
    defaultType: CellType = CellType.EMPTY
): Grid {
    const grid: Grid = [];
    for (let r = 0; r < rows; r++) {
        const row: Cell[] = [];
        for (let c = 0; c < cols; c++) {
            row.push({
                type: defaultType,
                visited: false,
            });
        }
        grid.push(row);
    }
    return grid;
}

/**
 * createRandomMaze - Tạo maze ngẫu nhiên bằng Prim's Algorithm
 *
 * THUẬT TOÁN PRIM'S (Prim's Algorithm for Maze):
 *
 * 1. Bắt đầu với grid toàn walls
 * 2. Chọn 1 cell ngẫu nhiên, đánh dấu là path
 * 3. Thêm các tường xung quanh vào frontier
 * 4. Lặp:
 *    a. Chọn random wall từ frontier
 *    b. Nếu chỉ có 1 phía là path, phá wall đó
 *    c. Thêm walls mới vào frontier
 * 5. Dừng khi frontier rỗng
 *
 * ƯU ĐIỂM (Pros):
 * - Maze có độ khó vừa phải
 * - Đảm bảo có đường đi
 * - Không có large open areas
 *
 * @param rows - Số hàng (nên lẻ)
 * @param cols - Số cột (nên lẻ)
 * @returns Grid là maze
 */
export function createRandomMaze(rows: number, cols: number): Grid {
    // Ensure odd dimensions for proper maze
    const r = rows % 2 === 0 ? rows + 1 : rows;
    const c = cols % 2 === 0 ? cols + 1 : cols;

    // Start with all walls
    const grid = createEmptyGrid(r, c, CellType.WALL);

    // Frontier walls list
    const frontier: Position[] = [];

    // Helper: add surrounding walls to frontier
    const addFrontier = (row: number, col: number) => {
        const dirs = [
            [-2, 0],
            [2, 0],
            [0, -2],
            [0, 2],
        ];
        for (const [dr, dc] of dirs) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr > 0 && nr < r - 1 && nc > 0 && nc < c - 1) {
                if (grid[nr][nc].type === CellType.WALL) {
                    frontier.push({ row: nr, col: nc });
                }
            }
        }
    };

    // Start from (1, 1)
    grid[1][1].type = CellType.EMPTY;
    addFrontier(1, 1);

    // Process frontier
    while (frontier.length > 0) {
        // Pick random wall from frontier
        const idx = Math.floor(Math.random() * frontier.length);
        const wall = frontier.splice(idx, 1)[0];

        if (grid[wall.row][wall.col].type === CellType.WALL) {
            // Check neighbors
            const neighbors: Position[] = [];
            const dirs = [
                [-2, 0],
                [2, 0],
                [0, -2],
                [0, 2],
            ];

            for (const [dr, dc] of dirs) {
                const nr = wall.row + dr;
                const nc = wall.col + dc;
                if (nr > 0 && nr < r - 1 && nc > 0 && nc < c - 1) {
                    if (grid[nr][nc].type === CellType.EMPTY) {
                        neighbors.push({ row: nr, col: nc });
                    }
                }
            }

            // If exactly one path neighbor, carve
            if (neighbors.length === 1) {
                const neighbor = neighbors[0];
                // Carve wall
                grid[wall.row][wall.col].type = CellType.EMPTY;
                // Carve between wall and neighbor
                const midRow = (wall.row + neighbor.row) / 2;
                const midCol = (wall.col + neighbor.col) / 2;
                grid[midRow][midCol].type = CellType.EMPTY;
                // Add new frontiers
                addFrontier(wall.row, wall.col);
            }
        }
    }

    // Set start and end
    grid[1][1].type = CellType.START;
    grid[r - 2][c - 2].type = CellType.END;

    return grid;
}

/**
 * createRandomIslandGrid - Tạo grid với land/water ngẫu nhiên
 *
 * @param rows - Số hàng
 * @param cols - Số cột
 * @param landRatio - Tỷ lệ đất liền (0.0 - 1.0)
 * @returns Grid với islands
 */
export function createRandomIslandGrid(
    rows: number,
    cols: number,
    landRatio: number = 0.4
): Grid {
    const grid = createEmptyGrid(rows, cols, CellType.WATER);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() < landRatio) {
                grid[r][c].type = CellType.LAND;
            }
        }
    }

    return grid;
}

// ============================================================================
// BFS - Breadth-First Search
// ============================================================================

/**
 * bfs - Tìm đường ngắn nhất bằng BFS
 *
 * THUẬT TOÁN BFS (BFS Algorithm):
 *
 * BƯỚC 1: Khởi tạo
 *   - Queue chứa start position
 *   - Visited set để tránh duyệt lại
 *   - Distance[start] = 0
 *
 * BƯỚC 2: Lặp (while queue không rỗng)
 *   - Lấy node đầu queue (dequeue)
 *   - Nếu đó là goal → tìm thấy!
 *   - Với mỗi neighbor chưa visited:
 *     - Đánh dấu visited
 *     - Lưu parent để reconstruct path
 *     - Distance = distance[current] + 1
 *     - Thêm vào queue
 *
 * BƯỚC 3: Reconstruct path
 *   - Từ goal, đi ngược theo parent
 *   - Reverse để có path từ start → goal
 *
 * TIME COMPLEXITY: O(V + E) = O(rows × cols)
 * SPACE COMPLEXITY: O(V) cho queue và visited
 *
 * @param grid - Grid để tìm đường
 * @param start - Vị trí bắt đầu
 * @param end - Vị trí đích
 * @returns PathResult với path và visited cells
 */
export function bfs(grid: Grid, start: Position, end: Position): PathResult {
    const rows = grid.length;
    const cols = grid[0].length;

    // Direction vectors: up, down, left, right
    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    // Queue for BFS
    const queue: Position[] = [start];

    // Track visited and distance
    const visited: boolean[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(false)
    );
    const distance: number[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(Infinity)
    );
    const parent: (Position | null)[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(null)
    );

    // Initialize start
    visited[start.row][start.col] = true;
    distance[start.row][start.col] = 0;

    // Track visited order for visualization
    const visitedOrder: Position[] = [];

    // BFS loop
    while (queue.length > 0) {
        const current = queue.shift()!;
        visitedOrder.push(current);

        // Check if reached goal
        if (current.row === end.row && current.col === end.col) {
            // Reconstruct path
            const path: Position[] = [];
            let node: Position | null = current;
            while (node) {
                path.push(node);
                node = parent[node.row][node.col];
            }
            path.reverse();

            return {
                found: true,
                path,
                visited: visitedOrder,
                distance: distance[end.row][end.col],
            };
        }

        // Explore neighbors
        for (const [dr, dc] of dirs) {
            const nr = current.row + dr;
            const nc = current.col + dc;

            // Check bounds
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

            // Check wall
            if (grid[nr][nc].type === CellType.WALL) continue;

            // Check visited
            if (visited[nr][nc]) continue;

            // Mark visited and enqueue
            visited[nr][nc] = true;
            distance[nr][nc] = distance[current.row][current.col] + 1;
            parent[nr][nc] = current;
            queue.push({ row: nr, col: nc });
        }
    }

    // No path found
    return {
        found: false,
        path: [],
        visited: visitedOrder,
        distance: Infinity,
    };
}

// ============================================================================
// DFS - Depth-First Search
// ============================================================================

/**
 * dfs - Duyệt DFS từ một điểm
 *
 * THUẬT TOÁN DFS (DFS Algorithm):
 *
 * BƯỚC 1: Đánh dấu current node là visited
 *
 * BƯỚC 2: Với mỗi neighbor:
 *   - Nếu chưa visited và không phải wall
 *   - Gọi đệ quy DFS(neighbor)
 *
 * ĐẶC ĐIỂM:
 * - Đi sâu trước, backtrack khi stuck
 * - Không đảm bảo shortest path
 * - Tốt cho flood fill, island counting
 *
 * @param grid - Grid để duyệt
 * @param start - Vị trí bắt đầu
 * @param visited - Set các ô đã thăm (sẽ được modify)
 * @returns List các ô đã thăm
 */
export function dfs(
    grid: Grid,
    start: Position,
    visited: Set<string>
): Position[] {
    const rows = grid.length;
    const cols = grid[0].length;
    const result: Position[] = [];

    const key = (r: number, c: number) => `${r},${c}`;

    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    // Stack-based DFS (avoid deep recursion)
    const stack: Position[] = [start];

    while (stack.length > 0) {
        const current = stack.pop()!;
        const currentKey = key(current.row, current.col);

        if (visited.has(currentKey)) continue;

        visited.add(currentKey);
        result.push(current);

        for (const [dr, dc] of dirs) {
            const nr = current.row + dr;
            const nc = current.col + dc;

            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc].type === CellType.WALL) continue;
            if (grid[nr][nc].type === CellType.WATER) continue;
            if (visited.has(key(nr, nc))) continue;

            stack.push({ row: nr, col: nc });
        }
    }

    return result;
}

// ============================================================================
// FLOOD FILL - Tô màu vùng liên thông
// ============================================================================

/**
 * floodFill - Tô màu từ một điểm ra các ô liên thông
 *
 * THUẬT TOÁN FLOOD FILL:
 *
 * 1. Bắt đầu từ cell (row, col)
 * 2. Đánh dấu cell với color
 * 3. Với mỗi neighbor cùng type và chưa có color:
 *    - Gọi đệ quy floodFill
 *
 * ỨNG DỤNG (Applications):
 * - Paint bucket tool trong image editors
 * - Game: fill territory
 * - Connected component labeling
 *
 * @param grid - Grid để fill (sẽ được modify)
 * @param start - Vị trí bắt đầu
 * @param color - Màu để fill (player ID)
 * @returns FloodFillResult với các ô đã fill
 */
export function floodFill(
    grid: Grid,
    start: Position,
    color: number
): FloodFillResult {
    const rows = grid.length;
    const cols = grid[0].length;

    // Check valid start
    if (grid[start.row][start.col].type === CellType.WALL) {
        return { filledCells: [], count: 0 };
    }
    if (grid[start.row][start.col].color !== undefined) {
        return { filledCells: [], count: 0 };
    }

    const filledCells: Position[] = [];
    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    // BFS-based flood fill (more efficient than DFS for large areas)
    const queue: Position[] = [start];
    const visited = new Set<string>();

    while (queue.length > 0) {
        const current = queue.shift()!;
        const key = `${current.row},${current.col}`;

        if (visited.has(key)) continue;
        visited.add(key);

        // Fill cell
        grid[current.row][current.col].color = color;
        filledCells.push(current);

        // Add neighbors
        for (const [dr, dc] of dirs) {
            const nr = current.row + dr;
            const nc = current.col + dc;

            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc].type === CellType.WALL) continue;
            if (grid[nr][nc].color !== undefined) continue;
            if (visited.has(`${nr},${nc}`)) continue;

            queue.push({ row: nr, col: nc });
        }
    }

    return {
        filledCells,
        count: filledCells.length,
    };
}

// ============================================================================
// ISLAND COUNTING - Đếm số đảo
// ============================================================================

/**
 * countIslands - Đếm số islands (connected components) trong grid
 *
 * THUẬT TOÁN ĐẾM ĐẢO (Island Counting):
 *
 * 1. Duyệt từng ô trong grid
 * 2. Nếu ô là LAND và chưa visited:
 *    a. Đây là đảo mới → count++
 *    b. DFS để đánh dấu toàn bộ đảo
 * 3. Return count
 *
 * GIẢI THÍCH (Explanation):
 * - Mỗi lần tìm thấy LAND mới = bắt đầu đảo mới
 * - DFS đánh dấu hết ô liên thông = "xóa" đảo đó
 * - Tiếp tục tìm đảo tiếp theo
 *
 * TIME COMPLEXITY: O(rows × cols)
 * SPACE COMPLEXITY: O(rows × cols) cho visited
 *
 * @param grid - Grid với LAND và WATER
 * @returns IslandCountResult với count và chi tiết các đảo
 */
export function countIslands(grid: Grid): IslandCountResult {
    const rows = grid.length;
    const cols = grid[0].length;

    const visited = new Set<string>();
    const islands: Position[][] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const key = `${r},${c}`;

            // Skip if not land or already visited
            if (grid[r][c].type !== CellType.LAND) continue;
            if (visited.has(key)) continue;

            // Found new island - DFS to mark all connected land
            const islandCells = dfs(grid, { row: r, col: c }, visited);
            islands.push(islandCells);
        }
    }

    return {
        count: islands.length,
        islands,
    };
}

// ============================================================================
// UTILITY FUNCTIONS - Hàm tiện ích
// ============================================================================

/**
 * copyGrid - Deep copy một grid
 */
export function copyGrid(grid: Grid): Grid {
    return grid.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * getCell - Lấy cell an toàn (không throw nếu out of bounds)
 */
export function getCell(grid: Grid, pos: Position): Cell | null {
    if (pos.row < 0 || pos.row >= grid.length) return null;
    if (pos.col < 0 || pos.col >= grid[0].length) return null;
    return grid[pos.row][pos.col];
}

/**
 * isValidMove - Kiểm tra có thể di chuyển đến ô không
 */
export function isValidMove(grid: Grid, pos: Position): boolean {
    const cell = getCell(grid, pos);
    if (!cell) return false;
    return cell.type !== CellType.WALL;
}

/**
 * getNeighbors - Lấy các ô lân cận hợp lệ
 */
export function getNeighbors(grid: Grid, pos: Position): Position[] {
    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    return dirs
        .map(([dr, dc]) => ({ row: pos.row + dr, col: pos.col + dc }))
        .filter((p) => isValidMove(grid, p));
}

/**
 * findCellByType - Tìm vị trí cell theo type
 */
export function findCellByType(grid: Grid, type: CellType): Position | null {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c].type === type) {
                return { row: r, col: c };
            }
        }
    }
    return null;
}
