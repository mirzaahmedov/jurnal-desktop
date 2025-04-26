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

import { SmetaGrafikBatchFormSchema, defaultBatchValues } from '../config'
import { SmetaGrafikService } from '../service'
import { provodki } from './provodki'

export const SmetaGrafikDetails = () => {
  const navigate = useNavigate()
  const tableRef = useRef<HTMLTableElement>(null)

  const form = useForm({
    resolver: zodResolver(SmetaGrafikBatchFormSchema),
    defaultValues: defaultBatchValues
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

  const values = useWatch({
    control: form.control,
    name: 'smetas'
  })

  useEffect(() => {
    form.trigger('smetas')
  }, [values, form])

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
                schema: SmetaGrafikBatchFormSchema,
                defaultValues: defaultBatchValues.smetas[0],
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

                return !form.getValues('smetas').some((child, index) => {
                  if (id !== index && payload.smeta_id === child.smeta_id) {
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
