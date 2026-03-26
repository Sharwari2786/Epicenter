const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password }); 
    await user.save();

    // Return the _id so the user can save news immediately
    res.status(201).json({ 
      msg: "User registered successfully", 
      user: { _id: user._id, name: user.name, email: user.email } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User does not exist" });

    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // FIX: Changed 'id' to '_id' to match MongoDB exactly
    res.json({
      msg: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;