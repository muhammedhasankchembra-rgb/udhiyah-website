const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use('/api', require('./routes/userRoutes'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected Successfully!'))
.catch((err) => console.log('MongoDB Connection Error:', err));

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Udhiyah API is running...');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
