const axios = require('axios');
const User = require('../models/User');
const { githubAPI, getGithubHeaders } = require('../config/github');
const logger = require('../config/logger');

const getWorkflowRuns = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo } = req.params;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs`, {
      headers: getGithubHeaders(user.githubToken),
      params: {
        per_page: 20
      }
    });

    res.json({ runs: response.data.workflow_runs });
  } catch (error) {
    logger.error('Error fetching workflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch workflow runs' });
  }
};

const getWorkflowRunDetails = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo, runId } = req.params;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs/${runId}`, {
      headers: getGithubHeaders(user.githubToken)
    });

    res.json({ run: response.data });
  } catch (error) {
    logger.error('Error fetching workflow run details:', error);
    res.status(500).json({ error: 'Failed to fetch workflow run details' });
  }
};

const getWorkflowLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo, runId } = req.params;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs/${runId}/logs`, {
      headers: getGithubHeaders(user.githubToken)
    });

    res.json({ logs: response.data });
  } catch (error) {
    logger.error('Error fetching workflow logs:', error);
    res.status(500).json({ error: 'Failed to fetch workflow logs' });
  }
};

const triggerWorkflow = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { owner, repo, workflowId } = req.params;
    const { ref = 'main', inputs = {} } = req.body;
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.githubToken) {
      return res.status(400).json({ error: 'GitHub account not connected' });
    }

    const response = await githubAPI.post(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      ref,
      inputs
    }, {
      headers: getGithubHeaders(user.githubToken)
    });

    res.json({ message: 'Workflow triggered successfully' });
  } catch (error) {
    logger.error('Error triggering workflow:', error);
    res.status(500).json({ error: 'Failed to trigger workflow' });
  }
};

module.exports = {
  getWorkflowRuns,
  getWorkflowRunDetails,
  getWorkflowLogs,
  triggerWorkflow
};