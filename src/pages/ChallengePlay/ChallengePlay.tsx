import { useNavigate, useParams } from "react-router-dom";
import { getActivities, submitChallenge } from "../../services/challengePlayApiService";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend as ChartLegend,
    type ChartData,
    type ChartOptions
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import QuestionView from "../../components/ui/QuestionView/QuestionView";
import './ChallengePlay.css'

import { getUserState } from "../../services/authApiService";
import { BinarySearchVisualizer } from "../../components/ui/VisualizationView/BinarySearch/BinarySearchVisualizer/BinarySearchVisualizer";
import type { BinarySearchDataType } from "../../types/BinarySearchDataType";
import { HeartTwoTone, LeftCircleOutlined } from "@ant-design/icons";
import { BinarySearchAutoPlayer } from "../../components/ui/VisualizationView/BinarySearch/BinarySearchAutoPlayer/BinarySearchAutoPlayer";
import { SelectionSortVisualizer } from "../../components/ui/VisualizationView/SelectionSort/SelectionSortVisualizer/SelectionSortVisualizer";
import { SelectionSortAutoPlayer } from "../../components/ui/VisualizationView/SelectionSort/SelectionSortAutoPlayer/SelectionSortAutoPlayer";
import { BubbleSortVisualizer } from "../../components/ui/VisualizationView/BubbleSort/BubbleSortVisualizer/BubbleSortVisualizer";
import { BubbleSortAutoPlayer } from "../../components/ui/VisualizationView/BubbleSort/BubbleSortAutoPlayer/BubbleSortAutoPlayer";
import { ComplexityVisualizer } from "../../components/ui/VisualizationView/Complexity/ComplexityVisualizer/ComplexityVisualizer";
import { ComplexityAutoPlayer } from "../../components/ui/VisualizationView/Complexity/ComplexityAutoPlayer/ComplexityAutoPlayer";
import apiClient from "../../services/apiClient";
import { usePlayerStore } from "../../store/playerStore";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

