import type { RasxodFormValues } from './config'
import type { ApiResponseMeta, WarehouseRasxod } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { WarehouseRasxodQueryKeys } from './config'

interface RasxodMeta extends ApiResponseMeta {
  summa: number
}

export const WarehouseRasxodService = new CRUDService<
  WarehouseRasxod,
  RasxodFormValues,
  RasxodFormValues,
  RasxodMeta
>({
  endpoint: ApiEndpoints.jur7_rasxod
})
  .use(budjet())
  .use(main_schet())

export const useRasxodGet = (id: number) => {
  return useQuery({
    queryKey: [WarehouseRasxodQueryKeys.getById, id],
    queryFn: WarehouseRasxodService.getById,
    enabled: !!id
  })
}

type UseRasxodCreateParams = {
  onSuccess?: (res: any) => void
  onError?: (res: any) => void
}
export const useRasxodCreate = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [WarehouseRasxodQueryKeys.create],
    mutationFn: WarehouseRasxodService.create,
    onSuccess,
    onError
  })
}
export const useRasxodUpdate = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [WarehouseRasxodQueryKeys.update],
    mutationFn: WarehouseRasxodService.update,
    onSuccess,
    onError
  })
}
export const useRasxodDelete = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [WarehouseRasxodQueryKeys.delete],
    mutationFn: WarehouseRasxodService.delete,
    onSuccess,
    onError
  })
}
