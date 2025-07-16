const Task = require('../models/Task');
const logger = require('../config/logger');

const getTasks = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { status, project } = req.query;

    const filter = { assignee: userId };
    if (status) filter.status = status;
    if (project) filter.project = project;

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .sort({ order: 1, createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    const { userId } = req.auth;
    const taskData = { ...req.body, assignee: userId };

    const task = new Task(taskData);
    await task.save();

    const populatedTask = await Task.findById(task._id).populate('project', 'name');

    // Emit to socket room
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('task-created', populatedTask);

    res.status(201).json({ task: populatedTask });
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, assignee: userId })
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    logger.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, assignee: userId },
      { $set: updates },
      { new: true }
    ).populate('project', 'name');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Emit to socket room
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('task-updated', task);

    res.json({ task });
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, assignee: userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Emit to socket room
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('task-deleted', { id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

const updateTaskOrder = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { tasks } = req.body; // Array of { id, order, status }

    const updatePromises = tasks.map(({ id, order, status }) => 
      Task.findOneAndUpdate(
        { _id: id, assignee: userId },
        { $set: { order, status } },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Task order updated successfully' });
  } catch (error) {
    logger.error('Error updating task order:', error);
    res.status(500).json({ error: 'Failed to update task order' });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskOrder
};