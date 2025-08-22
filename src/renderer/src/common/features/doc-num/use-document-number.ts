import { useCallback, useEffect } from 'react'

import { useMutation } from '@tanstack/react-query'

import { useEventCallback } from '@/common/hooks'

import { useRequisitesStore } from '../requisites'
import { type DocumentType } from './config'
import { DocumentNumberService } from './service'

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
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const onChangeEvent = useEventCallback(onChange)

  const {
    mutate: getDocumentNumber,
    mutateAsync: fetchDocumentNumberAsync,
    isPending
  } = useMutation({
    mutationFn: DocumentNumberService.getDocumentNumber,
    onSuccess: (doc_num) => {
      onChangeEvent(doc_num)
    }
  })

  const refetch = useCallback(() => {
    if (documentType && enabled) {
      getDocumentNumber({ type: documentType, main_schet_id })
    }
  }, [getDocumentNumber, documentType, main_schet_id, enabled])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    isPending,
    refetch,
    fetchDocumentNumberAsync
  }
}
