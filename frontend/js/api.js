const newsContainer = document.getElementById('news-container');
const syncTimeDisplay = document.getElementById('sync-time');

// Fetch News from Node.js
async function fetchNews(query = '', category = 'general') {
    try {
        if (newsContainer) newsContainer.innerHTML = `<div class="loader-container">Loading news...</div>`;
        
        const response = await fetch(`http://localhost:3000/api/news?query=${encodeURIComponent(query)}&category=${category}`);
        const data = await response.json();

        if (data.status === "ok") {
            currentArticles = data.articles;
            renderNews(currentArticles);
            
            if (syncTimeDisplay) {
                syncTimeDisplay.innerText = new Date().toLocaleTimeString();
            }
        }
    } catch (error) {
        if (newsContainer) newsContainer.innerHTML = `<h3>Server Error.</h3>`;
        console.error("Fetch error:", error);
    }
}

// Render Grid
function renderNews(articles) {
    if (!newsContainer) return;
    newsContainer.innerHTML = ''; 
    articles.forEach((article, index) => {
        if (!article.urlToImage) return;
        const isSaved = bookmarks.some(b => b.url === article.url);
        
        const card = document.createElement('div');
        card.classList.add('news-card');
        card.innerHTML = `
            <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmark(${index})">
                ${isSaved ? '🔖' : '📑'}
            </button>
            <div class="img-container">
                <img src="${article.urlToImage}" onerror="this.src='https://via.placeholder.com/400x200'">
            </div>
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-desc">${(article.description || "").substring(0, 80)}...</p>
                <a href="${article.url}" target="_blank" class="read-more">Read Full Story</a>
            </div>`;
        newsContainer.appendChild(card);
    });
}