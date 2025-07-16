const express = require('express');
const { clerkAuth, requireAuth } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(clerkAuth);

// Sync user with database
router.post('/sync', requireAuth, authController.syncUser);

// Get user profile
router.get('/profile', requireAuth, authController.getProfile);

// Update user profile
router.put('/profile', requireAuth, authController.updateProfile);

// Connect GitHub account
router.post('/github/connect', requireAuth, authController.connectGithub);

// Disconnect GitHub account
router.delete('/github/disconnect', requireAuth, authController.disconnectGithub);

module.exports = router;