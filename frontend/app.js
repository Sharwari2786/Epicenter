const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const syncTimeDisplay = document.getElementById('sync-time');

// UPDATED: Now fetches from your LOCAL Node.js server
async function fetchNews(query = '', category = 'general') {
    try {
        newsContainer.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;

        // We target our localhost backend instead of the external NewsAPI
        // This tells the browser: "Go to the backend and bring back the news"
        const response = await fetch(`http://localhost:3000/api/news?query=${query}&category=${category}`);
        const data = await response.json();

        if (data.status === "ok") {
            renderNews(data.articles);
            const now = new Date();
            syncTimeDisplay.innerText = now.toLocaleTimeString();
        } else {
            newsContainer.innerHTML = `<h3>Error: ${data.message}</h3>`;
        }
    } catch (error) {
        console.error("Error:", error);
        newsContainer.innerHTML = `<h3>Failed to connect to server. Ensure Node.js is running.</h3>`;
    }
}

function renderNews(articles) {
    newsContainer.innerHTML = ''; 
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = `<h3>No news found.</h3>`;
        return;
    }
    articles.forEach(article => {
        if (!article.urlToImage) return;
        const card = document.createElement('div');
        card.classList.add('news-card');
        let description = article.description || "Read more about this story.";
        if (description.length > 120) description = description.substring(0, 120) + "...";

        card.innerHTML = `
            <div class="img-container">
                <img src="${article.urlToImage}" alt="News Image" onerror="this.src='https://via.placeholder.com/400x200?text=News+Unavailable'">
            </div>
            <div class="news-content">
                <span class="news-source">${article.source.name || 'Global Source'}</span>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-desc">${description}</p>
                <a href="${article.url}" target="_blank" class="read-more">Read Article &rarr;</a>
            </div>`;
        newsContainer.appendChild(card);
        const img = card.querySelector('img');
        img.onload = function() { this.classList.add('loaded'); };
    });
}

function handleCategory(category, event) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    searchInput.value = '';
    fetchNews('', category);
}

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchNews(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchButton.click();
});

window.addEventListener('DOMContentLoaded', () => fetchNews());