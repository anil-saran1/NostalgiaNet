import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import axios from "axios";

const handleActionNotification = async (notif: any, action: string) => {
  const userUid = auth.currentUser?.uid;
  if (!userUid) return null;

  const notificationRef = doc(
    db,
    "users",
    userUid,
    "notifications",
    notif.id
  );

  if (action === "accept") {
    if (notif.type === "friendRequest") { 
      await updateDoc(notificationRef, {
        isRead: true,
        type: "acceptedRequest", 
        timestamp: Date.now(), 
      });
      const token = await auth.currentUser?.getIdToken(true); 
      try {
        await axios.post(
          'https://purple-sea-0407.nostalgianetofficial.workers.dev/acceptRequest',
          {
            userUid, 
            friendUid: notif.friendUid, 
            token: token
          }
        );
      } catch (error) {
        console.error("Error sending accepted request to server:", error);
      }
    } else if(notif.type === "journalInvite") { 
      await updateDoc(notificationRef, {
        isRead: true,
        type: "acceptedInvite",
        timestamp: Date.now(),
      });
      const token = await auth.currentUser?.getIdToken(true); 
      try {
        await axios.post(
          'https://purple-sea-0407.nostalgianetofficial.workers.dev/acceptInvite',
          {
            userUid, 
            contentId: notif.contentId, 
            token: token
          }
        );
      } catch (error) {
        console.error("Error sending accepted request to server:", error);
      }
    }
  } else if (action === "decline") { 
    await deleteDoc(notificationRef);
  }
};

export default handleActionNotification;
