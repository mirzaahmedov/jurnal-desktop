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

import { BankSaldoQueryKeys } from '../config'
import { BankSaldoService } from '../service'
import { Jur2SaldoUpdateManager } from './saldo-update-manager'

export const Jur2SaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { dequeueMonth } = useSaldoController({
    ns: SaldoNamespace.JUR_2
  })

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const { mutate: createSaldoAuto, isPending } = useMutation({
    mutationKey: [BankSaldoQueryKeys.auto],
    mutationFn: BankSaldoService.createAuto,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [BankSaldoQueryKeys.getAll]
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
      <Jur2SaldoUpdateManager />
    </>
  )
}
