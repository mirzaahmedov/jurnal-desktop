import type { UseFormReturn } from 'react-hook-form'

import { type FC, useEffect, useRef } from 'react'

import { t } from 'i18next'
import { toast } from 'react-toastify'

import {
  EditableTable,
  EditableTableCell,
  EditableTableRow
} from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { Input } from '@/common/components/ui/input'
import { inputVariants } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

import { defaultValues } from '../config'
import { type ShartnomaFormValues, ShartnomaGrafikFormSchema } from '../service'
import { provodkaColumns } from './provodka'

export const ShartnomaGrafikForm: FC<{
  form: UseFormReturn<ShartnomaFormValues>
  itogo: number
}> = ({ form, itogo }) => {
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    if (itogo !== 0) {
      form.trigger('grafiks')
    }
  }, [form, itogo])

  return (
    <EditableTable
      tableRef={tableRef}
      tabIndex={5}
      columnDefs={provodkaColumns}
      form={form}
      name="grafiks"
      errors={form.formState.errors.grafiks}
      onCreate={createEditorCreateHandler({
        form,
        schema: ShartnomaGrafikFormSchema,
        defaultValues: defaultValues.grafiks[0],
        field: 'grafiks'
      })}
      onDelete={createEditorDeleteHandler({
        form,
        field: 'grafiks'
      })}
      validate={({ id, key, payload }) => {
        if (key !== 'smeta_id') {
          return true
        }

        return !form.getValues('grafiks').some((child, index) => {
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
      footerRows={
        <EditableTableRow className="!border">
          <EditableTableCell colSpan={14}>
            <div className="flex items-center">
              <h1 className="px-3 font-bold">{t('total')}</h1>
              <Input
                aria-hidden
                readOnly
                tabIndex={-1}
                className={cn(
                  inputVariants({ editor: true }),
                  'pointer-events-none font-bold text-right'
                )}
                value={formatNumber(itogo)}
              />
            </div>
          </EditableTableCell>
          <EditableTableCell></EditableTableCell>
        </EditableTableRow>
      }
    />
  )
}
