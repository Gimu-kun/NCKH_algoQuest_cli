/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT: HỘP THOẠI (Dialogue Box)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị giao diện hội thoại giữa Người Chơi và NPC.
 * 
 * TÍNH NĂNG:
 * - Hiển thị chân dung, tên và vai trò của NPC.
 * - Hiển thị nội dung văn bản theo từng đoạn (Step-by-step).
 * - Các nút điều hướng (Tiếp theo, Bỏ qua, Hoàn tất).
 * - Các nút tính năng đặc biệt (Nhiệm vụ, Cửa hàng, Tập luyện) tùy theo NPC.
 * 
 * @component DialogueBoxx
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { NPCS } from '../../data/models/NPC';
import { useTranslation } from '../../i18n';
import { useNavigate } from 'react-router-dom';
import './DialogueBox.css';
import type { dialogueStateType } from '../../types/dialogueType';

type dialogueBoxProps = {
    npcId:string,
    setOpenState: React.Dispatch<React.SetStateAction<dialogueStateType>>
}

export const DialogueBox: React.FC<dialogueBoxProps> = ({npcId,setOpenState}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // State cục bộ để theo dõi dòng hội thoại hiện tại
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    const [isSelectingDungeon, setIsSelectingDungeon] = useState(false);

    // Không hiển thị nếu chưa kích hoạt hội thoại
    if (!npcId || npcId === "") return null;

    // Lấy dữ liệu NPC từ ID
    const npc = NPCS[npcId];
    if (!npc) {
        console.error('Không tìm thấy dữ liệu NPC:', npcId);
        return null; // Hoặc hiển thị UI lỗi fallback
    }

    const currentDialogue = npc.dialogues[currentDialogueIndex];

    /**
     * Xử lý khi nhấn nút "Tiếp Theo"
     * Chuyển đến dialogue tiếp theo dựa trên nextId hoặc index tuần tự
     */
    const handleNext = () => {
        if (currentDialogue.nextId) {
            // Tìm hội thoại tiếp theo theo ID định danh
            const nextIndex = npc.dialogues.findIndex(d => d.id === currentDialogue.nextId);
            if (nextIndex !== -1) {
                setCurrentDialogueIndex(nextIndex);
                return;
            }
        }

        // Nếu không có nextId, kiểm tra xem còn dòng tiếp theo trong mảng không
        if (currentDialogueIndex < npc.dialogues.length - 1) {
            setCurrentDialogueIndex(currentDialogueIndex + 1);
        } else {
            // Kết thúc hội thoại
            handleClose();
        }
    };

    /**
     * Đóng hộp thoại và reset trạng thái
     */
    const handleClose = () => {
        setCurrentDialogueIndex(0);
        setIsSelectingDungeon(false); // Reset state chọn ải
        setOpenState({
            isOpen:false,
            npcId:""
        })
    };

    /**
     * FEATURE HANDLER - Xử Lý Tính Năng Đặc Biệt Của NPC
     */
    const handleFeatureClick = (feature: string) => {
        setIsSelectingDungeon(false); // Reset UI mode
        setOpenState({
            isOpen:false,
            npcId:""
        }) // UI cleanup - Đóng hội thoại trước khi xử lý

        switch (feature) {
            case 'SHOP':
                useGameStore.getState().setScene(GameScene.SHOP);
                break;

            case 'CAMPAIGN_QUESTS': {
                const { activeQuests, completedQuests, startQuest } = usePlayerStore.getState();

                // Quest progression map
                const QUEST_CHAIN = [
                    'quest_intro_1',
                    'quest_chapter_2',
                    'quest_chapter_3',
                    'quest_chapter_4',
                    'quest_chapter_5'
                ];

                const QUEST_NAMES: Record<string, string> = {
                    'quest_intro_1': 'Khởi Đầu Hành Trình',
                    'quest_chapter_2': 'Đền Thờ Hỗn Loạn',
                    'quest_chapter_3': 'Hành Lang Dây Xích',
                    'quest_chapter_4': 'Thánh Tích Hai Mặt',
                    'quest_chapter_5': 'Khu Rừng Đệ Quy'
                };

                // Tìm quest tiếp theo chưa hoàn thành
                const questToGive = QUEST_CHAIN.find(q => !completedQuests.includes(q)) || '';

                if (!questToGive) {
                    useGameStore.getState().showSparky(t('dialogue.allCampaignDone'));
                    break;
                }

                if (activeQuests.includes(questToGive)) {
                    useGameStore.getState().showSparky(t('dialogue.questInProgress'));
                } else {
                    startQuest(questToGive);
                    useGameStore.getState().showSparky(`📜 Đã nhận nhiệm vụ: ${QUEST_NAMES[questToGive]}!`);
                }
                break;
            }

            case 'TRAINING_AREA':
                useGameStore.getState().showSparky(t('dialogue.trainingUpgrading'));
                break;

            case 'ALGO_LAB':
                useGameStore.getState().setScene(GameScene.ALGO_LAB);
                break;

            case 'LEADERBOARDS':
                useGameStore.getState().setScene(GameScene.LEADERBOARDS);
                break;

            case 'ACHIEVEMENTS':
                useGameStore.getState().setScene(GameScene.ACHIEVEMENTS);
                break;

            case 'MULTIPLAYER':
                navigate('/v1/multiplayer');
                break;

            case 'DAILY_QUESTS':
                useGameStore.getState().showSparky(t('dialogue.dailyQuestsBuilding'));
                break;

            case 'BOSS_EVENTS':
                useGameStore.getState().showSparky(t('dialogue.noBossEvent'));
                break;

            case 'CLASSROOM_MODE':
                useGameStore.getState().showSparky(t('dialogue.classroomBuilding'));
                break;

            case 'UGC':
            case 'QUESTION_CRAFTER':
            case 'TEST_CRAFTER':
                useGameStore.getState().showSparky(t('dialogue.contentToolsBuilding'));
                break;

            case 'AI_HINTS':
            case 'ERROR_DETECTION':
            case 'CONTENT_GENERATION':
                useGameStore.getState().showSparky(t('dialogue.aiAssistantReady'));
                break;

            case 'CHALLENGE':
                navigate('/v1/challenge');
                break;

            default:
                useGameStore.getState().showSparky(`⚠️ Tính năng "${feature}" đang được phát triển!`);
        }
    };

    return (
        <div className="dialogue-overlay">
            <AnimatePresence>
                <motion.div
                    className="dialogue-box"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    style={{
                        backgroundImage: `url("${npc.sprite.talk}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center'
                    }}
                >
                    {/* === HEADER (NAME & ROLE) === */}
                    <div className="dialogue-header">
                        <h3>{npc.displayName}</h3>
                    </div>

                    {/* === NỘI DUNG HỘI THOẠI === */}
                    <div className="dialogue-content">

                        {/* HIỂN THỊ TEXT (Chỉ hiện khi KHÔNG chọn ải) */}
                        {!isSelectingDungeon && (
                            <div className="dialogue-text">
                                <p>{currentDialogue.text}</p>
                                <span className="dialogue-role">{npc.description}</span>
                            </div>
                        )}

                        {/* HIỂN THỊ DANH SÁCH ẢI (Chỉ hiện khi ĐANG chọn ải) */}
                        {isSelectingDungeon && (
                            <div className="dungeon-selector-panel" style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                minHeight: 0
                            }}>
                                <h4 style={{ margin: '0 0 10px 0', flexShrink: 0 }}>{t('dialogue.chooseChallenge')}</h4>
                                {/* Scrollable Grid Container */}
                                <div className="dungeon-selector-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    overflowY: 'auto',
                                    paddingRight: '5px',
                                    flex: 1
                                }}>
                                    {[
                                        { id: 'dungeon_1', name: 'Ải 1: Hướng Dẫn' },
                                        { id: 'dungeon_2', name: 'Ải 2: Hỗn Loạn' },
                                        { id: 'dungeon_3', name: 'Ải 3: Dây Xích' },
                                        { id: 'dungeon_4', name: 'Ải 4: Hai Mặt' },
                                        { id: 'dungeon_5', name: 'Ải 5: Đệ Quy' },
                                        { id: 'dungeon_7', name: 'Ải 7: Lõi Hư Vô' },
                                    ].map(d => (
                                        <button
                                            key={d.id}
                                            className="feature-btn dungeon-btn"
                                            onClick={() => {
                                                useGameStore.getState().enterDungeon(d.id);
                                                handleClose();
                                            }}
                                            style={{ minHeight: '40px' }}
                                        >
                                            ⚔️ {d.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* === BOTTOM ROW: Features + Actions === */}
                        <div className="dialogue-bottom-row">

                            {/* === LIST BUTTON TÍNH NĂNG === */}
                            {npc.features && (npc.features?.length || 0) > 0 && (
                                <div className="dialogue-features">

                                    {/* --- LOGIC ĐẶC BIỆT: NÚT TOGGLE BACK / QUEST --- */}

                                    {isSelectingDungeon ? (
                                        // Khi đang chọn ải: Hiện nút Quay Lại
                                        <button
                                            className="feature-btn"
                                            onClick={() => setIsSelectingDungeon(false)}
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid #d4a036',
                                                color: '#d4a036'
                                            }}
                                        >
                                            {t('dialogue.back')}
                                        </button>
                                    ) : (
                                        // Khi bình thường: Hiện các nút tính năng chính
                                        <>
                                            {/* ƯU TIÊN 1: Nhận Nhiệm Vụ */}
                                            {npc.features?.includes('CAMPAIGN_QUESTS') && (
                                                <button className="feature-btn" onClick={() => handleFeatureClick('CAMPAIGN_QUESTS')}>
                                                    {t('dialogue.claimQuest')}
                                                </button>
                                            )}

                                            {/* ƯU TIÊN 2: Chọn Ải */}
                                            {npc.features?.includes('SELECT_DUNGEON') && (
                                                <button
                                                    className="feature-btn"
                                                    onClick={() => setIsSelectingDungeon(true)}
                                                    style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', fontWeight: 'bold' }}
                                                >
                                                    {t('dialogue.selectStage')}
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Các Feature Khác */}
                                    {npc.features?.includes('TRAINING_AREA') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('TRAINING_AREA')}>
                                            {t('dialogue.trainingArea')}
                                        </button>
                                    )}
                                    {npc.features?.includes('ALGO_LAB') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('ALGO_LAB')}>
                                            {t('dialogue.algoLab')}
                                        </button>
                                    )}
                                    {npc.features?.includes('SHOP') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('SHOP')}>
                                            {t('dialogue.shop')}
                                        </button>
                                    )}
                                    {npc.features?.includes('MULTIPLAYER') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('MULTIPLAYER')}>
                                            {t('dialogue.multiplayerArena')}
                                        </button>
                                    )}
                                    {npc.features?.includes('LEADERBOARDS') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('LEADERBOARDS')}>
                                            {t('dialogue.leaderboards')}
                                        </button>
                                    )}
                                    {npc.features?.includes('ACHIEVEMENTS') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('ACHIEVEMENTS')}>
                                            {t('dialogue.achievements')}
                                        </button>
                                    )}
                                    {npc.features?.includes('BOSS_EVENTS') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('CHALLENGE')}>
                                            🎖️ Tiếp nhận thử thách
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* === CÁC NÚT ĐIỀU HƯỚNG / CLOSE === */}
                            <div className="dialogue-actions">
                                {/* Chỉ hiện nút đóng/next khi KHÔNG đang chọn ải */}
                                {!isSelectingDungeon && (
                                    <>
                                        <button className="btn-skip" onClick={handleClose}>
                                            {t('dialogue.close')}
                                        </button>

                                        {(currentDialogue.nextId || currentDialogueIndex < npc.dialogues.length - 1) ? (
                                            <button className="btn-next" onClick={handleNext}>
                                                {t('dialogue.next')}
                                            </button>
                                        ) : (
                                            <button className="btn-close" onClick={handleClose}>
                                                {t('dialogue.complete')}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

