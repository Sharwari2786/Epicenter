import { Bell, Search, UserCircle, LogOut, Hexagon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ userName }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const firstName = userName ? userName.split(" ")[0] : "Explorer";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/home?q=${query}`);
    }
  };

  const transitionStyle = { transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" };

  return (
    <nav style={{
      height: "72px",
      background: "rgba(15, 23, 42, 0.9)", 
      backdropFilter: "blur(16px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      // FIX: Add padding-left on mobile for the Hamburger icon (approx 60px)
      padding: isMobile ? "0 15px 0 60px" : "0 40px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "2.5px solid rgba(69, 196, 250, 0.1)",
    }}>
      
      {/* 1. BRAND LOGO - Only show on Desktop to save mobile space */}
      {!isMobile && (
        <Link 
          to="/" 
          style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", ...transitionStyle }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
        >
          <Hexagon size={24} color="#38BDF8" fill="#38BDF8" style={{ filter: "drop-shadow(0 0 8px #38BDF860)" }} />
          <span style={{ fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-1px" }}>
            <span style={{ color: "#38BDF8" }}>EPI</span>
            <span style={{ color: "white" }}>CENTER</span>
          </span>
        </Link>
      )}

      {/* 2. RIGHT SIDE CONTAINER */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: isMobile ? "12px" : "24px", 
        width: isMobile ? "100%" : "auto", 
        justifyContent: "flex-end" 
      }}>
        
        {/* COMPACT SEARCH - Narrower on mobile */}
        <div style={{ 
          position: "relative", 
          width: isMobile ? (isFocused ? "140px" : "100px") : (isFocused ? "220px" : "160px"), 
          ...transitionStyle 
        }}>
          <Search size={16} color={isFocused ? "#38BDF8" : "#64748B"} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ 
              width: "100%", 
              background: isFocused ? "#0f172a" : "rgba(30, 41, 59, 0.5)", 
              border: isFocused ? "1px solid #38BDF8" : "1px solid rgba(255,255,255,0.1)", 
              borderRadius: "100px", 
              padding: "8px 10px 8px 32px", 
              color: "white",
              fontSize: "0.8rem",
              outline: "none",
              ...transitionStyle
            }} 
          />
        </div>

        {/* NOTIFICATIONS - Hide on very small screens if needed, or keep compact */}
        <Bell 
          size={18} 
          color="#94A3B8" 
          style={{ cursor: "pointer", ...transitionStyle }} 
        />
        
        {/* USER PILL - Icon only on mobile */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "rgba(56, 189, 248, 0.1)", 
            padding: isMobile ? "6px 8px" : "6px 16px", 
            borderRadius: "100px", 
            border: "1px solid rgba(56, 189, 248, 0.2)",
            ...transitionStyle
          }}
        >
          <UserCircle size={20} color="#38BDF8" />
          {!isMobile && (
            <span style={{ color: "white", fontWeight: "600", fontSize: "0.85rem" }}>
              Hi, <span style={{ color: "#38BDF8" }}>{firstName}</span>
            </span>
          )}
        </div>

        {/* LOGOUT - Icon only on mobile */}
        <button 
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            color: "#c83232",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "0.9rem",
            ...transitionStyle
          }}
        >
          <LogOut size={18} /> 
          {!isMobile && "Logout"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;