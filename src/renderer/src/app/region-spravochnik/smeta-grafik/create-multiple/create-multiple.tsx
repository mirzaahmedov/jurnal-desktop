import { useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { FormElement } from '@/common/components/form'
import { Form, FormField } from '@/common/components/ui/form'
import { YearSelect } from '@/common/components/year-select'
import { DetailsView } from '@/common/views'

import { SmetaGrafikFormSchema, defaultValues } from '../config'
import { SmetaGrafikService } from '../service'
import { provodki } from './provodki'

export const SmetaGrafikBatchCreate = () => {
  const navigate = useNavigate()
  const tableRef = useRef<HTMLTableElement>(null)

  const form = useForm({
    resolver: zodResolver(SmetaGrafikFormSchema),
    defaultValues: defaultValues
  })

  const { t } = useTranslation()

  const { mutate: batchCreateSnetaGrafik } = useMutation({
    mutationFn: SmetaGrafikService.batchCreate,
    onSuccess: (res) => {
      toast.success(res?.message)
      navigate(-1)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    batchCreateSnetaGrafik(values)
  })

  const smetas = useWatch({
    control: form.control,
    name: 'smetas'
  })

  useEffect(() => {
    const totals = smetas.map((smeta) => {
      return (
        smeta.oy_1 +
        smeta.oy_2 +
        smeta.oy_3 +
        smeta.oy_4 +
        smeta.oy_5 +
        smeta.oy_6 +
        smeta.oy_7 +
        smeta.oy_8 +
        smeta.oy_9 +
        smeta.oy_10 +
        smeta.oy_11 +
        smeta.oy_12
      )
    })

    totals.forEach((total, index) => {
      if (form.getValues(`smetas.${index}.total`) !== total) {
        form.setValue(`smetas.${index}.total`, total)
        if (total !== 0) {
          const fields = Array.from({ length: 12 }, (_, i) => `smetas.${index}.oy_${i + 1}`)
          form.trigger(fields as any)
        }
      }
    })
  }, [smetas, form])

  console.log({ errors: form.formState.errors, values: form.watch() })

  return (
    <DetailsView>
      <DetailsView.Content>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="p-5 flex items-center">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormElement
                    label={t('year')}
                    direction="column"
                  >
                    <YearSelect
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      className="w-24"
                    />
                  </FormElement>
                )}
              />
            </div>
            <EditableTable
              tableRef={tableRef}
              tabIndex={5}
              columnDefs={provodki}
              form={form}
              name="smetas"
              errors={form.formState.errors.smetas}
              onCreate={createEditorCreateHandler({
                form,
                schema: SmetaGrafikFormSchema,
                defaultValues: defaultValues.smetas[0],
                field: 'smetas'
              })}
              onDelete={createEditorDeleteHandler({
                form,
                field: 'smetas'
              })}
              validate={({ id, key, payload }) => {
                if (key !== 'smeta_id') {
                  return true
                }

                return !form.getValues('smetas').some((smeta, index) => {
                  if (smeta.smeta_id && payload.smeta_id === smeta.smeta_id && id !== index) {
                    toast.error('Проводка с этой сметой уже существует')

                    const input = tableRef?.current?.querySelector(
                      `[data-editorid="${index}-smeta_id"]`
                    ) as HTMLInputElement
                    if (input) {
                      setTimeout(() => {
                        input.focus()
                      }, 100)
                    }

                    return true
                  }
                  return false
                })
              }}
            />
            <DetailsView.Footer>
              <DetailsView.Create type="submit">{t('create')}</DetailsView.Create>
            </DetailsView.Footer>
          </form>
        </Form>
      </DetailsView.Content>
    </DetailsView>
  )
}
