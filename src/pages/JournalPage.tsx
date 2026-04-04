import { useEffect, useState } from "react";
import bgImage from "../assets/bgp.jpg";
import DashHeader from "../components/DashHeader";
import SideNavbar from "../components/SideNavbar";
import JournalCreation from "./JournalCreation";
import BrowseJournal from "./BrowseJournal";
import fetchJournalsList from "../components/utils/fetchJournalsList"; // Import your fetching function
import BusyPopup from "../components/utils/busyPopup";

const JournalPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);  
  const [doing, setDoing] = useState(false);
  
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const userJournals = await fetchJournalsList();
        if (userJournals) {
          setJournals(userJournals);
        }
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
      setLoading(false);
    };

    fetchJournals(); // Fetch journals on first load
  }, []);

  const toggle = () => {
    setIsCreate(!isCreate);
  };

  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

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
          } 
           h-[90%] rounded-[40px] flex overflow-hidden relative`}
      >
        {/* Side Navbar */}
        <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col items-center ${
            isExpanded ? "left-64 " : "left-20"
          }`}
        >
          <DashHeader isExpanded={isExpanded} />
          <div
            className={`h-full transition-all ease-in-out p-3 duration-300  ${
              isExpanded ? "ml-64 " : "ml-20"
            } overflow-auto`}
          >
            <main
              className={`bg-white w-[700px] xl:w-[900px] flex justify-between flex-col h-full
                 items-center relative rounded-3xl align-middle overflow-auto
                transition-all ease-in-out duration-300 `}
            >
              {doing && <BusyPopup></BusyPopup>}
              {isCreate ? (
                <div className="w-full mt-10 h-full rounded-3xl">
                  <JournalCreation setDoing={(e:boolean) => setDoing(e)}/>
                </div>
              ) : (
                <div className="w-full mt-10 h-full rounded-3xl">
                  <BrowseJournal journals={journals} loading={loading} />
                </div>
              )}
              <div className="flex justify-center items-center my-5">
                <div className="relative flex w-[300px] h-auto p-4 bg-[#252321] rounded-full border-4 border-[#252321]">
                  <div
                    className={`absolute top-0 left-0 h-full w-1/2 rounded-full transition-all duration-300 bg-white ${
                      isCreate ? " translate-x-0" : " translate-x-full"
                    }`}
                  ></div>

                  <button
                    onClick={toggle}
                    className={`w-1/2  font-ABeeZee h-full z-10 text-center font-semibold rounded-l-full ${
                      isCreate ? "text-black" : "text-white"
                    }`}
                  >
                    Create
                  </button>
                  <button
                    onClick={toggle}
                    className={`w-1/2 font-ABeeZee h-full z-10 text-center font-semibold rounded-r-full ${
                      isCreate ? "text-white" : "text-black"
                    }`}
                  >
                    Browse
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
