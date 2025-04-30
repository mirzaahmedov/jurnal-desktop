import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { SchetEditor, SubSchetEditor } from '@/common/components/editable-table/editors'
import { Button } from '@/common/components/jolly/button'

const defaultValues = {
  schet: '',
  sub_schet: ''
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
              value={field.value}
              onChange={(value) => {
                field.onChange(value)
                form.setValue('sub_schet', '')
              }}
              tabIndex={-1}
              inputProps={{
                placeholder: t('schet')
              }}
            />
          )}
        />
        <Controller
          control={form.control}
          name="sub_schet"
          render={({ field }) => (
            <SubSchetEditor
              editor={false}
              schet={form.watch('schet')}
              value={field.value}
              onChange={field.onChange}
              tabIndex={-1}
              inputProps={{
                placeholder: t('subschet')
              }}
            />
          )}
        />
        <Button type="submit">{t('apply_to_all_inputs')}</Button>
      </form>
    </div>
  )
}
