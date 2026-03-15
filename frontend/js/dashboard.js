document.addEventListener('DOMContentLoaded', () => {
    // --- 1. PULL DATA FROM STORAGE ---
    const allNews = JSON.parse(localStorage.getItem('latestNews')) || [];
    const savedNews = JSON.parse(localStorage.getItem('epicenter_bookmarks')) || [];

    // --- 2. UPDATE TOP METRIC CARDS ---
    
    // THE BIG COUNTER (Card Box) - Shows the 1000+ system total
    const totalEl = document.getElementById('stat-total');
    if (totalEl) {
        totalEl.innerText = getGlobalTotal(allNews.length).toLocaleString() + "+";
    }
    
    // Intelligence Saved (Bookmarks)
    const savedEl = document.getElementById('stat-saved');
    if (savedEl) {
        savedEl.innerText = savedNews.length.toLocaleString();
    }
    
    // Broadcast Volume (Active Feed)
    const broadcastEl = document.getElementById('stat-broadcast');
    if (broadcastEl) {
        broadcastEl.innerText = Math.floor(allNews.length * 0.8 + 8500).toLocaleString();
    }

    // Sentiment Score
    const sentimentEl = document.getElementById('stat-sentiment');
    if (sentimentEl) {
        sentimentEl.innerText = calculateSentiment(allNews);
    }

    // --- 3. GLOBAL SENTIMENT PULSE (Line Chart) ---
    const sentimentCanvas = document.getElementById('sentimentChart');
    if (sentimentCanvas) {
        const sentimentCtx = sentimentCanvas.getContext('2d');
        new Chart(sentimentCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
                datasets: [
                    {
                        label: 'Positive',
                        data: generateDataPoints(allNews.length, 0.7),
                        borderColor: '#10b981',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Negative',
                        data: generateDataPoints(allNews.length, 0.3),
                        borderColor: '#ef4444',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }

    // --- 4. NEWS BY DOMAIN (Doughnut Chart - REAL SESSION COUNTS) ---
    const domainCanvas = document.getElementById('domainChart');
    if (domainCanvas) {
        const domainCtx = domainCanvas.getContext('2d');
        new Chart(domainCtx, {
            type: 'doughnut',
            data: {
                labels: ['Tech', 'Business', 'Sports', 'General', 'Entertainment'],
                datasets: [{
                    // THIS IS THE DYNAMIC PART: Real counts based on news fetched
                    data: getDomainDistribution(allNews), 
                    backgroundColor: ['#3b82f6', '#f65c8f', '#10b981', '#f59e0b', '#f53e0b'],
                    borderWidth: 0
                }]
            },
            options: { cutout: '75%', responsive: true, maintainAspectRatio: false }
        });
    }

    // --- 5. WEEKLY READING (Bar Chart) ---
    const weeklyCanvas = document.getElementById('weeklyChart');
    if (weeklyCanvas) {
        const weeklyCtx = weeklyCanvas.getContext('2d');
        
        // This calculates the real data from your bookmarks
        const weeklyData = getWeeklyStats(savedNews);

        new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Articles Saved',
                    data: weeklyData, 
                    backgroundColor: '#3b82f6',
                    borderRadius: 8
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    // --- HELPER FUNCTIONS ---

    function getGlobalTotal(currentNewsCount) {
        const baseSystemTotal = 1250; 
        return baseSystemTotal + currentNewsCount;
    }

    function getDomainDistribution(newsArray) {
        if (newsArray.length === 0) return [0, 0, 0, 0, 0];
        const counts = { tech: 0, biz: 0, sports: 0, ent: 0, gen: 0 };
        newsArray.forEach(article => {
            const title = (article.title || "").toLowerCase();
            if (title.includes('tech') || title.includes('ai') || title.includes('google')) counts.tech++;
            else if (title.includes('stock') || title.includes('biz') || title.includes('market')) counts.biz++;
            else if (title.includes('sport') || title.includes('game') || title.includes('match')) counts.sports++;
            else if (title.includes('movie') || title.includes('star') || title.includes('music')) counts.ent++;
            else counts.gen++;
        });
        return [counts.tech, counts.biz, counts.sports, counts.gen, counts.ent];
    }

    function getWeeklyStats(bookmarks) {
        // Initialize counts for Mon-Sun
        let counts = [0, 0, 0, 0, 0, 0, 0];
        
        bookmarks.forEach(article => {
            // We use the current date as a fallback if the article doesn't have a timestamp
            const date = article.savedAt ? new Date(article.savedAt) : new Date();
            let dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...
            
            // Adjust so index 0 is Monday, 6 is Sunday to match your labels
            let adjustedIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
            counts[adjustedIndex]++;
        });

        // If no bookmarks yet, we provide a small "simulated" trend 
        // so the chart isn't totally empty for your demo
        if (bookmarks.length === 0) return [2, 5, 3, 8, 4, 0, 0];

        return counts;
    }

    function calculateSentiment(news) {
        if (news.length === 0) return "8.5";
        const posWords = ['surge', 'growth', 'breakthrough', 'positive', 'rise', 'success'];
        const posCount = news.filter(a => posWords.some(w => a.title.toLowerCase().includes(w))).length;
        let score = (posCount / news.length) * 5 + 5; 
        return score.toFixed(1);
    }

    function generateDataPoints(total, mult) {
        const base = total > 0 ? total : 100;
        return [0.2, 0.5, 0.3, 0.9, 0.4, 0.7, 0.8].map(p => Math.floor(base * p * mult));
    }

    // --- 6. TRENDING CLOUD ---
    const cloud = document.getElementById('trending-cloud');
    if (cloud && allNews.length > 0) {
        const stopWords = ['the', 'and', 'with', 'from', 'this', 'that'];
        let wordFreq = {};
        allNews.forEach(a => {
            a.title.toLowerCase().split(' ').forEach(w => {
                if (w.length > 4 && !stopWords.includes(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
            });
        });
        const topWords = Object.entries(wordFreq).sort((a,b) => b[1]-a[1]).slice(0, 8);
        cloud.innerHTML = topWords.map(([word, count]) => `<span class="tag ${count > 2 ? 'high' : 'mid'}">#${word}</span>`).join('');
    }
});