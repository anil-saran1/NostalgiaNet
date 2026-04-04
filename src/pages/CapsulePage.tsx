import { useState } from "react";
import bgImage from "../assets/bgp.jpg";
import SideNavbar from "../components/SideNavbar";
import DashHeader from "../components/DashHeader";
import { useNavigate } from "react-router-dom";

const CapsulePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  const [index, setIndex] = useState(0);

  const top = index * 7;

  const navigate = useNavigate();

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
      <div
        className={`bg-black bg-opacity-80 w-11/12 transition-all duration-300 ease-in-out
          ${
            isExpanded ? "lg:w-[calc(80% + 44rem)]" : "lg:w-4/5"
          } h-[90%] rounded-[40px] flex overflow-hidden relative`}
      >
        {/* Side Navbar */}
        <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col ${
            isExpanded ? "left-64" : "left-20"
          }`}
        >
          <DashHeader isExpanded={isExpanded} />
          <main
            className={`flex-1 flex items-center justify-center p-3 overflow-auto transition-all ease-in-out duration-300  ${
              isExpanded ? "ml-64" : "ml-20"
            }`}
          >
            <div className="w-[95%] lg:w-[90%] h-[80%] lg:h-[90%] relative rounded-3xl bg-[#D4D4D4] flex flex-row">
              <div className="h-full flex w-3/4 xl:w-1/2 items-center relative justify-end scale-75 h-sm:scale-90 h-md:scale-100">
                <div className="w-[85%] lg:w-[65%] bg-[#272625] h-[28rem] lg:mr-[2rem] rounded-[30px]  relative items-center">
                  <>
                    <img
                      className={`absolute scale-90 lg:scale-100 left-[-66px] transition-all z-10 duration-300 ease-in-out ${
                        index == 0 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ top: `calc(${top + 2.5}rem` }}
                      src="/plus.svg"
                      alt="plus Icon"
                    />
                    <img
                      className={`absolute scale-90 lg:scale-100 left-[-66px] transition-all z-10 duration-300 ease-in-out ${
                        index == 1 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ top: `calc(${top + 2.5}rem` }}
                      src="/lock.svg"
                      alt="lock Icon"
                    />
                    <img
                      className={`absolute scale-90 lg:scale-100 left-[-66px] transition-all z-10 duration-300 ease-in-out ${
                        index == 2 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ top: `calc(${top + 2.5}rem` }}
                      src="/bin.svg"
                      alt="bin Icon"
                    />
                    <img
                      className={`absolute scale-90 lg:scale-100 left-[-66px] transition-all z-[5] duration-300 ease-in-out`}
                      style={{ top: `calc(${top + 2.5}rem` }}
                      src="/mover.svg"
                      alt="mover Icon"
                    />
                  </>
                  <div className="relative h-full z-10 flex items-center justify-center text-center ">
                    <ul className="text-center font-ABeeZee text-white font-light text-lg">
                      <li
                        className="my-[5rem] link-pointer lg:w-auto text-center"
                        onMouseEnter={() => setIndex(0)}
                        onClick={() => navigate("/uploadpage")}
                      >
                        New <br className="xl:hidden"></br> TimeVault
                      </li>
                      <li
                        className="my-[5rem] link-pointer"
                        onMouseEnter={() => setIndex(1)}
                        onClick={() => navigate("/allCapsules")}
                      >
                        My <br className="xl:hidden"></br> TimeVaults
                      </li>
                      <li
                        className="my-[5rem] link-pointer"
                        onMouseEnter={() => setIndex(2)}
                      >
                        Public <br className="xl:hidden"></br> TimeVaults
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-1/2 flex justify-center items-center">
                <img
                  src="/capsulePage.png"
                  alt=""
                  className=" w-auto h-1/2 xl:h-3/4"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CapsulePage;
