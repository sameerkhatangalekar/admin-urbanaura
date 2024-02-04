
import { UserProps } from '../lib/types'

const UserCard = ({ firstName, lastName, email, createdAt, contact }: UserProps) => {
    return (

        <div className="max-sm:p-3 p-5 flex flex-col justify-around   rounded-md group bg-white bg-opacity-20 mb-1 text-white ">
            <span className='inline'><b>Name:</b> {`${firstName} ${lastName}`}</span>
            <span><b>Email:</b> {email.toLowerCase()}</span>
            <span><b>Contact:</b> {contact}</span>
            <span><b>Created:</b> {new Date(createdAt).toLocaleString()}</span>
        </div>
    )
}

export default UserCard