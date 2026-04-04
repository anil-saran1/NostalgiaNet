import { auth } from "../../firebaseConfig";

const removeFriend = async (friendUid: string, setIsFriend: (value: boolean) => void) => {
  try {
    const userUid = auth.currentUser?.uid;
    if (!userUid) return;

    const token = await auth.currentUser?.getIdToken();

    const requestBody = {
      token,
      userUid,
      friendUid,
    };

    const response = await fetch("https://purple-sea-0407.nostalgianetofficial.workers.dev/removeFriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("Friend removed successfully");
      setIsFriend(false);  
    } else {
      console.error("Failed to remove friend");
    }
  } catch (error) {
    console.error("Error removing friend:", error);
  }
};

export default removeFriend;
