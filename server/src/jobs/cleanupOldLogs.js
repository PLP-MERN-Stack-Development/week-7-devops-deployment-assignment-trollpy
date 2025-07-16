const cron = require('node-cron');
const Log = require('../models/Log');
const logger = require('../config/logger');

// Run daily at 2 AM
const cleanupOldLogs = cron.schedule('0 2 * * *', async () => {
  try {
    logger.info('Starting log cleanup job');
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await Log.deleteMany({
      timestamp: { $lt: thirtyDaysAgo }
    });
    
    logger.info(`Cleaned up ${result.deletedCount} old log entries`);
  } catch (error) {
    logger.error('Error in log cleanup job:', error);
  }
}, {
  scheduled: false
});

module.exports = cleanupOldLogs;