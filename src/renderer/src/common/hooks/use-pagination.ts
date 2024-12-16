import { parseAsInteger, useQueryStates } from 'nuqs'

const usePagination = () => {
  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10)
  })

  return {
    page: pagination.page,
    limit: pagination.limit,
    onChange: setPagination
  }
}

export { usePagination }
