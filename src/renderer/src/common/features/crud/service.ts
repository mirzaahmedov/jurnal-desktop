import type {
  CRUDServiceOptions,
  GetAllQueryKey,
  GetByIdQueryKey,
  MiddlewareFunction,
  RequestBuilderFunction
} from './definition'
import type { ApiEndpoints } from '@/common/features/crud'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import { api } from '@/common/lib/http'

export class CRUDService<T, C = T, U = C, M = undefined> {
  public middleware: MiddlewareFunction[]
  public endpoint: ApiEndpoints
  public client: AxiosInstance
  public options: CRUDServiceOptions<T, M>
  public requestBuilder?: RequestBuilderFunction

  constructor(options: CRUDServiceOptions<T, M>) {
    this.options = options
    this.endpoint = options.endpoint
    this.client = options.client ?? api
    this.middleware = []

    this.getAll = this.getAll.bind(this)
    this.getById = this.getById.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  async getAll(ctx: QueryFunctionContext<GetAllQueryKey>) {
    const params = ctx.queryKey[1]
    const defaultConfig = { params }
    const buildArgs = {
      endpoint: this.endpoint,
      ctx,
      config: defaultConfig
    }

    const config = this.requestBuilder?.('getAll', buildArgs)?.config ?? defaultConfig
    const url = this.requestBuilder?.('getAll', buildArgs)?.url ?? `/${this.endpoint}`

    if (config.params?.onChange) {
      delete config.params.onChange
      delete config.params._invisibleToggle
    }

    const res = await this.client.get<ApiResponse<T[], M>>(url, this.proccessMiddleware(config))

    return this.options.getRequestData?.getAll
      ? this.options.getRequestData?.getAll(res.data as ApiResponse<any>)
      : res.data
  }

  async getById(ctx: QueryFunctionContext<GetByIdQueryKey>) {
    const id = ctx.queryKey[1]
    const params = ctx.queryKey[2]
    const defaultConfig = { params }
    const buildArgs = {
      endpoint: this.endpoint,
      ctx,
      config: defaultConfig
    }

    if (!id) {
      throw new Error('Id is required for getById method')
    }

    const config = this.requestBuilder?.('getById', buildArgs)?.config ?? defaultConfig
    const url = this.requestBuilder?.('getById', buildArgs)?.url ?? `/${this.endpoint}/${id}`

    const res = await this.client.get<ApiResponse<T, M>>(url, this.proccessMiddleware(config))

    return res.data
  }

  async create(payload: C) {
    const defaultConfig = {}
    const buildArgs = {
      endpoint: this.endpoint,
      config: defaultConfig,
      payload
    }

    const config = this.requestBuilder?.('create', buildArgs)?.config ?? defaultConfig
    const url = this.requestBuilder?.('create', buildArgs)?.url ?? `/${this.endpoint}`

    const res = await this.client.post<ApiResponse<string, M>>(
      url,
      payload,
      this.proccessMiddleware(config)
    )

    return res.data
  }

  async update(payload: U & { id?: number }) {
    const id = payload.id
    const defaultConfig = {}
    const buildArgs = {
      endpoint: this.endpoint,
      config: defaultConfig,
      payload
    }

    delete payload.id

    const config = this.requestBuilder?.('update', buildArgs)?.config ?? defaultConfig
    const url = this.requestBuilder?.('update', buildArgs)?.url ?? `/${this.endpoint}/${id}`

    const res = await this.client.put<ApiResponse<string, M>>(
      url,
      payload,
      this.proccessMiddleware(config)
    )

    return res.data
  }

  async delete(id: number) {
    const defaultConfig = {}
    const buildArgs = {
      endpoint: this.endpoint,
      config: defaultConfig,
      payload: id
    }

    const config = this.requestBuilder?.('delete', buildArgs)?.config ?? defaultConfig
    const url = this.requestBuilder?.('delete', buildArgs)?.url ?? `/${this.endpoint}/${id}`

    const res = await this.client.delete<ApiResponse<string, M>>(
      url,
      this.proccessMiddleware(config)
    )

    return res.data
  }

  forRequest(func: RequestBuilderFunction) {
    this.requestBuilder = func
    return this
  }

  use(...middleware: MiddlewareFunction[]) {
    this.middleware.push(...middleware)
    return this
  }

  proccessMiddleware(config: AxiosRequestConfig) {
    return this.middleware.reduce((result, transformer) => transformer(result), config)
  }
}
