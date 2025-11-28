import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home.tsx";
import MainLayout from "../components/layouts/MainLayout.tsx";

const RoutesApp = () => (
    <Routes>
        <Route path="/" element={<MainLayout/>}>
            <Route path="/" element={<Home/>} />
        </Route>
    </Routes>
)

export default RoutesApp;