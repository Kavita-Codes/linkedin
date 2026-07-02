import  { useState, useContext } from 'react';
import ProfileDropdown from '../components/ProfileDropdown';
import profile from "../../../assets/profile.png"
import { userDataContext } from '../../../context/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useContext(userDataContext);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-2 px-4">
        
        {/* Left Side: Logo and Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* LinkedIn Logo Placeholder */}
          <div className="text-blue-700 font-bold text-3xl cursor-pointer">in</div>
          
          {/* Search Bar */}
          <div className="bg-gray-100 flex items-center px-3 py-1.5 rounded w-full md:w-64 border border-gray-200">
            <span className="text-gray-500 mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent outline-none w-full text-sm" 
            />
          </div>
        </div>

        {/* Right Side: Nav Icons */}
        <div className="flex items-center gap-6 ml-4">
          <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-black">
            <span className="text-xl">🏠</span>
            <span className="text-[10px]">Home</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-black">
            <span className="text-xl">👥</span>
            <span className="text-[10px]">My Network</span>
          </div>

            <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-black">
            <span className="text-xl">🔔</span>
            <span className="text-[10px]">notification</span>
          </div>

          {/* Profile Icon with Toggle */}
          <div className="relative flex flex-col items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <img 
              src={userData?.profilePic || profile}
             className='rounded-full'
              alt="profile" 
               width={50} height={50}
            />
            {/* <span className="text-[12px] text-gray-500">Me</span> */}
            
            {/* Absolute Dropdown positioned below the icon */}
            {isOpen && <ProfileDropdown />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;