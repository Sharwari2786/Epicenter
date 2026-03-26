import { useState, useEffect } from "react";
import { ExternalLink, Bookmark } from "lucide-react";
import axios from "axios";

export default function NewsCard({ article, isAlreadySaved }) {
  // 1. Initialize state (Blue if already saved, Grey otherwise)
  const [isSaved, setIsSaved] = useState(isAlreadySaved || false);

  // 2. Persistence: If we are on the Home page, check if this specific article is in DB
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

  // 3. Bookmark Toggle (Save/Remove)
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
    setIsSaved(nextStatus); // Optimistic UI update

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
      setIsSaved(!nextStatus); // Revert UI if server fails
      alert("Connection error. Please try again.");
    }
  };

  // 4. Analytics: Track when the user actually reads the story
  const handleReadClick = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    try {
      await axios.post("http://localhost:5000/api/news/track-read", {
        userId: user._id,
        url: article.url,
        category: article.category || article.source?.name || "General"
      });
    } catch (err) {
      console.error("Tracking error", err);
    }
  };

  return (
    <div style={{ 
      background: "#1E293B", 
      borderRadius: "16px", 
      overflow: "hidden", 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      border: "1px solid rgba(255,255,255,0.05)" 
    }}>
      {/* Article Image */}
      <div style={{ height: "180px", overflow: "hidden", background: "#0F172A" }}>
        <img 
          src={article.urlToImage || 'https://via.placeholder.com/400x200?text=Epicenter+News'} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          alt="news" 
        />
      </div>

      {/* Article Info */}
      <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
          <span style={{ color: "#38BDF8", fontSize: "12px", fontWeight: "bold" }}>
            {article.source?.name || article.source || "News"}
          </span>
          
          <div 
            onClick={toggleSave} 
            style={{ cursor: "pointer", padding: "8px", zIndex: 10 }}
          >
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

        {/* Read More Link with Tracking */}
        <a 
          href={article.url} 
          target="_blank" 
          rel="noreferrer" 
          onClick={handleReadClick} // This triggers the database count!
          style={{ 
            marginTop: "auto", 
            color: "#38BDF8", 
            textDecoration: "none", 
            display: "flex", 
            alignItems: "center", 
            gap: "5px", 
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          Read Full Story <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}