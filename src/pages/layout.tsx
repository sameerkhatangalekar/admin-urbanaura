import { Outlet } from "react-router-dom"

import Sidebar from "../components/sidebar"

const Layout = () => {
    return (
        <main className="relative">
            <Sidebar />
            <div className="flex h-screen w-screen pl-16">
                <Outlet />
            </div>
        </main>
    )
}

export default Layout