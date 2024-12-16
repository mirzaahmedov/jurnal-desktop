import type { QueryClient, QueryKey } from '@tanstack/react-query'
import type { Response } from '@/common/models'

export function getDataFromCache<T>(queryClient: QueryClient, queryKey: QueryKey) {
  return queryClient.getQueryData(queryKey) as Response<T> | undefined
}
