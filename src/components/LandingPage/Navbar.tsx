import { useNavigate } from "react-router-dom"; 
import { GrGlobe } from "react-icons/gr";

const Navbar = ({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: "Home" | "About" | "Features" | "Pricing";
  setSelectedOption: (e: "Home" | "About" | "Features" | "Pricing") => void;
}) => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center mb-4 px-4">
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center text-lg font-ABeeZee gap-4 mr-10 transition-all ease-in-out text-white">
          <img src="/nn.svg" alt="" className="size-12" />
          <span>NostalgiaNet</span>
        </div>
        <p className="text-[#797B82]">|</p>
        <div className="flex  lg:space-x-12 space-x-6 p-2 text-white mx-4">
          <button
            onClick={() => setSelectedOption("Home")}
            className={`font-SourceSans ${selectedOption==='Home' ? "bg-[#50535C]" : "hover:text-gray-400"} text-white transition-all duration-300 px-2 rounded-full`}
          >
            Home
          </button>
          <button
            onClick={() => setSelectedOption("About")}
            className={`font-SourceSans ${selectedOption==='About' ? "bg-[#50535C]" : "hover:text-gray-400"} text-white transition-all duration-300 px-2 rounded-full`}
          >
            About
          </button>
          <button
            onClick={() => setSelectedOption("Features")}            
            className={`font-SourceSans ${selectedOption==='Features' ? "bg-[#50535C]" : "hover:text-gray-400"} text-white transition-all duration-300 px-2 rounded-full`}

          >
            Features
          </button>
          <button disabled className="hover:text-gray-400 cursor-not-allowed font-SourceSans">
            Pricing
          </button>
        </div>
      </div>
      <div className="md:flex hidden flex-row items-center">
        <GrGlobe color="white" className="mx-4" />
        <button
          onClick={() => navigate("/signup")}
          className="bg-[#50535C] hover:bg-black border-white border text-white py-2 px-6 w-max rounded-3xl block mx-auto"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
