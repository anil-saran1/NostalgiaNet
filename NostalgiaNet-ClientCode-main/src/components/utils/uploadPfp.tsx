import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../../firebaseConfig"; // Adjust the imports as necessary
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const uploadPFP = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Store the preview URL
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pfp, setPfp] = useState<string>(""); // Current profile picture

  const userUid = auth.currentUser?.uid;

  if (!userUid) return null;

  useEffect(() => {
    const fetchPFP = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userUid));
        setPfp(userDoc.data()?.pfp || "/user.png"); // Fallback to a default avatar if no PFP
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setPfp("/default-avatar.png");
      }
    };

    fetchPFP();
  }, [userUid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl); // Set the image preview URL
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const storageRef = ref(storage, `profilePictures/${userUid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setError(null);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercentage = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercentage);
      },
      (uploadError) => {
        console.error("Upload failed:", uploadError);
        setError("Upload failed. Please try again.");
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "users", userUid), { pfp: downloadURL });
          setPfp(downloadURL);
          setPreviewUrl(null);
          setUploading(false);
        } catch (err) {
          console.error("Error updating Firestore with PFP URL:", err);
          setError("Failed to update profile picture.");
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={previewUrl || pfp}
            referrerPolicy="no-referrer"
            alt="Profile photo"
            className="size-14 rounded-full border-4 border-white object-cover"
            style={{ width: "70px", height: "70px" }}
          />
        </div>

        {/* Button to Change Profile Photo */}
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="link-pointer bg-gray-200 px-4 py-2 rounded-md border"
        >
          Click to change
        </label>
      </div>

      {/* Show upload progress }
      {uploading && <p>Uploading: {progress}%</p> */}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default uploadPFP;
