import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./ReviewDetail.css";

const RenderLatex = lazy(() =>
    import('../../components/ui/LatexRender/QuestionLatexRender').then(module => ({ default: module.RenderLatex }))
);

const ReviewDetail: React.FC = () => {
    const { progressId } = useParams<{ progressId: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/quest-progress/review/${progressId}`);
                const result = await response.json();
                console.log(result)
                if (result.status === 200) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [progressId]);

    if (loading) return <div className="loading-state">Đang tải dữ liệu phiên chơi...</div>;
    if (!data) return <div className="error-state">Không tìm thấy dữ liệu.</div>;

    const { progress, details } = data;

    const renderLatex = (content: string, images?: any[]) => (
        <Suspense fallback={<span>{content}</span>}>
            <RenderLatex content={content} images={images} />
        </Suspense>
    );

    return (
        <div className="review-page">
            {/* Header: Tổng quan kết quả */}
            <div className="review-summary-card">
                <button className="back-link" onClick={() => navigate(-1)}>
                    ← Quay lại bản đồ
                </button>
                <div className="summary-content">
                    <div className="summary-text">
                        <h1>{progress.quest.title}</h1>
                        <p className="timestamp">Hoàn thành lúc: {new Date(progress.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="resource-gain">
                        <div className="gain-item">⭐ {progress.earnedExp} <small>EXP</small></div>
                        <div className="gain-item">💰 {progress.earnedGold} <small>Vàng</small></div>
                        <div className="gain-item">💎 {progress.earnedStone} <small>Đá</small></div>
                    </div>
                </div>
            </div>

            {/* Danh sách chi tiết từng câu */}
            <div className="review-list">
                {details.map((item: any, index: number) => (
                    <div key={item.question.id} className={`review-card ${item.correct ? 'is-correct' : 'is-wrong'}`}>
                        <div className="card-header">
                            <span className="q-index">Câu hỏi {index + 1}</span>
                            <span className={`type-tag ${item.question.questionType}`}>{item.question.questionType.toUpperCase()}</span>
                            <span className="result-icon">{item.correct ? "✓" : "✗"}</span>
                        </div>
                        {renderLatex(item.question.questionContent, item.question.questionImgs)}
                        <div className="q-content">
                            {item.question.questionType === 'mcq' ? (
                                <div className="mcq-options">
                                    {item.options?.map((opt: any) => {
                                        const isSelected = item.userChoice.selectedMcqId === opt.id;
                                        const isCorrect = opt.isCorrect;
                                        return (
                                            <div key={opt.id} className={`opt-item 
                                                ${isCorrect ? 'correct-opt' : ''} 
                                                ${isSelected && !isCorrect ? 'wrong-opt' : ''}
                                                ${isSelected ? 'selected' : ''}`}>
                                                <span className="radio-circle"></span>
                                                <span className="opt-text">
                                                    {renderLatex(opt.content)}
                                                </span>
                                                {isSelected && <span className="user-tag">Lựa chọn của bạn</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : item.question.questionType === 'mp' ? (
                                <div className="matching-review">
                                    <div className="matching-header">
                                        <span>Vế A (Cố định)</span>
                                        <span>Kết quả nối của bạn</span>
                                        <span>Đáp án đúng</span>
                                    </div>
                                    {item.question.mpAnswers.map((pair: any) => {
                                        // Lấy ID vế B mà người dùng đã nối với ID vế A này
                                        const userMatchedId = item.userChoice.mpMatches[pair.id];
                                        // Tìm nội dung của vế B mà người dùng đã chọn
                                        const userMatchedPair = item.question.mpAnswers.find((p: any) => p.id === userMatchedId);
                                        const isPairCorrect = userMatchedId === pair.id;

                                        return (
                                            <div key={pair.id} className={`matching-row ${isPairCorrect ? 'pair-success' : 'pair-fail'}`}>
                                                <div className="col-a">
                                                    {renderLatex(pair.column1)}
                                                </div>

                                                <div className="col-user">
                                                    <div className={`match-badge ${isPairCorrect ? 'bg-success' : 'bg-danger'}`}>
                                                        {renderLatex(userMatchedPair ? userMatchedPair.column2 : "Chưa nối")}
                                                    </div>
                                                </div>

                                                {!isPairCorrect && (
                                                    <div className="col-correct">
                                                        <div className="match-badge bg-system">
                                                            {renderLatex(pair.column2)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-answer-review">
                                    <div className="ans-box user">
                                        <label>Bạn đã nhập:</label>
                                        <div className="val">{item.userChoice.textAnswer || (item.questionType === 'mp' ? "Đã ghép nối" : "Bỏ trống")}</div>
                                    </div>
                                    <div className="ans-box system">
                                        <label>Đáp án đúng:</label>
                                        <div className="val">{item.correctAnswer}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewDetail;