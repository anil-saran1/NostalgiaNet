import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'

const markNotificationAsRead = async (userId: string ,notificationId: string) => {
    
    const notificationRef = doc(db, "users", userId, "notifications", notificationId);
    await updateDoc(notificationRef, { isRead: true });
    
}

export default markNotificationAsRead