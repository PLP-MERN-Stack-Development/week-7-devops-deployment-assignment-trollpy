const express = require('express');
const { clerkAuth, requireAuth } = require('../middlewares/authMiddleware');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(clerkAuth);
router.use(requireAuth);

// Get all tasks
router.get('/', taskController.getTasks);

// Create task
router.post('/', taskController.createTask);

// Get task by ID
router.get('/:id', taskController.getTaskById);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

// Update task order
router.put('/order/update', taskController.updateTaskOrder);

module.exports = router;