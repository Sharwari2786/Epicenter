require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Allows the frontend to talk to this server

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NEWS_API_KEY;

app.get('/api/news', async (req, res) => {
    try {
        const { query, category } = req.query;
        let fetchUrl;

        // Logic to build the NewsAPI URL securely
        if (query) {
            fetchUrl = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        } else {
            let searchTerm = category === 'general' ? 'India' : `India ${category}`;
            fetchUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        }

        const response = await axios.get(fetchUrl);
        res.json(response.data); 

    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch news" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Epicenter Server running securely on http://localhost:${PORT}`);
});