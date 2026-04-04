import { useEffect, useRef, useState } from "react";
import bgImage from "../assets/bgp.jpg";
import SideNavbar from "../components/SideNavbar";
import DashHeader from "../components/DashHeader";
import fetchCapsulesList from "../components/utils/fetchCapsuleList";
import Vault from "../components/Vault";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CapsulePopup from "../components/CapsulePopup";

interface VaultProp {
  id: string;
  createdAt: number;
  size: number;
  name: string;
  openAt: number;
}

const MyTimevaults = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [capsules, setCapsules] = useState<VaultProp[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedCapsule, setSelectedCapsule] = useState<VaultProp | null>(null);
  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCapsule(null);
  }

  useEffect(() => {
    const fetchCapsules = async () => {
      const capsulesData = await fetchCapsulesList();
      setCapsules(capsulesData);
      setLoading(false);
    };

    fetchCapsules();
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
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
            className={`flex-1 flex max-w-full items-center justify-center p-3 transition-all ease-in-out duration-300 ${
              isExpanded ? "ml-64" : "ml-20"
            }`}
          >
            <div className="w-[95%] lg:w-[90%] h-[80%] lg:h-[90%] relative p-4 rounded-3xl bg-[#FFFFFF] items-center justify-between bg-opacity-30 flex flex-row">
              <button
                onClick={handleScrollLeft}
                className="h-32 w-12 flex hover:scale-110 transition-all duration-300 ease-in-out items-center justify-center bg-[#2D2C29] rounded-full  "
              >
                <IoIosArrowBack className="m-2  text-white xl:m-0" />
              </button>
              <div
                ref={scrollContainerRef}
                className="grid grid-rows-2 flex-1 gap-6 grid-flow-col p-4 h-sm:scale-100 scale-75 max-w-[500px] lg:max-w-[600px] xl:max-w-[800px] no-scrollbar overflow-auto scrollbar-hide scroll-smooth"
              >
                {capsules.map((capsule) => (
                  <div onClick={() => {setIsModalOpen(true); setSelectedCapsule(capsule)}} key={capsule.id}>
                    <Vault
                      key={capsule.id}
                      name={capsule.name}
                      id={capsule.id}
                      createdAt={capsule.createdAt}
                      openAt={capsule.openAt}
                      setMainExpanded={() => {}}
                      canExpand={false}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleScrollRight}
                className="h-32 w-12 flex hover:scale-110 transition-all duration-300 ease-in-out items-center justify-center bg-[#2D2C29] rounded-full"
              >
                <IoIosArrowForward className="m-2  text-white xl:m-0" />
              </button>
            </div>
          </main>
        </div>
      </div>
      {isModalOpen && selectedCapsule && <CapsulePopup capsule={selectedCapsule} onCloseModal={closeModal} />}
    </div>
  );
};

export default MyTimevaults;
