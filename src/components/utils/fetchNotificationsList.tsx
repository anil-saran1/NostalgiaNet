import {
  collection,
  DocumentData,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import fetchProfiles from "./fetchProfiles";

interface NotificationProp {
  id: string;
  friendUid?: string;
  sender?: string;
  sentAt: string;
  isRead: boolean;
  timestamp: number;
  type: string;
  pfp: string;
  message: string;
  contentId?: string;
  contentTitle?: string;
}

const fetchNotificationsList = async () => {
  const userUid = auth.currentUser?.uid;
  if (!userUid) return [];

  const notificationsRef = collection(db, `users/${userUid}/notifications`);
  const notificationsQuery = query(
    notificationsRef,
    orderBy("timestamp", "desc")
  );

  const notificationsSnap = await getDocs(notificationsQuery);

  const notificationsData: (NotificationProp | null)[] = await Promise.all(
    notificationsSnap.docs.map(async (doc) => {
      const data = doc.data();

      if (data.id) {
        let message = "";
        let userDoc: DocumentData | null = null;
        let pfp = "/default-pfp.png";
        let contentId = "";
        let contentTitle = "";

        switch (data.type) {
          case "friendRequest":
            userDoc = await fetchProfiles(data.sentBy);
            if (!userDoc) {
              message = "You received a friend request.";
            } else {
              message = `Sent you a friend request`;
              pfp = userDoc.pfp || "/default-pfp.png";
            }
            break;

          case "acceptedRequest":
            userDoc = await fetchProfiles(data.sentBy);
            if (!userDoc) {
              message = "Your friend request was accepted.";
            } else {
              message = `You are now friends with`;
              pfp = userDoc.pfp || "/default-pfp.png";
            }
            break;

          case "capsuleCreated":
            message = "You created a new capsule!";
            pfp = "/nn.svg";
            break;

          case "journalInvite":
            userDoc = await fetchProfiles(data.sentBy);
            if (userDoc) {
              pfp = userDoc.pfp || "/default-pfp.png";
              contentId = data.contentId;
              contentTitle = data.contentTitle;
            }
            break;

          case "acceptedInvite":
            userDoc = await fetchProfiles(data.sentBy);
            if (userDoc) {
              pfp = userDoc.pfp || "/default-pfp.png";
              contentId = data.contentId;
              contentTitle = data.contentTitle;
            }
            break;

          default:
            message = "You have a new notification.";
        }

        return {
          id: doc.id,
          friendUid: data.sentBy || "",
          sender: userDoc ? userDoc.name : null,
          pfp: pfp,
          sentAt: data.timestamp || "Unknown",
          isRead: data.isRead || false,
          timestamp: data.timestamp || 0,
          type: data.type || "general",
          message: message,
          contentId: contentId,
          contentTitle: contentTitle,
        };
      } else {
        return null;
      }
    })
  );

  // Filter out null values
  return notificationsData.filter(
    (notification): notification is NotificationProp => notification !== null
  );
};

export default fetchNotificationsList;
