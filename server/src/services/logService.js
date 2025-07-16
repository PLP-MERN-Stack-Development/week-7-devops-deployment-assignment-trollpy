const Log = require('../models/Log');
const logger = require('../config/logger');

class LogService {
  async createLog(userId, service, level, message, metadata = {}) {
    try {
      const log = new Log({
        userId,
        service,
        level,
        message,
        metadata
      });
      await log.save();
      return log;
    } catch (error) {
      logger.error('Error creating log:', error);
      throw error;
    }
  }

  async getLogMetrics(userId, service, days = 7) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const logs = await Log.find({
        userId,
        service,
        timestamp: { $gte: since }
      });

      const metrics = {
        total: logs.length,
        byLevel: {
          error: 0,
          warn: 0,
          info: 0,
          debug: 0
        },
        byDay: []
      };

      logs.forEach(log => {
        metrics.byLevel[log.level]++;
      });

      // Group by day
      const dayGroups = {};
      logs.forEach(log => {
        const day = log.timestamp.toISOString().split('T')[0];
        if (!dayGroups[day]) {
          dayGroups[day] = 0;
        }
        dayGroups[day]++;
      });

      metrics.byDay = Object.entries(dayGroups).map(([date, count]) => ({
        date,
        count
      }));

      return metrics;
    } catch (error) {
      logger.error('Error fetching log metrics:', error);
      throw error;
    }
  }

  async searchLogs(userId, query, filters = {}) {
    try {
      const searchFilter = { userId };
      
      if (query) {
        searchFilter.$text = { $search: query };
      }
      
      if (filters.service) {
        searchFilter.service = filters.service;
      }
      
      if (filters.level) {
        searchFilter.level = filters.level;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        searchFilter.timestamp = {};
        if (filters.dateFrom) {
          searchFilter.timestamp.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          searchFilter.timestamp.$lte = new Date(filters.dateTo);
        }
      }

      const logs = await Log.find(searchFilter)
        .sort({ timestamp: -1 })
        .limit(100);

      return logs;
    } catch (error) {
      logger.error('Error searching logs:', error);
      throw error;
    }
  }
}

module.exports = new LogService();