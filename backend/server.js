require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); // Needed for folder paths

const app = express();

// --- MIDDLEWARE ---
app.use(cors());

// THE BRIDGE: This serves your frontend (HTML, CSS, JS) on localhost:3000
// It tells Node to look inside the 'frontend' folder for your files
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NEWS_API_KEY;

// --- API ENDPOINT ---
app.get('/api/news', async (req, res) => {
    try {
        const { query, category } = req.query;
        let fetchUrl;

        // Logic to build the NewsAPI URL
        if (query) {
            // Search mode
            fetchUrl = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        } else {
            // Category mode (Defaults to India-specific news for relevance)
            let searchTerm = category === 'general' ? 'India' : `India ${category}`;
            fetchUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        }

        const response = await axios.get(fetchUrl);
        
        // Send the data back to your app.js
        res.json(response.data); 

    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch news from API" });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Epicenter Server is live!`);
    console.log(`🔗 Access your site at: http://localhost:${PORT}`);
    console.log(`📂 Serving frontend from: ${path.join(__dirname, '../frontend')}`);
});