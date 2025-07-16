const axios = require('axios');
const { githubAPI, getGithubHeaders } = require('../config/github');
const logger = require('../config/logger');

class GithubService {
  async fetchUserActivity(token) {
    try {
      const response = await githubAPI.get('/user/events', {
        headers: getGithubHeaders(token),
        params: { per_page: 30 }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching GitHub activity:', error);
      throw error;
    }
  }

  async fetchRepoWorkflows(token, owner, repo) {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/workflows`, {
        headers: getGithubHeaders(token)
      });
      return response.data.workflows;
    } catch (error) {
      logger.error('Error fetching workflows:', error);
      throw error;
    }
  }

  async fetchRepoStatus(token, owner, repo) {
    try {
      const [repoRes, commitsRes, prRes, issuesRes] = await Promise.all([
        githubAPI.get(`/repos/${owner}/${repo}`, { headers: getGithubHeaders(token) }),
        githubAPI.get(`/repos/${owner}/${repo}/commits`, { 
          headers: getGithubHeaders(token), 
          params: { per_page: 5 } 
        }),
        githubAPI.get(`/repos/${owner}/${repo}/pulls`, { 
          headers: getGithubHeaders(token), 
          params: { state: 'open', per_page: 5 } 
        }),
        githubAPI.get(`/repos/${owner}/${repo}/issues`, { 
          headers: getGithubHeaders(token), 
          params: { state: 'open', per_page: 5 } 
        })
      ]);

      return {
        repo: repoRes.data,
        commits: commitsRes.data,
        pullRequests: prRes.data,
        issues: issuesRes.data
      };
    } catch (error) {
      logger.error('Error fetching repo status:', error);
      throw error;
    }
  }
}

module.exports = new GithubService();