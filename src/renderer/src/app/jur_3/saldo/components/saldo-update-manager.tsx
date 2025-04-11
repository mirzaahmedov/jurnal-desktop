import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getJur3SchetId, useRequisitesStore } from '@/common/features/requisites'
import {
  type MonthValue,
  SaldoNamespace,
  SaldoUpdateManager,
  useSaldoController
} from '@/common/features/saldo'

import { OrganSaldoQueryKeys } from '../config'
import { OrganSaldoService } from '../service'

export const OrganSaldoUpdateManager = () => {
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const [completed, setCompleted] = useState<MonthValue[]>([])

  const { queuedMonths, dequeueMonth, clearQueue } = useSaldoController({
    ns: SaldoNamespace.JUR_3
  })

  const {
    mutate: updateSaldo,
    isPending,
    error
  } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.create],
    mutationFn: OrganSaldoService.autoCreate,
    onSuccess(_, values) {
      const newQueue = dequeueMonth(values)
      setCompleted((prev) => [...prev, values])

      if (newQueue.length > 0) {
        updateSaldo({
          month: newQueue[0].month,
          year: newQueue[0].year,
          main_schet_id: main_schet_id!,
          schet_id: getJur3SchetId()!
        })
      }

      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
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
          schet_id: getJur3SchetId()!
        })
      }}
      onClose={() => {
        clearQueue()
        setCompleted([])
        queryClient.invalidateQueries({
          queryKey: [OrganSaldoQueryKeys.getAll]
        })
      }}
    />
  )
}
