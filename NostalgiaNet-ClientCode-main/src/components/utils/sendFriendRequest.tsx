import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
 
const sendFriendRequest = async (
  friendUid: string, 
  setRequestSent: React.Dispatch<React.SetStateAction<string[]>>
) => {
  try {
    const userUid = auth.currentUser?.uid;
    if (!userUid) return;

    const token = await auth.currentUser?.getIdToken();

    // Check if a friend request has already been sent
    const notificationsRef = collection(db, `users/${friendUid}/notifications`);
    const querySnapshot = await getDocs(
      query(
        notificationsRef,
        where("type", "==", "friendRequest"),
        where("sentBy", "==", userUid)
      )
    );

    // If request is already sent, don't send it again
    if (!querySnapshot.empty) {
      console.log("Friend request already sent.");
      setRequestSent((prev) => [...prev, friendUid]);
      return;
    }

    // Build the request body for sending the friend request
    const requestBody = {
      token,
      userUid,
      friendUid,
    };

    // Send the friend request to your Cloudflare Worker API
    const response = await fetch("https://purple-sea-0407.nostalgianetofficial.workers.dev/sendFriendRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("Friend request sent successfully");
      // Update the local state to reflect that the request has been sent
      setRequestSent((prev) => [...prev, friendUid]);
    } else {
      console.error("Failed to send friend request");
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};

export default sendFriendRequest;
