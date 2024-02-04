import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/redux-hooks"

import { LineWave } from "react-loader-spinner";

import OrderItem from "../components/order-item";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { privateRequestInstance } from "../lib/constants";
import { ErrorObj, OrderProps } from "../lib/types";
import { resetUserState } from "../redux/slices/user-slice";

const Orders = () => {
    const dispatch = useAppDispatch();
    const [isFetching, setFetching] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [orders, setOrders] = useState<OrderProps[]>([])

    useEffect(() => {
        const fetchOrdersCallController = new AbortController();
        ; (async () => {
            try {
                setFetching(true);
                setFetchError(false);
                const response = await privateRequestInstance.get(`/order/secured/`, {
                    withCredentials: true,
                    signal: fetchOrdersCallController.signal
                });
                response.data.map((order: OrderProps) => {
                    setOrders((prev) => [...prev, {
                        _id: order._id,
                        createdAt: order.createdAt,
                        orderId: order.orderId,
                        products: order.products,
                        shipping: order.shipping,
                        status: order.status,
                        totalAmount: order.totalAmount,
                        updatedAt: order.updatedAt,
                        user: order.user
                    }])
                })
                return response.data;
            } catch (error: unknown) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message)
                    return;
                }
                if (axios.isAxiosError(error)) {

                    if (error.response) {
                        if (error.response.status === 401) {
                            dispatch(resetUserState())
                        }
                        const errObj = error.response.data as ErrorObj;
                        toast.error(errObj.message);

                    }
                }


                setFetchError(true)
            }
            finally {
                setFetching(false);
            }
        }

        )();

        return () => fetchOrdersCallController.abort();
    }, [])



    if (fetchError === true) {
        return <h1 className="text-4xl font-bold text-center text-gray-400 py-3 w-full bg-black">Something went wrong !</h1>
    }

    if (isFetching === true) {
        return (
            <div className="h-16 w-full flex justify-center items-center mb-10">
                <LineWave
                    visible={true}
                    height="100"
                    width="100"
                    color="#111827"
                    ariaLabel="line-wave-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    firstLineColor=""
                    middleLineColor=""
                    lastLineColor=""
                />
            </div>
        );
    }

    return (
        <div className="p-5 flex flex-col max-sm:p-2.5 space-y-2 w-full bg-black font-mono">
            <h1 className="font-light text-start text-3xl text-white">YOUR ORDERS</h1>
            <div className="p-5 max-sm:p-2 border-[0.5px] border-gray-900 rounded-md bg-black max-sm:w-full w-full mx-auto h-screen overflow-y-scroll">
                {
                    orders.length === 0 ? null : orders.map((order) => (<Link to={`/orders/${order._id}`} key={order._id} state={{
                        order: { ...order }
                    }} ><OrderItem  {...order} /></Link>))
                }

            </div>

        </div>
    )
}

export default Orders