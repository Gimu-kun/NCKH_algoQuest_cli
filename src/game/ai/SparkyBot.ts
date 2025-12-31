/**
 * Sparky AI Bot - Trợ Lý ML
 * Cung cấp gợi ý, phát hiện lỗi và sinh câu hỏi động
 */

import { BloomLevel, QuestionType } from '../../data/models/Question';

export interface SparkyHint {
    type: 'SYNTAX' | 'MEMORY' | 'LOGIC' | 'GENERAL';
    message: string;
    severity: 'INFO' | 'WARNING' | 'ERROR';
}

export class SparkyBot {
    // Theo dõi điểm yếu
    private weaknesses: Map<string, number> = new Map();

    /**
     * Phân tích câu trả lời sai và cung cấp gợi ý theo ngữ cảnh
     */
    provideHint(
        questionType: QuestionType,
        topic: string,
        wrongAnswer: any,
        correctAnswer: any
    ): SparkyHint {
        // Theo dõi điểm yếu
        const current = this.weaknesses.get(topic) || 0;
        this.weaknesses.set(topic, current + 1);

        // Tạo gợi ý dựa trên loại câu hỏi
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
                    message: '💡 Not quite! Review the concept and try again.',
                    severity: 'INFO'
                };
        }
    }

    /**
     * Cung cấp gợi ý cho câu hỏi trắc nghiệm
     */
    private getMCQHint(topic: string, _wrong: any, _correct: any): SparkyHint {
        const hints: Record<string, string> = {
            'Stack': '💡 Remember: Stack is LIFO (Last In, First Out), like a stack of plates!',
            'Queue': '💡 Remember: Queue is FIFO (First In, First Out), like a line of people!',
            'Binary Search': '💡 Binary Search only works on SORTED arrays. It divides the search space in half each time!',
            'Bubble Sort': '💡 Bubble Sort compares adjacent elements and swaps them if needed.',
            'Big O': '💡 Focus on the DOMINANT term and ignore constants!'
        };

        return {
            type: 'GENERAL',
            message: hints[topic] || `💡 Review the ${topic} concept!`,
            severity: 'INFO'
        };
    }

    /**
     * Cung cấp gợi ý cho câu hỏi điền khuết
     */
    private getFillBlankHint(_topic: string): SparkyHint {
        return {
            type: 'SYNTAX',
            message: '💡 Check your syntax! Make sure semicolons and brackets are in place.',
            severity: 'WARNING'
        };
    }

    /**
     * Provide hints for matching questions
     */
    private getMatchingHint(_topic: string): SparkyHint {
        return {
            type: 'GENERAL',
            message: '💡 Think about the relationships between concepts!',
            severity: 'INFO'
        };
    }

    /**
     * Analyze code and provide error messages
     * Simulates cppcheck (syntax), valgrind (memory), and unit tests (logic)
     */
    analyzeCode(code: string, stage: 'SYNTAX' | 'MEMORY' | 'LOGIC'): SparkyHint | null {
        switch (stage) {
            case 'SYNTAX':
                return this.checkSyntax(code);
            case 'MEMORY':
                return this.checkMemory(code);
            case 'LOGIC':
                // Logic checking is done via actual test execution
                return null;
        }
    }

    /**
     * Phase 1: Syntax checking (simulated cppcheck)
     */
    private checkSyntax(code: string): SparkyHint | null {
        // Check for common syntax errors
        const lines = code.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Check for missing semicolons (simple heuristic)
            if (line.length > 0 &&
                !line.endsWith(';') &&
                !line.endsWith('{') &&
                !line.endsWith('}') &&
                !line.startsWith('//') &&
                !line.startsWith('if') &&
                !line.startsWith('for') &&
                !line.startsWith('while') &&
                !line.includes('return') === false) {
                return {
                    type: 'SYNTAX',
                    message: `💡 Syntax Error! Missing semicolon at line ${i + 1}?`,
                    severity: 'ERROR'
                };
            }

            // Check for unbalanced brackets
            const openBrackets = (line.match(/\{/g) || []).length;
            const closeBrackets = (line.match(/\}/g) || []).length;
            if (openBrackets !== closeBrackets) {
                // This is a simple check; real validation would track across lines
            }
        }

        return null; // No syntax errors found
    }

    /**
     * Phase 2: Memory checking (simulated valgrind)
     */
    private checkMemory(code: string): SparkyHint | null {
        // Check for new without delete
        const hasNew = code.includes('new ');
        const hasDelete = code.includes('delete');

        if (hasNew && !hasDelete) {
            return {
                type: 'MEMORY',
                message: '💡 Memory Leak! You used `new` but forgot to `delete` the allocated memory!',
                severity: 'ERROR'
            };
        }

        return null; // No memory errors found
    }

    /**
     * Detect player weaknesses and suggest spontaneous quests
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
                questSuggestion: `💡 I noticed you're struggling with "${weakestTopic}". NPC Linh has a spontaneous quest to help you practice!`
            };
        }

        return null;
    }

    /**
     * Generate a new question based on patterns (simulated ML)
     * In a real implementation, this would use an ML model
     */
    generateQuestion(chapter: number, topic: string, bloomLevel: BloomLevel): any {
        // For now, this is simulated
        // In production, this would:
        // 1. Load the ML model trained on 1830+ questions
        // 2. Generate a new question following the learned patterns
        // 3. Return the generated question

        console.log(`[Sparky ML] Generating ${bloomLevel} question for ${topic} (Chapter ${chapter})`);

        return {
            id: `ml_gen_${Date.now()}`,
            type: QuestionType.MULTIPLE_CHOICE,
            question: `[ML Generated] Question about ${topic}`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            chapter,
            bloomLevel,
            topic
        };
    }

    /**
     * Get a motivational message
     */
    getMotivation(): string {
        const messages = [
            '💡 Keep going! You\'re doing great!',
            '💡 Every bug you fix makes you stronger!',
            '💡 The Logic Network is counting on you!',
            '💡 Remember: even the greatest programmers make mistakes!',
            '💡 You\'re one step closer to mastering algorithms!'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Singleton instance
export const sparky = new SparkyBot();
