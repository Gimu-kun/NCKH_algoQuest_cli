import React, { lazy, Suspense, useMemo, useState } from 'react';
import './AlgorithmChallengeRunner.css';
import type {
    AlgorithmChallenge,
    AlgorithmChallengeSet,
    EasyChallenge,
    HardChallenge,
    MediumChallenge
} from '../../data/study_materials/challenge_types/types';
import {
    isEasyChallenge,
    isHardChallenge,
    isMediumChallenge
} from '../../data/study_materials/challenge_types/types';
import { usePlayerStore } from '../../store/playerStore';
import { ResourceType } from '../../data/models/Item';
import {
    runChallengeEscalation,
    selectChallengeActivities,
    type ChallengeActType,
    type ChallengeActivityCandidate
} from '../../services/learning/challengeOrchestrationService';
const SortingVisualizer = lazy(() => import('../visualizations/sorting/SortingVisualizer'));
const BinarySearchVisualizer = lazy(() => import('../visualizations/searching/BinarySearchVisualizer'));
const LinearSearchVisualizer = lazy(() => import('../visualizations/searching/LinearSearchVisualizer'));
const StackVisualizer = lazy(() => import('../visualizations/data-structures/StackVisualizer'));
const QueueVisualizer = lazy(() => import('../visualizations/data-structures/QueueVisualizer'));
const LinkedListVisualizer = lazy(() => import('../visualizations/data-structures/LinkedListVisualizer'));
const BSTVisualizer = lazy(() => import('../visualizations/data-structures/BSTVisualizer'));

interface Props {
    challengeSet: AlgorithmChallengeSet;
    algorithmKey?: string;
}

const prettyDifficulty = (difficulty: AlgorithmChallenge['difficulty']): string => {
    if (difficulty === 'easy') return 'Dễ';
    if (difficulty === 'medium') return 'Trung bình';
    return 'Khó';
};

const cloneState = (state: Record<string, unknown>): Record<string, unknown> =>
    JSON.parse(JSON.stringify(state)) as Record<string, unknown>;

const sortingFromDemoKey: Record<string, 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 'shell' | 'shaker' | 'interchange' | 'binaryInsertion' | 'counting' | 'radix'> = {
    BubbleSort: 'bubble',
    SelectionSort: 'selection',
    InsertionSort: 'insertion',
    MergeSort: 'merge',
    QuickSort: 'quick',
    HeapSort: 'heap',
    ShellSort: 'shell',
    ShakerSort: 'shaker',
    InterchangeSort: 'interchange',
    BinaryInsertionSort: 'binaryInsertion',
    CountingSort: 'counting',
    RadixSort: 'radix'
};

const demoKeyFromAlgorithmKey: Record<string, string> = {
    'linear-search': 'LinearSearch',
    'binary-search': 'BinarySearch',
    'bubble-sort': 'BubbleSort',
    'selection-sort': 'SelectionSort',
    'insertion-sort': 'InsertionSort',
    'interchange-sort': 'InterchangeSort',
    'shaker-sort': 'ShakerSort',
    'shell-sort': 'ShellSort',
    'binary-insertion-sort': 'BinaryInsertionSort',
    'merge-sort': 'MergeSort',
    'quick-sort': 'QuickSort',
    'heap-sort': 'HeapSort',
    'counting-sort': 'CountingSort',
    'radix-sort': 'RadixSort',
    'stack': 'Stack',
    'queue': 'Queue',
    'linked-list': 'LinkedList',
    'bst': 'BST'
};

const structureDemoKeys = {
    stack: new Set(['Stack', 'StackVisualizer']),
    queue: new Set(['Queue', 'QueueVisualizer']),
    linkedList: new Set(['LinkedList', 'LinkedListVisualizer', 'SinglyLinkedList']),
    bst: new Set(['BST', 'BSTVisualizer', 'BinarySearchTree'])
};

