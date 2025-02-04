import type { PaginationValues } from '@renderer/common/components/pagination'

import { useCallback } from 'react'

import { createLocationStore, useLocationState } from './use-location-state'

export type PaginationParams = {
  page: number
  limit: number
}

const usePaginationStore = createLocationStore<PaginationParams>('pagination')
const defaultPagination = {
  page: 1,
  limit: 10
}

export interface UsePaginationReturn extends PaginationParams {
  onChange: (values: Partial<PaginationParams>) => void
}

const usePagination = (): UsePaginationReturn => {
  const paginationStore = usePaginationStore()

  const [pagination, setPagination] = useLocationState<PaginationParams>(
    paginationStore,
    defaultPagination
  )

  const handleChange = useCallback((values: Partial<PaginationValues>) => {
    setPagination((prev) => ({
      ...prev,
      ...values
    }))
  }, [])

  return {
    page: pagination?.page ?? defaultPagination.page,
    limit: pagination?.limit ?? defaultPagination.limit,
    onChange: handleChange
  }
}

export { usePagination }
