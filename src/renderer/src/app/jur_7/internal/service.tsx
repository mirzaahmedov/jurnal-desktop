import type { InternalFormValues } from './config'
import type { ApiResponseMeta, WarehouseInternal } from '@/common/models'

import { useMutation } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { WarehouseInternalQueryKeys } from './config'

interface InternalMeta extends ApiResponseMeta {
  summa: number
}

export const WarehouseInternalService = new CRUDService<
  WarehouseInternal,
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
    mutationKey: [WarehouseInternalQueryKeys.create],
    mutationFn: WarehouseInternalService.create,
    onSuccess,
    onError
  })
}

export const useInternalUpdate = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [WarehouseInternalQueryKeys.update],
    mutationFn: WarehouseInternalService.update,
    onSuccess,
    onError
  })
}
export const useInternalDelete = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [WarehouseInternalQueryKeys.delete],
    mutationFn: WarehouseInternalService.delete,
    onSuccess,
    onError
  })
}
