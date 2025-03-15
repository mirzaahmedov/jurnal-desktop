import type { InternalTransferFormType } from './config'
import type { InternalTransfer } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

import { queryKeys } from './config'

export const internalTransferService = new CRUDService<InternalTransfer, InternalTransferFormType>({
  endpoint: ApiEndpoints.jur7_internal
}).use(main_schet())

export const useInternalTransferGet = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.get, id],
    queryFn: internalTransferService.getById,
    enabled: !!id
  })
}

type UseInternalTransferCreateParams = {
  onSuccess?: (res: any) => void
  onError?: (res: any) => void
}
export const useInternalTransferCreate = ({
  onSuccess,
  onError
}: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: internalTransferService.create,
    onSuccess,
    onError
  })
}

export const useInternalTransferUpdate = ({
  onSuccess,
  onError
}: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.update],
    mutationFn: internalTransferService.update,
    onSuccess,
    onError
  })
}
export const useInternalTransferDelete = ({
  onSuccess,
  onError
}: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: internalTransferService.delete,
    onSuccess,
    onError
  })
}
