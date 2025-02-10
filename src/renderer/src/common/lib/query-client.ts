import type { Response } from '@/common/models'

import { MutationCache, QueryCache, QueryClient, type QueryKey } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'

import { HttpErrorToast } from '../features/toaster'

export const getDataFromCache = <T>(queryClient: QueryClient, queryKey: QueryKey) => {
  return queryClient.getQueryData(queryKey) as Response<T> | undefined
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({}),
  mutationCache: new MutationCache({
    onError(error, _variables, _ctx, mutate) {
      if (isAxiosError(error)) {
        const details = {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          requestData: error.config?.data ? JSON.parse(error.config.data) : null,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          headers: error.config?.headers,
          params: error.config?.params,
          timestamp: new Date().toISOString()
        }
        console.log({ _variables, _ctx, mutate })
        toast.error(HttpErrorToast, {
          autoClose: false,
          data: {
            title: error.message,
            refetch: () => {
              console.log('refetch')
            },
            details: JSON.stringify(details, null, 4)
          }
        })
      }
    }
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  }
})
