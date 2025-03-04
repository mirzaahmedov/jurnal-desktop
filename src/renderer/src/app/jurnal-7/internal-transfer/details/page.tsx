import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentType } from '@renderer/common/features/doc-num'
import { formatDate, parseDate, withinMonth } from '@renderer/common/lib/date'
import { focusInvalidInput } from '@renderer/common/lib/errors'
import { DetailsView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import isEmpty from 'just-is-empty'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'
import { handleOstatokResponse, validateOstatokDate } from '@/app/jurnal-7/ostatok/utils'
import { createResponsibleSpravochnik } from '@/app/jurnal-7/responsible/service'
import { Form } from '@/common/components/ui/form'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import {
  DocumentFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'

import { InternalTransferFormSchema, defaultValues, queryKeys } from '../config'
import {
  useInternalTransferCreate,
  useInternalTransferGet,
  useInternalTransferUpdate
} from '../service'
import { ProvodkaTable } from './provodka-table'

const Jurnal7InternalTransferDetailsPage = () => {
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { id } = useParams()
  const { t } = useTranslation(['app'])
  const { data: internalTransfer, isFetching } = useInternalTransferGet(Number(id))
  const { minDate, maxDate, recheckOstatok } = useOstatokStore()

  const { mutate: createInternalTransfer, isPending: isCreating } = useInternalTransferCreate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      navigate(-1)
      recheckOstatok?.()
    },
    onError(error) {
      toast.error(error?.message)
    }
  })

  const { mutate: updateInternalTransfer, isPending: isUpdating } = useInternalTransferUpdate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      navigate(-1)
      recheckOstatok?.()
    },
    onError(error) {
      toast.error(error?.message)
    }
  })

  const navigate = useNavigate()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(InternalTransferFormSchema)
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
      createInternalTransfer(values)
      return
    }
    updateInternalTransfer({ id: Number(id), ...values })
  })

  const values = form.watch()
  const summa = useMemo(() => {
    if (!Array.isArray(values.childs)) {
      return
    }
    return values.childs.reduce((acc, { summa = 0 }) => acc + summa, 0)
  }, [values])

  useEffect(() => {
    form.reset(
      internalTransfer?.data
        ? {
            ...internalTransfer.data,
            kimga_id: internalTransfer.data.kimga_id ?? internalTransfer.data.kimga.id
          }
        : defaultValues
    )
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

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        },
        {
          title: t('pages.internal-docs'),
          path: '/journal-7/internal-transfer'
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

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
                validateDate={validateOstatokDate}
                calendarProps={{
                  fromMonth: minDate,
                  toMonth: maxDate
                }}
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

export default Jurnal7InternalTransferDetailsPage
