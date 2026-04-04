import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
 
interface FetchEditorListProps {
  setLoading: (e: boolean) => void;
  editors: any[];
}

const fetchEditorsList = async ({ setLoading, editors }: FetchEditorListProps) => {
  try {
    const userUid = auth.currentUser?.uid;
    if (!userUid) {
      console.error("No userUid found");
      return;
    }

    if (!editors) {
      console.warn("No editors found for this user.");
      setLoading(false);
      return;
    }

    const editorUids: string[] = [];
    editors.forEach((editor) => {
      const uid = editor.userUid;
      if (uid) {
        editorUids.push(uid);
      }
    });

    const editorsData = await Promise.all(
        editorUids.map(async (uid) => {
        try {
          const userRef = doc(db, `users/${uid}`);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const pfp = userData?.pfp || null;
            const name = userData?.name || "Unknown";
            const userName = userData?.username || null;  
            const tier = userData?.tier || "Free";
            return { uid, pfp, userName, name, tier };
          } else {
            console.warn(`No user found for UID: ${uid}`);
            return {
              uid,
              userName: null,
              pfp: null,
              name: "Unknown",
              tier: "Free",
            };
          }
        } catch (error) {
          console.error(`Error fetching user data for UID: ${uid}`, error);
          return {
            uid,
            userName: null,
            pfp: null,
            name: "Unknown",
            tier: "Free",
          };
        }
      })
    );

    setLoading(false);
    return editorsData;
  } catch (error) {
    console.error("Error fetching editors list:", error);
    setLoading(false);
  }
};

export default fetchEditorsList;
