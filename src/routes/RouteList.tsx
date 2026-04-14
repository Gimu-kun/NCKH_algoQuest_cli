import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BlankLayout } from '../components/layout/BlankLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { RouteErrorBoundary } from '../components/ui/RouteErrorBoundary';
import { RouteLoadingFallback } from '../components/ui/RouteLoadingFallback';

const MainMenu = lazy(() => import('../pages/MainMenu/MainMenu').then((module) => ({ default: module.MainMenu })));
const HubWorld = lazy(() => import('../pages/HubWorld/HubWorld').then((module) => ({ default: module.HubWorld })));
const Achievements = lazy(() => import('../pages/Achievements').then((module) => ({ default: module.Achievements })));
const Leaderboards = lazy(() => import('../pages/Leaderboards').then((module) => ({ default: module.Leaderboards })));
const Roadmap = lazy(() => import('../pages/Roadmap/Roadmap').then((module) => ({ default: module.Roadmap })));
const Adventure = lazy(() => import('../pages/Adventure/Adventure').then((module) => ({ default: module.Adventure })));
const StagePlay = lazy(() => import('../pages/StagePlay/StagePlay').then((module) => ({ default: module.StagePlay })));
const AlgoLab = lazy(() => import('../pages/AlgoLab').then((module) => ({ default: module.AlgoLab })));
const ReviewDetail = lazy(() => import('../pages/ReviewDetail/ReviewDetail'));
const Challenge = lazy(() => import('../pages/Challenge/Challenge').then((module) => ({ default: module.Challenge })));
const ChallengeMenu = lazy(() => import('../pages/ChallengeMenu/ChallengeMenu').then((module) => ({ default: module.ChallengeMenu })));
const ChallengePlay = lazy(() => import('../pages/ChallengePlay/ChallengePlay').then((module) => ({ default: module.ChallengePlay })));
const TeamBattleLobbyWrapper = lazy(() => import('../pages/TeamBattle/TeamBattleLobbyWrapper/TeamBattleLobbyWrapper'));

export const RouteList = () => {
    return (
        <RouteErrorBoundary>
            <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                    <Route path="/" element={<BlankLayout />}>
                        <Route path="/" element={<MainMenu />} />
                    </Route>
                    <Route path="/v1" element={<MainLayout />}>
                        <Route path="hub" element={<HubWorld />} />
                        <Route path="roadmap" element={<Roadmap />} />
                        <Route path="adventure/:id" element={<Adventure />} />
                        <Route path="adventure/:id/stage/:stageId" element={<StagePlay />} />
                        <Route path="adventure/review/:progressId" element={<ReviewDetail />} />
                        <Route path="achievements" element={<Achievements />} />
                        <Route path="leaderboards" element={<Leaderboards />} />
                        <Route path="lab" element={<AlgoLab />} />
                        <Route path="challenge" element={<Challenge />}>
                            <Route path="" element={<ChallengeMenu />} />
                            <Route path=":sessionId/:progressId" element={<ChallengePlay />} />
                        </Route>
                        <Route path="battle/lobby/:roomId" element={<TeamBattleLobbyWrapper />} />
                    </Route>
                </Routes>
            </Suspense>
        </RouteErrorBoundary>
    );
};
