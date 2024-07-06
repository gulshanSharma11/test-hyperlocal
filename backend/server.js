const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Schema definitions
const ratingSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Rating = mongoose.model('Rating', ratingSchema);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Define other fields as needed
  priority: { type: Number, default: 5 } // Default priority set to 5
});

const Item = mongoose.model('Item', itemSchema);

// Routes

// Ratings endpoints
app.post('/api/ratings', async (req, res) => {
  const { itemId, userEmail, rating } = req.body;

  try {
    const existingRating = await Rating.findOne({ itemId, userEmail });
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this item.' });
    }

    const newRating = await Rating.create({ itemId, userEmail, rating });
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ratings', async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Priority endpoints
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ priority: 1 }); // Sort by priority ascending
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/items/:itemId/priority', async (req, res) => {
  const { itemId } = req.params;
  const { priority } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.priority = priority;
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
