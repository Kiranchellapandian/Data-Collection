// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api'); // Ensure correct path and case
require('dotenv').config(); // Load environment variables

const app = express();

// Set mongoose configuration to handle the `strictQuery` deprecation warning
mongoose.set('strictQuery', false);

// Enable CORS for specific origin (adjust as needed)
app.use(
  cors({
    origin: 'https://data-collection-dytbe2rgb-kirans-projects-984cd662.vercel.app/', // Allow requests from this origin (frontend)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type'], // Allowed headers in request
  })
);

// Middleware setup
app.use(express.json()); // Use express.json() to parse incoming JSON requests

// Root route ('/')
app.get('/', (req, res) => {
  res.send('Welcome to the API server!');
});

// MongoDB connection URI with username and password
const mongoURI =
  process.env.MONGO_URI ||
  'MONGODB_URI=mongodb+srv://NARIK19991c:<SWT6fU5rExzGtUjk>@lablehuman.uni8x.mongodb.net/?retryWrites=true&w=majority&appName=LABLEHUMAN';

// MongoDB connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Timeout for server selection
    socketTimeoutMS: 45000, // Socket timeout
    maxPoolSize: 10, // Connection pool size
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Use the API routes
app.use('/api', apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'An internal server error occurred', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000; // Set default port to 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
