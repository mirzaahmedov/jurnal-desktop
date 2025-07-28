import axios from 'axios'

import { useAuthenticationStore } from '@/common/features/auth'

export const baseURL = import.meta.env.DEV
  ? 'http://192.168.77.9:8089/api'
  : 'https://nafaqa.fizmasoft.uz/zarplata/api'

export interface ZarplataPaginationParams {
  PageIndex: number
  PageSize: number
}
export interface ZarplataApiResponse<T> {
  totalCount: number
  data: T
}

export const zarplataApiNew = axios.create({
  baseURL
})

zarplataApiNew.interceptors.request.use(
  (config) => {
    const token = useAuthenticationStore.getState().token
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

zarplataApiNew.interceptors.response.use(
  (config) => config,
  (error) => {
    const message = error?.response?.data?.message
    console.log('API Error:', message || error.message, 'Response', error?.response)
    if (message) {
      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  }
)
