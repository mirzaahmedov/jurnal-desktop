import {
  DocumentFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'
import { InternalFormSchema, WarehouseInternalQueryKeys, defaultValues } from '../config'
import { ItogoBySchets, getItogoBySchets } from '../../__components__/itogo-by-schets'
import { WarehouseInternalService, useInternalCreate, useInternalUpdate } from '../service'
import { formatDate, parseDate, withinMonth } from '@/common/lib/date'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'

import { DetailsView } from '@/common/views'
import { DocumentType } from '@/common/features/doc-num'
import { Form } from '@/common/components/ui/form'
import { IznosQueryKeys } from '@/app/jur_7/iznos/config'
import { ProvodkaTable } from './provodka-table'
import { SaldoQueryKeys } from '@/app/jur_7/saldo'
import { createResponsibleSpravochnik } from '@/app/jur_7/responsible/service'
import { focusInvalidInput } from '@/common/lib/errors'
import { handleOstatokResponse } from '@/app/jur_7/saldo/utils'
import isEmpty from 'just-is-empty'
import { toast } from 'react-toastify'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSnippets } from '@/common/features/snippents/use-snippets'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'

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
  const itogoBySchets = useMemo(() => {
    return getItogoBySchets(childs, t)
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
        <div className="mb-20 p-5">
          <ItogoBySchets rows={itogoBySchets} />
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default InternalDetails
