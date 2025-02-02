import { useEffect, useMemo, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate, withinMonth } from '@renderer/common/lib/date'
import { focusInvalidInput } from '@renderer/common/lib/errors'
import { DetailsView } from '@renderer/common/views'
import isEmpty from 'just-is-empty'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { Form } from '@/common/components/ui/form'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { toast } from '@/common/hooks/use-toast'
import {
  DocumentFields,
  DoverennostFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'

import { useJurnal7DefaultsStore } from '../../common/features/defaults'
import { createResponsibleSpravochnik } from '../../responsible/service'
import { RasxodFormSchema, defaultValues } from '../config'
import { useRasxodCreate, useRasxodGet, useRasxodUpdate } from '../service'
import { ProvodkaTable } from './provodka-table'

const MO7RasxodDetailsPage = () => {
  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const { id } = useParams()
  const { t } = useTranslation(['app'])

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { from } = useJurnal7DefaultsStore()
  const { data: rasxod, isFetching } = useRasxodGet(Number(id))
  const { mutate: createRasxod, isPending: isCreating } = useRasxodCreate({
    onSuccess: () => {
      toast({
        title: 'Расходный документ успешно создан'
      })
      navigate(-1)
    },
    onError() {
      toast({
        title: 'Ошибка при создании расходного документа',
        variant: 'destructive'
      })
    }
  })
  const { mutate: updateRasxod, isPending: isUpdating } = useRasxodUpdate({
    onSuccess() {
      toast({
        title: 'Расходный документ успешно обновлен'
      })
      navigate(-1)
    },
    onError() {
      toast({
        title: 'Ошибка при обновлении расходного документа',
        variant: 'destructive'
      })
    }
  })

  const navigate = useNavigate()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(RasxodFormSchema)
  })

  const responsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('kimdan_id'),
      onChange: (value) => {
        form.setValue('kimdan_id', value)
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

    const defaultDate = parseDate(from)
    const docDate = parseDate(form.watch('doc_date'))

    if (!docDate || !withinMonth(docDate, defaultDate)) {
      form.setValue('doc_date', from)
    }
  }, [id, from, form])

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
                form={form}
                validateDocDate={(date) => {
                  return withinMonth(new Date(date), parseDate(from))
                }}
                calendarProps={{
                  fromMonth: parseDate(from),
                  toMonth: parseDate(from)
                }}
              />
              <div className="grid grid-cols-2 pb-7">
                <DoverennostFields form={form} />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <ResponsibleFields
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
              <OpisanieFields form={form} />
            </div>
            <DetailsView.Footer>
              <DetailsView.Create disabled={isCreating || isUpdating} />
            </DetailsView.Footer>
          </form>
        </Form>

        <div className="p-5 mb-28 overflow-x-auto scrollbar">
          <ProvodkaTable form={form} />
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export { MO7RasxodDetailsPage }
