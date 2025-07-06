import axios from 'axios'

import { useAuthenticationStore } from '@/common/features/auth'

export const baseURL = 'https://nafaqa.fizmasoft.uz/zarplata/api'

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
