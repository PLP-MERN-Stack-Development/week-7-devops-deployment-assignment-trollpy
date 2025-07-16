import { useState } from 'react'
import { Check, Clock, AlertCircle, MoreHorizontal } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from './taskAPI'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const TaskItem = ({ task }) => {
  const [showMenu, setShowMenu] = useState(false)
  const queryClient = useQueryClient()

  const updateTaskMutation = useMutation(taskAPI.updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks')
      toast.success('Task updated')
    },
    onError: () => {
      toast.error('Failed to update task')
    }
  })

  const deleteTaskMutation = useMutation(taskAPI.deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks')
      toast.success('Task deleted')
    },
    onError: () => {
      toast.error('Failed to delete task')
    }
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <Check size={16} className="text-green-500" />
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />
      default:
        return <AlertCircle size={16} className="text-gray-500" />
    }
  }

  const handleStatusChange = (newStatus) => {
    updateTaskMutation.mutate({
      id: task.id,
      status: newStatus
    })
    setShowMenu(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(task.id)
    }
    setShowMenu(false)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        {getStatusIcon(task.status)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {task.description}
            </p>
          )}
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(task.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <MoreHorizontal size={16} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg border border-gray-200 dark:border-dark-600 z-10">
            <div className="py-1">
              <button
                onClick={() => handleStatusChange('todo')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Mark as Todo
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Mark as In Progress
              </button>
              <button
                onClick={() => handleStatusChange('done')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Mark as Done
              </button>
              <hr className="my-1 border-gray-200 dark:border-dark-600" />
              <button
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskItem