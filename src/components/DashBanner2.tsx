import { useState, useEffect, useRef } from "react";
import Vault from "./Vault";
import fetchCapsulesList from "./utils/fetchCapsuleList";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "../App.css";
import EmptyVault from "./EmptyVault";

interface VaultProp {
  id: string;
  createdAt: number;
  size: number;
  name: string;
  openAt: number;
}

const DashBanner2 = () => {
  const [capsules, setCapsules] = useState<VaultProp[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mainExpanded, setMainExpanded] = useState(false);

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
      className={`flex flex-row
      ${mainExpanded ? "xl:w-[920px] w-[610px]" : "xl:w-[715px] w-[430px]"}  ${
        capsules.length == 0 ? "justify-center" : "justify-between "
      }
      overflow-hidden p-2 transition-all ease-in-out duration-300
    rounded-3xl items-center relative`}
    >
      {loading ? (
        <div className="w-full h-56 relative">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center z-[1000] busy-popup">
            <div className="w-full h-full backdrop-brightness-50 flex items-center justify-center rounded-3xl z-10">
              <div className="loader w-12 h-12"></div>
            </div>
          </div>
        </div>
      ) : capsules.length > 0 ? (
        <>
          <button
            onClick={handleScrollLeft}
            className="xl:h-20 w-20 flex hover:scale-110 transition-all duration-300 ease-in-out items-center justify-center bg-[#C2C2C2] rounded-2xl "
          >
            <IoIosArrowBack  className="m-2"/>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex flex-row gap-x-4 w-auto px-4 max-w-[600px] xl:max-w-[892px] no-scrollbar overflow-auto scrollbar-hide mx-4 scroll-smooth"
          >
            {capsules.map((capsule) => (
              <Vault
                key={capsule.id}
                name={capsule.name}
                id={capsule.id}
                createdAt={capsule.createdAt}
                openAt={capsule.openAt}
                setMainExpanded={setMainExpanded}
              />
            ))}
          </div>

          <button
            onClick={handleScrollRight}
            className="xl:h-20 w-20 flex hover:scale-110 transition-all duration-300 ease-in-out items-center justify-center bg-[#C2C2C2] rounded-2xl  "
          >
            <IoIosArrowForward className="m-2"/>
          </button>
        </>
      ) : (
        <EmptyVault></EmptyVault>
      )}
    </div>
  );
};

export default DashBanner2;
