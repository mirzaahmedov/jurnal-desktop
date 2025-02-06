import type { APIEndpoints } from '@renderer/common/features/crud'
import { http } from '@renderer/common/lib/http'

interface GetDocumentNumberResponse {
  doc_num: number
}

export const useDocumentNumber = (endpoint: APIEndpoints) => {
  const res = await http.get("")
}
