import { useEffect, useMemo, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentType } from '@renderer/common/features/doc-num'
import {
  date_iso_regex,
  formatDate,
  parseDate,
  validateDate,
  withinMonth
} from '@renderer/common/lib/date'
import { focusInvalidInput } from '@renderer/common/lib/errors'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { DetailsView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import isEmpty from 'just-is-empty'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'
import { Form } from '@/common/components/ui/form'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import {
  DocumentFields,
  DoverennostFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'

import { createResponsibleSpravochnik } from '../../responsible/service'
import { RasxodFormSchema, defaultValues, queryKeys } from '../config'
import { useRasxodCreate, useRasxodGet, useRasxodUpdate } from '../service'
import { ProvodkaTable } from './provodka-table'

const Jurnal7RasxodDetailsPage = () => {
  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const navigate = useNavigate()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(RasxodFormSchema)
  })

  const { id } = useParams()
  const { t } = useTranslation(['app'])
  const { minDate, maxDate, recheckOstatok } = useOstatokStore()

  const { data: rasxod, isFetching } = useRasxodGet(Number(id))
  const { mutate: createRasxod, isPending: isCreating } = useRasxodCreate({
    onSuccess: (res) => {
      toast.success(res?.message)
      navigate(-1)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      recheckOstatok?.()
    },
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { mutate: updateRasxod, isPending: isUpdating } = useRasxodUpdate({
    onSuccess: (res) => {
      toast.success(res?.message)
      navigate(-1)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      recheckOstatok?.()
    },
    onError(error) {
      toast.error(error?.message)
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

  const childs = form.watch('childs')
  const summa = useMemo(() => {
    if (!Array.isArray(childs)) {
      return
    }
    return childs.reduce((acc, { summa = 0 }) => acc + summa, 0)
  }, [childs])

  useEffect(() => {
    form.reset(rasxod?.data ? rasxod.data : defaultValues)
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
  const doc_date = form.watch('doc_date')
  useEffect(() => {
    form.setValue(
      'childs',
      form.getValues('childs').map((child) => ({
        ...child,
        data_pereotsenka: child.data_pereotsenka ? child.data_pereotsenka : doc_date
      }))
    )
  }, [form, doc_date])
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
          title: t('pages.rasxod-docs'),
          path: '/journal-7/rasxod'
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
                validateDate={(date) => {
                  if (!validateDate(date)) {
                    if (date_iso_regex.test(date)) {
                      toast.error(t('date_does_not_exist'))
                    }
                    return false
                  }
                  const isValid = minDate <= parseDate(date) && parseDate(date) <= maxDate
                  if (!isValid && date?.length === 10) {
                    toast.error(
                      t('out_of_range', {
                        minDate: formatLocaleDate(formatDate(minDate)),
                        maxDate: formatLocaleDate(formatDate(maxDate))
                      })
                    )
                  }
                  return isValid
                }}
                calendarProps={{
                  fromMonth: minDate,
                  toMonth: maxDate
                }}
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

export default Jurnal7RasxodDetailsPage
