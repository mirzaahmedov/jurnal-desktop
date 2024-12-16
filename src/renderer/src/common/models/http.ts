type ResponseMeta = {
  backPage: number | null
  count: number
  currentPage: number
  nextPage: number | null
  pageCount: number
}

type Response<T, M = ResponseMeta> = {
  success: boolean
  data: T
  meta: M extends undefined ? ResponseMeta : M
}

export type { Response, ResponseMeta }
