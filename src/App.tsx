import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/DashPage";
import Auth from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import CapsulePage from "./pages/CapsulePage";
import UploadScreen from "./pages/UploadScreen";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useLayoutEffect } from "react";
import JournalPage from "./pages/JournalPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfile";
import LoadingAnimation from "./components/utils/loadingAnimation";
import UserPage from "./pages/UserPage";
import JournalBook from "./pages/JournalBook";
import JournalEdit from "./pages/JournalEdit";
import Layout from "./Layout";
import ComingSoon from "./pages/ComingSoon";
import MyTimevaults from "./pages/myTimevaults";

const App = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileResolution, setIsMobileResolution] = useState(window.innerWidth < 600); // Set initial state directly

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobileResolution(window.innerWidth < 600);
    };
 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isMobileResolution) {
    return <ComingSoon />;
  }

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/capsulepage" element={currentUser ? <CapsulePage /> : <Navigate to="/" />} />
          <Route path="/uploadpage" element={currentUser ? <UploadScreen /> : <Navigate to="/" />} />
          <Route path="/journal" element={currentUser ? <JournalPage /> : <Navigate to="/" />} />
          <Route path="/journal/:journalId" element={currentUser ? <JournalBook /> : <Navigate to="/" />} />
          <Route path="/journal/:journalId/:pgNo" element={currentUser ? <JournalBook /> : <Navigate to="/" />} />
          <Route path="/journal/:journalId/edit" element={currentUser ? <JournalEdit /> : <Navigate to="/" />} />
          <Route path="/user/:uid" element={currentUser ? <UserPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/editProfile" element={currentUser ? <EditProfilePage /> : <Navigate to="/" />} />
          <Route path="/allCapsules" element={<MyTimevaults />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
