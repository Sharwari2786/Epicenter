import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      if (res.status === 200) {
        // --- THE CRITICAL FIX ---
        // 1. Save the WHOLE user object so NewsCard has the _id
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // 2. Save the name for the Navbar
        localStorage.setItem("userName", res.data.user.name);
        
        localStorage.setItem("isLoggedIn", "true");

        alert(`Welcome back, ${res.data.user.name}!`);
        navigate("/"); 
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.msg || "Server connection failed.";
      alert(errorMsg);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A" }}>
      <div style={{ background: "#1E293B", padding: "40px", borderRadius: "24px", width: "400px" }}>
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>Login to Epicenter</h2>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: "12px", borderRadius: "8px", background: "#0F172A", color: "white", border: "1px solid #334155" }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ padding: "12px", borderRadius: "8px", background: "#0F172A", color: "white", border: "1px solid #334155" }}
            required
          />
          <button type="submit" style={{ background: "#38BDF8", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", border: "none" }}>
            Login <ArrowRight size={18} style={{ marginLeft: "8px", verticalAlign: "middle" }} />
          </button>
        </form>
      </div>
    </div>
  );
}