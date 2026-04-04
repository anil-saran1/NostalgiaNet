import { useEffect, useRef, useState } from "react";
import bgImage from "../assets/bgp.jpg";
import DashHeader from "../components/DashHeader";
import SideNavbar from "../components/SideNavbar";
import { MdDiamond } from "react-icons/md";
import fileIcons from "../components/utils/fileIcons";
import { uploadFiles } from "../components/utils/UploadFiles";
import getToken from "../components/utils/getCredentials";
import { auth } from "../firebaseConfig";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileRename from "filepond-plugin-file-rename";
import {
  FaAngleLeft,
  FaAngleRight,
  FaArrowAltCircleLeft,
  FaTimes,
} from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BusyPopup from "../components/utils/busyPopup";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileRename);

const UploadScreen = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [capsuleName, setCapsuleName] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [selectedTime, setSelectedTime] = useState<any>(new Date());
  const [publicCapsule, setPublicCapsule] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [doing, setDoing] = useState(false);
  useEffect(() => {
    const calculateTotalSize = () => {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      setTotalFileSize(totalSize);
    };

    calculateTotalSize();
  }, [files]);

  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    onDrop(droppedFiles); // Programmatically add dropped files to FilePond
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const getFileIcon = (fileType: string) => {
    const extension = fileType.toLowerCase();
    return fileIcons[extension] || fileIcons["default"];
  };

  const onDrop = (acceptedFiles: File[]) => {
    const fileInput = document.querySelector(
      ".filepond--browser"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.files = new DataTransfer().files; // Clear the FilePond input first
      acceptedFiles.forEach((file) => {
        setFiles((prevFiles) => [...prevFiles, file]);
      });
    }
  };

  const chunkFiles = (filesArray: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < filesArray.length; i += size) {
      chunks.push(filesArray.slice(i, i + size));
    }
    return chunks;
  };

  const renderFileItemContent = (file: any, showName: boolean) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const fileIcon = getFileIcon(fileExtension);
    return (
      <div className="flex w-full h-full items-center justify-between p-2">
        <img src={fileIcon} alt="File Icon" className="h-14 w-auto" />
        {showName && (
          <p className="text-xs font-ABeeZee truncate w-1/2 text-gray-800">
            {file.name}
          </p>
        )}
      </div>
    );
  };
  const handleRemoveFile = (fileIndex: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  const renderFileGroup = (group: any[], groupIndex: number) => {
    let gridStyles = {
      gridTemplateRows: "repeat(2, 75px)",
      gridTemplateColumns:
        group.length < 3 ? "repeat(2, 75px)" : "repeat(4,75px)",
    };

    return (
      <motion.div
        className="grid gap-4"
        style={gridStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animate first item */}
        <motion.div
          className={`file-item group rounded-2xl p-2 bg-white shadow-[inset_0px_16px_8px_-10px_rgba(0,0,0,0.3)] hover-button link-pointer col-span-2 ${
            group.length != 2 ? "row-span-2" : "row-span-1"
          }`}
          initial={{ scale: group.length === 1 ? 0 : 0 }}
          animate={{ scale: group.length === 1 ? 1 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => handleRemoveFile(groupIndex * 4 + 0)}
            className="absolute hidden group-hover:block top-2 right-2 bg-gray-600 text-white rounded-full p-1 hover:bg-red-600 z-10"
          >
            <FaTimes size={12} />
          </button>
          {
            //now add a cross button or something like to now be able to remove selected files from the array
            renderFileItemContent(group[0], true)
          }
        </motion.div>

        {/* Animate second item if present */}
        {group.length > 1 && (
          <motion.div
            className={`file-item rounded-2xl group p-2 bg-white shadow-[inset_0px_16px_8px_-10px_rgba(0,0,0,0.3)] hover-button link-pointer ${
              group.length != 4 ? "col-span-2" : "col-span-1"
            } row-span-1`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => handleRemoveFile(groupIndex * 4 + 1)}
              className="absolute hidden group-hover:block top-2 right-2 bg-gray-600 text-white rounded-full p-1 hover:bg-red-600 z-10"
            >
              <FaTimes size={12} />
            </button>
            {renderFileItemContent(group[1], true)}
          </motion.div>
        )}
        {group.length > 3 && (
          <motion.div
            className="file-item rounded-2xl p-2 group bg-white shadow-[inset_0px_16px_8px_-10px_rgba(0,0,0,0.3)] hover-button link-pointer col-span-1 row-span-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => handleRemoveFile(groupIndex * 4 + 2)}
              className="absolute hidden group-hover:block top-2 right-2 bg-gray-600 text-white rounded-full p-1 hover:bg-red-600 z-10"
            >
              <FaTimes size={12} />
            </button>
            {renderFileItemContent(group[3], true)}
          </motion.div>
        )}

        {/* Additional items (if any) */}
        {group.length > 2 && (
          <motion.div
            className="file-item rounded-2xl p-2 group bg-white shadow-[inset_0px_16px_8px_-10px_rgba(0,0,0,0.3)] hover-button link-pointer col-span-2 row-span-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => handleRemoveFile(groupIndex * 4 + 3)}
              className="absolute hidden group-hover:block top-2 right-2 bg-gray-600 text-white rounded-full p-1 hover:bg-red-600 z-10"
            >
              <FaTimes size={12} />
            </button>
            {renderFileItemContent(group[2], true)}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const navigate = useNavigate();
  const handleUploadClick = async () => {
    if (capsuleName.trim() === "") {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    } else {
      try {
        setDoing(true);
        const metadata = await uploadFiles(files);
        console.log(metadata);
        const token = await auth.currentUser?.getIdToken(true);
        const userUid = auth.currentUser?.uid;

        if (metadata.chunks.length == 0) {
          setDoing(false);
          console.log("Error uploading capsule: No chunks found");
          return;
        }

        const combinedOpenAt = new Date(
          selectedDate.setHours(
            selectedTime.getHours(),
            selectedTime.getMinutes()
          )
        ).toISOString();

        const requestBody = {
          token: token,
          userUid: userUid,
          capsuleData: {
            capsuleId: metadata.capsuleId,
            capsuleSize: metadata.capsuleSize,
            chunks: metadata.chunks,
            capsuleName: capsuleName,
            capsuleDescription: "",
            openAt: combinedOpenAt,
          },
        };

        let response = await axios.post(
          "https://purple-sea-0407.nostalgianetofficial.workers.dev/addCapsule",
          requestBody
        );
        console.log("Response:", response.data);
        const requestBody2 = {
          token: token,
          userUid: userUid,
          capsuleData: {
            capsuleId: metadata.capsuleId,
            capsuleSize: metadata.capsuleSize,
            capsuleName: capsuleName,
            capsuleDescription: "",
            openAt: combinedOpenAt,
          },
        };
        
        if (publicCapsule)
          response = await axios.post(
            "https://purple-sea-0407.nostalgianetofficial.workers.dev/addPublicCapsule",
            requestBody2
          );

        if (response.data == "200") {
          navigate("/dashboard");
        }
      } catch (error) {
        setDoing(false);
        console.error("Error uploading capsule:", error);
      }
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
      {doing && <BusyPopup></BusyPopup>}
      <div
        className={`bg-black bg-opacity-80 w-11/12 transition-all duration-300 ease-in-out ${
          isExpanded ? "lg:w-[calc(80% + 44rem)]" : "lg:w-4/5"
        } h-[90%] rounded-[40px] flex overflow-hidden relative`}
      >
        {/* Side Navbar */}
        <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col items-center ${
            isExpanded ? "left-64" : "left-20"
          }`}
        >
          <DashHeader isExpanded={isExpanded} />
          <div
            className={`flex flex-col overflow-y-auto h-full align-top transition-all ease-in-out  duration-300 ${
              isExpanded ? "ml-64" : "ml-20"
            } items-center lg:scale-100 `}
          >
            <div
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              className={`relative transition-all ease-in-out duration-500 top-[5%] ${
                isFileSelected ? "w-full" : `w-2/3`
              } min-w-[500px] h-auto `}
            >
              <FilePond
                className="hidden"
                files={files}
                onupdatefiles={(fileItems) => {
                  setFiles(fileItems.map((fileItem) => fileItem.file));
                  setIsFileSelected(fileItems.length > 0);
                }}
                allowMultiple={true}
                maxFiles={10}
                name="files"
                allowFileRename={true}
                fileRenameFunction={(file) => `${file.name}`}
              />

              <img
                src={`/upload bg.png`}
                alt="Background"
                className={`transition-all ease-in-out duration-500 w-full ${
                  isFileSelected ? "hidden" : ""
                }  rounded-lg `}
              />

              {isFileSelected && (
                <>
                  <button
                    onClick={handleScrollLeft}
                    className="absolute bg-white p-2 rounded-full text-[#DDD9D0] text-lg z-20 left-8 top-8 h-[150px]"
                  >
                    <FaAngleLeft></FaAngleLeft>
                  </button>
                  <div
                    ref={scrollContainerRef}
                    className="absolute scroll-smooth inset-0 flex w-[80%] mx-[10%] h-min overflow-x-auto overflow-y-hidden justify-start z-10 py-6 no-scrollbar"
                  >
                    <div className="flex items-center gap-x-4 px-4">
                      {chunkFiles(files, 4).map((group, index) => (
                        <div key={index} className="file-group">
                          {renderFileGroup(group, index)}
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const fileInput = document.querySelector(
                            ".filepond--browser"
                          ) as HTMLInputElement;
                          fileInput?.click();
                        }}
                        className="hover-button link-pointer size-[100px] rounded-2xl bg-white flex justify-center items-center p-2"
                      >
                        <FaPlus className="size-14 text-[#DDD9D0]" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleScrollRight}
                    className="absolute bg-white p-2 rounded-full text-[#DDD9D0] text-lg z-20 right-8 top-8 h-[150px]"
                  >
                    <FaAngleRight></FaAngleRight>
                  </button>
                </>
              )}

              <img
                src={`/grayBg.svg`}
                alt="Background"
                className={`transition-all ease-in-out duration-300 object-cover w-full ${
                  isFileSelected ? "opacity-100 " : `opacity-0 `
                } h-sm: rounded-2xl `}
              />
            </div>

            <div
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              className={`h-auto font-Inter min-w-[400px] h-xl:scale-100  absolute text-center transition-all ease-in-out duration-1000 ${
                !isFileSelected
                  ? "bottom-[25%] scale-75"
                  : "bottom-[0%] scale-[80%] h-md:scale-90 h-xl:bottom-[5%] h-xl:scale-100"
              } 
                rounded-2xl bg-[#D4D4D4] flex flex-col items-center justify-center z-10 `}
            >
              {!isFileSelected ? (
                <div className="p-14 text-center m-10 rounded-3xl border-dashed border-2 border-spacing-4 border-[#616166] flex flex-col items-center justify-center z-10">
                  <p className="text-gray-600 text-lg font-ABeeZee block">
                    Drag and drop files here to upload
                  </p>
                  <button
                    onClick={() => {
                      const fileInput = document.querySelector(
                        ".filepond--browser"
                      ) as HTMLInputElement;
                      fileInput?.click();
                    }}
                    className="px-6 [text-shadow:1px_1px_5px_rgb(0_0_0/_0.4)] py-2 mt-8 font-ABeeZee bg-[#D4D4D4] text-[#616166] drop-shadow-[0_4px_1px_rgb(0_0_0/_0.2)] shadow-[inset_0px_4px_6px_rgb(0_0_0/_0.5)] rounded-2xl"
                  >
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className=" text-center border-4 border-white w-full rounded-2xl bg-white font-Inter flex flex-col items-center justify-center z-10">
                  <div className="flex p-6 gap-2 flex-col w-full items-center">
                    <input
                      type="text"
                      name="capsuleName"
                      value={capsuleName}
                      onChange={(e) => setCapsuleName(e.target.value)}
                      id="capsuleName"
                      className={`bg-transparent text-lg w-2/3 outline-none text-center bg-green-500 mb-1 ${
                        isShaking && "shake-horizontal"
                      }`}
                      placeholder="Capsule Name"
                    />
                    <span className="text-sm text-gray-500">
                      {(totalFileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className=" p-6 w-full rounded-2xl bg-[#DDD9D0]">
                    <div className="flex w-full justify-between gap-9 items-center mb-4 px-4">
                      <div className="flex items-center gap-2">
                        <img src="/openFor.svg" alt="" />
                        <span>Availability: </span>
                      </div>
                      <div className="flex flex-1 gap-4 items-center justify-center">
                        {/* Custom button  */}
                        <div>Private</div>
                        <div
                          onClick={() => {setPublicCapsule(!publicCapsule);}}
                          className="relative link-pointer scale-110 w-10 h-6 overflow-hidden bg-white rounded-full flex items-center"
                        >
                          <span
                            className={`w-5 h-5 bg-black rounded-full transition-transform ${
                              publicCapsule ? "translate-x-5" : "translate-x-0"
                            }`}
                          ></span>
                        </div>
                        <div>Public</div>
                      </div>
                    </div>
                    <div className="flex w-full justify-between gap-6 items-center mb-4 px-4">
                      <div className="flex items-center gap-2">
                        <img src="/unlocksAt.svg" alt="" />
                        <span>Unlocks At: </span>
                      </div>
                      <div className="flex gap-4 items-center justify-center">
                        {/* Custom Date Picker */}
                        <div className="w-auto group rounded-xl transition hover-button hover:bg-black hover:text-white link-pointer gap-2 px-2 bg-white p-2 flex">
                          <img
                            src="/calendar.svg"
                            className="size-6 group-hover:filter group-hover:invert"
                            alt="calendar"
                          />
                          <div className="w-40 relative">
                            <DatePicker
                              selected={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                              dateFormat="MMMM dd, yyyy"
                              className="w-40 bg-transparent outline-none caret-transparent"
                              minDate={new Date()}
                              onKeyDown={(e) => e.preventDefault()} // Disable keyboard input
                            ></DatePicker>
                          </div>
                        </div>

                        {/* Custom Time Picker */}
                        <div className="w-auto group rounded-xl transition hover-button hover:bg-black hover:text-white link-pointer gap-2 px-2 bg-white p-2 flex">
                          <img
                            src="/alarm.svg"
                            className="size-6 group-hover:filter group-hover:invert"
                            alt="clock"
                          />
                          <div className="w-16 relative">
                            <DatePicker
                              selected={selectedTime}
                              onChange={(time) => setSelectedTime(time)}
                              showTimeSelect
                              showTimeSelectOnly
                              minDate={new Date()}
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="HH:mm"
                              className="w-16 outline-none bg-transparent caret-transparent"
                              onKeyDown={(e) => e.preventDefault()}
                              popperPlacement="bottom"
                            ></DatePicker>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleUploadClick}
                      className="my-2 bg-black w-2/3 text-white p-2 rounded-xl hover-button"
                    >
                      Upload This File
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className={` bottom-10 flex-row absolute transition-all duration-1000 ease-in-out  ${
                !isFileSelected ? "hidden" : "opacity-0"
              } hidden h-sm:flex w-2/3 px-10 py-3 rounded-2xl justify-between align-middle bg-[#D4D4D4] items-center`}
            >
              <p className="text-[#616166] text-lg font-ABeeZee">
                Make TimeVaults For Upto 10 Years!
              </p>
              <button className="px-4 py-3 my-1 drop-shadow-[0_2px_1px_rgb(0_0_0/_0.2)] shadow-[inset_0px_2px_6px_rgb(0_0_0/_0.5)]  flex flex-row items-center bg-[#626267] rounded-2xl text-white font-ABeeZee font-thin">
                <MdDiamond className="mr-2 "></MdDiamond> Upgrade To Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadScreen;
