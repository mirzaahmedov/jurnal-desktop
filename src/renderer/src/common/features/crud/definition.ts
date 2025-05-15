import type { ApiEndpoints } from './config'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

export type QueryKeyParams = {
  main_schet_id?: number
  page?: number
  limit?: number
  from?: string
  to?: string
} & {
  [key: string]: unknown
}

export type GetAllQueryKey = [string, queryParams?: QueryKeyParams, ...unknown[]]
export type GetByIdQueryKey = [string, number?, queryParams?: QueryKeyParams, ...unknown[]]

export type BuilderFunctionArgs<T> = {
  ctx?: QueryFunctionContext
  root: string
  config: AxiosRequestConfig
  payload?: T
}

export type MiddlewareFunction<T extends AxiosRequestConfig = AxiosRequestConfig> = (config: T) => T

export type CRUDServiceMethodType = 'getAll' | 'getById' | 'create' | 'update' | 'delete'

export type RequestBuilderArgs = {
  endpoint: string
  config: AxiosRequestConfig
  payload?: unknown
  ctx?: QueryFunctionContext
}

export type RequestBuilderReturnType = {
  url?: string
  config?: AxiosRequestConfig
}

export type RequestBuilderFunction = (
  type: CRUDServiceMethodType,
  args: RequestBuilderArgs
) => RequestBuilderReturnType

export type CRUDServiceOptions<T, M> = {
  endpoint: ApiEndpoints
  client?: AxiosInstance
  getRequestData?: {
    getAll: (res: ApiResponse<any>) => ApiResponse<T[], M>
  }
}
