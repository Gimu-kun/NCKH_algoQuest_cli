/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * THẾ GIỚI TRUNG TÂM (Hub World Scene)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Màn hình chính nơi người chơi quay lại sau mỗi chuyến phiêu lưu (Dungeon).
 * Nơi tập trung các NPC cung cấp dịch vụ và nhiệm vụ.
 * 
 * CÁC KHU VỰC:
 * 1. NPC Zones: Tương tác với NPC (Giáo sư Alric, Linh, Bork, v.v.).
 * 2. Navigation: Cổng vào Dungeon, Logic Farm, và các màn hình phụ (Thành tựu, Leaderboard).
 * 3. Sparky Companion: AI trợ lý bay lơ lửng, sẵn sàng hỗ trợ.
 * 
 * KỸ THUẬT:
 * - Framer Motion: Animation cho UI panels và nhân vật.
 * - Game Store Interaction: Trigger dialogue, chuyển cảnh.
 * 
 * @component HubWorld
 * @category Game Scene
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, GameScene } from '../../store/gameStore';
import { HUD } from '../../components/ui/HUD';
import './HubWorld.css';
import Cookies from 'js-cookie'
import { verifyToken } from '../../services/authApiService';
import type { UserGeneralDto } from '../../types/authType';
import { usePlayerStore } from '../../store/playerStore';
import { useNavigate } from 'react-router-dom';
import type { dialogueStateType } from '../../types/dialogueType';
import { DialogueBox } from '../../components/ui/DialogueBox';
import { useTranslation } from '../../i18n';


