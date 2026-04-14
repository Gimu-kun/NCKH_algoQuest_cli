import React, { useState, useEffect, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import './QuestionView.css';
import { RenderLatex } from '../LatexRender/QuestionLatexRender';

interface Props {
    question: any;
    initialValue: Record<string, any>;
    onAnswerChange: (answerData: any) => void;
}

const MATCH_COLORS = [
    '#E63946', // Đỏ đậm (High Contrast Red)
    '#2A9D8F', // Xanh Teal đậm (Deep Teal)
    '#F4A261', // Cam đất (Vivid Orange)
    '#264653', // Xanh Charcoal (Deep Navy)
    '#8338EC', // Tím đậm (Electric Purple)
    '#FB5607', // Cam cháy (Tiger Orange)
    '#3A86FF', // Xanh Dương chuẩn (Royal Blue)
    '#00F5D4', // Xanh Ngọc neon (Aquamarine)
];

const QuestionView: React.FC<Props> = ({ question, initialValue, onAnswerChange }) => {
    const shuffleArray = (array: any[]) => {
        if (!array) return [];
        return [...array].sort(() => Math.random() - 0.5);
    };

    // 1. Tạo danh sách cho cột TRÁI (Column 1)
    const shuffledLeft = useMemo(() => {
        return [...question.mpAnswers]
            .map(ans => ({ id: ans.id, content: ans.column1 }))
            .sort(() => Math.random() - 0.5);
    }, [question.id]);

    // 2. Tạo danh sách cho cột PHẢI (Column 2)
    const shuffledRight = useMemo(() => {
        return [...question.mpAnswers]
            .map(ans => ({ id: ans.id, content: ans.column2 }))
            .sort(() => Math.random() - 0.5);
    }, [question.id]);
    
    const [leftSelected, setLeftSelected] = useState<string | null>(null);
    const [selectedMcq, setSelectedMcq] = useState<string | null>(null);
    const [textInput, setTextInput] = useState('');

    // Lưu trữ node đang được chọn: { id: string, side: 'left' | 'right' }
    const [selectedNode, setSelectedNode] = useState<{ id: string, side: 'left' | 'right' } | null>(null);
    const [matches, setMatches] = useState<Record<string, any>>({});

    useEffect(() => {
        setSelectedMcq(initialValue?.selectedMcqId || null);
        setTextInput(initialValue?.textAnswer || '');
        setMatches(initialValue?.rawMatches || {});
        setSelectedNode(null);
    }, [question.id]);

    useEffect(() => {
        const formattedMatches: Record<string, string> = {};
        Object.entries(matches).forEach(([leftId, val]: any) => {
            formattedMatches[leftId] = val.rightId;
        });

        onAnswerChange({
            questionId: question.id,
            questionType: question.questionType.toLowerCase(),
            selectedMcqId: selectedMcq,
            textAnswer: textInput,
            mpMatches: formattedMatches,
            rawMatches: matches
        });
    }, [selectedMcq, textInput, matches]);

    

    const handleReset = () => {
        setMatches({});
        setSelectedNode(null);
    };

    const handleMpClick = (id: string, side: 'left' | 'right') => {
        console.log(id)
        // 1. Logic xóa cặp cũ nếu node nhấn vào đã được nối (Dùng ID thật để tìm)
        let newMatches = { ...matches };
        
        if (side === 'left') {
            if (newMatches[id]) delete newMatches[id]; 
        } else {
            // Tìm key (leftId) nào đang chứa rightId này
            const leftIdKey = Object.keys(newMatches).find(key => newMatches[key].rightId === id);
            if (leftIdKey) delete newMatches[leftIdKey];
        }
    
        if (!selectedNode) {
            setMatches(newMatches);
            setSelectedNode({ id, side });
            return;
        }
    
        if (selectedNode.id === id && selectedNode.side === side) {
            setSelectedNode(null);
            return;
        }
    
        if (selectedNode.side === side) {
            setSelectedNode({ id, side });
            return;
        }
    
        // 2. THỰC HIỆN NỐI: Sử dụng ID từ Database
        // id và selectedNode.id bây giờ chắc chắn là ID từ API (ví dụ: "OPT-123")
        const leftId = side === 'left' ? id : selectedNode.id;
        const rightId = side === 'right' ? id : selectedNode.id;
    
        const colorIndex = Math.abs(leftId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % MATCH_COLORS.length;
        
        newMatches[leftId] = { 
            rightId: rightId, // Lưu ID của option cột phải
            color: MATCH_COLORS[colorIndex] 
        };
        
        setMatches(newMatches);
        setSelectedNode(null);
    };

    const type = question.questionType.toLowerCase();

    return (
        <div className="q-container">
            <div className="q-header">
                <span className={`badge ${question.bloom.toLowerCase()}`}>{question.bloom}</span>
                <span className="q-id">#{question.id}</span>
                {type === 'mp' && Object.keys(matches).length > 0 && (
                    <button className="btn-reset-mp" onClick={handleReset}>
                        Làm lại câu này
                    </button>
                )}
            </div>

            <div className="q-body">
                <RenderLatex content={question.questionContent} images={question.questionImgs} />
                <div className="ans-section">
                    {type === 'mcq' && (
                        <div className="mcq-grid">
                            {question.mcqAnswers.map((ans: any, idx: number) => (
                                <button
                                    key={ans.id}
                                    className={`mcq-btn ${selectedMcq === ans.id ? 'active' : ''}`}
                                    onClick={() => setSelectedMcq(ans.id)}
                                >
                                    <span className="mcq-label">{String.fromCharCode(65 + idx)}</span>
                                    <RenderLatex content={ans.content} />
                                </button>
                            ))}
                        </div>
                    )}

                    {['fs', 'fn', 'fns'].includes(type) && (
                        <input
                            type={type === 'fn' ? 'number' : 'text'}
                            className="text-answer-input"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Nhập câu trả lời..."
                        />
                    )}

{type === 'mp' && (
                        <div className="mp-grid">
                        {/* CỘT TRÁI - Dùng shuffledLeft */}
                        <div className="mp-col">
                            {shuffledLeft.map((item) => {
                                const isSelected = selectedNode?.id === item.id && selectedNode?.side === 'left';
                                const isDone = !!matches[item.id];
                                return (
                                    <div key={item.id} 
                                        className={`mp-card ${isDone ? 'done' : ''} ${isSelected ? 'selected' : ''}`}
                                        style={isDone ? { borderColor: matches[item.id].color, backgroundColor: `${matches[item.id].color}10` } : {}}
                                        onClick={() => handleMpClick(item.id, 'left')}>
                                        <RenderLatex content={item.content} />
                                    </div>
                                );
                            })}
                        </div>
                    
                        {/* CỘT PHẢI - Dùng shuffledRight */}
                        <div className="mp-col">
                            {shuffledRight.map((item) => {
                                // Tìm xem ID của item bên phải này đã được nối bởi ID nào bên trái chưa
                                const entry = Object.entries(matches).find(([_, v]: any) => v.rightId === item.id);
                                const isSelected = selectedNode?.id === item.id && selectedNode?.side === 'right';
                                const isDone = !!entry;
                                
                                return (
                                    <div key={item.id} 
                                        className={`mp-card ${isDone ? 'done' : ''} ${isSelected ? 'selected' : ''}`}
                                        style={isDone ? { borderColor: (entry[1] as any).color, backgroundColor: `${(entry[1] as any).color}10` } : {}}
                                        onClick={() => handleMpClick(item.id, 'right')}>
                                        <RenderLatex content={item.content} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionView;