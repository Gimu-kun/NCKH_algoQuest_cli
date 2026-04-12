import { CheckOutlined, LockOutlined, RadarChartOutlined, QuestionCircleOutlined, CodeOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStagesList, getState } from "../../services/challengePlayApiService";
import { usePlayerStore } from "../../store/playerStore";
import { StageType, type challengeSessionStateType, type stageStateType } from "../../types/stageType";
import AlertDialog from "../../components/ui/AlertDialog";
import "./ChallengeMenu.css"

type DialogType = 'passed' | 'locked' | 'confirm' | '';

export const ChallengeMenu: React.FC = () => {
    const [currentState, setCurrentState] = useState<challengeSessionStateType>();
    const [stagesList, setStagesList] = useState<stageStateType[]>();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<DialogType>('');

    const userId = usePlayerStore(state => state.id);
    const navigate = useNavigate();

    const renderHealthBar = () => {
        // Mặc định là 5 máu nếu chưa có dữ liệu, hoặc lấy từ currentState
        // Lưu ý: currentState.remainLife phải được trả về từ API /session-state
        const remainLife = currentState?.remainLife ?? 5;
        const hearts = [];

        for (let i = 0; i < 5; i++) {
            hearts.push(
                <span
                    key={i}
                    className={`menu-heart-icon ${i < remainLife ? 'alive' : 'dead'}`}
                >
                    ❤️
                </span>
            );
        }

        return (
            <div className="menu-health-container">
                <span className="health-label">Sinh mạng:</span>
                <div className="hearts-wrapper">{hearts}</div>
            </div>
        );
    };

    const fetchStages = async () => {
        try {
            const result = await getStagesList();
            if (result.status === 200) setStagesList(result.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách màn:', error);
        }
    };

    const fetchState = async (useId: string) => {
        try {
            const result = await getState(useId);
            if (result.status === 200) setCurrentState(result.data);
        } catch (error) {
            console.error('Lỗi lấy trạng thái:', error);
        }
    };

    const handleClickItem = (stageNum: number) => {
        console.log(stageNum)
        console.log(currentState?.currentStage)
        if (stageNum < (currentState?.currentStage || 100)) {
            setDialogTitle('Thử thách đã hoàn thành');
            setDialogMessage(`Màn thử thách này đã hoàn thành!`);
            setDialogType('passed');
        } else if (stageNum > (currentState?.currentStage || 0)) {
            setDialogTitle('Thử thách chưa được mở khoá');
            setDialogMessage(`Màn thử thách này chưa mở khoá, cần hoàn thành màn trước để mở khoá!`);
            setDialogType('locked');
        } else {
            setDialogTitle('Xác nhận thử thách');
            setDialogMessage(`Bạn đã chuẩn bị sẵn sàng cho thử thách tầng ${stageNum} chưa?`);
            setDialogType('confirm');
        }
        setOpenDialog(true);
    };

    const handleDialogAgree = () => {
        if (dialogType === 'confirm') {
            navigate(`/v1/challenge/${currentState?.sessionId}/${currentState?.progressId}`);
        }
        setOpenDialog(false);
        setDialogType('');
    };

    const handleDialogDisagree = () => {
        setOpenDialog(false);
        setDialogType('');
    };

    useEffect(() => {
        fetchState(userId);
        fetchStages();
    }, []);

    return (
        <div className="menu-wrapper">
            {renderHealthBar()}
            <ul className="section_list">
                <AlertDialog
                    title={dialogTitle}
                    message={dialogMessage}
                    open={openDialog}
                    setOpen={setOpenDialog}
                    onAgree={handleDialogAgree}
                    onDisagree={handleDialogDisagree}
                />
                {stagesList?.map(item => {
                    const isLocked = item.stageNum !== (currentState?.currentStage || 1);
                    const isCurrent = item.stageNum === (currentState?.currentStage || 1);
                    const isPassed = item.stageNum < (currentState?.currentStage || 1);

                    return (
                        <li
                            key={item.stageNum}
                            className={`
                                    section_item 
                                    difficulty-${item.difficulty} 
                                    type-${item.stageType} 
                                    phrase-${item.phraseNum}
                                    ${isLocked ? 'locked' : ''}
                                    ${isCurrent ? 'current' : ''}
                                    ${isPassed ? 'passed' : ''}
                                `}
                            onClick={() => handleClickItem(item.stageNum)}
                        >
                            <div className="section_item_container">
                                <div className="stage_num">Tầng {item.stageNum}</div>
                                <div className="stage_content">
                                    <div className="stage_header">
                                        <span className={`stage_type_badge ${isPassed && 'passed'} type-${item.stageType}`}>
                                            {isPassed ? (
                                                <CheckOutlined />
                                            ) : isLocked ? (
                                                <LockOutlined />
                                            ) : item.stageType === StageType.V ? (
                                                <RadarChartOutlined />
                                            ) : item.stageType === StageType.Q ? (
                                                <QuestionCircleOutlined />
                                            ) : item.stageType === StageType.D ? (
                                                <CodeOutlined />
                                            ) : (
                                                <EllipsisOutlined />
                                            )}
                                        </span>
                                    </div>
                                    <div className="stage_info">
                                        <div className="info_item">
                                            <span className="label">Giai đoạn: </span>
                                            <span className="value">{item.phraseNum}</span>
                                        </div>
                                        <div className="info_item">
                                            <span className="label">Độ khó: </span>
                                            <span className={`value difficulty-${item.difficulty}`}>{item.difficulty}</span>
                                        </div>
                                        <div className="info_item">
                                            <span className="label">Loại màn: </span>
                                            <span className={`value type-${item.difficulty}`}>
                                                {item.stageType === StageType.Q
                                                    ? 'Câu hỏi trắc nghiệm'
                                                    : item.stageType === StageType.D
                                                        ? 'Bài tập lập trình'
                                                        : item.stageType === StageType.V
                                                            ? 'Minh hoạ trực quan'
                                                            : 'Khác'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>

    )
}