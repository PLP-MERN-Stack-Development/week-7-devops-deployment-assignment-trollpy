const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./config/logger');
const errorHandler = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth.routes');
const githubRoutes = require('./routes/github.routes');
const ciRoutes = require('./routes/ci.routes');
const logRoutes = require('./routes/log.routes');
const taskRoutes = require('./routes/task.routes');

// Import jobs
const GitHubActivityJob = require('./jobs/githubActivityJob'); // ✅ Class
const cleanupOldLogs = require('./jobs/cleanupOldLogs');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible in routes if needed
app.set('io', io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ci', ciRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Start cron jobs ✅
const githubActivityJob = new GitHubActivityJob(io); // ✅ instantiate the class
githubActivityJob.start(); // ✅ call start on the instance
cleanupOldLogs.start();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
