import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { PrixodFormType, queryKeys } from './config'
import { useMutation, useQuery } from '@tanstack/react-query'

import type { MO7Prixod } from '@/common/models'
import { main_schet } from '@/common/features/crud/middleware'

const prixodService = new CRUDService<MO7Prixod, PrixodFormType>({
  endpoint: APIEndpoints.jur7_prixod
}).use(main_schet())

type UsePrixodListParams = {
  params?: Record<string, unknown>
}

const usePrixodList = ({ params }: UsePrixodListParams) => {
  return useQuery({
    queryKey: [queryKeys.getAll, params],
    queryFn: prixodService.getAll
  })
}

const usePrixodGet = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.get, id],
    queryFn: prixodService.getById,
    enabled: !!id
  })
}

type UsePrixodParams = {
  onSuccess?: () => void
  onError?: () => void
}
const usePrixodCreate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: prixodService.create,
    onSuccess,
    onError
  })
}
const usePrixodUpdate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [queryKeys.update],
    mutationFn: prixodService.update,
    onSuccess,
    onError
  })
}

const usePrixodDelete = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: prixodService.delete,
    onSuccess,
    onError
  })
}

export {
  prixodService,
  usePrixodList,
  usePrixodGet,
  usePrixodCreate,
  usePrixodUpdate,
  usePrixodDelete
}
