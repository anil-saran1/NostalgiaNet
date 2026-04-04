import { db } from '../../firebaseConfig';
import { doc, getDoc, DocumentData } from "firebase/firestore";

const fetchProfiles = async (uid: string): Promise<DocumentData | null> => {
    try {
        const userDocSnap = await getDoc(doc(db, "users", uid));
        if (userDocSnap.exists()) {
            const userDoc = userDocSnap.data();
            return userDoc as DocumentData;
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export default fetchProfiles;
