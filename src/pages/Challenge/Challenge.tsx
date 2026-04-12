import { Outlet } from "react-router-dom";
import './Challenge.css'

export const Challenge: React.FC = () => {
    return (
        <div className="chlg_container">
            <div className={`chlg_background`} />
            <div className="chlg_left"></div>

            <div className="chlg_middle">
                <Outlet/>
            </div>

            <div className="chlg_right"></div>
        </div>
    );
};