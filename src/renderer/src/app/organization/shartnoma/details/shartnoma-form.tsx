import {
  DocumentFields,
  OpisanieFields,
  SmetaFields,
  SummaEditableFields
} from '@renderer/common/widget/form'
import { ShartnomaFormSchema, shartnomaService } from '../service'
import { defaultValues, shartnomaQueryKeys } from '../constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DetailsView } from '@renderer/common/views'
import { Form } from '@renderer/common/components/ui/form'
import { PudratchiFields } from './pudratchi'
import { Shartnoma } from '@renderer/common/models'
import { ShartnomaKindFields } from './kind'
import { cn } from '@renderer/common/lib/utils'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { parseDate } from '@renderer/common/lib/date'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

type ShartnomaFormProps = {
  dialog?: boolean
  organization: number
  selected?: Shartnoma | undefined
  onSuccess?: () => void
}
export const ShartnomaForm = ({
  dialog = true,
  organization,
  selected,
  onSuccess
}: ShartnomaFormProps) => {
  const queryClient = useQueryClient()
  const id = selected?.id

  const form = useForm({
    resolver: zodResolver(ShartnomaFormSchema),
    defaultValues
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      value: form.watch('smeta_id'),
      onChange: (value) => {
        form.setValue('smeta_id', value)
        form.trigger('smeta_id')
      }
    })
  )

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [shartnomaQueryKeys.create],
    mutationFn: shartnomaService.create,
    onSuccess() {
      toast.success('Документ успешно создан')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getById, id]
      })

      onSuccess?.()
    },
    onError(error) {
      console.error(error)
      toast.error('Не удалось создать документ:' + error.message)
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [shartnomaQueryKeys.update, id],
    mutationFn: shartnomaService.update,
    onSuccess() {
      toast.success('Документ успешно обновлен')

      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getById, id]
      })

      onSuccess?.()
    },
    onError(error) {
      console.error(error)
      toast.error('Не удалось обновить документ:' + error.message)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    const {
      doc_date,
      doc_num,
      spravochnik_organization_id,
      smeta_id,
      smeta2_id,
      summa,
      opisanie,
      pudratchi_bool,
      yillik_oylik,
      grafik_year
    } = payload

    if (selected) {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        spravochnik_organization_id,
        smeta_id,
        smeta2_id,
        summa,
        opisanie,
        pudratchi_bool,
        yillik_oylik,
        grafik_year
      })
      return
    }

    create({
      doc_date,
      doc_num,
      spravochnik_organization_id,
      smeta_id,
      smeta2_id,
      summa,
      opisanie,
      pudratchi_bool,
      yillik_oylik,
      grafik_year: parseDate(doc_date).getFullYear()
    })
  })

  useEffect(() => {
    if (!organization) {
      toast.error('Выберите организацию')
      return
    }
  }, [toast, organization])

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }
    form.reset(selected)
  }, [form, selected, id])

  useEffect(() => {
    if (organization) {
      form.setValue('spravochnik_organization_id', organization)
    } else {
      form.setValue('spravochnik_organization_id', 0)
    }
  }, [form, organization])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div>
          <div className="flex">
            <DocumentFields
              tabIndex={1}
              dialog={dialog}
              form={form}
            />
          </div>

          <div className={cn('grid grid-cols-2 gap-10', dialog && 'grid-cols-1 gap-1')}>
            <SummaEditableFields
              dialog={dialog}
              tabIndex={2}
              form={form}
            />
            <SmetaFields
              tabIndex={3}
              dialog={dialog}
              error={form.formState.errors.smeta_id}
              spravochnik={smetaSpravochnik}
            />
          </div>

          <div className={cn('p-5', dialog && 'p-0 pt-5')}>
            <OpisanieFields form={form} />
          </div>

          <div className="grid grid-cols-2 gap-10">
            <PudratchiFields form={form} />
            <ShartnomaKindFields form={form} />
          </div>
        </div>

        <DetailsView.Footer className="left-0">
          <DetailsView.Create disabled={isCreating || isUpdating} />
        </DetailsView.Footer>
      </form>
    </Form>
  )
}
