import type { RasxodFormValues } from './config'
import type { Jur7Rasxod } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'

import { rasxodQueryKeys } from './config'

export const rasxodService = new CRUDService<Jur7Rasxod, RasxodFormValues>({
  endpoint: ApiEndpoints.jur7_rasxod
}).use(budjet())

export const useRasxodGet = (id: number) => {
  return useQuery({
    queryKey: [rasxodQueryKeys.get, id],
    queryFn: rasxodService.getById,
    enabled: !!id
  })
}

type UseRasxodCreateParams = {
  onSuccess?: (res: any) => void
  onError?: (res: any) => void
}
export const useRasxodCreate = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [rasxodQueryKeys.create],
    mutationFn: rasxodService.create,
    onSuccess,
    onError
  })
}
export const useRasxodUpdate = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [rasxodQueryKeys.update],
    mutationFn: rasxodService.update,
    onSuccess,
    onError
  })
}
export const useRasxodDelete = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [rasxodQueryKeys.delete],
    mutationFn: rasxodService.delete,
    onSuccess,
    onError
  })
}
