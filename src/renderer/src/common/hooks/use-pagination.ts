import type { PaginationValues } from '@/common/components/pagination-alt'

import { useState } from 'react'

export interface PaginationParams {
  page: number
  limit: number
}
export interface UsePaginationReturn extends PaginationParams {
  onChange: (values: Partial<PaginationParams>) => void
}

const usePagination = (): UsePaginationReturn => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  })

  const handleChange = (values: Partial<PaginationValues>) => {
    setPagination((prev) => ({
      ...prev,
      ...values
    }))
  }

  return {
    page: pagination.page,
    limit: pagination.limit,
    onChange: handleChange
  }
}

export { usePagination }
