const express = require('express');
const { clerkAuth, requireAuth } = require('../middlewares/authMiddleware');
const ciController = require('../controllers/ciController');

const router = express.Router();

router.use(clerkAuth);
router.use(requireAuth);

// Get workflow runs
router.get('/workflows/:owner/:repo', ciController.getWorkflowRuns);

// Get workflow run details
router.get('/workflows/:owner/:repo/runs/:runId', ciController.getWorkflowRunDetails);

// Get workflow run logs
router.get('/workflows/:owner/:repo/runs/:runId/logs', ciController.getWorkflowLogs);

// Trigger workflow
router.post('/workflows/:owner/:repo/:workflowId/dispatch', ciController.triggerWorkflow);

module.exports = router;