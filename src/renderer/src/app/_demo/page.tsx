import { DataGrid } from '@mui/x-data-grid'
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'

import { NumericInput } from '@/common/components'

const DemoPage = () => {
  const form = useForm<{
    children: {
      age: number
      name: string
      workplace: string
    }[]
  }>({
    defaultValues: {
      children: [
        {
          age: 1,
          name: '',
          workplace: ''
        }
      ]
    }
  })
  const fields = useFieldArray({
    control: form.control,
    name: 'children'
  })

  return (
    <FormProvider {...form}>
      <DataGrid
        rows={fields.fields}
        columns={[
          {
            field: 'age',
            renderCell: (params) => {
              const form = useFormContext()
              console.log({ params })
              return (
                <Controller
                  control={form.control}
                  name={`children.${params.id}.age`}
                  render={({ field }) => (
                    <NumericInput
                      ref={field.ref}
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              )
            }
          }
        ]}
      />
    </FormProvider>
  )
}

export default DemoPage
