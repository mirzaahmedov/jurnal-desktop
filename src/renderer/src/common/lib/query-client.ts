import type { Response } from '@/common/models'

import { QueryCache, QueryClient, type QueryKey } from '@tanstack/react-query'

export const getDataFromCache = <T>(queryClient: QueryClient, queryKey: QueryKey) => {
  return queryClient.getQueryData(queryKey) as Response<T> | undefined
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 0,
      staleTime: 0,
      placeholderData: () => []
    }
  },
  queryCache: new QueryCache({
    onError: (_, query) => {
      queryClient.removeQueries(query)
    }
  })
})
