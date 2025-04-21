import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoController, type SaldoCreateArgs } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { IznosQueryKeys } from '../../iznos/config'
import { SaldoQueryKeys } from '../config'
import { MaterialWarehouseSaldoService } from '../service'
import { useWarehouseSaldo } from '../use-saldo'

export const WarehouseSaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { dequeueMonth } = useWarehouseSaldo()

  const location = useLocation()

  const enabled = !!budjet_id && location.pathname.includes('journal-7')

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const {
    data: saldo,
    isFetching,
    isFetched
  } = useQuery({
    queryKey: [
      SaldoQueryKeys.check,
      {
        year,
        month,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!
      },
      location.pathname
    ],
    queryFn: MaterialWarehouseSaldoService.checkSaldo,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled
  })

  const { mutate: createSaldo, isPending } = useMutation({
    mutationKey: [SaldoQueryKeys.create],
    mutationFn: MaterialWarehouseSaldoService.create,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })
    }
  })

  const handleCreate = ({ month, year }: SaldoCreateArgs) => {
    createSaldo({
      month,
      year
    })
  }

  const isError = !saldo?.data?.length && !isFetching && isFetched

  return (
    <SaldoController
      isError={isError}
      year={year}
      month={month}
      budjet_id={budjet_id}
      isCreating={isPending}
      onCreate={handleCreate}
    />
  )
}
