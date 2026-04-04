import { ref, get } from "firebase/database";
import { database } from "../../firebaseConfig";
import { auth } from "../../firebaseConfig"; // Assuming you have an auth setup to access the current user
 

async function readJournalEntries(journalId: string) {
  try {
    const journalRef = ref(database, `journals/${journalId}`);
    const snapshot = await get(journalRef);

    if (snapshot.exists()) {
      const journalData = snapshot.val();

      // Extracting all journal data fields
      const title = journalData.title || "Untitled Journal";
      const createdAt = journalData.createdAt || new Date().toISOString();
      const entriesObj = journalData.entries || {};
      const description = journalData.description || "";
      const theme = journalData.theme || 1;
      const editors = journalData.editors || [];

      // Transform entries object into an array
      const entries = Object.keys(entriesObj).map((key) => ({
        name: entriesObj[key].name || "Untitled",
        content: entriesObj[key].content || "",
        createdAt: entriesObj[key].createdAt || createdAt,
        image: entriesObj[key].image || "",
      }));

      // Check if the current user is an editor
      const currentUser = auth.currentUser;
      const isEditor = editors.some((editor: { userUid: string | undefined; }) => editor.userUid === currentUser?.uid);

      if (!isEditor) {
        console.log("Current user does not have access to this journal.");
        return null; // Returning null or an error could be handled in the calling function
      }

      // Return all journal data
      return {
        title,
        createdAt,
        journalId,
        entries,
        description,
        theme,
        editors,
      };
    } else {
      console.log("No data available for this journal.");
      return null;
    }
  } catch (error) {
    console.error("Error reading journal from Realtime Database:", error);
    return null;
  }
}

export default readJournalEntries;
