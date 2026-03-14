const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const viewSavedBtn = document.getElementById('view-saved');

let bookmarks = JSON.parse(localStorage.getItem('epicenter_bookmarks')) || [];
let currentArticles = [];

// Bookmark Logic
window.toggleBookmark = (index) => {
    const article = currentArticles[index];
    const existsIndex = bookmarks.findIndex(b => b.url === article.url);

    if (existsIndex > -1) {
        bookmarks.splice(existsIndex, 1);
    } else {
        bookmarks.push(article);
    }
    localStorage.setItem('epicenter_bookmarks', JSON.stringify(bookmarks));
    renderNews(currentArticles);
};

// Category and Search
function handleCategory(category, event) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    fetchNews('', category);
}

// Local Pulse (On Click)
async function handleLocalPulse(event) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`);
            const geo = await res.json();
            fetchNews(geo.city || geo.locality);
        }, () => fetchNews());
    }
}

viewSavedBtn.addEventListener('click', () => {
    currentArticles = bookmarks;
    renderNews(bookmarks);
});

searchButton.addEventListener('click', () => fetchNews(searchInput.value));

// Init
window.addEventListener('DOMContentLoaded', () => fetchNews());