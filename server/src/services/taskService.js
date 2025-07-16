const Task = require('../models/Task');
const logger = require('../config/logger');

class TaskService {
  async getTaskStatistics(userId) {
    try {
      const stats = await Task.aggregate([
        { $match: { assignee: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const result = {
        todo: 0,
        'in-progress': 0,
        done: 0,
        total: 0
      };

      stats.forEach(stat => {
        result[stat._id] = stat.count;
        result.total += stat.count;
      });

      return result;
    } catch (error) {
      logger.error('Error fetching task statistics:', error);
      throw error;
    }
  }

  async getOverdueTasks(userId) {
    try {
      const now = new Date();
      const overdueTasks = await Task.find({
        assignee: userId,
        dueDate: { $lt: now },
        status: { $ne: 'done' }
      }).populate('project', 'name');

      return overdueTasks;
    } catch (error) {
      logger.error('Error fetching overdue tasks:', error);
      throw error;
    }
  }

  async getTasksByPriority(userId) {
    try {
      const tasks = await Task.aggregate([
        { $match: { assignee: userId, status: { $ne: 'done' } } },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]);

      const result = {
        high: 0,
        medium: 0,
        low: 0
      };

      tasks.forEach(task => {
        result[task._id] = task.count;
      });

      return result;
    } catch (error) {
      logger.error('Error fetching tasks by priority:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();