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
 * @component DialogueBox
 * @category UI Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { NPCS } from '../../data/models/NPC';
import './DialogueBox.css';

export const DialogueBox: React.FC = () => {
    // Hooks truy cập global state
    const { dialogueOpen, dialogueNPC, closeDialogue } = useGameStore();

    // State cục bộ để theo dõi dòng hội thoại hiện tại
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

<<<<<<< HEAD
    const [isSelectingDungeon, setIsSelectingDungeon] = useState(false);

=======
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
    // Không hiển thị nếu chưa kích hoạt hội thoại
    if (!dialogueOpen || !dialogueNPC) return null;

    // Lấy dữ liệu NPC từ ID
    const npc = NPCS[dialogueNPC];

    if (!npc) {
        console.error('Không tìm thấy dữ liệu NPC:', dialogueNPC);
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
<<<<<<< HEAD
        setIsSelectingDungeon(false); // Reset state chọn ải
        closeDialogue();
    };

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * FEATURE HANDLER - Xử Lý Tính Năng Đặc Biệt Của NPC
     * ═══════════════════════════════════════════════════════════════════════════
     * 
     * CHỨC NĂNG:
     * Xử lý các tính năng đặc biệt khi người chơi tương tác với NPC dựa trên role.
     * 
     * FLOW CHÍNH:
     * 1. Đóng dialogue
     * 2. Phân loại feature theo type
     * 3. Thực thi logic tương ứng
     * 4. Cập nhật game state hoặc chuyển scene
     * 
     * KỸ THUẬT SỬ DỤNG:
     * - Switch-case pattern matching
     * - State management (Zustand store)
     * - Conditional logic chains
     * - Scene navigation
     */
    const handleFeatureClick = (feature: string) => {
        setIsSelectingDungeon(false); // Reset UI mode
        closeDialogue(); // UI cleanup - Đóng hội thoại trước khi xử lý

        switch (feature) {
            // ───────────────────────────────────────────────────────────────────
            // SHOP FEATURE - Chức năng Cửa Hàng (Bork - The Blacksmith)
            // ───────────────────────────────────────────────────────────────────
            // Role: MERCHANT
            // Mô tả: Chuyển người chơi đến scene Shop để mua trang trí/trang phục
            // Algorithm: Direct scene transition
            // ───────────────────────────────────────────────────────────────────
            case 'SHOP':
                useGameStore.getState().setScene(GameScene.SHOP);
                break;

            // ───────────────────────────────────────────────────────────────────
            // CAMPAIGN QUESTS - Nhiệm Vụ Chiến Dịch (Professor Alric)
            // ───────────────────────────────────────────────────────────────────
            // Role: QUEST_GIVER
            // Mô tả: Giao nhiệm vụ theo storyline progression (6 chapters)
            // 
            // ALGORITHM: Linear Quest Chain Progression
            // 1. Kiểm tra quest đã hoàn thành (completedQuests array)
            // 2. Xác định quest tiếp theo theo thứ tự chapter
            // 3. Validate duplicate (tránh nhận lại quest đang active)
            // 4. Add quest vào activeQuests hoặc thông báo
            // 
            // FLOW:
            // intro_1 → chapter_2 → chapter_3 → chapter_4 → chapter_5 → END
            // ───────────────────────────────────────────────────────────────────
            case 'CAMPAIGN_QUESTS': {
                const { activeQuests, completedQuests, startQuest } = usePlayerStore.getState();

                // Quest progression map - Định nghĩa chuỗi nhiệm vụ theo thứ tự
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

                // Tìm quest tiếp theo chưa hoàn thành (linear search)
                const questToGive = QUEST_CHAIN.find(q => !completedQuests.includes(q)) || '';

                // Edge case: Đã hoàn thành tất cả quest
                if (!questToGive) {
                    useGameStore.getState().showSparky('🎉 Bạn đã hoàn thành tất cả nhiệm vụ chiến dịch! Tuyệt vời!');
                    break;
                }

                // Validation: Tránh duplicate quest
                if (activeQuests.includes(questToGive)) {
                    useGameStore.getState().showSparky('📋 Bạn đang thực hiện nhiệm vụ này rồi. Hãy kiểm tra Sổ Tay (Q)!');
                } else {
                    // State mutation: Thêm quest vào active list
                    startQuest(questToGive);
                    useGameStore.getState().showSparky(`📜 Đã nhận nhiệm vụ: ${QUEST_NAMES[questToGive]}!`);
                }
                break;
            }

            // ───────────────────────────────────────────────────────────────────
            // TRAINING AREA - Khu Tập Luyện (Linh - The Archivist)
            // ───────────────────────────────────────────────────────────────────
            // Role: TRAINER/ARCHIVIST
            // Mô tả: Cho phép luyện tập topic tự chọn, không phụ thuộc storyline
            // TODO: Implement Training Mode scene với topic selector
            // ───────────────────────────────────────────────────────────────────
            case 'TRAINING_AREA':
                // TODO: Chuyển sang scene TRAINING với UI:
                // - Topic grid (Arrays, Sorting, Trees, Graphs...)
                // - Difficulty selector (Easy/Medium/Hard)
                // - Custom question counter
                useGameStore.getState().showSparky('🚧 Khu vực này đang được nâng cấp! Vui lòng quay lại sau.');
                break;

            // ───────────────────────────────────────────────────────────────────
            // ALGO LAB - Phòng Thí Nghiệm (Linh)
            // ───────────────────────────────────────────────────────────────────
            // Role: ARCHIVIST/TRAINER
            // Mô tả: Nơi chạy thử code mẫu và thử nghiệm thuật toán
            // ───────────────────────────────────────────────────────────────────
            case 'ALGO_LAB':
                useGameStore.getState().setScene(GameScene.ALGO_LAB);
                break;

            // ───────────────────────────────────────────────────────────────────
            // LEADERBOARDS - Bảng Xếp Hạng (The Bookkeeper)
            // ───────────────────────────────────────────────────────────────────
            // Role: ARCHIVIST
            // Mô tả: Hiển thị leaderboards toàn server và thành tựu cá nhân
            // Algorithm: Direct scene transition to pre-built leaderboard view
            // ───────────────────────────────────────────────────────────────────
            case 'LEADERBOARDS':
                useGameStore.getState().setScene(GameScene.LEADERBOARDS);
                break;

            // ───────────────────────────────────────────────────────────────────
            // ACHIEVEMENTS - Thành Tựu (The Bookkeeper)
            // ───────────────────────────────────────────────────────────────────
            // Role: ARCHIVIST
            // Mô tả: Xem danh sách achievements đã đạt được
            // Algorithm: Transition to achievements gallery
            // ───────────────────────────────────────────────────────────────────
            case 'ACHIEVEMENTS':
                useGameStore.getState().setScene(GameScene.ACHIEVEMENTS);
                break;

            // ───────────────────────────────────────────────────────────────────
            // MULTIPLAYER - Chế Độ Nhiều Người Chơi (Guild Leader)
            // ───────────────────────────────────────────────────────────────────
            // Role: GUILD_MASTER
            // Mô tả: Các chế độ PvP, Co-op, Classroom
            // TODO: Implement multiplayer lobby với matchmaking
            // Features:
            // - PvP Battle: 1v1 code challenges
            // - Co-op Dungeon: Team-based quests
            // - Classroom Mode: Teacher-led sessions
            // ───────────────────────────────────────────────────────────────────
            case 'MULTIPLAYER':
                // TODO: Chuyển sang scene ARENA/MULTIPLAYER_LOBBY khi đã implement
                // Hiện tại: Show thông báo chờ phát triển
                useGameStore.getState().showSparky('⚔️ Đấu trường đang được xây dựng! Sớm thôi bạn sẽ có thể thách đấu bạn bè!');
                break;

            // ───────────────────────────────────────────────────────────────────
            // DAILY QUESTS - Nhiệm Vụ Hàng Ngày (Guild Leader)
            // ───────────────────────────────────────────────────────────────────
            // Role: GUILD_MASTER
            // Mô tả: Refresh mỗi ngày, thưởng bonus
            // Algorithm: 
            // 1. Check last reset timestamp
            // 2. Generate new daily quests nếu > 24h
            // 3. Show available dailies
            // ───────────────────────────────────────────────────────────────────
            case 'DAILY_QUESTS':
                useGameStore.getState().showSparky('📅 Nhiệm vụ hàng ngày đang được phát triển!');
                break;

            // ───────────────────────────────────────────────────────────────────
            // BOSS EVENTS - Sự Kiện Trùm (The Oracle)
            // ───────────────────────────────────────────────────────────────────
            // Role: ORACLE
            // Mô tả: World boss, timed events, seasonal challenges
            // Algorithm:
            // 1. Check active events từ server/config
            // 2. Display event details (time, rewards)
            // 3. Allow participation nếu meet requirements
            // ───────────────────────────────────────────────────────────────────
            case 'BOSS_EVENTS':
                useGameStore.getState().showSparky('🌟 Không có sự kiện trùm nào đang diễn ra!');
                break;

            // ───────────────────────────────────────────────────────────────────
            // CLASSROOM MODE - Chế Độ Lớp Học (Guild Leader)
            // ───────────────────────────────────────────────────────────────────
            // Role: GUILD_MASTER
            // Mô tả: Teacher tạo phòng, students join để làm bài tập đồng bộ
            // TODO: Implement real-time collaboration với WebSocket
            // ───────────────────────────────────────────────────────────────────
            case 'CLASSROOM_MODE':
                useGameStore.getState().showSparky('👨‍🏫 Chế độ lớp học đang được phát triển!');
                break;

            // ───────────────────────────────────────────────────────────────────
            // UGC (User Generated Content) - Nội Dung Do Người Dùng Tạo (Linh)
            // ───────────────────────────────────────────────────────────────────
            // Role: ARCHIVIST
            // Mô tả: Cho phép tạo câu hỏi, challenge, và chia sẻ với cộng đồng
            // TODO: Implement UGC studio với validation
            // ───────────────────────────────────────────────────────────────────
            case 'UGC':
            case 'QUESTION_CRAFTER':
            case 'TEST_CRAFTER':
                useGameStore.getState().showSparky('✍️ Công cụ tạo nội dung đang được hoàn thiện!');
                break;

            // ───────────────────────────────────────────────────────────────────
            // AI FEATURES - Tính Năng AI (Sparky)
            // ───────────────────────────────────────────────────────────────────
            // Role: COMPANION
            // Mô tả: Real-time hints, bug detection, code generation
            // Algorithm: ML model integration (đã có sẵn qua Sparky tooltip)
            // ───────────────────────────────────────────────────────────────────
            case 'AI_HINTS':
            case 'ERROR_DETECTION':
            case 'CONTENT_GENERATION':
                // Sparky features đã tích hợp trong gameplay, không cần action riêng
                useGameStore.getState().showSparky('Sparky luôn sẵn sàng hỗ trợ bạn!');
                break;

            // ───────────────────────────────────────────────────────────────────
            // DEFAULT CASE - Tính năng chưa được implement
            // ───────────────────────────────────────────────────────────────────
            default:
                useGameStore.getState().showSparky(`⚠️ Tính năng "${feature}" đang được phát triển!`);
=======
        closeDialogue();
    };

    // Xử lý sự kiện khi nhấn nút tính năng
    const handleFeatureClick = (feature: string) => {
        closeDialogue(); // Đóng hội thoại trước khi chuyển cảnh

        switch (feature) {
            case 'SHOP':
                useGameStore.getState().setScene(GameScene.SHOP);
                break;
            case 'CAMPAIGN_QUESTS':
                const questId = 'quest_intro_1'; // Nhiệm vụ khởi đầu
                const { activeQuests, completedQuests, startQuest } = usePlayerStore.getState();

                if (completedQuests.includes(questId)) {
                    useGameStore.getState().showSparky('Bạn đã hoàn thành nhiệm vụ này rồi! Tuyệt vời!');
                } else if (activeQuests.includes(questId)) {
                    useGameStore.getState().showSparky('Bạn đang thực hiện nhiệm vụ này. Hãy kiểm tra Sổ Tay (Q)!');
                } else {
                    startQuest(questId);
                    useGameStore.getState().showSparky('📜 Đã nhận nhiệm vụ: Khởi Đầu Hành Trình!');
                }
                break;
            case 'TRAINING_AREA':
                // useGameStore.getState().setScene(GameScene.LOGIC_FARM);
                useGameStore.getState().showSparky('🚧 Khu vực này đang được nâng cấp! Vui lòng quay lại sau.');
                break;
            case 'MULTIPLAYER':
                useGameStore.getState().setScene(GameScene.LEADERBOARDS);
                break;
            default:
                useGameStore.getState().showSparky('Tính năng này đang được phát triển!');
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
        }
    };

    return (
        <div className="dialogue-overlay">
            <AnimatePresence>
                <motion.div
                    className="dialogue-box"
<<<<<<< HEAD
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
=======
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                >
                    {/* === CHÂN DUNG NPC === */}
                    <div className="dialogue-portrait">
                        <img
                            src={npc.sprite.talk}
                            alt={npc.displayName}
                        />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                    </div>

                    {/* === NỘI DUNG HỘI THOẠI === */}
                    <div className="dialogue-content">
<<<<<<< HEAD

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
                                <h4 style={{ margin: '0 0 10px 0', flexShrink: 0 }}>🔻 Chọn Thử Thách 🔻</h4>
                                {/* Scrollable Grid Container */}
                                <div className="dungeon-selector-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    overflowY: 'auto',  // Enable scrolling
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
                                {/* Removed Back Button from here */}
                            </div>
                        )}

                        {/* === BOTTOM ROW: Features + Actions === */}
                        <div className="dialogue-bottom-row">

                            {/* === LIST BUTTON TÍNH NĂNG === */}
                            {npc.features && (npc.features?.length || 0) > 0 && (
                                <div className="dialogue-features">

                                    {/* --- LOGIC ĐẶC BIỆT: NÚT TOGGLE BACK / QUEST --- */}

                                    {isSelectingDungeon ? (
                                        // Khi đang chọn ải: Hiện nút Quay Lại (thay cho nhận nhiệm vụ/chọn ải)
                                        <button
                                            className="feature-btn"
                                            onClick={() => setIsSelectingDungeon(false)}
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid #d4a036',
                                                color: '#d4a036'
                                            }}
                                        >
                                            ⬅️ Quay Lại
                                        </button>
                                    ) : (
                                        // Khi bình thường: Hiện các nút tính năng chính
                                        <>
                                            {/* ƯU TIÊN 1: Nhận Nhiệm Vụ (Chỉ hiện khi KHÔNG chọn ải) */}
                                            {npc.features?.includes('CAMPAIGN_QUESTS') && (
                                                <button className="feature-btn" onClick={() => handleFeatureClick('CAMPAIGN_QUESTS')}>
                                                    📜 Nhận Nhiệm Vụ
                                                </button>
                                            )}

                                            {/* ƯU TIÊN 2: Chọn Ải (Chỉ hiện khi KHÔNG chọn ải) */}
                                            {npc.features?.includes('SELECT_DUNGEON') && (
                                                <button
                                                    className="feature-btn"
                                                    onClick={() => setIsSelectingDungeon(true)}
                                                    style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', fontWeight: 'bold' }}
                                                >
                                                    🗺️ Chọn Ải
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Các Feature Khác (Luôn hiện nếu có, trừ khi bị collision layout, thường thì ít NPC có nhiều feature conflicting) */}
                                    {npc.features?.includes('TRAINING_AREA') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('TRAINING_AREA')}>
                                            🎓 Khu Tập Luyện
                                        </button>
                                    )}
                                    {npc.features?.includes('ALGO_LAB') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('ALGO_LAB')}>
                                            🧪 Phòng Thí Nghiệm
                                        </button>
                                    )}
                                    {npc.features?.includes('SHOP') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('SHOP')}>
                                            🛒 Xem Cửa Hàng
                                        </button>
                                    )}
                                    {npc.features?.includes('MULTIPLAYER') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('MULTIPLAYER')}>
                                            🤝 Vào Đấu Trường
                                        </button>
                                    )}
                                    {npc.features?.includes('LEADERBOARDS') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('LEADERBOARDS')}>
                                            🏆 Bảng Xếp Hạng
                                        </button>
                                    )}
                                    {npc.features?.includes('ACHIEVEMENTS') && (
                                        <button className="feature-btn" onClick={() => handleFeatureClick('ACHIEVEMENTS')}>
                                            🎖️ Thành Tựu
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* === CÁC NÚT ĐIỀU HƯỚNG / CLOSE === */}
                            <div className="dialogue-actions">
                                {/* Chỉ hiện nút đóng/next khi KHÔNG đang chọn ải (để tránh rối UI) */}
                                {!isSelectingDungeon && (
                                    <>
                                        <button className="btn-skip" onClick={handleClose}>
                                            Đóng ✕
                                        </button>

                                        {(currentDialogue.nextId || currentDialogueIndex < npc.dialogues.length - 1) ? (
                                            <button className="btn-next" onClick={handleNext}>
                                                Tiếp Theo ➡️
                                            </button>
                                        ) : (
                                            <button className="btn-close" onClick={handleClose}>
                                                Hoàn Tất ✓
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

=======
                        {/* Header: Tên & Vai Trò */}
                        <div className="dialogue-header">
                            <h3>{npc.displayName}</h3>
                            <span className="dialogue-role">{npc.description}</span>
                        </div>

                        {/* Văn Bản Chính */}
                        <div className="dialogue-text">
                            <p>{currentDialogue.text}</p>
                        </div>

                        {/* Các Nút Điều Hướng */}
                        <div className="dialogue-actions">
                            {/* Nút Skip: Đóng nhanh */}
                            <button className="btn-skip" onClick={handleClose}>
                                Đóng ✕
                            </button>

                            {(currentDialogue.nextId || currentDialogueIndex < npc.dialogues.length - 1) ? (
                                <button className="btn-next" onClick={handleNext}>
                                    Tiếp Theo ➡️
                                </button>
                            ) : (
                                <button className="btn-close" onClick={handleClose}>
                                    Hoàn Tất ✓
                                </button>
                            )}
                        </div>

                        {/* === TÍNH NĂNG NPC (NẾU CÓ) === */}
                        {npc.features && npc.features.length > 0 && (
                            <div className="dialogue-features">
                                {npc.features.includes('CAMPAIGN_QUESTS') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('CAMPAIGN_QUESTS')}>
                                        📜 Nhận Nhiệm Vụ
                                    </button>
                                )}
                                {npc.features.includes('TRAINING_AREA') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('TRAINING_AREA')}>
                                        🎓 Khu Tập Luyện
                                    </button>
                                )}
                                {npc.features.includes('SHOP') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('SHOP')}>
                                        🛒 Xem Cửa Hàng
                                    </button>
                                )}
                                {npc.features.includes('MULTIPLAYER') && (
                                    <button className="feature-btn" onClick={() => handleFeatureClick('MULTIPLAYER')}>
                                        🤝 Vào Đấu Trường
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
