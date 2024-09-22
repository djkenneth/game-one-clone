
export const MainPanelTop = () => {
    return (
        <div className="hidden bg-red-600 md:block">
            <div className="flex justify-between items-center mx-auto lg:max-w-[90%]">
                <div></div>
                <div className="flex items-center justify-end text-white py-3 px-6 lg:px-8">
                    <ul className="flex uppercase divide-x">
                        <li className="text-sm px-5"></li>
                        <li className="text-sm px-5">Contact Us</li>
                        <li className="text-sm px-5">FInd a Store</li>
                        <li className="text-sm px-5">Sign In</li>
                        <li className="text-sm pl-5">Create an Account</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
