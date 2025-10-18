import type { ApiResponse } from '../models'

import axios from 'axios'

import { useAuthStore } from '@/common/features/auth'

export const baseURL =
  import.meta.env.VITE_MODE === 'prod'
    ? 'http://10.50.0.140:8091/api'
    : 'https://nafaqa.fizmasoft.uz/zarplata/api'
// export const baseURL = 'http://10.50.0.140:8091/api'

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
    const token = useAuthStore.getState().token
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
export const getMultiApiResponse = <T>({
  response,
  page = 0,
  limit = 0
}: {
  response: Response<T>
  page: number
  limit: number
}): ApiResponse<T> => {
  const pageCount = Math.ceil(response.totalCount / limit)
  const backPage = response.totalCount > 0 && page > 1 ? page - 1 : null
  const nextPage = response.totalCount > 0 && page < pageCount ? page + 1 : null
  return {
    success: true,
    message: 'OK',
    data: response.data,
    meta: {
      count: response.totalCount,
      pageCount,
      backPage,
      nextPage,
      currentPage: page
    }
  }
}

export const getSingleApiResponse = <T>({ response }: { response: T }): ApiResponse<T> => {
  return {
    success: true,
    message: 'OK',
    data: response
  } as ApiResponse<T>
}

export interface Response<T> {
  totalCount: number
  data: T
}
