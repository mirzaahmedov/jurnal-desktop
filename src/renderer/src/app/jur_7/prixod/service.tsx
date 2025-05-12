import type { ResponseMeta, WarehousePrixod } from '@/common/models'
import type { UseMutationOptions } from '@tanstack/react-query'

import { useMutation } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { type PrixodFormValues, WarehousePrixodQueryKeys } from './config'

interface PrixodMeta extends ResponseMeta {
  summa: number
}

export const WarehousePrixodService = new CRUDService<
  WarehousePrixod,
  PrixodFormValues,
  PrixodFormValues,
  PrixodMeta
>({
  endpoint: ApiEndpoints.jur7_prixod
})
  .use(budjet())
  .use(main_schet())

export type UsePrixodParams = Pick<UseMutationOptions<any, Error, any>, 'onSuccess' | 'onError'>
export const usePrixodCreate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [WarehousePrixodQueryKeys.create],
    mutationFn: WarehousePrixodService.create,
    onSuccess,
    onError
  })
}
export const usePrixodUpdate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [WarehousePrixodQueryKeys.update],
    mutationFn: WarehousePrixodService.update,
    onSuccess,
    onError
  })
}

export const usePrixodDelete = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [WarehousePrixodQueryKeys.delete],
    mutationFn: WarehousePrixodService.delete,
    onSuccess,
    onError
  })
}
