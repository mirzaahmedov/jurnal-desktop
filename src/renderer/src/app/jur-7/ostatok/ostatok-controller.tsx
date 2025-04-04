import { type FormEventHandler, useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSelectedMonthStore } from '@/common/features/selected-month/store'
import { useBoundingClientRect } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { iznosQueryKeys } from '../iznos/config'
import { ostatokQueryKeys } from './config'
import { getOstatokCheck, ostatokService } from './service'
import { useOstatokStore } from './store'

export const OstatokController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { t } = useTranslation()
  const { dequeueMonth } = useOstatokStore()

  const { setElementRef } = useBoundingClientRect()

  const { pathname } = useLocation()

  const enabled = !!budjet_id && pathname.includes('journal-7')

  const {
    data: checkResult,
    isFetching: isCheckingSaldo,
    isFetched
  } = useQuery({
    queryKey: [
      ostatokQueryKeys.check,
      {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        budjet_id: budjet_id!
      },
      pathname
    ],
    queryFn: getOstatokCheck,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled
  })

  const { mutate: createOstatok, isPending: isCreatingOstatok } = useMutation({
    mutationKey: [ostatokQueryKeys.create],
    mutationFn: ostatokService.create,
    onSuccess(res, values) {
      toast.success(res.message)
      dequeueMonth(values)
      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [iznosQueryKeys.getAll]
      })
    }
  })

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    createOstatok({
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear()
    })
  }

  useEffect(() => {
    if (!checkResult?.data?.length && !isCheckingSaldo && isFetched) {
      toast.error(t('no_saldo'))
    }
  }, [t, isCheckingSaldo, isFetched])

  return (
    <form
      ref={setElementRef}
      onSubmit={handleSubmit}
    >
      {isCreatingOstatok ? <LoadingOverlay /> : null}
      <Button
        disabled={isCreatingOstatok}
        loading={isCreatingOstatok}
        className={cn(
          'w-full',
          !checkResult?.data?.length &&
            !isCheckingSaldo &&
            isFetched &&
            'bg-red-100 border-red-500 text-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-500'
        )}
      >
        {t('create_saldo')}
      </Button>
    </form>
  )
}
