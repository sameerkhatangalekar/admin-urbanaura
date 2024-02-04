import { useEffect, useState } from 'react'
import { ErrorObj, UserProps } from '../lib/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LineWave } from 'react-loader-spinner';
import { privateRequestInstance } from '../lib/constants';
import { useAppDispatch } from '../redux/redux-hooks';
import { resetUserState } from '../redux/slices/user-slice';
import UserCard from '../components/user-card';

const Users = () => {
    const dispatch = useAppDispatch();
    const [isFetching, setFetching] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [users, setUsers] = useState<UserProps[]>([])

    useEffect(() => {
        const fetchOrderCallController = new AbortController();
        ; (async () => {
            try {
                setFetching(true);
                setFetchError(false);
                const response = await privateRequestInstance.get(`/user/secured/admin/`, {
                    withCredentials: true,
                    signal: fetchOrderCallController.signal
                });
                response.data.map((user: UserProps) => {
                    setUsers((prev) => [...prev, {
                        _id: user._id,
                        createdAt: user.createdAt,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        contact: user.contact,
                        email: user.email
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

        return () => fetchOrderCallController.abort();
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
            <h1 className="font-light text-start text-3xl text-white">Users</h1>
            <div className="p-5 max-sm:p-2 border-[0.5px] border-gray-900 rounded-md bg-black max-sm:w-full w-full mx-auto h-screen overflow-y-scroll">
                {
                    users.length === 0 ? null : users.map((user) => (<UserCard key={user._id} {...user} />))
                }

            </div>

        </div>
    )
}


export default Users