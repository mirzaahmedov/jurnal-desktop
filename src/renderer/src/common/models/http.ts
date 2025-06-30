export interface SummaObject {
  prixod_summa: number
  rasxod_summa: number
  summa: number
}

export interface ApiResponseMeta {
  backPage: number | null
  count: number
  currentPage: number
  nextPage: number | null
  pageCount: number
}

export type ApiResponse<T, M = ApiResponseMeta> =
  | {
      success: true
      data: T
      meta?: M extends undefined ? ApiResponseMeta : M
      message?: string
    }
  | {
      success: false
      code: number
      message: string
      data: undefined
      meta?: null
      time: string
    }
