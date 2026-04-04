import { ref, set } from "firebase/database";
import { uniqueId } from "lodash";
import { database } from "../../firebaseConfig";

async function addNewJournalEntry(journalId: string, entryData: any) {
  try {
    // Generate a new entry ID, e.g., using a timestamp or UUID.
    const entryId = uniqueId(); // Assuming generateUniqueId is defined elsewhere

    // Reference to the new entry
    const newEntryRef = ref(database, `journals/${journalId}/entries/${entryId}`);

    // Set data for the new entry
    await set(newEntryRef, entryData);
    console.log("Successfully added a new journal entry.");
  } catch (error) {
    console.error("Error adding new journal entry to Realtime Database:", error);
  }
}

export default addNewJournalEntry;

addNewJournalEntry("exampleJournalId", {
  title: "New Journal Entry",
  content: "This is the content of the new entry.",
  createdAt: new Date().toISOString(),
});
