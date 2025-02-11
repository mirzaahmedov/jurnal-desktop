import type { Response } from '@/common/models'

import { MutationCache, QueryCache, QueryClient, type QueryKey } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'

import { notify } from './notify'

export const getDataFromCache = <T>(queryClient: QueryClient, queryKey: QueryKey) => {
  return queryClient.getQueryData(queryKey) as Response<T> | undefined
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      console.error(error)

      const message = getErrorMessage(error)

      if (isAxiosError(error)) {
        const details = JSON.stringify({
          message,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          requestData: error.config?.data ? JSON.parse(error.config.data) : null,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          headers: error.config?.headers,
          params: error.config?.params,
          timestamp: new Date().toISOString()
        })
        notify({
          variant: 'error',
          title: message,
          details,
          refetch: query.fetch
        })
        return
      }

      notify({
        variant: 'error',
        title: message,
        refetch: query.fetch
      })
    }
  }),
  mutationCache: new MutationCache({
    // onSuccess(data) {
    //   const { message = t('action-successful') } = data as { message?: string }
    //   notify({
    //     variant: 'success',
    //     title: message
    //   })
    // },
    // onError(error) {
    //   console.error(error)
    //   const message = getErrorMessage(error)
    //   if (isAxiosError(error)) {
    //     const details = JSON.stringify({
    //       message,
    //       url: error.config?.url,
    //       method: error.config?.method?.toUpperCase(),
    //       requestData: error.config?.data ? JSON.parse(error.config.data) : null,
    //       status: error.response?.status,
    //       statusText: error.response?.statusText,
    //       responseData: error.response?.data,
    //       headers: error.config?.headers,
    //       params: error.config?.params,
    //       timestamp: new Date().toISOString()
    //     })
    //     notify({
    //       variant: 'error',
    //       title: message,
    //       details
    //     })
    //     return
    //   }
    //   notify({
    //     variant: 'error',
    //     title: message
    //   })
    // }
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  }
})

const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return t('something-went-wrong')
  }

  if (isAxiosError(error)) {
    const response = error.response

    if (response?.data?.message) {
      return response.data.message
    }

    return error.message || t('something-went-wrong')
  }

  return (error as Error)?.message || t('something-went-wrong')
}
