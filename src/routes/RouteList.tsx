import { Outlet, Route, Routes } from "react-router-dom"
import { BlankLayout } from "../components/layout/BlankLayout"
import { MainMenu } from "../pages/MainMenu/MainMenu"
import { MainLayout } from "../components/layout/MainLayout"
import { HubWorld } from "../pages/HubWorld/HubWorld"
import { Achievements } from "../pages/Achievements"
import { Leaderboards } from "../pages/Leaderboards"
import { Roadmap } from "../pages/Roadmap/Roadmap"
import { Adventure } from "../pages/Adventure/Adventure"
import { StagePlay } from "../pages/StagePlay/StagePlay"
import { AlgoLab } from "../pages/AlgoLab"
import ReviewDetail from "../pages/ReviewDetail/ReviewDetail"
import { Challenge } from "../pages/Challenge/Challenge"
import { ChallengeMenu } from "../pages/ChallengeMenu/ChallengeMenu"
import { ChallengePlay } from "../pages/ChallengePlay/ChallengePlay"
import TeamBattleLobbyWrapper from "../pages/TeamBattle/TeamBattleLobbyWrapper/TeamBattleLobbyWrapper"

export const RouteList = () => {
    return (
        <Routes>
            <Route path="/" element={<BlankLayout/>}>
                <Route path="/" element={<MainMenu/>}/>
            </Route>
            <Route path="/v1" element={<MainLayout/>}>
                <Route path="hub" element={<HubWorld/>}/>
                <Route path="roadmap" element={<Roadmap/>}/>
                <Route path="adventure/:id" element={<Adventure/>}/>
                <Route path="adventure/:id/stage/:stageId" element={<StagePlay />} />
                <Route path="adventure/review/:progressId" element={<ReviewDetail />} />
                <Route path="achievements" element={<Achievements/>}/>
                <Route path="leaderboards" element={<Leaderboards/>}/>
                <Route path="lab" element={<AlgoLab/>}/>
                <Route path="challenge" element={<Challenge/>}>
                    <Route path="" element={<ChallengeMenu/>}/>
                    <Route path=":sessionId/:progressId" element={<ChallengePlay/>}/>
                </Route>
                <Route path="battle/lobby/:roomId" element={<TeamBattleLobbyWrapper />} />
            </Route>
        </Routes>
    )
}