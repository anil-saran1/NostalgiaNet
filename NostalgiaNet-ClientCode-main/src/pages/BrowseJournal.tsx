import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import fetchEditorsList from "../components/utils/fetchEditors";
import addFriend from "../assets/addFriend.png";
import FriendsSection from "../components/FriendsGroup";
import { MdModeEdit } from "react-icons/md";
import { GrView } from "react-icons/gr";

interface JournalProp {
  id: string;
  title: string;
  role: string;
  createdAt: string;
  description: string;
  theme: 1 | 2 | 3;
  editors: any[];
}

interface BrowseJournalProps {
  journals: JournalProp[];
  loading: boolean;
}

const BrowseJournal: React.FC<BrowseJournalProps> = ({ journals, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track current journal index
  const [editors, setEditors] = useState<any[]>([]);
  const [editorsLoading, setEditorsLoading] = useState(true);
  const navigate = useNavigate();

  const currentJournal = journals[currentIndex];
 
  useEffect(() => {
    const fetchEditors = async () => {
      setEditorsLoading(true);
      const fetchedEditors = await fetchEditorsList({
        setLoading: setEditorsLoading,
        editors: currentJournal.editors,
      });
      console.log("its fetching");
      setEditors(fetchedEditors || []);
    };

    console.log(editors);

    if (currentJournal && currentJournal.editors.length > 0) {
      fetchEditors();
    }
  }, [currentIndex, currentJournal]);

  if (loading) {
    return <p>Loading journals...</p>;
  }

  if (journals.length === 0) {
    return <p>No journals available.</p>;
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? journals.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === journals.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleEdit = () => {
    navigate(`/journal/${currentJournal.id}/edit`);
  };
  const smallItemWidth = 16*4;
  const largeItemWidth = 36*4;
  const containerWidth =
    (journals.length - 1) * (smallItemWidth+120) + largeItemWidth;

  return (
    <div className={`h-full flex flex-row  w-full p-4 px-10 gap-8`}>
      <div className="h-full bg-[#252321] rounded-3xl xl:flex-[1_1_0] w-[300px] px-8 py-4 font-ABeeZee text-white gap-6 flex flex-col">
        <div className="text-3xl font-normal">{currentJournal.title}</div>
        <div className="flex flex-row justify-center  items-center">
          <div className="w-1/2">
            <FriendsSection friends={editors}></FriendsSection>
          </div>

          <div className=" flex flex-row justify-center items-center text-sm gap-4 my-4">
            {editors.length} people{" "}
            <div className="size-10 hover:scale-125 rounded-full bg-white transition-all duration-150">
              <img src={addFriend} alt="" className="p-2" />
            </div>
          </div>
        </div>

        <div className="text-sm text-left p-4 leading-relaxed bg-[rgba(0,0,0,0.3)] flex-1 max-h-[150px] rounded-xl overflow-y-auto">
          <div className="h-full  font-extralight">
            {currentJournal.description}
          </div>
        </div>
        {/* Edit Button */}
        <div className="flex gap-5 justify-end">
          <button
            onClick={() => navigate(`/journal/${currentJournal.id}`)}
            className="bg-white text-black px-4 py-1 rounded-xl flex items-center justify-center gap-2 mt-6 hover:scale-110 transition-all ease-in-out duration-200"
          >
            {" "}
            <GrView className="size-5"></GrView>
            View
          </button>
          <button
            onClick={handleEdit}
            className="bg-white text-black px-4 py-1 rounded-xl flex items-center justify-center gap-2 mt-6 hover:scale-110 transition-all ease-in-out duration-200"
          >
            <MdModeEdit className="size-5" />
            Edit
          </button>
        </div>
      </div>
 
      <div className="h-full bg-[#252321] rounded-3xl overflow-hidden flex-1 flex items-center justify-center relative">
        {/* Cover Image */}
        <div
          className={`flex absolute xl:ml-36 ml-20 inset-0 justify-between flex-row items-center transition-transform duration-500 ease-in-out`}
          style={{
            width: `${containerWidth}px`,
            transform: `translateX(-${currentIndex * 184.5}px)`,
          }}
        >
          {journals.map((journal, index) => (
            <img
              key={index}
              src={`/card-image-${journal.theme}.png`}
              alt={journal.title}
              onClick={() => {
                currentIndex === index &&
                  navigate(`/journal/${currentJournal.id}`);
              }}
              className={`transition-all duration-500 ease-in-out ${
                currentIndex === index
                  ? "w-36 rounded-[0px_30px_30px_0px] shadow-[16px_16px_4px_rgba(0,0,0,0.8)] link-pointer h-auto"
                  : "w-16 rounded-[0px_5px_5px_0px] shadow-[8px_8px_4px_rgba(0,0,0,0.8)] h-auto opacity-70"
              }`}
            />
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 bg-white bg-opacity-65 w-7 h-12 flex justify-center items-center rounded-lg hover:scale-125 transition-all"
        >
          <FaChevronLeft />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 bg-white bg-opacity-65 w-7 h-12 flex justify-center items-center rounded-lg hover:scale-125 transition-all"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default BrowseJournal;
