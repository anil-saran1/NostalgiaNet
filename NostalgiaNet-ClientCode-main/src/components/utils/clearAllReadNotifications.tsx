import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const clearAllReadNotifications = async (userUid: string) => {
  try {
    const notificationsRef = collection(db, `users/${userUid}/notifications`);
    
    // Query to get all read notifications
    const readNotificationsQuery = query(notificationsRef, where("isRead", "==", true));
    const readNotificationsSnap = await getDocs(readNotificationsQuery);

    // Delete each read notification
    const deletePromises = readNotificationsSnap.docs.map((doc) =>
      deleteDoc(doc.ref)
    );

    await Promise.all(deletePromises);
    console.log("All read notifications have been cleared.");
  } catch (error) {
    console.error("Error clearing read notifications:", error);
    throw new Error("Failed to clear read notifications");
  }
};

export default clearAllReadNotifications;
