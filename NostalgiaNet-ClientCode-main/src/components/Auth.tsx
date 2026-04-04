import nnUrl from "../assets/NN.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { DocumentData } from "firebase/firestore/lite";
import BusyPopup from "./utils/busyPopup";

const Auth = () => {
  const [isSignInActive, setIsSignInActive] = useState(true);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [doing, setDoing] = useState(false);

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = signInData;
    try {
      setDoing(true)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;
      const token = await user.getIdToken(true);
      localStorage.clear();
      localStorage.setItem("authToken", token);

      const userDocSnap = await getDoc(doc(db, "users", user.uid));

      if (userDocSnap.exists()) {
        const userDoc = userDocSnap.data() as DocumentData;

        localStorage.setItem("pfp", userDoc.pfp);
        localStorage.setItem("name", userDoc.name);
        localStorage.setItem("userUid", uid);

        navigate("/dashboard", { state: { userDoc } });
      } else {
        console.log("No such user data!");
      }
    } catch (error) {
      setDoing(false);
      console.error("Error signing in:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = signUpData;
    try {
      setDoing(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);

      const uid = user.uid;

      const userDoc = {
        uid,
        name,
        email,
        pfp: "/user.png",
        tier: "free",
        storageLeft: 2048,
        createdAt: new Date(),
        username: uid
      };  
      await setDoc(doc(db, "users", uid), userDoc);

      localStorage.setItem("name", userDoc.name);
      localStorage.setItem("userUid", uid);

      await setDoc(doc(db, `users/${uid}/friends`, "dummyDoc"), {});
      await setDoc(doc(db, `users/${uid}/requests`, "dummyDoc"), {});
      await setDoc(doc(db, `users/${uid}/capsules`, "dummyDoc"), {});
      await setDoc(doc(db, `users/${uid}/journals`, "dummyDoc"), {});

      console.log("User signed up and data saved in Firestore");
      navigate("/dashboard", { state: { userDoc } });
    } catch (error) {
      setDoing(false);
      console.error("Error signing up:", error);
    }
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setDoing(true);
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const uid = user.uid;

      const userDocSnap = await getDoc(doc(db, "users", uid));
      var userDoc;
      if (!userDocSnap.exists()) { 
        userDoc = {
          uid,
          name: user.displayName,
          email: user.email,
          pfp: user.photoURL,
          tier: "free",
          storageLeft: 2048,
          createdAt: new Date(),
          username: uid
        };

        console.log(localStorage.getItem("pfp"));

        await setDoc(doc(db, "users", uid), userDoc);
        await setDoc(doc(db, `users/${uid}/friends`, "dummyDoc"), {});
        await setDoc(doc(db, `users/${uid}/requests`, "dummyDoc"), {});
        await setDoc(doc(db, `users/${uid}/capsules`, "dummyDoc"), {});
        await setDoc(doc(db, `users/${uid}/journals`, "dummyDoc"), {});
      }

      userDoc = userDocSnap.exists() ? userDocSnap.data() : userDoc;

      console.log(userDoc);

      localStorage.setItem("userUid", uid);
      localStorage.setItem("pfp", userDoc ? userDoc.pfp : "/user.png");

      localStorage.setItem("name", userDoc?.name);

      navigate("/dashboard", { state: { userDoc } });
    } catch (error) {
      setDoing(false);
      console.error("Error signing in with Google:", error);
    }
  };

  const toggleOverlay = () => {
    setIsSignInActive(!isSignInActive);
  };

  const navigate = useNavigate();
  return (
    <div className="w-full max-w-6xl h-auto rounded-lg shadow-lg">
      {doing && <BusyPopup></BusyPopup>}
      <div className="grid grid-cols-2  relative">
        {/* Sign Up part */}
        <div
          className={`flex flex-col items-center rounded-lg transition-all duration-500 p-6 ${
            isSignInActive
              ? "transform opacity-100 translate-x-0 z-10"
              : "transform opacity-0 translate-x-full z-[-5]"
          }`}
        >
          <img src={nnUrl} alt="" className="w-2/5" />
          <h1 className=" text-white font-ABeeZee text-4xl my-6">
            Create an account.
          </h1>
          <form onSubmit={handleSignUp} className="w-full max-w-sm my-12">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleSignUpChange}
              className="w-full mb-4 p-2 font-ABeeZee rounded-full text-sm bg-[#D9D9D9] text-slate-600 shadow-md text-center"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleSignUpChange}
              className="w-full mb-4 p-2 font-ABeeZee rounded-full text-sm bg-[#D9D9D9] text-slate-600 shadow-md text-center"
            />
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleSignUpChange}
              className="w-full mb-4 p-2 font-ABeeZee rounded-full text-sm bg-[#D9D9D9] text-slate-600 shadow-md text-center"
            />
            <button className="w-full block font-ABeeZee mx-auto mt-5 p-2 text-white rounded-full bg-slate-600">
              Sign Up
            </button>
            <div className="font-ABeeZee text-sm my-2 text-white">Or</div>
            <div
              className="w-full flex flex-row items-center justify-center gap-4 font-ABeeZee link-pointer text-[#D9D9D9] text-center mx-auto p-2 rounded-full bg-black"
              onClick={handleGoogleLogin}
            >
              <img src="/google.svg" className="size-8" alt="" />
              Continue with Google
            </div>
            <div className="flex flex-row justify-center">
              {" "}
              <p className="text-white font-ABeeZee text-sm m-4">
                Already have an account?
              </p>{" "}
              <p
                onClick={toggleOverlay}
                className="text-[#797B82] link-pointer font-ABeeZee text-sm my-4"
              >
                {" "}
                Sign in
              </p>
            </div>
          </form>
        </div>

        {/* Sign In part */}
        <div
          className={`flex flex-col items-center rounded-lg transition-all duration-500 p-6 ${
            isSignInActive
              ? "transform opacity-0 translate-x-[-100%] z-[-10]"
              : "transform opacity-100 translate-x-0 z-10"
          }`}
        >
          <img src={nnUrl} alt="" className="w-2/5" />
          <h1 className="text-white font-ABeeZee text-4xl my-6">
            welcome back!
          </h1>
          <form onSubmit={handleSignIn} className="w-full max-w-sm my-12">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleSignInChange}
              className="w-full mb-4 p-2 font-ABeeZee rounded-full text-sm bg-[#D9D9D9] text-slate-600 shadow-md text-center"
            />
            <input
              type="password"
              name="password"
              placeholder="At least 8 characters"
              onChange={handleSignInChange}
              className="w-full mb-4 p-2 font-ABeeZee bg-[#D9D9D9]  text-sm rounded-full text-slate-600 text-center"
            />
            <p className="text-[#797B82] link-pointer font-ABeeZee text-sm mb-4 w-full text-right">
              Forgot your password?
            </p>
            <button className="w-full block font-ABeeZee mx-auto p-2 text-white rounded-full bg-slate-600">
              Login
            </button>
            <div className="font-ABeeZee text-sm my-2 text-white">Or</div>
            <div
              className="w-full flex flex-row items-center justify-center gap-4 font-ABeeZee link-pointer text-[#D9D9D9] text-center mx-auto p-2 rounded-full bg-black"
              onClick={handleGoogleLogin}
            >
              <img src="/google.svg" className="size-8" alt="" />
              Continue with Google
            </div>
            <div className="flex flex-row justify-center">
              <p className="text-white font-ABeeZee text-sm m-4">
                Don't have an account?
              </p>
              <p
                onClick={toggleOverlay}
                className="text-[#797B82] link-pointer font-ABeeZee text-sm my-4"
              >
                Sign up
              </p>
            </div>
          </form>
        </div>

        {/* Overlay part*/}
        <div
          className={`absolute h-full w-[50%] z-[15] bg-[#2E2E2E] rounded-[40px] transition-all duration-500 p-2 ${
            isSignInActive
              ? "transform translate-x-full"
              : "transform translate-x-0"
          }`}
        >
          <img
            src="/authmover.svg"
            className="w-full h-full object-cover rounded-[40px]"
            alt=""
          />
        </div>
      </div>
      {/* Back button */}
      <div className="absolute top-6 left-6 flex space-x-4">
        <button
          onClick={() => navigate("/")}
          className="text-white bg-slate-600 hover:bg-slate-900 p-2 rounded-full z-20"
        >
          <IoIosArrowBack />
        </button>
      </div>
    </div>
  );
};

export default Auth;
