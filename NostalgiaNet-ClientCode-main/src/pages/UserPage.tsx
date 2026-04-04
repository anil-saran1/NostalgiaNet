import SideNavbar from "../components/SideNavbar";
import DashHeader from "../components/DashHeader";
import "../App.css";
import bgImage from "../assets/bgp.jpg";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  DocumentData,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import convertTimestampToDate from "../components/utils/convertTimestamp";
import LoadingAnimation from "../components/utils/loadingAnimation";
import TierBadge from "../components/Tierbadge";
import sendFriendRequest from "../components/utils/sendFriendRequest";
import removeFriend from "../components/utils/removeFriend";
import { IoPersonAdd, IoPersonRemove } from "react-icons/io5";  
import { FaCheck } from "react-icons/fa";

const UserPage = () => {
  const { uid } = useParams(); // The user's UID we're viewing
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>();
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [doing, setDoing] = useState(false);

  const currentUserUid = auth.currentUser?.uid;
  const navigate = useNavigate();
  if (currentUserUid === uid) navigate("/profile");

  useEffect(() => {
    const getData = async () => {
      if (!uid || !currentUserUid) return;

      try {
        const userDocSnap = await getDoc(doc(db, "users", uid));
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setData(userData);

          const friendsRef = collection(db, "users", uid, "friends");
          const q = query(friendsRef, where("uid", "==", currentUserUid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            setIsFriend(true);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [uid, currentUserUid]);
  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  const handleSendFriendRequest = async (friendUid: string) => {
    setDoing(true);
    await sendFriendRequest(friendUid, setRequestSent);
    setDoing(false);
  };

  const handleRemoveFriend = async (friendUid: string) => {
    setDoing(true);
    await removeFriend(friendUid, setIsFriend);
    setDoing(false);
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/user/${uid}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      alert("Profile link copied to clipboard!");
    });
  };

  if (loading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  if (!uid || !data) {
    return <div>No user data available.</div>;
  }

  const pfp = data.pfp;

  return (
    <div>
      <div
        className="h-screen bg-cover bg-center fixed inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className={`bg-black bg-opacity-80 w-11/12 transition-all duration-300 ease-in-out
           ${
             isExpanded ? "lg:w-[calc(80% + 44rem)]" : "lg:w-4/5"
           }  
           min-h-[90%] h-auto max-h-[99%] rounded-[40px] flex overflow-hidden relative`}
        >
          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col ${
              isExpanded ? "left-64 " : "left-20"
            }`}
          >
            <DashHeader isExpanded={isExpanded} />
            <main
              className={`flex-1 transition-all ease-in-out duration-300 ${
                isExpanded ? "ml-64" : "ml-20"
              }`}
            >
              <div className={`flex-1 h-full flex justify-center items-center`}>
                <div className="h-[90%] overflow-y-auto min-w-[500px] w-[30%] bg-[#F3F3F3] border-4 border-white rounded-3xl">
                  <div className="bg-[#D9D9D9] border-b-4 border-white h-1/5 rounded-t-3xl"></div>

                  <div className="px-6 relative -top-14 flex flex-col gap-3 h-md:gap-4">
                    <div className="h-24 h-md:h-28">
                      <img
                        src={pfp ? pfp : "/user.png"}
                        referrerPolicy="no-referrer"
                        alt=""
                        className="size-24 h-md:size-28 object-cover rounded-full border-[4px] border-white"
                      />
                      <img
                        src={`/${data.tier}Tier.svg`}
                        alt=""
                        className="absolute top-16 size-6 h-md:top-20 left-[5.7rem] h-md:left-[6.5rem]"
                      />

                      <div className="absolute flex flex-row font-Inter right-2 gap-2">
                        {doing ? (
                          <div className="flex gap-2 w-28 justify-center hover-button hover:text-black items-center border-[#CACACA] font-semibold rounded-lg border-2 text-black text-xs p-2">
                            <div className="animate-[spin_1s_linear_infinite] border-4 border-l-black size-6 border-[rgba(0,0,0,0.5)] rounded-full"></div>
                          </div>
                        ) : isFriend ? (
                          <button
                            onClick={() => handleRemoveFriend(uid)}
                            className="flex gap-2 justify-center hover-button hover:text-black items-center border-[#CACACA] font-semibold rounded-lg border-2 text-black text-xs p-2"
                          >
                            <IoPersonRemove className="size-4  text-[#CACACA]" />
                            <span>Remove Friend</span>
                          </button>
                        ) : requestSent.includes(uid) ? (
                          <div className="flex gap-2 justify-center  hover-button hover:text-black items-center border-[#CACACA] font-semibold rounded-lg border-2 text-black text-xs p-2 ">
                             <FaCheck /> Request Sent
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSendFriendRequest(uid)}
                            className="flex gap-2 justify-center hover:bg-gray-200 hover:text-black items-center border-[#CACACA] font-semibold rounded-lg border-2 text-black text-xs p-2 transition-all"
                          >
                            <IoPersonAdd className="size-4 text-[#CACACA]" />
                            <span>Add Friend</span>
                          </button>
                        )}

                        <button
                          onClick={shareProfile}
                          className="flex gap-2 justify-center  hover-button hover:text-black items-center border-[#CACACA] font-semibold rounded-lg border-2 text-black text-xs p-2 "
                        >
                          <img src="/copy.svg" className="size-4" alt="" />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex-col flex gap-2">
                      <div className="text-left font-Inter font-semibold text-3xl">
                        {data.name}
                      </div>
                      <div className="text-left font-Inter font-light text-sm">
                        @{data.username}
                      </div>
                      <div className="text-left font-Inter font-extralight text-sm">
                        {data.email}
                      </div>
                    </div>
                    <hr />
                    <div className="flex-col flex gap-2">
                      <div className="text-left font-Inter font-semibold text-lg">
                        Member since
                      </div>
                      <div className="text-left font-Inter font-extralight text-sm">
                        {convertTimestampToDate(data.createdAt)}
                      </div>
                    </div>
                    <hr />
                    <div className="flex-col flex gap-2 font-Inter text-left text-sm">
                      <div className="font-semibold text-lg">Account Tier</div>
                      <TierBadge tier={data.tier}></TierBadge>
                    </div>
                    <hr />
                    <div className="flex-col flex gap-2 font-Inter text-left text-sm">
                      <div className="font-semibold text-lg">Note</div>
                      <div className="w-full min-h-20 rounded-2xl h-auto bg-[#D9D9D9] p-4">
                        {data.note}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
          <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
