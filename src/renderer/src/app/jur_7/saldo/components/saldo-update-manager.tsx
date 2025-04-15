import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  type MonthValue,
  SaldoNamespace,
  SaldoUpdateManager,
  useSaldoController
} from '@/common/features/saldo'

import { iznosQueryKeys } from '../../iznos/config'
import { saldoQueryKeys } from '../config'
import { ostatokService } from '../service'

export const MaterialWarehouseSaldoUpdateManager = () => {
  const queryClient = useQueryClient()

  const [completed, setCompleted] = useState<MonthValue[]>([])

  const { queuedMonths, dequeueMonth, clearQueue } = useSaldoController({
    ns: SaldoNamespace.JUR_7
  })

  const {
    mutate: updateSaldo,
    isPending,
    error
  } = useMutation({
    mutationKey: [saldoQueryKeys.create],
    mutationFn: ostatokService.create,
    onSuccess(_, values) {
      const newQueue = dequeueMonth(values)
      setCompleted((prev) => [...prev, values])

      if (newQueue.length > 0) {
        updateSaldo(newQueue[0])
      }

      queryClient.invalidateQueries({
        queryKey: [saldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [iznosQueryKeys.getAll]
      })
    }
  })

  return (
    <SaldoUpdateManager
      pending={isPending}
      error={error}
      queue={queuedMonths}
      completed={completed}
      onConfirm={(values) => {
        updateSaldo(values)
      }}
      onClose={() => {
        clearQueue()
        setCompleted([])
      }}
    />
  )
}
