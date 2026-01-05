/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TRỢ LÝ AI SPARKY (Sparky AI Bot)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Sparky là "linh hồn" của hệ thống hỗ trợ giáo dục (Educational Support System). Sparky đóng vai trò:
 * - Mentor: Cung cấp gợi ý (Hints) khi người chơi gặp khó khăn.
 * - Code Reviewer: Phân tích lỗi cú pháp (Syntax) và logic trong phép thuật người chơi viết.
 * - Motivator: Động viên tinh thần người chơi.
 * - Adaptive System: Theo dõi điểm yếu (Weakness Tracking) để đề xuất nhiệm vụ phù hợp.
 * 
 * TÍNH NĂNG:
 * - Phân tích ngữ cảnh để đưa ra gợi ý thông minh (Context-Aware Hints).
 * - Theo dõi và phân tích điểm yếu của người chơi theo chủ đề.
 * - Giả lập công cụ phân tích tĩnh (Static Analysis Tool) để kiểm tra code.
 * 
 * THUẬT TOÁN & KỸ THUẬT:
 * - Rule-Based System: Hệ thống luật để kiểm tra Syntax và đưa ra gợi ý tĩnh.
 * - Pattern Matching: Dùng Regex để tìm lỗi code phổ biến (thiếu chấm phẩy, quên delete...).
 * - Singleton Pattern: Chỉ có 1 instance của Sparky tồn tại toàn cục.
 * - Heuristics: Các quy tắc suy luận đơn giản để phát hiện lỗi logic.
 * 
 * FLOW GỢI Ý:
 * Player sai -> Sparky phân tích Topic -> Tra cứu Hint Database -> Trả về gợi ý phù hợp.
 * 
 * @module SparkyBot
 * @category AI Assistant
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { BloomLevel, QuestionType } from '../../data/models/Question';

export interface SparkyHint {
    type: 'SYNTAX' | 'MEMORY' | 'LOGIC' | 'GENERAL';
    message: string;
    severity: 'INFO' | 'WARNING' | 'ERROR';
}

export class SparkyBot {
    // Lưu trữ tần suất sai theo chủ đề (Weakness Tracking)
    private weaknesses: Map<string, number> = new Map();

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * CUNG CẤP GỢI Ý (Provide Hint)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Phân tích ngữ cảnh câu trả lời sai để đưa ra gợi ý hữu ích nhất.
     * 
     * FLOW:
     * 1. Ghi nhận lỗi vào Weakness Map (Weakness Tracking).
     * 2. Switch theo loại câu hỏi (MCQ, Fill-Blank...).
     * 3. Trả về Hint Object.
     * 
     * @param questionType - Loại câu hỏi.
     * @param topic - Chủ đề (VD: 'Binary Search').
     * @param wrongAnswer - Câu trả lời sai của user.
     * @param correctAnswer - Câu trả lời đúng.
     */
    provideHint(
        questionType: QuestionType,
        topic: string,
        wrongAnswer: any,
        correctAnswer: any
    ): SparkyHint {
        // Cập nhật điểm yếu
        const current = this.weaknesses.get(topic) || 0;
        this.weaknesses.set(topic, current + 1);

        // Routing theo loại câu hỏi
        switch (questionType) {
            case QuestionType.MULTIPLE_CHOICE:
                return this.getMCQHint(topic, wrongAnswer, correctAnswer);

            case QuestionType.FILL_BLANK:
                return this.getFillBlankHint(topic);

            case QuestionType.MATCHING:
                return this.getMatchingHint(topic);

            default:
                return {
                    type: 'GENERAL',
                    message: '💡 Chưa chính xác! Hãy xem lại lý thuyết và thử lại nhé.',
                    severity: 'INFO'
                };
        }
    }

