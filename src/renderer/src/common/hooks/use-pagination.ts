import type { PaginationValues } from '@/common/components/pagination-alt'
import { parseAsInteger, useQueryStates } from 'nuqs'

const usePagination = () => {
  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10)
  })

  const handleChange = ({ page, limit }: Partial<PaginationValues>) => {
    setPagination({
      page,
      limit
    })
  }

  return {
    page: pagination.page,
    limit: pagination.limit,
    onChange: handleChange
  }
}

export { usePagination }
