let katexWarmupPromise: Promise<void> | null = null;
let mathQuizUiPrefetchPromise: Promise<void> | null = null;
let mathRoutePrefetchPromise: Promise<void> | null = null;
let scheduledPrefetchTimer: ReturnType<typeof setTimeout> | null = null;
let lastLoggedAdaptiveDelay: number | null = null;

export const PREFETCH_DELAY_MOUSE_MS = 120;
export const PREFETCH_DELAY_TOUCHPAD_MS = 250;
export const PREFETCH_DELAY_KEYBOARD_MS = 0;

const LATEX_PATTERN = /\$[^$]+\$|\\\(|\\\[|\\frac|\\sum|\\sqrt|\\alpha|\\beta|\\theta|\\lambda|\\pi|\\times|\\cdot|\\leq|\\geq/i;

const MATH_HEAVY_QUESTION_TYPES = new Set(['FN', 'FNS', 'FS', 'MP']);

export const containsLikelyLatex = (value: unknown, depth = 0): boolean => {
    if (value == null) return false;
    if (depth > 4) return false;

    if (typeof value === 'string') {
        return LATEX_PATTERN.test(value);
    }

    if (Array.isArray(value)) {
        return value.some(item => containsLikelyLatex(item, depth + 1));
    }

    if (typeof value === 'object') {
        const record = value as Record<string, unknown>;
        return Object.values(record).some(item => containsLikelyLatex(item, depth + 1));
    }

    return false;
};

export const questionHasLikelyLatex = (question: any): boolean => {
    if (!question || typeof question !== 'object') return false;

    const questionType = String(question.questionType ?? '').toUpperCase();
    if (MATH_HEAVY_QUESTION_TYPES.has(questionType)) return true;

    return containsLikelyLatex(question.questionContent)
        || containsLikelyLatex(question.mcqAnswers)
        || containsLikelyLatex(question.mpAnswers)
        || containsLikelyLatex(question.fsAnswers)
        || containsLikelyLatex(question.fnsAnswers)
        || containsLikelyLatex(question.fnAnswers);
};

export const questHasLikelyLatex = (quest: any): boolean => {
    if (!quest || typeof quest !== 'object') return false;

    if (containsLikelyLatex(quest.title) || containsLikelyLatex(quest.description)) {
        return true;
    }

    const questions = Array.isArray(quest.questions) ? quest.questions : [];
    return questions.some((question: unknown) => questionHasLikelyLatex(question));
};

export const preloadKatexRuntime = (): Promise<void> => {
    if (!katexWarmupPromise) {
        katexWarmupPromise = Promise.all([
            import('katex/dist/katex.min.css'),
            import('rehype-katex'),
            import('remark-math'),
            import('react-katex')
        ]).then(() => undefined);
    }

    return katexWarmupPromise;
};

export const preloadMathQuizUi = (): Promise<void> => {
    if (!mathQuizUiPrefetchPromise) {
        mathQuizUiPrefetchPromise = Promise.all([
            import('../components/ui/QuestionView/QuestionView'),
            import('../components/ui/LatexRender/QuestionLatexRender')
        ]).then(() => undefined);
    }

    return mathQuizUiPrefetchPromise;
};

export const preloadMathHeavyRoutes = (): Promise<void> => {
    if (!mathRoutePrefetchPromise) {
        mathRoutePrefetchPromise = Promise.all([
            import('../pages/StagePlay/StagePlay'),
            import('../pages/ReviewDetail/ReviewDetail')
        ]).then(() => undefined);
    }

    return mathRoutePrefetchPromise;
};

export const prefetchMathQuizExperience = (): Promise<void> =>
    Promise.all([
        preloadKatexRuntime(),
        preloadMathQuizUi(),
        preloadMathHeavyRoutes()
    ]).then(() => undefined);

export const scheduleMathPrefetch = (enabled: boolean, delayMs = 220): void => {
    if (!enabled) return;

    if (scheduledPrefetchTimer) {
        clearTimeout(scheduledPrefetchTimer);
    }

    scheduledPrefetchTimer = setTimeout(() => {
        scheduledPrefetchTimer = null;
        void prefetchMathQuizExperience();
    }, delayMs);
};

export const getAdaptiveHoverPrefetchDelay = (): number => {
    if (typeof window === 'undefined') return PREFETCH_DELAY_MOUSE_MS;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const hasTouchPoints = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
    const delay = hasFinePointer && hasTouchPoints
        ? PREFETCH_DELAY_TOUCHPAD_MS
        : PREFETCH_DELAY_MOUSE_MS;

    if (import.meta.env.DEV && lastLoggedAdaptiveDelay !== delay) {
        lastLoggedAdaptiveDelay = delay;
        console.debug('[math-prefetch] Adaptive hover delay selected', {
            delayMs: delay,
            profile: delay === PREFETCH_DELAY_TOUCHPAD_MS ? 'touchpad-hybrid' : 'desktop-mouse',
            hasFinePointer,
            maxTouchPoints: typeof navigator !== 'undefined' ? navigator.maxTouchPoints : 0
        });
    }

    // Heuristic: thiết bị có fine pointer + touch points thường là laptop/trackpad hybrid.
    return delay;
};

export const cancelScheduledMathPrefetch = (): void => {
    if (!scheduledPrefetchTimer) return;
    clearTimeout(scheduledPrefetchTimer);
    scheduledPrefetchTimer = null;
};
