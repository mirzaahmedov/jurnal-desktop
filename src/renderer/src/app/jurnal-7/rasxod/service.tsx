import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { RasxodFormValues, queryKeys } from './config'
import { useMutation, useQuery } from '@tanstack/react-query'

import type { MO7Rasxod } from '@/common/models'
import { main_schet } from '@/common/features/crud/middleware'

const rasxodService = new CRUDService<MO7Rasxod, RasxodFormValues>({
  endpoint: APIEndpoints.jur7_rasxod
}).use(main_schet())

type UseRasxodListParams = {
  params?: Record<string, unknown>
}

const useRasxodList = ({ params }: UseRasxodListParams) => {
  return useQuery({
    queryKey: [queryKeys.getAll, params],
    queryFn: rasxodService.getAll
  })
}

const useRasxodGet = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.get, id],
    queryFn: rasxodService.getById,
    enabled: !!id
  })
}

type UseRasxodCreateParams = {
  onSuccess?: () => void
  onError?: () => void
}
const useRasxodCreate = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: rasxodService.create,
    onSuccess,
    onError
  })
}
const useRasxodUpdate = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.update],
    mutationFn: rasxodService.update,
    onSuccess,
    onError
  })
}
const useRasxodDelete = ({ onSuccess, onError }: UseRasxodCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: rasxodService.delete,
    onSuccess,
    onError
  })
}

export {
  rasxodService,
  useRasxodList,
  useRasxodGet,
  useRasxodCreate,
  useRasxodUpdate,
  useRasxodDelete
}
