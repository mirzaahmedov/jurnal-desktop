import axios from 'axios'

export const baseURL = 'http://147.45.107.174:5001/api'

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
