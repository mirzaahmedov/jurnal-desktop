import { DetailsPage, DetailsPageCreateBtn, DetailsPageFooter } from '@/common/layout/details'
import {
  DocumentFields,
  OpisanieFields,
  ResponsibleFields,
  SummaFields
} from '@/common/widget/form'
import { InternalTransferFormSchema, defaultValues } from '../config'
import { useEffect, useMemo } from 'react'
import {
  useInternalTransferCreate,
  useInternalTransferGet,
  useInternalTransferUpdate
} from '../service'
import { useNavigate, useParams } from 'react-router-dom'

import { Form } from '@/common/components/ui/form'
import { ProvodkaTable } from './provodka-table'
import { createResponsibleSpravochnik } from '../../responsible/service'
import { toast } from '@/common/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { useLayout } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

const InternalTransferDetailsPage = () => {
  const { id } = useParams()

  const { data: internalTransfer, isFetching } = useInternalTransferGet(Number(id))
  const { mutate: createInternalTransfer, isPending: isCreating } = useInternalTransferCreate({
    onSuccess: () => {
      toast({
        title: 'Внутренний перевод успешно создан'
      })
      navigate('/journal-7/internal-transfer')
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
      navigate('/journal-7/internal-transfer')
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

  useLayout({
    title:
      id === 'create' ? 'Создать внутрь. пере. документ' : 'Редактировать внутрь. пере. документ',
    onBack() {
      navigate(-1)
    }
  })

  console.log(form.formState.errors)

  return (
    <DetailsPage loading={isFetching}>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 items-end">
            <DocumentFields form={form} />
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

export { InternalTransferDetailsPage }
