import { api } from '../../services/api'

export const ciAPI = {
  getPipelines: async () => {
    const response = await api.get('/ci/pipelines')
    return response.data
  },

  getPipelineDetails: async (pipelineId) => {
    const response = await api.get(`/ci/pipelines/${pipelineId}`)
    return response.data
  },

  triggerPipeline: async (pipelineId) => {
    const response = await api.post(`/ci/pipelines/${pipelineId}/trigger`)
    return response.data
  },

  cancelPipeline: async (pipelineId) => {
    const response = await api.post(`/ci/pipelines/${pipelineId}/cancel`)
    return response.data
  }
}