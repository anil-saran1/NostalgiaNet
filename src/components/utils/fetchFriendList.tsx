import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

interface Friend {
  uid: string;
  pfp: string | null;
  name: string | null;
  userName: string | null;
  tier: string | null;
}

interface FetchFriendListProps {
  setLoading: (e: boolean) => void;
}

const fetchFriendList = async ({ setLoading }: FetchFriendListProps): Promise<Friend[] | undefined> => {
  try {
    const userUid = auth.currentUser?.uid;
    if (!userUid) {
      console.error("No userUid found");
      return;
    }

    const friendsRef = collection(db, `users/${userUid}/friends`);
    const friendsSnap = await getDocs(friendsRef);

    if (friendsSnap.empty) {
      console.warn("No friends found for this user.");
      setLoading(false);
      return;
    }

    const friendUids: string[] = [];
    friendsSnap.forEach((doc) => {
      const uid = doc.data().uid;
      if (uid) {
        friendUids.push(uid);
      }
    });

    const friendsData = await Promise.all(
      friendUids.map(async (uid) => {
        try {
          const userRef = doc(db, `users/${uid}`);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const pfp = userData?.pfp || null;
            const name = userData?.name || "Unknown";
            const userName = userData?.username || null; // Assign null if username is missing
            const tier = userData?.tier || "Free";
            return { uid, pfp, userName, name, tier };
          } else {
            console.warn(`No user found for UID: ${uid}`);
            return { uid, userName: null, pfp: null, name: "Unknown", tier: "Free" };
          }
        } catch (error) {
          console.error(`Error fetching user data for UID: ${uid}`, error);
          return { uid, userName: null, pfp: null, name: "Unknown", tier: "Free" };
        }
      })
    );

    setLoading(false);
    return friendsData;
  } catch (error) {
    console.error("Error fetching friends list:", error);
    setLoading(false);
  }
};

export default fetchFriendList;
