import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoController,
  type SaldoCreateArgs,
  SaldoNamespace,
  useSaldoController
} from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { KassaSaldoQueryKeys } from '../config'
import { KassaSaldoService } from '../service'
import { Jur1SaldoUpdateManager } from './saldo-update-manager'

export const Jur1SaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { dequeueMonth } = useSaldoController({
    ns: SaldoNamespace.JUR_1
  })

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const { mutate: createSaldoAuto, isPending } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.auto],
    mutationFn: KassaSaldoService.createAuto,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [KassaSaldoQueryKeys.getAll]
      })
    }
  })

  const handleCreate = ({ month, year, main_schet_id }: SaldoCreateArgs) => {
    createSaldoAuto({
      month,
      year,
      main_schet_id: main_schet_id!
    })
  }

  return (
    <>
      <SaldoController
        year={year}
        month={month}
        budjet_id={budjet_id}
        main_schet_id={main_schet_id}
        isCreating={isPending}
        onCreate={handleCreate}
      />
      <Jur1SaldoUpdateManager />
    </>
  )
}
