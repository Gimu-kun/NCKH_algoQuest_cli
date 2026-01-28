/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MÔ HÌNH DỮ LIỆU PHÉP THUẬT & KỸ NĂNG (Spell & Ability Data Model)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Định nghĩa cấu trúc cho hệ thống Phép thuật (Active Spells) và Cổ Ngữ (Passive Runes).
 * Đây là phần thưởng chính cho người chơi khi giải quyết được các bài tập lập trình.
 * 
 * KỸ THUẬT:
 * - Coding-Based Magic: Mỗi phép thuật tương ứng với một thuật toán (Bubble Sort -> Spell).
 * - Visualization: Mỗi phép có animation và VFX riêng để minh họa thuật toán.
 * 
 * PHÂN LOẠI:
 * - SpellData: Phép chủ động, cần Mana (O-Points) để dùng.
 * - RuneData: Cổ ngữ bị động, tăng chỉ số hoặc giảm cost.
 * 
 * @module SpellModel
 * @category Data Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { ProgrammingQuestion } from './Question';

// Phân loại Phép thuật theo chủ đề thuật toán
export const enum SpellCategory {
    SORTING = 'SORTING',           // Sắp xếp
    SEARCHING = 'SEARCHING',       // Tìm kiếm
    LIST_MANIPULATION = 'LIST',    // Thao tác danh sách
    TREE_OPERATION = 'TREE',       // Thao tác Cây
    STACK_QUEUE = 'STACK_QUEUE',   // Ngăn xếp & Hàng đợi
    HASH_TABLE = 'HASH'            // Bảng băm
}

// Loại Animation hiển thị khi thi triển
export const enum AnimationType {
    SWAP = 'SWAP',               // Hoán đổi (Bubble/Quick Sort)
    SCAN = 'SCAN',               // Quét (Linear/Binary Search)
    TRANSFORM = 'TRANSFORM',     // Biến đổi (Reverse List)
    CHECK = 'CHECK',             // Kiểm tra (Is Balanced)
    INSERT = 'INSERT',           // Chèn (Insert Node)
    TRAVERSE = 'TRAVERSE'        // Duyệt (Inorder/Preorder)
}

// Interface dữ liệu Phép Thuật Chủ Động
export interface SpellData {
    id: string;
    name: string;               // Tên kỹ thuật (e.g., bubbleSort)
    displayName: string;        // Tên hiển thị
    description: string;        // Mô tả công dụng
    category: SpellCategory;
    chapter: number;            // Chương mở khóa

    // === Visuals (Hình ảnh & Hiệu ứng) ===
    icon: string;               // Icon trong Spellbook
    animation: AnimationType;   // Kiểu hoạt ảnh nhân vật
    vfxSprite?: string;         // Lớp phủ VFX khi thi triển

    // === Gameplay Mechanics ===
    unlockQuestion: string;     // ID câu hỏi lập trình để mở khóa phép này
    unlockQuestionData?: ProgrammingQuestion; // Dữ liệu câu hỏi (Optional)
    manaCost: number;           // Chi phí O-Points để sử dụng

    // === Combat Properties ===
    combatType?: 'ATTACK' | 'HEAL' | 'BUFF' | 'DEBUFF';
    combatValue?: number;       // Sát thương hoặc Hồi máu

    // === Puzzle Interaction ===
    puzzleTypes: string[];      // Loại câu đố mà phép này có thể giải (e.g., 'UNSORTED_STONES')

    // === Coding Template (Cho Runic Console) ===
    functionSignature: string;  // Chữ ký hàm (e.g., void sort(int arr[]))
    starterCode: string;        // Code mẫu ban đầu
}


// Interface dữ liệu Cổ Ngữ Bị Động (Runes)
export interface RuneData {
    id: string;
    name: string;
    displayName: string;
    description: string;
    chapter: number;

    // Visual
    icon: string;

    // Hiệu ứng Gameplay
    effect: {
        type: 'STAT_BUFF' | 'COST_REDUCTION' | 'BUILD_GATE'; // Loại hiệu ứng
        value?: number | string;  // Giá trị (e.g., "10%" hoặc "5")
        unlocks?: string[];       // ID các phép/khu vực mở khóa thêm
    };

    unlockQuestion: string;       // ID câu hỏi để mở khóa (thường là MCQ)
}

