export interface SummaObject {
  prixod_summa: number
  rasxod_summa: number
  summa: number
}

export interface ResponseMeta {
  backPage: number | null
  count: number
  currentPage: number
  nextPage: number | null
  pageCount: number

  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number

  summa_from_object?: SummaObject
  summa_to_object?: SummaObject
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
      meta?: null
      time: string
    }
