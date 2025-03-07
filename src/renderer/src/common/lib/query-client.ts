import type { Response } from '@/common/models'

import { QueryClient, type QueryKey } from '@tanstack/react-query'

export const getDataFromCache = <T>(queryClient: QueryClient, queryKey: QueryKey) => {
  return queryClient.getQueryData(queryKey) as Response<T> | undefined
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 0
    }
  }
})
