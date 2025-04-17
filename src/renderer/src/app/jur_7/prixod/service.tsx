import type { PrixodFormValues } from './config'
import type { MO7Prixod } from '@/common/models'
import type { UseMutationOptions } from '@tanstack/react-query'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { WarehousePrixodQueryKeys } from './config'

export const WarehousePrixodService = new CRUDService<MO7Prixod, PrixodFormValues>({
  endpoint: ApiEndpoints.jur7_prixod
})
  .use(budjet())
  .use(main_schet())

export const usePrixodGet = (id: number) => {
  return useQuery({
    queryKey: [WarehousePrixodQueryKeys.get, id],
    queryFn: WarehousePrixodService.getById,
    enabled: !!id
  })
}

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
