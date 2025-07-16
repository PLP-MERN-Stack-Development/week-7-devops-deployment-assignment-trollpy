const cron = require('node-cron');
const { Octokit } = require('@octokit/rest');
const User = require('../models/User');
const logger = require('../config/logger');

class GitHubActivityJob {
  constructor(io) {
    this.io = io;
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  // Fetch user's GitHub activity
  async fetchUserActivity(user) {
    try {
      if (!user.githubToken) {
        logger.warn(`No GitHub token found for user: ${user.email}`);
        return null;
      }

      const userOctokit = new Octokit({
        auth: user.githubToken
      });

      // Get user's repositories
      const { data: repos } = await userOctokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 10
      });

      // Get recent commits across repositories
      const commits = [];
      for (const repo of repos.slice(0, 5)) { // Limit to 5 repos to avoid rate limiting
        try {
          const { data: repoCommits } = await userOctokit.rest.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            per_page: 5,
            since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
          });

          commits.push(...repoCommits.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
            repository: repo.name,
            url: commit.html_url
          })));
        } catch (error) {
          logger.error(`Error fetching commits for repo ${repo.name}:`, error.message);
        }
      }

      // Get recent pull requests
      const pullRequests = [];
      for (const repo of repos.slice(0, 3)) {
        try {
          const { data: prs } = await userOctokit.rest.pulls.list({
            owner: repo.owner.login,
            repo: repo.name,
            state: 'all',
            per_page: 5,
            sort: 'updated'
          });

          pullRequests.push(...prs.map(pr => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state,
            created_at: pr.created_at,
            updated_at: pr.updated_at,
            repository: repo.name,
            url: pr.html_url,
            author: pr.user.login
          })));
        } catch (error) {
          logger.error(`Error fetching PRs for repo ${repo.name}:`, error.message);
        }
      }

      // Get recent issues
      const issues = [];
      for (const repo of repos.slice(0, 3)) {
        try {
          const { data: repoIssues } = await userOctokit.rest.issues.listForRepo({
            owner: repo.owner.login,
            repo: repo.name,
            state: 'all',
            per_page: 5,
            sort: 'updated'
          });

          issues.push(...repoIssues.map(issue => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            state: issue.state,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            repository: repo.name,
            url: issue.html_url,
            author: issue.user.login
          })));
        } catch (error) {
          logger.error(`Error fetching issues for repo ${repo.name}:`, error.message);
        }
      }

      const activity = {
        userId: user._id,
        timestamp: new Date(),
        repositories: repos.map(repo => ({
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updated_at: repo.updated_at,
          url: repo.html_url
        })),
        commits: commits.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
        pullRequests: pullRequests.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 10),
        issues: issues.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 10)
      };

      return activity;
    } catch (error) {
      logger.error(`Error fetching GitHub activity for user ${user.email}:`, error.message);
      return null;
    }
  }

  // Update all users' GitHub activity
  async updateAllUsersActivity() {
    try {
      logger.info('Starting GitHub activity update job');
      
      const users = await User.find({ githubToken: { $exists: true, $ne: null } });
      logger.info(`Found ${users.length} users with GitHub tokens`);

      for (const user of users) {
        const activity = await this.fetchUserActivity(user);
        
        if (activity) {
          // Update user's GitHub activity in database
          await User.findByIdAndUpdate(user._id, {
            $set: {
              githubActivity: activity,
              lastGithubSync: new Date()
            }
          });

          // Emit real-time update to user's connected clients
          this.io.to(`user-${user._id}`).emit('github-activity-update', activity);
          
          logger.info(`Updated GitHub activity for user: ${user.email}`);
        }

        // Add delay to respect GitHub API rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      logger.info('GitHub activity update job completed');
    } catch (error) {
      logger.error('Error in GitHub activity update job:', error.message);
    }
  }

  // Start the scheduled job
  start() {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', () => {
      this.updateAllUsersActivity();
    });

    // Run once on startup
    setTimeout(() => {
      this.updateAllUsersActivity();
    }, 5000);

    logger.info('GitHub activity job scheduled to run every 15 minutes');
  }

  // Stop the job
  stop() {
    cron.destroy();
    logger.info('GitHub activity job stopped');
  }
}

module.exports = GitHubActivityJob;