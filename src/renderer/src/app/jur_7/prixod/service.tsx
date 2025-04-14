import type { PrixodFormValues } from './config'
import type { MO7Prixod } from '@/common/models'
import type { UseMutationOptions } from '@tanstack/react-query'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { prixodQueryKeys } from './config'

export const prixodService = new CRUDService<MO7Prixod, PrixodFormValues>({
  endpoint: ApiEndpoints.jur7_prixod
})
  .use(budjet())
  .use(main_schet())

export const usePrixodGet = (id: number) => {
  return useQuery({
    queryKey: [prixodQueryKeys.get, id],
    queryFn: prixodService.getById,
    enabled: !!id
  })
}

export type UsePrixodParams = Pick<UseMutationOptions<any, Error, any>, 'onSuccess' | 'onError'>
export const usePrixodCreate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [prixodQueryKeys.create],
    mutationFn: prixodService.create,
    onSuccess,
    onError
  })
}
export const usePrixodUpdate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [prixodQueryKeys.update],
    mutationFn: prixodService.update,
    onSuccess,
    onError
  })
}

export const usePrixodDelete = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [prixodQueryKeys.delete],
    mutationFn: prixodService.delete,
    onSuccess,
    onError
  })
}