    /**
     * Gợi ý cho Trắc nghiệm (MCQ)
     * Dựa trên Hardcoded Rules cho các topic phổ biến.
     */
    private getMCQHint(topic: string, _wrong: any, _correct: any): SparkyHint {
        const hints: Record<string, string> = {
            'Stack': '💡 Gợi ý: Stack hoạt động theo LIFO (Vào sau, Ra trước), giống như xếp chồng đĩa!',
            'Queue': '💡 Gợi ý: Queue hoạt động theo FIFO (Vào trước, Ra trước), giống như xếp hàng mua vé!',
            'Binary Search': '💡 Gợi ý: Tìm kiếm nhị phân chỉ hoạt động trên mảng ĐÃ SẮP XẾP. Nó chia đôi phạm vi tìm kiếm mỗi bước!',
            'Bubble Sort': '💡 Gợi ý: Bubble Sort so sánh hai phần tử liền kề và đổi chỗ nếu chúng sai thứ tự.',
            'Big O': '💡 Gợi ý: Hãy tập trung vào thành phần có bậc cao nhất (Dominant Term) và bỏ qua hệ số hằng số!'
        };

        return {
            type: 'GENERAL',
            message: hints[topic] || `💡 Hãy ôn lại kiến thức về ${topic} nhé!`,
            severity: 'INFO'
        };
    }

    /**
     * Gợi ý cho Điền khuyết (Coding Syntax)
     */
    private getFillBlankHint(_topic: string): SparkyHint {
        return {
            type: 'SYNTAX',
            message: '💡 Kiểm tra kỹ cú pháp! Đừng quên dấu chấm phẩy ; hoặc ngoặc {} nhé.',
            severity: 'WARNING'
        };
    }

