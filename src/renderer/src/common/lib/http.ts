import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import axios from 'axios'
import i18next, { t } from 'i18next'

import { useAuthenticationStore } from '@/common/features/auth'

import { notify } from './notify'

type ErrorResponse = {
  success: false
  message: string
  meta?: unknown
}

export class HttpResponseError extends Error {
  meta: unknown
  axiosError: AxiosError
  constructor(message: string, axiosError: AxiosError, meta?: unknown) {
    super(message)
    this.name = 'APIResponseError'
    this.meta = meta
    this.axiosError = axiosError
  }
}

// ? 'http://147.45.107.174:3006/v2'
// ? 'http://147.45.107.174:3005'
// ? 'http://10.50.0.140:3006'
// ? 'http://10.51.2.242:3005'
// ? 'http://192.168.5.45:3005'
const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_URL
    ? import.meta.env.VITE_DEV_URL
    : 'https://nafaqa.fizmasoft.uz/api'
  : import.meta.env.VITE_MODE === 'staging'
    ? 'https://nafaqa.fizmasoft.uz/api'
    : 'http://10.50.0.140:3006'

export const http = axios.create({
  baseURL
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers['x-app-lang'] = i18next.language

  if (config.withCredentials === false) {
    return config
  }

  const { token } = useAuthenticationStore.getState()
  if (!token) {
    throw new Error('No access token')
  }

  config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (!error) {
      notify({
        variant: 'error',
        title: t('something-went-wrong')
      })
      throw new Error(t('something-went-wrong'))
    }

    if (!axios.isAxiosError(error)) {
      notify({
        variant: 'error',
        title: error?.message ?? t('something-went-wrong')
      })
      throw error
    }

    const response = error.response
    if (response) {
      const data = getResponseData(response)
      const message = data?.message || (error as AxiosError)?.message

      let requestData: any

      try {
        if (error.config?.headers['Content-Type'] === 'application/json' && error?.config?.data) {
          requestData = JSON.parse(error.config.data)
        }
      } catch (err: any) {
        console.error({ error: (err as Error)?.message ?? err, requestData: error?.config?.data })
      }

      const details = JSON.stringify(
        {
          message,
          url: `${error.config?.baseURL}/${error.config?.url?.replace(/^\//, '')}`,
          method: error.config?.method?.toUpperCase(),
          requestData,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          headers: error.config?.headers,
          params: error.config?.params,
          timestamp: new Date().toISOString()
        },
        null,
        4
      )
      notify({
        variant: 'error',
        title: message,
        details
      })

      throw new HttpResponseError(message, error, data?.meta)
    }

    const message = (error as AxiosError)?.message
    notify({
      variant: 'error',
      title: message
    })

    throw new Error(message)
  }
)

export const getResponseData = (
  response: AxiosResponse<any, any> | undefined
): ErrorResponse | undefined => {
  if (response && response.data) {
    try {
      if (response.data instanceof ArrayBuffer) {
        const decoded = JSON.parse(new TextDecoder().decode(response.data))
        return decoded
      } else {
        return response.data
      }
    } catch {
      return undefined
    }
  }

  return undefined
}
