import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import isEmpty from 'just-is-empty'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { IznosQueryKeys } from '@/app/jur_7/iznos/config'
import { createResponsibleSpravochnik } from '@/app/jur_7/responsible/service'
import { SaldoQueryKeys } from '@/app/jur_7/saldo'
import { handleOstatokResponse } from '@/app/jur_7/saldo/utils'
import { Form } from '@/common/components/ui/form'
import { DocumentType } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { validateDateWithinSelectedMonth } from '@/common/features/selected-month'
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

import { SchetSumma } from '../../__components__/schet-summa'
import { InternalFormSchema, WarehouseInternalQueryKeys, defaultValues } from '../config'
import { WarehouseInternalService, useInternalCreate, useInternalUpdate } from '../service'
import { ProvodkaTable } from './provodka-table'

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
      doc_date: formatDate(startDate)
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

  const childs = useWatch({
    control: form.control,
    name: 'childs'
  })
  const debetSums = useMemo(() => {
    const uniqueSchets = new Set(childs.map((child) => child.debet_schet).filter(Boolean))
    const sums = Array.from(uniqueSchets).map((schet) => {
      return {
        schet,
        summa: childs
          .filter((child) => child.debet_schet === schet)
          .reduce((acc, child) => acc + child.summa, 0)
      }
    })
    sums.unshift({
      schet: t('debet'),
      summa: sums.reduce((acc, { summa }) => acc + summa, 0)
    })
    return sums
  }, [childs, t])
  const kreditSums = useMemo(() => {
    const uniqueSchets = new Set(childs.map((child) => child.kredit_schet).filter(Boolean))
    const sums = Array.from(uniqueSchets).map((schet) => {
      return {
        schet,
        summa: childs
          .filter((child) => child.kredit_schet === schet)
          .reduce((acc, child) => acc + child.summa, 0)
      }
    })
    sums.unshift({
      schet: t('kredit'),
      summa: sums.reduce((acc, { summa }) => acc + summa, 0)
    })
    return sums
  }, [childs, t])

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
        kimdan_id: internal.data.kimdan.id,
        kimga_id: internal.data.kimga.id,
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
      form.setValue('doc_date', formatDate(startDate))
    }
  }, [id, startDate, form])

  const { errors } = form.formState
  useEffect(() => {
    if (!isEmpty(errors)) focusInvalidInput()
  }, [errors])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
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

        <div className="p-5 overflow-x-auto scrollbar">
          <ProvodkaTable
            tabIndex={5}
            form={form}
          />
        </div>
        <div className="px-5 mt-5 mb-28 ">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(7, minmax(120px, 1fr))`
            }}
          >
            {debetSums.map(({ schet, summa }) => (
              <SchetSumma
                key={schet}
                schet={schet}
                summa={summa}
              />
            ))}
          </div>
          <div
            className="grid gap-2 mt-1"
            style={{
              gridTemplateColumns: `repeat(7,minmax(120px, 1fr))`
            }}
          >
            {kreditSums.map(({ schet, summa }) => (
              <SchetSumma
                key={schet}
                schet={schet}
                summa={summa}
              />
            ))}
          </div>
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default InternalDetails
