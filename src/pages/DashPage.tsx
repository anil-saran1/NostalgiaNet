import React, { useState, useEffect } from "react";
import bgImage from "../assets/bgp.jpg";
import SideNavbar from "../components/SideNavbar";
import DashHeader from "../components/DashHeader";
import Banner1 from "../components/DashBanner1";
import Banner2 from "../components/DashBanner2";
import Banner3 from "../components/DashBanner3";
import { auth, db } from "../firebaseConfig";
import FriendsPopup from "./FriendsPopup"; 

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div
        className="h-screen bg-cover bg-center fixed inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span className="sr-only">Loading</span>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>
    );
  }

  if (!user) {
    return <div>No user data found.</div>;
  }
  return (
    <div
      className={`h-screen bg-cover bg-center fixed inset-0 flex items-center justify-center `}
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
           } ${
        isModalOpen ? "blur-lg" : ""
      } min-h-[90%] h-auto max-h-[95%] rounded-[40px] flex overflow-hidden relative`}
      >
        {/* Side Navbar */}

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col ${
            isExpanded ? "left-64 " : "left-20"
          }`}
        >
          <DashHeader isExpanded={isExpanded} />
          <main
            className={`flex-1 transition-all overflow-auto ease-in-out duration-300  ${
              isExpanded ? "ml-64" : "ml-20"
            }`}
          >
            <div className={`m-3 h-auto flex flex-col gap-4 items-center`}>
              <Banner1
                isExpanded={isExpanded}
                onOpenModal={openModal}
              ></Banner1>
              <Banner2></Banner2>
              <Banner3></Banner3> 
            </div>
          </main>
        </div> 

        <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
      </div>
      {isModalOpen && <FriendsPopup onCloseModal={closeModal} />}
    </div>
  );
};

export default Dashboard;
