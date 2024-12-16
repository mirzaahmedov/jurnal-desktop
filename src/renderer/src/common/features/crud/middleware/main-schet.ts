import type { AxiosRequestConfig } from 'axios'
import { extendObject } from '@/common/lib/utils'
import { getMainSchetBudgetId, getMainSchetId } from '@/common/features/main-schet'
import { MiddlewareFunction } from '../definition'

const main_schet: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      main_schet_id: getMainSchetId()
    })
    return config
  }
}

const budget: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      budjet_id: getMainSchetBudgetId()
    })
    return config
  }
}

export { main_schet, budget }
