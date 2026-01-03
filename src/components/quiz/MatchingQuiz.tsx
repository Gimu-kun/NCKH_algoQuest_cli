/**
 * Matching Question Component
 * Drag-and-drop or click to match pairs
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MatchingQuestion } from '../../data/models/Question';
import './MatchingQuiz.css';

interface MatchingQuizProps {
    question: MatchingQuestion;
    onAnswer: (correct: boolean, matches: { leftId: string; rightId: string }[]) => void;
}

export const MatchingQuiz: React.FC<MatchingQuizProps> = ({ question, onAnswer }) => {
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matches, setMatches] = useState<{ leftId: string; rightId: string }[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);

    const handleLeftClick = (leftId: string) => {
        if (submitted) return;

        // Check if already matched
        if (matches.some(m => m.leftId === leftId)) {
            // Unmatch
            setMatches(matches.filter(m => m.leftId !== leftId));
            setSelectedLeft(null);
        } else {
            setSelectedLeft(leftId);
        }
    };

    const handleRightClick = (rightId: string) => {
        if (submitted || !selectedLeft) return;

        // Check if right already matched
        if (matches.some(m => m.rightId === rightId)) {
            // Unmatch
            setMatches(matches.filter(m => m.rightId !== rightId));
        }

        // Create new match
        setMatches([...matches, { leftId: selectedLeft, rightId }]);
        setSelectedLeft(null);
    };

    const handleSubmit = () => {
        // Check each match
        const newResults = matches.map(match => {
            return question.correctMatches.some(
                cm => cm.leftId === match.leftId && cm.rightId === match.rightId
            );
        });

        setResults(newResults);
        setSubmitted(true);

        const allCorrect = newResults.length === question.correctMatches.length &&
            newResults.every(r => r);
        onAnswer(allCorrect, matches);
    };

    const handleReset = () => {
        setMatches([]);
        setSelectedLeft(null);
        setSubmitted(false);
        setResults([]);
    };

    const getMatchedRight = (leftId: string) => {
        const match = matches.find(m => m.leftId === leftId);
        return match ? match.rightId : null;
    };

    const isRightMatched = (rightId: string) => {
        return matches.some(m => m.rightId === rightId);
    };

    const getMatchResult = (leftId: string) => {
        if (!submitted) return null;
        const matchIndex = matches.findIndex(m => m.leftId === leftId);
        return matchIndex >= 0 ? results[matchIndex] : false;
    };

    return (
        <div className="matching-quiz">
            <div className="question-prompt">
                <h3>{question.question}</h3>
                <span className="question-points">{question.points} pts | {question.bloomLevel}</span>
            </div>

            <div className="matching-grid">
                {/* Left Column */}
                <div className="matching-column left-column">
                    {question.leftColumn.map(item => {
                        const matchedRight = getMatchedRight(item.id);
                        const matchResult = getMatchResult(item.id);

                        return (
                            <motion.div
                                key={item.id}
                                className={`matching-item ${selectedLeft === item.id ? 'selected' : ''} ${matchedRight ? 'matched' : ''
                                    } ${submitted && matchResult !== null ? (matchResult ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleLeftClick(item.id)}
                                whileHover={!submitted ? { scale: 1.02 } : {}}
                                whileTap={!submitted ? { scale: 0.98 } : {}}
                            >
                                <span className="item-text">{item.text}</span>
                                {matchedRight && (
                                    <span className="match-indicator">
                                        {submitted && matchResult !== null ? (matchResult ? '✓' : '✗') : '→'}
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right Column */}
                <div className="matching-column right-column">
                    {question.rightColumn.map(item => {
                        const isMatched = isRightMatched(item.id);

                        return (
                            <motion.div
                                key={item.id}
                                className={`matching-item ${isMatched ? 'matched' : ''} ${selectedLeft && !isMatched ? 'clickable' : ''
                                    }`}
                                onClick={() => handleRightClick(item.id)}
                                whileHover={selectedLeft && !submitted ? { scale: 1.02 } : {}}
                                whileTap={selectedLeft && !submitted ? { scale: 0.98 } : {}}
                            >
                                <span className="item-text">{item.text}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {submitted && (
                <motion.div
                    className="correct-matches"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h4>Correct Matches:</h4>
                    {question.correctMatches.map((cm, index) => {
                        const leftItem = question.leftColumn.find(l => l.id === cm.leftId);
                        const rightItem = question.rightColumn.find(r => r.id === cm.rightId);

                        return (
                            <div key={index} className="match-pair">
                                <span className="match-left">{leftItem?.text}</span>
                                <span className="match-arrow">→</span>
                                <span className="match-right">{rightItem?.text}</span>
                            </div>
                        );
                    })}
                    {question.explanation && (
                        <p className="explanation">💡 {question.explanation}</p>
                    )}
                </motion.div>
            )}

            <div className="matching-actions">
                {!submitted ? (
                    <>
                        <p className="instruction">
                            Click a left item, then click its match on the right
                        </p>
                        <button
                            className="btn-submit"
                            onClick={handleSubmit}
                            disabled={matches.length !== question.leftColumn.length}
                        >
                            ✓ Submit Matches ({matches.length}/{question.leftColumn.length})
                        </button>
                    </>
                ) : (
                    <button className="btn-reset" onClick={handleReset}>
                        ↻ Try Again
                    </button>
                )}
            </div>
        </div>
    );
};
