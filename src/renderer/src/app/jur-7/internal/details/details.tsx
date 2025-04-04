import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import isEmpty from 'just-is-empty'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { iznosQueryKeys } from '@/app/jur-7/iznos/config'
import { ostatokQueryKeys } from '@/app/jur-7/ostatok'
import { useOstatokStore } from '@/app/jur-7/ostatok/store'
import { handleOstatokResponse, validateOstatokDate } from '@/app/jur-7/ostatok/utils'
import { createResponsibleSpravochnik } from '@/app/jur-7/responsible/service'
import { Form } from '@/common/components/ui/form'
import { DocumentType } from '@/common/features/doc-num'
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

import { InternalFormSchema, defaultValues, internalQueryKeys } from '../config'
import { useInternalCreate, useInternalGet, useInternalUpdate } from '../service'
import { ProvodkaTable } from './provodka-table'

interface InternalDetailsProps {
  id: string | undefined
  onSuccess?: VoidFunction
}
const InternalDetails = ({ id, onSuccess: onSuccess }: InternalDetailsProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])
  const { minDate, maxDate } = useOstatokStore()

  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'jur7_internal'
  })

  const { data: internalTransfer, isFetching } = useInternalGet(Number(id))

  const { mutate: createInternal, isPending: isCreating } = useInternalCreate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)
      queryClient.invalidateQueries({
        queryKey: [internalQueryKeys.getAll]
      })

      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [iznosQueryKeys.getAll]
      })

      onSuccess?.()
    }
  })

  const { mutate: updateInternal, isPending: isUpdating } = useInternalUpdate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)
      queryClient.invalidateQueries({
        queryKey: [internalQueryKeys.getAll]
      })

      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [iznosQueryKeys.getAll]
      })

      onSuccess?.()
    }
  })

  const form = useForm({
    defaultValues,
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
    if (!internalTransfer?.data) {
      form.reset(defaultValues)
      return
    }
    form.reset({
      ...internalTransfer.data,
      kimdan_id: internalTransfer.data.kimdan.id,
      kimga_id: internalTransfer.data.kimga.id,
      childs: internalTransfer.data.childs.map((child) => ({
        ...child,
        group_jur7_id: child.group.id,
        name: child.product.name,
        group_number: child.group.group_number,
        edin: child.product.edin,
        inventar_num: child.product.inventar_num,
        serial_num: child.product.serial_num
      }))
    })
  }, [form, internalTransfer])
  useEffect(() => {
    if (id !== 'create') {
      return
    }

    const docDate = parseDate(form.watch('doc_date'))

    if (!docDate || !withinMonth(docDate, minDate)) {
      form.setValue('doc_date', formatDate(minDate))
    }
  }, [id, minDate, form])

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
                validateDate={id === 'create' ? validateOstatokDate : undefined}
                calendarProps={
                  id === 'create'
                    ? {
                        fromMonth: minDate,
                        toMonth: maxDate
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
                disabled={isCreating || isUpdating}
              />
            </DetailsView.Footer>
          </form>
        </Form>

        <div className="p-5 mb-28 overflow-x-auto scrollbar">
          <ProvodkaTable
            tabIndex={5}
            form={form}
          />
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default InternalDetails
