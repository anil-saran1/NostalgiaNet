import React, { useState, useEffect } from "react";
import readJournalEntries from "../components/utils/readJournalEntries";
import { useParams } from "react-router-dom";
import FlipBook from "../components/Flipbook";
import DashHeader from "../components/DashHeader";
import SideNavbar from "../components/SideNavbar";
import bgImage from "../assets/bgp.jpg";
import LoadingAnimation from "../components/utils/loadingAnimation";

interface JournalEntry {
  name: string;
  content: string;
  createdAt: string;
  image: string[];
}

const JournalBook: React.FC = () => {
  const { journalId, pgNo } = useParams();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<1|2|3>(1);
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      const journalData = await readJournalEntries(journalId || "");

      if (!journalData) {
        setError("You do not have permission to view this journal or the journal does not exist.");
        setLoading(false);
        return;
      }
 
      setTitle(journalData.title);
      setCreatedAt(journalData.createdAt);
      setEntries(journalData.entries);
      setDescription(journalData.description);
      setTheme(journalData.theme);
      setLoading(false);
    };

    fetchEntries();
  }, [journalId]);

  if (loading) {
    return <LoadingAnimation/>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  return (
    <div>
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
           min-h-[90%] h-auto max-h-[99%] rounded-[40px] flex overflow-hidden relative`}
        >
          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col ${
              isExpanded ? "left-64 " : "left-20"
            }`}
          >
            <DashHeader isExpanded={isExpanded} />
            <main
              className={`flex-1 transition-all flex justify-center items-center ease-in-out duration-300  ${
                isExpanded ? "ml-64" : "ml-20"
              }`}
            >

              <FlipBook pgNo={Number(pgNo)} theme={theme} description={description} title={title} createdAt={createdAt} entries={entries} ></FlipBook>
            </main>
          </div>
          <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export default JournalBook;
