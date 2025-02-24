export type ResponseMeta = {
  backPage: number | null
  count: number
  currentPage: number
  nextPage: number | null
  pageCount: number
}

export type Response<T, M = ResponseMeta> =
  | {
      success: true
      data: T
      meta: M extends undefined ? ResponseMeta : M
      message?: string
    }
  | {
      success: false
      code: number
      message: string
      data: undefined
      meta?: any
      time: string
    }
