import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import date from "date-and-time";
import DashHeader from "../components/DashHeader";
import SideNavbar from "../components/SideNavbar";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase imports
import { v4 as uuidv4 } from "uuid"; // Import UUID
import bgImage from "../assets/bgp.jpg";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { FiX } from "react-icons/fi"; // Close icon
import ordinal from "date-and-time/plugin/ordinal";
import { auth } from "../firebaseConfig";
import LoadingAnimation from "../components/utils/loadingAnimation";
import BusyPopup from "../components/utils/busyPopup";

date.plugin(ordinal);

const JournalEdit: React.FC = () => {
  const { journalId } = useParams();
  const navigate = useNavigate(); // Move useNavigate outside of handleSubmit
  const now = new Date();
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [content, setContent] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [doing, setDoing] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(false);
    };
    fetchEntries();
  }, []);

  if (loading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return null;
    }

    const storage = getStorage();
    const uniqueFilename = `${uuidv4()}-${file.name.split(".").pop()}`; // Generate a unique filename with file extension
    const storageRef = ref(storage, `images/${uniqueFilename}`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log("File uploaded successfully:", url);
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);

      const previewUrls = fileArray.map((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prevPreviews) => [
            ...prevPreviews,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
        return reader;
      });
    }
  };

  const handleRemovePreview = (index: number) => {
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setDoing(true);
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const url = await handleImageUpload(file);
          return url;
        })
      );

      const validUrls = uploadedUrls.filter((url) => url !== null) as string[];

      const journalEntry = {
        createdAt: date.format(now, "dddd, MMM DDD YYYY"),
        journalId: journalId,
        name: auth.currentUser?.displayName || "", // Example: Getting the current user's display name
        content: content,
        image: validUrls, // Use the uploaded image URLs
      };

      console.log("Journal Entry Submitted:", journalEntry);

      const response = await fetch(
        "https://purple-sea-0407.nostalgianetofficial.workers.dev/addEntry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(journalEntry),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Server response:", data);
      if (data.success) {
        navigate(`/journal/${journalId}`);
      }
    } catch (error) {
      setDoing(false);
      console.error("Error submitting journal entry:", error);
    }
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
          <div
            className={`flex-1 flex flex-col ${
              isExpanded ? "left-64 " : "left-20"
            }`}
          >
            <DashHeader isExpanded={isExpanded} />
            <main
              className={`flex-1 relative transition-all flex flex-row justify-center items-center ease-in-out duration-300  ${
                isExpanded ? "ml-64" : "ml-20"
              }`}
            >
              <img
                src="/card-image-2.png"
                className="w-[300px] h-auto left-0 top-0 absolute rotate-[-30deg] shadow-[-24px_24px_20px_rgba(0,0,0,1)]"
                alt="Decorative Image"
              />
              <div
                className="xl:w-2/3 flex flex-col relative w-4/5 z-10 bg-white h-[90%] rounded-3xl p-10 shadow-[inset_0px_6px_10px_6px_rgba(0,0,0,0.3)]"
                style={{
                  backgroundImage: `url(/card-1-edit.svg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  resize: "none",
                }}
              >
                {doing && <BusyPopup></BusyPopup>}
                <div className="flex items-start flex-col w-full border-b-2 pb-4 border-black px-8 my-5 drop-shadow-xl">
                  <p className=" text-2xl font-semibold">
                    {date.format(now, "MMMM")}
                  </p>
                  <p className="text-[10px] text-[#616267] text-left">
                    today is {date.format(now, "dddd, MMM DDD YYYY")}
                  </p>
                </div>
                <textarea
                  name="content"
                  className=" w-full flex-1 text-start flex justify-start border-b-2 pb-4 border-black items-start  outline-none"
                  style={{ backgroundColor: "transparent", resize: "none" }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                {/* Image Previews with Remove Option */}
                <div className="mt-4 h-20 flex flex-wrap gap-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                      {/* Cross button visible on hover */}
                      <button
                        onClick={() => handleRemovePreview(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute bottom-0 right-0 link-pointer bg-[#C2C2C2] rounded-full p-3 m-6 shadow-[-2px_2px_15px_rgba(0,0,0,0.3)]">
                    <LuGalleryVerticalEnd className="size-8 relative" />
                    <label
                      htmlFor="file-input"
                      className="h-full w-full absolute top-0 left-0 z-10 link-pointer"
                    ></label>
                    <input
                      type="file"
                      className="hidden"
                      id="file-input"
                      onChange={handleFileChange} // Image handler
                      multiple // Allow multiple file selection
                    />
                  </div>
                </div>

                <div className="relative">
                  <div
                    onClick={handleSubmit}
                    className="absolute bottom-0 right-20 link-pointer bg-[#C2C2C2] rounded-full p-3 m-6 shadow-[-2px_2px_15px_rgba(0,0,0,0.3)]"
                  >
                    Submit
                  </div>
                </div>
              </div>
            </main>
          </div>
          <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export default JournalEdit;
