const API_BASE_URL = "https://epicenter-jggn.onrender.com";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";
import NewsCard from "../components/News/NewsCard";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = ["General", "Technology", "Business", "Sports", "Entertainment", "Health", "Science"];
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get("category") || "general";
  const currentQuery = searchParams.get("q");
  const displayTerm = currentQuery || currentCategory;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const searchTerm = currentQuery || currentCategory;
        // FIX: Replaced localhost with API_BASE_URL
        const targetUrl = `${API_BASE_URL}/api/news?q=${searchTerm}`;
        
        const res = await axios.get(targetUrl);
        setArticles(res.data.articles || []);
        setLoading(false);
      } catch (err) {
        console.error("News fetch failed", err);
        setLoading(false);
      }
    };
    fetchNews();
  }, [location.search]);

  const buttonStyle = (isActive) => ({
    padding: "10px 22px",
    borderRadius: "25px",
    border: "1px solid var(--accent, #38BDF8)",
    background: isActive ? "var(--accent, #38BDF8)" : "transparent",
    color: isActive ? "#0F172A" : "var(--accent, #38BDF8)",
    cursor: "pointer",
    fontWeight: "700",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    boxShadow: isActive ? "0 4px 15px rgba(56, 189, 248, 0.4)" : "none"
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
      
      {/* BRANDED HEADING SECTION */}
      <div style={{ borderLeft: "6px solid var(--accent, #38BDF8)", paddingLeft: "20px", marginBottom: "40px" }}>
        <h2 style={{ color: "white", margin: 0, fontWeight: 800, fontSize: "2.2rem", letterSpacing: "-1px" }}>
          At the Center of <span style={{ color: "var(--accent, #38BDF8)", textTransform: "capitalize" }}>{displayTerm}</span>
        </h2>
        <p style={{ color: "#94A3B8", marginTop: "8px", fontSize: "1.1rem" }}>
          Curated intelligence for the modern explorer.
        </p>
      </div>

      {/* CATEGORY BAR */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "40px", overflowX: "auto", paddingBottom: "12px" }}>
        {categories.map(cat => (
          <button 
            key={cat} 
            // FIXED: Navigate using 'category' to match Dashboard logic
            onClick={() => navigate(`/home?category=${cat.toLowerCase()}`)}
            style={buttonStyle(displayTerm.toLowerCase() === cat.toLowerCase())}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div style={{ color: "var(--accent, #38BDF8)", textAlign: "center", marginTop: "100px" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: "500" }}>Sprinting to get the latest news...</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px" }}>
          {articles.length > 0 ? (
            articles.map((item, index) => <NewsCard key={index} article={item} />)
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', marginTop: '50px' }}>
              <p style={{ color: "#94A3B8", fontSize: "1.2rem" }}>No news found for this sector.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}