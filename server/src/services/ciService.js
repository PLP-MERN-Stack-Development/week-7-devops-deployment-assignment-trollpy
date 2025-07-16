const axios = require('axios');
const { githubAPI, getGithubHeaders } = require('../config/github');
const logger = require('../config/logger');

class CIService {
  async getWorkflowStatus(token, owner, repo) {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs`, {
        headers: getGithubHeaders(token),
        params: { per_page: 10 }
      });
      return response.data.workflow_runs;
    } catch (error) {
      logger.error('Error fetching workflow status:', error);
      throw error;
    }
  }

  async getWorkflowJobs(token, owner, repo, runId) {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs/${runId}/jobs`, {
        headers: getGithubHeaders(token)
      });
      return response.data.jobs;
    } catch (error) {
      logger.error('Error fetching workflow jobs:', error);
      throw error;
    }
  }

  async getBuildMetrics(token, owner, repo, days = 30) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs`, {
        headers: getGithubHeaders(token),
        params: { 
          per_page: 100,
          created: `>=${since.toISOString()}`
        }
      });

      const runs = response.data.workflow_runs;
      const metrics = {
        totalRuns: runs.length,
        successRate: 0,
        averageDuration: 0,
        failureCount: 0
      };

      if (runs.length > 0) {
        const successful = runs.filter(run => run.conclusion === 'success');
        metrics.successRate = (successful.length / runs.length) * 100;
        metrics.failureCount = runs.filter(run => run.conclusion === 'failure').length;
        
        const completedRuns = runs.filter(run => run.conclusion && run.run_started_at);
        if (completedRuns.length > 0) {
          const totalDuration = completedRuns.reduce((sum, run) => {
            const start = new Date(run.run_started_at);
            const end = new Date(run.updated_at);
            return sum + (end - start);
          }, 0);
          metrics.averageDuration = totalDuration / completedRuns.length;
        }
      }

      return metrics;
    } catch (error) {
      logger.error('Error fetching build metrics:', error);
      throw error;
    }
  }
}

module.exports = new CIService();