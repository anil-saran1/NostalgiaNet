// AngledPanel.tsx
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import "./AngledPanel.css";
import "../App.css";
import { FaArrowLeft } from "react-icons/fa";
import fetchProfiles from "./utils/fetchProfiles";
import getToken from "./utils/getCredentials";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import JournalInvitePopup from "../pages/JournalInvitePopup";
import FriendsSection from "./FriendsGroup"; 

interface Friend {
  uid: string;
  name: string | null;
  pfp: string | null;
}

const AngledPanel = ({
  theme,
  onThemeConfirm,
  setDoing,
}: {
  theme: 1 | 2 | 3;
  onThemeConfirm: (e: boolean) => void;
  setDoing: (e: boolean) => void;
}) => {
  console.log(theme);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [invitedPeople, setInvitedPeople] = useState<Friend[]>([]);
  const [slide, setSlide] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const userUid = auth.currentUser?.uid;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedToken = await getToken();

        if (!fetchedToken) return "no token";
        setToken(fetchedToken);

        if (userUid) {
          const profile = await fetchProfiles(userUid);
          console.log(profile);
          setUserProfile(profile);
        } else {
          setError("User UID not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch user data.");
      }
    };
    fetchData();

    setTimeout(() => setSlide(true), 100);
  }, [userUid]);
  console.log(error);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setDoing(true);
    setError(null);

    try {
      // Check if all required data is available
      if (!token || !userUid || !userProfile) {
        setError("User is not properly authenticated or user data is missing.");
        setDoing(false); // Stop loading
        return;
      }

      const invitedUids = invitedPeople.map((invited) => invited.uid);

      const requestBody = {
        userUid,
        title,
        description,
        token,
        theme,
        name: userProfile.name || "Unknown User",
        invited: invitedUids,
      };

      const response = await fetch(
        "https://purple-sea-0407.nostalgianetofficial.workers.dev/createJournal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create journal.");
      }

      const { journalId } = await response.json();
      navigate(`/journal/${journalId}/edit`);
    } catch (error) {
      console.error("Error creating journal:", error);
    } finally {
      setDoing(false); // Stop loading after request finishes
    }
  };
  const handleInvite = (invitedUsers: Friend[]) => {
    setInvitedPeople(invitedUsers);
  };

  return (
    <div className="journal-inner-container h-1/2">
      {/* Journal Cards */}

      <div className="flex relative flex-row justify-between overflow-hidden  rounded-3xl my-20px w-[90%] bg-[#4E4E4E]">
        <div
          onClick={() => onThemeConfirm(false)}
          className={`absolute mt-4 ml-4 z-10 rounded-full bg-white p-2 link-pointer hover:scale-125 transition-all duration-300`}
        >
          <FaArrowLeft />
        </div>
        <div
          className={`right-point w-1/2 max-w-[400px] h-[300px]  rounded-3xl py-14 lg:py-14 bg-[#252321]`}
        >
          <div
            className={`flex absolute flex-row px-2 md:px-6 lg:px-12 xl:px-32
              xl:w-[1000px] w-[800px] lg:w-[850px] justify-between transition-all ease-in-out duration-1000`}
            style={{
              transform: slide
                ? ` ${
                    theme != 1
                      ? `translateX(${(theme - 1) * -300}px)`
                      : `translateX(0)`
                  } `
                : ` ${theme != 1 ? `translateX(0)` : `translateX(-90%)`} `,
            }}
          >
            {/* Card 1 */}
            <div
              className={`journal-card scale-75 xl:scale-100 relative transition-all duration-300 rounded-[0px_30px_30px_0px] 
            "brightness-100 drop-shadow-[30px_30px_20px_rgba(0,0,0,0.6)]`}
            >
              <img
                src="/card-image-1.png"
                alt="Journal 1"
                className="journal-image"
              />
            </div>

            {/* Card 2 */}
            <div
              className={`journal-card scale-75 xl:scale-100 relative transition-all duration-300 rounded-[0px_30px_30px_0px] 
            "brightness-100 drop-shadow-[30px_30px_20px_rgba(0,0,0,0.6)]`}
            >
              <img
                src="/card-image-2.png"
                alt="Journal 2"
                className="journal-image"
              />
            </div>

            {/* Card 3 */}
            <div
              className={`journal-card scale-75 xl:scale-100 relative transition-all duration-300 rounded-[0px_30px_30px_0px] 
            "brightness-100 drop-shadow-[30px_30px_20px_rgba(0,0,0,0.6)]`}
            >
              <img
                src="/card-image-3.png"
                alt="Journal 3"
                className="journal-image"
              />
            </div>
          </div>
        </div>
        <div className="xl:w-[35%] w-[45%] flex flex-col items-end h-auto bg-[#252321] rounded-3xl p-6 shadow-lg relative">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10  font-ABeeZee inputBox text-center placeholder-[#616266] px-4 mb-4 rounded-full   focus:outline-none"
          />
          {/* Description Input */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-20 font-ABeeZee  inputBox px-4 placeholder-[#616266] py-2 text-center rounded-2xl resize-none focus:outline-none mb-4"
          />
          {/* Invite Button */}
          <div className="w-full flex">
            {invitedPeople.length >= 1 && (
              <FriendsSection friends={invitedPeople} toShow={1} />
            )}
            <div
              onClick={openModal}
              className="flex justify-center gap-2 font-ABeeZee items-center xl:px-4 xl:py-2 px-2 w-24 bg-white link-pointer hover:scale-125 transition-all duration-300 text-black rounded-full shadow-md"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 "
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.33502 9.46985C5.51849 9.6043 4.74566 9.87925 4.07573 10.2791C3.31296 10.7343 2.71669 11.3317 2.33821 12.0114C2.16652 12.3198 2.37229 12.6813 2.7178 12.7534C3.96402 13.0131 5.2261 13.1702 6.49152 13.2247C6.02982 12.697 5.75003 12.0062 5.75003 11.25C5.75003 10.5835 5.96736 9.9678 6.33502 9.46985Z"
                  fill="#000000"
                />
                <path
                  d="M11.25 8.75L11.25 13.75"
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M13.75 11.25L8.75 11.25"
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="7.5" cy="5" r="3.125" fill="#000000" />
              </svg>
              <span className="hidden xl:inline">Invite</span>
            </div>
          </div>

          {isModalOpen && (
            <JournalInvitePopup
              onCloseModal={closeModal}
              invited={invitedPeople}
              onInvite={handleInvite}
            />
          )}

          <button
            onClick={handleSubmit}
            className={`absolute flex xl:hidden border-2 bottom-[5%] p-3 w-4/5 flex-row items-center 
            gap-2 transition-all duration-200 hover:scale-[110%] right-[10%]
            bg-[#302E2C] rounded-[40px] text-white font-Khyay`}
          >
            <GoPlus className="size-6" /> Create
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className={`absolute hidden xl:flex border-8 p-4 flex-row items-center gap-2 transition-all duration-200 hover:scale-125 
        bg-[#302E2C] rounded-[40px] text-white font-Khyay`}
          style={{
            left: "50%",
            top: "40%",
            transform: "translateX(-50%)",
          }}
        >
          <GoPlus className="size-6" /> Create
        </button>
      </div>
    </div>
  );
};

export default AngledPanel;
