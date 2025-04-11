import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useRequisitesStore } from '@/common/features/requisites'
import {
  type MonthValue,
  SaldoNamespace,
  SaldoUpdateManager,
  useSaldoController
} from '@/common/features/saldo'

import { PodotchetMonitorQueryKeys } from '../../monitor/config'
import { PodotchetSaldoQueryKeys } from '../config'
import { PodotchetSaldoService } from '../service'

export const PodotchetSaldoUpdateManager = () => {
  const queryClient = useQueryClient()
  const { main_schet_id, jur4_schet_id } = useRequisitesStore()

  const [completed, setCompleted] = useState<MonthValue[]>([])

  const { queuedMonths, dequeueMonth, clearQueue } = useSaldoController({
    ns: SaldoNamespace.JUR_4
  })

  const {
    mutate: updateSaldo,
    isPending,
    error
  } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.create],
    mutationFn: PodotchetSaldoService.autoCreate,
    onSuccess(_, values) {
      const newQueue = dequeueMonth(values)
      setCompleted((prev) => [...prev, values])

      if (newQueue.length > 0) {
        updateSaldo({
          month: newQueue[0].month,
          year: newQueue[0].year,
          main_schet_id: main_schet_id!,
          schet_id: jur4_schet_id!
        })
      }

      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [PodotchetMonitorQueryKeys.getAll]
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
          main_schet_id: main_schet_id!,
          schet_id: jur4_schet_id!
        })
      }}
      onClose={() => {
        clearQueue()
        setCompleted([])

        queryClient.invalidateQueries({
          queryKey: [PodotchetSaldoQueryKeys.getAll]
        })
        queryClient.invalidateQueries({
          queryKey: [PodotchetMonitorQueryKeys.getAll]
        })
      }}
    />
  )
}
