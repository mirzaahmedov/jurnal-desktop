import type { FormEditableFieldsComponent } from './types'
import type { ApiResponse } from '@/common/models'
import type { Control } from 'react-hook-form'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Combobox } from '@/common/components'
import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useRequisitesStore } from '@/common/features/requisites'
import { http } from '@/common/lib/http'
import { cn } from '@/common/lib/utils'

type RequiredManagementFields = {
  rukovoditel?: string | null
  glav_buxgalter?: string | null
}

export const ManagementFields: FormEditableFieldsComponent<RequiredManagementFields> = ({
  tabIndex,
  name,
  form,
  disabled,
  containerProps = {},
  ...props
}) => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { t } = useTranslation()

  const { data: fioList, isFetching } = useQuery({
    queryKey: ['management/fio', main_schet_id],
    queryFn: async () => {
      const response = await http.get<
        ApiResponse<{
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
    <Fieldset
      {...props}
      name={name ?? t('podpis')}
    >
      <div
        {...containerProps}
        className={cn('flex items-center gap-5 flex-wrap', containerProps?.className)}
      >
        <FormField
          name="rukovoditel"
          control={form.control as unknown as Control<RequiredManagementFields>}
          render={({ field }) => (
            <FormElement
              label={t('director')}
              className="w-full flex-1"
            >
              <Combobox
                loading={isFetching}
                options={
                  Array.isArray(fioList?.data?.rukovoditel)
                    ? fioList.data.rukovoditel.filter(Boolean)
                    : []
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

        <FormField
          name="glav_buxgalter"
          control={form.control as unknown as Control<RequiredManagementFields>}
          render={({ field }) => (
            <FormElement
              label={t('main_accountant')}
              className="flex-1 w-full"
            >
              <Combobox
                loading={isFetching}
                options={
                  Array.isArray(fioList?.data?.glav_buxgalter)
                    ? fioList.data.glav_buxgalter.filter(Boolean)
                    : []
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
    </Fieldset>
  )
}