export const ChallengePlay: React.FC = () => {
    const param = useParams();

    const [challengeAct, setChallengeAct] = useState<any>();
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [isDone, setIsDone] = useState(false);
    const userId = usePlayerStore((state) => state.id);

    const navigate = useNavigate();
    // ================= FETCH =================
    const fetchActivity = async () => {
        try {
            if (!param.sessionId) return;
            const result = await getActivities(param.sessionId);
            if (result.status === 200) setChallengeAct(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNavigation = () => {
        if (summaryData?.gameOver) {
            navigate("/v1/hub");
        } else {
            navigate("/v1/challenge");
        }
    };

    const fetchUserState = async () => {
        try {
            if (!param.sessionId) return;
            const result = await getUserState(userId);

            if (result.data){
                console.log(result.data)
                usePlayerStore.getState().hydrateFromServer(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchActivity();
    }, []);

    // ================= CHECK ANSWER =================
    const isQuestionAnswered = (question: any, answer: any) => {
        if (!answer) return false;
        const type = question.questionType.toLowerCase();
        if (type === "mcq") return !!answer.selectedMcqId;
        if (["fs", "fn", "fns"].includes(type)) return !!answer.textAnswer?.trim();
        if (type === "mp") {
            const total = question.mpAnswers.length;
            const matched = Object.keys(answer.mpMatches || {}).length;
            return matched === total;
        }
        return false;
    };

    // ================= ANSWER =================
    const handleAnswerChange = (questionId: string, data: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: data
        }));
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!challengeAct) return;
        setIsSubmitting(true);

        const allAnswered = challengeAct.questions.every((q: any) => isQuestionAnswered(q, answers[q.id]));
        if (!allAnswered) {
            alert("Bạn chưa hoàn thành tất cả câu hỏi!");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            progressId: challengeAct.progressId,
            sessionId: param.sessionId,
            answers: Object.values(answers)
        };

        try {
            const res = await submitChallenge(payload);
            console.log(res)
            if (res.status === 200) {
                const data = res.data;

                setTimeout(() => {
                    setResultData(data.results);
                    setSummaryData(data.summary);
                    setIsDone(data.isDone);
                    setShowResult(true);
                    setIsSubmitting(false);
                    fetchUserState();
                }, 1000);
            }

        } catch (err) {
            console.error("Lỗi khi nộp bài:", err);
            setIsSubmitting(false);
        }
    };

    const handleVizFinishEasy = async (isCorrect: boolean, optionId: string) => {
        if (!challengeAct) return;

        const submitData = {
            visualizationId: challengeAct.visualization.id,
            isCorrect: isCorrect,
            correctOp: isCorrect ? 1 : 0, // Easy thường chỉ có 1 bước xác nhận
            incorrectOp: isCorrect ? 0 : 1,
            selectedAnswer: optionId,
            difficulty: 1 // Easy
        };

        try {
            // progressId lấy từ state hoặc context của màn chơi hiện tại
            const response = await apiClient.post(`/challenge/submit-viz/${challengeAct.progressId}`, submitData);
            const resData = response.data;
            if (resData.status === 200) {
                const newSummary = resData.data.summary;
                setResultData([]);
                setSummaryData(newSummary);
                setIsDone(resData.isDone);
                setIsSubmitting(false);
                setShowResult(true);
                fetchUserState();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật kết quả Easy:", error);
        }
    };

    const handleVizFinishMedium = async (isCorrect: boolean, totalWrong: number) => {
        if (!challengeAct) return;

        const submitData = {
            visualizationId: challengeAct.visualization.id,
            isCorrect: isCorrect,
            correctOp: 1, // Đánh dấu đã hoàn thành logic
            incorrectOp: totalWrong, // Gửi số lần người dùng click sai trong ComplexityChallenge
            selectedAnswer: "COMPLEXITY_TASK",
            difficulty: 2 // Medium
        };

        try {
            const response = await apiClient.post(`/challenge/submit-viz/${challengeAct.progressId}`, submitData);
            const resData = response.data;
            if (resData.status === 200) {
                const newSummary = resData.data.summary;
                setResultData([]);
                setSummaryData(newSummary);
                setIsDone(resData.isDone);
                setIsSubmitting(false);
                setShowResult(true);
                fetchUserState();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật kết quả Medium:", error);
        }
    };

    // Biểu đồ tròn tỉ lệ chính xác question
    const renderAccuracyChart = () => {
        if (!summaryData) return null;

        const accuracy = summaryData.accuracyRate || 0;
        const incorrect = 100 - accuracy;

        // Cấu hình dữ liệu cho Chart.js
        const data: ChartData<'pie'> = {
            labels: ['Đúng', 'Sai'],
            datasets: [
                {
                    label: 'Tỉ lệ (%)',
                    data: [accuracy, incorrect],
                    backgroundColor: [
                        '#238636', // Xanh (Đúng)
                        '#da3633', // Đỏ (Sai)
                    ],
                    borderColor: [
                        '#30363d',
                        '#30363d',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        // Cấu hình options
        const options: ChartOptions<'pie'> = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e6edf3', // Màu chữ legend cho phù hợp dark mode
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                }
            }
        };

        return (
            <div style={{ width: '100%', height: '250px', position: 'relative' }}>
                <Pie data={data} options={options} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -120%)', // Cân chỉnh lại vị trí text nếu muốn
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}>
                    <p style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        margin: 0,
                        color: '#fff'
                    }}>
                        {accuracy}%
                    </p>
                </div>
            </div>
        );
    };

    const renderHealthBar = () => {
        const remainLife = challengeAct?.remainLife || 0;
        return <div className="health-bar"><HeartTwoTone twoToneColor="#eb2f96" /> x {remainLife}</div>;
    };

    if (isSubmitting) {
        return (
            <div className="submitting-overlay">
                <div className="loader"></div>
                <p>Đang kiểm tra câu trả lời...</p>
            </div>
        );
    }

    if (!challengeAct) return <div className="loading">Loading...</div>;

    if (showResult) {
        // Kiểm tra trạng thái Game Over hoặc Thất bại
        const isGameOver = summaryData?.remainLife === 0;
        const isPassed = summaryData?.pass;
        console.log(summaryData);

        return (
            <div className="result-container">
                {/* 1. Thông báo trạng thái Hoàn thành/Thất bại */}
                {isDone && isPassed && (
                    <div className="congrats-banner">🎉 CHÚC MỪNG! BẠN ĐÃ VƯỢT QUA PHIÊN CHƠI! 🎉</div>
                )}

                {!isPassed && !isGameOver && (
                    <div className="fail-banner">
                        ❌ BẠN KHÔNG VƯỢT QUA MÀN NÀY
                        <div className="life-lost">-1 Sinh mạng <HeartTwoTone twoToneColor="#eb2f96" /></div>
                    </div>
                )}

                {isGameOver && (
                    <div className="gameover-banner">
                        💀 GAME OVER 💀
                        <p>Bạn đã hết lượt chơi!</p>
                    </div>
                )}

                <h2>Kết quả bài làm</h2>

                <div className="summary-section">
                    <div className="chart-box">
                        {renderAccuracyChart()}
                    </div>
                    {summaryData && (
                        <div className="resources-box">
                            <h3>Tài nguyên tích luỹ:</h3>
                            <div className="res-grid">
                                <div className="res-item">💰 Vàng: <span>{summaryData.resources.gold || 0}</span></div>
                                <div className="res-item">🪵 Gỗ: <span>{summaryData.resources.wood || 0}</span></div>
                                <div className="res-item">🪨 Đá: <span>{summaryData.resources.stone || 0}</span></div>
                                <div className="res-item">⭐ Exp: <span>{summaryData.resources.exp || 0}</span></div>
                            </div>
                            <div className={`status-badge ${isPassed ? 'pass' : 'fail'}`}>
                                TRẠNG THÁI: {isPassed ? "VƯỢT QUA" : "THẤT BẠI"}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Hiển thị rõ ràng câu sai */}
                {resultData.length != 0 &&
                    <div className="detail-results">
                        <h3>Chi tiết bài làm:</h3>
                        {
                            resultData.map((r, idx) => {
                                const q = r.question;
                                const type = q.questionType.toLowerCase();
                                // r.isCorrect là giá trị từ Backend trả về
                                const isCorrect = r.correct;

                                return (
                                    <div key={idx} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        <div className="result-header">
                                            <div className="q-badge">Câu {idx + 1}</div>
                                            <span className={`status-text ${isCorrect ? 'text-success' : 'text-danger'}`}>
                                                {isCorrect ? "● Chính xác" : "● Chưa đúng"}
                                            </span>
                                        </div>

                                        <div className="q-body">
                                            <p className="q-content">{q.questionContent}</p>

                                            {/* Logic cho MCQ: Tô màu các Option */}
                                            {type === 'mcq' && (
                                                <div className="options-grid">
                                                    {q.mcqAnswers.map((opt: any) => {
                                                        const isUserPicked = opt.id === r.userAnswer;
                                                        const isSystemCorrect = opt.isCorrect;

                                                        // Xác định class CSS cho option
                                                        let statusClass = "";
                                                        if (isSystemCorrect) statusClass = "opt-correct"; // Luôn tô xanh đáp án đúng
                                                        if (isUserPicked && !isSystemCorrect) statusClass = "opt-wrong"; // Tô đỏ nếu người dùng chọn sai

                                                        return (
                                                            <div key={opt.id} className={`option-card ${statusClass}`}>
                                                                <div className="opt-indicator">
                                                                    {isSystemCorrect ? "✓" : (isUserPicked ? "✕" : "")}
                                                                </div>
                                                                <div className="opt-text">{opt.content}</div>
                                                                {isUserPicked && <span className="user-tag">{isCorrect ? "Chính xác" : "Bạn chọn"}</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {type === 'mp' && (
                                                <div className="mp-result-container">
                                                    <div className="mp-grid">
                                                        {q.mpAnswers.map((pair: any) => {
                                                            // 1. Lấy dữ liệu gốc từ Database
                                                            const leftSideId = pair.id;
                                                            const leftSideContent = pair.column1;
                                                            const rightSideCorrectContent = pair.column2;

                                                            // 2. TRUY XUẤT STATE: Lấy thông tin từ state 'answers' của bạn
                                                            // answers là một Record<string, any>, key là questionId
                                                            const userSnapshot = answers[q.id];

                                                            // Lấy nội dung text từ rawMatches (vì bạn log thấy nó chứa content)
                                                            // Theo cấu trúc bạn log: rawMatches: { "6": { column2: "..." }, ... }
                                                            const userPickedRaw = userSnapshot?.mpMatches?.[leftSideId];

                                                            const displayUserAnswer = q.mpAnswers.find((item: any) => item.id == userPickedRaw).column2 || "Chưa nối";
                                                            // 3. So sánh kết quả
                                                            const isMatchCorrect = displayUserAnswer === rightSideCorrectContent;

                                                            return (
                                                                <div key={pair.id} className="mp-row-compare">
                                                                    <div className="mp-item left-item">
                                                                        {leftSideContent}
                                                                    </div>

                                                                    <div className="mp-connector"> ➔ </div>

                                                                    <div className={`mp-item right-item ${isMatchCorrect ? 'opt-correct' : 'opt-wrong'}`}>
                                                                        <div className="mp-text-content">
                                                                            {displayUserAnswer}
                                                                        </div>
                                                                        <span className="mp-status-icon">
                                                                            {isMatchCorrect ? " ✓" : " ✕"}
                                                                        </span>
                                                                    </div>

                                                                    {!isMatchCorrect && (
                                                                        <div className="mp-correct-hint">
                                                                            <small>Đúng phải là:</small>
                                                                            <strong>{rightSideCorrectContent}</strong>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Logic cho Điền từ (FS/FN): Show box đối chiếu */}
                                            {(type !== 'mcq' && type !== 'mp') && (
                                                <div className={`answer-compare-box ${isCorrect ? 'box-success' : 'box-danger'}`}>
                                                    <div className="compare-row">
                                                        <strong>Đáp án của bạn:</strong>
                                                        <span className={isCorrect ? "text-success" : "text-danger"}>
                                                            {r.userAnswer || "(Trống)"}
                                                        </span>
                                                    </div>
                                                    {!isCorrect && (
                                                        <div className="compare-row">
                                                            <strong>Đáp án đúng:</strong>
                                                            <span className="text-success">
                                                                {type === 'fn'
                                                                    ? q.fnAnswers?.map((a: any) => a.answer).join(" | ")
                                                                    : q.fsAnswers?.map((a: any) => a.answer).join(" | ")}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                }
                {/* 3. Nút quay lại thay đổi theo trạng thái Game Over */}
                <button className="back-btn" onClick={handleNavigation}>
                    {isGameOver ? "🏠 Quay về trang chủ" : "🔙 Quay lại danh sách màn"}
                </button>
            </div>
        );
    }


    // Kiểm tra xem có phải màn hình câu hỏi (Q) và có mảng questions không
    const isQuestionMode = challengeAct.type === 'Q' && challengeAct.questions;

    // Nếu là Q thì lấy mảng questions, nếu không thì để mảng rỗng để tránh lỗi .length
    const questions = isQuestionMode ? challengeAct.questions : [];

    // Chỉ lấy currentQuestion nếu đang ở chế độ Q và index hợp lệ
    const currentQuestion = isQuestionMode ? questions[currentIndex] : null;

    const isFirst = currentIndex === 0;
    const isLast = isQuestionMode ? currentIndex === questions.length - 1 : true;

    // Kiểm tra đã trả lời chưa: Nếu là V thì mặc định coi như xong (hoặc xử lý riêng), nếu Q thì check logic cũ
    const isAnswered = (isQuestionMode && currentQuestion)
        ? isQuestionAnswered(currentQuestion, answers[currentQuestion.id])
        : true;

    return (
        <div className="challenge-container">
            <div className="challenge-body">

                <div className="question-sidebar">
                    <button className="back-btn" onClick={() => { navigate("/v1/challenge") }}>
                        <LeftCircleOutlined /> Quay về
                    </button>
                    <div className="sidebar-header">
                        {renderHealthBar()}
                    </div>
                    {questions.map((q: any, index: number) => {
                        const answered = isQuestionAnswered(q, answers[q.id]);
                        const isActive = index === currentIndex;
                        return (
                            <div
                                key={q.id}
                                className={`q-number ${answered ? "answered" : ""} ${isActive ? "active" : ""}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                {index + 1}
                            </div>
                        );
                    })}
                </div>
                {challengeAct.type === 'Q' ? (
                    <div className="question-main">
                        {
                            currentQuestion && (
                                <div className="question-content">
                                    <QuestionView
                                        key={currentQuestion.id}
                                        question={currentQuestion}
                                        initialValue={answers[currentQuestion.id]}
                                        onAnswerChange={(data) => handleAnswerChange(currentQuestion.id, data)}
                                    />
                                </div>
                            )
                        }

                        <div className="nav-bar">
                            <button onClick={() => setCurrentIndex(p => p - 1)} disabled={isFirst}>⬅ Quay lại</button>
                            {!isLast ? (
                                <button onClick={() => setCurrentIndex(p => p + 1)} disabled={!isAnswered}>Tiếp ➡</button>
                            ) : (
                                <button className="submit-btn" onClick={handleSubmit}>🚀 Nộp bài</button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="visualization-main">
                        {challengeAct.visualization && (
                            challengeAct.visualization.visualizationType == 'COMPLEXITY' && challengeAct.visualization.difficulty == 1 ?
                                <ComplexityAutoPlayer
                                    vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                    onFinish={handleVizFinishEasy}
                                /> :
                                challengeAct.visualization.visualizationType == 'COMPLEXITY' && challengeAct.visualization.difficulty == 2 ?
                                    <ComplexityVisualizer
                                        vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                        onFinish={handleVizFinishMedium}
                                    /> :
                                    challengeAct.visualization.visualizationType == 'BSEARCH' && challengeAct.visualization.difficulty == 1 ?
                                        <BinarySearchAutoPlayer
                                            vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                            onFinish={handleVizFinishEasy}
                                        /> :
                                        challengeAct.visualization.visualizationType == 'BSEARCH' && challengeAct.visualization.difficulty == 2 ?
                                            <BinarySearchVisualizer
                                                vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                                onFinish={handleVizFinishMedium}
                                            /> :
                                            challengeAct.visualization.visualizationType == 'SELECSORT' && challengeAct.visualization.difficulty == 1 ?
                                                <SelectionSortAutoPlayer
                                                    vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                                    onFinish={handleVizFinishEasy}
                                                /> :
                                                challengeAct.visualization.visualizationType == 'SELECSORT' && challengeAct.visualization.difficulty == 2 ?
                                                    <SelectionSortVisualizer
                                                        vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                                        onFinish={handleVizFinishMedium}
                                                    /> :
                                                    challengeAct.visualization.visualizationType == 'BBSORT' && challengeAct.visualization.difficulty == 1 ?
                                                        <BubbleSortAutoPlayer
                                                            vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                                            onFinish={handleVizFinishEasy}
                                                        /> :
                                                        challengeAct.visualization.visualizationType == 'BBSORT' && challengeAct.visualization.difficulty == 2 ?
                                                            <BubbleSortVisualizer
                                                                vizData={JSON.parse(challengeAct.visualization.data) as BinarySearchDataType}
                                                                onFinish={handleVizFinishMedium}
                                                            /> :
                                                            <>Kiểu chơi không phù hợp</>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};