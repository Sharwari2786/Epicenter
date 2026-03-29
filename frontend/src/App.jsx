import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer"; 
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import SavedNews from "./Pages/SavedNews";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  const location = useLocation();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  // --- THE FIX: Reactive State for Layout ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    // Initial check to prevent the "Ghost Gap" on first load
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    setUserName(savedName || "");
  }, [location]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (!userName && !isAuthPage) return <Navigate to="/login" />;

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: "flex", background: "#0F172A", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Sidebar handles its own sliding logic */}
      <Sidebar />
      
      {/* Main Content Wrapper */}
      <div style={{ 
        // Syncing the margin with the state
        marginLeft: isMobile ? "0" : "260px", 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
      }}>
        
        <Navbar userName={userName ? userName.split(" ")[0] : "User"} />

        <main style={{ padding: isMobile ? "10px" : "20px", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard userName={userName ? userName.split(" ")[0] : "User"} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/saved" element={<SavedNews />} />
            <Route path="/category/Technology" element={<Navigate to="/home?category=technology" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer /> 
      </div>
    </div>
  );
}

export default App;