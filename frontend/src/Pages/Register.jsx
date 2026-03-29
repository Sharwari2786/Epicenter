import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const API_BASE_URL = "https://epicenter-jggn.onrender.com";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // FIX: Replaced localhost with API_BASE_URL
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      if (res.status === 201) {
        alert("Account Created Successfully!");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed.");
    }
  };
  return (

    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", padding: "20px" }}>

      <div style={{ background: "#1E293B", padding: "40px", borderRadius: "24px", width: "100%", maxWidth: "420px", border: "1px solid rgba(56, 189, 248, 0.1)" }}>

       

        <div style={{ textAlign: "center", marginBottom: "32px" }}>

          <h2 style={{ color: "white", fontSize: "1.8rem", fontWeight: 800 }}>Join Epicenter</h2>

          <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginTop: "8px" }}>Create an account to personalize your news feed.</p>

        </div>



        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Full Name Field */}

            <div style={{ position: "relative" }}>

              <User size={18} color="#38BDF8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />

              <input

                type="text"

                placeholder="Full Name"

                value={formData.name}

                onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                required

                style={{ width: "100%", background: "#0F172A", border: "1px solid #334155", borderRadius: "12px", padding: "12px 12px 12px 40px", color: "white", outline: "none" }}

              />

            </div>



            {/* Email Field */}

            <div style={{ position: "relative" }}>

              <Mail size={18} color="#38BDF8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />

              <input

                type="email"

                placeholder="Email Address"

                value={formData.email}

                onChange={(e) => setFormData({ ...formData, email: e.target.value })}

                required

                style={{ width: "100%", background: "#0F172A", border: "1px solid #334155", borderRadius: "12px", padding: "12px 12px 12px 40px", color: "white", outline: "none" }}

              />

            </div>



            {/* Password Field with Eye Icon */}

            <div style={{ position: "relative" }}>

              <Lock size={18} color="#38BDF8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />

              <input

                type={showPassword ? "text" : "password"}

                placeholder="Create Password"

                value={formData.password}

                onChange={(e) => setFormData({ ...formData, password: e.target.value })}

                required

                style={{ width: "100%", background: "#0F172A", border: "1px solid #334155", borderRadius: "12px", padding: "12px 45px 12px 40px", color: "white", outline: "none" }}

              />

              <div

                onClick={() => setShowPassword(!showPassword)}

                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748B" }}

              >

                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

              </div>

            </div>



            <button type="submit" style={{ background: "#38BDF8", color: "#0F172A", fontWeight: 700, padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>

              Create Account <ArrowRight size={18} />

            </button>

          </form>



        <p style={{ color: "#94A3B8", fontSize: "0.85rem", textAlign: "center", marginTop: "24px" }}>

          Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#38BDF8", cursor: "pointer", fontWeight: 600 }}>Log In</span>

        </p>

      </div>

    </div>

  );

}