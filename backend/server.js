require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NEWS_API_KEY;

app.get('/api/news', async (req, res) => {
    try {
        const { query, category } = req.query;
        let fetchUrl;

        // If local pulse or search is used
        if (query && query !== '' && query !== 'undefined') {
            fetchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        } else {
            let searchTerm = category === 'general' ? 'India' : `India ${category}`;
            fetchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        }

        const response = await axios.get(fetchUrl);
        res.json(response.data); 
    } catch (error) {
        res.status(500).json({ status: "error", message: "API Error" });
    }
});

app.listen(PORT, () => console.log(`🚀 Epicenter Server live on port ${PORT}`));