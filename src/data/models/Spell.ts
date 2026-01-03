/**
 * Mô Hình Dữ Liệu Phép Thuật và Kỹ Năng
 * Các phép thuật chủ động mở khóa thông qua bài tập lập trình
 */

import type { ProgrammingQuestion } from './Question';

export const enum SpellCategory {
    SORTING = 'SORTING',
    SEARCHING = 'SEARCHING',
    LIST_MANIPULATION = 'LIST',
    TREE_OPERATION = 'TREE',
    STACK_QUEUE = 'STACK_QUEUE',
    HASH_TABLE = 'HASH'
}

export const enum AnimationType {
    SWAP = 'SWAP',               // Cho sắp xếp (bubble sort)
    SCAN = 'SCAN',               // Cho tìm kiếm (binary search)
    TRANSFORM = 'TRANSFORM',      // Cho đảo ngược danh sách
    CHECK = 'CHECK',             // Cho kiểm tra (isBalanced)
    INSERT = 'INSERT',           // Cho chèn vào cây/hash
    TRAVERSE = 'TRAVERSE'        // Cho duyệt cây
}

export interface SpellData {
    id: string;
    name: string;
    displayName: string;
    description: string;
    category: SpellCategory;
    chapter: number;

    // Hiển thị
    icon: string;
    animation: AnimationType;
    vfxSprite?: string;        // Lớp phủ VFX khi thi triển

    // Lối chơi
    unlockQuestion: string;     // ID câu hỏi lập trình
    unlockQuestionData?: ProgrammingQuestion; // Full question data (optional, for reference)
    manaCost: number;           // Chi phí O-Points để sử dụng

    // Sử dụng trong câu đố
    puzzleTypes: string[];      // Loại câu đố nào mà phép này giải được

    // Mẫu code cho bài tập lập trình
    functionSignature: string;
    starterCode: string;
}

// Các cổ ngữ bị động (từ câu hỏi MCQ, Fill, Match)
export interface RuneData {
    id: string;
    name: string;
    displayName: string;
    description: string;
    chapter: number;

    // Visual
    icon: string;

    // Hiệu ứng gameplay
    effect: {
        type: 'STAT_BUFF' | 'COST_REDUCTION' | 'BUILD_GATE';
        value?: number | string;  // ví dụ: "Giảm 10% chi phí cho phép O(n²)"
        unlocks?: string[];       // ID các phép có thể xây được
    };

    unlockQuestion: string;     // Question ID
}

// Ví dụ các phép thuật từ 6 chương
export const SPELLS: Record<string, SpellData> = {
    IS_INCREASING: {
        id: 'spell_is_increasing',
        name: 'isIncreasing',
        displayName: 'Phép: isIncreasing()',
        description: 'Check if an array is sorted in increasing order',
        category: SpellCategory.SORTING,
        chapter: 1,
        icon: '/assets/images/spells/is_increasing.png',
        animation: AnimationType.CHECK,
        vfxSprite: '/assets/images/vfx/Phép Tìm Kiếm (Search Scan - Yellow).png',
        unlockQuestion: 'prog_ch1_isIncreasing',
        manaCost: 10,
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
        description: 'Sort stones by swapping adjacent pairs',
        category: SpellCategory.SORTING,
        chapter: 2,
        icon: '/assets/images/spells/bubble_sort.png',
        animation: AnimationType.SWAP,
        vfxSprite: '/assets/images/vfx/Hiệu Ứng Phép Thuật (SuccessActive Spells).png',
        unlockQuestion: 'prog_ch2_bubbleSort',
        manaCost: 20,
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
        description: 'Find a book in a sorted library efficiently',
        category: SpellCategory.SEARCHING,
        chapter: 2,
        icon: '/assets/images/spells/binary_search.png',
        animation: AnimationType.SCAN,
        vfxSprite: '/assets/images/vfx/Phép Tìm Kiếm (Search Scan - Yellow).png',
        unlockQuestion: 'prog_ch2_binarySearch',
        manaCost: 15,
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
        description: 'Reverse a linked list chain',
        category: SpellCategory.LIST_MANIPULATION,
        chapter: 3,
        icon: '/assets/images/spells/reverse_list.png',
        animation: AnimationType.TRANSFORM,
        vfxSprite: '/assets/images/vfx/Phép Cấu Trúc (LinkedTree - Green).png',
        unlockQuestion: 'prog_ch3_reverseList',
        manaCost: 25,
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
        description: 'Check if brackets are balanced using a stack',
        category: SpellCategory.STACK_QUEUE,
        chapter: 4,
        icon: '/assets/images/spells/is_balanced.png',
        animation: AnimationType.CHECK,
        vfxSprite: '/assets/images/vfx/Phép Tìm Kiếm (Search Scan - Yellow).png',
        unlockQuestion: 'prog_ch4_isBalanced',
        manaCost: 20,
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
        description: 'Insert a node into a binary search tree',
        category: SpellCategory.TREE_OPERATION,
        chapter: 5,
        icon: '/assets/images/spells/insert_bst.png',
        animation: AnimationType.INSERT,
        vfxSprite: '/assets/images/vfx/Phép Cấu Trúc (LinkedTree - Green).png',
        unlockQuestion: 'prog_ch5_insertBST',
        manaCost: 30,
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
        description: 'Insert into a hash table with collision handling',
        category: SpellCategory.HASH_TABLE,
        chapter: 6,
        icon: '/assets/images/spells/hash_insert.png',
        animation: AnimationType.INSERT,
        vfxSprite: '/assets/images/vfx/Hiệu Ứng Phép Thuật (SuccessActive Spells).png',
        unlockQuestion: 'prog_ch6_hashInsert',
        manaCost: 35,
        puzzleTypes: ['COLLISION_PHANTOM'],
        functionSignature: 'void hashInsert(HashTable* table, int key, int value)',
        starterCode: `void hashInsert(HashTable* table, int key, int value) {
    // Your code here
}`
    }
};

// Sách phép của người chơi (các phép đã mở khóa)
export interface PlayerSpellBook {
    unlockedSpells: string[];    // Spell IDs
    unlockedRunes: string[];     // Rune IDs
    equippedSpells: string[];    // Tối đa 4 phép thi triển nhanh
    currentMana: number;         // O-Points
    maxMana: number;
}
