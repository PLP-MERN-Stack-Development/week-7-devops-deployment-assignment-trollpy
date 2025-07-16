const express = require('express');
const { clerkAuth, requireAuth } = require('../middlewares/authMiddleware');
const githubController = require('../controllers/githubController');

const router = express.Router();

router.use(clerkAuth);
router.use(requireAuth);

// Get user repositories
router.get('/repos', githubController.getRepos);

// Get repository details
router.get('/repos/:owner/:repo', githubController.getRepoDetails);

// Get recent commits
router.get('/repos/:owner/:repo/commits', githubController.getCommits);

// Get pull requests
router.get('/repos/:owner/:repo/pulls', githubController.getPullRequests);

// Get issues
router.get('/repos/:owner/:repo/issues', githubController.getIssues);

// Get repository activity
router.get('/activity', githubController.getActivity);

module.exports = router;