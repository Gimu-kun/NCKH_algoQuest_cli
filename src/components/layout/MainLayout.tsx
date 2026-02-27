import { Outlet } from "react-router-dom"
import { HUD } from "../ui/HUD"

export const MainLayout = () => {
    return (
        <>
            <HUD />
            <Outlet/>
        </>
    )
}