export const HubWorld: React.FC = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();

    // Truy cập Global State để điều khiển chuyển cảnh và hội thoại
    const [ dialogueState , setDialogueState ] = useState<dialogueStateType>({
        isOpen:false,
        npcId:""
    })
    const { theme, showSparky } = useGameStore();
    const [isVerifying, setIsVerifying] = useState(true);
    const { hydrateFromServer } = usePlayerStore();
    
    useEffect(() => {
        const checkAuth = async () => {
          const token = Cookies.get('auth_token');
    
          if (!token) {
            navigate("/");
            return;
          }
    
          const response:{
            success:boolean,
            message?:string,
            data?:UserGeneralDto} 
            = await verifyToken(token);
    
          if (!response.success) {
            Cookies.remove('auth_token');
            navigate("/");
          }
          const userData = response.data
          
          if(userData){
            hydrateFromServer(userData)
          }
          setIsVerifying(false);
        };
    
        checkAuth();
      }, []);

    const handleNpcClick = (id:string) => {
        setDialogueState(prev => {
            if (prev.isOpen && prev.npcId === id) {
                return { isOpen: false, npcId: "" };
            }
            return { isOpen: true, npcId: id };
        });
    }


    if (isVerifying) {
        return (
          <div className="verify-loading-overlay">
            <div className="spinner-container">
              <div className="magic-spinner"></div>
              <p className="loading-text">{t('hub.verifyingMagic')}</p>
            </div>
          </div>
        );
      }

    return (
        <div className="hub-world">
            {
                dialogueState.isOpen && 
                <DialogueBox npcId={dialogueState.npcId} setOpenState={setDialogueState}/>
            }
            {/* Background Layer - Dynamic theo Theme */}
            <div
                className="hub-background"
            />

            {/* Heads-Up Display (Thanh trạng thái người chơi) */}


            {/* Main Content Layer */}
            <div className="hub-content">

                {/* Welcome Banner Animation */}
                <motion.div
                    className="welcome-panel"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h1>{t('hub.title')} - {t('hub.subtitle')}</h1>
                    <p>{t('hub.worldDescription')}</p>
                    <button className="start-btn" onClick={()=>{navigate("/v1/roadmap")}}>{t('hub.startAdventure')}</button>
                </motion.div>

                {/* === KHU VỰC NPC (NPC INTERACTION ZONES) === */}
                <div className="npc-zones">

                    {/* Professor Alric - Quest Giver */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() =>handleNpcClick("ALRIC")}
                    >
                        <img src="/assets/Ảnh Assets/Nhân vật/Giáo Sư Alric (The Mentor)/Giáo Sư Alric (Idle).png" alt="Professor Alric" />
                        <h3>{t('hub.npcs.professor')}</h3>
                        <p>{t('hub.npcs.professorRole')}</p>
                        <span className="quest-marker">!</span>
                    </motion.div>

                    {/* Linh - The Archivist */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleNpcClick("LINH")}
                    >
                        <img src="/assets/Ảnh Assets/Nhân vật/Linh (The Archivist)/Linh (Idle).png" alt="Linh" />
                        <h3>Linh</h3>
                        <p>{t('hub.librarianAndTraining')}</p>
                    </motion.div>

                    {/* Bork - The Blacksmith */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleNpcClick("BORK")}
                    >
                        <img src="/assets/Ảnh Assets/Nhân vật/Bork (The Blacksmith)/Bork (Idle).png" alt="Bork" />
                        <h3>Bork</h3>
                        <p>{t('hub.shopAndDecor')}</p>
                    </motion.div>

                    {/* Guild Leader */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleNpcClick("LEADER")}
                    >
                        <img src="/assets/Ảnh Assets/Nhân vật/Thủ Lĩnh Guild (The Guild Leader)/Thủ Lĩnh Guild (Idle).png" alt="Guild Leader" />
                        <h3>{t('hub.guildMaster')}</h3>
                        <p>{t('hub.multiplayerQuests')}</p>
                    </motion.div>

                    {/* The Oracle */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleNpcClick("ORACLE")}
                    >
                        <img src="/assets/Ảnh Assets/Nhân vật/Nhà Tiên Tri (The Oracle)/Nhà Tiên Tri (Idle).png" alt="Oracle" />
                        <h3>Nhà Tiên Tri</h3>
                        <p>Sự Kiện Trùm</p>
                    </motion.div>

                    {/* The Bookkeeper */}
                    <motion.div
                        className="npc-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleNpcClick("BOOKKEEPER")}
                    >
                        <img src="/assets/Ảnh Assets/Nhân vật/Kẻ Giữ Sách ( The Bookkeeper)/Kẻ Giữ Sách (Idle).png" alt="Bookkeeper" />
                        <h3>Kẻ Giữ Sách</h3>
                        <p>Bảng Xếp Hạng</p>
                    </motion.div>
                </div>

                {/* === NAVIGATION BUTTONS === */}
                <div className="farm-access">
                    <button className="farm-btn" onClick={() => navigate('/v1/multiplayer')}>
                        <i className="fi fi-rr-swords"></i> Đấu Trường Multiplayer
                    </button>

                    <button
                        className="farm-btn disabled"
                        onClick={() => showSparky(t('dialogue.trainingUpgrading'))}
                        style={{ opacity: 0.6, cursor: 'not-allowed', filter: 'grayscale(1)' }}
                    >
                        <i className="fi fi-rr-lock"></i> {t('hub.logicFarmMaintenance')}
                    </button>

                    <button className="farm-btn achievements-btn" onClick={() => navigate("/v1/achievements")}>
                        <i className="fi fi-rr-trophy"></i> {t('hub.achievementsAndBadges')}
                    </button>

                    <button className="farm-btn leaderboards-btn" onClick={() => navigate("/v1/leaderboards")}>
                        <i className="fi fi-rr-stats"></i> Bảng Xếp Hạng
                    </button>
                </div>

                {/* === DEV TOOLS (Test Actions) === */}
                <div className="test-actions">
                        <h3><i className="fi fi-rr-flask"></i> {t('hub.devModeTitle')}</h3>
                    <button className="test-btn" onClick={()=>{}}>
                        <i className="fi fi-rr-hammer"></i> {t('hub.testAncientBoard')}
                    </button>
                    <button className="test-btn" onClick={() => navigate("/v1/roadmap")}>
                        <i className="fi fi-rr-book"></i> {t('hub.studyMaterialsRoadmap')}
                    </button>
                </div>
            </div>

            {/* Sparky Animation */}
            <motion.div
                className="sparky-companion"
                animate={{
                    y: [0, -10, 0], // Floating Effect
                    rotate: [0, 2, -2, 0] // Gentle Wobble
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <img
                    src="/assets/Ảnh Assets/Nhân vật/Sparky/Sparky (Normal).png"
                    alt="Sparky"
                />
            </motion.div>
        </div>
    );
};
