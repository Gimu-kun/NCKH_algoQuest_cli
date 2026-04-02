import { useEffect, useState } from "react"
import "./Adventure.css"
import type { QuestStatusDto, topicGeneralType } from "../../types/topicType"
import { claimReward, getTopicById, getTopics } from "../../services/singlePlayApiService"
import type { ApiResponse } from "../../types/apiType"
import { useNavigate, useParams } from "react-router-dom"
import { usePlayerStore } from "../../store/playerStore"
import Swal from "sweetalert2"
export const Adventure: React.FC = () => {
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState<string | null>(null);
    const [questsStatus, setQuestsStatus] = useState<QuestStatusDto[]>([]);
    const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
    const userId = usePlayerStore((state) => state.id);
    const navigate = useNavigate()
    const { id: topicId } = useParams<{ id: string }>();

    const MAP_COORDINATES: Record<number, { x: number; y: number }[]> = {
        1: [{ x: 15, y: 75 }, { x: 20, y: 70 }, { x: 23, y: 63 }, { x: 22, y: 55 }, { x: 22, y: 46 }, { x: 27, y: 45 }, { x: 33, y: 43 }, { x: 38, y: 40 }, { x: 43, y: 35 }, { x: 43, y: 47 }, { x: 40, y: 53 }, { x: 35, y: 58 }, { x: 34, y: 69 }, { x: 37, y: 79 }, { x: 43, y: 85 }, { x: 38, y: 89 }, { x: 44, y: 95 }, { x: 50, y: 95 }, { x: 56, y: 90 }, { x: 60, y: 85 }, { x: 63, y: 78 }, { x: 60, y: 70 }, { x: 55, y: 65 }, { x: 50, y: 63 }, { x: 55, y: 55 }, { x: 62, y: 60 }, { x: 60, y: 50 }, { x: 65, y: 45 }], // Ải 1
        2: [{ x: 10, y: 80 }, { x: 30, y: 60 }, { x: 50, y: 40 }, { x: 80, y: 20 }], // Ải 2
        3: [{ x: 50, y: 10 }, { x: 50, y: 40 }, { x: 50, y: 70 }], // Ải 3
        4: [{ x: 20, y: 20 }, { x: 80, y: 20 }, { x: 20, y: 80 }, { x: 80, y: 80 }], // Ải 4
        5: [{ x: 30, y: 50 }, { x: 50, y: 30 }, { x: 70, y: 50 }, { x: 50, y: 70 }], // Ải 5
    };

    const fetchDetail = async () => {
        if (!topicId) return navigate("/v1/roadmap");

        const result: ApiResponse<QuestStatusDto[]> = await getTopicById(topicId, userId);

        if (result.success && result.data) {
            console.log(result.data)
            setQuestsStatus(result.data);
        }
    };

    const fetchHistory = async (questId: string) => {
        try {
            // Bạn cần viết thêm API này ở Backend: GET /api/quests/{questId}/history?userId={userId}
            const response = await fetch(`http://localhost:8080/api/quest-progress/${questId}/history?userId=${userId}`);
            const result = await response.json();
            if (result.status === 200) {
                setHistoryList(result.data);
                setShowHistory(questId);
            }
        } catch (error) {
            console.error("Lỗi lấy lịch sử:", error);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [topicId, userId]);

    const handleOpenReward = async (questId: string) => {
        try {
            // Giả sử bạn đã viết service claimReward(questId, userId)
            const response = await claimReward(questId, userId);

            if (response.success) {
                Swal.fire({
                    title: 'Thành Công!',
                    text: 'Chúc mừng! Bạn đã nhận được phần thưởng.',
                    icon: 'success',
                    background: '#161b22',
                    color: '#fff'
                }).then(() => {
                    setSelectedQuestId(null)
                });
                // Refresh lại dữ liệu để hòm chuyển sang trạng thái 'open'
                fetchDetail();
                console.log(response.data)
                // Cập nhật lại stats (vàng, exp) trong Store của người chơi
                usePlayerStore.getState().hydrateFromServer(response.data);
            }
        } catch (error) {
            console.error("Lỗi nhận quà:", error);
        }
    };

    const currentTopicIndex = questsStatus[0]?.quest.indexOrder || 1;
    const coords = MAP_COORDINATES[currentTopicIndex] || [];
    const pointsString = coords.map(p => `${p.x},${p.y}`).join(" ");

    return (
        <div className="adv_container">
            <div className={`adv_background bg_${currentTopicIndex}`} />

            <div className="map_wrapper">
                <svg className="map_line_svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points={pointsString} className="map_path_line" />
                </svg>

                {questsStatus.map((item, index) => {
                    const { quest, completed, unlocked } = item;
                    const pos = coords[index] || { x: 50, y: 50 };
                    const isSelected = selectedQuestId === quest.id;
                    console.log(quest)
                    return (
                        <div
                            key={quest.id}
                            className={`node_point ${!unlocked ? 'is-locked' : ''} ${quest.type == 'reward' ? 'reward_node' : ''} ${completed ? 'is-completed' : ''}`}
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                            {
                                //Hiển thị cho nút phần thưởng
                                quest.type === 'reward' ?
                                    (<div
                                        className={`treasure_wrapper ${!unlocked ? 'is-locked' : ''} ${completed ? 'is-completed' : ''}`}
                                        onClick={() => {
                                            if (!unlocked) {
                                                Swal.fire({
                                                    title: 'Ải này chưa mở',
                                                    text: "Bạn cần hoàn thành các ải trước để mở khoá!",
                                                    icon: 'info',
                                                    confirmButtonText: 'Tôi đã biết rồi!',
                                                    confirmButtonColor: '#238636',
                                                    background: '#161b22',
                                                    color: '#fff'
                                                })
                                                return;
                                            }
                                            setSelectedQuestId(isSelected ? null : quest.id);
                                        }}
                                    >
                                        <img
                                            className="treasure-icon"
                                            src={completed
                                                ? "/src/assets/Ảnh Assets/UI/treasure_open.png"  // Đã nhận
                                                : "/src/assets/Ảnh Assets/UI/treasure_close.png" // Chưa nhận
                                            }
                                            alt="treasure"
                                        />
                                    </div>) :
                                    //Hiển thị cho nút bài học & câu hỏi
                                    quest.type === 'lesson' ?
                                        <button
                                            className={`map_node_btn ${isSelected ? 'active' : ''}`}
                                            onClick={() => {
                                                if (!unlocked) {
                                                    Swal.fire({
                                                        title: 'Ải này chưa mở',
                                                        text: "Bạn cần hoàn thành các ải trước để mở khoá!",
                                                        icon: 'info',
                                                        confirmButtonText: 'Tôi đã biết rồi!',
                                                        confirmButtonColor: '#238636',
                                                        background: '#161b22',
                                                        color: '#fff'
                                                    })
                                                    return;
                                                }
                                                setSelectedQuestId(isSelected ? null : quest.id);
                                            }}
                                        >
                                            {completed ? <i className="fi fi-rr-check"></i> : quest.questNum}
                                        </button>
                                        :
                                        //Hiển thị cho nút minh hoạ thuật toán
                                        (<div
                                            className={`portal_wrapper ${completed ? 'is-completed' : ''}`}
                                            onClick={() => {
                                                if (!unlocked) {
                                                    Swal.fire({
                                                        title: 'Ải này chưa mở',
                                                        text: "Bạn cần hoàn thành các ải trước để mở khoá!",
                                                        icon: 'info',
                                                        confirmButtonText: 'Tôi đã biết rồi!',
                                                        confirmButtonColor: '#238636',
                                                        background: '#161b22',
                                                        color: '#fff'
                                                    })
                                                    return;
                                                }
                                                setSelectedQuestId(isSelected ? null : quest.id);
                                            }}
                                        >
                                            <img
                                                className={`portal-icon ${!unlocked ? 'is-locked' : ''} ${completed ? 'is-completed' : ''}`}
                                                src={unlocked
                                                    ? "/src/assets/Ảnh Assets/UI/portal_open.png"  // Đã mở
                                                    : "/src/assets/Ảnh Assets/UI/portal_close.png" // Chưa mở
                                                }
                                                alt="treasure"
                                            />
                                        </div>)
                            }


                            {isSelected &&
                                (
                                    quest.type == 'lesson' ?
                                        <div className="topic_card_container"> {/* Container mới để chứa card và history side-by-side */}
                                            <div className="topic_card floating_card">
                                                <div className="card_header">
                                                    <h3>{quest.title}</h3>
                                                    <button className="fc_close_btn" onClick={() => {
                                                        setSelectedQuestId(null);
                                                        setShowHistory(null);
                                                    }}>×</button>
                                                </div>
                                                <p>{quest.description || "Tìm hiểu về kiến thức mới trong ải này."}</p>

                                                <div className="card_stats">
                                                    {quest.lessons?.length !== 0 && <span>📚 {quest.lessons?.length} Bài học</span>}
                                                    {quest.questions?.length !== 0 && <span>❓ {quest.questions?.filter(q=>q.defaultMark).length} Câu hỏi</span>}
                                                </div>

                                                <div className="button_group">
                                                    {completed && (
                                                        <button
                                                            className="opt_btn review"
                                                            onClick={() => fetchHistory(quest.id)}
                                                        >
                                                            Xem lại lịch sử
                                                        </button>
                                                    )}
                                                    <button
                                                        className="opt_btn start"
                                                        onClick={() => navigate(`/v1/adventure/${topicId}/stage/${quest.id}`)}
                                                    >
                                                        {completed ? "Luyện tập lại" : "Bắt đầu"}
                                                    </button>
                                                    {/* HIỂN THỊ DANH SÁCH PHIÊN CHƠI BÊN CẠNH */}
                                            {showHistory === quest.id && (
                                                <div className="history_panel animate__animated animate__fadeInRight">
                                                    <div className="history_header">
                                                        <h4>Lịch sử phiên chơi</h4>
                                                        <button className="fc_close_btn" onClick={() => setShowHistory(null)}>×</button>
                                                    </div>
                                                    <div className="history_list">
                                                        {historyList.length > 0 ? historyList.map((progress) => (
                                                            <div
                                                                key={progress.id}
                                                                className="history_item"
                                                                onClick={() => navigate(`/v1/adventure/review/${progress.id}`)}
                                                            >
                                                                <div className="history_info">
                                                                    <span className={`status_dot ${progress.isCompleted ? 'success' : 'failed'}`}></span>
                                                                    <span className="time">{new Date(progress.createdAt).toLocaleString('vi-VN')}</span>
                                                                </div>
                                                                <div className="history_stats">
                                                                    <span>⭐ {progress.earnedExp}</span>
                                                                    <span>💰 {progress.earnedGold}</span>
                                                                </div>
                                                                <i className="fi fi-rr-angle-small-right"></i>
                                                            </div>
                                                        )) : <p className="empty_text">Chưa có dữ liệu phiên chơi.</p>}
                                                    </div>
                                                </div>
                                            )}
                                                </div>
                                            </div>
                                        </div> :
                                        quest.type == 'reward' ?
                                            <div className="topic_card floating_card">
                                                <div className="card_header">
                                                    <h3>{quest.title}</h3>
                                                    <button className="fc_close_btn" onClick={() => setSelectedQuestId(null)}>×</button>
                                                </div>
                                                <p>{quest.description || "Tìm hiểu về kiến thức mới trong ải này."}</p>

                                                <div className="card_stats">
                                                    {quest.rewards[0].rewardExp != 0 && <span>📚 {quest.rewards[0].rewardExp} Kinh nghiệm</span>}
                                                    {quest.rewards[0].rewardGold != 0 && <span>📚 {quest.rewards[0].rewardGold} Vàng</span>}
                                                    {quest.rewards[0].rewardStone != 0 && <span>📚 {quest.rewards[0].rewardStone} Đá</span>}
                                                    {quest.rewards[0].rewardWood != 0 && <span>📚 {quest.rewards[0].rewardWood} Gỗ</span>}
                                                </div>

                                                <button
                                                    className={`opt_btn ${completed ? 'claimed' : 'available'}`}
                                                    disabled={completed}
                                                    onClick={() => {
                                                        if (!unlocked) {
                                                            Swal.fire({
                                                                title: 'Ải này chưa mở',
                                                                text: "Bạn cần hoàn thành các ải trước để mở khoá!",
                                                                icon: 'info',
                                                                confirmButtonText: 'Tôi đã biết rồi!',
                                                                confirmButtonColor: '#238636',
                                                                background: '#161b22',
                                                                color: '#fff'
                                                            }).then(() => {
                                                                return;
                                                            });
                                                        }

                                                        handleOpenReward(quest.id)
                                                    }}
                                                >
                                                    {completed ? "Đã nhận" : "Nhận"}
                                                </button>
                                            </div>
                                            :
                                            <div className="topic_card floating_card">
                                                <div className="card_header">
                                                    <h3>{quest.title}</h3>
                                                    <button className="fc_close_btn" onClick={() => setSelectedQuestId(null)}>×</button>
                                                </div>
                                                <p>{quest.description || "Tìm hiểu về kiến thức mới trong ải này."}</p>

                                                <button
                                                    className="opt_btn start"
                                                    onClick={() => navigate(`/v1/adventure/${topicId}/stage/${quest.id}`)}
                                                >
                                                    {completed ? "Chơi lại" : "Chơi"}
                                                </button>
                                            </div>
                                )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}