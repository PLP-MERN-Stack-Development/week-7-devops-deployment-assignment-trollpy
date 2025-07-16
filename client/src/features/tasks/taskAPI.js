import { api } from '../../services/api'

export const taskAPI = {
  getTasks: async () => {
    const response = await api.get('/tasks')
    return response.data
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData)
    return response.data
  },

  updateTask: async ({ id, ...taskData }) => {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`)
    return response.data
  },

  getTaskById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`)
    return response.data
  }
}