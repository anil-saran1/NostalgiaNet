import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface SideNavBarProps {
  isExpanded: boolean;
  toggleSidebar: (e: boolean) => void;
}

const SideNavbar: React.FC<SideNavBarProps> = ({
  isExpanded,
  toggleSidebar,
}) => {
  const navigate = useNavigate();
  return (
    <nav
      className={`h-full bg-[rgba(0,0,0,0.5)] absolute left-0 z-10 rounded-[40px] overflow-hidden backdrop-blur-lg 
        shadow-lg transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64 " : "w-20"
      }`}
      onMouseEnter={() => toggleSidebar(true)}
      onMouseLeave={() => toggleSidebar(false)}
    >
      <div className="px-4 font-ABeeZee h-full flex flex-col justify-center">
        <div onClick={() => navigate('/')} className="absolute link-pointer flex flex-row items-center gap-4 w-44 top-4 transition-all ease-in-out text-white">
          <img src="/nn.svg" alt="" className="size-12" />
          <span>Nostalgia Net</span>
        </div>
        
        <ul className="space-y-6 flex  flex-col ">
          <li>
            <div
              onClick={() => navigate('/profile')}
              className={`flex flex-row items-center p-2 ${!isExpanded && "justify-center"} link-pointer transition-all ease-in-out text-white rounded-md hover:bg-white hover:bg-opacity-20 `}
            >
              <img src="/profile.svg" className="mx-3 size-6" />
              {isExpanded && "Profile"}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/bookmark')} 
              className={`flex flex-row items-center p-2 ${!isExpanded && "justify-center"} link-pointer transition-all ease-in-out text-white rounded-md hover:bg-white hover:bg-opacity-20 `}
            >
              <img src="/book.svg" className="mx-3 size-6" />
              {isExpanded && "Bookmarks"}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/dashboard')} 
              className={`flex flex-row items-center p-2 ${!isExpanded && "justify-center"} link-pointer transition-all ease-in-out text-white rounded-md hover:bg-white hover:bg-opacity-20 `}
            >
              <img src="/dashboard.svg" className="mx-3 size-6" />
              {isExpanded && "Dashboard"}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/capsulepage')} 
              className={`flex flex-row items-center p-2 ${!isExpanded && "justify-center"} link-pointer transition-all ease-in-out text-white rounded-md hover:bg-white hover:bg-opacity-20 `}
            >
              <img src="/vault.svg" className="mx-3 size-6" />
              {isExpanded && "TimeVault"}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/journal')} 
              className={`flex flex-row items-center p-2 ${!isExpanded && "justify-center"} link-pointer transition-all ease-in-out text-white rounded-md hover:bg-white hover:bg-opacity-20 `}
            >
              <img src="/journal.svg" className="mx-3 size-6" />
              {isExpanded && "Journal"}
            </div>
          </li>
          <li className="hidden">
            <div
              onClick={() => navigate('')}  
              className={`flex flex-row items-center p-2 ${!isExpanded && "justify-center"} link-pointer transition-all ease-in-out text-white rounded-md hover:bg-white hover:bg-opacity-20 `}
            >
              <img src="/settings.svg" className="mx-3 size-6" />
              {isExpanded && "Settings"}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideNavbar;
