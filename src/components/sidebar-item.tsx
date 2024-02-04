import { useContext } from "react"
import { SidebarContext } from "./sidebar"
import { Link } from "react-router-dom";

type SidebarItemProps = {
    icon: JSX.Element,
    title: string,
    alert: string,
    path: string,
}


const SidebarItem = ({ icon, title, path }: SidebarItemProps) => {
    const { isExpanded } = useContext(SidebarContext);
    return (
        <Link to={path}>
            <li className={`flex items-center  bg-white relative py-2 px-3 mt-0 rounded-lg font-medium cursor-pointer transition-colors text-gray-600 ${isExpanded ? 'max-sm:justify-start' : 'max-sm:justify-center'} group max-sm:py-1 max-sm:px-1 `}>
                <>
                    {icon}
                    <span className={`ml-2 transition-all text-black ${isExpanded ? "block" : "hidden"
                        }`}>{title}</span>

                    {
                        !isExpanded && <div
                            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-lime-100 text-lime-800 text-sm z-[10] invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
                        >
                            {title}
                        </div>
                    }</>
            </li>
        </Link>
    )
}

export default SidebarItem