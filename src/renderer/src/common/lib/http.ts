import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import axios from 'axios'
import i18next from 'i18next'

import { useAuthStore } from '@/common/features/auth'

type ErrorResponse = {
  success: false
  message: string
}

// ? 'http://147.45.107.174:3005'
// ? 'http://10.50.0.140:3006'
// ? 'http://10.51.2.242:3005'
// ? 'http://192.168.5.45:3005'
const baseURL = import.meta.env.DEV
  ? 'http://192.168.5.45:3005'
  : import.meta.env.VITE_MODE === 'staging'
    ? 'http://147.45.107.174:3005'
    : 'http://10.50.0.140:3005'

const http = axios.create({
  baseURL
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers['x-app-lang'] = i18next.language

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

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (!error) {
      throw new Error('Something went wrong :(')
    }

    if (!axios.isAxiosError(error)) {
      throw error
    }

    const response = error.response
    if (response) {
      const data = response.data as ErrorResponse
      const message = data?.message || (error as AxiosError)?.message
      throw new Error(message)
    }

    const message = (error as AxiosError)?.message
    throw new Error(message)
  }
)

export { http }
