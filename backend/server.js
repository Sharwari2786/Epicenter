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
app.use(express.json()); 

// 3. Import Routes
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news'); 

// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes); 

// 5. MongoDB Connection (Added safety options)
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

// 7. Start Server (FIXED: Only one app.listen is needed!)
// We use "0.0.0.0" so Render can map the internal port to the outside world.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is sprinting on port ${PORT}`);
});