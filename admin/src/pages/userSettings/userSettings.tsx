import ChangePasswordModal from "./changePasswordModal";

export default function UserSettings() {
    return(
        <div>
            <p className=" text-2xl mb-3" style={{fontFamily: 'Madimi One', color: "#2C2C2C"}}>YOUR ACCOUNT INFORMATION: </p>
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
                    <p className="text-gray-500">Name: </p>
                    <p className="text-gray-500">Email: </p>
                    <p className="text-gray-500">Phone: </p>
                    <p className="text-gray-500">Address: </p>
                    <p className="text-gray-500">Branch: </p>
                    <p className="text-gray-500">Role: </p>
                </div>
            </div>

            <div className='border-b border-gray-300 mt-4  mb-4'></div>

            <ChangePasswordModal />
        </div>
    );
}