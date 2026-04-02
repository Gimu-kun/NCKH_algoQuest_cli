import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { compileComplexityBudget, submitBudgetChallenge } from '../../../services/questVisualizationApiService';
import './ComplexityBudget.css';
import { submitVisualChallenge } from '../../../services/singlePlayApiService';
import type { VisualBudgetSubmitRequestDto } from '../../../types/VisualizationSubmitType';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayerStore } from '../../../store/playerStore';

interface Props {
    questId: string;
    visualData: any;
}

export const ComplexityBudgetGame: React.FC<Props> = ({ questId, visualData }) => {
    const { id: topicId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = usePlayerStore(state => state.id);
    const { visualization } = visualData;
    const config = JSON.parse(visualization.data);
    
    const budgetLimit = config.budget_limit || 100;
    const n = config.n_value || 25;
    const algorithms = config.options || [];

    const [currentSteps, setCurrentSteps] = useState(0);
    const [selectedAlgId, setSelectedAlgId] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const hydrate = usePlayerStore(state => state.hydrateFromServer);

    const usagePercent = Math.min((currentSteps / budgetLimit) * 100, 100);

    const handleDeploy = async (alg: any, index: number) => {
        setSelectedAlgId(alg.id);
        setIsRunning(true);
        setCurrentSteps(0);

        // 1. Gọi API biên dịch để lấy số bước thực tế (để chạy hiệu ứng Gauge)
        const response = await compileComplexityBudget(
            algorithms.map((a: any) => a.code),
            n,
            budgetLimit
        );

        if (response.success && response.data) {
            const myResult = response.data[index];
            // 2. Chạy hiệu ứng và truyền thêm thông tin 'correct' từ config
            animateSteps(myResult.operations, alg.id);
        } else {
            Swal.fire("Lỗi", response.error || "Không thể kết nối Server", "error");
            setIsRunning(false);
        }
    };

    const animateSteps = (targetSteps: number, algId: string) => {
        let displaySteps = 0;
        const interval = setInterval(async () => {
            displaySteps += Math.ceil(targetSteps / 20);
            
            if (displaySteps >= targetSteps) {
                setCurrentSteps(targetSteps);
                clearInterval(interval);
    
                // Chuẩn bị DTO đúng cấu trúc Backend yêu cầu
                const submitDto: VisualBudgetSubmitRequestDto = {
                    userId: userId,
                    questId: questId,
                    visualizationId: visualization.id,
                    selectedOptionId: algId,
                    actualSteps: targetSteps
                };
    
                // Gửi kết quả về Spring Boot
                const result = await submitBudgetChallenge(submitDto);
    
                if (result.success) {
                    // Backend trả về status 200 tức là isWin = true
                    if (result.status === 200) {
                        if (result.data) hydrate(result.data);
                        const isFirstTime = result.data; // Flag isFirstTime trả về từ Service Java
                        
                        Swal.fire({
                            title: 'TỐI ƯU THÀNH CÔNG!',
                            html: isFirstTime 
                                ? "<b>Chúc mừng!</b> Bạn đã nhận được phần thưởng lần đầu cho ải này."
                                : "<b>Hoàn thành!</b> Hệ thống ghi nhận nhưng bạn đã nhận quà trước đó.",
                            icon: 'success',
                            confirmButtonColor: '#238636'
                        }).then(()=>{
                            navigate(`/v1/adventure/${topicId}`);
                        });
                    } else {
                        // Xử lý trường hợp chọn sai hoặc vượt budget (Status 400)
                        Swal.fire({
                            title: 'THẤT BẠI',
                            text: result.message || "Thuật toán chưa tối ưu hoặc vượt ngân sách!",
                            icon: 'error',
                            confirmButtonColor: '#f85149'
                        });
                    }
                } else {
                    Swal.fire("Lỗi kết nối", result.error, "error");
                }
                
                setIsRunning(false);
            } else {
                setCurrentSteps(displaySteps);
            }
        }, 30);
    };

    const handleFinalResult = (isCorrect: boolean, steps: number, submitRes: any) => {
        if (isCorrect && steps <= budgetLimit) {
            // Thắng: Thông báo quà tặng (nếu có)
            const { earned_exp, earned_gold, is_first_time } = submitRes.data || {};
            
            Swal.fire({
                title: 'TỐI ƯU THÀNH CÔNG!',
                html: `
                    <div style="text-align: left; padding: 10px;">
                        <p>✅ Thuật toán hoạt động trong ngưỡng an toàn.</p>
                        ${is_first_time ? `
                            <p style="color: #edb95e">🎁 Phần thưởng lần đầu:</p>
                            <ul>
                                <li>Vàng: +${earned_gold}</li>
                                <li>Kinh nghiệm: +${earned_exp}</li>
                            </ul>
                        ` : '<p style="color: #8b949e">ℹ️ Bạn đã hoàn thành ải này trước đó.</p>'}
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#238636'
            });
        } else {
            // Thua: Giải thích lý do
            Swal.fire({
                title: 'HỆ THỐNG QUÁ TẢI!',
                text: steps > budgetLimit 
                    ? `Thuật toán tiêu tốn ${steps} ops, vượt giới hạn ${budgetLimit}!` 
                    : "Lựa chọn này chưa phải là tối ưu nhất cho hệ thống.",
                icon: 'error',
                confirmButtonColor: '#f85149'
            });
        }
    };

    return (
        <div className="budget-game-wrapper">
            <div className="monitor-section">
                <div className="task-briefing">
                    <div className="briefing-header">Nhiệm vụ quản lý tài nguyên</div>
                    <p className="problem-text">Mục tiêu: Fibonacci n = {n}. Ngân sách: {budgetLimit} đơn vị.</p>
                </div>
                <div className="monitor-header">
                    <span>Trạng thái: {currentSteps > budgetLimit ? 'OVERLOAD' : 'STABLE'}</span>
                    <span className="budget-badge">Giới hạn: {budgetLimit}</span>
                </div>
                <div className="gauge-container">
                    <div className={`gauge-fill ${usagePercent > 90 ? 'critical' : ''}`} 
                         style={{ width: `${usagePercent}%` }}></div>
                </div>
                <div className="step-counter">{currentSteps} / {budgetLimit} ops</div>
            </div>

            <div className="code-options-grid">
                {algorithms.map((alg: any, ind: number) => (
                    <div key={alg.id} className={`code-card ${selectedAlgId === alg.id ? 'active' : ''}`}>
                        <div className="code-label">PHƯƠNG ÁN: {alg.complexity}</div>
                        <div className="code-display">
                            <pre><code>{alg.code}</code></pre>
                        </div>
                        <button 
                            className="deploy-btn"
                            onClick={() => handleDeploy(alg, ind)}
                            disabled={isRunning}
                        >
                            {isRunning && selectedAlgId === alg.id ? "Đang chạy..." : "Thực thi"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};