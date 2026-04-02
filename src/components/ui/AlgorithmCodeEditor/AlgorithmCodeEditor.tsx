import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './AlgorithmCodeEditor.css';
import { usePlayerStore } from '../../../store/playerStore';
import apiClient from '../../../services/apiClient';
import type { TestCaseResult } from '../../../types/VisualizationSubmitType';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
    questId: string;
    visualData: any;
}

export const AlgorithmCodeEditor: React.FC<Props> = ({ questId, visualData }) => {
    const { id: topicId } = useParams<{ id: string }>();
    const userId = usePlayerStore(state => state.id);
    const { visualization } = visualData;
    const hydrate = usePlayerStore(state => state.hydrateFromServer);
    const navigate = useNavigate()

    // Tách templateCode
    const template = visualization.templateCode || "";
    const [prefix, suffix] = template.split("// user_code_here");

    const [userCode, setUserCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
    const [executionSummary, setExecutionSummary] = useState<{ total: number, passed: number } | null>(null);
    const [displayedResults, setDisplayedResults] = useState<TestCaseResult[]>([]);
    const [terminalOutput, setTerminalOutput] = useState<string>("Ready to compile...");

    useEffect(()=>{
        console.log(displayedResults)
    },[displayedResults])
    
    
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setDisplayedResults([]);
        setTerminalOutput(">> [INFO]: Đang chấm bài...");
    
        try {
            const response = await apiClient.post('/visualizations/submit-code', { 
                userId, questId, visualizationId: visualization.id, userCode
             });
            // Nếu Backend trả về 200 OK
            processData(response.data);
            hydrate(response.data.data)
        } catch (error: any) {
            // Nếu Backend trả về 400 Bad Request (Lỗi bạn đang gặp)
            if (error.response && error.response.data) {
                console.log("Dữ liệu nhận được dù lỗi 400:", error.response.data);
                processData(error.response.data); // Ép hiển thị card dù status là 400
            } else {
                setTerminalOutput(">> [ERROR]: Lỗi kết nối server.");
            }
        } finally {
            
            setIsSubmitting(false);
        }
    };
    
    // Tách logic hiển thị ra hàm riêng
    const processData = (resBody: any) => {
        const executionData = resBody.additionalData;
        
        if (executionData) {
            // Hiển thị log vào Console
            setTerminalOutput(`>> [STATUS]: ${resBody.message}\n${executionData.rawOutput || ""}`);
    
            const details = executionData.testDetails || [];
            if (details.length > 0) {
                details.forEach((test: any, index: number) => {
                    setTimeout(() => {
                        setDisplayedResults(prev => [...prev, test]);
                    }, (index + 1) * 500); // Mỗi card cách nhau 0.5s
                });
    
                // 3. Kiểm tra nếu TẤT CẢ đều PASS
                const allPassed = details.every((t: any) => t.status === 'PASSED') && details.length > 0;
    
                if (allPassed) {
                    // Đợi card cuối cùng hiện xong (details.length * 500ms) 
                    // cộng thêm một khoảng nghỉ nhỏ (300ms) để người dùng kịp nhìn
                    setTimeout(() => {
                        Swal.fire({
                            title: 'THÀNH CÔNG HOÀN HẢO!',
                            text: 'Thuật toán của bạn đã vượt qua tất cả các bài kiểm thử.',
                            icon: 'success',
                            background: '#0d1117',
                            color: '#c9d1d9',
                            confirmButtonColor: '#238636',
                            confirmButtonText: 'Tiếp tục hành trình',
                            showClass: {
                                popup: 'animate__animated animate__fadeInDown'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutUp'
                            }
                        }).then(()=>{
                            //navigate(`/v1/adventure/${topicId}`);
                        });
                    }, (details.length * 500) + 300);
                } else if (resBody.message !== "Lỗi biên dịch") {
                    // Tùy chọn: Hiện thông báo thất bại sau khi card đỏ hiện xong
                    setTimeout(() => {
                        Swal.fire({
                            title: 'CHƯA HOÀN THÀNH',
                            text: 'Một số kiểm thử thất bại. Hãy kiểm tra lại logic thuật toán!',
                            icon: 'error',
                            background: '#0d1117',
                            color: '#c9d1d9',
                            confirmButtonColor: '#da3633'
                        });
                    }, (details.length * 500) + 300);
                }
            }
        }
    };

    return (
        <div className="algo-challenge-container">
            <div className="editor-main-layout">
                {/* CỘT TRÁI: KHU VỰC SOẠN THẢO */}
                <div className="code-editor-side">
                    <div className="side-header">
                        <i className="fas fa-terminal"></i> TRÌNH SOẠN THẢO
                    </div>
                    <div className="editor-inner">
                        <pre className="readonly-code"><code>{prefix}</code></pre>
                        <textarea
                            className="user-code-input"
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            placeholder="// Chèn logic thuật toán của bạn tại đây..."
                            spellCheck={false}
                            disabled={isSubmitting}
                        />
                        <pre className="readonly-code"><code>{suffix}</code></pre>
                    </div>
                    <div className="console-wrapper">
                        <div className="console-header">Console Output</div>
                        <div className="console-body">
                            <pre>{terminalOutput}</pre>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={`execute-btn ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <><i className="fas fa-spinner fa-spin"></i> ĐANG CHẤM BÀI...</>
                        ) : (
                            <><i className="fas fa-play"></i> CHẠY KIỂM THỬ</>
                        )}
                    </button>
                </div>

                {/* CỘT PHẢI: DASHBOARD KẾT QUẢ */}
                <div className="results-dashboard-side">
                    <div className="side-header">
                        <i className="fas fa-chart-bar"></i> KẾT QUẢ KIỂM THỬ
                    </div>
                    <div className="test-cases-scroll">
    {displayedResults.map((test, i) => (
        <div key={i} className={`test-result-card ${test.status.toLowerCase()} entry-animation`}>
            <div className="card-top">
                <span className="test-id">TEST CASE #{i + 1}</span>
                <span className={`status-tag ${test.status.toLowerCase()}`}>
                    {test.status === 'PASSED' ? 'THÀNH CÔNG' : 'THẤT BẠI'}
                </span>
            </div>

            <div className="test-io-details">
                <div className="io-item">
                    <span className="label">Đầu vào:</span>
                    <span className="value">n = {test.input || '42'}</span>
                </div>
                <div className="io-item">
                    <span className="label">Kỳ vọng:</span>
                    <span className="value">{test.expected || '267,914,296'}</span>
                </div>
            </div>

            {test.status === 'FAILED' && (
                <div className="error-hint">
                    <i className="fas fa-exclamation-triangle"></i> Kết quả thực tế không khớp với kỳ vọng.
                </div>
            )}

            <div className="card-metrics">
                <span><i className="fas fa-clock"></i> {test.durationMs} ms</span>
                <span><i className="fas fa-microchip"></i> {test.cpuCycles?.toLocaleString()} cycles</span>
            </div>
        </div>
    ))}
</div>
                    {/* Chỉ hiện Summary khi tất cả các khung đã hiện xong */}
                    {executionSummary && displayedResults.length === testResults.length && (
                        <div className="summary-badge all-pass pulse-animation">
                            {executionSummary.passed} / {executionSummary.total} TEST CASES PASSED
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};