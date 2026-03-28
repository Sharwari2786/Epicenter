import { useState } from "react";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";



export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [showPassword, setShowPassword] = useState(false); // Eye Toggle State



  const handleLogin = async (e) => {

    e.preventDefault();

   

    try {

      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

     

      if (res.status === 200) {

        // 1. Save everything to storage

        localStorage.setItem("user", JSON.stringify(res.data.user));

        localStorage.setItem("userName", res.data.user.name);

        localStorage.setItem("isLoggedIn", "true");



        alert(`Welcome back, ${res.data.user.name}!`);



        // 2. THE FIX: Use window.location.href instead of navigate("/")

        // This forces the entire App to reload and see the "isLoggedIn" as TRUE.

        window.location.href = "/";

      }

    } catch (err) {

      console.error("Login Error:", err);

      const errorMsg = err.response?.data?.msg || "Server connection failed.";

      alert(errorMsg);

    }

  };



 

  return (

    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A" }}>

      <div style={{ background: "#1E293B", padding: "40px", borderRadius: "24px", width: "400px", border: "1px solid rgba(56, 189, 248, 0.1)" }}>

        <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px", fontWeight: 800 }}>Login to Epicenter</h2>

       

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Email Field */}

          <div style={{ position: "relative" }}>

            <Mail size={18} color="#38BDF8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />

            <input

              type="email"

              placeholder="Email"

              value={formData.email}

              onChange={(e) => setFormData({ ...formData, email: e.target.value })}

              style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "12px", background: "#0F172A", color: "white", border: "1px solid #334155", outline: "none" }}

              required

            />

          </div>



          {/* Password Field with Eye Icon */}

          <div style={{ position: "relative" }}>

            <Lock size={18} color="#38BDF8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />

            <input

              type={showPassword ? "text" : "password"}

              placeholder="Password"

              value={formData.password}

              onChange={(e) => setFormData({ ...formData, password: e.target.value })}

              style={{ width: "100%", padding: "12px 45px 12px 40px", borderRadius: "12px", background: "#0F172A", color: "white", border: "1px solid #334155", outline: "none" }}

              required

            />

            <div

              onClick={() => setShowPassword(!showPassword)}

              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748B" }}

            >

              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

            </div>

          </div>



          <button type="submit" style={{ background: "#38BDF8", color: "#0F172A", padding: "12px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>

            Login <ArrowRight size={18} />

          </button>

         

          <p style={{ color: "#94A3B8", textAlign: "center", marginTop: "15px", fontSize: "14px" }}>

            New to Epicenter? <Link to="/register" style={{ color: '#38BDF8', textDecoration: "none", fontWeight: "600" }}>Create an account</Link>

          </p>

        </form>

      </div>

    </div>

  );

}