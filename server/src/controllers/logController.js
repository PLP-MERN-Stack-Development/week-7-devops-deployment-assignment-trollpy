const Log = require('../models/Log');
const logger = require('../config/logger');

const getLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { service, level, limit = 50, page = 1 } = req.query;

    const filter = { userId };
    if (service) filter.service = service;
    if (level) filter.level = level;

    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Log.countDocuments(filter);

    res.json({ 
      logs, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

const createLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { service, level, message, metadata } = req.body;

    const log = new Log({
      service,
      level,
      message,
      metadata,
      userId
    });

    await log.save();

    // Emit to socket room
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('new-log', log);

    res.status(201).json({ log });
  } catch (error) {
    logger.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
};

const getLogsByService = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { service } = req.params;
    const { limit = 50 } = req.query;

    const logs = await Log.find({ userId, service })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({ logs });
  } catch (error) {
    logger.error('Error fetching logs by service:', error);
    res.status(500).json({ error: 'Failed to fetch logs by service' });
  }
};

const cleanupOldLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await Log.deleteMany({
      userId,
      timestamp: { $lt: thirtyDaysAgo }
    });

    res.json({ message: `Deleted ${result.deletedCount} old log entries` });
  } catch (error) {
    logger.error('Error cleaning up old logs:', error);
    res.status(500).json({ error: 'Failed to cleanup old logs' });
  }
};

module.exports = {
  getLogs,
  createLog,
  getLogsByService,
  cleanupOldLogs
};