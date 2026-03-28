const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose'); 
const SavedNews = require('../models/SavedNews');
const ReadHistory = require("../models/ReadHistory");

// 1. Home Page: Fetch from NewsAPI
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
    let url = (!q || q === "" || q === "undefined") 
      ? `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`
      : `https://newsapi.org/v2/everything?q=${q}&language=en&apiKey=${apiKey}`;

    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 2. Track Read (Updated to include 'source' for the Pie Chart)
// 2. Track Read
router.post('/track-read', async (req, res) => {
  try {
    // 1. Add 'source' here to pull it from the Frontend request
    const { userId, url, category, source } = req.body; 
    
    const newRead = new ReadHistory({
      userId, 
      url, 
      category: category || "General",
      // 2. Use the source sent from the frontend, or fallback
      source: source || "Global News", 
      readAt: new Date() 
    });
    
    await newRead.save();
    res.status(201).json({ msg: "Read tracked" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 3. Save Button
router.post('/save', async (req, res) => {
  try {
    const { article, userId } = req.body;
    const newSave = new SavedNews({
      userId: userId,
      title: article.title,
      url: article.url,
      urlToImage: article.urlToImage,
      source: article.source?.name || article.source || "Global News",
      category: article.category || "General",
      savedAt: new Date()
    });
    await newSave.save();
    res.status(201).json({ msg: "Success! Article pinned." });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ msg: "Already saved" });
    res.status(500).json({ msg: err.message });
  }
});

// 4. Analytics: 100% Private Data Isolation
router.get("/analytics/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get personal counts first
    const [savedCount, readCount] = await Promise.all([
      SavedNews.countDocuments({ userId: userObjectId }),
      ReadHistory.countDocuments({ userId: userObjectId })
    ]);

    const [activity, sourceDistribution] = await Promise.all([
      // DUAL-LINE ACTIVITY (Only for this user)
      SavedNews.aggregate([
        { $match: { userId: userObjectId } },
        { $project: { date: "$savedAt", type: "saved" } },
        { $unionWith: { 
            coll: "readhistories", 
            pipeline: [{ $match: { userId: userObjectId } }, { $project: { date: "$readAt", type: "read" } }] 
        }},
        { $group: {
            _id: { 
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: "+05:30" } },
              type: "$type"
            },
            count: { $sum: 1 }
        }}
      ]),

      // PIE CHART: Platforms visited by THIS user
      // PIE CHART: Platforms visited by THIS user
      ReadHistory.aggregate([
        { $match: { userId: userObjectId } }, 
        { $group: { _id: "$source", value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $limit: 6 },
        { $project: { 
            name: "$_id", 
            value: 1, 
            // Add this back to prevent the frontend crash!
            percent: { 
              $cond: [
                { $gt: [readCount, 0] }, 
                { $multiply: [{ $divide: ["$value", readCount] }, 100] }, 
                0
              ] 
            },
            _id: 0 
        }}
      ])
    ]);

    res.json({
      totalNews: 100 + (readCount * 2), // Changed formula slightly for more realism
      savedCount: savedCount,
      readCount: readCount,
      activityData: activity,
      sourceData: sourceDistribution,
      apiLatency: "Synced"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Fetch Saved Articles
router.get('/saved/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid User ID format" });
    }
    const saved = await SavedNews.find({ userId: userId }).sort({ savedAt: -1 });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 6. Delete Article
router.delete('/remove', async (req, res) => {
  try {
    const { userId, url } = req.body;
    await SavedNews.findOneAndDelete({ userId, url });
    res.status(200).json({ msg: "Removed from collection" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;