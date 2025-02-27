import { type FormEventHandler, useEffect } from 'react'

import { Spinner } from '@renderer/common/components'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { Button } from '@renderer/common/components/ui/button'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { formatDate, parseDate } from '@renderer/common/lib/date'
import { cn } from '@renderer/common/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ostatokQueryKeys } from './config'
import { getOstatokCheck, ostatokService } from './service'
import { useOstatokStore } from './store'

export const OstatokController = () => {
  const { t } = useTranslation()
  const { minDate, setDate, setRecheckOstatok } = useOstatokStore()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const { pathname } = useLocation()

  const enabled = !!main_schet_id && !!budjet_id && pathname.includes('journal-7')

  const {
    data: checkResult,
    refetch: refetchCheck,
    isFetching: isCheckingSaldo,
    isFetched
  } = useQuery({
    queryKey: [
      ostatokQueryKeys.check,
      {
        year: minDate.getFullYear(),
        month: minDate.getMonth() + 1,
        main_schet_id: main_schet_id!,
        budjet_id: budjet_id!
      }
    ],
    queryFn: getOstatokCheck,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled
  })

  const { mutate: createOstatok, isPending: isCreatingOstatok } = useMutation({
    mutationKey: [ostatokQueryKeys.create],
    mutationFn: ostatokService.create,
    onSuccess(res) {
      toast.success(res.message)
      refetchCheck()
    },
    onError(error) {
      toast.error(error.message)
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
  useEffect(() => {
    setRecheckOstatok(refetchCheck)
  }, [setRecheckOstatok, refetchCheck])

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
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
        }}
        name="saldo-date"
        id="saldo-date"
      />
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
