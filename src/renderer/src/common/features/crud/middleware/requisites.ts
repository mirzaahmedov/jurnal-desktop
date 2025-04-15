import type { MiddlewareFunction } from '../definition'
import type { AxiosRequestConfig } from 'axios'

import {
  getBudjetId,
  getJur3Schet152Id,
  getJur3Schet159Id,
  getJur4SchetId,
  getMainschetId
} from '@/common/features/requisites'
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

export const jur3_schet_159: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      schet_id: getJur3Schet159Id()
    })
    return config
  }
}

export const jur3_schet_152: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      schet_id: getJur3Schet152Id()
    })
    return config
  }
}

export const jur4_schet: () => MiddlewareFunction = () => {
  return (config: AxiosRequestConfig) => {
    config.params = extendObject(config.params, {
      schet_id: getJur4SchetId()
    })
    return config
  }
}