const toNumberArray = (value: unknown): number[] | null => {
    if (!Array.isArray(value)) return null;
    const allNumbers = value.every(item => typeof item === 'number');
    return allNumbers ? (value as number[]) : null;
};

const bloomFromDifficulty = (difficulty: AlgorithmChallenge['difficulty']) => {
    if (difficulty === 'easy') return 'R' as const;
    if (difficulty === 'medium') return 'U' as const;
    return 'AP' as const;
};

const actTypeFromDifficulty = (difficulty: AlgorithmChallenge['difficulty']): ChallengeActType => {
    if (difficulty === 'easy') return 'Q';
    if (difficulty === 'medium') return 'V';
    return 'D';
};

const buildConceptChainPrerequisites = (concepts: string[]): Record<string, string[]> => {
    const uniqueConcepts = [...new Set(concepts)];
    return uniqueConcepts.reduce((acc, concept, idx) => {
        acc[concept] = idx === 0 ? [] : [uniqueConcepts[idx - 1]];
        return acc;
    }, {} as Record<string, string[]>);
};

const ArrayPreview: React.FC<{ array: number[]; highlight?: number[]; target?: number }> = ({ array, highlight = [], target }) => {
    if (!array.length) return null;

    return (
        <div className="algo-array-preview">
            <div className="algo-array-track">
                {array.map((value, idx) => {
                    const classNames = ['algo-array-cell'];
                    if (highlight.includes(idx)) classNames.push('active');

                    return (
                        <div key={`${idx}-${value}`} className={classNames.join(' ')}>
                            <span className="algo-array-index">{idx}</span>
                            <strong>{value}</strong>
                        </div>
                    );
                })}
            </div>
            {typeof target === 'number' && <div className="algo-array-target">Target: {target}</div>}
        </div>
    );
};

const ChallengeVisualization: React.FC<{ demoKey: string; array?: number[]; target?: number }> = ({ demoKey, array, target }) => {
    if (!array || array.length === 0) return null;

    let content: React.ReactNode = null;

    if (demoKey === 'BinarySearch' && typeof target === 'number') {
        content = <BinarySearchVisualizer array={array} target={target} autoStart={false} />;
    }

    if (!content && demoKey === 'LinearSearch' && typeof target === 'number') {
        content = <LinearSearchVisualizer array={array} target={target} autoStart={false} />;
    }

    const sortingType = !content ? sortingFromDemoKey[demoKey] : undefined;
    if (!content && sortingType) {
        content = <SortingVisualizer initialArray={array} algorithm={sortingType} autoStart={false} />;
    }

    if (!content && structureDemoKeys.stack.has(demoKey)) {
        content = <StackVisualizer initialItems={array} showInfo={false} />;
    }

    if (!content && structureDemoKeys.queue.has(demoKey)) {
        content = <QueueVisualizer initialItems={array} showInfo={false} />;
    }

    if (!content && structureDemoKeys.linkedList.has(demoKey)) {
        content = <LinkedListVisualizer initialItems={array} showInfo={false} />;
    }

    if (!content && structureDemoKeys.bst.has(demoKey)) {
        content = <BSTVisualizer initialValues={array} showInfo={false} />;
    }

    if (!content) return null;

    return (
        <div className="algo-real-viz">
            <Suspense fallback={<div className="algo-viz-lazy-loading">Đang tải visualizer...</div>}>
                {content}
            </Suspense>
        </div>
    );
};

