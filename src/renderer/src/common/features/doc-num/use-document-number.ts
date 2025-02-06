import { useEffect } from 'react'

import { useEventCallback } from '@renderer/common/hooks'
import { useQuery } from '@tanstack/react-query'

import { type DocumentType, queryKeys } from './config'
import { getDocumentNumberQuery } from './service'

export interface UseGenerateDocumentNumberParams {
  documentType: DocumentType
  onChange: (doc_num: number | undefined) => void
  enabled: boolean
}

export const useGenerateDocumentNumber = ({
  documentType,
  onChange,
  enabled
}: UseGenerateDocumentNumberParams) => {
  const onChangeEvent = useEventCallback(onChange)

  const query = useQuery({
    queryKey: [queryKeys.getDocumentNumber, { documentType }],
    queryFn: getDocumentNumberQuery,
    placeholderData: () => undefined,
    gcTime: 0,
    enabled
  })

  console.log('query', query, query.data, enabled)

  useEffect(() => {
    if (query.isFetchedAfterMount) {
      onChangeEvent(query.data)
    }
  }, [query.data, query.isFetchedAfterMount])

  return query
}
