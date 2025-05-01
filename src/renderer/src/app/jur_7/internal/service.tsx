import type { InternalFormValues } from './config'
import type { Internal, ResponseMeta } from '@/common/models'

import { useMutation } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { internalQueryKeys } from './config'

interface InternalMeta extends ResponseMeta {
  summa: number
}

export const internalService = new CRUDService<
  Internal,
  InternalFormValues,
  InternalFormValues,
  InternalMeta
>({
  endpoint: ApiEndpoints.jur7_internal
})
  .use(budjet())
  .use(main_schet())

type UseInternalCreateParams = {
  onSuccess?: (res: any) => void
  onError?: (res: any) => void
}
export const useInternalCreate = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.create],
    mutationFn: internalService.create,
    onSuccess,
    onError
  })
}

export const useInternalUpdate = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.update],
    mutationFn: internalService.update,
    onSuccess,
    onError
  })
}
export const useInternalDelete = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.delete],
    mutationFn: internalService.delete,
    onSuccess,
    onError
  })
}
