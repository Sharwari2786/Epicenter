import { Bell, Search, UserCircle, LogOut, Hexagon } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ userName }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

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

  // Helper for consistent hover transitions
  const transitionStyle = { transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" };

  return (
    <nav style={{
      height: "72px",
      background: "rgba(15, 23, 42, 0.9)", 
      backdropFilter: "blur(16px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "1px solid rgba(56, 189, 248, 0.1)",
    }}>
      
      {/* 1. BRAND LOGO - Hover: Glow grows and text slides */}
      <Link 
        to="/" 
        style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", ...transitionStyle }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(5px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
      >
        <Hexagon size={24} color="#38BDF8" fill="#38BDF8" style={{ filter: "drop-shadow(0 0 8px #38BDF860)" }} />
        <span style={{ fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-1px" }}>
          <span style={{ color: "#38BDF8" }}>EPI</span>
          <span style={{ color: "white" }}>CENTER</span>
        </span>
      </Link>

      {/* 2. RIGHT SIDE CONTAINER */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        
        {/* COMPACT SEARCH */}
        <div style={{ 
          position: "relative", 
          width: isFocused ? "220px" : "160px", 
          ...transitionStyle 
        }}>
          <Search size={16} color={isFocused ? "#38BDF8" : "#64748B"} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
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
              padding: "8px 12px 8px 36px", 
              color: "white",
              fontSize: "0.85rem",
              outline: "none",
              ...transitionStyle
            }} 
          />
        </div>
        

        {/* NOTIFICATIONS - Hover: Blue glow */}
        <Bell 
          size={20} 
          color="#94A3B8" 
          style={{ cursor: "pointer", ...transitionStyle }} 
          onMouseEnter={(e) => e.currentTarget.style.color = "#38BDF8"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#94A3B8"}
        />
        
        {/* USER PILL - Hover: Background deepens */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            background: "rgba(56, 189, 248, 0.1)", 
            padding: "6px 16px", 
            borderRadius: "100px", 
            border: "1px solid rgba(56, 189, 248, 0.2)",
            cursor: "pointer",
            ...transitionStyle
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(56, 189, 248, 0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(56, 189, 248, 0.1)"}
        >
          <UserCircle size={22} color="#38BDF8" />
          <span style={{ color: "white", fontWeight: "600", fontSize: "0.9rem" }}>
            Hi, <span style={{ color: "#38BDF8" }}>{firstName}</span>
          </span>
        </div>

        {/* LOGOUT - Hover: Bright Red + Scale */}
        <button 
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "#c83232",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "0.85rem",
            ...transitionStyle
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fd2424";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#c83232";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;