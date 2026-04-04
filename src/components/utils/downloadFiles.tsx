import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const TELEGRAM_BOT_TOKEN = "7343034283:AAGa2Cw8hjDYMMxyHuDJCvlYuSBSn2RzlgU";

interface Capsule {
  id: string;
  chunks: Array<{ partNumber: number; fileId: string }>;
}
export const downloadFiles = async (capsuleId: string) => {
  try {
    const capsuleRef = doc(db, `capsules/${capsuleId}`);
    const capsuleDoc = await getDoc(capsuleRef);
    const capsuleData = capsuleDoc.data() as Capsule;

    const chunks = capsuleData.chunks;
    const response = await axios.post(
      `https://file-fetcher.vercel.app/retrieve`,
      { chunks },
      {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: 'blob',
      }
    );

    const combinedBlob = response.data;
    return combinedBlob;
  } catch (error) {
    console.error("Error downloading files:", error);
    throw error;
  }
};
