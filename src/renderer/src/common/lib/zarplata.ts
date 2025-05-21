import axios from 'axios'

export const baseURL = 'https://nafaqa.fizmasoft.uz/zarplata/api'

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
