import { useEffect, useMemo, useRef } from 'react'

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
  DoverennostFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'

import { TotalsOverview } from '../../__components__/totals-overview'
import { RasxodFormSchema, WarehouseRasxodQueryKeys, defaultValues } from '../config'
import { WarehouseRasxodService, useRasxodCreate, useRasxodUpdate } from '../service'
import { ApplyAllInputs } from './apply-all-inputs'
import { ProvodkaTable } from './provodka-table'
import { changeOpisaniePowerOfAttorney, changeOpisanieSchetFaktura } from './utils'

interface RasxodDetailsProps {
  id: string | undefined
  onSuccess?: VoidFunction
}
const RasxodDetails = ({ id, onSuccess }: RasxodDetailsProps) => {
  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])
  const { startDate, endDate } = useSelectedMonthStore()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'jur7_rasxod'
  })

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    },
    resolver: zodResolver(RasxodFormSchema)
  })

  const { data: rasxod, isFetching } = useQuery({
    queryKey: [
      WarehouseRasxodQueryKeys.getById,
      Number(id),
      {
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: WarehouseRasxodService.getById,
    enabled: !!id
  })
  const { mutate: createRasxod, isPending: isCreating } = useRasxodCreate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)

      queryClient.invalidateQueries({
        queryKey: [WarehouseRasxodQueryKeys.getAll]
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
  const { mutate: updateRasxod, isPending: isUpdating } = useRasxodUpdate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)

      queryClient.invalidateQueries({
        queryKey: [WarehouseRasxodQueryKeys.getAll]
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

  const responsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('kimdan_id'),
      onChange: (value) => {
        form.setValue('kimdan_id', value ?? 0)
        form.trigger('kimdan_id')
      }
    })
  )

  const onSubmit = form.handleSubmit((values) => {
    if (id === 'create') {
      createRasxod(values)
      return
    }
    updateRasxod({ id: Number(id), ...values })
  })

  const childs = useWatch({
    control: form.control,
    name: 'childs'
  })
  const summa = useMemo(() => {
    if (!Array.isArray(childs)) {
      return
    }
    return childs.reduce((acc, { summa = 0 }) => acc + summa, 0)
  }, [childs])

  useEffect(() => {
    if (rasxod?.data) {
      form.reset({
        ...rasxod.data,
        childs: rasxod.data.childs.map((child) => ({
          ...child,
          name: child.product.name,
          group_number: child.group.group_number,
          group_jur7_id: child.group.id,
          edin: child.product.edin,
          inventar_num: child.product.inventar_num,
          serial_num: child.product.serial_num
        }))
      })
      return
    }
  }, [form, rasxod])

  const kimdan_id = form.watch('kimdan_id')
  useEffect(() => {
    if (kimdan_id !== prevData.current.kimdan_id && prevData.current.kimdan_id) {
      if (kimdan_id) {
        form.setValue(
          'childs',
          form.watch('childs').map((child) => ({
            ...child,
            naimenovanie_tovarov_jur7_id: 0
          }))
        )
        prevData.current.kimdan_id = kimdan_id
      }
      prevData.current.kimdan_id = kimdan_id
    }
  }, [form, kimdan_id])
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

  const totals = useMemo(() => {
    const results = {
      total: 0,
      _01: 0,
      _06: 0,
      _07: 0,
      iznos: 0
    }
    childs?.forEach((child) => {
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
  }, [childs])

  useEffect(() => {
    changeOpisanieSchetFaktura({
      form,
      doc_num: form.watch('doc_num'),
      doc_date: form.watch('doc_date')
    })
  }, [form, form.watch('doc_num'), form.watch('doc_date')])
  useEffect(() => {
    changeOpisaniePowerOfAttorney({
      form,
      attorney: form.watch('doverennost') ?? ''
    })
  }, [form, form.watch('doverennost')])

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
                documentType={DocumentType.JUR7_PRIXOD}
                autoGenerate={id === 'create'}
              />
              <div className="grid grid-cols-2 pb-7">
                <DoverennostFields
                  tabIndex={2}
                  form={form}
                />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <ResponsibleFields
                tabIndex={3}
                name={t('from-who')}
                spravochnik={responsibleSpravochnik}
                error={form.formState.errors.kimdan_id}
              />
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
              <DetailsView.Create isDisabled={isCreating || isUpdating} />
            </DetailsView.Footer>
          </form>
        </Form>

        <div className="px-5 flex justify-end">
          <ApplyAllInputs
            onApply={({ schet }) => {
              form.getValues('childs').forEach((_, index) => {
                form.setValue(`childs.${index}.debet_schet`, schet, { shouldValidate: true })
              })
            }}
          />
        </div>
        <div className="p-5 overflow-x-auto scrollbar">
          <ProvodkaTable
            tabIndex={5}
            form={form}
          />
        </div>
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

export default RasxodDetails
