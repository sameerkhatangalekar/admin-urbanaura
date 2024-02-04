import { useEffect, useState } from "react";
import { privateRequestInstance } from "../lib/constants";
import axios from "axios";
import toast from "react-hot-toast";


import { LineWave } from "react-loader-spinner";
import { OrderStatProps, RecentOrderProps, TotalStatsProps, UserProps } from "../lib/types";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import UserListItem from "@/components/user-list-item";



const Dashboard = () => {

    const [isTotalStatsLoading, setTotalStatsLoading] = useState(false);
    const [totalStatsError, setTotalStatsError] = useState(false);
    const [totalStats, setTotalStats] = useState<TotalStatsProps | null>(null);

    const [isOrderStatLoading, setOrderStatLoading] = useState(false);
    const [orderStatsError, setOrderStatsError] = useState(false);
    const [orderStats, setOrderStats] = useState<OrderStatProps[]>([]);

    const [isRecentOrdersLoading, setRecentOrderLoading] = useState(false);
    const [recentOrdersError, setRecentOrderError] = useState(false);
    const [recentOrders, setRecentOrders] = useState<RecentOrderProps[]>([]);

    const [isRecentUsersLoading, setRecentUsersLoading] = useState(false);
    const [recentUsersError, setRecentUsersError] = useState(false);
    const [recentUsers, setRecentUsers] = useState<UserProps[]>([]);



    const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    useEffect(() => {
        const totalStatsCallController = new AbortController();
        const recentUserStatsCallController = new AbortController();
        const orderStatsCallController = new AbortController();
        const recentOrdersCallController = new AbortController();
        ; (async () => {
            try {
                setTotalStatsLoading(true)
                setTotalStatsError(false)
                const response = await privateRequestInstance.get(`/stats/secured/admin/total`, {
                    signal: totalStatsCallController.signal,
                });

                setTotalStats(response.data);

                return response.data


            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message)
                    return;
                }
                toast.error('Oops Something went wrong 😥');
                setTotalStatsError(true);

            }
            finally {
                setTotalStatsLoading(false)
            }
        })();

        ; (async () => {
            try {
                setOrderStatLoading(true)
                setOrderStatsError(false)
                const response = await privateRequestInstance.get(`/stats/secured/admin/year/stats`, {
                    signal: orderStatsCallController.signal,
                });
                response.data.map((item: {
                    _id: number,
                    total: number
                }) =>
                    setOrderStats((prev) => [
                        ...prev,
                        { name: MONTHS[item._id - 1], orders: item.total },
                    ])
                );

                return response.data


            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message)
                    return;
                }
                toast.error('Oops Something went wrong 😥');
                setOrderStatsError(true);

            }
            finally {
                setOrderStatLoading(false)
            }
        })();
        ; (async () => {
            try {
                setRecentOrderLoading(true);
                setRecentOrderError(false);
                const response = await privateRequestInstance.get(`/stats/secured/admin/recent/orders`, {
                    signal: recentOrdersCallController.signal,
                });

                response.data.map((order: RecentOrderProps) => {
                    setRecentOrders((prev) => [...prev, {
                        _id: order._id,
                        createdAt: order.createdAt,
                        orderId: order.orderId,
                        status: order.status,
                        totalAmount: order.totalAmount,
                        user: order.user
                    }])
                }
                )

                return response.data


            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message)
                    return;
                }
                toast.error('Oops Something went wrong 😥');
                setRecentOrderError(true);

            }
            finally {
                setRecentOrderLoading(false);
            }
        })();
        ; (async () => {
            try {
                setRecentUsersLoading(true);
                setRecentUsersError(false);
                const response = await privateRequestInstance.get(`/stats/secured/admin/recent/users`, {
                    signal: recentUserStatsCallController.signal,
                });

                response.data.map((user: UserProps) => {
                    setRecentUsers((prev) => [...prev, {
                        _id: user._id,
                        createdAt: user.createdAt,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        contact: user.contact,
                        email: user.email
                    }])
                }
                )
                return response.data


            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message)
                    return;
                }
                toast.error('Oops Something went wrong 😥');
                setRecentUsersError(true);

            }
            finally {
                setRecentUsersLoading(false);
            }
        })();

        return () => {
            orderStatsCallController.abort();
            recentOrdersCallController.abort();
            recentUserStatsCallController.abort();
            totalStatsCallController.abort();
        }
    }, []);


    return (
        <div className="w-full md:flex md:flex-col h-screen max-sm:w-full overflow-hidden max-sm:overflow-y-scroll bg-black max-sm:pr-0 pr-12 py-6 max-sm:pb-10 font-mono">
            <div className="w-full px-5 py-2 text-white flex justify-between ">
                <h1 className="font-bold text-3xl max-sm:text-base">Dashboard</h1>
                <div className="border-[0.5px] border-gray-500 rounded-md text-white flex justify-center items-center px-3">
                    <span className="font-medium text-sm" >{new Date().toDateString()}</span>
                </div>
            </div>

            {
                isTotalStatsLoading ? <div className="w-full flex items-center justify-center">
                    <LineWave
                        visible={true}
                        height="100"
                        width="100"
                        color="#111827"
                        ariaLabel="line-wave-loading"
                        wrapperStyle={{}}
                        wrapperClass=""

                    />
                </div> : totalStatsError ? <div className="w-full px-5 py-2 grid lg:grid-cols-4 gap-3 grid-cols-2 max-sm:gap-1 text-white">
                    Something went wrong!
                </div> : <div className="w-full px-5 py-2 grid lg:grid-cols-4 gap-3 grid-cols-2 max-sm:gap-1">


                    <div className="p-5 border-[0.5px] border-gray-500 rounded-xl max-sm:p-3 max-sm:flex max-sm:flex-col max-sm:justify-evenly">
                        <div className="flex justify-between mb-1">
                            <h1 className="font-medium text-white max-sm:text-base">Sales</h1> <h2 className="font-medium text-white max-sm:text-base">₹</h2>
                        </div>
                        <h1 className="font-semibold text-3xl  text-white max-sm:text-xl">
                            ₹{totalStats?.totalSales}
                        </h1>
                        <span className="text-sm text-gray-600 max-sm:text-xs">
                            All time sales
                        </span>
                    </div>


                    <div className="p-5 border-[0.5px] border-gray-500 rounded-xl max-sm:p-3 max-sm:flex max-sm:flex-col max-sm:justify-evenly">
                        <div className="flex justify-between mb-1">
                            <h1 className="font-medium text-white max-sm:text-base">Customers</h1>
                        </div>
                        <h1 className="font-semibold text-3xl  text-white max-sm:text-xl">
                            {totalStats?.userCount}
                        </h1>
                        <span className="text-sm text-gray-600 max-sm:text-xs">
                            Total customers
                        </span>
                    </div>
                    <div className="p-5 border-[0.5px] border-gray-500 rounded-xl max-sm:p-3 max-sm:flex max-sm:flex-col max-sm:justify-evenly">
                        <div className="flex justify-between mb-1">
                            <h1 className="font-medium text-white max-sm:text-base">Orders</h1>
                        </div>
                        <h1 className="font-semibold text-3xl  text-white max-sm:text-xl">
                            {totalStats?.orderCount}
                        </h1>
                        <span className="text-sm text-gray-600 max-sm:text-xs">
                            Total orders
                        </span>
                    </div>
                    <div className="p-5 border-[0.5px] border-gray-500 rounded-xl max-sm:p-3 max-sm:flex max-sm:flex-col max-sm:justify-evenly">
                        <div className="flex justify-between mb-1">
                            <h1 className="font-medium text-white max-sm:text-base">Recent Orders</h1>
                        </div>
                        <h1 className="font-semibold text-3xl  text-white max-sm:text-xl">
                            {isRecentOrdersLoading ? 'Loading...' : recentOrdersError ? "Error occured" : recentOrders.length}
                        </h1>
                        <span className="text-sm text-gray-600 max-sm:text-xs">
                            Orders since last week
                        </span>
                    </div>

                </div>
            }



            <div className=" px-5 py-2 w-full h-full  flex space-x-3 overflow-hidden max-sm:flex-col max-sm:space-x-0 max-sm:space-y-3">

                {
                    isOrderStatLoading ? <div className="w-full flex items-center justify-center">
                        <LineWave
                            visible={true}
                            height="100"
                            width="100"
                            color="#111827"
                            ariaLabel="line-wave-loading"
                            wrapperStyle={{}}
                            wrapperClass=""

                        />
                    </div> : orderStatsError ? <div className="w-full flex items-center justify-center border max-sm:justify-start text-white">
                        Something went wrong!
                    </div> : <div className="flex-[2]  max-sm:flex-1 rounded-xl border-[0.5px] border-gray-500 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%" >
                            <BarChart margin={{ top: 20, right: 20, bottom: 10, left: -10 }} width={150} height={40} data={orderStats} className="text-white">
                                <XAxis dataKey="name" axisLine={false} />
                                <YAxis axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#a3e635" />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>
                }

                {
                    isRecentUsersLoading ? <div className="border flex justify-center items-center">
                        <LineWave
                            visible={true}
                            height="100"
                            width="100"
                            color="#111827"
                            ariaLabel="line-wave-loading"
                            wrapperStyle={{}}
                            wrapperClass=""

                        />
                    </div> : recentUsersError ? <div className="w-full flex items-center justify-center border text-white">
                        Something went wrong!
                    </div> :

                        <div className="flex-[1]  max-sm:flex-1  rounded-xl border-[0.5px] border-gray-500 overflow-hidden p-4 ">
                            <h1 className="font-semibold text-xl text-white">Recent Users</h1>
                            <p className="font-medium text-sm text-gray-400">You gained {recentUsers.length} users since last week</p>
                            <div className="flex-1 w-full h-full overflow-y-scroll mt-4 pb-4 text-white scroll no-scrollbar" >
                                {
                                    recentUsers.map((user) => (

                                        <UserListItem {...user} />


                                    ))
                                }
                            </div>
                        </div>
                }
            </div>


        </div>
    )
}



export default Dashboard

