import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LineWave } from "react-loader-spinner";
import { privateRequestInstance } from "../lib/constants";
import { ErrorObj, ProductProps } from "../lib/types";
import { useAppDispatch } from "../redux/redux-hooks";
import { resetUserState } from "../redux/slices/user-slice";
import ProductCard from "../components/product-card";

import { Link } from "react-router-dom";

const Products = () => {
    const dispatch = useAppDispatch();
    const [isFetchingProducts, setProductsFetching] = useState(false);
    const [fetchProductError, setFetchProductError] = useState(false);
    const [products, setProducts] = useState<ProductProps[]>([])




    useEffect(() => {
        const fetchProductsCallController = new AbortController();
        ; (async () => {
            try {
                setProductsFetching(true);
                setFetchProductError(false);
                const response = await privateRequestInstance.get(`/product/`, {
                    withCredentials: true,
                    signal: fetchProductsCallController.signal
                });
                response.data.map((product: ProductProps) => {
                    setProducts((prev) => [...prev, {
                        _id: product._id,
                        categories: product.categories,
                        colors: product.colors,
                        createdAt: product.createdAt,
                        description: product.description,
                        images: product.images,
                        price: product.price,
                        sizes: product.sizes,
                        title: product.title,
                        updatedAt: product.updatedAt
                    }])
                })
                return response.data;
            } catch (error: unknown) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message)
                    setFetchProductError(false);
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


                setFetchProductError(true)
            }
            finally {
                setProductsFetching(false);
            }
        }

        )();



        return () => {
            fetchProductsCallController.abort();
        };
    }, [])



    if (fetchProductError === true) {
        return <h1 className="text-4xl font-bold text-center text-gray-400 py-3 w-full bg-black">Something went wrong !</h1>
    }

    if (isFetchingProducts === true) {
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
            <div className="flex w-full justify-between items-center">
                <div>
                    <h1 className="font-semibold text-center text-3xl flex-1 text-white">Products</h1>
                </div>

                <div>
                    <Link to={'/create'}>
                        <button type="submit" className="bg-lime-500 text-white font-semibold py-2 px-5 select-none outline-none rounded-sm" >
                            Create New
                        </button>
                    </Link>
                </div>

            </div>

            <div className="p-5 max-sm:p-2 border-[0.5px] border-gray-900 rounded-md bg-black max-sm:w-full w-full mx-auto h-screen overflow-y-scroll">
                {
                    products.length === 0 ? null : products.map((product) => (<ProductCard key={product._id} {...product} />))
                }

            </div>

        </div>
    )
}

export default Products