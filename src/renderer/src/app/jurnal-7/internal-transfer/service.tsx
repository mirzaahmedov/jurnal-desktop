import type { InternalTransfer } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

import type { InternalTransferFormType} from './config';
import { queryKeys } from './config'

const internalTransferService = new CRUDService<InternalTransfer, InternalTransferFormType>({
  endpoint: APIEndpoints.jur7_internal
}).use(main_schet())

type UseInternalTransferListParams = {
  params?: Record<string, unknown>
}

const useInternalTransferList = ({ params }: UseInternalTransferListParams) => {
  return useQuery({
    queryKey: [queryKeys.getAll, params],
    queryFn: internalTransferService.getAll
  })
}

const useInternalTransferGet = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.get, id],
    queryFn: internalTransferService.getById,
    enabled: !!id
  })
}

type UseInternalTransferCreateParams = {
  onSuccess?: () => void
  onError?: () => void
}
const useInternalTransferCreate = ({ onSuccess, onError }: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: internalTransferService.create,
    onSuccess,
    onError
  })
}

const useInternalTransferUpdate = ({ onSuccess, onError }: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.update],
    mutationFn: internalTransferService.update,
    onSuccess,
    onError
  })
}
const useInternalTransferDelete = ({ onSuccess, onError }: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: internalTransferService.delete,
    onSuccess,
    onError
  })
}

export {
  internalTransferService,
  useInternalTransferList,
  useInternalTransferGet,
  useInternalTransferCreate,
  useInternalTransferUpdate,
  useInternalTransferDelete
}
