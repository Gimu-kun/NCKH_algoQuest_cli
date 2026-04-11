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
                </Route>
            </Routes>
        </Suspense>
    )
}