import React from "react";
import bgImage from "../assets/bgp.jpg";
import Auth from "../components/Auth"

const LandingPage: React.FC = () => {
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
      <div className="bg-black bg-opacity-80 w-11/12  max-w-[1216px] lg:w-2/3  rounded-[40px]">
        <Auth />
      </div>
    </div>
  );
};

export default LandingPage;
