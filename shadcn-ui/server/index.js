require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cse-quiz-db';

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Log the host to verify if it's Atlas or Local
        console.log('Connection Host:', mongoose.connection.host);
        console.log('Database Name:', mongoose.connection.name);
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('CSE Quiz Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
