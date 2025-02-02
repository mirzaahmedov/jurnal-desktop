import type { FormEditableFieldsComponent } from '@/common/widget/form'

import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useQuery } from '@tanstack/react-query'
import { Control } from 'react-hook-form'

import { Combobox } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { http } from '@/common/lib/http'
import { Response } from '@/common/models'

type RequiredManagementFields = {
  rukovoditel?: string | null
  glav_buxgalter?: string | null
}

const ManagementFields: FormEditableFieldsComponent<RequiredManagementFields> = ({
  tabIndex,
  form,
  disabled
}) => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { data: fioList, isFetching } = useQuery({
    queryKey: ['management/fio', main_schet_id],
    queryFn: async () => {
      const response = await http.get<
        Response<{
          glav_buxgalter: string[]
          rukovoditel: string[]
        }>
      >('bank/expense/fio', {
        params: {
          main_schet_id
        }
      })
      return response.data
    }
  })

  return (
    <div className="space-y-4">
      <FormField
        name="rukovoditel"
        control={form.control as unknown as Control<RequiredManagementFields>}
        render={({ field }) => (
          <FormElement
            label="Руководитель"
            grid="2:5"
          >
            <Combobox
              loading={isFetching}
              options={Array.isArray(fioList?.data?.rukovoditel) ? fioList.data.rukovoditel : []}
              value={field.value ?? ''}
              onChange={field.onChange}
            >
              <Input
                {...field}
                tabIndex={tabIndex}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(!e.target.value ? null : e.target.value)}
                onKeyUp={(e) => {
                  e.preventDefault()
                }}
                disabled={disabled}
              />
            </Combobox>
          </FormElement>
        )}
      />

      <FormField
        name="glav_buxgalter"
        control={form.control as unknown as Control<RequiredManagementFields>}
        render={({ field }) => (
          <FormElement
            label="Глав Бухгалтер"
            grid="2:5"
          >
            <Combobox
              loading={isFetching}
              options={
                Array.isArray(fioList?.data?.glav_buxgalter) ? fioList.data.glav_buxgalter : []
              }
              value={field.value ?? ''}
              onChange={field.onChange}
            >
              <Input
                {...field}
                tabIndex={tabIndex}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(!e.target.value ? null : e.target.value)}
                onKeyUp={(e) => {
                  e.preventDefault()
                }}
                disabled={disabled}
              />
            </Combobox>
          </FormElement>
        )}
      />
    </div>
  )
}

export { ManagementFields }
