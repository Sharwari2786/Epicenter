import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer"; // Ensure this path is correct
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import SavedNews from "./Pages/SavedNews";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  const location = useLocation();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  // Update userName whenever the location changes (after login/logout)
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    } else {
      setUserName("");
    }
  }, [location]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // 1. Authorization Guard: If not logged in and not on an auth page, go to login
  if (!userName && !isAuthPage) {
    return <Navigate to="/login" />;
  }

  // 2. Auth Layout (Login/Register with the Amazon Prime background)
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // 3. Main Application Layout (Dashboard, Home, Saved)
  return (
    <div style={{ display: "flex", background: "#0F172A", minHeight: "100vh" }}>
      {/* Sidebar stays fixed at 240px */}
      <Sidebar />
      
      {/* Main Content Wrapper */}
      <div style={{ 
        marginLeft: "240px", 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        minHeight: "100vh" 
      }}>
        
        {/* Top Navigation */}
        <Navbar userName={userName ? userName.split(" ")[0] : "User"} />

        {/* Main Routing Area - flex: 1 pushes footer to the bottom */}
        <main style={{ padding: "20px", flex: 1 }}>
          <Routes>
            {/* Dashboard / Welcome Page */}
            <Route path="/" element={<Dashboard userName={userName ? userName.split(" ")[0] : "User"} />} />
            
            {/* News Feed Page */}
            <Route path="/home" element={<Home />} />
            
            {/* Saved News Page */}
            <Route path="/saved" element={<SavedNews />} />

            {/* Category Redirects */}
            <Route path="/category/Technology" element={<Navigate to="/home?category=technology" />} />

            {/* Global Redirect for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* 4. The Glassmorphism Footer */}
        <Footer /> 
      </div>
    </div>
  );
}

export default App;