import { useState, useEffect } from 'react'
import { GitBranch, GitCommit, GitPullRequest, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { githubAPI } from './githubAPI'
import { formatDate } from '../../utils/formatDate'

const GithubPanel = () => {
  const { data: repos, isLoading } = useQuery({
    queryKey: ['github-repos'],
    queryFn: githubAPI.getRepos,
  })

  const { data: commits } = useQuery({
    queryKey: ['github-commits'],
    queryFn: githubAPI.getRecentCommits,
  })

  const { data: prs } = useQuery({
    queryKey: ['github-prs'],
    queryFn: githubAPI.getPullRequests,
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <GitBranch className="mx-auto mb-2 text-blue-500" size={24} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {repos?.length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Repos</div>
        </div>

        <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <GitCommit className="mx-auto mb-2 text-green-500" size={24} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {commits?.length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Commits</div>
        </div>

        <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <GitPullRequest className="mx-auto mb-2 text-purple-500" size={24} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {prs?.length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">PRs</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 dark:text-white">Recent Commits</h4>
        {commits?.slice(0, 5).map((commit) => (
          <div
            key={commit.sha}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-700 rounded"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {commit.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {commit.author} • {formatDate(commit.date)}
              </p>
            </div>
            <div className="ml-2 flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {commit.sha.substring(0, 7)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GithubPanel
