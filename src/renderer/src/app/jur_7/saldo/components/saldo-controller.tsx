import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoController,
  type SaldoCreateArgs,
  SaldoNamespace,
  useSaldoController
} from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { iznosQueryKeys } from '../../iznos/config'
import { saldoQueryKeys } from '../config'
import { getOstatokCheck, ostatokService } from '../service'

export const MaterialWarehouseSaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { t } = useTranslation()
  const { dequeueMonth } = useSaldoController({
    ns: SaldoNamespace.JUR_1
  })

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
      saldoQueryKeys.check,
      {
        year,
        month,
        budjet_id: budjet_id!
      },
      location.pathname
    ],
    queryFn: getOstatokCheck,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled
  })

  const { mutate: createSaldo, isPending } = useMutation({
    mutationKey: [saldoQueryKeys.create],
    mutationFn: ostatokService.create,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [saldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [saldoQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [iznosQueryKeys.getAll]
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

  useEffect(() => {
    if (isError) {
      toast.error(t('no_saldo'))
    }
  }, [t, isError])

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
