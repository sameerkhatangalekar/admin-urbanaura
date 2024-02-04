import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorObj, OrderProps, ProductElement } from "../lib/types";
import { useAppDispatch } from "../redux/redux-hooks";
import axios from "axios";
import toast from "react-hot-toast";
import { privateRequestInstance } from "../lib/constants";
import { resetUserState } from "../redux/slices/user-slice";
import { LineWave, Triangle } from "react-loader-spinner";



const Order = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch();
    const [isFetching, setFetching] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [order, setOrder] = useState<OrderProps | null>(null)
    const [orderStatus, setOrderStatus] = useState<string>('pending')
    const [isOrderStatusUpdating, setOrderStatusUpdating] = useState(false);

    const handleOrderStatusChange = (event: { target: { name: string; value: string } }) => {
        setOrderStatus(event.target.value);
    }

    const updateOrderStatus = async () => {
        try {
            setOrderStatusUpdating(true);

            const response = await privateRequestInstance.put(`/order/secured/${id}`, {
                status: orderStatus
            },
            )

            toast.success(response.data.message);
            fetchOrder();
            return response;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("request canceled", error.message);
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

        } finally {
            setOrderStatusUpdating(false);
        }

    }

    const fetchOrder = async (controller?: AbortController) => {
        try {
            setFetching(true);
            setFetchError(false);
            const response = await privateRequestInstance.get(`/order/secured/${id}`, {
                withCredentials: true,
                signal: controller?.signal
            });
            setOrder(response.data)
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

    useEffect(() => {
        const fetchOrderCallController = new AbortController();
        fetchOrder(fetchOrderCallController);
        return () => fetchOrderCallController.abort();
    }, [])

    if (fetchError === true) {
        return <h1 className="text-4xl font-bold text-center text-gray-400 py-3">Something went wrong !</h1>
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
        <div className="p-5 flex flex-col max-sm:p-2.5 w-full bg-black font-mono text-white space-y-2 overflow-y-scroll">
            <h1 className="font-light text-start text-3xl">Order Summary</h1>
            <div className="flex justify-between space-x-1 max-sm:flex-col max-sm:space-y-1 max-sm:space-x-0 ">
                <div className="flex-[3] p-2 max-sm:p-2.5 border-[0.5px] border-gray-900 rounded-md  h-[70vh] flex flex-col  bg-white bg-opacity-5">

                    <div className="flex justify-between max-sm:flex-col">
                        <h2>
                            Order Id : #{order?.orderId}
                        </h2>
                        <h2>
                            Status : {order?.status.toUpperCase()}
                        </h2>
                    </div>
                    <span>Placed Date : {new Date(order?.createdAt!).toLocaleString()}</span>

                    <div className="flex-1 overflow-y-auto  space-y-1 p-1">
                        {
                            order?.products.map((item: ProductElement) => (

                                <div key={item._id} className="flex justify-between max-sm:flex-col  shadow-lg bg-white bg-opacity-20 rounded-xl border-[0.5px] border-gray-500">
                                    <div className="flex flex-[2]">
                                        <img src={item.product.images[0]} alt="" className=" max-sm:w-24 max-sm:h-auto  w-32 h-auto object-cover rounded-xl p-1" />
                                        <div className="max-sm:p-1 p-5 flex flex-col justify-around">
                                            <span className='max-sm:text-sm'><b>Product:</b> {item.product.title}</span>
                                            <span className='max-sm:text-sm'><b>Color:</b> {item.color}</span>

                                            <span className='max-sm:text-sm'><b>Size:</b> {item.size}</span>
                                            <span className='max-sm:text-sm'><b>Qty:</b> {item.quantity}</span>
                                            <div className="max-sm:flex items-center justify-between hidden">
                                                <div className="max-sm:text-xl text-3xl font-extralight">
                                                    ₹{item.itemAmount}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center max-sm:hidden">

                                        <div className="text-3xl font-extralight">
                                            ₹{item.itemAmount}
                                        </div>
                                    </div>

                                </div>

                            ))
                        }
                    </div>

                </div>

                <div className="flex-1 border-[0.5px] border-gray-900 rounded-md  p-5 max-sm:p-2.5 bg-white bg-opacity-5 flex flex-col justify-between">
                    <h1 className="font-bold text-xl">ORDER SUMMARY</h1>
                    <div className="my-8 flex justify-between max-sm:my-1">
                        <span>Subtotal</span>
                        <span>₹{order?.totalAmount}</span>
                    </div>
                    <div className="my-8 flex justify-between font-medium text-2xl max-sm:my-1">
                        <span>Total</span>
                        <span>₹{order?.totalAmount}</span>
                    </div>
                    <hr />
                    <h1 className="text-xl font-bold">Shipping</h1>
                    <div className="flex flex-col text-md flex-1">

                        <span>{order?.shipping.line1}</span>
                        <span>{order?.shipping.line2}</span>
                        <span>{order?.shipping.city}</span>
                        <span>{order?.shipping.postal_code}</span>
                        <span>{order?.shipping.state}</span>
                        <span>{order?.shipping.country}</span>
                    </div>
                    <hr />
                    {
                        order?.status !== 'delivered' && <div className="mt-2.5 flex space-x-3 justify-start items-center max-sm:flex-col max-sm:items-start max-sm:space-x-0 max-sm:space-y-2 max-sm:mb-10">
                            <select name="orderStatus" id="orderStatus" className="w-full  py-2 border border-gray-900 focus:border-gray-900 focus:ring-gray-900 outline-none bg-white bg-opacity-20 text-white rounded-sm px-4" onChange={handleOrderStatusChange}>
                                <option value="pending" className="  text-black">Pending</option>
                                <option value="shipped" className="text-black " >Shipped</option>
                                <option value="delivered" className="text-black ">Delivered</option>
                                <option value="cancelled" className="  text-black">Cancel</option>
                            </select>
                            <button type="submit" className="bg-lime-500 text-white font-bold text-sm py-2 px-5  rounded-sm select-none" onClick={() => updateOrderStatus()} disabled={isOrderStatusUpdating}>{isOrderStatusUpdating ? <Triangle
                                visible={true}
                                height="20"
                                width="20"
                                color="#FFFFFF"
                                ariaLabel="triangle-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            /> : 'UPDATE'}</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Order