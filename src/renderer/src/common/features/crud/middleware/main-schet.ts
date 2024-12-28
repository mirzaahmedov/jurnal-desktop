import { getBudjetId, getMainschetId } from '@renderer/common/features/requisites'

import type { AxiosRequestConfig } from 'axios'
import type { MiddlewareFunction } from '../definition'
import { extendObject } from '@/common/lib/utils'

export const main_schet: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      main_schet_id: getMainschetId()
    })
    return config
  }
}

export const budjet: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      budjet_id: getBudjetId()
    })
    return config
  }
}
