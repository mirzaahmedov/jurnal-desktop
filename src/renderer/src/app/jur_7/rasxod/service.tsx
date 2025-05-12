import type { RasxodFormValues } from './config'
import type { ResponseMeta, WarehouseRasxod } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { RasxodQueryKeys } from './config'

interface RasxodMeta extends ResponseMeta {
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
    queryKey: [RasxodQueryKeys.get, id],
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
    mutationKey: [RasxodQueryKeys.create],
    mutationFn: WarehouseRasxodService.create,
    onSuccess,
    onError
  })
}
export const useRasxodUpdate = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [RasxodQueryKeys.update],
    mutationFn: WarehouseRasxodService.update,
    onSuccess,
    onError
  })
}
export const useRasxodDelete = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [RasxodQueryKeys.delete],
    mutationFn: WarehouseRasxodService.delete,
    onSuccess,
    onError
  })
}
