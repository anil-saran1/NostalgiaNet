import { auth, db } from "../firebaseConfig"; // Adjust to your actual path for `db`
import {
  collection,
  doc,
  getDocs,
  deleteDoc, 
} from "firebase/firestore";
const TestRequests = () => {
  const sendRequest = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is signed in.");
      return;
    }

    const token = await user.getIdToken(true);
    console.log(token);
 
 
    async function deleteAllCapsules() {
      try {
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        usersSnapshot.forEach(async (userDoc) => {
          const userCapsulesCollectionRef = collection(
            db,
            `users/${userDoc.id}/capsules`
          );
          const capsulesSnapshot = await getDocs(userCapsulesCollectionRef);

          capsulesSnapshot.forEach(async (capsuleDoc) => {
            await deleteDoc(
              doc(db, `users/${userDoc.id}/capsules/${capsuleDoc.id}`)
            );
          });
        });

        console.log("All capsules deleted successfully for each user.");
      } catch (error) {
        console.error("Error deleting capsules:", error);
      }
    }
    await deleteAllCapsules();
  };

  return (
    <div>
      <button onClick={sendRequest} className="bg-white">Send Request</button>
    </div>
  );
};

export default TestRequests;
