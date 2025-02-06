import type { DocumentType, queryKeys } from './config'
import type { Response } from '@renderer/common/models'

import { getMainschetId } from '@renderer/common/features/requisites'
import { http } from '@renderer/common/lib/http'
import { type QueryFunctionContext } from '@tanstack/react-query'

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
