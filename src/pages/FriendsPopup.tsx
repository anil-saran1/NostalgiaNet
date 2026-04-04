import React, { useEffect, useState } from "react";
import FriendsSection from "../components/FriendsGroup";
import fetchFriendList from "../components/utils/fetchFriendList";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  limit,
  doc,
  getDoc,
  where,
  getCountFromServer,
  startAfter,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "../App.css";
import sendFriendRequest from "../components/utils/sendFriendRequest";

interface Friend {
  uid: string;
  pfp: string | null;
}

interface UserCard {
  uid: string;
  name: string;
  pfp: string | null;
}

interface PopupProps {
  onCloseModal: () => void;
}

const FriendsPopup: React.FC<PopupProps> = ({ onCloseModal }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<UserCard | null>(null);
  const [randomUsers, setRandomUsers] = useState<UserCard[]>([]);
  const [searchError, setSearchError] = useState("");
  const [requestSent, setRequestSent] = useState<string[]>([]); // To track sent friend requests

  const navigate = useNavigate();

  // Fetch Friends List
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true); // Start loading
      const friendsData = await fetchFriendList({ setLoading });
      setFriends(friendsData || []); // Update friends state
    };

    fetchFriends();
  }, []);

  // Function to search for a user by username
  const searchUserByUsername = async (username: string) => {
    if (!username.trim()) return; // Don't search for empty input
    try {
      const usernamesRef = doc(db, "usernames", username);
      const usernameSnap = await getDoc(usernamesRef);
      if (usernameSnap.exists()) {
        const userUid = usernameSnap.data()?.uid;
        const userRef = doc(db, "users", userUid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setSearchResult({
            uid: userUid,
            name: userData.name || "Unknown",
            pfp: userData.pfp || null,
          });
          setSearchError("");
        } else {
          setSearchError("No account found");
          setSearchResult(null);
        }
      } else {
        setSearchError("No account found");
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      setSearchError("An error occurred while searching.");
    }
  };
 
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
 
  const fetchRandomUsers = async () => {
    try {
      const loggedInUid = localStorage.getItem("userUid"); // Get the logged-in user's UID
      const usersRef = collection(db, "users");
  
      // Fetch more than 5 users (fetch 10 users)
      const randomQuery = query(usersRef, limit(10)); 
      const usersSnap = await getDocs(randomQuery);
  
      const allUsers = usersSnap.docs.map((doc) => {
        const userData = doc.data();
        return {
          uid: doc.id,
          name: userData.name || "Unknown",
          pfp: userData.pfp || null,
        };
      });
  
      // Filter out the logged-in user from the fetched users
      const filteredUsers = allUsers.filter((user) => user.uid !== loggedInUid);
  
      // Shuffle the remaining users
      const shuffledUsers = shuffleArray(filteredUsers);
  
      // Pick the first 5 shuffled users
      const selectedUsers = shuffledUsers.slice(0, 5);
  
      setRandomUsers(selectedUsers); // Assuming setRandomUsers is your state setter
      console.log("Selected users:", selectedUsers);
    } catch (error) {
      console.error("Error fetching random users:", error);
    }
  };
   
  useEffect(() => {
    if (searchQuery.trim()) {
      searchUserByUsername(searchQuery);
    } else {
      fetchRandomUsers();  
      setSearchResult(null);  
      setSearchError("");
    }
  }, [searchQuery]);
 
  const isFriend = (uid: string) => {
    return friends.some((friend) => friend.uid === uid);
  };
 
  const handleSendFriendRequest = async (friendUid: string) => {
    await sendFriendRequest(friendUid, setRequestSent);
  };
  const isRequestSent = (uid: string) => requestSent.includes(uid);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onCloseModal}
    >
      <div
        className="bg-white h-lg:p-8 w-[400px] h-4/5 overflow-auto border-4 border-white flex flex-col gap-4 p-6 rounded-3xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Popup Content */}
        <div className="h-fit w-full flex flex-col gap-4 rounded-3xl bg-[#D9D9D9] p-4 shadow-[inset_0_16px_8px_-16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)]">
          <div
            className="text-2xl font-semibold text-left"
            style={{ textShadow: "3px 3px rgba(0, 0, 0, 0.1)" }}
          >
            Friends
          </div>
          <FriendsSection friends={friends}></FriendsSection>
        </div>

        <div className="font-ABeeZee text-sm text-left flex-col flex gap-2">
          <div>Find People</div>
          <div
            className={`bg-[#D9D9D9] rounded-full p-2 px-4 gap-2 shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)] flex flex-row items-center`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="7" stroke="#616267" strokeWidth="2" />
              <path
                d="M11 8C10.606 8 10.2159 8.0776 9.85195 8.22836C9.48797 8.37913 9.15726 8.6001 8.87868 8.87868C8.6001 9.15726 8.37913 9.48797 8.22836 9.85195C8.0776 10.2159 8 10.606 8 11"
                stroke="#616267"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 20L17 17"
                stroke="#616267"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search.."
              className="w-[100%] font-extralight bg-transparent text-black focus:outline-none "
            />
          </div>

          {/* Display search results or random users */}
          <div className="mt-4 font-Inter">
            {searchQuery ? (
              searchResult ? (
                <div
                className="flex items-center h-18 link-pointer hover:scale-[102%] transition-all  justify-between p-4 m-[4px] border-[#CFCFCF] border-2 rounded-2xl
              ">
                  <div onClick={() => navigate(`/user/${searchResult.uid}`)} className="flex items-center">
                    <img
                      src={searchResult.pfp ?? "/user.png"}
                      className="rounded-full size-10"
                      alt="Profile"
                      referrerPolicy="no-referrer"
                    />
                    <span className="ml-4">{searchResult.name}</span>
                  </div>
                  {!isFriend(searchResult.uid) ? (
                    isRequestSent(searchResult.uid) ? (
                      <button
                        disabled
                        className="bg-gray-500 text-white px-2 py-1 rounded-md"
                      >
                        Request Sent
                      </button>
                    ) : (
                      <button
                        className="bg-black text-white px-2 py-1 rounded-md"
                        onClick={() => handleSendFriendRequest(searchResult.uid)}
                      >
                        Add
                      </button>
                    )
                  ) : (
                    <button disabled> Added </button>
                  )}
                </div>
              ) : (
                <div className="text-red-500">
                  {searchError || "No accounts found"}
                </div>
              )
            ) : (
              <div className="overflow-auto">
                {randomUsers.map((user) => (
                  <div
                    key={user.uid}
                    
                    className="flex items-center h-18 link-pointer hover:scale-[102%] transition-all  justify-between p-4 m-[4px] border-[#CFCFCF] border-2 rounded-2xl"
                  >
                    <div onClick={() => navigate(`/user/${user.uid}`)} className="flex items-center">
                      <img
                        src={user.pfp ?? "/user.png"}
                        className="rounded-full size-10"
                        alt="Profile"
                        referrerPolicy="no-referrer"
                      />
                      <span className="ml-4">{user.name}</span>
                    </div>
                    {!isFriend(user.uid) ? (
                      isRequestSent(user.uid) ? (
                        <button
                          disabled
                          className="bg-gray-500 text-white w-fit p-2 rounded-full"
                        >
                          Request Sent
                        </button>
                      ) : (
                        <button
                          className="bg-black text-white w-20 p-2 rounded-full"
                          onClick={() => handleSendFriendRequest(user.uid)}
                        >
                          ADD
                        </button>
                      )
                    ) : (
                      <button disabled> ADDED </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPopup;
