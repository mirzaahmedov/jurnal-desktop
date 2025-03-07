import type { RasxodFormValues } from './config'
import type { Jur7Rasxod } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

import { queryKeys } from './config'

const rasxodService = new CRUDService<Jur7Rasxod, RasxodFormValues>({
  endpoint: ApiEndpoints.jur7_rasxod
}).use(main_schet())

type UseRasxodListParams = {
  params?: Record<string, unknown>
}

const useRasxodList = ({ params }: UseRasxodListParams) => {}

const useRasxodGet = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.get, id],
    queryFn: rasxodService.getById,
    enabled: !!id
  })
}

type UseRasxodCreateParams = {
  onSuccess?: (res: any) => void
  onError?: (res: any) => void
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
