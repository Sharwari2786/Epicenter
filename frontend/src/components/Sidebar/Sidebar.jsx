import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Home, Bookmark, LogOut, Hexagon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. STATES for Responsiveness and Toggling
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsOpen(true); // Auto-show on desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Home, label: "Daily Feed", path: "/home" },
    { icon: Bookmark, label: "Your Collection", path: "/saved" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const NavContent = () => (
    <>
      {/* BRANDING */}
      <div 
        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 12px", marginBottom: "48px", cursor: "pointer" }} 
        onClick={() => { navigate('/'); if(isMobile) setIsOpen(false); }}
      >
        <Hexagon size={24} color="#38BDF8" fill="#38BDF8" />
        <span style={{ fontWeight: 900, fontSize: "1.3rem", color: "white" }}>
          <span style={{ color: "#38BDF8" }}>EPI</span>CENTER
        </span>
      </div>

      {/* LINKS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.label} 
              onClick={() => { navigate(item.path); if(isMobile) setIsOpen(false); }} 
              style={{
                display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "14px", cursor: "pointer",
                background: isActive ? "rgba(56, 189, 248, 0.1)" : "transparent",
                color: isActive ? "white" : "#64748B",
                border: isActive ? "1px solid rgba(56, 189, 248, 0.2)" : "1px solid transparent",
              }}
            >
              <item.icon size={20} color={isActive ? "#38BDF8" : "inherit"} />
              <span style={{ fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div onClick={handleLogout} style={{ marginTop: "auto", padding: "14px 16px", color: "#64748B", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
        <LogOut size={20} />
        <span>Logout</span>
      </div>
    </>
  );

  return (
    <>
      {/* 📱 MOBILE HAMBURGER BUTTON */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "fixed", top: "20px", left: "20px", zIndex: 2000,
            background: "#0A0F1C", border: "1px solid #38BDF8", borderRadius: "8px",
            padding: "8px", color: "#38BDF8", display: "flex", alignItems: "center"
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* 🚀 THE SIDEBAR (Sliding Drawer on Mobile, Fixed on Desktop) */}
      <div style={{ 
        width: "260px", height: "100vh", background: "#0A0F1C", borderRight: "1px solid rgba(56, 189, 248, 0.1)", 
        padding: "32px 16px", position: "fixed", top: 0, zIndex: 1500,
        left: isOpen ? 0 : "-260px", // The magic sliding logic
        transition: "left 0.3s ease-in-out",
        display: "flex", flexDirection: "column"
      }}>
        <NavContent />
      </div>

      {/* MOBILE OVERLAY (Blurs background when menu is open) */}
      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1400
          }} 
        />
      )}
    </>
  );
}