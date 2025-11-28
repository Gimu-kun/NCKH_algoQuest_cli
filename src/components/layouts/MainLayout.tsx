import Navbar from "../Navbar.tsx";
import {Outlet} from "react-router-dom";
import Footer from "../Footer.tsx";
import {useState} from "react";
import AuthForm from "../AuthForm.tsx";

const MainLayout = () => {
    const [authFormstate,setAuthFormstate] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState(false);
    return (
        <section className="relative min-h-screen ">
            {
                authFormstate && <AuthForm setAuthFormstate={setAuthFormstate} isLogin={isLogin} setIsLogin={setIsLogin}/>
            }
            <Navbar setAuthFormstate={setAuthFormstate} setIsLogin={setIsLogin}/>
            <Outlet/>
            <Footer/>
        </section>
    )
};

export default MainLayout;