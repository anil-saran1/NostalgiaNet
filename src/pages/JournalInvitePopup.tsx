import React, { useEffect, useState } from "react";
import FriendsSection from "../components/FriendsGroup";
import fetchFriendList from "../components/utils/fetchFriendList";
import { useNavigate } from "react-router-dom"; 

interface Friend {
  uid: string;
  name: string | null;
  pfp: string | null;
} 

interface PopupProps {
  onCloseModal: () => void;
  invited: Friend[]; // Pass the current invited people
  onInvite: (invited: Friend[]) => void; // Callback to update the invited people in parent
}

const JournalInvitePopup: React.FC<PopupProps> = ({
  onCloseModal,
  invited,
  onInvite,
}) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      const friendsData = await fetchFriendList({ setLoading });
      setFriends(friendsData || []);
    };

    fetchFriends();
  }, []);

  const handleInviteToggle = (uid: string) => {
    const updatedInvited = invited.some((friend) => friend.uid === uid)
      ? invited.filter((friend) => friend.uid !== uid)  
      : [...invited, friends.find((friend) => friend.uid === uid) as Friend]; 
    
    onInvite(updatedInvited); 
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onCloseModal}
    >
      <div
        className="bg-white h-lg:p-8 xl:w-[500px] w-[400px] h-4/5 overflow-auto border-4 border-white flex flex-col gap-4 p-6 rounded-3xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Popup Content */}
        <div className="h-full w-full flex flex-col gap-4 rounded-3xl bg-[#D9D9D9] p-4 shadow-[inset_0_16px_8px_-16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)]">
          <div className="text-2xl font-semibold text-left">
            Friends
          </div>
          <FriendsSection friends={friends} />

          <div className="overflow-y-auto overflow-x-hidden">
            {friends.map((user) => (
              <div
                key={user.uid}
                className="flex items-center h-18 link-pointer hover:scale-[102%]  bg-white transition-all justify-between p-4 m-[4px] border-[#CFCFCF] border-2 rounded-2xl"
              >
                <div className="flex items-center" onClick={() => navigate(`/user/${user.uid}`)}>
                  <img
                    src={user.pfp ?? "/user.png"}
                    className="rounded-full size-10"
                    alt="Profile"
                    referrerPolicy="no-referrer"
                  />
                  <span className="ml-4">{user.name}</span>
                </div>
                <button
                  onClick={() => handleInviteToggle(user.uid)}
                  className={`${
                    invited.some((friend) => friend.uid === user.uid)
                      ? "bg-gray-500 text-white"
                      : "bg-black text-white"
                  } w-20 p-2 rounded-full`}
                >
                  {invited.some((friend) => friend.uid === user.uid) ? "Invited" : "Invite"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalInvitePopup;
