import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useRequisitesStore } from '@/common/features/requisites'
import { type MonthValue, SaldoUpdateManager } from '@/common/features/saldo'

import { KassaMonitorQueryKeys } from '../../monitor'
import { KassaSaldoQueryKeys } from '../config'
import { KassaSaldoService } from '../service'
import { useKassaSaldo } from './use-saldo'

export const KassaSaldoUpdateManager = () => {
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const [completed, setCompleted] = useState<MonthValue[]>([])

  const { queuedMonths, dequeueMonth, clearQueue } = useKassaSaldo()

  const {
    mutate: updateSaldo,
    isPending,
    error
  } = useMutation({
    mutationKey: [KassaSaldoService.create],
    mutationFn: KassaSaldoService.autoCreate,
    onSuccess(_, values) {
      const newQueue = dequeueMonth(values)
      setCompleted((prev) => [...prev, values])

      if (newQueue.length > 0) {
        updateSaldo({
          month: newQueue[0].month,
          year: newQueue[0].year,
          main_schet_id: main_schet_id!
        })
      }

      queryClient.invalidateQueries({
        queryKey: [KassaSaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [KassaMonitorQueryKeys.getAll]
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
        updateSaldo({
          month: values.month,
          year: values.year,
          main_schet_id: main_schet_id!
        })
      }}
      onClose={() => {
        clearQueue()
        setCompleted([])

        queryClient.invalidateQueries({
          queryKey: [KassaSaldoQueryKeys.getAll]
        })
        queryClient.invalidateQueries({
          queryKey: [KassaMonitorQueryKeys.getAll]
        })
      }}
    />
  )
}
