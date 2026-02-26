const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/news2networth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes - MAKE SURE THESE LINES EXIST!
const authRoutes = require('./routes/auth');
const mlRoutes = require('./routes/ml');

app.use('/api/auth', authRoutes);
app.use('/api/ml', mlRoutes);  // ← THIS MUST BE PRESENT!

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});