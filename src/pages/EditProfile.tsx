import React, { useEffect, useState } from "react";
import SideNavbar from "../components/SideNavbar";
import DashHeader from "../components/DashHeader";
import "../App.css";
import bgImage from "../assets/bgp.jpg";
import { auth, db, storage } from "../firebaseConfig";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../components/utils/loadingAnimation";
import { FaCheck, FaTimes } from "react-icons/fa";

const EditProfilePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null); // For profile picture upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For image preview
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);

  const userUid = auth.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      if (!userUid) return;
      try {
        const userDocSnap = await getDoc(doc(db, "users", userUid));
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setData(userData);
          setName(userData.name || "");
          setNote(userData.note || ""); // Set the initial note value
          setUsername(userData.username || "");
          setPreviewUrl(userData.pfp || "/user.png"); // Set the current PFP
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [userUid]);

  const toggleSidebar = (e: boolean) => {
    setIsExpanded(e);
  };

  // Handle file change for profile picture and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl); // Set preview URL for the selected image
    }
  };

  // Check if the username is available
  const checkUsernameAvailability = async (newUsername: string) => {
    if (newUsername === data.username) {
      setIsUsernameAvailable(true); // The username is the same as the current one
      return;
    }

    const usernameRef = doc(db, "usernames", newUsername);
    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
      setIsUsernameAvailable(false); // Username already exists
    } else {
      setIsUsernameAvailable(true); // Username is available
    }
  };

  const handleConfirm = async () => {
    try {
      if (!userUid) return;

      // Fetch the current user's data
      const userRef = doc(db, "users", userUid);
      const userSnap = await getDoc(userRef);
      const currentUsername = userSnap.data()?.username; // Get the current username

      if (currentUsername && currentUsername !== username) {
        // Delete the old username from the 'usernames' collection
        await deleteDoc(doc(db, "usernames", currentUsername)); // Set uid to null to flag the entry as no longer in use
      }

      // Update the user's username, name, and note in the 'users' collection
      await updateDoc(userRef, {
        username,
        name,
        note, // Update note in Firestore
      });

      // Update the new username in the 'usernames' collection
      const newUsernameRef = doc(db, "usernames", username);
      await setDoc(newUsernameRef, { uid: userUid });

      // Handle profile picture upload if a new file is selected
      if (file) {
        const storageRef = ref(
          storage,
          `profilePictures/${userUid}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploading(true);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progressPercentage = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progressPercentage);
          },
          (error) => {
            console.error("Error uploading file:", error);
            setUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Update Firestore with the new profile picture URL
            await updateDoc(userRef, { pfp: downloadURL });
            setUploading(false);
            setPreviewUrl(downloadURL); // Set the new profile picture URL
          }
        );
      }

      alert("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle username input change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    checkUsernameAvailability(newUsername); // Check if the new username is available
  };

  if (loading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  if (!userUid || !data) {
    return <div>No user data available.</div>;
  }

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
              className={`flex-1 transition-all ease-in-out duration-300  ${
                isExpanded ? "ml-64" : "ml-20"
              }`}
            >
              {uploading ? (
                <LoadingAnimation></LoadingAnimation>
              ) : (
                <div
                  className={`flex-1 h-full flex justify-center items-center`}
                >
                  <div className="h-[90%] overflow-y-auto max-h-[600px] min-w-[400px] w-[30%] bg-[#F3F3F3] border-4 border-white rounded-3xl">
                    <div className="bg-[#D9D9D9] border-b-4 border-white h-[15%] h-md:h-1/5 rounded-t-3xl"></div>
                    <div className="px-6 relative -top-14 flex flex-col gap-3">
                      <div className="h-24 h-md:h-28">
                        <img
                          src={data.pfp}
                          referrerPolicy="no-referrer"
                          alt=""
                          className="size-24 h-md:size-28 rounded-full object-cover border-[4px] border-white"
                        />
                        <img
                          src={`/${data.tier}Tier.svg`}
                          alt=""
                          className="absolute top-16 size-6 h-md:top-20 left-[5.7rem] h-md:left-[6.5rem]"
                        />
                      </div>
                      <div className="flex-col flex gap-2">
                        <div className="text-left justify-between flex flex-row font-Inter font-semibold text-2xl">
                          {data.name}
                        </div>
                      </div>

                      <hr />

                      {/* Name and Username Input */}
                      <div className="flex-col flex font-Inter gap-2 text-sm">
                        <div className="flex flex-row justify-between items-center text-left">
                          <label className="font-semibold w-1/4">Name</label>
                          <div className="w-4/5 gap-2 flex flex-row">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="border border-gray-300 rounded-md p-2 w-full"
                              placeholder="Name"
                            />
                          </div>
                        </div>

                        <div className="flex flex-row justify-between items-center text-left">
                          <label className="font-semibold w-1/4">Email</label>
                          <div className="border flex-row flex gap-3 items-center border-gray-300 bg-white cursor-not-allowed rounded-md p-2 w-4/5">
                            <img src="/email.svg" alt="" className="size-6" />
                            {data.email}
                          </div>
                        </div>

                        <div className="flex flex-row justify-between items-center text-left">
                          <label className="font-semibold w-1/4">UserID</label>
                          <div className="flex items-center w-4/5">
                            <input
                              type="text"
                              value={username}
                              onChange={handleUsernameChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                              placeholder="UserID"
                            />
                            {/* Check/ Cross Mark */}
                            {isUsernameAvailable === true && (
                              <FaCheck className="text-green-500 ml-2" />
                            )}
                            {isUsernameAvailable === false && (
                              <FaTimes className="text-red-500 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                              <hr />
                      {/* Profile Photo Selection */}
                      <div className="flex flex-row justify-between items-center text-left">
                        <label className="font-semibold w-1/4">
                          Profile photo
                        </label>
                        <div className="flex items-center gap-4 w-4/5">
                          <div className="relative">
                            <img
                              src={previewUrl || "/user.png"}
                              referrerPolicy="no-referrer" // Show the preview image or the current pfp
                              alt="Profile photo"
                              className="size-16 h-md:size-20 rounded-full border-[4px] border-white object-cover"
                            />
                          </div>

                          {/* Hidden File Input */}
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-input"
                          />
                          <label
                            htmlFor="file-input"
                            className="link-pointer font-Inter font-semibold text-sm bg-[#CACACA] px-4 py-2 rounded-md border"
                          >
                            Click to change
                          </label>
                        </div>
                      </div>

                      <hr />
                      {/* Note Textarea */}
                      <div className="flex flex-row justify-between items-center text-left">
                        <label className="font-semibold w-1/4">Note</label>
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-4/5"
                          placeholder="Write something..."
                        />
                      </div>
                      <hr />
                      {/* Confirm Button */}
                      <div className="flex font-Inter my-auto text-sm justify-end gap-4">
                        <button
                          className="text-black border-2 border-[#CACACA] bg-white px-4 py-2 rounded-md"
                          onClick={() => navigate("/profile")}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-black text-white px-4 py-2 rounded-md"
                          onClick={handleConfirm}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
          <SideNavbar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
