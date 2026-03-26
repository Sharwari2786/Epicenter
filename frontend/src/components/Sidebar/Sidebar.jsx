import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Home, Bookmark, LogOut, Hexagon, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Home, label: "Daily Feed", path: "/home" }, // Renamed for a tech vibe
    { icon: Bookmark, label: "The Collection", path: "/saved" }, 
  
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ 
      width: "260px", 
      height: "100vh", 
      background: "rgba(10, 15, 28, 0.95)", // Matches Navbar depth
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(56, 189, 248, 0.1)", 
      padding: "32px 16px", 
      position: "fixed", 
      left: 0, 
      top: 0, 
      display: "flex", 
      flexDirection: "column",
      zIndex: 1100
    }}>
      
      {/* 1. BRANDING - Matches Navbar Split Color */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          padding: "0 12px",
          marginBottom: "48px", 
          cursor: "pointer"
        }} 
        onClick={() => navigate('/')}
      >
        <Hexagon size={24} color="#38BDF8" fill="#38BDF8" style={{ filter: "drop-shadow(0 0 8px #38BDF860)" }} />
        <span style={{ 
          fontWeight: 900, 
          fontSize: "1.3rem", 
          letterSpacing: "-1px" 
        }}>
          <span style={{ color: "#38BDF8" }}>EPI</span>
          <span style={{ color: "white" }}>CENTER</span>
        </span>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.label} 
              onClick={() => navigate(item.path)} 
              style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                padding: "12px 16px", 
                borderRadius: "14px", 
                cursor: "pointer",
                background: isActive ? "rgba(56, 189, 248, 0.08)" : "transparent",
                border: isActive ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid transparent",
                color: isActive ? "white" : "#64748B", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? "0 4px 15px rgba(0,0,0,0.2)" : "none"
              }}
              onMouseEnter={(e) => {
                if(!isActive) {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }
              }}
              onMouseLeave={(e) => {
                if(!isActive) {
                  e.currentTarget.style.color = "#64748B";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <item.icon 
                  size={20} 
                  color={isActive ? "#38BDF8" : "inherit"} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span style={{ 
                  fontWeight: isActive ? 700 : 500, 
                  fontSize: "0.9rem",
                  letterSpacing: "0.3px"
                }}>
                  {item.label}
                </span>
              </div>

              {isActive && (
                <div style={{ 
                  width: "5px", 
                  height: "5px", 
                  borderRadius: "50%", 
                  background: "#38BDF8",
                  boxShadow: "0 0 8px #38BDF8"
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. SYSTEM STATUS / LOGOUT */}
      <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div 
          onClick={handleLogout}
          style={{ 
            padding: "14px 16px", 
            color: "#64748B", 
            display: "flex", 
            alignItems: "center", 
            gap: "14px", 
            cursor: "pointer", 
            borderRadius: "14px",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64748B";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Logout</span>
        </div>
      </div>
    </div>
  );
}