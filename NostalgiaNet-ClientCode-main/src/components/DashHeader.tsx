import { FaSearch } from "react-icons/fa";
import nnUrl from "../assets/NN.png";
import StorageMeter from "../components/CircularProgress";
import { useHref, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notifications from "./Notifications";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

interface DashHeaderProps {
  isExpanded: boolean;
}

const DashHeader: React.FC<DashHeaderProps> = ({ isExpanded }) => {
  const navigate = useNavigate();
  let oldpfp = localStorage.getItem("pfp");
  const userUid = auth.currentUser?.uid;
  if(!userUid) return null; 

  useEffect(() => {
    const setPFP = async () => {
      const userDoc = await getDoc(doc(db, "users", userUid));
      localStorage.setItem('pfp',(userDoc.data()?.pfp));
    };
  
    setPFP();
  }, [userUid]);

  const [loadingState, setLoadingState] = useState(true);

  return (
    <header
      className={`bg-[rgba(0,0,0,0.5)] w-full min-h-16 backdrop-blur-lg h-20 flex flex-row items-center justify-center
          ${
            isExpanded ? "pl-64" : "pl-20"
          } z-[5] shadow-md transform transition-all duration-300 `}
    >
      <div
        className={`h-1/2 bg-white w-1/2 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)] flex flex-row items-center`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-4"
        >
          <circle cx="11" cy="11" r="7" stroke="#616267" stroke-width="2" />
          <path
            d="M11 8C10.606 8 10.2159 8.0776 9.85195 8.22836C9.48797 8.37913 9.15726 8.6001 8.87868 8.87868C8.6001 9.15726 8.37913 9.48797 8.22836 9.85195C8.0776 10.2159 8 10.606 8 11"
            stroke="#616267"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M20 20L17 17"
            stroke="#616267"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Find something"
          className="w-[100%] font-ABeeZee bg-transparent text-[#616266] focus:outline-none "
        />
      </div>
      <div className="w-auto h-full absolute flex flex-row items-center justify-center right-6">
        <Notifications></Notifications>
        <img
          onClick={() => navigate('/profile')}
          src={oldpfp ? oldpfp : "/user.png"}
          referrerPolicy="no-referrer"
          alt=""
          className="size-10 link-pointer hover:scale-105 object-cover transition-all rounded-full border-[2px] border-white"
          onLoad={() => setLoadingState(false)}
          onError={() => setLoadingState(false)}
        />
      </div>
    </header>
  );
};

export default DashHeader;
