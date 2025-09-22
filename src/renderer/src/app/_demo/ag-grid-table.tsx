import { memo, useMemo } from 'react'

import { AllCommunityModule, type ColDef, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'
import {
  type FieldArrayPath,
  FormProvider,
  type UseFormReturn,
  useFieldArray
} from 'react-hook-form'

ModuleRegistry.registerModules([AllCommunityModule])

export interface AgGridTableProps<T extends object> extends AgGridReactProps {
  form: UseFormReturn<T>
  arrayName: FieldArrayPath<T>
}
export const AgGridTable = memo(
  <T extends object>({ form, arrayName, ...props }: AgGridTableProps<T>) => {
    const data = useFieldArray({
      control: form.control,
      name: arrayName
    })

    const context = useMemo(
      () => ({
        arrayName,
        ...props.context
      }),
      [arrayName, props.context]
    )

    return (
      <FormProvider {...form}>
        <AgGridReact
          rowData={data.fields}
          defaultColDef={defaultColDef}
          context={context}
          {...props}
        />
      </FormProvider>
    )
  }
) as <T extends object>(props: AgGridTableProps<T>) => JSX.Element

const defaultColDef: ColDef = {
  sortable: false,
  valueParser: (params) => params.newValue
}
