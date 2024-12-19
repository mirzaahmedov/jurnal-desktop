import type { InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useAuthStore } from '@/common/features/auth'

// ? 'http://147.45.107.174:3005'
// ? 'http://10.50.0.140:3006'
// ? 'http://10.51.2.242:3005'
const baseURL = import.meta.env.DEV
  ? 'http://10.50.0.140:3006'
  : import.meta.env.VITE_MODE === 'staging'
    ? 'http://10.50.0.140:3006'
    : 'http://10.50.0.140:3005'

const http = axios.create({
  baseURL
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.withCredentials === false) {
    return config
  }

  const { token } = useAuthStore.getState()
  if (!token) {
    throw new Error('No access token')
  }

  config.headers.Authorization = `Bearer ${token}`
  return config
})

export { http }
