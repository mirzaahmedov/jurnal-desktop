import { SelectField } from '@renderer/common/components'
import { FormField } from '@renderer/common/components/ui/form'
import { withForm } from '@renderer/common/hoc'
import { RectangleHorizontal, RectangleVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export enum DocumentOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

export const DocumentOrientationFields = withForm<{
  orientation: DocumentOrientation
}>(({ form }) => {
  const { t } = useTranslation()
  return (
    <FormField
      control={form.control}
      name="orientation"
      render={({ field }) => (
        <SelectField
          {...field}
          onValueChange={field.onChange}
          getOptionValue={(o) => o.value}
          getOptionLabel={(o) => o.label}
          options={[
            {
              value: DocumentOrientation.LANDSCAPE,
              label: (
                <div className="flex items-center gap-1 font-medium text-slate-700">
                  <RectangleHorizontal className="size-4" />
                  <span className="text-xs">{t('landscape')}</span>
                </div>
              )
            },
            {
              value: DocumentOrientation.PORTRAIT,
              label: (
                <div className="flex items-center gap-1 font-medium text-slate-700">
                  <RectangleVertical className="size-4" />
                  <span className="text-xs">{t('portrait')}</span>
                </div>
              )
            }
          ]}
          triggerClassName="w-40"
        />
      )}
    />
  )
})
