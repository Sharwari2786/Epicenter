import { useState, useEffect } from "react";
import { ExternalLink, Bookmark } from "lucide-react";
import axios from "axios";

export default function NewsCard({ article, isAlreadySaved }) {
  const [isSaved, setIsSaved] = useState(isAlreadySaved || false);

  useEffect(() => {
    if (isAlreadySaved) return;

    const checkStatus = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const userData = JSON.parse(userStr);

      try {
        const res = await axios.get(`http://localhost:5000/api/news/saved/${userData._id}`);
        const found = res.data.some((item) => item.url === article.url);
        if (found) setIsSaved(true);
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };
    checkStatus();
  }, [article.url, isAlreadySaved]);

  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login to save stories.");
      return;
    }
    const userData = JSON.parse(userStr);

    const nextStatus = !isSaved;
    setIsSaved(nextStatus); 

    try {
      if (nextStatus) {
        await axios.post("http://localhost:5000/api/news/save", {
          article: article,
          userId: userData._id,
        });
      } else {
        await axios.delete("http://localhost:5000/api/news/remove", {
          data: { userId: userData._id, url: article.url },
        });
      }
    } catch (err) {
      console.error("Sync error:", err);
      setIsSaved(!nextStatus); 
      alert("Connection error. Please try again.");
    }
  };

  // ✅ FIXED: Corrected user data access and function name
  const handleReadClick = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const userData = JSON.parse(userStr);

    try {
      await axios.post("http://localhost:5000/api/news/track-read", {
        userId: userData._id,
        url: article.url,
        category: article.category || "General",
        // This ensures the source name is sent to fill your Pie Chart!
        source: article.source?.name || article.source || "Global News"
      });
    } catch (err) {
      console.error("Tracking error:", err);
    }
  };

  return (
    <div style={{ 
      background: "#1E293B", borderRadius: "16px", overflow: "hidden", 
      display: "flex", flexDirection: "column", height: "100%", 
      border: "1px solid rgba(255,255,255,0.05)" 
    }}>
      <div style={{ height: "180px", overflow: "hidden", background: "#0F172A" }}>
        <img 
          src={article.urlToImage || 'https://via.placeholder.com/400x200?text=Epicenter+News'} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          alt="news" 
        />
      </div>

      <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
          <span style={{ color: "#38BDF8", fontSize: "12px", fontWeight: "bold" }}>
            {article.source?.name || article.source || "News"}
          </span>
          
          <div onClick={toggleSave} style={{ cursor: "pointer", padding: "8px", zIndex: 10 }}>
            <Bookmark 
              size={22} 
              fill={isSaved ? "#38BDF8" : "transparent"} 
              color={isSaved ? "#38BDF8" : "#94A3B8"} 
              style={{ transition: "all 0.3s ease" }}
            />
          </div>
        </div>

        <h4 style={{ color: "white", fontSize: "16px", marginBottom: "12px", lineHeight: "1.4" }}>
          {article.title}
        </h4>

        <a 
          href={article.url} 
          target="_blank" 
          rel="noreferrer" 
          onClick={handleReadClick} // ✅ FIXED: Now correctly triggers the function
          style={{ 
            marginTop: "auto", color: "#38BDF8", textDecoration: "none", 
            display: "flex", alignItems: "center", gap: "5px", 
            fontSize: "14px", fontWeight: "bold"
          }}
        >
          Read Full Story <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}