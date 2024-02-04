import { CategoryProps, ErrorObj, ProductProps } from '@/lib/types';
import { useFormik } from 'formik';
import { MultiSelect } from 'primereact/multiselect';
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { privateRequestInstance } from '@/lib/constants';
import { resetUserState } from '@/redux/slices/user-slice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/redux/redux-hooks';
import { Triangle } from 'react-loader-spinner';
import { useLocation, useNavigate } from 'react-router-dom';



const UpdateProduct = () => {

    const { state } = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const sizes = [
        'XS',
        'S',
        'M',
        'L',
        'XL'
    ];
    const [isFetchingCategories, setCategoriesFetching] = useState(false);
    const [categories, setCategories] = useState<Omit<CategoryProps, 'image' | 'createdAt' | 'updatedAt'>[]>([]);
    // const [progressPercent, setProgressPercent] = useState(0);
    // const [file, setFile] = useState<File | null>(null);
    const [isUpdatingProduct, setUpdatingProduct] = useState(false);


    const updateProduct = async (product: ProductProps) => {

        try {
            setUpdatingProduct(true);

            const response = await privateRequestInstance.put(`/product/secured/admin/${state._id}`, product, {
                withCredentials: true,
            });
            toast.success(response.data.message);
            // setFile(null);
            navigate('/inventory')
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


        }
        finally {
            setUpdatingProduct(false);
        }
    }
    const formik = useFormik(
        {
            initialValues: {
                title: state.title,
                description: state.description,
                images: state.images,
                sizes: state.sizes,
                categories: state.categories,
                price: state.price
            } as ProductProps,
            validationSchema: yup.object({
                title: yup.string().required('Title is required'),
                description: yup.string().required('Description is required'),
                images: yup.array().of(yup.string()),
                sizes: yup.array(yup.string()).min(1, 'Size is required'),
                categories: yup.array(
                    yup.object({
                        _id: yup.string().required(),
                        name: yup.string().required(),

                    })

                ).min(1, 'Category is required'),
                price: yup.number().min(100).required('Price is required')
            }),
            onSubmit: (values) => {
                const clone = JSON.parse(JSON.stringify(values));
                clone.categories = values.categories.map((category) => category._id);

                updateProduct(clone)
                // if (file !== null) {
                //     const fileName = new Date().getTime() + '-' + file.name;
                //     const storageRef = ref(storage, `/cloth-project/${fileName}`);

                //     const uploadTask = uploadBytesResumable(storageRef, file);
                //     uploadTask.on(
                //         "state_changed",
                //         (snapshot) => {
                //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //             setProgressPercent(progress)
                //         },
                //         (error) => {
                //             toast.error('Failed to upload Image');
                //         },
                //         () => {
                //             // getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                //             //     values.images[0] = downloadURL;
                //             //     await createProduct(values);
                //             // });
                //         }
                //     )


                // } else {
                //     toast.error('Please select image')
                // }


            }
        }
    );
    console.log(formik.errors);
    useEffect(() => {

        const fetchCategoryCallController = new AbortController();


        ; (async () => {
            try {
                setCategoriesFetching(true);

                const response = await privateRequestInstance.get(`/category/`, {
                    withCredentials: true,
                    signal: fetchCategoryCallController.signal
                });
                response.data.map((category: CategoryProps) => {
                    setCategories((prev) => [...prev, {
                        _id: category._id,
                        image: category.image,
                        createdAt: category.createdAt,
                        name: category.name,
                        updatedAt: category.updatedAt
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



            }
            finally {
                setCategoriesFetching(false);
            }
        }

        )();

        return () => {
            fetchCategoryCallController.abort()
        };
    }, [])

    return (
        <div className="p-5 flex flex-col max-sm:p-2.5 space-y-3 w-full items-start justify-start bg-black font-mono">
            <h1 className='text-3xl font-bold text-white'>Update Product</h1>
            <form onSubmit={formik.handleSubmit} className="flex flex-col items-start space-y-3 w-[30%] max-sm:w-full">
                <input type="text" placeholder="Title" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} className="min-w-[40%] w-full  py-2 border border-gray-900 focus:border-teal-500 focus:ring-teal-500 outline-none bg-white bg-opacity-20 text-white rounded-sm px-4" />
                {formik.touched.title && formik.errors.title && <span className="text-red-500 max-sm:text-sm text-base">{formik.errors.title.toString()}</span>}
                <input type="text" placeholder="Description" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} className="min-w-[40%] w-full  py-2 border border-gray-900 focus:border-teal-500 focus:ring-teal-500 outline-none bg-white bg-opacity-20 text-white rounded-sm px-4" />
                {formik.touched.description && formik.errors.description && <span className="text-red-500 max-sm:text-sm">{formik.errors.description.toString()}</span>}
                <input type="number" placeholder="Price" name="price" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} className="min-w-[40%] w-full  py-2 border border-gray-900 focus:border-teal-500 focus:ring-teal-500 outline-none bg-white bg-opacity-20 text-white rounded-sm px-4" />
                {formik.touched.price && formik.errors.price && <span className="text-red-500 max-sm:text-sm">{formik.errors.price.toString()}</span>}

                {isFetchingCategories ? <span>Fetching categories</span> : <MultiSelect name='categories' id='categories' value={formik.values.categories} options={categories} optionLabel="name" onChange={(e) => formik.setFieldValue('categories', e.value)}
                    placeholder="Select Category" maxSelectedLabels={3} className="min-w-[40%] w-full  py-2 border border-gray-900 focus:border-teal-500 focus:ring-teal-500 outline-none bg-white bg-opacity-20 text-white rounded-sm px-4" display='comma' itemClassName="w-full  p-3" panelClassName='bg-gray-100 shadow-lg px-2 border rounded-md'
                />}
                {formik.touched.categories && formik.errors.categories && <span className="text-red-500 max-sm:text-sm">{formik.errors.categories.toString()}</span>}

                <MultiSelect name='sizes' id='sizes' value={formik.values.sizes} options={sizes} onChange={(e) => formik.setFieldValue('sizes', e.value)}
                    placeholder="Select Sizes" maxSelectedLabels={3} className="min-w-[40%] w-full  py-2 border border-gray-900 focus:border-teal-500 focus:ring-teal-500 outline-none bg-white bg-opacity-20 text-white rounded-sm px-4" display='comma' itemClassName="w-full  p-3" panelClassName='bg-gray-100 shadow-lg px-2 border rounded-md'
                />
                {formik.touched.sizes && formik.errors.sizes && <span className="text-red-500 max-sm:text-sm">{formik.errors.sizes.toString()}</span>}

                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md  font-semibold text-teal-600 ">
                        <h4 className='text-white'>Upload a image of product</h4>
                        <input id="file-upload" name="file-upload" type="file" className="mr-1 text-white"
                            // onChange={(e) => {
                            //     if (e.target.files !== null && e.target.files[0].type === 'image/jpeg') {

                            //         setFile(e.target.files[0])
                            //     }
                            //     else {
                            //         toast.error('Select valid image type JPEG')
                            //     }
                            // }}
                            disabled
                        />

                    </label>

                </div>

                <button type="submit" className="bg-lime-500 rounded-sm text-white py-3 px-5 mt-5 select-none font-bold" disabled={isFetchingCategories}>{isUpdatingProduct ? <Triangle
                    visible={true}
                    height="20"
                    width="20"
                    color="#FFFFFF"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                /> : 'Save'}</button>

            </form>
        </div>

    )
}

export default UpdateProduct





