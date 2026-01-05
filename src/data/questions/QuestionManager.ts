/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HỆ THỐNG QUẢN LÝ CÂU HỎI THÔNG MINH (Intelligent Question Manager)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Module này quản lý việc chọn câu hỏi PHÙ HỢP với:
 * - Monster's Bloom Level (Tier của quái → độ khó câu hỏi).
 * - Dungeon Chapter (Chapter 1-3 → topic khác nhau).
 * - Educational Progression (Từ dễ → khó theo Bloom's Taxonomy).
 * 
 * KỸ THUẬT EDUCATIONAL DESIGN:
 * - Bloom's Taxonomy Integration: 4 levels (REMEMBER → UNDERSTAND → APPLY → ANALYZE).
 * - Adaptive Difficulty: Monster tier ánh xạ trực tiếp lên Bloom level.
 * - Content-Based Filtering: Chỉ hiển thị câu hỏi của chapter hiện tại.
 * 
 * BLOOM LEVEL MAPPING:
 * - Tier 1 Minions (R) → REMEMBER questions (10 points).
 * - Tier 2 Minions (U) → UNDERSTAND questions (15 points).
 * - Tier 3 Elites (AP) → APPLY questions (20 points).
 * - Tier 4 Boss (AN) → ANALYZE questions (30 points).
 * 
 * FLOW TÍCH HỢP:
 * MonsterSpawner → spawn monster với Bloom level →
 * QuestionManager → filter questions theo Bloom →
 * QuizBattle → hiển thị câu hỏi phù hợp.
 * 
 * @module QuestionManager
 * @category Core Systems / Educational
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { CHAPTER_1_QUESTIONS } from '../questions/chapter1';
import { CHAPTER_2_QUESTIONS } from '../questions/chapter2';
import { CHAPTER_3_QUESTIONS } from '../questions/chapter3';
import { MonsterSpawner } from '../../game/spawner/MonsterSpawner';
import type { Question } from '../models/Question';
import { BloomLevel } from '../models/Question';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUESTION BANKS REGISTRY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Registry trung tâm ánh xạ số chương với ngân hàng câu hỏi (Question Banks).
 * 
 * CẤU TRÚC:
 * - Chapter 1: Algorithm Complexity (Big O, Time/Space Analysis).
 * - Chapter 2: Sorting & Searching (Bubble, Merge, Quick, Binary Search).
 * - Chapter 3: Linked Lists (Singly, Doubly, Circular, Operations).
 * 
 * MỖI BANK CÓ: 40 questions (10R + 10U + 10AP + 10AN).
 */
const QUESTION_BANKS = {
    1: CHAPTER_1_QUESTIONS,
    2: CHAPTER_2_QUESTIONS,
    3: CHAPTER_3_QUESTIONS,
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY CÂU HỎI PHÙ HỢP CHO MONSTER (Get Appropriate Questions)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Chọn ra SUBSET câu hỏi phù hợp với Bloom level của monster.
 * 
 * THUẬT TOÁN - FILTERING PIPELINE:
 * 1. Tra cứu monster data từ MonsterSpawner.getMonsterData().
 * 2. Extract monster's Bloom levels từ attackPattern.
 * 3. Parse chapter number từ dungeonId (regex extract digits).
 * 4. Lấy question bank tương ứng với chapter.
 * 5. Filter questions theo Bloom level matching:
 *    - Chỉ giữ lại questions có bloomLevel ∈ monster.bloomLevels.
 * 6. Fallback nếu empty → return ALL questions của chapter.
 * 
 * ĐỘ PHỨC TẠP:
 * - Time: O(n) - n là số questions trong chapter (~40).
 * - Space: O(m) - m là số questions match Bloom level (trung bình ~10).
 * 
 * CƠ SỞ GIÁO DỤC (EDUCATIONAL RATIONALE):
 * - Đảm bảo tiến độ độ khó: Quái dễ → Câu hỏi dễ (Easy monsters → Easy questions).
 * - Tránh gây ức chế (Avoid Frustration): Không đưa câu hỏi cấp Boss cho quái thường.
 * - Duy trì sự tương tác (Maintain Engagement): Không đưa câu quá dễ cho trận Boss.
 * 
 * @param {string} monsterId - ID của quái vật (vd: 'logic_slime', 'initialization_golem').
 * @param {string} dungeonId - ID của dungeon (vd: 'dungeon_1', 'temple_of_guidance').
 * @returns {Question[]} Mảng câu hỏi đã lọc khớp với Bloom level của quái vật.
 * 
 * @example
 * // Logic Slime (R tier) trong Dungeon 1
 * const questions = getQuestionsForMonster('logic_slime', 'dungeon_1');
 * // → Return ~10 REMEMBER questions về Algorithm Complexity
 * 
 * @example
 * // Boss (AN tier) trong Dungeon 2
 * const bossQuestions = getQuestionsForMonster('chaotic_boss', 'dungeon_2');
 * // → Return ~10 ANALYZE questions về Sorting/Searching
 */
export function getQuestionsForMonster(monsterId: string, dungeonId: string): Question[] {
    // STEP 1: Tra cứu monster data
    const monsterData = MonsterSpawner.getMonsterData(monsterId);

    // STEP 2: Fallback nếu monster không tồn tại
    if (!monsterData) {
        console.warn(`Unknown monster: ${monsterId}, using default questions`);
        return CHAPTER_1_QUESTIONS.questions;
    }

    // STEP 3: Parse chapter từ dungeon ID
    // Regex \D = non-digit → replace → chỉ giữ số
    // 'dungeon_1' → '1', 'temple_of_guidance' → '' (fallback 1)
    const chapter = parseInt(dungeonId.replace(/\D/g, '')) || 1;
    const questionBank = QUESTION_BANKS[chapter as keyof typeof QUESTION_BANKS] || CHAPTER_1_QUESTIONS;

    // STEP 4: Extract Bloom levels từ monster attack pattern
    const bloomLevels = monsterData.attackPattern.bloomLevels;

    // STEP 5: Filter questions theo Bloom level
    // Chỉ giữ questions có bloomLevel nằm trong array monster's bloomLevels
    const appropriateQuestions = questionBank.questions.filter(q =>
        bloomLevels.includes(q.bloomLevel)
    );

    // STEP 6: Safety fallback - nếu không tìm thấy câu nào
    if (appropriateQuestions.length === 0) {
        console.warn(
            `No questions found for monster ${monsterId} with Bloom levels ${bloomLevels}, ` +
            `using all chapter ${chapter} questions`
        );
        return questionBank.questions;
    }

    return appropriateQuestions;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY 1 CÂU HỎI NGẪU NHIÊN (Get Random Question)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Wrapper function lấy 1 câu ngẫu nhiên từ filtered pool.
 * 
 * THUẬT TOÁN:
 * 1. Gọi getQuestionsForMonster() để lấy appropriate pool.
 * 2. Generate random index: Math.floor(random * length).
 * 3. Return question tại index đó.
 * 
 * ĐỘ PHỨC TẠP:
 * - Time: O(n) - kế thừa từ getQuestionsForMonster.
 * - Space: O(1) - chỉ return 1 reference.
 * 
 * USE CASE:
 * - Chiến đấu 1 câu hỏi (Single question combat).
 * - Spawn nhanh khi kiểm thử (Quick spawn in testing).
 * 
 * @param {string} monsterId - Monster ID.
 * @param {string} dungeonId - Dungeon ID.
 * @returns {Question | null} 1 random question hoặc null nếu pool empty.
 * 
 * @example
 * const question = getRandomQuestionForMonster('syntax_bat', 'dungeon_1');
 * // → 1 UNDERSTAND question ngẫu nhiên
 */
export function getRandomQuestionForMonster(monsterId: string, dungeonId: string): Question | null {
    const questions = getQuestionsForMonster(monsterId, dungeonId);

    if (questions.length === 0) {
        return null;
    }

    // Random selection với uniform distribution
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY QUESTION BANK THEO CHAPTER (Get Question Bank)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Truy cập trực tiếp (Direct Access) vào question bank của 1 chapter.
 * 
 * USE CASE:
 * - Chế độ luyện tập (Training Mode): Người chơi muốn luyện tập chương cụ thể.
 * - Thống kê: Đếm số câu hỏi khả dụng.
 * - Xem trước nội dung (Content Preview): Hiển thị câu hỏi trước khi vào ngục tối.
 * 
 * @param {number} chapter - Chapter number (1-3, có thể mở rộng đến 7).
 * @returns {QuestionBank} Full question bank object.
 */
export function getQuestionBankByChapter(chapter: number) {
    return QUESTION_BANKS[chapter as keyof typeof QUESTION_BANKS] || CHAPTER_1_QUESTIONS;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY CÂU HỎI THEO BLOOM LEVEL (Get Questions by Bloom)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Filter questions trong 1 chapter theo Bloom level cụ thể.
 * 
 * THUẬT TOÁN:
 * 1. Lấy question bank của chapter.
 * 2. Filter theo exact Bloom level match.
 * 
 * ĐỘ PHỨC TẠP:
 * - Time: O(n) - Linear scan qua n questions.
 * - Space: O(m) - m questions match level.
 * 
 * USE CASE:
 * - Chế độ luyện tập (Practice Mode): "Tôi muốn làm 10 câu APPLY của Chương 2".
 * - Độ khó tùy chỉnh (Custom Difficulty): Giáo viên tạo bài kiểm tra với tỉ lệ Bloom cụ thể.
 * - Phân tích (Analytics): Đánh giá hiệu suất theo từng cấp độ Bloom.
 * 
 * @param {number} chapter - Chapter number.
 * @param {BloomLevel} bloomLevel - Bloom level enum (REMEMBER/UNDERSTAND/APPLY/ANALYZE).
 * @returns {Question[]} Filtered questions array.
 * 
 * @example
 * const applyQuestions = getQuestionsByBloomLevel(2, BloomLevel.APPLY);
 * // → 10 APPLY questions về Sorting/Searching
 */
export function getQuestionsByBloomLevel(chapter: number, bloomLevel: BloomLevel): Question[] {
    const questionBank = getQuestionBankByChapter(chapter);
    return questionBank.questions.filter(q => q.bloomLevel === bloomLevel);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LẤY THỐNG KÊ CÂU HỎI (Get Question Statistics)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHỨC NĂNG:
 * Tính toán phân bố questions theo Bloom levels trong 1 chapter.
 * 
 * THUẬT TOÁN:
 * 1. Lấy all questions của chapter.
 * 2. Count questions theo từng Bloom level (4 filters).
 * 3. Return object với breakdown.
 * 
 * ĐỘ PHỨC TẠP:
 * - Time: O(4n) = O(n) - 4 lần filter qua n questions.
 * - Space: O(1) - chỉ return object với 5 fields.
 * 
 * OPTIMIZE:
 * - Có thể optimize bằng single pass counting thay vì 4 filters.
 * - Nhưng hiện tại giữ nguyên vì n = 40 (rất nhỏ).
 * 
 * USE CASE:
 * - Admin Dashboard: "Chapter 2 có bao nhiêu câu mỗi loại?".
 * - Kiểm tra cân bằng (Balance Checking): Đảm bảo phân bố 10-10-10-10.
 * - Progress Tracking: "Đã làm được 7/10 ANALYZE questions".
 * 
 * @param {number} chapter - Chapter number.
 * @returns {Object} Statistics với total và breakdown theo Bloom.
 * 
 * @example
 * const stats = getQuestionStats(1);
 * // → { total: 40, remember: 10, understand: 10, apply: 10, analyze: 10 }
 */
export function getQuestionStats(chapter: number) {
    const questionBank = getQuestionBankByChapter(chapter);
    const questions = questionBank.questions;

    return {
        total: questions.length,
        remember: questions.filter(q => q.bloomLevel === BloomLevel.REMEMBER).length,
        understand: questions.filter(q => q.bloomLevel === BloomLevel.UNDERSTAND).length,
        apply: questions.filter(q => q.bloomLevel === BloomLevel.APPLY).length,
        analyze: questions.filter(q => q.bloomLevel === BloomLevel.ANALYZE).length,
    };
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * USAGE EXAMPLES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * // TRONG QUIZBATTLE.TSX - Load câu hỏi cho combat
 * const appropriateQuestions = getQuestionsForMonster(monsterId, dungeonId);
 * const randomQuestion = appropriateQuestions[Math.floor(Math.random() * appropriateQuestions.length)];
 * 
 * // TRONG TRAINING MODE - Practice specific Bloom level
 * const practiceQuestions = getQuestionsByBloomLevel(2, BloomLevel.APPLY);
 * 
 * // TRONG ADMIN PANEL - View content distribution
 * const stats = getQuestionStats(1);
 * console.log(`Chapter 1 has ${stats.total} questions`);
 * console.log(`Bloom distribution: R${stats.remember} U${stats.understand} AP${stats.apply} AN${stats.analyze}`);
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
