import { Suspense, lazy } from "react"
import { Route, Routes } from "react-router-dom"
import { BlankLayout } from "../components/layout/BlankLayout"
import { MainLayout } from "../components/layout/MainLayout"

const MainMenu = lazy(() => import("../pages/MainMenu/MainMenu").then(module => ({ default: module.MainMenu })));
const HubWorld = lazy(() => import("../pages/HubWorld/HubWorld").then(module => ({ default: module.HubWorld })));
const Achievements = lazy(() => import("../pages/Achievements").then(module => ({ default: module.Achievements })));
const Leaderboards = lazy(() => import("../pages/Leaderboards").then(module => ({ default: module.Leaderboards })));
const Roadmap = lazy(() => import("../pages/Roadmap/Roadmap").then(module => ({ default: module.Roadmap })));
const Adventure = lazy(() => import("../pages/Adventure/Adventure").then(module => ({ default: module.Adventure })));
const StagePlay = lazy(() => import("../pages/StagePlay/StagePlay").then(module => ({ default: module.StagePlay })));
const AlgoLab = lazy(() => import("../pages/AlgoLab").then(module => ({ default: module.AlgoLab })));
const Multiplayer = lazy(() => import("../pages/Multiplayer/Multiplayer").then(module => ({ default: module.Multiplayer })));
const BugHuntArena = lazy(() => import("../pages/Multiplayer/BugHuntArena").then(module => ({ default: module.BugHuntArena })));
const CodeDuelDraft = lazy(() => import("../pages/Multiplayer/CodeDuelDraft").then(module => ({ default: module.CodeDuelDraft })));
const RaceToPath = lazy(() => import("../pages/Multiplayer/RaceToPath").then(module => ({ default: module.RaceToPath })));
const TowerDefenseCoop = lazy(() => import("../pages/Multiplayer/TowerDefenseCoop").then(module => ({ default: module.TowerDefenseCoop })));
const MemoryRelay = lazy(() => import("../pages/Multiplayer/MemoryRelay").then(module => ({ default: module.MemoryRelay })));
const TournamentBracket = lazy(() => import("../pages/Multiplayer/TournamentBracket").then(module => ({ default: module.TournamentBracket })));
const RankedDraftArena = lazy(() => import("../pages/Multiplayer/RankedDraftArena").then(module => ({ default: module.RankedDraftArena })));
const CoopRaidBoss = lazy(() => import("../pages/Multiplayer/CoopRaidBoss").then(module => ({ default: module.CoopRaidBoss })));
const ReviewDetail = lazy(() => import("../pages/ReviewDetail/ReviewDetail"));

const RouteFallback = () => <div className="route-fallback">Đang tải màn chơi...</div>;

export const RouteList = () => {
    return (
        <Suspense fallback={<RouteFallback />}>
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
                    <Route path="multiplayer" element={<Multiplayer/>}/>
                    <Route path="multiplayer/bug-hunt" element={<BugHuntArena/>}/>
                    <Route path="multiplayer/code-duel" element={<CodeDuelDraft/>}/>
                    <Route path="multiplayer/race-to-path" element={<RaceToPath/>}/>
                    <Route path="multiplayer/tower-defense" element={<TowerDefenseCoop/>}/>
                    <Route path="multiplayer/memory-relay" element={<MemoryRelay/>}/>
                    <Route path="multiplayer/tournament" element={<TournamentBracket/>}/>
                    <Route path="multiplayer/ranked-draft" element={<RankedDraftArena/>}/>
                    <Route path="multiplayer/raid-boss" element={<CoopRaidBoss/>}/>
                </Route>
            </Routes>
        </Suspense>
    )
}