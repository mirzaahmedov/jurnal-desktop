import type { Shartnoma } from '@renderer/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
// import { SelectField } from '@renderer/common/components'
// import { FormElement } from '@renderer/common/components/form'
import { Button } from '@renderer/common/components/ui/button'
import { Form } from '@renderer/common/components/ui/form'
import { DocumentType } from '@renderer/common/features/doc-num'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { parseDate } from '@renderer/common/lib/date'
import { cn } from '@renderer/common/lib/utils'
import {
  DocumentFields,
  OpisanieFields,
  SmetaFields,
  SummaEditableFields
} from '@renderer/common/widget/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { defaultValues, shartnomaQueryKeys } from '../config'
import { ShartnomaFormSchema, shartnomaService } from '../service'
import { ShartnomaKindFields } from './kind'
import { PudratchiFields } from './pudratchi'

type ShartnomaFormProps = {
  loading?: boolean
  dialog?: boolean
  organization: number
  original?: Shartnoma
  selected?: Shartnoma | undefined
  onSuccess?: () => void
}
export const ShartnomaForm = ({
  loading = false,
  dialog = true,
  organization,
  original,
  selected,
  onSuccess
}: ShartnomaFormProps) => {
  const queryClient = useQueryClient()
  const id = selected?.id

  const { t } = useTranslation()

  const form = useForm({
    resolver: zodResolver(ShartnomaFormSchema),
    defaultValues: original ?? defaultValues
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
    if (!selected) {
      form.reset(original ?? defaultValues)
      return
    }
    form.reset(selected)
  }, [form, original, selected, id])

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
              documentType={DocumentType.CONTRACT}
              autoGenerate={!selected}
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

          {/* <div className="p-5 flex items-center gap-10">
            <FormElement
              label={t('raschet-schet')}
              className="flex-1"
            >
              <SelectField
                options={raschetSchetOptions}
                getOptionValue={(o) => o.id}
                getOptionLabel={(o) => o.raschet_schet}
                triggerClassName="max-w-xs"
              />
            </FormElement>
            <FormElement
              label={t('raschet-schet-gazna')}
              className="flex-1"
            >
              <SelectField
                options={raschetSchetGaznaOptions}
                getOptionValue={(o) => o.id}
                getOptionLabel={(o) => o.raschet_schet_gazna}
                triggerClassName="max-w-xs"
              />
            </FormElement>
          </div> */}

          <div className={cn('p-5', dialog && 'p-0 pt-5')}>
            <OpisanieFields form={form} />
          </div>

          <div className={cn('grid grid-cols-2 gap-10', dialog && 'gap-20')}>
            <PudratchiFields
              form={form}
              className={dialog ? 'p-0' : undefined}
            />
            <ShartnomaKindFields
              form={form}
              className={dialog ? 'p-0' : undefined}
            />
          </div>
        </div>

        <div className={cn('p-5', dialog && 'p-0 pt-5')}>
          <Button
            type="submit"
            disabled={isCreating || isUpdating || loading}
          >
            {t('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// const raschetSchetOptions: Organization.RaschetSchet[] = [
//   { id: 1, spravochnik_organization_id: 100, raschet_schet: '12345678901234567890' },
//   { id: 2, spravochnik_organization_id: 100, raschet_schet: '98765432109876543210' },
//   { id: 3, spravochnik_organization_id: 100, raschet_schet: '56789012345678901234' }
// ]

// const raschetSchetGaznaOptions: Organization.RaschetSchetGazna[] = [
//   { id: 1, spravochnik_organization_id: 100, raschet_schet_gazna: '11223344556677889900' },
//   { id: 2, spravochnik_organization_id: 100, raschet_schet_gazna: '99887766554433221100' },
//   { id: 3, spravochnik_organization_id: 100, raschet_schet_gazna: '55667788990011223344' }
// ]
