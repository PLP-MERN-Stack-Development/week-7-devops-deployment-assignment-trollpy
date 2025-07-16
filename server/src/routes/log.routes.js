const express = require('express');
const { clerkAuth, requireAuth } = require('../middlewares/authMiddleware');
const logController = require('../controllers/logController');

const router = express.Router();

router.use(clerkAuth);
router.use(requireAuth);

// Get logs
router.get('/', logController.getLogs);

// Create log entry
router.post('/', logController.createLog);

// Get logs by service
router.get('/service/:service', logController.getLogsByService);

// Delete old logs
router.delete('/cleanup', logController.cleanupOldLogs);

module.exports = router;