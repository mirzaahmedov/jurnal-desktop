import type { PaginationValues } from '@renderer/common/components/pagination'

import { useCallback } from 'react'

import { useLocationState } from './use-location-state'

export type PaginationParams = {
  page: number
  limit: number
}

export interface UsePaginationReturn extends PaginationParams {
  onChange: (values: Partial<PaginationParams>) => void
}

export const usePagination = (): UsePaginationReturn => {
  const [page, setPage] = useLocationState('page', 1)
  const [limit, setLimit] = useLocationState('limit', 10)

  const handleChange = useCallback(
    (values: Partial<PaginationValues>) => {
      if (values.page) {
        setPage(values.page)
      }
      if (values.limit) {
        setLimit(values.limit)
      }
    },
    [setPage, setLimit]
  )

  return {
    page,
    limit,
    onChange: handleChange
  }
}
