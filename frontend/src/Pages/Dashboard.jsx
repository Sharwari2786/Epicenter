import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, Bookmark, Globe, Zap, ArrowRight, Activity, Rss, Sparkles, RefreshCcw, } from "lucide-react";
import axios from "axios";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#38BDF8', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B', '#6366F1'];

export default function Dashboard({ userName }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNews: 0, savedCount: 0, readCount: 0, apiLatency: "---",
    activityData: [], sourceData: []
  });

  const [recommendation, setRecommendation] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // --- 1. DYNAMIC WELCOME LOGIC ---
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 2. DATA FETCHING LOGIC (Merged & Smarter) ---
  const fetchDashboardData = async () => {
    setIsSyncing(true);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const startTime = Date.now();
      
      const res = await axios.get(`http://localhost:5000/api/news/analytics/${user._id}`);
      
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const paddedActivity = dayNames.map(dayName => {
        const raw = res.data.activityData || [];
        const getDay = (d) => {
          const [y, m, day] = d.split('-').map(Number);
          return new Date(y, m-1, day).toLocaleDateString('en-US', { weekday: 'short' });
        };
        const s = raw.find(i => i._id?.date && getDay(i._id.date) === dayName && i._id.type === 'saved');
        const r = raw.find(i => i._id?.date && getDay(i._id.date) === dayName && i._id.type === 'read');
        return { day: dayName, saved: s ? s.count : 0, read: r ? r.count : 0 };
      });

      if (res.data) {
        setStats({ ...res.data, activityData: paddedActivity, apiLatency: `${Date.now() - startTime}ms` });
        
        // Dynamic Recommendation Logic
        if (res.data.sourceData && res.data.sourceData.length > 0) {
          const topSector = res.data.sourceData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
          // Added cache-busting timestamp and sortBy for fresh news
          const recRes = await axios.get(`http://localhost:5000/api/news?q=${topSector.name}&sortBy=publishedAt&t=${new Date().getTime()}`);
          setRecommendation(recRes.data.articles[0]);
        }
      }
    } catch (err) { 
      console.error("Sync Failed:", err); 
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px", color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. DYNAMIC HERO SECTION */}
      <div style={{ 
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", 
        borderRadius: 32, 
        padding: "40px 50px", 
        marginBottom: 32, 
        border: "1px solid rgba(56, 189, 248, 0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }}></div>
            <span style={{ color: "#94A3B8", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
              System Active • Nagpur Node
            </span>
          </div>
          
          <h2 style={{ fontSize: "2.8rem", fontWeight: 800, margin: 0, letterSpacing: "-1px" }}>
            {getGreeting()}, <span style={{ 
              background: "linear-gradient(to right, #38BDF8, #8B5CF6)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}>{userName || "Agent"}</span>  👋 
          </h2>
          
          <p style={{ color: "#64748B", fontSize: "1.1rem", marginTop: 12, maxWidth: "522px", lineHeight: "1.6" }}>
            Global data streams filtered. Your personalized intelligence briefing is synchronized and optimized for your focus.
          </p>
        </div>

        <div style={{ textAlign: "right", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 40 }}>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "white", fontFamily: "monospace" }}>
            {currentTime}
          </div>
          <div style={{ color: "#38BDF8", fontWeight: 700, fontSize: "0.9rem", marginTop: 4 }}>
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div style={{ marginTop: 15, background: "rgba(56, 189, 248, 0.1)", padding: "6px 12px", borderRadius: 10, color: "#38BDF8", fontSize: "0.75rem", fontWeight: 800, display: "inline-block" }}>
             PING: {stats.apiLatency}
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS BOXES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 32 }}>
        {[
          { icon: Globe, label: "Total News", value: stats.totalNews, unit: "fetched", color: "#38BDF8" }, 
          { icon: Bookmark, label: "Saved News", value: stats.savedCount, unit: "items", color: "#8B5CF6" }, 
          { icon: Activity, label: "Read News", value: stats.readCount, unit: "clicks", color: "#10B981" }, 
          { icon: Rss, label: "API Sync", value: stats.apiLatency, unit: "LATENCY", color: "#F59E0B" }
        ].map(item => (
          <AnalyticsBox key={item.label} {...item} />
        ))}
      </div>

      {/* 3. DUAL LINE GRAPH */}
      <div style={{ background: "#192030", padding: 30, borderRadius: 32, height: 420, marginBottom: 32, border: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ color: "#94A3B8", fontSize: "1.2rem", fontWeight: 800, marginBottom: 20 }}>PERSONAL ACTIVITY PULSE</h4>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={stats.activityData}>
            <defs>
              <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
              <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: 16 }} />
            <Legend verticalAlign="top" height={36}/>
            <Area name="Saved News" type="monotone" dataKey="saved" stroke="#10B981" strokeWidth={4} fill="url(#gS)" dot={{ r: 6, fill: "#10B981" }} />
            <Area name="Read News" type="monotone" dataKey="read" stroke="#F59E0B" strokeWidth={4} fill="url(#gR)" dot={{ r: 6, fill: "#F59E0B" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4. PIE CHART & DISCOVERY CARD */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
        <div style={{ background: "#1E293B", padding: 28, borderRadius: 32, border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "#94A3B8", fontSize: "1.2rem", fontWeight: 800, marginBottom: 20 }}>ENGAGEMENT FOOTPRINT</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={stats.sourceData} 
                innerRadius={75} 
                outerRadius={105} 
                paddingAngle={12} 
                dataKey="value" 
                stroke="none" 
                cornerRadius={12}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {stats.sourceData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    style={{
                      transform: activeIndex === index ? 'scale(1.08)' : 'scale(1)',
                      transformOrigin: 'center',
                      filter: activeIndex === index ? `drop-shadow(0 0 12px ${COLORS[index % COLORS.length]}90)` : 'none',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ 
          background: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url(${recommendation?.urlToImage || ""})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          padding: 28, 
          borderRadius: 32, 
          border: "1px solid rgba(56, 189, 248, 0.3)",
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          minHeight: "280px",
          boxShadow: "0 10px 30px rgba(139, 92, 246, 0.1)", 
          transition: "all 0.4s ease-in-out"
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: '#38BDF8', padding: '6px', borderRadius: '8px' }}>
                   <Sparkles size={16} color="#0F172A" />
                </div>
                <span style={{ color: "#38BDF8", fontSize: "0.7rem", fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {isSyncing ? "ANALYZING PATTERNS..." : "PICKED FOR YOU"}
                </span>
              </div>
              <RefreshCcw 
                size={14} 
                color="#475569" 
                style={{ cursor: 'pointer', transition: '0.3s' }} 
                onClick={fetchDashboardData} 
              />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4, color: 'white', margin: 0 }}>
              {recommendation ? recommendation.title : "Scanning your interest nodes for fresh intel..."}
            </h3>
            
            {recommendation && (
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "10px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {recommendation.description}
              </p>
            )}
          </div>
          
          <button 
            onClick={() => recommendation && window.open(recommendation.url, '_blank')}
            style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#38BDF8', color: '#0F172A', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: "20px" }}
          >
            Read Full Story <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 5. STRATEGIC COMMAND */}
      <div style={{ marginBottom: 40, marginTop: 32 }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 20, letterSpacing: '0.5px' }}>
          STRATEGIC COMMAND
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {[
            { icon: Newspaper, label: "Live Feed", desc: "Top global headlines in real-time", to: "/category/general", gradient: "linear-gradient(135deg, #0F172A, #334155)", badge: "Live" },
            { icon: Bookmark, label: "The Collection", desc: "Your 16 pinned intelligence reports", to: "/saved", gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)", badge: "Safe" },
            { icon: Zap, label: "CTech Trends", desc: "Latest software & AI breakthroughs", to: "/category/Technology", gradient: "linear-gradient(135deg, #1e293b, #0ea5e9)", badge: "Hot"  },
          ].map((action) => (
            <QuickActionCard key={action.label} {...action} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, label, desc, to, gradient, badge, navigate }) {
  const [hover, setHover] = useState(false);
  const glow = gradient.match(/#[a-fA-F0-0]{3,6}/)?.[0] || "#38BDF8";
  return (
    <div 
      onClick={() => navigate(to)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: "#1E293B", border: `1px solid ${hover ? glow : "rgba(255,255,255,0.06)"}`, borderRadius: 24, padding: "24px", cursor: "pointer", transition: "all 0.3s", boxShadow: hover ? `0 15px 30px -10px ${glow}40` : "none" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ width: 48, height: 48, background: gradient, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hover ? `0 0 20px ${glow}` : "none" }}>
          <Icon size={22} color="white" />
        </div>
        <span style={{ fontSize: "0.9rem", fontWeight: 700, padding: "16px 11px", borderRadius: 20, background: "rgba(56, 189, 248, 0.1)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.2)" }}>{badge}</span>
      </div>
      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>{label}</h4>
      <p style={{ fontSize: "0.85rem", color: "#94A3B8", margin: "0 0 18px", lineHeight: 1.4 }}>{desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#38BDF8", fontSize: "0.85rem", fontWeight: 700 }}>
        Open <ArrowRight size={14} style={{ transform: hover ? "translateX(5px)" : "none", transition: "transform 0.3s" }} />
      </div>
    </div>
  );
}

const AnalyticsBox = ({ icon: Icon, label, value, unit, color }) => {
  const [hover, setHover] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        background: "#121926", 
        border: `1.5px solid ${hover ? color : `${color}40`}`, 
        borderRadius: 24, 
        padding: 24, 
        height: 160, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between",
        transition: 'all 0.3s ease',
        transform: hover ? "translateY(-5px)" : "none",
        cursor: 'pointer'
      }}
    >
      <div style={{ width: 44, height: 44, background: color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} color="#0F172A" strokeWidth={3} />
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: "2.4rem", fontWeight: 900, color: "white" }}>{value}</span>
          <span style={{ fontSize: "0.85rem", color: "#64748B" }}>{unit}</span>
        </div>
        <div style={{ fontSize: "0.85rem", color: color, fontWeight: 800, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, percent } = payload[0].payload;
    return (
      <div style={{ background: '#0F172A', border: '1px solid #38BDF8', padding: '12px 16px', borderRadius: 16 }}>
        <p style={{ margin: 0, fontWeight: 800, color: payload[0].fill }}>{name.toUpperCase()}</p>
        <p style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 900 }}>{percent.toFixed(1)}%</p>
        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8' }}>{value} Articles Discovered</p>
      </div>
    );
  }
  return null;
}; 