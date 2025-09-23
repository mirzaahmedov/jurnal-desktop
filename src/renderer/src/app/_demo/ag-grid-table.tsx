import { useCallback, useMemo, useRef } from 'react'

import {
  AllCommunityModule,
  type ColDef,
  type IAfterGuiAttachedParams,
  ModuleRegistry
} from 'ag-grid-community'
import {
  AgGridReact,
  type AgGridReactProps,
  type CustomFilterProps,
  useGridFilterDisplay
} from 'ag-grid-react'
import {
  type FieldArrayPath,
  FormProvider,
  type UseFormReturn,
  useFieldArray
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Input } from '@/common/components/ui/input'

ModuleRegistry.registerModules([AllCommunityModule])

export interface AgGridTableProps<T extends object> extends AgGridReactProps {
  form: UseFormReturn<T>
  arrayName: FieldArrayPath<T>
}
export const AgGridTable = <T extends object>({
  form,
  arrayName,
  context,
  ...props
}: AgGridTableProps<T>) => {
  const data = useFieldArray({
    control: form.control,
    name: arrayName
  })

  const rows = useMemo(
    () =>
      data.fields.map((item, rowIndex) => ({
        ...item,
        _originalIndex: rowIndex
      })),
    [data.fields]
  )

  return (
    <FormProvider {...form}>
      <AgGridReact
        enableFilterHandlers
        rowData={rows}
        defaultColDef={defaultColDef}
        context={{
          ...context,
          arrayName
        }}
        {...props}
      />
    </FormProvider>
  )
}

export const TextFilterComponent = ({ model, onModelChange }: CustomFilterProps) => {
  const refInput = useRef<HTMLInputElement>(null)
  const { t } = useTranslation('common')

  const afterGuiAttached = useCallback((params?: IAfterGuiAttachedParams) => {
    if (!params || !params.suppressFocus) {
      refInput.current?.focus()
    }
  }, [])

  useGridFilterDisplay({
    afterGuiAttached
  })

  return (
    <div className="p-2 flex flex-col gap-2">
      <label className="text-xs font-medium text-gray-600">{t('filter_label')}</label>
      <Input
        ref={refInput}
        type="text"
        placeholder={t('filter_placeholder')}
        value={model || ''}
        onChange={(e) => onModelChange(e.target.value)}
        className="h-8"
      />
    </div>
  )
}
const defaultColDef: ColDef = {
  sortable: false,
  valueParser: (params) => params.newValue
}
