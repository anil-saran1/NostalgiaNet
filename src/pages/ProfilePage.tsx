import SideNavbar from "../components/SideNavbar";
import DashHeader from "../components/DashHeader";
import "../App.css";
import bgImage from "../assets/bgp.jpg";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, DocumentData, getDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import convertTimestampToDate from "../components/utils/convertTimestamp";
import LoadingAnimation from "../components/utils/loadingAnimation";
import TierBadge from "../components/Tierbadge";

const ProfilePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>();

  const userUid = auth.currentUser?.uid;
  
  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/user/${userUid}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      alert("Profile link copied to clipboard!");
    });
  };

  useEffect(() => {
    const getData = async () => {
      if (!userUid) return; 
      try {
        const userDocSnap = await getDoc(doc(db, "users", userUid));
        if (userDocSnap.exists()) {
          setData(userDocSnap.data() as DocumentData);
          console.log("Data loaded:", userDocSnap.data());
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
  }, [userUid]);

  const navigate = useNavigate();
  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };
 
  if (loading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  if (!userUid || !data) {
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
              className={`flex-1 transition-all  ease-in-out duration-300  ${
                isExpanded ? "ml-64" : "ml-20"
              }`}
            >
              <div className={`flex-1 h-full flex  justify-center items-center`}>
                <div className="h-[90%] min-w-[400px] overflow-y-auto w-[30%] bg-[#F3F3F3] border-4 border-white rounded-3xl">
                  <div className="bg-[#D9D9D9] border-b-4 border-white h-1/5 rounded-t-3xl"></div>
                  <div className="px-6 relative -top-14 flex flex-col gap-3 h-md:gap-4">
                    <div className="h-24 h-md:h-28">
                      <img
                        src={pfp ? pfp : "/user.png"}
                        referrerPolicy="no-referrer"
                        alt=""
                        className="size-24 h-md:size-28 rounded-full object-cover border-[4px] border-white"
                      />
                      <img
                        src={`/${data.tier}Tier.svg`}
                        alt=""
                        className="absolute top-16 size-6 h-md:top-20 left-[5.7rem] h-md:left-[6.5rem]"
                      />
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
                      <div className="w-full min-h-20 rounded-2xl h-auto bg-[#D9D9D9] p-4">{data.note}</div>
                    </div> 
                    <div className="flex flex-row w-full justify-evenly font-Khyay font-light text-left text-sm">
                      <button
                        onClick={() => navigate("/editProfile")}
                        className="w-1/3 h-10 hover-button link-pointer rounded-full border-[#939292] border-2 text-white bg-[#50535C]"
                      >
                        Edit Profile
                      </button>
                      <button onClick={shareProfile} className="w-1/3 h-10 hover-button link-pointer rounded-full border-[#939292] border-2 text-white bg-[#50535C]">
                        Share Profile
                      </button>
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

export default ProfilePage;
