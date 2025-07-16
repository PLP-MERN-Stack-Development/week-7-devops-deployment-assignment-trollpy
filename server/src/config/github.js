const axios = require('axios');

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Developer-Workflow-Dashboard'
  }
});

const getGithubHeaders = (token) => ({
  'Authorization': `token ${token}`,
  'Accept': 'application/vnd.github.v3+json'
});

module.exports = {
  githubAPI,
  getGithubHeaders
};