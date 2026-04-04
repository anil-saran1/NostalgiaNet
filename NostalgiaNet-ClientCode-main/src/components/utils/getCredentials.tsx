import { auth } from "../../firebaseConfig";

const getToken = async () => {

    const user = auth.currentUser;

    if (!user) {
        console.error("No user is signed in.");
        return;
      }
  
      const token = await user.getIdToken(true);
    return token;
}


export default getToken;