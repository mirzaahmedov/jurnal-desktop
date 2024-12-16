import { DetailsPage, DetailsPageCreateBtn, DetailsPageFooter } from '@/common/layout/details'
import {
  DocumentFields,
  DoverennostFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'
import { RasxodFormSchema, defaultValues } from '../config'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRasxodCreate, useRasxodGet, useRasxodUpdate } from '../service'

import { Form } from '@/common/components/ui/form'
import { ProvodkaTable } from './provodka-table'
import { createResponsibleSpravochnik } from '../../responsible/service'
import { toast } from '@/common/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { useLayout } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

const MO7RasxodDetailsPage = () => {
  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const { id } = useParams()

  const { data: rasxod, isFetching } = useRasxodGet(Number(id))
  const { mutate: createRasxod, isPending: isCreating } = useRasxodCreate({
    onSuccess: () => {
      toast({
        title: 'Расходный документ успешно создан'
      })
      navigate('/journal-7/rasxod')
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
      navigate('/journal-7/rasxod')
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
    if (kimdan_id !== prevData.current.kimdan_id) {
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

  useLayout({
    title: id === 'create' ? 'Создать расходный документ' : 'Редактировать расходный документ',
    onBack() {
      navigate(-1)
    }
  })

  return (
    <DetailsPage loading={isFetching}>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 items-end">
            <DocumentFields form={form} />
            <div className="grid grid-cols-2 pb-7">
              <DoverennostFields form={form} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <ResponsibleFields
              name="От кого"
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
          <DetailsPageFooter>
            <DetailsPageCreateBtn disabled={isCreating || isUpdating} />
          </DetailsPageFooter>
        </form>
      </Form>

      <div className="p-5 pb-28">
        <ProvodkaTable form={form} />
      </div>
    </DetailsPage>
  )
}

export { MO7RasxodDetailsPage }
