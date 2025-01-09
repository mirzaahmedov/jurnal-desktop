import {
  DocumentFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'
import { InternalTransferFormSchema, defaultValues } from '../config'
import { parseDate, withinMonth } from '@renderer/common/lib/date'
import { useEffect, useMemo } from 'react'
import {
  useInternalTransferCreate,
  useInternalTransferGet,
  useInternalTransferUpdate
} from '../service'
import { useNavigate, useParams } from 'react-router-dom'

import { DetailsView } from '@renderer/common/views'
import { Form } from '@/common/components/ui/form'
import { ProvodkaTable } from './provodka-table'
import { createResponsibleSpravochnik } from '../../responsible/service'
import { toast } from '@/common/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { useJurnal7DefaultsStore } from '../../common/features/defaults'
import { useLayout } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

const InternalTransferDetailsPage = () => {
  const { id } = useParams()

  const { from } = useJurnal7DefaultsStore()
  const { data: internalTransfer, isFetching } = useInternalTransferGet(Number(id))
  const { mutate: createInternalTransfer, isPending: isCreating } = useInternalTransferCreate({
    onSuccess: () => {
      toast({
        title: 'Внутренний перевод успешно создан'
      })
      navigate(-1)
    },
    onError() {
      toast({
        title: 'Ошибка при создании внутреннего перевода',
        variant: 'destructive'
      })
    }
  })

  const { mutate: updateInternalTransfer, isPending: isUpdating } = useInternalTransferUpdate({
    onSuccess() {
      toast({
        title: 'Внутренний перевод успешно обновлен'
      })
      navigate(-1)
    },
    onError() {
      toast({
        title: 'Ошибка при обновлении внутреннего перевода',
        variant: 'destructive'
      })
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
        form.setValue('kimdan_id', value)
        form.trigger('kimdan_id')
      }
    })
  )
  const kimgaResponsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('kimga_id'),
      onChange: (value) => {
        form.setValue('kimga_id', value)
        form.trigger('kimga_id')
      }
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
    form.reset(internalTransfer?.data ? internalTransfer.data : defaultValues)
  }, [form, internalTransfer])
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

  useLayout({
    title:
      id === 'create' ? 'Создать внутрь. пере. документ' : 'Редактировать внутрь. пере. документ',
    onBack() {
      navigate(-1)
    }
  })

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
            </div>
            <div className="grid grid-cols-2">
              <ResponsibleFields
                name="От кого"
                spravochnik={kimdanResponsibleSpravochnik}
                error={form.formState.errors.kimdan_id}
              />
              <ResponsibleFields
                name="Кому"
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
              <OpisanieFields form={form} />
            </div>
            <DetailsView.Footer>
              <DetailsView.Create disabled={isCreating || isUpdating} />
            </DetailsView.Footer>
          </form>
        </Form>

        <div className="p-5 pb-28">
          <ProvodkaTable form={form} />
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export { InternalTransferDetailsPage }
