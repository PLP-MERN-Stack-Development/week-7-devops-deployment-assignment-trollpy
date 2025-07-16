import { useState, useEffect } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskAPI } from './taskAPI'
import TaskItem from './TaskItem'
import toast from 'react-hot-toast'

const TaskBoard = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' })
  const queryClient = useQueryClient()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskAPI.getTasks
  })

  const addTaskMutation = useMutation({
    mutationFn: taskAPI.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setShowAddForm(false)
      setNewTask({ title: '', description: '', priority: 'medium' })
      toast.success('Task created successfully')
    },
    onError: () => {
      toast.error('Failed to create task')
    }
  })

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.title.trim()) {
      addTaskMutation.mutate(newTask)
    }
  }

  const tasksByStatus = {
    todo: tasks?.filter(task => task.status === 'todo') || [],
    inProgress: tasks?.filter(task => task.status === 'in-progress') || [],
    done: tasks?.filter(task => task.status === 'done') || []
  }

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              {tasksByStatus.todo.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Todo</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              {tasksByStatus.inProgress.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">In Progress</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              {tasksByStatus.done.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Done</span>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-500"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            autoFocus
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            rows="2"
          />
          <div className="flex items-center justify-between">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addTaskMutation.isLoading}
                className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {addTaskMutation.isLoading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {tasks?.slice(0, 10).map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}

        {tasks?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tasks yet. Create your first task!
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskBoard
