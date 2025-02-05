const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const { errorHandler } = require('./src/utils/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/contractors', require('./src/routes/contractors'));
app.use('/api/complaints', require('./src/routes/complaints'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});