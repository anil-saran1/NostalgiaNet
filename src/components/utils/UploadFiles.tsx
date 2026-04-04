import axios, { AxiosProgressEvent } from "axios";
import JSZip from "jszip";
import { nanoid } from "nanoid";

const TELEGRAM_BOT_TOKEN = '7343034283:AAGa2Cw8hjDYMMxyHuDJCvlYuSBSn2RzlgU';
const TELEGRAM_CHAT_ID = '-4268436727';
const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB

interface Capsule {
  capsuleId: string;
  capsuleSize: number;
  chunks: Array<{ partNumber: number; fileId: string }>;
}
 
export const uploadFiles = async (files: File[]) => {
  const zip = new JSZip();

  // Add files to zip
  files.forEach((file) => {
    zip.file(file.name, file);
  });

  // Generate zip blob
  const zipBlob = await zip.generateAsync({ type: "blob" });
  console.log("Zip file generated successfully");
  const newName = nanoid();
  const file = new File([zipBlob], `${newName}`, { type: 'application/zip' });
  const fileIds = await uploadInChunks(file);
  console.log("All chunks uploaded successfully");
  // Create capsule data with chunks and file size
  const capsuleData: Capsule = {
    capsuleId: newName,
    capsuleSize: file.size,
    chunks: fileIds,
  };

  return capsuleData;
};

// Function to upload file in chunks
const uploadInChunks = async (file: File) => {
  const fileIDs = [];
  const parts = Math.ceil(file.size / CHUNK_SIZE);

  for (let index = 0; index < parts; index++) {
    const start = index * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);
    console.log(`Uploading chunk ${index + 1} of ${parts}`);
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', chunk, `${file.name}_${index + 1}`);

    try {
      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => { // Use proper Axios type
          if (progressEvent.event.target) {
            const loaded = progressEvent.loaded || 0;
            const total = progressEvent.total || file.size;
            const uploadedSize = start + loaded;
            const progress = (uploadedSize / file.size) * 100;
            
            console.log(
              `Progress: ${progress.toFixed(2)}% ` +
              `(${(uploadedSize / 1e6).toFixed(2)} MB of ` + 
              `${(file.size / 1e6).toFixed(2)} MB)`
            );
          }
        }
      };

      const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, config);
      fileIDs.push({ partNumber: index + 1, fileId: response.data.result.document.file_id });
      console.log(`File index ${index + 1} uploaded successfully`);
    } catch (err) {
      console.error(`Error uploading chunk ${index + 1}:`, err);
    }
  }

  return fileIDs;
};