import { Link } from "react-router-dom"
import { useAuth } from '@/context/AuthContext';

export const MainPanelTop = () => {
    const { user, logout } = useAuth()

    console.log(user);


    return (
        <div className="hidden bg-red-600 md:block">
            <div className="flex justify-between items-center mx-auto lg:max-w-[90%]">
                <div></div>
                <div className="flex items-center justify-end text-white py-3 px-6 lg:px-8">
                    <ul className="flex uppercase divide-x">
                        <li className="text-sm px-5"></li>
                        <li className="text-sm px-5 cursor-pointer">Contact Us</li>
                        <li className="text-sm px-5 cursor-pointer">FInd a Store</li>
                        {user && (
                            <li onClick={logout} className="text-sm px-5 cursor-pointer">
                                Sign Out
                            </li>
                        )}

                        {!user && (
                            <>
                                <li className="text-sm px-5 cursor-pointer">
                                    <Link to="/customer/account/login">Sign In</Link>
                                </li>
                                <li className="text-sm pl-5 cursor-pointer">
                                    <Link to="/customer/account/create">Create an Account</Link>
                                </li>
                            </>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    )
}
