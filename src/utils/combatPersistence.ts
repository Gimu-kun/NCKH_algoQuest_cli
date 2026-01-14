/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMBAT STATE PERSISTENCE - Lưu Trạng Thái Chiến Đấu
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Lưu và phục hồi trạng thái combat khi người chơi reload trang (F5).
 * Tránh mất tiến trình khi tab bị đóng nhầm hoặc trình duyệt crash.
 * 
 * KỸ THUẬT:
 * - localStorage Web API
 * - JSON serialization
 * - TTL (Time To Live) - Tự động xóa sau 1 giờ không hoạt động
 * 
 * @module CombatPersistence
 * @category Game State Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { Question } from '../data/models/Question';

// Interface cho saved state
export interface SavedCombatState {
    monsterId: string;
    currentQuestionId: string;      // ID của câu hỏi hiện tại
    selectedAnswer: number | null;  // Index của đáp án đã chọn
    showFeedback: boolean;          // Đang hiển thị feedback?
    isCorrect: boolean;             // Câu trả lời đúng hay sai?
    timestamp: number;              // Thời gian lưu (epoch ms)
}

const STORAGE_KEY_PREFIX = 'combat_state_';
const TTL_MS = 3600000; // 1 giờ (1 hour)

/**
 * Lưu trạng thái combat vào localStorage
 * 
 * ALGORITHM:
 * 1. Serialize state object thành JSON string
 * 2. Thêm timestamp để tracking TTL
 * 3. Lưu vào localStorage với key unique theo monsterId
 * 
 * @param monsterId - ID của monster đang chiến đấu
 * @param currentQuestion - Câu hỏi hiện tại
 * @param selectedAnswer - Index đáp án đã chọn
 * @param showFeedback - Trạng thái feedback UI
 * @param isCorrect - Kết quả trả lời
 */
export function saveCombatState(
    monsterId: string,
    currentQuestion: Question | null,
    selectedAnswer: number | null,
    showFeedback: boolean,
    isCorrect: boolean
): void {
    if (!currentQuestion) return; // Không lưu nếu chưa có câu hỏi

    try {
        const state: SavedCombatState = {
            monsterId,
            currentQuestionId: currentQuestion.id,
            selectedAnswer,
            showFeedback,
            isCorrect,
            timestamp: Date.now()
        };

        const key = `${STORAGE_KEY_PREFIX}${monsterId}`;
        localStorage.setItem(key, JSON.stringify(state));
        console.log('[Persistence] Combat state saved for', monsterId);
    } catch (error) {
        console.error('[Persistence] Failed to save combat state:', error);
    }
}

/**
 * Load trạng thái combat từ localStorage
 * 
 * ALGORITHM:
 * 1. Lấy JSON string từ localStorage
 * 2. Parse thành object
 * 3. Validate TTL (xóa nếu quá cũ)
 * 4. Return state hoặc null
 * 
 * @param monsterId - ID của monster
 * @returns Saved state hoặc null nếu không có/expired
 */
export function loadCombatState(monsterId: string): SavedCombatState | null {
    try {
        const key = `${STORAGE_KEY_PREFIX}${monsterId}`;
        const data = localStorage.getItem(key);

        if (!data) {
            console.log('[Persistence] No saved state found for', monsterId);
            return null;
        }

        const state: SavedCombatState = JSON.parse(data);

        // Kiểm tra TTL - Xóa nếu quá cũ (stale data protection)
        const age = Date.now() - state.timestamp;
        if (age > TTL_MS) {
            console.log('[Persistence] Saved state expired (age:', Math.floor(age / 60000), 'minutes)');
            clearCombatState(monsterId);
            return null;
        }

        console.log('[Persistence] Combat state loaded for', monsterId);
        return state;
    } catch (error) {
        console.error('[Persistence] Failed to load combat state:', error);
        return null;
    }
}

/**
 * Xóa trạng thái combat đã lưu
 * 
 * USE CASES:
 * - Khi combat kết thúc (victory/defeat)
 * - Khi người chơi rời dungeon
 * - Khi data expired
 * 
 * @param monsterId - ID của monster
 */
export function clearCombatState(monsterId: string): void {
    try {
        const key = `${STORAGE_KEY_PREFIX}${monsterId}`;
        localStorage.removeItem(key);
        console.log('[Persistence] Combat state cleared for', monsterId);
    } catch (error) {
        console.error('[Persistence] Failed to clear combat state:', error);
    }
}

/**
 * Xóa tất cả combat states đã lưu
 * 
 * USE CASE: Clean up khi player logout hoặc clear data
 */
export function clearAllCombatStates(): void {
    try {
        const keys = Object.keys(localStorage);
        const combatKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));

        combatKeys.forEach(key => localStorage.removeItem(key));
        console.log('[Persistence] Cleared', combatKeys.length, 'combat states');
    } catch (error) {
        console.error('[Persistence] Failed to clear all combat states:', error);
    }
}