    /**
     * Gợi ý cho câu hỏi Nối (Matching)
     */
    private getMatchingHint(_topic: string): SparkyHint {
        return {
            type: 'GENERAL',
            message: '💡 Hãy suy nghĩ về mối quan hệ logic giữa các khái niệm!',
            severity: 'INFO'
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * PHÂN TÍCH CODE (Analyze Code)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Giả lập một công cụ phân tích tĩnh (Static Analysis Tool) để bắt lỗi code của người chơi.
     * 
     * STAGES:
     * - USER (Syntax): Kiểm tra lỗi cú pháp cơ bản.
     * - MEMORY: Kiểm tra rò rỉ bộ nhớ (Memory Leak).
     * - LOGIC: Kiểm tra pattern algorithm (Heuristic check dựa trên bài toán).
     */
    analyzeCode(code: string, stage: 'SYNTAX' | 'MEMORY' | 'LOGIC', contextId?: string): SparkyHint | null {
        switch (stage) {
            case 'SYNTAX':
                return this.checkSyntax(code);
            case 'MEMORY':
                return this.checkMemory(code);
            case 'LOGIC':
                return this.checkLogic(code, contextId);
        }
    }

    /**
     * Phase 1: Syntax Checking (Giả lập CppCheck/ESLint)
     * - Kiểm tra thiếu chấm phẩy.
     * - Kiểm tra ngoặc không đóng/mở khớp.
     */
    private checkSyntax(code: string): SparkyHint | null {
        const lines = code.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Heuristic đơn giản: Dòng lệnh phải kết thúc bằng ; hoặc { }
            // Bỏ qua comment, if, for, while, và function definition
            if (line.length > 0 &&
                !line.endsWith(';') &&
                !line.endsWith('{') &&
                !line.endsWith('}') &&
                !line.startsWith('//') &&
                !line.startsWith('if') &&
                !line.startsWith('for') &&
                !line.startsWith('while') &&
                !line.includes('return') === false) { // Logic check hơi lỏng lẻo ở đây để demo

                // Cần tinh chỉnh thêm cho sử dụng thực tế (Refinements needed)
                return {
                    type: 'SYNTAX',
                    message: `💡 Lỗi cú pháp! Có vẻ thiếu dấu chấm phẩy ở dòng ${i + 1}?`,
                    severity: 'ERROR'
                };
            }

            // Check ngoặc (đếm số lượng, chưa check lồng - Stack-based bracket checking can be used)
            // const openBrackets = (line.match(/\{/g) || []).length;
            // const closeBrackets = (line.match(/\}/g) || []).length;
        }

        return null; // Không tìm thấy lỗi (hoặc bot chưa đủ thông minh ^^)
    }

    /**
     * Phase 2: Memory Checking (Giả lập Valgrind)
     * - Kiểm tra pattern: Có `new` mà không có `delete`.
     */
    private checkMemory(code: string): SparkyHint | null {
        const hasNew = code.includes('new ');
        const hasDelete = code.includes('delete');

        if (hasNew && !hasDelete) {
            return {
                type: 'MEMORY',
                message: '💡 Rò rỉ bộ nhớ (Memory Leak)! Bạn đã dùng `new` để cấp phát nhưng quên `delete` giải phóng vùng nhớ!',
                severity: 'ERROR'
            };
        }

        return null;
    }

    /**
     * Phase 3: Logic Checking (Heuristic Pattern Matching)
     * Kiểm tra xem code có chứa các từ khóa quan trọng của thuật toán không.
     */
    private checkLogic(code: string, spellId?: string): SparkyHint | null {
        if (!spellId) return null;

        const normalizedCode = code.toLowerCase();

        // RULES DEFINITION
        const rules: Record<string, { required: string[], message: string }> = {
            'spell_bubble_sort': {
                required: ['swap', 'for'],
                message: 'Thuật toán Bubble Sort cần vòng lặp và thao tác đổi chỗ (swap)!'
            },
            'spell_binary_search': {
                required: ['mid', '/ 2', 'while', '<', '>'],
                message: 'Binary Search cần vòng lặp (hoặc đệ quy), tính mid và so sánh (<, >)!'
            },
            'spell_is_increasing': {
                required: ['for', 'if', 'return'],
                message: 'Cần duyệt mảng (for) và kiểm tra điều kiện (if)!'
            },
            'spell_reverse_list': {
                required: ['next', 'prev', 'curr', 'while'],
                message: 'Đảo ngược danh sách cần thao tác con trỏ (next, prev) và duyệt (while)!'
            },
            'spell_insert_bst': {
                required: ['root', '<', '>', 'new', 'return'],
                message: 'Chèn BST cần so sánh giá trị (<, >) và tạo node mới (new)!'
            }
        };

        const rule = rules[spellId];
        if (rule) {
            const missing = rule.required.find(keyword => !normalizedCode.includes(keyword));
            if (missing) {
                return {
                    type: 'LOGIC',
                    message: `💡 Logic chưa đủ: ${rule.message} (Thiếu: '${missing}')`,
                    severity: 'ERROR'
                };
            }
        }

        return null; // Passed logic check
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * PHÁT HIỆN ĐIỂM YẾU (Detect Weakness)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Dựa vào lịch sử sai (Weaknesses Map), đề xuất nhiệm vụ bổ trợ.
     * 
     * LOGIC:
     * Nếu sai >= 3 lần ở 1 Topic -> Trigger Spontaneous Quest.
     */
    detectWeakness(): { topic: string; questSuggestion: string } | null {
        let weakestTopic = '';
        let maxErrors = 0;

        this.weaknesses.forEach((count, topic) => {
            if (count > maxErrors) {
                maxErrors = count;
                weakestTopic = topic;
            }
        });

        if (maxErrors >= 3) {
            return {
                topic: weakestTopic,
                questSuggestion: `💡 Mình thấy bạn đang gặp khó khăn với chủ đề "${weakestTopic}". Hãy gặp NPC Linh để nhận nhiệm vụ luyện tập thêm nhé!`
            };
        }

        return null;
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * SINH CÂU HỎI ĐỘNG (Generative AI Simulation)
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * MÔ TẢ:
     * Trong phiên bản Production, hàm này sẽ gọi tới LLM (Gemini/GPT) để sinh câu hỏi mới.
     * Hiện tại return dummy data để demo Flow.
     */
    generateQuestion(chapter: number, topic: string, bloomLevel: BloomLevel): any {
        console.log(`[Sparky ML] Generating ${bloomLevel} question for ${topic} (Chapter ${chapter})`);

        return {
            id: `ml_gen_${Date.now()}`,
            type: QuestionType.MULTIPLE_CHOICE,
            question: `[ML Generated] Câu hỏi mới về ${topic} (Độ khó: ${bloomLevel})`,
            options: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
            correctAnswer: 0,
            chapter,
            bloomLevel,
            topic
        };
    }

    /**
     * Lấy thông điệp động viên (Hệ thống khích lệ - Motivation System)
     */
    getMotivation(): string {
        const messages = [
            '💡 Cố lên! Bạn đang làm rất tốt!',
            '💡 Mỗi con bọ (bug) bạn sửa giúp bạn mạnh mẽ hơn!',
            '💡 Mạng lưới Logic đang trông chờ vào bạn!',
            '💡 Nhớ rằng: Ngay cả những lập trình viên giỏi nhất cũng mắc lỗi!',
            '💡 Bạn đang tiến gần hơn tới danh hiệu Algorithm Wizard!'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Singleton Instance export
export const sparky = new SparkyBot();