// Thư viện các Phép thuật (Spell Registry)
export const SPELLS: Record<string, SpellData> = {
    IS_INCREASING: {
        id: 'spell_is_increasing',
        name: 'isIncreasing',
        displayName: 'Phép: isIncreasing()',
        description: 'Kiểm tra xem mảng có được sắp xếp tăng dần không.',
        category: SpellCategory.SORTING,
        chapter: 1,
        icon: '/assets/images/spells/is_increasing.png',
        animation: AnimationType.CHECK,
        vfxSprite: '/assets/images/vfx/Phép Tìm Kiếm (Search Scan - Yellow).png',
        unlockQuestion: 'prog_ch1_isIncreasing',
        manaCost: 10,
        combatType: 'BUFF',
        combatValue: 0,
        puzzleTypes: ['ARRAY_CHECK'],
        functionSignature: 'bool isIncreasing(int arr[], int size)',
        starterCode: `bool isIncreasing(int arr[], int size) {
    // Your code here
    return false;
}`
    },

    BUBBLE_SORT: {
        id: 'spell_bubble_sort',
        name: 'bubbleSort',
        displayName: 'Phép: bubbleSort()',
        description: 'Sắp xếp các viên đá bằng cách hoán đổi các cặp liền kề.',
        category: SpellCategory.SORTING,
        chapter: 2,
        icon: '/assets/images/spells/bubble_sort.png',
        animation: AnimationType.SWAP,
        vfxSprite: '/assets/images/vfx/Hiệu Ứng Phép Thuật (SuccessActive Spells).png',
        unlockQuestion: 'prog_ch2_bubbleSort',
        manaCost: 25,
        combatType: 'ATTACK',
        combatValue: 30,
        puzzleTypes: ['UNSORTED_STONES'],
        functionSignature: 'void bubbleSort(int arr[], int size)',
        starterCode: `void bubbleSort(int arr[], int size) {
    // Your code here
}`
    },

    BINARY_SEARCH: {
        id: 'spell_binary_search',
        name: 'binarySearch',
        displayName: 'Phép: binarySearch()',
        description: 'Tìm cuốn sách trong thư viện đã sắp xếp một cách hiệu quả.',
        category: SpellCategory.SEARCHING,
        chapter: 2,
        icon: '/assets/images/spells/binary_search.png',
        animation: AnimationType.SCAN,
        vfxSprite: '/assets/images/vfx/Phép Tìm Kiếm (Search Scan - Yellow).png',
        unlockQuestion: 'prog_ch2_binarySearch',
        manaCost: 20,
        combatType: 'ATTACK',
        combatValue: 45,
        puzzleTypes: ['BOOK_SEARCH'],
        functionSignature: 'int binarySearch(int arr[], int size, int target)',
        starterCode: `int binarySearch(int arr[], int size, int target) {
    // Your code here
    return -1;
}`
    },

    REVERSE_LIST: {
        id: 'spell_reverse_list',
        name: 'reverseList',
        displayName: 'Phép: reverseList()',
        description: 'Đảo ngược chuỗi danh sách liên kết.',
        category: SpellCategory.LIST_MANIPULATION,
        chapter: 3,
        icon: '/assets/images/spells/reverse_list.png',
        animation: AnimationType.TRANSFORM,
        vfxSprite: '/assets/images/vfx/Phép Cấu Trúc (LinkedTree - Green).png',
        unlockQuestion: 'prog_ch3_reverseList',
        manaCost: 30,
        combatType: 'HEAL',
        combatValue: 40,
        puzzleTypes: ['BROKEN_CHAIN'],
        functionSignature: 'Node* reverseList(Node* head)',
        starterCode: `Node* reverseList(Node* head) {
    // Your code here
    return nullptr;
}`
    },

    IS_BALANCED: {
        id: 'spell_is_balanced',
        name: 'isBalanced',
        displayName: 'Phép: isBalanced()',
        description: 'Kiểm tra xem các dấu ngoặc có cân bằng không bằng ngăn xếp (stack).',
        category: SpellCategory.STACK_QUEUE,
        chapter: 4,
        icon: '/assets/images/spells/is_balanced.png',
        animation: AnimationType.CHECK,
        vfxSprite: '/assets/images/vfx/Phép Tìm Kiếm (Search Scan - Yellow).png',
        unlockQuestion: 'prog_ch4_isBalanced',
        manaCost: 20,
        combatType: 'BUFF',
        combatValue: 15,
        puzzleTypes: ['BRACKET_GATE'],
        functionSignature: 'bool isBalanced(string expression)',
        starterCode: `bool isBalanced(string expression) {
    // Your code here
    return false;
}`
    },

    INSERT_BST: {
        id: 'spell_insert_bst',
        name: 'insertBST',
        displayName: 'Phép: insertBST()',
        description: 'Chèn một nút vào cây tìm kiếm nhị phân (BST).',
        category: SpellCategory.TREE_OPERATION,
        chapter: 5,
        icon: '/assets/images/spells/insert_bst.png',
        animation: AnimationType.INSERT,
        vfxSprite: '/assets/images/vfx/Phép Cấu Trúc (LinkedTree - Green).png',
        unlockQuestion: 'prog_ch5_insertBST',
        manaCost: 35,
        combatType: 'ATTACK',
        combatValue: 60,
        puzzleTypes: ['TREE_GROWTH'],
        functionSignature: 'TreeNode* insertBST(TreeNode* root, int value)',
        starterCode: `TreeNode* insertBST(TreeNode* root, int value) {
    // Your code here
    return nullptr;
}`
    },

    HASH_INSERT: {
        id: 'spell_hash_insert',
        name: 'hashInsert',
        displayName: 'Phép: hashInsert()',
        description: 'Chèn vào bảng băm với xử lý va chạm.',
        category: SpellCategory.HASH_TABLE,
        chapter: 6,
        icon: '/assets/images/spells/hash_insert.png',
        animation: AnimationType.INSERT,
        vfxSprite: '/assets/images/vfx/Hiệu Ứng Phép Thuật (SuccessActive Spells).png',
        unlockQuestion: 'prog_ch6_hashInsert',
        manaCost: 40,
        combatType: 'ATTACK',
        combatValue: 70,
        puzzleTypes: ['COLLISION_PHANTOM'],
        functionSignature: 'void hashInsert(HashTable* table, int key, int value)',
        starterCode: `void hashInsert(HashTable* table, int key, int value) {
    // Your code here
}`
    }
};

// Interface cho Sách Phép Người Chơi (Player Spellbook State)
export interface PlayerSpellBook {
    unlockedSpells: string[];    // Danh sách ID phép đã mở (Spells)
    unlockedRunes: string[];     // Danh sách ID cổ ngữ đã mở (Runes)
    equippedSpells: string[];    // Tối đa 4 phép thi triển nhanh (Hotbar)
    currentMana: number;         // O-Points hiện tại (Năng lượng)
    maxMana: number;             // O-Points tối đa
}
