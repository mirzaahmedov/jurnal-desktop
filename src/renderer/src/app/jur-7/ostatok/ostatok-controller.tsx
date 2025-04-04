import { type FormEventHandler, useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { LoadingOverlay, Spinner } from '@/common/components'
import { MonthPicker } from '@/common/components/month-picker'
import { Button } from '@/common/components/ui/button'
import { useRequisitesStore } from '@/common/features/requisites'
import { useBoundingClientRect, useLocationStore } from '@/common/hooks'
import { formatDate, parseDate } from '@/common/lib/date'
import { cn } from '@/common/lib/utils'

import { iznosQueryKeys } from '../iznos/config'
import { ostatokQueryKeys } from './config'
import { getOstatokCheck, ostatokService } from './service'
import { useOstatokStore } from './store'

export const OstatokController = () => {
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { t } = useTranslation()
  const { minDate, setDate, dequeueMonth } = useOstatokStore()
  const { values, setValues } = useLocationStore()
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
        year: minDate.getFullYear(),
        month: minDate.getMonth() + 1,
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
      month: minDate.getMonth() + 1,
      year: minDate.getFullYear()
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
      className="flex flex-col gap-2 -m-2 p-2"
      onSubmit={handleSubmit}
    >
      <div>
        <MonthPicker
          className={cn(
            'w-56',
            !checkResult?.data?.length &&
              !isCheckingSaldo &&
              isFetched &&
              'bg-red-100 border-red-500 text-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-500'
          )}
          value={formatDate(minDate)}
          onChange={(value) => {
            setDate(parseDate(value))

            Object.keys(values).forEach((pathname) => {
              if (pathname.includes('journal-7')) {
                setValues(pathname, {})
              }
            })
          }}
          name="saldo-date"
          id="saldo-date"
        />
      </div>
      {isCreatingOstatok ? <LoadingOverlay /> : null}
      <Button
        className="flex items-center gap-4"
        disabled={isCreatingOstatok}
      >
        {isCreatingOstatok ? (
          <>
            <Spinner className="text-white size-5 border-2" />
            {t('create_saldo')}
          </>
        ) : (
          t('create_saldo')
        )}
      </Button>
    </form>
  )
}
