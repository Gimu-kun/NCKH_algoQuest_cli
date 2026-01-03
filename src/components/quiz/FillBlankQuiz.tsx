/**
 * Fill-in-Blank Question Component
 * For testing syntax and knowledge completion
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FillBlankQuestion } from '../../data/models/Question';
import './FillBlankQuiz.css';

interface FillBlankQuizProps {
    question: FillBlankQuestion;
    onAnswer: (correct: boolean, answers: string[]) => void;
}

export const FillBlankQuiz: React.FC<FillBlankQuizProps> = ({ question, onAnswer }) => {
    const [answers, setAnswers] = useState<string[]>(
        question.blanks.map(() => '')
    );
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);

    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    // Levenshtein distance for fuzzy matching
    const levenshtein = (a: string, b: string): number => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1  // deletion
                        )
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const isCorrectAnswer = (input: string, target: string, caseSensitive: boolean = false) => {
        const cleanInput = input.trim();
        const cleanTarget = target.trim();

        if (caseSensitive) {
            return cleanInput === cleanTarget;
        }

        const inputLower = cleanInput.toLowerCase();
        const targetLower = cleanTarget.toLowerCase();

        // Exact match
        if (inputLower === targetLower) return true;

        // Fuzzy match (allow 20% error rate or max 2 chars)
        const dist = levenshtein(inputLower, targetLower);
        const maxErrors = Math.max(1, Math.floor(targetLower.length * 0.2));

        return dist <= maxErrors;
    };

    const handleSubmit = () => {
        const newResults = answers.map((answer, index) => {
            const blank = question.blanks[index];
            return isCorrectAnswer(answer, blank.answer, blank.caseSensitive);
        });

        setResults(newResults);
        setSubmitted(true);

        const allCorrect = newResults.every(r => r);
        onAnswer(allCorrect, answers);
    };

    const handleReset = () => {
        setAnswers(question.blanks.map(() => ''));
        setSubmitted(false);
        setResults([]);
    };

    return (
        <div className="fill-blank-quiz">
            <div className="question-prompt">
                <h3>{question.question}</h3>
                <span className="question-points">{question.points} pts | {question.bloomLevel}</span>
            </div>

            <div className="fill-blank-content">
                {question.blanks.map((blank, index) => (
                    <div key={index} className="blank-group">
                        <p className="blank-text">{blank.text}</p>
                        <div className={`blank-input-wrapper ${submitted ? (results[index] ? 'correct' : 'wrong') : ''}`}>
                            <input
                                type="text"
                                className="blank-input"
                                value={answers[index]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                disabled={submitted}
                                placeholder={`Blank ${index + 1}`}
                                autoFocus={index === 0}
                            />
                            {submitted && (
                                <span className="result-icon">
                                    {results[index] ? '✓' : '✗'}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {submitted && (
                <motion.div
                    className="correct-answers"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h4>Correct Answers:</h4>
                    {question.blanks.map((blank, index) => (
                        <div key={index} className="answer-item">
                            <span className="answer-label">Blank {index + 1}:</span>
                            <code className="answer-code">{blank.answer}</code>
                        </div>
                    ))}
                    {question.explanation && (
                        <p className="explanation">💡 {question.explanation}</p>
                    )}
                </motion.div>
            )}

            <div className="fill-blank-actions">
                {!submitted ? (
                    <button
                        className="btn-submit"
                        onClick={handleSubmit}
                        disabled={answers.some(a => a.trim() === '')}
                    >
                        ✓ Submit Answers
                    </button>
                ) : (
                    <button className="btn-reset" onClick={handleReset}>
                        ↻ Try Again
                    </button>
                )}
            </div>
        </div>
    );
};
