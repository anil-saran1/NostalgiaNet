import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchJournalsList from "./utils/fetchJournalsList"; // Adjust the path as needed
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { curry, delay } from "lodash";

interface JournalProp {
  id: string;
  title: string;
  role: string;
  createdAt: string;
  description: string;
  theme: 1 | 2 | 3;
}

const Banner3 = () => {
  const [journals, setJournals] = useState<JournalProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current journal index
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const userJournals = await fetchJournalsList();

        if (userJournals) {
          setJournals(userJournals);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journals: ", error);
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 200);
   
    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

    
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? journals.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next journal
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === journals.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentJournal = journals[currentIndex] || null;

  return (
    <div className="relative flex flex-row h-lg:h-72 items-center p-4 rounded-3xl text-white">
      <div
        className="h-52 w-16 left-10 bg-[#C2C2C2] z-20 link-pointer relative transition-all ease-in-out duration-300 hover:scale-110 text-black flex items-center justify-center rounded-2xl"
        onClick={handlePrev}
      >
        <IoIosArrowBack />
      </div>
      <div>
        <img
          src="/journalPreview.svg"
          className="h-full w-[450px] h-lg:h-72 h-lg:w-auto"
          alt=""
        />
        <div className="absolute inset-0 flex flex-row w-full px-28 py-4 justify-center items-center">
          {loading ? (
            <div className="loader"></div>
          ) : currentJournal ? (
            <div className="w-full h-full py-5 px-10 flex flex-row">
              <div className="flex-1 flex items-center justify-start">
                <img
                  src={`/card-image-${currentJournal.theme}.png`}
                  alt="Journal cover"
                  className="w-auto h-[80%] object-cover rounded-[0px_25px_25px_0px] shadow-[6px_6px_10px_rgba(0,0,0,0.5)]"
                />
              </div>

              <div className="flex-1 flex items-center font-Inter justify-center">
                <div className="flex flex-col h-[80%] w-full bg-white border-2 border-white rounded-3xl">
                  <div className="flex-1 font-semibold text-sm flex justify-center items-center  text-black">
                    {currentJournal.title}
                  </div>
                  <div className=" bg-[#333333] flex flex-col rounded-3xl justify-end items-center font-light text-xs h-[70%] p-4">
                    <div className="flex-1">{currentJournal.description}</div>
                    <button onClick={() => navigate(`/journal/${currentJournal.id}`)} className="bg-white w-[80%] p-2 rounded-xl hover:scale-110 transition-all flex items-center font-semibold text-black justify-center">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full py-5 px-10 flex flex-row">
              <div className="flex-1 flex items-center justify-start">
                <div className="w-[80%] h-[80%] object-cover border-dashed border-[#565656] border-[3px] rounded-[0px_25px_25px_0px]" />
              </div>

              <div className="flex-1 flex items-center font-Inter justify-center">
                <div className="flex flex-col h-[80%] w-full bg-white border-2 border-white rounded-3xl">
                  <div className=" bg-[#333333] flex flex-col rounded-3xl justify-between h-full items-center font-light text-xs p-4">
                    <div className="font-semibold text-lg">No Journal</div>
                    <div className="flex-1 text-[11px] items-center justify-center flex">
                      Click the Create button to make your first journal!
                    </div>
                    <button onClick={() => {navigate('/journal')}} className="bg-white w-[80%] p-2 rounded-xl hover:scale-110 transition-all flex items-center font-semibold text-black justify-center">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className="h-52 w-16 right-10 bg-[#C2C2C2] z-20 link-pointer relative transition-all ease-in-out duration-300 hover:scale-110 text-black flex items-center justify-center rounded-2xl"
        onClick={handleNext}
      >
        <IoIosArrowForward />
      </div>
    </div>
  );
};

export default Banner3;
