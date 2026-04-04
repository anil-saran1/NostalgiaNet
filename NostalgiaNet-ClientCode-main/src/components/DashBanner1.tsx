import React, { useEffect, useState } from "react";
import date from "date-and-time";
import addFriend from "../assets/addFriend.png";
import FriendsGroup from "./FriendsGroup";
import { GoPlus } from "react-icons/go";
import { GiSettingsKnobs } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import fetchFriendList from "./utils/fetchFriendList"; // Import your utility function
import ordinal from "date-and-time/plugin/ordinal";

date.plugin(ordinal);

interface DashHeaderProps {
  isExpanded: boolean;
  onOpenModal: () => void;  
}

interface Friend {
  uid: string;
  pfp: string | null;
  userName: string | null;
  name: string | null;
  tier: string | null;
}

const Banner1: React.FC<DashHeaderProps> = ({ isExpanded, onOpenModal }) => {
  const now = new Date();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch friends list using the utility function
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true); // Start loading
      const friendsData = await fetchFriendList({ setLoading });
      setFriends(friendsData || []); // Update friends state
    };

    fetchFriends();
  }, []);

  return (
    <div className="flex mb-3 w-[90%] justify-between bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-md font-ABeeZee font-thin">
      
      <div className="flex items-start flex-col w-1/4 px-8 my-5 border-r drop-shadow-xl border-gray-800">
        <p className=" text-2xl font-semibold">{date.format(now, "MMMM")}</p>
        <p className="text-[10px] text-[#616267] text-left">
          today is {date.format(now, "dddd, MMM DDD YYYY")}
        </p>
      </div>
 
      <div className="flex flex-1 w-1/2 justify-between items-center border-gray-800 px-4">
        <div className=" flex flex-row gap-6 items-center justify-between mx-2">
          <p className="text-2xl font-semibold" style={{ textShadow: "3px 3px rgba(0, 0, 0, 0.1)" }}>
            Friends
          </p>
          <div className="size-12 flex items-center justify-center">
            <div className="size-10 hover:size-12 rounded-full bg-white transition-all duration-150">
              <img onClick={onOpenModal} src={addFriend} alt="" className="p-2" />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex flex-1 relative justify-center items-center w-[220px]">
            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-black rounded-full"></div>
          </div>
        ) : (
          <FriendsGroup friends={friends} />
        )}
      </div>
 
      <div className={`lg:flex hidden w-1/4 flex-row gap-x-4 justify-center items-center my-5 border-gray-800 border-l`}>
        <div
          onClick={() => navigate("/capsulepage")}
          className=" text-sm link-pointer flex-row flex items-center bg-[#626267] text-center py-2 px-3 text-white rounded-lg"
        >
          <GoPlus className="size-6" /> Create New
        </div>
       
      </div>
    </div>
  );
};

export default Banner1;
