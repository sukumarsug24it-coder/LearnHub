const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getMongoStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'LearnHub API',
    version: '1.0.0',
    database: getMongoStatus() ? 'MongoDB (Connected)' : 'In-Memory Store (Active)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Custom Error Handlers
app.use(notFound);
app.use(errorHandler);

// Connect Database and Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\x1b[32m🚀 LearnHub Backend Server running on http://localhost:${PORT}\x1b[0m`);
    console.log(`\x1b[34m📚 API Docs & Endpoints available at http://localhost:${PORT}/api/health\x1b[0m`);
  });
};

startServer();

module.exports = app;

