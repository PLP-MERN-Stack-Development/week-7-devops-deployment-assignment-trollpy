import { api } from '../../services/api'

export const githubAPI = {
  getRepos: async () => {
    const response = await api.get('/github/repos')
    return response.data
  },

  getRecentCommits: async () => {
    const response = await api.get('/github/commits')
    return response.data
  },

  getPullRequests: async () => {
    const response = await api.get('/github/pulls')
    return response.data
  },

  getRepoStats: async (repoId) => {
    const response = await api.get(`/github/repos/${repoId}/stats`)
    return response.data
  }
}