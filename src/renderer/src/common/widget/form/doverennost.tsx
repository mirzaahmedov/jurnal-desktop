import type { FormEditableFieldsComponent } from '@/common/widget/form'
import type { Control } from 'react-hook-form'

import { useTranslation } from 'react-i18next'

import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

type RequiredDoverennostFields = {
  doverennost?: string
}

const DoverennostFields: FormEditableFieldsComponent<RequiredDoverennostFields> = ({
  tabIndex,
  form,
  disabled
}) => {
  const { t } = useTranslation()
  return (
    <FormField
      name="doverennost"
      control={form.control as unknown as Control<RequiredDoverennostFields>}
      render={({ field }) => (
        <FormElement
          label={t('dovernost')}
          className="flex-1"
          error={!!form.formState.errors.doverennost}
        >
          <Input
            tabIndex={tabIndex}
            disabled={disabled}
            {...field}
          />
        </FormElement>
      )}
    />
  )
}

export { DoverennostFields }
