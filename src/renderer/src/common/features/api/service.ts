import type { AxiosInstance } from 'axios'

type ServiceMethods = {
  create?: (data: any) => any
  update?: (id: string, data: any) => any
  getAll?: () => any
  getById?: (id: string) => any
  delete?: (id: string) => any
}

export interface ServiceBuilderParams {
  resource: string
  api: AxiosInstance
}

export class ServiceBuilder<TMethods extends ServiceMethods = {}> {
  private resource: string
  private api: AxiosInstance

  private methods: string[] = []

  private constructor({ resource, api }: ServiceBuilderParams) {
    this.resource = resource
    this.api = api
  }

  static createService<TMethods extends ServiceMethods = {}>(params: ServiceBuilderParams) {
    return new ServiceBuilder<TMethods>(params)
  }

  withCreate<TCreate, TResult>() {
    this.methods.push('create')
    type Added = { create: (data: TCreate) => Promise<TResult> }
    const next = this as unknown as ServiceBuilder<TMethods & Added>
    return next
  }

  withUpdate<TUpdate, TResult>() {
    this.methods.push('update')
    type Added = { update: (id: string, data: TUpdate) => Promise<TResult> }
    const next = this as unknown as ServiceBuilder<TMethods & Added>
    return next
  }

  withGetAll<TResult>() {
    this.methods.push('getAll')
    type Added = { getAll: () => Promise<TResult> }
    const next = this as unknown as ServiceBuilder<TMethods & Added>
    return next
  }

  withGetById<TResult>() {
    this.methods.push('getById')
    type Added = { getById: (id: string) => Promise<TResult> }
    const next = this as unknown as ServiceBuilder<TMethods & Added>
    return next
  }

  withDelete<TResult>() {
    this.methods.push('delete')
    type Added = { delete: (id: string) => Promise<TResult> }
    const next = this as unknown as ServiceBuilder<TMethods & Added>
    return next
  }

  build(): TMethods {
    const base = {
      create: async (data: any) => {
        const res = await this.api.post(`${this.resource}`, data)
        return res.data
      },
      update: async (id: string, data: any) => {
        const res = await this.api.put(`${this.resource}/${id}`, data)
        return res.data
      },
      getAll: async () => {
        const res = await this.api.get(`${this.resource}`)
        return res.data
      },
      getById: async (id: string) => {
        const res = await this.api.get(`${this.resource}/${id}`)
        return res.data
      },
      delete: async (id: string) => {
        const res = await this.api.delete(`${this.resource}/${id}`)
        return res.data
      }
    }

    const implemented = Object.keys(base)
      .filter((k) => this.methods.includes(k))
      .reduce((obj, key) => {
        ;(obj as any)[key] = (base as any)[key]
        return obj
      }, {} as any)

    return implemented as TMethods
  }
}
