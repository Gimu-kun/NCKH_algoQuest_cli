import { useNavigate, useParams } from "react-router-dom";
import "./StagePlay.css";
import { useEffect, useState, useMemo } from "react";
import type { Quest } from "../../types/questType";
import { getQuestById } from "../../services/singlePlayApiService";
import { LessonView } from "../../components/ui/LessonView/LessonView";
import QuestionView from "../../components/ui/QuestionView/QuestionView";
import { ComplexityGame } from "../../components/ui/ComplexityGame/ComplexityGame";
import { ComplexityBudgetGame } from "../../components/ui/ComplexityBudget/ComplexityBudget";
import { usePlayerStore } from "../../store/playerStore";
import Swal from "sweetalert2";

export const StagePlay: React.FC = () => {
    const { id: topicId, stageId } = useParams<{ id: string, stageId: string }>();
    const [questDetail, setQuestDetail] = useState<Quest | any>();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
    const navigate = useNavigate();
    const userId = usePlayerStore(state => state.id);
    const hydrate = usePlayerStore(state => state.hydrateFromServer);

    const steps = useMemo(() => [
        ...(questDetail?.lessons?.map((l: any) => ({ type: 'LESSON', data: l.lesson })) || []),
        ...(questDetail?.questions?.map((q: any) => ({ type: 'QUESTION', data: q.question })) || []),
        ...(questDetail?.visualizations?.map((v: any) => ({ type: 'VISUALIZATION', data: v })) || [])
    ], [questDetail]);

    useEffect(() => {
        const fetchQuest = async () => {
            if (!stageId) return navigate(`/v1/adventure/${topicId}`);
            try {
                setLoading(true);
                const result = await getQuestById(stageId);
                if (result.success) setQuestDetail(result.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuest();
    }, [topicId, stageId]);

    const handleUpdateQuizAnswer = (questionId: string, data: any) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: data
        }));
    };

    const handleLogAnswers = () => {
        console.log("=== DỮ LIỆU CÂU TRẢ LỜI CỦA NGƯỜI DÙNG ===");
        console.log(quizAnswers);
        alert("Đã log câu trả lời ra Console!");
    };

    const nextStep = () => {
        const isLastStep = currentStep === steps.length - 1;

        if (isLastStep) {
            handleFinish();
        } else {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const isStepComplete = () => {
        const currentStepData = steps[currentStep];
        if (!currentStepData || currentStepData.type !== 'QUESTION') return true;

        const question = currentStepData.data;
        const answer = quizAnswers[question.id];
        const type = question.questionType.toLowerCase();

        if (!answer) return false;

        if (type === 'mcq') return !!answer.selectedMcqId;
        if (['fs', 'fn', 'fns'].includes(type)) return !!answer.textAnswer?.trim();
        if (type === 'mp') {
            const matchedCount = Object.keys(answer.mpMatches || {}).length;
            return matchedCount === question.mpAnswers.length;
        }
        return false;
    };

    // Logic xác định nút có bị khóa (disabled) hay không
    const isNextDisabled = () => {
        const isLastStep = currentStep === steps.length - 1;

        // Nếu là bước cuối cùng: Khóa nếu chưa làm xong
        if (isLastStep) {
            return !isStepComplete();
        }

        // Nếu KHÔNG PHẢI bước cuối: Luôn cho phép nhấn để xem câu tiếp theo
        return false;
    };

    if (loading) return <div className="loading-screen">Đang tải nội dung...</div>;

    const currentStepData = steps[currentStep];

    const handleFinish = async () => {
        // 1. Chuẩn bị dữ liệu Payload
        // Biến Object quizAnswers { qId: data } thành mảng [ data1, data2 ]
        const answerList = Object.values(quizAnswers);

        const payload = {
            questId: stageId,
            userId: userId,
            userAnswer: answerList
        };

        // 2. Log ra console theo yêu cầu của bạn
        console.log("=== PAYLOAD GỬI SANG BACKEND ===");
        console.log(JSON.stringify(payload, null, 2));

        // 3. Gọi API gửi sang Backend
        try {
            const response = await fetch('http://localhost:8080/api/questions/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.data) {
                hydrate(result.data.user);
                const scoreInfo = result.data;

                if (scoreInfo.isPassed) {
                    const scoreInfo = result.data;
                    handleFinishResult(scoreInfo);
                } else {
                    alert("Không đủ điểm, thử lại nhé!");
                }
            }
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ hệ thống.', 'error');
        }
    };

    const handleFinishResult = (scoreInfo: any) => {
        // Kiểm tra xem đây có phải lần đầu đạt ải không (dựa trên kỷ lục cũ = 0)
        const isFirstTime = scoreInfo.preMaxExp === 0 && scoreInfo.preMaxPoint === 0;

        // Kiểm tra xem có nhận được thêm tài nguyên chênh lệch nào không
        const hasNewRewards = scoreInfo.earnedExp > 0 || scoreInfo.earnedGold > 0 ||
            scoreInfo.earnedStone > 0 || scoreInfo.earnedWood > 0;

        if (scoreInfo.isPassed) {
            Swal.fire({
                title: 'TỐI ƯU THÀNH CÔNG!',
                html: `
                    <div style="text-align: left; padding: 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        <p style="color: #2ea043; font-weight: bold; font-size: 1.1em;">
                            ✅ Thuật toán chính xác: ${scoreInfo.correctCount}/${scoreInfo.totalCount}
                        </p>
                        
                        <hr style="border: 0.5px solid #30363d; margin: 15px 0;">
    
                        ${isFirstTime ? `
                            <p style="color: #edb95e; font-weight: bold;">🎁 Phần thưởng lần đầu:</p>
                            <ul style="list-style: none; padding-left: 5px;">
                                <li>💰 Vàng: <span style="color: #edb95e">+${scoreInfo.earnedGold}</span></li>
                                <li>⭐ Kinh nghiệm: <span style="color: #edb95e">+${scoreInfo.earnedExp}</span></li>
                                <li>💎 Đá: <span style="color: #edb95e">+${scoreInfo.earnedStone}</span></li>
                                <li>🪵 Gỗ: <span style="color: #edb95e">+${scoreInfo.earnedWood}</span></li>
                            </ul>
                        ` : hasNewRewards ? `
                            <p style="color: #58a6ff; font-weight: bold;">📈 Kỷ lục mới!</p>
                            <p style="font-size: 0.9em;">Bạn đã tối ưu tốt hơn lần trước. Nhận thêm phần chênh lệch:</p>
                            <ul style="list-style: none; padding-left: 5px;">
                                ${scoreInfo.earnedExp > 0 ? `<li>⭐ Kinh nghiệm: +${scoreInfo.earnedExp}</li>` : ''}
                                ${scoreInfo.earnedGold > 0 ? `<li>💰 Vàng: +${scoreInfo.earnedGold}</li>` : ''}
                            </ul>
                        ` : `
                            <p style="color: #8b949e">ℹ️ Bạn đã hoàn thành ải này trước đó.</p>
                            <p style="font-size: 0.85em; color: #8b949e;">Hãy thử các thử thách khó hơn để nhận thêm tài nguyên!</p>
                        `}
                    </div>
                `,
                icon: 'success',
                background: '#0d1117',
                color: '#c9d1d9',
                confirmButtonText: 'TIẾP TỤC',
                confirmButtonColor: '#238636',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                }
            }).then(() => {
                navigate(`/v1/adventure/${topicId}`);
            });
        } else {
            Swal.fire({
                title: 'THẤT BẠI!',
                text: `Độ chính xác hiện tại (${scoreInfo.correctCount}/${scoreInfo.totalCount}) chưa đạt ngưỡng 50%.`,
                icon: 'error',
                background: '#0d1117',
                color: '#c9d1d9',
                confirmButtonText: 'THỬ LẠI',
                confirmButtonColor: '#da3633'
            }).then(() => {
                navigate(`/v1/adventure/${topicId}`);
            });
        }
    };

    return (
        <div className="stag_container">
            <div className={`stag_background stage_1`} />
            <div className="content-area">
                {steps.length > 0 ? (
                    <div className="step-wrapper">
                        {currentStepData.type === 'LESSON' && (
                            <LessonView lesson={currentStepData.data} />
                        )}

                        {currentStepData.type === 'QUESTION' && (
                            <QuestionView
                                key={currentStepData.data.id}
                                question={currentStepData.data}
                                initialValue={quizAnswers[currentStepData.data.id]}
                                onAnswerChange={(data) => handleUpdateQuizAnswer(currentStepData.data.id, data)}
                            />
                        )}

                        {currentStepData.type === 'VISUALIZATION' && (
                            currentStepData.data.visualization.visualizationType === "cc" ? (
                                <ComplexityGame questId={stageId!} visualData={currentStepData.data} />
                            ) : (
                                <ComplexityBudgetGame questId={stageId!} visualData={currentStepData.data} />
                            )
                        )}
                    </div>
                ) : (
                    <div className="no-content">Ải này chưa có nội dung.</div>
                )}
            </div>

            {(currentStepData?.type === 'QUESTION' || currentStepData?.type === 'LESSON') && (
                <div className="navigation-footer">
                    <div className="footer-left">
                        <div className="progress-text">Bước {currentStep + 1} / {steps.length}</div>
                    </div>
                    <button
                        className="exit-stage-btn"
                        onClick={() => {
                            Swal.fire({
                                title: 'Rời khỏi ải?',
                                text: "Tiến trình hiện tại của bạn sẽ không được lưu!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6',
                                confirmButtonText: 'Rời đi',
                                cancelButtonText: 'Ở lại',
                                background: '#0d1117',
                                color: '#c9d1d9',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate(`/v1/adventure/${topicId}`);
                                }
                            });
                        }}
                    >
                        <i className="fas fa-arrow-left"></i> Thoát
                    </button>
                    <div className="nav-buttons">
                        <button
                            className="nav-btn prev"
                            onClick={() => setCurrentStep(p => p - 1)}
                            disabled={currentStep === 0}
                        >
                            Quay lại
                        </button>

                        <button
                            className={`nav-btn next ${currentStep === steps.length - 1 ? 'finish' : ''} ${isNextDisabled() ? 'disabled-btn' : ''}`}
                            onClick={nextStep}
                            disabled={isNextDisabled()}
                        >
                            {currentStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};