export const AlgorithmChallengeRunner: React.FC<Props> = ({ challengeSet, algorithmKey }) => {
    const resources = usePlayerStore(state => state.resources);
    const stats = usePlayerStore(state => state.stats);
    const updateConceptCorrectness = usePlayerStore(state => state.updateConceptCorrectness);
    const evaluateKnowledgeUnlocks = usePlayerStore(state => state.evaluateKnowledgeUnlocks);

    const filtered = useMemo(() => {
        if (!algorithmKey) return challengeSet.challenges;
        return challengeSet.challenges.filter(item => item.algorithmKey === algorithmKey);
    }, [challengeSet.challenges, algorithmKey]);

    const usableChallenges = filtered.length > 0 ? filtered : challengeSet.challenges;

    const orchestrationTrace = useMemo(() => {
        const candidates: ChallengeActivityCandidate[] = usableChallenges.map((item, idx) => ({
            id: `${item.id}::${idx}`,
            chapter: challengeSet.chapter,
            bloom: bloomFromDifficulty(item.difficulty),
            kind: actTypeFromDifficulty(item.difficulty),
            diffScore: item.difficulty === 'easy' ? 0.2 : item.difficulty === 'medium' ? 0.5 : 0.85,
        }));

        const byId = new Map(candidates.map((candidate, idx) => [candidate.id, usableChallenges[idx]]));
        const escalation = runChallengeEscalation({
            context: {
                lifeMax: 3,
                totalStages: usableChallenges.length,
            },
            getActType: (stage) => {
                const mappedDifficulty = usableChallenges[Math.min(stage - 1, usableChallenges.length - 1)]?.difficulty ?? 'easy';
                return actTypeFromDifficulty(mappedDifficulty);
            },
            selectActs: (stage, actType, usedIds) =>
                selectChallengeActivities({
                    stage,
                    actType,
                    chapter: challengeSet.chapter,
                    candidates,
                    usedIds,
                }),
            executeActs: (_stage, acts) => ({
                correctness: acts.length > 0 ? 1 : 0,
            }),
        });

        const arranged = escalation.usedActivityIds
            .map(id => byId.get(id))
            .filter((item): item is AlgorithmChallenge => Boolean(item));

        if (arranged.length === usableChallenges.length) return arranged;
        const missing = usableChallenges.filter(item => !arranged.includes(item));
        return [...arranged, ...missing];
    }, [challengeSet.chapter, usableChallenges]);

    const conceptChain = useMemo(() => [...new Set(orchestrationTrace.map(item => item.algorithmKey))], [orchestrationTrace]);
    const conceptPrerequisites = useMemo(() => buildConceptChainPrerequisites(conceptChain), [conceptChain]);
    const conceptToRune = useMemo(() => conceptChain.reduce((acc, concept) => {
        acc[concept] = `rune_learning_${concept.replace(/-/g, '_')}`;
        return acc;
    }, {} as Record<string, string>), [conceptChain]);

    const handleConceptSolved = (conceptId: string) => {
        updateConceptCorrectness(conceptId, 1);
        evaluateKnowledgeUnlocks(conceptChain, conceptPrerequisites, 0.5, conceptToRune);
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const challenge = orchestrationTrace[currentIndex];

    if (!challenge) {
        return <div className="algo-challenge-runner">Không có thử thách phù hợp.</div>;
    }

    return (
        <div className="algo-challenge-runner">
            <div className="algo-hud">
                <div className="algo-hud-row">
                    <span className="algo-hud-label">O-Points</span>
                    <strong className="algo-hud-value">{resources[ResourceType.O_POINTS]}</strong>
                </div>
                <div className="algo-hud-grid">
                    <div className="algo-hud-card easy">
                        <span>Dễ</span>
                        <strong>{stats.challengePointsByDifficulty.easy}</strong>
                        <small>{stats.challengeSolvedByDifficulty.easy} đã giải</small>
                    </div>
                    <div className="algo-hud-card medium">
                        <span>Trung bình</span>
                        <strong>{stats.challengePointsByDifficulty.medium}</strong>
                        <small>{stats.challengeSolvedByDifficulty.medium} đã giải</small>
                    </div>
                    <div className="algo-hud-card hard">
                        <span>Khó</span>
                        <strong>{stats.challengePointsByDifficulty.hard}</strong>
                        <small>{stats.challengeSolvedByDifficulty.hard} đã giải</small>
                    </div>
                </div>
            </div>

            <div className="algo-challenge-header">
                <h3>{challenge.id}</h3>
                <span className={`algo-badge ${challenge.difficulty}`}>{prettyDifficulty(challenge.difficulty)}</span>
            </div>

            <p className="algo-prompt">{challenge.prompt}</p>

            {isEasyChallenge(challenge) && <EasyChallengeView challenge={challenge} onSolved={handleConceptSolved} />}
            {isMediumChallenge(challenge) && <MediumChallengeView challenge={challenge} onSolved={handleConceptSolved} />}
            {isHardChallenge(challenge) && <HardChallengeView challenge={challenge} onSolved={handleConceptSolved} />}

            <div className="algo-actions">
                <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}>
                    Trước
                </button>
                <button
                    onClick={() => setCurrentIndex(i => Math.min(orchestrationTrace.length - 1, i + 1))}
                    disabled={currentIndex === orchestrationTrace.length - 1}
                >
                    Sau
                </button>
                <span>
                    {currentIndex + 1}/{orchestrationTrace.length}
                </span>
            </div>

            <p className="algo-feedback">Lộ trình challenge đang chạy theo pha P1-P6 và unlock kiến thức theo prerequisites.</p>
        </div>
    );
};

