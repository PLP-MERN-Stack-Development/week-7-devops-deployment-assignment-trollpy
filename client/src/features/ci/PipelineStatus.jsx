import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Play, Pause } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import { useSocket } from '../../context/SocketContext'
import { ciAPI } from './ciAPI'
import { formatDate } from '../../utils/formatDate'

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="text-green-500" size={20} />
    case 'failed':
      return <XCircle className="text-red-500" size={20} />
    case 'running':
      return <Play className="text-blue-500" size={20} />
    case 'pending':
      return <Clock className="text-yellow-500" size={20} />
    default:
      return <Pause className="text-gray-500" size={20} />
  }
}

const PipelineStatus = () => {
  const { socket } = useSocket()
  const { data: pipelines, isLoading, refetch } = useQuery({
    queryKey: ['pipelines'],
    queryFn: ciAPI.getPipelines,
  })

  useEffect(() => {
    if (socket) {
      socket.on('pipeline-update', () => {
        refetch()
      })
      return () => socket.off('pipeline-update')
    }
  }, [socket, refetch])

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
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {pipelines?.filter(p => p.status === 'success').length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Successful</div>
        </div>

        <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {pipelines?.filter(p => p.status === 'failed').length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 dark:text-white">Recent Pipelines</h4>
        {pipelines?.slice(0, 5).map((pipeline) => (
          <div key={pipeline.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded">
            <div className="flex items-center space-x-3">
              <StatusIcon status={pipeline.status} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {pipeline.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {pipeline.branch} • {formatDate(pipeline.created_at)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {pipeline.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PipelineStatus
