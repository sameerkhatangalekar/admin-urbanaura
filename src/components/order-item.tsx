import { OrderProps } from "../lib/types"




const OrderItem = ({ orderId, status, createdAt, products }: OrderProps) => {
    return (

        <div className="max-sm:p-3 p-5 flex flex-col justify-around   rounded-md group bg-white bg-opacity-20 mb-1 text-white ">
            <span className='inline'><b>Order Id:</b> #{orderId}</span>
            <span><b>Status:</b> {status}</span>
            <span><b>Date:</b> {new Date(createdAt).toLocaleString()}</span>
            <span><b>Items:</b> {products.length}</span>
        </div>





    )
}

export default OrderItem