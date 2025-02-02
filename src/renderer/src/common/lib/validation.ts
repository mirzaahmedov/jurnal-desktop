import type { RawCreateParams, RefinementCtx, ZodErrorMap, ZodTypeAny } from 'zod'

import { toast } from 'react-toastify'
import { z } from 'zod'

import { errors } from './messages'

export const zodErrorMap: ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case 'invalid_type': {
      return {
        message: errors.required
      }
    }
    case 'too_small': {
      if (issue.minimum === 1) {
        return {
          message: errors.required
        }
      }
      return {
        message: 'Минимальное значение: ' + issue.minimum
      }
    }
    default: {
      return {
        message: ctx.defaultError
      }
    }
  }
}

z.setErrorMap(zodErrorMap)

export const withPreprocessor = <Z extends ZodTypeAny>(schema: Z, params?: RawCreateParams) =>
  z.preprocess<Z>(normalizeEmptyFields, schema, params)

export const normalizeEmptyFields = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key, value === '' || value === 0 || value === null ? undefined : value]
    })
  ) as T
}

export const omitEmptyArrayElements = <T>(array: Array<T | null | undefined>): T[] => {
  return array.filter((elem) => !!elem) as T[]
}

export const validateProvodkaOperatsii = <T extends Record<string, unknown>>(
  values: T[],
  ctx: RefinementCtx,
  key: keyof T = 'spravochnik_operatsii_id'
) => {
  if (!Array.isArray(values) || values.length < 1) {
    ctx.addIssue({
      code: 'custom',
      message: 'At least one child is required'
    })
    toast.error('At least one child is required')
    return
  }
  const operatsiiId = values[0][key]
  values.forEach((child, index) => {
    if (child[key] !== operatsiiId) {
      ctx.addIssue({
        code: 'custom',
        path: [index, key as string],
        message: 'is not valid'
      })
    }
  })
}
