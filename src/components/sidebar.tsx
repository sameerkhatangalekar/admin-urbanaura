import { IoIosArrowBack, IoIosArrowForward, IoIosLogOut } from "react-icons/io"
import { Menu, Transition } from "@headlessui/react"
import { VscAccount } from "react-icons/vsc"
import SidebarItem from "./sidebar-item"
import { MdOutlineDashboard } from "react-icons/md"
import { BiPackage } from "react-icons/bi"
import { CiBoxes, } from "react-icons/ci"
import { Fragment, createContext, useState } from "react"
import { useAppDispatch } from "../redux/redux-hooks"
import { logout } from "../redux/slices/user-slice"
import Avatar, { genConfig } from 'react-nice-avatar'

type SidebarContextProps = {
    isExpanded: Boolean
}

export const SidebarContext = createContext<SidebarContextProps>({
    isExpanded: false
});
const Sidebar = () => {
    const config = genConfig()
    const [isExpanded, setExpanded] = useState(false);
    const dispatch = useAppDispatch();
    return (

        <aside className="h-screen absolute top-0 left-0 bg-black z-[10]">
            <nav className="h-full w-fit flex flex-col  border-r-[0.5px] border-gray-900 shadow-md">
                <div className={`p-4 pb-2 flex ${isExpanded ? 'justify-between space-x-3' : 'justify-center'} items-center`}>

                    <h1 className={`font-bold text-3xl max-sm:text-2xl ${isExpanded ? 'block' : 'hidden'} transition-all text-white`}>UrbanAura</h1>
                    <button className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => setExpanded(!isExpanded)}>
                        {isExpanded ? <IoIosArrowBack size={20} /> : <IoIosArrowForward size={20} />}
                    </button>
                </div>
                <SidebarContext.Provider value={{ isExpanded }}>
                    <div className="flex-1 px-2 flex-col">
                        <div className="mb-1">
                            <SidebarItem icon={<MdOutlineDashboard size={24} />} title="Dashboard" alert="Dashboard" path={"/"} />
                        </div>
                        <div className="mb-1">
                            <SidebarItem icon={<CiBoxes size={24} />} title="Inventory" alert="Inventory" path={"/inventory"} />
                        </div>
                        <div className="mb-1">
                            <SidebarItem icon={<VscAccount size={24} />} title="Users" alert="Users" path={"/users"} />
                        </div>
                        <div className="mb-1">
                            <SidebarItem icon={<BiPackage size={24} />} title="Orders" alert="Orders" path={"/orders"} />
                        </div>
                    </div>
                </SidebarContext.Provider>

                <div className="p-3  flex items-center ">


                    <Menu as="div" className={`rounded-lg flex items-center justify-center relative`}>

                        <div>
                            <Menu.Button className="w-10 h-10 rounded-full bg-white text-black hover:bg-gray-400 transition-colors flex items-center justify-center" >
                                <Avatar {...config} className="w-10 h-10" />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute left-0 bottom-0  translate-x-12 -translate-y-12  mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                    <Menu.Item>
                                        {({ active }) => (

                                            <div className={`${active ? 'bg-teal-500 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm justify-between`} onClick={() => {
                                                    dispatch(logout())
                                                }}>
                                                Logout
                                                <IoIosLogOut />
                                            </div>
                                        )}

                                    </Menu.Item>

                                </div>

                            </Menu.Items>
                        </Transition>
                    </Menu>


                </div>
            </nav>

        </aside>
    )
}

export default Sidebar