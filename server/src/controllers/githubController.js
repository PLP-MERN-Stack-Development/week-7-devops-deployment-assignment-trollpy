const axios = require('axios');
const User = require('../models/User');
const { githubAPI, getGithubHeaders } = require('../config/github');
const logger = require('../config/logger');

const getRepos = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get('/user/repos', {
      headers: getGithubHeaders(user.githubToken),
      params: {
        sort: 'updated',
        per_page: 50
      }
    });

    res.json({ repos: response.data });
  } catch (error) {
    logger.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
};

const getRepoDetails = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo } = req.params;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get(`/repos/${owner}/${repo}`, {
      headers: getGithubHeaders(user.githubToken)
    });

    res.json({ repo: response.data });
  } catch (error) {
    logger.error('Error fetching repository details:', error);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
};

const getCommits = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo } = req.params;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get(`/repos/${owner}/${repo}/commits`, {
      headers: getGithubHeaders(user.githubToken),
      params: {
        per_page: 20
      }
    });

    res.json({ commits: response.data });
  } catch (error) {
    logger.error('Error fetching commits:', error);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
};

const getPullRequests = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo } = req.params;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get(`/repos/${owner}/${repo}/pulls`, {
      headers: getGithubHeaders(user.githubToken),
      params: {
        state: 'all',
        per_page: 20
      }
    });

    res.json({ pulls: response.data });
  } catch (error) {
    logger.error('Error fetching pull requests:', error);
    res.status(500).json({ error: 'Failed to fetch pull requests' });
  }
};

const getIssues = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo } = req.params;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get(`/repos/${owner}/${repo}/issues`, {
      headers: getGithubHeaders(user.githubToken),
      params: {
        state: 'all',
        per_page: 20
      }
    });

    res.json({ issues: response.data });
  } catch (error) {
    logger.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};

const getActivity = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get('/user/events', {
      headers: getGithubHeaders(user.githubToken),
      params: {
        per_page: 30
      }
    });

    res.json({ activity: response.data });
  } catch (error) {
    logger.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

module.exports = {
  getRepos,
  getRepoDetails,
  getCommits,
  getPullRequests,
  getIssues,
  getActivity
};