const EasyChallengeView: React.FC<{ challenge: EasyChallenge; onSolved: (conceptId: string) => void }> = ({ challenge, onSolved }) => {
    const applyChallengeResult = usePlayerStore(state => state.applyChallengeResult);
    const [selected, setSelected] = useState<string>('');
    const [submitted, setSubmitted] = useState(false);
    const [scoreDelta, setScoreDelta] = useState<number | null>(null);

    const isCorrect = selected === challenge.correctChoiceId;

    const onSubmit = () => {
        if (!selected || submitted) return;

        const delta = applyChallengeResult('easy', isCorrect, challenge.scoring, true);
        if (isCorrect) onSolved(challenge.algorithmKey);
        setScoreDelta(delta);
        setSubmitted(true);
    };

    return (
        <div>
            <div className="algo-feedback">
                Minh họa: {challenge.visualization.demoKey} | Khung: {challenge.visualization.snapshotRef}
            </div>
            <ChallengeVisualization
                demoKey={challenge.visualization.demoKey}
                array={challenge.visualization.sampleArray}
                target={challenge.visualization.target}
            />
            {challenge.visualization.sampleArray && (
                <ArrayPreview array={challenge.visualization.sampleArray} target={challenge.visualization.target} />
            )}
            <div className="algo-choices">
                {challenge.choices.map(choice => {
                    const classNames = ['algo-choice-btn'];
                    if (selected === choice.id) classNames.push('selected');
                    if (submitted && choice.id === challenge.correctChoiceId) classNames.push('correct');
                    if (submitted && selected === choice.id && !isCorrect) classNames.push('wrong');

                    return (
                        <button
                            key={choice.id}
                            type="button"
                            className={classNames.join(' ')}
                            onClick={() => !submitted && setSelected(choice.id)}
                        >
                            {choice.displayKey}. {choice.label}
                        </button>
                    );
                })}
            </div>
            <div className="algo-actions">
                <button disabled={!selected || submitted} onClick={onSubmit}>
                    Kiểm tra
                </button>
                <button
                    onClick={() => {
                        setSelected('');
                        setSubmitted(false);
                        setScoreDelta(null);
                    }}
                >
                    Làm lại
                </button>
            </div>
            {submitted && (
                <p className={`algo-feedback ${isCorrect ? '' : 'error'}`}>
                    {isCorrect ? 'Chính xác.' : 'Sai. Hãy quan sát lại minh họa và thử lại.'}
                </p>
            )}
            {scoreDelta !== null && (
                <p className={`algo-feedback ${scoreDelta < 0 ? 'error' : ''}`}>
                    Điểm: {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                </p>
            )}
        </div>
    );
};

const MediumChallengeView: React.FC<{ challenge: MediumChallenge; onSolved: (conceptId: string) => void }> = ({ challenge, onSolved }) => {
    const applyChallengeResult = usePlayerStore(state => state.applyChallengeResult);
    const [stepIndex, setStepIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [state, setState] = useState<Record<string, unknown>>(cloneState(challenge.initialState));
    const [selectedFrom, setSelectedFrom] = useState<number | null>(null);
    const [selectedTo, setSelectedTo] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [feedback, setFeedback] = useState('');
    const [scoreDelta, setScoreDelta] = useState(0);
    const [rewarded, setRewarded] = useState(false);

    const currentStep = challenge.expectedSteps[stepIndex];
    const finished = !currentStep;
    const currentArray = toNumberArray(state.array);
    const highlight = [selectedFrom, selectedTo].filter((idx): idx is number => typeof idx === 'number');

    const validatePayload = (payload: Record<string, unknown>): boolean => {
        const expectedFrom = Number(payload.from);
        const expectedTo = Number(payload.to);

        if (selectedFrom === null || selectedTo === null) return false;
        return selectedFrom === expectedFrom && selectedTo === expectedTo;
    };

    const handleDropToSlot = (slot: 'from' | 'to', idx: number) => {
        if (slot === 'from') {
            setSelectedFrom(idx);
            return;
        }
        setSelectedTo(idx);
    };

    const onCellClick = (idx: number) => {
        if (selectedFrom === null) {
            setSelectedFrom(idx);
            return;
        }

        if (selectedTo === null) {
            setSelectedTo(idx);
            return;
        }

        setSelectedFrom(selectedTo);
        setSelectedTo(idx);
    };

    const onApply = () => {
        if (!currentStep) return;

        const correct = validatePayload(currentStep.payload);

        if (correct) {
            setState(cloneState(currentStep.stateAfter));
            setStepIndex(prev => prev + 1);
            setFeedback(`Đúng bước ${currentStep.step}.`);
            setSelectedFrom(null);
            setSelectedTo(null);

            if (stepIndex + 1 === challenge.expectedSteps.length && !rewarded) {
                const delta = applyChallengeResult('medium', true, challenge.scoring, mistakes === 0);
                setScoreDelta(prev => prev + delta);
                onSolved(challenge.algorithmKey);
                setRewarded(true);
            }

            return;
        }

        setMistakes(prev => prev + 1);
        const delta = applyChallengeResult('medium', false, challenge.scoring, false);
        setScoreDelta(prev => prev + delta);
        setFeedback('Sai thao tác. Hệ thống giữ nguyên n-1 bước đúng trước đó.');
        setSelectedFrom(null);
        setSelectedTo(null);
    };

    const maxMistakes = challenge.rollbackPolicy.maxMistakes ?? 3;

    return (
        <div className="algo-medium-panel">
            <div>
                <strong>Thuật toán:</strong> {challenge.algorithmLabel}
            </div>
            {currentArray && (
                <ChallengeVisualization
                    demoKey={demoKeyFromAlgorithmKey[challenge.algorithmKey] ?? 'BubbleSort'}
                    array={currentArray}
                />
            )}
            <div>
                <strong>Trạng thái hiện tại:</strong> {JSON.stringify(state)}
            </div>
            {currentArray && <ArrayPreview array={currentArray} highlight={highlight} />}
            <div>
                <strong>Tiến độ:</strong> {stepIndex}/{challenge.expectedSteps.length} | <strong>Lỗi:</strong> {mistakes}/{maxMistakes}
            </div>

            {!finished && currentArray && (
                <div className="algo-medium-dnd-wrap">
                    <div className="algo-medium-dropzones">
                        <div
                            className={`algo-dropzone ${selectedFrom !== null ? 'filled' : ''}`}
                            onDragOver={event => event.preventDefault()}
                            onDrop={event => {
                                event.preventDefault();
                                const idx = Number(event.dataTransfer.getData('text/plain'));
                                if (Number.isInteger(idx)) handleDropToSlot('from', idx);
                            }}
                        >
                            <span>From</span>
                            <strong>{selectedFrom !== null ? selectedFrom : '-'}</strong>
                        </div>
                        <div
                            className={`algo-dropzone ${selectedTo !== null ? 'filled' : ''}`}
                            onDragOver={event => event.preventDefault()}
                            onDrop={event => {
                                event.preventDefault();
                                const idx = Number(event.dataTransfer.getData('text/plain'));
                                if (Number.isInteger(idx)) handleDropToSlot('to', idx);
                            }}
                        >
                            <span>To</span>
                            <strong>{selectedTo !== null ? selectedTo : '-'}</strong>
                        </div>
                    </div>

                    <div className="algo-medium-grid-click">
                        {currentArray.map((value, idx) => {
                            const selected = selectedFrom === idx || selectedTo === idx;
                            const dragging = draggingIndex === idx;

                            return (
                                <button
                                    key={`medium-cell-${idx}-${value}`}
                                    type="button"
                                    className={`algo-medium-cell ${selected ? 'selected' : ''} ${dragging ? 'dragging' : ''}`}
                                    onClick={() => onCellClick(idx)}
                                    draggable
                                    onDragStart={event => {
                                        event.dataTransfer.setData('text/plain', String(idx));
                                        setDraggingIndex(idx);
                                    }}
                                    onDragEnd={() => setDraggingIndex(null)}
                                >
                                    <span>{idx}</span>
                                    <strong>{value}</strong>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {!finished && (
                <p className="algo-feedback">
                    Kéo thả ô chỉ số vào vùng From/To hoặc click 2 điểm theo thứ tự thao tác ({currentStep.action}).
                </p>
            )}

            <div className="algo-actions">
                <button type="button" onClick={onApply} disabled={finished || mistakes >= maxMistakes}>
                    Áp dụng bước
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setStepIndex(0);
                        setMistakes(0);
                        setState(cloneState(challenge.initialState));
                        setFeedback('');
                        setScoreDelta(0);
                        setRewarded(false);
                        setSelectedFrom(null);
                        setSelectedTo(null);
                        setDraggingIndex(null);
                    }}
                >
                    Làm lại từ đầu
                </button>
            </div>

            {finished && <p className="algo-feedback">Hoàn thành thử thách Trung bình.</p>}
            {mistakes >= maxMistakes && <p className="algo-feedback error">Bạn đã hết số lần sai.</p>}
            {feedback && <p className={`algo-feedback ${feedback.startsWith('Sai') ? 'error' : ''}`}>{feedback}</p>}
            <p className={`algo-feedback ${scoreDelta < 0 ? 'error' : ''}`}>
                Tổng điểm thử thách này: {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
            </p>
        </div>
    );
};

const HardChallengeView: React.FC<{ challenge: HardChallenge; onSolved: (conceptId: string) => void }> = ({ challenge, onSolved }) => {
    const applyChallengeResult = usePlayerStore(state => state.applyChallengeResult);
    const [selectedOptionId, setSelectedOptionId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [scoreDelta, setScoreDelta] = useState<number | null>(null);
    const [runtimeNote, setRuntimeNote] = useState('');

    const selectedOption = challenge.options.find(option => option.id === selectedOptionId) ?? null;

    const runValidationCases = (): { passed: boolean; message: string } => {
        if (!selectedOption) return { passed: false, message: 'Không có hàm được chọn.' };

        try {
            const factory = new Function(
                `${selectedOption.functionCode}\nreturn typeof ${challenge.missingFunctionName} === 'function' ? ${challenge.missingFunctionName} : null;`
            ) as () => ((...args: unknown[]) => unknown) | null;
            const executable = factory();

            if (!executable) {
                return { passed: false, message: 'Hàm được chọn không khai báo đúng tên cần thay thế.' };
            }

            for (const testCase of challenge.validationCases) {
                const actual = executable(...testCase.args);
                const pass = JSON.stringify(actual) === JSON.stringify(testCase.expected);
                if (!pass) {
                    return {
                        passed: false,
                        message: `Sai test: ${testCase.description}. Kỳ vọng ${JSON.stringify(testCase.expected)}, nhận ${JSON.stringify(actual)}.`
                    };
                }
            }

            return { passed: true, message: 'Hàm vượt qua toàn bộ test mô phỏng.' };
        } catch (error) {
            return {
                passed: false,
                message: `Lỗi khi chạy hàm: ${String(error)}`
            };
        }
    };

    const onSubmit = () => {
        if (!selectedOptionId || submitted) return;

        const validation = runValidationCases();
        setRuntimeNote(validation.message);

        const nextAttempts = attempts + 1;
        const isCorrect = selectedOptionId === challenge.correctOptionId && validation.passed;
        const delta = applyChallengeResult('hard', isCorrect, challenge.scoring, nextAttempts === 1 && isCorrect);
        if (isCorrect) onSolved(challenge.algorithmKey);

        setAttempts(nextAttempts);
        setScoreDelta(delta);
        setSubmitted(true);
    };

    const isCorrect = submitted && scoreDelta !== null && scoreDelta >= 0;

    return (
        <div>
            <div className="algo-code">{challenge.codeTemplate}</div>
            <p className="algo-feedback">Hành vi mong đợi: {challenge.visualizationTarget.expectedBehavior}</p>
            <ChallengeVisualization
                demoKey={challenge.visualizationTarget.demoKey}
                array={challenge.visualizationTarget.sampleArray}
                target={challenge.visualizationTarget.target}
            />
            {challenge.visualizationTarget.sampleArray && (
                <ArrayPreview
                    array={challenge.visualizationTarget.sampleArray}
                    target={challenge.visualizationTarget.target}
                />
            )}

            <div className="algo-choices">
                {challenge.options.map(option => {
                    const classNames = ['algo-choice-btn'];
                    if (selectedOptionId === option.id) classNames.push('selected');
                    if (submitted && option.id === challenge.correctOptionId) classNames.push('correct');
                    if (submitted && selectedOptionId === option.id && !isCorrect) classNames.push('wrong');

                    return (
                        <button
                            key={option.id}
                            type="button"
                            className={classNames.join(' ')}
                            onClick={() => !submitted && setSelectedOptionId(option.id)}
                        >
                            <div>{option.id}</div>
                            {challenge.hardVariant === 'mixed-labels-4' && option.displayedAlgorithmLabel && (
                                <span className="algo-option-label">Nhãn hiển thị: {option.displayedAlgorithmLabel}</span>
                            )}
                            <div className="algo-code">{option.functionCode}</div>
                        </button>
                    );
                })}
            </div>

            <div className="algo-actions">
                <button type="button" disabled={!selectedOptionId || submitted} onClick={onSubmit}>
                    Kiểm tra
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setSelectedOptionId('');
                        setSubmitted(false);
                        setScoreDelta(null);
                        setRuntimeNote('');
                    }}
                >
                    Làm lại
                </button>
            </div>

            {submitted && (
                <p className={`algo-feedback ${isCorrect ? '' : 'error'}`}>
                    {isCorrect
                        ? 'Chính xác. Hàm đã khớp với hành vi minh họa.'
                        : 'Chưa đúng. Hãy đối chiếu logic hàm với hành vi minh họa.'}
                </p>
            )}
            {scoreDelta !== null && (
                <p className={`algo-feedback ${scoreDelta < 0 ? 'error' : ''}`}>
                    Điểm: {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                </p>
            )}
            {runtimeNote && <p className={`algo-feedback ${runtimeNote.startsWith('Sai') || runtimeNote.startsWith('Lỗi') ? 'error' : ''}`}>{runtimeNote}</p>}
        </div>
    );
};

export default AlgorithmChallengeRunner;
