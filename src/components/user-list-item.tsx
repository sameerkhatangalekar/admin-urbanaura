import { UserProps } from "@/lib/types"
import Avatar, { genConfig } from 'react-nice-avatar'

const UserListItem = (user: UserProps) => {
    const config = genConfig(user.email)
    return (
        <div className="mb-1 flex last:mb-10 w-full" key={user._id}>
            <Avatar {...config} className="w-10 h-10" />
            <div className="flex-1 px-5 font-medium select-none max-sm:px-1">
                <h1 className="max-sm:text-sm">{user.firstName + " " + user.lastName}</h1>
                <p className="text-sm max-sm:text-xs font-normal text-gray-400">
                    {user.email}
                </p>
            </div>
        </div>
    )
}

export default UserListItem