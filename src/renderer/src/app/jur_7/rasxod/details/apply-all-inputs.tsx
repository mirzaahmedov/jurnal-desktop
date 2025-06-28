import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { SchetEditor } from '@/common/components/editable-table/editors'
import { Button } from '@/common/components/jolly/button'

const defaultValues = {
  schet: ''
}

export interface ApplyAllInputsProps {
  onApply: (values: typeof defaultValues) => void
}
export const ApplyAllInputs = ({ onApply }: ApplyAllInputsProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues
  })

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onApply)}
        className="flex items-center gap-2"
      >
        <Controller
          control={form.control}
          name="schet"
          render={({ field }) => (
            <SchetEditor
              editor={false}
              error={undefined}
              value={field.value}
              onChange={field.onChange}
              tabIndex={-1}
              placeholder={t('schet')}
              className="w-24"
            />
          )}
        />
        <Button type="submit">{t('apply_to_all_inputs')}</Button>
      </form>
    </div>
  )
}
