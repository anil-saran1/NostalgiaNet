import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import readJournalEntries from "./readJournalEntries";

interface JournalProp {
  id: string;
  title: string;
  role: string;
  createdAt: string;
  description: string;
  theme: 1 | 2 | 3;
}

const fetchJournalsList = async (): Promise<JournalProp[] | null> => {
  const userUid = auth.currentUser?.uid;
  try {
    const journalsRef = collection(db, `users/${userUid}/journals`);
    const journalsSnap = await getDocs(journalsRef);
  
    const journalPromises = journalsSnap.docs.map(async (doc) => {
      const journalId = doc.data().journalId;
      const journalData = await readJournalEntries(journalId);
  
      if (!journalData) return null;
  
      return {
        id: journalId,
        title: journalData.title,
        description: journalData.description,
        theme: journalData.theme,
        createdAt: journalData.createdAt,
        role: doc.data().role,
        editors: journalData.editors
      };
    });
   
    const journalsData = await Promise.all(journalPromises);
   
    return journalsData.filter(journal => journal !== null) as JournalProp[];
  
  } catch (error) {
    console.error("Error fetching journals: ", error);
    return null;
  }
};

export default fetchJournalsList;
