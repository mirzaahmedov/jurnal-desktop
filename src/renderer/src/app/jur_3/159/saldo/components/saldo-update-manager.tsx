import type { OrganSaldoProvodka } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { OrganSaldoUpdateManager } from '@/app/jur_3/shared/components/organ-saldo-update-manager'
import { calculateSumma } from '@/app/jur_3/shared/utils/calculate-summa'
import { useToggle } from '@/common/hooks'

import { OrganMonitorQueryKeys } from '../../monitor/config'
import { OrganSaldoQueryKeys, defaultValues } from '../config'
import { OrganSaldoService } from '../service'
import { useAktSaldo } from '../use-saldo'

export const OrganAktSaldoUpdateManager = () => {
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const { t } = useTranslation()
  const { clearQueue, queuedMonths, dequeueMonth } = useAktSaldo()

  const [totalRow, setTotalRow] = useState<
    Pick<OrganSaldoProvodka, 'name' | 'prixod' | 'rasxod' | 'summa'>[]
  >([])

  const form = useForm({
    defaultValues
  })

  const { mutate: autofill, isPending: isAutofilling } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.getAutofill],
    mutationFn: OrganSaldoService.getAutofillData,
    onSuccess: (res, values) => {
      const childs = res?.data ?? []
      const year = values?.year
      const month = values?.month
      if (childs.length) {
        const total = calculateSumma(childs)
        setTotalRow([
          {
            name: t('total'),
            prixod: total.prixod,
            rasxod: total.rasxod,
            summa: total.prixod - total.rasxod
          }
        ])
      } else {
        setTotalRow([])
      }
      form.setValue('year', year)
      form.setValue('month', month)
      form.setValue('organizations', childs)
      return
    },
    onError: () => {
      form.setValue('organizations', [])
    }
  })

  const { mutate: updateSaldo, isPending: isUpdating } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.update],
    mutationFn: OrganSaldoService.update,
    onSuccess(_, values) {
      dequeueMonth(values as any)

      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [OrganMonitorQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (queuedMonths.length > 0) {
      dialogToggle.open()
    }
  }, [queuedMonths.length, dialogToggle])

  const current = queuedMonths?.[0]
  useEffect(() => {
    if (!current) {
      return
    }
    autofill({
      first: false,
      month: current?.month,
      year: current?.year,
      budjet_id: current?.budjet_id,
      main_schet_id: current?.main_schet_id,
      schet_id: current?.schet_id
    })
  }, [current])

  const handleUpdate = () => {
    if (!current) {
      return
    }
    const rows = form.getValues('organizations')

    updateSaldo({
      id: Number(current.doc_id),
      month: form.getValues('month'),
      year: form.getValues('year'),
      organizations: rows
    })
  }

  return (
    <OrganSaldoUpdateManager
      form={form}
      isOpen={dialogToggle.isOpen}
      queuedMonths={queuedMonths}
      isFetching={isUpdating}
      isPending={isAutofilling || isUpdating}
      onSubmit={handleUpdate}
      totalRow={totalRow}
      year={form.watch('year')}
      month={form.watch('month')}
      onOpenChange={(open) => {
        if (!open) {
          form.reset({
            ...defaultValues,
            organizations: []
          })
          queryClient.invalidateQueries({
            queryKey: [OrganSaldoQueryKeys.getAll]
          })
          queryClient.invalidateQueries({
            queryKey: [OrganMonitorQueryKeys.getAll]
          })
          clearQueue()
        }
        dialogToggle.setOpen(open)
      }}
    />
  )
}
