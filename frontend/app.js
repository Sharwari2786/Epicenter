const API_KEY = '9529f28ee3eb43ed821ca73e7f55bea3';
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const syncTimeDisplay = document.getElementById('sync-time');

// Fetch news using the /everything endpoint bypass
async function fetchNews(query = '', category = 'general') {
    try {
        // 1. Show the loading spinner
        newsContainer.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;

        let fetchUrl;

        // 2. Build the correct URL based on user input
        if (query) {
            fetchUrl = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        } else {
            let searchTerm = category === 'general' ? 'India' : `India ${category}`;
            fetchUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        }

        // 3. Make the API request
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (data.status === "ok") {
            renderNews(data.articles);
            
            // 4. Update the "Last Sync" timestamp
            const now = new Date();
            syncTimeDisplay.innerText = now.toLocaleTimeString();
        } else {
            newsContainer.innerHTML = `<h3>Error fetching news: ${data.message}</h3>`;
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = `<h3>Failed to load news. Please check your connection.</h3>`;
    }
}

// Render the articles to the screen
function renderNews(articles) {
    newsContainer.innerHTML = ''; // Clear out the spinner

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = `<h3>No news found. Try a different search.</h3>`;
        return;
    }

    articles.forEach(article => {
        if (!article.urlToImage) return; // Skip broken articles to keep the UI clean

        const card = document.createElement('div');
        card.classList.add('news-card');

        // Clean up descriptions that are too long
        let description = article.description || "Click to read more about this breaking story.";
        if (description.length > 120) {
            description = description.substring(0, 120) + "...";
        }

        card.innerHTML = `
            <div class="img-container">
                <img src="${article.urlToImage}" alt="News Image" onerror="this.src='https://via.placeholder.com/400x200?text=News+Unavailable'">
            </div>
            <div class="news-content">
                <span class="news-source">${article.source.name || 'Global Source'}</span>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-desc">${description}</p>
                <a href="${article.url}" target="_blank" class="read-more">Read Article &rarr;</a>
            </div>
        `;

        newsContainer.appendChild(card);

        // 5. Fade in the image ONLY when it has successfully downloaded
        const img = card.querySelector('img');
        img.onload = function() {
            this.classList.add('loaded');
        };
    });
}

// Handle Category button clicks
function handleCategory(category, event) {
    // Switch the active blue tab
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Clear search bar and fetch
    searchInput.value = '';
    fetchNews('', category);
}

// Handle Search logic
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        // 6. Save search to local browser storage (Engineering Feature)
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(query)) {
            history.push(query);
            localStorage.setItem('searchHistory', JSON.stringify(history.slice(-5))); // Store max of 5
        }
        
        fetchNews(query);
    }
});

// Let user press Enter to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Fetch general news automatically when the page first loads
window.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});