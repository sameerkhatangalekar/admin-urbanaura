import toast from 'react-hot-toast'
import { ProductProps } from '../lib/types'
import { Link } from 'react-router-dom'

const ProductCard = (product: ProductProps) => {

    return (

        <div className="max-sm:p-3 p-5 flex flex-col justify-around   rounded-md group bg-white bg-opacity-20 mb-1 text-white ">
            <span className='inline '><b>Title:</b> {product.title}</span>
            <span className='truncate'><b>Description:</b> {product.description}</span>
            <span><b>Price:</b> {product.price}</span>
            <span><b>Created:</b> {new Date(product.createdAt).toLocaleString()} </span>
            <div className='flex mt-2 space-x-3'>
                <Link to={'/update/product'} state={
                    { ...product }
                }>  <button type="submit" className="bg-green-500 text-white py-2 px-3 select-none rounded-md" >Update</button></Link>

                <button type="submit" className="bg-red-700 text-white py-2 px-3 select-none rounded-md" onClick={() => toast.success('This is disabled to prevent abuse, but dont worry if I create yours it will work 😅')}>Delete</button>
            </div>
        </div >
    )
}

export default ProductCard