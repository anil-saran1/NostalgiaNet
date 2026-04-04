import { collection, getDocs, Timestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

interface VaultProp {
  id: string;
  createdAt: number;
  size: number;
  name: string;
  openAt: number;
}

const fetchCapsulesList = async (): Promise<VaultProp[]> => {
  const userUid = auth.currentUser?.uid;
  const capsulesRef = collection(db, `users/${userUid}/capsules`);
  const capsulesSnap = await getDocs(capsulesRef);

  const capsulesData: VaultProp[] = [];
  capsulesSnap.forEach((doc) => {
    const data = doc.data();

    if (data.id) {
      // Use helper function to convert timestamps
      const createdAt = convertToMillis(data.createdAt);
      const openAt = convertToMillis(data.openAt);

      capsulesData.push({
        id: doc.id,
        createdAt,
        size: data.size || 0,
        name: data.name || "",
        openAt,
      });
    }
  });
  return capsulesData;
};

export default fetchCapsulesList;
 
const convertToMillis = (timestamp: any): number => {
  if (!timestamp) return 0;
  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis();
  }
  if (typeof timestamp === "string" || typeof timestamp === "number") {
    return new Date(timestamp).getTime();
  }
  return 0;
};
