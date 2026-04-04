import { FaSearch } from "react-icons/fa"; // Search icon from react-icons
import { AiOutlineUser } from "react-icons/ai"; // Profile picture icon from react-icons
import nnUrl from "../assets/NN.png";

interface DashHeaderProps {
  isExpanded: boolean;
}

const DashHeader: React.FC<DashHeaderProps> = ({ isExpanded }) => {
  return (
    <header
      className={`z-10 bg-white absolute bg-opacity-30 backdrop-blur-lg h-16 flex items-center
         justify-between px-4 shadow-md transform transition-transform duration-300 w-[calc(100%-5rem)]`}>
      {/* Website Logo */}
      <div className="flex items-center">
        <img
          src={nnUrl}
          alt="Website Logo"
          className="mr-4 w-36"
          style={{
            pointerEvents: "none", // Disable pointer events to prevent interactions with hidden part
          }}
        />
      </div>

      {/* Search Bar */}
      <div className="flex flex-1 items-center mx-4 p-2 rounded-full font-ABeeZee bg-white ">
        <FaSearch className="mx-4 text-gray-400" />
        <input
          type="text"
          placeholder="Find something"
          className="w-full font-ABeeZee bg-white text-[#616266] focus:outline-none "
        />
      </div>

      <div className="flex">
        <div className="flex items-center mx-4">
          <div className="">
            <input
              type="range"
              min="0"
              max="100"
              value="70"
              className="w-full h-2 bg-gray-600 rounded-full appearance-none"
            />
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex items-center ml-4">
          <AiOutlineUser className="text-3xl" />
        </div>
      </div>
      {/* Storage Seek Bar */}
    </header>
  );
};

export default DashHeader;
