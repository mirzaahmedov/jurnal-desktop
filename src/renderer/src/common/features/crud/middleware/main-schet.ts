import { getBudgetId, getMainschetId } from '@/common/features/main-schet'

import type { AxiosRequestConfig } from 'axios'
import { MiddlewareFunction } from '../definition'
import { extendObject } from '@/common/lib/utils'

const main_schet: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      main_schet_id: getMainschetId()
    })
    return config
  }
}

const budget: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      budjet_id: getBudgetId()
    })
    return config
  }
}

export { main_schet, budget }
