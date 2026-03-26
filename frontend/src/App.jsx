import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import SavedNews from "./Pages/SavedNews"; // 1. Import your new page
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  const location = useLocation();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    }
  }, [location]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Protected Route Logic
  if (!userName && !isAuthPage) {
    return <Navigate to="/login" />;
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // ... keep imports the same ...

  return (
    <div style={{ display: "flex", background: "#0F172A", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column" }}>
        
        <Navbar userName={userName ? userName.split(" ")[0] : "User"} />

        <main style={{ padding: "20px" }}>
          <Routes>
            {/* Dashboard / Welcome Page */}
            <Route path="/" element={<Dashboard userName={userName ? userName.split(" ")[0] : "User"} />} />
            
            {/* News Feed Page - FIXED CASE SENSITIVITY (Home, not home) */}
            <Route path="/home" element={<Home />} />
            
            {/* Saved News Page */}
            <Route path="/saved" element={<SavedNews />} />

            <Route path="/category/Technology" element={<Navigate to="/Home?category=technology " />} />

            {/* Redirect any unknown routes to / */}
            <Route path="*" element={<Navigate to="/Home " />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
