import type { ApiResponse } from '@/common/models'

import axios from 'axios'
import { toast } from 'react-toastify'

// export const baseURL = 'http://10.50.0.140:8091/api'
export const baseURL =
  import.meta.env.VITE_MODE === 'prod'
    ? 'http://10.50.0.140:8091/api'
    : 'https://nafaqa.fizmasoft.uz/zarplata/api'

export interface PaginationParams {
  PageIndex: number
  PageSize: number
}
export interface Response<T> {
  totalCount: number
  data: T
}

export const zarplataApi = axios.create({
  baseURL
})

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

zarplataApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
      const message = error.response?.data?.message || error.message || 'An error occurred'
      toast.error(message)
      return Promise.reject(new Error(message))
    } else {
      // Handle non-Axios errors
      toast.error('An unexpected error occurred')
      return Promise.reject(new Error('An unexpected error occurred'))
    }
  }
)
