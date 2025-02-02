import type { Response } from '@/common/models'
import type { QueryClient, QueryKey } from '@tanstack/react-query'

export function getDataFromCache<T>(queryClient: QueryClient, queryKey: QueryKey) {
  return queryClient.getQueryData(queryKey) as Response<T> | undefined
}
