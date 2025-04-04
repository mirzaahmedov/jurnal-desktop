import type { DocumentType, queryKeys } from './config'
import type { Response } from '@/common/models'

import { type QueryFunctionContext } from '@tanstack/react-query'

import { getMainschetId } from '@/common/features/requisites'
import { http } from '@/common/lib/http'

interface GetDocumentNumberResponse {
  doc_num: number
}

export type GetDocumentNumberQueryKey = [
  typeof queryKeys.getDocumentNumber,
  { documentType: DocumentType }
]
export const getDocumentNumberQuery = async (
  ctx: QueryFunctionContext<GetDocumentNumberQueryKey>
) => {
  const { documentType } = ctx.queryKey[1]
  const res = await http.get<Response<GetDocumentNumberResponse>>(
    `/features/doc/num/${documentType}`,
    {
      params: {
        main_schet_id: getMainschetId()
      }
    }
  )
  return res.data?.data?.doc_num
}
