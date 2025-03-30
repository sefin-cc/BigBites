import ChangePasswordModal from "./changePasswordModal";
import { useGetLoggedInAdminQuery } from '../../features/auth/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../features/loadingSlice';
import { useEffect } from "react";
import UpdateUserModal from "./userUpdate";



export default function UserSettings() {
    const dispatch = useDispatch();
    const { data: user, isLoading: userLoading } = useGetLoggedInAdminQuery();

    useEffect(() => {
        dispatch(setLoading(userLoading));
    }, [userLoading]);
    
    return(
        <div>
            <p className=" text-2xl mb-3" style={{fontFamily: 'Madimi One', color: "#2C2C2C"}}>YOUR ACCOUNT INFORMATION: </p>
            {
                user &&

                <div className="flex gap-4 ">

                <div className="flex justify-center items-center p-4">
                    <div style={{ 
                        width: 130, 
                        height: 130, 
                        overflow: 'hidden', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center'
                        }}>
                        <img 
                            src={'https://res.cloudinary.com/dqp0ejscz/image/upload/v1735899431/blank-profile-picture-973460_1280_idgyn3.png'} 
                            alt="Circular" 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                            }} 
                        />
                    </div>
                </div>

                <div className=" w-full p-4 ">
                    <p className="text-gray-500"><b>Name:</b> {user.name}</p>
                    <p className="text-gray-500"><b>Email:</b> {user.email}</p>
                    <p className="text-gray-500"><b>Phone:</b> {user.phone}</p>
                    <p className="text-gray-500"><b>Address:</b> {user.address}</p>
                    <p className="text-gray-500"><b>Branch: </b>{user.branch}</p>
                    <UpdateUserModal/>
                </div>
                
            </div>    
            }
            


            <div className='border-b border-gray-300 mt-4  mb-4'></div>
            {
                user &&
                <ChangePasswordModal id={user.id} />
            }

        </div>
    );
}