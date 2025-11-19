const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const { errorHandler } = require('./src/utils/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Custom logging middleware for detailed request/response tracking
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('\n' + '='.repeat(60));
  console.log(`📥 INCOMING REQUEST [${timestamp}]`);
  console.log(`🔗 ${req.method} ${req.originalUrl}`);
  console.log(`🌐 Origin: ${req.get('origin') || 'N/A'}`);
  console.log(`🔑 Auth: ${req.get('authorization') ? 'Bearer Token Present' : 'No Auth'}`);
  
  if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
    console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  }
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 RESPONSE [${res.statusCode}]:`);
    try {
      const responseData = JSON.parse(data);
      console.log(JSON.stringify(responseData, null, 2));
    } catch(e) {
      console.log(data);
    }
    console.log('='.repeat(60) + '\n');
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('🚀 :method :url :status :response-time ms - :res[content-length]'));
app.use(requestLogger);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pardarsh Backend Service is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

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