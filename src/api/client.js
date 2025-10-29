import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 15000,
})

api.interceptors.request.use(config => {
  // attach auth token here when available
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    // centralize error handling/logging if needed
    return Promise.reject(error)
  }
)

export default api
