import { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "../components/News/NewsCard";

export default function SavedNews() {
  // Use 'articles' consistently
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        
        const user = JSON.parse(userStr);
        const targetUrl = `http://localhost:5000/api/news/saved/${user._id}`;

        const res = await axios.get(targetUrl);
        
        // 1. Fixed the function name to match your useState
        setArticles(res.data); 
        
        // 2. MUST call this to hide the "Loading..." text
        setLoading(false); 
      } catch (err) {
        console.error("Error fetching collection:", err);
        setLoading(false); // Stop loading even if it fails
      }
    };
    fetchSaved();
  }, []);

  return (
    <div style={{ padding: "40px", background: "#0F172A", minHeight: "100vh" }}>
      <h2 style={{ color: "white", marginBottom: "10px", fontSize: '2rem', fontWeight: 700 }}>
        Your <span style={{ color: "#38BDF8" }}>Collection</span> is here
      </h2>
      
      {loading ? (
        <p style={{ color: "#38BDF8", fontWeight: 600 }}>Loading your collection...</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "24px",
          marginTop: "30px" 
        }}>
          {articles.length > 0 ? (
            articles.map((art, i) => (
              <NewsCard 
                key={art._id || i} 
                article={art} 
                isAlreadySaved={true} 
              />
            ))
          ) : (
            <p style={{ color: "#94A3B8" }}>No saved news yet. Start pinning some stories!</p>
          )}
        </div>
      )}
    </div>
  );
}