import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import isEmpty from 'just-is-empty'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { IznosQueryKeys } from '@/app/jur_7/iznos/config'
import { createResponsibleSpravochnik } from '@/app/jur_7/responsible/service'
import { SaldoQueryKeys } from '@/app/jur_7/saldo'
import { handleOstatokResponse } from '@/app/jur_7/saldo/utils'
import { Form } from '@/common/components/ui/form'
import { DocumentType } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSnippets } from '@/common/features/snippents/use-snippets'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, parseDate, withinMonth } from '@/common/lib/date'
import { focusInvalidInput } from '@/common/lib/errors'
import { DetailsView } from '@/common/views'
import {
  DocumentFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'

import { TotalsOverview } from '../../__components__/totals-overview'
import { InternalFormSchema, WarehouseInternalQueryKeys, defaultValues } from '../config'
import { WarehouseInternalService, useInternalCreate, useInternalUpdate } from '../service'
import { ProvodkaTable } from './provodka-table'
import { changeOpisanieSchetFaktura } from './utils'

interface InternalDetailsProps {
  id: string | undefined
  onSuccess?: VoidFunction
}
const InternalDetails = ({ id, onSuccess: onSuccess }: InternalDetailsProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { startDate, endDate } = useSelectedMonthStore()

  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'jur7_internal'
  })

  const defaultDate = () =>
    startDate <= new Date() && new Date() <= endDate
      ? formatDate(new Date())
      : formatDate(startDate)

  const { data: internal, isFetching } = useQuery({
    queryKey: [
      WarehouseInternalQueryKeys.getById,
      Number(id),
      {
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: WarehouseInternalService.getById,
    enabled: !!id
  })

  const { mutate: createInternal, isPending: isCreating } = useInternalCreate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)
      queryClient.invalidateQueries({
        queryKey: [WarehouseInternalQueryKeys.getAll]
      })

      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })

      onSuccess?.()
    }
  })

  const { mutate: updateInternal, isPending: isUpdating } = useInternalUpdate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)
      queryClient.invalidateQueries({
        queryKey: [WarehouseInternalQueryKeys.getAll]
      })

      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })

      onSuccess?.()
    }
  })

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      doc_date: defaultDate()
    },
    resolver: zodResolver(InternalFormSchema)
  })

  const kimdanResponsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('kimdan_id'),
      onChange: (value) => {
        form.setValue('kimdan_id', value ?? 0)
        form.trigger('kimdan_id')
      },
      disabledIds: [form.watch('kimga_id')]
    })
  )
  const kimgaResponsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('kimga_id'),
      onChange: (value) => {
        form.setValue('kimga_id', value ?? 0)
        form.trigger('kimga_id')
      },
      disabledIds: [form.watch('kimdan_id')]
    })
  )

  const onSubmit = form.handleSubmit((values) => {
    if (id === 'create') {
      createInternal(values)
      return
    }
    updateInternal({ id: Number(id), ...values })
  })

  const values = form.watch()
  const summa = useMemo(() => {
    if (!Array.isArray(values.childs)) {
      return
    }
    return values.childs.reduce((acc, { summa = 0 }) => acc + summa, 0)
  }, [values])

  useEffect(() => {
    if (internal?.data) {
      form.reset({
        ...internal.data,
        kimdan_id: internal.data.kimdan_id,
        kimga_id: internal.data.kimga_id,
        childs: internal.data.childs.map((child) => ({
          ...child,
          group_jur7_id: child.group.id,
          name: child.product.name,
          group_number: child.group.group_number,
          edin: child.product.edin,
          inventar_num: child.product.inventar_num,
          serial_num: child.product.serial_num
        }))
      })
    }
  }, [form, internal])
  useEffect(() => {
    if (id !== 'create') {
      return
    }

    const docDate = parseDate(form.watch('doc_date'))

    if (!docDate || !withinMonth(docDate, startDate)) {
      form.setValue('doc_date', defaultDate())
    }
  }, [id, startDate, form])

  const { errors } = form.formState
  useEffect(() => {
    if (!isEmpty(errors)) focusInvalidInput()
  }, [errors])

  const totals = useMemo(() => {
    const results = {
      total: 0,
      _01: 0,
      _06: 0,
      _07: 0,
      iznos: 0
    }
    values.childs?.forEach((child) => {
      results.total += child.summa || 0
      if (child.kredit_schet.startsWith('01')) {
        results._01 += child.summa || 0
      } else if (child.kredit_schet.startsWith('06')) {
        results._06 += child.summa || 0
      } else if (child.kredit_schet.startsWith('07')) {
        results._07 += child.summa || 0
      }
      results.iznos += child.iznos_summa || 0
    })
    return results
  }, [values.childs])

  useEffect(() => {
    changeOpisanieSchetFaktura({
      form,
      doc_num: form.watch('doc_num') ?? '',
      doc_date: form.watch('doc_date') ?? ''
    })
  }, [form, form.watch('doc_num'), form.watch('doc_date')])

  return (
    <DetailsView>
      <DetailsView.Content isLoading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2 items-end">
              <DocumentFields
                tabIndex={1}
                form={form}
                validateDate={id === 'create' ? validateDateWithinSelectedMonth : undefined}
                calendarProps={
                  id === 'create'
                    ? {
                        fromMonth: startDate,
                        toMonth: endDate
                      }
                    : undefined
                }
                documentType={DocumentType.JUR7_INTERNAL}
                autoGenerate={id === 'create'}
              />
            </div>
            <div className="grid grid-cols-2">
              <ResponsibleFields
                tabIndex={2}
                name={t('from-who')}
                spravochnik={kimdanResponsibleSpravochnik}
                error={form.formState.errors.kimdan_id}
              />
              <ResponsibleFields
                tabIndex={3}
                name={t('to-whom')}
                spravochnik={kimgaResponsibleSpravochnik}
                error={form.formState.errors.kimga_id}
              />
            </div>
            <div className="grid grid-cols-2">
              <SummaFields
                data={{
                  summa
                }}
              />
            </div>
            <div className="p-5">
              <OpisanieFields
                tabIndex={4}
                form={form}
                snippets={snippets}
                addSnippet={addSnippet}
                removeSnippet={removeSnippet}
              />
            </div>
            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={6}
                isDisabled={isCreating || isUpdating}
              />
            </DetailsView.Footer>
          </form>
        </Form>
        <ProvodkaTable
          tabIndex={5}
          form={form}
        />
        <div className="mb-20 p-5">
          <TotalsOverview
            total={totals.total}
            _01={totals._01}
            _06={totals._06}
            _07={totals._07}
            iznos={totals.iznos}
          />
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default InternalDetails
