const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware
app.use(cors());
app.use(express.json()); // Essential for reading the article data from your NewsCard

// 3. Import Routes
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news'); 

// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes); // This handles /api/news AND /api/news/save

// 5. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// 6. Base Route for Testing
app.get('/', (req, res) => {
  res.send('Epicenter API is running...');
});

// 7. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is sprinting on port ${PORT}`);
});